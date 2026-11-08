# Preview production-parity review — page semantics and route ownership

**Scope:** archived publisher ZIP `42429271354` vs preview CI artifact `42451901330`, inspected offline. These are comparisons of generated HTML/CSS/assets, **not** live CDN responses. Later source fixes must be reverified against a newly built ZIP.

## Confirmed route ownership defect and correction

The production artifact contains only `games/lantern-player/index.html` at the legacy Lantern Player route. It is an **informational Hugo page** titled “Lantern Player — browser demo.” The prior preview instead copied a complete standalone player runtime into `games/lantern-player/`, replacing that information page and adding dozens of unreviewed public assets. This also introduced a self-referencing iframe in the canonical single-game layout.

Preview remediation:
- Move `static/games/lantern-player/` outside the Hugo static source **inside the preview CI job only**, allowing Hugo to emit the information page; source material remains untouched for separate review.
- Remove the self-referencing iframe and point the legacy page's play action to the existing direct Wisp browser demo, `/games/hunt-for-wisps/play/?demo=1`.
- Fail CI if `games/lantern-player/README.md`, `tools/`, `app.js`, `sw.js`, `assets/`, or `vendor/` appears in output.
- Keep the unrelated `static/experiments/daily-geo-mystery/` research prototype out of the preview build until separately approved.

The resulting **first corrected** preview ZIP, prior to the experimental exclusion, had **151 files** against 180 baseline: **11 added, 40 removed, 46 changed and 94 identical**. The old URL remained available, but the 46 differing public outputs still need specific approval. Removing the two experimental files is expected to leave nine additions, subject to verification of a fresh ZIP.

## Semantic comparison of the 46 changed outputs

A read-only HTML parser compared rendered titles, meta descriptions, canonicals, H1 text, displayed currency figures and link targets. This found:

- `pricing/index.html`: archived page title **“Scavenger Hunt Pricing: Flat Fees from $49 — ZQM Labs”**, preview title **“Pricing — flat fees, no surprises · ZQM Labs”**. The old visible currency-string set includes `$25`; the preview's does not. This is **not** proof of a removed offer, but a claim/content delta that must be reviewed against the verified existing pricing.
- `404.html`: archived 404 shows no visible monetary amounts; preview 404 includes `$49`, `$199`, `$349`, and `$499`. **Unapproved pricing content expanded** to the error page. The 404 headline and navigation also differ.
- `games/index.html`: page title, meta description, H1, body copy and links differ, despite the same URL. Explicit demo CTA and playable/in-development distinctions still require rendered browser review.
- `games/lantern-player/index.html`: the former preview had a different canonical, a different title and executable player scripts; addressed as above but no byte-identical parity claim is made for the newer Hugo landing page.
- `index.html`: newly designed dual-brand home intentionally changes title, description, H1, brand links and historical price visibility; requires approved homepage delta and sales/legal review.
- Legal, guide, FAQ, geography and game-detail pages: most retain canonical URL, title and description, but change H1 rendering and navigation. Changed markup is **not** assumed safe solely because metadata is stable.

## Release disposition

**Do not approve a blanket 46-file change exception.** For pricing, games, legal/terms/privacy, metadata, headers, contact promises, email links and accessibility, require a per-route semantic comparison and explicitly approved differences. For `404.html`, either preserve existing recovery content or approve any displayed pricing independently. The publisher-generated `release-manifest.json` remains outside the Hugo preview; its provenance must be produced and verified by the authorized publisher.

All changes above are preview-only, under draft Site #95. No merge, credential changes, production artifact replacement or release approval is implied.
