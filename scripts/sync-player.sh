#!/usr/bin/env bash
# sync-player.sh — fetch the canonical lantern-player from ZQM-Computing/zqm-labs
# and copy it into the site build tree. Runs at CI time before `hugo`.
#
# Usage: bash scripts/sync-player.sh [branch]
#   Without an argument, fetches the latest main.

set -euo pipefail

SRC_REPO="https://github.com/ZQM-Labs/lantern-player.git"
SRC_BRANCH="${1:-main}"
DST="static/games/hunt-for-wisps/play"
TMPDIR="$(mktemp -d)"

echo "==> Fetching lantern-player from zqm-labs (${SRC_BRANCH})"

git clone --depth 1 --branch "$SRC_BRANCH" "$SRC_REPO" "$TMPDIR/zqm-labs" || \
  git clone --depth 1 "$SRC_REPO" "$TMPDIR/zqm-labs"

echo "==> Copying lantern-player -> $DST"
mkdir -p "$DST"
rsync -a --delete \
  --exclude 'tools/' \
  --exclude 'README.md' \
  --exclude '.gitignore' \
  "$TMPDIR/zqm-labs/lantern-player/" "$DST/"

rm -rf "$TMPDIR"

echo "==> Sync complete. Files in $DST:"
ls -1 "$DST"
