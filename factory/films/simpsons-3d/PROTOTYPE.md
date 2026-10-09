# P1 measurements · simpsons-3d ("Worse overall, in three dimensions")

Chain: webgl-scene + morph-type + camera + shader neon post. Brand ceti-boardwalk-dark, chrome none, level manager,
format case, renderer webgl. Pipeline: 3 Sonnet drafts → Opus blind select → 2 fix rounds (knobs and captions only).

| stage | agent | wall | tokens | result |
|---|---|---|---|---|
| infra (kit2 webgl, knobs, frames.mjs, apply_findings.py) | Opus | 14.8 min | 227 k | smoke-webgl gate PASS |
| draft a · the architectural model | Sonnet | 23.1 min | 351 k | gate PASS, 32 knobs, 0.66 s/frame |
| draft b · the exhibit | Sonnet | 26.9 min | 362 k | gate PASS, 52 knobs, 0.62 s/frame |
| draft c · the instrument | Sonnet | 19.7 min | 318 k | gate PASS, 52 knobs, 0.42 s/frame |
| select + findings r1 | Opus (blind) | 4.7 min | 194 k | winner c; 11 findings (5 major, 6 minor) |
| apply r1 (rebuild, gate, strip) | tool | 1.7 min | 0 | 11 applied, 0 rejected, PASS |
| findings r2 | Opus | 1.6 min | 29 k | 5 findings (1 major, 4 minor) |
| apply r2 | tool | 1.7 min | 0 | 5 applied, 0 rejected, PASS |
| **total** | | **≈ 55 min wall (drafts in parallel)** | **≈ 1.48 M** | |

Shipped page: build/simpsons-3d.ceti-boardwalk-dark.none.html, 1,269,544 bytes (limit 1.3 MB); film code 80.2 KB.
Gate: PASS, one WARN (G5c arrival counters, kit defect 7). s/frame headless after apply: 0.21 (frames.mjs, 151 frames);
neon reveal frames 1.3–1.5 s. Purity identical at three times. Duration 75 s.

## Success criteria (docs/PROTOTYPES.md P1)
- Reversal seen, not told: yes. Front view men ahead (30–40 s); side view six pairs, women ahead in four (48–58 s).
- Gate PASS on first build of every draft: yes (3 of 3).
- Findings converge: 11 → 5; all expressible as knobs or captions were applied; 4 film.js items parked.
- s/frame < 1.5 s: yes on average; neon frames touch the limit.
- Zero film.js edits after drafting: yes.

## What the prototype taught
- The knobs contract works as the evaluator's only lever: 16 of 16 findings applied by tool, none by hand.
- Blind selection chose the draft whose picture carries the claim (c), not the prettiest (a) or the most dramatic (b).
- The beyond-scope list is the next contract to write: pins, rings and stamps need a "layers" knob set or a
  film.js round with a narrow brief.
- Three drafts cost ≈ 1 M tokens; the select-and-fix loop ≈ 0.25 M. Cheaper drafts (two instead of three) are the
  obvious lever for scale.
