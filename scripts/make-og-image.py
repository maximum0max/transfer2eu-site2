# Generates public/assets/og-image.jpg — the 1200x630 card used by every page's
# Open Graph / Twitter tags and by the Organization + NewsArticle structured
# data. It was referenced everywhere but had never actually been shipped, so it
# 404'd and Google flagged the structured data image as missing.
#
#   python scripts/make-og-image.py
#
# Colours come from colors_and_type.css (--t2-blue-500 / --t2-blue-100).

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
DEEP  = (42, 90, 143)    # --t2-blue-press #2A5A8F
BLUE  = (75, 137, 200)   # --t2-blue-500   #4B89C8
TINT  = (205, 232, 255)  # --t2-blue-100   #CDE8FF
WHITE = (255, 255, 255)

FONTS = "C:/Windows/Fonts"

def font(name, size):
    for candidate in (os.path.join(FONTS, name), f"/usr/share/fonts/truetype/dejavu/{name}"):
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()

bold = lambda s: font("arialbd.ttf", s)
reg  = lambda s: font("arial.ttf", s)

img = Image.new("RGB", (W, H), BLUE)
d = ImageDraw.Draw(img)

# Diagonal gradient, deep -> brand blue.
for y in range(H):
    for_x = y / H
    for x in range(0, W, 4):
        t = (for_x * 0.65) + (x / W) * 0.35
        d.rectangle(
            [x, y, x + 4, y + 1],
            fill=tuple(int(DEEP[i] + (BLUE[i] - DEEP[i]) * t) for i in range(3)),
        )

# Wordmark
d.text((72, 64), "Transfer2EU", font=bold(40), fill=WHITE)
d.rectangle([72, 122, 138, 128], fill=TINT)

# Headline — 60px keeps the longest line clear of the price badge on the right.
d.text((72, 196), "Трансфер из аэропорта", font=bold(60), fill=WHITE)
d.text((72, 266), "Аликанте (ALC)", font=bold(60), fill=WHITE)

# Subtitle
d.text((72, 372), "Costa Blanca · Мурсия · Валенсия", font=reg(34), fill=TINT)

# Feature row
feats = ["Фиксированная цена", "Русскоязычный водитель", "24/7"]
x = 72
f = reg(26)
for i, text in enumerate(feats):
    w = d.textlength(text, font=f)
    d.rounded_rectangle([x, 452, x + w + 44, 508], radius=28, outline=TINT, width=2)
    d.text((x + 22, 466), text, font=f, fill=WHITE)
    x += w + 44 + 16

# Price badge
badge_w, badge_h = 250, 250
bx, by = W - badge_w - 72, (H - badge_h) // 2 - 10
d.ellipse([bx, by, bx + badge_w, by + badge_h], fill=WHITE)
label, price = "от", "25€"
lf, pf = reg(32), bold(78)
d.text((bx + (badge_w - d.textlength(label, font=lf)) / 2, by + 62), label, font=lf, fill=BLUE)
d.text((bx + (badge_w - d.textlength(price, font=pf)) / 2, by + 104), price, font=pf, fill=DEEP)

out = os.path.join("public", "assets", "og-image.jpg")
img.save(out, "JPEG", quality=88, optimize=True)
print(f"wrote {out} ({W}x{H}, {os.path.getsize(out) // 1024} KB)")
