#!/usr/bin/env node
"use strict";
// Fail closed when buyer-oriented environmental GIS resources are omitted or
// disconnected by a source overlay. Validate rendered output, not markdown alone.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const routes = [
  "/computing/resources/",
  "/computing/resources/environmental-permit-map-checklist/",
  "/computing/resources/qgis-atlas-parcel-map-series/",
  "/computing/resources/desktop-wetland-screening-vs-delineation/",
];
const articles = routes.slice(1);
const forbidden = /(?:ArcGIS Enterprise|jurisdictionally cleared|guaranteed permit approval|344 S\\.? Woodland)/i;
const hasLink = (html, href) => [...html.matchAll(/<a\\b[^>]*\\bhref=(?:"([^"]*)"|'([^']*)'|([^\\s>]+))[^>]*>/gi)]
  .some(m => (m[1] ?? m[2] ?? m[3]) === href);

function validate(root) {
  const read = url => fs.readFileSync(path.join(root, url, "index.html"), "utf8");
  const home = read("/computing/");
  const service = read("/computing/services/environmental-screening/");
  const hub = read(routes[0]);
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.ok(hasLink(home, routes[0]), "Computing home must link GIS resources");
  assert.ok(hasLink(service, routes[0]), "Environmental GIS service must link resources");
  for (const route of routes) {
    const html = read(route);
    assert.equal((html.match(/<h1\\b/gi) || []).length, 1, "Exactly one H1: " + route);
    assert.ok(html.includes('rel="canonical"'), "Missing canonical: " + route);
    assert.ok(!/<meta[^>]*name="robots"[^>]*noindex/i.test(html), "Resource unexpectedly noindexed: " + route);
    assert.ok(sitemap.includes("https://zqmlabs.com" + route), "Missing sitemap URL: " + route);
    assert.doesNotMatch(html, forbidden, "Unsupported claim or privacy leak in " + route);
  }
  for (const route of articles) {
    assert.ok(hasLink(hub, route), "Resource index omits article: " + route);
    const html = read(route);
    assert.ok(hasLink(html, "/computing/services/environmental-screening/"), "Missing service path: " + route);
    assert.ok(hasLink(html, "/computing/inquiry/#map-production"), "Missing inquiry path: " + route);
  }
  const wetland = read(routes[3]);
  assert.match(wetland, /U\\.S\\. Fish|USFWS|fws\\.gov/i, "Need authoritative wetland source");
  assert.match(wetland, /unknown/i, "Missing unknown coverage status");
  const atlas = read(routes[2]);
  assert.match(atlas, /docs\\.qgis\\.org/i, "Need authoritative QGIS source");
  assert.match(atlas, /parcel_id/i, "Need tractable example identifiers");
  const manifestPath = path.join(root, "release-manifest.json");
  if (fs.existsSync(manifestPath)) {
    const m = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    for (const relative of ["resources/_index.md", "resources/environmental-permit-map-checklist.md",
      "resources/qgis-atlas-parcel-map-series.md", "resources/desktop-wetland-screening-vs-delineation.md"]) {
      assert.ok(m.site_content_files?.includes("content/computing/" + relative), "Missing release inventory: " + relative);
    }
  }
  return "Environmental GIS buyer resources passed: routes, sitemap, internal links, evidence and claims.";
}
module.exports = {validate, routes};
if (require.main === module) console.log(validate(path.resolve(process.argv[2] || "public")));
