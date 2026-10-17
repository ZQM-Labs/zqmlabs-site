"use strict";
/* lantern-player - game state machine.
   Content comes from a pack (exported by lantern-content). For multi-game
   support, the pack is loaded from a JSON file. DEMO_PACK below is the
   embedded fallback so ?demo=1 plays with no backend. */

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8090" : "https://api.zqmlabs.com";

// Load game-specific content pack
const GAME_PACK_URL = "pumpkin-roll.json";
let DEMO_PACK = null;

async function loadGamePack() {
  try {
    const r = await fetch(GAME_PACK_URL);
    if (r.ok) {
      const pack = await r.json();
      const errs = validatePack(pack);
      if (!errs.length) {
        DEMO_PACK = pack;
        return;
      }
      console.error("Pack validation failed:", errs);
    }
  } catch (e) {
    console.warn("Could not load game pack, using fallback:", e);
  }
  // Fallback: use embedded demo pack
  DEMO_PACK = {
    title: "The Great Pumpkin Roll",
    kit: "PUMPKIN-ROLL",
    stops: [
      { id: 1, name: "The Starting Gate", lat: 29.0258, lng: -80.9270, code: "PUMPKIN-1", art: "stop-1-gate.webp",
        story: { cozy: "The Great Pumpkin Roll begins! Farmer Joe's pumpkins have escaped the patch and rolled all over town. Your team must find them all and roll them back home before the festival starts.",
                 spooky: "The pumpkins didn't roll - they were pushed. Something in the patch wanted them gone. Find them before whatever pushed them decides to push you too.",
                 afterdark: "Every year, the pumpkins roll themselves. Every year, someone forgets to ask why. This year, you're asking. This year, you're finding out.",
                 overdrive: "FARMER JOE'S PUMPKINS HAVE ESCAPED AND THE FESTIVAL STARTS IN 60 MINUTES. ROLL THEM BACK. NOW. FULL PUMPKIN MADNESS." },
        wisp: "The pumpkins are round and orange and they ROLL! Let's catch them!",
        lit: "Got it! That pumpkin is officially on its way home.",
        puzzle: { cozy: { q: "How many pumpkins are painted on the starting gate sign?", a: "3", type: "number" },
                  spooky: { q: "I roll without legs, I'm orange and round, I'm not a ball but I'm often found on Halloween night. What am I?", a: "pumpkin", type: "text" },
                  afterdark: { q: "The gate has a number. It's the year the festival started. Count the digits.", a: "4", type: "number" },
                  overdrive: { q: "There are 3 pumpkins on the sign. Each pumpkin has 4 letters in its name. Multiply them.", a: "12", type: "number" } },
        fallback: { q: "What color are pumpkins?", a: "orange" },
        hints: ["Look at the sign - it has pumpkins on it.", "Count them slowly, one by one.", "Ranger assist: there are 3 pumpkins on the sign."] },
      { id: 2, name: "The Rolling Hill", lat: 29.0262, lng: -80.9264, code: "PUMPKIN-2", art: "stop-2-hill.webp",
        story: { cozy: "This is where the pumpkins love to roll! The hill is gentle and the grass is soft. A pumpkin must have stopped here to rest.",
                 spooky: "The hill is steep, and the grass is flattened in a spiral pattern. Something rolled here - but it wasn't just a pumpkin. It was being chased.",
                 afterdark: "Locals say that on quiet nights, you can hear the pumpkins rolling down this hill by themselves. A soft thump-thump-thump in the dark.",
                 overdrive: "THE HILL IS WHERE THE PUMPKINS GAIN SPEED. FIND THE ONE THAT STOPPED. IT'S THE KEY TO THE REST." },
        wisp: "Wheee! Pumpkins love rolling down hills! Let's find this one!",
        lit: "That pumpkin is officially dizzy. Good catch!",
        puzzle: { cozy: { q: "How many steps lead up to the top of the hill?", a: "5", type: "number" },
                  spooky: { q: "I go up and down but never move. I have steps but no feet. What am I?", a: "stairs", type: "text" },
                  afterdark: { q: "The hill has a sign with a number. It's the height in feet. Add the digits.", a: "7", type: "number" },
                  overdrive: { q: "There are 5 steps. Each step is 2 feet tall. What's the total height?", a: "10", type: "number" } },
        fallback: { q: "What shape is a pumpkin?", a: "round" },
        hints: ["Count the steps carefully.", "Look for a sign with a number.", "Ranger assist: there are 5 steps."] },
      { id: 3, name: "The Covered Bridge", lat: 29.0266, lng: -80.9258, code: "PUMPKIN-3", art: "stop-3-bridge.webp",
        story: { cozy: "The covered bridge is a favorite pumpkin hiding spot. It's cool and dark inside, and pumpkins love to nap there. Check under the benches!",
                 spooky: "The bridge creaks even when there's no wind. The wooden beams are carved with symbols - protection symbols. Protection from what?",
                 afterdark: "The bridge was built in 1887. The carvings on the beams are older. Much older. They're not decorations. They're warnings.",
                 overdrive: "THE BRIDGE IS THE HALFWAY POINT. FIND THE PUMPKIN. THE FESTIVAL DEPENDS ON IT." },
        wisp: "Bridges are great for pumpkin naps! Shhh, don't wake this one!",
        lit: "That pumpkin is officially bridge-approved!",
        puzzle: { cozy: { q: "How many benches are inside the covered bridge?", a: "2", type: "number" },
                  spooky: { q: "I have a roof but no walls, I have benches but no people, I cross over but never move. What am I?", a: "bridge", type: "text" },
                  afterdark: { q: "The bridge was built in 1887. Add the digits of the year.", a: "24", type: "number" },
                  overdrive: { q: "There are 2 benches. Each bench has 4 legs. How many legs total?", a: "8", type: "number" } },
        fallback: { q: "What is a bridge made of?", a: "wood" },
        hints: ["Look inside the bridge.", "Count the benches.", "Ranger assist: there are 2 benches."] },
      { id: 4, name: "The Old Windmill", lat: 29.0270, lng: -80.9252, code: "PUMPKIN-4", art: "stop-4-windmill.webp",
        story: { cozy: "The old windmill has been here for a hundred years. Its blades turn slowly in the breeze. A pumpkin must have gotten stuck in the gears!",
                 spooky: "The windmill turns even when there's no wind. The gears grind and creak. Something is caught in the mechanism - something round and orange.",
                 afterdark: "The windmill hasn't worked in decades, but the blades still turn. At night, they cast shadows that look like reaching hands.",
                 overdrive: "THE WINDMILL IS WHERE THE PUMPKINS GET LOST. FIND IT. FIX IT. MOVE ON." },
        wisp: "Windmills are so tall! Maybe the pumpkin is up there!",
        lit: "That pumpkin is officially windmill-certified!",
        puzzle: { cozy: { q: "How many blades does the windmill have?", a: "4", type: "number" },
                  spooky: { q: "I have blades but I'm not a fan, I have a tail but I'm not a kite, I turn in the wind but I'm not a weathervane. What am I?", a: "windmill", type: "text" },
                  afterdark: { q: "The windmill has 4 blades. Each blade is 12 feet long. What's the total length?", a: "48", type: "number" },
                  overdrive: { q: "There are 4 blades. Each blade has 3 sections. How many sections total?", a: "12", type: "number" } },
        fallback: { q: "What makes a windmill turn?", a: "wind" },
        hints: ["Look up at the windmill.", "Count the blades.", "Ranger assist: there are 4 blades."] },
      { id: 5, name: "The Festival Grounds", lat: 29.0274, lng: -80.9246, code: "PUMPKIN-5", art: "stop-5-festival.webp",
        story: { cozy: "The festival grounds are where the Great Pumpkin Roll ends! There's music, games, and pumpkin pie. A pumpkin must be hiding among the decorations.",
                 spooky: "The festival grounds are empty now, but in a few hours they'll be full of people. The pumpkins know this. They're hiding, waiting for the crowds to arrive.",
                 afterdark: "The festival grounds have seen a hundred years of celebrations. The pumpkins remember every one. They're hiding in the oldest spot - the oak tree.",
                 overdrive: "THE FESTIVAL GROUNDS ARE THE SECOND-TO-LAST STOP. FIND THE PUMPKIN. THE FINISH LINE IS NEAR." },
        wisp: "The festival is so much fun! Let's find this pumpkin before the party starts!",
        lit: "That pumpkin is officially festival-ready!",
        puzzle: { cozy: { q: "How many festival flags are flying?", a: "6", type: "number" },
                  spooky: { q: "I fly but I'm not a bird, I have colors but I'm not a rainbow, I'm on a pole but I'm not a flagpole. What am I?", a: "flag", type: "text" },
                  afterdark: { q: "There are 6 flags. Each flag has 3 colors. How many colors total?", a: "18", type: "number" },
                  overdrive: { q: "There are 6 flags. Each flag is 2 feet wide. What's the total width?", a: "12", type: "number" } },
        fallback: { q: "What do people eat at pumpkin festivals?", a: "pie" },
        hints: ["Look around the festival grounds.", "Count the flags.", "Ranger assist: there are 6 flags."] },
      { id: 6, name: "The Finish Line", lat: 29.0278, lng: -80.9240, code: "PUMPKIN-6", art: "stop-6-finish.webp",
        story: { cozy: "The finish line! All the pumpkins are back home, and the festival can begin. You did it, Pumpkin Rollers! Time to celebrate!",
                 spooky: "The finish line is where the pumpkins gather. All six, all home, all safe. But wait - there's a seventh shadow. It's been following you the whole time.",
                 afterdark: "The finish line is where the journey ends and the celebration begins. The pumpkins are home, the festival is ready, and you did it. You found them all.",
                 overdrive: "FINISH LINE. ALL PUMPKINS FOUND. FESTIVAL TIME. YOU ARE OFFICIALLY PUMPKIN ROLL CHAMPIONS." },
        wisp: "We did it! All the pumpkins are home! You're the best Pumpkin Rollers ever!",
        lit: "IT'S A PUMPKIN ROLL VICTORY! Time to celebrate!",
        puzzle: { cozy: { q: "How many pumpkins did you find in total?", a: "6", type: "number" },
                  spooky: { q: "I'm the end of the journey, the start of the celebration, where pumpkins gather and teams cheer. What am I?", a: "finish line", type: "text" },
                  afterdark: { q: "You found 6 pumpkins. Each pumpkin took 10 minutes to find. How many minutes total?", a: "60", type: "number" },
                  overdrive: { q: "FINAL CHALLENGE: 6 pumpkins, each took 10 minutes. Total time? Add the digits.", a: "6", type: "number" } },
        fallback: { q: "What do you cross at the end of a race?", a: "finish line" },
        hints: ["Count all the pumpkins you found.", "Think about the whole journey.", "Ranger assist: you found 6 pumpkins."] }
    ]
  };
}

/* ---------- state ---------- */
const qs = new URLSearchParams(location.search);
// Demo mode is explicit: ?demo=1 (not ?demo=0). (m2)
const _demoVal = (qs.get("demo") || "").toLowerCase();
const isDemo = qs.has("demo") && !["0", "false", "no", "off"].includes(_demoVal);
// Corrupt saved state must not brick the player on load. (P3)
let _loaded = null;
try { _loaded = JSON.parse(localStorage.getItem("pumpkin-roll-state") || "null"); } catch { _loaded = null; }
const state = _loaded || {
  team: "", scare: "cozy", solved: [], hintsUsed: 0, startedAt: null, kitId: null
};
const HINT_BUDGET = 6;
state.cleanSolves = state.cleanSolves || 0;
state.stopHints = state.stopHints || {};
state.arrivedGps = state.arrivedGps || {};
state.stopAttempts = state.stopAttempts || {};  // wrong answers per stop id
state.stopTimes = state.stopTimes || {};        // {start, end} timestamps per stop id
state.arrivedVia = state.arrivedVia || {};      // gps|qr|manual per stop id
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
function save() { try { localStorage.setItem("pumpkin-roll-state", JSON.stringify(state)); } catch { /* private mode / quota - game continues in memory */ } }
function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}
/* Scare-tier art: stop-1-pumpkin-spooky.webp etc. Cozy reuses the base file;
   a missing tier file falls back to base art via the img onerror guard. */
function artFor(stop) {
  if (!stop || !stop.art) return "";
  if (state.scare && state.scare !== "cozy")
    return "assets/" + stop.art.replace(/\.webp$/i, "-" + state.scare + ".webp");
  return "assets/" + stop.art;
}

function variant(stop, kind) { // kind: "story" | puzzle object
  if (kind === "story") return stop.story[state.scare] || stop.story.cozy;
  return (stop.puzzle && (stop.puzzle[state.scare] || stop.puzzle.cozy)) || stop.fallback;
}

/* ---------- pilot-bundle HUD: relics, Wisp meter, hint budget ----------
   Pack-supplied names are untrusted (remote packs) - esc() them anywhere
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
    alt: "Wisp the will-o'-the-wisp twirling sadly - 0 to 2 lanterns lit, she is still lost",
    cap: "Wisp is still lost…" },
  { min: 3, src: "wisp-hiding-lantern.webp",
    alt: "Wisp giggling, hope returning - 3 to 4 lanterns lit",
    cap: "Hope is flickering back…" },
  { min: 5, src: "wisp-leading-parade.webp",
    alt: "Wisp soaring joyfully at the head of her lanterns - 5 to 6 lit, she is almost home",
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
    ? `<img src="${artFor(s)}" alt="${lit ? "Lit" : "Unlit"}: Stop ${s.id} - ${esc(s.name)}" onerror="this.onerror=null;this.src='assets/${s.art}'">`
    : `<div class="pin-fallback" role="img" aria-label="${lit ? "Lit" : "Unlit"}: Stop ${s.id} - ${esc(s.name)}">🏮</div>`;
  return L.divIcon({ className: "stop-marker" + (lit ? " lit" : ""), html: face,
    iconSize: [46, 46], iconAnchor: [23, 23] });
}
/* ---------- live geolocation: tracking, geofences, routing ----------
   Offline-first: every piece degrades. No permission -> the manual flow
   (stop list + Navigate + sign codes) works exactly as before. Leaflet
   absent -> distance-sorted text stop list. OSRM unreachable -> straight
   dashed guide line. Nothing here is required to finish the hunt. */
const GEO_DEFAULT_RADIUS = 30; // meters; a stop may override with `radius`
let geoWatchId = null;
let playerPos = null;          // {lat, lng, acc}
let geoState = "idle";         // idle | asking | active | denied | declined | unavailable
let geoDeclined = false;       // session flag: user tapped "No thanks"
let guideLine = null;
let lastRouteKey = "";
let arrivalFired = {};
let lastCardSig = "";
let lastListSig = "";

function stopRadius(s) { return s.radius || GEO_DEFAULT_RADIUS; }
function nextUnsolved() { return pack.stops.find(s => !state.solved.includes(s.id)); }
function mapsUrl(s) {
  return "https://www.google.com/maps/dir/?api=1&destination=" +
    s.lat + "," + s.lng + "&travelmode=walking";
}
function fmtDist(m) {
  return m < 950 ? Math.round(m) + "m" : (m / 1000).toFixed(1) + "km";
}
function startTracking() {
  if (!("geolocation" in navigator)) { geoState = "unavailable"; renderNextStop(); return; }
  if (geoWatchId !== null || geoDeclined) return;
  geoState = "asking";
  renderNextStop();
  geoWatchId = navigator.geolocation.watchPosition(onGeoPos, onGeoErr, {
    enableHighAccuracy: true, maximumAge: 5000, timeout: 15000
  });
}
function stopTracking() {
  if (geoWatchId !== null) {
    try { navigator.geolocation.clearWatch(geoWatchId); } catch (e) {}
    geoWatchId = null;
  }
}
function onGeoPos(pos) {
  const c = pos.coords;
  playerPos = { lat: c.latitude, lng: c.longitude, acc: c.accuracy || 999 };
  geoState = "active";
  updatePlayerMarker(playerPos.lat, playerPos.lng, playerPos.acc);
  checkGeofences();
  if (mapBroken) renderStopList(); else renderNextStop();
  updateGuideLine();
}
function onGeoErr(err) {
  geoState = (err && err.code === 1) ? "denied" : "unavailable";
  if (mapBroken) renderStopList(); else renderNextStop();
}
// A stop counts as "arrived" when the player is inside its radius with a
// sane fix. Poor-accuracy fixes never trigger arrivals (no parking-lot
// false positives from across the street).
function checkGeofences() {
  if (!playerPos || playerPos.acc > 60) return;
  state.arrivedGps = state.arrivedGps || {};
  let changed = false;
  for (const s of pack.stops) {
    if (state.solved.includes(s.id) || arrivalFired[s.id]) continue;
    if (haversine(playerPos.lat, playerPos.lng, s.lat, s.lng) <= stopRadius(s)) {
      arrivalFired[s.id] = true;
      state.arrivedGps[s.id] = true; state.arrivedVia[s.id] = "gps";
      changed = true;
    }
  }
  if (changed) save();
}
function cardSig(next) {
  const arrived = pack.stops
    .filter(s => arrivalFired[s.id] && !state.solved.includes(s.id))
    .map(s => s.id).join(",");
  const d = (playerPos && next)
    ? Math.round(haversine(playerPos.lat, playerPos.lng, next.lat, next.lng) / 5) : "-";
  return [geoState, next ? next.id : "x", d, arrived, state.solved.length].join("|");
}
function geoPromptNodes(box) {
  const p = document.createElement("p");
  p.textContent = "Let Wisp track your team? She\u2019ll point at the next stop and cheer when you arrive.";
  const en = document.createElement("button");
  en.textContent = "\uD83D\uDCCD Enable location";
  en.addEventListener("click", () => { geoDeclined = false; startTracking(); });
  const no = document.createElement("button");
  no.textContent = "No thanks";
  no.className = "ghost-btn";
  no.addEventListener("click", () => {
    geoDeclined = true; geoState = "declined";
    lastCardSig = ""; lastListSig = "";
    if (mapBroken) renderStopList(); else renderNextStop();
  });
  box.appendChild(p); box.appendChild(en); box.appendChild(no);
}
function navButton(s, label) {
  const nav = document.createElement("a");
  nav.className = "nav-btn";
  nav.href = mapsUrl(s);
  nav.target = "_blank";
  nav.rel = "noopener";
  nav.textContent = label || "\uD83E\uDDED Navigate";
  return nav;
}
function renderNextStop() {
  if (currentStop && !state.stopTimes[currentStop.id]) state.stopTimes[currentStop.id] = { start: Date.now() };
  const box = $("next-stop");
  if (!box) return;
  const next = nextUnsolved();
  const sig = cardSig(next);
  if (sig === lastCardSig) return; // don't thrash the DOM on every GPS tick
  lastCardSig = sig;
  box.textContent = "";
  if (!next) return;
  // Arrival banners for any unsolved stop we're standing at.
  for (const s of pack.stops) {
    if (arrivalFired[s.id] && !state.solved.includes(s.id)) {
      const banner = document.createElement("div");
      banner.className = "arrival-banner";
      const b = document.createElement("strong");
      b.textContent = `\uD83D\uDCCD You're at Stop ${s.id}: ${s.name}!`;
      banner.appendChild(b);
      const sub = document.createElement("div");
      sub.textContent = `Within ~${stopRadius(s)}m \u2014 Wisp can smell the lantern from here.`;
      banner.appendChild(sub);
      const open = document.createElement("button");
      open.textContent = "Open the puzzle \u2192";
      open.addEventListener("click", () => window.openStop(s.id));
      banner.appendChild(open);
      box.appendChild(banner);
    }
  }
  const head = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = `Next: Stop ${next.id} \u2014 ${next.name}`;
  head.appendChild(strong);
  box.appendChild(head);

  const row = document.createElement("div");
  row.className = "geo-row";
  if (geoState === "active" && playerPos) {
    const d = haversine(playerPos.lat, playerPos.lng, next.lat, next.lng);
    const b = bearing(playerPos.lat, playerPos.lng, next.lat, next.lng);
    const info = document.createElement("span");
    info.textContent = `\uD83D\uDCCD ${fmtDist(d)} ${compassDir(b)} of you`;
    row.appendChild(info);
    if (playerPos.acc > 60) {
      const weak = document.createElement("span");
      weak.className = "geo-weak";
      weak.textContent = ` (GPS \u00B1${Math.round(playerPos.acc)}m \u2014 move to open sky)`;
      row.appendChild(weak);
    }
  } else if (geoState === "asking") {
    const info = document.createElement("span");
    info.textContent = "\uD83D\uDCCD Finding you\u2026";
    row.appendChild(info);
  } else if (geoState === "idle" && !geoDeclined) {
    geoPromptNodes(box);
  } else {
    const info = document.createElement("span");
    info.textContent = geoState === "denied"
      ? "\uD83D\uDCCD Location is off \u2014 the hunt still works fine without it."
      : "\uD83D\uDCCD No live location \u2014 use Navigate below.";
    row.appendChild(info);
    const en = document.createElement("button");
    en.textContent = "\uD83D\uDCCD Enable location";
    en.className = "ghost-btn";
    en.addEventListener("click", () => { geoDeclined = false; startTracking(); });
    row.appendChild(en);
  }
  if (row.childNodes.length) box.appendChild(row);

  box.appendChild(navButton(next));
  const btn = document.createElement("button");
  btn.textContent = "We're at the stop \u2192";
  btn.addEventListener("click", () => window.openStop(next.id));
  box.appendChild(btn);

  if (state.solved.length === 3) {
    const note = document.createElement("p");
    note.className = "lab-note";
    note.innerHTML = `\uD83D\uDCDC <strong>Lab note, halfway:</strong> Wisp's glow is stabilizing \u2014 the lanterns are remembering her. Don't let the fourth one spook you. It spooked <em>me</em>, and I built the things. \u2014 <em>Dr. Z</em>`;
    box.appendChild(note);
  }
}
// Text fallback when Leaflet can't load: stops sorted by live distance,
// each with a Navigate link. Fully offline-capable.
function renderStopList() {
  const box = $("next-stop");
  if (!box) return;
  const sig = "list|" + cardSig(nextUnsolved());
  if (sig === lastListSig) return;
  lastListSig = sig;
  box.textContent = "";
  const intro = document.createElement("p");
  intro.textContent = "Map tiles unavailable \u2014 the stop list works offline:";
  box.appendChild(intro);
  if (geoState === "idle" && !geoDeclined) geoPromptNodes(box);
  const sorted = [...pack.stops].sort((a, b) => {
    if (!playerPos) return a.id - b.id;
    return haversine(playerPos.lat, playerPos.lng, a.lat, a.lng) -
           haversine(playerPos.lat, playerPos.lng, b.lat, b.lng);
  });
  const ol = document.createElement("ol");
  ol.className = "stop-list";
  for (const s of sorted) {
    const li = document.createElement("li");
    const done = state.solved.includes(s.id);
    let label = `Stop ${s.id}: ${s.name}`;
    if (done) label = "\uD83C\uDFEE " + label + " \u2014 lit!";
    else {
      if (playerPos) label += ` \u2014 ${fmtDist(haversine(playerPos.lat, playerPos.lng, s.lat, s.lng))}`;
      if (arrivalFired[s.id]) label = "\uD83D\uDCCD " + label + " \u2014 you're here!";
    }
    const span = document.createElement("span");
    span.textContent = label;
    li.appendChild(span);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(navButton(s, "\uD83E\uDDED"));
    if (!done) {
      const go = document.createElement("button");
      go.textContent = "Open \u2192";
      go.addEventListener("click", () => window.openStop(s.id));
      li.appendChild(document.createTextNode(" "));
      li.appendChild(go);
    }
    ol.appendChild(li);
  }
  box.appendChild(ol);
}
// Guide line: dashed straight line offline; upgraded to a real walking
// route from OSRM when the network cooperates. Stale responses are dropped.
function updateGuideLine() {
  if (!map || mapBroken || !playerPos) return;
  const next = nextUnsolved();
  if (!next) {
    if (guideLine) { map.removeLayer(guideLine); guideLine = null; }
    return;
  }
  drawStraightGuide(next);
  const key = `${playerPos.lat.toFixed(4)},${playerPos.lng.toFixed(4)}>${next.id}`;
  if (key !== lastRouteKey) {
    lastRouteKey = key;
    fetchOsrmRoute(next, key, { lat: playerPos.lat, lng: playerPos.lng });
  }
}
function drawStraightGuide(next) {
  if (!map || mapBroken || !playerPos) return;
  if (guideLine) map.removeLayer(guideLine);
  guideLine = L.polyline(
    [[playerPos.lat, playerPos.lng], [next.lat, next.lng]],
    { color: "#7c4dff", weight: 3, dashArray: "8 8", opacity: 0.85 }
  ).addTo(map);
}
async function fetchOsrmRoute(next, key, from) {
  if (!navigator.onLine) return;
  try {
    const u = "https://router.project-osrm.org/route/v1/foot/" +
      `${from.lng},${from.lat};${next.lng},${next.lat}?overview=full&geometries=geojson`;
    const r = await fetch(u);
    if (!r.ok) return;
    const j = await r.json();
    const coords = j.routes && j.routes[0] && j.routes[0].geometry && j.routes[0].geometry.coordinates;
    if (!coords || !coords.length || !map || mapBroken) return;
    const cur = nextUnsolved();
    if (!cur || cur.id !== next.id || lastRouteKey !== key) return; // stale
    if (guideLine) map.removeLayer(guideLine);
    guideLine = L.polyline(coords.map(c => [c[1], c[0]]),
      { color: "#1a73e8", weight: 4, opacity: 0.9 }).addTo(map);
  } catch (e) { /* keep the dashed straight line */ }
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
      `<div>${lit}/${total} lanterns lit - ${mood.cap}</div>`;
  }
  markers.forEach((m, i) => { if (m.setIcon) m.setIcon(stopIcon(pack.stops[i])); });
  const tray = $("relics");
  if (tray) {
    tray.innerHTML = pack.stops.map(s => {
      const got = state.solved.includes(s.id);
      const cls = got ? "relic" : "relic locked";
      const inner = (got && s.art)
        ? `<img class="${cls}" src="${artFor(s)}" alt="${RELIC_ALT[s.id] || ("Relic: " + esc(s.name))}" onerror="this.onerror=null;this.src='assets/${s.art}'">`
        : `<div class="${cls}" role="img" aria-label="${got ? "lit lantern relic" : "unfound relic"}">${got ? "🏮" : "❔"}</div>`;
      return `<span title="${got ? esc(s.name) : "???"}">${inner}</span>`;
    }).join("");
  }
  const left = HINT_BUDGET - state.hintsUsed;
  const hc = $("hint-count"), hb = $("btn-hint");
  if (hc) hc.textContent = left > 0 ? `(${left} left)` : "(none left)";
  if (hb) hb.disabled = left <= 0;
}

/* ---------- flow ---------- */
$("btn-start").addEventListener("click", async () => {
  state.team = $("team-name").value.trim() || "Lantern Keepers";
  const code = $("access-code").value.trim();
  let startingKit = "DEMO";
  if (!isDemo) {
    const result = await validateCode(code);
    if (!result) { alert("That access code didn't check out - ask your organizer."); return; }
    // Fetch kit bundle + content pack
    const bundle = await fetchKitBundle(result.kit);
    if (!bundle) { alert("Could not load the game - check your connection."); return; }
    if (bundle.pack) {
      // Gate the remote pack: a malformed one would crash openMap()/hints mid-hunt.
      const errs = validatePack(bundle.pack);
      if (errs.length) {
        console.error("Rejected content pack:", errs);
        alert("This kit's content failed validation - using the built-in game. Tell your organizer.");
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
    state.arrivedGps = {}; arrivalFired = {}; lastRouteKey = ""; lastCardSig = ""; lastListSig = "";
    state.startedAt = Date.now();
    state.kitId = startingKit;
  } else {
    state.startedAt = state.startedAt || Date.now();
  }
  save(); show("screen-scare");
  startTimer();
  focusFirst();
  playSound("assets/audio/hoot.ogg");
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
  // Show transition narrative
  showTransition();
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
      // Static literal only - no untrusted data interpolated here.
      if (el) el.textContent = "Map unavailable - use the stop list below.";
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
  const next = nextUnsolved();
  updateHUD();
  if (!next) { stopTracking(); return show("screen-finale"), finale(); }
  if (map && !mapBroken) map.setView([next.lat, next.lng], 17);
  startTracking();
  lastCardSig = ""; lastListSig = ""; // force a fresh card for the new stop
  if (mapBroken) renderStopList(); else renderNextStop();
}

window.openStop = function (id) {
  currentStop = pack.stops.find(s => s.id === id);
  if (!currentStop) return;
  hintLevel = 0; $("hint-text").textContent = ""; $("feedback").textContent = "";
  $("puzzle-title").textContent = `Stop ${currentStop.id}: ${currentStop.name}`;
  if (state.arrivedGps && state.arrivedGps[currentStop.id]) {
    const chip = document.createElement("span");
    chip.className = "verified-chip";
    chip.textContent = " \uD83D\uDCCD on-site";
    $("puzzle-title").appendChild(chip);
  }
  const sa = $("stop-art");
  if (sa) {
    if (currentStop.art) { sa.onerror = function(){ sa.onerror = null; sa.src = "assets/" + currentStop.art; };
      sa.src = artFor(currentStop);
      sa.alt = RELIC_ALT[currentStop.id] || ("Art for " + currentStop.name);
      sa.style.display = ""; }
    else { sa.removeAttribute("src"); sa.style.display = "none"; }
  }
  $("puzzle-story").textContent = variant(currentStop, "story");
  const ws = $("wisp-says");
  if (ws) {
    if (currentStop.wisp) { ws.textContent = "\u201C" + currentStop.wisp + "\u201D - Wisp"; ws.style.display = ""; }
    else { ws.textContent = ""; ws.style.display = "none"; }
  }
  $("puzzle-question").textContent = variant(currentStop, "puzzle").q;
  $("puzzle-answer").value = ""; $("unlock-code").value = "";
  // A QR that carried this stop's sign code pre-fills the unlock field -
  // never another stop's code. (m19)
  if (deepSignCode && deepSignCode.toUpperCase() === String(currentStop.code).toUpperCase())
    $("unlock-code").value = deepSignCode;
  show("screen-puzzle");
};

function solved() {
  if (!(state.stopHints[currentStop.id] > 0)) state.cleanSolves++;
  // Dedupe: re-scanning a sign must not inflate the leaderboard payload.
  // The portal scores base = solved.length * POINTS_PER_STOP.
  if (!state.solved.includes(currentStop.id)) {
    state.solved.push(currentStop.id);
  }
  if (state.stopTimes[currentStop.id]) state.stopTimes[currentStop.id].end = Date.now();
  save();
  $("feedback").textContent = "🏮 " + (currentStop.lit || "Lantern lit!");
  setTimeout(openMap, 900);
  syncProgress(); // fire-and-forget leaderboard sync when backend present
}

$("btn-answer").addEventListener("click", () => {
  const p = variant(currentStop, "puzzle");
  const norm = s => String(s).toLowerCase().replace(/['"\-\u2019]/g, "").replace(/[^a-z0-9]/g, "");
  const got = norm($("puzzle-answer").value);
  if (got === norm(p.a)) solved();
  else { state.stopAttempts[currentStop.id] = (state.stopAttempts[currentStop.id] || 0) + 1; save(); $("feedback").textContent = "Not quite - try a hint, Keeper!"; }
});

$("btn-unlock").addEventListener("click", () => {
  if ($("unlock-code").value.trim().toUpperCase() === String(currentStop.code).toUpperCase()) { state.arrivedVia[currentStop.id] = state.arrivedVia[currentStop.id] || "qr"; solved(); }
  else $("feedback").textContent = "That code isn't from this stop's sign.";
});

$("btn-gps").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(pos => {
    const acc = pos.coords.accuracy || 999;
    if (acc > 50) {
      $("feedback").textContent = `GPS accuracy is poor (±${Math.round(acc)}m) - move to open sky or use the sign code.`;
      return;
    }
    const plat = pos.coords.latitude, plng = pos.coords.longitude;
    const d = haversine(plat, plng, currentStop.lat, currentStop.lng);
    const radius = currentStop.radius || 30;
    updatePlayerMarker(plat, plng, acc);
    if (d <= radius) {
      state.arrivedGps = state.arrivedGps || {};
      state.arrivedGps[currentStop.id] = true; save();
      $("feedback").textContent = "📍 You're here - verified on-site! Now solve the puzzle above.";
    }
    else {
      const b = bearing(plat, plng, currentStop.lat, currentStop.lng);
      $("feedback").textContent = `Still ${Math.round(d)}m away to the ${compassDir(b)} - keep hunting!`;
    }
  }, () => $("feedback").textContent = "GPS unavailable - use the sign code instead.", { timeout: 10000, enableHighAccuracy: true });
});

$("btn-hint").addEventListener("click", () => {
  if (state.hintsUsed >= HINT_BUDGET) {
    $("hint-text").textContent = "The hint jar is empty! Ask your organizer - a Lab Assistant can grant a rescue hint.";
    return;
  }
  if (hintLevel < 3) {
    $("hint-text").textContent = currentStop.hints[hintLevel]; hintLevel++;
    state.hintsUsed++;
    state.stopHints[currentStop.id] = (state.stopHints[currentStop.id] || 0) + 1;
    save(); updateHUD();
  } else {
    $("hint-text").textContent = "That's all 3 hints for this stop - trust your team!";
  }
});

/* ---------- audio: play sound effects ---------- */
let audioCtx = null;
function playSound(url) {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  fetch(url)
    .then(r => r.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(audioBuf => {
      const src = audioCtx.createBufferSource();
      src.buffer = audioBuf;
      src.connect(audioCtx.destination);
      src.start();
    })
    .catch(() => {});
}

/* ---------- share: native share or clipboard fallback ---------- */
function shareTeam() {
  const text = `I'm a Lantern Keeper in Wisp's Lost Lanterns! Join the hunt!`;
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: "Wisp's Lost Lanterns", text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text + " " + url).then(() => {
      $("feedback").textContent = "Link copied! Share it with your team.";
    });
  }
}

/* ---------- timer: elapsed time display ---------- */
let timerInterval = null;
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const el = $("hunt-clock");
    if (!el || !state.startedAt) return;
    const secs = Math.floor((Date.now() - state.startedAt) / 1000);
    const m = Math.floor(secs / 60), s = secs % 60;
    el.textContent = `⏱ ${m}:${String(s).padStart(2, "0")}`;
  }, 1000);
}
function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

/* ---------- PWA install prompt ---------- */
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const btn = $("btn-install");
  if (btn) btn.style.display = "inline-block";
});
function installPWA() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(() => { deferredInstallPrompt = null; });
  }
}

/* ---------- focus management ---------- */
function focusFirst() {
  const first = document.querySelector("input, button");
  if (first) first.focus();
}

/* ---------- story transitions ---------- */
function showTransition() {
  const box = $("next-stop");
  if (!box) return;
  const transition = document.createElement("div");
  transition.className = "story-transition";
  const mode = GlobalStory.getCurrentMode();
  const lang = (typeof I18n !== "undefined") ? I18n.current : "en";
  const storyContent = pack.story_content || {};
  const content = storyContent[lang] || storyContent["en"] || {};
  const transitions = content.transitions || GlobalStory.transitions[mode] || GlobalStory.transitions.halloween;
  const idx = Math.min(state.solved.length, transitions.length - 1);
  transition.textContent = transitions[idx];
  box.appendChild(transition);
  setTimeout(() => transition.remove(), 4000);
}

/* ---------- story mode selector ---------- */
function renderStoryModeSelector() {
  const container = $("story-mode-selector");
  if (!container) return;
  const modes = GlobalStory.modes;
  const current = GlobalStory.getCurrentMode();
  container.innerHTML = "";
  Object.values(modes).forEach(mode => {
    const btn = document.createElement("button");
    btn.className = "mode-btn" + (mode.id === current ? " active" : "");
    btn.innerHTML = `${mode.icon} ${mode.name}`;
    btn.addEventListener("click", () => {
      GlobalStory.currentMode = mode.id;
      GlobalStory.applyCulturalAdaptation();
      renderStoryModeSelector();
      GlobalStory.renderStoryElements();
    });
    container.appendChild(btn);
  });
}

/* ---------- leaderboard scoring ----------
   Lower is better. Weights: completion >> clean solves >> hints >> time >> wrong guesses.
   Matches backend sort intent (finished, hints) with richer local signals. */
function teamScore(r) {
  if (!r.finished && (r.solvedCount || 6) < 6) return 1e9 + (r.hintsUsed * 100);
  return (r.hintsUsed * 1000) - ((r.cleanSolves || 0) * 150) + (r.mins || 0) + ((r.totalAttempts || 0) * 10) - ((r.verified || 0) * 5);
}
function teamTitle(r, stops) {
  const titles = [];
  if (r.hintsUsed === 0) titles.push("🌟 Purist");
  if ((r.cleanSolves || 0) === stops) titles.push("🎯 Flawless");
  if ((r.verified || 0) === stops) titles.push("📍 True Explorer");
  return titles.join(" ");
}

function finale() {
  stopTracking();
  const mins = state.startedAt ? Math.round((Date.now() - state.startedAt) / 60000) : 0;
  const verified = pack.stops.filter(s => state.arrivedGps && state.arrivedGps[s.id]).length;
  const totalAttempts = Object.values(state.stopAttempts || {}).reduce((a, b) => a + b, 0);

  // Save this run to local history for team comparisons
  const run = {
    team: state.team, mins, hintsUsed: state.hintsUsed,
    cleanSolves: state.cleanSolves || 0, verified, totalAttempts,
    scare: state.scare, date: new Date().toISOString().slice(0, 10),
    ts: Date.now()
  };
  let history = [];
  try { history = JSON.parse(localStorage.getItem("pumpkin-roll-history") || "[]"); } catch {}
  // Don't duplicate: skip if same team finished within last 5 min
  const dup = history.find(h => h.team === run.team && (run.ts - h.ts) < 300000);
  if (!dup) { history.push(run); localStorage.setItem("pumpkin-roll-history", JSON.stringify(history.slice(-50))); }

  // Rank this run among all runs (fewer hints = better, then more clean solves, then faster)
  // (scoring via teamScore)
  const ranked = [...history].sort((a, b) => teamScore(a) - teamScore(b));
  const rank = ranked.findIndex(r => r.ts === run.ts) + 1;

  // Best records
  const bestTime = Math.min(...history.map(r => r.mins));
  const bestClean = Math.max(...history.map(r => r.cleanSolves));
  const fewestHints = Math.min(...history.map(r => r.hintsUsed));

  let compare = "";
  if (history.length > 1) {
    const ord = rank === 1 ? "1st" : rank === 2 ? "2nd" : rank === 3 ? "3rd" : rank + "th";
    compare = `\n🏆 ${ord} of ${history.length} teams on this device`;
    const records = [];
    if (run.mins === bestTime && history.length > 1) records.push("fastest time");
    if (run.cleanSolves === bestClean && run.cleanSolves > 0) records.push("most clean solves");
    if (run.hintsUsed === fewestHints) records.push("fewest hints");
    if (records.length) compare += ` · New record: ${records.join(", ")}!`;
  } else {
    compare = "\n🎉 First team on this device - you set the bar!";
  }

  $("finale-stats").textContent =
    `${state.team} · ${pack.stops.length} lanterns · ${mins} minutes · ${state.hintsUsed} hints used · ★ ${state.cleanSolves}/${pack.stops.length} clean solves · 📍 ${verified}/${pack.stops.length} verified on-site · 🎯 ${totalAttempts} wrong guesses${compare}`;

  // Render leaderboard table (top 10)
  const lb = $("leaderboard"), lbl = $("leaderboard-list");
  if (lb && lbl && history.length > 0) {
    lb.style.display = "block";
    const medals = ["🥇", "🥈", "🥉"];
    lbl.innerHTML = ranked.slice(0, 10).map((r, i) => {
      const medal = medals[i] || `${i + 1}.`;
      const title = teamTitle(r, pack.stops.length);
      const hl = r.ts === run.ts ? ' style="font-weight:700;background:#fff3cd;border-radius:8px;padding:2px 6px"' : "";
      return `<div${hl}>${medal} ${esc(r.team)} - ${r.mins}m · ${r.hintsUsed} hints · ★${r.cleanSolves}/6 ${title}</div>`;
    }).join("");
  }
  syncProgress(true);
  stopTimer();
  // Show share and install buttons
  const shareBtn = $("btn-share-finale");
  if (shareBtn) shareBtn.style.display = "inline-block";
  if (deferredInstallPrompt) {
    const installBtn = $("btn-install");
    if (installBtn) installBtn.style.display = "inline-block";
  }
  focusFirst();
}
window.addEventListener("pagehide", stopTracking);
$("btn-restart").addEventListener("click", () => {
  // Preserve mode: forcing ?demo=1 on restart would strand a live team in the
  // offline pack and drop their kit binding.
  const keep = new URLSearchParams(location.search);
  keep.delete("stop");   // clear the QR deep-link so the new run starts clean
  keep.delete("code");   // and the sign code, so it is not pre-filled next run (m3)
  const q = keep.toString();
  localStorage.removeItem("pumpkin-roll-state");
  location.href = location.pathname + (q ? "?" + q : "");
});

// Share button
$("btn-share-finale").addEventListener("click", shareTeam);

// Install PWA button
$("btn-install").addEventListener("click", installPWA);

// Keyboard navigation: Enter to submit, Escape to go back
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.tagName === "INPUT") {
    const btn = e.target.parentElement.querySelector("button");
    if (btn) btn.click();
  }
  if (e.key === "Escape") {
    const active = document.querySelector(".screen.active");
    if (active && active.id === "screen-puzzle") openMap();
  }
});

// Touch feedback: haptic on mobile
document.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && navigator.vibrate) {
    navigator.vibrate(10);
  }
}, { passive: true });

// Offline detection
window.addEventListener("offline", () => {
  const el = $("offline-banner");
  if (el) el.style.display = "block";
});
window.addEventListener("online", () => {
  const el = $("offline-banner");
  if (el) el.style.display = "none";
});

// Image lazy loading
document.querySelectorAll("img").forEach(img => {
  if (!img.src && img.dataset.src) {
    img.src = img.dataset.src;
  }
});

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
        hintsUsed: state.hintsUsed, scare: state.scare, finished: done,
        cleanSolves: state.cleanSolves, stopAttempts: state.stopAttempts,
        stopTimes: state.stopTimes, arrivedVia: state.arrivedVia }) });
  } catch { /* offline is fine - progress also lives in localStorage */ }
}
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
document.body.dataset.scare = state.scare;

// Load game pack and initialize
loadGamePack().then(() => {
  if (typeof renderStoryModeSelector === "function") renderStoryModeSelector();
});
