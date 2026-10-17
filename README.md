# ZQM Labs website source

This repository contains the public website content and Hugo source for
**ZQM Labs — Z's Quests & Mischief**.

ZQM Labs is a community-centered game studio. **Wisp's Lost Lanterns** is the
featured Halloween experience; the site is structured to support additional
games as they become ready for public play.

## Production deployment and CI

The production hosting and DNS configuration still need live verification. Use `docs/deployment-source-of-truth.md` to record the actual provider/project, deployment trigger, deployed commit, canonical player source, and rollback procedure.

The GitHub Actions workflow at
[`.github/workflows/site-ci.yml`](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) is a **validation
workflow**, not a deployment workflow. It synchronizes the player source into
the site bundle, checks JavaScript syntax and script order, verifies service
worker precache files, builds the Hugo site, checks generated links, and
validates required routes and assets.

Production deployment is configured outside that workflow. Repository
documentation has described Cloudflare Pages as the production host, but this
README alone does not establish the currently active Pages project, production
branch, deployment trigger, or deployed commit. Before changing production,
verify those values in the deployment configuration and compare the deployed
artifact with the source revision. Do not infer a successful production deploy
from a green CI build.

Record the following when the deployment path is verified:

- Hosting provider and exact project/site identifier
- Production branch and build command
- Whether deployment is triggered by Git integration, a workflow, or a manual command
- The source commit and deployed artifact identifier
- Smoke-test and rollback procedures
- Who owns access and production changes

Do not create a competing deployment path without updating this runbook and
the repository architecture map.

The public copy should describe current availability accurately. A global
audience and community-centered design do not imply that every game, language,
event kit, or in-person service is available worldwide.

## Build locally

Install Hugo Extended version 0.165.0 and Node.js 22 to match the CI workflow.

```sh
hugo --gc --minify
hugo server -D
```

To refresh the bundled player before a local build:

```sh
bash scripts/sync-player.sh main
```

The sync command retrieves the player from its named branch. For reproducible
release work, record the player commit used and verify that the synchronized
files match the intended release; a moving branch name is not an immutable
version identifier.

## Validation

Run the same key checks used in CI before proposing a change:

1. Sync the intended player source.
2. Run Node.js syntax checks on the player scripts.
3. Verify script load order and service-worker precache files.
4. Build the Hugo site with minification.
5. Run the built-link checker.
6. Verify required routes, navigation, and key assets.

The CI workflow is the executable source for the current automated checks.
When adding or removing a check, update this section so it remains aligned.

## Main pages

- Home: current featured game and studio overview
- Games: the growing collection of experiences
- Community: playtesting, feedback, and participation
- Halloween: the current Halloween game category
- Host a Game: current Wisp's Lost Lanterns hosting options
- About and FAQ: studio and availability details
