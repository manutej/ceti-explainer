# One query · film id `one-query` · brief

Wave AI-STORIES (factory/WAVE-AI-STORIES.md). Numbers: factory/research/AI-ECONOMICS-2026.md S4, each re-read in this
lane (grades in claims.json and sources.md). Only A and B numbers go on stage.

## Subject
`{kind: metric, name: "Energy of one AI query, against four denominators", source_material: Google 2025 inference
footprint paper; IEA Energy and AI 2025 and the IEA 2026 electricity reports; LBNL 2024; Irish CSO 2025; Ember 2025}`

## Audience
`{level: manager, room: "An operations or strategy meeting where one person says AI is an energy disaster and another says it is a rounding error"}`

## Format
feature-long, 153 s (150 s of material + the 3 s card), manager level, webgl, chrome none, material ink, brand ceti-boardwalk-dark.

## Belief
Two sentences said out loud before the film, by two different people: "AI uses far too much energy." and "AI uses almost no energy."
The film's claim is that both are told with true numbers and that neither is the picture: the picture depends on the denominator.

## The gap (two pictures, one sentence each)
- Belief picture: one number settles it (a chatbot query is a few drops of water and a few seconds of a microwave, or a data centre is a grid emergency).
- After the count: 0.24 Wh per median Gemini text prompt is a human-scale nothing (0.86 s of a 1,000 W microwave), yet the
  same sector is 1.5 % of world electricity, about half of 2025 US demand growth and 23 % of Ireland's metered electricity.
  Small per query, large per grid: "small" and "huge" are the same energy divided by different things.

## Fixture
`{name: "One median Gemini text prompt and the grids it adds up in", place: world / United States / Ireland, year: 2024-2025, numbers: gemWh, worldTwh, worldPct, iePct, usPct23, usGrowthPct}`

## Count (counts before ratios)
| # | unit | n | lands_at | where |
|---|---|---|---|---|
| 1 | one mark = one query (0.24 Wh) | 1 to 100,000 (10^0..10^5, scale-anchor ladder; at 10^5 one tile = 100,000 queries = 24 kWh) | gemWh (17.2 s); 100,000 at 51 s (tileKwh) | CASE |
| 2 | one mark = one tile of 100,000 queries; a 100 MW site's day = 100,000 tiles | 100,000 | siteDayTiles (60.2 s) | CASE/COUNT edge |
| 3 | one mark = one TWh of world data-centre electricity, 2024 | 415 (inked) in a grey grid of about 27,700 (backdrop, number not printed) | worldTwh (71.4 s) | COUNT |
| 4 | one mesa = one place's data-centre share of its own grid (7 places) | 7 | iePct, usPct23 | COUNT terrain |

Count[0].lands_at precedes every ratio; the first ratio is 1.5 % at 77.4 s. Counts 3 and 4 are second and third counts
after the first has landed (feature allowance).

## Mechanism (what THE COUNT draws and why the belief breaks)
One query is drawn as one mark with a constant-size ruler tick beside it, then the crowd grows ten-fold per rung by
log zoom; the anchor (a microwave second, a bulb-minute) never changes size, so the magnitude is felt against the body of a
kitchen: 0.24 Wh is a fraction of a bulb-minute. The same energy is then re-counted in TWh and divided by three
denominators in turn: the query (nothing), the site (a 100 MW site is 100,000 tiles of 24 kWh, a day), the grid (415 TWh
is a 1.5 % sliver of the world's, split 45/25/15 by region, then 23 % of Ireland's and 4.4 % of the US's, where it is also
about half of the new demand). The belief that one number settles it breaks because the numerator is fixed and the
denominator is the story; the terrain makes that spatial: Ireland is a mesa 15 times the world's, the US a low shelf that is nevertheless
half of the growth.

## Commit
`none` (D11). `"commit": {"enabled": false}`; no COMMIT beat; HOOK carries no digit.

## Monday
`{question: "For any AI energy figure you are quoted: per what: per query, per site or per grid?",
 honest_limit: "Per-query figures: one vendor's median text prompt."}` (the one line on stage; Google's own paper says
the figures have not been independently verified and are a point-in-time median, May 2025 data).
Second limit, off stage (live page and card.md): the IEA 415 TWh and 1.5 % are ALL data centres, not AI alone; the film
says "Data centres, all kinds". Findings for the orchestrator are at the foot of this file.

## Cost
Not applicable.

## Takeaway (<= 60 chars)
"Small per query, large per grid. Divided by what?" (49)

## Sources (full list in sources.md; >= 3)
S1 Google (2025), S2 IEA Energy and AI (2025), S3 IEA Electricity 2026 / Global Energy Review 2026, S4 LBNL (2024),
S5 CSO Ireland (2026 release), S6 Ember (2025), S7 EPRI (2026).

## Chain and look
`Chain: scale-anchor, gl-heightfield, gl-camera-rig, gl-labels` (gl-labels is the label solver for the heightfield and any
scene with pins; scale-anchor draws Canvas2D inside the same film).
`Look: {brand: ceti-boardwalk-dark, chrome: none, material: ink, renderer: webgl, level: manager}`.
Faces: Fraunces italic (headlines, the HOOK words), Space Mono (every number), DM Sans (captions). Palette roles: marks ink,
inked/flagged accent, anchors accent2, terrain ramp panel > muted > accent, Ireland cut band accent2.

## Not this
- Not a verdict on AI sustainability, water or carbon: carbon (0.03 g) and water (0.26 mL) per prompt are claims but stay off the stage.
- Not a comparison of vendors: Epoch's 0.3 Wh for ChatGPT and Altman's 0.34 Wh are B-grade, different method, off the stage.
- Not training energy, not a 2030 forecast (IEA 945 TWh, LBNL 6.7-12 % by 2028, EPRI 9-17 % by 2030 are claims for the live page only).
- Not "AI is 1.5 % of electricity": the IEA 1.5 % is all data centres.
- Not a scare chart and not a reassurance chart; the film ends on a question, not a verdict.

## Findings for the orchestrator (slots not filled, or filled with a caveat)
1. **"AI data centres 1.5 %" is "data centres" (all kinds).** The wave brief says AI data centres; IEA says all data centres (415 TWh, 2024). Film text says "Data centres, all kinds"; an AI-only share would need a separate sourced claim (a Nature 2026 paper, s44458-026-00152-5, appears to give an AI-only share by 2030; not opened).
2. **Egress.** WebFetch opened only the Google page (read directly, grade A). iea.org, cso.ie, ember-energy.org, carbonbrief.org, eta-publications.lbl.gov and powering-intelligence.epri.com all failed DNS; those numbers were re-read through WebSearch extended snippets, several extractions agreeing. Open the pages before ship (sources.md lists the exact line to check).
3. **"17 % of global demand growth" (Fortune on the IEA 2026 report) is ambiguous**: other outlets read 17 % as the growth RATE of data-centre use in 2025. Graded C, left off the stage. The "about half of US growth" is A (IEA Electricity 2026, several extractions).
4. **Year mix on the terrain**: Ireland 2025 (CSO), US 2023 (LBNL), others 2024 (Ember model). Pins carry source and year. Ember's Netherlands 7 % conflicts with the Dutch statistics office (4.6 %); Ember's Europe 96 TWh conflicts with IEA's 15 % (62 TWh), so no Europe-as-region mesa is used.
5. **IEA US 2024 (about 187 TWh, derived from 45 %) vs LBNL US 2023 (176 TWh)**: different years, both A; caption 23 says 2023.
6. **Assumptions printed as such** (grade "def"): 1,000 W microwave, 60 W bulb, ten prompts a day, a 100 MW site at full load (the IEA gives the 100 MW class, not the load factor). If the gate wants A/B only, the owner decides whether stated assumptions pass; drop captions 6-8 and 11-12 if not.
7. **scale-anchor tops out at 10^5**; the site-day count is therefore a second tier (1 tile = 100,000 queries) which the module has no variant for (card: "a second tile tier not built"). The drafter either nests tiles or hard-cuts to a 10^5-mark field with the new legend.
8. **The terrain is seven mesas, not a country map**: 7 sourced places, 40 x 25 cells, no interpolation. If the drafters want a smoother landscape they must say so on screen; the gl-heightfield minimum grid is 40 x 25.
9. Ireland 2024 GWh differs between the research file (6,969) and search extractions (6,973); not used.

## Director's choices (2026-10-10)
- "1.5 % of world electricity" is all data centres: every caption and label says "data centres (all kinds)", never "AI".
- Anchors (microwave second, bulb, 10 prompts a day, a 100 MW site) are stated assumptions: each is a claim with its formula
  and the assumption named in the honest-limits line; they are drawn as comparisons, never as measurements.
- The terrain mixes years (Ireland 2025, US 2023, others 2024): the year is printed on each mesa's label.
- The 17 % figure stays off stage. Second tile tier for the site-day is the drafter's job (scale-anchor LOD knob).
