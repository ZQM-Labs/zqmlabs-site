# Civic and social quest growth — release and measurement gates

**Status: site-source preparation, not a deployed conversion funnel.**

## Where the implementation lives

- This repository owns truthful public site content and potential SEO guides.
- [Organizer Toolkit](https://github.com/ZQM-Labs/organizer-toolkit) owns civic pilot intake, safe group procedures and signage.
- [Quest Packs](https://github.com/ZQM-Labs/quest-packs) owns versioned six-stop edition concepts and actual validated editions.
- [Quest Authoring](https://github.com/ZQM-Labs/quest-authoring) owns the six-stop SPEC v1 validator; do not alter it to offer unsupported game types.
- [Playtests](https://github.com/ZQM-Labs/playtests) owns exact-version device and field evidence.
- ZQM Computing's GIS/GeoAI educational content is independent; a cross-link does not make it a Labs product backend.

## Status and truthful offer contract

New pages describe **how to plan** civic/history, school, tourism and team
scavenger hunts, or how to inquire about a **prospective** pilot.
They do not assert cities have commissioned routes, that white-label
licenses are for sale, that local organizers may place signs without
permissions, or that future multiplayer works.

The Games directory must not label Pumpkin Roll or Snowflake Secret as
playable without deployable source, verified route, tested assets and a
release record. Wisp's Lost Lanterns is explicitly a past 2026 edition
with a browser demo; free demos and production purchases are separate.

## Single-writer site production gate

A successful build in this public site repository **does not publish**
zqmlabs.com. The current monorepo pin-and-copy production workflow in
ZQM-Computing/zqm-labs copies a selected subset of site content:
hugo.toml and eight top-level Markdown files. The new Guides pages are
outside that copy set as documented. Even if source PRs merge, a production
pin bump alone does not guarantee those new guide paths will be present.

Before calling any guide or offering live:

1. Confirm the exact production code for the composite copy operation and
   extend its allowlist in a separately reviewed monorepo PR if approved.
   Do not silently enable native Cloudflare Pages Git production builds.
2. Validate canonical routes, meta description, Open Graph, JSON-LD,
   internal-link targets, sitemap inclusion and noindex decisions against
   the actual assembled output.
3. Smoke test the public origin using cache-busted requests and captured
   exact deploy SHA. Fail the release if any new public CTA routes to 404.
4. Keep checkout/Stripe, hosted-game backend, paid deliverables, support
   capacity and fulfillment unchanged until separately verified.
5. Do not programmatically publish a city page without true locally
   reviewed route information and signed venue/partner permission.

## First conversion loop (no new tracking infrastructure required)

The initial content CTA is a scoped inquiry, not a checkout button.
A human can record anonymous aggregate counts without collecting
participant GPS trails or visitor identity in public GitHub files.

| Stage | Evidence | Denominator |
| --- | --- | --- |
| Organic discovery | Search-console landing-page impressions / clicks, where connected | Indexed page impressions |
| Interest | Aggregate verified guide visits or clicks, where permitted | Guide visits |
| Buyer inquiry | An organizer email explicitly asking for a scoped pilot | Distinct qualified inquiries |
| Discovery | Venue and requirements assessed by the Lab | Qualified inquiries |
| Scoped proposal | Written estimate with rights, dates and deliverables | Completed discovery calls |
| Accepted pilot | Signed authorization and independently verified payment | Sent proposals |

No conversion rate is measurable here yet. Do not count score copies,
social likes, trial map views, non-delivered purchases or hypothetical
white-label deals as closed revenue.

## Minimal outreach intake

Ask for organization, event purpose, venue/city, dates, rough group size,
ages/supervision, local permission status, access needs and approximate
budget range. Reply with **feasibility and next steps**, not a booking
confirmation, predetermined support promise or invented service area.

Security: do not commit customer details, student rosters, private
addresses, screenshots of messages or any payment credentials to a
public repository.
