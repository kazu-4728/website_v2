import os
import json
import pathlib
import site
import sys
import tempfile
import time
import urllib.request
from urllib.parse import urlencode

ROOT = pathlib.Path(__file__).resolve().parent.parent
USER_SITE = site.getusersitepackages()
VENDOR_SITE = ROOT / '.python-vendor'

for candidate in (str(VENDOR_SITE), USER_SITE):
    if candidate and candidate not in sys.path:
        sys.path.append(candidate)

try:
    import boto3
except ImportError as exc:
    raise SystemExit('boto3 is required. Install it with: python -m pip install boto3') from exc
ENV_FILES = [ROOT / '.env', ROOT / '.env.local', ROOT / '.env.production']
CONTENT_DIR = ROOT / 'content' / 'onsen'
PUBLIC_URL_DEFAULT = 'https://pub-72216527b14041d8bc0753066eb25b90.r2.dev'
USER_AGENT = 'OnsenSpotPhotoSync/1.0'


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


def fetch_bytes(url: str, headers=None):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, **(headers or {})})
    with urllib.request.urlopen(request) as response:
        return response.read(), response.headers.get_content_type()


def guess_extension(content_type: str):
    if content_type == 'image/png':
        return '.png'
    if content_type == 'image/webp':
        return '.webp'
    return '.jpg'


def upload_to_r2(local_path: pathlib.Path, object_key: str, s3, bucket_name: str, public_url_base: str):
    s3.upload_file(str(local_path), bucket_name, object_key)
    return f'{public_url_base}/{object_key}'


def build_photo_media_url(place_id: str, photo_name: str, api_key: str):
    query = urlencode({'maxWidthPx': 1400, 'key': api_key})
    return f'https://places.googleapis.com/v1/{photo_name}/media?{query}'


def iter_content_files():
    for file_path in sorted(CONTENT_DIR.glob('*.json')):
        if file_path.name == 'index.json':
            continue
        yield file_path


def main():
    load_env()
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY') or os.environ.get('GOOGLE_PLACES_API_KEY')
    account_id = os.environ.get('R2_ACCOUNT_ID')
    access_key_id = os.environ.get('R2_ACCESS_KEY_ID')
    secret_access_key = os.environ.get('R2_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('R2_BUCKET_NAME')
    public_url_base = os.environ.get('R2_PUBLIC_URL_BASE', PUBLIC_URL_DEFAULT).rstrip('/')

    if not api_key:
        raise SystemExit('GOOGLE_MAPS_API_KEY or GOOGLE_PLACES_API_KEY is required')
    if not all([account_id, access_key_id, secret_access_key, bucket_name]):
        raise SystemExit('Missing R2 credentials')

    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
    )

    updated = 0

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = pathlib.Path(temp_dir)
        for file_path in iter_content_files():
            content = json.loads(file_path.read_text(encoding='utf-8'))
            changed = False
            for spot in content.get('onsenSpots', []):
                if spot.get('imageSourceType') != 'google-place' or not spot.get('placeId'):
                    continue
                photo_name = spot.get('placePhotoName')
                if not photo_name:
                    continue
                media_url = build_photo_media_url(spot['placeId'], photo_name, api_key)
                image_bytes, content_type = fetch_bytes(media_url, headers={'X-Goog-Api-Key': api_key})
                extension = guess_extension(content_type)
                local_path = temp_dir_path / f"{content['identity']['slug']}-{spot['slug']}{extension}"
                local_path.write_bytes(image_bytes)
                object_key = f"onsen-spots/{content['identity']['slug']}/{spot['slug']}{extension}"
                spot['photoUrl'] = upload_to_r2(local_path, object_key, s3, bucket_name, public_url_base)
                spot['photoStatus'] = 'verified'
                changed = True
                updated += 1
                time.sleep(0.4)
            if changed:
                file_path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

    print(f'Uploaded {updated} spot photos to R2.')


if __name__ == '__main__':
    main()
