"use strict";
// Fail closed against advertising inactive live Stripe links. Read-only
// connection verification on 2026-11-16 confirmed all four Wisp links are
// inactive; a source-only test is NOT a substitute for provider revalidation.
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
const PRIOR_REFERENCE = Object.freeze([
  ["Family Night", 49], ["Community", 199], ["Office Team", 349], ["Office Event", 499]
]);

test("inactive Stripe purchase links are not offered or rendered as in-stock Products", () => {
  const fm = tierSource.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(fm, "Missing tiers front matter");
  assert.doesNotMatch(fm[1], /^products:/m, "Do not emit in-stock Product/Offer JSON-LD without active checkout");
  for (const [name, price] of PRIOR_REFERENCE) {
    assert.match(tierSource, new RegExp(name + ".*\\$" + price + " prior reference"), name);
  }
  for (const [name, body] of Object.entries({tierSource, pricingSource, tierOutput, pricingOutput})) {
    assert.doesNotMatch(body, /https?:\/\/buy\.stripe\.com\//i, name + ": inactive payment link present");
    assert.doesNotMatch(body, /Paid kit checkout is live|Checkout is live|Buy your kit above/i, name);
  }
  assert.doesNotMatch(tierOutput, /"@type"\s*:\s*"Product"/i, "No in-stock Products without active links");
  assert.doesNotMatch(tierOutput, /schema\.org\/InStock/i, "Unavailable kit is not in stock");
});

test("public paid-state and demo messaging are accurate on both pages", () => {
  assert.match(tierSource, /Paid kit checkout is currently unavailable/);
  assert.match(pricingSource, /paid checkout is currently unavailable/i);
  assert.match(tierOutput, /checkout is currently unavailable/i);
  assert.match(pricingOutput, /checkout is currently unavailable/i);
  for (const html of [tierOutput, pricingOutput]) {
    assert.match(html, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
    assert.match(html, /href=(?:["\']|)\/contact\/(?:["\']|)/, "Contact link must survive Hugo minification");
    assert.match(html, /October 30.{0,10}November 1, 2026/);
  }
  assert.match(tierSource, /prior fundraiser split was an illustration/i);
});

test("historic discounts cannot imply current eligibility", () => {
  assert.match(tierSource, /FAMILY25/);
  assert.match(tierSource, /no longer valid/i);
  assert.doesNotMatch(tierSource, /play for \$25|\$49 at checkout/i);
});

test("refund terms remain clear for past agreed orders", () => {
  assert.match(pricingOutput, /undeliverable order is eligible for refund/i);
  assert.match(tierOutput, /Orders that cannot be fulfilled are eligible for refund/i);
  assert.doesNotMatch(pricingOutput, /No refunds or reschedules/i);
});

test("game, FAQ, terms, and contact cannot promise unverified fulfillment", () => {
  for (const name of ["content/games/hunt-for-wisps.md","content/faq.md","content/terms.md","content/contact.md"]) {
    const source = file(name);
    assert.doesNotMatch(source, /kits? (?:are|is) usable on checkout|(?:kit|kits) (?:are|is) delivered by email/i, name);
    assert.doesNotMatch(source, /replies within one business day|Checkout is live|Purchases live/i, name);
    assert.match(source, /(?:confirm|not guaranteed|capacity permits)/i, name);
  }
  const demo = file("content/games/hunt-for-wisps.md");
  assert.match(demo, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
  const terms = file("content/terms.md");
  assert.match(terms, /If ZQM Labs cannot deliver an agreed paid order, a refund is available/);
  assert.match(terms, /Halloween 2026 access window has ended/);
});

test("press kit does not promise unreleased games or guaranteed service", () => {
  const press = file("public/press/index.html");
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
