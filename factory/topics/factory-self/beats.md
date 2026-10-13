# The factory, counted · beats

id: `factory-self` · format: feature · dur 115 s = material 0 to 112 s + CETI brand card 112 to 115 s (G4a wants material 90 to 120)
level: manager · renderer: 2d · look: brand `ceti-dark`, chrome `ledger`, material `ink` (the packs ship in arsenal/brands, chrome in factory/chromes)
commit.at 10 s (sealed at 14.5 s; G4c 8 to 16) · count.at 55 s · at most four visual structures; the brand card is not one
Windows follow the shipped feature precedent factory/films/wiring-and-the-whole/film.json (HOOK 0 to 9, COMMIT 9 to 17, CASE 17 to 55, COUNT 55 to 104, MONDAY 104 to 112).

Chain (draw order, from skills/atelier-draft/references/chain-recipes.md R1, R2): core/timeline (chapters and local time) ->
structures.grid (the wall) -> structures.transition (same marks, five groups) -> structures.columns (group bars, same pitch)
-> annotations (bracket on the film block, callout for the guess; labels at least 14 units) -> structures.grid (the 4 by 8 cell grid).
Fallback (R1): structures.grid plus one fillRect loop per colour. Do not use `mass`: n = 2,932 is under 3,000; if a rebuilt n passes
3,000 use `mass` impl canvas2d. Knobs (name them, never numbers): markShrink, stagger, arc, tArrive, tSort, groupGap, hlRole, colGap.
Freeze every count from claims.json at draft time; never re-run the finds inside the film.

## Structures (at most 4)
1. S-A The review sheet: a repo-link card and a ledger line (HOOK, MONDAY). Text only, no digit in HOOK.
2. S-B The commit box: files per hundred, 0 to 100, countdown 8..1, then SEALED (COMMIT).
3. S-C The file wall: one mark per file, true scale (CASE as 17 film bundles of the same marks; COUNT A as 2,932 marks in five groups).
4. S-D The rebuild grid: 32 cells, 4 by 8, one per proof build (COUNT B).

## Beat table

| # | beat | window | on screen (structure) | focal motion | claims used |
|---|------|--------|-----------------------|--------------|-------------|
| 1 | HOOK | 0 to 9 s | S-A: a link card "ceti-explainer"; the README line fades in beside folder names | the card slides in, a "fund / freeze / fold" ledger line types | none (no digit) |
| 2 | COMMIT | 9 to 17 s | S-B: "files per hundred" 0 to 100, countdown, SEALED, collapses to a chip | the default 60 inks at 15.0 s | commit-range, commit-default (inputs only), hold |
| 3 | CASE | 17 to 55 s | S-C as 17 bundles, then one bundle opened to 3 source files; the gate as a 10-row strip | 17 bundles drop in (26.8 s), each lights once; a bundle opens to film.js, film.json, claims.json (38.8 s); a timer bar for the 3D prototype (46.8 s) | commit-short, films, films-gated, source-files-per-film, gate-rows, p1-wall-min, p1-tokens |
| 4 | COUNT A | 55 to 85 s | S-C: 2,932 marks pour in, then regroup into five blocks, the film block bracketed | wall lands (55.4 s), transition to groups (63.8 s), machinery bar (71.8 s), the guess chip placed on a 0 to 100 strip against the truth (78.6 s) | files-total, files-prototype, files-films-folder, files-machinery, share-films-folder |
| 5 | COUNT B | 85 to 104 s | S-D: 32 cells fill PASS in a sweep; a single film bundle shrinks to its true share beside the wall | cells light row by row (93.8 s); the median bundle outlined at true scale (98.8 s) | proof-films, proof-brands, proof-chromes, proof-cells, proof-film-edits, film-files-median, share-typical-film |
| 6 | MONDAY | 104 to 112 s | S-A: the question on the ledger; one honest-limits line | the question types; the limit line sits under it | (none) |
| - | BRAND | 112 to 115 s | the kit's CETI card | | takeaway: Fund the machine once. A film is 3 files. |

## Captions (28 units, at most two lines of ~50 characters; every digit is a claim id in brackets)

| id | t0 | t1 | text |
|----|---:|---:|------|
| c1 | 0.6 | 4.4 | A repo link lands before the funding review. |
| c2 | 4.6 | 8.6 | No time to read code. Fund it, freeze it, fold it? |
| c3 | 9.4 | 16.6 | Of every hundred files here, how many sit inside a film's own folder? |
| c4 | 17.4 | 26.6 | The repo itself, read at commit f886f1a. [commit-short] |
| c5 | 26.8 | 38.6 | The catalogue lists 17 films. Each has a passing gate. [films, films-gated] |
| c6 | 38.8 | 46.6 | The gate runs 10 checks. A film is 3 source files. [gate-rows, source-files-per-film] |
| c7 | 46.8 | 54.6 | The 3D prototype took 55 minutes and 1.48 million tokens. [p1-wall-min, p1-tokens] |
| c8 | 55.4 | 63.6 | One mark is one file. The wall lands at 2,932. [files-total] |
| c9 | 63.8 | 71.6 | Film folders hold 918. 757 are one prototype's drafts. [files-films-folder, files-prototype] |
| c10 | 71.8 | 78.4 | The shared machine holds 1,157. [files-machinery] |
| c11 | 78.6 | 85.6 | Film folders: 31 per hundred files. Where was your guess? [share-films-folder] |
| c12 | 85.8 | 93.6 | Same sources, 4 brands, 4 chromes, 2 films. [proof-brands, proof-chromes, proof-films] |
| c13 | 93.8 | 98.6 | 32 rebuilds. 0 film edits. [proof-cells, proof-film-edits] |
| c14 | 98.8 | 103.6 | A typical film adds 9 files: 0.3% of the repo. [film-files-median, share-typical-film] |
| c15 | 104.4 | 108.0 | Next film request: how many files are new? |
| c16 | 108.2 | 111.6 | Limit: a pass proves the format, not that a film changes a decision. |

## Checks before building
- [x] Every digit in a caption has a claim (`renders` in claims.json); c4 hash and c1 to c3, c15 to c16 carry none from Claims (c3 says "hundred" in words).
- [x] Counts first: no ratio, percentage or "N per hundred" before count.at 55 s, and none before its count lands (first share at 78.6 s, after the wall at 55.4 s and the groups at 63.8 s). "17 films" (c5) is a count.
- [x] Nothing derived from the viewer's answer before the seal (commit.at 10 s + 4.5 s); the guess meets the truth only at 78.6 s.
- [x] Four structures; no full-screen card except the brand card.
- [x] One honest limit (c16). Sources: 7 (>= 3). All recompute commands re-run and matched at write time.
- [ ] Open for the user: a money number per film (none in the repo); a sourced default guess; whether the 30-minute target (agent-target-min, not on screen) is measured anywhere.
