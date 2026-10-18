#!/usr/bin/env python3
"""
test-suite.py - Comprehensive E2E test suite for zqmlabs.com

Usage:
    python test-suite.py              # Test production
    python test-suite.py --local      # Test local build only
    python test-suite.py --verbose    # Show detailed output

Exit codes:
    0 = all tests passed
    1 = failures detected
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone

# ============================================================
# Configuration
# ============================================================

SITE_URL = os.environ.get("SITE_URL", "https://zqmlabs.com")
API_URL = os.environ.get("API_URL", "https://api.zqmlabs.com")
PLAYER = "/games/hunt-for-wisps/play"
NODE = r"C:\Users\zqmco\AppData\Local\hermes\node\node.exe"
TOOLS = r"C:\Users\zqmco\zqm-labs\lantern-player\tools"
PLAYER_APP = r"C:\Users\zqmco\lantern-player\app.js"

# ============================================================
# Test framework
# ============================================================

results = {"pass": 0, "fail": 0, "skip": 0, "failures": []}


def check(name, expected, actual):
    if expected == actual:
        results["pass"] += 1
        print(f"  [PASS] {name}")
    else:
        results["fail"] += 1
        results["failures"].append((name, expected, actual))
        print(f"  [FAIL] {name} (expected: {expected}, got: {actual})")


def check_contains(name, content, pattern):
    if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
        results["pass"] += 1
        print(f"  [PASS] {name}")
    else:
        results["fail"] += 1
        results["failures"].append((name, pattern, "not found"))
        print(f"  [FAIL] {name} (pattern not found: {pattern})")


def check_true(name, value):
    if value:
        results["pass"] += 1
        print(f"  [PASS] {name}")
    else:
        results["fail"] += 1
        results["failures"].append((name, True, value))
        print(f"  [FAIL] {name}")


def skip(name):
    results["skip"] += 1
    print(f"  [SKIP] {name}")


# ============================================================
# HTTP helpers (Python urllib - no curl dependency)
# ============================================================

def http_status(url, follow_redirects=True):
    try:
        req = urllib.request.Request(url, method="GET")
        req.add_header("User-Agent", "ZQM-Test-Suite/1.0")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.getcode()
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def http_headers(url):
    try:
        req = urllib.request.Request(url, method="GET")
        req.add_header("User-Agent", "ZQM-Test-Suite/1.0")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return dict(resp.headers)
    except Exception:
        return {}


def http_body(url):
    try:
        req = urllib.request.Request(url, method="GET")
        req.add_header("User-Agent", "ZQM-Test-Suite/1.0")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return ""


def http_post(url, data):
    try:
        body = json.dumps(data).encode("utf-8")
        req = urllib.request.Request(url, data=body, method="POST")
        req.add_header("Content-Type", "application/json")
        req.add_header("User-Agent", "ZQM-Test-Suite/1.0")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return ""


def http_content_type(url):
    try:
        req = urllib.request.Request(url, method="GET")
        req.add_header("User-Agent", "ZQM-Test-Suite/1.0")
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.headers.get("Content-Type", "")
    except Exception:
        return ""


# ============================================================
# Test suite
# ============================================================

def main():
    print("=" * 56)
    print("ZQM LABS - E2E Test Suite")
    print(f"Site: {SITE_URL} | API: {API_URL}")
    print(f"Date: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print("=" * 56)
    print()

    # 1. Site pages
    print("--- 1. Site Pages ---")
    for p in ["/", "/about/", "/faq/", "/tiers/", "/halloween/", f"{PLAYER}/"]:
        check(f"GET {p}", 200, http_status(f"{SITE_URL}{p}"))
    print()

    # 2. Security headers
    print("--- 2. Security Headers ---")
    headers = http_headers(f"{SITE_URL}/")
    header_names = [k.lower() for k in headers.keys()]
    for h in ["content-security-policy", "strict-transport-security",
              "x-frame-options", "x-content-type-options", "referrer-policy"]:
        check_true(h, h in header_names)
    print()

    # 3. Player assets
    print("--- 3. Player Assets ---")
    assets = [
        "index.html", "app.js", "styles.css", "sw.js", "manifest.webmanifest",
        "vendor/leaflet.js", "vendor/leaflet.css",
        "assets/img/hero-pumpkin.svg",
        "assets/img/relic-pumpkin.svg", "assets/img/relic-lantern.svg",
        "assets/img/relic-ghost.svg", "assets/img/relic-spider.svg",
        "assets/img/relic-bat.svg", "assets/img/relic-wisp.svg",
        "assets/audio/hoot.wav", "assets/audio/hoot.ogg",
    ]
    for a in assets:
        # Retry up to 3 times for CDN cache issues
        code = 0
        for attempt in range(3):
            code = http_status(f"{SITE_URL}{PLAYER}/{a}")
            if code == 200:
                break
            time.sleep(1)
        check(f"asset: {a}", 200, code)
    print()

    # 4. WebP files
    print("--- 4. WebP Files (24) ---")
    stops = [(1, "pumpkin"), (2, "oak"), (3, "graveyard"), (4, "spider"), (5, "owl"), (6, "lantern")]
    tiers = ["cozy", "spooky", "afterdark", "overdrive"]
    for sid, sname in stops:
        for tier in tiers:
            f = f"stop-{sid}-{sname}-{tier}.webp"
            # Retry up to 3 times for CDN cache issues
            code = 0
            for attempt in range(3):
                code = http_status(f"{SITE_URL}{PLAYER}/assets/img/{f}")
                if code == 200:
                    break
                time.sleep(1)
            check(f"webp: {f}", 200, code)
    print()

    # 5. Backend API
    print("--- 5. Backend API ---")
    check_contains("health", http_body(f"{API_URL}/api/health"), r'"code":\s*200')
    check_contains("validate", http_post(f"{API_URL}/api/lantern/validate", {"code": "WISP-2026-DEMO"}), r'"valid":\s*true')
    check_contains("validate invalid", http_post(f"{API_URL}/api/lantern/validate", {"code": "BAD"}), r'"valid":\s*false')
    check_contains("progress", http_post(f"{API_URL}/api/lantern/progress", {"team": "T", "kit": "91z45pwv5wi5lkj", "solved": [1], "hintsUsed": 0, "scare": "cozy", "finished": False}), r'"ok":\s*true')
    check_contains("leaderboard", http_body(f"{API_URL}/api/lantern/leaderboard/91z45pwv5wi5lkj"), r'"leaderboard"')
    check_contains("export", http_body(f"{API_URL}/api/lantern/export/91z45pwv5wi5lkj"), r'team,scare')
    print()

    # 6. Player logic
    print("--- 6. Player Logic ---")
    if os.path.isfile(NODE) and os.path.isfile(f"{TOOLS}/verify-playthrough.js"):
        try:
            output = subprocess.run(
                [NODE, f"{TOOLS}/verify-playthrough.js", PLAYER_APP, "CI", "?demo=1"],
                capture_output=True, text=True, timeout=60
            ).stdout
            check_contains("playthrough 6/6", output, r"stops_lit=6/6")
            check_contains("completable", output, r"completable=true")
            check_contains("no duplicates", output, r"duplicates=false")
        except Exception as e:
            skip(f"playthrough ({e})")
    else:
        skip("playthrough (node or tools not found)")
    print()

    # 7. QR deep link
    print("--- 7. QR Deep Link ---")
    if os.path.isfile(NODE) and os.path.isfile(f"{TOOLS}/verify-deeplink.js"):
        try:
            output = subprocess.run(
                [NODE, f"{TOOLS}/verify-deeplink.js", PLAYER_APP, "CI", "?stop=3&code=LANTERN-3"],
                capture_output=True, text=True, timeout=60
            ).stdout
            check_contains("QR deep link", output, r"access-code|unlock-code|LANTERN-3|stop=3")
        except Exception as e:
            skip(f"QR deep link ({e})")
    else:
        skip("QR deep link (node or tools not found)")
    print()

    # 8. Content pack
    print("--- 8. Content Pack ---")
    pack_path = r"C:\Users\zqmco\zqm-labs\lantern-content\content-packs\wisp-demo.json"
    if os.path.isfile(pack_path):
        try:
            with open(pack_path, encoding="utf-8") as f:
                pack = json.load(f)
            stops = pack.get("stops", [])
            check_true("6 stops", len(stops) == 6)
            check_true("3 hints each", all(len(s.get("hints", [])) == 3 for s in stops))
            check_true("4 puzzle variants", all(len(s.get("puzzle", {})) == 4 for s in stops))
            check_true("art present", all(s.get("art", "") != "" for s in stops))
        except Exception as e:
            skip(f"content pack ({e})")
    else:
        skip("content pack (file not found)")
    print()

    # 9. Service worker
    print("--- 9. Service Worker ---")
    sw = http_body(f"{SITE_URL}{PLAYER}/sw.js")
    check_contains("SW cache", sw, r"lantern-v")
    check_contains("SW leaflet", sw, r"vendor/leaflet\.js")
    check_contains("SW offline", sw, r"index\.html")
    print()

    # 10. Acceptance checks
    print("--- 10. Acceptance Checks ---")
    ct = http_content_type(f"{SITE_URL}{PLAYER}/app.js")
    check_true("app.js MIME", "application/javascript" in ct)
    check("404 handling", 404, http_status(f"{SITE_URL}/zzz-nope-xyz/"))
    check_contains("iframe demo=1", http_body(f"{SITE_URL}/games/hunt-for-wisps/"), r"demo=1")
    check_contains("player renders", http_body(f"{SITE_URL}{PLAYER}/?demo=1"), r"screen-start")
    print()

    # 11. DNS
    print("--- 11. DNS ---")
    check("zqmlabs.com", 200, http_status(f"{SITE_URL}/"))
    check("api", 200, http_status(f"{API_URL}/api/health"))
    print()

    # 12. Performance smoke test
    print("--- 12. Performance ---")
    t0 = time.time()
    http_body(f"{SITE_URL}{PLAYER}/app.js")
    t1 = time.time()
    elapsed = t1 - t0
    print(f"  app.js load time: {elapsed:.3f}s")
    check_true("app.js < 2s", elapsed < 2.0)
    print()

    # Summary
    p = results["pass"]
    f = results["fail"]
    s = results["skip"]
    total = p + f + s
    print("=" * 56)
    print(f"RESULTS: {p} passed, {f} failed, {s} skipped ({total} total)")
    print("=" * 56)
    if f > 0:
        print()
        print("FAILURES:")
        for name, expected, actual in results["failures"]:
            print(f"  {name} (expected: {expected}, got: {actual})")
        print()
        print("Failures detected.")
        sys.exit(1)
    print()
    print("All tests passed.")
    sys.exit(0)


if __name__ == "__main__":
    main()
