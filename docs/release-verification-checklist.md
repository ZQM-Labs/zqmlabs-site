# Public-site release verification checklist

Use this checklist when changing public content, game routes, player assets, or the production publishing workflow. The site source repository and the production deployment repository are not interchangeable: verify the current deployment workflow before assuming a change will ship.

## 1. Identify the authoritative source

- [ ] Record the source repository, branch, and exact commit SHA for the proposed change.
- [ ] Inspect the production deployment workflow in `ZQM-Computing/zqm-labs`, including its source pins and content/player sync steps.
- [ ] Confirm whether the changed path is included in the deployment sync. A file existing in this repository does not prove that it is included in the deployed build.
- [ ] If the path is not synchronized, prepare a corresponding change to the actual production build source or update the explicit sync configuration in a separate reviewed change.
- [ ] Do not change production pins or deployment behavior as an undocumented side effect of a content PR.

## 2. Validate the candidate

- [ ] Run the repository's documented CI and content checks.
- [ ] Build the Hugo site locally using the repository's pinned or documented Hugo version.
- [ ] Inspect generated routes and verify internal links resolve to generated pages.
- [ ] Confirm navigation does not link to pages that are absent from the production content inventory.
- [ ] Check canonical URLs, sitemap entries, page titles/descriptions, and robots/noindex behavior where applicable.
- [ ] For game/player changes, verify required scripts, styles, artwork, pack data, and fallback/error states are present in the actual bundle.
- [ ] Keep internal research portals, private customer materials, answer keys, and secrets out of public output.

## 3. Review before publication

- [ ] Review the diff for scope, correctness, accessibility, and unintended deletions.
- [ ] Confirm CI ran against the exact PR head SHA; do not rely on a green check from an earlier commit.
- [ ] Check the production workflow's permissions and target project before any deployment.
- [ ] Keep validation-only workflows separate from production deployment workflows.
- [ ] Require explicit approval for production changes; do not treat a merge or a preview deployment as proof of production publication.

## 4. Verify after deployment

Record the following in the PR or release evidence:

| Evidence | Record |
|---|---|
| Production deployment | Workflow run URL and result |
| Deployed source | Exact commit SHA and configured source pins |
| Public route checks | Routes checked and HTTP outcomes |
| Sitemap | Whether expected public routes are present |
| Browser smoke test | Device/browser and observed result |
| Rollback | Known-good deployment/source reference and recovery procedure |

- [ ] Open the actual production domain in a clean browser session.
- [ ] Check changed routes, primary navigation, and any game/demo entry point affected by the change.
- [ ] Confirm the sitemap reflects expected public routes; distinguish a 404 from a route that is intentionally private or unlisted.
- [ ] Verify service-worker/cache behavior if bundled assets or offline behavior changed.
- [ ] If verification fails, stop promotion, capture evidence, and follow the documented rollback process.

## 5. Report status precisely

Use one of these states in the PR:

- **Validated locally** — local checks completed; production behavior not established.
- **CI verified** — checks passed for the exact PR head SHA.
- **Preview verified** — a preview URL was tested; production is unchanged.
- **Production verified** — deployment evidence and live route checks are recorded.
- **Blocked** — name the missing permission, failed check, unverified source pin, or inaccessible evidence.

Never describe a page as live solely because it exists in this repository, or describe a deployment as healthy without checking the deployed source and public routes.
