# Sweep: does each lane read token roles? (lane x brand)

Tool: `node arsenal/tools/sweep.mjs <demo.html>` (one variant, mid time, every pack in arsenal/brands/*.json). Sheets: `<lane>/shots/sweep.png`, data: `<lane>/shots/sweep.json`.

applied = frame differs from the ceti-dark render AND 2+ of 4 canvas-corner pixels are within RGB distance 28 of the pack bg. not applied = demo drew the ceti-dark look (or another bg) under that brand. `*` = applied only because the sweep shimmed `fetch("../brands/<id>.json")`; on file:// the demo itself cannot load it (silent fall back to ceti-dark). `+N err` = console errors logged. ERROR (fatal) = demo did not become ready.

## Summary by lane

| lane | variant @ t | brands applied | verdict |
|---|---|---|---|
| materials/shader | neon @ 2s | 4/22 | inlines only some packs (4 of 22) |
| patterns/annotations | callouts @ 4s | 22/22 | reads roles for all packs |
| patterns/camera | map @ 6s | 4/22 | inlines only some packs (4 of 22) |
| patterns/data-marks | bar-race @ 6s | 22/22 | reads roles for all packs |
| patterns/explorable | sample-size @ 3s | 4/22 | inlines only some packs (4 of 22) |
| patterns/fields | streamlines @ 3s | 22/22 | reads roles for all packs |
| patterns/generator | sequence @ 4s | 1/22 | ignores ?brand= (one pack inlined or none) |
| patterns/glyphs-iso | sheet @ 4s | 22/22 | reads roles for all packs |
| patterns/grid-type | editorial @ 4s | 22/22 | reads roles for all packs |
| patterns/handwriting | glyph-sheet @ 4s | 22/22 | reads roles for all packs |
| patterns/layers | spotlight @ 4s | 22/22 | reads roles for all packs (only via fetch; fails on file://) |
| patterns/maps-matrices | confusion-2x2 @ 3s | 22/22 | reads roles for all packs |
| patterns/mass | grid-1000 @ 4s | 1/22 | ignores ?brand= (one pack inlined or none) |
| patterns/materials-demo | ink @ 2s | 1/22 | ignores ?brand= (one pack inlined or none) |
| patterns/morph-type | word-to-word @ 3s | 4/22 | inlines only some packs (4 of 22) |
| patterns/palette | (brand) @ 2s | 22/22 | reads roles for all packs |
| patterns/particles-text | word-chain @ 4s | 22/22 | reads roles for all packs |
| patterns/physics | settle @ 4s | 2/22 | inlines only some packs (2 of 22) |
| patterns/reveal | diagram @ 2s | 22/22 | reads roles for all packs (only via fetch; fails on file://) |
| patterns/rhythm | tempo-2.5 @ 6s | 22/22 | reads roles for all packs |
| patterns/structures-demo | thousand @ 6s | 4/22 | inlines only some packs (4 of 22) |
| patterns/timeline | slow-pedagogic @ 7s | 4/22 | inlines only some packs (4 of 22) |
| patterns/transitions | four-scenes @ 6s | 22/22 | reads roles for all packs |
| patterns/webgl-scene | iso-sorted @ 6s | 3/22 | inlines only some packs (3 of 22); 18 brand(s) errored |

## Matrix

| lane | blueprint | ceti-boardwalk-dark | ceti-boardwalk-light | ceti-coastal-dark | ceti-coastal-light | ceti-dark | ceti-greenhouse-dark | ceti-greenhouse-light | ceti-marketing | ceti-neosage-dark | ceti-neosage-light | ceti-owala-soft | editorial-serif | high-vis | midnight-ink | neon-lab | newsprint | pastel-pop | swiss-grid | tender-set | terminal | warm-lab |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| materials/shader | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/annotations | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/camera | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/data-marks | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/explorable | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/fields | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/generator | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied |
| patterns/glyphs-iso | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/grid-type | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/handwriting | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/layers | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* |
| patterns/maps-matrices | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/mass | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied |
| patterns/materials-demo | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied |
| patterns/morph-type | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/palette | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/particles-text | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/physics | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied |
| patterns/reveal | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* | applied* |
| patterns/rhythm | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/structures-demo | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/timeline | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | not applied | applied | not applied | not applied | applied | applied | not applied | not applied |
| patterns/transitions | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied | applied |
| patterns/webgl-scene | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | applied | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | ERROR (fatal) | applied | ERROR (fatal) | ERROR (fatal) | not applied | applied | ERROR (fatal) | ERROR (fatal) |

Applied packs per lane that inline a subset:

- materials/shader: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/camera: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/explorable: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/morph-type: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/physics: ceti-dark, neon-lab
- patterns/structures-demo: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/timeline: ceti-dark, neon-lab, swiss-grid, tender-set
- patterns/webgl-scene: ceti-dark, neon-lab, tender-set

No lane was edited. Brand count and ids come from arsenal/brands/*.json at run time (22 packs).

## Notes for the orchestrator

- Counts include ceti-dark, which is trivially applied (it is the default pack). Real brand reading = count minus 1.
- Full: annotations, data-marks, fields, glyphs-iso, grid-type, handwriting, maps-matrices, palette (variant = brand), particles-text, rhythm, transitions. These read roles for every pack, including the 10 ceti-* packs added after the first four.
- layers, reveal: apply every pack only through `fetch('../../brands/<id>.json')`, which fails silently on file:// (the lane falls back to ceti-dark). Sweep shims fetch, so they show `*`. They need an inline pack table or packs.js to be file://-safe.
- Four inlined packs (ceti-dark, neon-lab, swiss-grid, tender-set): camera, explorable, morph-type, structures-demo, timeline, materials/shader. Everything newer falls back to ceti-dark.
- physics inlines two (ceti-dark, neon-lab). webgl-scene inlines three (ceti-dark, neon-lab, tender-set) and THROWS (TypeError reading .id of undefined) for any other id: the unknown-brand fallback is missing.
- Ignore ?brand= entirely: generator (one inline pack), mass (comment says it tries ../../brands/<id>.json; the code never reads ?brand=), materials-demo.
- Corner-pixel test limits: a demo that paints its own panel over the corners would read as not applied; the sheet (shots/sweep.png) is the ground truth, one row per brand.
- sweep.mjs always renders ceti-dark as the reference frame even when --brands omits it.

