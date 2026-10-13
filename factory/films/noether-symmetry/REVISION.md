# noether-symmetry · REVISION (tier 2, the one film.js round) · 2026-10-10

Input: the promoted draft a after findings r1 + r2 (SELECT.md), whose film.json carries the applied knobs and captions.
Output: lib/film.src.js and lib/gl-pointcloud.js edited, film.js re-assembled (lib/assemble.py), film.json edited in place
(it was **not** regenerated from lib/mkfilm.py: a diff against a backup shows only the rows listed below; the captions are
byte-identical), page rebuilt with kit2/build.py, gate PASS, frames re-stripped.
Gate: VERDICT PASS, G1-G11, G11 clean (307 samples, no overlap, nothing across the caption band). G5c WARN '20 @86s'
unchanged (the reader quirk on '620'). Film code 114.9 KB (< 120), page 1.293 MB (< 1.3), 0.121 s/frame, purity identical.
Evidence: revision/before-after.jpg (8 rows, before | after, at 0.5, 57.5, 75, 86, 101, 103, 127, 129.5 s);
frames/thumbs/t-*.jpg are the after frames (the before set is the one SELECT.md cites).

## What changed, in order of the beyond-scope list
| # | item | what was done | before → after |
|---|---|---|---|
| 1 | orbit shells as shells | Each of the 6 shells gets a thin ink outline ring: the sphere's silhouette as the camera sees it (the circle R²/d toward the eye, radius R√(1 − R²/d²)), so a nested-shell picture holds at any camera pose. During the "6 shells" hold the shells light one at a time, inner to outer (new shader uniform: a shell index per dot; the other shells' specks sink, nothing moves or is removed), then all are lit. The same outline rings are drawn on the network's 3 shells and on both clouds in the MONDAY bookend. Knobs `shellRing` 0.55, `shellDim` 0.7, `tShell0` 72.9, `shellStep` 0.42 | t-0075.00: filled ball → six nested rings, one lit; t-0138.00 bookend: both clouds read as shells |
| 2 | network comparison on one frame | The pins that never placed are gone. A fixed readout sits right of the network cloud: "0.24 · THE WEIGHTS MOVED" and "0.00095 · THE FIXED SUM MOVED", each with a bar drawn on one scale (220 units for 0.24, so 0.00095 is a 0.9-unit sliver). Then "about 250 times · LESS FOR THE FIXED SUM" lands, and the two values drop to secondary 24 at that moment, so no more than 2 results are ever on screen (R2). Knobs `cmpX` 700, `cmpBar` 220. Timing stays on the existing knobs tPW, tPC and tPRatio | t-0127.00: values absent → the pair on one frame; t-0129.50: the pair and the ratio |
| 3 | lay axis words | A top-right line names the axes as they change: "AXES: WHERE IT IS" → "AXES: ITS SPIN ARROW" → "UP: MORE ENERGY · OUT: MORE SPIN" → "AXES: A PICTURE OF THE WEIGHTS" → "AXES: THE THREE FIXED SUMS". It hard-cuts at every re-projection (M1, M2, M4) and stays off through each settle (+1 s) | t-0020.00, t-0075.00, t-0101.00, t-0122.50 |
| 8 | I2 during the moves (cheap, so done) | During M1, M2 and M4 the same line reads "SAME 3,000 DOTS" (claim states / netStates) | t-0064.00, t-0092.00, t-0116.00 |
| 4 | rings on the cut plane | Where the plane meets each shell, a ring (radius √(R² − y²) from the plane's height y), so the rings open as the plane comes down and lie on the disc at rest. The "62" is now a fixed readout outside the plane's projected rim, with a leader: "62 · ORBITS LIT · 620 OF 3,000 DOTS". It never sits on the edge. Knob `cutRing` 0.8 | t-0082.00 rings opening; t-0086.00: one band → six rings, with the 62 clear of the plate |
| 5 | text off the marks | The table of three rows is set at 18 units, 64-142, and `layerGap` goes from 38 to 30, so the top energy layer sits below it (t-0101.00). The plate "closer: faster · farther: slower" now stands over a sunk cloud: the cloud stays dimmed until `tPlateOff` (58.0), and the followed orbit, its ellipse and the spin arrow light after it. `tSpin` goes from 58.5 to 58.8 | t-0101.00, t-0057.50 |
| 6 | SIMULATED tag | 16 units (was 14), in ink with a role-coloured square (soft for simulated, accent for measured), on every simulated and measured scene | top-left of every frame (see the note below) |
| 7 | blank frames | The HOOK type starts at `tHook0` 0.3 s (was 1.0). The match cut at 102 s now shows the orbit ghost at the left of the frame: the netcut eye moves to (1247, −337, 547), az about 45°, and `camM4Az` goes from 60 to −60 so the turn still lands on a frontal view of the 3 shells. The network starts to count in at 102.5 s (`tNet0`, was 103.5) | t-0000.50, t-0103.00 |
| — | eyebrow | "draft A, the observatory" → "Noether's symmetry" | page head |

## What stayed, and why
- Captions are unchanged, byte for byte: r1/r2 tuned them, and the new on-stage words were written to agree with them.
- The camera script is unchanged except the netcut eye and M4's sweep. The settles, R5 hard cuts and T2 gaps hold: the move
  starts are still 60, 78.5, 88, 102 (cut), 112 and 135 s.
- No new numbers. Every digit drawn (62, 620, 3,000, 0.24, 0.00095, 250) already was a claim or render in claims.json, so
  claims.json is untouched. The bars are drawn from params wMove and cMove, which are claims.
- The honest line stays on stage at 141.6-150 s, at 28 units. The CETI card is last.
- No slow parallax turn on the shell landing. With the outline rings and the sweep, the shells read without it, and
  another camera move would cost a T2 gap.
- The G6 phone overflow 553/390 is at page/kit level, not in the film.

## Warnings to ship with
- G5c '20 @86s': the reader strips the '6' render from '620'. 620 is the claim cutMarks.
- The thumbnail timestamp burn (frames.mjs) covers the top-left tag in contact sheets only. On the film stage it reads at 16 units.
- The 0.00095 bar is honest at 0.9 units, so it is a sliver by design: the point is how small it is.
- build.sh no longer runs lib/mkfilm.py or lib/mkdata.py, which would revert film.json and point at a wrong topic path. It
  only assembles film.js and builds. film.json and claims.json are now the source of truth, and lib/mkfilm.py is history.
- New knobs (9, all with knobs_doc rows): tHook0, tPlateOff, shellRing, shellDim, tShell0, shellStep, cutRing, cmpX, cmpBar.
  Changed values: layerGap 30, tSpin 58.8, tNet0 102.5, camNetcutEyeX/Z 1247/547, camM4Az −60.
