#!/usr/bin/env node
/* hermes-verify-sw.js — EXECUTE the service worker's real fetch handler against
   synthetic requests and observe what it actually returns. Proves defect #5
   (HTML served in place of failed JS) and the cache-filter defect.

   Usage: node hermes-verify-sw.js <sw.js> <label>
*/
const fs = require("fs");
const vm = require("vm");

const [, , SW_PATH, LABEL = "sw.js"] = process.argv;
const SRC = fs.readFileSync(SW_PATH, "utf8");

// ---------- Service Worker shim ----------
const CACHE_STORE = new Map();          // url -> Response-like
const PUT_LOG = [];                     // what the SW tried to cache
let fetchBehaviour = "reject";          // "reject" = offline

function mkResponse(body, type = "basic", ok = true) {
  return { body, type, ok, clone() { return mkResponse(body, type, ok); } };
}

const cachesShim = {
  open: async () => ({
    addAll: async (urls) => { urls.forEach(u => CACHE_STORE.set(u, mkResponse("SHELL:" + u))); },
    put: async (req, res) => {
      PUT_LOG.push({ url: req.url, method: req.method, type: res.type, ok: res.ok });
      CACHE_STORE.set(req.url, res);
    },
  }),
  keys: async () => ["lantern-v1"],
  delete: async () => true,
  match: async (req) => {
    const url = typeof req === "string" ? req : req.url;
    return CACHE_STORE.get(url) || undefined;
  },
};

const listeners = {};
const sandbox = {
  console,
  URL, URLSearchParams, Map, Set, Promise, Object, Array, JSON, String, Error,
  caches: cachesShim,
  fetch: async (req) => {
    if (fetchBehaviour === "reject") throw new Error("offline");
    const url = typeof req === "string" ? req : req.url;
    return mkResponse("NET:" + url);
  },
  self: {
    addEventListener: (t, fn) => { listeners[t] = fn; },
    skipWaiting: () => {},
  },
};
sandbox.globalThis = sandbox;

const ctx = vm.createContext(sandbox);
vm.runInContext(SRC, ctx, { filename: LABEL });

const L = [];
const log = s => { L.push(s); console.log(s); };

log("=".repeat(72));
log(`SERVICE WORKER EXECUTION — ${LABEL}`);
log("=".repeat(72));

// Helper: run the real fetch handler and capture what respondWith received.
async function runFetch(request) {
  let responded = null;
  const event = {
    request,
    respondWith: (p) => { responded = p; },
  };
  try {
    listeners.fetch(event);
  } catch (e) {
    return { threw: e, result: null, passthrough: responded === null };
  }
  if (responded === null) return { threw: null, result: null, passthrough: true };
  try {
    const r = await responded;
    return { threw: null, result: r, passthrough: false };
  } catch (e) {
    return { threw: e, result: null, passthrough: false };
  }
}

(async () => {
  // Seed the shell so the catch-all has something to fall back to.
  const install = listeners.install;
  if (install) await install({ waitUntil: (p) => p });
  log(`  shell cached: ${[...CACHE_STORE.keys()].join(", ")}`);

  // --- TEST A: a failed app.js fetch while offline ---
  log("\n[A] offline fetch of app.js (the JS the game needs)");
  const reqA = { url: "https://zqmlabs.com/play/app.js", method: "GET", mode: "no-cors" };
  const a = await runFetch(reqA);
  if (a.threw) {
    log(`  RESULT : threw -> ${a.threw.message}`);
  } else if (a.result) {
    const b = a.result.body;
    const isHTML = typeof b === "string" && /<!doctype html|SHELL:.*index\.html/i.test(b);
    log(`  returned body : ${JSON.stringify(String(b).slice(0, 60))}`);
    log(`  RESULT : ${isHTML ? "!! SERVED HTML IN PLACE OF JS (silent SyntaxError in browser)" : "served JS-ish content"}`);
  } else if (a.passthrough) {
    log(`  RESULT : passed through to network (no respondWith)`);
  }

  // --- TEST B: a failed navigation while offline ---
  log("\n[B] offline navigation (should serve the shell)");
  const reqB = { url: "https://zqmlabs.com/play/", method: "GET", mode: "navigate" };
  const b = await runFetch(reqB);
  if (b.result) log(`  returned body : ${JSON.stringify(String(b.result.body).slice(0, 60))}`);
  else log(`  RESULT : ${b.passthrough ? "passthrough" : "threw: " + (b.threw && b.threw.message)}`);

  // --- TEST C: a POST (API write) — should never be intercepted ---
  log("\n[C] POST /api/lantern/progress (API write)");
  const reqC = { url: "https://api.zqmlabs.com/api/lantern/progress", method: "POST", mode: "cors" };
  const c = await runFetch(reqC);
  log(`  RESULT : ${c.passthrough ? "passed through to network (correct)" : "INTERCEPTED (wrong — Cache API rejects non-GET)"}`);

  // --- TEST D: what did the SW try to cache? ---
  log("\n[D] cache.put attempts during the run");
  if (PUT_LOG.length === 0) log("  (none recorded)");
  PUT_LOG.forEach(p => log(`  ${p.method} ${p.url} type=${p.type} ok=${p.ok}`));

  log("\n" + "-".repeat(72));
})();
