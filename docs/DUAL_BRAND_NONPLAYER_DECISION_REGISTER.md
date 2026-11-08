# Proposed non-player migration decision register — 31 differing source blobs

**Status:** Draft design review only. No file selection, publication, merge, or deployment authorized. Source comparison: `DUAL_BRAND_FILE_INVENTORY.csv` in site PR #93 and immutable pin comparison in publisher PR #252. The 31 rows here exclude the **35 player-owned** files handled by the independently pinned `ZQM-Labs/quest-player`. A differing source blob does not prove a deployed output difference.

**Decision vocabulary:** `canonical-candidate` (preferred future owner, needs evidence); `review-and-merge` (manual content/design resolution); `preserve-live-route` (existing public URL contract); `release-blocked` (security/payment/availability); `verify-runtime` (must test behavior). These are *proposals*, not approved disposition.

## Content (19 differing files)

| File | Proposed treatment | Required review/test |
| --- | --- | --- |
| `content/_index.md` | review-and-merge | Equal Labs/Computing brand presence; Computing services CTA, immediate Wisp demo |
| `content/about.md` | review-and-merge | Clear brand-owner identity and verified claims |
| `content/community.md` | review-and-merge | Historic/pilot/planned status and no unverified hosting promises |
| `content/contact.md` | preserve-live-route; review-and-merge | Separate Labs and Computing inquiries; privacy and truthful response times |
| `content/direction.md` | review-and-merge | Publication decision and accurate roadmap status |
| `content/faq.md` | review-and-merge | Offer availability, payment and demo limitations |
| `content/games.md` | preserve-live-route; review-and-merge | Existing game discovery and demo navigation |
| `content/games/_index.md` | preserve-live-route; review-and-merge | Correct list-page layout and statuses |
| `content/games/hunt-for-wisps.md` | preserve-live-route; review-and-merge | Free demo remains one click; no invented availability |
| `content/games/lantern-player.md` | preserve-live-route; verify-runtime | Legacy player link and redirect target acceptance |
| `content/games/pumpkin-roll.md` | review-and-merge | Planned/nonplaying state retained unless separately evidenced |
| `content/games/snowflake-secret.md` | review-and-merge | Planned/nonplaying state retained unless separately evidenced |
| `content/guides/_index.md` | preserve-live-route; review-and-merge | Four selected-guide indexing/metadata regression contract |
| `content/halloween.md` | preserve-live-route; review-and-merge | Past-edition context; no implicit current booking |
| `content/organizers.md` | preserve-live-route; review-and-merge | Host inquiry, event support and eligibility |
| `content/patterns.md` | review-and-merge | Curated GitHub examples; Computing/Labs distinction |
| `content/press.md` | review-and-merge | Media usage rights and verifiable launch statements |
| `content/pricing.md` | **release-blocked** | Stripe links, public prices, coupons, payment→entitlement→inbox evidence |
| `content/tiers.md` | **release-blocked** | Tier prices and deliverability contract before promoting changed claims |

## Build configuration and layouts (9 differing files)

| File | Proposed treatment | Required review/test |
| --- | --- | --- |
| `hugo.toml` | canonical-candidate | Production base URL, menu routes, config compatibility and no unintended publication |
| `layouts/404.html` | review-and-merge | Not-found semantics, navigation and no indexing |
| `layouts/_default/baseof.html` | review-and-merge | Brand-aware JSON-LD, titles, social card, CSS, CSP compatibility and accessible navigation |
| `layouts/_default/list.html` | review-and-merge | Guide/game lists, breadcrumbs and pagination |
| `layouts/_default/single.html` | review-and-merge | Main content, structured data and brand-specific CTAs |
| `layouts/games/single.html` | review-and-merge | Existing game page/demo and asset references |
| `layouts/index.html` | review-and-merge | Equal brand hero, service CTA priority, Wisp direct demo |
| `layouts/partials/book-cta.html` | **release-blocked** | Checkout and booking claims, host inquiry-only fallback, current commercial contract |
| `layouts/shortcodes/dial.html` | review-and-merge | Existing four scare-level visual rendering and accessibility |

## Static policy and branding (3 differing files)

| File | Proposed treatment | Required review/test |
| --- | --- | --- |
| `static/_headers` | **release-blocked** | CSP source differences; route-specific fonts, map tiles, frame origins, permissions, player and form-action tests |
| `static/favicon.svg` | review-and-merge | Distinct Labs/Computing representation and existing icon compatibility |
| `static/img/dial1.webp` | verify-runtime | Image reference/asset rights and visual parity |

## Not part of the 31 differing-file count

- **35 player-area paths**: use only exact immutable player source. Old vendored or canonical copies must not win file precedence.
- **Publisher-only paths**: review existing live content, unique static assets, layouts, aliases and legal pages. Source-only presence does not prove they are published.
- **Canonical-only paths**: exclude by default until explicitly approved publication manifests and transitive dependencies resolve.
- **Computing `commercial-site/**`**: remains unpublished reference material, preserving `example.invalid` and noindex safeguards.
- **Identical `static/_redirects` files**: preserve version with tested live semantics, including `/play` legacy alias.

## Reviewer completion requirements

For every row add: exact pinned source SHA; current-production effective output and URL; target content owner; approved transform or preserve decision; privacy/rights and commercial claim review; artifact output path; test reference and result; human reviewer; decision timestamp. Any missing evidence remains `unresolved`, and nothing in this table is a merge or production release authorization.

The complete publisher migration must also prove that adding a canonical page does not activate forms, alter Checkout/Stripe, duplicate publication, change service-worker scope, bypass production approval, or accidentally publicize a draft.
