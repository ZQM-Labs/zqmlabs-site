# Critical Hugo file reconciliation — decision register (v1)

**Status:** Draft planning evidence for site PR #93 and publisher PR #252; **no code, checkout, policy, or deployment changes authorized**. Read from currently accessible default-branch files on 2026-11-07/08. This is source review only, not an assertion of live production behavior.

## Evidence-driven decisions

| Path | Source observation | Proposed target decision | Required proof before migration |
| --- | --- | --- | --- |
| `layouts/_default/baseof.html` | Canonical and publisher Git blobs differ; canonical has Labs-specific default title, Organization JSON-LD and social image, publisher has different social card handling and additional layout/navigation styles. | **Reconcile manually** into single canonical brand-aware layout. Neither copy is automatically authoritative for the future site. | Correct `labs`/`computing` names, logo, title, JSON-LD, canonical/OG/Twitter and navigation on representative fixtures; current site route parity. |
| `layouts/index.html` | Canonical emphasizes direct Wisp demo and existing tier route; publisher uses collection-themed games CTA and a different hero image. | **Human review required.** New dual-brand homepage must preserve an immediate Wisp demo CTA while giving both brands equal prominence and Computing inquiries priority. | Browser/mobile/a11y hero tests; demo CTA resolves; explicit approval for changed marketing and visual content. |
| `static/_redirects` | The two inspected default branches have an **identical blob** with `/play`, `/play/*`, and `/games/lantern-player/index.html` redirects. | **Preserve canonical version initially.** This is low conflict but must be verified in the assembled/deployed artifact. | Actual 301 route chain, valid targets and browser query-string handling; compare live origin and deployment header behavior. |
| `static/_headers` | Distinct CSP/security headers. Canonical allows Google Fonts, broad HTTPS images, self-hosted frame ancestors, and geolocation; publisher allows OSM tile images, declares `payment=()` and uses different frame-src and CSP. | **Block automatic selection.** Establish a merged policy from actual runtime network and route requirements; retain protections and explicitly approve any broadened origin. | Browser CSP reports and all existing game flows, fonts/tiles, offline/PWA, privacy and secure form actions; verify output `_headers` at CDN. |
| `content/contact.md` | Canonical and publisher contain different illustrations, tier language and broad customer-response/booking claims. | **Rewrite by brand and verified availability**, retaining required contact route. Do not repeat unverified response-time or event availability promises. | Labs and Computing inquiry split, source-supported offers, valid mail/contact route and privacy copy. |
| `content/pricing.md` | Publisher version includes Stripe checkout URL front matter while canonical version is largely flat-fee descriptive pricing; wording/prices also require current verification. | **Do not bulk-promote either variant.** Treat checkout links, prices, discounts, tier availability and fulfillment claims as release-blocking commercial data requiring separate explicit approval. | Verified entitlement/Stripe fulfillment purchase-to-inbox workflow, offer-status review, safe pricing visibility, existing URL compatibility and no accidental new purchase path. |

## Prioritized manual resolution order

1. `static/_headers` and `content/pricing.md` first, due security and monetary implications.
2. `layouts/_default/baseof.html` and `layouts/index.html` next, as they control both-brand attribution and high-traffic navigation.
3. `content/contact.md` and routes, preserving brand separation and preventing premature activation of unapproved inquiry services.
4. `static/_redirects` verification and other linked assets with exact live response evidence.
5. Remaining `content/games/**`, `static/games/**`, `layouts/partials/**` and assets grouped by risk and source authority.

## Explicit design constraints

- Different Git blobs are not automatically discrepancies to fix: deployed source can be pinned at earlier commits, and intentional redesign differences are expected. Confirm live baseline and exact pinned source before deciding.
- Identical source redirect files do not prove Cloudflare has deployed those rules or that each target works.
- The current public web origin is `https://zqmlabs.com`; brand-specific routes must use that canonical origin without cross-labeling Computing as Labs.
- The static site cannot enable the proposed Computing inquiry backend; the processor requires an independent authorized security/reliability/privacy release.
- Preserve existing payment, entitlements and purchase-to-inbox gates. This planning PR must not edit Stripe links, price data, API routes, security headers or production manifests.

## Verification handoff

Add a reviewed decision and reviewer identity for each row, with immutable source refs, live route/header/SEO evidence, test references, status `blocked`/`approved`/`excluded`, and an exact artifact delta. In the absence of this proof, all material policy and checkout differences remain **blocked for automatic migration**.
