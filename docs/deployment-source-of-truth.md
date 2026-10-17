# Production deployment source-of-truth record

**Status: not yet verified against the live hosting account.** This record separates facts visible in the repositories from claims that require access to the production hosting and DNS configuration. Do not use the unresolved items as authorization to deploy or change DNS.

## Repository-verified facts

| Item | Finding | Evidence / limitation |
|---|---|---|
| Website source | This repository contains the Hugo website source and validation workflow | See [site CI](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) |
| CI behavior | The checked-in site workflow validates JavaScript, player synchronization, the Hugo build, generated links, and required routes; it contains no production deployment step | A green CI run does not prove that production was deployed |
| Standalone player repository | [ZQM-Labs/lantern-player](https://github.com/ZQM-Labs/lantern-player) is the standalone player repository | The monorepo also contains a player copy; production's selected source has not been independently verified |
| Competing deployment path | The private ZQM-Computing/zqm-labs monorepo contains a server-oriented deployment script | Its existence does not prove that it currently serves the public domain |
| Historical Pages references | Other repository documentation describes Cloudflare Pages and a manual Wrangler deployment | These are repository claims, not live account evidence; the deployment output and trigger must be checked in the actual account |

## Required live verification

Complete this table from the production hosting account and public DNS. Use exact identifiers and timestamps; do not copy credentials, API tokens, or secret environment-variable values into this file.

| Field | Verified value | Evidence to record |
|---|---|---|
| Public hostname | zqmlabs.com is the intended public hostname; current response and DNS state still require verification | DNS record type/target, custom-domain status, HTTP response, verification timestamp |
| Hosting provider and project | **Unverified** | Provider, exact project/site name, project URL |
| Production branch | **Unverified** | Configured branch and repository URL |
| Build command and output directory | **Unverified** | Exact command, output path, Hugo version, relevant non-secret build settings |
| Deployment trigger | **Unverified** | Git integration, GitHub Actions, manual Wrangler, or another mechanism; identify the one authoritative production path |
| Last successful production deployment | **Unverified** | Deployment ID, source commit SHA, completion time, and deployed URL |
| Canonical player source | **Unverified** | Player repository and commit SHA actually included in the deployed artifact |
| DNS/custom-domain mapping | **Unverified** | Active CNAME/flattening record and Pages custom-domain binding, or the actual non-Pages origin |
| Rollback procedure | **Unverified** | Exact provider UI/CLI steps to restore the last known-good artifact and verify it |

## Verification procedure

1. Open the production hosting account and locate the project currently bound to zqmlabs.com. Do not infer the project from a repository name.
2. Confirm the custom-domain binding and current DNS record. Record the visible target; do not attempt to discover or bypass a private origin.
3. Confirm the connected repository, production branch, build command, output directory, environment settings, and deployment trigger.
4. Compare the latest successful deployment's commit SHA with the intended source revision. If the player is synchronized from a moving branch, record the resolved player commit included in the build.
5. Download or inspect the deployed artifact where the provider supports it. Confirm that required routes and player assets match the source commit.
6. Test the public hostname from a normal browser and a clean mobile session. Check the homepage, game launch, player startup, and one offline/reload path where supported.
7. Identify the last known-good deployment and perform a documented rollback rehearsal in a preview/staging environment if one exists. Do not test rollback by changing production DNS.
8. Update this record with the verified values, evidence links, verifier, and timestamp. Re-run the verification after any hosting, branch, build, or player-source change.

## Release guardrails

- Do not equate a successful site CI run with a production deployment.
- Do not maintain two independently operated production deployment paths. If a secondary path exists for recovery, document it as a deliberate failover path with an owner and test.
- Do not switch the canonical player source until the deployed artifact and release process are verified.
- Keep secrets, access tokens, account credentials, and sensitive environment-variable values out of repository documentation.
- If production is currently deployed by a manual command, convert that process into a reproducible, reviewed deployment workflow only after the existing path and rollback behavior are confirmed.
