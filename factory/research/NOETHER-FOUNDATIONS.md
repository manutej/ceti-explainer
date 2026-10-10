# Noether foundations: what the writers of Part 1 (concept) and Part 2 can stand on

Research lane, Wave NOETHER, compiled 2026-10-10. Extends (does not repeat) factory/research/NOETHER-NONQUANTUM.md, which already holds the
Earth r x v fixture (A/B), the ML, fluids and economics rows, and the plain-words table. Read that file for Earth; this file adds the three
statements, the explainer survey, the dated history, four more fixtures, the "not conserved" cases and the pitfalls.

## Read this first (provenance and grades)
- Egress: only WebSearch worked; WebFetch is blocked. Every number below comes from a search snippet or from my own arithmetic. Pages were not opened.
- Grades: A = primary or textbook statement that came back consistently, or a physics identity I recomputed from sourced inputs;
  B = reputable secondary, or one snippet from a reputable page; C = single weak snippet, forum, retail or machine summary. Only A/B go on screen.
  "(derived)" = my arithmetic (python3, checked 2026-10-10). Each sourced number carries the snippet's key words in quotes.
- Four things the earlier brief or my own first searches got wrong, so writers do not repeat them:
  1. I found NO 3Blue1Brown video on Noether's theorem (two searches, nothing). The "3b1b register" in WAVE-NOETHER.md is a style target, not an existing reference. Do not claim "like 3b1b's Noether video".
  2. One homework-answer page says a skater with I = 3.2 and 0.8 kg m^2 and 5.4 rev/s goes to "2.16 rev/s". That arithmetic is wrong (0.8 x 5.4 = 4.32, / 3.2 = 1.35). Do not use that page.
  3. The Einstein 1918 letter wording "go to school under Miss Noether" is a loose translation. See section 3, fact 4, for what is actually attributable.
  4. The date Klein presented the paper is 26 July 1918 in the stronger sources (the Academy register, quoted in a 2025 article) and 16 July in a weaker one. Use "July 1918" on screen.

---
## 1. Noether's theorem stated three ways

### 1a. For a physicist (use in a lower-third footnote or the Part 2 card, never as spoken text)
If the action S = integral of L(q, dq/dt, t) dt is unchanged (or changes only by a boundary term) under a one-parameter continuous family of
transformations of the coordinates, then there is a function Q(q, dq/dt, t) that is constant along every solution of the equations of motion.
And the converse reading: each conserved quantity generates a symmetry (Poisson-bracket form, Baez). Theorem I of the 1918 paper.
- "Links a conservation law with every continuous symmetry transformation under which the Lagrangian is invariant in form." (Colloquium: A Century of Noether's Theorem, arXiv 1902.01989 via snippet) Grade A.
- Both theorems "and their converses are called Noether's theorem in the physics literature" (same Colloquium, snippet). Grade A.
- Continuous only: "a square's 90-degree rotation (discrete) falls outside its scope while a circle's rotation does not" (Discover Magazine, snippet). Grade B.
- Baez's algebraic form: "the theorem holds whenever observables can be mapped to generators so that each observable generates a one-parameter group that preserves itself" (arXiv 2006.14741, "Getting to the Bottom of Noether's Theorem", snippet). Grade A for existence, B for paraphrase. He covers only the first theorem.
- Teaching route with elementary calculus: Hanc, Tuleja, Hancova, Am. J. Phys. 72, 428 (2004) (already in NOETHER-NONQUANTUM.md, A).

### 1b. For a programmer (the right register for Part 2's ML and simulation beats)
"If your loss function (or simulator step) returns the same value after you apply a transformation T(s) for every real s, then there is a
checksum that every correct run preserves." Concretely:
- Rename a variable consistently in the whole program and the program means the same: that is a symmetry. The invariant is what the rename cannot touch.
- A unit test of a physics engine is a Noether test: run 10^6 steps, assert that total momentum, angular momentum and energy are unchanged to tolerance.
  If the assertion fails, the code broke a symmetry (a fixed time step breaks time-shift; a bug in the force breaks translation).
- Same shape in ML (NOETHER-NONQUANTUM.md c3): rescale a hidden unit's incoming weights by a and outgoing by 1/a, the function is identical, so
  |incoming|^2 - |outgoing|^2 stays constant under gradient flow (Du, Hu, Lee 2018, arXiv 1806.00900, A).
- Honest limit for the programmer: the checksum is exact only in the continuous-time limit; real code with finite steps keeps some checksums to machine precision and drifts others (symplectic integrator, derived in NONQUANTUM c1: |L| to 1e-13, E drift up to 5e-4).

### 1c. For a 10-year-old (one-breath versions; pick one for the film)
- "If you can change something and nothing happens, something else in the world is keeping count." (the film's spine)
- "Spin a toy top on a table. The table looks the same whichever way you turn it, so the top's spin cannot just vanish." (rotation)
- "Play the same game today or tomorrow and the rules are the same. Because of that, the score of the game, energy, never changes by itself." (time)
- Feynman's block parable is the model of "counting without a thing": a boy has 28 blocks; "no matter what he does with the blocks, there are always 28 remaining"; and the lesson is "there are no blocks" (Feynman Lectures Vol I ch. 4, snippet; Caltech page https://feynmanlectures.caltech.edu/I_04.html). Grade B (page not opened; the 28-blocks story is well known and several snippets agree).
- Quanta's lay definition: symmetry is "something you can do to a system that leaves it unchanged" (Shalma Wegsman, "How Noether's Theorem Revolutionized Physics", 7 Feb 2025, snippet). Grade B.
- Words to avoid in the child version: "Lagrangian", "action", "invariant", "generator", "gauge", "group".

### 1d. The correspondence table (symmetry of the LAWS, not of one situation)
| Change you may make without changing the laws | Conserved quantity | One everyday example, with a number you could check | Grade |
|---|---|---|---|
| Shift in time (do it today or next Tuesday) | Energy | A 1 m pendulum released from 10 degrees: height gain 15.2 mm, top speed 0.546 m/s, same every swing (derived, g = 9.80665) | A |
| Shift in space (do it here or one room over) | Momentum | Equal-mass pool balls: a cue ball at 2.0 m/s stops dead, the struck ball leaves at 2.0 m/s; total momentum 0.320 kg m/s before and after (derived, m = 0.1598 kg, Penn State figure) | A/B |
| Rotation (no direction is special) | Angular momentum | A skater at 0.800 rev/s pulls her arms in, I falls 2.34 -> 0.363 kg m^2, and she spins at 5.16 rev/s (derived from the OpenStax numbers quoted in a snippet) | A/B |
| Phase shift of a quantum-mechanical wave (or, for a classical analogue, a constant shift of every voltage) | Electric charge | Everyday: "the zero of voltage is arbitrary, a 9 V battery is 9 V whatever you call ground." The true Noether link for charge is a global U(1) phase symmetry of the wave function and is a QUANTUM or field-theory statement (see caution) | A for the statement, C for the voltage analogy |
- Caution on the fourth row: the series is non-quantum. Charge/phase is the one row that cannot be shown without quantum or field language. Recommendation: put the first three on screen with a number each; mention the fourth in a single line "and a fourth, for electric charge, from a different kind of shift" or drop it. Do not claim "the zero of voltage" IS the Noether symmetry: the snippets I found do not connect the voltage zero to the Noether current. The scholarly question of WHICH symmetry gives charge conservation is open: Brading 2002, "Which symmetry? Noether, Weyl, and conservation of electric charge", cited in the Colloquium (snippet); one source says the local gauge symmetry is "physically relevant", another that the global U(1) suffices. Grade A that the dispute exists.
- Table prerequisite (worth saying once): all four are CONTINUOUS shifts (you can shift by any amount, including tiny ones). A snowflake's 60 degree rotations are discrete and give no conserved number.

---
## 2. The best existing lay explanations, and what each does with the eye

I could not open any video; the descriptions come from search snippets and episode listings. Treat visual descriptions as B/C; flag where I infer.

| Source | What it is (date, length) | Visual device | What works | What fails for a lay viewer |
|---|---|---|---|---|
| Quanta Magazine, S. Wegsman, "How Noether's Theorem Revolutionized Physics", 7 Feb 2025 | Article (+ audio edition) | Illustrated shapes: "start with a circle, rotate it by any angle" (snippet); then experiment moved in place and time | Starts from a shape everyone owns (circle), so "symmetry = change that leaves it unchanged" lands in one sentence; goes shape, then place, then time, then Standard Model (1970s) | The jump from "circle" to "laws of physics" is made in prose; the number that stays constant is never shown. Baez on social media: pop explanations of the theorem "tend to stop at roughly the same point" (snippet, C) |
| PBS Space Time, M. O'Dowd, "Noether's Theorem and the Symmetries of Reality", S4E25, 16 May 2018, 9:38 | Video | Talking host with animated physics; opens by calling conservation laws "cheat codes" and noting they "are only right sometimes" (snippet, B) | Good hook: the laws we trust are consequences, not axioms; covers the expanding-universe breakdown | Speaks to a viewer who already knows "energy is conserved"; Lagrangian vocabulary appears; no single object whose number is read off the screen |
| Veritasium, "Why Isn't Energy Conserved in Expanding Universe?" (listed also as "The Problem In Relativity Einstein Couldn't Fix"; a page dated 25 Dec 2025 is titled "The Biggest Misconception in Physics"), first listed 14 Apr 2025, 12.7M views per a third-party page (C) | Video | Opens with a thrown rock that slows and stops (puzzle about Newton's first law, snippet); then the Noether bridge; then GR's expanding universe | The strongest hook in the set: a failure of a "law" the viewer already believes. Puts the second theorem to work in lay words ("local symmetries lead to continuity equations") | Heavy on the GR/cosmology branch; the viewer leaves believing "energy is not conserved" without knowing why it IS conserved on a bench. Title/date ambiguity: confirm before citing. The video's references list credits "Alessandro from ScienceClic" and Rowe's 2019 arXiv paper (snippet, B) |
| Veritasium, "The Strange Physics Principle That Shapes Reality" (least action; title from a summary page, date not confirmed) | Video | Light taking the fastest path, history Bernoulli, Newton, Euler, Lagrange, Hamilton (snippet, C) | Sets up the "the laws come from a variational principle" prerequisite that Noether needs | Not about Noether; long |
| ScienceClic (Alessandro), Noether's theorem video, named in Veritasium's credits (snippet, B) | Video | Not seen | Mentioned only so writers can look it up. I do not describe it | |
| Royal Institution animated video, on Aeon ("if life feels out of balance, don't worry, there's always symmetry below the surface") (snippet, C) and Max Cooper music video (Vice, C) | Short animation | Unknown | Lists only; I cannot say what works | |
| Brian Greene, "Your Daily Equation" ep. 25, simplest case of the proof (snippet, B) | Video | Whiteboard/talk | The only item found that shows an actual derivation for the simplest case | Mathematical, aimed at curious adults |
| Feynman Lectures Vol I ch. 4, "Conservation of Energy" | Text, 1963 | The 28 blocks parable; blocks in a drawer, under the rug, water in a bath; "there are no blocks" | The best known device for "a number that stays the same without being a thing"; every reader can do the arithmetic | Feynman does not mention Noether there; the parable is about bookkeeping, not symmetry. Ledger-without-symmetry is the half of the story we must supply |
| John Baez | Blog (29 Jun 2020) + paper; earlier 2018 talk in Poisson-bracket language | Equations; Poisson brackets | Honest about layers | Aimed at mathematicians. Baez himself says the theorem has "layers and layers of depth" (snippet, C) |
| Digital Science blog "Symmetry Runs the Game"; Symmetry Magazine "Mathematician to know: Emmy Noether" (June 2015); Discover; Science News | Short articles | Mostly portrait plus one example (a satellite orbiting Earth, in PBS's version) | Easy to cite for lay phrasings | Little unique visual material |

**Synthesis for the writers (what a new film can do that these do not):**
1. Every item above says the table of "symmetry -> quantity" and then moves on; none, by the snippets, makes the viewer READ A NUMBER off a real object and watch it stay flat. Our spine (one orbit, three readouts, one flat bar, Earth measured) is the gap.
2. The best hooks are failures (Veritasium's rock, PBS's "only right sometimes"). Use a failure only after the success: Part 1 can end with one beat on "friction breaks it", Part 2 can use a failure as a hinge.
3. Quanta's circle is the strongest first image for "symmetry" and it is a SHAPE not a law. Pair it with a time shift of the same orbit so the move from picture to physics is visible.
4. What fails across the set: speaking "Lagrangian" or "action" without a picture, using only mirror images for symmetry (the commonest lay misreading, see section 6), and showing conservation as an equation rather than a bar.
5. Contrast set for tone: Veritasium (hook-driven, host-led), PBS Space Time (dense), Quanta (illustrated essay). Ours is silent with captions, so the reference is the visual economy of Quanta and Feynman's ledger, not a talking host.

---
## 3. History in five dated facts
Grades per fact. Sources: Kosmann-Schwarzbach, "The Noether theorems in context", arXiv 2004.09254 (and her book, Springer 2011, ISBN 9780387878676); Byers, "E. Noether's Discovery of the Deep Connection Between Symmetries and Conservation Laws", arXiv physics/9807044; Rowe, "Emmy Noether on Energy Conservation in General Relativity", arXiv 1912.03269; Sauer, La Matematica 4 (2025) 674-701; MacTutor.

1. **1915, Göttingen (A for the year, B for who invited).** In 1915 Hilbert and Klein invited Emmy Noether (born Erlangen, 1882, daughter of the mathematician Max Noether) to Göttingen, to help with the mathematics of general relativity, specifically the failure of "proper" local energy conservation in the new theory. Snippets: "In 1915 Hilbert and Klein, recognising her exceptional talent, invited her to Göttingen to help with the mathematical formulation of general relativity" (hep-th/9411110, snippet); "Hilbert was concerned by the apparent failure of 'proper' energy conservation laws in the general theory" (Colloquium, snippet). Some accounts credit Hilbert alone (snippet note). The same year Hilbert tried to get her a Habilitation; the faculty and ministry refused because she was a woman. The widely repeated line "the Senate is not a bathhouse" is reported from Constance Reid's Hilbert biography and the wording varies (reported, not verified: Grade C for the quote, A for the refusal). She lectured under Hilbert's name until the venia legendi came in June 1919.
2. **1915-1917, Hilbert and Klein on the energy puzzle (B).** Hilbert's 1915 paper on the field equations was "written in great haste and afterward substantially revised"; its "invariant energy vector" baffled readers "including Einstein" (Rowe snippet). Klein studied it in 1916-18, called it "Hilbert's energy vector", and wrote that Noether "advised me continually"; he also wrote that his own result was a special case of hers (Sauer 2025, snippet). Hilbert acknowledged in 1924 that her theorems "clarified and resolved the issues" (Rowe snippet). Einstein argued to Klein in 1918 that his four conservation integrals were real consequences of the field equations; Klein argued they had no physical content (Rowe slides, B).
3. **1918, the paper (A for citation, B for the date).** "Invariante Variationsprobleme", Nachrichten der Koniglichen Gesellschaft der Wissenschaften zu Gottingen, Math.-phys. Klasse, 1918, pp. 235-257. Klein presented it to the Academy (Noether was not a member) at the meeting of 26 July 1918 per the register quoted by Sauer (stronger); a weaker snippet says 16 July. English translation M. A. Tavel, Transport Theory and Statistical Physics 1(3), 1971, pp. 186-207 (from NONQUANTUM, B). Cited as the paper whose first theorem is "the" Noether theorem and whose second theorem "put a conjecture of Hilbert in perspective" (snippet, A).
4. **Einstein's letter, 24 May 1918 (A for the letter, B for the wording).** Einstein to Hilbert, 24 May 1918: German opening "Gestern erhielt ich von Frl. Noether eine sehr interessante Arbeit ueber Invariantenbildung" ("Yesterday I received from Miss Noether a very interesting paper on the formation of invariants", snippet). The remainder is the famous remark, as Rowe's abstract renders it, that "the troops returning from the field would have been done no harm were they sent to school under Fraulein Noether" (snippet; Freeman Dyson stressed that the German word Feldgraue means front-line soldiers, so the common "old guard at Gottingen" is a loose translation). Use the quote only with "Einstein wrote to Hilbert in May 1918 that her paper was very interesting"; it is safe on screen. The long obituary line is separate: Einstein in the New York Times, 4 May 1935, called her "the most significant creative mathematical genius thus far produced since the higher education of women began" (MacTutor/agnesscott PDF, snippet, B). Some sources suspect Weyl drafted it; Dyson reports Einstein's secretary saying Einstein wrote it. Hence: say "Einstein, in 1935, wrote that she was the most significant creative mathematical genius since women entered higher education", attributed to Einstein's letter to the Times.
5. **The two theorems, 1918 (A).** First theorem: a continuous symmetry with finitely many parameters (translation, rotation, time shift) gives a conserved quantity (a true conservation law). Second theorem: a symmetry that depends on arbitrary functions of space and time (as in general relativity, where you may relabel coordinates by any smooth function) gives NOT a conservation law but identities among the field equations (the contracted Bianchi identity in GR). Sources: "A variational problem admits an infinite-dimensional symmetry group if and only if its Euler-Lagrange equations are underdetermined" (arXiv, snippet); "gauge symmetries lead to identically satisfied relations among the field equations" (snippet). Brading notes the variational problem yields three theorems in 1918: two by Noether and a third due to Klein (snippet, B). The second theorem is what resolved the Hilbert-Klein-Einstein energy puzzle: in GR you cannot write a local, conserved gravitational energy density in the usual sense (section 5).
- Death: she died in 1935 at 53 after surgery (snippet). Exact day 14 April 1935 is not confirmed by my snippets (Grade C); omit the day.
- For a film beat: "1915: she is invited. 1918: she proves it. Einstein calls it very interesting. 1935: he calls her the most significant creative mathematical genius since women entered higher education."

---
## 4. Five non-quantum demonstrations with numbers
"Real number" = a public figure with a source. "Derived" = arithmetic from those inputs. Each demo says which of the three kinds of shift it shows.

### D1. Earth's orbit: r x v (already in NOETHER-NONQUANTUM.md section b)
Perihelion 147.095 million km x 30.29 km/s = 4,455.5; aphelion 152.100 x 29.29 = 4,455.0 (check: 147.095*30.29 = 4455.51, 152.1*29.29 = 4455.01, derived). Equal to 0.011 %. Rotation symmetry about the Sun. Grade A/B.
Cross-check Kepler: equal areas in equal times is "a direct consequence of angular momentum conservation", with the area rate dA/dt = L/(2m) constant, and holds "for all central force fields, not just the inverse square law" (farside.ph.utexas.edu and USU lecture notes, snippet, A). Useful for Part 2: the same invariant holds for any central force.

### D2. Figure skater: moment of inertia ratio and spin-up factor (rotation)
- Textbook values: "spinning at 0.800 rev/s with her arms extended; moment of inertia 2.34 kg m^2 with arms extended and 0.363 kg m^2 with her arms close to her body" (OpenStax-derived problem quoted in a Study/Brainly snippet; the OpenStax University Physics Vol 1, ch. 11.3 and College Physics 10.5 contain this example). Grade B (snippet of a derived page; check the OpenStax original).
- Derived: ratio of inertias 2.34/0.363 = 6.45. Spin-up factor = same 6.45 (L = I w constant). New spin = 0.800 x 6.446 = 5.16 rev/s = 309 rpm. Kinetic energy rises by the same factor 6.45 (the skater's muscles do the work; this is a good beat: L constant, E not constant, because she is not a closed system with a fixed shape, see section 5).
- Real-world anchor: the Guinness record for fastest spin on ice skates is 342 rpm = 5.7 rev/s, Olivia Oliver (Canada), Warsaw, 19 January 2015 (Guinness page, snippet). Grade A for the record (primary page snippet), B for the date. A previous record of 308 rpm is mentioned in a 2015 Nova Scotia news story, held by a Russian skater who "broke the record in 2008 at the age of 26" (Dartmouth Tribune snippet, B/C; the name was not given, do not name her). The textbook prediction of 309 rpm and the record 342 rpm sit in the same range: a good "numbers agree" beat, with the honest limit that textbook numbers are idealised and I found no study that measures a real skater's I before and after (searched twice).
- Other published pairs, for variety: 4.53 -> 1.80 kg m^2 at 3.84 rad/s (ratio 2.5, spin-up to 9.7 rad/s = 1.54 rev/s, derived); 3.5 -> 0.7 kg m^2 as a clean 5x example (a made-up round-number pair from the problem I was asked; label it MODEL).
- Caveat on that "1 rev/s to 5 rev/s" problem as often posed: with 3.5 and 0.5 kg m^2 the numbers do not close (3.5 vs 2.5). Check any problem before use.
- Ice friction is small but not zero, so a spin lasts seconds rather than forever: real. Do not claim "forever".

### D3. A pendulum energy ledger (time shift) and a bouncing ball (time shift broken by loss)
Pendulum (derived, g = 9.80665, m = 1 kg, L = 1 m, release 10 degrees):
| Release angle | Height gain h | Potential energy at the top | Top speed at the bottom |
|---|---|---|---|
| 2 degrees | 0.609 mm | 0.00597 J | 0.109 m/s |
| 5 degrees | 3.81 mm | 0.0373 J | 0.273 m/s |
| 10 degrees | 15.19 mm | 0.1490 J | 0.546 m/s |
Period T = 2 pi sqrt(L/g) = 2.006 s (small-angle). A ledger line at any moment: potential + kinetic = 0.1490 J. Grade A (physics identity; numbers derived).
Real pendulum with a published number: Foucault's pendulum, Panthéon, Paris, 1851: 28 kg bob, 67 m wire, period "about 16 seconds" (Hokkaido University page, snippet; ProofWiki dates the demo to 1851, snippet, B); my recomputation T = 16.42 s (derived, A inputs). The plane turns 360 degrees in about 32 hours (a source; 15 degrees/hr x sin 48.85 deg = 11.30 degrees/hr -> 31.9 hr, derived) because Earth rotates under it. A replica was installed in the Panthéon in 1995 (snippet, B). Good for Part 2 as a link to rotation, not for the energy ledger.
Bouncing ball (the "ledger fails" half; time-shift symmetry holds but the ball is not a closed system: energy flows to heat, sound, vibration):
- FIBA test: ball dropped from 1800 mm should bounce to between 1200 and 1400 mm (retail page citing the regulation, snippet, C; check the FIBA Equipment Regulations before shipping). Derived: the peak keeps 67 % to 78 % of its energy; the bounce loses 22 % to 33 %: 3.5 J to 2.4 J per bounce for a 0.6 kg ball (mass assumed, MODEL). With 1.3/1.8 per bounce, the heights are 1.30, 0.94, 0.68, 0.49, 0.35, 0.26, 0.18, 0.13 m for the first eight bounces (derived).
- Generic law: peak height ratio h1/h0 = e^2, e the coefficient of restitution (arXiv 2009.11903, snippet, A). With e = 0.75 the ratio is 0.5625, i.e. 43.75 % lost per bounce (derived; the source gives e^2, not the number 0.75).
- The ledger: energy lost to the ball = energy gained by heat, sound and vibration "converted to heat/vibrations" (arXiv 2202.03034 and a basketball article, snippet, B). Total energy of ball + floor + air stays constant; only the ball's mechanical share falls. This makes the contrast beat in section 5.

### D4. Billiards/pool: momentum exchange (space shift)
- Specs: WPA ball diameter 2.25 in (57.15 mm), mass 5.5 to 6 oz (156 to 170 g) (multiple snippets, B); Penn State Interactive Dynamics lists mass 0.1598 kg (A/B). Ball-ball restitution 0.92 to 0.98 (Dr. Dave Alciatore, drdavepoolinfo.com, snippet, B).
- Equal masses, head-on, elastic: "the particles exchange velocities... the cue ball stops, and the struck ball moves away" (Elastic collision snippet, A). Derived with m = 0.1598 kg and v = 2.0 m/s: momentum before 0.3196 kg m/s, after 0.3196 kg m/s; kinetic energy 0.3196 J before, 0.3196 J after (elastic).
- With e = 0.95 (inside the quoted range, MODEL): the struck ball leaves at (1 + e)/2 x v = 1.95 m/s and the cue ball keeps (1 - e)/2 x v = 0.05 m/s; momentum 0.3196 both ways, kinetic energy falls by 0.0156 J (4.9 %, derived). Momentum is conserved EXACTLY while energy is not: that is the clean pool-table proof that space shift (momentum) and time shift (energy) are different symmetries, one of which a collision keeps and the other of which it leaks.
- Unequal masses (worked example in snippet): 0.5 kg at 3 m/s hits 0.75 kg at rest; result v1 = -0.6, v2 = 2.4 m/s; momentum 1.5 before, 0.5 x (-0.6) + 0.75 x 2.4 = 1.5 after; energy 2.25 J both (derived, checked). Grade A (textbook).
- Everyday limit: a pool table has friction with the cloth, which turns sliding into rolling; during the collision itself (milliseconds) friction is negligible, so the collision conserves momentum even if the ball later slows.

### D5. Gyroscope precession and the stability of a bicycle (rotation, and a myth to retire)
- Gyroscope (spinning bicycle wheel hung from one end of its axle): precession rate wP = r M g / (I w), derived from torque = dL/dt, "assumed wP << w" (OpenStax University Physics Vol 1, 11.4, snippet, A). A Rose-Hulman activity gives inputs: wheel weight 29.5 N, distance to centre of mass 0.15 m, I about 0.17 kg m^2 (snippet, B). Derived: M g r = 29.5 x 0.15 = 4.43 N m; with spin w = 20 rad/s (MODEL) L = I w = 3.4 kg m^2/s and wP = 4.43/3.4 = 1.30 rad/s = 12.4 rev/min; doubling the spin halves the precession rate (derived). The UCLA/UCSB lecture demos describe "if the wheel is not spinning it flops down; if it is spinning, it doesn't fall, it precesses" (snippet, B).
- This shows rotation symmetry as a conserved vector: the axle's direction is the direction of L; torque changes L along the direction of the torque, not along the push. Honest limit: a torque is an outside influence, so L is not conserved while gravity pulls on the wheel.
- BICYCLE MYTH (use as a retire-the-myth beat for Part 2): the claim that a bike stays up because its wheels are gyroscopes is not needed. Kooijman, Meijaard, Papadopoulos, Ruina, Schwab, "A bicycle can be self-stable without gyroscopic or caster effects", Science 332, 339-342 (2011), used extra counter-rotating wheels to cancel spin angular momentum and negative trail; "when laterally disturbed from rolling straight, this bicycle automatically recovers" (snippet, A). TU Delft's Schwab: "Gyroscopic effects and trail do help, but are not essential for stability" (snippet, B).
- Magnitudes (derived, MODEL inputs, flagged): a wheel at 5 m/s with r = 0.34 m spins at 14.7 rad/s; with I about 0.1 kg m^2 (assumed) L = 1.47 kg m^2/s. HyperPhysics: "experiments indicate that the gyroscopic stability arising from the wheels is not a significant part of the stability of a bicycle", and the larger masses and speeds of motorcycle wheels make gyroscopic torques "a much larger factor with motorcycles" (snippet, B). Cambridge Engineering page: gyroscopic effect helps but trail is the more important factor (snippet, B).
- Recommendation: use the gyroscope for the "angular momentum is a vector with a direction" beat; use the bicycle only to say "the story people tell is not the whole story", not as a Noether demonstration. Grade of the claim that the bike is a Noether demo: C.

### Which of the five for which part
D1 (Earth) and D2 (skater) for Part 1 (counts then ratios: the skater's factor 6.45; Earth's 1 in 9,000). D3 (bounce) as the one-beat contrast in Part 1 and a hinge in Part 2. D4 (pool) for Part 2 (momentum kept, energy leaked). D5 (gyroscope) only if Part 2 wants a vector picture; the bicycle myth is a bonus, not a spine.

---
## 5. The "not conserved" cases that make the point by contrast
Lay rule: a conserved quantity is the price of a symmetry; take away the symmetry and the quantity may leak. Each case below says WHICH symmetry is gone.

### 5a. Friction (and drag): the pendulum that runs down
- What happens: a real pendulum or ball loses mechanical energy; "mechanical energy isn't conserved when non-conservative forces such as friction act, while total energy including heat is conserved" (my framing; the snippet search confirmed the general principle but no source for friction itself, so Grade B; confirm in Feynman I ch. 4 or any mechanics text).
- Which symmetry: friction is not described by a simple least-action term with no time dependence, so the bookkeeping is more subtle (Rayleigh dissipation is a way to include it, arXiv 2107.03780 "The geometry of Rayleigh dissipation", snippet, B). Lay words: "the pendulum is not alone: it is rubbing against the air, and the air is part of the system."
- Numbers: bounce ball (D3): 43.75 % energy lost each bounce at e = 0.75 (derived); pool collisions: 4.9 % at e = 0.95 (derived).
- Honest line: the energy is not destroyed, it moves into the air and floor as heat. "Total energy including heat is conserved" is a fact; Feynman's block parable is the picture.

### 5b. An external force or an open system: a skater with her feet on the ice, a rocket
- "Neither momentum nor (mechanical) energy have to be conserved" with an external force acting (forum thread on a rocket; a source states it for systems with "external forces", the constant of the motion "will not be in general a first integral of the unforced vector field", arXiv, snippets, B/C).
- The pendulum point: "the angular momentum of a pendulum isn't constant, since its Lagrangian depends explicitly on the angle, yet a closed system containing the pendulum still conserves momenta" (physics-forum summary, C). In lay words: the pendulum's pivot pushes back, so the pendulum plus Earth conserve momentum, the pendulum alone does not.
- Which symmetry: space shift broken by an outside push.

### 5c. An expanding universe: energy is not conserved
- Claim (as the sources state it): "energy conservation depends on time translation symmetry, which doesn't hold in an expanding universe" (Veritasium summary page, C); in an expanding spacetime there is "no timelike Killing vector, so there's no associated conserved quantity by Noether's theorem" (Freelance Astrophysicist, snippet, B); "the expansion of the universe violates time symmetry, so there is no total energy we can define that will be conserved" (arXiv 2509.09954 Encyclopedia of Astrophysics, snippet, A/B); the 2025 arXiv 2512.21471 says matter energy "is not necessarily conserved in a curved space time due to a lack of time translational invariance" (snippet, B).
- The concrete picture: light from the early universe is stretched as space expands. "Photons redshift, losing energy as space expands. With a fixed count of photons, the energy per photon decreases, so the total energy decreases" (Carroll's blog post, reproduced at Discover, snippet, B; "a crystal-clear prediction of general relativity").
- Dispute to state honestly: Ethan Siegel's 2016 Ask Ethan said the energy "adds up to exactly what it should", and a later Big Think piece headed "the expanding Universe doesn't conserve energy" says the opposite: this is a definitional question about what "energy" means in GR, and the sources "do not settle it" (snippet-based). So a film line must be hedged: "In an expanding universe the rules themselves change with time, so there is no single energy that stays put."
- Lay words: "The universe's rulebook is not the same at every moment, because space itself is growing. A rule that changes with the clock cannot hand you a number that never changes."
- Numbers: redshift z of the cosmic microwave background is about 1,100 (standard cosmology, not sourced by this session; do not use without a source). Grade: no number cleared A/B here.

### 5d. Noether's second theorem in lay words
- What it says: when a symmetry is of the "arbitrary function" kind (you may rename the points of space and time by any smooth rule, as in general relativity), you get not a conserved number but a built-in consistency rule between the equations ("identities", the Bianchi identity) (snippets above, A).
- Lay version: "The first theorem says: if the rules ignore a shift, a number stays fixed. The second says: if the rules ignore ANY renaming of places (not just a shift), the rules cannot all be independent: some of them follow from the others, and there is no single fixed energy for the world as a whole."
- A sentence a 10-year-old can hold: "When the rules let you relabel every place on the map as you please, the map has a built-in cross-check, instead of a fixed total."
- Scope warning: the second theorem is Part 3 or later material; Part 1 needs only a half-sentence to say the 1918 paper contains two theorems, and that the second explains why general relativity has no local energy.
- Honest status: the interpretation is contested. "Usual notion of energy conservation cannot be straightforwardly extended to gravitational fields" (review snippet, B). The same snippets also say that once matter is included the total energy-momentum is conserved in the identities' sense. Use "no local gravitational energy density", not "energy is not conserved in general relativity".
- Hilbert's version: the failure of "proper" energy conservation in GR was the very puzzle (section 3).

---
## 6. Pitfalls: what lay audiences get wrong (and the film's fix)
1. **Symmetry is not mirror symmetry.** Lay "symmetry" means a butterfly or a face. Noether's means "a change that changes nothing about the LAWS" and it must be continuous (any size, including tiny). The film fix: show the orbit moved in time, in space, turned, and show the readout unmoved; the mirror flip appears only once, as "this kind does not count" (mirror reflection, a discrete symmetry, gives no conserved number in Noether's theorem; a square's 90 degree turns also fall outside, Discover snippet, B).
2. **Symmetry of the laws, not of the situation.** An orbit can be lopsided (Earth's is an ellipse) and the law (gravity) still has full rotation symmetry; the lopsidedness is the situation (NOETHER-NONQUANTUM.md). Fix: "the rule does not care which way you face", never "the orbit is round".
3. **Conserved is not constant everywhere.** A conserved quantity is one number for the whole system that does not change in TIME; the pieces trade it. Earth's speed varies by 3.4 % (30.29 to 29.29 km/s) while r x v does not; a pendulum's speed goes to zero twice per swing while total energy stays. Fix: always show the changing parts moving and the total bar flat. Do not say "stays the same" without saying what.
4. **Conserved needs a closed system, and a closed system is a choice.** Draw the boundary. The skater on ice is close to closed for angular momentum but pushes on ice for translation; a ball on a floor is not closed for energy until you include the floor and air (the pendulum point in 5b). Fix: one line that names the system, then say what is inside.
5. **Conservation law is not "a rule you can break".** Lay language of laws as obeyed commands is the opposite of the theorem: the number is a consequence of the symmetry, not a command. Fix: say "comes with", not "is enforced by". Whether symmetry "explains" conservation is a live philosophy-of-physics question (arXiv 2010.10909, NONQUANTUM); Baez's remark that popular explanations "stop at roughly the same point" (snippet, C) is the reason to stop one step later: show a case where the quantity changes (5a to 5c).
6. **Energy is not a substance.** Feynman: "there are no blocks"; energy is a number you compute and add up, not a stuff that moves (Feynman I ch. 4, snippet; a physics-forum discussion says the same, C). Frame-dependence: "the values of those energies differ from frame to frame, so energy cannot be regarded as a sort of substance" (snippet, B). Fix: speak of "the count", not "the energy inside".
7. **Frictionless is an idealisation, not a lie.** Every demo above is idealised (pendulum, pool, skater). Fix: the honest-limits line says so once, and gives a real record or measurement to anchor each (Earth 4,455 million km x km/s to 1 in 9,000; Guinness 342 rpm; FIBA rebound test).
8. **Over-claiming with "everything is Noether".** Not every conserved quantity comes from a Noether symmetry (the SIR epidemic and Lotka-Volterra conserved quantities have no Noether derivation found, NONQUANTUM c5). Also, Ethan Siegel's point (snippet, B) that energy conservation was found empirically before Noether explained it: the theorem explains, not discovers.
9. **Over-claiming from the history.** Do not write "Noether invented symmetry" or "Noether saved relativity". She clarified the energy puzzle Hilbert and Klein posed; the quote from Einstein is about her May 1918 paper being "very interesting". Do not name a quote's source without its date (section 3 fact 4).
10. **Quantum creep.** The series is non-quantum. The charge/phase row of the table is the one place a lay viewer will hear "quantum"; say it is a different kind of shift, or drop the row.
11. **Orbit-wise, the lay misread of Kepler.** "The planet speeds up near the Sun because gravity pulls harder" is true, but the symmetry argument is stronger: it holds for ANY central force (section 4, D1 note), which is why the same bar is flat in other force laws. A film that shows only the inverse-square case will make Noether look like a gravity fact.

---
## 7. Quick reference for the writers: what is safe on screen
| Claim | Number or fact | Grade | Source line |
|---|---|---|---|
| Earth r x v at both ends | 4,455.5 vs 4,455.0 million km x km/s, 0.011 % apart | A/B | NONQUANTUM section b (NASA NSSDC distances; Wikipedia speeds) |
| Skater spin-up factor | 2.34/0.363 = 6.45; 0.8 -> 5.16 rev/s | B (derived from textbook values) | OpenStax example in snippet |
| Fastest ice spin | 342 rpm, Olivia Oliver, Warsaw, 19 Jan 2015 | A | guinnessworldrecords.com/world-records/fastest-spin-ice-skating (snippet) |
| 1 m pendulum at 10 degrees | 15.2 mm rise, 0.546 m/s, 0.149 J per kg, T = 2.006 s | A | derived, g = 9.80665 |
| Foucault pendulum, Paris | 28 kg, 67 m, T about 16.4 s, plane turns 360 degrees in about 32 h | B | Hokkaido page, ProofWiki, derived |
| Bounce energy per bounce | e^2 of the height; e = 0.75 -> 43.75 % lost | A (law), MODEL (e) | arXiv 2009.11903 snippet |
| FIBA basketball rebound | dropped 1800 mm, bounce 1200 to 1400 mm | C until FIBA page checked | retail page snippet |
| Pool ball | 0.1598 kg (WPA 156 to 170 g), e 0.92 to 0.98 | B | Penn State; Dr. Dave |
| Equal-mass collision | velocities swap; 0.3196 kg m/s before and after | A (derived) | textbook |
| Noether paper | 1918, Gottingen Nachrichten, pp. 235-257; presented 26 July 1918 | A/B | Kosmann-Schwarzbach; Sauer 2025 |
| Einstein, 24 May 1918 | "a very interesting paper on the formation of invariants" | B | Rowe; Kosmann-Schwarzbach snippets |
| Einstein, NYT 4 May 1935 | "the most significant creative mathematical genius thus far produced since the higher education of women began" | B | MacTutor snippet |
| Bicycle self-stable without gyroscopic or caster effects | Kooijman et al., Science 332, 339-342 (2011) | A | snippet |
| Expanding universe breaks time-shift | energy not conserved in the usual sense; photons lose energy | B, with the definitional dispute stated | Carroll blog via Discover; arXiv 2509.09954 |
| 3Blue1Brown Noether video | not found | n/a | two searches |

Do not use, however attractive: the 16 July presentation date; the "go to school under Miss Noether" wording as a verbatim quote; any 14 April 1935 death day; the FIBA numbers on screen until checked; any CMB redshift number (unsourced); the 2.16 rev/s skater page.

## Suggested use by part
- **Part 1 (concept):** sentences from 1c; table 1d rows 1 to 3 (time, space, rotation) with numbers for pendulum or Earth; D1 and D2 as the measured and spin-up beats; one beat of 5a (bounce) as "when the symmetry is spoiled the number leaks"; one dated history line (1918, Einstein's May letter); pitfalls 1 to 4 as caption rules.
- **Part 2 (applied):** 1b (programmer register) to open each application; D4 (momentum kept, energy leaked) and D3 as the "checksum" analogue to simulation (a symplectic integrator keeps |L| to 1e-13); 5d in one lay sentence when fluids' relabelling symmetry appears (NONQUANTUM c2); pitfall 8 (not everything is Noether) as the honest-limits line.
