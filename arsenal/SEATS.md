# Seats · evaluator verdicts on the arsenal · 2026-10-08

Judged from card.md, shots/contact.png, shots/report.json, two atlas citations per lane, kit2/PROOF.md with both matrices and
six full stills. Severity: S1 blocks, S2 visible defect, S3 doc. Purity: every variant `identical`, 0 errors. ms = shoot.mjs
ms/frame (GL lanes under-report).

## 1 · Per lane

| lane | variety | craft | atlas | ms | verdict | to the director |
|---|---|---|---|---|---|---|
| shader | 4 | 3 | 5 | 22.3 (real 1.9–2.5 s) | SHIP-WITH-NOTES | S2: 12-px caption rides the top rule, unreadable in neon/halftone; chalk reads as plain ink. |
| camera | 3 | 4 | 5 (3D/2D gap flagged) | 13.1 | SHIP | S3: map and map-cuts share keys: three looks, not four. |
| explorable | 3 | 4 | 5 | 12.8 | SHIP-WITH-NOTES | S2: not a module (own instance, DOM, draw ignores t); one header grammar. |
| fields | 3 | 2 | 4 (S-ids lumped) | 13 (drift 43) | REVISE | S2: `breath` invisible, `drift` barely reads on ceti-dark; light packs never shot. |
| generator | 2 | 4 | 5 | 8.3 | SHIP-WITH-NOTES | S3: three authorings, one look; t=0 empty in all three. |
| layers | 5 | 4 | 5 | 27.8 | SHIP | None; best range in the library. |
| mass | 4 | 4 | 5 | 194.5 | SHIP-WITH-NOTES | S2: t=0 empty box in all three; bars-50000 sorting frame is noise; guess/actual readout under 14 units carries a result. |
| materials-demo | 5 | 3 | 4 (p5-brush cited, unused) | 20.7 | SHIP-WITH-NOTES | S2: scene fills a third of the frame; materials cannot be told apart on the sheet. |
| morph-type | 5 | 3 | 5 | 7.9 | SHIP-WITH-NOTES | S2: stray Y and "VKEY" collision in two word stills; mono-dots mid-morph is a blob; faux-bold (labelled). |
| palette | 5 | 4 | 5 | 9.4 | SHIP | Only lane that proves the brand axis on its own sheet. |
| physics | 4 | 3 | 4 (fixed-timestep page is about export clocks) | 21.8 | SHIP-WITH-NOTES | S2: settle t=0 drops labels over the counter, formula and inset; pour bin counts under 14 units. |
| reveal | 4 | 5 | 5 | 8.1 | SHIP | None. |
| structures-demo | 5 | 4 | 3 (triangle-subdivision says nothing about seeds) | 15.5 | SHIP | S2: timeline label clipped at right edge at t=0. S3: drop that citation. |
| timeline | 2 | 3 | 5 | 23 | SHIP-WITH-NOTES | S2: chart lane labels 10 px, illegible; one scene, three timings, house look. |
| webgl-scene | 4 | 3 | 5 | 40.3 (real 0.5–0.7 s) | SHIP-WITH-NOTES | S2: fly-through t=3.96/8.04 inside geometry (flat wall); token faces replaced by Barlow; README 41.1 vs report 40.3. |

## 2 · Cross-lane

**Still the Opera House.** Thirteen of fifteen sheets are ceti-dark only, in the film-sheet grammar (mono eyebrow, display counter
top-right, one rule): timeline, generator, physics, mass, explorable, camera, structures-demo most of all. Only palette and shader
show a brand switch.

**Composes with kit2.** Clean: materials/drawn (the proxy's exact mark/texture interface), core/timeline.js, generator.js, structures,
reveal, camera, layers (P2D, roles; pack is `window.KIT2.brand`). Not: shader (under ARSENAL.materials but pattern-shaped, WEBGL
main canvas), mass bars-50000 and webgl-scene (WEBGL), morph-type and webgl-scene (data-URI TTF/WOFF while kit2 embeds WOFF2),
explorable (own instance, DOM).

**Adopt first.** 1. core/timeline.js: closes Q3 P2/P3/P5 (seg()/T tables, captions as data), zero render coupling, checked to 1e-9
against seg(). 2. structures: counts-first is grid/wall/ring/columns with transitions, hand-rolled in every film. 3. reveal:
arc-length draw-on (P8) for axes and arrows, 8 ms, roles only.

**Contract drift for BRIEF.md.** (a) async `setup` (morph-type, shader, webgl-scene fonts). (b) `ctx.tokens` in setup (palette,
timeline, mass; layers defers to first draw). (c) `?brand=` cannot fetch on file://: explorable inlines packs, palette needs a
generated packs.js; pick one. (d) no font-loading contract (morph-type inlines TTF; physics "host must load"; materials fall back to
monospace). (e) renderer per variant (mass `rendererFor`). (f) "material" names two interfaces. (g) `p.drawingContext` drawing is
common; say it is allowed. (h) hidden extra canvases: shoot.mjs should use `canvas.p5Canvas`.

## 3 · kit2 matrix

**Faithful.** Yes: in all 32 cells geometry, numbers and caption are identical across brands and chromes; sources' sha256 unchanged;
the face-ratio fix holds on Jost.

**Crops (S2).** Memo: DATE truncates ("EVERY PLANE TH"); TO carries a cut takeaway ("WHEN A MEASURE"); the double rule and red margin
rule survive as orphaned stubs beside the numbers (x 670–912); RE/FROM/FILE lost. Ledger: PARTICULARS and TALLY not drawn, AUDIT
column empty but for the stamp, left ruling shows as stubs above the grid. Neither chrome moves the film into `layout.safe`.

**Exec-clean (Q6) under neon-lab.** Holds in the 32 cells: mono numbers, no icons, no glow, grain not rendered. It holds by omission
(S1 for the gate): no gate row reads texture or material, so `--material chalk` (hand-drawn marks, smudged ground) PASSes while
breaching Q6, and the neon shader would too once wired. S3: accent2 never appears, so half of neon-lab is untested.
