# noether-frontier · draft B · "the laboratory bench"

Register: a lit plate (ruled grid, a pool of light) seen from a raised three-quarter view, az 28 and el 30 for the whole film. Each cloud sits on the plate as a
specimen with a faint contact shadow; the readout panel is a bench card on the right (fixed, nothing moves); the question tree stands up on the plate as a thin
wire tree and the two swapped children (with their leaves) slide past each other on two rails; the toy is 18 blocks whose lengths are 4, 7, 9, so every row is the
same length. ONE camera dolly per act, straight along the view line, never an orbit: act 1 (recall) 12-20, act 2 (training) 62-70, act 3 (the tree rises) 119-122
(the toy at 98.5-119 is still), act 4 (Monday) 135-141 back to a wide frame. Every other second the camera holds. The data moves (M0 12-20, M1 28-36, M2 62-70,
M3 88-96) keep the beats.md windows; M1 and M3 run under a still camera.
Look: ceti-coastal-dark, chrome none, material ink, level manager, webgl, feature-long 153 s, commit off (D11). Windows HOOK 0-12 · CASE 12-62 · COUNT 62-135 ·
MONDAY 135-150 · card 150-153. count.at 21.0. Eight tags, each from its first frame (RECAP · SIMULATED ... PROGRAM, NOT A THEOREM 119-150).

## Chain (narrowed, recorded)
- gl-pointcloud: patched copy of Part 1's patched copy (lib/gl-pointcloud.js, header lists it). Kept: home/aTo/aTo2 per point, m1/m2, stagger, colour table, count-in
  order, feature rank, cut flag, `at()` twin. Added (brief F7): `uFLen` (the feature rank becomes a window: the comet), `uFlat`/`uPlate` (the contact shadow: the same
  points flattened onto the plate and dimmed by a second call), group ghost = `uDim`. Removed: ring mode. Group 0 = 30,000 (home = place, aTo = spin); group 1 = 24,000
  (home P = a, b, time; aTo C = a, b, sum; aTo2 C' = the same at the big step); only the third axis (up) changes P to C, so the dots rise or fall in straight lines.
- gl-camera-rig NOT used: a shot list (lib/film.src.js shots/poseAt, as Part 1 v2); a dolly is two numbers. gl-labels NOT used: one pin, placed from the ring's own
  screen position, above the tree. gl-instances NOT used: 19 boxes, 18 blocks and their links are p5 geometry from data (cube(): three lit faces, nine edges).
  Reason: fewer bytes (the page limit is 1.3 MB and the base page is 1.19 MB) and no module needed.

## Data (lib/mkdata.py -> lib/data.js, inlined through film.json "libs": counts toward the page, not toward film code)
33.3 KB: the 300 orbits (spin direction, angle, phase, 12 bits; Part 1's coding, shell and level from the index) = 3.0 KB; the 480 neurons x 50 moments as three
streams (small-step a x100; big-step a x100; big-step sum minus its start x50), second differences in groups of four (one character when all four are -1..1) = 29.7 KB;
the 19 tree nodes (id, level, parent, x; titles are never shipped). The small-step sum is stored as exactly its starting layer: shown to 0.01 it is flat (true drift
median 0.0005, max 0.0085, claim driftSmallMedian); the big step keeps its drift (film median 0.100, claim 0.1004). b is derived, b = sqrt(max(a^2 - c, 0)); worst b
error 0.135, 99th percentile 0.05 (0.001 of a world unit per 0.001). neurons.json was 238 KB. Nothing is trained or searched at run time.

## Knobs: 68
Looks (scale, dot radius, shadow, ghost, comet, plate, grid, slides), camera (fixed az/el/fov, lens shift, one distance pair and one height per act), move and cut times
(M0-M3, comet, cuts, swap, Monday), tree and toy sizes, card x. Not knobs: panel, tag and caption times (content, tied to the captions).

## Gate, size, cost
gate.json VERDICT PASS, G1-G11 all PASS, G11 clean (307 samples: no overlap, nothing across the caption band). Page 1,264,898 B (< 1.3 MB); film code 53.9 KB
(film.js 22.3, film.json 16.2, claims.json 15.4); 0.64-0.77 s/frame (SwiftShader, two draws per cloud). assemble.py twice identical. claims.json copied unchanged
(object form: the kit prints a note). Frames: frames/ strip every 0.5 s (307 thumbs), looked at for every beat.
Rebuild: python3 lib/mkdata.py; python3 lib/assemble.py; python3 factory/kit2/build.py <draft> --brand ceti-coastal-dark --chrome none --material ink
(film.json is the source of truth; it was written by a scratch generator).

## Warnings left
- The gate was run with `--film` and the two kit files (the bare form in the request prints usage).
- Act 2 in the sum picture: all 96 neurons of a layer lie on one hyperbola, so the 24,000 dots read as five arcs (true to the data, but sparse). The thin layer outlines
  (guides, not data) carry the "layer" idea; the leak at the big step is clear from 92 s. The "one run brightens" step (78.5-80.5) is nearly invisible there for the same reason.
- Display-face numerals ("4 8 7", "30,000") are set smaller than 36 by the kit's face compensation; they pass the floors but look light.
- "Reordered facts ... more than 30 %" wraps to two caption lines (kit limit is two).
- The panel label says "KUNIN, MARCOTTE ET AL." (shortened from beats.md, the long form left the card by 3 u: G11 WARN).
- Not opened: the papers (egress), as in the brief (F3). The 8 fixed sums is grade B (F1); the fallback rule of F1 applies unchanged.
- Cloud bounds were checked by eye on the 0.5 s strip (left two thirds, clear of card, tag and caption band), not by the projected-point script.
