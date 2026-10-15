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
    { id: 1, name: "The Welcome Pumpkin", lat: 29.0258, lng: -80.9270, code: "LANTERN-1", art: "stop-1-pumpkin.webp",
      story: { cozy: "Wisp twirls sadly. \"My first lantern rolled away right at the start!\"",
               spooky: "A carved pumpkin grins where no pumpkin should be. Something glows inside it.",
               afterdark: "The old-timers say a light once wandered this road, looking for the turning it missed in 1768.",
               overdrive: "Dr. Z here — FULL MADNESS engaged. My sensors detect faster teams ahead of you. That pumpkin isn't smiling, it's SMIRKING. Wipe that smirk off." },
      wisp: "That's MINE! Oh — oh! It still remembers me. Quick, light it!",
      lit: "One down! See how it glows? That's my happy leaking out.",
      puzzle: { cozy: { q: "Count the pumpkins in the patch picture your organizer showed you. How many are smiling?", a: "4", type: "number" },
                spooky: { q: "Riddle: I have a face but cannot see, I glow but cannot flee. On Halloween night I watch the street. What am I?", a: "jack-o-lantern", type: "text" } },
      fallback: { q: "What color is the ribbon on the welcome sign?", a: "orange" },
      hints: ["Look low — lanterns love the ground.", "Count slowly, out loud, as a team.", "Ranger assist: the smiling pumpkins are 4."] },
    { id: 2, name: "The Whispering Oak", lat: 29.0262, lng: -80.9264, code: "LANTERN-2", art: "stop-2-oak.webp",
      story: { cozy: "The big oak is Wisp's best friend. He hid a lantern in his branches!",
               spooky: "The oak's branches are bare, but something in the canopy breathes in and out, in and out — like the tree is dreaming.",
               afterdark: "They say this oak was a hanging tree in the 1800s. On still nights the leaves whisper names. Listen — is one of them yours?",
               overdrive: "Two hundred years this oak has stood, and it has seen faster Keepers than you. Oakie, be honest — are they slow? …He says yes. MOVE." },
      wisp: "Shhh — Oakie is sleeping. He only hides things for friends. We're friends, right?",
      lit: "Got it! Oakie says you're officially tree-approved.",
      puzzle: { cozy: { q: "Find the oak. How many wooden swings or benches face it?", a: "2", type: "number" } },
      fallback: { q: "What is carved on the small sign by the oak?", a: "wisp" },
      hints: ["Face the tree like it is facing you.", "Only count the ones looking at the oak.", "Ranger assist: the answer is 2."] },
    { id: 3, name: "The Giggling Graveyard (pretend!)", lat: 29.0266, lng: -80.9258, code: "LANTERN-3", art: "stop-3-graveyard.webp",
      story: { cozy: "Don't worry — these tombstones are made of foam, and every ghost here just wants to play tag.",
               spooky: "The foam tombstones lean like bad teeth, and the giggling isn't coming from any of them. It's coming from underneath.",
               afterdark: "Pretend stones, real ground. The town buried its 1918 flu dead in a field like this one — and on Halloween the veil is thin enough to hear them laugh.",
               overdrive: "The ghosts keep score, and right now you're losing to a team of TODDLERS. Tag them back. TAG. THEM. BACK." },
      wisp: "Tag, you're it! Kidding — unless…? No, kidding. Probably.",
      lit: "The ghosts are doing the wave. That's their applause. You're welcome.",
      puzzle: { cozy: { q: "One foam tombstone says R.I.P. — Rest In... what? (The silly word on the stone!)", a: "pumpkins", type: "text" } },
      fallback: { q: "How many foam tombstones are there?", a: "5" },
      hints: ["Read the stones — one of them is joking.", "It rhymes with the patch from Stop 1.", "Ranger assist: Rest In Pumpkins."] },
    { id: 4, name: "The Spider's Counting Web", lat: 29.0270, lng: -80.9252, code: "LANTERN-4", art: "stop-4-spider.webp",
      story: { cozy: "Mrs. Spider (she's friendly, and made of pipe cleaners) has a lantern tangled in her web!",
               spooky: "The web stretches between the gazebo posts like a trap, and the dew on it isn't dew — it's too thick, and it trembles when you step close.",
               afterdark: "Orb weavers rebuild every night. This one has rebuilt in this exact spot for eleven years. She remembers every face that's ever been caught.",
               overdrive: "Mrs. Spider has rebuilt eleven webs tonight AND finished a crossword. Your excuse is WHAT, exactly? Untangle that lantern. Clock's ticking." },
      wisp: "Mrs. Spider says hi. She says it with all eight legs. It's a lot of hi.",
      lit: "Untangled! Mrs. Spider is doing a happy leg-dance. All eight. It's a LOT.",
      puzzle: { cozy: { q: "A real spider has 8 legs. Mrs. Spider is holding up 3 legs to wave. How many legs are on the ground?", a: "5", type: "number" } },
      fallback: { q: "What color is Mrs. Spider?", a: "purple" },
      hints: ["Start with 8 legs, like every spider.", "She waves with 3 of them.", "Ranger assist: 8 − 3 = 5."] },
    { id: 5, name: "The Owl's Night Watch", lat: 29.0274, lng: -80.9246, code: "LANTERN-5", art: "stop-5-owl.webp",
      story: { cozy: "High in the tree, Professor Hoot guards a lantern. He only lends it to good listeners.",
               spooky: "The owl doesn't blink. Owls can't — but this one isn't trying to. It watches you solve, and you can feel it grading you.",
               afterdark: "Barred owls ask ‘who cooks for you.’ The old stories say if you answer wrong, you follow the sound into the dark and don't come back. Answer carefully.",
               overdrive: "Professor Hoot graded your last answer a C+. A C! In MY hunt! Listen harder, answer faster — make an owl proud." },
      wisp: "Professor Hoot is very serious. Do your serious face. …Not that serious. Dial it back.",
      lit: "‘Hoo,’ he says. That's owl for ‘well done.’ I translated. You're welcome.",
      puzzle: { cozy: { q: "Listen to the sound your phone plays at this stop: is it an owl, a cat, or a frog?", a: "owl", type: "text" } },
      fallback: { q: "What two letters does an owl 'say'?", a: "ho" },
      hints: ["It is the sound this whole stop is named after.", "Twilight is this bird's favorite time.", "Ranger assist: it's the owl."] },
    { id: 6, name: "The Lantern Parade Ground", lat: 29.0278, lng: -80.9240, code: "LANTERN-6", art: "stop-6-parade.webp",
      story: { cozy: "The last lantern! Light it and the whole parade glows.",
               spooky: "The empty parade ground waits. Six lanterns, six shadows — but there are seven shadows moving on the grass, and one of them is waving at you.",
               afterdark: "Every lantern you've lit is still burning behind you, a dotted line of fire through the dark. One more, and the road home exists.",
               overdrive: "FINAL STRETCH. Wisp ran the numbers and they are NOT in your favor. Light that last lantern like you mean it — FULL! MADNESS!" },
      wisp: "This is it — the last one! My hands are all shaky. Do I have hands? I'm shaky anyway!",
      lit: "IT'S LIT! Look at them all — look at ME! I'm basically a sunrise!",
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
const HINT_BUDGET = 6;
state.cleanSolves = state.cleanSolves || 0;
state.stopHints = state.stopHints || {};
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

/* ---------- pilot-bundle HUD: relics, Wisp meter, hint budget ----------
   Pack-supplied names are untrusted (remote packs) — esc() them anywhere
   they enter HTML. RELIC_ALT / WISP_MOODS are local constants, safe. */
const RELIC_ALT = {
  1: "Relic from Stop 1, The Welcome Pumpkin: a smiling jack-o'-lantern with a glowing carved face",
  2: "Relic from Stop 2, The Whispering Oak: an ancient oak with a kindly face in its bark and swirling autumn leaves",
  3: "Relic from Stop 3, The Giggling Graveyard: smiling foam tombstones and a friendly little ghost under a crescent moon",
  4: "Relic from Stop 4, The Spider's Counting Web: a cute friendly spider in a big sparkling dew-covered web",
  5: "Relic from Stop 5, The Owl's Night Watch: a wise big-eyed owl perched on a branch at night",
  6: "Relic from Stop 6, The Lantern Parade Ground: glowing paper lanterns floating above a winding park path at dusk"
};
// Wisp's mood evolves with progress: her three story moments double as the
// meter's tiers, so the HUD itself tells her arc (lost → hopeful → home).
const WISP_MOODS = [
  { min: 0, src: "wisp-sad-intro.webp",
    alt: "Wisp the will-o'-the-wisp twirling sadly — 0 to 2 lanterns lit, she is still lost",
    cap: "Wisp is still lost…" },
  { min: 3, src: "wisp-hiding-lantern.webp",
    alt: "Wisp giggling, hope returning — 3 to 4 lanterns lit",
    cap: "Hope is flickering back…" },
  { min: 5, src: "wisp-leading-parade.webp",
    alt: "Wisp soaring joyfully at the head of her lanterns — 5 to 6 lit, she is almost home",
    cap: "She's almost home!" }
];
function wispMood(lit) {
  return WISP_MOODS.filter(m => lit >= m.min).pop();
}
// Map markers wear each stop's spot illustration; solved stops get a lit ring.
let markers = [];
let playerMarker = null, playerCircle = null;
function updatePlayerMarker(lat, lng, acc) {
  if (!map || mapBroken) return;
  const ll = [lat, lng];
  if (!playerMarker) {
    playerMarker = L.circleMarker(ll, { radius: 8, color: '#1a73e8', fillColor: '#1a73e8', fillOpacity: 0.9, weight: 2 }).addTo(map);
    playerCircle = L.circle(ll, { radius: acc, color: '#1a73e8', fillColor: '#1a73e8', fillOpacity: 0.15, weight: 1 }).addTo(map);
  } else {
    playerMarker.setLatLng(ll);
    playerCircle.setLatLng(ll).setRadius(acc);
  }
}
function stopIcon(s) {
  const lit = state.solved.includes(s.id);
  const face = s.art
    ? `<img src="assets/${s.art}" alt="${lit ? "Lit" : "Unlit"}: Stop ${s.id} — ${esc(s.name)}">`
    : `<div class="pin-fallback" role="img" aria-label="${lit ? "Lit" : "Unlit"}: Stop ${s.id} — ${esc(s.name)}">🏮</div>`;
  return L.divIcon({ className: "stop-marker" + (lit ? " lit" : ""), html: face,
    iconSize: [46, 46], iconAnchor: [23, 23] });
}
function updateHUD() {
  const lit = state.solved.length, total = pack.stops.length;
  const wm = $("wisp-meter");
  if (wm) {
    const mood = wispMood(lit);
    let dots = "";
    for (let i = 0; i < total; i++) dots += i < lit ? "🏮" : "🌑";
    wm.innerHTML = `<strong>Wisp's glow</strong>` +
      `<img class="wisp-mood" src="assets/${mood.src}" alt="${mood.alt}">` +
      `<div class="dots" role="img" aria-label="${lit} of ${total} lanterns lit">${dots}</div>` +
      `<div>${lit}/${total} lanterns lit — ${mood.cap}</div>`;
  }
  markers.forEach((m, i) => { if (m.setIcon) m.setIcon(stopIcon(pack.stops[i])); });
  const tray = $("relics");
  if (tray) {
    tray.innerHTML = pack.stops.map(s => {
      const got = state.solved.includes(s.id);
      const cls = got ? "relic" : "relic locked";
      const inner = (got && s.art)
        ? `<img class="${cls}" src="assets/${s.art}" alt="${RELIC_ALT[s.id] || ("Relic: " + esc(s.name))}">`
        : `<div class="${cls}" role="img" aria-label="${got ? "lit lantern relic" : "unfound relic"}">${got ? "🏮" : "❔"}</div>`;
      return `<span title="${got ? esc(s.name) : "???"}">${inner}</span>`;
    }).join("");
  }
  const left = HINT_BUDGET - state.hintsUsed;
  const hc = $("hint-count"), hb = $("btn-hint");
  if (hc) hc.textContent = left > 0 ? `(${left} left)` : "(none left)";
  if (hb) hb.disabled = left <= 0;
}

/* Elapsed clock on the map screen (UX #5 — only the finale showed duration). */
function tickClock() {
  const el = $("hunt-clock");
  if (!el) return;
  if (!state.startedAt) { el.textContent = ""; return; }
  const s = Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
  el.textContent = `⏱ Elapsed: ${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
setInterval(tickClock, 1000);

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
    state.solved = []; state.hintsUsed = 0; state.cleanSolves = 0; state.stopHints = {};
    state.startedAt = Date.now();
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
        markers = pack.stops.map(s => L.marker([s.lat, s.lng], { icon: stopIcon(s) }).addTo(map)
          .bindPopup(`${s.id}. ${esc(s.name)}`));
      } catch (e) {
        mapBroken = true;
        console.error("map init failed:", e);
      }
    }
  }
  const next = pack.stops.find(s => !state.solved.includes(s.id));
  updateHUD();
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
  if (state.solved.length === 3) {
    const note = document.createElement("p");
    note.className = "lab-note";
    note.innerHTML = `📜 <strong>Lab note, halfway:</strong> Wisp's glow is stabilizing — the lanterns are remembering her. Don't let the fourth one spook you. It spooked <em>me</em>, and I built the things. — <em>Dr. Z</em>`;
    box.appendChild(note);
  }
}

window.openStop = function (id) {
  currentStop = pack.stops.find(s => s.id === id);
  if (!currentStop) return;
  hintLevel = 0; $("hint-text").textContent = ""; $("feedback").textContent = "";
  $("puzzle-title").textContent = `Stop ${currentStop.id}: ${currentStop.name}`;
  const sa = $("stop-art");
  if (sa) {
    if (currentStop.art) { sa.src = "assets/" + currentStop.art;
      sa.alt = RELIC_ALT[currentStop.id] || ("Art for " + currentStop.name);
      sa.style.display = ""; }
    else { sa.removeAttribute("src"); sa.style.display = "none"; }
  }
  $("puzzle-story").textContent = variant(currentStop, "story");
  const ws = $("wisp-says");
  if (ws) {
    if (currentStop.wisp) { ws.textContent = "\u201C" + currentStop.wisp + "\u201D — Wisp"; ws.style.display = ""; }
    else { ws.textContent = ""; ws.style.display = "none"; }
  }
  $("puzzle-question").textContent = variant(currentStop, "puzzle").q;
  $("puzzle-answer").value = ""; $("unlock-code").value = "";
  // A QR that carried this stop's sign code pre-fills the unlock field -
  // never another stop's code. (m19)
  if (deepSignCode && deepSignCode.toUpperCase() === String(currentStop.code).toUpperCase())
    $("unlock-code").value = deepSignCode;
  // Fresh stop: reset the GPS affordance, then auto-watch for arrival.
  const gpsBtn = $("btn-gps");
  if (gpsBtn) { gpsBtn.disabled = false; gpsBtn.textContent = "📍 I'm here (GPS check)"; }
  startGpsWatch(currentStop);
  show("screen-puzzle");
};

function solved() {
  if (!(state.stopHints[currentStop.id] > 0)) state.cleanSolves++;
  // Dedupe: re-scanning a sign must not inflate the leaderboard payload.
  // The portal scores base = solved.length * POINTS_PER_STOP.
  if (!state.solved.includes(currentStop.id)) {
    state.solved.push(currentStop.id);
  }
  save();
  $("feedback").textContent = "🏮 " + (currentStop.lit || "Lantern lit!");
  stopGpsWatch();
  setTimeout(openMap, 900);
  syncProgress(); // fire-and-forget leaderboard sync when backend present
}

$("btn-answer").addEventListener("click", () => {
  const p = variant(currentStop, "puzzle");
  const got = $("puzzle-answer").value.trim().toLowerCase();
  if (got === String(p.a).trim().toLowerCase()) solved();
  else $("feedback").textContent = "Not quite — try a hint, Keeper!";
});
// Enter submits the answer (and the sign code) — no button tap needed. (UX #4)
$("puzzle-answer").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); $("btn-answer").click(); }
});
$("unlock-code").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); $("btn-unlock").click(); }
});

$("btn-unlock").addEventListener("click", () => {
  if ($("unlock-code").value.trim().toUpperCase() === String(currentStop.code).toUpperCase()) solved();
  else $("feedback").textContent = "That code isn't from this stop's sign.";
});

$("btn-gps").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const acc = pos.coords.accuracy || 999;
    if (acc > 50) {
      $("feedback").textContent = `GPS accuracy is poor (±${Math.round(acc)}m) — move to open sky or use the sign code.`;
      return;
    }
    const plat = pos.coords.latitude, plng = pos.coords.longitude;
    const d = haversine(plat, plng, currentStop.lat, currentStop.lng);
    const radius = currentStop.radius || 30;
    updatePlayerMarker(plat, plng, acc);
    if (d <= radius) { $("feedback").textContent = "📍 You're here! Now solve the puzzle above."; }
    else {
      const b = bearing(plat, plng, currentStop.lat, currentStop.lng);
      $("feedback").textContent = `Still ${Math.round(d)}m away to the ${compassDir(b)} — keep hunting!`;
    }
  }, () => $("feedback").textContent = "GPS unavailable — use the sign code instead.", { timeout: 10000, enableHighAccuracy: true });
});

$("btn-hint").addEventListener("click", () => {
  if (state.hintsUsed >= HINT_BUDGET) {
    $("hint-text").textContent = "The hint jar is empty! Ask your organizer — a Lab Assistant can grant a rescue hint.";
    return;
  }
  if (hintLevel < 3) {
    $("hint-text").textContent = currentStop.hints[hintLevel]; hintLevel++;
    state.hintsUsed++;
    state.stopHints[currentStop.id] = (state.stopHints[currentStop.id] || 0) + 1;
    save(); updateHUD();
  } else {
    $("hint-text").textContent = "That's all 3 hints for this stop — trust your team!";
  }
});

function finale() {
  const mins = state.startedAt ? Math.round((Date.now() - state.startedAt) / 60000) : 0;
  $("finale-stats").textContent =
    `${state.team} · ${pack.stops.length} lanterns · ${mins} minutes · ${state.hintsUsed} hints used · ★ ${state.cleanSolves}/${pack.stops.length} clean solves`;
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

/* Finale share card (UX #8): a canvas PNG (team, lanterns, time, stats)
   shared via the Web Share API or downloaded — no more photographing
   the screen. */
$("btn-share").addEventListener("click", () => {
  try {
    const W = 1080, H = 1350;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const g = cv.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#101c33"); grad.addColorStop(1, "#3a2410");
    g.fillStyle = grad; g.fillRect(0, 0, W, H);
    g.textAlign = "center";
    g.fillStyle = "#ffd98a";
    g.font = "700 84px Georgia, 'Times New Roman', serif";
    g.fillText("\u{1F3EE} Lantern Keepers \u{1F3EE}", W / 2, 210);
    g.fillStyle = "#fff7ea";
    g.font = "700 72px Georgia, 'Times New Roman', serif";
    g.fillText(state.team || "Lantern Keepers", W / 2, 340);
    const total = pack.stops.length;
    g.font = "88px serif";
    for (let i = 0; i < total; i++)
      g.fillText(i < state.solved.length ? "\u{1F3EE}" : "\u{1F311}", 160 + i * 130, 540);
    g.fillStyle = "#ffd98a";
    g.font = "56px Georgia, 'Times New Roman', serif";
    const mins = state.startedAt ? Math.round((Date.now() - state.startedAt) / 60000) : 0;
    g.fillText(`${state.solved.length} / ${total} lanterns \u00b7 ${mins} min`, W / 2, 700);
    g.fillText(`\u2605 ${state.cleanSolves} clean solves \u00b7 ${state.hintsUsed} hints used`, W / 2, 790);
    g.fillStyle = "#c9b18a";
    g.font = "italic 44px Georgia, 'Times New Roman', serif";
    g.fillText("Wisp's Lost Lanterns \u2014 ZQM Labs", W / 2, 1120);
    g.font = "40px Georgia, 'Times New Roman', serif";
    g.fillText("zqmlabs.com", W / 2, 1190);
    cv.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], "lantern-keepers.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "We lit every lantern!",
          text: `${state.team} completed Wisp's Lost Lanterns!` }).catch(() => downloadCard(blob));
        return;
      }
      downloadCard(blob);
    }, "image/png");
  } catch (e) { console.error("share card failed:", e); }
});
function downloadCard(blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "lantern-keepers.png";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ---------- helpers / backend stubs ---------- */
function haversine(a, b, c, d) {
  const R = 6371000, t = x => x * Math.PI / 180;
  const h = Math.sin(t(c - a) / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(t(d - b) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
function bearing(a, b, c, d) {
  const t = x => x * Math.PI / 180;
  const y = Math.sin(t(d - b)) * Math.cos(t(c));
  const x = Math.cos(t(a)) * Math.sin(t(c)) - Math.sin(t(a)) * Math.cos(t(c)) * Math.cos(t(d - b));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function compassDir(deg) {
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg / 45) % 8];
}
/* Auto-arrival (UX #6): entering a puzzle screen starts a watchPosition; the
   first fix within 30m confirms arrival and disables the manual button.
   Watches are always cleared on stop change — an open watch is a battery
   drain. Geolocation errors just leave the manual button in place. */
let gpsWatch = null;
function stopGpsWatch() {
  if (gpsWatch) { try { navigator.geolocation.clearWatch(gpsWatch); } catch { /* already dead */ }
    gpsWatch = null; }
}
function startGpsWatch(stop) {
  stopGpsWatch();
  if (!navigator.geolocation || !stop) return;
  try {
    gpsWatch = navigator.geolocation.watchPosition(pos => {
      const d = haversine(pos.coords.latitude, pos.coords.longitude, stop.lat, stop.lng);
      if (d <= 30) {
        stopGpsWatch();
        const fb = $("feedback");
        if (fb) fb.textContent = "📍 GPS says you're here! Now solve the puzzle above.";
        const g = $("btn-gps");
        if (g) { g.disabled = true; g.textContent = "📍 You're here!"; }
      }
    }, () => { /* denied/unavailable — the manual button remains */ },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30000 });
  } catch { gpsWatch = null; }
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
  const payload = { team: state.team, kit: state.kitId, solved: state.solved,
    hintsUsed: state.hintsUsed, scare: state.scare, finished: done };
  try {
    const r = await fetch(`${API_BASE}/api/lantern/progress`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload) });
    if (!r.ok) throw new Error("progress rejected");
  } catch {
    // Offline (or backend absent): queue the payload. Progress also lives in
    // localStorage; the queue retries on reconnect, on load, and every 60s.
    const q = outboxLoad(); q.push(payload); outboxSave(q);
  }
}
/* Progress outbox: failed syncs survive offline stretches and retry. Bounded
   at 50 entries (oldest dropped) so a long offline run cannot grow
   localStorage without limit. */
const OUTBOX_KEY = "lantern-outbox";
function outboxLoad() { try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || "[]"); } catch { return []; } }
function outboxSave(q) { try { localStorage.setItem(OUTBOX_KEY, JSON.stringify(q.slice(-50))); } catch { /* quota — drop oldest */ } }
async function flushOutbox() {
  if (isDemo) return;
  const q = outboxLoad();
  if (!q.length) return;
  const rest = [];
  for (const item of q) {
    try {
      const r = await fetch(`${API_BASE}/api/lantern/progress`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item) });
      if (!r.ok) rest.push(item);
    } catch { rest.push(item); }
  }
  outboxSave(rest);
}
window.addEventListener("online", flushOutbox);
flushOutbox();
setInterval(flushOutbox, 60000);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
document.body.dataset.scare = state.scare;
