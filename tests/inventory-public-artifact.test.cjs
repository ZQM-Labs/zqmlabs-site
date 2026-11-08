"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");
const inventory = path.resolve(__dirname, "../scripts/inventory-public-artifact.cjs");
test("inventory is deterministic, hashed, and kept outside public", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "zqm-site-inventory-"));
  try {
    const pub = path.join(tmp, "public");
    fs.mkdirSync(path.join(pub, "sub"), {recursive:true});
    fs.writeFileSync(path.join(pub, "sub", "b.txt"), "data");
    fs.writeFileSync(path.join(pub, "a.txt"), "alpha");
    const out = path.join(tmp, "evidence", "inventory.tsv");
    cp.execFileSync(process.execPath, [inventory, pub, out]);
    const first = fs.readFileSync(out, "utf8");
    cp.execFileSync(process.execPath, [inventory, pub, out]);
    assert.equal(fs.readFileSync(out, "utf8"), first);
    const lines = first.trim().split("\n");
    assert.equal(lines[0], "path\tbytes\tsha256");
    assert.equal(lines.length, 3);
    assert.match(lines[1], /^a.txt\t5\t/);
    assert.ok(lines[1].endsWith(crypto.createHash("sha256").update("alpha").digest("hex")));
    assert.match(lines[2], /^sub\/b.txt\t4\t/);
    assert.equal(fs.existsSync(path.join(pub, "inventory.tsv")), false);
    assert.throws(() => cp.execFileSync(process.execPath, [inventory, pub, path.join(pub, "inventory.tsv")]), /Command failed/);
  } finally { fs.rmSync(tmp, {recursive:true, force:true}); }
});
