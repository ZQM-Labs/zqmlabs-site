"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const playerPath = path.join(root, "static/games/hunt-for-wisps/play/app.js");
const workerPath = path.join(root, "static/games/hunt-for-wisps/play/sw.js");
const homepagePath = path.join(root, "content/_index.md");
const gamePagePath = path.join(root, "content/games/hunt-for-wisps.md");

const player = fs.readFileSync(playerPath, "utf8");
const worker = fs.readFileSync(workerPath, "utf8");
const homepage = fs.readFileSync(homepagePath, "utf8");
const gamePage = fs.readFileSync(gamePagePath, "utf8");

assert.match(player, /const HINT_BUDGET = 18;/, "six stops should allow three hints per stop");
assert.match(
  player,
  /hintLevel = Math\.min\(3, Number\.isInteger\(state\.stopHints\[currentStop\.id\]\) \? state\.stopHints\[currentStop\.id\] : 0\)/,
  "reopening a stop should resume its hint ladder rather than repeat consumed hints"
);
assert.match(player, /state\.hintsUsed >= HINT_BUDGET/, "the global hint cap must be enforced");
assert.match(player, /if \(hintLevel < 3\)/, "each stop must cap its own hint ladder at three hints");
assert.match(player, /state\.stopHints\[currentStop\.id\] = \(state\.stopHints\[currentStop\.id\] \|\| 0\) \+ 1/, "hint use must persist against the active stop");
assert.ok(player.includes('for (const tier of ["spooky", "afterdark", "overdrive"])'), "all optional non-cozy tiers must be validated when present");
assert.match(
  player,
  /const pz = s\.puzzle && typeof s\.puzzle === "object" \? s\.puzzle\.cozy : null/,
  "each stop must validate its required cozy puzzle without requiring optional tiers"
);
assert.match(
  player,
  /if \(tierPuzzle !== undefined && tierPuzzle !== null\)/,
  "every optional tier that is present must be validated"
);
assert.ok(player.includes('if (!s || typeof s !== "object" || Array.isArray(s))'), "malformed stop records must be rejected without crashing");
assert.match(player, /fetchKitBundle\(result\.kit,\s*code\)/, "live kit loading must pass the validated access code to the bundle request");
assert.match(player, /method:\s*"POST"/, "live kit loading must use a POST request rather than expose kit identifiers in a GET path");
assert.match(player, /body:\s*JSON\.stringify\(\{\s*kitId,\s*code:\s*accessCode\s*\}\)/s, "live kit request must submit both kit ID and access code");
assert.match(worker, /const CACHE = "lantern-v[0-9]+";/, "service worker must define a versioned app-shell cache");
assert.match(homepage, /\/games\/hunt-for-wisps\/play\/\?demo=1/, "homepage CTA must open the actual demo player");
assert.match(gamePage, /\/games\/hunt-for-wisps\/play\/\?demo=1/, "game page must expose a direct demo launch link");

console.log("Player source regression checks passed.");
