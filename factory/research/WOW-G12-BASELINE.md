# WOW-G12-BASELINE · gate row G12 "rhythm" on the six wave films (2026-10-11, Wave WOW lane B3)

Measured with `node factory/tools/gate.mjs <page> --film <dir> --kit factory/kit2 --quick --no-overlap` on the pages
as shipped (page hashes unchanged by this lane; `sh tests/proofs.sh vi` passes, every catalogue hash SAME). G12 is static
(film.json only) and WARN-only (D16); none of the six films sets `beat`, so the grid column is "if beat 0.5 s" (120 bpm,
15 frames; tolerance ±2 frames at 30 fps = ±0.067 s). Full lists are in each gate.json row G12 (`data.holdFail`,
`data.dead`, `data.moves`).

Rules: grid events = every caption start + every move start (knobs named `…T0` or `t<Upper|digit>…` with a value in
[0, dur], minus names that end a move; plus `rig.moves[].t0`; one event per time). Caption hold = `t1 − t0` ≥ 1.3 s +
0.06 s × characters. Dead hold = no caption start/end, time-like knob, rig move or CETI card cut for > 8 s (0 and dur bound).

| film | captions | hold rule met | caption starts on 0.5 s grid | moves on grid | pooled (want ≥ 80 %) | dead holds > 8 s |
|---|---|---|---|---|---|---|
| who-gains | 23 | 21/23 | 11/23 | 2/2 | 13/25 = 52 % | 12.4–21.6 s (9.2), 34.0–43.8 s (9.8) |
| pass-every-time | 30 | 15/30 | 8/30 | 7/11 | 15/41 = 37 % | none |
| one-query | 29 | 24/29 | 4/29 | 5/9 | 9/38 = 24 % | none |
| noether-symmetry | 45 | 7/45 | 14/45 | 15/37 | 29/82 = 35 % | 141.6–150.0 s (8.4) |
| noether-applied | 32 | 10/32 | 16/32 | 14/15 | 30/47 = 64 % | 141.5–150.0 s (8.5) |
| noether-frontier | 33 | 11/33 | 3/33 | 19/19 | 22/52 = 42 % | 141.5–150.0 s (8.5) |

The hold counts equal the gap audit's P22 caption counts (wg 21/23, pet 15/30, oq 24/29, ns 7/45, na 10/32, nf 11/33),
so the row and the audit measure the same thing. Failing captions: wg 2, pet 15, oq 5, ns 38, na 22, nf 22. Worst
shortfalls (hold vs need): pet @97.2 s 2.6 s vs 4.36 s; oq @95.8 s 3.2 vs 4.30; ns @10 s 1.9 vs 4.00; na @44.5 s 2.3 vs
4.24; nf @112.1 s 2.85 vs 4.30.

What the numbers say:
- No film reaches 80 % at 0.5 s; the nearest is noether-applied (64 %). Moves are already on a 0.5 s grid in three films
  (noether-frontier 19/19, noether-applied 14/15, who-gains 2/2) because their authors typed whole seconds; the captions
  are the problem (3/33 to 16/32 on the grid, typed at 0.2–0.6 s offsets such as 0.8, 6.2, 12.4).
- Off-grid moves to retime: pass-every-time prT0 99.8, min27T0 120.8, min289T0 126.6, bookT0 135.4; one-query ladderT0
  34.6, camObliqueT0 82.8, camDriftT0 88.6, revealT0 99.2; noether-applied stirT0 111.8; noether-symmetry has 22 of 37
  (tBar2 5.4, tVp 17.8 … tHonest 141.6, a 2.8 s metronome).
- who-gains has only two knobs that match the move-start names; its other starts (arrive0, lit0, move0, the pins) are not
  covered by the name rule, so its 52 % is a floor on the captions and a gap on the moves. Naming them `…T0` brings them in.
- Dead holds: the three Noether films end on the honest line for 8.4–8.5 s (141.5 to the card at 150 s); who-gains holds
  one 9.2 s and one 9.8 s caption/camera stretch with no timed event inside (a move in progress is not an event: only its
  start and its end count).
- Caveat on "dead": the row is literal (captions and timed knobs). A long continuous camera move is motion, but it is also
  the 4.5–11 s cubic move the gap audit asks to replace by 0.8–1.6 s spring moves with a hold after landing.

Reproduce: the six JSONs come from the command above; `python3 -c` over `rows[id==G12].data` gives every number here.
