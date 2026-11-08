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

## Gitleaks pass-to-fail revision window (observed)

The full-history scanner runs on every PR head; therefore a failing run cannot identify the triggering file by itself. The GitHub Actions history does establish these boundaries:

| Revision | Result | Workflow run |
| --- | --- | --- |
| `53a90f905264e86474f5e03ea5c82df0996eff82` | **Passed** | `42430117648` |
| `4760d7293908c4f9afd9201af6b2ab18dec56cbe` | **Failed, 1 finding** | `42431128392` |
| `464e8db98bc6e3acf4dcf4f6154b0e4d5a3cda8c` | **Failed, 1 finding** | `42431311789` |

The first observed failure follows additions to the branch's source comparison and conflict documents; that is a **triage hypothesis**, not a finding attribution. Compare the commits in this bounded interval and obtain **redacted fingerprint/rule/path metadata** under restricted access. Avoid copying potential secrets into the PR or changing the repository-wide scanner settings. Do not remove source inventory evidence solely to force a green check until the detection mechanism has been established.

## Cross-repository Gitleaks comparison — evidence, not waiver

A redacted finding from **publisher** draft #252 has now been retrieved. It is a `generic-api-key` detection on line 13 of `docs/IMMUTABLE_PIN_SOURCE_COMPARISON.csv`, at commit `a7fefc8b6ef0313c1ba0b25b2897ebaabae962fa`. That CSV row holds `content/games/snowflake-secret.md` directly adjacent to 40-character Git blob hashes. The redacted match begins with `secret.md`; the hashes are **Git object identifiers** rather than published access tokens.

The **Labs Site** `docs/DUAL_BRAND_FILE_INVENTORY.csv` has the **same filename and adjacent SHA fields on line 13**. This is a concrete candidate explanation for its single generic-secret scan failure, but **the Labs scan did not publish its redacted fingerprint or rule metadata**; the specific finding is therefore still **unattributed**. Do not infer a separate compromised credential or suppress the scan based solely on the parallel CSV pattern.

Because both workflows scan full commit histories, editing the current CSV does not clear a historical finding. A designated security reviewer must verify each exact rule/path/commit/fingerprint and authorize any surgical one-fingerprint disposition. Never disable scanning, wildcard-allow all CSVs, or rewrite history as an expedient workaround. No change in publishing authorization follows from a false-positive analysis.
