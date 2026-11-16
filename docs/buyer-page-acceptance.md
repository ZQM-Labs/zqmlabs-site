# Buyer-page implementation and market reference points

Date: November 16, 2026 UTC. Status: source implementation for review; production publication and commercial outcomes require separate evidence.

This change improves existing buyer paths. The reference points are observable practices on a small set of supplier pages, not an industry certification or evidence of higher rankings.

## Competitive practices and resulting changes

| Reference point | Buyer need addressed | Implementation |
| --- | --- | --- |
| [A3 Environmental](https://a3e.com/) lists environmental CADD/GIS support | Understand the production task being purchased | Figure handoff table, required inputs, supported-format confirmation, professional-review boundary and written scope |
| [Goosechase pricing](https://goosechase.com/pricing) distinguishes event licensing and participation | Compare the work and billing unit as well as the price | Explain finished Wisp kit versus builder/city/facilitated formats without claiming exclusive browser access |
| [Let's Roam pricing](https://www.letsroam.com/team-building/pricing) shows a pricing basis and asks for event requirements | Understand total preparation and provide a useful first inquiry | Existing pricing page answers office kit cost, separates organizer work, and requests group, date, location and support needs |

These observations do not establish competitor profitability, market share, ZQM capacity or a universal event-cost floor. No new keyword metrics, pricing tests or competitor prices are introduced by this change.

## Buyer-path acceptance

- The Computing hub explains the brief, written scope, preparation and reviewed handoff.
- Environmental GIS identifies figures, source readiness, output/native formats, title-block feasibility, QA, revisions and timing agreed after scope review.
- The environmental service exposes a synthetic fixture preview and links to its pinned data, source register and reproduction notes.
- Automation displays the existing synthetic sample's 8 input / 2 accepted / 6 rejected rows, separately from any customer or savings claim.
- Web GIS defines user-task, interface, deployment and operator acceptance without assuming hosting or ongoing support.
- Inquiry remains readable, service-specific and email-based, with a copyable map brief and a clear explanation of what the estimate covers.
- Pricing retains Family Night $49, Community $199, Office Team $349 and Office Event $499. Existing purchase identities remain on tiers; the cost answer adds no payment link or new offer.
- Kit story, organizer preparation, venue/window confirmation, unverified leaderboard availability and in-development editions are stated consistently.

## Synthetic preview provenance

The inline SVG depicts actual geometries from the public [QGIS handoff fixture](https://github.com/ZQM-Computing/qgis-resources/tree/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production/fixtures/geopandas-handoff), pinned at `341e3376aa89c1e210727c2876ab5776e72130a0`.

- Source: `parcel_screening.gpkg`, 139,264 bytes.
- SHA-256: `fe3e1feec84872f7657d5f85f3b5f16faa193013953de1edd17eb22533350dab`, verified against its committed exhibit manifest.
- CRS: EPSG:32617; two adjacent synthetic 100 × 100 metre parcels.
- DEMO-P1: wetland mapped overlap 50%, both sources fully covered in the fixture.
- DEMO-P2: wetland source coverage absent; flood coverage 50%, known flood overlap 25% of the parcel.
- Hatching is the union of areas with missing coverage for at least one source. It remains above indicator fills so unknown information stays visible.
- The SVG is a view of the pinned fixture. It is not a QGIS-generated PDF, a real property review or client work. Its percentages are also provided in a normal HTML table.

The [workflow QA summary](https://github.com/ZQM-Computing/ZQM-Computing/blob/870e6138f47e71d2b23676dc0fae373c1f0e588f/docs/services/examples/gis-workflow-qa-synthetic-sample.md) is pinned at `870e6138f47e71d2b23676dc0fae373c1f0e588f`. Its row totals reconcile; rejection-reason totals may overlap and are not another count of rows.

## Source and publisher ownership

The existing publisher imports the five changed Computing pages at its reviewed canonical source pin. The inline figure travels with that selected content; it requires no new asset import, external image request, script or tracking dependency.

The publisher currently owns its pricing page. Its matching pricing change must be reviewed separately in `ZQM-Computing/zqm-labs`; this repository retains an identical preview copy. A canonical source merge alone does not publish either change. Keep the existing manual publisher, reviewed main-source pins, exact-commit checks and rollback evidence.

## Verification record

Record the implementation PR head, applicable build/tests, generated SEO and internal-link checks, source/price boundaries, and the matching publisher pricing blob before source promotion. The existing leaderboard assertion now rejects an unverified included-feature promise rather than requiring an old speculative roadmap label. It does not relax a runtime, payment or security gate.

No connected Search Console baseline, new qualified inquiry, fulfilled order, AI citation improvement or ranking gain is claimed by this implementation. True customer proof, delivery timing, first-party measurement and published-origin verification remain separate work.
