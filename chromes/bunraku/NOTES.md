# F · BUNRAKU — notes

## Mark rule
**One cut-paper puppet on one
stage = one run. One move along the plank = one step (20 chalk ticks on the stage's board). Three operators in black =
the system:** copper rod = plan (the model), slate rod = act (the tools), sage crook = check (the harness). A lit stage
= a run still standing; when its puppet falls the lamp cools to an ember, the puppet hangs where it fell and the peach
tick is the **address**. The copper job slip it carried flutters into the pit. Words are cut paper or chalk.

## Material and type
Stage-black velvet, unbleached kozo with long fibres, kakishibu hakama, operators in true black (rim + shadows).
Bodoni Moda 800 cut out of a card (thrown onto the drape); Instrument Sans tags; Gloock chalk numerals.

## Hero frames
- **Shared 11.4 s:** puppet tipping off the plank; copper rod from the upper left, slate rod to the hand, the sage crook
  hooked under the arm from the pit; the operators' soft doubled shadows on the lit drape.
- **Shared 34.5 s:** a terraced hillside of 50 toy theatres, ~41 warm boxes and ~9 embers; chalk on the arch:
  19 (no check) and 41 (22 sage strokes = runs the check saved), expected 17.9 ± 3.4 / 39.3 ± 2.9.
- **Native 14.3 s:** hooded model and tools left; the person, unhooded, right, holding the sage rod.

## Beats
**Shared (35 s):** 0–3.8 stencil title thrown by a top light · 3–4.6 lighting cue to the raking key; the puppet is flown
in · 3.9–8 operators surface, tags · 8.2–14.4 twenty moves, three caught slips, slow push on the second · 14.6–18.4
commit (chalk 3-2-1) · 18.4–21 crane to the front row: the same run, unchecked, falls at move 3 · 21–25 district,
no check · 25.2 counting sweep · 26.9–31.6 same draws, check every step · 31.8 sweep · 33.2 expectations.
**Native (31 s):** title · before: a person walks alone · the person lifted out, puppet flown in · operators surface,
the person takes the check rod · 50 stages, one person each · one person per row (sketch 0.8/k) · counts.

## Depth rungs and algorithms
1. Perspective camera, cards at true depths; one continuous crane (real parallax).
2. Raking tungsten spot (cone, falloff); dimming shifts it red (filament cooling); frames take spill from their lamp.
3. **Analytic contact shadows:** a receiver fragment rays to the lamp, intersects the puppet and operator planes,
   looks up the silhouette and blurs it by the penumbra R·gap/|P−L|; rods shadow as projected capsules. Evaluated in
   a 320×180 occlusion pass.
4. **Thin-lens DOF per plane:** CoC = K·|d−d_f|/d; atlas pyramid blurred once in setup, two levels mixed per fragment.
5. **Falling paper:** Andersen–Pesavento–Wang (2005) quasi-steady plate ODE, RK4, eight trajectories in setup.
6. Jointed puppet FK; tip about the foot; closed-form damped pendulum when hanging.
7. Numbers: `AgentLoop` (N 50, k 20, seed 1); Wield gate plans and the native span model on the same draws, with
   exact expectations (segments: p^L + (1−p^L)·c·p^L).

## Doctrine
Impossibility: words of light through a cut card; 50 shadowed, focused boxes in one crane. Belief: a stroke per lit
stage touched. Ruler: count warm boxes. Silence: lamps cooling. Address: hanging puppet + peach tick. Thumbnail: a
hillside of little theatres.

## Never
Faces, mascots, pastel craft, flat-vector look, glows, particles, floating numbers.

## Iteration log
**S1** (13 s/frame, one uber-shader): sandpaper puppet, orange tungsten, clipped title, no light-letters, operators
merged with their shadows, the district a thin strip. SwiftShader runs every branch: 5.5 cpu-s even on an early return.
**S2** (≈0.5–0.9 s/frame): eight `#define` shader variants drawn per row in painter's order; shadows in a low-res
pass (fixed a y-flip that threw the title under the card). The puppet's shadow hid behind the act operator.
**S3:** restaged as bunraku works — operators behind/left in a sunken pit, the plank over a real drop (the slip's
flutter is visible); title light cue; puppet flown in; boxed stages; terraced district; tally on the arch; ember dark.
**S4:** crane re-routed so the featured run (saved in close-up) falls unchecked; anatomy reframed to show the pit.
Gate: PURE-REP failed — `dFdx` after `discard` reads undefined helper lanes on SwiftShader; moved derivatives first.
Wield 'end only' never re-lit at gate 20: fixed.
**N1–N2:** tag overflow; the unhooded checker read as a pale crescent in the pit → a standing bare-headed person on
the right, apart from the hooded operators.

## Revision 1 (after JUROR + PEDAGOGY-CRIT)
**Changed.** (1) Black stage cloth replaces red velvet; the operators' shadows still read on charcoal. (2) A failed
stage's **curtain closes to true black**; its copper job slip flutters onto the apron and comes to rest above the
cell of the move it fell on, on a **move board numbered 1–20** (done cells chalk-washed, the fall cell peach, a caught
cell ringed sage with a redo mark) — the address reads at district scale. (3) **Cost is a mark:** a caught move is
redone (puppet lifted back, the step walked again); caught stages finish later; peach strokes count moves made again.
(4) Featured run: exactly one caught slip (the old one had three, teaching "errors pile up"). (5) Commit beat in the
material: the featured stage's curtain closes and the question is chalked on it; the countdown is three chalk strokes
wiped off. (6) Ending: a **curtain call** — house lights up, lit stages bow, closed curtains stay shut — over a chalk
ruler 0–50 where every stroke is one lit stage (white = lit without the check, sage = saved by it); expectations are
notches with ±1 sd brackets on the same ruler. No header strip, no footnote line. (7) Title in caps (no "Al"/"W hat"),
its shadow a solid card (no ghost words). (8) District on a long lens, five rows of ten, each box readable as a stage.
**Kept N = 50**, not the 20–25 the juror suggested: at N = 25 seed 1 gives 13 lit vs 9.0 ± 2.4 (+1.7 sd), which would
read as "half survive"; at 50 it is 19 vs 17.9 ± 3.4.
**Native:** the person slips too (sketch, self-caught); three spans on the same draws — one person per stage (41),
per three (26, sketch, expected 22.8), per row (19, expected ≈ 19.4) — people who check k stages stand above them
with k rods; three stroke rows on one ruler. Own closing image: one grey, bare-headed person above the front row,
rods stretched across ten stages, most curtains shut.
**Saw:** wide shot legible as stages; bows invisible in stills (they read in motion); the district is still a wall —
theatre-native now (curtains, house light, chalk), but a wall. Grey-clad person needed to read against black.
