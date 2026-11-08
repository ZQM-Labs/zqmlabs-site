#!/usr/bin/env node
// Fail closed when repository-control, private, or paid-kit files enter Hugo output.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const forbiddenDirectory = new Set([
  ".git", ".github", ".git.broken", "private", "secrets", "backend", "node_modules",
  "__pycache__", "packs"
]);
const forbiddenFilename = /^(?:\.env(?:\..*)?|\.gitignore|\.gitattributes|id_(?:rsa|ed25519)|.*\.(?:pem|key|p12|pfx))$/i;
const forbiddenPlayerFile = /^(?:readme\.md|package(?:-lock)?\.json|pyproject\.toml|requirements\.txt)$/i;
const playerPrefix = "games/hunt-for-wisps/play/";

export function checkArtifact(root) {
  const failures = [];
  let files = 0;
  function visit(directory, segments = []) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = [...segments, entry.name];
      const rel = relative.join("/");
      const location = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) {
        failures.push(`${rel}: symlink must not be published`);
        continue;
      }
      if (entry.isDirectory()) {
        if (forbiddenDirectory.has(entry.name.toLowerCase())) {
          failures.push(`${rel}: forbidden directory`);
          continue;
        }
        visit(location, relative);
        continue;
      }
      if (!entry.isFile()) {
        failures.push(`${rel}: unsupported filesystem entry`);
        continue;
      }
      files += 1;
      if (forbiddenFilename.test(entry.name)) {
        failures.push(`${rel}: forbidden filename`);
      }
      if (rel.startsWith(playerPrefix) &&
          forbiddenPlayerFile.test(entry.name)) {
        failures.push(`${rel}: non-runtime player file`);
      }
    }
  }
  if (!fs.statSync(root).isDirectory()) throw new Error("Build artifact is not a directory");
  visit(root);
  return { files, failures };
}

function selfTest() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "zqm-artifact-"));
  try {
    const add = (relative, content = "test") => {
      const file = path.join(tmp, relative);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, content);
    };
    add("index.html");
    add("games/hunt-for-wisps/play/index.html");
    assert.deepEqual(checkArtifact(tmp).failures, []);

    const probes = [
      [".github/workflows/release.yml", "forbidden directory"],
      ["private/customer.csv", "forbidden directory"],
      ["packs/paid-kit.pdf", "forbidden directory"],
      ["games/hunt-for-wisps/play/README.md", "non-runtime player file"],
      ["games/hunt-for-wisps/play/.env", "forbidden filename"]
    ];
    for (const [name, reason] of probes) {
      add(name);
      assert(checkArtifact(tmp).failures.some(f => f.includes(name) && f.includes(reason)));
      fs.unlinkSync(path.join(tmp, name));
    }
    if (process.platform !== "win32") {
      const target = path.join(tmp, "index.html");
      const alias = path.join(tmp, "public-link.html");
      fs.symlinkSync(target, alias);
      assert(checkArtifact(tmp).failures.some(f => f.includes("symlink")));
      fs.unlinkSync(alias);
    }
    console.log("Public artifact boundary negative tests passed.");
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  if (process.argv.includes("--self-test")) selfTest();
  else {
    const root = path.resolve(process.argv[2] || "public");
    const result = checkArtifact(root);
    if (result.failures.length) {
      for (const failure of result.failures) console.error("::error::" + failure);
      process.exitCode = 1;
    } else {
      console.log(`Public artifact boundary passed: ${result.files} files checked.`);
    }
  }
}
