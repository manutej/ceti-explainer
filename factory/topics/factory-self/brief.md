# The factory, counted · brief

id: `factory-self` · room: manager (a funding review) · format: feature, 90 to 120 s material + 3 s CETI card (factory/FORMAT.md; factory/kit2 `format: feature`)
explorer: atelier-brief (Sonnet) · read at commit `f886f1a` (`.git/HEAD`, read as a file; no git run) · working tree, 2026-10-10

Slots: Subject {kind: repo, name: ceti-explainer, source_material: HANDOFF.md, factory/CATALOGUE.md, factory/films/simpsons-3d/PROTOTYPE.md, factory/kit2/PROOF.md}
· Look {brand ceti-dark, chrome ledger, material ink, renderer 2d, level manager} · Chain in beats.md.

## The belief
"An explainer factory is a pile of films. Funding it means funding one custom production after another."

## The everyday situation (HOOK, 0 to 9 s)
A repo link arrives before a funding review: fund it, freeze it or fold it. There is no time to read code. The README's
first line is all most people see, and it describes an older course (claim `readme-line`), not the factory.

## The gap (the reversal)
Belief predicts: the films are the repo, so film folders hold the majority of the files.
The count shows: film folders hold 31 files in every hundred, and 757 of those 918 belong to one prototype kept as evidence;
the other 16 film folders hold 161 files, and a median film folder is 9 files. The majority is the machine every film reuses. A film is 3 source files on a
machine that has already passed 32 of 32 restyle builds with zero film edits.

## The mechanism
Every film is film.js, film.json and claims.json, inlined by kit2 (`source-files-per-film`) into a page that shares the
kit, the 22 brand packs, the chromes and one 10-row gate. The count draws every file in the repo as a mark, grouped by
layer: the film folders are a small block beside a large shared block. The second count draws the 32 rebuild cells
(2 films, 4 brands, 4 chromes): the same sources, 32 looks, 0 edits.

## The fixture: this repository at one commit
- What it is (HANDOFF.md section 2): a Claude Code plugin that turns a topic into a short, true, silent, captioned film on a
  pure clock, in three layers: the factory (factory/), the arsenal (arsenal/), the record (docs/).
- 17 film folders, 17 gate.json with `pass: true`, 17 PASS rows in factory/CATALOGUE.md.
- Heaviest build measured: simpsons-3d (3D, webgl): 55 min wall, about 1.48 M tokens, three drafts, one blind select, two fix rounds.
- Restyle proof: 32 of 32 cells PASS, 0 film edits (factory/kit2/PROOF.md); simpsons-3d under 3 new packs, 0 film edits, 4 s per pack (PROTOTYPE.md P3).

## The numbers
Every number has an entry in `claims.json`: a `recompute` shell command run from the repo root (read-only: find, grep, sed, cut,
python3; no git), a `formula` over other claim ids (underscores for hyphens), or a document `source` with a `recompute` grep
that the quoted phrase is still there. The file counts are of the working tree and exclude `.git`, `__pycache__` and this topic
folder; they move with every new file, so the film must read the frozen values, not the commands.

| claim id | what | value | source or formula |
|----------|------|------:|-------------------|
| files-total | files in the working tree | 2,932 | find (recompute) |
| files-films-shipped | files in the 16 film folders except simpsons-3d | 161 | find |
| files-prototype | files in factory/films/simpsons-3d | 757 | find |
| files-films-folder | files in any film folder | 918 | files_films_shipped + files_prototype |
| files-machinery | shared machinery (kit, kit2, tools, chromes, arsenal, runtime, scripts, tests) | 1,157 | find |
| files-vendor / files-rest | vendored p5 and fonts / everything else | 56 / 801 | find / formula |
| films, films-gated, catalogue-pass | film folders, gate.json pass, PASS rows | 17, 17, 17 | find, python3, grep |
| film-files-median | median files in a film folder | 9 | python3 over os.walk |
| source-files-per-film | film.js, film.json, claims.json | 3 | S5 sentence + grep |
| gate-rows | G1 to G10 | 10 | grep in gate.mjs |
| p1-wall-min, p1-tokens | simpsons-3d end to end | 55 min, 1.48 M | S3 total row + grep |
| proof-cells | 2 films x 4 brands x 4 chromes, all PASS | 32 | formula + S4 grep |
| proof-film-edits | edits to any film source in the proof | 0 | S4 grep |
| share-films-folder | film folders per hundred files | 31 | round(100 * 918 / 2932) |
| share-typical-film | a median film folder, percent of all files | 0.3 | round(100 * 9 / 2932, 1) |
| commit-default | film-mode guess | 60 | reasoning (below) |

## The count (55 to 104 s)
Count A: each mark is one file. n = 2,932 (`files-total`), under the ~3,000 point where `mass` is needed; a mark is about 10
units on the 960 by 540 stage (legible, above 7). The wall lands, then splits into five groups (films 161, prototype 757,
machinery 1,157, vendor 56, rest 801) before any share appears.
Count B: each mark is one rebuild cell, n = 32 (`proof-cells`), a 4 by 8 grid that fills with PASS, zero film edits.
The counts land first (55 to 78 s, 85 to 93 s); the ratios `share-films-folder` and `share-typical-film` come after.

## The commit (9 to 17 s)
Question, as the viewer reads it: "Of every hundred files in this repository, how many sit inside a film's own folder?"
Unit: files per hundred · range 0 to 100 · film-mode default guess: 60, because the belief is "mostly films". This is
reasoning, not a survey: no published number exists for what a manager guesses here. Nothing numeric from the answer is
shown before the commit. The truth the guess is placed against is `share-films-folder` = 31.

## Monday (104 to 112 s)
The one question to ask at work: "For the next film request, how many of its files are new, and how many are already built?"
Honest limit (what the case is not): a gate pass proves the format and the arithmetic, not that a film changes a decision; the
two cohort experiments (docs/DECISIONS.md Q12) are deferred.

## Takeaway (brand card)
Fund the machine once. A film is 3 files.   (41 characters; `source-files-per-film`)

## Sources (at least 3)
- [S1] this repository, ceti-explainer, working tree read at commit f886f1a, 2026-10-10 (file counts: the `recompute` commands in claims.json)
- [S2] factory/CATALOGUE.md and factory/README.md line 3, generated by factory/tools/catalogue.py, 2026-10-08 (17 PASS rows; the 30-minute target)
- [S3] factory/films/simpsons-3d/PROTOTYPE.md, P1 and P3 measurements, 2026-10-08 (55 min, 1.48 M, 0 film edits)
- [S4] factory/kit2/PROOF.md, kit2 proof, 2026-10-08 (32 of 32 cells, none needed a film change)
- [S5] skills/atelier-draft/references/chain-recipes.md section 3 (kit2 inlines film.js, film.json, claims.json) and factory/tools/gate.mjs (rows G1 to G10)
- [S6] HANDOFF.md sections 2 and 7, 2026-10-08 (three layers; the honest open-issues list)
- [S7] docs/DECISIONS.md, Q12, Q13, D10; factory/FORMAT.md (the binding format)

## Not this
- A tour of the arsenal's 23 pattern lanes or 22 brand packs: a catalogue, not a belief that breaks.
- A lines-of-code or commit-velocity story (the earlier machine-read topic `ceti-explainer-self` does that): it shows the repo is alive, not why it is cheap to extend.
- A dollar figure per film: the repo holds none (only P1's 1.48 M tokens and a 30-minute target), so none is claimed. Slot to resolve before drafting if the room needs money.
- The prototype's 757 files presented as "films": they are drafts and frame strips of one film; the wall colours them apart.
- Success rate of the gate as a quality proof: only films that pass are in the catalogue, so 17 of 17 is not evidence of quality (the honest limit says so in one line).
