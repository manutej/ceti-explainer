# A · THE ESCAPEMENT — working notes

## Mark rule
One **module** = one run. One **tooth** of its 20-tooth escape wheel = one step (tooth k(j) meets the entry
pallet at step j). One **tick** (pendulum period: two locks, two impulses, two drops) = one loop iteration. The
hand is driven 1:1 from the escape arbor, so a full turn = a whole run. A **slip** is a tooth that passes the
flicked-out pallet with no impulse: the pendulum dies, and the hand stops *inside* the step that failed. The slipped
tooth and the hand turn peach: that is the address. The **check** is a sage pawl on the twin. It registers the slip and
re-strikes the pendulum, and the tooth stays sage. Hands are copper while running and white once home. Slate is
structure. Plates hold arbors, hatching marks cut material, and the counters are geared to a reading head.

## Hero frames
- **Shared (29.5 s):** telephoto elevation of two banks of 50 regulator modules, side by side (same cell = same
  run): 19 white hands home vs 41; peach hands stopped at their steps; 22 saved runs framed sage; drum counters
  19 / 41 over "expected 17.9 ± 3.4 / 39.3 ± 2.9" and a 0–50 ruler with the ±sd band.
- **Native (23 s):** two gear trains of pocket wheels handing copper balls (jobs) across involute meshes; dropped
  balls stacked in hatched, sectioned slots under the handoff that lost them; output trays filled in rows of six.

## Beats
**Shared (33 s):** 0–3.2 title beside one module in 3/4 · 3.2–7 plan/act/observe/check lit on the pallet faces
as they act · 7–11.2 step 8 slips, the pendulum dies · 11.2–13 rewind, pull back · 12.2–15.2 commit + countdown ·
15.2–24.2 both banks, 20 ticks · 24.4–27.8 reading head counts · 27.8–30 truth under evidence, saved framed ·
30–33 closing line.
**Native (30 s):** 0–3 title · 3–9.6 six handoffs slide in, a gauge of the exact product shrinks · 9.7 one pawl
at the riskiest mesh · 10.8–21.4 sixty jobs, same draws · 21.6 count · 26 closing line.

## Depth / algorithms
Exact involute profiles and mesh phases · a Graham deadbeat escapement solved from contact (lock arcs about the
pallet arbor, inclined impulse faces), so the wheel angle is the supremum that pallet contact allows. It is
tabulated per step type (normal / slip / caught), giving an exact seek · Sutherland–Hodgman section clipping, hatched
caps, `buildGeometry` once, in two LODs · 100 instanced modules via `model(g, n)` + a data texture read with
`texelFetch(gl_InstanceID)` · a custom GLSL 300 es shader · textured drum counters with carry.

## Doctrine
Impossibility: 100 solved escapements in 3D. Belief: drums advance only when the head passes a home hand. Ruler:
count white verticals / tray rows. Address: peach tooth + hand, slot under the mesh. Thumbnail: machined
instruments, no AI iconography. Numbers come from AgentLoop or seeded draws; reliabilities are labelled sketch.

## Never
Brass, rivets, filigree, orbit cameras, glow, spinning-for-show gears, typed-in numbers.

## Iteration log
**Shared 1:** watch-face look; the hand hid the anchor; bank hands were 1-px; digits were squashed; labels
overflowed; rings cluttered; 25 s/frame (3 M tris through p5's light loop).
**Shared 2:** portrait regulator (dial on its own arbor, 20→40→20 train in the section), banks side by side, LODs,
lean shader front-to-back → ~0.6 s/frame. Bug: hands never turned. Canvas-backed p5.Image premultiplied the
low-alpha data bytes away, so I repacked to RGB with α 255.
**Shared 3:** pale plates read as an icon grid. Fixes: black dials, white home hands, a plate-lift uniform (dark
close-up → brighter bank), sage frames only, an end-card band, a big countdown.
**Native 1:** balls white, because p5 owns `uTint` (renamed). Title, gauge and counts collided.
**Native 2:** re-laid HUD, resolvable hatch, darker discs vs bright involute rings, short names for 8 handoffs.

## Revision 1 (after JUROR §4 + PEDAGOGY-CRIT)
**Shared.**
- It now stays in 3D from 12 s to the end. The checked bank stands behind the unchecked one in depth, on the same
  draws; no more flat grids or side-by-side panels.
- A stopped module's plates go dark. Its hand and slipped tooth turn peach, and the two dial ticks that bracket
  the failing step light peach, so the address can be read in the bank.
- What a check costs: each catch holds that movement one extra beat. The checked bank visibly keeps ticking after
  the other has finished (+32 beats at seed 1).
- The commit beat is a pendulum beating three times beside the question, not a countdown digit.
- The drums and the footnote ending are gone. Both banks re-rack by the step each run stopped at (object
  identity kept), so their silhouettes are the survival curves. The exact curve runs under each silhouette as a
  dashed line labelled "expected 17.9 / 39.3", and one engraved numeral stands per rack.
- Other changes: the header strip and step metadata are gone; type is ≥ 14 px; the title is sentence case;
  "pendulum dies" became "the movement stops".
- What I saw: the first 3D frame pushed the checked bank off-frame and the rack was a grey comb of rods. I lowered
  the checked rack so both rails meet on screen, kept rods only on the front rack, and set the scale at 74 units a
  step. The rack now reads as a chart made of movements.

**Native.**
- I replaced the pocket discs, which did not mesh, with true involute trains (m = 6, varied tooth counts,
  solved phases).
- Jobs ride the wheel bodies and hop across each mesh; a missed hop falls at that mesh onto the shelf, with counts.
- There are three trains, 2, 6 and 12 handoffs, each a prefix of the next, on the same 40 draws. A longer chain
  can only lose more: realised 37 / 33 / 25 of 40 vs expected 36.9 / 29.7 / 21.3, drawn as a dashed line in each
  tray.
- The weak "check" contrast is now an honest expected-value mark: one check at the 91 % handoff gives 22.9
  expected, while cutting six handoffs gives 29.7.
- Wield: handoffs in the third train (1–12).
