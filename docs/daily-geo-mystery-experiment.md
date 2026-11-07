# Daily Geo Mystery — isolated Labs experiment

**Status: source-only prototype, not a public product or a verified deployment.**

Source: [daily-geo-mystery](../static/experiments/daily-geo-mystery/).
For local preview, serve the static/ directory over HTTP, then open
`http://localhost:8080/experiments/daily-geo-mystery/` .
Do not open as a local file URL; the page uses an ES module.

## Rationale and scope

A single daily geography challenge produces a repeatable, shareable activity.
This is deliberately NOT a six-stop Wisp's Lost Lanterns quest. No quest-player
state, paid edition, location permission, private analytics, checkout, or
six-stop quest-authoring validator is imported or changed.

Current implementation: twelve original text-only geography clues, UTC date
rotation, keyboard-accessible multiple-choice controls, one-attempt lockout, local-only last-attempt persistence when storage is available,
accurate 1/1 or 0/1 spoiler-free scores, a copy button with manual
selection fallback, and a self-contained 1080-pixel SVG scorecard export. No accounts or browser location access are required.

Not implemented: satellite imagery, maps, offline install, streaks,
server-side score persistence, automated daily editorial pipeline, real-time multiplayer,
leaderboards, registration, and usage analytics. Sample questions repeat
every 12 days and must not be marketed as a production daily game.

A single browser-storage record tracks only the most recent day and correct/incorrect
result. A new UTC day replaces it. Storage denial, another device, private windows,
or cleared local storage permit retries; this is an informal single-player activity,
**not** an authoritative competitive anti-cheat mechanism. The interface asks
users to refresh if they leave the tab open past UTC midnight.

## Validation

From the repository root:

    node --test tests/daily-geo-mystery.test.mjs

Manually verify mobile layout, keyboard focus, screen-reader announcements,
answer lockout, clipboard fallback, and SVG saving/sharing on supported devices.
The scorecard contains only the date, outcome and prototype label; it does not
include answers, user location, customer identifiers, third-party media, or a
link to an unverified public deployment. CI tests deterministic logic, not
end-to-end device behavior. The [dedicated Labs playtest acceptance review](https://github.com/ZQM-Labs/playtests/pull/33)
documents required manual device, accessibility, UTC-boundary, privacy, and
SVG-sharing cases. Its blank result template is **not** evidence of completed
testing. Only dated, commit-specific reports may satisfy the manual release gate.

The site has a separately pinned-source production
assembly: changes here do NOT themselves publish to zqmlabs.com.
There is intentionally no navigation or game-directory link.

The [participatory geography research brief](participatory-geography-experiments.md)
tracks observation bingo, friend challenges, photo-map privacy and live-event
safety as **separate future concepts**; they are not part of this prototype.

## Review gates before public release

1. Replace fixtures with reviewed, versioned content and evidence of factual
   correctness; test UTC boundary and sensible repetition frequency.
2. Keep the daily-challenge format separate from the six-stop GPS-based
   specification owned by quest-authoring.
3. For future imagery, require redistribution permissions, provenance, and
   equivalent text alternatives before serving assets.
4. Validate optional streaks, social sharing, abuse handling, and privacy,
   especially where minors may participate.
5. Confirm the exact deployed route, test on supported devices, and link from
   public navigation only after the feature passes the normal release gate.

## Metrics and reuse

When consent and a privacy review permit measurement, define distinct
denominators for visits, starts, completions, score-copy attempts, and
returning players. Clipboard copies are not verified social shares. Do not
collect GPS histories or physical locations for this experience.

ZQM Labs owns gameplay experiments and player-facing explanations. ZQM
Computing independently owns reproducible analytical visualization
demonstrations and professional-facing offers. Do not blur their brands.
