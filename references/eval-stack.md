# Eval stack — how a sketch earns the word "good"

*Grounded in research/05 (computational aesthetics, novelty search, VLM-as-judge 2024–26, critique
frameworks) and research/03 (population-level homogenization). The one-line thesis:*
**no computed metric predicts "good"; metrics are cheap vetoes for "broken" and "generic"; ranking beats
scoring for both humans and models; disagreement between judges is a finding, not noise.**

## The six layers (run in order; each can veto)

| Layer | What | Tool | Verdict effect |
|---|---|---|---|
| **a. Mechanical** | loads, no console errors/warnings, deterministic at fixed seed, not blank, no off-host requests | `scripts/render.py` | any failure → FAIL |
| **b. Code lint** | 2.x API drift, contract, expensive-inside-draw, 25 cliché fingerprints | `scripts/lint.py` | P0 → FAIL · ≥3 fingerprints → COMMON |
| **c. Computed metrics** | compression, entropy, edge density, fractal D, colourfulness, OKLCH palette, value bins, negative space, coarse structure, balance centroid, symmetry, hierarchy, spectrum | `scripts/metrics.py` | flags only; cliché flags on >50% of seeds → COMMON |
| **d. Seed sweep** | 8 seeds (dev) / 32 (series) / 64+ (release): failure rate, pHash dispersion, coarse structure, effective dimension, outliers | `scripts/gate.py` → `metrics.batch` | OATMEAL / mode collapse → COMMON |
| **d′. Series** | across pieces: shared ground / accent hue / layout twins / recorded studio habits | `scripts/series.py` | HOUSE-LOOK → `Reallocate` edits before seats |
| **e. Seats** | isolated critic agents, pairwise with swap, describe-before-judge | Agent tool + `archive/skills/p5-crit/references/seats/*.md` (archived 2026-10-10) | see aggregation |
| **f. Human** | sees worst seeds + DISAGREEMENT records first | — | only a human confirms "release" when Wonder decides |

`gate.py` runs a–d and returns **FAIL / COMMON / CANDIDATE**. A CANDIDATE is "ready to be judged", not
"good".

## Bands are priors, not targets

Every band in `metrics.py` is an initial prior from the literature (Machado–Cardoso compression;
Spehar/Taylor fractal D 1.3–1.5; Hasler–Süsstrunk colourfulness; Rosenholtz clutter; Jahanian/Arnheim
hotspots) and from the studio's own calibration renders. McCormack & Gambardella (2022) found no measure
predicts preference across datasets, so: **never optimise toward a band; use it to catch regressions and
accidents.** Declared intent overrides (`--intent "declared monochrome, low contrast, full bleed"`). Re-fit
bands once ~200 labelled studio renders exist; log the re-baseline in `RE-BASELINE.md`.

## The seats (layer e)

Each seat is a **separate agent** (Agent tool), launched in **one message** so they run concurrently, with
a prompt built from its file in `archive/skills/p5-crit/references/seats/` (archived 2026-10-10) and its own packet from
`scripts/seat_packets.py` (never one shared manifest — tells #14). A seat never sees another seat's
report, the generator's reasoning, or (except Craft) the code. Each seat gets: the contact sheet, the 2–3
worst seeds from `gate.json`, the hero seed, the one-line Intent, and — for pairwise — the previous version
or an anchor as A/B (order randomized, then swapped).

| Seat | Relation to the work | Sees | Output |
|---|---|---|---|
| **Composition** | form critic (Gestalt, Arnheim, Bertin) | renders | per-criterion A/B + evidence; winner |
| **Colour** | Albers/Itten critic | renders | per-criterion A/B + evidence; winner |
| **Craft** | senior creative coder | code + renders | defects with line numbers; grade 1–5; one most-valuable change |
| **Cliché hunter** (adversarial) | jaded curator of 10,000 sketches | renders (never the metrics) | nearest trope + closeness + verdict REJECT / BORDERLINE / PASSES |
| **Intent fit** | Rams/Tufte | renders + Intent | serves vs decorates list; A/B |
| **Wonder** (advisory) | informed non-technical viewer | renders only | what you felt, what held you; A/B; advisory weight |
| **Metric auditor** | sees metrics + render | gate.json + renders | KEEP / DISMISS per flag |

Minimum viable panel per iteration: **Cliché hunter + Composition + Colour** (pairwise vs previous).
Flagship piece: all seven. A whole gallery/series: run each seat **once over the whole batch** (one
agent per lens, all sketches in view) — this is how cross-sketch homogeneity ("all eight look like the
same studio") is caught, which no per-sketch judge can see.

### Prompt rules every seat inherits
1. Describe before judging: three one-line statements of what is visually striking (Lerman CRP step 1).
2. Pairwise, forced choice, no ties; if tempted to tie, name the single attribute that breaks it.
3. Evidence must be visible in the pixels (or the line of code for Craft). An opinion without evidence is
   struck at merge.
4. Be candid, not kind. A PASS from the cliché hunter should be rare.
5. End with "what I could not judge and why".

## Aggregation (do not average away disagreement)

- **Gates veto.** FAIL/COMMON from `gate.py`, or Cliché hunter REJECT, blocks "done" regardless of other seats.
- **Minimum over seats, not mean.** Release needs Composition, Colour, Craft and Intent each to prefer the
  new version (or rate it ≥ the "good" anchor), and Cliché ≠ REJECT.
- **Swap-inconsistent verdicts are near-ties** → "undecidable by model — human".
- **Disagreement is a finding.** Two seats more than one step apart → a `DISAGREEMENT` record with both
  evidences, shown to the human first.
- **Wonder is advisory.** It can raise a piece to "candidate-stunning"; a human confirms.
- **The builder never sits.** If no separate agent can be launched, say "self-judged — partial" in the
  scorecard and do not claim V3.

## From findings to edits

Each surviving finding maps to a **named edit** from `operad.md §6` (SwapTechnique, Reweight, Silence,
Reframe, Revalue, Subtract, Graft, Repose, Retime) with the finding id in the rationale. Precedence:
accessibility ⊐ brief ⊐ originality ⊐ preference. Re-run `gate.py`; re-seat pairwise (new vs old). Stop at
the identity edit or after three passes.

## Plugin-level evaluation (the studio judging itself)

Use the `moe-eval` skill on the plugin with its four core seats, plus these p5-specific attacks the seats
should run first (they are also rows in `tells.md`):
- **Operator:** render every template and calibration twin from a clean copy; byte-identical at fixed
  seed; `selfcheck.py` exit 0; lint catches every planted defect in `templates/calibration/twin-bad.html`.
- **User:** can a non-expert go from a one-line prompt to a shipped sketch using only SKILL.md files? Do
  the docs ever tell them to pick a noise octave?
- **Craft:** do the skills' own example code paths run on 2.3.4 (no 1.x idioms in our docs)?
- **Red team:** does following the skill exactly ever produce a seizure-risk flash, an unbounded loop, a
  network call, a living-artist imitation, or a "beautiful" claim without a render?
- **Calibration twin** for the metric seat: a known-oatmeal sketch (`templates/calibration/twin-oatmeal.html`)
  must come out COMMON; a known-composed sketch must come out CANDIDATE.

## Honest limits

- Still-frame metrics only; motion needs temporal metrics (flow distribution, loop seam, flash rate) —
  `gate.py` checks flash rate only when frames are rendered (see archive/skills/p5-ship).
- Seats share the model family and the brief's framing; isolation is not independence. Where another
  model family is available, put it in the Cliché and Wonder seats.
- Consistency (OC, seat agreement) is calibration, not truth. A whole panel can agree and be dull — which
  is exactly why the Cliché seat is adversarial and the human sees the worst seeds first.
