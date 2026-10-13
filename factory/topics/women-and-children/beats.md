# Women and children first · beats

id: `women-and-children` · format: feature · dur 123 s = material 0 to 120 s + CETI brand card 120 to 123 s (G4a wants material 90 to 120)
level: manager · renderer: webgl · look: brand `ceti-boardwalk-dark`, chrome `none`, material `ink`
commit: none (D11) · film.json `"commit": {"enabled": false}` · count.at 24.0 s (2,201 boxes landed; no ratio, %, "N of M" or "N in M" before it)
windows: HOOK 0–12 · CASE 12–58 · COUNT 58–108 · MONDAY 108–120 · BRAND 120–123 (WAVE-FILMS-GL as amended by the coordinator, D11)
chain (beat order): **gl-stack-city** (CASE: 2,201 boxes pooled → split by class, tagged units) → **gl-labels** (COUNT A: slab pins + hard-cut callout) → **gl-post** (COUNT B: the reveal as a moment; tone map always)
recipes: chain-recipes §2 R21 (3D variant), R22 (labels half: `solve` + callout), R23 (linear light → `apply` → labels after)
data: factory/topics/women-and-children/data/titanic.json (32 cells, transcribed from memory, UNVERIFIED); every digit below is a claim id in claims.json; `python3 factory/topics/women-and-children/recompute.py` prints them all

## Structures (at most 4; the brand card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The city | gl-stack-city | CASE, COUNT, MONDAY (dimmed) | 2,201 boxes, one per person; pooled into 3 columns (WOMEN, CHILDREN, MEN), then 12 slabs (group × 1ST, 2ND, 3RD, CREW); lit = lived, bottom-up |
| S2 | The pins | gl-labels | COUNT A (58–84), COUNT C (100–108) | 11 slab anchors (crew children has 0 boxes: no anchor), `reserve` for the caption band and readout; one hard-cut `callout` |
| S3 | The reveal | gl-post | COUNT B (84–100), MONDAY | the scene in linear light into `st.hdr`; bloom on the lit boxes of two slabs, the rest at `maskDim`; tone map every frame |
| S4 | The type sheet | flat K.tx (kit) | HOOK, MONDAY | the rule as a line of Fraunces italic over the empty floor; the Monday question; no digit in HOOK |

## gl-stack-city data (from claims; the drafter copies, never retypes)
```
groups: ["WOMEN", "CHILDREN", "MEN"]            cats: ["1ST", "2ND", "3RD", "CREW"]   unit: "person"  hitWord: "LIVED"
n   = [[p1WomenN, p2WomenN, p3WomenN, crWomenN],  = [[144, 93, 165, 23],
       [p1ChildN, p2ChildN, p3ChildN, crChildN],     [  6, 24,  79,  0],
       [p1MenN,   p2MenN,   p3MenN,   crMenN  ]]     [175,168, 462,862]]
hit = [[p1WomenY, p2WomenY, p3WomenY, crWomenY],  = [[140, 80,  76, 20],
       [p1ChildY, p2ChildY, p3ChildY, crChildY],     [  6, 24,  27,  0],
       [p1MenY,   p2MenY,   p3MenY,   crMenY  ]]     [ 57, 14,  75,192]]
source: "Dawson 1995, JSE 3(3) (cells transcribed from memory; verify)"   k 1 (perBox), budget 4000 (so LOD never batches)
layout bars · split rate · arrange row · reveal none (the reveal is gl-post's) · labels none (pins are gl-labels') · checkLine false
tag: ["CHILDREN/3RD/0", "MEN/1ST/0"]  (the j = 0 box of each cell is a hit: hits sort first)
```
Pooled column sums must equal `womenN` 425, `childN` 109, `menN` 1,667 and total `people` 2,201; `check(t)` must hold
`unitsResidual` 0 on every sampled frame.

## Beat table (each WebGL lane has a beat where it carries the argument)
| # | beat | window (s) | structure / lane carrying | focal motion | claims used |
|---|---|---|---|---|---|
| 1 | HOOK | 0.0–12.0 | S4 over S1's empty floor (stack-city t = 0 is floor only, by design) | 0.6 the rule types in Fraunces italic 44u; 6.0 the question line 28u; the floor grid breathes (camera drift 2°) | none (no digit) |
| 2 | CASE · arrive | 12.0–24.0 | **S1 gl-stack-city** carries | boxes drop into three unlabeled columns in seeded order; readout "1 BOX = 1 PERSON"; counter ticks and lands 2,201 at 24.0 (count.at) | year, perBox, people |
| 3 | CASE · lit | 24.0–36.0 | S1 | 29.8–32.0 survivors light bottom-up in every column; readout "711 LIVED" | survived, lost |
| 4 | CASE · pooled | 36.0–48.0 | S1 (stack-city's own pooled pins via `K.tx`, count first) | 36.0 column names + counts "316 OF 425", "57 OF 109", "338 OF 1,667"; 37.5 the % lines 74 %, 52 %, 20 % (ratioDelay 1.5) | womenY, womenN, childY, childN, menY, menN, womenRate, childRate, menRate, wcY, wcN, wcRate |
| 5 | CASE · split | 48.0–58.0 | **S1 gl-stack-city** carries (the turn is the beat) | pins fade; every box travels on its own arc to its class slab (`beats.move` ≈ 48.5–55.5), camera turns 90° (`az` key), the tagged third-class child and first-class man leave a trail and a ghost; the children's slabs land apart: two full, one lit to a third | people (caption) |
| 6 | COUNT A · pins | 58.0–84.0 | **S2 gl-labels** carries | 58.4 11 slab pins enter by priority (counts, secondary 14 mono plate + result 28 for the count line); each % at +1.5 s; 64.0 callout (result ≥ 32) on 1ST/2ND children "30 OF 30"; 70.0 hard cut to 3RD children "27 OF 79"; 76.0 hard cut to 1ST men "57 OF 175"; slabs not named by the callout drop to chrome | p1/p2/p3/cr × Women/Child/Men N, Y, Rate (11 slabs), p12ChildY, p12ChildN, p3ChildY, p3ChildN, p3ChildLost, p1MenY, p1MenN |
| 7 | COUNT B · reveal | 84.0–100.0 | **S3 gl-post** carries | 84.0–86.0 every box except the lit 27 and the lit 57 eases to `maskDim`; bloom ramps on those two (emission > 1 only there), vignette eases in; the two slabs' results "34 %" and "33 %" (labels after `apply`, flat), then 90.0 "3 IN 10 · 3 IN 10" in the result face; 96.0–98.0 bloom ramps down | p3ChildRate, p1MenRate, p3ChildPer10, p1MenPer10, perTen |
| 8 | COUNT C · crew | 100.0–108.0 | S2 callout on S1 (post: tone map only) | callout hard cuts to CREW men "192 OF 862", sub "CREW 885 · 212 LIVED"; crew women pin "20 OF 23" stays; caption names the men's mix | crN, crY, crShare, crMenY, crMenN, crWomenY, crWomenN, menN, menP3CrN, menRate |
| 9 | MONDAY | 108.0–120.0 | S4 over S1 at low exposure (gl-post `exposure` ramp down) | the question types (Fraunces italic 36u), the honest line under it (28u); the two revealed slabs keep a faint glow | none |
| - | BRAND | 120.0–123.0 | kit's CETI card | crossfade | takeaway "True on average is not true for every group." |

## Captions (28 units, ≤ 2 lines of ~50 characters; every digit is a claim id in brackets)
| id | t0 | t1 | text | claims |
|----|---:|---:|------|---|
| c1 | 0.6 | 5.8 | "Women and children first." The rule everyone remembers. | |
| c2 | 6.0 | 11.6 | Did it hold that night for every child aboard? | |
| c3 | 12.4 | 17.8 | The Titanic, April 1912. One box is one person aboard. | year |
| c4 | 18.0 | 23.8 | Passengers and crew: everyone the inquiry counted. | |
| c5 | 24.2 | 29.8 | 2,201 people. Lit boxes are the ones who lived. | people |
| c6 | 30.0 | 35.8 | 711 lived. 1,490 did not. | survived, lost |
| c7 | 36.0 | 41.8 | Lived: 316 of 425 women, 57 of 109 children, 338 of 1,667 men. | womenY, womenN, childY, childN, menY, menN |
| c8 | 42.0 | 47.8 | Women and children together: 373 of 534, or 70 %. Men: 20 %. | wcY, wcN, wcRate, menRate |
| c9 | 48.0 | 52.8 | On average the rule held. Now split the same 2,201 by class. | people |
| c10 | 53.0 | 57.8 | First, second, third class and the crew. No box added or removed. | |
| c11 | 58.2 | 63.8 | Each slab: how many were aboard, and how many lived. | |
| c12 | 64.0 | 69.8 | Children in first and second class: 30 of 30 lived. | p12ChildY, p12ChildN |
| c13 | 70.0 | 75.8 | Children in third class: 27 of 79 lived. 52 did not. | p3ChildY, p3ChildN, p3ChildLost |
| c14 | 76.0 | 81.8 | Men in first class: 57 of 175 lived. | p1MenY, p1MenN |
| c15 | 84.0 | 89.8 | 34 % and 33 %: a third-class child lived as often as a first-class man. | p3ChildRate, p1MenRate |
| c16 | 90.0 | 95.8 | About 3 in 10 of each. Class weighed as much as being a child. | p3ChildPer10, p1MenPer10, perTen |
| c17 | 96.0 | 101.8 | The crew: 885 people, 40 % of everyone aboard. 212 lived. | crN, crShare, crY |
| c18 | 102.0 | 107.8 | Of the 1,667 men, 1,324 were crew or third class. The men's 20 % is mostly them. | menN, menP3CrN, menRate |
| c19 | 108.2 | 113.8 | Monday: your "on average" result. Which group does it leave out? | |
| c20 | 114.0 | 119.8 | One night, one inquiry's count: it shows who lived, not why. | (honest line) |

Wording rules: "as often as", never "worse than" (34 % vs 33 %; brief.md "Correction to the wave brief"). "Women" and "men"
mean adults; "children" both sexes. Do not round 70 % to "seven in ten" on screen without adding a claim.

## Knobs (film.json knobs + knobs_doc; numbers that are claims are never knobs)
stack-city: `k` (1, fixed by perBox; exposed read-only), `budget`, `dur`, `beats.arrive/lit/move`, `stagger`, `lift`, `orderMix`,
`az` [start, end], `elev` [start, end], `drift`, `fit`, `lookY`, `ratioDelay` (≥ 1.5), `maskDim`.
labels: `hold` (8), `leader` (24), `maxShown` (12 at manager), `sticky` ('window' for a 123 s film: chain seek is O(t·fps)),
`calloutAt` [64, 70, 76, 100] (schedule times).
post: `postLevel` (manager), `bloomGain` (0.04–0.12; 0.08), `bloomRamp` [84, 86, 96, 98], `vignetteGain` (0.08), `exposure`,
`dofGain` (0 by default: see NOTES cost), `grainGain` 0, `chromaGain` 0.

## Purity and cost
render(t, state) recomputes every box position, pin and gain from t; seeded order in stack-city (`orderMix`, fixed seed); labels
solved on the fixed sample grid; post `gains(params, t)` pure. Budget s/frame ≤ 1.5 on the heaviest frame (≈ 86–96 s: city +
11 pins + bloom). Card figures: stack-city bars at 2,201 boxes ≈ 0.2 s, labels ≤ 0.4 s, post bloom +0.17 over a 0.24 floor: an
estimate near 0.8–1.0 s, unmeasured as a composite. Page < 1.3 MB.

## Checks (run by the brief lane)
- [x] count.at 24.0 precedes every ratio: first "N of M" is c7 at 36.0, first % at 37.5 (pins) / 42.0 (c8).
- [x] HOOK carries no digit (c1, c2 and S4 are digit-free); no commit beat (D11), so no input claims.
- [x] every caption digit is a claim value (2,201 · 711 · 1,490 · 316 · 425 · 57 · 109 · 338 · 1,667 · 373 · 534 · 70 · 20 · 30 ·
      27 · 79 · 52 · 175 · 34 · 33 · 3 · 10 · 885 · 40 · 212 · 1,324 · 1912).
- [x] `python3 recompute.py --check`: 139 of 139 claims agree; formulas re-evaluated in node vm with the gate's helpers: 0 mismatches.
- [x] each of the three WebGL lanes carries a beat: stack-city (rows 2 and 5), gl-labels (row 6), gl-post (row 7).
- [x] one honest line (c20); the CETI card last (120–123); four structures.
- [ ] the 32 cells verified against the published Dawson (1995) table (open: NOTES.md).
