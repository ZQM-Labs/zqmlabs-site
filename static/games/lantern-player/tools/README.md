# Player verification harnesses

These execute the **real** `app.js` and `sw.js` in a Node VM with a DOM/service-worker
shim, then invoke their actual event handlers. They are not greps — the files are
evaluated and observed at runtime.

## Why they exist

The player defects found on 2026-10-14 (see `docs/lantern/player-defect-register.md`
in `ZQM-Labs/zqm-wiki`) were invisible to static inspection and to the local dev
loop. Proving them required running the code.

## Files

| File | What it does |
|---|---|
| `verify-exec.js` | Loads an `app.js`, sets `location.search`, clicks the real buttons, reads `localStorage` |
| `verify-sw.js` | Loads a `sw.js`, dispatches synthetic fetch events, reports what `respondWith` returned |
| `verify-playthrough.js` | Drives a complete 6-stop run (start → scare → solve all → hints → finale) with Leaflet present |
| `verify-deeplink.js` | Drives the QR flows: clicks the scare card so `openStop` runs, then reports the access-code / unlock-code fields |
| `verify-proof.py` | Driver: stages `origin/main` vs working tree and prints a side-by-side verdict |
| `PROOF-OUTPUT.txt` | Recorded output of a passing run (node v22.23.1) |

## Usage

```bash
# Full side-by-side proof (origin/main vs working tree)
python lantern-player/tools/verify-proof.py

# Single file, arbitrary query string
node lantern-player/tools/verify-exec.js <app.js> <label> "?kit=DEMO&stop=3&code=LANTERN-3"
node lantern-player/tools/verify-sw.js  <sw.js>  <label>
node lantern-player/tools/verify-playthrough.js <app.js> <label> "?demo=1"
node lantern-player/tools/verify-deeplink.js    <app.js> "?kit=DEMO&stop=3&code=LANTERN-3"
```

`verify-proof.py` expects node at
`C:\Users\zqmco\AppData\Local\hermes\node\node.exe`. Adjust `NODE` at the top for
another host.

## What each harness proves

**`verify-exec.js`**
1. Whether QR params (`?kit`, `?stop`, `?code`) reach the UI
2. Whether unlocking the same stop twice duplicates it in `state.solved`
   (and therefore inflates the portal's `solved.length * POINTS_PER_STOP`)
3. Whether `openMap()` throws when Leaflet is absent (the live CSP state)

**`verify-sw.js`**
4. What the SW returns for a failed `app.js` fetch while offline
   (HTML shell = silent SyntaxError in the browser)
5. Whether a `POST` to the API is intercepted (Cache API rejects non-GET)
6. What the SW attempts to cache

## Expected results

| Check | origin/main | fixed |
|---|---|---|
| QR params | IGNORED | CONSUMED |
| duplicate solves | `[1,1,1]`, score 300 | `[1]`, score 100 |
| `openMap()` no Leaflet | `ReferenceError: L is not defined` | guarded, text fallback |
| SW failed `app.js` | serves `index.html` (HTML for JS) | rethrows |
| SW `POST` | intercepted | passed through |

## Expected results (playthrough / deeplink)

```
verify-playthrough.js  ->  RESULT  stops_lit=6/6  duplicates=false  completable=true

verify-deeplink.js "?kit=DEMO&stop=3&code=LANTERN-3"
  access-code  : ""            (a stop QR must NOT fill the access field)
  unlock-code  : "LANTERN-3"
  puzzle-title : "Stop 3: ..."

verify-deeplink.js "?kit=DEMO&ac=WISP-2026-DEMO"
  access-code  : "WISP-2026-DEMO"
  unlock-code  : ""
```

The shim must provide what the player touches: `L.divIcon`, `L.circleMarker`,
`L.circle`, `L.latLng`, element `childNodes`, and
`navigator.geolocation.watchPosition`. The player added live geolocation tracking
and custom map icons; a shim missing those throws inside `openMap()` and the run
aborts before reaching the assertions.

## Caveat

The shim implements only the DOM surface the player uses. It is faithful for the
code paths under test but is **not** a browser: it will not catch CSS, layout, or
real network behaviour. Treat it as an ad-hoc verifier, not a test suite.
