import os
import json
import pathlib
import tempfile
import urllib.request
from urllib.parse import urlparse

try:
    import boto3
except ImportError as exc:
    raise SystemExit('boto3 is required. Install it with: python -m pip install boto3') from exc

ROOT = pathlib.Path(__file__).resolve().parent.parent
MASTER_PATH = ROOT / 'data' / 'onsen-image-master.json'
OUTPUT_PATH = ROOT / 'data' / 'r2-image-map.json'
ENV_FILES = [ROOT / '.env', ROOT / '.env.local', ROOT / '.env.production']


def load_env():
    for env_file in ENV_FILES:
        if not env_file.exists():
            continue
        for raw_line in env_file.read_text(encoding='utf-8').splitlines():
            line = raw_line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            if key and key not in os.environ:
                os.environ[key] = value.strip().strip('"').strip("'")


def normalize_url(url: str) -> str:
    return url.replace('/thumb/thumb/', '/thumb/').replace('/800px-1920px-', '/800px-').replace('/800px-1280px-', '/800px-')


def infer_extension(url: str) -> str:
    path = urlparse(url).path.lower()
    for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        if path.endswith(ext):
            return ext
    return '.jpg'


def download_file(url: str, destination: pathlib.Path):
    request = urllib.request.Request(normalize_url(url), headers={'User-Agent': 'OnsenImageSync/1.0'})
    with urllib.request.urlopen(request) as response, open(destination, 'wb') as file:
        file.write(response.read())


def main():
    load_env()
    account_id = os.environ.get('R2_ACCOUNT_ID')
    access_key_id = os.environ.get('R2_ACCESS_KEY_ID')
    secret_access_key = os.environ.get('R2_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('R2_BUCKET_NAME')
    public_url_base = os.environ.get('R2_PUBLIC_URL_BASE', 'https://pub-72216527b14041d8bc0753066eb25b90.r2.dev').rstrip('/')

    if not all([account_id, access_key_id, secret_access_key, bucket_name]):
        raise SystemExit('Missing R2 credentials in environment files.')

    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
    )

    master = json.loads(MASTER_PATH.read_text(encoding='utf-8'))
    uploaded = {}
    failures = []

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = pathlib.Path(temp_dir)
        for slug, image_entry in master.items():
            uploaded[slug] = {}
            for variant in ['hero', 'thumbnail']:
                payload = image_entry.get(variant)
                if not payload or not payload.get('url'):
                    continue
                try:
                    url = normalize_url(payload['url'])
                    ext = infer_extension(url)
                    local_path = temp_dir_path / f'{slug}-{variant}{ext}'
                    download_file(url, local_path)
                    object_key = f'onsen/{slug}/{variant}{ext}'
                    s3.upload_file(str(local_path), bucket_name, object_key)
                    uploaded[slug][variant] = f'{public_url_base}/{object_key}'
                    print(f'Uploaded {slug}:{variant} -> {uploaded[slug][variant]}')
                except Exception as exc:
                    failures.append({'slug': slug, 'variant': variant, 'url': payload['url'], 'error': str(exc)})
                    print(f'Skipped {slug}:{variant} -> {exc}')

    OUTPUT_PATH.write_text(json.dumps(uploaded, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    if failures:
        failure_path = ROOT / 'data' / 'r2-image-failures.json'
        failure_path.write_text(json.dumps(failures, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Wrote failure report to {failure_path}')
    print(f'Wrote {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
