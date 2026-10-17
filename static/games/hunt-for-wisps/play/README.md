# lantern-player

<!-- ZQM-START -->

**ZQM Labs — Z's Quests & Mischief**

[ zqmlabs.com ](https://zqmlabs.com) · [GitHub](https://github.com/ZQM-Labs)

<!-- ZQM-END -->

The player web app (PWA) for ZQM Labs location games. It uses vanilla HTML,
CSS, and JavaScript with no build step or framework. Leaflet should be vendored
locally for offline use; a CDN is suitable only for development.

## Run

```bash
python3 -m http.server 8080
# Demo (embedded Wisp content, no backend): http://localhost:8080/?demo=1
# Live (requires a configured backend and kit): http://localhost:8080/?kit=<kitId>&ac=<accessCode>
```

## Game flow

1. Open the kit link or scan the start QR code.
2. Choose a Dial level: Cozy Glow, Spooky, After Dark, or Overdrive. This changes
   the story and puzzle content. Audio remains unavailable unless its assets
   and attribution have been verified.
3. Complete six checkpoints. A stop QR code or manually entered sign code can
   unlock a stop. GPS is optional arrival verification, not a required gate.
   Each checkpoint also provides an observation-answer fallback.
4. Each stop has three hints per Dial level: nudge, stronger hint, and answer.
   The shared hint budget is 18 across six stops. Progress persists in
   localStorage; configured backend integrations may also synchronize progress.
5. Finish the finale and view the completion screen.

## Content packs

The player consumes a JSON content pack exported from `lantern-content`.
The embedded `DEMO_PACK` supports `?demo=1` without a backend. Each stop must
provide complete story, puzzle, fallback, and hint content for all four Dial
levels. Live packs with missing required variants should be rejected rather than
silently falling back to Cozy content.

Do not hardcode new story or puzzle content in the player. Author it in
`lantern-content` and validate the pack against the player version used for
release.

## Release evidence

A working browser demo or a green CI run does not, by itself, establish that a
paid game is orderable or approved for field use. Before claiming release
readiness, record the exact player and content-pack versions, automated test
results, supported language scope, offline/update behavior, QR and GPS behavior,
accessibility and safety checks, field-playtest evidence, and separate
end-to-end checkout/payment/confirmation/fulfillment evidence. Keep unknown
states explicitly marked as unverified.

## Files

- `index.html` — application shell and screens.
- `app.js` — game state machine, unlock logic, hint tiers, and demo pack.
- `styles.css` — layout, themes, and accessibility preferences.
- `sw.js` — service worker and offline app-shell caching.
- `manifest.webmanifest` — installable PWA metadata.

<!-- ZQM-FOOTER-START -->

*Play more. Plan less.*

[ zqmlabs.com ](https://zqmlabs.com) · [ZQM Labs](https://github.com/ZQM-Labs) · [ZQM Computing](https://github.com/ZQM-Computing)

<!-- ZQM-FOOTER-END -->
