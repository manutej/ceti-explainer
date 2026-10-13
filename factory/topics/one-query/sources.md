# one-query · sources, verification and grades

Lane run 2026-10-10. Grades: A = primary table or page, figure returned consistently by more than one extraction (or read
directly); B = reputable secondary, or a primary figure seen once, or an assumption stated in the film; C = ambiguous or
conflicting, off stage. Method column: READ = page opened with WebFetch; SEARCH = WebSearch (extended) extraction only
(the host's egress resolves cloud.google.com but not iea.org, cso.ie, ember-energy.org, carbonbrief.org,
eta-publications.lbl.gov, powering-intelligence.epri.com, iea.blob.core.windows.net).

## Sources
| tag | author, title, year | where | method |
|---|---|---|---|
| S1 | Google, "Measuring the environmental impact of delivering AI at Google Scale" / blog "Measuring the environmental impact of AI inference", Aug 2025 | https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference | READ |
| S2 | IEA, Energy and AI (World Energy Outlook Special Report), "Energy demand from AI", Apr 2025 | https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai ; PDF https://iea.blob.core.windows.net/assets/de9dea13-b07d-42c5-a398-d1b3ae17d866/EnergyandAI.pdf | SEARCH (executive summary and 4 secondary extractions agree) |
| S3 | IEA, Electricity 2026 (executive summary, demand) and Global Energy Review 2026, Apr 2026 | https://www.iea.org/reports/electricity-2026/executive-summary ; https://www.iea.org/reports/electricity-2026/demand | SEARCH (IEA page text via search; Fortune, OilPrice, MarketScale agree) |
| S4 | Shehabi et al., 2024 United States Data Center Energy Usage Report, Lawrence Berkeley National Laboratory, Dec 2024 | https://eta-publications.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report | SEARCH (CRS, DOE, Berkeley Lab pages agree) |
| S5 | Central Statistics Office Ireland, Data Centres Metered Electricity Consumption 2025, 7 Jul 2026 | https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/keyfindings/ | SEARCH (RTE, Irish Times, DCD, LSE agree) |
| S6 | Ember, "Grids for data centres: ambitious grid planning can win Europe's AI race", Jun 2025 | https://ember-energy.org/latest-insights/grids-for-data-centres-ambitious-grid-planning-can-win-europes-ai-race/grids-for-data-centres/ | SEARCH |
| S7 | EPRI, Powering Intelligence: updated U.S. data center scenarios, Feb 2026 | https://powering-intelligence.epri.com/load-growth.html | SEARCH |
| S8 | Epoch AI, "How much energy does ChatGPT use?", 2025 (0.3 Wh estimate; Altman 0.34 Wh) | https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use | not re-read; B; off stage |

## Claim-by-claim (value | grade | source | note; ids as in claims.json)
| id | value | grade | source | note |
|---|---|---|---|---|
| gemWh | 0.24 Wh | A | S1 READ | median Gemini Apps text prompt, May 2025 data, comprehensive method (idle capacity, host CPU/RAM, overhead included) |
| gemChipWh | 0.10 Wh | A | S1 READ | active TPU/GPU only; Google: "optimistic scenario at best" |
| gemG, gemMl | 0.03 gCO2e, 0.26 mL | A | S1 READ | fleet-average 2024 carbon intensity and WUE; off stage |
| gemX | 33x energy (44x carbon) fall in 12 months | A | S1 READ | Google own measurement, May 2024 to May 2025; optional |
| tvS | under nine seconds of TV | A | S1 READ | Google own comparison; cross-check of the microwave anchor (0.24 Wh / 9 s is about 96 W) |
| S1 caveat | "have not been verified by an independent third party"; point-in-time, not indicative of all prompts | | S1 READ | the basis of the one on-stage honest line |
| worldTwh, worldPct | 415 TWh, about 1.5 % of world electricity, 2024 | A | S2 SEARCH | all data centres; IEA notes most governments publish no data-centre statistics |
| usPctDc, cnPctDc, euPctDc | 45 %, 25 %, 15 % of world data-centre electricity, 2024 | A | S2 SEARCH | shares published; TWh (187, 104, 62) are our product |
| world2030 | about 945 TWh (just under 3 %) | A | S2 SEARCH | projection; off stage |
| siteMW | 100 MW | B | S2 SEARCH | IEA: hyperscale AI-focused site "100 MW or more", about 100,000 households of annual electricity at full load; conventional 10-25 MW |
| usGrowthPct | about half of US demand growth, 2025 | A | S3 SEARCH | "around half"; IEA expects the share to hold to 2030; US demand +2.1 % in 2025 (B) |
| (not used) | 17 % of global demand growth | C | S3 via Fortune | ambiguous: other outlets read 17 % as the 2025 growth rate of data-centre use |
| usTwh23, usPct23 | 176 TWh, 4.4 % of US electricity, 2023 | A | S4 SEARCH | excludes crypto; 2028 range 325-580 TWh (6.7-12 %) is a projection |
| epri2030lo/hi | 9 % / 17 % of US electricity in 2030 | B | S7 SEARCH | scenarios, off stage; Virginia over 25 % today (B) not used |
| ieGwh, iePct | 7,663 GWh, 23 % of metered electricity, 2025 | A | S5 SEARCH | 22 % in 2024, 5 % in 2015; CSO identifies data centres by operator names, industry reports and high-use customers |
| nlPct, dePct, ukPct, frPct | 7, 4, 4, 2 % of national demand, 2024 | B | S6 SEARCH | modelled; NL conflicts with the Dutch statistics office (4.6 %); Ember Ireland is 19 % vs CSO 22 % (2024), so Ireland uses CSO only |
| microW, bulbW, promptsDay, siteMW at full load | 1,000 W; 60 W; 10; 100 MW x 24 h | def | input | stated assumptions, printed as "a 1,000 W microwave", "ask 10 a day", etc. |

## Derived anchors (formula, result), recomputed with node over claims.json
- microwave seconds = 0.24 Wh x 3600 / 1000 W = 0.864 s (shown 0.86 s); bulb seconds = 0.24 x 3600 / 60 W = 14.4 s (shown 14 s); bulb-minutes = 0.24.
- ten prompts = 2.4 Wh = 8.64 s of microwave; a year of them = 876 Wh (off stage).
- 100,000 queries = 100,000 x 0.24 / 1000 = 24 kWh.
- 100 MW x 24 h = 2.4 GWh = 100,000 tiles of 24 kWh = 10^10 query-equivalents (energy-equivalent only; sites do far more than text prompts).
- region TWh: 45 % x 415 = 186.75 (187), 25 % = 103.75 (104), 15 % = 62.25 (62), rest 62; sum 415.
- grid denominators (back-solved, not printed): world 415 / 0.015 = 27,667 TWh; US 176 / 0.044 = 4,000 TWh; Ireland 7,663 / 0.23 = 33,317 GWh.
- Ireland / world = 23 / 1.5 = 15.3 (shown "15 times"); Ireland / US = 5.2 (off stage).
- Ireland = 7,663 GWh / 876 GWh per 100 MW site-year = 8.75, about nine such sites at full load (off stage).

## Conflicts logged
1. Ireland 2024 consumption: research file 6,969 GWh; search extractions 6,973 GWh (both about +10 % to 7,663). Not used.
2. Ireland 2024 share: CSO 22 %, Ember 19 %, IEA via Carbon Brief about 21 %: Ireland uses CSO 2025 (23 %) only.
3. Europe 2024: IEA 15 % of 415 = 62 TWh vs Ember 96 TWh (3 % of regional demand); different regional definitions; the region mesa is not drawn, the 62 TWh is the IEA group only.
4. US: IEA-derived 187 TWh (2024) vs LBNL 176 TWh (2023): year, not method; captions carry the years.
5. Research file said US data centres 4.4 % in 2023, "11.8 % by 2030"; the EPRI/LBNL projection set differs (EPRI 9-17 % 2030). Projections stay off stage.

## Before ship (open these pages; each should show the line quoted)
S2: "data centres accounted for around 1.5% of the world's electricity consumption in 2024, or 415 TWh"; "the United States ... 45%, ... China ... 25% ... Europe ... 15%".
S3: "around half of the total increase [in US demand]" driven by data centres.
S4: 176 TWh and 4.4 % for 2023. S5: 7,663 GWh and 23 %.
S6: Ireland 19, Netherlands 7, Germany 4, UK 4, France 2 (2024).
