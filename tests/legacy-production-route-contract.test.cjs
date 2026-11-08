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
