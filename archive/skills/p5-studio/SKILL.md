---
name: p5-studio
description: "Prompt-to-p5.js generative design studio. Turns a one-line prompt into an original, verified p5.js 2.3.x piece or series: a concept with a deliberate divergence step against cliché, a typed unit tree, seeded sketch code, headless renders across seeds, computed gates, independent critic seats, named revisions, and a shippable file with a seed explorer. Use for /p5-studio, \"make generative art\", \"p5 sketch of…\", \"creative coding piece\", \"generative poster / identity / texture / plate instrument / icon set\", \"algorithmic art that doesn't look like everyone else's\", or to upgrade an existing p5 sketch. Routes phases to p5-concept, p5-forge, p5-crit and p5-ship. Do NOT use for a non-generative UI animation (use motion-stack or svg-animation-techniques) or a plain data chart (use dataviz)."
---

> **Studio doctrine (overrides anything below):** read `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` first. Never ask the
> user to pick technical values; state assumptions in one line. Render or it didn't happen. Too common is a
> failure. The builder never grades its own originality. Plain language out; the operad stays internal
> unless asked.

# p5 studio — the loop

The studio makes **systems**, not pictures: a sketch whose every seed is good, that a critic who is not you
would call unfamiliar, and that runs correctly on p5.js **2.3.4**. The whole method is one meta-prompt,
`${CLAUDE_PLUGIN_ROOT}/references/meta-prompt.xml`; this skill runs it, phase by phase, through four sibling skills.

```
INTAKE → CONCEPT (diverge, choose, unit tree) → FORGE (code) → GATE (lint · render · metrics · sweep)
      → CRIT (isolated seats) → REVISE (named edits, ≤3 passes) → SHIP (file, exports, bridges) → CAPTURE
```

## On invocation

1. **Set up a task list** for the phases (the person may step away). Pick any working folder for the piece
   (`<work>/<slug>/`). **`$STUDIO` means this plugin's root folder** (two levels above this SKILL.md); call
   scripts by absolute path, `python3 $STUDIO/scripts/…`, so they work from any folder. Don't copy
   `studio.js` into the work folder — `render.py` serves the plugin's runtime and `ship.py` inlines it.
2. **INTAKE + CONCEPT → `p5-concept`.** Produces `CONCEPT.md`: intent, posture, five divergent approaches
   with typicality, the choice, the typed unit tree, streams, palette from a named source, invariants,
   flex dimensions, lineage. Do not write code before the unit tree passes its witness check.
3. **FORGE → `p5-forge`.** Instantiates `${CLAUDE_PLUGIN_ROOT}/templates/sketch.html` with `${CLAUDE_PLUGIN_ROOT}/runtime/src/studio/studio.js`;
   builds the scene as data; respects the cost algebra and escape hatches.
4. **GATE → `p5-crit` (mechanical half).**
   `python3 $STUDIO/scripts/gate.py <work>/<slug>/sketch.html --sweep 8 --brief still|motion|interactive|background --inv <metric:lo:hi> … --intent "<declared exceptions>"` (motion: add `--frames <one period> --fps 30`).
   FAIL → fix, re-gate. COMMON → one named edit (SwapTechnique / Silence / Reweight / Reframe), re-gate.
   CANDIDATE → seats.
5. **CRIT → `p5-crit` (seats).** Launch the seats as separate agents in one message; never sit yourself.
   Merge with min-over-seats; record disagreements.
6. **REVISE.** Findings → named edits (`${CLAUDE_PLUGIN_ROOT}/references/operad.md §6`) → re-gate → re-seat pairwise
   (new vs previous). Stop at the identity edit or three passes.
7. **SHIP → `p5-ship`.** `ship.py` (studio inlined, seed explorer), exports (PNG @ print density, SVG for
   plotter / draw-on, MP4 via deterministic frames), and any CETI bridge the brief named.
8. **CAPTURE.** Append to `<work>/LEDGER.md`: date · slug · hero seed · gate verdicts per pass · seat
   verdicts · edits · open issues. Mint 1–3 atoms in `<work>/atoms/` and index them in `<work>/INDEX.md`. If a series showed a new house default, add a row to `${CLAUDE_PLUGIN_ROOT}/references/studio-habits.md`.
   A new failure class → a row in `${CLAUDE_PLUGIN_ROOT}/references/tells.md` and, if a regex or metric can catch it, a rule
   in `lint.py`/`metrics.py` with a calibration case.

## What the person gets (lead with the artifact)

- The piece (shipped HTML with seed explorer) and the hero render(s) + contact sheet.
- A short concept card: the intent, the approach chosen *and the four it rejected* (with how typical each
  was), the palette's source, lineage.
- The scorecard: gate verdict per pass, a seat table (seat · verdict · one line of evidence), edits made,
  what is still open. Verification rung stated (V2 rendered / V3 seats / V4 needs your eye).

## Series and galleries

For N pieces: run CONCEPT for all N first and fill the **set allocation table** (p5-concept, "For a
series"). Fan out FORGE to parallel agents (disjoint folders = lanes that commute). After the gates, run
`python3 $STUDIO/scripts/series.py --dirs <work>/*/renders/sketch` (HOUSE-LOOK → `Reallocate` edits), build
per-seat packets with `$STUDIO/scripts/seat_packets.py`, and run each critic seat **once over the whole
batch** so cross-piece habits are visible.

## Modes

- **Quick** (a single still, user wants speed): concept with divergence, forge, gate, Cliché + Composition
  seats, one revision pass. State "quick mode — partial panel".
- **Flagship**: all seven seats, OC check (total collapse vs decomposition, `operad.md §7`), 32-seed sweep.
- **Upgrade an existing sketch**: run `lint.py` first (2.x drift is usually the first problem), then gate,
  then treat the existing code as the "total collapse" and build the decomposed version.

## References (load only what the phase needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` | always, first |
| `${CLAUDE_PLUGIN_ROOT}/references/meta-prompt.xml` | the full contract; flagship runs |
| `${CLAUDE_PLUGIN_ROOT}/references/operad.md` | concept (unit tree), revise (named edits), OC check |
| `${CLAUDE_PLUGIN_ROOT}/references/technique-atlas.md` | concept (filling units, typicality) |
| `${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md` | concept (what to avoid), crit (naming failures) |
| `${CLAUDE_PLUGIN_ROOT}/references/p5-2x-field-guide.md` → `${CLAUDE_PLUGIN_ROOT}/references/p5/*.md` | forge, ship — index first, then only the surface you need |
| `${CLAUDE_PLUGIN_ROOT}/references/eval-stack.md` | gate, crit |
| `${CLAUDE_PLUGIN_ROOT}/references/lineage.md` | concept (principles; posture), colophons |
| `${CLAUDE_PLUGIN_ROOT}/references/integration.md` | ship into CETI assets |
| `${CLAUDE_PLUGIN_ROOT}/references/tells.md` | crit — attack these first |
| `${CLAUDE_PLUGIN_ROOT}/references/studio-habits.md` | concept (series allocation), crit (series.py) |
