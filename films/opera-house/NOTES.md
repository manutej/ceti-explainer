# The Opera House · Case file 23 · the planning fallacy

The exec-room gold standard, as named by Manu on 2026-10-08. A 4:29 feature-tier film in the "Tender Set"
chrome: a drafting sheet issued for tender, a revisions ledger that fills as the case proceeds, a title block
whose date slot is stamped SEALED and then OPENED. The page as uploaded has
sha256 `0d922218ee203a2a6efe2670669afa6a60ec9f4e880a7a93c76a6c2ae13715f0` (1,127,447 bytes);
`python3 films/opera-house/build.py --check` rebuilds it byte-identical from the sources here and vendor/.

## Sources in this folder

| file | what it is | bytes |
|------|------------|------:|
| shell.html | the page: head, styles, masthead, stage, player, try-it panel, transcript, sources, honest limits; five placeholders | 66 KB |
| film.json | window.FILM: id, duration, the wall's fit (n 1000, mu 0.2555, sigma 0.487), 9 chapters, 9 cards, 31 captions, 8 revision rows, 59 timings, 7 sources | 6.7 KB |
| film.js | the chrome and the renderer, one clock: every frame is render(t, state); retained SVG for type and lines, p5 2.3.4 Canvas2D for ground, the 1,000-bar wall and the red pencil | 54 KB |
| page.js | player, chapters and cards, the sealed commit, the revise rail, the try-it panel, transcript; film mode exposes window.__film and window.__ctrl | 9.4 KB |
| build.py | assembles build/opera-house.html from the above, p5 and three faces from vendor/ | |

Code without p5 and fonts: 76.9 KB, inside the feature tier's 260 KB budget (DECISIONS D3). Fonts: Big Shoulders
Display 600 and IBM Plex Mono 400 and 500, vendored as WOFF2 under vendor/fonts with lock entries; no Google
Fonts import. p5 is the vendored 2.3.4 by hash. Contract: the System 1 feature page (skills/p5-explainer):
`?film=1` strips the page to the bare 1920 by 1080 stage; `window.__film.{ready, seek, only, info}` and
`window.__ctrl.{play, pause, seek, setState, state}` for the workers.

## What it does that the bar asks for

- **One clock.** render(t, state) rebuilds every frame from t; the only timers are the page's play loop
  and the eight-second commit countdown, neither inside the renderer. No Math.random, Date or frameCount
  outside p5 itself. The wall is 1,000 quantiles of the fitted log-normal, so every count is exact and
  identical on every device; the arrival order is a seeded shuffle (mulberry32, seed 23).
- **Commit before readout, held on the page, timed in film mode.** At 0:51 the page pauses and asks for
  a month (eight seconds, else "no date"); the film-mode render uses defaultDate 13. This is exactly
  decision Q13 (hold on the page, timed on the MP4) already in practice.
- **Counts first.** 300 of 1,000 is drawn and counted (1:50 to 2:05) before "3 in 10" appears (2:30), and
  the ratio always carries "300 ÷ 1,000" beneath it. Q14.
- **Truth.** Every number recomputes from the two fitted parameters or a cited source. Checked:
  Φ(−μ/σ) = 0.300 so 300 bars on plan; median 12·e^μ = 15.5; eight in ten at 12·e^(μ+0.8416σ) = 23.4,
  shown as 23; 815 of 1,000 by month 24; Opera House 1959 to 1973 is 14 years against 4 planned (3.5×) and
  $102M against $7M (14×); the curriculum team 7 to 10 years, 40 % never, 8 years taken; 8.5 % and 0.5 % from
  16,000 projects. Seven sources listed on the page; an honest-limits block names the wall as a constructed
  teaching object and the reference classes as different.
- **Silent.** No audio; captions carry it, with a transcript below. Q3.
- **Exec clean.** Typeset numbers in a mono face on a drafting sheet; the texture is paper and pencil, never
  a hand-drawn figure. Q6. The ink pattern of the blueprint (SVG text over canvas mass) is this film's
  pattern, so the Tender Set is the first chrome of the default material.
- **A try-it panel that reruns the same arithmetic**, with the viewer's sealed month fed back in.

## Probe results (headless Chromium, this container, 2026-10-08)

| row | result |
|-----|--------|
| load, film mode, 1920×1080 | zero console errors, zero page errors |
| hooks | __ctrl {play, pause, seek, duration, state, setState}; __film {ready, seek, only, info}; OPERA exposes render, countBy, RAT, T |
| canvas purity | re-seek to 115 s and 152 s after other seeks: canvas pixels byte-identical |
| SVG purity | re-seek identical in geometry and text; the only differences are an empty `style=""` left on pooled elements after a hide/show cycle, and the stale text of a hidden pooled element; nothing visible changes |
| phone 390 px, live page | stage 358 px wide; the "3 IN 10" headline, the plan bar and the wall read; the 11 to 12 unit sidebar and axis text do not |

## Where it falls short of the bar, for the next revision

1. **Ending.** It ends on its own black "CASE CLOSED" card and a rolled-up sheet, with no CETI brand card.
   Decision Q8 asks for the material's last image and then a brand card; the brand card is the one change.
2. **Legibility (G6).** Must-read text at 28 units or more holds for the headline, the counts and the
   captions (24 to 28). The revisions ledger, the sidebar note and the honest-limits lines sit at 11 to 12
   units, which is 4 to 5 CSS px on a phone. The honest-limits lines are must-read; they need a bigger face or
   a card of their own.
3. **Length and structures.** Nine chapters and nine cards over 4:29. It is a feature cut, not a two-minute
   Grasp, so the four-structure cap does not apply; it should be registered as the feature-tier exemplar,
   and a Grasp cut (the plan, the commit, the wall, where you sit) is the natural two-minute derivative.
4. **Purity hygiene.** The pooled-element `style=""` and stale hidden text are harmless but would trip a
   gate that diffs innerHTML; the fix is to clear the style attribute and text when an element is hidden.
5. **Cards between every chapter.** The nine black cards are the one tic the fingerprint gate (G9) would
   count; the batch rule applies if siblings in the same chrome repeat it.

## Role in the quality system

Known-good calibration fixture for the exec level: G1 to G5 and G8 must pass it; G6 must flag items 2 above
and nothing else; G9 may flag item 5 and nothing else. The baseline hash of the rebuilt page is in
tests/baselines/builds.json and the rebuild is proof (v) in tests/proofs.sh.
