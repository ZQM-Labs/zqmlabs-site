"use strict";
// Offline contract test for user-approved, existing payment links.
// Snapshot cross-checked against the connected ZQM Labs Stripe LIVE account
// on 2026-11-08. This is NOT a live fulfillment or future availability test.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const root = path.resolve(__dirname, "..");
const tierSource = fs.readFileSync(path.join(root, "content/tiers.md"), "utf8");
const pricingSource = fs.readFileSync(path.join(root, "content/pricing.md"), "utf8");
const tierOutput = fs.readFileSync(path.join(root, "public/tiers/index.html"), "utf8");
const pricingOutput = fs.readFileSync(path.join(root, "public/pricing/index.html"), "utf8");
const VERIFIED = [
  { name: "Family Night", price: 49, url: "https://buy.stripe.com/28E14p9hV23bgNA5Fv9bO03" },
  { name: "Community", price: 199, url: "https://buy.stripe.com/28E6oJeCf0Z740Od7X9bO00" },
  { name: "Office Team", price: 349, url: "https://buy.stripe.com/14AcN78dR7nvbtg5Fv9bO01" },
  { name: "Office Event", price: 499, url: "https://buy.stripe.com/fZu14p8dR7nveFs0lb9bO02" }
];

test("historical offer identities and prices remain stable while checkout is paused", () => {
  const fm = tierSource.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(fm, "Missing tiers front matter");
  const offerings = [...fm[1].matchAll(
    /- name: "([^"]+)"\s*\n\s*price: (\d+)\s*\n\s*url: "([^"]+)"/g
  )].map(m => ({name:m[1],price:Number(m[2]),url:m[3]}));
  assert.deepEqual(offerings,
    VERIFIED.map(({name,price}) => ({name,price,url:"/contact/"})),
    "Do not change historical prices or provide active checkout links");
  for (const output of [tierOutput, pricingOutput]) {
    assert.doesNotMatch(output, /https:\/\/buy\.stripe\.com\//);
    assert.match(output, /checkout is paused/i);
  }
  assert.match(tierOutput, /October 30.{0,10}November 1, 2026/);
  assert.match(pricingOutput, /October 30.{0,10}November 1, 2026/);
  assert.doesNotMatch(tierOutput, /Your kit is usable as soon as checkout delivers it/i);
});

test("historical tier descriptions do not imply available checkout, worldwide events or active fundraiser payouts", () => {
  assert.match(tierSource, /historical Community tier/i);
  assert.match(tierSource, /prior fundraiser split was an illustration/i);
  assert.match(tierSource, /checkout is paused/i);
  assert.doesNotMatch(tierSource, /the current offer is priced|the current package is described/i);
  assert.doesNotMatch(tierSource, /Fundraising arrangements may be available for qualifying events/i);
  assert.match(tierOutput, /no new purchase or entitlement is currently available/i);
});

test("historic discounts cannot imply current eligibility", () => {
  assert.match(tierSource, /FAMILY25/);
  assert.match(tierSource, /promotion and new kit purchases are not currently available/i);
  assert.doesNotMatch(tierSource, /play for \$25/i);
});

test("paused checkout retains clear refunds for undeliverable orders", () => {
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
  const demo = fs.readFileSync(path.join(root, "content/games/hunt-for-wisps.md"), "utf8");
  assert.match(demo, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
  const terms = fs.readFileSync(path.join(root, "content/terms.md"), "utf8");
  assert.match(terms, /If ZQM Labs cannot deliver an agreed paid order, a refund is available/);
  assert.match(terms, /Halloween 2026 access window has ended/);
  const contact = fs.readFileSync(path.join(root, "content/contact.md"), "utf8");
  assert.doesNotMatch(contact, /Under 1 business day|1–2 business days/);
});

test("press kit describes only verified demos, not unreleased games or guaranteed service", () => {
  const press = fs.readFileSync(path.join(root, "public/press/index.html"), "utf8");
  assert.match(press, /other named seasonal titles are in development/i);
  assert.match(press, /Verify the languages available in the current Wisp demo/i);
  assert.match(press, /new paid checkout paused/i);
  assert.doesNotMatch(press, /3 \(Halloween, Autumn, Winter editions\)|Games live\s*<[^>]*>\s*3/i);
  assert.doesNotMatch(press, /A live leaderboard keeps offices competitive|under one business day/i);
});

test("organizer kit description is historical and does not guarantee scoring or support", () => {
  const organizers = fs.readFileSync(path.join(root, "public/organizers/index.html"), "utf8");
  assert.match(organizers, /paid access window has ended and new paid-kit checkout is paused/i);
  assert.match(organizers, /Historical kit contents/i);
  assert.match(organizers, /Reply times are not guaranteed/i);
  assert.doesNotMatch(organizers, /Manage a leaderboard by hand[^\n]*automatic/i);
  assert.doesNotMatch(organizers, /Replies are typically under a day/i);
});

test("terms preserve paused checkout and refund protection for undeliverable orders", () => {
  const terms = fs.readFileSync(path.join(root, "public/terms/index.html"), "utf8");
  assert.match(terms, /New paid kit checkout is disabled/i);
  assert.match(terms, /If ZQM Labs cannot deliver an agreed paid order, a refund is available/i);
  assert.doesNotMatch(terms, /No refunds or reschedules|Kits are usable on checkout/i);
});

test("the games directory labels Lantern Player as an information page", () => {
  const games = fs.readFileSync(path.join(root, "public/games/index.html"), "utf8");
  assert.match(games, /Demo information page[\s\S]{0,120}Lantern Player/i);
  assert.match(games, /not a separate playable game release/i);
  assert.match(games, /\/games\/hunt-for-wisps\/play\/\?demo=1/);
});
