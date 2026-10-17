"use strict";
/* lantern-player - game state machine.
   Content comes from a pack (exported by lantern-content). DEMO_PACK below is
   the embedded example so ?demo=1 plays with no backend. Missing scare-level
   variants fall back to Cozy text. */

const API_BASE =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:8090" : "https://api.zqmlabs.com";

// Load game-specific content pack
const GAME_PACK_URL = "snowflake-secret.json";
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
  DEMO_PACK = {
    title: "The Snowflake Secret",
    kit: "SNOWFLAKE-SECRET",
    stops: [
      { id: 1, name: "The Frozen Fountain", lat: 29.0258, lng: -80.9270, code: "SNOW-1", art: "stop-1-fountain.webp",
        story: { cozy: "The Frozen Fountain is where the Snowflake Secret begins! The fountain has frozen into a beautiful ice sculpture, and something sparkles inside the ice." },
        puzzle: { cozy: { q: "How many frozen streams of water are coming out of the fountain?", a: "3", type: "number" } },
        fallback: { q: "What is frozen water called?", a: "ice" },
        hints: ["Look at the fountain carefully.", "Count the frozen streams.", "Ranger assist: there are 3 frozen streams."] },
      { id: 2, name: "The Snowy Bridge", lat: 29.0262, lng: -80.9264, code: "SNOW-2", art: "stop-2-bridge.webp",
        story: { cozy: "The Snowy Bridge is covered in a thin layer of frost. It is beautiful! A snowflake ornament must be hidden somewhere along the railing." },
        puzzle: { cozy: { q: "How many lamp posts are along the bridge?", a: "4", type: "number" } },
        fallback: { q: "What covers bridges in winter?", a: "snow" },
        hints: ["Look along the bridge railing.", "Count the lamp posts.", "Ranger assist: there are 4 lamp posts."] },
      { id: 3, name: "The Ice Skating Rink", lat: 29.0266, lng: -80.9258, code: "SNOW-3", art: "stop-3-rink.webp",
        story: { cozy: "The Ice Skating Rink is frozen and ready! A snowflake ornament must be hidden in the rink decorations." },
        puzzle: { cozy: { q: "How many flags are around the rink?", a: "5", type: "number" } },
        fallback: { q: "What do people wear on ice?", a: "skates" },
        hints: ["Look around the rink.", "Count the flags.", "Ranger assist: there are 5 flags."] },
      { id: 4, name: "The Hot Cocoa Stand", lat: 29.0270, lng: -80.9252, code: "SNOW-4", art: "stop-4-cocoa.webp",
        story: { cozy: "The Hot Cocoa Stand is the perfect warm stop on a cold day! A snowflake ornament must be hidden in the decorations." },
        puzzle: { cozy: { q: "How many marshmallows are pictured on the sign?", a: "6", type: "number" } },
        fallback: { q: "What do you put in hot cocoa?", a: "marshmallows" },
        hints: ["Look at the sign.", "Count the marshmallows.", "Ranger assist: there are 6 marshmallows."] },
      { id: 5, name: "The Winter Garden", lat: 29.0274, lng: -80.9246, code: "SNOW-5", art: "stop-5-garden.webp",
        story: { cozy: "The Winter Garden is beautiful even in the cold! Snow-covered trees and frosty flowers. A snowflake ornament must be hidden among the plants." },
        puzzle: { cozy: { q: "How many snow-covered trees are in the garden?", a: "4", type: "number" } },
        fallback: { q: "What covers trees in winter?", a: "snow" },
        hints: ["Look among the plants.", "Count the trees.", "Ranger assist: there are 4 trees."] },
      { id: 6, name: "The Snowflake Finale", lat: 29.0278, lng: -80.9240, code: "SNOW-6", art: "stop-6-finale.webp",
        story: { cozy: "The Snowflake Finale! All the snowflake ornaments are found, and the Winter Festival can begin! You did it, Snowflake Seekers!" },
        puzzle: { cozy: { q: "How many snowflakes did you find in total?", a: "6", type: "number" } },
        fallback: { q: "What falls from the sky in winter?", a: "snow" },
        hints: ["Count all the snowflakes you found.", "Think about the whole journey.", "Ranger assist: you found 6 snowflakes."] }
    ]
  };
}


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
  try { history = JSON.parse(localStorage.getItem("snowflake-secret-history") || "[]"); } catch {}
  // Don't duplicate: skip if same team finished within last 5 min
  const dup = history.find(h => h.team === run.team && (run.ts - h.ts) < 300000);
  if (!dup) { history.push(run); localStorage.setItem("snowflake-secret-history", JSON.stringify(history.slice(-50))); }

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
  localStorage.removeItem("snowflake-secret-state");
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
