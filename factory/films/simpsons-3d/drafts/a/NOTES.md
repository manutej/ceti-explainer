# simpsons-3d · draft A · "the architectural model"

Berkeley 1973 as a city of 4,526 boxes on a plinth, slow orthographic orbit, calm. renderer webgl (kit2 native),
brand ceti-boardwalk-dark, chrome none, level manager. Build: `python3 factory/kit2/build.py <this dir> --brand ceti-boardwalk-dark --chrome none`.

## What it shows
- HOOK 0-8: two plain towers (old, new process), KILLED stamp, the new one lowered. No digits.
- COMMIT 8-16.5: empty footprints MEN / WOMEN, kit commit box (default 5).
- CASE 16.5-36: two 12x12 columns fill layer by layer at one rate (counter rides the top: 2,691 / 1,835); admitted boxes light bottom up
  (1,198 / 557), a waterline marks the level. Heights are counts. No percentage.
- COUNT 36-62: headline morphs 45% -> 30%; camera flies front (el 7) to side (az 50, el 35); columns sink, six slabs rise
  (men block + women block per department, same height; the lit share of the height is the rate, waterline bar on each block).
  Headline morphs through six pairs, then "2" (reveal, neon glow only around 52.4 s), then 51% / 7%; C-F dim for the mix.
- MONDAY 62-72: "Same mix of leads?", KILLED struck through; honest line is the last caption. Brand card at 72.

## Wiring
film.json `libs`: lib/glyphs.js (outlines of 0-9 and % baked from Fraunces by lib/bake_glyphs.py; no runtime font), lib/camera.js
(arsenal camera, verbatim; sample() with channels remapped: x az, y el, zoom log, fx fy fw look point, fh fa screen offset),
lib/scene3d.js (webgl-scene tiers + role Lambert shader), lib/morph.js (morph-type pairing code, outlines from glyphs.js, Canvas2D
even-odd fill into a p5.Graphics drawn as an image), lib/neon.js (neon look of materials/shader, thresholded on rendered colour).
Inlined by kit2 `libs`, not assembled into film.js (film.js is 21 KB). Scene -> framebuffer -> canvas, headline image, then neon filter.
Labels are kit SVG pinned with my own ortho projection (p.worldToScreen is mirrored in y under a framebuffer camera).
32 knobs (film.json knobs_doc), incl. camera times, orbit, cell, boxGap, slabGap, headSize, neon*, capShift (captions are drawn from film.js
with K.caption(t + capShift)).

## Gate and cost (node factory/tools/gate.mjs ... --kit factory/kit2)
PASS, G1-G10 all PASS except G5c WARN (arrival counters tick 204, 408 ... : counts in progress, as in the 2D film). Page 1.269 MB
(limit 1.3), film code 44.5 KB. frames.mjs: 151 frames, 0.66 s/frame (SwiftShader), purity identical, 0 errors. Gate wall time 2m48.

## Warnings
- The headline numbers and "%" are canvas pixels: the gate does not see them (G5c/G7 read SVG and captions only).
- Admitted boxes are sorted to the bottom of each column (layout, not a shuffle); said in captions as "admitted", not as a sort.
- Slab block heights are equal to within one layer; lit height = admitted / layer capacity, so rates read to about +-3 points. Printed numbers are exact.
- Women blocks stand in front of men blocks in the side view; men's lit parts are partly hidden in C-F (waterline bars carry the reading).
- Mid-morph "6", "8", "9" show a hairline slit (the face stores counters as one bridged contour).
- Caption 13 and 14 wrap to two lines (kit caption box).
