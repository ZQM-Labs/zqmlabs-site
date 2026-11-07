// Isolated, zero-backend prototype. Do not import quest-player state or analytics.
export const CHALLENGES = Object.freeze([
  { clue: "This city straddles the Bosporus, between the Black Sea and Sea of Marmara.", choices: ["Lisbon", "Istanbul", "Athens"], answer: "Istanbul" },
  { clue: "This vast salt flat lies on the Altiplano in southwestern Bolivia.", choices: ["Salar de Uyuni", "Bonneville Salt Flats", "Etosha Pan"], answer: "Salar de Uyuni" },
  { clue: "This island nation lies on the Mid-Atlantic Ridge and is known for geysers.", choices: ["Cyprus", "Iceland", "Madagascar"], answer: "Iceland" },
  { clue: "This desert in northern Chile is among the world's driest non-polar regions.", choices: ["Gobi", "Sahara", "Atacama"], answer: "Atacama" },
  { clue: "Table Mountain overlooks this South African coastal city.", choices: ["Durban", "Cape Town", "Maputo"], answer: "Cape Town" },
  { clue: "This inland sea, once fed by the Amu Darya and Syr Darya, has shrunk dramatically.", choices: ["Aral Sea", "Caspian Sea", "Dead Sea"], answer: "Aral Sea" },
  { clue: "The delta of this river spreads across southern Vietnam.", choices: ["Danube", "Mekong", "Niger"], answer: "Mekong" },
  { clue: "This mountain range forms much of the border between Spain and France.", choices: ["Alps", "Carpathians", "Pyrenees"], answer: "Pyrenees" },
  { clue: "This reef system stretches off the northeastern coast of Australia.", choices: ["Great Barrier Reef", "Mesoamerican Reef", "New Caledonia Barrier Reef"], answer: "Great Barrier Reef" },
  { clue: "This volcano stands close to Naples and is famous for the eruption of AD 79.", choices: ["Etna", "Vesuvius", "Stromboli"], answer: "Vesuvius" },
  { clue: "This landlocked African country contains the Okavango Delta.", choices: ["Botswana", "Gabon", "Lesotho"], answer: "Botswana" },
  { clue: "This strait separates Europe and Africa at the western entrance to the Mediterranean.", choices: ["Strait of Gibraltar", "Strait of Hormuz", "Bering Strait"], answer: "Strait of Gibraltar" }
]);

export function utcDayLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError("Expected a valid Date");
  return date.toISOString().slice(0, 10);
}

export function selectChallenge(date, challenges = CHALLENGES) {
  if (!Array.isArray(challenges) || !challenges.length) throw new TypeError("At least one challenge required");
  utcDayLabel(date);
  const day = Math.floor(date.getTime() / 86400000);
  return challenges[((day % challenges.length) + challenges.length) % challenges.length];
}

export function formatShareText(day, correct) {
  return "ZQM Labs · Daily Geo Mystery · " + day + " UTC\n" +
    (correct ? "🟩 1/1" : "⬜ 0/1") + "\n" +
    "Prototype · No GPS or sign-in";
}

// One record only; the next UTC day overwrites it. No tracking identifiers.
const ATTEMPT_KEY = "zqm-labs:daily-geo-mystery:attempt:v1";

export function readAttempt(storage, day) {
  try {
    if (!storage?.getItem) return null;
    const raw = storage.getItem(ATTEMPT_KEY);
    if (!raw) return null;
    const attempt = JSON.parse(raw);
    if (attempt?.version !== 1 || attempt.day !== day ||
        typeof attempt.correct !== "boolean") return null;
    return attempt.correct;
  } catch {
    return null; // malformed state or browser storage disabled
  }
}

export function writeAttempt(storage, day, correct) {
  try {
    if (!storage?.setItem || typeof correct !== "boolean") return false;
    storage.setItem(ATTEMPT_KEY, JSON.stringify({ version: 1, day, correct }));
    return true;
  } catch {
    return false; // private-mode or quota failure; the quiz still works
  }
}

export function scorecardSvg(day, correct) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || typeof correct !== "boolean") {
    throw new TypeError("Invalid scorecard input");
  }
  const score = correct ? "1 / 1" : "0 / 1";
  const status = correct ? "MYSTERY SOLVED" : "TRY ANOTHER DAY";
  const accent = correct ? "#62e5b5" : "#d1dbe8";
  // No external fonts, linked images, scripts, location data or answer spoilers.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-labelledby="card-title card-desc">
  <title id="card-title">ZQM Labs Daily Geo Mystery scorecard</title>
  <desc id="card-desc">Prototype score for ${day} UTC: ${score} correct</desc>
  <rect width="1080" height="1080" fill="#071a2e"/>
  <circle cx="980" cy="100" r="300" fill="#103a55"/>
  <circle cx="100" cy="1010" r="360" fill="#0c3a55"/>
  <rect x="74" y="74" width="932" height="932" rx="48" fill="none" stroke="#638ca5" stroke-width="3"/>
  <text x="128" y="190" font-family="system-ui,sans-serif" font-size="37" letter-spacing="6" fill="#b5d7e9">ZQM LABS / GEOGRAPHY</text>
  <text x="128" y="340" font-family="system-ui,sans-serif" font-weight="800" font-size="96" fill="#ffffff">DAILY GEO</text>
  <text x="128" y="447" font-family="system-ui,sans-serif" font-weight="800" font-size="96" fill="#ffffff">MYSTERY</text>
  <rect x="128" y="530" width="824" height="264" rx="32" fill="#153a55"/>
  <text x="164" y="625" font-family="system-ui,sans-serif" font-size="42" letter-spacing="3" fill="${accent}">${status}</text>
  <text x="164" y="739" font-family="system-ui,sans-serif" font-size="112" font-weight="800" fill="#ffffff">${score}</text>
  <text x="128" y="873" font-family="system-ui,sans-serif" font-size="39" fill="#d4e5f2">${day} UTC</text>
  <text x="128" y="944" font-family="system-ui,sans-serif" font-size="27" fill="#b5d7e9">PROTOTYPE · NO GPS · NO LOGIN</text>
</svg>`;
}

function start() {
  const dateLabel = document.getElementById("date");
  const clueLabel = document.getElementById("clue");
  const choices = document.getElementById("choices");
  const result = document.getElementById("result");
  const share = document.getElementById("share");
  const copy = document.getElementById("copy");
  const copyStatus = document.getElementById("copy-status");
  const download = document.getElementById("download");
  if (!dateLabel || !clueLabel || !choices || !result || !share || !copy || !copyStatus || !download) return;
  let storage = null;
  try { storage = window.localStorage; } catch { /* private mode */ }

  const date = new Date();
  const day = utcDayLabel(date);
  const challenge = selectChallenge(date);
  dateLabel.textContent = day + " (UTC)";
  clueLabel.textContent = challenge.clue;
  let answered = false;
  let lastCorrect = null;

  function reveal(correct, restored = false) {
    answered = true;
    lastCorrect = correct;
    for (const item of choices.querySelectorAll("button")) item.disabled = true;
    const explanation = correct ? "Correct. Mystery solved." :
      "Not this time. The answer was " + challenge.answer + ".";
    result.textContent = restored ? "Previous result for this UTC day: " + explanation : explanation;
    share.value = formatShareText(day, correct);
    share.hidden = false;
    copy.hidden = false;
    download.hidden = false;
  }

  for (const choice of challenge.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice;
    button.className = "choice";
    choices.appendChild(button);
    button.addEventListener("click", () => {
      if (answered) return;
      if (utcDayLabel(new Date()) !== day) {
        answered = true;
        for (const item of choices.querySelectorAll("button")) item.disabled = true;
        result.textContent = "A new UTC day has started. Reload to get today's challenge.";
        return;
      }
      const correct = choice === challenge.answer;
      writeAttempt(storage, day, correct);
      reveal(correct);
    });
  }

  const restored = readAttempt(storage, day);
  if (restored !== null) reveal(restored, true);

  download.addEventListener("click", () => {
    try {
      if (lastCorrect === null) return;
      const svg = scorecardSvg(day, lastCorrect);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "zqm-daily-geo-mystery-" + day + ".svg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      copyStatus.textContent = "Scorecard downloaded. Share the image to challenge a friend.";
    } catch {
      copyStatus.textContent = "Image download unavailable. Copy your text result instead.";
    }
  });

  copy.addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(share.value);
      copyStatus.textContent = "Score copied. Paste it into a message to challenge a friend.";
    } catch {
      share.focus();
      share.select();
      copyStatus.textContent = "Clipboard unavailable. Select and copy the score above.";
    }
  });
}

if (typeof document !== "undefined") start();
