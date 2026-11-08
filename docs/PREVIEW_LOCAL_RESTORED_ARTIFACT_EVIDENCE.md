# Real offline restoration and parity check — 2026-11-08

This is a **read-only/local candidate experiment**, not an instruction to merge, deploy, publish paid game assets or alter production. It uses the existing production and preview GitHub Actions archives.

## Immutable inputs

| Input | Exact evidence |
| --- | --- |
| Production publisher archive | Run `42429271354`; artifact `13595969610` |
| Production ZIP SHA-256 | `254de65c0769a9f133f6c6257f33a03fc880c14176f57380eb5722b79dfdd393` |
| Preview site CI | Run `42459106659`; artifact `13608957038` |
| Preview head whose checked build was inspected | `840733cbce2e104090c850ec564f1e4ecf879439` |
| Preview ZIP SHA-256 | `5d8f289dc777f967da8d4362a2b3add8f87185b3ce0b56018e915cc056e581ee` |

## Completed offline action

The preview archive contained **149** files. The pinned production archive contained **180** files.

- Compared both ZIP member-name sets; the preview lacked **40** production entries.
- Selected **exactly 39** frozen, non-manifest static media/script/icon entries. Did not restore any other file, overwrite existing preview files or modify GitHub.
- Extracted the checked preview into a new local staging directory and copied the 39 archived production bytes into missing paths only; verified every restored file's SHA-256 against the production ZIP member.
- Recomputed the entire resulting candidate inventory and sitemap.

| Metric | Local restored candidate |
| --- | ---: |
| Files | **188** |
| Missing vs production | **1** (`release-manifest.json`, publisher-owned) |
| New vs production | **9** |
| Byte-changed vs production | **46** |
| Byte-identical to production | **133** |
| Production sitemap routes preserved | **40 / 40** |
| Approved-direction new sitemap routes | **6** |

The nine extra output paths are exactly six new section/service/inquiry HTML routes, two section feeds (`computing/index.xml`, `labs/index.xml`), and `img/dr-z-lab-banner.svg`. The 46 changed files **remain unapproved differences**. The local candidate is **not** a fully provenance-attested publisher artifact because it intentionally has no generated release manifest.

## Release hold and boundaries

The source ZIP and staging copy were processed offline; no secret, Stripe, Cloudflare or production API access was required for restoration. This process does not prove static content licensing, deployed CDN headers, device/offline behavior, accessibility, live payment, kit entitlement, email delivery or actual rollback. **Do not fabricate or copy a release manifest.**

Required next acceptance evidence:

1. Human review of **all 46 changed outputs**, especially pricing, contact, privacy/terms, games directory, OG/SEO metadata, redirects and canonical links.
2. An approved-delta inventory for **all nine added outputs** and individual dispositions of changed files.
3. Independent approval and integration of scoped security findings, with exact-commit Gitleaks and supply-chain retesting.
4. Publisher-owned release manifest generation and proof of identical pins/headers.
5. Cold/warm/offline browser checks, real fulfillment evidence, customer support/refund handling and rollback drill.

See [preview static restoration](PREVIEW_PRODUCTION_STATIC_RESTORATION.md) and [semantic route parity review](PREVIEW_SEMANTIC_ROUTE_PARITY_REVIEW.md). The owner has approved **preview-only implementation**, not migration release or production deployment.
