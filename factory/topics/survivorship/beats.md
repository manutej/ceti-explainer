# survivorship · beat sheet (75 s = 72 s material + 3 s brand card)

Stage 960 by 540 units. Faces: Big Shoulders Display 600 (headlines, prompts), IBM Plex Mono 400/500 (every
digit), DM Sans (sub-labels). Tokens: `--paper`, `--ink`, `--ink-pale` (ink at 28 %), `--red` (red pencil:
the missing and the truth), `--you` (blue pencil: the viewer's guess). Exec ink only: no plane silhouettes,
no icons, no illustrated bullet holes. One square = one plane.

## Beats

| beat | t | structure | what happens |
|---|---|---|---|
| HOOK | 0.0 to 8.0 | S1 the 60-block | 60 holed squares appear; "ARMOUR HERE?" bracket (the belief) |
| COMMIT | 8.0 to 16.0 | S2 commit box (over S1) | "Out of 100 planes hit, how many never came home?" page holds 8 s at t = 12.0; film types the default 10 |
| CASE | 16.0 to 36.0 | S3 the memo ledger (S1 dimmed, left) | Wald, SRG, 1943; 400 flew, 380 home, 20 never; holes on the 60: 32 / 20 / 8 |
| COUNT | 36.0 to 62.0 | S4 the 400 grid (S1 slides into it) | 320 unhit, 60 holed, 20 missing; 80 hit; your guess vs 20 of 80; then 1 in 4 |
| MONDAY | 62.0 to 72.0 | S4 held | the Monday question; honest-limits caption |
| BRAND | 72.0 to 75.0 | card | "CETI" wordmark line; "The data you have is the data that survived." |

Four structures: S1, S2, S3, S4 (S1 becomes rows 17 to 19 of S4). The brand card is the format's card.

Chapters: `hook` 0 "The ones that came back" · `commit` 8 "Your number" · `case` 16 "Wald's memo" ·
`count` 36 "All 400" · `monday` 62 "Monday".

## Commit
- Prompt (box, Big Shoulders 34 u, two lines): **OUT OF 100 PLANES HIT, / HOW MANY NEVER CAME HOME?**
- Input: integer 0 to 100, mono 56 u, suffix "in 100". Live page: pause at t = 12.0, focus the input, 8 s
  countdown bar along the box's bottom edge; Enter or timeout resumes; empty means "no guess".
- Film mode default (film.json `defaultGuess`): **10**. Typed at 13.2 ("1") and 13.5 ("10"); red "SEALED"
  stamp at 14.8 (rotate -4 deg, 28 u). Nothing numeric derived from the guess appears before t = 50.0.
- State: `state.guess` (number or null). Derived: `k = round(guess * 80 / 100)` (claims c-guess-cells).

## Captions (14; each at most 60 characters; 28 u; bottom band, baseline y 516)

| # | in | out | text | chars |
|---|---:|---:|---|---:|
| 1 | 0.4 | 4.0 | We studied our best customers. Let's copy them. | 47 |
| 2 | 4.2 | 7.8 | 1943: armour the planes where the holes are. | 44 |
| 3 | 8.2 | 11.8 | Every hole here is on a plane that came home. | 45 |
| 4 | 12.0 | 15.8 | Out of 100 planes hit, how many never came home? | 48 |
| 5 | 16.2 | 20.8 | 1943. Abraham Wald, Statistical Research Group. | 47 |
| 6 | 21.0 | 26.8 | His memo's example: 400 planes fly, 380 come home. | 50 |
| 7 | 27.0 | 31.8 | 60 come home with holes. 20 never come home. | 44 |
| 8 | 32.0 | 35.8 | Nobody counts the holes on the 20. | 34 |
| 9 | 36.2 | 43.8 | All 400. 320 came home without a scratch. | 41 |
| 10 | 44.0 | 49.8 | Every lost plane was hit: 60 home plus 20 lost is 80. | 53 |
| 11 | 50.0 | 55.8 | Your guess, against the 20 that never came back. | 48 |
| 12 | 56.0 | 61.8 | The holes that matter are on the missing planes. | 48 |
| 13 | 62.2 | 66.8 | Before you copy the winners: who isn't in the data? | 51 |
| 14 | 67.0 | 71.8 | Honest limit: Wald's 400 is a worked example. | 45 |

Brand card text (not a caption): "The data you have is the data that survived." (44)

## Geometry (design units)

Grid cell `(c, r)`, c, r in 0..19, square 13 by 13:

    x(c) = 96 + 17c
    y(r) = 88 + 17r + (r >= 16 ? 16 : 0) + (r >= 19 ? 16 : 0)

Grid spans x 96 to 432, y 88 to 456. Groups: rows 0 to 15 = 320 unhit (y 88 to 356); rows 16 to 18 = 60
holed (y 376 to 423); row 19 = 20 missing (y 443 to 456). Right panel x 470 to 920. Group labels sit on
one baseline each, number in mono 36 u then sub-label DM Sans 18 u after a 14 u gap:
unhit y 234, holed y 412, missing y 462.

Holed cells, reading order i = 0..59 over rows 16 to 18: holes(i) = 1 for i < 32, 2 for i < 52, 3 for
i < 56, 4 for i < 58, else 5 (the memo's 32 / 20 / 4 / 2 / 2; 102 dots in all). Each hole is a paper-coloured
dot of radius 1.6 u inside the cell's inner 9 by 9 area, positions from mulberry32(1943) with rejection
(minimum spacing 3.2 u, 50 tries), precomputed once at load, never in render.

S1 hero position: the 60-block (rows 16 to 18 geometry) is drawn translated by dy = 214 - 376 = -162 until
t = 36.0, then slides to dy = 0 over 36.0 to 37.2 (easeInOutCubic).

## Frame by frame

### HOOK 0.0 to 8.0 (S1)
- 0.0 to 0.4: paper only.
- 0.4 to 2.8: the 60 holed cells appear in reading order, one every 0.04 s, each fading in over 0.15 s with
  its dots punched at once. Ink fill.
- 0.6: eyebrow (chrome, 12 u) "CASE · SURVIVORSHIP" at (48, 40).
- 1.2: right panel at baseline y 262 (hero offset): "60" mono 56 u at x 480, "came home with holes" 20 u at x 560.
- 4.2 to 4.8: a 1.5 u ink bracket draws over the block (y 204, x 96 to 432, 6 u ticks down); label
  "ARMOUR HERE?" mono 28 u at (96, 190). This is the belief.

### COMMIT 8.0 to 16.0 (S2 over S1)
- 8.0 to 8.4: bracket and label fade out. 8.2: sub-label becomes "came home. Every one." (20 u).
- 11.6 to 12.0: right-panel label fades; commit box rises 12 u into place: rect x 460 to 930, y 150 to
  380, ink stroke 1.5 u, paper fill. Prompt lines at y 200 and y 240; input field baseline y 320 ("__" then
  "in 100" 20 u); countdown bar y 372, width 470 to 0 over 8 s (page) or over 12.0 to 15.6 (film).
- 12.0: page holds (live). Film: "1" at 13.2, "10" at 13.5; "SEALED" stamp at 14.8 near (820, 300).
- 16.0 to 16.4: box fades out; the sealed value persists only in state.

### CASE 16.0 to 36.0 (S3; S1 dims to 50 % at 16.4, stays in hero position)
- 16.2 to 17.0: memo title block, right panel: rules at y 98 and y 182 (x 470 to 920); "STATISTICAL RESEARCH
  GROUP · COLUMBIA" chrome 14 u at y 120; "ABRAHAM WALD · 1943" mono 28 u at y 152; "A Method of Estimating
  Plane Vulnerability / Based on Damage of Survivors" 14 u at y 170 and 186 (move the lower rule to y 196).
- 21.2: ledger row 1, mono 32 u, number right-aligned at x 600, label 20 u from x 616: "400  flew" y 240.
- 23.0: "380  came home" y 282.
- 27.2: "20  never came home" y 324, red pencil. S1 returns to 100 % ink.
- 27.6: under the ledger, y 372, mono 18 u: "the 60 holed: 32 one hole · 20 two · 8 three to five".
- 32.0: red underline (1.5 u) under the "20" row; to its right a dashed 1 u box 60 by 26 u with "holes ?" 18 u.
- 35.4 to 36.0: S3 fades out.

### COUNT 36.0 to 62.0 (S4)
- 36.0 to 37.2: S1 slides into rows 16 to 18. 36.2: header "400" mono 48 u at (470, 110) + "flew · one
  square per plane" 18 u at (470, 134).
- 37.6 to 41.6: the 320 unhit cells fill rows 0 to 15 in reading order, 80 per second (one row every
  0.25 s), each fading in 0.12 s, `--ink-pale`. Counter at y 234 counts floor(filled) up to "320" + "came
  home, no holes".
- 41.8: holed label at y 412: "60" + "came home with holes".
- 42.4 to 44.0: row 19, 20 empty outlines in red pencil (1.5 u dashed), one every 0.08 s. Label at y 462:
  "20" (red) + "never came back".
- 44.0 to 45.0: rows 0 to 15 and their label dim to 35 %.
- 45.0 to 46.2: vertical ink bracket at x 440 spanning y 376 to 456. 46.2: "80 hit = 60 + 20" mono 32 u at
  (470, 330).
- 50.0: "80 hit" line crossfades (0.3 s) to "YOU   k of 80" in `--you`, mono 32 u at (470, 300), where k
  counts up as cells fill. 50.0 to 51.2 (+0.06 s per cell): k cells fill with `--you`, starting at row 19
  col 0 rightward; if k > 20 continue on row 18 col 0 rightward, then 17, then 16. No guess: line reads
  "YOU   no guess" and no cells fill.
- 52.4 to 53.6: truth: row 19's 20 cells fill solid `--red` (85 %) one every 0.06 s; cells already holding
  the guess keep a 3 u `--you` tick at their top edge so the overlap stays visible. "TRUE  20 of 80" red
  mono 32 u at (470, 344).
- 54.0: headline "1 in 4" Big Shoulders 56 u at (470, 196), "20 ÷ 80" mono 20 u at (470, 220). (Counts
  are on screen first; this is the first ratio of the film.)
- 55.8 to 56.2: YOU / TRUE lines crossfade to "YOU   g in 100" and "TRUE  25 in 100" (no guess: "YOU   —").
- 57.4: holed label rewrites to "60  home · 0 of 60 lost" (the data you had); missing label to
  "20  the data you needed" (red).
- 58.0 to 62.0: hold.

### MONDAY 62.0 to 72.0 (S4 held)
- 62.0 to 62.8: right panel clears (headline, YOU/TRUE, header fade); rows 16 to 18 dim to 50 %; row 19
  stays red; the three group labels stay.
- 62.4: the question, Big Shoulders 34 u, x 470, baselines y 150 / 190 / 230: "Before we copy the
  winners:" / "who did the same thing" / "and is not in this data?".
- 67.0: honest limit carried by caption 14 (28 u). The page's honest-limits block holds the long form.
- 71.8 to 72.0: last frame holds.

### BRAND 72.0 to 75.0
- 72.0 to 72.3: paper wipe over the stage. "CETI" wordmark line (Big Shoulders 600, 48 u, letter-spaced
  0.2 em) centred at y 240; a 1 u ink rule 200 u wide at y 262; "The data you have is the data that
  survived." 28 u centred at y 306. Holds to 75.0.

## Try-it panel (live page only)
One slider: "planes that never came home" L from 0 to 60, the survivors' data held fixed (320 unhit, 60
holed). Shows hit = 60 + L, lost of hit = L of (60 + L), per 100 = round(100L / (60 + L)); the viewer's sealed
guess drawn on the same line. At L = 20 it reads the film's 20 of 80 and 25 in 100. Optional line, from the
memo: "one hit downs a plane about 15 times in 100 (p = 0.149)" (claim c-p).

## Purity notes for the builder
Reading order means no shuffle is needed for the fills; the only randomness is the hole-dot layout,
precomputed with mulberry32(1943). Clear `style=""` and text on hidden pooled elements (opera-house NOTES
item 4). Every digit above maps to claims.json; the guess-derived k and g are recomputed live from state.
