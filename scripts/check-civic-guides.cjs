#!/usr/bin/env node
"use strict";

/** Source and generated-route assertions for civic planning pages, not a production-live check. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const names = [
  "host-your-first-scavenger-hunt",
  "city-history-scavenger-hunt",
  "outdoor-games-with-friends-no-app",
  "ai-photo-geolocation-vs-real-world-quests",
];

for (const name of names) {
  const filename = path.join(root, "content", "guides", name + ".md");
  const html = path.join(root, "public", "guides", name, "index.html");
  const markdown = fs.readFileSync(filename, "utf8");
  const frontMatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(frontMatter, filename + ": missing front matter");
  for (const key of ["title", "seo_title", "h1", "description"]) {
    assert.match(frontMatter[1], new RegExp("^" + key + ":\\s+\\S", "m"), filename + ": missing " + key);
  }
  assert.ok(markdown.length > 650, filename + ": insufficient helpful editorial content");
  assert.match(markdown, /not|approval|feasibility/i, filename + ": missing clear limitation language");
  assert.ok(fs.existsSync(html), html + ": expected Hugo route missing");
  const built = fs.readFileSync(html, "utf8");
  const metaTags = built.match(/<meta\b[^>]*>/gi) || [];
  assert.ok(metaTags.some(tag => /\bname\s*=\s*(?:"description"|'description'|description)(?=\s|>)/i.test(tag)), html + ": meta description missing");
}

const games = fs.readFileSync(path.join(root, "content", "games.md"), "utf8");
assert.doesNotMatch(games, /The Great Pumpkin Roll\s*\n\s*\nAutumn festival scavenger hunt · Playable/);
assert.doesNotMatch(games, /The Snowflake Secret\s*\n\s*\nWinter scavenger hunt · Playable/);
assert.match(games, /The Great Pumpkin Roll[\s\S]*?In development/);
assert.match(games, /The Snowflake Secret[\s\S]*?In development/);
console.log("Civic/group site source: four useful guide routes and truthful game statuses verified.");
