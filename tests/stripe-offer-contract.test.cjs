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

test("existing live Stripe price-to-link mapping matches the approved published four offers", () => {
  const fm = tierSource.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(fm, "Missing tiers front matter");
  const offerings = [...fm[1].matchAll(
    /- name: "([^"]+)"\s*\n\s*price: (\d+)\s*\n\s*url: "(https:\/\/buy\.stripe\.com\/[^"]+)"/g
  )].map(m => ({ name: m[1], price: Number(m[2]), url: m[3] }));
  assert.deepEqual(offerings, VERIFIED, "Prices and payment-link identities need independent commercial approval");
  const urls = new Set([...tierOutput.matchAll(/https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/g)].map(m => m[0]));
  assert.deepEqual([...urls].sort(), VERIFIED.map(x => x.url).sort(), "Rendered tiers changed active checkout links");
  assert.doesNotMatch(pricingOutput, /https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+/,
    "Pricing page must link to the existing tier offers, not create another checkout source");
});

test("historic Halloween checkout does not imply currently deliverable game access", () => {
  for (const page of [tierOutput, pricingOutput]) {
    assert.match(page, /October 30.{0,10}November 1, 2026/);
    assert.match(page, /before (?:buying|purchasing|paying|payment)/i);
    assert.doesNotMatch(page, /Your kit is usable as soon as checkout delivers it/i);
    assert.doesNotMatch(page, /Halloween, Autumn Festival, and Winter editions are[\s\S]{0,30}live now/i);
  }
  assert.match(tierOutput, /The Great Pumpkin Roll[\s\S]{0,500}in development/i);
  assert.match(tierOutput, /The Snowflake Secret[\s\S]{0,500}in development/i);
});

test("existing $24 Family Night promotion remains identified but cannot imply active play", () => {
  assert.match(tierSource, /FAMILY25/);
  assert.match(tierSource, /\$24 off/);
  assert.doesNotMatch(tierSource, /play for \$25/i);
  assert.match(tierSource, /discount is not a guarantee of currently usable kit access/i);
});

test("preview retains explicit no-refund terms while disclosing fulfillment uncertainty", () => {
  assert.match(pricingOutput, /No refunds or reschedules/i);
  assert.match(tierOutput, /No refunds or reschedules/i);
  assert.match(tierSource, /does \*\*not\*\* establish that a new access window/i);
  assert.doesNotMatch(pricingOutput, /The Lab replies within a day/i);
});

test("terms and contact do not promise expired access or guaranteed response time", () => {
  const terms = fs.readFileSync(path.join(root, "public/terms/index.html"), "utf8");
  const contact = fs.readFileSync(path.join(root, "public/contact/index.html"), "utf8");
  assert.match(terms, /Payment does not establish immediate kit access or delivery/i);
  assert.match(terms, /Halloween 2026 access window has ended/i);
  assert.doesNotMatch(terms, /Kits are usable on checkout|play for \$25/i);
  assert.match(terms, /No refunds or reschedules/i);
  assert.match(contact, /Response times and event availability are not guaranteed/i);
  assert.doesNotMatch(contact, /within one business day|under 1 business day|1.2 business days/i);
  assert.match(contact, /Limited, best-effort email/i);
});

test("FAQ visible and structured content never promises expired kit delivery", () => {
  const faq = fs.readFileSync(path.join(root, "public/faq/index.html"), "utf8");
  assert.match(faq, /Halloween 2026 access window has ended/i);
  assert.match(faq, /Payment does not guarantee/i);
  assert.doesNotMatch(faq, /Kits are usable on checkout/i);
  assert.doesNotMatch(fs.readFileSync(path.join(root, "content/faq.md"), "utf8"),
    /Kits are usable on checkout/i);
});

test("organizer page does not claim automatic live scoring or guaranteed support", () => {
  const organizers = fs.readFileSync(path.join(root, "public/organizers/index.html"), "utf8");
  assert.match(organizers, /Response times are not guaranteed/i);
  assert.match(organizers, /expired Halloween 2026 window/i);
  assert.doesNotMatch(organizers, /leaderboard by hand.{0,40}automatic/i);
  assert.doesNotMatch(organizers, /Replies are typically under a day/i);
});

test("press kit distinguishes the Wisp demo from unreleased seasonal products", () => {
  const press = fs.readFileSync(path.join(root, "public/press/index.html"), "utf8");
  assert.match(press, /Wisp.s Lost Lanterns browser demo/i);
  assert.match(press, /other named seasonal titles are in development/i);
  assert.match(press, /Verify the languages available in the current Wisp demo/i);
  assert.match(press, /Response time:[\s\S]{0,120}best effort/i);
  assert.doesNotMatch(press, /3 \(Halloween, Autumn, Winter editions\)/i);
  assert.doesNotMatch(press, /A live leaderboard keeps offices competitive/i);
  assert.doesNotMatch(press, /under one business day/i);
});
