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

**What it contributes:** Selected public pages and configuration for ZQM Computing and ZQM Labs, including GIS services, game information and organizer resources. The publisher owns the remaining composite content; current offers must agree across both sources.

**Deployment:** This repo is the canonical site content source. The production deploy (ZQM-Computing/zqm-labs, `.github/workflows/pages-deploy.yml`) pins this repository by commit in `SITE_SOURCE_SHA` and builds the production site from that pin; the same workflow syncs the pinned quest-player source into the bundle (see `scripts/sync-player.sh`). Changes here go live only when the pin is bumped in the monorepo. The workflow in this repo (`site-ci.yml`) is validation only, not deployment.

## Buyer-intent content implementation

The [buyer-intent content briefs](docs/high-intent-content-briefs.md) link six page specifications and scoped implementation issues for the distinct Computing and Labs funnels. The [organic intent map](docs/organic-discovery-keyword-map.md) includes dated US estimates and primary-page ownership; proposed work is separate from source-merged and live content.

## Civic and group quest guides

The [civic and group quest conversion plan](docs/civic-quest-conversion-release.md) documents SEO guides, safe game-format distinctions, scoped organizer inquiries, and exact production release gates. The four selected guides were included in the November 16 verified production snapshot described below. Additional source pages remain unverified until selected and checked through the publisher. No new city route, white-label license, live multiplayer or payment offering is represented as available.

## Experimental content (not launched)

The [Daily Geo Mystery prototype](docs/daily-geo-mystery-experiment.md) is an isolated, no-backend browser experiment. It is not listed as playable or sold, and is not part of the Wisp player. Test and release gates are documented with the source.

## Audience and content boundaries

- **Visitors and customers:** explain what a game is, who it is for, what is currently available, how checkout works, and what happens after purchase.
- **Community organizers:** provide current hosting requirements, safety/accessibility guidance, kit contents, and support expectations.
- **Developers and maintainers:** use repository documentation, CI logs, and release records for implementation and validation details. Keep internal infrastructure details and Project Volusia research tooling out of public-facing copy unless explicitly approved.

The Project Volusia portal is an internal research/context system, not the public games website. Do not link visitors to internal portal views or treat portal documentation as public product documentation.

## Production deployment and CI

**Current contract — reviewed 2026-11-16:**

- This repository validates canonical source and does not publish production. The private `ZQM-Computing/zqm-labs` publisher assembles its Hugo tree using reviewed `SITE_SOURCE_SHA` and `PLAYER_SOURCE_SHA` pins.
- The publisher imports explicit groups of root, guide, comparison, Computing and Labs pages, plus selected configuration/layout/assets. Its `.github/workflows/pages-deploy.yml` copy lists are authoritative. Remaining pages can be publisher-owned, including pricing, organizer, contact and press content. Absence from the canonical import list does not establish a live 404.
- The October 20 eight-file import list, nine-URL sitemap count and missing-page observations are historical. They are not the current production inventory. Production run `43825765643` on November 16 checked the four selected guide routes, dual-brand/service routes and GIS resource canonicals after publishing site pin `336b269fa1ab374dcb25e93a846f03c00dd76ec4` with player pin `c1397093bb215bfb68edd615056e12c7310f1f25`.
- Production publication requires a main-branch manual dispatch through the approved publisher and its exact-commit gates. Push/PR builds are validation. Cloudflare native Git production publishing stays disabled; the publisher deploys with `--branch=main`. Do not create a competing writer.
- To publish a new page, first identify its owner, then update the explicit import where appropriate and add route/SEO/claim validation. Promote reviewed canonical main pins through the publisher and verify the live page, canonical, indexability, sitemap membership and release/source markers. Preserve rollback and fulfillment evidence.

The validation workflow in this repository builds and checks source; it does not prove what the live origin currently serves. Use the current publisher workflow and dated release evidence for production state. A local or canonical-only build can contain pages outside the selected production overlay.

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
