# ladder-build

**Move.** pre-train-the-parts, cue-the-cause, segment-and-pause (PED #6, #8, #7; NAR A7, device 22) on Bret Victor's
ladder of abstraction: rung 0 is the concrete case, **running**; each rung adds one part; "integrate" runs every part
and the emergent property is the payoff; then the ladder **steps back down** and the concrete case is re-seen.
Operad entry: MODULE-OPERAD §4 (+ the return, after Victor).

**Ports.** needs `gap` · gives `parts`, `instance` · PO `axis | chain` (out: same) · regions left (the ladder) + body +
foot · τ T1 T2 T3 T9 T11 (+ T5 T8 for the behavioural use in the operad's own example).

**Params.** `rung0 {part,label,kind,note}` · `rungs [{part,label,kind,note,droppable?}]` (2–4, one new part each) ·
`emergent {term,kind,label,dur?}` · `model` (axis: `{alpha,lambda,win,lose}`; chain: `{perTurn,budget}`) ·
`principle {term,line}` · `returnLine` · `foot {rung0, rung1…, integrate, return}` · `ladder {bottom,top}` · `control` · `notes`.

**Figures (PO adapters, `FIG.<kind>`).** `axis`: prospect-theory plane — kinds bet · gains · losses · bet-value
(chord midpoint = (EV, felt value)). `chain` loop: context · model · tool · budget — kinds call · act · observe ·
budget · budget-run (turn n re-reads n pages; staircase drain). A new figure adds an adapter, not a module.

**Phases.** rung0 4 s · each rung 6 s (picture 0 → cue 0.6–1.1 → label 1.2 → behave) · integrate (payoff) 6–7 s ·
hold 2 s · name 2 s · return 4.5 s. Durations: agent 37.5 s, loss 30.5 s. SVG only (no p5 layer: no part carries mass).

**Contract.** Ladder marker climbs one level per rung and descends at `return`; on-object labels after their
pictures (L4); the principle chip only after the payoff (L5). Numbers: `MODEL.axis` (v(x) = x^α, −λ(−x)^α) and
`MODEL.chain` (perTurn·n, cumulative, first turn over budget). Audit: parts unique; chain empties at the first
turn over budget; axis example is positive-EV and negative-felt.

**Control.** `drop` select — remove a droppable rung (observe → the context stops growing, lasts 33 turns;
budget → no limit; losses → λ = 1, the coin is accepted).

**Honesty it carries.** chain: "one loop, one agent: real agents summarise, cache and truncate · token counts are
illustrative"; axis: "median parameters (α 0.88, λ 2.25); individuals vary · small stakes are contested"; both:
"the simplest version omits everything not on a rung".

**Fails.** labels before pictures; > 1 new part per rung; rung 0 not runnable; a part never used at integrate;
no way back down.

**Demos.** `build/demo-0.html` (AI, agent loop: empty at turn 8, 108,000 spent, not turn 33) ·
`build/demo-1.html` (behavioural, loss aversion: EV +$25, felt −24, refused). `node test.mjs`.

**Grid adapter.** `model {N, blue, reliability}` on a PO `grid`: rung 0 the city (cast row by row, counts after the dots), the witness strip (100 tests), both-ways rows, and an emergent "one report, two sources"; `figure {x, strip}`.
