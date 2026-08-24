---
name: ceti-research
description: >
  Auto-research for CETI explainers. Digests a topic into conserved storyboard
  slots that must glue: metaphor, claim, counterexample, visual motif, duration.
  Occupies Propose in noether-harness. Never fabricates facts. Use when
  designing a course film, lookbook page, or ceti-explainer episode.
  Triggers: auto-research, CETI research, digest topic, storyboard slots,
  explainer research, /sheaf-run course.
---

# ceti-research

The **Propose** occupant of a CETI explainer run. It does not write the film.
It emits typed stalks that `ceti-explainer` and `sheaf-glue` can check.

## Conserved slots (do not invent extras)

| Slot | Vertex | Must hold |
|---|---|---|
| topic + audience + duration | L | named, bounded |
| claim that is true | C | sourced; no fabricated math |
| metaphor atlas | C | one motif family for the whole episode |
| beat order | O | research → metaphor → object → obstruction → glue → why it matters |
| preserve motif + palette | P | cream / ink / vermillion; no lookbook text reuse |
| verification | V | every claim has a source; every visual is the same city |

## Workflow

1. Search primary sources (papers, textbooks, living lookbooks). Quote, don't paraphrase into novelty.
2. Fill the six slots. If two slots disagree (e.g. duration 2:00 but 14 beats), Φ fails.
3. Hand the atlas to `ceti-explainer`. Do not skip glue.

## Honesty

Lookbook quality is a **bar**, not a corpus to copy. No text overlap with
`ceti-lookbook` pages. CETI palette is locked: cream `#FAF7F2`, vermillion
`#D94F30`, ink `#2C2A28`.
