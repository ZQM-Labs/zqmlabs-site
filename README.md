# ZQM Labs website source

**ZQM Labs — Z's Quests & Mischief**  
[zqmlabs.com](https://zqmlabs.com) · [GitHub organization](https://github.com/ZQM-Labs)

The canonical **Hugo website source for ZQM Labs (Z's Quests & Mischief)**, the community-centered game studio. It contains public pages and content for browser game demos, Halloween experiences, hosting tiers, pricing, organizer guidance, FAQs, and customer information. This repository's CI validates the site source; production content is published only through the separately documented pinned-source deployment flow.

ZQM Labs is a community-centered game studio. **Wisp's Lost Lanterns** is the
featured Halloween experience; the site can support additional games as they
become ready for public play. A featured page or browser demo does not by itself
prove that a game is orderable or approved for an in-person event.

## Repository role and status

**Status:** Active, public. Canonical website source for zqmlabs.com; deployment-critical.

**What this repository is:** The Hugo source and content for the public ZQM Labs website — pages, layouts, static assets, and the bundled player copy served under the site's game routes.

**What it contributes:** All customer- and organizer-facing public information for ZQM Labs lives here: the featured game, hosting and tiers pages, community and FAQ content. It is the public record of what the studio offers.

**Deployment:** This repo is the canonical site content source. The production deploy (ZQM-Computing/zqm-labs, `.github/workflows/pages-deploy.yml`) pins this repository by commit in `SITE_SOURCE_SHA` and builds the production site from that pin; the same workflow syncs the pinned quest-player source into the bundle (see `scripts/sync-player.sh`). Changes here go live only when the pin is bumped in the monorepo. The workflow in this repo (`site-ci.yml`) is validation only, not deployment.

## Audience and content boundaries

- **Visitors and customers:** explain what a game is, who it is for, what is currently available, how checkout works, and what happens after purchase.
- **Community organizers:** provide current hosting requirements, safety/accessibility guidance, kit contents, and support expectations.
- **Developers and maintainers:** use repository documentation, CI logs, and release records for implementation and validation details. Keep internal infrastructure details and Project Volusia research tooling out of public-facing copy unless explicitly approved.

The Project Volusia portal is an internal research/context system, not the public games website. Do not link visitors to internal portal views or treat portal documentation as public product documentation.

## Production deployment and CI

**Serving source of truth — verified 2026-10-20** (full evidence in the [deployment source-of-truth runbook](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/docs/deployment-source-of-truth.md)):

- **This repository does not deploy the site.** Its GitHub Actions workflow is validation-only (see below). Nothing in this repo publishes to production.
- **Production is built and deployed by the private monorepo `ZQM-Computing/zqm-labs`**, workflow `.github/workflows/pages-deploy.yml`. It builds the monorepo's nested `zqmlabs-site/` tree and deploys it with Wrangler to the Cloudflare Pages project `zqmlabs-site` (custom domains `zqmlabs.com` and `www.zqmlabs.com`).
- **Only part of this repository reaches production.** The monorepo workflow copies `hugo.toml` and exactly eight content files from this repository, at a pinned commit (`SITE_SOURCE_SHA` in the workflow; `6b6fdc78` as of 2026-10-20): `_index.md`, `about.md`, `halloween.md`, `tiers.md`, `faq.md`, `patterns.md`, `community.md`, `games.md`. Layouts, static assets, and every other content file in the deployed build come from the monorepo's own tree. The player bundle is synced the same way, from `ZQM-Labs/lantern-player` at `PLAYER_SOURCE_SHA`.
- **Consequence, verified live on 2026-10-20:** pages that exist only in this repository — `pricing.md`, `organizers.md`, `contact.md`, `press.md`, `direction.md`, and `content/games/lantern-player.md`, `pumpkin-roll.md`, `snowflake-secret.md`, `wisps-tracker.md` — are **not in the production build and return 404**, even though the site navigation links to `/pricing/` and `/organizers/` from every page. A full build of this repository yields 18 sitemap URLs; the live sitemap lists 9, matching the monorepo build's content inventory exactly.
- **To publish a new page**, do one of: (a) add the file to the sync list in the monorepo's `pages-deploy.yml`, or (b) mirror the file into the monorepo's `zqmlabs-site/content/` (the sync overwrites only the eight listed files; it does not clean the directory, so mirrored files survive). Then confirm the page appears in the live sitemap after a production deploy.
- **Resolved 2026-10-23 (single-brain rule):** the workflow deploys with `--branch=main`, and its direct uploads ARE the production deployments (verified by API rollback to them). The intermittent "second origin" seen on 2026-10-20 was Cloudflare Pages native Git builds; they are now permanently disabled for the apex project (`production_deployments_enabled: false`, guarded by an hourly automated check). Production has exactly one writer: the monorepo's composite pin build. See the runbook's 2026-10-23 resolution section and `docs/single-brain-architecture.md` in the monorepo.

The GitHub Actions workflow at
[.github/workflows/site-ci.yml](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/.github/workflows/site-ci.yml) is a **validation
workflow**, not a deployment workflow. It synchronizes the player source into
the site bundle, checks JavaScript syntax and script order, verifies service
worker precache files, builds the Hugo site, checks generated links, and
validates required routes and assets.

Production deployment runs through the monorepo workflow described above,
not through this repository. Do not infer a successful production deploy from
a green CI build here: this repo's CI can pass while production still serves
an older or partial build (as verified on 2026-10-20, when nine content
pages were missing from production despite existing here).

Still to record in the runbook when established:

- How a workflow deploy becomes the production deployment (the Wrangler
  deploy currently omits `--branch=main`)
- The identity and owner of the intermittent second origin
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

Repository evidence currently points to a **contact-first inquiry**, not a verified self-service checkout: [the published tiers page](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/content/tiers.md) asks customers to email for an event and wait for confirmation. A previous review referred to a fulfillment workflow at `.github/workflows/fulfill.yml`, but that path is not present in the current public repository. The current workflow inventory does not substantiate that description. Before relying on separate fulfillment automation, locate its authoritative source, review its permissions and payment-data handling, and verify an end-to-end test. Do not expose customer payment details in public issues.

If any of these details are unknown, mark them as unresolved in release notes and avoid implying the customer can complete an order. Do not present a manual email inquiry or direct payment link as checkout unless that is the approved and tested customer journey.

## Wisp's Lost Lanterns: availability and release status

The game is featured on the site, but its current release/field-readiness status must be established from dated evidence before the website claims that it is live, orderable, or approved for an in-person event. Keep these states distinct:

- **Demo:** a browser experience for exploration; not proof of an orderable kit.
- **Playtest:** a build being evaluated; not proof of production readiness.
- **Available for checkout:** product, price, payment, confirmation, and fulfillment have passed an end-to-end test.
- **Field-approved:** route/QR behavior, venue-specific content, sign placement, safety guidance, accessibility alternatives, and organizer instructions have been reviewed for the actual event.

The release record should identify the exact player and content versions, test date, supported devices/browsers, offline and update results, asset completeness, language coverage, checkout/fulfillment test, field validation evidence, approving owner, and withdrawal/rollback path. Unknown items remain **unknown** until evidence is recorded.

Public copy should describe current availability accurately. A global audience and community-centered design do not imply that every game, language, event kit, or in-person service is available worldwide.

## Installation

Clone the repo, and install Hugo Extended 0.165.0 and Node.js 22 — the versions the CI workflow uses:

```bash
git clone https://github.com/ZQM-Labs/zqmlabs-site.git
cd zqmlabs-site
```

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

## Usage

This repository is the source for zqmlabs.com. To work on it, see
[Build locally](#build-locally) for previewing changes, and
[Production deployment and CI](#production-deployment-and-ci) for how the
live site ships. Pages live under [Main pages](#main-pages).

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

- [quest-player](https://github.com/ZQM-Labs/quest-player) — the player PWA
- quest-analytics — organizer-dashboard capability; its source repository is private and is not linked from public documentation
- [quest-authoring](https://github.com/ZQM-Labs/quest-authoring) — quest pack spec, validator, and generator
- [quest-packs](https://github.com/ZQM-Labs/quest-packs) — ready-to-play quest packs
- [organizer-toolkit](https://github.com/ZQM-Labs/organizer-toolkit) — setup checklists, print specs, FAQ
- [playtests](https://github.com/ZQM-Labs/playtests) — playtest protocol and results

## License

MIT — see the [LICENSE file in this repository](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/LICENSE).

---

*Games, gear & a little mischief. Play more. Plan less.*
