---
title: "Web GIS, Spatial Databases and Geospatial APIs"
seo_title: "Web GIS, PostGIS & Geospatial API Services | ZQM Computing"
description: "Scope a browser map, PostGIS integration or geospatial API around your users, data access and deployment requirements, with a documented technical handoff."
service_type: "Web GIS, spatial database integration and geospatial APIs"
breadcrumb_title: "Web GIS and spatial APIs"
---

## Make spatial data useful to the people who need it

Start with the user task: finding a location, exploring an approved dataset, querying a spatial database or connecting a map to an existing application.

{{< btn href="/computing/inquiry/#web-gis" text="Scope a Web GIS project" >}}

See the work before you brief it: [an accessible project map of six fictional projects](#see-an-accessible-project-map) — keyboard-navigable, WCAG 2.1 AA.

Delivered by [Alex Zelenski, GISP](/computing/alex-zelenski/) — Certified GIS Professional, GIS Certification Institute, current until January 2027.

## Define one useful interface

A scoped project can address a browser map, geographic search, spatial-data API, PostGIS data model or an integration with an existing application. Agree who will use it, which data they can access and what the interface must return.

Potential deliverables include an architecture/interface specification, a tested prototype or implementation, and documentation for deployment and operator handoff where agreed.

## Useful first project boundaries

- **One browser map:** an approved dataset, agreed filters or geographic search, readable legends and a defined mobile use case.
- **One spatial API:** named requests and responses, permitted users, example queries and documented error behavior.
- **One PostGIS integration:** an agreed schema and spatial queries, indexing appropriate to the workload and a documented application connection.

The handoff can include source code, environment instructions, interface documentation, representative tests and an agreed deployment or rollback guide. Data preparation can be scoped through a separate [GIS automation and QA pilot](/computing/services/gis-automation/).

## What your team accepts

| Decision | Define in the scope | Review before handoff |
| --- | --- | --- |
| User task | Named users, permitted data and one useful action | The agreed search, filter, map or query works with representative inputs |
| Interface | Data schema, requests/responses and error cases | Example queries and tests match the documented contract |
| Deployment | Prototype or production target; account and data ownership | Environment instructions and agreed deployment/recovery steps |
| Operation | Access controls, usage expectations, monitoring and support | A named operator and clear ongoing responsibilities |

The estimate separates the prototype or implementation from data preparation, hosting and maintenance. Required data rights, access, expected usage and review needs determine the fee and target dates. Changes to those assumptions are reviewed before extending the work.

## Plan the operating responsibilities

Establish authentication and authorization, data rights, geographic coverage, accessibility, performance expectations, caching, hosting, monitoring and rollback. A prototype and a production service have different acceptance requirements; ongoing operation and support are separately agreed.

One defined task at a time: scope, start date and availability are agreed in writing before work begins.

[Cookbook examples](#see-an-accessible-project-map) demonstrate individual patterns. They do not establish production availability, security certification, continuous hosting or suitability for regulated use. Third-party maps and data may impose licensing and usage limits.

## See an accessible project map

<!-- markdownlint-disable MD033 -->
<iframe src="/computing/demonstrators/project-map/index.html" width="100%" height="900" title="Accessible map of six fictional demonstration projects" loading="lazy"></iframe>
<!-- markdownlint-enable MD033 -->

[Open the accessible project map](/computing/demonstrators/project-map/index.html) (full size) if the embedded map does not load.

The map shows six fictional projects (P-01–P-06) driven by an editable CSV — [projects.csv](/computing/demonstrators/project-map/projects.csv): edit it and reload to update the markers, the project list and the filter. Markers are keyboard-navigable buttons with arrow-key movement between projects, and the full project list below the map carries the same information as a text alternative. Contrast is WCAG 2.1 AA (body text 17.40:1; worst passing pair 5.98:1 focus outline).

Fictional demonstration projects only — no real sites or clients. Demonstration contact only — no real client.

## Questions before a Web GIS project

### Do we need a custom web application?

Start with the user task and distribution requirements. A GeoPackage and QGIS project or a static map may be sufficient. A browser application is useful when the agreed users need shared access, interactive filtering or an application integration.

### Is hosting included?

Deployment target, account ownership, monitoring, operating costs and ongoing support are agreed in writing. A prototype demonstrates the scoped behavior; a production release also needs accepted access controls, recovery and operational ownership.

## Bring the users, data and target environment

[Send a non-sensitive project brief](/computing/inquiry/#web-gis) with the intended users, task, high-level sources, approximate usage, deployment preferences and constraints. Scope, fees, timing and availability are confirmed after review.
