#!/usr/bin/env node
"use strict";
// Evidence-only inventory: never writes into the publishable public/ tree.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = path.resolve(process.argv[2] || "public");
const destination = path.resolve(process.argv[3] || "site-artifact-inventory.tsv");
if (!fs.statSync(root).isDirectory()) throw new Error("Missing public artifact directory");
if (destination === root || destination.startsWith(root + path.sep)) {
  throw new Error("Inventory must not be included in public/ output");
}
const lines = ["path\tbytes\tsha256"];
const entries = [];
function walk(dir, parts = []) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name, "en"))) {
    const name = [...parts, item.name];
    const full = path.join(dir, item.name);
    if (item.isSymbolicLink()) throw new Error("Symlink in public artifact: " + name.join("/"));
    if (item.isDirectory()) { walk(full, name); continue; }
    if (!item.isFile()) throw new Error("Unsupported artifact entry: " + name.join("/"));
    const bytes = fs.readFileSync(full);
    entries.push({ path: name.join("/"), bytes: bytes.length, sha: crypto.createHash("sha256").update(bytes).digest("hex") });
  }
}
walk(root);
entries.sort((a,b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
for (const item of entries) lines.push([item.path, item.bytes, item.sha].join("\t"));
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, lines.join("\n") + "\n");
console.log("Inventoried " + entries.length + " published files to " + destination);
