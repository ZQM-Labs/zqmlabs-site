"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {review,PROTECTED}=require("../scripts/review-public-release-delta.cjs");
const same={size:1,digest:"a".repeat(64)};
const different={size:1,digest:"b".repeat(64)};
const allow=Array.from({length:39},(_,i)=>"img/legacy-"+i+".webp");
function base(){return new Map([...PROTECTED.map(p=>[p,same]),
  ["pricing/index.html",same],["private-unexpected.txt",same],
  ...allow.map(p=>[p,same]),["release-manifest.json",same]]);}
test("baseline protected bytes and known legacy omissions remain review-only",()=>{
 const a=base(),b=new Map(a);
 b.delete("release-manifest.json");
 for(const name of allow)b.delete(name);
 b.set("pricing/index.html",different);
 b.set("computing/index.html",same);
 const result=review(a,b,allow);
 assert.equal(result.artifact_boundary_pass,true);
 assert.equal(result.release_approved,false);
 assert.equal(result.permitted_missing_for_review.length,40);
 assert.deepEqual(result.human_review_required.map(x=>x.path),["computing/index.html","pricing/index.html"]);
});
test("fail closed on modified or missing protected player and origin assets",()=>{
 const a=base(),b=new Map(a);
 b.set("_headers",different);b.delete("games/hunt-for-wisps/play/sw.js");
 const result=review(a,b,allow);
 assert.equal(result.artifact_boundary_pass,false);
 assert.ok(result.blockers.some(x=>x.path==="_headers"));
 assert.ok(result.blockers.some(x=>x.path==="games/hunt-for-wisps/play/sw.js"));
});
test("fail closed on an unexpected removed production artifact",()=>{
 const a=base(),b=new Map(a);b.delete("private-unexpected.txt");
 const result=review(a,b,allow);
 assert.equal(result.artifact_boundary_pass,false);
 assert.match(result.blockers[0].reason,/unexpected missing/);
});
test("reject malformed or expanded restoration allowlists",()=>{
 assert.throws(()=>review(base(),base(),allow.slice(0,38)),/Invalid frozen/);
 assert.throws(()=>review(base(),base(),[...allow.slice(0,38),"../escape"]),/Invalid frozen/);
 assert.throws(()=>review(base(),base(),[...allow.slice(0,38),allow[0]]),/Invalid frozen/);
});
