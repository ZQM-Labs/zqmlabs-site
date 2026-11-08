"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const allowlist = fs.readFileSync(path.join(__dirname, "..", ".gitleaksignore"), "utf8");
const expected = [
  "add4d3d75fcd9f3cf7b50f7f9b66d74cb52215c2:docs/DUAL_BRAND_FILE_INVENTORY.csv:generic-api-key:13",
  "344aad1a2b79344477ed2bc3c7cc4acb895d0b99:docs/DUAL_BRAND_FILE_INVENTORY.csv:generic-api-key:13",
];
test("historical false-positive exceptions are exact fingerprints, never blanket rules", () => {
  const active = allowlist.split(/\r?\n/).map(x=>x.trim()).filter(x=>x && !x.startsWith("#"));
  assert.deepEqual(active.sort(), expected.slice().sort());
  for (const line of active) {
    assert.match(line, /^[0-9a-f]{40}:docs\/DUAL_BRAND_FILE_INVENTORY\.csv:generic-api-key:13$/);
    assert.doesNotMatch(line, /[*!?]/);
  }
});
test("historical fingerprints retain human-readable evidence and blocking policy", () => {
  assert.match(allowlist, /Git blob SHA/i);
  assert.match(allowlist, /full-history scanning/i);
  assert.match(allowlist, /blocking/i);
});
