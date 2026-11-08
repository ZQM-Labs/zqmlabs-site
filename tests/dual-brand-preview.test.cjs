"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "public/index.html"), "utf8");
const computing = fs.readFileSync(path.join(root, "public/computing/index.html"), "utf8");
const labs = fs.readFileSync(path.join(root, "public/labs/index.html"), "utf8");

test("preview homepage gives each brand a route and exposes the playable demo", () => {
  for (const route of ['href="/computing/"', 'href="/labs/"', 'href="/games/hunt-for-wisps/play/?demo=1"']) {
    assert.ok(html.includes(route), 'Missing homepage link: ' + route);
  }
  assert.ok(html.includes('ZQM Computing') && html.includes('ZQM Labs'));
  assert.ok(html.indexOf('ZQM Computing') < html.indexOf('ZQM Labs'), 'Computing service CTA must appear first');
});

test("Computing landing page has preliminary-screening limitations and no payment or intake form", () => {
  assert.match(computing, /not.*certified survey/i);
  assert.match(computing, /GIS workflow automation/i);
  assert.match(computing, /Web GIS/i);
  assert.doesNotMatch(computing, /<form\b|checkout\.stripe\.com|buy\.stripe\.com/i);
  assert.match(computing, /href="\/contact\//);
});

test("Labs landing links directly to demo without implying booking", () => {
  assert.match(labs, /href="\/games\/hunt-for-wisps\/play\/\?demo=1"/);
  assert.match(labs, /does not confirm host availability/i);
});

test("preview does not add paid game outputs or secret-bearing pages", () => {
  for (const target of ["public/packs", "public/games/pumpkin-roll/play", "public/games/snowflake-secret/play"]) {
    assert.equal(fs.existsSync(path.join(root, target)), false, 'Unreviewed artifact: ' + target);
  }
});
