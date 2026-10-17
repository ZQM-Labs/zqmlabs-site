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
assert.match(worker, /const CACHE = "lantern-v5";/, "player release must invalidate the previous app-shell cache");
assert.match(homepage, /\/games\/hunt-for-wisps\/play\/\?demo=1/, "homepage CTA must open the actual demo player");
assert.match(gamePage, /\/games\/hunt-for-wisps\/play\/\?demo=1/, "game page must expose a direct demo launch link");

console.log("Player source regression checks passed.");
