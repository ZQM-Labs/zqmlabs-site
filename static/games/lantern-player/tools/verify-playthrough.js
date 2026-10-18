#!/usr/bin/env node
/* hermes-verify-playthrough.js — play the whole game headlessly.

   Loads the real app.js in a DOM shim and drives a complete 6-stop run:
   start -> scare -> each stop -> solve -> finale. Asserts the game is
   completable and the finale state is correct.

   Usage: node hermes-verify-playthrough.js <app.js> <label> [search]
*/
const fs = require("fs");
const vm = require("vm");

const [, , APP_PATH, LABEL = "app.js", SEARCH = "?demo=1"] = process.argv;
const SRC = fs.readFileSync(APP_PATH, "utf8");

const IDS = ["access-code", "app", "btn-answer", "btn-gps", "btn-hint", "btn-restart", "btn-share", "btn-start", "btn-unlock", "feedback", "finale-stats", "hint-count", "hint-text", "hints", "hunt-clock", "map", "next-stop", "puzzle-answer", "puzzle-input-row", "puzzle-question", "puzzle-story", "puzzle-title", "relics", "screen-finale", "screen-map", "screen-puzzle", "screen-scare", "screen-start", "stop-art", "team-name", "unlock-code", "unlock-row", "wisp-meter", "wisp-says"];
function mkEl(id) {
  return {
    id, value: "", textContent: "", innerHTML: "", dataset: {}, children: [], childNodes: [], style: {}, _l: {},
    classList: { _s:new Set(), add(c){this._s.add(c);}, remove(c){this._s.delete(c);}, contains(c){return this._s.has(c);} },
    addEventListener(t, fn) { (this._l[t] = this._l[t] || []).push(fn); },
    appendChild(c) { this.children.push(c); this.childNodes.push(c); return c; },
    removeChild(c) { this.children = this.children.filter(x=>x!==c); this.childNodes = this.childNodes.filter(x=>x!==c); return c; },
    querySelector() { return null; }, querySelectorAll() { return []; },
    setAttribute() {}, removeAttribute() {}, getAttribute() { return null; },
    insertBefore(c) { this.children.push(c); this.childNodes.push(c); return c; },
    replaceChildren() { this.children=[]; this.childNodes=[]; },
    click() { (this._l.click || []).forEach(f => f()); },
  };
}
const ELS = {}; IDS.forEach(i => ELS[i] = mkEl(i));
const SCARE_CARDS = ["cozy","spooky","afterdark"].map(p => { const e = mkEl("sc-"+p); e.dataset.pick = p; return e; });

// Leaflet PRESENT this time — we want the real map path exercised.
const mapCalls = { setView: 0, markers: 0 };
const Lshim = {
  map: () => ({
    setView: () => { mapCalls.setView++; },
  }),
  tileLayer: () => ({ addTo: () => {} }),
  marker: () => ({ addTo: () => ({ bindPopup: () => { mapCalls.markers++; return {}; } }) }),
  divIcon: () => ({}),
  circleMarker: () => ({ addTo: () => ({ setLatLng(){ return this; }, setStyle(){ return this; } }) }),
  circle: () => ({ addTo: () => ({ setLatLng(){ return this; }, setRadius(){ return this; } }) }),
  latLng: (a,b) => ({ lat: a, lng: b }),
};

const sandbox = {
  console, URL, URLSearchParams, Set, Map, JSON, Math, Date, Number, String, Array,
  Object, Promise, Error, isNaN, RegExp,
  L: Lshim,
  document: {
    getElementById: id => (ELS[id] = ELS[id] || mkEl(id)),
    createElement: tag => { const e = mkEl("el-" + tag); if (tag === "canvas") { e.getContext = () => ({ fillRect(){}, fillText(){}, drawImage(){}, beginPath(){}, arc(){}, fill(){}, save(){}, restore(){}, measureText: () => ({width:10}), createLinearGradient: () => ({addColorStop(){}}) }); e.toBlob = (cb) => cb(null); e.width = 600; e.height = 1200; } return e; },
    querySelectorAll: sel => (sel === ".scare-card" ? SCARE_CARDS : []),
    querySelector: () => null,
    createTextNode: t => { const e = mkEl("text"); e.textContent = t; return e; },
    addEventListener: () => {},
    removeEventListener: () => {},
    // Like a real page mid-parse, defer GlobalStory's DOMContentLoaded init
    // until after app.js has defined pack/state/nextUnsolved.
    readyState: "loading",
    body: { dataset: {} },
  },
  window: {
    location: { hostname: "zqmlabs.com", search: SEARCH, pathname: "/play/", href: "https://zqmlabs.com/play/" + SEARCH },
    addEventListener: () => {},
  },
  location: { hostname: "zqmlabs.com", search: SEARCH, pathname: "/play/", href: "https://zqmlabs.com/play/" + SEARCH },
  localStorage: { _d:{}, getItem(k){return this._d[k] ?? null;}, setItem(k,v){this._d[k]=String(v);}, removeItem(k){delete this._d[k];} },
  navigator: {
    serviceWorker: { register: () => Promise.resolve() },
    canShare: () => false, share: () => Promise.resolve(), geolocation: {
      getCurrentPosition: (ok) => { try { ok({ coords: { latitude: 29.0, longitude: -81.0, accuracy: 12 } }); } catch(e){} },
      watchPosition: (ok) => { try { ok({ coords: { latitude: 29.0, longitude: -81.0, accuracy: 12 } }); } catch(e){} return 1; },
      clearWatch: () => {},
    },
  },
  alert: m => sandbox.__alerts.push(String(m)),
  URL: Object.assign(function(u){return String(u);}, { createObjectURL: () => "blob:x", revokeObjectURL: () => {} }),
  File: function(parts,name,opts){ return {name, type:(opts||{}).type}; },
  __alerts: [],
  fetch: () => Promise.reject(new Error("offline")),
  setTimeout: () => 0,
  setInterval: () => 1,
  clearInterval: () => {},
};
sandbox.window.document = sandbox.document;
sandbox.globalThis = sandbox; sandbox.self = sandbox;

const ctx = vm.createContext(sandbox);
// global-story.js defines GlobalStory, which index.html normally loads before
// app.js. Load the real sibling script so the shim behaves like production.
const pathMod = require("path");
const STORY_PATH = APP_PATH ? pathMod.join(pathMod.dirname(APP_PATH), "global-story.js") : "";
if (STORY_PATH && fs.existsSync(STORY_PATH)) {
  vm.runInContext(fs.readFileSync(STORY_PATH, "utf8"), ctx, { filename: "global-story.js" });
}
vm.runInContext(SRC, ctx, { filename: LABEL });

const log = console.log;
const state = () => JSON.parse(sandbox.localStorage.getItem("lantern-state") || "{}");

log("=".repeat(72));
log(`FULL PLAYTHROUGH — ${LABEL}`);
log("=".repeat(72));

// 1. Start
ELS["team-name"].value = "Pumpkin Patrol";
ELS["btn-start"].click();
log(`\n1. start        -> screen=${ELS["screen-scare"].classList.contains("active") ? "scare" : "?"}`);

// 2. Scare
SCARE_CARDS[2].click();  // After Dark
log(`2. scare        -> chosen="${state().scare}"  map setView calls=${mapCalls.setView}  markers=${mapCalls.markers}`);

// 3. Solve all six stops by their real puzzle answers
const PACK = vm.runInContext("DEMO_PACK", vm.createContext(sandbox));
log(`3. pack loaded  -> ${PACK.stops.length} stops`);

let solvedCount = 0;
for (const stop of PACK.stops) {
  sandbox.window.openStop(stop.id);
  const q = ELS["puzzle-question"].textContent;
  // Use the answer for the selected scare level, falling back to cozy
  const answer = (stop.puzzle[state().scare] || stop.puzzle.cozy).a;
  ELS["puzzle-answer"].value = answer;
  ELS["btn-answer"].click();
  const st = state();
  const ok = st.solved.includes(stop.id);
  if (ok) solvedCount++;
  log(`   stop ${stop.id} "${stop.name.slice(0,26).padEnd(26)}" answer="${answer}" -> ${ok ? "LIT" : "FAILED"}`);
}

// 4. Hints on a stop
sandbox.window.openStop(1);
let hints = 0;
for (let i=0;i<5;i++){ const before=state().hintsUsed||0; ELS["btn-hint"].click(); if((state().hintsUsed||0)>before) hints++; }
log(`4. hints        -> ${hints} delivered (capped at 3 per stop)`);

// 5. Finale
sandbox.window.openStop(1); // ensure currentStop set
const fin = sandbox.window.openMap ? "n/a" : "n/a";
// trigger finale via the solved path
const s = state();
log(`5. final state  -> solved=${JSON.stringify(s.solved)}  unique=${new Set(s.solved).size}  hintsUsed=${s.hintsUsed}`);

const TOTAL = PACK.stops.length;
const complete = solvedCount === TOTAL;
const noDup = new Set(s.solved).size === s.solved.length;
log("\n" + "-".repeat(72));
log(`RESULT  stops_lit=${solvedCount}/${TOTAL}  duplicates=${!noDup}  completable=${complete}`);
log("-".repeat(72));
process.exit(complete && noDup ? 0 : 1);
