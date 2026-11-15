---
title: "Environmental Permit Map Checklist"
seo_title: "Environmental Permit Map Checklist & GIS Exhibits | ZQM Computing"
description: "A consultant-facing checklist for environmental permit map exhibits: figure index, source dates, parcel boundaries, symbology, QA and GIS handoff."
breadcrumb_title: "Permit map checklist"
---

Environmental permitting teams frequently need **site-location maps, aerial exhibits, wetlands-indicator figures, flood-hazard context and parcel maps** assembled into a consistent review package. This checklist is for GIS production supporting a client's environmental report or application; **the responsible qualified professional reviews and signs off on any regulatory opinion or submission**.

## 1. Define each exhibit before drawing it

| Figure | Minimum agreed question | Common production checks |
| --- | --- | --- |
| Project location | Where is the project relative to roads, landmarks and jurisdictional context? | Site identity, scale and readable locator |
| Existing conditions / aerial | What imagery and mapped features provide context? | Imagery acquisition date, attribution and source limits |
| Parcel and project boundary | Which submitted geometry is the exhibit based on? | Parcel IDs, version, boundary status and CRS |
| Wetland-indicator map | Which published indicators overlap the area of interest? | Coverage, classification, source vintage and non-determination note |
| Flood-hazard context | What mapped hazard categories occur within the study area? | Effective source/date, mapped coverage and uncertainty |
| Site figure index | Which exhibit revision belongs to the review package? | Filename, parcel/site ID, figure number and reviewer status |

Not every report needs every figure. The client chooses the index, data sources, jurisdictional requirements, map scale and wording.

## 2. Create a source and coverage register

Before spatial intersection, record a row for each dataset:

| Field | Example (synthetic, not site evidence) |
| --- | --- |
| `source_id` | `wetlands_indicator_01` |
| `publisher` | Named public agency |
| `dataset_version` | Source release or download identifier |
| `retrieved_utc` | Actual download timestamp |
| `source_date` | Mapping or imagery vintage, if known |
| `coverage_status` | `complete`, `partial`, `unknown` |
| `crs` | Agreed coordinate reference system |
| `limitations` | Classification, alignment or currency caveats |

**Critical rule:** a parcel with no mapped intersection is not automatically free of constraints. Confirm source coverage and distinguish `none_mapped_in_covered_area` from `coverage_unknown`. The U.S. Fish and Wildlife Service explicitly warns that [National Wetlands Inventory data do not establish jurisdictional wetland boundaries](https://www.fws.gov/page/national-wetlands-inventory-frequently-asked-questions).

## 3. Establish pre-delivery QA

Use a documented review pass rather than relying on a visually attractive figure:

- **Geometry and provenance:** check null, invalid or duplicate site identifiers; agree which submitted boundary controls and retain earlier versions.
- **Cartography:** inspect title, legend, readable labels, scale, north indication where appropriate, projection statement and aerial attribution.
- **Data comparison:** review mapped extent, source coverage and symbology categories against the source register.
- **Page-to-data traceability:** ensure each PDF filename, figure index entry and optional editable GIS project refer to the same site ID and input revision.
- **Review signoff:** record draft/reviewed/accepted status, reviewer name or role, date and unresolved limitations. GIS QA is **not** a professional permit approval.

### Example acceptance record

A synthetic package could identify `FIG-02`, `PARCEL-0007`, boundary revision `B`, source register `sources.csv`, PDF `fig-02-parcel-0007.pdf`, editable QGIS project if contracted, and a named consultant reviewer. Missing source coverage is an explicit open item, not a silent green check.

## 4. Scope the handoff

A production agreement can list PDF page dimensions, editable QGIS or GeoPackage files, naming convention, figure count, revision allowance, turnaround, source licensing, data-use permissions and who performs final professional review. Parcel portfolios may benefit from a [QGIS Atlas map-series workflow](/computing/resources/qgis-atlas-parcel-map-series/).

**Scope boundary:** This checklist and GIS exhibit service are not field wetland delineation, a jurisdictional determination, a boundary survey, a Phase I ESA, or a regulatory opinion. See [desktop screening versus wetland delineation](/computing/resources/desktop-wetland-screening-vs-delineation/) before interpreting indicator data.

To request consultant-reviewed exhibits, [scope an environmental GIS figure set](/computing/inquiry/#map-production). [View ZQM Computing's service description](/computing/services/environmental-screening/) and the [source-linked professional portfolio](/computing/portfolio/).
