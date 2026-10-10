# who-gains · beat sheet (153 s = 150 s material + 3 s CETI card)

```
film id:   who-gains          format: feature-long   dur: 153 (card from 150.0)   commit: none (D11, enabled:false)
level:     manager            renderer: webgl        chrome: none                 material: ink
brand:     ceti-neosage-dark  chain: gl-stack-city, gl-camera-rig, gl-labels, track-unit
windows:   HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150 · CARD 150-153
grammar:   arsenal/frontier/R-E-perspective-shift.md (P2 quarter-turn re-partition, P8 follow one mark, P1 plan-to-elevation tilt)
claims:    claims.json (every digit below is a claim id in brackets); grades in sources.md; only A/B on screen
```
Silent; captions carry it (<= 60 chars, 28 units, band reserved, no text inside the band while a caption shows).
Three separate fields (agents, developers, METR); the +34 and the -19 never share an axis (finding F6).

## Beat table
| beat | t (s) | what is on stage | claims |
|---|---|---|---|
| HOOK | 0-12 | wide, STILL (no move before 8 s). One lone box on a plain ground; a pooled column outline "AI" rises behind it. No digit anywhere. | none |
| CASE | 12-22 | support desk: boxes count in, one per agent (camera still, oblique 24 deg, ambient <= 3 deg). Counter ticks. | |
| | 22.0 | COUNT LANDS: "5,179 agents", held to 26.0. | agents |
| | 26.0 | RATIO: pooled column rises, "+14 %" (one result label), held to 34.0. | poolAgents |
| | 34-44 | MOVE 1 re-partition by skill (see below); the tagged agent rides. Labels cut off at 34.0 (R5). | |
| | 44-46.6 | settle (no motion beyond ambient); labels still off. | |
| | 46.6 | label on the lowest-skill group: "+34 %" (hold 3.0 s). | novice |
| | 49.6 | label on the highest-skill group: "about 0" (hold >= 3.0 s). Middle group: word label only ("middle three fifths"), no digit. | expertAgents |
| | 53.6-60 | hold; the pooled "+14 %" returns as a ghost line across the three heights: the average of a big gain and a flat line. | poolAgents |
| COUNT | 60-68 | MOVE 3 follow one tagged agent: look-at the tag in the lowest-skill group, ghost of its old pooled home, dolly out to the whole (P8). | |
| | 68-76 | hold on the wide split; legend "ONE BOX = ONE AGENT". | |
| | 76.0 | HARD CUT (P13, no travel) to a second field: developers' boxes count in. | |
| | 84.0 | COUNT LANDS: "4,867 developers", held to 88.0. | devs |
| | 88.0 | RATIO: pooled column "+26 %", held to 95.4. | poolDevs |
| | 95.6-101.4 | words only: newer hires gained more than veterans. A pale/dark tint of two blocks is allowed only if no block size is implied (blocker F3). | |
| | 101.5 | HARD CUT to the METR field. Source chrome tag "METR · 2025 · follow-up 2026: too biased to size" (the 2026 note is chrome, not a limit line). | metrYear, fuYear |
| | 102.0 | COUNT LANDS: 16 developer dots, "16", held to 105.0. | metrDevs |
| | 105.0 | COUNT: 246 issue boxes in one block, "246", held to 111.0. No clustering under the 16 dots. | metrIssues |
| | 111.0 | BELIEF VIEW (plan, el ~89): every issue box at the same footprint, forecast plane ghosted below baseline, "24 %" label (hold 5 s). | forecast |
| | 116-124 | MOVE 2 forecast-vs-measured tilt (see below). Labels off. | |
| | 124-126 | settle. | |
| | 126.0 | MEASURED VIEW (side, el ~4): arm-mean heights; the measured plane sits ABOVE the baseline line. "19 % slower" (hold 3.0 s). | slower |
| | 129.0 | second result label "20 % faster" (what they believed), tied by a thin leader to the forecast ghost; hold to 135. | believedAfter |
| MONDAY | 135-150 | return to the wide pooled pose (bookend, P13 cut). 135.4 caption: split the gain by experience. 138-150: the ONE honest line ON STAGE (14-16 units, above the caption band): "Three studies, earlier tools, different tasks: a pattern, not a law." 142.2 caption: ask average gain or gain for whom. | |
| CARD | 150-153 | CETI card (brand ceti-neosage-dark); takeaway: "Averages hide who gains. Split by experience first." | |

Budget: 3 moves at 34, 60, 116 (gaps 26 s and 56 s, so <= 1 move per 8 s); every new number holds >= 2.5 s (smallest 3.0 s);
camera still on every number; ratio after count by >= 1.5 s (agents 4.0 s, devs 4.0 s).

## The three moves (R-E grammar: [data operation] under [camera path], holding [invariant], landing on [view])
Each is checked with the five invariants I1 same marks, I2 same count, I3 same scale, I4 same world, I5 same lens.

**M1 · pooled -> split re-partition (P2 quarter-turn), 34.0-44.0 s.** Op: re-partition 5,179 boxes from one pooled column
to three skill groups (lowest fifth 1,036 [nQ], middle three fifths 3,107 [nMid], highest fifth 1,036 [nQ]); lit/height of
each group is its gain [novice, midGain (height only), expertAgents]. Camera: orbit <= 90 deg over >= 4 s, elevation
constant (lane gl-camera-rig, gl-stack-city `split rate`, `beats.move`, `dur` ~10, `stagger` <= 0.25). Invariants:
I1 the same 5,179 box ids, none fades; I2 "5,179" in the readout before and after, `check(t).units` = 5,179 each frame;
I3 one box = one agent (k = 1, 5,179 < budget) in both views; I4 no unmoved box is re-laid; I5 fov fixed. Landing view:
oblique 24 deg held, then label cut-in at 46.6 s. Encoding rule (drafter decides within it): group height is proportional to
gain on one shared baseline ("no change" line), never to head-count; the three heights are 34, 12 (no digit), about 0.

**M2 · forecast-vs-measured tilt (P1 plan-to-elevation), 116.0-124.0 s.** Op: re-stack / re-project the 246 issue boxes.
Plan view = the belief (equal footprints, forecast plane 24 % below the baseline); elevation = the stopwatch (the measured
plane 19 % above the baseline). Camera: orbit el ~89 -> ~4, fixed az and centre, 8 s ease in-out (no dolly, no cut).
Invariants: I1 same 246 boxes; I2 "246" in the readout before and after; I3 height scale fixed (baseline = 100, forecast
76, measured 119, belief-after 80 are arm means; schematic, declared in the legend: "ARM MEAN, NOT PER ISSUE"); I4 the 16
developer dots do not move; I5 fov fixed. Landing: side elevation held 126-135 s, the only view where 19 and 20 are read.
Breaks to avoid: el <= 8 deg hides back rows (keep el 4 only if the front row is the measured plane); no label mid-turn.

**M3 · a tagged worker followed through (P8 follow one mark, track-unit tag), 60.0-68.0 s.** Op: disaggregate one from
all, then aggregate back: the tagged box is a lowest-skill agent, accent outline, trail of its own path from the pooled
column (M1 carried it), ghost at its old pooled home (lane gl-stack-city `tag`; 2-D twin track-unit `tags`/`trail` for the
inset if the drafter wants the flat evidence). Camera: look-at the tag, then dolly out over 8 s, ease expo in then in-out out.
Invariants: I1 the tag is the same id as in M1 and keeps its path; I2 5,179 boxes in the readout at the end; I3 one box =
one agent (label "ONE BOX = ONE AGENT" lands after the settle); I4 the other boxes stay put; I5 fov fixed. Landing: the wide
split pose of M1 (stored key), so a seek lands identically.

## Captions (23; DM Sans 28 units, centred; <= 60 chars; digits are claim renders)
| # | t0 | t1 | text |
|---|---|---|---|
| 1 | 0.6 | 5.4 | Everyone says AI makes everyone faster. |
| 2 | 5.8 | 11.6 | Faster at what, and for whom? |
| 3 | 12.4 | 21.6 | A support desk gave an AI assistant to its agents. |
| 4 | 22.0 | 25.8 | 5,179 agents. One box is one agent. [agents] |
| 5 | 26.0 | 33.6 | On average: +14 % issues resolved per hour. [poolAgents] |
| 6 | 34.0 | 43.8 | Same 5,179 boxes, sorted by skill. [agents] |
| 7 | 46.6 | 49.4 | Lowest-skill fifth: +34 %. [novice] |
| 8 | 49.6 | 53.4 | Highest-skill fifth: about 0. [expertAgents] |
| 9 | 53.6 | 59.6 | The 14 % was a big gain and a flat line, averaged. [poolAgents] |
| 10 | 60.4 | 67.6 | Follow one new agent through the split. |
| 11 | 68.2 | 75.6 | Inside the average, her gain was large. |
| 12 | 76.2 | 83.8 | Another test: developers with a coding assistant. |
| 13 | 84.0 | 87.8 | 4,867 developers in three field trials. [devs] |
| 14 | 88.0 | 95.4 | Pooled: they finished 26 % more tasks. [poolDevs] |
| 15 | 95.6 | 101.4 | Newer hires gained more than veterans. |
| 16 | 102.0 | 104.8 | 16 experienced developers, on code they know. [metrDevs] |
| 17 | 105.0 | 110.8 | 246 real issues; AI allowed or banned at random. [metrIssues] |
| 18 | 111.0 | 115.8 | They forecast AI would cut their time by 24 %. [forecast] |
| 19 | 116.0 | 124.0 | Same issues, now timed with a stopwatch. |
| 20 | 126.0 | 128.8 | Measured: 19 % slower. [slower] |
| 21 | 129.0 | 134.8 | Afterwards they still believed 20 % faster. [believedAfter] |
| 22 | 135.4 | 141.6 | Before you roll AI out, split the gain by experience. |
| 23 | 142.2 | 149.6 | Ask: average gain, or gain for whom? |
Stage honest line (not a caption, 138.0-150.0, above the caption band): "Three studies, earlier tools, different tasks: a pattern, not a law."

## Drafter rules specific to this film
- The middle group (height 12) carries NO digit; claim midGain has onscreen:false. Groups are named "lowest-skill fifth",
  "middle three fifths", "highest-skill fifth" (the source cut is a skill index, not tenure).
- Do not draw the junior/senior ranges (grade C), the METR follow-up numbers (C), the economists' 39/38, or the CI.
- Do not cluster the 246 issue boxes under the 16 developer dots; do not size the 4,867 blocks (no group n verified).
- At most two result labels at once (R2); 20 and 19 are a comparison; they appear 3.0 s apart; "24" is off before they appear.
- Words "novice", "expert" only as the paper uses them ("novice and low-skilled", "experienced"); no seniority claim for METR beyond "experienced".

## Checks
- [x] every digit in captions is a claim render (agents 5,179; 14; 34; 26; 4,867; 16; 246; 24; 19; 20; 0 as "about 0"; "3" in "three" is a word)
- [x] counts before ratios: agents 22.0 < 26.0; devs 84.0 < 88.0; METR 16/246 before 24/19/20
- [x] nothing in HOOK carries a digit; no commit beat; one honest line on stage; CETI card last
- [x] captions <= 60 chars (max 53); all windows inside 0-150; >= 3 moves, <= 1 per 8 s, holds >= 2.5 s
- [ ] gate G1-G11 (drafters): G11 text overlap, caption band, s/frame <= 1.5, page < 1.3 MB, film.js < 120 KB
