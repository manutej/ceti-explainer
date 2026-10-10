# Noether's symmetry · film id `noether-symmetry` · brief (Wave AI-STORIES, fourth film)

## Subject
kind: concept with one real fixture and two simulations · name: Noether's theorem outside quantum physics (1918): every continuous symmetry of the laws comes with a quantity that does not change · source material: factory/research/NOETHER-NONQUANTUM.md; factory/WAVE-AI-STORIES.md "Fourth film"; recompute.py (simulations, seed 20261010). Sources, grades and what could be opened: sources.md.

## Audience
manager; a room that hears "conservation law" and "symmetry" as physics words, uses neural networks every day, and has never seen the two joined. No jargon without a picture: L is shown as "the spin arrow of an orbit", c as "the sum that should not change".

## Format and look
feature-long, 153 s (150 + 3 s card), level manager, renderer webgl, chrome none, material ink, brand ceti-coastal-dark. Commit: none (D11). Chain: gl-pointcloud (required), gl-camera-rig, gl-labels, formula-bind. Windows HOOK 0–12 · CASE 12–60 · COUNT 60–135 · MONDAY 135–150.

## The belief
"Conservation laws, like energy and momentum, are rules nature was handed: they hold and that is that." (Said in the film without a digit: "a rule handed down".)

## The reversal (two pictures)
Belief picture: 3,000 dots, each one moment of an orbit, plotted where the planet is: a tangle with no pattern and nothing that holds still. After the count and one real fixture (Earth, distance times speed equal at both ends of its orbit to 0.011 %): re-plot the SAME 3,000 dots by each orbit's spin arrow and the tangle collapses onto 300 specks lying on 6 thin shells; inside one orbit the spin and the energy vary by less than 1 part in a trillion while the position swings by about half its size. Second reversal, away from physics: 100 training runs of a tiny network are a tangle in weight space; re-plotted by the sum |in-weights|² − |out-weight|² per unit, they collapse onto 3 shells, the weights having travelled about 250 times farther than that sum.

## Fixture
Earth's orbit, NASA Earth Fact Sheet: perihelion 147.095 and aphelion 152.100 million km (A); speeds 30.29 and 29.29 km/s (Wikipedia "Earth's orbit", B; they agree with vis-viva computed from NASA's distances to 0.01 %). Distance × speed: 4,455.5 and 4,455.0 million km × km/s, 0.011 % apart, inside the ±0.017 % rounding of the published speeds. This is the angular momentum per unit mass of the Earth, the conserved quantity of rotation symmetry.

## Count (units; the first lands before any ratio)
1. "one dot is one moment of one orbit": 300 simulated two-body orbits × 10 moments = 3,000 dots, lands 26.0 s (count.at). Orbits: 6 spin levels × 5 energy levels × 10 random orientations (recompute.py A).
2. "one dot is one recorded step of one training run": 100 runs × 30 steps = 3,000 dots, lands 108.5 s (a second count, after the first has landed).
Ratios after counts: 0.011 % (53.5 s), under 1 in a trillion (75.6 s), 62 of 300 orbits (85.0 s, a cut), about 250 times (128.5 s).

## Mechanism
A symmetry is a change that leaves the laws alone. If the laws do not care which way is up (rotation), the spin arrow of an orbit cannot change; if they do not care what day it is (time), its energy cannot change. A state of the orbit is then described by quantities that never move (spin arrow, energy) and one that does (where on the orbit). Plot each dot by the ones that never move and every dot of an orbit lands on the same spot: 3,000 dots become 300 specks, and specks with the same spin length sit on a shell. A neural network with ReLU units has a scale symmetry (double a unit's in-weights, halve its out-weight: same function), so the same plot works in a space that has no planets in it.

## Monday
question: "What stays fixed in our data while everything else moves, and what are we allowed to change without changing the answer?"
honest limit (exactly one, on stage): "Simulated orbits, a toy network, ideal laws: real systems drift a little." It names what the fixtures do not prove: only Earth's four numbers are measured; the orbit cloud is exact by construction and the network is a toy (its invariant drifts by 0.00095 median over a run at a finite step, not zero).

## Commit
none (D11).

## Takeaway (card, ≤ 60 chars)
Every symmetry hides something that stays. (42)

## Cost
not asked.

## The three applications (research file §d)
1. Orbits: classical mechanics and orbital design. 2. Neural-network training (scale symmetry; Du, Hu, Lee 2018; Kunin et al. 2021; Tanaka and Kunin 2021). 3. Fluids (Kelvin's circulation theorem from particle relabelling; Salmon 1988), one stage plate, no number. Held back: economics (Samuelson 1970, an analogy in an idealised growth model; the Noether link is later commentary, B/C), ecology and epidemics (first integrals exist, no Noether source found, C), equivariant networks (a cousin, not a conserved quantity).

## Findings (decide or accept before drafting)
F1. **NASA does not publish the two speeds.** The brief assumed NASA's fact sheet has 30.29 and 29.29 km/s; it lists perihelion, aphelion, eccentricity and the AVERAGE speed 29.78 km/s. The two speeds are Wikipedia's (B). They are confirmed by vis-viva with NASA's distances and the IAU solar GM (30.287 and 29.291 km/s), so the product claim is B, honest, and cross-checked. The ceiling on "equal" is the speeds' two-decimal rounding (±0.017 %), and the film says "0.011 % apart", not "exactly equal".
F2. **The orbit cloud is conserved by construction.** The 3,000 states are the exact Kepler solution, so L and E are constant to round-off (2.6e-15 and 1.4e-13 worst relative spread over 300 orbits). That is the theorem, not a measurement, and the film says "simulated". A velocity-Verlet integration of all 300 orbits at a step of T/100,000 keeps |L| to 1.4e-13 and lets E drift by up to 5.3e-4 (a time step breaks time-shift symmetry): not shown, recorded in NOTES for the drafter if a question arises.
F3. **"Thin shells" are spheres of equal |L| in the spin-arrow space (Lx, Ly, Lz), colour = energy level.** The brief's (E, L) projection would give rods (E and |L| fixed, only the phase varies); the spin-arrow space shows true shells and the dots of an orbit sit on top of one another (10 marks per speck). The energy re-partition (M2) then stacks the specks into 5 layers. data/orbit_table.json rebuilds all 3,000 states in JS in a few lines (Kepler solve); data/orbits.json is the full table for checking, not shipped in the page.
F4. **Module gap.** gl-pointcloud has a brush, a reveal and a camera but no id-stable morph between two coordinate sets. Move M1/M4 need `to: {x,y,z}` and `morph: [t0,t1]` (R-E I1/I2 checked by `count`), or a film-local copy. Also needed: a per-mark flag for the cut (supported: `brushed`), a drawn cut plane, two groups (orbits, network) in one cloud (6,000 marks, group 1 hidden until 103.5 s).
F5. **Network is a toy and labelled MODEL.** 2 inputs, 16 ReLU units, no biases, 128 seeded points, teacher of 3 units, plain gradient descent at 0.01 (986 steps). The invariant is exact only for infinitely small steps; recompute.py prints the drift: median 0.00095 per run, worst 0.0053, against run shells of radius 0.4, 0.8, 1.2. The weight-space picture is a 3-D projection (PCA) of 48 weights and shows 18.5 % of the variance; the film says "a picture of the weights" and does not read the 3 axes.
F6. **Grades.** On screen: Earth distances A, speeds B, products B, the 0.011 % B; simulation numbers A (recomputed); years and papers A/B. Nothing C is on screen. GM_sun is from memory (off screen). The Samuelson year is held off screen. No source was opened (egress): all read through WebSearch extractions; open the NASA, Du 2018, Kunin 2021 and Salmon 1988 pages before shipping.

## Sources (≥ 3)
S1 NASA Earth fact sheet · S2 Wikipedia Earth's orbit · S3 IAU 2015 B3 · S4 Noether 1918 / Kosmann-Schwarzbach · S5 Hanc et al. 2004 · S6 Du, Hu, Lee 2018 · S7 Kunin et al. 2021 · S8 Tanaka and Kunin 2021 · S9 Salmon 1988 · S10 Samuelson 1970 · S11 recompute.py. URLs and grades in claims.json and sources.md.

## Not this
- A lecture on Lagrangians or quantum fields: the theorem is classical and the film never says "action" or "Lagrangian".
- "Symmetry causes conservation": the film says a conserved quantity "comes with" a symmetry.
- Plotting only the Earth: one planet shows the equality, the 3,000 dots show why it is not a coincidence.
- A line chart of L over time: the flat line is the thing nobody remembers; the collapse of the cloud is.
- Claiming the network "obeys physics": it shares a symmetry, nothing more.
- A made-up economics or epidemic example: no solid Noether source (research file c4, c5).

## Director's choices (2026-10-10)
- On stage: the Earth fixture (distances from the NASA fact sheet; speeds from the standard tables, grade B, consistent
  with vis-viva to 0.01 %: the caption says "within a hundredth of a percent", never a false precision), the 3,000 orbit
  states, the 3,000 training states. The fluids plate stays wordless (one picture, no number). Economics and epidemics out.
- The re-projection is the film's one big move: the same 3,000 dots, drawn in position space, travel (id-stable: the
  drafter patches its lib copy of gl-pointcloud with per-point home coordinates and a mix knob) onto the (E, L) shells.
- The honest line names what is simulated and what is measured.
