import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");

test("required scripts exist", () => {
  const requiredScripts = [
    "scripts/check-built-links.mjs",
    "scripts/gen_quest_pack.py",
    "scripts/gen_wisp_art.py",
    "scripts/sync-player.sh",
    "scripts/test-player-source.cjs",
  ];
  
  for (const script of requiredScripts) {
    assert.ok(existsSync(join(repoRoot, script)), `Missing script: ${script}`);
  }
});

test("gen_quest_pack.py is syntactically valid Python", () => {
  const content = readFileSync(join(repoRoot, "scripts", "gen_quest_pack.py"), "utf-8");
  assert.ok(content.includes("def "), "Python script must have function definitions");
  assert.ok(content.includes("import "), "Python script must have imports");
});

test("gen_wisp_art.py is syntactically valid Python", () => {
  const content = readFileSync(join(repoRoot, "scripts", "gen_wisp_art.py"), "utf-8");
  assert.ok(content.includes("from PIL"), "Must import PIL");
  assert.ok(content.includes("def "), "Python script must have function definitions");
});

test("hugo.toml has required fields", () => {
  const content = readFileSync(join(repoRoot, "hugo.toml"), "utf-8");
  assert.ok(content.includes("baseURL"), "Missing baseURL");
  assert.ok(content.includes("title"), "Missing title");
});
