# kit2 proof · 2026-10-08

**Claim (INTERVIEW Q6):** two shipped films rebuild under 4 brands × 4 chromes with zero edits to film.js,
film.json or claims.json, and every cell passes the gate.
**Result: 32 of 32 cells PASS** (16 per film). film.js lines that would have needed a change: **none**.

How it was run: `python3 factory/kit2/proof/matrix.py --jobs 4` (builds every cell with
`factory/kit2/build.py <film> --brand B --chrome C --out proof/build/<film>.<B>.<C>.html`, gates each with
`node factory/tools/gate.mjs <page> --film factory/films/<film> --kit kit2.js --kit player.js --kit
arsenal/materials/drawn/materials.js [--kit factory/chromes/<C>.js]`, shoots two stills per cell, writes the
contact sheets and `proof/results.json`). Gate JSON per cell: `proof/gate/<cell>.json`. The 34 pages
(~1.2 MB each) were deleted after the run to keep the repo small; `matrix.py --no-gate` regenerates them and
the sha256 column below is what a rebuild must match.

- Sources unchanged: sha256 of film.js / film.json / claims.json recorded before and after the run are equal
  (survivorship 867d01ca8d8c / 6d735f5d5f98 / 0f766629aeb8; goodhart 8cacac3b8a3e / 4c0b38ad10ba / 487786fd4a92).
  The gate reads each film's own folder (`--film factory/films/<id>`), so G4/G5/G7 judge the unchanged data.
- Byte-reproducible: all 32 pages rebuilt a second time into a scratch path; 0 sha256 mismatches.
- Every gate row equals the film's shipped `gate.json` row (SHOTS aside): G5c is still WARN for goodhart
  (running counters, SHIP defect 7, a gate matter) and PASS for survivorship. kit2 removed one goodhart G5c
  item: the partially typed default "10" (SHIP defect 2). Nothing was added.
- Brand packs: `python3 arsenal/tools/brand_check.py arsenal/brands/{ceti-dark,tender-set,swiss-grid,neon-lab}.json`
  → 4 of 4 PASS. build.py also prints role contrast per page (`contrast on paper:` in its output). The gate
  has no colour row (Q5 asks for "gate rows that never read a colour"), so contrast lives in brand_check and build.
- Contact sheets (rows: brands, columns: chromes; each cell = count beat at count.at + 19 s | brand card at
  dur − 1): `proof/survivorship-matrix.png`, `proof/goodhart-matrix.png`. I looked at both and at full-size
  stills of the ledger and memo cells (below: what I saw).
- One run note: in the first full run, one cell (goodhart · ceti-dark · tender-set) FAILed G5a with "formula
  throws Script execution timed out after 200ms": the gate's claims sandbox timed out under 6 parallel gates.
  Re-gated serially, it passed; the final run (4 parallel) passed all 32 first time.

## Matrix verdicts

| film | brand | chrome | verdict | G2a/G2b purity | G6 legibility | G7 counts first | G5c | bytes | sha256 |
|---|---|---|---|---|---|---|---|---:|---|
| survivorship | ceti-dark | tender-set | PASS | PASS/PASS | PASS | PASS | PASS | 1,192,962 | 944907244bcb |
| survivorship | ceti-dark | ledger | PASS | PASS/PASS | PASS | PASS | PASS | 1,192,613 | 090f31ed9fdf |
| survivorship | ceti-dark | memo | PASS | PASS/PASS | PASS | PASS | PASS | 1,192,460 | 1539ff01fa74 |
| survivorship | ceti-dark | none | PASS | PASS/PASS | PASS | PASS | PASS | 1,179,865 | d3f6d46a0e12 |
| survivorship | tender-set | tender-set | PASS | PASS/PASS | PASS | PASS | PASS | 1,154,911 | 42a66d599dc2 |
| survivorship | tender-set | ledger | PASS | PASS/PASS | PASS | PASS | PASS | 1,154,562 | 9158c804abcf |
| survivorship | tender-set | memo | PASS | PASS/PASS | PASS | PASS | PASS | 1,154,409 | b91d26d9c20e |
| survivorship | tender-set | none | PASS | PASS/PASS | PASS | PASS | PASS | 1,141,814 | 8eafc5d631cd |
| survivorship | swiss-grid | tender-set | PASS | PASS/PASS | PASS | PASS | PASS | 1,148,816 | e48911b8d927 |
| survivorship | swiss-grid | ledger | PASS | PASS/PASS | PASS | PASS | PASS | 1,148,467 | 88ca9b365f32 |
| survivorship | swiss-grid | memo | PASS | PASS/PASS | PASS | PASS | PASS | 1,148,314 | 801d975e884d |
| survivorship | swiss-grid | none | PASS | PASS/PASS | PASS | PASS | PASS | 1,135,719 | 4dc17075e1c1 |
| survivorship | neon-lab | tender-set | PASS | PASS/PASS | PASS | PASS | PASS | 1,220,762 | aefb95a85055 |
| survivorship | neon-lab | ledger | PASS | PASS/PASS | PASS | PASS | PASS | 1,220,413 | 1bb75f4a4a97 |
| survivorship | neon-lab | memo | PASS | PASS/PASS | PASS | PASS | PASS | 1,220,260 | 631436166d51 |
| survivorship | neon-lab | none | PASS | PASS/PASS | PASS | PASS | PASS | 1,207,665 | ce10f60a5310 |
| goodhart | ceti-dark | tender-set | PASS | PASS/PASS | PASS | PASS | WARN | 1,190,896 | 97f82056f568 |
| goodhart | ceti-dark | ledger | PASS | PASS/PASS | PASS | PASS | WARN | 1,190,547 | bffa3786d0ff |
| goodhart | ceti-dark | memo | PASS | PASS/PASS | PASS | PASS | WARN | 1,190,394 | e650d56b7ae6 |
| goodhart | ceti-dark | none | PASS | PASS/PASS | PASS | PASS | WARN | 1,177,799 | 9154d1370dad |
| goodhart | tender-set | tender-set | PASS | PASS/PASS | PASS | PASS | WARN | 1,152,845 | a230602104fc |
| goodhart | tender-set | ledger | PASS | PASS/PASS | PASS | PASS | WARN | 1,152,496 | 45707f60ccff |
| goodhart | tender-set | memo | PASS | PASS/PASS | PASS | PASS | WARN | 1,152,343 | d3c0ae2e07f0 |
| goodhart | tender-set | none | PASS | PASS/PASS | PASS | PASS | WARN | 1,139,748 | e8fdaabba7df |
| goodhart | swiss-grid | tender-set | PASS | PASS/PASS | PASS | PASS | WARN | 1,146,750 | 3568be23ce73 |
| goodhart | swiss-grid | ledger | PASS | PASS/PASS | PASS | PASS | WARN | 1,146,401 | 0a561250e9b3 |
| goodhart | swiss-grid | memo | PASS | PASS/PASS | PASS | PASS | WARN | 1,146,248 | 821655211225 |
| goodhart | swiss-grid | none | PASS | PASS/PASS | PASS | PASS | WARN | 1,133,653 | d7407b9cb183 |
| goodhart | neon-lab | tender-set | PASS | PASS/PASS | PASS | PASS | WARN | 1,218,696 | 6832703a3158 |
| goodhart | neon-lab | ledger | PASS | PASS/PASS | PASS | PASS | WARN | 1,218,347 | 143ac1d2d230 |
| goodhart | neon-lab | memo | PASS | PASS/PASS | PASS | PASS | WARN | 1,218,194 | 0d185a8eb887 |
| goodhart | neon-lab | none | PASS | PASS/PASS | PASS | PASS | WARN | 1,205,599 | 9b81ec42f095 |
Material axis (not part of the 32; same unchanged film.js):

| film | brand | chrome | material | verdict | purity | G6 |
|---|---|---|---|---|---|---|
| goodhart | tender-set | tender-set | pencil | PASS | PASS/PASS | PASS |
| goodhart | ceti-dark | tender-set | chalk | PASS | PASS/PASS | PASS |

Stills: `proof/stills/goodhart.tender-set.tender-set.pencil.t55.png`, `…ceti-dark.tender-set.chalk.t55.png`.
The 1,000 canvas squares are drawn by arsenal/materials/drawn (hachure in pencil, dusty strokes in chalk),
reached through the K.ctx proxy; film.js still calls `ctx.fillRect`.

## film.js lines that would have needed a change

None. Lines that still bind each film to a look (they work under kit2, unchanged, but they are why the look
is not fully free; see README "What still binds a film to a look"):

| file:line | binding | what kit2 does about it |
|---|---|---|
| survivorship/film.js:9 `const YOU = F.you \|\| '#2D5DA8'` | a hex colour from film.json, not a role: 2.9:1 on ceti-dark, 3.1:1 on neon-lab | text fills that are not roles are lifted toward ink until 4.5:1 on the ground (`guardFill`); the canvas squares keep the hex |
| survivorship/film.js:10 `GX = 48, GY = 110 …`; goodhart/film.json `grid.x0 56`, film.js:43 `RX = 56`, :125 `CX = 482` | absolute positions in the kit's 960×540 sheet (content 48–664 × 104–400, commit box 700,150) | chrome furniture is cut out of that box (`WIN_CONTENT`, and the commit box during COMMIT); the film is not moved into ledger/memo `layout.safe` |
| both films: `fam: 'disp', size: 56/40/36` at fixed x | positions tuned to Big Shoulders' condensed advance (0.332 em) | display text is set smaller by the measured advance ratio when the pack's face is wider (Jost 0.512 → ×0.65), floored at 28/14/12 |
| survivorship/film.js:36, :41; goodhart/film.js:28, :33 | the SHIP defect 1 workaround: `data-role` set on text and on the marks layer group | harmless: kit2 now tags its own text (stamp, commit box, countdown, captions, chrome) itself; the films' tags still win where they set them |

## What I saw on the sheets

- tender-set chrome: unchanged geometry under all four brands; ledger highlight now uses the panel surface,
  so the accent row reads on dark packs. Brand card: the dark role (ink #1E3A5C for tender-set, #111111 for
  swiss, bg for the dark packs) with onDark type.
- ledger chrome: ruling, margin and audit rules split around the film's content box; the PARTICULARS head
  and the TALLY column inside the box are not drawn; the slot stamp sets at 14 units (the chrome asks 13).
  Caption in the brand's display face on the last rule.
- memo chrome: MEMORANDUM head, TO and DATE fields, the double rule right of the content box, the red-pencil
  margin rule. The RE: title, FROM and FILE fields fall inside the content box and are not drawn: the memo
  loses its title line under a kit-layout film (eyebrow keeps the chapter).
- none: brand ground, film, caption, and the plain brand card with the pack's `voice.end_card`.
- swiss-grid (Jost, wide): "1 in 4" at 36.3 units clears "20 ÷ 80"; before the metric ratio it overlapped.
- Migration (`--brand film`, tender-set chrome) vs the shipped kit build: 1.5–2.9 % of pixels differ by > 24
  levels at 12/55/74 s, because the tender-set chrome module's title block sits at y 336 (kit 312) and its
  caption at y 474 (kit 480), and the brand card wordmark is placed by the chrome.
