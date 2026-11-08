# Canonical-only source triage — immutable-pinned comparison

**Status:** Review evidence only; no publication, code, merge, release or deployment authorization. Derived from publisher draft #252's `docs/IMMUTABLE_PIN_SOURCE_COMPARISON.csv` (immutable canonical site versus publisher-nested Hugo trees). Source-only counts are **not** live public output counts.

## Count reconciliation

| Group | Source paths present only in canonical tree | Proposed owner/action |
| --- | ---: | --- |
| Wisp game/player subtree under `static/games/hunt-for-wisps/play/**` | 77 | Source-only reference. Final public player files must come from the separately pinned `quest-player` build, not recursively copied canonical static. |
| Legacy lantern-player subtree under `static/games/lantern-player/**` | 71 | Preserve real legacy route/redirect/asset compatibility; determine approved player-owned output and exclude development internals. |
| Four approved guide Markdown sources under `content/guides/**` | 4 | Existing production workflow already overlays selected canonical guides; preserve source pin and current public route/SEO gate. |
| `layouts/games/list.html` | 1 | Compare with actual rendered game directory; migrate only with route and template acceptance. |
| `static/img/dr-z-lab-banner.svg` | 1 | Check homepage/layout references, content rights, accessibility and brand design before inclusion. |
| **Total** | **154** | |

**Interpretation:** 148 of 154 canonical-only source paths are inside player-related static trees. This does not mean those files are safely publishable, unused, or identical to the approved pinned-player artifact. The legacy-player paths need actual browser/redirect and offline verification.

## Confirmed development-source exposure candidates

The source comparison lists the following paths within static game mounts:

- `static/games/hunt-for-wisps/play/.github/PULL_REQUEST_TEMPLATE.md`
- `static/games/hunt-for-wisps/play/.github/dependabot.yml`
- `static/games/hunt-for-wisps/play/.github/workflows/ci.yml`
- `static/games/hunt-for-wisps/play/.gitignore`
- `static/games/hunt-for-wisps/play/README.md`
- `static/games/lantern-player/.gitignore`
- `static/games/lantern-player/README.md`
- `static/games/lantern-player/tools/README.md`

These are **candidate output exclusions**, not proof they are currently live or confidential. A proposed complete-source build must explicitly test their absence from the public artifact. By contrast, legitimate `i18n/*.json`, image, audio, script and service-worker resources cannot be excluded blindly.

## Recommended precedence and test cases

1. **Single player source authority:** Build and copy exact approved `PLAYER_SOURCE_SHA` output into the existing supported mount. Require that all final player paths have provenance to this source; reject accidental fallback to vendor/canonical versions.
2. **Legacy URL contract:** Determine whether `/games/lantern-player/` is an independent legacy app, alias or archived route from live responses. Maintain its entry point and asset resolution until a reviewed migration/redirect is proven.
3. **No source-tree mirroring:** A static copy of canonical game directories is not an approved player build. Reject unexpected dotfiles, workflow source, tools/docs, private assets and unrelated source maps in artifact inventory.
4. **Runtime dependency graph:** Crawl generated HTML, CSS imports, JavaScript modules/fetches, SW precache, localization, manifests and referenced assets. All allowed runtime dependencies must resolve and have source provenance.
5. **Guide continuity:** Continue exact current four-guide validation until an approved publication manifest expands or replaces it, preserving titles/canonicals and indexing status.
6. **Page and brand boundaries:** The extra game-list template and homepage banner require explicit route and design reviews; neither may be silently included or dropped.
7. **Negative fixtures:** Inject an unapproved Markdown source, a stale vendored player asset, a fake source dotfile and an unlisted runtime dependency into a sandbox fixture. The build must fail closed on unintended publication without breaking allowed runtime localization.

## Remaining evidence required

- Live-origin URL/redirect and browser behavior for both player mounts.
- Immutable source and generated-player file digests, not only Git blob IDs.
- Exact expanded publishable path list and any legacy exception with reviewer approval.
- Browser/offline/service-worker regression suite with a tested cold cache and upgrade path.
- Artifact-level forbidden-file scan and complete route/link/metadata checks.

Cross-repo: [site draft #93](https://github.com/ZQM-Labs/zqmlabs-site/pull/93), [publisher draft #252](https://github.com/ZQM-Computing/zqm-labs/pull/252). The unresolved security-scanner failures remain independent stop conditions.
