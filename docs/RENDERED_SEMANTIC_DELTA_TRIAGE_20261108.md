# Dual-brand release — rendered semantic delta triage (2026-11-08)

**Status: evidence-only, release-blocking differences unresolved.** Derived by inspecting actual archived publisher ZIP `13595969610` against archived preview ZIP `13619731964`. This is **not a fresh current-head build** or live CDN verification.

## Inventory of the 46 byte-changed files

| Classification | Files | Review required |
| --- | ---: | --- |
| Commercial/legal pages (contact, FAQ, organizers, pricing, privacy, terms, tiers) | 7 | High-priority human review for price, terms, data handling, intake and customer promises |
| Homepage and game pages | 7 | Game-state accuracy, CTAs, browser/demo access, supported routes, player link compatibility |
| Other HTML pages (guides, locations, about, community, others) | 27 | Titles/H1, source/body copy, canonical, locale, navigation and outgoing links |
| Feeds and non-HTML assets | 5 | Feed consistency and asset/content provenance |
| **Total** | **46** | **No blanket approval** |

The classification counts are based on file path/function, not evidence of a vulnerability or commercial breakage. 41 changed files are HTML; five are generated feeds or other assets. The differences below were measured by parsing the rendered archives for title, H1, meta description, visible main text, anchor destinations, currency-string sets, form counts and script-source sets.

## Priority observations

1. **Pricing and discount visibility:** `pricing/index.html` contains `$25` in the archived production main text, but not in the reviewed preview HTML; `tiers/index.html` also loses that visible amount. This alone does not establish that the old price is currently valid or that it should be restored. Independently verify the existing `FAMILY25` discount, applicable access window, refund terms and any grandfathered purchase promise before deciding the allowed content delta.
2. **Homepage intentional commercial changes:** `index.html` changes title, H1, description, links and visible amount set: archived output showed `$49/$199/$349/$499`, whereas the preview does not show those figures in main content. Evaluate against the approved equal-brand homepage and Computing-first inquiry CTA; do not classify this as a parity pass on intent alone.
3. **Game directory:** `games/index.html` changed title, H1 and description in the archived comparison. Follow-up PR #98 separately restores legacy SEO metadata and adds a built-page assertion. This older 46-file evidence must not be treated as verification of that newer exact head.
4. **Legal/inquiry pages:** `privacy/`, `terms/`, `contact/`, `faq/`, and `organizers/` have byte changes including altered links or headings; test consent, promises, privacy, checkout eligibility and legal copy against approved current terms before release. Absence of changed currency strings on some pages does not establish text equivalence.
5. **Game and route integrity:** Game detail, Lantern Player information page, Pumpkin Roll, Snowflake Secret and Wisps Tracker outputs changed. Verify whether the game/host/tool status remains accurate and preserve direct demo and legacy routes.
6. **Feed and media ownership:** `index.xml`, `games/index.xml`, `sitemap.xml`, `favicon.svg` and `img/dial1.webp` differ, with additional Computing/Labs feeds in the candidate. Review indexing and media license/accessibility separately.

## Release decision and verification method

A reviewer must explicitly approve or reject each changed output, with buyer-sensitive pages prioritized. Test rendered HTML, browser behavior, artifact digests, redirect targets, JSON-LD, social metadata, legal text, gameplay and payment/fulfillment separately. Excluding a route from the sitemap does not make it confidential. The publisher-generated release manifest must come from the authorized publisher and retain exact source pins.

**Stop conditions:** historical Gitleaks finding remains unresolved; per-route semantic approval incomplete; 39 static-file restoration is currently an offline feasibility exercise; live/origin, mobile, PWA/offline and paid-fulfillment tests are outstanding. No production release or checkout alteration is approved here.
