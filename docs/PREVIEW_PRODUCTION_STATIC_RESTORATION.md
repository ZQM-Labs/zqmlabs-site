# Preview-only restoration plan for missing production static media

**Authority:** Owner-approved preservation of existing production offers and routes, with exact-commit parity evidence required. This is not a production publication authorization. The 40-item removal set was extracted from an offline ZIP comparison of the archived production artifact and the hardened dual-brand preview artifact.

## Immutable source evidence

- Publisher GitHub Actions run `42429271354`, public artifact `13595969610`.
- Production ZIP SHA-256: `254de65c0769a9f133f6c6257f33a03fc880c14176f57380eb5722b79dfdd393`.
- Publisher source pin: `cda2cab92973826f0c6ce316806ef82aa5270143`.
- Exactly **39 missing static files** eligible for controlled restoration: 36 image/video files, two app icons, and `js/countdown.js`. Explicit paths are in [production-static-restore-allowlist.txt](production-static-restore-allowlist.txt).
- **Excluded:** `release-manifest.json` is the 40th missing file. It is a publisher-generated release attestation and **must not** be copied into a plain Hugo preview or invented with new metadata.

## Operator-controlled offline procedure

With the exact archived ZIP supplied to the operator and a freshly built preview `public/` directory:

```sh
python3 scripts/preview/restore_production_static.py \
  --baseline-zip /secure/artifacts/zqmlabs-site-public.zip \
  --public-dir public

# Inspect the JSON plan and verify it contains only 39 allowlisted paths.
# An explicit action is required to copy those existing bytes into the
# local candidate output, never to production:
python3 scripts/preview/restore_production_static.py \
  --baseline-zip /secure/artifacts/zqmlabs-site-public.zip \
  --public-dir public \
  --apply
```

Dry-run is the default. The tool refuses an incorrect ZIP SHA-256, missing ZIP members, path traversal, duplicate member names, symlinks in the destination or divergent existing files. With `--apply`, it verifies per-file SHA-256 and only creates missing files. It does not overwrite, fetch, deploy, create credentials or update GitHub.

## What this does and does not establish

This is a proposed **controlled preview restoration**, not an automatic overlay in site CI. GitHub Actions currently lacks a reviewed, authenticated method to obtain this separate repository's production ZIP; do not add cross-repository tokens, unpinned downloads or an unverified archive URL.

Local restoration of 39 paths should reduce missing-file count from 40 to **one** (the publisher-generated release manifest). It does not reduce 46 changed content files or resolve whether 70 new files may publish, nor does it validate route HTML equivalence, license transfer, long-cache behavior or actual Cloudflare responses. Re-run the comparator from publisher [PR #255](https://github.com/ZQM-Computing/zqm-labs/pull/255) on the complete restored candidate before proposing an approved-delta manifest.

**Security boundary:** production source images must be licensed/authorized for migration, and no added player assets or media may enter the public release without source ownership and security review. Never bypass separate release manifest generation and publisher artifact provenance.
