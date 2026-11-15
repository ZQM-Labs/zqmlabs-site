---
title: "QGIS Atlas for Parcel Map Series"
seo_title: "QGIS Atlas Parcel Maps: Workflow & QA Checklist | ZQM Computing"
description: "Plan a repeatable QGIS Atlas parcel map series using unique parcel IDs, coverage features, page naming, PDF export and a QA delivery manifest."
breadcrumb_title: "QGIS parcel Atlas"
---

A QGIS Atlas can generate a **consistent figure for each parcel, site or other coverage feature** while keeping map layout elements aligned. For consultant map production, the hard part is often not the export button: it is proving that the correct features, source vintages and reviewer notes appear on every page.

## 1. Define a coverage layer

Start with an agreed polygon or other supported coverage layer, a unique stable identifier and the authoritative version of that geometry. Check for duplicate IDs, empty geometry, invalid features and unexpected coordinate reference systems before rendering.

A synthetic input might contain:

| `parcel_id` | `figure_order` | `map_theme` | `review_status` |
| --- | ---: | --- | --- |
| `PARCEL-0007` | 1 | `wetland_context` | `draft` |
| `PARCEL-0012` | 2 | `flood_context` | `draft` |

These values are invented for explanation; they do not represent client property or measured conditions.

## 2. Configure an Atlas layout

QGIS's official [Atlas documentation](https://docs.qgis.org/3.44/en/docs/user_manual/print_layout/create_output.html) describes coverage layers, page names, filtering, sorting and output filename expressions. Configure those controls for the agreed project rather than depending on an incidental row order.

- Select the coverage feature layer and an explicit, stable sort field.
- Set the page name from the approved parcel ID, with a consistent naming convention.
- Set extent/scale rules for each figure. A fixed scale improves cross-parcel comparability; a feature-fit scale can improve legibility. Document the choice.
- Include an overview/locator, legend, scale bar where appropriate, readable source attributions and a data-gap note.
- Check whether to export a combined PDF or separate PDFs by parcel ID; record that expectation before delivery.

## 3. Build a page manifest

Every rendered page should reconcile to exactly one expected coverage feature, except exclusions that are separately authorized and logged.

| Manifest field | Purpose |
| --- | --- |
| `parcel_id`, `source_feature_id` | Identify the original coverage feature |
| `output_filename`, `figure_number` | Match the PDF to the approved index |
| `boundary_version`, `crs` | Explain the actual geometry and projection |
| `source_register_id` | Link to layer and imagery provenance |
| `qa_status`, `reviewer` | Distinguish generation from accepted work |
| `limitations` | Expose missing coverage or uncertain indicators |

The expected count is based on **eligible, reviewed coverage features**, not simply the number of files output. Investigate skipped features, reused filenames and duplicate pages.

## 4. Test before final handoff

Perform a sample inspection across small and large parcels, irregular boundaries, features near page edges, missing indicator coverage and long labels. For a final export, inspect the figure index, PDF page count, visual scale/legend, source-date display and delivered layer paths. Opening a QGIS project on the recipient's machine is a useful portability test when editable files are in scope.

A [synthetic QGIS parcel Atlas example](https://github.com/ZQM-Computing/qgis-resources/tree/341e3376aa89c1e210727c2876ab5776e72130a0/exhibit-production) demonstrates a project, layout template, PDF series and delivery manifest; **it is not a completed client engagement**.

## When an Atlas is the right subcontracting task

An environmental consultant with an approved figure list, source layers and parcel coverage can request GIS production and QA without delegating regulatory judgment. Start from the [environmental permit map checklist](/computing/resources/environmental-permit-map-checklist/) or [scope a parcel figure series](/computing/inquiry/#map-production). [ZQM Computing's environmental GIS service](/computing/services/environmental-screening/) describes the boundaries of this work.
