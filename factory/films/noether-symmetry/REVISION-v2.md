# noether-symmetry · REVISION v2 (owner feedback, Part 1 of 3: the concept) · 2026-10-10

Input: factory/topics/noether-symmetry/v2-director-note.md. Output: lib/film.src.js rewritten, lib/gl-pointcloud.js header only,
lib/mkdata.py (network codec), lib/assemble.py (two modules dropped), recompute.py (100 moments per orbit, 100 steps per run),
data regenerated (seeds fixed: 20261010, +1), film.json edited in place (knobs, knobs_doc, captions, params, count, chapters, lede,
eyebrow), claims.json (film and topic copies) updated, page rebuilt, gate run, frames re-stripped.
Gate (gate.json): VERDICT PASS, every row G1-G11 PASS (G5c is now clean too: the '620' quirk left with the cut plane). G11 clean:
307 samples, no overlap, nothing across the caption band. Film code 73.9 KB (film.js 39.1, film.json 17.6, claims.json 17.3; was
114.9), page 1.250 MB (was 1.293), 0.36 s/frame (was 0.12–0.18; 40,000 points instead of 6,000), purity identical at 30.6, 76.5,
122.4 s; assemble.py twice gives the same film.js.
Beyond G11 (G11 cannot see the canvas): a check script projected every shown dot (up to 40,000) with the page's own camera every
0.5 s and counted dots inside every visible SVG text box (+3 units). Zero hits from 0 to 150 s; the only hits are under the opaque
brand card (151–153 s), where the cloud is covered. Evidence: revision/v2-before-after.jpg (8 rows, v1 | v2); frames/thumbs are v2.

## What changed, per note item (film seconds)
| note item | v2 | seconds |
|---|---|---|
| 1. a number you can work out at any moment, the same every time; show it before naming it | One made-up planet (orbit 270: outer spin shell, middle energy, eccentricity 0.65) goes round its sun, one moving dot on its 100 moment dots. The panel shows three bars that update in place: DISTANCE FROM THE SUN (swings), SPEED AROUND THE SUN (swings), DISTANCE × SPEED AROUND (flat), then NEVER CHANGES. No digits. The flat bar reads at a glance by 7.8 s and holds to 11.9 s | 0–12 |
| 2. Earth, same panel, numbers landing in place, no flying words | Earth drawn to scale; closest point and arm/arrow in accent, farthest in soft. In the panel: 147.095 (15.0), × 30.29 (17.8), 152.100 (20.6), × 29.29 (23.4), = 4,455.5 / = 4,455.0 with two bars on one scale (26.2), only 0.011 % apart (29.2). The formula-bind flights are gone | 12–32 |
| 3. why: a change that changes nothing | Back to our planet; the flat bar is named spin (35.0), the energy bar is added (37.6). The whole picture turns 360° about its own axis (40.4–46.4) while the panel stays still: the swinging bars keep swinging, the flat ones do not move. 'Start the clock later' (48.6): the planet jumps a third of a turn ahead, the flat bars do not flinch. Panel rows TURN IT → SPIN STAYS (45.6), START LATER → ENERGY STAYS (51.2). Captions: 'A change that changes nothing: a symmetry.' (53.8) then 'Noether, 1918: each symmetry fixes one number.' (56.8). Two symmetries, two numbers | 32–60 |
| 4. a true point cloud; sort; follow one orbit; second sort; drop the cut plane | 300 planets × 100 moments = 30,000 fine dots (count-in 60.3–63.2, '30,000 dots' in the panel). Our planet's 100 dots in ink, the rest sunk, a faint guide of its path (66.2). Sort by spin (70–78, camera orbit 35°): every dot keeps its direction from the sun and moves out to its orbit's spin, so the tangle becomes 6 shells; the shells light one at a time, inner to outer (78.4–81.1, pin '6 shells'), ending on our planet's shell, which stays lit with a thin line through its 100 dots: they lie on one great circle of one shell, and the moving dot slides along it, never off it (81–90). Sort by energy (90–97, camera tilt to 9°): up = energy, out = spin, 5 layers (pin '5 layers'), our planet's dots on one ring of one layer, the dot sliding round it (100–106). The cut plane, its rings and the 62 / 620 readout are gone | 60–106 |
| 5. not only planets, one beat, counts before the ratio | 100 runs × 100 steps = 10,000 training states (count 109.2). Sorted by the same rule (direction of the weight picture, distance = the run's fixed sum): 3 shells (120, pin). One panel frame: 0.24 THE WEIGHTS MOVED (122.6), 0.00095 THE FIXED SUM MOVED (124.4, a sliver on the same scale), about 250 times less (126.0) | 106–127.8 |
| 6. fluids, honest line, Monday, card | Wordless smoke ring, tag 'A DRAWING, NOT DATA' (127.8–135). Wide: both shell pictures, caption 'Monday: what stays fixed while your data moves?' and the panel's second question (135.4); the honest line in the panel at 24 units, no caption under it (141.6–149.9). CETI card last (150–153) | 127.8–153 |
| text rules | Three text elements at most besides the caption: the corner tag (SIMULATED / MEASURED / A DRAWING, with the lay axis words beneath, hard-cut at each re-projection, 'SAME 30,000 DOTS' / 'SAME 10,000 DOTS' during the sorts), the readout panel (x 652–912, fixed), one pin. Every text fades in where it stays or hard-cuts; nothing travels. The display set type of v1 (hook headlines, 'Emmy Noether · 1918', the three-row table, the colour legend, the network formula plate, the cut readout) is gone or folded into the panel. Pins sit right of the cloud's projected silhouette (bounding radius per picture), only while the camera holds | all |
| captions | 45 one-line captions (≤ 50 characters), one idea each; 'a number that never changes' (10.0) before 'conserved' (45.6); 'a change that changes nothing' (53.8) before 'symmetry' | all |
| point cloud | perOrbit 10 → 100 (30,000 states, rebuilt from the Kepler solution in setup), dotR 2.6 → 1.15 with the depth size cue; followed dots mixed to ink, not grown (grow 0); network 3,000 → 10,000 (target met), dotRNet 1.3. Shell outline rings kept; colour by energy kept | 60–150 |

Camera: a shot list (cuts at 12, 32, 60, 106, 135; moves 70–78, 90–97, 114–120; the picture turn 40.4–46.4 is a data op, the camera holds). ≤ 1 move per 8 s, every hold ≥ 2.5 s, no sway, so holds are still and pins never drift. A lens shift (lensX 0.44, lensY 0.09) keeps the subject in the left two thirds, clear of the panel, the tag and the caption band.

## What I left or changed against the note, and why
- **'SPEED' is 'SPEED AROUND THE SUN'.** On an eccentric orbit distance × speed is not constant; distance × the speed across the line to the sun is (it is the spin per unit mass, exact). A flat bar labelled DISTANCE × SPEED would be a false claim. At Earth's closest and farthest points all the speed goes around the sun, so Earth's 'distance × speed' is the same number; the tag says so ('HERE ALL ITS SPEED GOES AROUND THE SUN').
- **The shell picture is new.** v1 put each orbit at the tip of its spin arrow (all 10 dots on one speck), where a dot cannot slide. To get the note's picture (100 dots on one shell, a moving dot sliding along it), each dot keeps its direction from the sun and its distance becomes the spin. Layers: height = energy, out = spin, angle = where the planet is in its orbit.
- **gl-camera-rig and gl-labels are no longer inlined** (26 KB of film code): one shot list and one pin rule do the job and pay for the finer cloud. The files stay in lib/ unused (with cam.base.json, camknobs.mjs and mkfilm.py, which is history): delete them at commit if wanted.
- count.at moves 26.0 → 15.0 (Earth's first measured number); the first ratio is 0.011 % at 29.2 s. The hook has no digit.
- Off screen now (claims kept, onscreen false): cut plane 62 / 6,200, 'under 1 in a trillion', the 2018 / 2021 source years (Part 2).
- Takeaway, title, sources, honest line text and the 153 s / four chapters are unchanged.

## Warnings to ship with
- In the 30,000-dot tangle (66–70 s) our planet's 100 dots are thin at contact-sheet size; at stage size they read with the guide. On the shells and in the layers the thin track line makes them read at any size.
- The network's 'tangle' is short streaks (a run's weights move 0.24 against a spread of about 1), not a cloud.
- The bars in the hook and the symmetry beat have no digits: distance is drawn against the farthest distance, speed around against the fastest; the flat bars' lengths are knobs (spinF, enF). Only their flatness is data.
- 'Start the clock later' is shown as a jump of the planet (laterShift 0.37 of a turn), with the tag 'THE CLOCK, STARTED LATER'; there is no clock graphic.
- 0.36 s/frame in SwiftShader (40,000 points); setup ready in 2.8 s (G1).
- factory/topics/noether-symmetry/data/orbits.json is now 3.5 MB (30,000 rows; not in the page). network.json 0.65 MB.
- G6 phone 390 overflow 553/390 is page/kit level, unchanged.
- lib/mkdata.py had a wrong topic path (5 levels up); fixed, and it is part of the rebuild again after recompute.py --write.
