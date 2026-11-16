---
title: "Environmental GIS Maps and Preliminary Parcel Screening"
seo_title: "Environmental GIS Subcontracting & Parcel Maps | ZQM Computing"
description: "Environmental GIS mapping services for permit exhibits, QGIS parcel map series, data QA and preliminary desktop screening, scoped for consultant review."
service_type: "Environmental GIS map production and preliminary parcel screening"
breadcrumb_title: "Environmental GIS production"
---

## GIS figure production for environmental consulting teams

Need report figures while your GIS team is at capacity? Start with your figure list, source files and deadline. ZQM Computing scopes site maps, parcel map series, permit exhibits and data preparation for your consultant's review. Property buyers and planners can request a separate preliminary desktop review of mapped indicators.

{{< btn href="/computing/inquiry/#map-production" text="Send a figure-set brief" >}}

Before you scroll: the [six-parcel screening table, source register and downloadable fixture](#see-the-exhibit-structure) show the exhibit structure on synthetic parcels, with coverage gaps recorded as unknown — not as clear.

Delivered by [Alex Zelenski, GISP](/computing/alex-zelenski/) — Certified GIS Professional, GIS Certification Institute, current until January 2027.

[Inspect the synthetic sample](#see-the-exhibit-structure) · [Review the input checklist](#what-to-send-for-an-estimate).

## Your figure-set handoff

| Part of the scope | Agree before production | Check at handoff |
| --- | --- | --- |
| Figures | Figure index, page size, scale approach and intended use | Every agreed figure is present and labeled |
| Data and appearance | Provided sources, dates, CRS, symbology and title-block requirements | Source register, clear legends and explicit coverage gaps |
| Files | PDF exhibits and any supported editable GIS files | Files open in the agreed environment; filenames and IDs reconcile |
| Review | Named reviewer, QA checks and revision allowance | QA notes, unresolved questions and review changes are recorded |

Native file formats, client title blocks and CAD conversions require confirmation against your actual inputs and environment. The estimate identifies the included work, target dates and any separate data or support costs.

## Environmental GIS subcontracting for permit maps and figures

If your environmental consulting or engineering team needs additional GIS mapping capacity, ZQM Computing can scope **environmental permit map production, supporting GIS exhibits, parcel map series and data preparation** against your own figure list and review standards. This is a production handoff, not outsourced professional signoff.

Bring the figure list, available inputs, required formats and reviewer. Depending on the agreed scope, the handoff can include:

- Site-location, aerial-context, parcel, soils, wetland-indicator or flood-hazard exhibits.
- One page per parcel with a detail map, overview, legend, scale, source dates and clear coverage-gap labels.
- Prepared GIS layers with attribute/CRS checks, organized filenames and source provenance.
- A draft figure index, QA notes and identified missing or conflicting information.

Native editable files, CAD conversion, third-party data, page dimensions and revision allowance are scoped explicitly. The client retains responsibility for professional opinions, agency submissions and required sign-off.

### QGIS Atlas parcel map series

For a parcel portfolio, an Atlas can produce one consistently formatted page per parcel. Agree the coverage layer, unique parcel identifier, map theme, scale approach and figure index before production. Each page can carry an overview, source and retrieval dates, constraint flags, scale bar and the screening limitations appropriate to the work.

The delivery manifest ties each page to its parcel ID, data sources, CRS and generation date. Layer names and legends are prepared for the intended reviewer. Coverage gaps remain explicit in the exhibit and QA notes.

## Preliminary desktop screening

Begin with the project boundary and the question the screening should support. Possible outputs include a context map, source-by-source screening matrix, retrieval dates and a concise summary of mapped indicators and follow-up questions.

Coverage is checked before interpreting a missing intersection. Missing or unverified source coverage remains unknown; it is not a finding that a parcel has no constraints.

## Map-production checklists and buyer resources

- [Environmental permit map checklist](/computing/resources/environmental-permit-map-checklist/) — figure index, source register, QA and handoff records.
- [QGIS Atlas parcel map series](/computing/resources/qgis-atlas-parcel-map-series/) — coverage layer, unique parcel IDs, PDF export and reconciliation.
- [Desktop wetland screening vs. field delineation](/computing/resources/desktop-wetland-screening-vs-delineation/) — distinguish mapped indicators from site observations and regulatory decisions.

These resources are practical specifications, not substitute permits or completed-client examples. A [GIS production resource index](/computing/resources/) groups them for consultant reviewers.

## See the exhibit structure

This preview is drawn from the six-parcel synthetic fixture in the [reproducible QGIS Atlas workflow](https://github.com/ZQM-Computing/qgis-resources/tree/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production). That workflow generates the QGIS project, layout, PDF series and delivery manifest. The figure below shows DEMO-P1 and DEMO-P2 as the illustrated pair, and the table that follows gives the full six-parcel fixture; it is not a QGIS PDF export or a client case study.

<!-- Static, accessible fixture illustration; inline SVG travels with the selected page. -->
<!-- markdownlint-disable MD033 -->
<figure style="margin:1.2rem 0">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 460" width="720" height="460" role="img" aria-labelledby="parcel-sample-title parcel-sample-description" style="max-width:100%;height:auto">
<title id="parcel-sample-title">Synthetic parcel indicators and unknown source coverage</title>
<desc id="parcel-sample-description">Two adjacent 100 by 100 metre synthetic parcels in EPSG:32617, DEMO-P1 and DEMO-P2, the illustrated pair from the six-parcel fixture; the table below the figure covers DEMO-P1–P6. DEMO-P1 has 50 percent mapped wetland overlap and complete fixture source coverage. DEMO-P2 has no wetland coverage, 50 percent flood coverage and 25 percent known flood overlap. Hatching marks areas unknown for at least one source; no real property is represented.</desc>
<defs><pattern id="parcel-unknown-hatch" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M-2,2 L2,-2 M0,10 L10,0 M8,12 L12,8" stroke="#334155" stroke-width="1"/></pattern></defs>
<rect width="720" height="460" rx="12" fill="#f1f5f9"/>
<g font-family="Arial, sans-serif" fill="#132c3d">
<text x="28" y="35" font-size="24" font-weight="700">Synthetic fixture: indicators and coverage gaps</text>
<text x="28" y="61" font-size="16">No real property or agency datasets. Desktop demonstration only.</text>
<text x="240" y="85" font-size="18" text-anchor="middle">DEMO-P1</text>
<text x="480" y="85" font-size="18" text-anchor="middle">DEMO-P2</text>
<path d="M360,334 L360,94 L120,94 L120,334 L360,334 Z" fill="#ffffff"/>
<path d="M600,334 L600,94 L360,94 L360,334 L600,334 Z" fill="#ffffff"/>
<path d="M120,334 L120,94 L240,94 L240,334 L120,334 Z" fill="#d08a42"/>
<path d="M480,334 L420,334 L420,94 L480,94 L480,334 Z" fill="#187ea6"/>
<path d="M360,94 L480,94 L600,94 L600,334 L480,334 L360,334 L360,94 Z" fill="url(#parcel-unknown-hatch)" fill-rule="evenodd"/>
<path d="M360,334 L360,94 L120,94 L120,334 L360,334 Z" fill="none" stroke="#132c3d" stroke-width="3"/>
<path d="M600,334 L600,94 L360,94 L360,334 L600,334 Z" fill="none" stroke="#132c3d" stroke-width="3"/>
<path d="M650,154 L650,106 M640,121 L650,106 L660,121" fill="none" stroke="#132c3d" stroke-width="3"/>
<text x="650" y="180" font-size="16" text-anchor="middle">Grid N</text>
<path d="M120,357 L120,367 L240,367 L240,357 M240,367 L360,367 L360,357" fill="none" stroke="#132c3d" stroke-width="3"/>
<text x="120" y="390" font-size="16" text-anchor="middle">0</text><text x="240" y="390" font-size="16" text-anchor="middle">50</text><text x="360" y="390" font-size="16" text-anchor="middle">100 m</text>
<text x="600" y="383" font-size="16" text-anchor="end">Fixture CRS: EPSG:32617</text>
<rect x="28" y="410" width="20" height="18" fill="#d08a42"/><text x="57" y="425" font-size="17">Wetland indicator</text>
<rect x="250" y="410" width="20" height="18" fill="#187ea6"/><text x="279" y="425" font-size="17">Flood indicator</text>
<rect x="465" y="410" width="20" height="18" fill="url(#parcel-unknown-hatch)" stroke="#334155"/><text x="494" y="425" font-size="17">Coverage unknown</text>
</g></svg>
<figcaption>Synthetic parcels only. Hatching means coverage is unknown for at least one source; it does not mean a site is clear or that a constraint is confirmed.</figcaption>
</figure>
<!-- markdownlint-enable MD033 -->

A 0% overlap at 100% coverage is a mapped result; the same 0% at 0% coverage is unknown, not clear. Every parcel is 100 × 100 m = 10,000 m² (2.471 acres), EPSG:32617.

| Synthetic parcel | Wetland overlap | Wetland coverage | Flood overlap | Flood coverage |
| --- | --- | --- | --- | --- |
| DEMO-P1 | 5,000 m² (50%) | 100% | 0 m² | 100% |
| DEMO-P2 | 0 m² | 0% — unknown | 2,500 m² (25% known) | 50% |
| DEMO-P3 | 5,000 m² (50%) | 100% | 0 m² | 0% — unknown |
| DEMO-P4 | 2,500 m² (25%) | 50% | 2,500 m² (25%) | 100% |
| DEMO-P5 | 0 m² | 0% — unknown | 0 m² | 50% |
| DEMO-P6 | 10,000 m² (100%) | 100% | 2,500 m² (25%) | 100% |

| Source ID | Dataset | Accessed | Effective date | Accuracy |
| --- | --- | --- | --- | --- |
| SYNTH-PARCELS-2026 | parcel boundary (synthetic fixture) | 2026-11-02T12:00:00Z | unknown | unknown |
| SYNTH-WETLAND-2026 | wetland inventory | 2026-11-02T12:00:00Z | unknown | unknown |
| SYNTH-FLOOD-HAZARD-2026 | flood hazard | 2026-11-02T12:00:00Z | unknown | unknown |
| SYNTH-FLOOD-COVERAGE-2026 | flood hazard coverage extent | 2026-11-02T12:00:00Z | unknown | unknown |

Inspect the [fixture results](https://github.com/ZQM-Computing/qgis-resources/blob/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production/fixtures/geopandas-handoff/parcel_screening.json), [source register](https://github.com/ZQM-Computing/qgis-resources/blob/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production/fixtures/geopandas-handoff/source_register.json) and [reproduction/provenance notes](https://github.com/ZQM-Computing/qgis-resources/blob/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production/fixtures/README.md). Coordinates, source records and IDs are synthetic. Source dates in the fixture are example metadata; missing effective dates and accuracy remain unknown.

Download the fixture: [parcel_screening.gpkg](/computing/demonstrators/parcel-screening/parcel_screening.gpkg) — open in QGIS by drag-and-drop; 5 layers: parcels 6, wetland_indicator 4, flood_hazard 3, flood_coverage 5, source_register 4. [parcel_screening.geojson](/computing/demonstrators/parcel-screening/parcel_screening.geojson) — same 6 parcels, same attributes.

Synthetic fixture only. No real property or agency dataset is represented.

### Explore the six parcels interactively

<!-- markdownlint-disable MD033 -->
<iframe src="/computing/demonstrators/parcel-web-map/index.html" width="100%" height="560" title="Interactive map of the six synthetic screening parcels" loading="lazy"></iframe>
<!-- markdownlint-enable MD033 -->

[Open the interactive parcel map](/computing/demonstrators/parcel-web-map/index.html) (full size) if the embedded map does not load.

The map shows all six synthetic parcels with their wetland and flood screening numbers in click popups, toggleable wetland and flood overlays, and client-side-only KML/KMZ import — nothing is uploaded. Static front-end demonstration, not a live PostGIS application; a production version would be PostGIS-backed.

For a consultant-facing review, see the [synthetic Atlas figure-set handoff example](https://github.com/ZQM-Computing/qgis-resources/blob/1310eebcced32bf02e19d037548d57fe44ce5dd7/exhibit-production/BUYER_HANDOFF_SAMPLE.md) and [scope/acceptance worksheet](https://github.com/ZQM-Computing/qgis-resources/blob/1310eebcced32bf02e19d037548d57fe44ce5dd7/docs/ENVIRONMENTAL_GIS_BRIEF_TEMPLATE.md). They explain the requested figures, source-rights questions, coverage uncertainty, QA and quote factors. Both are written synthetic examples, **not** a pre-generated sample PDF, customer engagement or fixed-price offer.

## What to send for an estimate

- **The job:** report or planning purpose, figure list or parcel count, intended scale and page dimensions.
- **The inputs:** general geography, available spatial/analytical files, coordinate systems, source dates and permission to use them.
- **The handoff:** required PDF/native formats, title block or style example, reviewing professional and target deadline.
- **The review:** known gaps, acceptance checks, revision needs and whether the work will repeat.

Send the non-sensitive outline first. File transfer and permitted handling are agreed before confidential inputs are shared. Fee, start date, delivery window and revision allowance are confirmed after the inputs and scope are reviewed.

## Define acceptance before production

Agree the figure index or screening question, source rights and coverage, CRS, intended scale, output formats, reviewer and revision limit. The delivery records sources, assumptions, QA findings and items requiring further review. Additional figures, replacement inputs or a changed analysis question are reviewed as a scope change before extra work proceeds.

**Desktop limitations:** This work is not a boundary survey, field wetland delineation, jurisdictional determination, Phase I environmental site assessment, engineering opinion, legal determination or regulatory approval. Public data and parcel boundaries can be incomplete, outdated or misaligned. Field verification and qualified professional review may be required.

**Regulated-practice boundary:** If a requested figure would establish or reestablish legal property lines, certify elevations or grades, provide engineering design, reach a professional geologic conclusion or make a formal regulatory determination, the task requires a separate review of applicable licensing requirements before acceptance. Those tasks are not included by default. A client reviewer or final stamp does not by itself authorize ZQM Computing to perform regulated services. Tax-parcel and other reference geometries are mapped indicators, not certified surveyed boundaries.

One defined task at a time: scope, start date and availability are agreed in writing before work begins.

## Questions before a GIS production handoff

### Can you work from a consultant's figure list?

That is a useful starting scope. Provide the requested figures, page dimensions, available source files, symbology requirements, intended use and reviewer. Editable projects, source licensing and revision limits are agreed explicitly.

### Can you support figures for a Phase I or Phase II report?

GIS figure production can be scoped from your consultant's requested figures and supplied site or analytical information. Your consultant retains interpretation, assessment and sign-off responsibilities. Producing a map does not constitute performing an environmental site assessment, field investigation or regulatory determination.

### How much will the figures cost, and when can they be delivered?

Provide the figure list, source formats and requested deadline. The estimate depends on data readiness, figure complexity, required files and review allowance. Your written scope confirms the delivery window after that review.

### Does a map with no intersecting indicators clear a parcel?

No. A missing intersection is meaningful only within verified source coverage and the source's limitations. Unknown coverage is recorded as unknown. Desktop maps do not establish field conditions or regulatory status.

### What if the figure set needs recurring data updates?

An agreed [GIS workflow audit or spatial ETL pilot](/computing/services/gis-automation/) can assess the repeatable preparation and QA steps before the map series is refreshed.

[Send the general geography, requested figures and deadline](/computing/inquiry/#map-production). Availability, fee and final deliverables are confirmed after scope review.
