# Compresses the route photos fetched by fetch-route-photos.mjs.
#
#   python scripts/optimize-route-photos.py
#
# Commons hands back 1600px originals of ~600 KB each — 24 MB across 41 routes,
# and the hero photo is the LCP element on every route page. This crops each to
# a 16:9 hero shape, resizes to 1600px, strips EXIF and re-encodes progressive
# JPEG. Idempotent: safe to re-run.

from PIL import Image, ImageOps
import os, glob

W, RATIO, QUALITY = 1600, 16 / 9, 78
DIR = os.path.join("public", "assets", "routes")

before = after = 0
for path in sorted(glob.glob(os.path.join(DIR, "*.jpg"))):
    before += os.path.getsize(path)
    im = Image.open(path)
    im = ImageOps.exif_transpose(im).convert("RGB")

    # Centre-crop to 16:9, then resize. Heroes are wide; letterboxing a 4:3
    # photo into them would show bars or crop unpredictably in CSS.
    w, h = im.size
    if w / h > RATIO:
        new_w = int(h * RATIO)
        im = im.crop(((w - new_w) // 2, 0, (w - new_w) // 2 + new_w, h))
    else:
        new_h = int(w / RATIO)
        top = int((h - new_h) * 0.35)  # bias upward: skylines beat pavements
        im = im.crop((0, top, w, top + new_h))

    if im.width > W:
        im = im.resize((W, int(W / RATIO)), Image.LANCZOS)

    im.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    after += os.path.getsize(path)

n = len(glob.glob(os.path.join(DIR, "*.jpg")))
print(f"{n} photos: {before // 1048576} MB -> {after // 1048576} MB "
      f"(avg {after // max(n, 1) // 1024} KB)")
