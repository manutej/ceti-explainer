# G · THE RUN — knitted cloth · working notes

## Mark rule
Every visible thing is yarn, needle, hook or felt. **Column = one agent run. Row = one step (one turn of the
loop).** A knit V = a step that held. A **peach slack loop** = the step that slipped (its address). **Ladder
rungs** = work lost: crimped rungs below the drop (rows that unravelled), straight rungs above (rows that never
knit). **Sage stitch** = a slip the hook caught and re-knit (verified). **Slate needle** = the system that holds
live work. Ground = undyed dark fleece felt (black-sheep wool); cloth = undyed ecru wool. Copper appears only
as probability (the expected-value tick and ± band on the ruler). Native film: column = token, row = one
generation step, needle length = context window.

## Hero frames
- **SHARED (t≈21 s):** two folded swatches, each 2,000 columns × 20 rows laid as five 400-column lengths on dark
  felt. Top (checks off) is more ladder than cloth: dark slits, a peach dot at the top of each ladder at a
  different height, the hem sagging in scallops where structure is gone. Bottom (checks on) is mostly whole,
  freckled with sage darns, hem nearly straight. Selvage counters 719 / 1,586 at the right.
- **SHARED macro (t≈6 s):** 20 columns at 48 px each, plied yarn with twist and fuzz; in the top panel the
  stitch at row 2 slips, a peach loop hangs open and the ladder runs down to the cast-on; in the bottom panel the
  same column, the sage hook pulls the loop back up.
- **NATIVE (t≈17 s):** a fixed slate needle spanning 24 stitches across the top; under it a bias-knit band
  slanting down-left (the window sliding); the copper ACME columns have just been bound off at the needle's left
  end, token labels standing above each live stitch, a three-stitch word visibly one word in one shade.

## Beat sheet — SHARED (32 s)
0–3.6 knitted title (colourwork, dark fleece on ecru) knits off the needle row by row · 3.6–4.4 title cloth drops
away, twin needles cast on · 4.4–8 macro, rows 1–4, a drop ladders in the top panel, hook darns it below · 8–11
commit hold + countdown ("how many of 2,000 stay whole?") · 11–21.5 rows 5–20, camera pulls back 48 px → 2.2 px
per column, counters fall · 21.5–26.5 count: laddered columns pulled out, intact columns close up per length, a
ruler with the copper expected tick ± sd and the guess tick, realised vs expected typed from the marks ·
26.5–32 closing card: the two survival percentages knitted in the cloth, small type beneath.

## Beat sheet — NATIVE (28 s)
0–3 knitted title · 3–8 the prompt is tokenized (toy BPE trained in setup) and cast on, one stitch per token,
labels above; words in alternating natural shades · 8–21 generation: each row knits across every live stitch
and casts on one new token; the oldest falls off the left and is bound off; ACME (copper) leaves at the computed
row; peach mark on the bind-off · 21–28 honesty: far stitches drawn looser (sketch), closing line.
Control: **tokenizer merges** (0–320) — re-runs BPE, re-tokenizes, re-knits; ACME's exit row is recomputed.

## Depth rungs / algorithms
Procedural stitch atlas (per-pixel tube shading along Bézier legs, cylindrical normal, 2-ply helical twist,
fibre fuzz, AO) with 7 mip levels; a forward column splatter with exact horizontal coverage (sub-pixel columns
antialiased), 3-cell back-to-front compositing for the V overlap, closed-form drape (quadratic stretch,
analytic inverse), separable box-blur cloth shadow on the felt. Twin worlds = AgentLoop common random numbers.
Ladder front descends at 30 rows/s from the drop, closed-form in t.

## Doctrine tests
Mark rule above. **Impossibility:** continuous zoom from plied yarn to 80,000 sub-pixel stitches with ladders
running. **Belief:** counters count column states. **Address:** peach loop at the drop row. **Ruler:**
compacted cloth length per 400-column length vs 0–400 scale (≈36 % / ≈79 %). **Silence:** ladders and darns
read with no captions. **Thumbnail:** a knitted swatch with runs — not "AI". **Etymology:** "run" is
hosiery's word, not the agent's; the mark rule survives without the pun (whole-column loss = whole-run loss).

## Never
Glow, particles, flow fields, typewriter reveals, robot icons, cream paper + hairline, a single run standing in
for the ensemble, invented numbers.

## Iteration log
**Shared v1 (sheet looked at):** stitches read as separate chevron chains (felt showing between wales); hook a
thin stick; at full pull-back the cloth was a grey barcode — ladders mid-grey, peach addresses and sage darns
invisible; ruler labels collided; closing digits low-contrast; a label ran off-frame.
**v2:** legs widened/moved out so wales touch (reads as real stockinette at macro); rungs thinner and darker
(unravelled yarn in shadow), shadow 0.78; far-LOD specks (one per dropped loop / darn, size ≈ one stitch) so the
address survives at 2.2 px/column; saturated peach/sage yarns; bolder shaded hook with outline and drop
shadow, shown only above 16 px/column; drape ×1.5; ruler moved inside the panel (0–100 %), copper exact line
± sd band, guess tick; header subtitle swaps to "867 runs saved". **v3:** title tracking opened; closing cloth
centred (was top-heavy, H6 risk); peach specks shrunk (confetti risk).
**Native v1:** needle spanned the frame, so the bind-off diagonal (the point of the film) was off-screen; p5
textWidth trimmed leading spaces (prompt words ran together); labels crowded readouts. **v2:** needle 24 × 22.5
px right-aligned → the bias band and its bound-off staircase run down-left across the frame; prompt drawn
with canvas measureText; readouts moved to a left column. **v3:** prompts longer than the needle now slide
during cast-on (merges = 0 case: "ACME never fit"); loose stitches thinner and on two rows; takeaway line.

## Revision 1 (after JUROR / PEDAGOGY-CRIT)
**Shared, rebuilt (34 s).** Ground is now undyed cream wool felt; the cloth is undyed moorit yarn, so ladders
read as pale slits. Knitting is top-down from a cast-on rod. A **travelling needle** forms each row left to
right: two needles meet at the working stitch, with the copper working yarn. A ladder runs *up* through the
run's finished work, and the needle skips the dead column after that. Macro (15 columns, 4 rows) keeps the
edge frame's material: plied V's, peach slack loops, rungs. **Camera:** pull-back to one continuous
2,000-column swatch (a stretched sheen, not five strips). A **linen tester** (a weaver's thread-counting loupe)
then stays on the board, showing true stitches of whatever it sits over, and follows run #229.
**Commit in material:** a marker clipped on the rod, with the question set in the corner, not a modal.
**Count = cloth:** needle out, swatch hung sorted by drop row. The hem *is* the survival curve, lined with peach
loops (addresses) and read against a copper strand pinned along the expected curve. Tags on the rod give the
selvage count ("719 whole") and "expected 717 ± 21".
**Twin = same object, replayed:** a sage basting pass runs along every row of every run (the cost, as a
mark). Caught ladders latch back up with a sage stitch and knit on, and the swatch re-hangs. The first hem
stays as a peach ghost, then the second copper strand and tag follow ("1,586 whole, 867 saved",
"expected 1,571 ± 18"). There is no closing card: it ends on the hung cloth. Captions avoid a second
encoding (no "36 %"). Counters update only behind the needle.
**Saw:** hang 1 (22.2 s) is the strongest frame of the revision: solid block, sheer fringe, copper curve. The
macro first framed only 2 rows under the top edge, so I re-centred it at 60 px/column with 4 rows. The cost text
overlapped the latching cloth, so it moved under the swatch.
**Native.** Cream ground, two natural yarns plus copper ACME. Token labels are horizontal, in three staggered
tiers at 14 px. Readouts are fewer and larger. Truthfulness fixes: dropping the oldest tokens is labelled
**the app's** policy. The honesty beat is now **lost-in-the-middle**: middle stitches loosen and fade, the ends
stay crisp (sketch). The last 7 s pull back to the whole bias-knit scarf. The final image is labelled "on the
needle: all the model can see", "dropped by the app, oldest first" and "ACME, knitted in at the start".
**Still weak:** at 0.44 px/column, the knitting sheen and the final whole block read as flat texture (the
lens carries the stitches). The sort is one fast stage. The native's middle-loosening is subtle.
