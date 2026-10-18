# ZQM Labs website source

This repository contains the public website content and Hugo source for
**ZQM Labs — Z's Quests & Mischief**. It is the canonical source for the public
ZQM Labs website and for customer- and organizer-facing information.

ZQM Labs is a community-centered game studio. **Wisp's Lost Lanterns** is the
featured Halloween experience; the site can support additional games as they
become ready for public play. A featured page or browser demo does not by itself
prove that a game is orderable or approved for an in-person event.

## Audience and content boundaries

- **Visitors and customers:** explain what a game is, who it is for, what is currently available, how checkout works, and what happens after purchase.
- **Community organizers:** provide current hosting requirements, safety/accessibility guidance, kit contents, and support expectations.
- **Developers and maintainers:** use repository documentation, CI logs, and release records for implementation and validation details. Keep internal infrastructure details and Project Volusia research tooling out of public-facing copy unless explicitly approved.

The Project Volusia portal is an internal research/context system, not the public games website. Do not link visitors to internal portal views or treat portal documentation as public product documentation.

## Production deployment and CI

The production hosting and DNS configuration still need live verification. Use the [deployment source-of-truth runbook](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/docs/deployment-source-of-truth.md) to record the actual provider/project, deployment trigger, deployed commit, canonical player source, and rollback procedure.

The GitHub Actions workflow at
[.github/workflows/site-ci.yml](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) is a **validation
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

## Checkout and purchase flow

**Product direction:** checkout is the intended booking/purchase model. This
does not establish that checkout is currently implemented, connected to a
payment provider, or ready for production. Public copy must describe only the
flow that has been tested and is currently available.

Before describing checkout as live, verify and record:

- The checkout provider and exact production/test configuration
- The products, prices, taxes/fees, and availability rules shown to customers
- Payment success, decline, cancellation, and retry behavior
- Order confirmation and customer-support contact path
- What is delivered after purchase, by whom, and on what timeline
- Cancellation, refund, rescheduling, and event-weather policies
- Privacy/data handling and any required consent
- A successful end-to-end test from product selection through confirmation and fulfillment

Repository evidence currently points to a **contact-first inquiry**, not a verified self-service checkout: [the published tiers page](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/content/tiers.md) asks customers to email for an event and wait for confirmation. The repository also contains a separate [fulfillment workflow](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/fulfill.yml) triggered by issues labeled `purchase` or `subscription`; it passes multiple cryptocurrency payment-rail secrets and a release URL named `zqm_attestation_release_package.zip`. The workflow references `scripts/fulfill_bot.py`, which was not found in the repository's current `scripts/` directory. This does not demonstrate a working checkout path and warrants owner/security review before the workflow is relied upon. Do not expose customer payment details in public issues.

If any of these details are unknown, mark them as unresolved in release notes and avoid implying the customer can complete an order. Do not present a manual email inquiry or direct payment link as checkout unless that is the approved and tested customer journey.

## Wisp's Lost Lanterns: availability and release status

The game is featured on the site, but its current release/field-readiness status must be established from dated evidence before the website claims that it is live, orderable, or approved for an in-person event. Keep these states distinct:

- **Demo:** a browser experience for exploration; not proof of an orderable kit.
- **Playtest:** a build being evaluated; not proof of production readiness.
- **Available for checkout:** product, price, payment, confirmation, and fulfillment have passed an end-to-end test.
- **Field-approved:** route/QR behavior, venue-specific content, sign placement, safety guidance, accessibility alternatives, and organizer instructions have been reviewed for the actual event.

The release record should identify the exact player and content versions, test date, supported devices/browsers, offline and update results, asset completeness, language coverage, checkout/fulfillment test, field validation evidence, approving owner, and withdrawal/rollback path. Unknown items remain **unknown** until evidence is recorded.

Public copy should describe current availability accurately. A global audience and community-centered design do not imply that every game, language, event kit, or in-person service is available worldwide.

## Build locally

Install Hugo Extended version 0.165.0 and Node.js 22 to match the CI workflow.

~~~sh
hugo --gc --minify
hugo server -D
~~~

To refresh the bundled player before a local build:

~~~sh
bash scripts/sync-player.sh main
~~~

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
Rendered-page, mobile, accessibility, payment, fulfillment, and field testing
are separate checks unless a workflow explicitly demonstrates otherwise.

## Main pages

- Home: current featured game and studio overview
- Games: the growing collection of experiences with explicit availability status
- Community: playtesting, feedback, and participation
- Halloween: the current Halloween game category
- Host a Game: current Wisp's Lost Lanterns hosting options
- About and FAQ: studio and availability details

## Related repos

- [lantern-player](https://github.com/ZQM-Labs/lantern-player) — the player PWA
- [wisps-tracker](https://github.com/ZQM-Labs/wisps-tracker) — team tracking backend
- [quest-authoring](https://github.com/ZQM-Labs/quest-authoring) — quest pack spec, validator, and generator
- [quest-packs](https://github.com/ZQM-Labs/quest-packs) — ready-to-play quest packs
- [organizer-toolkit](https://github.com/ZQM-Labs/organizer-toolkit) — setup checklists, print specs, FAQ
- [playtests](https://github.com/ZQM-Labs/playtests) — playtest protocol and results
