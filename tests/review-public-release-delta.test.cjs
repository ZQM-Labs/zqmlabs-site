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
 assert.ok(result.blockers.some(x=>x.path==="private-unexpected.txt" && /unexpected missing/.test(x.reason)));
});
test("reject malformed or expanded restoration allowlists",()=>{
 assert.throws(()=>review(base(),base(),allow.slice(0,38)),/Invalid frozen/);
 assert.throws(()=>review(base(),base(),[...allow.slice(0,38),"../escape"]),/Invalid frozen/);
 assert.throws(()=>review(base(),base(),[...allow.slice(0,38),allow[0]]),/Invalid frozen/);
});

test("forbid credential and private artifacts even when listed for human review",()=>{
 const old=base(), next=new Map(old);
 for(const name of [".env.production","packs/answers.json","private/orders.json","assets/signing.key",
                    "nested/.github/workflows/release.yml","secrets/cert.PEM"]){
  next.set(name,same);
 }
 const result=review(old,next,allow);
 assert.equal(result.artifact_boundary_pass,false);
 assert.equal(result.release_approved,false);
 for(const name of [".env.production","packs/answers.json","private/orders.json","assets/signing.key",
                    "nested/.github/workflows/release.yml","secrets/cert.PEM"]){
  assert.ok(result.blockers.some(x=>x.path===name && /forbidden/.test(x.reason)),name);
 }
});
test("ordinary additional public content remains subject to human review",()=>{
 const old=base(), next=new Map(old);
 next.delete("release-manifest.json");
 next.set("computing/index.html",same);
 const result=review(old,next,allow);
 assert.equal(result.artifact_boundary_pass,true);
 assert.equal(result.release_approved,false);
 assert.ok(result.human_review_required.some(x=>x.path==="computing/index.html"));
});

test("reject preview-supplied release manifest even when bytes match the publisher",()=>{
 const old=base(), next=new Map(old);
 const identical=review(old,next,allow);
 assert.equal(identical.artifact_boundary_pass,false);
 assert.ok(identical.blockers.some(x=>x.path==="release-manifest.json" &&
   /publisher-only/.test(x.reason)));
 next.set("release-manifest.json",different);
 const modified=review(old,next,allow);
 assert.equal(modified.artifact_boundary_pass,false);
 assert.ok(modified.blockers.some(x=>x.path==="release-manifest.json" &&
   /publisher-only/.test(x.reason)));
});
test("preview omission of publisher manifest is review-only, never release approval",()=>{
 const old=base(), next=new Map(old);
 next.delete("release-manifest.json");
 const result=review(old,next,allow);
 assert.equal(result.artifact_boundary_pass,true);
 assert.equal(result.release_approved,false);
 assert.ok(result.permitted_missing_for_review.includes("release-manifest.json"));
});
