# Noether outside quantum physics, Part 2: four real systems with sourced numbers

Research lane for film `noether-applied` (Wave NOETHER, part 2: "Where is this used today, outside quantum physics?"). Compiled 2026-10-10.
Extends factory/research/NOETHER-NONQUANTUM.md (orbit fixture, scale symmetry, Kelvin by relabelling, Samuelson) and does not repeat it. Read that file for the
theorem, the Earth r x v fixture and the 3,000-orbit / 100-network pictures. New here: numbers for the integrator, ML-by-design, weather and spacecraft cases.

## Read this first (provenance and grades)
- Egress: WebFetch is blocked; every number below was read from WebSearch result text. No primary PDF was opened. URLs are the pages the search returned.
- Grades (same rule as NOETHER-NONQUANTUM.md): A = primary exists and the figure came back consistently from more than one extraction, or I recomputed it
  (labelled DERIVED/MODEL); B = reputable secondary, or one extraction of a primary; C = snippet only, forum, or asserted by commentary. Only A and B go on screen.
- "Quote" lines are the search-result sentence that carried the number, trimmed. Quotes are from the search summaries, not from an opened page.
- New computation this lane (grade A, DERIVED, reproducible): factory/topics/noether-applied/verlet_vs_rk4.c (gcc -O2 verlet_vs_rk4.c -lm; args: e steps_per_orbit
  orbits mode, mode 0 = velocity Verlet, 1 = classical RK4). Results in section 1.
- Honesty on "Noether": three of the four cases are Noether in the strict sense (a continuous symmetry of a variational problem gives the quantity: rotation to
  angular momentum, relabelling to circulation, rotation of a free body to total angular momentum). The integrator case is Noether's cousin (backward error
  analysis: the code conserves a nearby "shadow" Hamiltonian exactly). ML-by-design (equivariance) is a symmetry, not a conservation law. Each section says which.

## Quick table (all candidates)
| # | System | Conserved / kept | Symmetry | Best number (grade) | Year | Visual | Verdict |
|---|---|---|---|---|---|---|---|
| 1 | Symplectic integrators: orbits, solar system, molecular dynamics | angular momentum exactly, energy bounded | rotation (kept by the code); time shift (kept in a shadow form) | L drift 3e-12 vs RK4 9e-3 after 1e5 orbits; Verlet energy error never above 7e-5 over 1e9 steps while RK4 drifts 1.9e-2 per 1e5 orbits (A, DERIVED) | 1967 to 2026 | strong | FILM |
| 2 | Machine learning built on the symmetry | layer-norm differences (balance); energy of a learned system; shape of a protein | rescaling of weights; time shift; rotation/translation | HNN energy error 170 vs 0.38 (x1e-3), about 450 x lower (A); G-CNN 5.03 % to 2.28 % error (A); AlphaFold 0.96 A median (A) | 2016 to 2021 | strong | FILM |
| 3 | Weather and fluids: potential vorticity, Kelvin circulation | circulation; Ertel PV on an isentropic surface | relabelling of fluid parcels | tropopause defined at 2 PVU (B); no measured circulation found | 1869, 1985, 2013 | good (ribbons) | FILM, number-light |
| 4 | Spacecraft: reaction wheels, control moment gyros, free-floating robots | total angular momentum of craft plus wheels | rotation of space | Hubble wheel store 500 N m s (C); CMG 4,745 N m s each, 18,981 total (C) | 1980s to now | good (sphere of arrows) | FILM as fourth, numbers are C |
| 5 | Economics (Samuelson 1970, Sato) | capital-output ratio in a model | time shift of an optimal-growth integrand | none measured | 1970, 1990 | weak | HOLD (see section 5) |
| 6 | Chemistry selection rules | transition allowed or forbidden | molecular point-group symmetry | none searched; not a conservation law in time | n/a | weak | DROP |
| 7 | Lagrangian NNs, conservation-constrained PINNs | energy etc. | as in 2 | not searched this lane (HNN is the cleaner number) | 2019 to 2020 | same as 2 | FOLD into 2 |

## 1. Symplectic integrators: keep the number, and the code is trustworthy for a billion steps
**10-year-old sentence.** "A computer that moves a planet one tiny step at a time can cheat in a way that keeps the spin-number exactly right, and then the planet
stays on its track for a billion steps instead of slowly spiralling off."
**Conserved number.** Angular momentum L = r x v, kept to rounding error by every central-force step (rotation symmetry survives discretisation); energy kept
bounded (not exactly) by a symplectic method, drifting without bound in a standard Runge-Kutta (RK) method.
**Symmetry.** Rotation about the Sun (kept exactly by the code). Time shift (kept only in a shadow form: the code is the exact flow of a nearby Hamiltonian, the
statement of backward error analysis; Hairer, Lubich, Wanner, "Geometric numerical integration illustrated by the Stormer-Verlet method", Acta Numerica 2003,
https://www.unige.ch/~hairer/preprints/gniverlet.html ; quote: "a backward error analysis ... translates the geometric properties of the method into the structure of a
modified differential equation, whose flow is nearly identical to the numerical method" (B, snippet)).

### Numbers
| Claim | Number | Source | Grade |
|---|---|---|---|
| Earth-shaped orbit (e = 0.0167), velocity Verlet, 100 steps per orbit, 1e9 steps = 1e7 orbits: relative energy error at ten checkpoints | never above 6.9e-5 (values wander between -6.8e-5 and -6e-7, no trend) | my run, verlet_vs_rk4.c | A (DERIVED) |
| Same run, relative angular-momentum error | 2.8e-12 at 1e9 steps (rounding only) | same | A (DERIVED) |
| Same orbit, same 100 steps per orbit, RK4, after 1e4 orbits (1e6 steps) | energy error 1.7e-3, L error -8.7e-4 | same | A (DERIVED) |
| RK4 after 1e5 orbits (1e7 steps) | energy error 1.9e-2, L error -9.3e-3; steady growth, 1.8e-3 per 1e4 orbits | same | A (DERIVED) |
| RK4 after 1e9 steps | the orbit has collapsed (energy changed by a factor 267, L by 26 x); not a physical orbit | same | A (DERIVED) |
| Verlet at 1e6 steps (1e4 orbits) | energy error 2.1e-5 (max 6.9e-5), L error 8e-15 | same | A (DERIVED) |
Reading: at the same step the Verlet energy error is about 25 x smaller than RK4 after 1e4 orbits and 270 x smaller after 1e5 orbits, and RK4 keeps growing while
Verlet does not. Angular momentum: 2.8e-12 against 9.3e-3, a factor of about 3e9.
Literature statement of the same pattern (B): "for periodic motion, their [symplectic] energy errors are bounded and periodic, in contrast to Runge-Kutta type
algorithms whose energy error grows linearly with the number of periods" (from a search of arXiv math-ph/0608012, "The physics of symplectic integrators: perihelion
advances and symplectic corrector algorithms", https://arxiv.org/pdf/math-ph/0608012 ; B, one extraction).

### Where it is used (real systems)
- **Solar-system integrations.** Wisdom and Holman, "Symplectic maps for the N-body problem", Astronomical Journal 102, 1528-1538 (1991), doi 10.1086/115978. The
  abstract (ADS, https://ui.adsabs.harvard.edu/abs/1991AJ....102.1528W/abstract) says the method computed the evolution of the outer planets for a billion years
  (grade A for the citation and the billion-year claim, from the ADS abstract snippet and the CfA listing). Sussman and Wisdom 1988 (Digital Orrery, Pluto, 845 Myr,
  e-folding time about 20 Myr) and 1992 (Science, whole solar system, e-folding about 4 to 5 Myr, "new symplectic algorithm") (B: Lyapunov times from review
  extractions that disagree on the range 4 to 5 Myr; quote "extended by two orders of magnitude the longest numerical integration of the solar system", B).
- **Mercury, 2009.** Laskar and Gastineau, Nature 459, 817-819 (2009): 2,501 solutions over 5 billion years, about 1 % lead to a large increase of Mercury's
  eccentricity, and one reaches collisions of Mercury, Mars or Venus with the Earth after about 3.34 billion years. Press page of the authors' institute
  https://perso.imcce.fr/jacques-laskar/obs-press-colli/colli.en.shtml ; quote: "simulate 2,501 solutions ... over 5 billion years ... About 1% ... lead to a large
  increase in Mercury's eccentricity" (A for 2,501 / 5 Gyr / about 1 %; two independent extractions). A later rare-event study gives 8.0 +/- 1.8 e-3 (0.8 %) for the
  5 Gyr probability, arXiv 2106.09091 (B, one extraction).
- **Molecular dynamics.** The Verlet family is the integrator in GROMACS and AMBER. Real drift numbers from GROMACS developers on a forum (GROMACS 2018, 1728 TIP3P
  waters, 2 fs, 300 K, NVE): "-0.000069 kJ/mol/ps/atom"; default pair-list tolerance 0.005 kJ/mol/ps per atom (https://mailman-1.sys.kth.se/pipermail/gromacs.org_gmx-users/2018-March/119290.html ;
  https://gromacs.bioexcel.eu/t/conserved-energy-is-not-conserved/6456). Grade C (forum posts by developers, not a manual page). Scale of a long run: Anton, the special-purpose
  machine, needs forces "repeated on the order of 10^12 times" for a millisecond (Shaw et al., Communications of the ACM, 2008,
  https://cacm.acm.org/research/anton-a-special-purpose-machine-for-molecular-dynamics-simulation ; B). Check: 1 ms / 2.5 fs = 4e11 steps (DERIVED), so "10^11 to 10^12 steps"
  is the honest wording; the 2.5 fs value is my assumption, not found in a source.
- **REBOUND and others** still use Wisdom-Holman as the base scheme (secondary, B).

### How it looks (point cloud / ribbon)
- 1,000 planets (dots), each at its own start phase, on the same ellipse. X axis in steps (log), Y axis energy error. RK4 dots peel away upward and fan out; Verlet
  dots stay in a thin horizontal band. Counts first: "1,000,000,000 steps" then "error stays below 0.007 %" (6.9e-5 = 0.0069 %).
- Second move: a 3-D cloud of states (x, y, L). Verlet cloud stays on one flat disc at L = const; RK4 cloud drifts off in the L direction. This reuses part 1's shell picture.
- Ribbon: trace of one planet over 10 turns drawn for each method, RK4 ribbon spirals outward, Verlet ribbon closes.

### Honest limit
1. Symplectic is not exact: energy wobbles (7e-5 here) and the phase of the planet is wrong by a growing amount (phase error grows linearly; a fourth-order RK can beat a
   symplectic scheme on perihelion advance, search extraction of arXiv math-ph/0608012, B).
2. Variable steps, large steps or close encounters break the guarantee: "time-reversible integrators with adaptive steps can still show energy drift" (same search, B).
3. A symplectic step that is too large injects artificial resonances: a 2021 paper argues they can add unphysical chaos for Mercury (arXiv 2111.08835, "Stepsize errors in the
   N-body problem: discerning Mercury's true possible long-term orbits", B). Mercury's 1 % rests on a method with its own caveat.
4. The solar system is chaotic (Lyapunov time about 5 Myr, B): a perfect integrator still cannot predict one planet beyond about 100 Myr. The conserved numbers survive; the position does not.
5. In MD the drift is dominated by cutoffs and pair-list buffers, not by the integrator (forum, C).
6. Noether link is B: Noether gives L exactly; the energy statement is backward error analysis, not Noether's theorem. Say "keeps" not "because of".

## 2. Machine learning: three ways a symmetry shows up
Use one idea and name the others in a line each. The idea for the film: balanced layers (Du et al.) as the "dots sort onto shells" beat in training space, then the
energy-keeping network (Greydanus) as the number beat.

### 2a. Balanced layers (conserved quantity of training)
**10-year-old sentence.** "If you make one dial of a machine twice as big and the next dial half as big, the machine behaves the same, so while it learns, the size
difference between the two dials stays put."
**Conserved number.** c = (size of incoming weights of a unit)^2 minus (outgoing weight)^2; summed over a layer, |W1|^2 - |W2|^2.
**Symmetry.** Rescaling of weights (positive homogeneity of ReLU) in gradient flow.
**Sources.**
- Du, Hu, Lee, NeurIPS 2018, arXiv 1806.00900 (https://proceedings.neurips.cc/paper/2018/hash/fe131d7f5a6b38b23cc967316c13dae2-Abstract.html). Quote: "gradient flow keeps the gaps between
  squared norms of different layers constant, with no explicit regularizer. So if the initial weights are small, the layers end up with balanced magnitudes." Also: constant
  step size gives linear convergence to the global minimum for rank-1 asymmetric matrix factorisation. Grade A (statement from NeurIPS abstract page and three extractions).
- Kunin, Sagastuy-Brena, Ganguli, Yamins, Tanaka, "Neural mechanics", ICLR 2021, arXiv 2012.04728. Quote: "a conservation law in the continuous-time limit of stochastic
  gradient descent, akin to Noether's theorem ... finite learning rates can break these symmetry induced conservation laws ... validated empirically on VGG-16 trained on
  Tiny ImageNet." Grade A for the claim; the search did not return the weight-decay formula, so do not put a formula on screen from this lane.
- Tanaka and Kunin, "Noether's learning dynamics", NeurIPS 2021, arXiv 2105.02716 (see NOETHER-NONQUANTUM.md c3; B for details).
**Number for the film.** Published: none found (the papers state laws, not a single memorable figure). Our own MODEL from factory/topics/noether-symmetry/recompute.py: 2-layer
ReLU net, 16 hidden units, 100 runs: c moves 0.001 (median) while the weights move 0.24, about 250 x more. Label MODEL; counts before ratios ("100 runs, 16 units each").
**Visual.** 100 dots in weight space (tangled paths) re-projected into c space where each dot sits still on its shell (part 1's move, now for a machine). Both views of the
same ids: gl-pointcloud id-stable morph.
**Honest limit.** The law holds exactly only for infinitely small steps and no weight decay. Real training (finite step, weight decay) breaks it (Kunin 2021, A). No claim
that balanced layers make a net better; Du et al. show it helps in a matrix-factorisation case.

### 2b. Hamiltonian neural networks (the energy-keeping network)
**10-year-old sentence.** "Teach a computer a swinging spring by showing it a few pictures of it, and it either forgets that the spring never loses energy (ordinary
network) or has the rule built in so it cannot forget (Hamiltonian network)."
**Conserved number.** Energy of a frictionless mass on a spring, proportional to q^2 + p^2.
**Symmetry.** Time shift, built into the network by learning the Hamiltonian and deriving the motion from it.
**Source.** Greydanus, Dzamba, Yosinski, "Hamiltonian Neural Networks", NeurIPS 2019, arXiv 1906.01563 (https://arxiv.org/abs/1906.01563 ; proceedings
https://proceedings.neurips.cc/paper_files/paper/2019/file/26cd8ecadce0d4efd6cc8a8725cbd1f8-Paper.pdf). Table 1, ideal mass-spring: train loss 37 +/- 2 for both, test loss 37 +/- 2
(baseline) vs 36 +/- 2 (HNN), energy error 170 +/- 20 (baseline) vs 0.38 +/- 0.1 (HNN), units 1e-3 per a summary (liner.com). A 2025 follow-up table lists baseline 168 +/- 20.5 vs
HNN 0.376 +/- 0.0798 (arXiv 2508.19410). Setup: 3 layers, 200 hidden units, tanh, 2,000 gradient steps; energy metric = MSE of energy along an integrated trajectory from a random
test point. Ratio 170 / 0.38 = 447, "about 450 x lower" (DERIVED from sourced pair). Grade A for the pair (three extractions plus an independent reproduction of the baseline);
the units (1e-3) are B. A student reproduction report got 3.87e-2 vs 9.4e-5 (about 410 x), same ordering (C). Qualitative quote: the baseline's forward simulation "drifts
over time to higher or lower energy states" while the HNN "learns to exactly conserve a quantity that is analogous to total energy".
**Visual.** 200 dots on a spring's phase plane start on one circle. Plain-network dots spiral in or out; Hamiltonian dots stay on the ring (reuse part 1's "dot cannot leave
its shell"). Counts first: "200 hidden units, 2,000 training steps".
**Honest limit.** The energy loss was measured on one toy problem (spring; the paper also does a pendulum and a two-body problem; numbers for those not retrieved). "Exactly
conserve" is the paper's wording for the learned quantity; time stepping in the evaluation is again an integrator (section 1). It is a design choice, not something the network
discovers. Learning the Hamiltonian from data without noise is easier than from pixels.

### 2c. Equivariant networks (a cousin: the answer rotates with the question)
- Cohen and Welling, "Group equivariant convolutional networks", ICML 2016 (arXiv 1602.07576; PMLR 48:2990-2999, https://proceedings.mlr.press/v48/cohenc16.pdf). Table 1, error on rotated MNIST:
  plain CNN (Z2CNN) 5.03 +/- 0.0020 %, G-CNN (P4CNN) 2.28 +/- 0.0004 %; the dataset has 62,000 rotated digits, test set 50,000. Grade A (the table came back identically from the
  paper and three later papers that cite it). Ratio 5.03 / 2.28 = 2.2 x lower error (DERIVED). The CIFAR-10 figures in NOETHER-NONQUANTUM.md (6.46 % plain, 4.19 % augmented) are B.
  The "data-efficiency" claim in the brief: NOT found in these extractions; do not claim fewer examples were needed.
- AlphaFold 2, Jumper et al., Nature 596, 583-589 (2021): median backbone error 0.96 A (r.m.s.d.95, 95 % interval 0.85 to 1.16 A) against 2.8 A for the next best method at CASP14; all
  atoms 1.5 A vs 3.5 A; "the width of a carbon atom is approximately 1.4 A" (https://pmc.ncbi.nlm.nih.gov/articles/PMC8371605/ ; A, two extractions). The structure module uses invariant point
  attention, invariant to global rotation and translation of the input frame (secondary reads: arXiv 2505.11580, a survey arXiv 2501.01477, B; the Methods and Supplementary
  Algorithms 22 to 23 were not opened, so "SE(3)-equivariant" is B).
- Visual: a protein as 3,000 dots turning in the viewer's hand while the table of distances between its dots stays fixed (counts: 3,000 dots, distances unchanged).
- Honest limit: this is invariance by construction. It is not a conserved quantity of a motion and Noether's theorem is not what makes it work. If the film uses it, say
  "the same idea, a thing that stays under a change" and nothing about conservation. The 0.96 A figure is a prediction accuracy, not a symmetry number; do not credit it to symmetry alone.

### Ranking inside ML
For the film use 2a (shells, the picture already built) and 2b (the 450 x number). 2c is a one-sentence aside or the swap-in for the fourth system (see ranking).

## 3. Weather and fluids: potential vorticity, Kelvin circulation
**10-year-old sentence.** "Tag a blob of air and follow it: the amount it spins, squeezed by how stretched it is, stays the same, so a weather forecast can use it as a name tag
for the air."
**Conserved number.** Kelvin: circulation around a closed loop of fluid parcels. Ertel: potential vorticity PV = (absolute vorticity dotted with the gradient of potential
temperature) / density, constant on a parcel in frictionless, heat-free (adiabatic) flow.
**Symmetry.** Relabelling of fluid parcels (a smooth renaming of which parcel is which). Noether route: Salmon, Annual Review of Fluid Mechanics 20, 225-256 (1988); Salmon 2013
(https://pordlabs.ucsd.edu/rsalmon/salmon.2013.pdf) "relabelling corresponds by Noether's theorem to the many vorticity conservation laws"; Padhye and Morrison 1996 for Ertel PV.
Grade B (see NOETHER-NONQUANTUM.md c2; not reopened).
**Numbers (few, honest).**
| Claim | Number | Source | Grade |
|---|---|---|---|
| PV unit: 1 PVU = 1e-6 K m^2 kg^-1 s^-1 | definition | standard meteorology (not retrieved this session; from memory) | C, verify before use |
| The dynamical tropopause is defined by a PV threshold of "about 2 PVU" | 2 | https://www.lmd.ens.fr/legras/Cours/M2-approf/PV/PV.pdf ; https://www.scielo.org.mx/pdf/atm/v16n2/v16n2a1.pdf | B (lecture notes and a journal article, snippets) |
| Ertel PV "conserved on isentropic surfaces in frictionless, adiabatic flow" | statement | https://www.weather.gov/media/wrh/online_publications/TAs/ta9515.pdf (NWS technical attachment) | B |
| "Material conservation is a good first approximation when latent heating is weak" | statement | https://gmd.copernicus.org/articles/15/4447/2022/gmd-15-4447-2022.html | B |
| PV thinking as an operational framework: Hoskins, McIntyre, Robertson 1985 (QJRMS 111, 877-946) | citation | NWS technical attachment above names Hoskins et al. 1985 | B (title and pages not retrieved; do not print the pages) |
| Weather-model design: UK Met Office GungHo programme, 2011 to 2016, new dynamical core "to improve the conservation properties"; mixed finite elements keep energy, enstrophy and a conserved PV diagnostic | statements | https://www.metoffice.gov.uk/research/foundation/dynamics/next-generation ; arXiv 1305.4477; talk abstract by Cotter | B (the finished operational core is LFRic; not searched) |
| Lab vortex ring: pinch-off at stroke ratio about 4, range 3.6 to 4.5; circulation maximal at that point | 4 (3.6 to 4.5) | Gharib, Rambod, Shariff, J. Fluid Mech. 360, 121-140 (1998), doi 10.1017/S0022112097008410 ; https://authors.library.caltech.edu/441 | B (abstract extractions; this is a "formation number", a ratio of length to diameter, not a circulation value) |
| Lab ring circulation in m^2/s | NOT FOUND | the search returned no typical value | none; if the film shows a number, label it MODEL |
| Impulse of a thin ring P = rho x Gamma x pi R^2 | formula | https://www3.nd.edu/~bolster/Diogo_Bolster/Research_6_-_Vortex_Rings_files/5%20-%20dynamics%20of%20thin%20vortex%20rings.pdf | B |
I did not find a measured-number story for this case. ECMWF-specific use of PV in its analysis (the brief's "Ertel PV used in ECMWF analysis") returned no source; Meteo-France ARPEGE
has a PV inversion study (https://bibliotheque.meteo.fr/pub/QUE00175526-ertel-potential-vorticity-inversion-using-digital.html, B), which is the closest. Do not say ECMWF.
**Visual.** Ribbons (gl-ribbons): a closed loop of 2,000 tagged dots stretches and folds as the flow carries it; the circulation number printed in the readout panel stays constant while the
loop's shape does not. One camera move: the loop becomes a long thin sheet with the number unchanged. Honest "MODEL" tag.
**Honest limit.** Viscosity, heating, rain and mixing break it (a smoke ring dies in seconds). Kelvin needs inviscid barotropic flow; Ertel PV needs frictionless adiabatic flow; real air has
latent heat (GMD quote). The Noether route is B, from secondary reads of Salmon.

## 4. Spacecraft and robots: momentum you cannot get rid of, only move around
**10-year-old sentence.** "A spinning wheel inside a satellite can turn the satellite the other way, because the total spin of satellite plus wheel cannot change."
**Conserved number.** Total angular momentum vector of craft plus wheels (and of robot base plus arm). Symmetry: rotation of space (no outside torque).
**Numbers.**
| Claim | Number | Source | Grade |
|---|---|---|---|
| Hubble reaction wheels "spin a large flywheel up to 3000 rpm, or brake it"; magnetic torquers dump excess momentum against Earth's field | 3,000 rpm; four torquers | NASA/GSFC Hubble pages https://asd.gsfc.nasa.gov/archive/hubble/technology/pcs.html | B (one extraction) |
| Hubble momentum storage total | 500 N m s ("fixed at 500 Nms") | a NASA NTRS record returned by search (ntrs.nasa.gov/citations/19870011237 or neighbour); which record carried the quote is not known | C |
| ISS control moment gyro (CMG) momentum | 4,745 N m s each; four CMGs up to 18,981 N m s | a NASA NTRS document (ntrs.nasa.gov/api/citations/20040086750) that does not name the station | C (my "ISS" label is an inference; four CMGs matches the ISS but the page does not say) |
| ISS uses four CMGs as the core of attitude control | 4 | headedforspace.com (secondary) | C |
| Free-floating space robot: base attitude depends on the path the arm took, not only the final arm pose (nonholonomic, from non-integrable angular momentum) | statement | NTUA papers by Papadopoulos and co-workers (https://nereus.mech.ntua.gr/Documents/pdf_ps/ICRA106.pdf) ; a 2026 arXiv paper on selective decoupling (arXiv 2609.26267) | B |
Gap: no primary Hubble or ISS momentum figure with page retrieved. A writer who wants this system should have a second lane fetch NASA's own spec before any N m s number goes on
screen; as it stands the numbers are C and do not qualify for screen. The robot statement (B) can stand without a number.
**Visual.** A sphere of arrows (momentum space): wheel arrows grow and shrink, body arrow swings the opposite way, the sum arrow stays fixed at the origin; or 3 coloured point
clouds (wheels, body, sum) where only the sum cloud is a single dot. Counts: "4 wheels" (Hubble) or "4 gyros" only after the NASA spec is verified.
**Honest limit.** Space has small torques (atmosphere drag, gravity gradient, sunlight pressure, Earth's magnetic field); wheels saturate and must be dumped with thrusters or
magnetic torquers, which is exactly when the conservation is "paid for" from outside (the Hubble page says torquers manage wheel speed, B). Gyroscopes failed and wheels failed on
real missions; this sheet has no failure numbers.

## 5. Economics, chemistry, others: why they are held
- **Samuelson 1970.** "Law of conservation of the capital-output ratio", PNAS 67(3), 1477-1479 (A for the citation: several records; reprinted in Sato and Ramachandran,
  Kluwer 1990). Sato and Ramachandran write that Samuelson "first explicitly introduced the concept of conservation law to theoretical economics" (Springer chapter snippet, B). The
  search did not return the abstract. No measured value of a conserved economic ratio exists in any source found; the case is a model identity. Not modern (1970; Sato 1990).
  Hold for part 3 or a one-word name-drop; never as a numbers system.
- **Chemistry.** No search made; selection rules are point-group symmetry, not a conserved quantity of a motion in time. Drop.
- **Lagrangian neural networks (Cranmer 2020) and conservation PINNs.** Not searched; they restate 2b with a different formalism. Fold into 2b if a line is free.
- **Optimal control (Torres 2002).** B in NOETHER-NONQUANTUM.md; no number. Skip.

## Ranking: four to film (with reasons)
Criteria in order: (a) concrete number, (b) modern (2015 to 2026), (c) visual as point cloud or flow, then (d) honesty of the Noether link.
1. **Symplectic integrators (orbits, solar system, MD).** (a) The best numbers in this lane and I can reproduce them: 1e9 steps, 6.9e-5 energy error vs RK4 collapse, L error 2.8e-12; Mercury
   2,501 runs / 5 Gyr / about 1 %. (b) The use is current (Laskar 2009, 2021 rare-event follow-up, Anton 2008 to 2014, REBOUND), the method 1991; weakest on the date criterion. (c) Excellent:
   dots fan out or stay in a band. (d) The L result is real Noether; the energy result is the cousin (say it). Open with this: it re-uses part 1's fixture (Earth orbit) so the viewer already knows the picture.
2. **Machine learning (balanced layers + Hamiltonian network).** (a) HNN 170 vs 0.38 (about 450 x), G-CNN 5.03 to 2.28 %, both A; balanced-layers number is our MODEL. (b) 2018 to 2021, the most modern.
   (c) 100 dots in weight space sorted onto shells (already built for part 1) and a spring phase plane. (d) Balanced layers are Noether in the strict sense, with broken-by-finite-step caveat (Kunin).
   Keep to one sentence on equivariant networks, as invariance not conservation.
3. **Weather and fluids (potential vorticity, Kelvin).** (a) Weak: the 2 PVU threshold (B) and a formation number of about 4 (B); no measured circulation. (b) Theory 1869 and 1985; modern use only
   through GungHo-style model design (B). (c) The only natural ribbon/flow film in the set, the best-looking beat. (d) Strict Noether through relabelling (B, secondary). Keep: it is what the lay viewer
   already sees (smoke rings, hurricane). Use no invented number; show the circulation readout as MODEL.
4. **Spacecraft momentum (reaction wheels, CMGs, free-floating robots).** (a) Numbers exist but are C (Hubble 500 N m s, CMG 4,745 N m s); needs a second lane to verify. (b) Operating hardware today.
   (c) A sphere of arrows is simple and is a different shape from the other three. (d) Cleanest Noether story (rotation to angular momentum, same as Earth in part 1), so a short beat that closes the circle.
   **Swap rule:** if the spacecraft numbers are not verified to A/B before the draft, replace it with AlphaFold (2c) as "the same idea, a thing that stays under a change", accepting that it is invariance not conservation.
Not filmed: economics (no measurable, 1970), chemistry, LNN/PINN (duplicates 2b), ecology/epidemics (no Noether source, see NOETHER-NONQUANTUM.md c5).
Suggested running order for 150 s (about 35 s each, one 3-D move per system): fluids first (smoke ring, the most familiar), then orbits/integrators (Earth again, ties to part 1), then ML
(the same shell on a machine), then spacecraft or AlphaFold, ending on the sentence "the same move four times: sort by what stays".

## Open items for the brief (not blocking)
- Verify GROMACS drift claim against the manual before use; today it is forum-only (C). Prefer the MODEL numbers in section 1.
- NASA primary page for Hubble and ISS momentum numbers (section 4).
- A measured circulation value for a laboratory ring (section 3) would lift that beat from "no number" to "one number"; Gharib 1998 text is the place to look.
- Pendulum and two-body energy numbers from Greydanus Table 1 (only the mass-spring row was retrieved).
