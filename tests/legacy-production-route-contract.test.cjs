"use strict";
// Frozen route contract from archived publisher build run 42429271354.
// This is a preview/build check; live CDN and buyer flows require separate tests.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../public");
const BASELINE_ROUTES = [
  "/",
  "/about/",
  "/community/",
  "/contact/",
  "/direction/",
  "/faq/",
  "/games/",
  "/games/hunt-for-wisps/",
  "/games/lantern-player/",
  "/games/pumpkin-roll/",
  "/games/snowflake-secret/",
  "/games/wisps-tracker/",
  "/guides/",
  "/guides/ai-photo-geolocation-vs-real-world-quests/",
  "/guides/beyond-geocaching/",
  "/guides/birthday-scavenger-hunt/",
  "/guides/city-history-scavenger-hunt/",
  "/guides/family-community-games/",
  "/guides/fundraiser-scavenger-hunt/",
  "/guides/host-your-first-scavenger-hunt/",
  "/guides/location-games/",
  "/guides/outdoor-escape-games-vs-escape-rooms/",
  "/guides/outdoor-games-with-friends-no-app/",
  "/guides/team-building-games-no-equipment/",
  "/guides/team-building-games/",
  "/guides/youth-group-scavenger-hunt/",
  "/halloween/",
  "/locations/",
  "/locations/daytona-beach/",
  "/locations/deland/",
  "/locations/new-smyrna-beach/",
  "/locations/ormond-beach/",
  "/locations/port-orange/",
  "/organizers/",
  "/patterns/",
  "/press/",
  "/pricing/",
  "/privacy/",
  "/terms/",
  "/tiers/"
];
const ORIGIN = "https://zqmlabs.com";

function publishedRoutes() {
  const text = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  const entries = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  assert.equal(entries.length, new Set(entries).size, "Duplicate canonical sitemap URL");
  return new Set(entries);
}
function artifact(route) {
  return path.join(root, route === "/" ? "index.html" : route.slice(1) + "index.html");
}
test("all 40 existing public routes survive the dual-brand preview", () => {
  const published = publishedRoutes();
  assert.equal(BASELINE_ROUTES.length, 40);
  for (const route of BASELINE_ROUTES) {
    assert.ok(published.has(ORIGIN + route), "Missing baseline sitemap route: " + route);
    assert.ok(fs.existsSync(artifact(route)), "Missing existing route HTML: " + route);
  }
});
test("preview retains the publisher-rendered /games/ discovery page", () => {
  const html = fs.readFileSync(artifact("/games/"), "utf8");
  assert.match(html, /The directory distinguishes what can be played now from planned experiences/i);
  assert.match(html, /Playable browser demo/i);
  assert.match(html, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
  assert.doesNotMatch(html, /Internal Volusia field-guide route/i);
});
test("brand preview routes exist without changing the retained game directory", () => {
  for (const route of ["/labs/", "/computing/", "/computing/services/environmental-screening/", "/computing/services/gis-automation/", "/computing/services/web-gis/"]) {
    assert.ok(fs.existsSync(artifact(route)), "Missing preview route: " + route);
  }
});

test("production player and origin security contract stay byte-identical in preview", () => {
  const crypto = require("node:crypto");
  const hashes = new Map([
    ["_headers", "084539e5eedd3700a2ce28d972110c723c775b469668a532d22e51a74b0d754f"],
    ["_redirects", "a86219edab4a9afd594efa36ea59a06dc15a51ab9f19db10ec3178fa05695dd2"],
    ["games/hunt-for-wisps/play/PLAYER_SOURCE_SHA", "25d80eb3e9d75e832564ca75d13343d7e8a6ff6dac6cc22cedc9107343649fec"],
    ["games/hunt-for-wisps/play/app.js", "c90925ae9c43da99a2445ef0b45513c1970641d65843c24a5f7e1c1d3d68df45"],
    ["games/hunt-for-wisps/play/sw.js", "8acc600009cfc4e7bdc0b3c7765efb1a0497aedaa93f21561f1bee37481f54b9"]
  ]);
  for (const [file, expected] of hashes) {
    const artifact = path.join(root, file);
    assert.ok(fs.existsSync(artifact), "Missing protected deployed file: " + file);
    const actual = crypto.createHash("sha256").update(fs.readFileSync(artifact)).digest("hex");
    assert.equal(actual, expected, "Unapproved production contract change: " + file);
  }
});

test("legacy player remains an information page, not a duplicated standalone app", () => {
  const directory = path.join(root, "games/lantern-player");
  const page = fs.readFileSync(path.join(directory, "index.html"), "utf8");
  assert.match(page, /Lantern Player.{0,90}browser demo/i);
  assert.match(page, /software demo, not proof that a paid kit is orderable/i);
  assert.match(page, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
  assert.doesNotMatch(page, /<iframe[^>]+src=(?:"|)\/games\/lantern-player\//i);
  for (const file of ["app.js", "sw.js", "README.md", "tools", "assets", "vendor"]) {
    assert.equal(fs.existsSync(path.join(directory, file)), false,
      "Unreviewed legacy runtime or development file published: " + file);
  }
});

test("unapproved Daily Geo Mystery experiment is not public", () => {
  for (const file of ["experiments/daily-geo-mystery/index.html",
    "experiments/daily-geo-mystery/daily.mjs"]) {
    assert.equal(fs.existsSync(path.join(root, file)), false,
      "Research-only experiment included in public preview: " + file);
  }
});

test("404 recovery page avoids unreviewed prices or advertising unreleased games", () => {
  const page = fs.readFileSync(path.join(root, "404.html"), "utf8");
  assert.doesNotMatch(page, /\$\s*(?:49|199|349|499)\b/,
    "404 must not introduce a second source of commercial pricing claims");
  assert.match(page, /pumpkin.roll.{0,100}in development/i);
  assert.match(page, /snowflake.secret.{0,100}in development/i);
  assert.match(page, /href=(?:"|)\/pricing\//i);
});

test("pricing retains inquiry route, historical prices, and planned-season labels", () => {
  const pricing = fs.readFileSync(artifact("/pricing/"), "utf8");
  assert.match(pricing, /Great Pumpkin Roll[\s\S]{0,400}in development/i);
  assert.match(pricing, /Snowflake Secret[\s\S]{0,200}in development/i);
  assert.match(pricing, /Halloween 2026[\s\S]{0,200}past edition/i);
  assert.doesNotMatch(pricing, /Halloween, Autumn Festival, and Winter editions are.{0,50}live now/i);
  assert.match(pricing, /Live leaderboard \(coming soon\)/i);
  assert.match(pricing, /href=(?:"|)\/tiers\//i);
  const tiers = fs.readFileSync(artifact("/tiers/"), "utf8");
  assert.match(tiers, /https:\/\/buy\.stripe\.com\/28E14p9hV23bgNA5Fv9bO03/i, "Family Night must link to its verified Stripe payment link");
  assert.match(tiers, /https:\/\/buy\.stripe\.com\/28E6oJeCf0Z740Od7X9bO00/i, "Community must link to its verified Stripe payment link");
  assert.match(tiers, /https:\/\/buy\.stripe\.com\/14AcN78dR7nvbtg5Fv9bO01/i, "Office Team must link to its verified Stripe payment link");
  assert.match(tiers, /https:\/\/buy\.stripe\.com\/fZu14p8dR7nveFs0lb9bO02/i, "Office Event must link to its verified Stripe payment link");
  assert.doesNotMatch(tiers, /Paid kit checkout is paused/i);
  assert.doesNotMatch(pricing, /checkout is paused/i);
  assert.match(tiers, /href=(?:"|)\/contact\//i);
  assert.match(tiers, /Halloween 2026 (?:event )?window/i);
  assert.match(tiers, /FAMILY25/);
  assert.match(tiers, /refund/i);
  assert.match(tiers, /Your kit is usable as soon as checkout delivers it/i);
  assert.doesNotMatch(pricing, /<form\b/i, "Pricing should not add a new payment or intake form");
});
