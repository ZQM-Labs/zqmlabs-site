#!/usr/bin/env node
"use strict";
/**
 * Offline, fail-closed release review for pinned publisher vs preview inventories.
 * This script cannot deploy; a "pass" means only the bounded file invariants pass.
 */
const fs = require("node:fs");
const path = require("node:path");
const {parse, compare} = require("./compare-public-inventories.cjs");
const PROTECTED = [
  "_headers",
  "_redirects",
  "games/hunt-for-wisps/play/PLAYER_SOURCE_SHA",
  "games/hunt-for-wisps/play/app.js",
  "games/hunt-for-wisps/play/sw.js"
];
const MANIFEST = "release-manifest.json";
// Public release inventories must never introduce private data or key material,
// even when a human-review delta list otherwise permits additional files.
function forbiddenPublicPath(name) {
  const parts=name.toLowerCase().split("/");
  const leaf=parts[parts.length-1];
  return parts.some(p=>[".git",".github","private","packs","__pycache__"].includes(p)) ||
    leaf===".env" || leaf.startsWith(".env.") ||
    [".pem",".key",".p12",".pfx"].some(ext=>leaf.endsWith(ext));
}
function review(baseline, candidate, allowlist) {
  if (allowlist.length !== 39 || new Set(allowlist).size !== 39 ||
      allowlist.some(x=>!x || x===MANIFEST || x.startsWith("/") ||
          x.includes("\\") || x.split("/").some(p=>!p || p==="." || p===".."))) {
    throw Error("Invalid frozen 39-asset allowlist");
  }
  const changes = compare(baseline, candidate);
  const allowedMissing = new Set([...allowlist, MANIFEST]);
  const blockers = [];
  if (candidate.has(MANIFEST)) {
    blockers.push({path:MANIFEST, reason:"publisher-only manifest must not be supplied by site preview"});
  }
  for (const name of PROTECTED) {
    if (!baseline.has(name)) blockers.push({path:name, reason:"protected baseline missing"});
    if (!candidate.has(name)) blockers.push({path:name, reason:"protected candidate missing"});
  }
  for (const name of candidate.keys()) {
    if (forbiddenPublicPath(name)) {
      blockers.push({path:name, reason:"forbidden private or credential-bearing public artifact"});
    }
  }
  for (const record of changes.changes) {
    if (PROTECTED.includes(record.path) && record.status!=="identical") {
      blockers.push({path:record.path, reason:"protected artifact must remain byte-identical"});
    }
    if (record.status==="removed" && !allowedMissing.has(record.path)) {
      blockers.push({path:record.path, reason:"unexpected missing production file"});
    }
  }
  const expectedMissing = changes.changes.filter(x=>x.status==="removed" && allowedMissing.has(x.path));
  const humanReview = changes.changes.filter(x=>x.status==="changed" && !PROTECTED.includes(x.path) ||
                                                         x.status==="added");
  return {artifact_boundary_pass: blockers.length===0, release_approved:false,
    counts:changes.counts, protected_paths:PROTECTED,
    permitted_missing_for_review:expectedMissing.map(x=>x.path),
    human_review_required:humanReview.map(x=>({path:x.path,status:x.status})),
    blockers};
}
function loadAllowlist(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/)
    .map(x=>x.trim()).filter(x=>x && !x.startsWith("#"));
}
if (require.main===module) {
  if (process.argv.length!==5) {
    console.error("Usage: node review-public-release-delta.cjs BASELINE.tsv CANDIDATE.tsv FROZEN_ALLOWLIST.txt");
    process.exit(2);
  }
  try {
    const [baseline,candidate,allowlist]=process.argv.slice(2).map(x=>path.resolve(x));
    const result=review(parse(baseline),parse(candidate),loadAllowlist(allowlist));
    process.stdout.write(JSON.stringify(result,null,2)+"\n");
    process.exitCode=result.artifact_boundary_pass?0:1;
  } catch(error) {
    console.error(JSON.stringify({artifact_boundary_pass:false,release_approved:false,error:String(error.message)}));
    process.exitCode=1;
  }
}
module.exports={review,loadAllowlist,PROTECTED};
