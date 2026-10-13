# transitions

**What it is for.** How one scene becomes the next, as a pure function of u in [0,1] over two scene renderers. A and B are each drawn once per frame into a p5.Graphics layer ([[layered-compositing]]), then composited onto the canvas by one of eight transitions: cut, dissolve, wipe (any angle, soft edge), iris (open or close, any centre), push/slide, match cut (one shared circle stays put while everything else changes), zoom-through (the camera dives into a grid cell, which is the next scene) and a ledger turn (a leaf swings about the spine, perspective strips and shading). Scene windows come from `core/timeline.js` `scene()`; each scene sees its own local time ([[scene-local-time]]), and the transition span is the overlap of two windows.

**When NOT to use.** When a cross-fade from `scene()` is enough. Not for continuous camera moves inside one scene (use the camera pattern). Do not put a number that must be read on screen mid-transition; commit the count before the transition starts.

## Params
- `dur` 12 s (total); `hud` true; `anchor` {x,y,r} or null (match cut only).
- `seq`: list of `{ s: scene, d: seconds, tr: {...}, style? }`. The next scene starts at `d - tr.d` after this one. Last scene holds.
- Scenes: bars, field, line, table, cells {cols 2-12, rows 2-8, cw 80-200 px (16:9 cells), target [i,j]}, detail, orbit, scatter, ledgerM.
- `tr.k`: cut | dissolve | wipe | iris | push | match | zoom | turn. `tr.d` 0.2-2 s. `tr.ease`: inout (default) | smooth | linear.
- wipe: `ang` 0-360 deg, `soft` 0-400 px, `rule` false hides the edge line. iris: `mode` open|close, `cx`,`cy` 0-1. push: `dir` left|right|up|down, `cover` 0.2-1 (1 = push, below 1 = slide over). zoom: needs `cols,rows,cw,target` on the A scene; log-space zoom. match: `style` on each scene {f,s,sw,r2,dot} (roles), lerped in OKLab.

## Variants
- `four-scenes`: bars, field, line, table joined by a soft angled wipe, an iris opening off-centre, a ledger turn.
- `plain-cuts`: the quiet end of the range: hard cut, dissolve, slide-over.
- `match-cut`: a circle fixed at (480,270) across orbit, scatter and ledger scenes; only its dress (outline, filled point, red stamp) changes.
- `zoom-through`: 7x5 grid, dive into cell 19, a 4x3 grid, dive again, detail scene.

## Atlas
[[scene-local-time]] S137 S319 (windows, local time); [[layered-compositing]] S13 S256 S357 (A/B layers, explicit density); [[erase]] S41 (foil: wipes use destination-in on a work layer so the soft edge is a true alpha ramp, which erase() steps cannot give); [[easing-functions]] S81 S335 (inout cubic; log-space zoom).

## Pitfalls
- Graphics density must be set explicitly (done in setup); drawImage source rectangles are in canvas pixels, so multiply by density.
- Zoom magnifies A ~7x; fine strokes go fat while B is still fading in. Keep A's grid simple.
- The turn assumes full-bleed grounds on both scenes; it shows the spine on any ground but looks best on paper roles.
- Match cut: scenes must not draw the anchor; the driver draws it after compositing. Keep scene content off the anchor disc.
- The cut keeps both windows alive for `tr.d` (0.2 s) and flips at u = .5.
- HUD strip occupies y 506-540; set `hud:false` in a film.

## Cost
About 12.5 ms/frame headless (960x540, density 2, two scene layers plus composite). Turn is the dearest (44 strips).

## Renderer / fallback
p2d with raw Canvas2D for compositing (clip, destination-in, drawImage). No beta APIs. A WEBGL film would need the same eight functions as a shader mixing two framebuffers.
