"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {parse,compare} = require("../scripts/compare-public-inventories.cjs");
const h = n => n.repeat(64);
test("classifies added, removed, changed and identical files exactly", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),"zqm-compare-"));
  try {
    const a = path.join(tmp,"old.tsv"), b = path.join(tmp,"new.tsv");
    fs.writeFileSync(a, "path\tbytes\tsha256\nchanged.txt\t1\t"+h("a")+"\nidentical.txt\t1\t"+h("b")+"\nremoved.txt\t2\t"+h("c")+"\n");
    fs.writeFileSync(b, "path\tbytes\tsha256\nadded.txt\t1\t"+h("d")+"\nchanged.txt\t1\t"+h("e")+"\nidentical.txt\t1\t"+h("b")+"\n");
    const result = compare(parse(a),parse(b));
    assert.deepEqual(result.counts,{added:1,removed:1,changed:1,identical:1});
    assert.deepEqual(result.changes.map(x=>x.path),["added.txt","changed.txt","identical.txt","removed.txt"]);
    fs.writeFileSync(b, "path\tbytes\tsha256\n../unsafe\t1\t"+h("a")+"\n");
    assert.throws(()=>parse(b),/Unsafe inventory path/);
    fs.writeFileSync(b, "path\tbytes\tsha256\nx\t1\t"+h("a")+"\nx\t1\t"+h("a")+"\n");
    assert.throws(()=>parse(b),/Duplicate path/);
  } finally {fs.rmSync(tmp,{recursive:true,force:true});}
});
