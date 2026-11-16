# Buyer-intent content implementation briefs

Baseline: November 15, 2026 ET. Status: **PLANNED source changes**, not deployed page copy or measured ranking improvement.

This is the content-side implementation contract for two distinct brands on zqmlabs.com. Use the existing [organic intent map](organic-discovery-keyword-map.md) for Labs routing. Public copy belongs in this canonical repository; assembled layouts, selected-file imports, source pins and production publishing remain with the separately documented publisher.

## Linked implementation work

| Scope | Issue | Proposed future branch | Dependencies |
| --- | --- | --- | --- |
| SEO P0: reconcile Wisp kit, venue and customization claims across buyer pages | [ZQM-Labs/zqmlabs-site#129](https://github.com/ZQM-Labs/zqmlabs-site/issues/129) | `seo/wisp-kit-claim-consistency` | Source/offer review |
| SEO P1: implement buyer-intent Computing service and inquiry briefs | [ZQM-Labs/zqmlabs-site#130](https://github.com/ZQM-Labs/zqmlabs-site/issues/130) | `seo/computing-buyer-paths` | [ZQM-Computing/zqm-labs#321](https://github.com/ZQM-Computing/zqm-labs/issues/321) |
| AEO P1: review and accurately attribute the three Computing resource guides | [ZQM-Labs/zqmlabs-site#131](https://github.com/ZQM-Labs/zqmlabs-site/issues/131) | `seo/gis-resource-review-attribution` | Source/offer review |
| SEO P1: expose inspectable synthetic parcel-Atlas and spatial-ETL QA proof | [ZQM-Labs/zqmlabs-site#132](https://github.com/ZQM-Labs/zqmlabs-site/issues/132) | `seo/inspectable-gis-proof` | [ZQM-Labs/zqmlabs-site#130](https://github.com/ZQM-Labs/zqmlabs-site/issues/130) |
| SEO P2: strengthen accurate public proof and relevant referral links | [ZQM-Labs/zqmlabs-site#133](https://github.com/ZQM-Labs/zqmlabs-site/issues/133) | `seo/relevant-proof-references` | [ZQM-Labs/zqmlabs-site#132](https://github.com/ZQM-Labs/zqmlabs-site/issues/132) |
| SEO P2: publish evidence-led supporting content and review 90-day outcomes | [ZQM-Labs/zqmlabs-site#134](https://github.com/ZQM-Labs/zqmlabs-site/issues/134) | `seo/evidence-led-content-iteration` | [ZQM-Computing/zqm-labs#321](https://github.com/ZQM-Computing/zqm-labs/issues/321), [ZQM-Labs/zqmlabs-site#130](https://github.com/ZQM-Labs/zqmlabs-site/issues/130), [ZQM-Labs/zqmlabs-site#129](https://github.com/ZQM-Labs/zqmlabs-site/issues/129) |

These are suggested implementation branches, not branches created as empty placeholders. Search/outcome measurement, real-bot/firewall evidence, the AI benchmark, and mobile/assembled-release evidence are coordinated by the publisher. A source merge does not prove a production release or engine indexing.

## Six page briefs

Titles and headings below are hypotheses to review, not instructions to replace a ranking winner without evidence. Preserve the existing route and professional/product boundaries.

| Page / intent owner                                                                                             | Proposed title and heading to test                                                                                        | Required content and proof                                                                                                                                                            | Primary next step                                                                            |
|-----------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [/computing/](https://zqmlabs.com/computing/)                                                                   | Title: GIS Consulting & Mapping Services \| ZQM Computing; H1: GIS consulting for environmental and spatial-data projects | Explain the three current service families; show a sample map and QA output; link the sourced professional profile; state remote delivery and confirmed project boundaries.           | Discuss a GIS project; choose map production, automation or Web GIS.                         |
| [/computing/services/environmental-screening/](https://zqmlabs.com/computing/services/environmental-screening/) | Title: Environmental GIS Map Production \| ZQM Computing; H1: Environmental GIS maps for consulting teams                 | Open with permit figures, parcel Atlas series and editable handoffs; link the three guides; show a synthetic exhibit preview, source register and acceptance checklist.               | Scope a GIS figure set using the existing inquiry anchor.                                    |
| [/computing/services/gis-automation/](https://zqmlabs.com/computing/services/gis-automation/)                   | Title: GIS Workflow Automation & Spatial ETL \| ZQM Computing; H1: Automate one recurring GIS workflow                    | Show input, accepted output, rejected records, count reconciliation and rerun behavior; state diagnostic versus implementation scope and handoff ownership.                           | Scope a workflow audit with input formats, volume, frequency and desired output.             |
| [/computing/services/web-gis/](https://zqmlabs.com/computing/services/web-gis/)                                 | Title: Web GIS & PostGIS Development \| ZQM Computing; H1: Web maps, PostGIS integration and spatial APIs                 | Describe a bounded browser-map/API project; distinguish prototype from production; list access controls, deployment responsibilities, delivery evidence and maintenance scope.        | Send users, dataset rights, existing application and target environment.                     |
| [/computing/inquiry/](https://zqmlabs.com/computing/inquiry/)                                                   | Keep its project-brief intent; improve clarity after measurement.                                                         | Provide copyable brief fields and service-specific anchors; make email readable in a normal browser; test the delivered contact path; preserve sensitive-data guidance.               | Send a short, non-sensitive brief. Count actual receipt and qualification separately.        |
| [/tiers/](https://zqmlabs.com/tiers/)                                                                           | Title: Ready-Made Scavenger Hunt Kits \| ZQM Labs; H1: Wisp scavenger hunt kits for families and teams                    | State the current Wisp story/theme, exact included materials, setup needs, event-window terms and supported venue arrangements; preserve confirmed prices and current product status. | Try the demo, then choose the relevant kit; contact for arrangements requiring confirmation. |

## Computing intent ownership

| Intent cluster | Primary route | Supporting evidence | Next step |
| --- | --- | --- | --- |
| Broad GIS consulting/mapping | `/computing/` | Three scoped services; sourced professional profile; inspectable outputs | Choose a service-specific project brief |
| Environmental GIS production/subcontracting | `/computing/services/environmental-screening/` | Permit-map checklist, parcel Atlas example, source register and QA manifest | Scope a figure set for client professional review |
| Workflow automation / spatial ETL | `/computing/services/gis-automation/` | Inputs, reason-coded rejects, reconciled output and replay/recovery | Scope one audit or pilot |
| Web GIS / PostGIS / spatial APIs | `/computing/services/web-gis/` | Users, data rights, bounded architecture and operating handoff | Send users, datasets and target environment |

## Buyer questions and first supporting cost brief

Treat these roles as audience hypotheses. Confirm the buyer's actual requirements and current product/service scope; an employer's size is not a supported event capacity.

| Buyer role | First question | Existing content owner | Evidence and next step |
| --- | --- | --- | --- |
| HR / office organizer | What will this finished quest cost and what must our organizer prepare? | `/pricing/` → Office Team/Event on `/tiers/` | Current theme, materials, organizer work, event/venue terms and sample → relevant kit or scoped inquiry. |
| Environmental consultant / project manager | Can you prepare this defined figure set in a usable format for our review? | Environmental GIS service → inquiry | Required inputs, figure list, supported formats/title block, source register, QA/revisions and agreed timing → written scope/estimate. |
| Community organizer / household | Is the current story suitable, and what arrangements are required? | Community/Family sections on tiers and existing guides | Actual suitability/setup/event conditions → demo and appropriate current offer. |
| Property buyer / local developer | What does desktop GIS support establish and what requires further review? | Environmental GIS service and relevant existing guides | Dataset coverage, dates, uncertainty, exclusions and professional-review needs → bounded project brief. |

First supporting-content candidate for [#134](https://github.com/ZQM-Labs/zqmlabs-site/issues/134): improve the existing `/pricing/` answer for “how much does a corporate or office scavenger hunt cost?” after claim and measurement review. Keep `/tiers/` authoritative for current Wisp offers; the existing `/compare/scavenger-hunt-apps/` page owns vendor/format tradeoffs. Do not create another master cost page or Office landing page without distinct evidence.

Cost-brief acceptance:

- Explain the actual Wisp story/theme, included materials, organizer preparation, device requirements, agreed event window/venue and support.
- Preserve the configured tiers: Family Night $49, Community $199, Office Team $349 and Office Event $499. Proposed prices, add-ons and capacity ranges require an actual offer decision.
- For each competitor figure, cite a dated primary source and its currency, billing period, participant/device unit, preparation and service scope. Omit unverified amounts; avoid universal event-price floors, “cheapest”, “zero logistics” or guaranteed savings.
- State that browser participation is also available from competitors where supported; compare the finished experience and work required accurately.
- Treat cost/kit views and meaningful sample completion as intermediate activity; fulfilled retained orders are separate outcomes.
- Keep new cost and report-figure phrases unmeasured until data is available. Separate Phase I/II pages require distinct needs and proof; improve the current environmental GIS owner first.

## Proof and expert review acceptance

- Keep all synthetic Atlas and workflow outputs explicitly synthetic and versioned; never present them as client results.
- Show a readable output preview and matching download/source/manifest where useful. Proposed `/computing/work-examples/parcel-atlas/` and `/computing/work-examples/spatial-etl-qa/` routes are conditional on adding useful inspection beyond existing sections.
- After actual expert review, add the real reviewer and genuine review date to the three GIS resource guides; link the existing sourced profile only when accurate.
- Retain source/version context, explicit unknown coverage, professional-review boundaries and a relevant inquiry path.
- For environmental figure work, document complete client inputs, supported output/native formats, title-block feasibility, QA/revision acceptance and timing agreed after scoping. A competitor's advertised turnaround is not a ZQM delivery promise.
- Preserve accurate historical credits and credentials; do not invent platform experience, measured savings, customers or endorsement.

## Labs offer and conversion acceptance

- Reconcile tiers, pricing, alternative comparisons, team-building/hosting guides and location pages against the currently supported Wisp kit.
- Distinguish generic authored story content, organizer setup, venue coordination and separately scoped custom work.
- State the actual theme, included materials, supported event window and confirmed arrangements. Do not extend claims to unreleased games, onsite facilitation or worldwide event fulfillment.
- Correct Human Bingo's equipment requirement where the page claims zero equipment.
- Preserve verified prices and payment identities. A demo, checkout click or payment link is not proof of entitlement, delivered access or retained revenue.
- Start with clear Office Team/Event sections on tiers. Another landing page requires distinct buyer questions, proof and a measurement rationale.

## SEO and answer-engine acceptance

- Use one primary page per buyer-intent cluster. Improve existing useful pages before adding variants.
- Give direct factual answers, input/output requirements, exclusions, examples and clear next steps in readable HTML. FAQ markup is not a promised Google rich result or an AI-citation requirement.
- Keep Computing and Labs Organization identities distinct; ensure structured data represents the visible page.
- Validate canonical/index directives, title/description, sitemap, internal links and public-artifact boundaries with existing checks.
- Record the actual source revision, rendered preview and applicable tests. Verify publisher import before describing new source content as live.
- Compare qualified inquiries and fulfilled orders separately from impressions, demo starts and email/checkout clicks; retain unknown attribution honestly.
- Add no implicit tracking schedule, paid tool, crawler-rights change or external outreach from these briefs.

## Review order and evidence

1. Confirm current offer terms and measurement definitions.
2. Improve the Computing hub, map-production service and relevant inquiry path; bring the existing office cost answer into this first content wave after offer/measurement review.
3. Add accurate guide review details and inspectable proof, then automation/Web GIS refinements.
4. Revisit supporting content from real buyer questions and comparable search data.

US national estimates from November 15, 2026: GIS consulting services 90 searches/month, GIS mapping services 140, QGIS consultant 10, and scavenger hunt kits 110. Exact environmental/subcontracting and many precise automation phrases have unknown measured demand. These are provider estimates, not current rankings or visits; overlapping variants are not summed.

## Primary references

- [Google: useful content and accurate authorship](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: AI search eligibility and existing SEO practices](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: spam policies, including doorway and scaled-content abuse](https://developers.google.com/search/docs/essentials/spam-policies)
