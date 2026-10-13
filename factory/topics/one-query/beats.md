# one-query · beat sheet (153 s = 150 s of material + 3 s CETI card)

| field | value |
|---|---|
| format | feature-long (film.json `format: "feature-long"`, 140-180 s; this wave) |
| dur | 153 |
| level | manager |
| renderer | webgl |
| chrome | none |
| material | ink |
| brand | ceti-boardwalk-dark (bg #1C1821, ink #FBF7EE, accent #E6D8FD, accent2 #F9AE9F; Fraunces italic display, Space Mono numbers, DM Sans captions; texture none) |
| chain | scale-anchor, gl-heightfield, gl-camera-rig, gl-labels |
| commit | none (D11): `"commit": {"enabled": false}`, four beats, no COMMIT chapter |
| windows | HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150 · card 150-153 (chapter edges +-2 s in evaluation, never the order) |

Stage 960 x 540 sheet units. Silent; captions carry it; captions are 28 units, <= 60 characters, band y 470-530 reserved
(gl-labels `reserve`). Every digit is a claim id in claims.json (brackets). Numbers in Space Mono; results never in the
smallest face; <= 2 `result` boxes on screen and never two close (R2).

## Beat table

| beat | t (s) | structure on stage | focal motion | claims |
|---|---|---|---|---|
| HOOK | 0.0-12.0 | one lit mark in a dark field; headline words "TOO MUCH" then "ALMOST NONE" (display face) swap over the same still mark; no digit | camera STILL until 8 s (R-E template), then a 4 s push toward the mark | none |
| CASE a | 12.0-31.0 | **S1 one query.** the single mark, centre; ruler tick equal to the mark; readout "0.24 Wh"; then two energy anchors as plain stroke icons beside it: microwave "0.86 s", bulb "14 s" | still; holds >= 2.5 s on each new number | gemWh, gemYear, microW, microS, bulbW, bulbS |
| CASE b | 32.0-55.5 | **M1 re-scale.** scale-anchor log ladder 1 to 10^5 queries (rungs 10^0..10^5; dwell 2.6 s, move 1.3 s); the mark never moves, the crowd grows in square-spiral order; anchor tick stays constant; per-rung readout n x 0.24 Wh and microwave time | log zoom, expo ease, keyed holds | dayWh, dayMicroS, tileKwh, tileQ |
| CASE c | 56.0-60.0 | tile swap: "1 tile = 100,000 queries (24 kWh)"; the 10^5 tiles of a 100 MW site's day take the frame | the swap IS the move's last rung (no extra camera) | siteMW, hoursDay, siteDayGwh |
| COUNT a | 60.0-71.0 | **site-day count lands**: 100,000 marks, each 100,000 queries; hard cut (P13, anchor mark keeps its screen place) to **S2 world field**: 415 inked marks, 1 mark = 1 TWh | hold; cut at 66.0 on a settle | siteDayTiles, siteDayQ, oneTwh, ieaYear, worldTwh |
| COUNT b | 71.4-83.0 | **M2a denominator = the world grid.** camera pulls back; the grey backdrop of the rest of the world's grid is already in the scene beyond the frame (no mark appears or fades); 415 inked marks become a sliver; "1.5 %" lands >= 5 s after the count | dolly out 74-77 s, hold | worldPct |
| COUNT c | 83.0-99.0 | **M2b re-partition by region.** the same 415 inked marks travel into four groups (US, China, Europe, rest); counts first (187, 104, 62), the three shares after (45 %, 25 %, 15 %) | orbit <= 90 deg, >= 4 s, elevation constant | usDc, cnDc, euDc, restDc, usPctDc, cnPctDc, euPctDc |
| COUNT d | 99.0-104.5 | **S3 terrain.** hard cut (P13) to the heightfield: seven mesas (Ireland, Netherlands, United States, Germany, UK, France, World), height = data-centre share of the place's own grid; rows count in | oblique 30 deg, ambient <= 1 deg/s | none (heights only; pins hold) |
| COUNT e | 104.5-121.0 | **M3 section cut at Ireland.** cut band travels to Ireland's column; pin "7,663 GWh" (count) then "23 %" >= 5 s later; then the ratio "15 times the world's 1.5 %" | cut snaps to a real column; camera follows 12 % | ieYear, ieGwh, iePct, ieVsWorld |
| COUNT f | 121.0-135.0 | **cut moves to the United States**: "176 TWh, 4.4 % of its grid (2023)", then the pin "about half of 2025 demand growth"; camera lands flat/elevation so every key number is read on a still view (P10) | slow orbit to elevation, settle >= 1.5 s | usYear, usTwh23, usPct23, usGrowthPct, growthYear |
| MONDAY | 135.0-150.0 | terrain held, dimmed 40 %; the question in display face; the **honest-limits line on stage** (Space Mono 16u, not only in a caption) | still | none |
| CARD | 150.0-153.0 | plain ink card: CETI wordmark + takeaway | | |

Count order (law: counts before ratios): the first count lands at 17.2 s (one query, 0.24 Wh) and the ladder at 51-56 s
(100,000 queries); the first ratio (1.5 %) is at 77.4 s, 6+ s after "415 TWh" (71.4 s); 23 % follows 7,663 GWh by >= 5 s.

## Captions (26; 28 units; <= 60 characters; no digit without a claim)

| # | t0 | t1 | text | claims |
|---|---|---|---|---|
| 1 | 0.6 | 4.6 | AI is using far too much energy. | |
| 2 | 4.8 | 8.6 | AI is using almost no energy. | |
| 3 | 8.8 | 11.8 | Both come with true numbers. Count them. | |
| 4 | 12.4 | 16.8 | One question to a chatbot. One mark. | |
| 5 | 17.2 | 22.6 | Google, 2025: a median text prompt takes 0.24 Wh. | gemYear, gemWh |
| 6 | 23.0 | 28.4 | A 1,000 W microwave runs 0.86 s on that. | microW, microS |
| 7 | 28.8 | 34.2 | A 60 W bulb: 14 s. A fraction of a minute. | bulbW, bulbS |
| 8 | 34.6 | 40.4 | Ask 10 a day: 2.4 Wh, 8.6 s of microwave. | promptsDay, dayWh, dayMicroS |
| 9 | 40.8 | 47.6 | Zoom out: each step is ten times the queries. | |
| 10 | 48.0 | 55.6 | 100,000 queries: 24 kWh. | tileQ, tileKwh |
| 11 | 56.0 | 59.8 | A 100 MW site, 24 hours: 2.4 GWh. | siteMW, hoursDay, siteDayGwh |
| 12 | 60.2 | 65.8 | 100,000 marks of 100,000 queries: 10 billion. | siteDayTiles, tileQ, siteDayQ |
| 13 | 66.2 | 71.0 | Now the world. One mark is one TWh. | oneTwh |
| 14 | 71.4 | 77.0 | Data centres, all kinds, 2024: 415 TWh. | ieaYear, worldTwh |
| 15 | 77.4 | 83.0 | Against the world's electricity: 1.5 %. | worldPct |
| 16 | 83.4 | 88.4 | Same marks, by region: US about 187 TWh. | usDc |
| 17 | 88.8 | 93.8 | China about 104. Europe about 62. | cnDc, euDc |
| 18 | 94.2 | 99.2 | 45 %, 25 %, 15 % of the world's data-centre power. | usPctDc, cnPctDc, euPctDc |
| 19 | 99.6 | 104.6 | Now each country against its own grid. | |
| 20 | 105.0 | 110.4 | Cut at Ireland, 2025: 7,663 GWh. | ieYear, ieGwh |
| 21 | 110.8 | 116.0 | 23 % of Ireland's metered electricity. | iePct |
| 22 | 116.4 | 121.4 | 15 times the world's 1.5 %. | ieVsWorld, worldPct |
| 23 | 121.8 | 127.8 | Cut at the US, 2023: 176 TWh, 4.4 % of its grid. | usYear, usTwh23, usPct23 |
| 24 | 128.2 | 134.8 | Yet about half of 2025's US demand growth. | usGrowthPct, growthYear |
| 25 | 135.4 | 141.4 | Monday: for any AI energy figure, ask: per what? | |
| 26 | 141.8 | 149.6 | One vendor's median text prompt, not video or agents. | |

Caption 26 doubles the on-stage honest line (below); the on-stage line is the binding one. Caption 12 counts the same
10^5 at two scales on purpose (100,000 marks, each 100,000 queries): the readout prints "1 mark = 100,000 queries".

**On-stage honest-limits line (MONDAY, 140-150, Space Mono 16u):** "Per-query figures: one vendor's median text prompt."
Exactly one limit on stage. The second limit (IEA's 415 TWh is ALL data centres, not AI alone) is in the captions as
"Data centres, all kinds" (caption 14) and in the live-page block; it is not a second honest line.

**Brand card (150-153):** takeaway "Small per query, large per grid. Divided by what?" (49 characters).

## The three moves (grammar: R-E section 0, "[operation] under [camera], holding [invariant], landing on [view]")

### M1 · human-scale anchor + log zoom (re-scale) · 32-60 s · pairing: re-scale x log zoom (best)
Sentence: re-scale the crowd of queries from 1 to 10^5 under a log zoom, holding the mark and the anchor, landing on a
single tile that is 24 kWh.
- I1 same marks: unit k keeps its spiral cell for the whole ladder (scale-anchor guarantee; marks never move as the crowd grows).
- I2 same count: n = round(10^L) is printed at every rung and equals marks drawn or the sum of tile counts (module check tileSum == n).
- I3 same scale: 1 mark = 1 query = 0.24 Wh until the swap; the swap is the move, printed ("1 tile = 100,000 queries", f = 10^5 via
  nested tiles); the anchor tick stays one constant length (136 px at P = 408).
- I4 same world: nothing else changes; the energy anchors (microwave, bulb) do not move or rescale.
- I5 same lens: the camera is the zoom; no projection change.
Landing: rung 10^5 held >= 2.6 s with readout "24 kWh". Labels: gl-labels pins cut off at move start and cut on after
the settle (R5). Gap to the next move start (M2a 74 s): 18 s.

### M2 · re-partition by denominator (per query / per site / per grid) · 66-99 s · pairing: re-partition x orbit <= 90 deg
Sentence: re-partition the 415 inked TWh marks, first against the world's grid then by region, under a pull-back and a
quarter-turn, holding the 415 marks, landing on four counted groups.
Denominators in order: per query (M1), per site (CASE c, 100,000 tiles of one reference day), per grid (this move).
- I1 same marks: the 415 inked marks keep ids through the pull-back and the regroup; the grey backdrop marks are in the scene
  from the cut at 66 s (outside the frame) and are only revealed by the dolly: nothing fades in or out mid-move.
- I2 same count: 415 inked before and after; groups 187 + 104 + 62 + 62 = 415 (residual 0 printed in the check line).
- I3 same scale: 1 mark = 1 TWh throughout (legend printed).
- I4 same world: the backdrop does not re-lay out; only the inked marks travel.
- I5 same lens: perspective fov fixed.
Step gap: pull-back 74 s, regroup 83 s (9 s). Caption 15 (1.5 %) lands after the pull-back settles; captions 16-18: counts
(187, 104, 62) before shares (45, 25, 15). The groups are derived from rounded IEA shares, so the TWh are "about".

### M3 · terrain section cut (country mesas) · 99-135 s · pairing: slice x hold + slow orbit
Sentence: slice a landscape of data-centre share-of-own-grid at Ireland, then at the United States, under a slow orbit,
holding the seven cells and the height scale, landing on an elevation view where the peak and the cut profile are read.
- I1 same cells: seven mesas (data/terrain-matrix.json, 40 x 25, 4 columns per place plus a gap column); no cell is added, removed or re-valued.
- I2 same count: seven places; the cut always snaps to a real column (heightfield guarantee).
- I3 same scale: vmin 0, vmax 25 fixed; `hscale` constant; contour step = range / contours is printed or off.
- I4 same world: the mesas are piecewise-constant on purpose (no interpolation between places: the height between two
  countries is not data); a pin marks each mesa top.
- I5 same lens: perspective fov fixed; the final landing is elevation (el <= 20 deg) with the key numbers on a still view.
Cut start 104.5 (Ireland), moves to the US at 121.0 (gap 16.5 s from start to start), landing 128-135. Section variant
of gl-heightfield (`cutMode: section`, profile on): the max pin ghosts "CUT AWAY" once passed.

## Move audit (start to start; R-E T2 wants >= 8 s)
| move | start (s) | gap | note |
|---|---|---|---|
| M1 ladder | 32.0 | | the ladder is ONE move (continuous log zoom with keyed holds); if the gate counts rungs, set dwell 3.5 and top 5 |
| M1 tile swap | 56.0 | 24 | last rung of M1, no camera |
| hard cut to world field | 66.0 | | a cut (P13), not a move; anchor mark keeps its screen place |
| M2a dolly out | 74.0 | 8 | settle 77.0 |
| M2b regroup + quarter-turn | 83.0 | 9 | settle 88.0 |
| hard cut to terrain | 99.0 | | a cut (P13) |
| M3a cut to Ireland | 104.5 | 5.5 from the cut | a slice, camera still |
| M3b cut to US + slow orbit to elevation | 121.0 | 16.5 | |

## Label policy (R-E section 2)
gl-labels `solve` over anchors: the mark readouts, the group names (M2), the place names and pins (M3). `maxShown` <= 12 at rest,
<= 6 within 1 s of a move; labels hard-cut at every move start and cut on after a >= 1.0 s settle (R5); pins drop while
|d el/dt| > 12 deg/s; the caption band is a `reserve` rect; flat text only. Result faces >= 28 units (23 %, 4.4 %, 1.5 %, 24 kWh).
Never two result boxes within 56 units (R2): at the Ireland cut show 7,663 GWh first, 23 % >= 5 s later, 15 times last.

## Checks (run before hand-back; all pass in this package)
- every caption <= 60 characters, every digit in a caption is a claim value or a render (checked by script).
- HOOK carries no digit; no ratio before its count; one honest line on stage.
- g5a: every claims.json formula recomputes (checked with node vm over claim values and params).
- only grade A or B numbers on stage; the anchor definitions (1,000 W, 60 W, 10 prompts, 100 MW at full load) are stated assumptions printed as such.
