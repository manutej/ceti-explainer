# recap-retrieve

**Move.** retrieve-once + re-see (PED #20, #21: Roediger & Karpicke 2006; Adesope 2017; NAR device 9, 23).
Operad entry: MODULE-OPERAD §14. Required last teaching module of every film (L13).

**Ports.** needs `instance`, `rule` · gives `retrieved` · PO `chain | axis` adapters (grid, track accepted by the
port, no adapter yet) · regions body + foot · τ all.

**Params.** `question` (≤ 90 chars, about content ≥ 30 s earlier) · `answerKind number|choice` + `options` ·
`model` (chain: `{N0,r,k}` → answer round(N0·r^k); axis: `{groups:[{anchor,mean,n,sd}], ask}` → the pile under the
asked anchor) · `recap [{glyph,line}]` (3–5; glyphs from the kit: fan staircase check grid outline block curve loop
wheel piles arrow ladder reservoir) · `returnLines` (strings or `{text, ok}` with a check) · `returnFigure` ·
`contentT` (film seconds of the question's content; a demo uses `given.contentAt`) · `eyebrow` · `figure` · `foot` · `notes`.

**Phases (23 s).** ask 5 s (dashed card, question rises, 3-2-1 ring, "pause and answer") · answer 4 s (payoff:
the answer is **read off the PO** — the train passes each junction / the asked pile lights, then written on the
card) · hold 2 s · recap 7 s (one glyph card per 1.3 s; never a bullet list) · return 5 s (the opening instance).

**Contract.** The answer is never a literal: `numbers().answer` derives it; audit checks it is derivable, is one of
the options (choice), recap items have glyphs and lines ≤ 48 chars. Roles: `answer card neutralMark returnInstance`.
Render is pure in (t, state.guess): the page's answer input only adds "YOUR ANSWER" to the card.

**Control.** `guess` (number field or choice chips), jumps to `answer`; result compares with the film's answer.

**Honesty it carries.** "one retrieval question is a small dose; its benefit is measured after a delay" (+ `notes`,
e.g. the anchoring piles are an illustrative spread around the published means).

**Fails.** asking about something 5 s ago (L13 fails it); a recap card that is a bullet list; no return.

**Demos.** `build/demo-0.html` (AI, type-safe: 2,000 × 0.99¹⁰ → 1,809; return Marisol's invoice, constrained) ·
`build/demo-1.html` (behavioural, anchoring: wheel 10 → 25 %; return both piles). `node test.mjs`.

**Grid adapter.** `model {N, base, reliability}`: a fresh city is counted on screen (rings → block → `hit ÷ (hit + false alarms)` with the Bayes line); audit checks the count stays within 1 point of exact Bayes.
