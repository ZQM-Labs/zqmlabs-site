#!/usr/bin/env node
/* hermes-verify-exec.js — EXECUTE a real app.js in a DOM shim and observe runtime
   behaviour. Not a grep: the file is evaluated by node's vm and its real event
   handlers are invoked.

   Usage: node hermes-verify-exec.js <app.js> <label> <search-string>

   search-string is set BEFORE evaluation so URLSearchParams sees it, exactly as
   a browser would.
*/
const fs = require("fs");
const vm = require("vm");

const [, , APP_PATH, LABEL = "app.js", SEARCH = ""] = process.argv;
const SRC = fs.readFileSync(APP_PATH, "utf8");

// ---------- DOM shim ----------
const IDS = ["team-name","access-code","btn-start","btn-answer","btn-unlock","btn-gps",
             "btn-hint","btn-restart","next-stop","hint-text","feedback","puzzle-title",
             "puzzle-story","puzzle-question","puzzle-answer","unlock-code","finale-stats",
             "map","screen-start","screen-scare","screen-map","screen-puzzle","screen-finale"];
function mkEl(id) {
  return {
    id, value: "", textContent: "", innerHTML: "", dataset: {}, children: [],
    _l: {},
    classList: { _s:new Set(), add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, contains(c){return this._s.has(c);} },
    addEventListener(t, fn) { (this._l[t] = this._l[t] || []).push(fn); },
    appendChild(c) { this.children.push(c); return c; },
    click() { (this._l.click || []).forEach(f => f()); },
  };
}
const ELS = {}; IDS.forEach(i => ELS[i] = mkEl(i));
const SCARE_CARDS = ["cozy","spooky","afterdark"].map(p => { const e = mkEl("sc-"+p); e.dataset.pick = p; return e; });

const sandbox = {
  console,
  URLSearchParams,
  Set, Map, JSON, Math, Date, Number, String, Array, Object, Promise, Error, isNaN,
  document: {
    getElementById: id => ELS[id] || null,
    createElement: tag => mkEl("el-" + tag),
    querySelectorAll: sel => (sel === ".scare-card" ? SCARE_CARDS : []),
    body: { dataset: {} },
  },
  window: {
    location: { hostname: "zqmlabs.com", search: SEARCH, pathname: "/play/", href: "https://zqmlabs.com/play/" + SEARCH },
    addEventListener: () => {},
  },
  location: { hostname: "zqmlabs.com", search: SEARCH, pathname: "/play/", href: "https://zqmlabs.com/play/" + SEARCH },
  localStorage: { _d:{}, getItem(k){return this._d[k] ?? null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
  navigator: { serviceWorker: { register: () => Promise.resolve() }, geolocation: { getCurrentPosition: () => {} } },
  alert: m => { sandbox.__alerts.push(String(m)); },
  __alerts: [],
  fetch: () => Promise.reject(new Error("offline")),
  setTimeout: () => 0,
};
sandbox.window.document = sandbox.document;
sandbox.globalThis = sandbox;
sandbox.self = sandbox;

const ctx = vm.createContext(sandbox);
try {
  vm.runInContext(SRC, ctx, { filename: LABEL });
} catch (e) {
  console.log(`  !! evaluation threw: ${e.message}`);
}

// ---------- observations ----------
const L = [];
const log = s => { L.push(s); console.log(s); };
const readState = () => {
  try { return JSON.parse(sandbox.localStorage.getItem("lantern-state") || "{}"); } catch { return {}; }
};

log("=".repeat(72));
log(`RUNTIME EXECUTION — ${LABEL}`);
log(`  search string : ${JSON.stringify(SEARCH)}`);
log("=".repeat(72));

// DEFECT 1 — QR deep link
log("\n[DEFECT 1] does a QR deep link reach the UI?");
log(`  access-code field after load : ${JSON.stringify(ELS["access-code"].value)}`);
const qrConsumed = ELS["access-code"].value !== "";
log(`  RESULT : QR params ${qrConsumed ? "CONSUMED" : "IGNORED"}`);

// DEFECT 2 — duplicate solve, driven through the real handlers
log("\n[DEFECT 2] duplicate solve (invoking the real unlock handler)");
ELS["team-name"].value = "Proof Team";
ELS["btn-start"].click();

// DEFECT 6 — openMap() with Leaflet absent. This is the live CSP state.
let mapThrew = null;
try {
  SCARE_CARDS[0].click();
} catch (e) {
  mapThrew = e;
}
log("\n[DEFECT 6] openMap() with Leaflet unavailable (live CSP state)");
if (mapThrew) {
  log(`  RESULT : THREW ${mapThrew.constructor.name}: ${mapThrew.message}`);
  log(`           -> the map screen is dead; no fallback.`);
} else {
  log(`  RESULT : did not throw (guarded)`);
  log(`  fallback text : ${JSON.stringify(ELS["map"].textContent)}`);
}

const canOpen = typeof sandbox.window.openStop === "function";
log(`\n  window.openStop exposed      : ${canOpen}`);
if (canOpen) {
  try { sandbox.window.openStop(1); } catch (e) { log(`  openStop threw: ${e.message}`); }
}

const s0 = readState();
log(`  solved before                : ${JSON.stringify(s0.solved || [])}`);

// Unlock stop 1 three times — a family re-scanning the same sign.
for (let i = 1; i <= 3; i++) {
  ELS["unlock-code"].value = "LANTERN-1";
  ELS["btn-unlock"].click();
  const s = readState();
  log(`  after unlock #${i}             : ${JSON.stringify(s.solved || [])}`);
}
const sN = readState();
const solved = sN.solved || [];
const hasDup = solved.length !== new Set(solved).size;
log(`  duplicates present           : ${hasDup}`);
log(`  portal score (len * 100)     : ${solved.length * 100}   [clean 6-stop run = 600]`);

log("\n" + "-".repeat(72));
log(`SUMMARY  qr_consumed=${qrConsumed}  duplicate_solves=${hasDup}  score=${solved.length*100}`);
log("-".repeat(72));
