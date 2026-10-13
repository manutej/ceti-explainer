# Noether's theorem outside quantum physics: what a lay film can stand on

Research lane for film `noether-symmetry`, compiled 2026-10-10 (Wave AI-STORIES, fourth film). Scope: Noether's theorem for a lay audience, one real
fixture with public numbers, the modern non-quantum uses with sources, and which three fit a 2 to 3 minute film.

## Read this first (provenance)
- Egress: WebFetch failed on every host (nssdc.gsfc.nasa.gov, arxiv.org, en.wikipedia.org, ssd.jpl.nasa.gov: ENOTFOUND or proxy 403). Everything below was
  read through WebSearch (extended) result text, not from an opened page. URLs are the primary page the search returned; open them before a number ships.
- Grades (same rule as AI-ECONOMICS-2026.md): A = primary table or paper exists and the figure came back consistently from more than one extraction, or I
  recomputed it; B = reputable secondary, or a primary seen once; C = estimate, single secondary, or the link to Noether is asserted by commentary only.
  Only A and B go on screen. "(derived)" = my arithmetic from sourced inputs (recompute.py in factory/topics/noether-symmetry/).
- Two corrections to the brief's assumptions: (1) NASA's Earth fact sheet lists perihelion, aphelion and the AVERAGE speed (29.78 km/s), not the speeds at
  perihelion and aphelion; 30.29 and 29.29 km/s come from Wikipedia "Earth's orbit" (secondary, B), and the same speeds follow from NASA's distances through
  the vis-viva equation (derived, A inputs). (2) Samuelson's 1970 paper is an optimal-growth analogy to energy; the explicit Noether framing is later work.

---
## (a) Noether's theorem in plain words
**Statement.** Emmy Noether proved in 1918 (paper "Invariante Variationsprobleme", Nachrichten der Koniglichen Gesellschaft der Wissenschaften zu Gottingen,
Math.-phys. Klasse, pp. 235-257; English translation M. A. Tavel, Transport Theory and Statistical Physics 1(3), 1971, pp. 186-207): for a system whose laws come
from a least-action principle, every continuous symmetry of those laws comes with a quantity that does not change in time, and the other way round.
| Symmetry (what you may change without changing the laws) | Conserved quantity | Everyday picture |
|---|---|---|
| shift in time (the laws are the same today and tomorrow) | energy | a frictionless pendulum swaps height for speed and the total stays |
| shift in space (the laws are the same here and there) | momentum | two skaters push apart, the total motion stays zero |
| rotation (no direction in space is special) | angular momentum | a planet sweeps equal areas in equal times (Kepler); a skater pulls in her arms and spins faster |
Standard classical demonstrations (all textbook, all A as physics): Kepler's second law is conservation of angular momentum for a central force; the pendulum
and the spring conserve energy because their laws do not depend on the clock; a free particle conserves momentum. Teaching route with only elementary calculus:
Hanc, Tuleja, Hancova, "Symmetries and conservation laws: consequences of Noether's theorem", American Journal of Physics 72, 428-435 (2004), doi 10.1119/1.1591764.
Historical context (Klein, Hilbert and the energy-conservation debate in general relativity): Kosmann-Schwarzbach, "The Noether theorems in context", arXiv 2004.09254.
Grade A for the theorem and the table; B for the year and pages (several bibliographic records agree; paper not opened).
**The lay sentence** ("a symmetry is what you can change without changing what happens"): if the rules do not care about X, something is conserved.
**What it is not.** It is not a quantum fact (1918 predates quantum mechanics as we know it, and the proof is classical). It needs a least-action (Lagrangian)
description, and a symmetry of the LAWS, not of one situation: an orbit can be lopsided and the law still has rotation symmetry. Friction, drag or a time-varying
force break a symmetry and the quantity leaks (see the limit lines below). Whether symmetry "explains" conservation or only goes with it is a live
philosophy-of-physics question (arXiv 2010.10909); the film says "comes with", not "causes".
Sources: https://en.wikipedia.org/wiki/Noether's_theorem (overview, B) ; https://arxiv.org/abs/2004.09254 ; https://arxiv.org/pdf/1902.01989 (A Century of Noether's Theorem, Colloquium) ;
https://www.semanticscholar.org/paper/Symmetries-and-conservation-laws:-Consequences-of-Han%C4%8D-Tuleja/3ab3ebcc259ba4fb4bb44f8b481096fc63b67a94 ; https://users.physics.ox.ac.uk/~Steane/teaching/noether.pdf

---
## (b) The real fixture: Earth at perihelion and aphelion
| Quantity | Value | Unit | Source | Grade |
|---|---|---|---|---|
| Perihelion (closest to the Sun) | 147.095 | million km | NASA NSSDC Earth Fact Sheet https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html | A (two extractions agree; the general sheet https://nssdc.gsfc.nasa.gov/planetary/factsheet/ rounds to 147.1) |
| Aphelion (farthest) | 152.100 | million km | same | A (general sheet 152.1) |
| Orbital eccentricity | 0.0167 | none | same | A |
| Average orbital speed | 29.78 | km/s | same | A |
| Speed at perihelion | 30.29 | km/s | Wikipedia "Earth's orbit" https://en.wikipedia.org/wiki/Earth's_orbit (primary behind it not named; an independent DE430 figure quoted by a homework site is 30.28) | B |
| Speed at aphelion | 29.29 | km/s | same (DE430-based figure quoted there: 29.3) | B |
| Solar GM | 1.32712440018e11 | km^3/s^2 | IAU 2015 Resolution B3 nominal value (from memory, not fetched this session) | B |
**r x v** (distance times speed, which is angular momentum per unit mass, the conserved quantity of rotation symmetry), computed in recompute.py:
- perihelion 147.095 x 30.29 = 4,455.5; aphelion 152.100 x 29.29 = 4,455.0 (units: million km x km/s). Difference 0.011 %, i.e. 1 part in about 9,000 (derived, B because the speeds are B).
- The published speeds carry two decimals, so each is good to +/-0.005 km/s = +/-0.017 %: the two products are equal to within the rounding of the speeds.
- Distance rises 3.40 % from perihelion to aphelion while speed falls 3.41 %; the two changes cancel in the product (derived).
- Cross-check from physics, not from the published speeds: vis-viva with a = 149.5975 million km and GM above gives 30.2872 and 29.2906 km/s, and r x v = 4,455.10 at both ends
  (equal by construction, since vis-viva already contains the conservation law). The published 30.29 / 29.29 agree with these to 0.01 %: the independent confirmation (derived, A inputs).
- Per unit mass the value is 4,455.1 million km x km/s = 4.4551e15 m^2/s (derived). Nothing here needs a quantum fact.
**Optional second fixture, not recommended:** Halley's comet, perihelion 0.59278 AU, aphelion 35.14 AU (Wikipedia infobox, B), speeds 54.52 km/s (1986) and about 0.909 km/s
(Space.com, B; https://en.wikipedia.org/wiki/Halley's_Comet ; https://www.space.com/halleys-comet-return). Distance ratio 59.3, speed ratio 60.0: r x v differs by 1.2 %, too much for a clean
claim because the speeds come from different sources and epochs (osculating elements change). Grade C as a pair; use only as a wow line with no product.
**Limit to say:** Earth's orbit is perturbed by the Moon and planets, so r x v drifts by a hair over centuries; the film's equality is to the precision of the published speeds.

---
## (c) Modern non-quantum applications
Each row: symmetry, conserved quantity, paper, year, one number, grade.
### c1. Classical mechanics and orbital design (the film's main case)
- Symmetry: rotation about the Sun; time shift. Conserved: angular momentum vector L = r x v (so the orbit stays in one plane and sweeps equal areas) and energy E (which fixes the orbit's size: E = -GM/2a).
- The two together fix an orbit's shape; an orbit is a point in (E, L) space, which is the film's re-projection. Number: Earth r x v above. Grade A (physics) / B (speeds).
- Orbital design: the circular restricted three-body problem has one conserved quantity, the Jacobi constant (energy in the rotating frame; time-shift symmetry of that frame), which sets zero-velocity curves
  bounding where a spacecraft can go. https://www.sciencedirect.com/topics/engineering/jacobi-constant ; https://people.unipi.it/tommei/wp-content/uploads/sites/124/2021/08/3body.pdf . The search showed no source
  stating the Noether link explicitly or a mission-design use with a number: grade B for the conservation, C for the Noether framing and the mission claim. Not used on screen.
- Numerical note (derived, recompute.py): a symplectic integrator keeps |L| to 1e-13 (the rotation symmetry survives discretisation) while E drifts by up to 5e-4 at a step of T/100,000 on the worst orbit, because a fixed time step breaks the time-shift symmetry. A real, small, honest limit.
### c2. Fluids: Kelvin's circulation theorem from particle relabelling
- Symmetry: relabelling which fluid parcel is which (a smooth, invertible renaming of the Lagrangian labels changes nothing physical). Conserved: circulation around a closed loop of fluid, Gamma = loop integral of velocity, in an ideal (inviscid, barotropic) flow; related results are potential vorticity (Ertel) and helicity.
  The link goes through Noether's theorem, in its second-theorem form for the infinite-dimensional relabelling group.
- Papers: Kelvin, "On vortex motion", Trans. R. Soc. Edinburgh 25 (1869) [theorem; from memory, B]; Salmon, "Hamiltonian fluid mechanics", Annual Review of Fluid Mechanics 20, 225-256 (1988), doi 10.1146/annurev.fl.20.010188.001301.
- Evidence: Salmon 2013 text says relabelling corresponds by Noether's theorem to the many vorticity conservation laws (https://pordlabs.ucsd.edu/rsalmon/salmon.2013.pdf); arXiv 1801.09729 and arXiv math/0702827 derive Kelvin from relabelling; Padhye and Morrison 1996 extend it to Ertel's PV. https://arxiv.org/pdf/1801.09729 ; https://arxiv.org/html/math/0702827
- Number: none that is a measurement. Picture: a smoke ring keeps its swirl as it travels (viscosity slowly breaks it). Grade B (all secondary reads; Salmon 1988 not opened).
### c3. Machine learning: scale symmetry and the conserved quantities of training
- Symmetry: multiply a hidden unit's incoming weights by a and its outgoing weight by 1/a: a ReLU network computes the same function (ReLU is positively homogeneous; the same holds for BatchNorm-followed layers). Conserved under gradient FLOW (training with an infinitely small step):
  for each hidden unit, c_i = |incoming weights|^2 - |outgoing weight|^2. Summed over a layer pair: |W1|^2 - |W2|^2, so the layers "balance" on their own.
- Du, Hu, Lee, "Algorithmic regularization in learning deep homogeneous models: layers are automatically balanced", NeurIPS 2018, arXiv 1806.00900 : the differences of squared layer norms stay constant under gradient flow; also a discrete-step version with decaying steps. Grade A (title, venue, statement returned by three extractions; PDF not opened).
- Kunin, Sagastuy-Brena, Ganguli, Yamins, Tanaka, "Neural mechanics: symmetry and broken conservation laws in deep learning dynamics", ICLR 2021, arXiv 2012.04728 : symmetries of the architecture (translation, scale, rescale) give conservation laws in the continuous limit of SGD "analogous to Noether's theorem";
  weight decay and finite learning rate BREAK them (a modified flow models the break; one summary says the finite step acts like a centrifugal force pushing norms up, B/C). Checked on VGG-16 with Tiny ImageNet. Grade A for the claim, B for the VGG-16 detail.
- Tanaka and Kunin, "Noether's learning dynamics: role of symmetry breaking in neural networks", NeurIPS 2021, arXiv 2105.02716 : the learning rule is the kinetic energy, the loss the potential; "kinetic symmetry breaking" drives a motion of the Noether charge, which with normalisation layers acts like adaptive optimisation (analogy to RMSProp). Grade A for the abstract, B for details.
- Equivariant networks (symmetry built in by design, a cousin not a conservation law): Cohen and Welling, "Group equivariant convolutional networks", ICML 2016, PMLR 48:2990-2999: error 2.28 % on rotated MNIST, 4.19 % (augmented) and 6.46 % (plain) on CIFAR-10 (abstract, B). Alet et al., "Noether networks: meta-learning useful conserved quantities", NeurIPS 2021, arXiv 2112.03321: learns the conserved quantity from data; modest gain on video of objects sliding down a ramp (B).
- Number for the film: our own simulation (not a published one): a 2-layer ReLU net, 16 hidden units, 100 training runs; each hidden unit's c_i moves by 0.001 (median) while the weights move 0.24, about 250 times more (recompute.py). Published number: none needed. Grade A for the symmetry (a one-line proof), simulation labelled MODEL.
### c4. Economics and control
- Samuelson, "Law of conservation of the capital-output ratio", PNAS 67(3):1477-1479 (Nov 1970), doi 10.1073/pnas.67.3.1477: for an intertemporally efficient path in a neoclassical von Neumann economy the capital-output ratio is conserved, derived as an "energy" integral of a time-free integrand in an optimal-control problem, by analogy to harmonic motion. https://www.pnas.org/doi/10.1073/pnas.67.3.1477 . The abstract draws an analogy; it does not invoke Noether by name (B for the result, C for "Noether").
- Sato and Ramachandran (eds.), "Conservation laws and symmetry: applications to economics and finance", Kluwer 1990 (reprints Samuelson; Sato's "The invariance principle and income-wealth conservation laws"); later work (Sato 2006; Kataoka and Hashimoto 1995) uses Lie-group invariance to derive such laws. https://link.springer.com/book/10.1007/978-94-017-1145-6 . Grade B for the book, C for the content of the individual chapters (not opened).
- Control: Torres, "On the Noether theorem for optimal control", European Journal of Control 8(1), 2002 (and "Conservation laws in optimal control"): conserved quantities along Pontryagin extremals of invariant problems. https://arxiv.org/html/math/0512468.pdf (related) . Grade B. No economics number found.
- Limit: these are properties of IDEALISED optimal-growth models; no source shows a real economy conserving a ratio. Grade B as theory, C as a description of the world. Not used on screen.
### c5. Ecology and epidemics
- SIR epidemic models and Lotka-Volterra predator-prey models have first integrals (for SIR, x + y - alpha ln x - beta ln y in a reduced system, arXiv 2402.11888; a vaccination SIR has a second only with zero birth and death, arXiv 2303.17198). The search found NO source that gets these from a Noether symmetry. Grade C for any Noether claim; exclude. (Conserved quantity yes, Noether no.)

---
## (d) Which three for a 2 to 3 minute film
| # | Application | Accessible? | Solid? | Picture | Verdict |
|---|---|---|---|---|---|
| 1 | Orbits (classical mechanics and orbital design) | yes: everyone has seen a planet | A (theorem), A/B (Earth numbers) | 3,000 moments of 300 orbits are noise in space and 300 dots on six shells in (L) space | USE, the main case |
| 2 | Neural-network training (scale symmetry) | yes with the same picture: "the same shell, in a system that is not physics" | A for the symmetry (Du 2018, Kunin 2021, one-line proof), simulation labelled MODEL | 3,000 training steps of 100 runs: a tangle in weight space, 100 dots on three shells in (c) space | USE, the reversal beat |
| 3 | Fluids (Kelvin circulation by relabelling) | yes: smoke rings, bath-water swirl | B (secondary reads of Salmon 1988; theorem is textbook) | no numbers, a single stage line; the "this is also Noether" surprise | USE as the third, briefly, no number |
Held back: economics (Samuelson 1970) is real but abstract: a growth-path identity in a model, the Noether link is later commentary (B/C), and a lay viewer cannot check it against anything. Mention only as a name if a line is free. Ecology and epidemics: no Noether source, drop. Equivariant networks: a cousin, not a conserved quantity; skip.
**Honest limits for the film.** The theorem needs a symmetry of the laws and a least-action form; friction, weight decay and finite learning steps break symmetries and the quantity drifts (our own simulation: c moves 0.0009 median per run, not zero); the 3,000 orbits and the network are simulated, only Earth is measured; "comes with" not "causes".
