#!/usr/bin/env bash
# Copy the canonical lantern-player repository root into the site build tree.
# Usage: bash scripts/sync-player.sh [branch]
set -euo pipefail

SRC_REPO="https://github.com/ZQM-Labs/lantern-player.git"
SRC_BRANCH="${1:-main}"
DST="static/games/hunt-for-wisps/play"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

echo "==> Fetching lantern-player (${SRC_BRANCH})"
git clone --depth 1 --branch "$SRC_BRANCH" "$SRC_REPO" "$TMPDIR/lantern-player"

echo "==> Copying repository root -> $DST"
mkdir -p "$DST"
rsync -a --delete \
  --exclude 'tools/' \
  --exclude 'tests/' \
  --exclude 'README.md' \
  --exclude '.gitignore' \
  --exclude '.github/' \
  --exclude '.git/' \
  "$TMPDIR/lantern-player/" "$DST/"

echo "==> Sync complete. Files in $DST:"
ls -1 "$DST"
