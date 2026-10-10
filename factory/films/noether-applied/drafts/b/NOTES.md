# noether-applied · draft B · "the ledger of error"

Look (from beats.md): brand ceti-coastal-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153 (150 + 3 s card), commit off (D11), count.at 26.0.
Windows HOOK 0-12 · CASE 12-62 · COUNT 62-135 · MONDAY 135-150 · card 150-153. Build: `sh build.sh` (mkfilm.py -> film.json, assemble.py -> film.js, kit2 build.py).

## Register
Each of the four systems is a cloud whose VERTICAL axis is the number that should stay (its error, stretched for the eye, said in words, never as a digit).
"Stays" reads as a flat sheet of dots, "drifts" as a sheet that tilts and tears. Every act opens in plan (from above the systems look alike), one camera crane
per act brings the camera from plan to elevation (the flat sheet reads as a line), then the dots re-stack VERTICALLY only (id-stable: x and z never change in the
re-stack, no dot is added, removed or faded). The fixed readout panel is a running error ledger: counts first, ratios last, values land in place and hard-cut away
at every move.
- Act 1 integrators (14-62 s): annulus sheet; angle = the planet's angle at the snapshot, out = which snapshot (log-spaced steps), up = |energy error| on a log
  stretch (knob s1Eps). Keeper = flat disc; plain = a bowl that tilts with the steps, then its last 133 dots (the unbound ones, flagged from the data) are thrown
  up and out along the one ray the planet left on. Crane 34-39, re-stack 39-42, lit sets 53.5-58.5.
- Act 2a balanced layers (62-89): part 1's 10,000 states; home height = a weight, sorted height = the run's fixed gap -> THREE flat sheets (ghost lattices fade in
  under them). Crane 74.5-78, re-stack 78-81.5.
- Act 2b spring (89-110): our toy pair (plain / energy-keeping), phase plane, up = energy minus its start. The keeper's ring is a flat sheet; the plain network's
  snapshots climb as two ramps. Crane 91.6-94.6, re-stack 94.6-96.9 (done before the first row at 97.0). The 170, 0.38 and 450 are the paper's and the tag says so.
- Act 3 weather (110-122.5): wordless ribbon loop. 1,000 of the 2,000 tagged parcels as dots (16 frames x 1,000 in ONE geometry, frame window in the shader) plus a
  FILM-LOCAL MESH: a closed wall of constant height standing on the loop (wall height = the swirl number, constant while the loop stretches and folds) and 25 strand
  trails on the sheet, all built per frame in render. Stirring 112.8-117.6, crane 117.8-121.0. No digit.
- Act 4 equivariance (122.5-135): the 2,180-dot stand-in chain (seeded in setup with K.mulberry32: NOT a fold, not T1044) turns one full turn about a tilted axis
  (127.5-134.5), 20 output arrows (a distance-weighted neighbour-vector layer, equivariant by construction) turn with it, a muted ghost of the first pose stays;
  the sheet below (each residue's distance to the chain's centre, which a turn cannot change) does not move. Crane 122.7-124.4, before the count row at 124.5.
- Wide frame 135-150: the four sorted sheets in a row (steppers, network, air, chain), question in set type, then the one honest line in set type, no caption.
- Hook 0-12: one planet round a made-up ellipse on a flat sheet, still camera; the question from 6 s. No digit.

## Chain (narrowed, written here)
gl-pointcloud (PATCHED copy, lib/gl-pointcloud.js, header says what) + film-local code. NOT inlined: gl-camera-rig (a shot list of cuts and cranes in film.src.js, every
pose a knob: part 1 v2 did the same), gl-labels (no pins: the tag, the lay axis words and the ledger carry all the type; the followed-dot pins of beats.md are
dropped), gl-ribbons (brief F5: it models flows between slabs; the wall and the trails are the film-local mesh). All three omissions keep the page under 1.3 MB.
Patches to the pointcloud copy (from part 1's patched copy): linear morph switch (uLin), frame id per point + frame window (uFr: a time-stacked cloud), a per-draw
scale (uSc: ONE unit-disc ghost lattice serves every zero sheet), vertex-vector sharing and a normal cache in bake (setup time: ready 2.2 s). Removed: ring mode, shell
light, feature rank.

## Data (lib/mkdata.py -> lib/data.js, 35.6 KB, no randomness)
Snapshots 3 base-64 chars each (9 bits angle, 9 bits log10|dE|), spring pair q,p at 12 bits (E = (q^2+p^2)/2, matches E_true to 1e-9), loop 1,000 parcels x 16 frames
(0.01, second differences, 16.2 KB, worst quantisation error 0.005), part 1's network strings copied verbatim. Steps are not stored (log-spaced checkpoints, index only).

## Gate, size, cost (drafts/b/gate.json)
VERDICT PASS, G1-G11 all PASS, G11 clean (307 samples, 72 texts, nothing over the caption band), G5c PASS. Page 1,268,347 B (< 1.3 MB); film code 88.6 KB (film.js 55.9,
film.json 18.5, claims.json 14.3; limit 120). 0.248 s/frame (frames.mjs, 307 frames, SwiftShader, 1920x1080, machine load about 24); purity identical; ready 2.2 s.
126 knobs (every move time, camera key, scale and gain; the ledger rows' times follow the captions and are a table in film.src.js, not knobs). assemble.py twice: identical.
claims.json is the brief's file byte for byte; film.json params = its params.

## Warnings left, and why
- The ledger shows up to THREE value rows at a time (brief says at most two): counts, then the two errors, then a ratio/threshold line in the third slot. Rows never
  move and cut away at each move; G11 clean.
- accent (keeper) and accent2 (plain) are both light and close in hue (mint vs sky); brightness ramps differ (keeper brighter). The tag and ledger name each.
- Ghost zero-sheet dots (about 4.6k per sheet, the 3 layer sheets, the hook) are guides drawn with the cloud shader, not data; every data dot count is the claim's
  (1,000 x 2, 10,000, 200 x 2, 1,000 loop dots shown of the 2,000 parcels, 2,180). The brief says 2,000 parcels (off-screen claim): 1,000 + 16 frames fit the byte budget.
- Act 1: the thrown-out dots are drawn along one ray (the real planet leaves in one direction) and pushed outward by a drawing choice (knob s1Fly); the error axis is a log
  stretch (said in words, no digit). Heights are not to scale between acts.
- Act 4: the chain is a seeded random walk, a ball more than a fold; the sheet's radius is each residue's distance to the centre (a stand-in for the table of distances).
- The weather beat has lay axis words in the tag ("wall height: the swirl") beside the captions; no digit, no panel.
- Beats.md open items stand: Greydanus Table 1 (170 / 0.38), Du 2018 and Jumper Fig. 1d (2,180) were not opened (egress); open before ship.
- 62-64 s and 110-112 s show an empty act (tag and ghost sheet only) while the next cloud has not yet arrived: the match cut is honest, not busy.
- G6 phone 390 overflow is reported by the shell, not by the film.

## Not done
Followed-dot pins and a perspective-to-ortho landing (every act ends on a low perspective pose, c?E, not ortho). Shots go to a scratch dir, not drafts/b/shots.
