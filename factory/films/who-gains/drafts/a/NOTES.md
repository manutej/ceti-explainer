# who-gains · draft A · "the floor" · NOTES (2026-10-10)

Look (beats.md): brand ceti-neosage-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153
(150 s + card), `commit: {enabled: false}` (D11), chapters HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150, count.at 22.0.

## Register
A support floor seen from a high corner (perspective, fov 22, el 34, a calm 2.5 degree sway): 5,179 agents are a city of boxes on a
dark grid floor. Encoding, said on stage: one box = one worker, LIT HEIGHT = the group's gain on one shared floor line (drawn as
gain / gainFull of the boxes lit; not head-count, not a claim). The split by skill quintile is the floor re-sorting itself: three
zones outlined on the floor, every box travels, the camera quarter-turns (az 38 -> 90). The METR close-up is one desk: a hard cut
after a descent onto one developer box; 16 dots, 246 issue columns, the forecast as a ghost wire box BESIDE the measured block, a
dashed baseline loop over both, a 76 -> 119 style tilt from plan (the belief) to elevation (the stopwatch).

## Chain (narrowed, never widened): gl-stack-city + gl-camera-rig + gl-labels (track-unit not used)
- gl-stack-city: four states from one module (agents 5,179 split by skill; developers 4,867 pooled only; METR 246 as columns via a
  `uTall` mode in the film's own shader; one lone box for the HOOK). Own shader, colours pre-shaded per face. `tag` = one agent chosen
  in setup (second setup) so its box stays on an outside face in both views; module `drawTags` draws trail, ghost, outline.
- gl-camera-rig: the whole camera is lib/cam.base.json (7 moves incl. 3 cuts); `fromKnobs(K.knob)` in the film, `toKnobs` at
  authoring (lib/camknobs.mjs, 54 camera knobs). The pull-back after the look-at is a `key` move onto the m1 pose (T8: lands identically).
  Moves: m1 orbit 34-44 (re-partition, 52 deg, held invariants I1-I5); m3a look-at 60-63.5 then `back` 64.5-68 (follow one mark);
  m5 orbit 96-101.4 (descent onto one box); m6 orbit 116-124 (plan -> elevation). Cuts at 76, 101.5, 135 (bookend). Gaps >= 8 s.
- gl-labels: every pin through `solve` on the rig's own camera (`sticky:'window'`, reserve = header, ledger/legend, caption band
  y >= 420); drawn as kit2 SVG with data-role (own drawPl: main and sub lines fade separately; labels cut off at each move).

## Patches (assembled copy only; lib/ copies verbatim; lib/assemble.py CUTS)
Same three gl-stack-city patches as women-and-children draft A (pooled column in rate form, arriveBy 'slab', export of
phase/boxAt/check/drawTags) plus cut demo/shader/camera/pins/HUD. gl-camera-rig: demo scene cut, registration reduced to `rig`.
gl-labels: demo cut. `check(t)` reports ok:false only during slab arrival (patch 2), as in women-and-children.

## Decisions worth a second look
- Middle three fifths: lit height from the derived 12 (grade B, no digit); per-quintile numbers beyond 34 and about 0 are not drawn.
- Developers: pooled only (F3); `+26 %` shown rounded (claim 26.08). No junior/senior ranges, no METR follow-up numbers, no CI.
- The "METR · 2025 · follow-up 2026: too biased to size" tag is chrome (12 units) under the header, as the beat sheet says.
- stack-city's module clock must not reach 1.0 for the developer and METR states (move beat would fire): their `dur` is 400.
- Extra on-stage words: LIT HEIGHT legend, ONE BOX = ONE AGENT (DEVELOPER), ARM MEAN, NOT PER ISSUE; no new digits.

## Gate
Final run: VERDICT PASS, G11 text overlap PASS (307 samples, no overlap, nothing across the caption band). WARN: G5c 18 numbers in
progress (the ledger counters 344 ... 3,209 while boxes drop in; final values are claims) and the phone-390 scrollWidth overflow
(shell, as in every film). s/frame 1.05 (frames.mjs, shared machine; limit 1.5). Page 1.289 MB (< 1.3), film code 103.7 KB
(film.js 71.5, film.json 23.0, claims.json 9.2). 158 knobs (54 from the rig's toKnobs). film.js byte-reproducible from lib/
(`sh lib/build.sh` = mkfilm.py + assemble.py + kit2 build). Sample: sample/sample.mp4 (first 10 s, 30 fps; the gif step errors, ignored).
Rows to rebuild film.json: lib/mkfilm.py (hand knobs, captions, honest line); camera script: lib/cam.base.json.
Open: the dolly end frame (t 99-101) is a wall of amber boxes by design; the horizon seam of the floor shows in the elevation view.
