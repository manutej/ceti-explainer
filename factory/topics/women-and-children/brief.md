# Women and children first · film id `women-and-children` · brief

id: `women-and-children` · wave FILMS-GL (factory/WAVE-FILMS-GL.md) · room: manager · format: feature, dur 123 s
(120 s material + 3 s CETI card) · commit: none (D11; film.json `"commit": {"enabled": false}`) · explorer: Opus (brief lane)

## Subject
- kind: concept (a pooled rule against its split), name: "women and children first" on the Titanic, April 1912.
- source material: `data/titanic.json` (the 32 cells of the Dawson 1995 table, class × sex × age × survived),
  `recompute.py` (prints every claim from the json; `--check` compares with claims.json).

## Audience
manager: someone who signs off a policy or a result reported "on average" (a retention figure, an SLA, a rollout
success rate) and has never been shown who the average leaves out.

## Format
feature, 123 s. Windows (coordinator change, D11, no commit beat): HOOK 0–12 · CASE 12–58 · COUNT 58–108 ·
MONDAY 108–120 · CETI card 120–123.

## The belief
"Women and children first. The rule held." Asked pooled ("did women and children survive more?") it is true:
70 % of women and children lived against 20 % of men.

## The gap (two pictures, one sentence each)
- The belief's picture: being a child put you near the front of the queue for a boat, wherever you slept.
- The count's picture: split by class it is not one story. All 30 children in first and second class lived, but
  27 of 79 third-class children lived, the same rate as first-class men (57 of 175): about 3 in 10 either way.
  The crew (885 people, 40 % of everyone aboard) and third-class men make up 1,324 of the 1,667 men, so the pooled
  "men 20 %" is mostly them.

**Correction to the wave brief (do not put its wording on screen).** WAVE-FILMS-GL.md says "third-class children fared
worse than first-class men". By the table they did not do worse: 27/79 = 34.2 % against 57/175 = 32.6 % for first-class
adult men (62/180 = 34.4 % if first-class boys are counted with the men). The honest sentence is "as often as" /
"no better than". Third-class *boys* did fare worse (13 of 48, 27 %), but splitting children by sex would be a second
partition the film does not need; those claims exist (`p3BoysY`, `p3BoysN`, `p3BoysRate`) and are off screen.

## The fixture
The Titanic, sunk 15 April 1912: 2,201 people aboard (passengers and crew) as tabulated by Dawson (1995) from the British
Board of Trade inquiry; the same table is R's `datasets::Titanic`. **The cells were transcribed from memory** (see Sources).

| class | women | lived | children | lived | men | lived | all | lived |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| first | 144 | 140 (97 %) | 6 | 6 (100 %) | 175 | 57 (33 %) | 325 | 203 (62 %) |
| second | 93 | 80 (86 %) | 24 | 24 (100 %) | 168 | 14 (8 %) | 285 | 118 (41 %) |
| third | 165 | 76 (46 %) | 79 | 27 (34 %) | 462 | 75 (16 %) | 706 | 178 (25 %) |
| crew | 23 | 20 (87 %) | 0 | – | 862 | 192 (22 %) | 885 | 212 (24 %) |
| all | 425 | 316 (74 %) | 109 | 57 (52 %) | 1,667 | 338 (20 %) | 2,201 | 711 (32 %) |

Women and children together: 373 of 534 lived (70 %). "Women" and "men" are adults; "children" are both sexes (Dawson's
Age = Child). Every figure above is a claim id in claims.json (`p3ChildY`, `p1MenRate`, `wcRate`, ...).

## Claims
claims.json, one shape (skills/atelier-brief/references/claims-shape.md): 139 claims. The 32 cells are claims with
source S1 (no formula); every other claim is a formula over claim ids (no film.params needed), rates are
`round(100 * y / n)` (half-up, the gate's `round`). Each claim carries `recompute`
(`python3 factory/topics/women-and-children/recompute.py --value <id>`) and `expect`. `python3 recompute.py --check`
reported 139 of 139 agree; the formulas were also evaluated in a node vm with the gate's helpers: 0 mismatches.

## Count
| unit | n | lands_at |
|---|---|---|
| one box = one person (k = 1, no batching; `perBox`) | 2,201 (`people`) | 24.0 s, CASE (film.json `count.at` 24.0); every ratio follows it |

The second count inside the same structure is the survivors, 711 (`survived`), lit bottom-up at 30 s, still before any rate.

## Commit
commit: none (D11). The user's brief makes these plain videos with no sealed answer. The question the film puts in
words, with no number, at the end of HOOK: "Did it hold for every child aboard?" The answer arrives as counts
(27 of 79) before it arrives as a rate (34 %) or a natural frequency (3 in 10).

## Mechanism
THE COUNT draws the same 2,201 boxes twice. Pooled into three columns (women, children, men), the lit (survivor) share
is high for women and children and low for men: the rule looks kept. Split into twelve slabs (three groups × first,
second, third class and crew; the crew-children slab is empty), the lit height of each slab is its rate, and the
children's slabs do not stand together: first and second class are fully lit, third class is lit to a third, level with
the first-class men's slab beside it. The pooled children's rate (52 %) is a blend of 30 children who all lived and 79 of
whom most did not; the pooled men's rate (20 %) is mostly crew and third-class men. A rule that holds on average can still
hold very unequally for the groups inside it.

## Monday
- question: "Your 'on average' result: which group does it leave out?" (split the average by the group that had the
  least access before you sign it off).
- honest limit (one line, the only one): "One night, one inquiry's count: it shows who lived, not why." (The table cannot
  separate deck location, lifeboat access, language, or the order in which people reached the boats; primary sources
  disagree on the exact numbers aboard, R `?Titanic`.)

## Takeaway (brand card, ≤ 60 chars)
"True on average is not true for every group." (45 chars)

## Sources
1. **S1** Dawson, R. J. MacG. (1995). The "Unusual Episode" data revisited. *Journal of Statistics Education*, 3(3).
   (amstat.org JSE v3n3, datasets.dawson). **The 32 cells in data/titanic.json were transcribed from memory of the
   Dawson table in this lane (no network). They MUST be verified against the published table before any public use.**
   After transcription they were compared with a secondary copy (S4): 32 of 32 cells agree.
2. **S2** British Board of Trade / Wreck Commissioner (Lord Mersey) (1912). *Report on the Loss of the "Titanic" (S.S.)*.
   London: HMSO; reprint 1990, Gloucester: Allan Sutton. The counts Dawson's table derives from; source of the year.
3. **S3** R Core Team. `datasets::Titanic`, "Survival of passengers on the Titanic" (R documentation): a 4-d table of
   2,201 observations, source Dawson (1995); notes that primary sources disagree on the exact numbers aboard.
4. **S4** Rdatasets (V. Arel-Bundock), `csv/datasets/Titanic.csv`, as bundled in the PyPI package pydataset 0.2.0; a copy
   found in a local scratch folder from an earlier session, sha256 d7f30b17…fc089. Secondary, untrusted: a cross-check,
   not a substitute for S1.
5. **S5** Simonoff, J. S. (1997). The "unusual episode" and a second statistics course. *Journal of Statistics
   Education*, 5(1). Analyses the same table. (Citation from memory; verify.)

## Chain (beat order; ids from chain-recipes §1, recipes R21, R22 (labels half), R23)
1. **gl-stack-city** (R21, 3D variant, `layout: bars`, `split: rate`) — CASE 12–58: 2,201 boxes arrive pooled in three
   columns, survivors light bottom-up, the pooled counts then rates, then the turn into 12 slabs by class. Tags: one
   third-class child who lived, one first-class man who lived.
2. **gl-labels** (`solve` over the 11 non-empty slab anchors, `reserve` for captions and readout, a hard-cut `callout`) —
   COUNT 58–84: the slab pins (count first, % ≥ 1.5 s later), then the callout cuts first/second-class children →
   third-class children → first-class men → crew.
3. **gl-post** (R23, `postLevel: manager`: tone map always, bloom on the counted group, vignette) — COUNT 84–100 and
   MONDAY: the reveal as a moment, the 27 + 57 lit boxes emissive, everything else dimmed; labels drawn after `apply`.
Flat furniture (not a structure): the kit's captions, readout and the HOOK/MONDAY type sheet.

## Look
brand `ceti-boardwalk-dark` (dark ground: bloom is allowed; not one of the five packs that fail the tone-map dE < 2 rule),
chrome `none`, material `ink`, renderer `webgl`, level `manager`.

## What this film is NOT
- Not a lifeboat-capacity or "why" film: no seats, no deck plans, no Californian; the table holds who lived, not why.
- Not "the rule was a myth": pooled it held (70 % against 20 %), and within every class women outlived men.
- Not "third-class children did worse than first-class men" (the wave brief's wording): they did the same, 34 % vs 33 %.
- Not the 891-row Kaggle training set, not passenger names, no faces, no film stills; one fixture only.
- Not a logistic regression or odds-ratio lecture; no p-values on screen.
- Not a boys-versus-girls split: a second partition the argument does not need (claims kept off screen).
