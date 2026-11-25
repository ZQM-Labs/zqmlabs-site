"use strict";
// Offline contract test for user-approved, existing payment links.
// Snapshot cross-checked against the connected ZQM Labs Stripe LIVE account
// on 2026-11-08. Checkout reopened by user approval 2026-11-12: the tiers
// page must now publish the verified links and live purchase copy.
// This is NOT a live fulfillment test.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const root = path.resolve(__dirname, "..");
const file = name => fs.readFileSync(path.join(root, name), "utf8");
const tierSource = file("content/tiers.md");
const pricingSource = file("content/pricing.md");
const tierOutput = file("public/tiers/index.html");
const pricingOutput = file("public/pricing/index.html");
const VERIFIED = [
  { name: "Family Night", price: 49, url: "https://buy.stripe.com/28E14p9hV23bgNA5Fv9bO03" },
  { name: "Community", price: 199, url: "https://buy.stripe.com/28E6oJeCf0Z740Od7X9bO00" },
  { name: "Office Team", price: 349, url: "https://buy.stripe.com/14AcN78dR7nvbtg5Fv9bO01" },
  { name: "Office Event", price: 499, url: "https://buy.stripe.com/fZu14p8dR7nveFs0lb9bO02" }
];

test("live offer identities and prices match the verified Stripe links", () => {
  const fm = tierSource.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(fm, "Missing tiers front matter");
  const offerings = [...fm[1].matchAll(
    /- name: "([^"]+)"\s*\n\s*price: (\d+)\s*\n\s*url: "([^"]+)"/g
  )].map(m => ({name:m[1],price:Number(m[2]),url:m[3]}));
  assert.deepEqual(offerings, VERIFIED,
    "Do not change live prices or publish an unverified checkout link");
  for (const output of [tierOutput]) {
    assert.match(output, /https:\/\/buy\.stripe\.com\//);
    assert.doesNotMatch(output, /checkout is paused/i);
  }
  assert.doesNotMatch(pricingOutput, /checkout is paused/i);
  assert.match(pricingOutput, /href=(?:"|)\/tiers\//i);
  assert.match(tierOutput, /October 30.{0,10}November 1, 2026/);
  assert.match(pricingOutput, /October 30.{0,10}November 1, 2026/);
  assert.match(tierOutput, /Your kit is usable as soon as checkout delivers it/i);
});

test("live tier descriptions stay truthful about history and fundraisers", () => {
  assert.match(tierSource, /prior fundraiser split was an illustration/i);
  assert.match(tierSource, /checkout is live/i);
  assert.doesNotMatch(tierSource, /checkout is paused/i);
  assert.doesNotMatch(tierSource, /the current offer is priced|the current package is described/i);
  assert.doesNotMatch(tierSource, /Fundraising arrangements may be available for qualifying events/i);
  assert.doesNotMatch(tierOutput, /no new purchase or entitlement is currently available/i);
});

test("historic discounts cannot imply current eligibility", () => {
  assert.match(tierSource, /FAMILY25/);
  assert.match(tierSource, /no longer valid/i);
  assert.doesNotMatch(tierSource, /play for \$25/i);
});

test("live checkout retains clear refunds for undeliverable orders", () => {
  assert.match(pricingOutput, /undeliverable order is eligible for refund/i);
  assert.match(tierOutput, /Orders that cannot be fulfilled are eligible for refund/i);
  assert.doesNotMatch(pricingOutput, /No refunds or reschedules/i);
});

test("game, FAQ, terms, and contact cannot promise unverified fulfillment or response times", () => {
  const pages = ["content/games/hunt-for-wisps.md", "content/faq.md", "content/terms.md", "content/contact.md"];
  for (const name of pages) {
    const source = fs.readFileSync(path.join(root, name), "utf8");
    assert.doesNotMatch(source, /kits? (?:are|is) usable on checkout/i, name);
    assert.doesNotMatch(source, /(?:kit|kits) (?:are|is) delivered by email/i, name);
    assert.doesNotMatch(source, /replies within one business day/i, name);
    assert.match(source, /(?:confirm|not guaranteed|capacity permits)/i, name);
  }
  const demo = file("content/games/hunt-for-wisps.md");
  assert.match(demo, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
  const terms = file("content/terms.md");
  assert.match(terms, /If ZQM Labs cannot deliver an agreed paid order, a refund is available/);
  assert.match(terms, /Halloween 2026 access window has ended/);
  const contact = file("content/contact.md");
  assert.doesNotMatch(contact, /Under 1 business day|1–2 business days/);
});

test("press kit describes only verified demos, not unreleased games or guaranteed service", () => {
  const press = fs.readFileSync(path.join(root, "public/press/index.html"), "utf8");
  assert.match(press, /other named seasonal titles are in development/i);
});

test("Wisp kit coordination email and organizer confirmation survive buyer-facing pages", () => {
  for (const path of ["content/tiers.md", "content/pricing.md", "content/contact.md", "content/terms.md"]) {
    const source = file(path);
    assert.match(source, /zqmcomputing@gmail[.]com/i, path);
    assert.match(source, /Wisp%20Game%20Coordination/, path);
    assert.match(source, /confirm|confirmation/i, path);
  }
  assert.match(tierSource, /Required game coordination/);
  assert.match(pricingSource, /Game coordination is required/);
  assert.match(tierOutput, /Required game coordination/);
  assert.match(pricingOutput, /Game coordination is required/);
  assert.match(file("content/tiers.md"), /payment[^.]*does not by itself reserve a date/i);
});
