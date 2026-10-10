---
name: p5-crit
description: "Critique stage of the p5 studio: independent, adversarial evaluation of a generative p5.js sketch or a whole series, designed so 'common' fails. Runs the mechanical gate (2.x lint, cliché fingerprints, headless seed-sweep render, determinism, computed image metrics, oatmeal and mode-collapse checks) and then isolated critic seats (composition, colour, craft, cliché hunter, intent fit, wonder, metric auditor) as separate agents with pairwise, swap-checked verdicts; merges without averaging and turns findings into named edits. Use for /p5-crit, \"critique this sketch\", \"is this generative piece any good\", \"is it too generic\", \"red-team my p5 art\", \"evaluate the gallery\", or as phases 5–7 of p5-studio. For a whole plugin or skill use moe-eval."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. **You are not the builder.** If you wrote the sketch, you may run
> the gate, but the seats must be other agents.

# p5-crit — gate, seats, edits

## 1. Gate (mechanical, cheap, vetoes)

```
python3 $STUDIO/scripts/gate.py <sketch.html> --sweep 8 --brief still|motion|interactive|background \
        --inv negative_space:0.35:0.8 --inv meta.<key>:lo:hi --zone x0,y0,x1,y1:maxstd \
        --intent "<declared exceptions: low contrast | full bleed | small multiples | symmetric | neon>" \
        [--t <moment>] [--frames <one period> --fps 30]   # motion: flash rate + loop seam via motion.py
```
(`$STUDIO` = the plugin root.) Invariants are enforced: a broken one FAILS. `--brief background` adds a
contrast-stretched contact sheet for dark, low-contrast work.
Writes `renders/<name>/gate.json`, `SCORECARD.md`, `contact.png`, `seed_*.png`.
- **FAIL** (lint P0, render error, blank, non-deterministic) → back to forge; no seats.
- **COMMON** (≥3 code fingerprints, oatmeal batch, cliché metric flags on most seeds) → one named edit,
  re-gate. Seats only see COMMON work if the user insists — and then the Cliché seat goes first.
- **CANDIDATE** → seats.
Read `contact.png` and the worst seeds yourself to frame the brief for the seats — but write no verdicts.

## 2. Seats (isolated agents)

Build the inputs with `python3 $STUDIO/scripts/seat_packets.py <manifest.json> <crit>/packets [--previous
<prev-manifest.json>]` — one packet per seat, so pixel-first seats never see intents before describing and
no seat sees the A/B key (tells #14). Each seat's prompt = its file in `references/seats/<seat>.md` + its
packet path + its output path. Launch all seats **in one message** with the Agent tool so they run
concurrently; each writes `crit/<seat>.md`. Never paste one seat's output into another's prompt.

- **Pairwise:** give A/B (new vs previous, or vs an anchor). Randomize order; after the first verdict,
  ask the same seat again with A/B swapped. Agreement → verdict. Flip → near-tie, "human".
- **Minimum panel:** Cliché + Composition + Colour. **Flagship:** all seven. **Series:** first run
  `python3 $STUDIO/scripts/series.py --dirs <work>/*/renders/sketch` (HOUSE-LOOK = shared ground / accent /
  layout or recorded studio habits), then each seat once over the whole batch, so habits shared across
  pieces show up.
- If the Agent tool is unavailable, say so: verdict "self-judged — partial", V3 not reached.

## 3. Merge (no averaging)

Write `crit/TRIAGE.md`:
- Strike any finding without pixel/line evidence (count strikes per seat).
- Merge findings several seats reached on the same **kernel** (the one fact a fix must change).
- Verdict = **minimum over seats**: release needs Composition, Colour, Craft and Intent to prefer the new
  version, and Cliché ≠ REJECT. Wonder is advisory.
- **DISAGREEMENT** records for any two seats more than one step apart: both evidences, shown to the human
  first.

## 4. Edits

Map each surviving finding to a named edit from `${CLAUDE_PLUGIN_ROOT}/references/operad.md §6` with the finding id:
`SwapTechnique(Grow, flow→differential growth) — CLI hunter: "variation of a flow field"`.
Precedence: accessibility ⊐ brief ⊐ originality ⊐ preference. Hand the edit script to forge, re-gate,
re-seat pairwise. Converged when the seats return no edits, or after three passes (then ship the best with
the open issues listed).

## 5. Capture

- `studio/LEDGER.md` row: slug · pass · gate verdict · seat verdicts · edits · open.
- New failure class → `${CLAUDE_PLUGIN_ROOT}/references/tells.md` row (class · tell · attack · caught by). If a regex or a
  metric can catch it, add the rule to `scripts/lint.py` / `scripts/metrics.py` and a calibration case in
  `${CLAUDE_PLUGIN_ROOT}/templates/calibration/` — that is how the studio stops repeating a mistake.

## What to tell the person

One table (seat · verdict · one line of evidence), the verdict, the edits made, what is still open, the
verification rung reached. Then: "We found N problems: M blocked it, … ; L critic claims were thrown out
for lack of evidence."

## References (load only what the step needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/references/eval-stack.md` | always — layers, seats, aggregation |
| `references/seats/*.md` | one file per seat prompt |
| `${CLAUDE_PLUGIN_ROOT}/references/tells.md` | attack these first |
| `${CLAUDE_PLUGIN_ROOT}/references/studio-habits.md` | series checks |
| `${CLAUDE_PLUGIN_ROOT}/references/operad.md` | §6 named edits |
| `${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md` | naming failures; detector crosswalk |
