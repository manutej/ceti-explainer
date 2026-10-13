# Ship log · 2026-10-08

Shipper: Fable. Method per film: `python3 factory/kit/build.py factory/films/<id>` from clean sources, bytes and
sha256 compared with the film's NOTES.md; then the gate re-run independently
(`node factory/tools/gate.mjs factory/films/<id>/build/<id>.html --film factory/films/<id> --kit factory/kit/kit.js
--kit factory/kit/player.js --json <scratch>/<id>.gate.json`) and its rows compared one by one with the film's
`gate.json` (SHOTS row ignored). Then `python3 factory/tools/catalogue.py`, `tests/baselines/builds.json`,
proof (vi) in `tests/proofs.sh`, `sh tests/proofs.sh vi`.

## Per film

| id | bytes | sha256 (prefix) | rebuild hash matched | gate agreed with gate.json | status |
|----|------:|-----------------|:--:|:--:|--------|
| amdahl | 1,111,964 | d400603042ad | yes | yes (PASS; G5c WARN) | shipped |
| brooks | 1,111,502 | be95e7066035 | yes | yes (PASS; G5c WARN) | shipped |
| correlated-risk | 1,110,819 | de70c74503bf | yes | yes (PASS, no WARN) | shipped |
| cost-of-delay | 1,112,568 | 85b9c679a37b | yes | yes (PASS; G5c WARN) | shipped |
| goodhart | 1,105,448 | 7280596d4b90 | yes | yes (PASS; G5c WARN) | shipped · seat SHIP |
| queues | 1,108,580 | 4743e73dcfc4 | yes | yes (PASS; G5c WARN) | shipped |
| regression | 1,114,689 | 254338240ea5 | yes | yes (PASS; G5c WARN) | shipped |
| sample-size | 1,117,559 | 836da6218b26 | yes | yes (PASS; G5c WARN) | shipped |
| selection | 1,129,864 | 83db587cf037 | yes | yes (PASS; G5c WARN) | shipped |
| simpsons | 1,109,814 | 47c5b15a2766 | yes | yes (PASS; G5c WARN) | shipped |
| streaks | 1,111,705 | 7d00abd4032b | yes | yes (PASS; G5c WARN) | shipped |
| sunk-cost | 1,108,495 | 8552cc4056be | yes | yes (PASS; G5c WARN) | shipped · seat SHIP |
| survivorship | 1,107,514 | 484bccb63f75 | yes | yes (PASS, no WARN) | shipped |
| volatility-drag | 1,112,917 | 0f1f544b53a4 | yes | yes (PASS; G5c WARN) | shipped |
| winners-curse | 1,110,017 | a4fc5a1a5374 | yes | yes (PASS; G5c WARN) | shipped |

Held: none. Full hashes: `factory/CATALOGUE.md`, `factory/catalogue.json`, `tests/baselines/builds.json`.
Thirteen films have no `seat.json` yet (goodhart and sunk-cost are seated SHIP); they ship on gate PASS and the
catalogue records that; a seat can be added without moving a hash.

## Defects found across films, for the next kit and gate revision (not fixed here)

Kit (`factory/kit/`):
1. `kit.js` sets no `data-role` on any text it draws. The gate classes untagged text by layer or by size, so
   the kit's own stamps (`commitBox` SEALED at 0.9 × 28 = 25.2 units, `chrome` slot stamps) are read as
   must-read and fail G6. Every one of the 15 films worked around it in film.js: a `tx` wrapper that sets
   `data-role`, and `data-role="secondary"` set once on the `marks` layer group (so the kit's stamp is
   secondary), or `commitBox(..., {seal: Infinity})` plus a film-drawn SEALED stamp at ≥ 28 units.
   Fix: `tx`/`stamp`/`chrome`/`caption`/`commitBox` accept and set a `role`; captions and the commit box
   `must-read`, ledger and eyebrows `chrome`, stamps `secondary` (or 28 units).
2. The kit's commit-box countdown ring digit ("4", "3") and the typed default ("10" while 100 is typed) are
   visible SVG numbers with no claim behind them; they show in every film's G5c WARN list. Tag them `chrome`
   or have the gate ignore the kit's `cb.*` keys.
3. `smoke/claims.json` is the object form `{film, claims: [...]}` while the skill tells builders to write an
   array; the gate accepts both, so this is a documentation split (SKILL.md "predates the gate's array form"),
   not a failure. Pick one shape in README/SKILL/smoke.
4. `probe.mjs` throws at its last live step when the film has no try-it panel (`#tryOut` missing); two
   builders ran a patched scratch copy. Needs a null guard. Its typed-answer fill value (55) also falls
   outside some films' commit ranges and returns null.
5. The commit HTML overlay stays at the default box position when a film moves the box (documented, but every
   film that moved it had to work around it).

Gate (`factory/tools/gate.mjs`):
6. `--kit` takes files only: `--kit factory/kit` (a directory, as this ship brief said) throws EISDIR from
   `clockScan` before any row runs. Either accept a directory (scan `*.js` in it) or fail with a usage line.
7. G5c flags every intermediate value of a running counter (rows landing, tallies, "N of M" as marks arrive);
   13 of 15 films carry 12 to 46 such WARNs, all explained in NOTES.md as counts in progress. The gate could
   accept a number that is strictly between 0 and a claimed value on the same key, or a `counts_to` claim
   field, so the WARN column means something again.
8. G5c's number regex takes one thousands group: "2,376,523" is read as "2,376" (sample-size NOTES).
9. The gate exits 1 on a FAIL only; it also exits 1 when it throws before writing `--json`, with no JSON on
   disk. proof (vi) relies on the exit code; a half-run gate should still write a JSON with `pass: false`.

Catalogue (`factory/tools/catalogue.py`): no change needed; it listed all 15 with title, duration, verdict,
bytes and sha256, and `--check` passes.
