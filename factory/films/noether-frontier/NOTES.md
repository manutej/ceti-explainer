# noether-frontier · draft A · "the observatory, continued"

Look and chain (beats.md header): brand ceti-coastal-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153, commit off (D11).
Register: the same dark sky as Part 1. Dots of about 1 world unit (dotR 1.1, dotRNet 1.0), tens of thousands (30,000 + 24,000), the six spin shells with a thin
outline ring each (the sphere's silhouette), the training cloud as a second observatory (5 flat layers with thin plate outlines), the toy and the question tree as
boxes on one plate. Chapters HOOK 0-12 · CASE 12-62 · COUNT 62-135 · MONDAY 135-150 · card 150-153; count.at 21.0; first ratio "more than 30 %" at 115.1.
Moves (R-E sentences in the brief): M0 12-20 re-project shells -> tangle (orbit +50 deg), M1 28-36 tangle -> shells (orbit back, same HOOK frame), M2 62-70 P -> C
(orbit +60 deg, el 22 -> 15), M3 88-96 C -> C' bigger steps (el 15 -> 6, dolly -12 %); cuts at 50.5, 98.5, 119; swap 131-134; ease to the wide frame 135-141.

## Chain (and what was changed)
- gl-pointcloud: PATCHED COPY #2 (lib/gl-pointcloud.js, header says what), from Part 1's patched copy (id-stable morph home -> aTo -> aTo2 via m1, m2). Added: a COMET (feature
  rank lights a point by the head uF; uFLen > 0 makes it a moving trail, uFBase keeps ranked points a little lit), uDim as the GHOST of a whole group. Removed: ring mode,
  shell sweep, DoF, HUD, pins, axes, synthetic data, module camera. Group 0: home = spin shell, aTo = where it is, aTo2 = shell again (spin -> place -> spin).
  Group 1: home P = (a, b, time), aTo C = (a, b, a^2 - b^2) small step, aTo2 C' = the big step. Same marks, same count; no dot added, removed or faded in a move.
- gl-instances -> lib/gl-boxes.js: NOT the arsenal module (built for 10k-100k marks with GLSL 300 es and a data texture). A 40-line module of one baked unit box, one flat
  shader and one model() call per mark (about 45 boxes in all); swap of two ids and the ring on one id are positions and a drawn loop, pure of t.
- gl-camera-rig and gl-labels: NOT used (as in Part 1 v2): a shot list with cuts and eased moves (every pose a knob) and one lens shift in film.src.js; the one pin
  (CANDIDATE) is placed from `worldToScreen` and a fixed word position. Saves about 60 KB of film code.
- formula-bind not used (the toy's sum is a static panel line, digits are claims).

## Data (lib/data.js, made by lib/mkdata.py; the film trains and searches nothing)
orbits: Part 1's orbit_table.json as spin direction + angle + phase at 12 bits (3.0 KB), rebuilt with the Kepler solution (Newton, 60 iterations): 300 x 100 = 30,000 dots.
neurons.json (238 KB) -> 480 units x 4 series x 50 moments at quantum 0.01 (worst error 0.005), second differences as zigzag varints, raw DEFLATE, base 64: 25.2 KB,
inflated in setup with DecompressionStream (Chromium, Firefox, Safari 16.4+). tree: level, parent, x (0.2 KB, titles never stored). toy: the six orders and the toy
model's six answers x10 (colours only, never digits). Resolution caveat: c = a^2 - b^2 of the small step carries up to about 0.01 of quantisation noise (the real small-step
median drift is 0.0005, max 0.007), i.e. layer thickness about 1 world unit; the big step's 0.10 median drift is 9 units. recompute.py was not re-run (data used as stored).
Choices: the recall "spin" picture is Part 1's (direction = where the planet is, distance = spin L), so an orbit's 100 dots are a great circle on its shell and its dot
slides along it; layers are plotted at height = a^2 - b^2 with x = a, z = b (time -> sum changes ONLY the height). (a, b) lie near the diagonal a = b, so the cameras
sit near az -45 deg (net az -75 -> -15) to see the ribbon side-on.

## Text (no text moves; one panel, one caption band, one corner tag, one pin)
film.json carries the text as data: `tags` (8, hard-cut, each from the first frame of its picture), `lay` (axis words under the tag), `panel` (the readout schedule:
t0, t1, kind, text, baseline, colour, size), `monday` (2 lines), `honest`. Captions are beats.md's c1-c33 with nine re-worded to <= 48 characters so none wraps (c3, c10,
c13, c20, c26, c27 "Reordering cost more than 30 % in some tests.", c28, c32, c33); no digit added. Honest sentence and Monday question are set type in the caption band's place
(no caption under the honest line). The panel changes only at a settle; at most two result numbers on screen ("4 . 8 . 7" is one line).

## Gate, size, cost
gate.json: VERDICT PASS, G1-G11 all PASS (G5c PASS too: every on-screen number is a claim); G11 clean (307 samples, no overlap, nothing across the caption band).
Page 1,261 KB (< 1.3 MB; the vendored p5 is 990 KB of it, not droppable by a film); film code 82.4 KB (film.js 47.1 + film.json 19.9 + claims.json 15.4).
99 knobs (all in film.json knobs_doc; times of the moves and cuts, scales, camera poses, dot and light, toy and tree, type positions). Panel, tag and lay times are film.json data.
s/frame 0.348 (frames.mjs, 307 frames, SwiftShader, 1920x1080; purity identical); setup about 3 s. Rebuild: `sh factory/films/noether-frontier/drafts/a/lib/build.sh` (mkfilm -> assemble -> kit2 build); assemble.py twice = identical film.js.
Commands: python3 factory/kit2/build.py factory/films/noether-frontier/drafts/a --brand ceti-coastal-dark --chrome none --material ink ;
node factory/tools/gate.mjs <page> --film <dir> --kit factory/kit2 --json <dir>/gate.json ; node factory/tools/frames.mjs <page> --every 0.5 --out <dir>/frames

## Warnings left, written down
- Not verified here (egress, brief F1/F3): Marcotte et al. tables for "8 fixed sums" (grade B, fallback in brief F1), the PRL page ("5 test systems"), arXiv 2402.08939.
- The recall shells are a dense nest of great circles seen from outside: the six rings carry "six shells"; the followed orbit is a brighter, slightly larger loop and a white comet
  (brightFollow 0.6 and growFollow 1.6 are stronger than the brief's "+25 %, not bigger", because pastel dots on a dark ground do not read at +25 %).
- Training dots at the settle sit on thin hyperbola strips (the data), so each layer is a curved strip inside its plate outline, not a filled sheet.
- Big-step dots with c' above 1 rise above the top layer plate (outliers up to 1.7, brief F5).
- No DecompressionStream fallback: an old browser would fail in setup.
- The toy model's six colours are an ordered ramp by answer rank (soft -> accent -> sand -> ink); the toy rows keep length 20 (colour only changes, per beats).
- The tree swap carries the two children's own children with them (2a and 2b subtrees exchange places; the parent keeps its ring and the pin).
- Page-level: G6 phone overflow is a shell matter (none reported).

## After tier 1 and tier 2 (ship state)
Rounds r1 (9) and r2 (4) applied by factory/tools/apply_findings.py; tier-2 film.js revision in REVISION.md. lib/mkfilm.py now
refuses to run: film.json is the source of truth. Director seat in seat.json; measures in MEASURES.md.
Data caveat: the orbit and network clouds are the series' own recompute; Liu and Tegmark 2021, Kunin 2021, Marcotte 2023 and
Chen 2024 were read from search snippets (egress blocked); re-verify before public use. The owner's program is on stage only
as counts of what exists, under the tag PROGRAM, NOT A THEOREM.
