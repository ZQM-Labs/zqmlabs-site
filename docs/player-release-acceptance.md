<!-- markdownlint-disable MD013 -->

# Player Release Acceptance Record

## Current automated acceptance coverage

The canonical player is maintained in [ZQM-Labs/lantern-player](https://github.com/ZQM-Labs/lantern-player). Its CI release suite currently runs in Chromium on a Linux GitHub Actions runner.

| Area | Automated check | Passing threshold |
| --- | --- | --- |
| Startup | Launch the player 20 consecutive times and watch for uncaught JavaScript errors | 20/20 launches render the start screen |
| Pack validation | Exercise null packs, null/array stop entries, invalid field types, malformed hints, non-finite/out-of-range coordinates, and duplicate IDs | Invalid packs return validation errors without throwing; valid fixture passes |
| Service-worker update | Seed the previous `lantern-v5` cache, activate `lantern-v6`, and inspect the cache set | Previous player cache removed; unrelated origin cache preserved |
| Offline shell and assets | Verify the shell, all advertised locale files, game artwork, audio, and PWA icon are cached | All required precache entries present |
| Offline gameplay | Reload offline five times, then complete ten six-stop quests in the same Chromium session | All ten runs reach the finale without uncaught JavaScript errors |
| Artwork | Load every stop's artwork and finale artwork offline | All tested images load successfully |
| Progress recovery | Reload after completing a stop and resume | Completed stop remains saved and the next stop is available |
| Storage failure | Start with corrupt saved JSON and with `localStorage` unavailable | Player remains usable; storage failures do not crash startup |
| Language behavior | Compare advertised locale JSON key sets and switch language during a quest | Locale files have matching, non-empty interface keys; progress is preserved; UI discloses incomplete localization |

The canonical CI run for the current acceptance suite is linked from the player repository's pull request and Actions history.

## Language-support limitation

The player includes English, Spanish, French, German, and Portuguese translation files. That does **not** mean the interface or every quest pack is fully localized. The player now labels language selection as experimental and explicitly warns that many interface labels and some story, puzzle, and hint content may remain in English or the pack's original language. Do not market any of these locales as fully supported until translation strings are wired to all required interface elements and measured coverage checks pass.

## Scope limitations — still required before broad compatibility claims

The automated suite runs in **Chromium on Linux**. It does not establish compatibility across Firefox, Safari, iOS, Android, physical devices, or every supported browser version. It also does not verify live GPS behavior, a physical PWA installation on a user device, or production API-dependent flows.

Before a broad release claim, run and record a manual matrix covering:

- At least one current desktop Chromium browser.
- Firefox and Safari where they are part of the supported browser set.
- At least one iOS device and one Android device if mobile installation is advertised.
- A fresh installation, an upgrade from the previous release, and offline relaunch after each.
- A full quest, missing artwork, malformed content, language switching, and saved-progress recovery.
- GPS granted, denied, and unavailable states where location is supported.

A scenario without recorded evidence is untested, not passed.

## Site deployment

The website build fetches the canonical player from the `main` branch and verifies that each path declared in the service-worker precache exists in the generated site bundle. A player merge alone does not immediately rebuild the separate website repository; a site build/deployment must complete before the public page is considered updated.
