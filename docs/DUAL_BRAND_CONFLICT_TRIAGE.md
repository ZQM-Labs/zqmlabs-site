# Dual-brand migration conflict triage and security hold

**Status:** Draft PR #93 review evidence, not implementation or release authorization. Date: 2026-11-07. This document summarizes the checked-in `DUAL_BRAND_FILE_INVENTORY.csv` as inspected; values may change as its branch evolves.

## Current source-file inventory

The 319 entries in the CSV span three distinct sources: canonical Labs Hugo files, the publisher's nested website files, and the unpublished Computing commercial scaffold. They are **source-file entries**, not generated public URLs or deployed artifact counts.

| Blob relation | Entries |
| --- | ---: |
| Different content at corresponding paths | 66 |
| Identical Git blob | 31 |
| Canonical site only | 156 |
| Publisher site only | 50 |
| Computing preview only | 16 |
| **Total** | **319** |

| Review classification | Entries |
| --- | ---: |
| Unresolved | 272 |
| Review required | 47 |

These flags are not defects by themselves: player bundles and static assets require bulk provenance classification rather than 272 separate manual product decisions. No unresolved entry may be silently approved or included in production.

## Risk-first conflict resolution batches

1. **Publisher and route authority:** `hugo.toml`, `content/_index.md`, `layouts/**`, `static/_redirects`, `static/_headers`, and menus. Resolve which existing public routes and metadata must survive, including intentionally different brand design.
2. **Player safety:** `static/games/hunt-for-wisps/play/**` must be classified as independently pinned player-generated output rather than canonical or vendor copies. Account for legacy aliases and service-worker scope. Verify exact player SHA and offline/browser regression evidence.
3. **Existing pages:** eight canonical overlay pages, five reviewed guides, and publisher-only contact/pricing/privacy/terms/organizer/location content. Require a route census before moving any of these.
4. **Unreleased and sensitive content:** `static/experiments/**`, proposed game pages, `static/packs/**`, paid answers, private credentials, debug artifacts, and unapproved drafts. Excluded by default, with negative tests; no `noindex`-only safety claim.
5. **Computing scaffold:** 16 unpublished preview files remain reference-only until contents are reviewed, recast as draft service pages and approved independently. Do not change the `example.invalid` or preview `noindex` safeguards.
6. **Remaining inert assets:** group images, fonts, CSS, docs and templates by actual transitive inclusion and license/attribution; avoid over-expanding the production publication list.

## Required columns for resolution evidence

For each resolved source-file entry capture: immutable source repository/ref, path, responsible brand, published route or consuming asset, proposed output owner, actual old/new Git blob or artifact hash, release classification, reason for inclusion/exclusion, relevant tests, reviewer and decision date. Record `unknown` explicitly rather than guessing. A source blob SHA alone is not evidence that a file was served live.

## Current CI safety hold

At the inspected PR #93 exact head, the Gitleaks job returned **failure** after scanning 311 commits, reporting **one finding** without showing its source in the visible job log. Other checks passed or were appropriately skipped. This is a **blocking unresolved security finding**, not evidence that these documentation changes contain a credential and not grounds for an automatic suppression.

Required response before changing the status:

1. Obtain restricted scanner evidence of the finding's rule, file, commit and fingerprint without disclosing any secret in the public PR.
2. Determine whether it occurs in the PR-only commit range or predates the PR using the same scanner version/configuration on the base revision.
3. If real secret material is implicated, treat exposure/rotation and repository remediation as a separate authorized security process; do not paste the value into issues or logs.
4. If independently verified as a false positive, document the narrow source-backed reason and obtain required security approval before any scoped allowlist change.
5. Rerun exact-head checks; do not bypass Gitleaks or reclassify a failed run as passed.

## Exit criteria for package A

Complete immutable-ref source conflict classifications, live-origin URL and redirect baseline, full source-to-publisher artifact mapping, exact-head security disposition, and a signed-off release/nonrelease boundary. Until then this branch is for **draft architecture review only**.
