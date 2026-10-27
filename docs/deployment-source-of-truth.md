# Production deployment source-of-truth record

**Status: RESOLVED 2026-10-23 — see the resolution section below.** The
2026-10-18/20 investigation sections are kept unchanged as the evidence
record that led here.

## Resolution — single-brain rule (2026-10-23)

Owner decision (2026-10-23): **zqmlabs.com has exactly one production
writer ("single brain"): the composite pin build in `ZQM-Computing/zqm-labs`
(`.github/workflows/pages-deploy.yml`).** Canonical architecture document:
`docs/single-brain-architecture.md` in that repo. This repo remains the
source of truth for site *content*; it never deploys.

The open questions from the 2026-10-18/20 investigation are now answered:

- **Production promotion path — ESTABLISHED.** The workflow deploys with
  `wrangler pages deploy ... --branch=main`; those direct uploads are the
  production deployments. Verified operationally on 2026-10-23: production
  was rolled back to workflow deployments via the Pages rollback API and
  the live origin immediately served the pinned build
  (`lantern-v26` at `PLAYER_SOURCE_SHA` `661d762f`).
- **Second origin — IDENTIFIED.** It was Cloudflare Pages *native Git
  builds*. When `production_deployments_enabled` was switched on estate-wide
  on 2026-10-23, every merge to the monorepo triggered a native build of the
  nested `zqmlabs-site/` tree (the fuller page inventory — the same effect
  observed intermittently on 2026-10-20), which clobbered the composite
  production. Three live regressions that day (07:22, 11:35, 13:09 ET) all
  traced to native-build deployments; each was recovered by rollback to a
  composite deployment.
- **Final state:** `production_deployments_enabled: false` on the
  `zqmlabs-site` Pages project (set 2026-10-23 via API, verified by
  re-read). An hourly automated guard now reads the setting and raises a
  CONFIG-DRIFT alert if it is ever `true` again. **Do not re-enable it.**
- **Rollback procedure — ESTABLISHED.** Pages rollback (dashboard or API)
  to the last known-good deployment, then verify the live origin with a
  cache-busted fetch of `/games/hunt-for-wisps/play/sw.js` (cache name must
  match the pinned build). A `git revert` + push alone does not roll back
  production.
- **How to ship from this repo:** merge the content change here, then open
  a pin-bump PR in `ZQM-Computing/zqm-labs` updating `SITE_SOURCE_SHA` to
  this repo's new `main` HEAD. Nothing in this repo publishes to production.

## Repository-verified facts

| Item | Finding | Evidence / limitation |
| --- | --- | --- |
| Website source | This repository contains the Hugo website source and validation workflow | See [site CI](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) |
| CI behavior | The checked-in site workflow validates JavaScript, player synchronization, the Hugo build, generated links, and required routes; it contains no production deployment step | A green CI run does not prove that production was deployed |
| Standalone player repository | [ZQM-Labs/quest-player](https://github.com/ZQM-Labs/quest-player) is the standalone player repository | The monorepo also contains a player copy; production's selected source has not been independently verified |
| Production deployment workflow | The private `ZQM-Computing/zqm-labs` monorepo contains `.github/workflows/pages-deploy.yml`, which is configured to validate/build the nested Hugo site and deploy to Pages with Wrangler | Workflow configuration is verified; the latest successful GitHub Actions run and exact artifact-to-deployment correlation remain unverified |
| Historical Pages references | Other repository documentation describes Cloudflare Pages and a manual Wrangler deployment | These are repository claims, not live account evidence; the deployment output and trigger must be checked in the actual account |

## Remaining runtime and release verification

Configuration is partially verified above. Use exact identifiers and timestamps; do not copy credentials, API tokens, or secret environment-variable values into this file. Public HTTP behavior, the latest successful GitHub Actions deploy, and the exact artifact currently served remain unresolved.

| Field | Verified value | Evidence to record |
| --- | --- | --- |
| Public hostname | zqmlabs.com is the intended public hostname; current response and DNS state still require verification | DNS record type/target, custom-domain status, HTTP response, verification timestamp |
| Hosting provider and project | Cloudflare Pages project `zqmlabs-site`; custom domains `zqmlabs.com` and `www.zqmlabs.com` are active in the project configuration | Cloudflare account API read on 2026-10-18; this proves configuration, not successful browser delivery |
| Pages Git source / production branch | `ZQM-Computing/zqm-labs`, branch `main`, `root_dir: zqmlabs-site` | Cloudflare Pages project API read on 2026-10-18 |
| Pages build command/output | `hugo --gc --minify` / `public`; Hugo version is pinned to `0.165.0` in `.github/workflows/pages-deploy.yml` | Cloudflare project API and monorepo workflow; workflow execution on latest commit still needs verification |
| Deployment trigger | Monorepo `.github/workflows/pages-deploy.yml` is configured to run on main changes under `zqmlabs-site/**` or the workflow itself, validate/build, then call Wrangler for project `zqmlabs-site`. Separately, Pages Git integration is configured with `production_deployments_enabled: false`. | Source workflow + Cloudflare project API. These are two distinct mechanisms; do not enable Git integration or assume workflow succeeded without run evidence. |
| Latest successful deployment record | Cloudflare API returned canonical deployment ID `df26807e-d811-46fd-af33-0796a90bdaef`, commit `58e69e1e04838d3e7d603a12105d2a860d4962a1`, deployment URL `https://df26807e.zqmlabs-site.pages.dev`, final stage `deploy: success` at `2026-10-18T22:58:17Z`. The newer Git-triggered record for commit `a0e318640ce165fb9062542db15de8650b970725` was skipped with reason `production_deployments_disabled`. | Cloudflare API read on 2026-10-18; does not establish latest public route behavior or that the latest GitHub Actions run completed |
| Player source pin in current workflow | `ZQM-Labs/quest-player` commit `ab6fa4acb7d41d10a31878d614ebe70bb5a6bc22`; the workflow also pins public site content commit `8106d82d0450867d98a9654598f76b12b390d605` | `.github/workflows/pages-deploy.yml` on main. The actual contents of the recorded successful deployment still need artifact-level confirmation. |
| DNS/custom-domain mapping | Pages project lists `zqmlabs.com` and `www.zqmlabs.com`, both custom-domain bindings report active. Root and `www` DNS records were previously observed pointing to `zqmlabs-site.pages.dev`; refresh the DNS record before any change. | Cloudflare Pages project/domain API plus prior DNS read; public HTTPS behavior remains unverified |
| Rollback procedure | **Unverified** | Exact provider UI/CLI steps to restore the last known-good artifact and verify it |

## Runtime verification — 2026-10-20

Performed 2026-10-20 (EDT) after a full crawl of `https://zqmlabs.com` (every
internal link followed; status codes and page titles recorded) and a local
Hugo build of this repository at HEAD. This section records which repository
actually serves the site, with evidence.

### Determination: the monorepo serves the site; this repo supplies 8 files

| Question | Finding | Evidence |
| --- | --- | --- |
| Which repo deploys zqmlabs.com? | `ZQM-Computing/zqm-labs` (private monorepo), via `.github/workflows/pages-deploy.yml` | Workflow builds the monorepo's nested `zqmlabs-site/` tree and runs `wrangler pages deploy zqmlabs-site/public --project-name=zqmlabs-site`. This repo's workflows are CI-only (no deploy step). |
| What crosses over from this repo? | `hugo.toml` + 8 content files, at a pinned commit | Workflow env `SITE_SOURCE_SHA=6b6fdc78f5bade93234da136f1cd9bb00fd682a2` (2026-10-20T01:06Z, "fix(tiers): rewrite as raw markdown"); copy list: `_index.md about.md halloween.md tiers.md faq.md patterns.md community.md games.md`. Player: `PLAYER_SOURCE_SHA=71a7561aec817e1cc4506068456808efce9d132a` via `scripts/sync-player.sh`. (Supersedes the 2026-10-18 pins recorded above: site `8106d82d`, player `ab6fa4ac`.) |
| What does the deployed build contain? | The monorepo's layouts/static + the 8 synced files + the monorepo's own remaining content (incl. `content/games/hunt-for-wisps.md`, the only file in its `content/games/`) | Live sitemap lists exactly 9 URLs: `/`, `/about/`, `/community/`, `/faq/`, `/games/`, `/halloween/`, `/patterns/`, `/tiers/`, `/games/hunt-for-wisps/` — the monorepo build's content inventory. A local Hugo build of this repo at HEAD produces 19 pages / 18 sitemap URLs. |
| Which pages are missing from production? | `/pricing/`, `/organizers/`, `/contact/`, `/press/`, `/direction/`, `/games/lantern-player/`, `/games/pumpkin-roll/`, `/games/snowflake-secret/`, `/games/wisps-tracker/` — all HTTP 404 with the site's 404 page | All exist in this repo with publishable front matter (no drafts). `/pricing/` and `/organizers/` are linked from the global navigation on all 12 built pages; the game pages are linked from `/` and `/games/`. |
| Deploy trigger | Push to monorepo `main` touching `zqmlabs-site/**` or the workflow, plus manual `workflow_dispatch` (main only). **No schedule** (an hourly run is claimed in the monorepo's `zqmlabs-site/README.md`; the workflow on main has none). | Workflow source on main, read 2026-10-20. |
| Production promotion path | **Unverified.** The Wrangler command omits `--branch=main`, so workflow deploys land as Pages preview deployments. How the current production deployment was promoted is not established. | Workflow source; Pages Git integration previously recorded as `production_deployments_enabled: false`. |
| Second origin (intermittent) | **Observed, identity unconfirmed.** During the 2026-10-20 checks, `/organizers/` answered 404 -> 200 (correct page) -> 404 within seconds, and `/press/` and `/contact/` each answered both 404 and 200-with-404-body (cached soft-404, `Age` ~249700s) at different times. Some requests are intermittently served a fuller build resembling this repo's full build. | Repeated curl probes 2026-10-20 11:05-11:30 UTC. Candidates: the Cloudflare Tunnel origin (see the api.zqmlabs.com record), a manual Wrangler deploy from this repo (a `.wrangler` directory exists at this repo's root), or a stale Pages deployment still bound to a hostname. Do not treat the 404 set as fixed until the second origin is identified and retired or documented as failover. |
| External links | Healthy: 30/30 external links returned 200 in the crawl, including all four Stripe checkout links and all GitHub links. | Crawl 2026-10-20. |

### Fix paths for the missing pages

1. Add the missing files to the sync copy list in the monorepo's
   `pages-deploy.yml` (requires editing a workflow file), **or** mirror the
   files into the monorepo's `zqmlabs-site/content/` — the sync overwrites
   only its eight listed files and never cleans the directory, so mirrored
   files persist in the build.
2. Extend the workflow's route-verification step to require the new routes,
   so a future sync change cannot silently drop them again.
3. Add `--branch=main` to the Wrangler deploy (or document the actual
   promotion mechanism) so workflow deploys reach production deterministically.
4. Identify and retire (or document as deliberate failover) the second origin.

## Verification procedure

1. The project/source/build/branch and domain binding are now recorded above from the Cloudflare API; refresh them before any operational change.
2. Inspect GitHub Actions run history for `.github/workflows/pages-deploy.yml` and identify the most recent successful run, including runner, build, Wrangler deployment result, and source commit. Do not infer success from a Pages deployment record alone.
3. Compare the workflow run commit, pinned site/player revisions, Cloudflare canonical deployment commit, and current public artifact. Record any mismatch explicitly.
4. Test `https://zqmlabs.com/`, `https://www.zqmlabs.com/`, and `/games/hunt-for-wisps/play/` from a normal browser and clean mobile session. Verify final URL, status, page signature, player startup, required assets, and an offline/reload path where supported.
5. Test `https://api.zqmlabs.com/` independently. DNS presence alone does not prove the Worker/backend returns a healthy or intended response. Do not alter the route as part of this verification.
6. Identify the last known-good deployment and rehearse rollback in preview/staging if available. Do not test rollback by changing production DNS.
7. Update this record with evidence links, verifier, timestamp, and exact deployment IDs/SHAs. Re-run verification after any hosting, branch, build, or player-source change.

## Release guardrails

- Do not equate a successful site CI run with a production deployment.
- Do not maintain two independently operated production deployment paths. If a secondary path exists for recovery, document it as a deliberate failover path with an owner and test.
- Do not switch the canonical player source until the deployed artifact and release process are verified.
- Keep secrets, access tokens, account credentials, and sensitive environment-variable values out of repository documentation.
- If production is currently deployed by a manual command, convert that process into a reproducible, reviewed deployment workflow only after the existing path and rollback behavior are confirmed.
