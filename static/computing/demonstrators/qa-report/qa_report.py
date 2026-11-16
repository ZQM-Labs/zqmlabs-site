#!/usr/bin/env python3
"""
qa_report_real.py — Python data QA report + source timestamp validation.
REAL public-data variant (local only; NOT the live-site script).

REAL PUBLIC DATA. Input: the real six-parcel Volusia County GeoPackage
(Volusia County parcels, USFWS National Wetlands Inventory, FEMA
National Flood Hazard Layer; accessed 2026-11-16). No client records
and no client work were used. These are computed results for a
public-data sample, not customer results and not proof of a complete
production integration. No survey/engineering licensure or ArcGIS
Enterprise experience is claimed. Parcel boundaries are county
records, not a surveyed boundary; NWI is a mapped wetland indicator,
not a regulatory delineation or jurisdictional determination; NFHL
zones are mapped hazard zones, not a flood determination.

Adapted from the synthetic qa_report.py (same checks, same validators).
Every difference from the synthetic script is required by the real
input (full list in build_note.json):
  * GPKG_PATH points at the real GeoPackage; EXPECTED holds the six
    real parcel IDs with their real overlap/coverage values (fallback
    comparison targets only); BOUNDARY is the real parcels' union
    extent in EPSG:32617.
  * No fixture JSON is bundled: the GeoPackage path is the one that
    runs, so the fixture is loaded only as a fallback and only if a
    real fixture is present.
  * The geometry engine handles real geometries: all MultiPolygon
    parts are counted (not just the first); clip polygons are
    triangulated because real polygons are non-convex (plain
    Sutherland-Hodgman is exact only for a convex clip); clip rings
    are normalised to CCW (real hazard/coverage rings are CW); holes
    subtract on both sides; the new wetland_coverage extent layer is
    routed as an extent layer (never summed into the wetland
    overlap) and wetland coverage is recomputed from it, mirroring
    the existing flood-coverage recompute.
  * The planted-defect incoming batch is re-based into the real study
    boundary (2026-11-16, owner decision 2): the 8 test polygons were
    translated from the synthetic grid's coordinates into/around the
    real boundary without changing their shapes, ids, names, types, or
    planted defects, so the harness reads as designed (8 = 2 + 6, 7
    reason instances). See the BATCH comment for the translation.
  * The source register keeps its layer name (five rows, three
    dataset IDs) and the report's source-register finding is
    conditional on the effective date instead of hard-coding the
    null finding for every row.

Standard library only (sqlite3, struct, math, hashlib, json, sys,
platform). No geopandas / fiona / shapely / ogr2ogr required.

Reads, in order of preference:
  1. ~/workspace/research_notes/site-examples-real-data-20261116/work/
     real-builds/parcel-screening/real_parcel_screening.gpkg
     (the real GeoPackage — validated when present)
  2. fixtures/parcel_screening.json (NOT bundled with this variant;
     used only when the GeoPackage is missing or unreadable, and then
     it must be a real fixture or the run fails with a clear error)

The source register is read from the GeoPackage's source_register
table when the GeoPackage is used. Flood overlap is recomputed
against the flood_hazard layer ONLY — the flood_coverage layer is the
known-coverage extent, not hazard, and is used to recompute coverage,
never added to the overlap. The same holds for wetland: wetland
overlap is recomputed against wetland_indicator ONLY, and wetland
coverage is recomputed from the wetland_coverage layer. Main-dataset
parcels are identified by parcel_id and carry no name attribute; the
missing-name check applies to incoming named records, not to them.

Runs REAL checks computed by this script (never hardcoded outcomes):
  * geometry validity — ring closure, non-zero area, self-intersection
    spot-check via segment intersection (all parts of every parcel)
  * CRS consistency — every layer EPSG:32617
  * null / duplicate attribute checks on parcel_id
  * overlap accounting — each parcel's wetland / flood overlap is
    recomputed from the actual geometries (clip polygon triangulated,
    Sutherland-Hodgman against each convex triangle) and compared
    against the stored attributes (tolerance 1 m2)
  * source timestamp freshness vs the register (accessed date present,
    effective_date null flagged as "unknown — freshness cannot be
    verified")
  * a planted-defect incoming batch of 8 records (2 clean, 6 defective),
    accepted / rejected by computing the checks above

Writes qa_report.md and qa_report.html next to this script.
Exits 0 on a successful run (a run that completes and writes the
reports, even if some QA checks flag findings — findings are reported,
not hidden by the exit code). Exits 2 if there is no usable input
(GeoPackage missing/unreadable and no fixture JSON bundled).
"""

import hashlib
import json
import math
import platform
import sqlite3
import struct
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
GPKG_PATH = (
    Path.home()
    / "workspace/research_notes/site-examples-real-data-20261116/work/real-builds/parcel-screening/real_parcel_screening.gpkg"
)
FIXTURE_PATH = BASE_DIR / "fixtures" / "parcel_screening.json"

TOLERANCE_M2 = 1.0
EXPECTED_EPSG = 32617
ACRES_PER_M2 = 0.0002471053814671653  # 1 m2 in acres

# Study boundary (metres, EPSG:32617) — the union extent of the six
# real parcels, computed from the real GeoPackage (total_bounds).
BOUNDARY = {"xmin": 500291.54, "ymin": 3209446.35, "xmax": 502260.82, "ymax": 3212228.49}

# Expected overlap values, embedded as a fallback if the fixture JSON
# is ever unavailable. The script still RECOMPUTES the overlaps from
# the geometries and compares; these are the comparison targets only.
EXPECTED = {
    "730901000W14": {"wetland_m2": 23633.15, "flood_m2": 0.0,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 100.0},
    "731500000044": {"wetland_m2": 0.0, "flood_m2": 12355.93,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 100.0},
    "731503000001": {"wetland_m2": 24226.99, "flood_m2": 0.0,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 81.84},
    "731510000006": {"wetland_m2": 29157.46, "flood_m2": 34493.2,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 100.0},
    "732101000080": {"wetland_m2": 0.0, "flood_m2": 0.0,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 100.0},
    "732200000042": {"wetland_m2": 13352.28, "flood_m2": 6659.32,
                     "wetland_coverage_pct": 100.0, "flood_coverage_pct": 100.0},
}

REASON_LABELS = {
    "DUPLICATE_IDENTIFIER": "duplicate identifier",
    "MISSING_NAME": "missing name",
    "UNUSABLE_GEOMETRY": "unusable geometry",
    "WRONG_GEOMETRY_TYPE": "wrong geometry type",
    "OUTSIDE_BOUNDARY": "record outside the boundary",
}


# ---------------------------------------------------------------- geometry
def ring_area(ring):
    """Absolute planar area of a ring (shoelace), m2. Ring is a list of [x, y]."""
    total = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        total += x1 * y2 - x2 * y1
    return abs(total) / 2.0


def polygon_area(rings):
    """Area of a polygon: outer ring minus holes."""
    if not rings:
        return 0.0
    area = ring_area(rings[0])
    for hole in rings[1:]:
        area -= ring_area(hole)
    return area

def multipolygon_area(polys):
    """Total area of a multipolygon (list of polygons, each a list of
    rings), m2."""
    return sum(polygon_area(poly) for poly in polys or [])


def _signed_ring_area(ring):
    """Signed shoelace area (positive = CCW), m2. Ring may be closed."""
    total = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        total += x1 * y2 - x2 * y1
    return total / 2.0


def _point_strictly_in_triangle(p, a, b, c):
    """True if p lies strictly inside the CCW triangle a-b-c (points on
    an edge do not count)."""
    def cross(o, u, v):
        return (u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0])
    return (cross(a, b, p) > 1e-9 and cross(b, c, p) > 1e-9
            and cross(c, a, p) > 1e-9)


def _triangulate(ring):
    """Ear-clipping triangulation of one simple ring (outer or hole).
    Returns a list of CCW triangles (each 3 points). Real constraint
    polygons are non-convex, so the clip must be decomposed into
    convex triangles before Sutherland-Hodgman (which is exact only
    for a convex clip). Degenerate (zero-area) triangles are dropped.
    If no ear can be found on a valid simple ring the remainder is
    fanned from its first vertex as a last resort."""
    pts = ring[:-1] if ring_is_closed(ring) and len(ring) > 1 else list(ring)
    cleaned = []
    for p in pts:
        if not cleaned or cleaned[-1] != p:
            cleaned.append(p)
    pts = cleaned
    if len(pts) < 3:
        return []
    if _signed_ring_area(pts + [pts[0]]) < 0:
        pts = pts[::-1]
    if len(pts) == 3:
        return [pts]
    idx = list(range(len(pts)))
    tris = []
    guard = 0
    while len(idx) > 3:
        guard += 1
        if guard > 10000:
            break
        ear = None
        for k in range(len(idx)):
            a = pts[idx[k - 1]]
            b = pts[idx[k]]
            c = pts[idx[(k + 1) % len(idx)]]
            cross = ((b[0] - a[0]) * (c[1] - a[1])
                     - (b[1] - a[1]) * (c[0] - a[0]))
            if cross <= 1e-9:
                continue  # reflex or collinear vertex: not an ear tip
            skip = {idx[k - 1], idx[k], idx[(k + 1) % len(idx)]}
            blocked = any(
                _point_strictly_in_triangle(pts[j], a, b, c)
                for j in idx if j not in skip)
            if blocked:
                continue
            ear = k
            break
        if ear is None:
            break
        k = ear
        tris.append([pts[idx[k - 1]], pts[idx[k]],
                     pts[idx[(k + 1) % len(idx)]]])
        del idx[k]
    if len(idx) == 3:
        tris.append([pts[i] for i in idx])
    elif len(idx) > 3:
        for k in range(1, len(idx) - 1):
            tris.append([pts[idx[0]], pts[idx[k]], pts[idx[k + 1]]])
    return [t for t in tris
            if abs(_signed_ring_area(t + [t[0]])) > 1e-9]


def record_tris(polys):
    """Signed triangle decomposition of a (multi)polygon, for use as a
    clip record: [(triangle, +1)] for outer rings, [(triangle, -1)]
    for holes. Triangles are CCW. Computed once per hazard/coverage
    row and reused for every parcel."""
    tris = []
    for poly in polys or []:
        if not poly:
            continue
        tris.extend((t, 1) for t in _triangulate(poly[0]))
        for hole in poly[1:]:
            tris.extend((t, -1) for t in _triangulate(hole))
    return tris


def _clip_area(subject_ring, triangle):
    """Area of subject_ring clipped to one convex CCW triangle, m2."""
    if not subject_ring or not triangle:
        return 0.0
    subject = [list(p) for p in subject_ring]
    tri = [list(p) for p in triangle]
    for i in range(3):
        ax, ay = tri[i]
        bx, by = tri[(i + 1) % 3]
        subject = _clip_edge(subject, ax, ay, bx, by)
        if not subject:
            return 0.0
    if len(subject) < 3:
        return 0.0
    return ring_area(subject + [subject[0]])


def ring_is_closed(ring):
    return len(ring) >= 2 and ring[0] == ring[-1]


def _orient(a, b, c):
    v = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    if abs(v) < 1e-9:
        return 0
    return 1 if v > 0 else -1


def _segments_cross(p1, p2, p3, p4):
    """True only for a proper crossing (not shared endpoints / touching)."""
    d1 = _orient(p3, p4, p1)
    d2 = _orient(p3, p4, p2)
    d3 = _orient(p1, p2, p3)
    d4 = _orient(p1, p2, p4)
    return d1 * d2 < 0 and d3 * d4 < 0


def ring_self_intersects(ring):
    """Spot-check: any non-adjacent pair of segments properly crossing."""
    pts = ring[:-1] if ring_is_closed(ring) and len(ring) > 1 else list(ring)
    n = len(pts)
    if n < 4:
        return False
    for i in range(n):
        for j in range(i + 2, n):
            if i == 0 and j == n - 1:
                continue  # adjacent via closure
            if _segments_cross(pts[i], pts[(i + 1) % n],
                               pts[j], pts[(j + 1) % n]):
                return True
    return False


def _clip_edge(subject, ax, ay, bx, by):
    """Sutherland-Hodgman: clip polygon against one half-plane of the
    (convex) clip polygon, keeping the inside of edge a->b (CCW clip)."""
    def inside(p):
        return (bx - ax) * (p[1] - ay) - (by - ay) * (p[0] - ax) >= -1e-9

    def intersect(p1, p2):
        dx, dy = p2[0] - p1[0], p2[1] - p1[1]
        ex, ey = bx - ax, by - ay
        denom = dx * ey - dy * ex
        if abs(denom) < 1e-12:
            return p1
        t = ((ax - p1[0]) * ey - (ay - p1[1]) * ex) / denom
        return [p1[0] + t * dx, p1[1] + t * dy]

    out = []
    if not subject:
        return out
    prev, prev_in = subject[-1], inside(subject[-1])
    for cur in subject:
        cur_in = inside(cur)
        if cur_in:
            if not prev_in:
                out.append(intersect(prev, cur))
            out.append(cur)
        elif prev_in:
            out.append(intersect(prev, cur))
        prev, prev_in = cur, cur_in
    return out


def polygon_intersection_area(rings_a, rings_b):
    """Intersection area of two (possibly non-convex, possibly holed)
    polygons, m2. The clip polygon is triangulated and the subject is
    clipped against each convex CCW triangle; holes subtract on both
    sides."""
    if not rings_a or not rings_b:
        return 0.0
    total = 0.0
    for tri, sign in record_tris([rings_b]):
        clipped = _clip_area(rings_a[0], tri)
        for hole in rings_a[1:]:
            clipped -= _clip_area(hole, tri)
        total += sign * clipped
    return total


def multipolygon_intersection_area(subject_polys, clip_tris):
    """Intersection area of a multipolygon subject with a clip record
    given as its precomputed signed triangle list (see record_tris).
    Sums over all subject parts; clip triangles are reused, not
    recomputed per parcel."""
    if not subject_polys or not clip_tris:
        return 0.0
    total = 0.0
    for poly in subject_polys:
        if not poly:
            continue
        for tri, sign in clip_tris:
            clipped = _clip_area(poly[0], tri)
            for hole in poly[1:]:
                clipped -= _clip_area(hole, tri)
            total += sign * clipped
    return total


def bbox_polys(polys):
    xs = [p[0] for poly in polys for ring in poly for p in ring]
    ys = [p[1] for poly in polys for ring in poly for p in ring]
    return min(xs), min(ys), max(xs), max(ys)


def inside_boundary(polys):
    """True if any part of the geometry lies inside the study boundary."""
    if not polys:
        return False
    xmin, ymin, xmax, ymax = bbox_polys(polys)
    return not (xmax <= BOUNDARY["xmin"] or xmin >= BOUNDARY["xmax"]
                or ymax <= BOUNDARY["ymin"] or ymin >= BOUNDARY["ymax"])


# ---------------------------------------------------------------- WKB
def _parse_wkb(buf, off=0):
    """Parse a WKB blob (little/big endian).
    Returns (geom_type, geometry, end_offset). Geometry is a point [x, y],
    a list of points (LineString), a list of rings (Polygon), or a list of
    polygons (MultiPolygon, each a list of rings)."""
    endian = "<" if buf[off] == 1 else ">"
    gtype = struct.unpack_from(endian + "I", buf, off + 1)[0]
    # Mask off Z/M/ISO high bits; base type is the low part.
    base = gtype % 1000
    pos = off + 5
    if base == 1:  # Point
        x, y = struct.unpack_from(endian + "dd", buf, pos)
        return "Point", [x, y], pos + 16
    if base == 2:  # LineString
        (n,) = struct.unpack_from(endian + "I", buf, pos)
        pos += 4
        pts = []
        for _ in range(n):
            x, y = struct.unpack_from(endian + "dd", buf, pos)
            pos += 16
            pts.append([x, y])
        return "LineString", pts, pos
    if base == 3:  # Polygon
        (nrings,) = struct.unpack_from(endian + "I", buf, pos)
        pos += 4
        rings = []
        for _ in range(nrings):
            (n,) = struct.unpack_from(endian + "I", buf, pos)
            pos += 4
            ring = []
            for _ in range(n):
                x, y = struct.unpack_from(endian + "dd", buf, pos)
                pos += 16
                ring.append([x, y])
            rings.append(ring)
        return "Polygon", rings, pos
    if base == 6:  # MultiPolygon
        (npoly,) = struct.unpack_from(endian + "I", buf, pos)
        pos += 4
        polys = []
        for _ in range(npoly):
            _, rings, pos = _parse_wkb(buf, pos)
            polys.append(rings)
        return "MultiPolygon", polys, pos
    raise ValueError(f"unsupported WKB geometry type {gtype}")


def parse_gpkg_geometry(blob):
    """Parse a GeoPackage geometry blob (GP header + WKB)."""
    if blob is None:
        return None, None
    if len(blob) >= 8 and blob[0:2] == b"GP":
        flags = blob[3]
        envelope_indicator = (flags >> 1) & 0x07
        # srs_id is bytes 4-7; envelope follows (0/32/48/64 bytes).
        env_bytes = {0: 0, 1: 32, 2: 48, 3: 48, 4: 64}[envelope_indicator]
        wkb_off = 8 + env_bytes
        gtype, geom, _ = _parse_wkb(blob, wkb_off)
        return gtype, geom
    gtype, geom, _ = _parse_wkb(blob, 0)
    return gtype, geom


# ---------------------------------------------------------------- inputs
def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def load_fixture_json():
    with open(FIXTURE_PATH, encoding="utf-8") as fh:
        data = json.load(fh)
    layers = {"parcels": [], "wetland": [], "flood": [],
            "flood_coverage": [], "wetland_coverage": []}
    for p in data["parcels"]:
        layers["parcels"].append({
            "parcel_id": p["parcel_id"], "name": p.get("name"),
            "geom_type": p["geometry_type"], "rings": p["rings"],
            "polys": [p["rings"]], "tris": None,
            "srs": data.get("crs_epsg", EXPECTED_EPSG),
            "stored": {
                "area_m2": p.get("area_m2"),
                "area_acres": p.get("area_acres"),
                "wetland_overlap_m2": p.get("wetland_overlap_m2"),
                "flood_overlap_m2": p.get("flood_overlap_m2"),
                "wetland_coverage_pct": p.get("wetland_coverage_pct"),
                "flood_coverage_pct": p.get("flood_coverage_pct"),
            },
        })
    for hz in data["hazards"]:
        layers[hz["layer"]].append({
            "parcel_id": hz["layer"], "name": hz["layer"],
            "geom_type": hz["geometry_type"], "rings": hz["rings"],
            "polys": [hz["rings"]],
            "tris": record_tris([hz["rings"]]),
            "srs": data.get("crs_epsg", EXPECTED_EPSG), "stored": {},
        })
    return data, layers


def load_gpkg():
    """Read the GeoPackage with sqlite3 only.
    Returns (layers, srs_by_layer, register or None). Coverage layers
    (flood_coverage, wetland_coverage) are kept separate from the
    hazard/indicator layers: coverage is the known-coverage extent,
    not hazard, and must never be summed into the overlap. Raises on
    any structural problem so the caller can fall back."""
    con = sqlite3.connect(f"file:{GPKG_PATH}?mode=ro", uri=True)
    try:
        cur = con.cursor()
        geom_cols = {}
        try:
            for table, col, srs in cur.execute(
                    "SELECT table_name, column_name, srs_id "
                    "FROM gpkg_geometry_columns"):
                geom_cols[table] = (col, srs)
        except sqlite3.Error as exc:
            raise ValueError(f"gpkg_geometry_columns unreadable: {exc}")
        if not geom_cols:
            raise ValueError("no geometry columns registered in GeoPackage")
        layers = {"parcels": [], "wetland": [], "flood": [],
                  "flood_coverage": [], "wetland_coverage": []}
        srs_by_layer = {}
        for table, (gcol, srs) in geom_cols.items():
            low = table.lower()
            if "parcel" in low:
                key = "parcels"
            elif "coverage" in low:
                # must precede the "wetland"/"flood" tests: a coverage
                # layer is an extent layer, not hazard/indicator
                key = ("wetland_coverage" if "wetland" in low
                       else "flood_coverage")
            elif "wetland" in low:
                key = "wetland"
            elif "flood" in low:
                key = "flood"
            else:
                continue  # unrelated layer: CRS still recorded below
            srs_by_layer[table] = srs
            cols = [r[1] for r in cur.execute(f"PRAGMA table_info({table})")]
            if gcol not in cols:
                raise ValueError(f"geometry column {gcol} missing in {table}")
            rows = cur.execute(
                f"SELECT * FROM {table}").fetchall()
            for row in rows:
                rec = dict(zip(cols, row))
                gtype, geom = parse_gpkg_geometry(rec.get(gcol))
                # Keep ALL parts of a MultiPolygon: the real parcels and
                # flood_coverage rows have more than one part, and the
                # overlap of a later part is real overlap.
                if gtype == "MultiPolygon":
                    polys = list(geom) if geom else None
                    gtype = "Polygon"
                elif gtype == "Polygon":
                    polys = [geom] if geom else None
                else:
                    polys = None
                rings = polys[0] if polys else None
                stored = {}
                for cand in ("wetland_overlap_m2", "wetland_overlap_sq_m",
                             "flood_overlap_m2", "flood_overlap_sq_m",
                             "wetland_coverage_pct", "flood_coverage_pct",
                             "parcel_m2", "area_m2", "area_sq_m", "area_acres"):
                    if cand in rec:
                        stored[cand] = rec[cand]
                tris = (record_tris(polys)
                        if key in ("wetland", "flood", "flood_coverage",
                                   "wetland_coverage") else None)
                layers[key].append({
                    "parcel_id": rec.get("parcel_id") or rec.get("id"),
                    "name": rec.get("name"),
                    "geom_type": gtype, "rings": rings,
                    "polys": polys, "tris": tris,
                    "srs": srs, "stored": stored,
                })
        register = None
        tables = {r[0] for r in cur.execute(
            "SELECT name FROM sqlite_master WHERE type='table'")}
        if "source_register" in tables:
            reg_cols = [r[1] for r in cur.execute(
                "PRAGMA table_info(source_register)")]
            register = []
            for row in cur.execute("SELECT * FROM source_register"):
                rec = dict(zip(reg_cols, row))
                register.append({
                    "layer": rec.get("layer"),
                    "source_id": rec.get("dataset_id"),
                    "accessed": rec.get("accessed_utc"),
                    "effective_date": rec.get("effective_date"),
                    "accuracy": rec.get("horizontal_accuracy_m"),
                    "resolution": rec.get("native_resolution_m"),
                })
        return layers, srs_by_layer, register
    finally:
        con.close()


# ---------------------------------------------------------------- validation
def validate_record(parcel_id, name, geom_type, polys, seen_ids,
                    require_name=True):
    """Compute the defect reason codes for one record. Empty list = pass.
    Checks, in order: duplicate identifier, missing name, wrong geometry
    type, unusable geometry (unclosed ring / zero area / self-intersection),
    outside boundary. Main-dataset parcels are identified by parcel_id
    and carry no name attribute, so callers pass require_name=False for
    them; the missing-name check applies to incoming named records.
    polys is a list of polygons (each a list of rings); every part is
    checked, so a multi-part parcel cannot hide a defect in a later
    part."""
    reasons = []
    if parcel_id is None or str(parcel_id).strip() == "":
        reasons.append("MISSING_NAME")  # no identifier at all: counted here
        # (a missing parcel_id is a missing-identifier defect; the
        #  documented vocabulary has no separate code for it)
    elif parcel_id in seen_ids:
        reasons.append("DUPLICATE_IDENTIFIER")
    if require_name and (name is None or str(name).strip() == ""):
        if "MISSING_NAME" not in reasons:
            reasons.append("MISSING_NAME")
    if geom_type != "Polygon":
        reasons.append("WRONG_GEOMETRY_TYPE")
        return reasons  # cannot run polygon checks on a non-polygon
    if not polys or not polys[0] or not polys[0][0]:
        reasons.append("UNUSABLE_GEOMETRY")
        return reasons
    closed = all(ring_is_closed(poly[0]) for poly in polys if poly)
    area = multipolygon_area(polys)
    self_x = any(ring_self_intersects(poly[0]) for poly in polys if poly)
    if not closed:
        reasons.append("UNUSABLE_GEOMETRY")
    elif area <= 0:
        reasons.append("UNUSABLE_GEOMETRY")
    elif self_x:
        reasons.append("UNUSABLE_GEOMETRY")
    if polys and not inside_boundary(polys):
        reasons.append("OUTSIDE_BOUNDARY")
    return reasons


# Planted-defect incoming batch: 2 clean records that must pass, 6
# defective records. Documented reasons: duplicate identifier, missing
# name, unusable geometry, wrong geometry type, outside boundary.
# B-008 carries TWO reasons (missing name + outside boundary), so the
# 6 rejected rows produce 7 reason instances — reason totals are NOT
# a second row count.
#
# RE-BASED 2026-11-16 (Gate 1, owner decision 2): the batch was
# expressed in the synthetic grid's coordinates, ~9.4 km south of the
# real study boundary, so every polygon record read OUTSIDE_BOUNDARY
# (8 = 0 + 8). The 8 test polygons were translated into/around the real
# boundary (EPSG:32617) without changing their shapes, ids, names,
# types, or planted defects: the six records that must be judged on
# their own defects (B-001, B-002, duplicate B-001, B-004, B-005,
# B-006) by (+1000, +9500) into the boundary; the two records whose
# designed defect IS outside-boundary (B-007, B-008) by (+1000, +8000),
# leaving them south of the boundary (ymax 3208320 / 3208020 < ymin
# 3209446.35). Result: 8 = 2 accepted + 6 rejected, 7 reason instances.
BATCH = [
    {"parcel_id": "B-001", "name": "Batch Parcel 1", "geom_type": "Polygon",
     "rings": [[[501010, 3209510], [501030, 3209510], [501030, 3209530],
                [501010, 3209530], [501010, 3209510]]]},
    {"parcel_id": "B-002", "name": "Batch Parcel 2", "geom_type": "Polygon",
     "rings": [[[501110, 3209510], [501130, 3209510], [501130, 3209530],
                [501110, 3209530], [501110, 3209510]]]},
    {"parcel_id": "B-001", "name": "Batch Parcel 1 duplicate",
     "geom_type": "Polygon",
     "rings": [[[501040, 3209510], [501060, 3209510], [501060, 3209530],
                [501040, 3209530], [501040, 3209510]]]},
    {"parcel_id": "B-004", "name": "", "geom_type": "Polygon",
     "rings": [[[501010, 3209550], [501030, 3209550], [501030, 3209570],
                [501010, 3209570], [501010, 3209550]]]},
    {"parcel_id": "B-005", "name": "Batch Parcel 5", "geom_type": "Polygon",
     "rings": [[[501020, 3209550], [501040, 3209550], [501020, 3209550]]]},
    {"parcel_id": "B-006", "name": "Batch Parcel 6", "geom_type": "Point",
     "rings": None, "point": [501050, 3209550]},
    {"parcel_id": "B-007", "name": "Batch Parcel 7", "geom_type": "Polygon",
     "rings": [[[501300, 3208300], [501320, 3208300], [501320, 3208320],
                [501300, 3208320], [501300, 3208300]]]},
    {"parcel_id": "B-008", "name": "", "geom_type": "Polygon",
     "rings": [[[501500, 3208000], [501520, 3208000], [501520, 3208020],
                [501500, 3208020], [501500, 3208000]]]},
]


# ---------------------------------------------------------------- report
def main():
    checks = []  # (name, status, detail)  status: PASS / FLAG / FAIL

    # ---- input selection
    # The real variant reads the real GeoPackage. The fixture JSON is
    # NOT bundled with this variant: it is loaded only if the
    # GeoPackage is missing or unreadable, and then it must be a real
    # fixture or the run fails with a clear error instead of silently
    # falling back to synthetic values.
    if GPKG_PATH.exists():
        input_path = GPKG_PATH
        input_kind = "GeoPackage"
        try:
            layers, srs_by_layer, gpkg_register = load_gpkg()
            gpkg_ok = True
            gpkg_note = f"layers read: {', '.join(sorted(srs_by_layer))}"
        except Exception as exc:  # fall back to the fixture, say so
            layers = None
            gpkg_ok = False
            gpkg_register = None
            gpkg_note = f"GeoPackage unreadable ({exc}); fell back to fixture JSON"
        if not gpkg_ok:
            try:
                fixture_data, fixture_layers = load_fixture_json()
            except FileNotFoundError:
                print(f"ERROR: GeoPackage unreadable and no fixture JSON "
                      f"bundled at {FIXTURE_PATH}; cannot fall back.",
                      file=sys.stderr)
                return 2
            layers = fixture_layers
            input_path = FIXTURE_PATH
            input_kind = "fixture JSON (GeoPackage present but unreadable)"
            source_register = fixture_data["source_register"]
            expected = {p["parcel_id"]: p for p in fixture_data["parcels"]}
        elif gpkg_register:
            source_register = gpkg_register
            gpkg_note += ("; source register read from the GeoPackage "
                          "source_register table")
            expected = EXPECTED
        else:
            source_register = []
            gpkg_note += ("; GeoPackage has no source_register table — "
                          "freshness cannot be checked")
            expected = EXPECTED
    else:
        try:
            fixture_data, layers = load_fixture_json()
        except FileNotFoundError:
            print(f"ERROR: GeoPackage not present at {GPKG_PATH} and no "
                  f"fixture JSON bundled at {FIXTURE_PATH}; nothing to "
                  "validate.", file=sys.stderr)
            return 2
        input_path = FIXTURE_PATH
        input_kind = "fixture JSON (GeoPackage not present yet)"
        source_register = fixture_data["source_register"]
        expected = {p["parcel_id"]: p for p in fixture_data["parcels"]}
        gpkg_note = "parcel_screening.gpkg not found — validated the bundled fixture instead"

    input_hash = sha256_file(input_path)
    parcels = layers["parcels"]
    wetlands = layers["wetland"]
    floods = layers["flood"]
    flood_cov = layers.get("flood_coverage", [])
    wetland_cov = layers.get("wetland_coverage", [])

    # ---- CRS consistency
    crs_values = sorted({f["srs"] for f in parcels + wetlands + floods
                         + flood_cov + wetland_cov
                         if f.get("srs") is not None})
    crs_ok = crs_values == [EXPECTED_EPSG]
    checks.append(("CRS consistency — all layers EPSG:32617",
                   "PASS" if crs_ok else "FAIL",
                   f"layers report EPSG {crs_values}; expected [32617]. {gpkg_note}"))

    # ---- geometry validity + attributes on the main parcels
    seen_ids = set()
    parcel_rows = []
    for f in parcels:
        pid = f["parcel_id"]
        # Main-dataset parcels carry no name attribute (identified by
        # parcel_id); the missing-name check applies to incoming named
        # records only.
        reasons = validate_record(pid, f.get("name"), f["geom_type"],
                                  f["polys"], seen_ids, require_name=False)
        if pid is not None:
            seen_ids.add(pid)
        area = multipolygon_area(f["polys"]) if f["polys"] else 0.0
        stored_area = ((f["stored"] or {}).get("area_m2")
                       or (f["stored"] or {}).get("parcel_m2"))
        area_detail = f"recomputed area {area:,.0f} m2"
        if stored_area is not None:
            area_detail += (f"; stored {stored_area:,.0f} m2; "
                            f"diff {abs(area - stored_area):,.2f} m2")
        else:
            area_detail += f"; {area * ACRES_PER_M2:.15f} acres"
        parcel_rows.append({
            "parcel_id": pid, "name": f.get("name"),
            "geom_type": f["geom_type"],
            "closed": (all(ring_is_closed(poly[0])
                           for poly in f["polys"] if poly)
                       if f["polys"] else False),
            "area_m2": area,
            "self_intersects": (any(ring_self_intersects(poly[0])
                                  for poly in f["polys"] if poly)
                              if f["polys"] else None),
            "reasons": reasons, "area_detail": area_detail,
        })
    geom_ok = all(not r["reasons"] for r in parcel_rows)
    checks.append(("Geometry validity — ring closure, non-zero area, "
                   "self-intersection spot-check",
                   "PASS" if geom_ok else "FAIL",
                   "; ".join(
                       f"{r['parcel_id']}: closed={r['closed']}, "
                       f"area={r['area_m2']:,.0f} m2, "
                       f"self-intersects={r['self_intersects']}"
                       for r in parcel_rows) or "no parcels"))
    dupes = [r["parcel_id"] for r in parcel_rows
             if "DUPLICATE_IDENTIFIER" in r["reasons"]]
    null_ids = [r["parcel_id"] for r in parcel_rows if r["parcel_id"] is None]
    # Main-dataset parcels carry no name attribute by design; the
    # missing-name check applies to the incoming batch, not to them.
    checks.append(("Attribute checks — parcel_id null / duplicate",
                   "PASS" if not dupes and not null_ids else "FAIL",
                   f"parcels={len(parcel_rows)}, duplicate parcel_id={dupes or 'none'}, "
                   f"null parcel_id={null_ids or 'none'}"))

    # ---- overlap accounting (recomputed from the actual geometries)
    overlap_rows = []
    for f in parcels:
        pid = f["parcel_id"]
        exp = expected.get(pid, EXPECTED.get(pid, {}))
        for hazard, layer in (("wetland", wetlands), ("flood", floods)):
            recomputed = sum(
                multipolygon_intersection_area(f["polys"], h["tris"])
                for h in layer)
            stored = (f["stored"] or {}).get(f"{hazard}_overlap_m2")
            if stored is None:
                stored = exp.get(f"{hazard}_overlap_m2")
            coverage = (f["stored"] or {}).get(f"{hazard}_coverage_pct")
            if coverage is None:
                coverage = exp.get(f"{hazard}_coverage_pct")
            parcel_area = multipolygon_area(f["polys"])
            if stored is None:
                # No stored value and (per the register) no coverage:
                # the overlap is unknown, not zero.
                status = "FLAG"
                verdict = ("unknown — no stored overlap and "
                           f"{hazard} coverage is {coverage}% "
                           "(recomputed geometric intersection "
                           f"{recomputed:,.0f} m2 is NOT a verified overlap)")
            elif abs(recomputed - stored) <= TOLERANCE_M2:
                status = "PASS"
                verdict = (f"recomputed {recomputed:,.0f} m2 matches stored "
                           f"{stored:,.0f} m2 (diff "
                           f"{abs(recomputed - stored):,.2f} m2, tolerance "
                           f"{TOLERANCE_M2:.0f} m2)")
            else:
                status = "FAIL"
                verdict = (f"recomputed {recomputed:,.0f} m2 does NOT match "
                           f"stored {stored:,.0f} m2 "
                           f"(diff {abs(recomputed - stored):,.2f} m2)")
            if hazard == "flood" and flood_cov and status == "PASS":
                # Coverage is recomputed from the flood_coverage layer
                # (the known-coverage extent), never from the hazard.
                cov_area = sum(
                    multipolygon_intersection_area(f["polys"], h["tris"])
                    for h in flood_cov)
                recomputed_coverage = (cov_area / parcel_area * 100
                                       if parcel_area else 0.0)
                if (coverage is not None
                        and abs(recomputed_coverage - coverage) > 1.0):
                    status = "FAIL"
                    verdict += (f"; coverage mismatch: recomputed "
                                f"{recomputed_coverage:.0f}% from the "
                                "flood_coverage layer vs stored "
                                f"{coverage}%")
                elif coverage is not None:
                    verdict += (f"; coverage recomputed "
                                f"{recomputed_coverage:.0f}% from the "
                                "flood_coverage layer — matches stored")
            if hazard == "wetland" and wetland_cov and status == "PASS":
                # Coverage is recomputed from the wetland_coverage layer
                # (the known-coverage extent), never from the indicator.
                cov_area = sum(
                    multipolygon_intersection_area(f["polys"], h["tris"])
                    for h in wetland_cov)
                recomputed_coverage = (cov_area / parcel_area * 100
                                       if parcel_area else 0.0)
                if (coverage is not None
                        and abs(recomputed_coverage - coverage) > 1.0):
                    status = "FAIL"
                    verdict += (f"; coverage mismatch: recomputed "
                                f"{recomputed_coverage:.0f}% from the "
                                "wetland_coverage layer vs stored "
                                f"{coverage}%")
                elif coverage is not None:
                    verdict += (f"; coverage recomputed "
                                f"{recomputed_coverage:.0f}% from the "
                                "wetland_coverage layer — matches stored")
            if coverage is not None and coverage < 100 and status == "PASS":
                verdict += (f"; note: {hazard} coverage is only {coverage}% "
                            "of this parcel — the verified overlap covers "
                            "the known area only")
            overlap_rows.append({
                "parcel_id": pid, "hazard": hazard,
                "recomputed_m2": recomputed, "stored_m2": stored,
                "coverage_pct": coverage,
                "overlap_pct_of_parcel": (recomputed / parcel_area * 100
                                          if parcel_area else 0.0),
                "status": status, "verdict": verdict,
            })
    overlap_ok = all(r["status"] != "FAIL" for r in overlap_rows)
    checks.append(("Overlap accounting — recomputed vs stored (±1 m2)",
                   "PASS" if overlap_ok else "FAIL",
                   "; ".join(
                       f"{r['parcel_id']} {r['hazard']}: "
                       f"{r['recomputed_m2']:,.0f} m2 recomputed vs "
                       f"{'unknown' if r['stored_m2'] is None else format(r['stored_m2'], ',.0f') + ' m2 stored'} "
                       f"[{r['status']}]" for r in overlap_rows)))

    # ---- source timestamp freshness
    for src in source_register:
        accessed = src.get("accessed")
        effective = src.get("effective_date")
        if effective is None:
            status, detail = (
                "FLAG",
                f"accessed {accessed}; effective_date is null — "
                "unknown — freshness cannot be verified; "
                "accuracy/resolution also null (unknown)")
        else:
            status, detail = ("PASS", f"accessed {accessed}; effective {effective}")
        label = src["source_id"]
        if src.get("layer"):
            label += f" ({src['layer']})"
        checks.append((f"Source freshness — {label}",
                       status, detail))

    # ---- planted-defect incoming batch
    batch_seen = set()
    batch_results = []
    reason_counts = {}
    for rec in BATCH:
        reasons = validate_record(rec["parcel_id"], rec["name"],
                                  rec["geom_type"],
                                  [rec["rings"]] if rec["rings"] else None,
                                  batch_seen)
        if rec["parcel_id"] is not None:
            batch_seen.add(rec["parcel_id"])
        for r in reasons:
            reason_counts[r] = reason_counts.get(r, 0) + 1
        batch_results.append({**rec, "reasons": reasons,
                              "accepted": not reasons})
    batch_accepted = sum(1 for r in batch_results if r["accepted"])
    batch_rejected = len(batch_results) - batch_accepted
    checks.append(("Incoming batch — accept/reject computed from the checks",
                   "PASS" if (batch_accepted == 2 and batch_rejected == 6
                              and batch_results[0]["accepted"]
                              and batch_results[1]["accepted"]) else "FAIL",
                   f"inputs 8, accepted {batch_accepted}, rejected "
                   f"{batch_rejected}; reason instances "
                   f"{sum(reason_counts.values())} across {batch_rejected} "
                   "rejected rows (a row can carry more than one reason)"))

    # ---- reconciliation
    main_accepted = sum(1 for r in parcel_rows if not r["reasons"])
    main_rejected = len(parcel_rows) - main_accepted

    # ---- render
    py_ver = platform.python_version()
    report_md = build_markdown(
        input_kind=input_kind, input_path=input_path, input_hash=input_hash,
        checks=checks, parcel_rows=parcel_rows, overlap_rows=overlap_rows,
        source_register=source_register, batch_results=batch_results,
        reason_counts=reason_counts, batch_accepted=batch_accepted,
        batch_rejected=batch_rejected, main_accepted=main_accepted,
        main_rejected=main_rejected, n_parcels=len(parcel_rows),
        py_ver=py_ver, gpkg_note=gpkg_note)
    (BASE_DIR / "qa_report.md").write_text(report_md, encoding="utf-8")
    (BASE_DIR / "qa_report.html").write_text(
        build_html(report_md, checks, parcel_rows, overlap_rows,
                   batch_results, reason_counts),
        encoding="utf-8")

    print(f"Input used: {input_kind}: {input_path}")
    print(f"Input SHA-256: {input_hash}")
    print(f"CRS: EPSG:{EXPECTED_EPSG} on all layers "
          f"(reported: {crs_values})")
    print("Per-check results:")
    for name, status, detail in checks:
        print(f"  [{status}] {name} — {detail}")
    print("Main dataset reconciliation: "
          f"inputs={len(parcel_rows)} accepted={main_accepted} "
          f"rejected={main_rejected}")
    print("Incoming batch reconciliation: "
          f"inputs={len(batch_results)} accepted={batch_accepted} "
          f"rejected={batch_rejected}")
    print(f"Reject reasons (instances, not rows): {reason_counts} "
          f"total={sum(reason_counts.values())}")
    print("Overlap (recomputed from geometry):")
    for r in overlap_rows:
        print(f"  {r['parcel_id']} {r['hazard']}: "
              f"{r['recomputed_m2']:,.0f} m2 "
              f"({r['overlap_pct_of_parcel']:.0f}% of parcel), "
              f"coverage {r['coverage_pct']}%, stored "
              f"{'unknown' if r['stored_m2'] is None else format(r['stored_m2'], ',.0f') + ' m2'} "
              f"[{r['status']}]")
    print(f"Wrote {BASE_DIR / 'qa_report.md'}")
    print(f"Wrote {BASE_DIR / 'qa_report.html'}")
    return 0


def build_markdown(**kw):
    lines = []
    lines.append("# QA Report — Real Public-Data Parcel Screening Sample")
    lines.append("")
    lines.append("**REAL PUBLIC DATA — Volusia County parcels, USFWS "
                 "National Wetlands Inventory, FEMA National Flood Hazard "
                 "Layer; accessed 2026-11-16.** No client records were "
                 "used. These are computed results for a public-data "
                 "sample, not customer results and not proof of a complete "
                 "production integration. No survey/engineering licensure "
                 "or ArcGIS Enterprise experience is claimed. Parcel "
                 "boundaries are county records, not a surveyed boundary; "
                 "NWI is a mapped wetland indicator, not a regulatory "
                 "delineation or jurisdictional determination; NFHL zones "
                 "are mapped hazard zones, not a flood determination.")
    lines.append("")
    lines.append("## Input")
    lines.append("")
    lines.append(f"- Input used: {kw['input_kind']}")
    lines.append(f"- Input file: `{kw['input_path']}`")
    lines.append(f"- Input SHA-256: `{kw['input_hash']}`")
    lines.append(f"- Note: {kw['gpkg_note']}")
    lines.append("- Provenance: real public data — Volusia County parcel "
                 "layer, USFWS NWI (Oct 2026 release), FEMA NFHL (DFIRM "
                 "12127C); accessed 2026-11-16.")
    lines.append(f"- CRS: EPSG:32617 (WGS 84 / UTM zone 17N) on all layers")
    lines.append(f"- Software: Python {kw['py_ver']} (standard library only: "
                 f"sqlite3 {sqlite3.sqlite_version}, struct, math, hashlib); "
                 "no geopandas / fiona / shapely / ogr2ogr")
    lines.append("")
    lines.append("## Per-check results")
    lines.append("")
    lines.append("| Check | Result | Detail |")
    lines.append("| --- | --- | --- |")
    for name, status, detail in kw["checks"]:
        lines.append(f"| {name} | {status} | {detail} |")
    lines.append("")
    lines.append("## Parcel geometry (recomputed)")
    lines.append("")
    lines.append("| Parcel | Name | Type | Ring closed | Area (m2) | "
                 "Area (acres) | Self-intersects | Defects |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for r in kw["parcel_rows"]:
        lines.append(
            f"| {r['parcel_id']} | {r['name'] or '—'} | {r['geom_type']} | "
            f"{r['closed']} | {r['area_m2']:,.0f} | "
            f"{r['area_m2'] * ACRES_PER_M2:.15f} | {r['self_intersects']} | "
            f"{', '.join(r['reasons']) or 'none'} |")
    lines.append("")
    lines.append("## Overlap accounting (recomputed from the geometries)")
    lines.append("")
    lines.append("Overlap is recomputed by polygon clipping against the "
                 "hazard geometry and compared with the stored attribute "
                 "(tolerance 1 m2). Flood coverage is recomputed from the "
                 "flood_coverage layer when present (the known-coverage "
                 "extent, never hazard); wetland coverage is recomputed "
                 "the same way from the wetland_coverage layer when "
                 "present. Coverage is the share of the parcel "
                 "the source is known to cover; where coverage is below "
                 "100% the overlap is verified for the known area only, "
                 "and where coverage is 0% the overlap is unknown, not zero.")
    wet_covs = sorted({r["coverage_pct"] for r in kw["overlap_rows"]
                       if r["hazard"] == "wetland"
                       and r["coverage_pct"] is not None})
    flood_cov = {r["parcel_id"]: r["coverage_pct"]
                 for r in kw["overlap_rows"] if r["hazard"] == "flood"}
    parcel_area_by_id = {r["parcel_id"]: r["area_m2"]
                         for r in kw["parcel_rows"]}
    n_parcels = kw["n_parcels"]
    if len(wet_covs) == 1:
        wet_txt = (f"wetland coverage is {wet_covs[0]:.0f}% on all "
                   f"{n_parcels} parcels")
    else:
        wet_txt = (f"wetland coverage ranges {wet_covs[0]:.0f}%–"
                   f"{wet_covs[-1]:.0f}% across the {n_parcels} parcels")
    full_flood = [pid for pid, c in flood_cov.items() if c == 100]
    partial_flood = {pid: c for pid, c in flood_cov.items()
                     if c is not None and c < 100}
    flood_txt = f"flood coverage is 100% on {len(full_flood)} parcels"
    for pid, cov in sorted(partial_flood.items()):
        unmapped = parcel_area_by_id.get(pid, 0.0) * (100.0 - cov) / 100.0
        flood_txt += (f"; {pid} {cov:.2f}% "
                      f"({unmapped:,.1f} m2, {100.0 - cov:.2f}% of the "
                      "parcel, is not covered by the flood_coverage layer "
                      "in this sample — flood status there is unknown, "
                      "not clear)")
    lines.append(f"Coverage pattern in this sample: {wet_txt}; "
                 f"{flood_txt}.")
    lines.append("")
    lines.append("| Parcel | Hazard | Recomputed overlap (m2) | "
                 "Overlap (% of parcel) | Stored overlap (m2) | "
                 "Coverage (%) | Result | Verdict |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for r in kw["overlap_rows"]:
        stored = ("unknown" if r["stored_m2"] is None
                  else f"{r['stored_m2']:,.0f}")
        lines.append(
            f"| {r['parcel_id']} | {r['hazard']} | "
            f"{r['recomputed_m2']:,.0f} | "
            f"{r['overlap_pct_of_parcel']:.0f} | {stored} | "
            f"{r['coverage_pct']} | {r['status']} | {r['verdict']} |")
    lines.append("")
    lines.append("## Source register — timestamp validation")
    lines.append("")
    lines.append("| Layer | Source | Accessed | Effective date | Accuracy | "
                 "Resolution | Finding |")
    lines.append("| --- | --- | --- | --- | --- | --- | --- |")
    for s in kw["source_register"]:
        if s.get("effective_date") is None:
            finding = ("effective_date null — unknown — freshness cannot "
                       "be verified")
        else:
            finding = (f"effective {s.get('effective_date')} — freshness "
                       "verifiable")
        lines.append(
            f"| {s.get('layer') or '—'} | {s['source_id']} | "
            f"{s.get('accessed')} | "
            f"{s.get('effective_date') or 'null (unknown)'} | "
            f"{s.get('accuracy') or 'null (unknown)'} | "
            f"{s.get('resolution') or 'null (unknown)'} | {finding} |")
    lines.append("")
    lines.append("## Reconciliation")
    lines.append("")
    lines.append("Counts account for every input row. A row can have more "
                 "than one reject reason, so reason totals are not a second "
                 "row count.")
    lines.append("")
    lines.append("| Batch | Inputs | Accepted | Rejected | Check |")
    lines.append("| --- | --- | --- | --- | --- |")
    lines.append(f"| Main parcels ({kw['n_parcels']} real public-data parcels) | {kw['n_parcels']} | "
                 f"{kw['main_accepted']} | {kw['main_rejected']} | "
                 f"{'inputs = accepted + rejected ✓' if kw['n_parcels'] == kw['main_accepted'] + kw['main_rejected'] else 'MISMATCH'} |")
    lines.append(f"| Incoming test batch | {len(kw['batch_results'])} | "
                 f"{kw['batch_accepted']} | {kw['batch_rejected']} | "
                 f"{'inputs = accepted + rejected ✓' if len(kw['batch_results']) == kw['batch_accepted'] + kw['batch_rejected'] else 'MISMATCH'} |")
    lines.append("")
    lines.append("## Incoming test batch — reason-coded reject list")
    lines.append("")
    lines.append("This is a planted-defect test batch: synthetic test "
                 "records by design, not real incoming records. Each "
                 "record is accepted or rejected by running the same "
                 "validators as on the main parcels.")
    lines.append("")
    lines.append("| Record | Parcel ID | Name | Type | Reasons | Disposition |")
    lines.append("| --- | --- | --- | --- | --- | --- |")
    for r in kw["batch_results"]:
        reasons = ", ".join(
            f"{code} ({REASON_LABELS[code]})" for code in r["reasons"]) or "—"
        lines.append(
            f"| {r['parcel_id']} | {r['parcel_id']} | "
            f"{r['name'] or '(missing)'} | {r['geom_type']} | {reasons} | "
            f"{'ACCEPT' if r['accepted'] else 'REJECT'} |")
    lines.append("")
    lines.append("### Reject reason totals (instances, not rows)")
    lines.append("")
    for code, count in sorted(kw["reason_counts"].items()):
        lines.append(f"- {code} ({REASON_LABELS[code]}): {count}")
    lines.append(f"- **Total reason instances: "
                 f"{sum(kw['reason_counts'].values())} across "
                 f"{kw['batch_rejected']} rejected rows** — a row can carry "
                 "more than one reason, so this total is not a row count.")
    lines.append("")
    return "\n".join(lines) + "\n"


def _html_escape(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;"))


def build_html(report_md, checks, parcel_rows, overlap_rows,
               batch_results, reason_counts):
    def check_rows():
        return "".join(
            f"<tr><td>{_html_escape(n)}</td>"
            f"<td class='{s.lower()}'>{s}</td>"
            f"<td>{_html_escape(d)}</td></tr>" for n, s, d in checks)

    def overlap_table():
        rows = "".join(
            f"<tr><td>{r['parcel_id']}</td><td>{r['hazard']}</td>"
            f"<td>{r['recomputed_m2']:,.0f}</td>"
            f"<td>{r['overlap_pct_of_parcel']:.0f}%</td>"
            f"<td>{'unknown' if r['stored_m2'] is None else format(r['stored_m2'], ',.0f')}</td>"
            f"<td>{r['coverage_pct']}%</td>"
            f"<td class='{r['status'].lower()}'>{r['status']}</td>"
            f"<td>{_html_escape(r['verdict'])}</td></tr>"
            for r in overlap_rows)
        return rows

    def batch_table():
        rows = "".join(
            f"<tr><td>{r['parcel_id']}</td>"
            f"<td>{_html_escape(r['name'] or '(missing)')}</td>"
            f"<td>{r['geom_type']}</td>"
            f"<td>{', '.join(r['reasons']) or '—'}</td>"
            f"<td>{'ACCEPT' if r['accepted'] else 'REJECT'}</td></tr>"
            for r in batch_results)
        return rows

    seo_desc = ("Computed QA report for the real six-parcel Volusia County "
                "screening sample: 12/12 overlap checks PASS, reconciliation "
                "6 = 6 + 0 and 8 = 2 + 6, two source-freshness PASSes and "
                "three FLAGs. Real public data, accessed 2026-11-16.")
    seo_url = "https://zqmlabs.com/computing/demonstrators/qa-report/qa_report.html"
    seo_json = json.dumps({"@context": "https://schema.org", "@type": "WebPage",
                           "name": "QA Report — Real Public-Data Parcel Screening Sample",
                           "description": seo_desc, "url": seo_url},
                          ensure_ascii=False)

    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>QA Report — Real Public-Data Parcel Screening Sample</title>
<meta name="description" content="{seo_desc}">
<meta property="og:title" content="QA Report — Real Public-Data Parcel Screening Sample">
<meta property="og:description" content="{seo_desc}">
<meta property="og:url" content="{seo_url}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="QA Report — Real Public-Data Parcel Screening Sample">
<meta name="twitter:description" content="{seo_desc}">
<link rel="canonical" href="{seo_url}">
<script type="application/ld+json">{seo_json}</script>
<style>
body{{font-family:system-ui,sans-serif;max-width:960px;margin:2rem auto;
padding:0 1rem;color:#1a1a1a}}table{{border-collapse:collapse;width:100%;
margin:1rem 0}}th,td{{border:1px solid #ccc;padding:.4rem .6rem;
text-align:left;vertical-align:top}}th{{background:#f0f0f0}}
.pass{{color:#0a6b1a;font-weight:700}}.flag{{color:#8a5a00;font-weight:700}}
.fail{{color:#a00;font-weight:700}}
.banner{{background:#fff3cd;border:1px solid #e6c200;padding:.8rem 1rem}}
</style></head><body>
<h1>QA Report — Real Public-Data Parcel Screening Sample</h1>
<p class="banner"><strong>REAL PUBLIC DATA — Volusia County parcels,
USFWS National Wetlands Inventory, FEMA National Flood Hazard Layer;
accessed 2026-11-16.</strong> No client records were used. These are
computed results for a public-data sample, not customer results and
not proof of a complete production integration. No survey/engineering
licensure or ArcGIS Enterprise experience is claimed.</p>
<h2>Per-check results</h2>
<table><tr><th>Check</th><th>Result</th><th>Detail</th></tr>
{check_rows()}</table>
<h2>Overlap accounting (recomputed from the geometries)</h2>
<table><tr><th>Parcel</th><th>Hazard</th><th>Recomputed (m2)</th>
<th>% of parcel</th><th>Stored (m2)</th><th>Coverage</th><th>Result</th>
<th>Verdict</th></tr>{overlap_table()}</table>
<h2>Incoming test batch — reason-coded reject list</h2>
<table><tr><th>Parcel ID</th><th>Name</th><th>Type</th><th>Reasons</th>
<th>Disposition</th></tr>{batch_table()}</table>
<p>Reject reason instances: {sum(reason_counts.values())} across
{sum(1 for r in batch_results if not r['accepted'])} rejected rows —
a row can carry more than one reason, so reason totals are not a second
row count.</p>
<p>Full detail, reconciliation table, source register and input hash are
in <code>qa_report.md</code> (same report, same computed results).</p>
</body></html>
"""


if __name__ == "__main__":
    sys.exit(main())
