# ZQM unified public website — proposed architecture (ADR, planning only)

Status: **PROPOSED — no code, deployment, checkout, domain, or data-system changes authorized**. Date: 2026-11-07.

## Approved product decisions

- One domain, `zqmlabs.com`, with `/labs/` and `/computing/`; distinct commercial identities.
- Equal brand visibility in the homepage hero; Computing service inquiry CTAs take commercial priority; Labs demo access remains prominent.
- Canonical Hugo public source in this repository, pinned and published only via `ZQM-Computing/zqm-labs`; independent pinned `ZQM-Labs/quest-player`.
- First Computing offers: (1) preliminary environmental/parcel screening, (2) GIS automation/data engineering, (3) Web GIS and APIs.
- Labs free browser demo and organizer inquiries proceed in parallel; no new paid/game claims or operational integration.
- Computing lead generation: validated structured inquiry via isolated server endpoint, secure notification and explicitly defined failure/retention controls.
- Curated evidence-backed guides link to GitHub cookbooks; do not mirror or imply completeness of the entire catalog.

## Existing constraints and evidence

The canonical source currently holds Hugo content, layouts, assets and `scripts/check-generated-seo.cjs`, `scripts/check-built-links.mjs` and source/player checks. The production publisher currently copies selected pages and a reviewed guide allowlist into a separate site tree. Existing demo path `/games/hunt-for-wisps/play/?demo=1` and other live URLs must remain operational. The Computing profile repo has an unpublished `commercial-site/` Hugo preview with `publicRelease=false`, `noindex` and `example.invalid` base URL. Preserve these until approved publication.

## Target site information architecture

- `/`: two distinct brand cards with equal visibility; Computing service inquiry CTA placed first in commercial section, Labs demo play CTA obvious.
- `/computing/`: positioning, services, methods, evidence, and qualified contact.
- `/computing/services/environmental-screening/`: preliminary desktop GIS scope, source/coverage limitations, sample deliverables and inquiry.
- `/computing/services/gis-automation/`: reproducible workflow and QA deliverables.
- `/computing/services/web-gis/`: application/API scoping, security and operations.
- `/computing/guides/`: curated technical material with canonical cookbook links.
- `/labs/`: games/hosting/creator entry point; preserve existing `/games/`, demo URL, `/guides/`, `/tiers/` and other URLs unless intentional redirects are reviewed.
- `/contact/`: visibly separated Computing and Labs inquiry journeys.
A route map must distinguish existing URLs, new proposed URLs, aliases, redirects, and intentionally excluded drafts.

## Authoritative ownership (proposed)

| Surface | Authority | Publishing |
| --- | --- | --- |
| Public Hugo content/layouts/styles/brand metadata | `ZQM-Labs/zqmlabs-site` | Immutable approved site SHA |
| Computing service substance and supporting technical examples | `ZQM-Computing/ZQM-Computing` and named cookbook sources | Reviewed excerpts and curated outbound references only |
| Wisp browser player | `ZQM-Labs/quest-player` | Separate immutable player SHA |
| Cloudflare Pages production writer | `ZQM-Computing/zqm-labs` | Existing protected composite deployment |
| Private operations and paid entitlements | Existing separate systems | Never published in static marketing artifact |
| Computing inquiry processing | Proposed isolated service | Independently secured/released; not implemented here |

## Publication contract (design, not implemented)

Every marketing page shall declare `brand` (`labs`/`computing`/`ecosystem`), `publication_status` (`draft`/`review`/`approved`), owner, review date, and page-specific title/description. Offer pages additionally declare `offer_status` (`inquiry-only`/`demo`/`pilot`/`available`/`past`/`planned`) and supporting evidence identifiers. A production build must include only explicitly approved public material; a robots noindex tag is not a confidentiality boundary. Avoid global recursive copying without a reviewed inclusion/exclusion manifest and negative tests. Separate brand JSON-LD, social cards, canonicals and contact routes. Preserve authoritative source links.

## Secure Computing inquiry contract

Initial fields: name, email, optional organization, general project region, service category, project description, approximate timeline, privacy acknowledgement. No unsolicited uploads, parcel/customer private datasets, secrets or student records. Server-side schema and length validation, rate limits, abuse protection, safe encoding, restricted recipients, server-only mail credentials, minimal retention, and operator-visible delivery failures. A receipt requires a durable accepted submission or verified queue, never a merely attempted email. Do not connect publicly submitted text directly to Chiefs or internal privileged tools. Labs inquiries remain distinct.

## Dependency-ordered review packages (none authorized to implement)

A. Source/production route and SHA inventory; open PR conflict audit; reversible baseline.
B. Public/draft/experimental/paid asset publication manifest and fail-closed tests (depends A).
C. Shared Hugo components and brand-aware structured metadata (A,B).
D. Reviewed Computing scaffold content migrated as drafts (B,C).
E. Full approved canonical-site composition at pinned SHA; preserve independent player pin and sole publisher; artifact diff (B–D).
F. Dual-brand homepage and landing pages; preserve old URLs or reviewed redirects; mobile/a11y (C,E).
G. Three Computing service pages with evidence and limitations (D,F).
H. Isolated Computing inquiry service and verified form integration (F,G).
I. Labs game/hosting improvements and cross-brand SEO (F–H).
J. Reproducible integrated preview, exact-head required checks, rollback evidence and **separate** production authorization (E–I).

## Architecture acceptance criteria

- Every public artifact file traces to an approved source, with zero secret/private/paid assets and zero unexpectedly published drafts.
- 100% of required pre-existing routes resolve or have explicit reviewed redirects; zero broken built-site links.
- No change in production writer ownership, Cloudflare native Git deploy prohibition, independent site/player pin controls, or payment/fulfillment authorization.
- Exact pinned player browser/offline/service-worker regression suite passes; preview and deployed verification are separate.
- Both organization identities and metadata are correct; Computing three service pages have truthful scope/limitations and qualified CTA.
- Canonicals, JSON-LD, sitemap, redirects, robots, accessibility, and mobile semantics pass artifact tests.
- Form rejects invalid submissions and demonstrates abuse, notification, failure and privacy controls before any live activation.
- Release is blocked on missing/stale/red required checks, unresolved blocking reviews, or unverified rollback.

## Decision boundaries

This ADR is a review artifact. It does **not** approve a branch merge, site publication, production environment change, DNS change, payment change, or new customer data processing. Revisit scope and evidence at each package gate.

## Approved execution update — November 7, 2026

- **Allocation:** Plan and measure engineering effort at **50% ZQM Computing / 50% ZQM Labs** over each rolling four-week execution period. Track actual engineering hours, not PR counts, and reconcile deviations at the next planning review. Security incidents and already-required release gates may temporarily consume capacity without being concealed in the accounting.
- **Brand separation:** Computing owns geospatial services and reproducible products; Labs owns games, hosting and player experience. Maintain separate buyers, statuses, conversion events, data handling and financial attribution.
- **Commercial priority is not staffing priority:** Public marketing priority may place Computing inquiries first without implying more engineering capacity for Computing.
- **Implementation path:** Incremental review branches and private/preview builds first. Existing public routes, direct free Wisp demo, privacy controls and noindex/unpublished Computing preview stay unchanged until explicit artifact parity, source provenance and controlled release checks pass.
- **Promotion evidence:** Exact commit and immutable source SHAs, required CI and security results, representative end-to-end tests, rollback proof, negative publication checks, and paid entitlement → fulfillment → customer inbox proof whenever checkout or delivery is affected. Missing evidence blocks deployment; never infer release readiness from a build-only pass.
- **Scope of approval:** Authorize safely isolated implementation proposals and tests; this document does not authorize a production release, force merge, weaker branch protection, new paid infrastructure, credential rotation or trust-root changes.
