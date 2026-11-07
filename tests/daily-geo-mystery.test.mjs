import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CHALLENGES, utcDayLabel, selectChallenge, formatShareText, readAttempt, writeAttempt, scorecardSvg } from "../static/experiments/daily-geo-mystery/daily.mjs";

test("unreleased experiment cannot declare a production canonical or structured URL", () => {
  const html = readFileSync(new URL("../static/experiments/daily-geo-mystery/index.html", import.meta.url), "utf8");
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(html, /<link[^>]+rel="canonical"|<meta[^>]+property="og:url"|<script[^>]+type="application\/ld\+json"/i);
  assert.doesNotMatch(html, /https:\/\/zqmlabs\.com\/experiments\/daily-geo-mystery\//);
});

test("sample contains twelve valid multiple-choice challenges", () => {
  assert.equal(CHALLENGES.length, 12);
  for (const entry of CHALLENGES) {
    assert.equal(typeof entry.clue, "string");
    assert.equal(entry.choices.length, 3);
    assert.equal(new Set(entry.choices).size, 3);
    assert.equal(entry.choices.filter((choice) => choice === entry.answer).length, 1);
    assert.doesNotMatch(entry.clue, /https?:\/\/|@/);
  }
});

test("the same UTC day gives the same puzzle", () => {
  const a = new Date("2026-11-06T00:00:00Z");
  const b = new Date("2026-11-06T23:59:59Z");
  assert.equal(utcDayLabel(a), "2026-11-06");
  assert.deepEqual(selectChallenge(a), selectChallenge(b));
  assert.notDeepEqual(selectChallenge(a), selectChallenge(new Date("2026-11-07T00:00:00Z")));
});

test("negative epoch and invalid dates are handled", () => {
  assert.ok(selectChallenge(new Date("1969-12-31T23:59:59Z")));
  assert.throws(() => selectChallenge(new Date("invalid")), TypeError);
  assert.throws(() => selectChallenge(new Date(), []), TypeError);
});

test("share text omits correct answer and clue", () => {
  for (const outcome of [true, false]) {
    const text = formatShareText("2026-11-06", outcome);
    assert.match(text, /2026-11-06/);
    assert.match(text, outcome ? /🟩 1\/1/ : /⬜ 0\/1/);
    for (const challenge of CHALLENGES) {
      assert.ok(!text.includes(challenge.answer));
      assert.ok(!text.includes(challenge.clue));
    }
  }
});

test("one privacy-minimal stored result applies only to its UTC day", () => {
  let record = null;
  const storage = {
    getItem() { return record; },
    setItem(_key, value) { record = value; }
  };
  assert.equal(readAttempt(storage, "2026-11-06"), null);
  assert.equal(writeAttempt(storage, "2026-11-06", false), true);
  assert.equal(readAttempt(storage, "2026-11-06"), false);
  assert.equal(readAttempt(storage, "2026-11-07"), null);
  assert.equal(writeAttempt(storage, "2026-11-07", true), true);
  assert.equal(readAttempt(storage, "2026-11-07"), true);
  assert.equal(readAttempt(storage, "2026-11-06"), null);
  assert.deepEqual(Object.keys(JSON.parse(record)).sort(), ["correct", "day", "version"]);
});

test("storage disabled, corrupted, or unavailable fails safely", () => {
  const disabled = {
    getItem() { throw new Error("Storage denied"); },
    setItem() { throw new Error("Storage denied"); }
  };
  assert.equal(readAttempt(null, "2026-11-06"), null);
  assert.equal(writeAttempt(null, "2026-11-06", true), false);
  assert.equal(readAttempt(disabled, "2026-11-06"), null);
  assert.equal(writeAttempt(disabled, "2026-11-06", true), false);
  assert.equal(readAttempt({ getItem: () => "not JSON" }, "2026-11-06"), null);
  assert.equal(readAttempt({ getItem: () => JSON.stringify({ version: 1, day: "2026-11-06", correct: "yes" }) }, "2026-11-06"), null);
  assert.equal(writeAttempt({ setItem: () => {} }, "2026-11-06", "yes"), false);
});

test("social SVG sharecards distinguish outcomes without leaking answers", () => {
  for (const correct of [true, false]) {
    const image = scorecardSvg("2026-11-06", correct);
    assert.match(image, /<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.match(image, correct ? /1 \/ 1/ : /0 \/ 1/);
    assert.match(image, /2026-11-06 UTC/);
    assert.match(image, /PROTOTYPE/);
    assert.doesNotMatch(image, /<script|<foreignObject|<image/i);
    for (const entry of CHALLENGES) {
      assert.ok(!image.includes(entry.clue));
      assert.ok(!image.includes(entry.answer));
    }
  }
  assert.throws(() => scorecardSvg("<script>oops</script>", true), TypeError);
  assert.throws(() => scorecardSvg("2026-11-06", "yes"), TypeError);
});

test("UI locks answers and restores the daily result after simulated reload", async () => {
  const makeElement = (name) => ({
    name, textContent: "", value: "", hidden: true, disabled: false,
    children: [], handlers: {},
    addEventListener(type, handler) { this.handlers[type] = handler; },
    appendChild(child) { this.children.push(child); },
    querySelectorAll() { return this.children; },
    click() { return this.handlers.click?.(); }
  });
  const fixture = () => {
    const ids = ["date", "clue", "choices", "result", "share", "copy", "copy-status", "download"];
    const cells = Object.fromEntries(ids.map(id => [id, makeElement(id)]));
    return {
      cells,
      document: {
        getElementById(id) { return cells[id] ?? null; },
        createElement(name) { return makeElement(name); },
        body: { appendChild() {} }
      }
    };
  };
  const values = new Map();
  const storage = {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, value); }
  };
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  try {
    globalThis.window = { localStorage: storage };
    const first = fixture();
    globalThis.document = first.document;
    await import("../static/experiments/daily-geo-mystery/daily.mjs?ui=initial");
    const date = new Date();
    const challenge = selectChallenge(date);
    const answers = first.cells.choices.children;
    assert.equal(answers.length, 3);
    assert.equal(first.cells.clue.textContent, challenge.clue);
    const wrong = answers.find(button => button.textContent !== challenge.answer);
    const right = answers.find(button => button.textContent === challenge.answer);
    assert.ok(wrong && right);
    wrong.click();
    assert.equal(answers.every(button => button.disabled), true);
    assert.match(first.cells.result.textContent, /Not this time/);
    assert.match(first.cells.share.value, /0\/1/);
    assert.equal(first.cells.download.hidden, false);
    const prior = first.cells.share.value;
    right.click();
    assert.equal(first.cells.share.value, prior, "second click must not alter result");
    const second = fixture();
    globalThis.document = second.document;
    await import("../static/experiments/daily-geo-mystery/daily.mjs?ui=reloaded");
    assert.match(second.cells.result.textContent, /Previous result/);
    assert.equal(second.cells.choices.children.every(button => button.disabled), true);
    assert.equal(second.cells.share.value, prior);
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
