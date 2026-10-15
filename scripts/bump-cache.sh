#!/usr/bin/env bash
# Bump the Hunt-for-Wisps service worker cache version after any game file
# change. The old build keeps working offline; the new one takes over on
# next visit. Run this BEFORE deploying a changed game build, or the CDN's
# 1-year immutable asset cache will serve players the old JS.
#
# Usage: bash scripts/bump-cache.sh
set -euo pipefail
SW="static/games/hunt-for-wisps/play/sw.js"
CUR=$(grep -oE 'lantern-v[0-9]+' "$SW" | head -1)
NEXT="lantern-v$(( ${CUR#lantern-v} + 1 ))"
sed -i "s/${CUR}/${NEXT}/" "$SW"
echo "cache bumped: ${CUR} -> ${NEXT}"
