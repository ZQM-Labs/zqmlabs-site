"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const playerDir = path.join(root, "static", "games", "lantern-player");
const appPath = path.join(playerDir, "app.js");
const imageDir = path.join(playerDir, "assets", "img");
const app = fs.readFileSync(appPath, "utf8");
const available = new Set(fs.readdirSync(imageDir));
const tiers = ["cozy", "spooky", "afterdark", "overdrive"];
const artNames = [...app.matchAll(/\bart:\s*"([^"]+\.webp)"/g)].map((match) => match[1]);

assert.equal(artNames.length, 6, "Expected exactly six authored stop-art basenames");
assert.equal(new Set(artNames).size, 6, "Stop-art basenames must be unique");
assert.match(
  app,
  /const tier = state\.scare \|\| "cozy";/,
  "The player must select the current tier and default to Cozy",
);
assert.match(
  app,
  /stop\.art\.replace\(\/\\\.webp\$\/i, "-" \+ tier \+ "\.webp"\)/,
  "The player must append the selected tier suffix to every stop-art basename",
);
assert.match(
  app,
  /s\.art\.replace\(\/\\\.webp\$\/i, "-cozy\.webp"\)/,
  "A missing tier image must fall back to the existing Cozy variant",
);
assert.ok(artNames.includes("stop-6-lantern.webp"), "Stop 6 must use the actual lantern asset basename");
assert.ok(!artNames.includes("stop-6-parade.webp"), "Stop 6 must not reference the nonexistent parade basename");

for (const art of artNames) {
  for (const tier of tiers) {
    const expected = art.replace(/\.webp$/i, `-${tier}.webp`);
    assert.ok(available.has(expected), `Missing ${tier} art variant: ${expected}`);
  }
}

console.log(`Verified ${artNames.length} stops × ${tiers.length} art tiers and Cozy fallbacks.`);
