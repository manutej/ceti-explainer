---
name: p5-concept
description: "Concept stage of the p5 studio: turns a prompt into a typed generative brief that is designed to escape cliché before any code exists. Emits CONCEPT.md with intent, posture (perturbed order / exhaustive rule / encoded judgment), five structurally different approaches with honest typicality estimates, the chosen low-typicality approach, a typed unit tree (operad), named random streams and distributions, a palette from a named source, invariants every seed must meet, flex dimensions, and lineage. Use for /p5-concept, \"concept for a generative piece\", \"what should this sketch be\", \"make it less generic\", \"diverge before coding\", or as phase 2 of p5-studio. Do NOT use to write code (p5-forge) or judge renders (p5-crit)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. No questions to the user about technique; one line of assumptions.

# p5-concept — diverge, choose, type

Language models return the median. This stage exists to move the starting point off the median *on
purpose* and to write down a structure that the rest of the studio can verify.

## Procedure (write each section of `CONCEPT.md` in this order)

1. **Intake.** Purpose, medium (still / loop / sim / scroll / interactive), surfaces (P2D, WEBGL/strands,
   sound, pointer, svg-plot, video), format (choose on purpose: 4:5 poster 1080×1350, 2:3 print, 1:1 ≥1080,
   16:9 motion, A3 plotter), audience, brand tokens, constraints. Unknowns → "unknown" + one-line default.
2. **Intent.** One sentence about what the piece is *about* — a relation, tension or event — not how it
   looks. "Listening as a dense place inside an empty one", not "blue organic lines".
3. **Posture.** Choose exactly one (`${CLAUDE_PLUGIN_ROOT}/references/lineage.md`): **perturbed order** (strong structure +
   ~1% disorder — Molnár, Nees), **exhaustive rule** (no randomness; the rule unfolds completely — Mohr,
   LeWitt), **encoded judgment** (a decision procedure that behaves like a maker — Cohen's AARON).
4. **Divergence (verbalized sampling).** Write **five structurally different approaches**, each as a
   one-line unit tree, with your honest probability that a typical model would answer this prompt with it
   (they should sum to about 1; the obvious one usually deserves 0.3–0.5). Different means a different
   unit tree or posture — not the same tree with new colours.
5. **Choice.** Pick the **lowest-typicality approach that still serves the intent**; one line on why, and
   one line on what was given up. Choosing the most typical is allowed only when the brief asks for the
   canonical form — then name two departures from it you commit to.
6. **Unit tree.** Draw it with typed edges (`${CLAUDE_PLUGIN_ROOT}/references/operad.md` §2–3). Fill each unit with a
   technique from `${CLAUDE_PLUGIN_ROOT}/references/technique-atlas.md`. Score each *load-bearing* join 1–5 for how often you
   have seen it (structural joins like Ground→Compose are not scored): at least one ≤ 2, and the mean of the
   top three ≤ 3.5 (operad §5).
7. **Witness.** Read the tree aloud as one sentence. If it does not restate the intent, the tree is
   decoration — redraw it.
8. **Streams and distributions.** *Exhaustive rule:* there may be no randomness at all — then the seed is an
   **Index** into the enumerated space through a bijection you verify in code (assert the count; a throw in
   `setup()` fails the gate), and streams are optional. *Otherwise:* at least `structure`, `detail`, `colour`. Say where randomness enters
   (structure = series variety; detail = surface life) and which distribution each uses: Gaussian for
   "about the same, with outliers", Pareto for "many small, few large", weighted choice for rarity,
   Poisson disc for placement. Uniform needs a reason.
9. **Palette.** From a named source — a pigment set, a place and time of day, a print process (risograph,
   letterpress), an era, or the brand's role tokens (`Studio.presets` in `${CLAUDE_PLUGIN_ROOT}/runtime/src/studio/studio.js`: ceti-dark,
   ceti-paper, ceti-silver, glaser-paper, plus non-brand sources cyanotype, riso-fluoro, kraft-graphite,
   verdigris, oxblood-bone, sodium-night). Read `${CLAUDE_PLUGIN_ROOT}/references/studio-habits.md` first: if your palette
   matches a recorded house habit (cream + hairline + vermilion; CETI-dark as the only dark), say why the
   brief needs it or choose another source. ≤ 5 roles,
   weights (dominant / supporting / accent ≤ 10%), value structure stated first (light/mid/dark masses).
   Write colours as OKLCH CSS strings.
10. **Invariants (3–5)** — checkable on every seed, written as gate specs so they are *enforced*, not just
    stated: `--inv negative_space:0.35:0.80`, `--inv centroid_to_hotspot:0:0.12`, `--zone 0.2,0.2,0.8,0.8:0.02`
    (a calm rectangle), or a number the sketch computes itself, reported as
    `window.__meta.wrong_fraction` → `--inv meta.wrong_fraction:0.009:0.011` (or `__meta.invariants =
    {name: {value, lo, hi}}`). A broken invariant FAILS the gate. `--intent` is only for declared exceptions
    ("low contrast", "full bleed", "small multiples", "symmetric", "neon").
11. **Flex (2–3)** — the dimensions that vary across seeds. Everything else is invariant (Hobbs: variety
    without losing the series).
12. **Lineage.** Algorithms and essays the piece stands on (e.g. "Bridson 2007 Poisson disc", "Hobbs 2017
    watercolor"). Never "in the style of" a living artist.
13. **Escape-hatch check.** Using the cost column of the atlas: more than ~3.6k live 2D primitives per
    frame, full-res per-pixel work, or frame-exact video → plan a framebuffer/shader route or an offline
    render, and say so here.

## For a series

Write all concepts before any code. Then **allocate the set** in a table before forging: ground (light /
mid / dark, and no two within ΔE 0.06), accent hue (no hue shared by more than 40% of pieces), layout flex
(each piece's seed must move the layout, not only one detail), posture (at least two), load-bearing technique
and pairing (none twice). After rendering, `$STUDIO/scripts/series.py` checks the set mechanically
(HOUSE-LOOK) and the cliché seat checks it perceptually. Fix collisions in the allocation table — it costs one
line here and a whole revision later. (Gallery v1 skipped this and collapsed into one house look: tells #15.)

## Output

`CONCEPT.md` with headed sections 1–13, plus a one-paragraph plain summary for the person (intent, the
approach chosen and the most tempting one rejected, the palette's source). Keep the operad vocabulary in
the file; keep it out of the summary.

## References (load only what the step needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` | always, first |
| `${CLAUDE_PLUGIN_ROOT}/references/operad.md` | steps 6–7: units, colours, edge typicality, witness |
| `${CLAUDE_PLUGIN_ROOT}/references/technique-atlas.md` | step 6: filling units; cliché score per technique |
| `${CLAUDE_PLUGIN_ROOT}/references/lineage.md` | step 3 posture; step 12 lineage |
| `${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md` | what to steer away from (§1–2) |
| `${CLAUDE_PLUGIN_ROOT}/references/studio-habits.md` | step 9 and any series |
| `${CLAUDE_PLUGIN_ROOT}/runtime/src/studio/studio.js` (Studio.presets) | step 9 palette sources |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/performance.md` | step 13 escape-hatch check |
