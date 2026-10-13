# Noether applied · film id `noether-applied` · brief (Wave NOETHER, part 2 of 3)

## Subject
kind: concept, four real systems · name: Where is "a number that never changes" used today, outside quantum physics? · source material: factory/WAVE-NOETHER.md; factory/research/NOETHER-APPLICATIONS.md (its ranking is the director's pick); NOETHER-FOUNDATIONS.md (lay statements); NOETHER-NONQUANTUM.md; factory/topics/noether-symmetry/v2-director-note.md (text rules, point-cloud spec); verlet_vs_rk4.c (A, derived); recompute.py (this folder, seed 20261010). Sources and grades: sources.md.

## Audience
manager; the room that watched part 1 (or reads the series page): knows one orbit has a flat bar and that dots sort onto shells; uses simulation, weather apps, ML and "AI for proteins" every day and has never heard that a symmetry is built into them. No jargon without a picture; a 10-year-old follows. Lay words: "a number that never changes" before "conserved quantity"; "a change that changes nothing" before "symmetry"; "keeps" and "comes with", never "because of".

## Format and look
feature-long, 153 s (150 + 3 s card), level manager, renderer webgl, chrome none, material ink, brand ceti-coastal-dark. Commit: none (D11), film.json `"commit": {"enabled": false}`, no COMMIT chapter. Chain: gl-pointcloud (id-stable morph), gl-camera-rig, gl-labels, gl-ribbons. Windows HOOK 0-12 · CASE 12-62 · COUNT 62-135 · MONDAY 135-150 · BRAND 150-153.

## The question and the belief
Question (set type, HOOK): "Where is this used today, outside quantum physics?"
Belief (said in the room before the film): "Conservation laws are a physics-class thing; real software, weather and AI just compute what they compute." (No digit.)

## The reversal (two pictures, one sentence each)
Belief picture: the dots of a simulation, a network, a fluid, a protein look like plain output of code: two ways of stepping a planet look the same from above. After the sort: the same dots, re-plotted by the number that should stay, split: the stepper that keeps the number holds its dots on one shell for a billion steps, the plain stepper's dots peel off and the planet is thrown out; the same move then shows a network whose layer gap stays put, a network told about energy that stays on its ring, a loop of air whose swirl stays, and a protein whose shape stays when you turn it.
The series spine, said once in the MONDAY frame: "the same move four times: sort by what stays".

## Fixture (four, one move each; every dot is a snapshot, a training step, a parcel or a residue)
1. Symplectic integrators (opening; continues part 1's picture). One Earth-shaped orbit (e = 0.0167, NASA), 1,000,000,000 tiny steps, two ways of stepping: velocity Verlet (keeps the energy-like number in a narrow band and the spin exactly to rounding) vs classical RK4 (plain). Same step size, 100 per lap. Dot = a snapshot, 1,000 per stepper, log-spaced in steps. Numbers from verlet_vs_rk4.c and data/trace.c via recompute.py: keeper never more than 0.007 % off; plain 1.9 % off after 10,000,000 steps (about 270 times worse); plain planet thrown out by 65 million steps; spin right to 11 decimal places. Used for real in solar-system runs (Wisdom-Holman 1991; Laskar-Gastineau 2009; no number from them on screen).
2. Machine learning. 2a one beat of balanced layers (Du, Hu, Lee 2018): part 1's fixture unchanged (100 runs x 100 steps = 10,000 dots, 16 units): weights travelled 0.24, the layer gap moved 0.00095, shown as two numbers with no ratio. 2b Hamiltonian vs plain network (Greydanus 2019): counts first (200 units, 2,000 training steps), then 170 vs 0.38 (units 1e-3 in the paper), then "about 450 times lower" (170/0.38 = 447). The dots on stage are OUR toy pair trained the same way on the same spring (numpy; 200 snapshots each): the picture is a MODEL, the two numbers are the paper's, and the tag says so.
3. Weather and fluids (wordless). Potential vorticity and Kelvin's circulation as a ribbon picture: a loop of 2,000 tagged parcels stirred by three point vortices; the loop stretches 5.5 times and folds while the swirl around it stays (off-screen: circulation changes by at most 0.30 %). Caption only, no digit on screen. Some forecast models are built to keep this (Met Office GungHo, B) - available as a monday talking point, not a caption.
4. AlphaFold-style equivariance. A stand-in chain of 2,180 dots (the residue count of CASP14 target T1044, Jumper 2021 Fig. 1d); turn it with a random rotation: the output of an equivariant layer turns with it (off-screen: error 5.7e-15) and the table of distances does not change; a plain layer fails. Only the count 2,180 is on screen. Not conservation.

## Claims
29 claims in claims.json; on-screen ones carry `renders`. Values come from recompute.py (`--check` compares claims with a `key`). Immutable downstream (drafters move or re-caption, never change a digit).

## Count (units; the first lands before any ratio)
1. "one dot is one snapshot of one planet": 1,000 per stepper, lands 26.0 s (`count.at`). Then 1,000,000,000 steps (28.6 s; a count).
2. "one dot is one recorded training step": 100 runs x 100 steps = 10,000 dots, lands 72.0 s. Then 200 units and 2,000 training steps (97.0 s; counts).
3. "one dot is one residue": 2,180, lands 124.5 s.
Ratios after counts: about 270 times (51.0 s), about 450 times (106.5 s). No ratio before 51.0 s. HOOK carries no digit.

## Mechanism
A symmetry is a change that changes nothing. Code that keeps the symmetry keeps its number: a stepper that treats every direction alike keeps the spin exactly; a stepper that also keeps the shape of the motion (symplectic) keeps energy in a band and so cannot spiral off. Build the network around the energy and it cannot forget it. Rescaling dials gives a fixed gap between layers. Relabelling air parcels gives a fixed swirl. A network that turns its answer with its input is the same idea in a weaker form (a thing that stays under a change), not a saved number.

## Monday
question: "What must never change in your system, and does your code keep it?"
honest limit (exactly one, on stage, one line): "Pictures are simulated. Big steps break it. A turn saves no number." It names: the integrator picture, the toy network, the loop and the stand-in protein are simulations (only 170 / 0.38, 2,180 and the year labels come from papers); large or variable steps break the symplectic keeping and the energy band is "keeps", not Noether (Hairer; arXiv 2111.08835); equivariance is a symmetry of the model, not a conserved quantity (and AlphaFold 3 dropped the explicit guarantee).

## Commit
none (D11).

## Takeaway (card, <= 60 chars)
Find what stays. Then build so it does. (38)

## Cost
not asked.

## Look
brand ceti-coastal-dark (roles only: accent = the one that keeps, accent2 = the plain one; muted for ghosts and rings); chrome none; material ink; renderer webgl; level manager. Text: one readout panel (right third, fixed, numbers land in place, at most two rows), one caption band, one corner tag (SIMULATED / PUBLISHED NUMBER + lay axis words); nothing over the cloud; no text moves; labels hard-cut at every camera move.

## Findings (decide or accept before drafting)
F1. **Plain stepper does not "spiral off", it falls inward then is thrown out.** RK4 at 100 steps per lap loses energy, the orbit shrinks (smallest size 0.648 of the start) and between steps 63,358,050 and 64,686,077 the planet becomes unbound (energy above zero) and leaves. Caption says "thrown out". At a finer step this is much later: the 65 million is for 100 steps per lap and must not be read as RK4's general limit.
F2. **Fairness.** RK4 costs four force evaluations per step, the keeper one. At equal cost the plain way gets a quarter of the steps. The film does not claim a cost-matched race; it shows same-step-size behaviour. (Honest to say in the Monday talk; not on stage.)
F3. **Energy is "kept in a band", not exactly kept.** Spin: exact (Noether, rotation). Energy: backward error analysis (Hairer, Lubich, Wanner, B). Captions say "keeps", never "because of Noether" for the energy band.
F4. **Greydanus pair not re-opened.** 170 and 0.38 come from three extractions in the research file (A there); this session confirmed the setup (3 layers, 200 hidden units, tanh, 2,000 gradient steps) but could not open Table 1 (egress). Open it before ship; the units (1e-3) are B and stay off screen. Our toy pair gives a different, larger gap (energy MSE 1e-2 vs 4e-6 over 300 periods) and is never printed.
F5. **gl-ribbons gap.** The module models quantity flows between node slabs, not a closed loop stretching in time. Needed: a ribbon whose centreline is a parcel track (x, y per frame, z = time), 25 strands (every 80th parcel) drawn as bands, plus the loop at time t as a ring of dots; or a film-local ribbon built from data/kelvin_loop.csv. Wordless, so it can be a film-local mesh. kelvin_loop.csv is 1.4 MB as text: ship delta-coded Int16 (about 250 KB) or 1,000 parcels.
F6. **id-stable morph.** gl-pointcloud has none; reuse the film-local `morph` from factory/films/noether-symmetry/film.js (line ~224) or the patched lib copy used for part 1 v2. Two groups per scene (keeper, plain), 2,000 dots in scene 1; 10,000 dots in 2a; 400 in 2b; 2,180 in scene 4.
F7. **Stand-in protein.** No coordinates could be fetched (egress). The 2,180 dots are a seeded chain (recompute.py D) and say so in the tag; do not draw it as T1044's fold. Alternative if a primary 6VR4 coordinate file is available to a later lane: swap the chain, keep the count.
F8. **Grades.** On screen: all A (recomputed or primary), none C. Nothing was opened (egress): Jumper's 2,180-residue caption was read in two extractions, Du 2018 in three. Open S5, S6 and S10 before ship. Spacecraft (Hubble 500 N m s, ISS gyros) numbers are C: out.

## Sources (>= 3)
S1 NASA Earth fact sheet · S2 verlet_vs_rk4.c + trace.c + recompute.py · S3 Wisdom-Holman 1991, Hairer et al. 2003, Laskar-Gastineau 2009 · S4 stepsize caveats (arXiv 2111.08835) · S5 Greydanus et al. 2019 · S6 Du, Hu, Lee 2018 · S7 Kunin et al. 2021 · S8 part 1 recompute (network) · S9 Kelvin 1869, Salmon 1988/2013, Met Office GungHo, kelvin model · S10 Jumper et al. 2021. URLs and grades in sources.md and claims.json.

## Not this
- Economics (Samuelson 1970: a model identity, no measurement) and chemistry (selection rules are not a conserved number in time): out by the director.
- Spacecraft momentum: numbers are C; out.
- "Symmetry causes conservation" or "AI discovers laws": the film says "comes with" and "keeps".
- A cost-matched RK4 race: not what this shows (F2).
- A digit on the weather beat: none is A/B; the picture is wordless and the caption has no digit.
- "AlphaFold conserves energy": equivariance is a symmetry of the model, not a conserved quantity.
- The Mercury 1 % story: caution (arXiv 2111.08835), no number on screen.
