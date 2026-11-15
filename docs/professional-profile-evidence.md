# Professional profile and public résumé — evidence notes

Reviewed November 15, 2026. The public profile is client-facing; the portfolio retains source attribution. The comprehensive career record remains separate from the concise public résumé.

## Sources used

| Public statement | Evidence and attribution |
| --- | --- |
| Environmental-science/geography degree and career chronology | [Islamorada qualifications, page 14](https://www.islamorada.fl.us/DocumentCenter/View/2612/23-02-06-Lori-Lehr-Inc---RFP-22-15-Watershed-Management-Plan_) and owner-maintained career documents; overlapping university/industry dates are retained |
| GISP credential | [GISCI active registry](https://www.gisci.org/Already-a-GISP/GISP-Registry/pagesize/10/Country/us/GISP/active/Region/Florida?page=52), checked November 15, 2026; no certificate number is published |
| Monroe personal GIS/model/report credit | [Stetson University institutional account](https://www2.stetson.edu/today/2021/04/3-year-effort-by-stetson-professor-results-in-35-discount-in-flood-insurance-for-residents-of-monroe-county-florida/); shared county outcomes are not personal guarantees |
| Lake County | [Full report](https://www.researchgate.net/publication/373711829_Natural_Lands_Inventory_and_Planning_Strategies_Review_in_Support_of_Resilient_Green_Space_Conservation_in_Lake_County_Florida), technical Appendix A author page, rather than the master-report metadata |
| Osceola County | [Technical report](https://www.researchgate.net/publication/386540351_Conservation_Planning_for_Biodiversity_and_Flood_Resilience_in_Osceola_County_Florida), named coauthor; no claim of sole method ownership |
| Islamorada inventory | [Final report metadata](https://www.islamorada.fl.us/DocumentCenter/View/3549), critical-asset inventory originator/contact; large PDF may be unavailable to automated retrieval |
| Fort Lauderdale | [September 23, 2024 city minutes](https://fortlauderdale.legistar.com/View.ashx?GUID=1B943C35-3413-4F4B-93B0-04AFFA6298B7&ID=13645748&M=F), consultant participation and DEM answer |
| St. Lucie | [County webinar page](https://www.stlucieco.gov/departments-and-services/county-administration/innovation-resilience-and-performance/resilience-initiative/resilient-st-lucie-webinar-videos), named presenter; live server sometimes denies automated requests |
| Mitigation map/layers | [ArcGIS item](https://www.arcgis.com/home/item.html?id=60ee9a53a3ed486dab8a11f2ab38a70e), product and layer attribution |
| Company participation | Martin/Ocean Breeze map artifacts, Palm Beach County final consultant roster and Pensacola collaborator account are separately labeled in the portfolio |
| Volusia advisory appointment | [September 6, 2022 action list, item 17](https://www.volusia.org/core/fileparse.php/5903/urlt/09-06-2022-Action-List-ADA.pdf); two-year appointment, without an inferred current term |
| Environmental policy comments | [ENRAC tree comments](https://www.volusia.org/core/fileparse.php/7441/urlt/ENRAC_Tree_Ordinance_Comments_508.pdf), individually attributed input; adoption is not claimed |
| State-park planning | [June 2022 advisory record](https://floridadep.gov/sites/default/files/HontoonIslandStatePark_ARC_July2022.pdf), participation rather than plan authorship |
| Expert testimony — newly corroborated | [DEP OGC 22-2509 / DOAH 24-4282](https://floridadep.gov/sites/default/files/22-2509.pdf), attached recommended order paragraph 154, PDF pages 42–43. The order records expert acceptance and testimony; subsequent paragraphs reject the contested impact opinions. Public wording identifies the role and links the full decision without implying a favorable ruling. |
| Technical and fieldwork capabilities | Owner-maintained career record, public project credits and current repositories; no claimed measured savings or blanket client results |

## Claims and privacy controls

- Publish professional contact routes, general city/state, education and relevant career history. Exclude home addresses, personal telephone numbers, references, financial documents and private client material.
- Keep ZQM Computing and ZQM Labs distinct. Clearview is a former practice that closed in 2026.
- Do not add ArcGIS Enterprise experience. ArcGIS Pro/ArcMap and ArcPy are the supported descriptions.
- Exclude unsubstantiated revenue, headcount, permit-count, acreage, storage and speed/savings metrics from this public version.
- Do not imply that historical FWC, pesticide, FAA or other credentials are currently valid. The public résumé includes GISP and degree only.
- Preserve Alex Clark in printed historical report/conference author lists. They are a separate collection until the personal name cross-reference is explicitly reconciled.
- Procurement staffing or workload tables establish proposed roles or a historical workload snapshot, not a completed client engagement.
- No reproduction of client maps, report figures, signatures or agency logos is included. Portfolio entries link public originals.

## Rebuild and review

Run `python3 scripts/build-public-resume.py` with ReportLab installed. Review the exported PDF visually and verify two pages, text extraction and working links. The profile, portfolio and résumé must be copied by the publisher's explicit source overlay and represented in its release manifest before release. A passing local build is separate from deployed evidence.

## External link checking

The six exact URLs in `.lycheeignore` return anti-automation 403/999 responses to the CI checker. Source text was reviewed through the public document/search record; St. Lucie was corroborated from the county search index and prior evidence because direct automated access was denied. The rule does not accept 403 responses globally or exclude entire domains. All other URLs remain subject to the existing link gate.
