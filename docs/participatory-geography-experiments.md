# Participatory geography: discovery and consent boundaries

**Status:** future-format research; no multiplayer, photo-map recap, bingo,
livestream hunt, or territory product is approved or deployed.

Owner: **ZQM Labs** for games, not ZQM Computing's spatial-data analysis
cookbooks. Keep existing Wisp's Lost Lanterns (six-stop field quest) and the
isolated [Daily Geo Mystery](daily-geo-mystery-experiment.md) prototype intact.

## Specific experimental formats

| Format | First low-cost hypothesis | Safety and readiness gates |
| --- | --- | --- |
| Friend-versus-friend daily challenge | Share one UTC day and spoiler-free score; no account or live session needed | A copy of a challenge is not authoritative anti-cheat; don't claim multiplayer or leaderboard support |
| Illustration-based observation bingo | Use original synthetic scenes and mark visible objects on a 3x3 card | Review image copyrights, accessibility alternatives, age appropriateness and moderated content; don't scrape Street View |
| Personal photo-map recap | Optional, local-only processing of photos owned by the participant | Explicit consent; strip EXIF and sensitive points; **never** auto-upload camera rolls or publish home/work routes |
| QR/GPS authored quest editions | Explore community-created six-stop stories within the current validator | Venue consent, route accessibility, fallback clues, child safety, playtests, payment/fulfillment gates as appropriate |
| Scheduled clue reveal | Fictional/synthetic clue reveal during a hosted game | No live public participant coordinates, cash-hunt pressure, dangerous races, trespass or prize promises |
| Territory game concept | Compare fair progression hypotheses without pay-to-win assumptions | Requires separate security/privacy research, anti-stalking controls and moderation before location persistence |

The [GeoHunt browser experience](https://geohunt.gg/) demonstrates a
low-friction multiplayer bingo concept with invitation codes and group voting.
It does not prove how many users would play a ZQM version, and its underlying
Street View imagery is not an asset ZQM can automatically reuse.

In public social content, do not assert that celebrity livestream prize
figures, specific third-party conversion rates, MapRaiders monetization or
"Mapped" apps' detailed features have been independently validated.
Market research and product claims must remain separate.

## Recommended next prototype

Start with an **original illustrated 3x3 observation bingo**, not a Street
View clone. A player should be able to finish in under two minutes on a
mobile browser with no sign-in or GPS permission, using only assets ZQM owns
or is licensed to redistribute. A text-based alternative must support
players who cannot identify details in the illustration.

Prototype acceptance:

1. Nine editorially reviewed objects, deterministic board identity and
   answer validation; original source artwork and credits.
2. Keyboard and screen-reader support, visible focus, mobile layout,
   reduced-motion and low-bandwidth testing.
3. No unconsented telemetry, location history, camera-roll ingestion,
   identifiers or public scoreboard.
4. Optional score sharing includes a date/challenge identifier but no
   coordinates, personal details or unrevealed puzzle solutions.
5. A versioned playtest and release record before describing it as playable.
   Do not modify the current quest-pack SPEC v1 to support short puzzles.

## Distinct technical companion

[ZQM Computing's content evidence register](https://github.com/ZQM-Computing/geospatial-cookbooks/blob/main/docs/shareable-content-experiments.md)
documents the related GeoAI benchmark and GIS format-performance work. This
cross-link is conceptual only, not a runtime, authentication, data-sharing,
or production deployment dependency.
