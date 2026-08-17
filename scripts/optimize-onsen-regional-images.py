from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ASSET_ROOT = ROOT / 'public' / 'images' / 'regions'
MAX_WIDTH = 1920
QUALITY = 84

for source in sorted(ASSET_ROOT.glob('**/*')):
    if source.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
        continue
    original_size = source.stat().st_size
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        if image.width > MAX_WIDTH:
            height = round(image.height * MAX_WIDTH / image.width)
            image = image.resize((MAX_WIDTH, height), Image.Resampling.LANCZOS)
        image.save(source, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    print(f'{source.relative_to(ROOT)}: {original_size // 1024}KB -> {source.stat().st_size // 1024}KB')
