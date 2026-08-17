from __future__ import annotations

import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "data" / "onsen-image-manifest.json"
MAX_WIDTH = 1920

with MANIFEST.open(encoding="utf-8") as handle:
    manifest = json.load(handle)

optimized = 0
skipped = 0
for asset in manifest.get("assets", []):
    if asset.get("status") != "approved" or asset.get("role") != "hero":
        continue
    local_path = ROOT / "public" / asset["localPath"].lstrip("/")
    try:
        with Image.open(local_path) as image:
            image = ImageOps.exif_transpose(image)
            if image.width > MAX_WIDTH:
                image = image.resize((MAX_WIDTH, round(image.height * MAX_WIDTH / image.width)), Image.Resampling.LANCZOS)
            suffix = local_path.suffix.lower()
            if suffix in {".jpg", ".jpeg"}:
                if image.mode not in {"RGB", "L"}:
                    image = image.convert("RGB")
                image.save(local_path, "JPEG", quality=84, optimize=True, progressive=True)
            elif suffix == ".png":
                image.save(local_path, "PNG", optimize=True)
            elif suffix == ".webp":
                if image.mode not in {"RGB", "RGBA"}:
                    image = image.convert("RGB")
                image.save(local_path, "WEBP", quality=84, method=6)
            else:
                raise ValueError(f"Unsupported extension: {suffix}")
        optimized += 1
        print(f"optimized {asset['onsenSlug']}: {local_path.relative_to(ROOT)}")
    except Exception as error:
        skipped += 1
        print(f"FAILED {asset['onsenSlug']}: {error}")

if skipped:
    raise SystemExit(f"Image optimization failed for {skipped} assets.")
print(f"Optimized {optimized} direct onsen images.")
