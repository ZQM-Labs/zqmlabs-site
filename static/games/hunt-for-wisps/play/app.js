"use strict";
/* lantern-player — game state machine.
   Content comes from a pack (exported by lantern-content). DEMO_PACK below is
   the embedded example so ?demo=1 plays with no backend. Missing scare-level
   variants fall back to Cozy text. */

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8090" : "https://api.zqmlabs.com";

const DEMO_PACK = {
  title: "Wisp's Lost Lanterns",
  kit: "DEMO",
  stops: [
    { id: 1, name: "The Welcome Pumpkin", lat: 29.0258, lng: -80.9270, code: "LANTERN-1",
      story: { cozy: "Wisp twirls sadly. \"My first lantern rolled away right at the start!\"",
               spooky: "A carved pumpkin grins where no pumpkin should be. Something glows inside it.",
               afterdark: "The old-timers say a light once wandered this road, looking for the turning it missed in 1768." },
      puzzle: { cozy: { q: "Count the pumpkins in the patch picture your organizer showed you. How many are smiling?", a: "4", type: "number" },
                spooky: { q: "Riddle: I have a face but cannot see, I glow but cannot flee. On Halloween night I watch the street. What am I?", a: "jack-o-lantern", type: "text" } },
      fallback: { q: "What color is the ribbon on the welcome sign?", a: "orange" },
      hints: ["Look low — lanterns love the ground.", "Count slowly, out loud, as a team.", "Ranger assist: the smiling pumpkins are 4."] },
    { id: 2, name: "The Whispering Oak", lat: 29.0262, lng: -80.9264, code: "LANTERN-2",
      story: { cozy: "The big oak is Wisp's best friend. He hid a lantern in his branches!" },
      puzzle: { cozy: { q: "Find the oak. How many wooden swings or benches face it?", a: "2", type: "number" } },
      fallback: { q: "What is carved on the small sign by the oak?", a: "wisp" },
      hints: ["Face the tree like it is facing you.", "Only count the ones looking at the oak.", "Ranger assist: the answer is 2."] },
    { id: 3, name: "The Giggling Graveyard (pretend!)", lat: 29.0266, lng: -80.9258, code: "LANTERN-3",
      story: { cozy: "Don't worry — these tombstones are made of foam, and every ghost here just wants to play tag." },
      puzzle: { cozy: { q: "One foam tombstone says R.I.P. — Rest In... what? (The silly word on the stone!)", a: "pumpkins", type: "text" } },
      fallback: { q: "How many foam tombstones are there?", a: "5" },
      hints: ["Read the stones — one of them is joking.", "It rhymes with the patch from Stop 1.", "Ranger assist: Rest In Pumpkins."] },
    { id: 4, name: "The Spider's Counting Web", lat: 29.0270, lng: -80.9252, code: "LANTERN-4",
      story: { cozy: "Mrs. Spider (she's friendly, and made of pipe cleaners) has a lantern tangled in her web!" },
      puzzle: { cozy: { q: "A real spider has 8 legs. Mrs. Spider is holding up 3 legs to wave. How many legs are on the ground?", a: "5", type: "number" } },
      fallback: { q: "What color is Mrs. Spider?", a: "purple" },
      hints: ["Start with 8 legs, like every spider.", "She waves with 3 of them.", "Ranger assist: 8 − 3 = 5."] },
    { id: 5, name: "The Owl's Night Watch", lat: 29.0274, lng: -80.9246, code: "LANTERN-5",
      story: { cozy: "High in the tree, Professor Hoot guards a lantern. He only lends it to good listeners." },
      puzzle: { cozy: { q: "Listen to the sound your phone plays at this stop: is it an owl, a cat, or a frog?", a: "owl", type: "text" } },
      fallback: { q: "What two letters does an owl 'say'?", a: "ho" },
      hints: ["It is the sound this whole stop is named after.", "Twilight is this bird's favorite time.", "Ranger assist: it's the owl."] },
    { id: 6, name: "The Lantern Parade Ground", lat: 29.0278, lng: -80.9240, code: "LANTERN-6",
      story: { cozy: "The last lantern! Light it and the whole parade glows." },
      puzzle: { cozy: { q: "Teamwork finale: how many lanterns did you light on the whole hunt (including this one)?", a: "6", type: "number" } },
      fallback: { q: "Say the magic words out loud as a team: 'Light the way, Wisp!' then type: wisp", a: "wisp" },
      hints: ["Count the stops on your map.", "One lantern per stop.", "Ranger assist: 6 lanterns."] }
  ]
};

/* ---------- state ---------- */
const qs = new URLSearchParams(location.search);
// Demo mode is explicit: ?demo=1 (not ?demo=0). (m2)
const _demoVal = (qs.get("demo") || "").toLowerCase();
const isDemo = qs.has("demo") && !["0", "false", "no", "off"].includes(_demoVal);
// Corrupt saved state must not brick the player on load. (P3)
let _loaded = null;
try { _loaded = JSON.parse(localStorage.getItem("lantern-state") || "null"); } catch { _loaded = null; }
const state = _loaded || {
  team: "", scare: "cozy", solved: [], hintsUsed: 0, startedAt: null, kitId: null
};
let pack = DEMO_PACK;
let currentStop = null;
let hintLevel = 0;

/* ---------- pack validation (mirrors ZQM-Labs/quest-authoring SPEC.md) ----------
   A remote pack replaces DEMO_PACK wholesale. Without this gate a malformed
   pack (wrong stop count, missing hints, duplicate answers) crashes openMap()
   or the hint ladder mid-hunt. Reject and fall back to the embedded pack. */
function validatePack(p) {
  const errs = [];
  if (!p || !Array.isArray(p.stops) || p.stops.length !== 6) {
    const got = !p ? "nothing" : (Array.isArray(p.stops) ? p.stops.length : typeof p.stops);
    return ["expected 6 stops, got " + got];
  }
  const answers = [];
  const ids = [];
  for (const s of p.stops) {
    const tag = `stop ${s.id ?? "?"}`;
    if (typeof s.id !== "number" || !Number.isInteger(s.id)) errs.push(`${tag}: id must be an integer`);
    else ids.push(s.id);
    if (!s.name || !s.code) errs.push(`${tag}: needs name + code`);
    if (!s.story || !s.story.cozy) errs.push(`${tag}: story.cozy missing`);
    const pz = s.puzzle && s.puzzle.cozy;
    const qOk = pz && pz.q !== undefined && pz.q !== null && String(pz.q).trim() !== "";
    const aOk = pz && pz.a !== undefined && pz.a !== null && String(pz.a).trim() !== "";
    if (!qOk || !aOk) errs.push(`${tag}: puzzle.cozy needs q + a`);
    else answers.push(String(pz.a).trim().toLowerCase());
    if (!s.fallback || !s.fallback.q || !s.fallback.a) errs.push(`${tag}: fallback needs q + a`);
    if (!Array.isArray(s.hints) || s.hints.length !== 3) errs.push(`${tag}: needs exactly 3 hints`);
    if (typeof s.lat !== "number" || typeof s.lng !== "number") errs.push(`${tag}: lat/lng must be numeric`);
  }
  if (new Set(answers).size !== answers.length) errs.push("cozy answers must be unique");
  if (new Set(ids).size !== ids.length) errs.push("stop ids must be unique");
  return errs;
}


const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
function save() { try { localStorage.setItem("lantern-state", JSON.stringify(state)); } catch { /* private mode / quota - game continues in memory */ } }
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}
function variant(stop, kind) { // kind: "story" | puzzle object
  if (kind === "story") return stop.story[state.scare] || stop.story.cozy;
  return (stop.puzzle && (stop.puzzle[state.scare] || stop.puzzle.cozy)) || stop.fallback;
}

/* ---------- flow ---------- */
$("btn-start").addEventListener("click", async () => {
  state.team = $("team-name").value.trim() || "Lantern Keepers";
  const code = $("access-code").value.trim();
  let startingKit = "DEMO";
  if (!isDemo) {
    const result = await validateCode(code);
    if (!result) { alert("That access code didn't check out — ask your organizer."); return; }
    // Fetch kit bundle + content pack
    const bundle = await fetchKitBundle(result.kit);
    if (!bundle) { alert("Could not load the game — check your connection."); return; }
    if (bundle.pack) {
      // Gate the remote pack: a malformed one would crash openMap()/hints mid-hunt.
      const errs = validatePack(bundle.pack);
      if (errs.length) {
        console.error("Rejected content pack:", errs);
        alert("This kit's content failed validation — using the built-in game. Tell your organizer.");
      } else {
        pack = bundle.pack;
      }
    }
    // Update scare level from kit if available
    if (result.scare) {
      state.scare = result.scare;
    }
    startingKit = result.kit;
  }
  if (state.kitId !== startingKit) {
    // New kit (or demo<->live switch): start clean instead of inheriting
    // solved stops from whatever was played before on this device. (P1)
    state.solved = []; state.hintsUsed = 0; state.startedAt = Date.now();
    state.kitId = startingKit;
  } else {
    state.startedAt = state.startedAt || Date.now();
  }
  save(); show("screen-scare");
});

/* ---------- QR deep links ----------
   The kit's signs encode ?kit=&stop=&code=. Reading them here is what makes
   "scan to unlock the puzzle" actually work; without it the QR is decorative
   and every code has to be typed by hand. */
// Strict stop parsing: ?stop=3abc no longer reads as 3. (m8)
const _stopRaw = qs.get("stop") || "";
const deepStop = /^\d+$/.test(_stopRaw) ? parseInt(_stopRaw, 10) : NaN;
const deepSignCode = (qs.get("code") || "").trim();
const deepKit = (qs.get("kit") || "").trim();
// Access codes arrive as ?ac=; ?code= is the *sign* code on stop QRs. Old
// start posters used ?code= for access - honor it only when no ?stop= is
// present, so a scanned stop sign can never poison the access field. (P2)
const accessCode = (qs.get("ac") || "").trim() || (!qs.get("stop") ? deepSignCode : "");
if (deepKit && !state.kitId) state.kitId = deepKit;
if (accessCode) {
  const ac = $("access-code");
  if (ac && !ac.value) ac.value = accessCode;
}


document.querySelectorAll(".scare-card").forEach(b => b.addEventListener("click", () => {
  state.scare = b.dataset.pick;
  document.body.dataset.scare = state.scare;
  save(); openMap();
  // A QR that carried ?stop=N jumps straight to that puzzle after scare choice.
  if (Number.isInteger(deepStop) && deepStop >= 1) {
    const target = pack.stops.find(s => s.id === deepStop);
    if (target && !state.solved.includes(target.id)) window.openStop(deepStop);
  }
}));

let map = null;
let mapBroken = false;
function openMap() {
  show("screen-map");
  if (!mapBroken && !map) {
    // Leaflet may be absent (CDN blocked by CSP, or offline). Degrade to a
    // text stop list instead of throwing ReferenceError and killing the screen.
    if (typeof L === "undefined") {
      mapBroken = true;
      const el = $("map");
      // Static literal only — no untrusted data interpolated here.
      if (el) el.textContent = "Map unavailable — use the stop list below.";
    } else {
      try {
        map = L.map("map");
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          { attribution: "© OpenStreetMap contributors" }).addTo(map);
        pack.stops.forEach(s => L.marker([s.lat, s.lng]).addTo(map)
          .bindPopup(`${s.id}. ${esc(s.name)}`));
      } catch (e) {
        mapBroken = true;
        console.error("map init failed:", e);
      }
    }
  }
  const next = pack.stops.find(s => !state.solved.includes(s.id));
  if (!next) return show("screen-finale"), finale();
  if (map && !mapBroken) map.setView([next.lat, next.lng], 17);
  // Build the node safely: stop names come from a remote content pack and must
  // not be interpolated into innerHTML (a kit author could inject markup).
  const box = $("next-stop");
  box.textContent = "";
  const strong = document.createElement("strong");
  strong.textContent = `Next: Stop ${next.id} — ${next.name}`;
  box.appendChild(strong);
  box.appendChild(document.createElement("br"));
  const btn = document.createElement("button");
  btn.textContent = "We're at the stop →";
  btn.addEventListener("click", () => window.openStop(next.id));
  box.appendChild(btn);
}

window.openStop = function (id) {
  currentStop = pack.stops.find(s => s.id === id);
  if (!currentStop) return;
  hintLevel = 0; $("hint-text").textContent = ""; $("feedback").textContent = "";
  $("puzzle-title").textContent = `Stop ${currentStop.id}: ${currentStop.name}`;
  $("puzzle-story").textContent = variant(currentStop, "story");
  $("puzzle-question").textContent = variant(currentStop, "puzzle").q;
  $("puzzle-answer").value = ""; $("unlock-code").value = "";
  // A QR that carried this stop's sign code pre-fills the unlock field -
  // never another stop's code. (m19)
  if (deepSignCode && deepSignCode.toUpperCase() === String(currentStop.code).toUpperCase())
    $("unlock-code").value = deepSignCode;
  show("screen-puzzle");
};

function solved() {
  // Dedupe: re-scanning a sign must not inflate the leaderboard payload.
  // The portal scores base = solved.length * POINTS_PER_STOP.
  if (!state.solved.includes(currentStop.id)) {
    state.solved.push(currentStop.id);
  }
  save();
  $("feedback").textContent = "🏮 Lantern lit!";
  setTimeout(openMap, 900);
  syncProgress(); // fire-and-forget leaderboard sync when backend present
}

$("btn-answer").addEventListener("click", () => {
  const p = variant(currentStop, "puzzle");
  const got = $("puzzle-answer").value.trim().toLowerCase();
  if (got === String(p.a).trim().toLowerCase()) solved();
  else $("feedback").textContent = "Not quite — try a hint, Keeper!";
});

$("btn-unlock").addEventListener("click", () => {
  if ($("unlock-code").value.trim().toUpperCase() === String(currentStop.code).toUpperCase()) solved();
  else $("feedback").textContent = "That code isn't from this stop's sign.";
});

$("btn-gps").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const d = haversine(pos.coords.latitude, pos.coords.longitude, currentStop.lat, currentStop.lng);
    if (d <= 30) { $("feedback").textContent = "📍 You're here! Now solve the puzzle above."; }
    else $("feedback").textContent = `Still ${Math.round(d)}m away — keep hunting!`;
  }, () => $("feedback").textContent = "GPS unavailable — use the sign code instead.", { timeout: 10000 });
});

$("btn-hint").addEventListener("click", () => {
  if (hintLevel < 3) { $("hint-text").textContent = currentStop.hints[hintLevel]; hintLevel++; state.hintsUsed++; save(); }
});

function finale() {
  const mins = state.startedAt ? Math.round((Date.now() - state.startedAt) / 60000) : 0;
  $("finale-stats").textContent =
    `${state.team} · ${pack.stops.length} lanterns · ${mins} minutes · ${state.hintsUsed} hints used`;
  syncProgress(true);
}
$("btn-restart").addEventListener("click", () => {
  // Preserve mode: forcing ?demo=1 on restart would strand a live team in the
  // offline pack and drop their kit binding.
  const keep = new URLSearchParams(location.search);
  keep.delete("stop");   // clear the QR deep-link so the new run starts clean
  keep.delete("code");   // and the sign code, so it is not pre-filled next run (m3)
  const q = keep.toString();
  localStorage.removeItem("lantern-state");
  location.href = location.pathname + (q ? "?" + q : "");
});

/* ---------- helpers / backend stubs ---------- */
function haversine(a, b, c, d) {
  const R = 6371000, t = x => x * Math.PI / 180;
  const h = Math.sin(t(c - a) / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(t(d - b) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
async function validateCode(code) {
  try {
    const r = await fetch(`${API_BASE}/api/lantern/validate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }) });
    if (!r.ok) return null;
    const data = await r.json();
    return data.valid === true ? data : null;
  } catch { return null; }
}

async function fetchKitBundle(kitId) {
  try {
    const r = await fetch(`${API_BASE}/api/lantern/kit/${kitId}`);
    if (!r.ok) return null;
    const bundle = await r.json();
    // Fetch the content pack file if present
    if (bundle.content_pack_url) {
      const cp = bundle.content_pack_url;
      const cpUrl = /^https?:\/\//i.test(cp) ? cp : `${API_BASE}${cp}`;
      const cpResp = await fetch(cpUrl);
      // A live kit with an unloadable pack is an error, not a silent fallback
      // to demo content (which would pollute the live leaderboard). (P5)
      if (!cpResp.ok) return null;
      const pack = await cpResp.json();
      return { ...bundle, pack };
    }
    return { ...bundle, pack: null };
  } catch { return null; }
}
async function syncProgress(done = false) {
  if (isDemo) return;
  try {
    await fetch(`${API_BASE}/api/lantern/progress`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: state.team, kit: state.kitId, solved: state.solved,
        hintsUsed: state.hintsUsed, scare: state.scare, finished: done }) });
  } catch { /* offline is fine — progress also lives in localStorage */ }
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
document.body.dataset.scare = state.scare;
