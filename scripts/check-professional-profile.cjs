#!/usr/bin/env node
"use strict";
// Verify the rendered profile, portfolio, download and entity relationship.
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

function validate(root) {
  const route = "/computing/alex-zelenski/";
  const pdf = "/computing/alex-zelenski-resume.pdf";
  const portfolio = "/computing/portfolio/";
  const read = url => fs.readFileSync(path.join(root, url, "index.html"), "utf8");
  const profile = read(route);
  const projects = read(portfolio);
  const hasLink = (html, href) => [...html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi)]
    .some(m => (m[1] ?? m[2] ?? m[3]) === href);
  for (const [url, html] of [[route, profile], [portfolio, projects]]) {
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, "One H1 required: " + url);
    assert.ok(hasLink(html, pdf), "Missing public resume link: " + url);
    assert.ok(hasLink(html, "/computing/inquiry/"), "Missing client inquiry: " + url);
    assert.doesNotMatch(html, /ArcGIS Enterprise|\(386\) 265-9994|386-265-9994|344 S\.? Woodland/i,
      "Unsupported experience or private contact detail in public copy");
  }
  assert.ok(hasLink(profile, portfolio), "Profile must link project evidence");
  assert.ok(hasLink(projects, route), "Portfolio must link professional profile");
  assert.ok(hasLink(read("/computing/"), route), "Services must link to the person delivering work");
  const graph = [...profile.matchAll(/<script\b[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json'|application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi)]
    .flatMap(m => { const value = JSON.parse(m[1]); return value["@graph"] || [value]; });
  const people = graph.filter(x => x["@type"] === "Person");
  const pages = graph.filter(x => x["@type"] === "ProfilePage");
  assert.equal(people.length, 1, "Exactly one Person entity required");
  assert.equal(pages.length, 1, "Exactly one ProfilePage entity required");
  const person = people[0];
  assert.equal(person.name, "Alex Zelenski");
  assert.equal(person.honorificSuffix, "GISP");
  assert.equal(person.url, "https://zqmlabs.com" + route);
  assert.equal(pages[0].mainEntity["@id"], person["@id"], "ProfilePage must reference the visible person");
  assert.equal(person.affiliation.name, "ZQM Computing");
  assert.equal(person.alumniOf.name, "Stetson University");
  assert.equal(person.hasCredential.name, "Certified GIS Professional (GISP)");
  assert.ok(!person.honorificPrefix, "The game persona must not imply an academic doctorate");
  const bytes = fs.readFileSync(path.join(root, pdf));
  assert.equal(bytes.subarray(0, 5).toString(), "%PDF-", "Resume download must be a PDF");
  assert.ok(bytes.length > 10000, "Resume file is unexpectedly small");
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  for (const url of [route, portfolio]) assert.ok(sitemap.includes("https://zqmlabs.com" + url), "Missing sitemap route: " + url);
  const manifestFile = path.join(root, "release-manifest.json");
  if (fs.existsSync(manifestFile)) {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    for (const file of ["content/computing/alex-zelenski.md", "content/computing/portfolio.md"])
      assert.ok(manifest.site_content_files.includes(file), "Profile source missing from release inventory: " + file);
    assert.ok(manifest.site_static_files.includes("static" + pdf), "Resume missing from release inventory");
    assert.ok(manifest.site_layout_files.includes("layouts/partials/professional-profile-schema.html"), "Profile schema missing from release inventory");
  }
  return "Professional profile, project evidence, entity schema and public PDF passed.";
}

module.exports = {validate};
if (require.main === module) console.log(validate(path.resolve(process.argv[2] || "public")));
