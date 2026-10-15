#!/usr/bin/env python3
# Generates the 7 missing Hunt-for-Wisps story illustrations in the game's
# visual language: indigo night sky, warm lantern glows, fireflies, paper grain.
# PIL-only, deterministic (seeded), no text rendered.
import math, random
from PIL import Image, ImageDraw, ImageFilter

W = H = 900
ASSETS = r"C:/Users/zqmco/zqmlabs-site-gh/static/games/hunt-for-wisps/play/assets"

SKY_TOP = (15, 20, 44)
SKY_BOT = (46, 60, 112)
MOON = (245, 239, 216)
LANTERN = (255, 179, 71)
LANTERN_HOT = (255, 214, 130)
INK = (10, 12, 26)
FIREFLY = (255, 226, 150)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def canvas(seed):
    rnd = random.Random(seed)
    img = Image.new("RGBA", (W, H), SKY_TOP + (255,))
    d = ImageDraw.Draw(img)
    for y in range(H):
        d.line([(0, y), (W, y)], fill=lerp(SKY_TOP, SKY_BOT, y / H) + (255,))
    return img, d, rnd

def glow(img, cx, cy, r, color, max_alpha=170, blur=None):
    lay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(lay)
    steps = max(10, int(r / 2))
    for i in range(steps, 0, -1):
        rr = r * i / steps
        a = int(max_alpha * (1 - i / steps) ** 1.5)
        ld.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=color + (a,))
    lay = lay.filter(ImageFilter.GaussianBlur(blur or max(2, r * 0.12)))
    img.alpha_composite(lay)

def stars(img, d, rnd, n=90):
    for _ in range(n):
        x, y = rnd.uniform(0, W), rnd.uniform(0, H * 0.55)
        r = rnd.uniform(0.8, 2.2)
        a = rnd.randint(90, 220)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255, a))

def moon(img, cx=W * 0.82, cy=H * 0.16, r=70):
    glow(img, cx, cy, r * 2.6, MOON, max_alpha=60)
    d = ImageDraw.Draw(img)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=MOON + (255,))
    d.ellipse([cx - r * 0.3, cy - r * 0.2, cx + r * 0.1, cy + r * 0.25], fill=(228, 220, 195, 255))

def ground(img, top=H * 0.72, color=(26, 34, 62)):
    d = ImageDraw.Draw(img)
    pts = [(0, top)] + [(x, top - 18 * math.sin(x / 140.0)) for x in range(0, W + 20, 20)] + [(W, H), (0, H)]
    d.polygon(pts, fill=color + (255,))

def fireflies(img, rnd, n=14, ylo=H * 0.45, yhi=H * 0.92):
    for _ in range(n):
        x, y = rnd.uniform(30, W - 30), rnd.uniform(ylo, yhi)
        r = rnd.uniform(3, 6)
        glow(img, x, y, r * 5, FIREFLY, max_alpha=110)
        ImageDraw.Draw(img).ellipse([x - r, y - r, x + r, y + r], fill=FIREFLY + (230,))

def grain_vignette(img):
    noise = Image.effect_noise((W, H), 22).convert("L")
    rgb = Image.merge("RGB", (noise, noise, noise)).convert("RGBA")
    img.alpha_composite(Image.blend(img.convert("RGBA"), rgb, 0.045))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lay)
    for i in range(30, 0, -1):
        a = int(90 * (1 - i / 30) ** 2)
        ld.rectangle([30 - i, 30 - i, W - 30 + i, H - 30 + i], outline=(6, 8, 18, a), width=3)
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(8)))

def pumpkin(d, img, cx, cy, rx, ry, face=True):
    glow(img, cx, cy, rx * 1.9, LANTERN, max_alpha=110)
    d.ellipse([cx - rx * 1.12, cy - ry, cx + rx * 1.12, cy + ry], fill=(146, 62, 20, 255))
    d.ellipse([cx - rx * 0.74, cy - ry * 1.05, cx + rx * 0.74, cy + ry * 1.05], fill=(224, 123, 36, 255))
    d.ellipse([cx - rx * 0.36, cy - ry * 0.9, cx + rx * 0.36, cy + ry * 0.9], fill=(255, 168, 74, 255))
    d.polygon([(cx - 16, cy - ry * 1.02), (cx + 16, cy - ry * 1.02), (cx + 6, cy - ry * 1.3), (cx - 8, cy - ry * 1.28)], fill=(74, 96, 52, 255))
    if face:
        dark = (52, 24, 8, 255)
        ex, ey = rx * 0.42, -ry * 0.28
        d.polygon([(cx - ex - 26, ey + 14), (cx - ex + 26, ey + 14), (cx - ex, ey - 34)], fill=dark)
        d.polygon([(cx + ex - 26, ey + 14), (cx + ex + 26, ey + 14), (cx + ex, ey - 34)], fill=dark)
        my = ry * 0.32
        d.polygon([(cx - rx * 0.5, my - 12), (cx - rx * 0.3, my + 16), (cx - rx * 0.12, my - 8),
                   (cx + rx * 0.12, my + 14), (cx + rx * 0.32, my - 10), (cx + rx * 0.5, my + 14),
                   (cx + rx * 0.36, my + 40), (cx - rx * 0.36, my + 40)], fill=dark)
        glow(img, cx, cy, rx * 0.8, LANTERN_HOT, max_alpha=70)

def save(img, name):
    img = img.convert("RGB")
    path = f"{ASSETS}/{name}"
    img.save(path, "WEBP", quality=82, method=6)
    import os
    print(f"OK {name} {os.path.getsize(path)//1024}KB {img.size}")

# ---------- scene 1: the welcome pumpkin ----------
def scene_pumpkin():
    img, d, rnd = canvas(101)
    stars(img, d, rnd); moon(img)
    d.rectangle([0, H * 0.74, W, H], fill=(43, 30, 22, 255))
    for y in range(int(H * 0.74), H, 34):
        d.line([(0, y), (W, y)], fill=(30, 20, 14, 255))
    for x in range(0, W, 120):
        d.line([(x, H * 0.74), (x, H)], fill=(30, 20, 14, 255))
    x0, x1, sag = 60, W - 60, H * 0.2
    for t_i in range(61):
        t = t_i / 60.0
        x = x0 + (x1 - x0) * t
        y = H * 0.3 + 4 * sag * t * (1 - t) + (W * 0.5 - abs(x - W * 0.5)) * -0.12
        d.line([(x - 1, y), (x + 1, y)], fill=(60, 50, 44, 255))
        if t_i % 5 == 0:
            c = FIREFLY if t_i % 10 == 0 else (120, 220, 210)
            glow(img, x, y + 8, 14, c, max_alpha=120)
            d.ellipse([x - 5, y + 4, x + 5, y + 14], fill=c + (230,))
    pumpkin(d, img, W * 0.5, H * 0.62, 300, 235)
    fireflies(img, rnd)
    grain_vignette(img)
    save(img, "stop-1-pumpkin.webp")

# ---------- scene 2: the whispering oak ----------
def scene_oak():
    img, d, rnd = canvas(102)
    stars(img, d, rnd); moon(img)
    d.polygon([(360, H), (430, H * 0.5), (470, H * 0.5), (540, H)], fill=(52, 38, 26, 255))
    cx, cy = W * 0.5, H * 0.34
    for i in range(16):
        a = i / 16 * 2 * math.pi
        r = rnd.uniform(150, 260)
        x, y = cx + math.cos(a) * r * 1.25, cy + math.sin(a) * r * 0.8
        rr = rnd.uniform(90, 150)
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(24, 44, 36, 255))
    for i in range(10):
        a = i / 10 * 2 * math.pi
        r = rnd.uniform(120, 200)
        x, y = cx + math.cos(a) * r * 1.2, cy + math.sin(a) * r * 0.7 - 14
        rr = rnd.uniform(60, 110)
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(44, 76, 58, 255))
    ey = H * 0.66
    d.arc([430, ey, 462, ey + 26], 200, 340, fill=(110, 82, 52, 255), width=7)
    d.arc([458, ey, 490, ey + 26], 200, 340, fill=(110, 82, 52, 255), width=7)
    d.arc([430, ey + 30, 490, ey + 74], 20, 160, fill=(110, 82, 52, 255), width=7)
    for i, (lx, ly) in enumerate([(300, 300), (430, 260), (560, 290), (660, 330), (250, 350)]):
        d.line([(lx, ly), (lx, ly + 46)], fill=(30, 40, 34, 255), width=3)
        glow(img, lx, ly + 66, 44, LANTERN, max_alpha=150)
        d.ellipse([lx - 18, ly + 50, lx + 18, ly + 84], fill=LANTERN_HOT + (255,))
    ground(img)
    fireflies(img, rnd)
    grain_vignette(img)
    save(img, "stop-2-oak.webp")

# ---------- scene 3: the giggling graveyard ----------
def scene_graveyard():
    img, d, rnd = canvas(103)
    stars(img, d, rnd, 60)
    ground(img, H * 0.68, (30, 38, 66))
    for x in range(20, W, 46):
        d.polygon([(x, H * 0.52), (x + 10, H * 0.52), (x + 10, H * 0.74), (x, H * 0.74)], fill=(16, 20, 38, 255))
        d.polygon([(x, H * 0.52), (x + 10, H * 0.52), (x + 5, H * 0.485)], fill=(16, 20, 38, 255))
    d.rectangle([0, H * 0.52, W, H * 0.57], fill=(16, 20, 38, 255))
    for i, (tx, tilt) in enumerate([(240, -6), (450, 3), (660, -4)]):
        d.polygon([(tx - 60, H * 0.74), (tx - 60, H * 0.5), (tx, H * 0.47), (tx + 60, H * 0.5), (tx + 60, H * 0.74)], fill=(139, 155, 180, 255))
        d.ellipse([tx - 8, H * 0.56, tx + 8, H * 0.62], fill=(40, 52, 74, 255))
        d.arc([tx - 16, H * 0.62, tx + 16, H * 0.7], 20, 160, fill=(40, 52, 74, 255), width=5)
    for px, py in [(345, H * 0.72), (555, H * 0.73)]:
        glow(img, px, py, 90, LANTERN, max_alpha=140)
        d.ellipse([px - 42, py - 34, px + 42, py + 34], fill=(224, 123, 36, 255))
        d.ellipse([px - 22, py - 26, px + 22, py + 26], fill=(255, 168, 74, 255))
        d.polygon([(px - 12, py - 4), (px + 12, py - 4), (px, py + 12)], fill=(52, 24, 8, 255))
        d.polygon([(px - 20, py + 10), (px + 20, py + 10), (px + 14, py + 26), (px - 14, py + 26)], fill=(52, 24, 8, 255))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(lay).ellipse([-100, H * 0.6, W + 100, H * 0.86], fill=(180, 195, 220, 36))
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(30)))
    fireflies(img, rnd, 10)
    grain_vignette(img)
    save(img, "stop-3-graveyard.webp")

# ---------- scene 4: the spider's counting web ----------
def scene_spider():
    img, d, rnd = canvas(104)
    stars(img, d, rnd, 70); moon(img, W * 0.15, H * 0.14, 55)
    cx, cy = W * 0.52, H * 0.4
    for i in range(10):
        a = i / 10 * 2 * math.pi
        d.line([(cx, cy), (cx + math.cos(a) * W, cy + math.sin(a) * W)], fill=(225, 235, 250, 110), width=2)
    for ring in range(1, 6):
        r = ring * 78
        pts = [(cx + math.cos(i / 24 * 2 * math.pi) * r * 1.15, cy + math.sin(i / 24 * 2 * math.pi) * r) for i in range(25)]
        d.line(pts, fill=(225, 235, 250, 110), width=2)
        if ring in (2, 4):
            for i in range(0, 24, 4):
                x, y = pts[i]
                glow(img, x, y, 8, (200, 225, 255), max_alpha=120)
                d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=(235, 245, 255, 230))
    sx, sy = cx - 40, cy + 200
    for side in (-1, 1):
        for k in range(4):
            x0 = sx + side * 40
            y0 = sy - 40 + k * 42
            x1 = sx + side * (150 + k * 26)
            y1 = y0 + (60 if k % 2 == 0 else 90)
            x2 = sx + side * (120 + k * 20)
            y2 = y1 + 46
            d.line([(x0, y0), (x1, y1), (x2, y2)], fill=(44, 30, 58, 255), width=9)
    d.ellipse([sx - 105, sy - 80, sx + 105, sy + 130], fill=(59, 42, 77, 255))
    d.ellipse([sx - 60, sy - 150, sx + 60, sy - 60], fill=(70, 50, 90, 255))
    for ex in (-40, 40):
        d.ellipse([sx + ex - 34, sy - 128, sx + ex + 34, sy - 66], fill=(245, 245, 255, 255))
        d.ellipse([sx + ex - 15, sy - 114, sx + ex + 15, sy - 84], fill=(20, 16, 32, 255))
        d.ellipse([sx + ex - 8, sy - 112, sx + ex + 2, sy - 102], fill=(255, 255, 255, 255))
    d.arc([sx - 26, sy - 52, sx + 26, sy - 8], 20, 160, fill=(240, 220, 235, 255), width=5)
    d.ellipse([sx - 96, sy - 30, sx - 58, sy - 4], fill=(196, 130, 150, 120))
    d.ellipse([sx + 58, sy - 30, sx + 96, sy - 4], fill=(196, 130, 150, 120))
    for (bx0, by0, bx1, by1) in [(0, 40, 240, 130), (W, 60, W - 260, 150)]:
        d.line([(bx0, by0), (bx1, by1)], fill=(24, 30, 48, 255), width=26)
    ground(img, H * 0.8, (24, 30, 54))
    fireflies(img, rnd, 8)
    grain_vignette(img)
    save(img, "stop-4-spider.webp")

# ---------- scene 5: the owl's night watch ----------
def scene_owl():
    img, d, rnd = canvas(105)
    stars(img, d, rnd); moon(img, W * 0.2, H * 0.15, 60)
    d.line([(0, H * 0.78), (W, H * 0.72)], fill=(52, 40, 28, 255), width=30)
    d.line([(0, H * 0.8), (W, H * 0.74)], fill=(70, 54, 38, 255), width=6)
    cx, cy = W * 0.5, H * 0.52
    d.polygon([(cx - 190, cy - 120), (cx - 110, cy - 210), (cx - 70, cy - 130)], fill=(122, 90, 62, 255))
    d.polygon([(cx + 190, cy - 120), (cx + 110, cy - 210), (cx + 70, cy - 130)], fill=(122, 90, 62, 255))
    d.ellipse([cx - 200, cy - 180, cx + 200, cy + 240], fill=(138, 106, 79, 255))
    d.ellipse([cx - 130, cy - 60, cx + 130, cy + 220], fill=(201, 169, 126, 255))
    for i in range(3):
        d.arc([cx - 150 + i * 8, cy + 40, cx - 20, cy + 220], 90, 200, fill=(122, 90, 62, 255), width=6)
        d.arc([cx + 20, cy + 40, cx + 150 - i * 8, cy + 220], 340, 90, fill=(122, 90, 62, 255), width=6)
    for ex in (-85, 85):
        d.ellipse([cx + ex - 58, cy - 140, cx + ex + 58, cy - 24], fill=(248, 246, 240, 255))
        d.ellipse([cx + ex - 30, cy - 112, cx + ex + 30, cy - 52], fill=(26, 22, 40, 255))
        d.ellipse([cx + ex - 20, cy - 102, cx + ex - 2, cy - 84], fill=(255, 255, 255, 255))
    d.polygon([(cx - 26, cy - 60), (cx + 26, cy - 60), (cx, cy - 8)], fill=(224, 123, 36, 255))
    d.line([(cx, cy + 8), (cx, cy + 60)], fill=(52, 40, 28, 255), width=6)
    glow(img, cx, cy + 96, 70, LANTERN, max_alpha=150)
    d.rounded_rectangle([cx - 34, cy + 60, cx + 34, cy + 116], radius=10, fill=LANTERN_HOT + (255,))
    d.line([(cx - 34, cy + 60), (cx - 34, cy + 116)], fill=(200, 120, 40, 255), width=4)
    d.line([(cx + 34, cy + 60), (cx + 34, cy + 116)], fill=(200, 120, 40, 255), width=4)
    ground(img, H * 0.82, (24, 30, 54))
    fireflies(img, rnd)
    grain_vignette(img)
    save(img, "stop-5-owl.webp")

# ---------- scene 6: the lantern parade ground ----------
def crowd(img, rnd, n=16, wy=H * 0.78):
    d = ImageDraw.Draw(img)
    for i in range(n):
        x = rnd.uniform(40, W - 40)
        y = wy + rnd.uniform(-26, 10) + (x / W) * 60
        s = rnd.uniform(0.8, 1.5)
        dark = (14, 18, 36, 255)
        d.ellipse([x - 16 * s, y - 34 * s, x + 16 * s, y], fill=dark)
        d.ellipse([x - 10 * s, y - 48 * s, x + 10 * s, y - 28 * s], fill=dark)
        lx, ly = x + rnd.uniform(-26, 26) * s, y - 30 * s
        glow(img, lx, ly, 16 * s, LANTERN, max_alpha=130)
        d.ellipse([lx - 5, ly - 7, lx + 5, ly + 7], fill=LANTERN_HOT + (255,))

def scene_parade():
    img, d, rnd = canvas(106)
    stars(img, d, rnd, 110); moon(img, W * 0.8, H * 0.14, 90)
    ground(img, H * 0.68, (28, 42, 58))
    for i in range(60):
        x = rnd.uniform(0, W)
        y = rnd.uniform(H * 0.7, H * 0.98)
        d.arc([x - 8, y - 12, x + 8, y + 6], 200, 340, fill=(36, 56, 72, 255), width=3)
    crowd(img, rnd)
    for i in range(20):
        x = rnd.uniform(60, W - 60)
        y = rnd.uniform(H * 0.08, H * 0.6)
        s = rnd.uniform(0.7, 1.6)
        glow(img, x, y, 22 * s, LANTERN, max_alpha=140)
        d.ellipse([x - 8 * s, y - 11 * s, x + 8 * s, y + 11 * s], fill=LANTERN_HOT + (255,))
        d.line([(x, y + 11 * s), (x, y + 16 * s)], fill=(120, 90, 60, 160), width=2)
    fireflies(img, rnd, 12)
    grain_vignette(img)
    save(img, "stop-6-parade.webp")

# ---------- scene 7: wisp leading the parade ----------
def scene_wisp_lead():
    img, d, rnd = canvas(107)
    stars(img, d, rnd, 100); moon(img, W * 0.82, H * 0.12, 80)
    ground(img, H * 0.7, (28, 42, 58))
    for i in range(50):
        x = rnd.uniform(0, W)
        y = rnd.uniform(H * 0.72, H * 0.98)
        d.arc([x - 8, y - 12, x + 8, y + 6], 200, 340, fill=(36, 56, 72, 255), width=3)
    cx, cy = W * 0.42, H * 0.44
    glow(img, cx, cy, 210, (255, 210, 110), max_alpha=190)
    for side in (-1, 1):
        lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(lay).ellipse([cx + side * 70 - 60, cy - 130, cx + side * 70 + 60, cy + 30], fill=(255, 233, 168, 90))
        img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(10)))
    d.ellipse([cx - 78, cy - 84, cx + 78, cy + 72], fill=(255, 233, 168, 255))
    d.ellipse([cx - 50, cy - 60, cx + 50, cy + 50], fill=(255, 246, 214, 255))
    for ex in (-34, 34):
        d.ellipse([cx + ex - 17, cy - 26, cx + ex + 17, cy + 8], fill=(40, 30, 20, 255))
        d.ellipse([cx + ex - 9, cy - 20, cx + ex - 1, cy - 12], fill=(255, 255, 255, 255))
    d.arc([cx - 20, cy + 18, cx + 20, cy + 44], 20, 160, fill=(60, 45, 25, 255), width=5)
    d.ellipse([cx - 74, cy - 6, cx - 46, cy + 14], fill=(255, 170, 140, 90))
    d.ellipse([cx + 46, cy - 6, cx + 74, cy + 14], fill=(255, 170, 140, 90))
    for i in range(14):
        t = i / 13.0
        x = cx + 130 + t * 380
        y = cy - 40 + t * t * 260 + math.sin(t * 6) * 26
        s = 1.3 - t * 0.5
        glow(img, x, y, 24 * s, LANTERN, max_alpha=150)
        d.ellipse([x - 8 * s, y - 11 * s, x + 8 * s, y + 11 * s], fill=LANTERN_HOT + (255,))
    crowd(img, rnd, 10, H * 0.8)
    fireflies(img, rnd, 12)
    grain_vignette(img)
    save(img, "wisp-leading-parade.webp")

if __name__ == "__main__":
    for fn in (scene_pumpkin, scene_oak, scene_graveyard, scene_spider, scene_owl, scene_parade, scene_wisp_lead):
        try:
            fn()
        except Exception as e:
            print(f"FAIL {fn.__name__}: {e!r}")
