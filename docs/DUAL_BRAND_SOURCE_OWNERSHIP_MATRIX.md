# Dual-brand Hugo source ownership matrix — migration review, v1

**Status:** Design evidence for draft PR #93 and publisher PR #252. Implementation and publication are **not authorized**. Baseline inspected 2026-11-07/08: `ZQM-Labs/zqmlabs-site` main; `ZQM-Computing/zqm-labs` main; `ZQM-Computing/ZQM-Computing` main. This is an ownership specification, **not** a claim of byte-level artifact parity or a complete production URL crawl.

## Existing production composition — verified from publisher workflow

- Publisher: `ZQM-Computing/zqm-labs/.github/workflows/pages-deploy.yml`, builds nested `zqmlabs-site/` and deploys through Wrangler to the existing Pages project. The publisher remains the **only authorized production writer**.
- Site content pin: `167079f725384808c0d106d44de12519959d13c3`; player pin: `739a8490c0c1ce5df5f8e6c8b5ce57033ccc7749`. These are **observed current configuration**, not proposed upgrade targets.
- Exactly **13** pinned canonical content files are overlaid: the eight top-level pages `_index.md`, `about.md`, `halloween.md`, `tiers.md`, `faq.md`, `patterns.md`, `community.md`, `games.md`; `guides/_index.md` and four named guides: `host-your-first-scavenger-hunt.md`, `city-history-scavenger-hunt.md`, `outdoor-games-with-friends-no-app.md`, `ai-photo-geolocation-vs-real-world-quests.md`. `hugo.toml` is also copied.
- The canonical site has **299 tracked blobs** and the publisher has **404 tracked blobs** in the main Git trees reviewed. Those are repository-wide counts, **not** approved artifact counts. Both contain Hugo layouts, content, redirect files, game assets and non-web documentation. Their duplication is not a license to publish both trees.
- Current publisher gates include exact pin checks, the selected-guide overlay validator, game player SHA validation, 404/guide/route checks, paid-pack exclusion, a v1 public release-manifest and live deployment verification. Do not remove any gate until an equivalent or stronger check has passed.

## Exact tracked-file evidence (machine-readable)

The companion [file inventory](DUAL_BRAND_FILE_INVENTORY.csv) enumerates **319** relevant records: **303 distinct Hugo source paths** in the canonical/publisher site comparison plus **16** separate Computing preview files. The Hugo comparison has **31 identical**, **66 different**, **156 canonical-only**, and **50 publisher-only** path records by Git blob SHA. These are **source-file statuses**, not public artifact diffs, number of required changes, or a substitute for a route crawl.

Each row includes path, exact canonical and publisher-vendored Git blob SHAs, relation, currently known composition precedence, proposed disposition and unresolved/review state. Rows marked `different` or present in only one site remain unresolved by default. Values describe the **main trees retrieved for this analysis**, not an approved immutable release baseline. Before implementation, repeat the extraction at reviewed full commit SHAs, check file modes and symbolic links, and resolve every path with an authorized owner and explicit output decision.

The Computing preview records carry their current source SHA in the canonical SHA column solely as an inventory convenience; they are **not canonical Labs files** and must not be imported by that label. The current composition field `publisher_vendor_or_absent` intentionally does not claim all publisher-only source files appear in the live artifact.

## File / path-family ownership and treatment

| Source path or family | Current deployed ownership | Target authority | Allowed treatment and evidence required |
| --- | --- | --- | --- |
| `hugo.toml` | Overlaid from pinned canonical site | Labs site | **Canonical build input**; validate baseURL, routing and environment at exact SHA |
| `content/{_index,about,halloween,tiers,faq,patterns,community,games}.md` | 8 pinned overlay pages | Labs site | Preserve existing public paths and semantic claims; only approved content in artifact |
| `content/guides/_index.md` and four named guides | 5 pinned overlay pages | Labs site | Keep route and SEO test equivalence, expand by **explicit approval**, never wildcard-copy experimental material |
| Other `content/guides/*.md`, `content/games/**`, `content/locations/**`, `content/{pricing,organizers,terms,privacy,contact,...}.md` | Publisher's nested Hugo tree, unless part of overlay | Labs site | **Content migration candidates**; inventory each URL, canonical, metadata and claims against live baseline; no automatic promotion |
| `layouts/**`, `assets/**`, `static/css/**`, `static/img/**`, `static/_headers`, `static/_redirects`, and other public web assets | Primarily publisher's nested tree (canonical duplicates exist) | Labs site | **One canonical active implementation**, resolved via file-level diff and selected design; version redirects/headers explicitly |
| `static/games/hunt-for-wisps/play/**` and cached player files | Player synced over vendored files at immutable `PLAYER_SOURCE_SHA` | `ZQM-Labs/quest-player` | **Player-derived output only** at approved mount; independently pin, diff, verify source marker, assets, SW/offline, demo |
| `static/games/lantern-player/**` and legacy player aliases | Both trees contain potentially overlapping copies | Player/legacy-route owner **to be decided by proof** | Quarantine until route census identifies canonical live behavior; retain URLs or reviewed redirects, do not silently replace |
| `static/experiments/**`, experimental games, unreviewed landing pages | Present in canonical tree, publication entitlement not established | No default public authority | **Exclude by default**, even if tracked and Hugo would otherwise copy automatically |
| `static/packs/**`, private kits/answer keys, entitlements and admin data | Explicitly removed/checked by publisher | Separate restricted operations/fulfillment systems | **Never enter public artifact**; fail closed on forbidden path and content signatures |
| `commercial-site/**` | Separate nonpublic Computing scaffold; not in Labs publisher | Computing technical owner; public wording reviewed into Labs site | **Reference and draft-source only**; `example.invalid` and `publicRelease=false` stay intact; no second live publisher |
| Computing service briefs `docs/services/**`, cookbooks and evidence links | Not owned by Labs publisher | Computing org + respective cookbook repos | **Curate** claims and canonical links; do not mirror repository archives or infer client case studies |
| Future `content/computing/**` | Not yet implemented | Labs site for public presentation; Computing signs off on technical claims | **Draft-only** until reviewed brand, offer, scope, evidence and inquiry-contract records are approved |
| Future `content/labs/**` | Not yet implemented | Labs site | **Draft-only** until route/canonical strategy is approved; existing `/games/` and `/guides/` stay functional |
| `.github/workflows/pages-deploy.yml`, publisher build checks, release-manifest emission | Publisher repo | `ZQM-Computing/zqm-labs` | **Sole writer**; assembly and output validators retained; protected production approval remains separate |
| `scripts/check-guide-overlay.cjs`, `validate-pinned-player.sh`, live checks | Publisher repo | Publisher | **Preserve as regression evidence**; replace route-specific assumptions only when new checks prove equivalence |
| Future secure Computing inquiry Worker/email/queue | None authorized | Separate service with defined data steward | **Exclude from static artifact**; separate security/privacy approval; no customer messages in public build |

## Ownership conflict resolution — required before transition E

1. Generate a file-by-file comparison of the two Hugo trees at **immutable** refs. Tag each conflict `canonical`, `publisher-only legacy`, `player-owned`, `explicitly excluded`, or `unresolved`. Unresolved is a release blocker, not a default copy.
2. Capture current live routes, redirect destinations, HTTP statuses, media types and last-known-good deployment reference. Cover `/`, `/games/`, `/games/hunt-for-wisps/`, `/games/hunt-for-wisps/play/?demo=1`, `/guides/`, `/play`, `/tiers/`, `/pricing/`, `/privacy/`, `/terms/`, and every page linked from existing navigation/sitemaps; do not claim a complete inventory until crawl is recorded.
3. Compare generated **old composite vs candidate canonical** artifact by route, canonical, title, sitemap, redirect, headers, hashes, player/source marker, SW/precache and browser outcomes. Changes allowed only as reviewed deltas.
4. Preserve independent full-length site and player SHA pins and the single publisher workflow. Never turn on an alternate Pages production writer.
5. Place brand/offer/draft publication metadata on each new marketing route; the absence of an approval record defaults to excluded.
6. Require evidence that the approved Computing routes do **not** inherit Labs organization metadata, misstate professional qualifications, or inadvertently activate a customer-data endpoint.

## Proposed acceptance and handoff

- **Package A evidence:** Git-tree inventory, exact refs, overlay list, route/status baseline, ownership conflict register, redirect map and current production manifest snapshot. Current tree/overlay findings above are **partial Package A evidence**; live route crawl and full byte-level comparison remain outstanding.
- **Package B evidence:** the companion [publication manifest design](https://github.com/ZQM-Computing/zqm-labs/blob/docs/dual-brand-publisher-migration-20261107/docs/PUBLICATION_MANIFEST_SPEC.md), complete explicit inclusion/exclusion rules, forbidden-path tests and artifact provenance/rollback acceptance.
- **No automatic promotion:** Documentation review can be approved without authorizing runtime migration, production release, customer data collection, or an implicit bulk import.

Related drafts: [site architecture PR #93](https://github.com/ZQM-Labs/zqmlabs-site/pull/93), [Computing content PR #31](https://github.com/ZQM-Computing/ZQM-Computing/pull/31), [publisher PR #252](https://github.com/ZQM-Computing/zqm-labs/pull/252).
