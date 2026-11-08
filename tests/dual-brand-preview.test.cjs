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

test("preview homepage gives each brand a route and keeps the direct Wisp demo", () => {
  for (const route of ["/computing/", "/labs/", "/games/hunt-for-wisps/play/?demo=1", "/games/", "/halloween/", "/tiers/"]) {
    assert.ok(hasLink(html, route), "Missing homepage link: " + route);
  }
  assert.ok(html.includes("ZQM Computing") && html.includes("ZQM Labs"));
  const main = html.slice(html.indexOf("<main "));
  assert.ok(main.indexOf("id=computing-heading") < main.indexOf("id=labs-heading"), "Computing service card must precede Labs card");
});

test("Computing landing page is inquiry-only with non-certified screening limitations", () => {
  assert.match(computing, /<strong>not<\/strong> a certified survey/i);
  assert.match(computing, /GIS workflow automation/i);
  assert.match(computing, /Web GIS/i);
  assert.doesNotMatch(computing, /<form\b|checkout\.stripe\.com|buy\.stripe\.com/i);
  assert.ok(hasLink(computing, "/contact/"));
  assert.match(computing, /"name":"ZQM Computing"/);
  assert.match(computing, /"url":"https:\/\/zqmlabs\.com\/computing\/"/);
});

test("Labs landing links directly to demo without claiming a booked event", () => {
  assert.ok(hasLink(labs, "/games/hunt-for-wisps/play/?demo=1"));
  assert.match(labs, /does not confirm host availability/i);
});

test("preview build includes no new paid game output", () => {
  for (const target of ["public/packs", "public/games/pumpkin-roll/play", "public/games/snowflake-secret/play"]) {
    assert.equal(fs.existsSync(path.join(root, target)), false, "Unreviewed artifact: " + target);
  }
});
