"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const computing = fs.readFileSync(path.join(root, "public/computing/index.html"), "utf8");
const labs = fs.readFileSync(path.join(root, "public/labs/index.html"), "utf8");
function hasLink(document, route) {
  return document.includes('href="' + route + '"') || document.includes('href=' + route);
}

function assertBrandOrder(document) {
  const computingIndex = document.indexOf("id=computing-heading");
  const labsIndex = document.indexOf("id=labs-heading");
  assert.notEqual(computingIndex, -1, "Missing Computing heading");
  assert.notEqual(labsIndex, -1, "Missing Labs heading");
  assert.ok(computingIndex < labsIndex, "Computing service card must precede Labs card");
}

test("brand ordering guard rejects missing and reversed headings", () => {
  const computingHeading = "id=computing-heading";
  const labsHeading = "id=labs-heading";
  assert.throws(() => assertBrandOrder(labsHeading), /Missing Computing heading/);
  assert.throws(() => assertBrandOrder(computingHeading), /Missing Labs heading/);
  assert.throws(() => assertBrandOrder(labsHeading + computingHeading), /must precede/);
  assert.doesNotThrow(() => assertBrandOrder(computingHeading + labsHeading));
});

test("preview homepage gives each brand a route and keeps the direct Wisp demo", () => {
  for (const route of ["/computing/", "/labs/", "/games/hunt-for-wisps/play/?demo=1", "/games/", "/halloween/", "/tiers/"]) {
    assert.ok(hasLink(html, route), "Missing homepage link: " + route);
  }
  assert.ok(html.includes("ZQM Computing") && html.includes("ZQM Labs"));
  const mainIndex = html.indexOf("<main ");
  assert.notEqual(mainIndex, -1, "Missing main element");
  assertBrandOrder(html.slice(mainIndex));
});

test("Computing landing page is inquiry-only with non-certified screening limitations", () => {
  assert.match(computing, /<strong>not<\/strong> a certified survey/i);
  assert.match(computing, /GIS workflow automation/i);
  assert.match(computing, /Web GIS/i);
  assert.doesNotMatch(computing, /<form\b|checkout\.stripe\.com|buy\.stripe\.com/i);
  assert.ok(hasLink(computing, "/computing/inquiry/"));
  assert.match(computing, /"name":"ZQM Computing"/);
  assert.match(computing, /"url":"https:\/\/zqmlabs\.com\/computing\/"/);
});

test("Labs landing links directly to demo without claiming a booked event", () => {
  assert.ok(hasLink(labs, "/games/hunt-for-wisps/play/?demo=1"));
  assert.match(labs, /does not confirm host availability/i);
});

test("all three Computing services exist without activating forms or checkout", () => {
  const routes = ["environmental-screening", "gis-automation", "web-gis"];
  for (const name of routes) {
    const route = "/computing/services/" + name + "/";
    assert.ok(hasLink(computing, route), "Missing Computing service link: " + route);
    const output = path.join(root, "public/computing/services", name, "index.html");
    assert.ok(fs.existsSync(output), "Missing service page output: " + output);
    const page = fs.readFileSync(output, "utf8");
    assert.ok(page.includes("https://zqmlabs.com" + route), "Missing canonical on " + route);
    assert.match(page, /"name":"ZQM Computing"/);
    assert.doesNotMatch(page, /<form\b|checkout\.stripe\.com|buy\.stripe\.com/i);
    assert.ok(hasLink(page, "/computing/inquiry/"), "Missing scoped inquiry route on " + route);
  }
});

test("Computing inquiries remain brand-specific, mailto-only and noncommittal", () => {
  const file = path.join(root, "public/computing/inquiry/index.html");
  assert.ok(fs.existsSync(file), "Computing inquiry route missing");
  const page = fs.readFileSync(file, "utf8");
  assert.match(page, /ZQM Computing/);
  assert.match(page, /mailto:zqmcomputing@gmail.com/);
  assert.match(page, /booking, order confirmation/i);
  assert.doesNotMatch(page, /<form\b|checkout\.stripe\.com|buy\.stripe\.com/i);
  assert.doesNotMatch(page, /within one business day|under 1 business day/i);
  assert.ok(hasLink(page, "/labs/"));
});

test("preview build includes no new paid game output", () => {
  for (const target of ["public/packs", "public/games/pumpkin-roll/play", "public/games/snowflake-secret/play"]) {
    assert.equal(fs.existsSync(path.join(root, target)), false, "Unreviewed artifact: " + target);
  }
});
