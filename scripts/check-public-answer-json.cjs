#!/usr/bin/env node
// Guard public JSON artifacts against accidental publication of organizer answer keys.
// This is deliberately schema-based rather than filename-based.
const fs = require("node:fs");
const path = require("node:path");
function scan(root) {
  const findings = [];
  if (!fs.existsSync(root)) return findings;
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { visit(full); continue; }
      if (!entry.isFile() || !entry.name.toLowerCase().endsWith(".json")) continue;
      let data;
      try { data = JSON.parse(fs.readFileSync(full,"utf8")); }
      catch { continue; } // Syntax validation belongs to the JSON producer.
      if (!data || !Array.isArray(data.stops)) continue;
      const sensitive = data.stops.some(stop => stop && typeof stop === "object" &&
        ((stop.puzzle && Object.values(stop.puzzle).some(p => p && typeof p === "object" && Object.hasOwn(p,"a"))) ||
         (stop.fallback && Object.hasOwn(stop.fallback,"a")) ||
         Object.hasOwn(stop,"code")));
      if (sensitive) findings.push(full);
    }
  }
  visit(root);
  return findings;
}
if (process.argv.includes("--self-test")) {
  const os = require("node:os");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),"public-pack-guard-"));
  try {
    fs.mkdirSync(path.join(tmp,"renamed"),{recursive:true});
    fs.writeFileSync(path.join(tmp,"renamed","payload.json"),JSON.stringify({stops:[{puzzle:{cozy:{a:"fixture"}}}]}));
    if (scan(tmp).length !== 1) throw new Error("Failed to detect relocated answer-bearing JSON");
    fs.writeFileSync(path.join(tmp,"renamed","payload.json"),JSON.stringify({stops:[{puzzle:{cozy:{q:"fixture"}}}]}));
    if (scan(tmp).length !== 0) throw new Error("Rejected answer-free fixture");
    console.log("Public JSON boundary fixtures passed.");
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
  process.exit(0);
}
const findings = [...scan("static"), ...scan("public")];
if (findings.length) {
  for (const file of findings) console.error("::error file="+file+"::Answer-bearing organizer JSON must not be public.");
  process.exit(1);
}
console.log("No answer-bearing organizer JSON found in public source/build.");
