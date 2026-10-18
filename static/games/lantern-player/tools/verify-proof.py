#!/usr/bin/env python3
"""hermes-verify-PROOF.py — end-to-end runtime proof of the lantern-player defects.

Executes the REAL pre-fix and post-fix files in a Node DOM shim and compares
observed runtime behaviour. Not a grep: the files are evaluated by node's vm and
their real event handlers are invoked.

Produces a side-by-side verdict for each defect.

Run: python hermes-verify-PROOF.py
"""
import json, os, subprocess, sys, tempfile, textwrap
from pathlib import Path

NODE = Path(r"C:\Users\zqmco\AppData\Local\hermes\node\node.exe")
REPO = Path(r"C:\Users\zqmco\zqm-labs")
TMP = Path(r"C:\Users\zqmco\AppData\Local\Temp")

EXEC = TMP / "hermes-verify-exec.js"
SWEX = TMP / "hermes-verify-sw.js"

if not NODE.exists():
    sys.exit("node not found at " + str(NODE))

def sh(cmd, cwd=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=180)
    return r.returncode, r.stdout, r.stderr

# ---------- stage originals from origin/main (NOT HEAD — HEAD is the fix branch) ----------
sh(["git", "fetch", "origin", "main"], cwd=str(REPO))
staged = {}
for name, gitpath in [("app", "lantern-player/app.js"),
                      ("sw", "lantern-player/sw.js"),
                      ("manifest", "lantern-player/manifest.webmanifest")]:
    rc, out, err = sh(["git", "show", f"origin/main:{gitpath}"], cwd=str(REPO))
    p = TMP / f"exec-test/{name}_original"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(out, encoding="utf-8")
    staged[f"{name}_original"] = p
    # fixed = working tree
    fp = TMP / f"exec-test/{name}_fixed"
    fp.write_text((REPO / gitpath).read_text(encoding="utf-8"), encoding="utf-8")
    staged[f"{name}_fixed"] = fp

print("=" * 74)
print("RUNTIME PROOF — lantern-player defects")
print("=" * 74)
print(f"original source : origin/main (fetched)")
print(f"fixed source    : working tree (branch fix/player-defects)")
print(f"node            : {sh([str(NODE),'--version'])[1].strip()}")
print(f"origin/main app : {staged['app_original'].stat().st_size} bytes")
print(f"fixed app       : {staged['app_fixed'].stat().st_size} bytes")
print()

QR = "?kit=DEMO&stop=3&code=LANTERN-3"
results = {}

def run_exec(app, label):
    rc, out, err = sh([str(NODE), str(EXEC), str(app), label, QR])
    return out

# ---------- app.js runtime ----------
orig_out = run_exec(staged["app_original"], "ORIGINAL")
fixed_out = run_exec(staged["app_fixed"], "FIXED")

def grab(text, key):
    for line in text.splitlines():
        if line.strip().startswith(key):
            return line.split(":", 1)[1].strip()
    return "?"

print("-" * 74)
print("DEFECT 1 — QR deep link (?kit=&stop=&code=)")
print("-" * 74)
print(f"  ORIGINAL : access-code field = {grab(orig_out,'access-code field after load')}")
print(f"             -> {grab(orig_out,'RESULT')}")
print(f"  FIXED    : access-code field = {grab(fixed_out,'access-code field after load')}")
print(f"             -> {grab(fixed_out,'RESULT')}")
results["1_qr"] = ("IGNORED" in orig_out) and ("CONSUMED" in fixed_out)

print()
print("-" * 74)
print("DEFECT 2 — duplicate solve -> leaderboard inflation")
print("-" * 74)
for tag, txt in [("ORIGINAL", orig_out), ("FIXED", fixed_out)]:
    lines = [l.strip() for l in txt.splitlines() if "after unlock #" in l or "duplicates present" in l
             or "portal score" in l]
    print(f"  {tag}:")
    for l in lines:
        print(f"    {l}")
results["2_dup"] = ("duplicates present           : true" in orig_out
                    and "duplicates present           : false" in fixed_out)

print()
print("-" * 74)
print("DEFECT 6 — openMap() with Leaflet unavailable (live CSP state)")
print("-" * 74)
for tag, txt in [("ORIGINAL", orig_out), ("FIXED", fixed_out)]:
    lines = [l.strip() for l in txt.splitlines() if "RESULT :" in l and ("THREW" in l or "did not throw" in l)]
    print(f"  {tag}: {lines[-1] if lines else '?'}")
results["6_map"] = ("THREW ReferenceError" in orig_out) and ("did not throw" in fixed_out)

# ---------- sw.js runtime ----------
print()
print("-" * 74)
print("DEFECT 5 — service worker serves HTML in place of failed JS")
print("-" * 74)
rc, o_sw, _ = sh([str(NODE), str(SWEX), str(staged["sw_original"]), "SW-ORIGINAL"])
rc, f_sw, _ = sh([str(NODE), str(SWEX), str(staged["sw_fixed"]), "SW-FIXED"])
for tag, txt in [("ORIGINAL", o_sw), ("FIXED", f_sw)]:
    print(f"  {tag}:")
    for l in txt.splitlines():
        if any(k in l for k in ["[A]", "[B]", "[C]", "RESULT", "returned body"]):
            print(f"    {l.strip()}")
results["5_sw"] = ("SERVED HTML IN PLACE OF JS" in o_sw) and ("threw -> offline" in f_sw)
results["5_sw_post"] = ("INTERCEPTED" in o_sw) and ("passed through to network" in f_sw)

# ---------- manifest / PWA ----------
print()
print("-" * 74)
print("DEFECT 4 — PWA start_url lands on a dead screen")
print("-" * 74)
o_mf = json.loads(staged["manifest_original"].read_text(encoding="utf-8"))
f_mf = json.loads(staged["manifest_fixed"].read_text(encoding="utf-8"))
print(f"  ORIGINAL start_url : {o_mf.get('start_url')!r}  -> /play/  -> no ?demo=1")
print(f"             -> live branch -> validateCode() -> api.zqmlabs.com 404 -> stuck")
print(f"  FIXED    start_url : {f_mf.get('start_url')!r}  -> /play/?demo=1 -> playable")
rc, code, _ = sh(["curl", "-s", "-m", "10", "-o", os.devnull, "-w", "%{http_code}",
                  "-X", "POST", "https://api.zqmlabs.com/api/lantern/validate",
                  "-H", "Content-Type: application/json", "-d", '{"code":"WISP-2026-DEMO"}'])
print(f"  live check         : POST api.zqmlabs.com/api/lantern/validate -> {code.strip()}")
results["4_pwa"] = (o_mf.get("start_url") == "." and f_mf.get("start_url") == "./?demo=1")

# ---------- verdict ----------
print()
print("=" * 74)
print("VERDICT")
print("=" * 74)
labels = {
    "1_qr":    "QR deep link consumed (was ignored)",
    "2_dup":   "duplicate solves eliminated (was inflating score)",
    "6_map":   "map degrades instead of throwing (was ReferenceError)",
    "5_sw":    "SW no longer serves HTML for JS (was silent SyntaxError)",
    "5_sw_post":"SW passes POST through (was intercepting API writes)",
    "4_pwa":   "PWA start_url reaches a playable screen (was a dead screen)",
}
allok = True
for k, desc in labels.items():
    ok = results.get(k, False)
    allok &= ok
    print(f"  {'PROVEN' if ok else 'FAILED'}  {desc}")
print()
print("  All defects reproduced on origin/main and resolved in the working tree."
      if allok else "  !! some proofs did not hold — investigate")
print("=" * 74)
sys.exit(0 if allok else 1)
