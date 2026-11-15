"use strict";
const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {validate} = require("../scripts/check-professional-profile.cjs");
const built = path.resolve(__dirname, "../public");

test("built professional profile and public download are connected", () => {
  assert.match(validate(built), /passed/);
});

test("release guard rejects a missing PDF and an incorrect professional credential", t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zqm-profile-"));
  t.after(() => fs.rmSync(root, {recursive:true, force:true}));
  for (const file of ["computing/index.html", "computing/alex-zelenski/index.html", "computing/portfolio/index.html", "computing/alex-zelenski-resume.pdf", "sitemap.xml"]) {
    fs.mkdirSync(path.dirname(path.join(root, file)), {recursive:true});
    fs.copyFileSync(path.join(built, file), path.join(root, file));
  }
  const pdf = path.join(root, "computing/alex-zelenski-resume.pdf");
  fs.unlinkSync(pdf);
  assert.throws(() => validate(root), /ENOENT/);
  fs.copyFileSync(path.join(built, "computing/alex-zelenski-resume.pdf"), pdf);
  const page = path.join(root, "computing/alex-zelenski/index.html");
  const original = fs.readFileSync(page, "utf8");
  fs.writeFileSync(page, original.replace('"honorificSuffix":"GISP"', '"honorificSuffix":"PhD"'));
  assert.throws(() => validate(root), /GISP/);
});
