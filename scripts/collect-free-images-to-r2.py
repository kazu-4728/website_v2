import os
import json
import pathlib
import tempfile
import time
import urllib.request
import urllib.parse
from urllib.error import HTTPError

try:
    import boto3
except ImportError as exc:
    raise SystemExit('boto3 is required. Install it with: python -m pip install boto3') from exc

ROOT = pathlib.Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / 'data' / 'onsen-catalog.json'
MASTER_PATH = ROOT / 'data' / 'onsen-image-master.json'
R2_MAP_PATH = ROOT / 'data' / 'r2-image-map.json'
AUDIT_PATH = ROOT / 'data' / 'api-image-audit.json'
ENV_FILES = [ROOT / '.env', ROOT / '.env.local', ROOT / '.env.production']
PUBLIC_URL_DEFAULT = 'https://pub-72216527b14041d8bc0753066eb25b90.r2.dev'
USER_AGENT = 'OnsenFreeImageCollector/2.2'
MAX_PEXELS = 12
MAX_PIXABAY = 8
MAX_UNSPLASH = 4
PER_REQUEST_SLEEP = 1.2

BATH_KEYWORDS = [
    'open-air bath', 'outdoor bath', 'public bath', 'bathhouse', 'foot bath', 'rotenburo', 'rotemburo',
    'yubatake', 'spa hotel', '露天風呂', '露天', '共同浴場', '浴場', '浴槽', '湯船', '足湯', '湯畑', '源泉', '外湯', '内湯', 'の湯'
]
AREA_KEYWORDS = ['onsen', 'hot spring', '温泉', '湯本', '湯元', '温泉街', '源泉']
NEGATIVE_KEYWORDS = [
    'train', 'railway', 'station', 'tram', 'shrine', 'temple', 'garden', 'parade', 'disney',
    'tea', 'cup', 'coast', 'coastline', 'beach', 'lake', 'mountain', 'forest', 'waterfall', 'falls',
    'sea world', 'aquarium', 'museum', 'park', 'torii', 'dam', 'bridge', 'ropeway', 'cable car',
    'bus', 'downtown', 'cityscape', 'street', 'festival', 'market', 'food', 'meal', 'china',
    'guangdong', 'turkey', 'pamukkale', 'animal', 'monkey', 'wild animals', 'snow monkey',
    '神社', '寺', '庭園', '海', '湖', '山', '滝', '列車', '駅', '水族館', '美術館', '公園', '海岸', '朝市', '鳥居', '猿'
]


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


def fetch_json(url: str, headers=None):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT, **(headers or {})})
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read().decode('utf-8'))


def download_file(url: str, destination: pathlib.Path):
    request = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
    with urllib.request.urlopen(request) as response, open(destination, 'wb') as file:
        file.write(response.read())


def infer_extension(url: str) -> str:
    lower = url.lower()
    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
        if ext in lower:
            return '.jpg' if ext == '.jpeg' else ext
    return '.jpg'


def build_queries(entry):
    name = entry.get('name', '')
    name_en = entry.get('nameEn', '')
    location = entry.get('location', '')
    return [
        ' '.join(part for part in [name, '温泉', '露天風呂'] if part),
        ' '.join(part for part in [name, '温泉', '浴場'] if part),
        ' '.join(part for part in [name_en, 'onsen', 'open air bath', 'japan'] if part),
        ' '.join(part for part in [location, name_en, 'hot spring bath'] if part),
    ]


def normalize_text(*parts):
    return ' '.join(part for part in parts if part).replace('_', ' ').replace('/', ' ').replace('-', ' ').lower()


def location_tokens(entry):
    tokens = [entry.get('slug', ''), entry.get('name', ''), entry.get('nameEn', ''), entry.get('location', ''), entry.get('region', '')]
    return [normalize_text(token).strip() for token in tokens if normalize_text(token).strip() and len(normalize_text(token).strip()) >= 3]


def matches_location(entry, *parts):
    text = normalize_text(*parts)
    return any(token in text for token in location_tokens(entry))


def classify_text(entry, *parts):
    text = normalize_text(*parts)
    has_bath = any(keyword in text for keyword in BATH_KEYWORDS)
    has_area = any(keyword in text for keyword in AREA_KEYWORDS)
    has_negative = any(keyword in text for keyword in NEGATIVE_KEYWORDS)
    if not matches_location(entry, *parts):
        return 'reject'
    if has_negative and not has_bath:
        return 'reject'
    if has_bath:
        return 'bath'
    if has_area:
        return 'onsen-area'
    return 'reject'


def score_text(text: str, entry, source_url: str = '') -> int:
    classification = classify_text(entry, text or '', source_url or '')
    if classification != 'bath':
        return -1

    text_lower = normalize_text(text or '', source_url or '')
    score = 10
    for token in location_tokens(entry):
        if token in text_lower:
            score += 3
    for keyword in BATH_KEYWORDS:
        keyword_lower = keyword.lower()
        if keyword_lower in text_lower:
            score += 2
    return score


def best_result(results, entry, title_key, image_url_resolver, source_url_key, credit_key, license_label, provider):
    best = None
    best_score = -1
    for result in results:
        image_url = image_url_resolver(result)
        if not image_url:
            continue
        title = result.get(title_key) or ''
        source_url = result.get(source_url_key) or ''
        score = score_text(title, entry, source_url)
        if score > best_score:
            best_score = score
            best = {
                'provider': provider,
                'download_url': image_url,
                'source_url': source_url,
                'credit': result.get(credit_key, 'Unknown'),
                'license': license_label,
                'title': title,
                'score': score,
            }
    return best if best_score >= 0 else None


def search_pexels(entry):
    api_key = os.environ.get('PEXELS_API_KEY')
    if not api_key:
        return None
    for query in build_queries(entry)[:2]:
        url = f'https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page=6&orientation=landscape'
        data = fetch_json(url, headers={'Authorization': api_key})
        photos = data.get('photos', [])
        best = best_result(
            photos,
            entry,
            'alt',
            lambda photo: photo.get('src', {}).get('large') or photo.get('src', {}).get('original'),
            'url',
            'photographer',
            'Pexels License',
            'pexels',
        )
        time.sleep(PER_REQUEST_SLEEP)
        if best:
            return best
    return None


def search_pixabay(entry):
    api_key = os.environ.get('PIXABAY_API_KEY')
    if not api_key:
        return None
    for query in build_queries(entry)[:2]:
        url = f'https://pixabay.com/api/?key={api_key}&q={urllib.parse.quote(query)}&image_type=photo&per_page=6'
        data = fetch_json(url)
        hits = data.get('hits', [])
        best = best_result(hits, entry, 'tags', lambda hit: hit.get('largeImageURL'), 'pageURL', 'user', 'Pixabay License', 'pixabay')
        time.sleep(PER_REQUEST_SLEEP)
        if best:
            return best
    return None


def search_unsplash(entry):
    api_key = os.environ.get('UNSPLASH_ACCESS_KEY')
    if not api_key:
        return None
    query = build_queries(entry)[2]
    url = f'https://api.unsplash.com/search/photos?query={urllib.parse.quote(query)}&per_page=6&orientation=landscape'
    data = fetch_json(url, headers={'Authorization': f'Client-ID {api_key}'})
    results = []
    for image in data.get('results', []):
        results.append({
            'alt_description': image.get('alt_description') or '',
            'regular': image.get('urls', {}).get('regular'),
            'html': image.get('links', {}).get('html'),
            'name': image.get('user', {}).get('name', 'Unknown'),
        })
    best = best_result(results, entry, 'alt_description', lambda image: image.get('regular'), 'html', 'name', 'Unsplash License', 'unsplash')
    time.sleep(PER_REQUEST_SLEEP)
    return best


def upload_to_r2(local_path: pathlib.Path, object_key: str, s3, bucket_name: str, public_url_base: str):
    s3.upload_file(str(local_path), bucket_name, object_key)
    return f'{public_url_base}/{object_key}'


def current_focus(slug, master, r2_map, entry):
    existing = r2_map.get(slug, {}).get('hero')
    if isinstance(existing, dict):
        return classify_text(entry, existing.get('title', ''), existing.get('sourceUrl', ''))
    master_entry = master.get(slug, {}).get('hero') or {}
    return classify_text(entry, master_entry.get('alt', ''), master_entry.get('url', ''))


def main():
    load_env()
    catalog = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))
    master = json.loads(MASTER_PATH.read_text(encoding='utf-8'))
    r2_map = json.loads(R2_MAP_PATH.read_text(encoding='utf-8')) if R2_MAP_PATH.exists() else {}
    audit = json.loads(AUDIT_PATH.read_text(encoding='utf-8')) if AUDIT_PATH.exists() else {}

    account_id = os.environ.get('R2_ACCOUNT_ID')
    access_key_id = os.environ.get('R2_ACCESS_KEY_ID')
    secret_access_key = os.environ.get('R2_SECRET_ACCESS_KEY')
    bucket_name = os.environ.get('R2_BUCKET_NAME')
    public_url_base = os.environ.get('R2_PUBLIC_URL_BASE', PUBLIC_URL_DEFAULT).rstrip('/')
    if not all([account_id, access_key_id, secret_access_key, bucket_name]):
        raise SystemExit('Missing R2 credentials')

    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
    )

    request_counts = {'pexels': 0, 'pixabay': 0, 'unsplash': 0}

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_dir_path = pathlib.Path(temp_dir)
        for slug, entry in catalog.items():
            if current_focus(slug, master, r2_map, entry) == 'bath':
                audit[slug] = {'status': 'skipped', 'reason': 'existing-bath-photo'}
                continue

            chosen = None
            try:
                if request_counts['pexels'] < MAX_PEXELS:
                    request_counts['pexels'] += 1
                    chosen = search_pexels(entry)
                if not chosen and request_counts['pixabay'] < MAX_PIXABAY:
                    request_counts['pixabay'] += 1
                    chosen = search_pixabay(entry)
                if not chosen and request_counts['unsplash'] < MAX_UNSPLASH:
                    request_counts['unsplash'] += 1
                    chosen = search_unsplash(entry)
            except HTTPError as exc:
                audit[slug] = {'status': 'search_failed', 'error': f'{exc.code} {exc.reason}'}
                continue
            except Exception as exc:
                audit[slug] = {'status': 'search_failed', 'error': str(exc)}
                continue

            if not chosen:
                audit[slug] = {'status': 'no_bath_candidate'}
                continue

            try:
                ext = infer_extension(chosen['download_url'])
                local_path = temp_dir_path / f'{slug}-hero{ext}'
                download_file(chosen['download_url'], local_path)
                object_key = f'onsen/{slug}/hero-api{ext}'
                public_url = upload_to_r2(local_path, object_key, s3, bucket_name, public_url_base)
                r2_map.setdefault(slug, {})['hero'] = {
                    'url': public_url,
                    'source': chosen['provider'],
                    'credit': chosen['credit'],
                    'license': chosen['license'],
                    'sourceUrl': chosen['source_url'],
                    'title': chosen['title'],
                }
                audit[slug] = {'status': 'uploaded', **r2_map[slug]['hero']}
                print(f'Uploaded bath image for {slug}: {public_url}')
            except Exception as exc:
                audit[slug] = {'status': 'upload_failed', 'error': str(exc), 'provider': chosen['provider']}

    R2_MAP_PATH.write_text(json.dumps(r2_map, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    AUDIT_PATH.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('Updated R2 map and audit report.')
    print(f'Requests used: {request_counts}')


if __name__ == '__main__':
    main()
