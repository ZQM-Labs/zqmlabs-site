#!/usr/bin/env node
"use strict";
// Compare independently generated inventories; does not alter or deploy public files.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
function parse(file) {
  const lines = fs.readFileSync(file, "utf8").trimEnd().split(/\r?\n/);
  if (lines.shift() !== "path\tbytes\tsha256") throw Error("Invalid inventory header: " + file);
  const records = new Map();
  for (const [index, line] of lines.entries()) {
    const parts = line.split("\t");
    if (parts.length !== 3) throw Error("Invalid inventory row " + (index + 2));
    const [name, size, digest] = parts;
    if (!name || name.startsWith("/") || name.includes("\\") || name.split("/").some(part => !part || part === "." || part === "..")) throw Error("Unsafe inventory path");
    if (!/^(0|[1-9][0-9]*)$/.test(size) || !/^[0-9a-f]{64}$/.test(digest)) throw Error("Invalid inventory data: " + name);
    if (records.has(name)) throw Error("Duplicate path: " + name);
    records.set(name, { size: Number(size), digest });
  }
  return records;
}
function compare(baseline, candidate) {
  const changes = [];
  const names = [...new Set([...baseline.keys(), ...candidate.keys()])].sort();
  for (const name of names) {
    const old = baseline.get(name);
    const next = candidate.get(name);
    const status = !old ? "added" : !next ? "removed" : old.size === next.size && old.digest === next.digest ? "identical" : "changed";
    changes.push({path:name,status,baseline_sha256:old?.digest || "",candidate_sha256:next?.digest || ""});
  }
  const counts = Object.fromEntries(["added","removed","changed","identical"].map(k=>[k,changes.filter(c=>c.status===k).length]));
  return {counts,changes};
}
if (require.main === module) {
  if (process.argv.length !== 4) { console.error("Usage: node compare-public-inventories.cjs BASELINE.tsv CANDIDATE.tsv"); process.exit(2); }
  const [baseline,candidate] = process.argv.slice(2).map(x => path.resolve(x));
  const result = compare(parse(baseline),parse(candidate));
  console.log(JSON.stringify(result,null,2));
}
module.exports = {parse,compare};
