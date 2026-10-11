# accuracy-climbed · BLOCKED (2026-10-11)

No brief was written. The gate in the lane order was: re-read hal.cs.princeton.edu/reliability a second time, independently,
through WebSearch snippets; drop any model whose number differs between the two reads; if fewer than 8 models survive with
both accuracy and overall reliability, stop. Fewer than 8 survive.

## What the second read found (all WebSearch text; the page itself is unreachable, WebFetch: ENOTFOUND)

The dashboard is serving **two vintages at once**.

- **Vintage A, the GAIA sub-pages** (/reliability/benchmark/gaia/, /agent/<model>/benchmark/gaia/, dimension pages). These
  reproduce read 1 (princeton-dashboard.json) exactly for every model they returned.
- **Vintage B, the main tracker** (/reliability/). Its text says the final paper version "includes a correction to the
  outcome-consistency metric and scaffolding fixes for GAIA" (loopholes to ground truth closed). Every model it returned
  differs from read 1 in both accuracy and reliability.

| Model | Read 1 (frozen) acc / rel | Read 2, GAIA pages (A) | Read 2, main tracker (B) | Verdict |
|---|---|---|---|---|
| Claude Opus 4.5 | 68.5 / 0.85 | 68.5 / 0.85 | 74.6 / 0.87 | differs, DROP |
| Claude Opus 4.7 | 73.3 / 0.84 | 73.3 / 0.84 | (acc not shown) / 0.86 | differs, DROP |
| Gemini 3.5 Flash | 79.2 / 0.84 | 79.2 / 0.84 | 80.0 / 0.85 | differs, DROP |
| Gemini 3.1 Pro | 76.2 / 0.82 | 76.2 / 0.82 | 79.1 / 0.84 | differs, DROP |
| Claude Sonnet 4 | 54.7 / 0.82 | 54.7 / 0.82 | 66.5 / 0.84 | differs, DROP |
| GPT-5.5 | 62.8 / 0.79 | 62.8 / 0.79 | 71.1 / 0.84 | differs, DROP |
| GPT-5.2 (medium) | 31.8 / 0.72 | 31.8 / 0.72 | 49.9 / 0.77 | differs, DROP |
| GPT-4o Mini | 26.3 / 0.76 | 26.3 / 0.76 | not seen | agrees (survives) |
| Claude 3 Haiku | 12.9 / 0.69 | 12.9 / 0.69 | not seen | agrees (survives) |
| GPT-5.2 (plain) | 33.2 / no rel | 33.2 / 0.72 (rank 13) | not seen | one read only; also shows read 1 left this cell empty |

Survivors with both numbers identical in every read: **2** (GPT-4o Mini, Claude 3 Haiku). Required: 8.

Other findings to carry forward:
- Read 1 shows GPT-5.2 (medium) at 0.72; the GAIA pages give 0.72 to **both** GPT-5.2 (medium, 31.8 %, rank 14) and GPT-5.2
  (33.2 %, rank 13). The frozen file lacks the second.
- The main tracker also lists O1 and Gemini 2.5 Pro at 0.80 and Gemini 3 Pro / Opus 4.5 at 0.85 in the Fortune piece (2026-03-24);
  none of these is on read 1.
- The 14 versus 15 models conflict (arXiv versus dashboard) is unchanged.
- The paper's slopes (0.23 and 0.03 per year) were again not found and stay off screen.

## What would unblock the film (owner decision or one lane)

1. A lane with direct egress reads the live /reliability/ main table and every /agent/<model>/benchmark/gaia/ page once, and
   freezes ONE vintage (B is the paper's final, corrected one) with accuracy and overall reliability for at least 8 models; or
2. The owner explicitly accepts vintage A (the GAIA sub-pages; 10 models agree across both reads: the 9 above with both numbers
   plus GPT-5.2 plain at 33.2 / 0.72) as the frozen snapshot, labelled in the honest line as "the dashboard's GAIA pages before
   the metric correction". That is a 10-model, internally consistent set, but it is the superseded vintage, so it is the owner's
   call, not this lane's, because the lane rule drops every model that moved.

Note for either route: vintage B likely changes the thesis numbers (accuracy 12.9 to 79.2 and reliability 0.69 to 0.85 are vintage
A); recompute.py must be run on the frozen set before the thesis sentence is written.
