#!/usr/bin/env python3
"""Apply the three deploy-readiness changes to the site repo."""
import os, shutil

ss = os.path.dirname(os.path.abspath(__file__))

# 1. pages.yml — add sync step before Build
pyml = os.path.join(ss, '.github', 'workflows', 'pages.yml')
t = open(pyml, encoding='utf-8').read()
if 'Sync player from zqm-labs' not in t:
    t = t.replace(
        '      - uses: actions/configure-pages@v5\n      - name: Build',
        '      - uses: actions/configure-pages@v5\n'
        '      - name: Sync player from zqm-labs\n'
        '        run: |\n'
        '          git clone --depth 1 https://github.com/ZQM-Computing/zqm-labs.git /tmp/zqm-labs\n'
        '          rsync -a --delete \\\n'
        "            --exclude 'tools/' \\\n"
        "            --exclude 'README.md' \\\n"
        "            --exclude '.gitignore' \\\n"
        '            /tmp/zqm-labs/lantern-player/ static/games/hunt-for-wisps/play/\n'
        '          rm -rf /tmp/zqm-labs\n'
        '      - name: Build')
    open(pyml, 'w', encoding='utf-8').write(t)
    print("  pages.yml: sync step added")
else:
    print("  pages.yml: already has sync step")

# 2. 404.html
src404 = os.path.join(ss, 'layouts', '404.html')
if not os.path.exists(src404):
    alt = r'C:\Users\zqmco\AppData\Local\Temp\sitetest\zqmlabs-site\layouts\404.html'
    if os.path.exists(alt):
        shutil.copy(alt, src404)
        print("  404.html: copied from sitetest")
    else:
        print("  404.html: MISSING — no source")
else:
    print("  404.html: already present")

# 3. _headers
srch = os.path.join(ss, 'static', '_headers')
if not os.path.exists(srch):
    alt = r'C:\Users\zqmco\AppData\Local\Temp\sitetest\zqmlabs-site\static\_headers'
    if os.path.exists(alt):
        shutil.copy(alt, srch)
        print("  _headers: copied from sitetest")
    else:
        print("  _headers: MISSING — no source")
else:
    print("  _headers: already present")

# 4. sync-player.sh
sp = os.path.join(ss, 'scripts', 'sync-player.sh')
if not os.path.exists(sp):
    os.makedirs(os.path.join(ss, 'scripts'), exist_ok=True)
    script = '''#!/usr/bin/env bash
# sync-player.sh — fetch the canonical lantern-player from ZQM-Computing/zqm-labs
# and copy it into the site build tree. Runs at CI time before `hugo`.
#
# Usage: bash scripts/sync-player.sh [branch]
#   Without an argument, fetches the latest main.

set -euo pipefail

SRC_REPO="https://github.com/ZQM-Computing/zqm-labs.git"
SRC_BRANCH="${1:-main}"
DST="static/games/hunt-for-wisps/play"
TMPDIR="$(mktemp -d)"

echo "==> Fetching lantern-player from zqm-labs (${SRC_BRANCH})"

git clone --depth 1 --branch "$SRC_BRANCH" "$SRC_REPO" "$TMPDIR/zqm-labs" || \\
  git clone --depth 1 "$SRC_REPO" "$TMPDIR/zqm-labs"

echo "==> Copying lantern-player -> $DST"
mkdir -p "$DST"
rsync -a --delete \\
  --exclude 'tools/' \\
  --exclude 'README.md' \\
  --exclude '.gitignore' \\
  "$TMPDIR/zqm-labs/lantern-player/" "$DST/"

rm -rf "$TMPDIR"

echo "==> Sync complete. Files in $DST:"
ls -1 "$DST"
'''
    open(sp, 'w', encoding='utf-8').write(script)
    os.chmod(sp, 0o755)
    print("  sync-player.sh: created")
else:
    print("  sync-player.sh: already present")

print()
print("=== final state ===")
for f in ['scripts/sync-player.sh', 'layouts/404.html', 'static/_headers']:
    print(f"  {f}: {'yes' if os.path.exists(os.path.join(ss,f)) else 'MISSING'}")
