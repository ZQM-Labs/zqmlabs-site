#!/usr/bin/env bash
# Copy a reviewed, immutable quest-player commit into the site build tree.
# Usage: bash scripts/sync-player.sh <40-character commit SHA>
set -euo pipefail

SRC_REPO="https://github.com/ZQM-Labs/quest-player.git"
SRC_REF="${1:-}"
DST="static/games/hunt-for-wisps/play"
if [[ ! "$SRC_REF" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Pass a reviewed 40-character quest-player commit SHA; floating branch refs are not reproducible." >&2
  exit 2
fi

TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT
PLAYER_DIR="$TMPDIR/lantern-player"

git init -q "$PLAYER_DIR"
git -C "$PLAYER_DIR" remote add origin "$SRC_REPO"
echo "==> Fetching canonical quest-player commit $SRC_REF"
git -C "$PLAYER_DIR" fetch --quiet --depth 1 origin "$SRC_REF"
git -C "$PLAYER_DIR" checkout --quiet --detach FETCH_HEAD
RESOLVED_REF="$(git -C "$PLAYER_DIR" rev-parse HEAD)"
if [[ "$RESOLVED_REF" != "$SRC_REF" ]]; then
  echo "Fetched player commit $RESOLVED_REF does not match requested SHA $SRC_REF." >&2
  exit 1
fi

echo "==> Copying reviewed player commit -> $DST"
# Stream a Git archive into the destination. This avoids relying on rsync
# and avoids path translation issues when Git Bash runs on Windows.
rm -rf "$DST"
mkdir -p "$DST"
# Publish by ALLOWLIST, not denylist. The old flow archived the entire
# player tree and deleted a few known non-runtime paths, so anything
# added to the player repo later (docs, scripts, fixtures, tooling)
# would silently ship to the public site. The runtime set below mirrors
# sw.js's precache list plus the entry document: the root runtime files
# and the assets/, i18n/, vendor/ trees. NOTE: global-features.js was
# dropped from this allowlist because quest-player PR #73 removed
# the file (fix/remove-dead-global-features); no runtime file loads it.
git -C "$PLAYER_DIR" archive --format=tar HEAD -- \
  index.html app.js global-story.js i18n.js styles.css \
  manifest.webmanifest sw.js assets i18n vendor | tar -xf - -C "$DST"
# Fail loudly if anything outside the allowlist slipped through (e.g. if
# archive pathspec semantics ever change): the public tree must contain
# exactly the runtime set plus the provenance marker written below.
for entry in "$DST"/*; do
  case "$(basename "$entry")" in
    index.html|app.js|global-story.js|i18n.js|styles.css|manifest.webmanifest|sw.js|assets|i18n|vendor) ;;
    *) echo "Unexpected file in synced player tree: $entry" >&2; exit 1 ;;
  esac
done
printf '%s\n' "$RESOLVED_REF" > "$DST/PLAYER_SOURCE_SHA"

echo "==> Synced canonical quest-player commit $RESOLVED_REF"
