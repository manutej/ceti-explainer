# noether-applied · draft A, "two planets" (Wave NOETHER part 2)

Look/chain (from beats.md): ceti-coastal-dark, chrome none, material ink, level manager, renderer webgl, commit off (D11), 153 s, count.at 26.0.
Build: `sh build.sh` (mkfilm.py -> film.json, assemble.py -> film.js twice-identical, kit2 build). Page build/noether-applied.ceti-coastal-dark.none.html.

## Register
Two planets on one orbit, accent = the one that keeps, accent2 = the plain one, in every scene.
1. Integrators: two dots circle one orbit (the second joins at 14 s), then their 2 x 1,000 snapshots pile up a column (height = log steps). M1 re-plots each dot by the same angle but radius = energy drift (stretched log, said in words): the keeper is a thin tube (drawn), the plain stepper is a funnel that peels off and a line of dots flung out in ONE direction (true: an escaping orbit has a fixed direction; camera az is chosen so that line ends on the right).
2a. Part 1's 10,000-dot network, 3 gap shells, one run followed (others sink). 2b. Toy spring pair, 200 + 200 dots as a column: keeper stays on the starting ring (drawn), plain drifts out (drift stretched, said in words).
3. Weather: wordless. Loop dots (2,000, stored frames, linear path) rise with time; 25 strands + 12 bands = film-local time-extruded ribbons (gl-ribbons has no such loop). 4. Stand-in chain (helices + loops, seeded, 2,180 dots) turns once; accent arrows (equivariant answer) turn with it, accent2 arrows (plain layer) do not; ghost of the first pose stays. MONDAY wide frame: four ghost clouds (planets, network, air, chain), honest line as stage type under them.

## Chain and patches
gl-pointcloud: copy of part 1's id-stable-morph copy, trimmed (second target, cut flag, ring mode, shell sweep removed), added `uLin` (linear path, for the stored-frame loop) and one shared vector per 4 corners (setup time). gl-camera-rig and gl-labels not inlined (as in part 1 v2: a shot list with lens shift and one pin rule in film.src.js; nothing cut, nothing patched in them). Kit, arsenal and tools untouched.
Data (lib/data.js, 28 KB): 2 x 1,000 snapshots (angle, log r, log |dE|, from trace_*.csv), toy pair q,p, part 1's net strings unchanged. Steps are rebuilt from trace.c's rule. The stirred loop is re-integrated in setup (same vortices and RK4 as recompute.py C, dt 0.01 not 0.005, to keep ready < 5 s); the chain is rebuilt from K.SEED. No data table for kelvin_loop.csv is shipped.

## Gate (full, drafts/a/gate.json)
VERDICT PASS, G1-G11 all PASS, G11 clean (307 samples). G5c clean. G6 reports phone 390 scrollWidth overflow (shell, not film; same as part 1). ready 2.6 s; 0.211 s/frame headless; purity identical. Page 1.264 MB, film code 84.6 KB (film.js 53.2), 107 knobs (every time, camera key, size, gain; row times are the beat table, fixed in code). Frames: drafts/a/frames (307 thumbs, 26 strips); I looked at full-size stills of every beat (hook, M1 before/mid/after, each row/pin state, 2a, 2b, 3 ring/crane/end, 4 turn at four angles, wide, honest, card).

## Words and warnings to carry
- c7 re-worded to "From above: two rings round the sun." (no digit): the position view is honest data, the plain ring shrinks and its thrown-out dots sit on a squeezed halo, so "look the same" would be false.
- Position-view radii of far-flung dots are log-squeezed; sorted radius is a stretched log of drift: both said only in words (tag lay line "ENERGY DRIFT, STRETCHED"). No digit for either.
- Wide frame looks from behind (az 197.5) so the flung line sits right; clouds are placed mirrored to read planets, network, air, chain left to right.
- Pin text is short (right gutter 520-650 sheet units); pins: keeper dot, plain flung dot, one network run, starting ring.
- Dots: 1.3 (S1), 1.6 (10,000), 2.0 (400), 1.4, 1.3 world units; tens of thousands exist only as 10,000 (2a) and ~16,000 together in the wide frame. S1 is 2,000 dots and reads sparse; more dots would invent snapshots.
- HOOK carries the question twice (stage type and caption c2) as the beat table asks. 62-64 s is an empty stage (match cut before the count-in).
- Open from the brief: Greydanus Table 1, Du 2018 and Jumper Fig. 1d not re-opened (F4/F8); chain is a stand-in (tag says so); equivariant arrows use the toy layer of recompute.py D, the plain layer is shown as "does not turn" (a frozen direction), not the paper's matrix test.
- Unused-by-design: camera ambient drift (holds are still), floor grid, gl-labels solver.

## After tier 1 and tier 2 (ship state)
Rounds r1 (7) and r2 (1) applied by factory/tools/apply_findings.py; tier-2 film.js revision in REVISION.md. build.sh no longer
writes film.json (lib/mkfilm.py only checks knobs): film.json is the source of truth. Director seat in seat.json; measures in
MEASURES.md. Data caveat: the integrator and network numbers are the film's own recompute; Greydanus 2019, Du 2018 and Jumper
2021 were read from search snippets (egress blocked); re-verify before public use. The protein chain is a stand-in (tagged).
