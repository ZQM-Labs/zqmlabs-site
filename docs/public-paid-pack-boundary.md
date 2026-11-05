# Public pack distribution boundary

The public site repository must not contain paid-tier JSON packs, organizer
answer keys, exact puzzle solutions, or access codes. On 2026-11-02, four
tier-named files under `static/packs/` were found to contain
`stops[].puzzle.*.a`, `stops[].fallback.a`, and `stops[].code`.
No values are reproduced here.

This review branch removes those four files from the current public source
tree and adds a CI check that fails if files are reintroduced under
`static/packs` or generated into `public/packs`. It does not rewrite
Git history, revoke cached public artifacts, or modify any production site.

## Coordinated deployment

The private production build pins this repository at an immutable commit. The
release workflow change that stops copying `static/packs` into the public
build landed as [ZQM-Computing/zqm-labs#214](https://github.com/ZQM-Computing/zqm-labs/pull/214)
(merged 2026-11-05; its deploy removed the packs from the live site). Merging
this PR and bumping the site pin pulls the cleaned source into production.

## Release gates

- Verify the browser demo and site navigation without public tier-pack JSONs.
- Verify private entitlement-gated Stripe fulfillment and customer delivery.
- Review any public Git history, previously published Pages artifacts, and
  cache exposure separately; deleting the current files is not retroactive.
- Require exact-head CI, review, and explicit production approval.
