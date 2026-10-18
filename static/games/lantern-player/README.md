# lantern-player

The player web app (PWA) for ZQM Labs location games. Vanilla HTML/CSS/JS —
no build step, no framework. Leaflet is the only library (vendor it locally
before launch; CDN is fine for dev).

## Run

```bash
python3 -m http.server 8080
# Demo (embedded Wisp content, no backend): http://localhost:8080/?demo=1
# Live (needs lantern-backend):             http://localhost:8080/?kit=<kitId>&code=<accessCode>
```

## How a game flows

1. Team opens the kit link (or scans the start QR) → enters access code.
2. **Scare meter**: Cozy Glow 🎃 / Spooky 👻 / After Dark 🦇 — sets story skin,
   puzzle set, palette, and audio. Organizer default comes from the kit.
3. Six checkpoints. Each unlocks by scanning the QR sign (the code is in the
   URL), typing the code, or passing a GPS geofence check — every checkpoint
   also has an observation-answer fallback (accessibility + dead-battery rule).
4. Each puzzle has exactly **3 hints**: nudge → bigger hint → answer ("Ranger
   assist"). Progress persists in localStorage; with a backend, progress also
   syncs for leaderboards (office tier).
5. Finale: completion screen, team photo prompt, badge, partner/finale code.

## Content packs

The player consumes a JSON content pack exported from `lantern-content`.
`DEMO_PACK` in `app.js` is the embedded example: every stop has `story` and
`puzzle` per scare level; missing variants fall back to Cozy text. Never
hardcode new story text here — author it in `lantern-content`.

## Files

- `index.html` — shell, screens (start / scare / map / puzzle / finale)
- `app.js` — game state machine, unlock logic, hint tiers, demo pack
- `styles.css` — base layout + scare themes via `body[data-scare]`
- `sw.js` — service worker: cache-first app shell (offline play)
- `manifest.webmanifest` — installable PWA metadata
