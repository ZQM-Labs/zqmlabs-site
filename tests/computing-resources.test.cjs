"use strict";
const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {validate, routes} = require("../scripts/check-computing-resources.cjs");
const built = path.resolve(__dirname, "../public");

test("rendered GIS buyer resources are published and linked", () => {
  assert.match(validate(built), /passed/);
});

test("a missing source-overlay article blocks the release", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zqm-gis-resource-"));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  const pages = ["/computing/", "/computing/services/environmental-screening/", ...routes];
  for (const url of pages) {
    const dest = path.join(root, url, "index.html");
    fs.mkdirSync(path.dirname(dest), {recursive:true});
    fs.copyFileSync(path.join(built, url, "index.html"), dest);
  }
  fs.copyFileSync(path.join(built, "sitemap.xml"), path.join(root, "sitemap.xml"));
  assert.match(validate(root), /passed/);
  fs.rmSync(path.join(root, routes[2], "index.html"));
  assert.throws(() => validate(root), /ENOENT/);
});
