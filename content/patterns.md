---
title: "Technical Resources"
description: "Public game-building and geospatial engineering resources from ZQM Labs and ZQM Computing."
---

## Technical resources

ZQM Labs publishes selected game-building resources. Technical and geospatial
engineering references are maintained separately under
[ZQM-Computing](https://github.com/ZQM-Computing), starting with the umbrella index
[geospatial-patterns](https://github.com/ZQM-Computing/geospatial-patterns). No
paywalls, no sign-ups — if the Lab learned it, you can have it.

### Game-building shelf

- [Quest packs and free sample content](https://github.com/ZQM-Labs/quest-packs) — versioned content packs; paid answer keys and private kit materials are not published here
- [Quest authoring specification and validator](https://github.com/ZQM-Labs/quest-authoring) — the format and validation rules for authored quests
- [Organizer toolkit](https://github.com/ZQM-Labs/organizer-toolkit) — setup instructions, QR generation, print specifications, and event-day troubleshooting
- [Playtest protocol and reports](https://github.com/ZQM-Labs/playtests) — playtest process and appropriately anonymized findings
- [Standalone Lantern player](https://github.com/ZQM-Labs/lantern-player) — source for the browser player/PWA; this source link does not imply that the dedicated `play.zqmlabs.com` hostname is live
- **Wisps Tracker** — a companion organizer-dashboard capability; its source repository is private and is not linked from this public resource index
- [Quest pack generator](https://github.com/ZQM-Labs/zqmlabs-site/blob/main/scripts/gen_quest_pack.py) — `scripts/gen_quest_pack.py` in the site repo; generates a playable quest pack HTML + manifest from a YAML config
- [ZQM Labs public website source](https://github.com/ZQM-Labs/zqmlabs-site) — canonical Hugo source for this site's public content

### The geospatial shelf

- [geospatial-patterns](https://github.com/ZQM-Computing/geospatial-patterns) — umbrella index and entry point
- [postgis-patterns](https://github.com/ZQM-Computing/postgis-patterns) — PostGIS indexing, joins, and tiles
- [duckdb-spatial-patterns](https://github.com/ZQM-Computing/duckdb-spatial-patterns) — DuckDB Spatial analytics SQL
- [geopandas-patterns](https://github.com/ZQM-Computing/geopandas-patterns) — GeoPandas and Shapely
- [geoparquet-patterns](https://github.com/ZQM-Computing/geoparquet-patterns) — GeoParquet columnar storage
- [gdal-patterns](https://github.com/ZQM-Computing/gdal-patterns) — GDAL/OGR CLI patterns
- [cog-patterns](https://github.com/ZQM-Computing/cog-patterns) — Cloud-Optimized GeoTIFF
- [h3-patterns](https://github.com/ZQM-Computing/h3-patterns) — H3 hexagonal grids
- [stac-patterns](https://github.com/ZQM-Computing/stac-patterns) — STAC catalog and discovery
- [maplibre-patterns](https://github.com/ZQM-Computing/maplibre-patterns) — MapLibre GL JS vector tiles
- [pgrouting-patterns](https://github.com/ZQM-Computing/pgrouting-patterns) — pgRouting network analysis
- [qgis-resources](https://github.com/ZQM-Computing/qgis-resources) — QGIS expressions, PyQGIS, and styles
- [geospatial-api-reference](https://github.com/ZQM-Computing/geospatial-api-reference) — OGC API reference (FastAPI + PostGIS)

### The machine room

- [ollama-fleet-patterns](https://github.com/ZQM-Computing/ollama-fleet-patterns) — local LLM fleet operations
- [proxmox-ceph-operations](https://github.com/ZQM-Computing/proxmox-ceph-operations) — Proxmox/Ceph runbooks

### Find the right starting point

- Want to play? Start with [Games](/games/) and the [browser demo](/games/hunt-for-wisps/).
- Want to create or host a quest? Start with the [organizer toolkit](https://github.com/ZQM-Labs/organizer-toolkit) and [quest authoring guide](https://github.com/ZQM-Labs/quest-authoring).
- Want geospatial engineering references? Start with [geospatial-patterns](https://github.com/ZQM-Computing/geospatial-patterns).
- Want the source for the public website? Visit [ZQM-Labs/zqmlabs-site](https://github.com/ZQM-Labs/zqmlabs-site).

Only public repositories intended for public use are linked here. Internal Project Volusia portals and data pipelines are deliberately excluded. Dedicated `docs.zqmlabs.com` and `software.zqmlabs.com` hostnames should be linked here only after their separate public builds, access boundaries, and route health have been verified.
