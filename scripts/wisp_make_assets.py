#!/usr/bin/env python3
"""Wisp PWA asset pass (2026-10-15):
  1. Report current art inventory (size, dimensions, sha) — ground truth.
  2. Downscale oversized art (gap #7: ~2.6MB total; finale 592KB displays once
     at phone width; drz avatars 314-396KB display at ~200px).
  3. Generate the missing PWA icons (gap #1: manifest has no icons array).
Icons derive from the shipped finale art so they match the game's palette.
Originals are committed in git (recoverable via `git checkout`), so this
overwrites in place after reporting the before-state."""
from PIL import Image
import os, hashlib

A = "C:/Users/zqmco/zqmlabs-site-gh/static/games/hunt-for-wisps/play/assets"

def sha(p):
    return hashlib.sha1(open(p, "rb").read()).hexdigest()[:10]

# ---------- 1. report ----------
print("=== BEFORE ===")
before = {}
for f in sorted(os.listdir(A)):
    p = os.path.join(A, f)
    if not f.endswith(".webp"):
        continue
    im = Image.open(p)
    before[f] = (im.size, os.path.getsize(p), sha(p))
    print(f"{f}: {im.size} {os.path.getsize(p):,}B sha={before[f][2]}")
total_before = sum(v[1] for v in before.values())
print(f"TOTAL webp: {total_before:,}B")

# ---------- 2. downscale ----------
# filename -> (max dimension, webp quality). Targets chosen for display size:
# finale art shows full-width on a phone (~400-800px); drz cards ~200px;
# logo banner ~full width; mood/story art ~full width.
PLAN = {
    "finale-lantern-parade.webp": (1000, 82),
    "logo-primary.webp":         (1200, 82),
    "drz-cozy.webp":             (480, 82),
    "drz-spooky.webp":           (480, 82),
    "drz-afterdark.webp":        (480, 82),
    "drz-overdrive.webp":        (480, 82),
    "wisp-hiding-lantern.webp":  (900, 80),
    "wisp-sad-intro.webp":       (700, 80),
}
print("\n=== DOWNSCALE ===")
total_after = 0
for f, (maxd, q) in PLAN.items():
    p = os.path.join(A, f)
    if not os.path.exists(p):
        print(f"MISSING {f} — skipped")
        continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    scale = min(1.0, maxd / max(w, h))
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    im.save(p, "WEBP", quality=q, method=6)
    sz = os.path.getsize(p)
    total_after += sz
    saved = before[f][1] - sz
    print(f"{f}: {w}x{h} -> {im.size}  {before[f][1]:,}B -> {sz:,}B  (saved {saved:,}B)")
print(f"TOTAL webp after: {total_after:,}B (was {total_before:,}B, saved {total_before - total_after:,}B)")

# ---------- 3. icons ----------
print("\n=== ICONS ===")
src = Image.open(os.path.join(A, "finale-lantern-parade.webp")).convert("RGB")
w, h = src.size
s = min(w, h)
sq = src.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
for name, size in [("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)]:
    out = os.path.join(A, name)
    sq.resize((size, size), Image.LANCZOS).save(out, "PNG", optimize=True)
    print(f"{name}: {size}x{size} {os.path.getsize(out):,}B")
# Maskable: art scaled to ~78% on a deep-night-blue field (safe zone honored).
bg = Image.new("RGB", (512, 512), (27, 42, 74))
inner = sq.resize((int(512 * 0.78), int(512 * 0.78)), Image.LANCZOS)
bg.paste(inner, ((512 - inner.width) // 2, (512 - inner.height) // 2))
out = os.path.join(A, "icon-maskable-512.png")
bg.save(out, "PNG", optimize=True)
print(f"icon-maskable-512.png: 512x512 {os.path.getsize(out):,}B")
print("\nDONE")
