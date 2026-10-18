# Production deployment source-of-truth record

**Status: partially verified from repository and Cloudflare API evidence on 2026-10-18; public runtime and latest GitHub Actions deployment remain unverified.** No production configuration was changed. This record distinguishes configured hosting state from the artifact currently served to users.
||||||| parent of 07b6eeb (docs: record Cloudflare Pages audit snapshot)
**Status: not yet verified against the live hosting account.** This record separates facts visible in the repositories from claims that require access to the production hosting and DNS configuration. Do not use the unresolved items as authorization to deploy or change DNS.

## Repository-verified facts

| Item | Finding | Evidence / limitation |
|---|---|---|
| Website source | This repository contains the Hugo website source and validation workflow | See [site CI](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) |
| CI behavior | The checked-in site workflow validates JavaScript, player synchronization, the Hugo build, generated links, and required routes; it contains no production deployment step | A green CI run does not prove that production was deployed |
| Standalone player repository | [ZQM-Labs/lantern-player](https://github.com/ZQM-Labs/lantern-player) is the standalone player repository | The monorepo also contains a player copy; production's selected source has not been independently verified |
| Production deployment workflow | The private `ZQM-Computing/zqm-labs` monorepo contains `.github/workflows/pages-deploy.yml`, which is configured to validate/build the nested Hugo site and deploy to Pages with Wrangler | Workflow configuration is verified; the latest successful GitHub Actions run and exact artifact-to-deployment correlation remain unverified |
| Historical Pages references | Other repository documentation describes Cloudflare Pages and a manual Wrangler deployment | These are repository claims, not live account evidence; the deployment output and trigger must be checked in the actual account |

## Remaining runtime and release verification
||||||| parent of 07b6eeb (docs: record Cloudflare Pages audit snapshot)
## Required live verification

Configuration is partially verified above. Use exact identifiers and timestamps; do not copy credentials, API tokens, or secret environment-variable values into this file. Public HTTP behavior, the latest successful GitHub Actions deploy, and the exact artifact currently served remain unresolved.

| Field | Verified value | Evidence to record |
|---|---|---|
| Public hostname | zqmlabs.com is the intended public hostname; current response and DNS state still require verification | DNS record type/target, custom-domain status, HTTP response, verification timestamp |
| Hosting provider and project | Cloudflare Pages project `zqmlabs-site`; custom domains `zqmlabs.com` and `www.zqmlabs.com` are active in the project configuration | Cloudflare account API read on 2026-10-18; this proves configuration, not successful browser delivery |
| Pages Git source / production branch | `ZQM-Computing/zqm-labs`, branch `main`, `root_dir: zqmlabs-site` | Cloudflare Pages project API read on 2026-10-18 |
| Pages build command/output | `hugo --gc --minify` / `public`; Hugo version is pinned to `0.165.0` in `.github/workflows/pages-deploy.yml` | Cloudflare project API and monorepo workflow; workflow execution on latest commit still needs verification |
| Deployment trigger | Monorepo `.github/workflows/pages-deploy.yml` is configured to run on main changes under `zqmlabs-site/**` or the workflow itself, validate/build, then call Wrangler for project `zqmlabs-site`. Separately, Pages Git integration is configured with `production_deployments_enabled: false`. | Source workflow + Cloudflare project API. These are two distinct mechanisms; do not enable Git integration or assume workflow succeeded without run evidence. |
| Latest successful deployment record | Cloudflare API returned canonical deployment ID `df26807e-d811-46fd-af33-0796a90bdaef`, commit `58e69e1e04838d3e7d603a12105d2a860d4962a1`, deployment URL `https://df26807e.zqmlabs-site.pages.dev`, final stage `deploy: success` at `2026-10-18T22:58:17Z`. The newer Git-triggered record for commit `a0e318640ce165fb9062542db15de8650b970725` was skipped with reason `production_deployments_disabled`. | Cloudflare API read on 2026-10-18; does not establish latest public route behavior or that the latest GitHub Actions run completed |
| Player source pin in current workflow | `ZQM-Labs/lantern-player` commit `ab6fa4acb7d41d10a31878d614ebe70bb5a6bc22`; the workflow also pins public site content commit `8106d82d0450867d98a9654598f76b12b390d605` | `.github/workflows/pages-deploy.yml` on main. The actual contents of the recorded successful deployment still need artifact-level confirmation. |
| DNS/custom-domain mapping | Pages project lists `zqmlabs.com` and `www.zqmlabs.com`, both custom-domain bindings report active. Root and `www` DNS records were previously observed pointing to `zqmlabs-site.pages.dev`; refresh the DNS record before any change. | Cloudflare Pages project/domain API plus prior DNS read; public HTTPS behavior remains unverified |
| Rollback procedure | **Unverified** | Exact provider UI/CLI steps to restore the last known-good artifact and verify it |

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
