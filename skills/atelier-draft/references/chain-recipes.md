# chain-recipes · which arsenal modules to chain, by visual job

Read when you must choose and wire p5 modules for a film. Topic-agnostic: recipes are keyed by what the picture does.
Sources: arsenal/{README,BRIEF,SWEEP,SEATS}.md, every lane card.md, core/{timeline,generator}.js and structures.js headers, the
shipped chains (factory/films/wiring-and-the-whole/lib, factory/films/simpsons-3d/drafts/{a,b,c}/lib, PROTOTYPE.md).
Companion: kit2-contract.md (film.json, K API, gate rows). Paths below are relative to the repo root.

## Contents
1. Module table (ids, signatures, exports, renderer, cost, brand fidelity, card)
2. Recipes by visual job (R1-R16)
3. Assembly: lib/ + assemble.py, or kit2 `libs`
4. Costs and limits

---

## 1. Module table

**Contract (BRIEF).** `ARSENAL.patterns[id] = {id, renderer, params, variants, setup(p, ctx{seed,w,h,tokens}, params) -> state
(may be async), draw(p, t, state, params, tokens)}`; pure of t; seeds via mulberry32(ctx.seed) in setup; roles only, never hex.
In a film you call a module yourself: `st = M.setup(p, {seed: F.seed, tokens: TOK}, params)` once in `FILM_RENDER.setup`, then
`M.draw(p, localT, st, null, TOK)` each frame (wiring did exactly this for reveal and annotations; `params` may be null once
setup has folded them into the state; for any other module read its draw first). `TOK` = `{id, color:{bg,ink,accent,accent2,muted,line,chalk,panel}, type:{disp,mono,body}:{family,weight}}`
built from `K.C` / `K.FONT` (wiring film.src.js lines 80-89). Draw into `K.p`; wrap in push/pop + `ctx.globalAlpha` for scene fades.
Await async setups (morph-type, particles-text, webgl-scene fonts) in `async setup(p, K)`.

**Cost class** (harness ms/frame, 960x540 x2, headless CPU raster): cheap <= 10, medium 10-30, heavy = GL or >= 0.1 s. **Brand** (SWEEP,
measured on demos via `?brand=`): ALL = reads roles for all 22 packs; fetch = all 22 but only via fetch (fails on file://); N = demo inlines N
packs; none = demo ignores `?brand=`. In a film the pack arrives through `TOK`, so N/none/fetch are demo limits; but a lane marked N/none was
never swept with other tokens inside a film, so check one light pack (`--brand swiss-grid`) on first build.

| id | job (one line) | setup / draw reads | exports for chaining | rend. | cost | brand | card |
|---|---|---|---|---|---|---|---|
| core/timeline | tracks, builder, scene windows, captions as data | `timeline().init({k:0}).play(k,to,dur,ease).wait.all.stagger(n,gap,fn,{order}).beat(name,cap).compile()`; `scene(t0,t1,null,{fade,fadeIn,fadeOut,hold}).at(t)`; `captions(list,{fade})(t)` | `ARSENAL.core.timeline` {track,timeline,scene,sequence,scenes,captions,ease,color}; compiled `.at(key,t) .values .beats .beatTime .duration` | none | cheap | n/a | arsenal/core/README.md |
| core/generator | authored scene as `function*`, compiled once | `scene(function*(s){yield* tween(s.x,{v:1},1,'outCubic'); yield wait(.5); yield* all(..)},{init,dur})` | `ARSENAL.generator.scene` -> `.at(t)` fresh object, `.labels .stats .dur` | none | cheap | n/a | patterns/generator/card.md |
| structures | pure count layouts + transitions | `grid(n,cols\|0,box)` `wall(n,box,sortKey)` `ring(n,r,{cx,cy})` `columns/rows(groups,box,{labels,groupGap})` `timeline(events,box)` `tree(parents,box)` `scatter(n,box,seed,{shrink})` `transition(A,B,u,{stagger,by,arc,ease})` `highlight(L,pred)` `fit(box,n)` | `ARSENAL.structures.*` + `mulberry32`; layout = `{items:[{i,x,y,w,h,g,a,hl}], size, legible, group, ...}` (x,y = centre) | none | cheap | n/a | arsenal/structures/README.md |
| materials/drawn | how a mark is drawn: ink, pencil, stitch, chalk, marker, blueprint | `materials[id].mark(p,kind,x,y,w,h,{seed,i,u,role,a,text},tokens)`, `.texture(p,box,tokens)`; kind rect/dot/bar/line/arrow/label-underline | `ARSENAL.materials[id]`; kit2 injects via `--material` (`K.pencil` proxy); webgl films: ink only | p2d | medium | roles (not swept; kit2 proof: 4 packs) | patterns/materials-demo/card.md |
| materials/shader | neon / halftone / riso / chalk full-frame post | `look`, neon `radius gain core thresh`, halftone `cell angle soft`, riso `reg grain`, chalk `erode dust wobble`; scene coded as R/G/B coverage | `ARSENAL.materials.shader.shaders` (GLSL strings; `.neon.split('uniform float uRadius')[0]` = reusable header) | webgl | heavy: 1.9-2.5 s/frame real | 4 | materials/shader/card.md |
| annotations | callouts, brackets, dimension lines, hand circles/underlines, pins, spotlight | `annos:[{kind:callout\|bracket\|dim\|circle\|underline\|pin\|spot, t0,t1,text,role,size>=14,...}]`, `obstacles`, `underlay(p,T)`, `inDur outDur ease lineW wobble gap dim pen` | state carries `audit` (label/label, label/target overlaps, leader crossings) | p2d | cheap | ALL | patterns/annotations/card.md |
| camera | keyed 2D camera: move, cut, ken-burns | keys `{t,x,y,zoom,fx,fy,fw,fh,fa,label}`; `mode move\|cut`, `kenburns`, `focus`, `ease`, `labelMin` | `ARSENAL.patterns.camera.api` {sample(keys,t,ease), worldToScreen, screenToWorld, toCuts, EASE}; zoom lerps in log space | p2d | medium | 4 | patterns/camera/card.md |
| data-marks | honest chart marks: bars, line, area, dots, dumbbell, slope, waffle | `mode race\|line\|waffle\|slope`; `race{years,max,hlName,data}`, `line{d0,d1,unit,area,claim}`, `waffle{groups}` | `ARSENAL.dataMarks` {scale,axis,shove,bars,line,dots,dumbbell,slope,waffle,fmtN}, each with `enter(p,u,T)`, `highlight(pred)` | p2d | cheap | ALL | patterns/data-marks/card.md |
| reveal | arc-length draw-on of lines, curves, arrows, networks | `paths:[{spec:{kind:line\|bezier\|spline,pts},st:{role,w,dash,head,pen,taper,alpha}}]`, `stagger dur hold ease easeMode guide lineW` | state only; one state per path group (wiring made 5) | p2d | cheap | fetch | patterns/reveal/card.md |
| glyphs-iso | 15 one-weight glyphs, isometric boxes, marching-dash arrows | `ARSENAL.glyphs.draw(p,T,name,cx,cy,size,u,t,{lineW,role,hiRole,glyphStagger,alpha})`; `iso.make({ox,oy,s,ang})` | `ARSENAL.glyphs` {defs,order,draw,flowArrow,stroke,partial,posAt}; `ARSENAL.iso` (box,grid,path,ring,project) | p2d | cheap | ALL | patterns/glyphs-iso/card.md |
| grid-type | 12-col grid, modular scale, `fit(text,box)`, region templates | `template editorial\|poster\|sheet`, `ratio base gutter margin baseline`, `overlay` | `ARSENAL.gridtype` {grid,scale,fit,markGrid,layout,contentBox} | p2d | cheap | ALL | patterns/grid-type/card.md |
| handwriting | single-stroke digits and signs written by a hand | `ops:[{op:text\|type\|underline\|circle\|arrow, ...}]`, `fit speed pen slant wobble penTip` | `patterns.handwriting.GLYPHS` (add strokes for new letters) | p2d | cheap | ALL | patterns/handwriting/card.md |
| maps-matrices | confusion matrix, heatmap, territory map, adjacency matrix | `mode confusion\|heatmap\|territory\|adjacency`, `classes n bins cell size sea regions`, `seedOffset` | none (self-contained drawing) | p2d | cheap | ALL | patterns/maps-matrices/card.md |
| mass | 1k-50k marks as grid / scatter / bars with arrive, sort, highlight, guess | `N structure impl mix sort hlFrac guess phase dur` | `rendererFor(params)`; `impl` canvas2d (4-48 ms) \| shape \| webgl | p2d / webgl | cheap-medium (canvas2d); heavy (webgl 0.1-0.2 s) | none | patterns/mass/card.md |
| morph-type | words and digits morph by glyph outline; ticker; weight rise | `mode words\|ticker\|weight`, `words hold_s morph_s size maxW step stagger lift render`, `from to count_s` | none unpatched. Patch: `P.kit = {makeShape,xform,buildPlan,paint,trace,mix,easeIO,easeOut,clamp,lerp}` (simpsons-3d/b) | p2d | cheap (setup < 1 s) | 4 | patterns/morph-type/card.md |
| particles-text | N particles become words, rings, grids, the numeral N | `seq:['@scatter','TEXT','#N','@ring'...]`, `n font sample size move_s hold_s stagger field match curl` | none | p2d | cheap (setup <= 1 s) | ALL | patterns/particles-text/card.md |
| physics | baked springs, pour, flock, steer that still scrub | `scene settle\|pour\|flock\|steer`, `dur maxSteps seed`, scene params | none; keyframes every 0.5 s, resim <= 240 steps | p2d | medium | 2 | patterns/physics/card.md |
| layers | frozen layer + spotlight / iris / wipe / comets windows | `mode spot\|iris\|wipe\|comets`, `cols rows targets radius soft veil dur` | none (technique: freeze to p5.Image, `erase()`) | p2d | medium | fetch | patterns/layers/card.md |
| transitions | cut, dissolve, wipe, iris, push, match cut, zoom-through, ledger turn | `seq:[{s:scene,d,tr:{k,d,ease,ang,soft,mode,cx,cy,dir}}]`, `anchor`, `hud:false` | none (copy technique: two layers + composite) | p2d | medium | ALL | patterns/transitions/card.md |
| fields | ambient noise-loop backdrops: streamlines, gridwave, drift, breath | `variant`, `period amp`; per-variant `fs swirl dsep`, `spacing waveLen`, `count trail`, `tick swell` | none | p2d | cheap; drift 45 ms at t=6 | ALL | patterns/fields/card.md |
| rhythm | beat grid from `tempo.beat_s`, easing set, emphasis, caption cadence | `mode scene\|easing\|emphasis`, `beat_s lo hi` | `patterns.rhythm.lib` {snap,grid,EASES,easeFor,EMPH,cadence,planScene} | p2d | cheap | ALL | patterns/rhythm/card.md |
| palette | OKLCH ramps and seeded role sampler from a pack | `brand chips jitter`; needs `ctx.tokens` | `ARSENAL.palette` {ramp,brandRamps,sample,contrast} | p2d | cheap | ALL | patterns/palette/card.md |
| webgl-scene | 3D boxes, keyed cameras, pinned labels, extruded headline | `mode iso\|fly\|headline`, `proj ortho\|persp`, `cols rows cell gap street hmin hmax sweep headline extrude`, `ctx.fonts` from `load(p)` | none unpatched. Patch via CUT: `api:{buildHeadline,headline3d,p5lights,mkCam,project,pathAt,smooth,lerp,clamp}` (simpsons-3d/c) | webgl | heavy: 0.5-0.7 s | 3 (throws on other ids) | patterns/webgl-scene/card.md |
| structures-demo | draws structures.js layouts (thousand, tree60, timeline24, scatter-rows) | `mode n groups names world` | none; a reference drawing of layouts, copy its fillRect loops | p2d | medium | 4 | patterns/structures-demo/card.md |
| timeline (demo) | one scene re-timed three ways | `rhythm slow\|fast\|stagger`, `dots bars fade` | none; use core/timeline instead | p2d | medium | 4 | patterns/timeline/card.md |
| materials-demo | the six drawn materials on one scene | `material` | none; use materials/drawn | p2d | medium | none | patterns/materials-demo/card.md |
| explorable | slider/chip explorer, not a film (own instance, DOM, ignores t) | `vals` | none; do not chain | p2d | medium | 4 | patterns/explorable/card.md |

Facts the table cannot hold. (1) Unpatched exports: morph-type has none, webgl-scene has none (it has `load(p)` only), shader exposes
`shaders`; both simpsons-3d drafts that chained them added an export in `lib/assemble.py` CUTS or one line in the copy (section 3).
(2) Fonts: `loadFont` rejects WOFF2; morph-type, particles-text and any WEBGL text need TTF data URLs, from `window.ARSENAL_FONTS`
(arsenal/fonts/fonts.js, alias `MORPH_FONTS`) or kit2 `fonts3d`. Keys: Big Shoulders Display|600, IBM Plex Mono|400, Jost|600,
Red Hat Mono|400, Sofia Sans Extra Condensed|700, Space Mono|400. No Fraunces: a Fraunces numeral needs a fontTools subset to TTF
(draft B: `headline-font.js`, 3.9 KB). (3) Exec level (Q6): ink material, no post, no grain; shader, neon and webgl are `manager`.
(4) SEATS: no gate row reads material or texture, so `--material chalk` passes G10 while breaching Q6; you hold that line.

---

## 2. Recipes by visual job

Knob names are suggestions except those in R3 and R8 (shipped in simpsons-3d b/c). Each recipe: **chain** (draw order) / **adds** / **knobs** (name them in film.json `knobs` + `knobs_doc`; knobs never carry an on-screen number, those are claims) /
**pitfalls** / **fallback** (cheapest chain that still reads). Use `K.knob(name, default)` once at load.

**R1 count a population.** Chain: structures.grid (pile: structures.scatter) -> structures.wall / ring / columns -> [mass for N >= 3,000] -> committed-number reveal.
Adds: one mark per unit at true scale; `transition(A,B,u,{stagger,arc})` carries the SAME marks between layouts by index; `highlight(L,pred)` flags the subset.
Knobs: `markShrink`, `stagger`, `arc`, `tArrive`, `arriveDur`, `tSort`, `groupGap`, `hlRole`. N itself is a claim, never a knob.
Pitfalls: marks below 7 units are illegible: read `fit().legible` and `group`, state any batching factor as a claim; scatter can overlap 1-2 pairs (lower `shrink`);
mass is empty at t=0 and its guess/actual readout under 14 units carries a result, so keep it after the commit; ring counts per ring are even, not full;
wall bin count follows the largest legible pitch; use arrays of mark indices as groups to keep identity across a transition.
Fallback: structures.grid + one `fillRect` loop per colour (what structures-demo does); for 10k+, `mass` impl `canvas2d` (18 ms at 10k, 48 at 50k); never `shape` (4 s at 50k).

**R2 compare two groups.** Chain: structures.columns/rows (two groups, same pitch) -> data-marks dumbbell | bars | waffle -> annotations (`dim`, `bracket`, `callout`).
Adds: columns share a pitch so heights are counts; data-marks gives declared zero, count-up labels and 1D label shoving; annotations derive "gap N" from data.
Knobs: `colGap`, `groupGap`, `hlGroup`, `markRole`, `tCount`, `lineW`, `dimOffset`.
Pitfalls: `bars()` and `line({area})` THROW on a truncated scale (use dumbbell or line with the drawn break); race rows need final gaps > 6 units to separate;
soft-rank width `w=6` is in value units; annotation anchors are static (rebuild if the target moves); labels >= 14 units, move `at` rather than shrink.
Fallback: structures.columns + `K.tx` count labels, no data-marks.

**R3 reveal a reversal (same data, new view).** Chain (2D): structures.columns pooled -> structures.transition -> structures.rows/columns split by sub-group -> annotations
(rings on the flipped pairs) -> morph-type (headline number per view). Chain (3D): webgl-scene `api.mkCam/pathAt/project` boxes -> keyed camera front -> side -> morph-type on a P2D
layer -> shader neon header on the reveal frames only.
Adds: the SAME boxes re-arranged, so the viewer sees one dataset twice; camera.sample keys the move (draft A remapped channels: x az, y el, zoom log, fx fy fw look point).
Knobs: `camFrontAz/El/Dist`, `camSideAz/El/Dist`, `tDollyStart/End`, `pairStep`, `splitStagger`, `liftArc`, `slabGap`, `headSize`, `morphDur`, `neonGain`, `neonRadius`, `neonThr`.
Pitfalls (seen): occlusion hides the near group in the side view (draft A: women in front of men), so print the rate on a label, not only in the box height; "a pure
change of viewpoint" is impossible with a pooled front and a split side, so boxes re-arrange during the turn: say so in a caption; ortho vs persp changes apparent height
(webgl-scene pins ignore occlusion); neon frames cost 1.3-2 s; draft B's neon gain was far more sensitive than its code says (0.015 of gain lifted lit boxes 25 levels; keep `neonStrength` <= 1.5); pooled stacks of
slabs show stripes, not one lit base.
Fallback: 2D only: columns -> transition -> rows + data-marks slope; headline via particles-text `#N` or a timeline-driven count with `K.tx`.

**R4 show a structure or graph.** Chain: structures.tree | ring | timeline -> reveal `network` paths (edges draw on) -> glyphs-iso nodes -> annotations callout. Matrix form: maps-matrices `adjacency`.
Adds: tidy-tree layout with `edges`; reveal draws edges by arc length with node lights on landing; matrix-graph turns rows into nodes.
Knobs: `treeDepthStagger`, `edgeStagger`, `edgeDur`, `nodeRole`, `lineW`, `n` (adjacency 9..15, multiple of 3).
Pitfalls: adjacency n > ~30 drops below 7 units; reveal `back` ease overshoot clamps to a flat; taper and very short dashes multiply draw calls; do not close a partial spline;
glyphs-iso painter sort is x+y+z only (free-standing items overlap); keep several `REV.setup` states, one per path group.
Fallback: structures.tree + straight edge lines faded by `timeline` tracks.

**R5 a sequence in time.** Chain: core/timeline (beats = film.json chapters) -> structures.timeline -> camera `timeline` scene (constant px/s pan) -> rhythm.cadence (caption words/s).
Adds: one compiled timeline for every channel (wiring: 20 channels, 11 scenes, 1 `tl.compile()`); `scene()` windows give local time + cross-fade; camera pans labels pinned in screen space.
Knobs: `tBeat*` (beat times), `fade`, `panSpeed`, `kenburns`, `labelMin`, `eventSize`.
Pitfalls: ease on a keyframe governs the segment leaving it; overlapping plays on one key -> latest wins; draw captions after the scene alpha is restored; slow tempo coarsens snapping
(half-beat 2.5 s at beat 5); never text inside the world transform (reset, then pin with `worldToScreen`).
Fallback: core/timeline alone with `K.seg` scenes; no camera.

**R6 a flow or field.** Chain: fields (backdrop) -> glyphs-iso `flowArrow` / reveal dashed paths -> generator packet relay | physics flock.
Adds: seeded loops that stay pure (period 6 s); dashes march by arc length; the generator authors "packet goes A to B to C" as prose.
Knobs: `fieldAmp`, `period`, `dsep`, `swirl`, `count`, `trail`, `dashSpeed`, `hopS`.
Pitfalls: field at full amplitude behind small text (use `breath`, amp <= 1); `drift` cost grows with t (45 ms at 6 s; count <= 600; `driftFs` <= 0.003); `breath` and `drift` were
invisible on ceti-dark before the alpha gain, check a light pack; the field carries no claim, so no number sits on it.
Fallback: reveal dashed polyline + glyphs-iso `flowArrow`, no field.

**R7 a number that becomes another number.** Chain: morph-type `ticker` | `words` -> [particles-text `#N` for a count that assembles into its numeral] -> handwriting arithmetic for the derivation.
Adds: digit outlines morph (odometer carry); particles are the counted things and read N only once the numeral forms; handwriting shows "a / b = c" step by step.
Knobs: `headSize`, `morphDur`, `morphLead`, `hlStagger`, `hlEase`, `countS`, `n` (particles), `penSpeed`, `wobble`.
Pitfalls: fonts as TTF (section 1); unpatched morph-type has no export, so either run it on a p5.Graphics via its own setup/draw with a Proxy that no-ops `text` and a token set with
transparent bg (draft C), or add the one-line `P.kit` (draft B) and drive `buildPlan/paint` yourself; stray contours when letter counts differ ("QUERY" -> "KEY");
faux-bold (labelled SIMULATED); mono-dots mid-morph is a blob; numerals are painted pixels, invisible to G5c/G7 (the gate reads SVG and captions): also state the digits in a caption.
Fallback: a timeline track counting up, drawn with `K.tx` (SVG, gate-visible), no outlines.

**R8 a 3D scene with a camera move.** Chain: kit2 `renderer: webgl` + `fonts3d` -> own baked geometry or webgl-scene `api` -> camera.api.sample (keyed az/el/log-zoom) -> SVG pins via `K.tx` -> [morph-type P2D layer composited as image] -> [shader neon, reveal only].
Adds: `buildGeometry` once in setup (draft C: 4,526 boxes in one geometry, per-box data in uv/vertex colour, role-lit vertex shader); one role-fed Lambert shader; extruded numeral via `textToModel`.
Knobs: `turn0`, `turn1`, `arr0`, `turnDeg`, `cell`, `boxSize`, `boxGap`, `zoom0/1`, `elev0/1`, `idleDeg`, `headSize`, `neonGain`. 32-52 knobs shipped.
Pitfalls: p5 lights are 10-50x slower per fragment on software GL (5-30 s/frame): use one custom shader, p5 lights only on the headline; `buildGeometry` overflows beyond ~8k quads in a
spread (bake in chunks of 4,000; draft C's single 4.5k-box bake worked); under a framebuffer camera `p.worldToScreen` is mirrored in y (draft A used its own ortho projection);
`text()` in WEBGL needs a loaded face and a maxWidth; token faces are not used in webgl-scene (Barlow stand-in); fly-through brushes a wall mid-flight (retime or widen `street`);
colour set per `model()` by uniform, so bake without fill; slerp moves position only, re-apply zoom/fov; level is `manager`, material `ink` only.
Fallback: webgl-scene `iso-sorted` ortho with `p5lights:false`, or no GL at all: glyphs-iso `iso.box` painter sort (<= a few hundred boxes) + camera (2D) zoom.

**R9 a map or matrix.** Chain: maps-matrices (`confusion` | `heatmap` | `territory` | `adjacency`) -> camera `grid` (zoom into one cell) | transitions `zoom` -> annotations.
Adds: counts before colour (numeral and legend first), OKLCH ramp from the accent, marks that carry meaning besides colour.
Knobs: `classes`, `n`, `bins`, `regions`, `sea`, `markPitch`, `zoomTarget`, `tZoom`.
Pitfalls: fewer than ~8 cells use a table, more than ~2,000 use mass; `noise()` is read only in setup after `noiseSeed`; light packs flip the ramp; with `regions` > 5 steps get close, rely
on letters; square cells show gaps; the coastline is noise, not geography; zoom magnifies A about 7x so keep its strokes simple.
Fallback: structures.grid with fill roles from `ARSENAL.palette.ramp`.

**R10 annotate or hand-write over evidence.** Chain: (the evidence layer) -> annotations (`annos`, `underlay`, `obstacles`) -> handwriting (`ops`, layout annotation) -> layers `spot` (dim all but one window).
Adds: marks anchored in world space, drawn on by length, retracted label-first; a hand writing a derivation over a typeset foil (`type` op); spotlight through a contour hole.
Knobs: `annoT0/T1` per mark, `inDur`, `outDur`, `lineW`, `wobble`, `dim`, `penSpeed`, `slant`, `spotRadius`, `veil`.
Pitfalls: anchors are static; labels >= 14 units on a panel pill (pass `TOKA` with chalk = paper so pins read); handwriting has 25 glyphs (`i n o x t` only), time is fitted (more ops = faster
strokes, set `fit:false`); `circle`/`underline` cap-height assumes 0.7 em; spotlight hole depends on contour winding; layers needs `pixelDensity` set per layer and pristine role colours.
Fallback: reveal arrow + `K.tx` label; skip the hand.

**R11 a texture or material change.** Chain: kit2 `--material ink|pencil|stitch|chalk|marker|blueprint` (p2d marks) -> [layers freeze] -> [shader post, manager only].
Adds: same geometry, different hand; shader gives neon / halftone / riso / chalk over the whole frame as one filter.
Knobs: `material` (build flag, not a film knob), `neonGain`, `neonRadius`, `halftoneCell`, `reg`, `grain`, `post on/off` window.
Pitfalls: exec level forbids anything but ink; shader costs 1.9-2.5 s/frame, runs on 4 packs only, and the 12 px caption is unreadable in neon/halftone; chalk and marker add many alpha
strokes (not thousands of bars); blueprint's blue is the one non-token colour; keep post to the reveal window; webgl films cannot take `--material` other than ink.
Fallback: ink plus the pack's own `texture` (paper/none).

**R12 a text block that morphs.** Chain: grid-type `fit(text, box)` (size + line breaks on the scale) -> morph-type `words` | `weight` -> particles-text `word-chain`.
Adds: type fitted on the baseline grid first, then outlines morph between fitted words; particles break a word apart and re-form it.
Knobs: `ratio`, `base`, `template`, `holdS`, `morphS`, `stagger`, `lift`, `wFrac`, `trackFrom/To`, `n`.
Pitfalls: 2-8 characters read well, particles fail past ~12 at N 2,000, thin faces look lacy under 1,500 particles; `fit` ignores ink bounds; floors are 960-basis (28 caption is 11 css px at 390);
setup is async: set up every variant before seeking; weight is simulated (no variable font vendored).
Fallback: grid-type.fit + two SVG captions cross-faded by a timeline track.

**R13 a system that grows (generator).** Chain: core/generator `scene(function*)` -> glyphs-iso `system` nodes -> reveal links -> structures.ring | tree layout.
Adds: prose authoring (`yield* tween`, `yield* all(...)`, loops) compiled once to intervals; `at(t)` is a binary search.
Knobs: `hopS`, `n` nodes, `layout`, `stagger`, `author`-level timings as `K.knob`s read before compile.
Pitfalls: yields pace authoring only, the cursor is the clock; declare every animated prop in `init`; two parallel branches must not tween one prop; no Date/Math.random inside the scene;
t=0 is empty by design; the demo inlines one pack (SWEEP), so pass your own `TOK`; compile in `setup`, never in `render`.
Fallback: core/timeline `.stagger(n, gap, fn)`, same result without generators.

**R14 a physical settle.** Chain: physics (`settle` | `pour` | `flock` | `steer`, baked in setup) -> counters that rise on first contact -> annotations at rest.
Adds: real springs/drops that seek in O(1) + partial resim; `pour` lets a count rise as marks land; `settle` prints max error against the closed form.
Knobs: `zeta`, `omega`, `restitution`, `rate`, `spread`, `n`, `arriveR`, `dur`.
Pitfalls: integrate with the step index, not wall time; labels at settle t=0 overlap the counter; pour bin counts under 14 units carry a result; `dur` <= 60 s and n ~ 1e4 is too much
memory; physics inlines 2 packs (SWEEP); coupled systems have no closed form.
Fallback: structures.transition with `out`/`back` ease from timeline, a spring-looking move with no sim.

**R15 a spotlight on a dense field.** Chain: layers (`spot` | `iris` | `wipe`) over a frozen 1,000-mark field -> annotations -> data-marks readout.
Adds: static layer drawn once, frozen to p5.Image, stamped each frame; reveal by `erase()` or a destination-out mask; live in-window count.
Knobs: `radius`, `soft`, `veil`, `irisEnd`, `sweepX/Y`, `edge`, `slant`, `hold`.
Pitfalls: not for feedback/smear (does not scrub); `erase()` ignores `image()` and `background()`; p5 colour objects are mutable (`setAlpha` on a shared role colour broke purity); frozen layers need
tokens (build on first draw, rebuild on brand change); Graphics canvases join the DOM, hosts must read the first canvas.
Fallback: draw the field live (it is only ~1,000 fillRects) and a clipped circle.

**R16 cut between scenes.** Chain: core/timeline `scene()` windows -> transitions technique (two layers + composite) | plain cross-fade.
Adds: eight transitions as functions of u; match cut keeps one shape fixed; zoom-through uses log-space zoom into a grid cell.
Knobs: `trD`, `trEase`, `wipeAng`, `soft`, `irisCx/Cy`, `anchorR`, `hud:false`.
Pitfalls: never leave a number to be read mid-transition (commit before it starts); the turn needs full-bleed grounds; scenes must not draw the anchor; HUD strip y 506-540; `drawImage` sources are in
canvas pixels (multiply by density).
Fallback: `scene(...)` cross-fade only (`fade: 0.5`), which wiring used for all 10 cuts.

---

### Pitfalls met in films (not visible from the demos)
- **reveal**: `draw` calls `p.background(T.color.bg)` and wipes everything drawn before it in the frame. Pass a token copy
  whose `color.bg` is `rgba(0,0,0,0)` (wiring film.src.js does this) or draw reveal first.
- **data-marks**: `bars()` prints the value digits on the canvas at 12 px with its own `globalAlpha 0.95`, so the digits
  are not SVG claims (G5c) and the module ignores your fade. Pass `fmt: () => ''` and an rgba ink for fades; draw the
  numbers yourself with `K.tx` (roled) from claims.
- **morph-type / webgl-scene / shader**: export nothing for chaining as shipped; add a one-line export in your lib copy
  (or a CUT in assemble.py) and record it in NOTES.md.
- **structures**: pure layout; it does not draw. Pair it with `K.ctx` marks or a material's `mark()`.
- **Any module under a chrome**: the kit scales the film box (ledger 0.784, memo 0.885); module pixel constants (label
  sizes, gaps) shrink with it. Prefer sheet-relative sizes or raise them when the look names a chrome.

## 3. Assembly

kit2 inlines only `film.js`, `film.json`, `claims.json` and (optionally) `libs`. Two ways to get arsenal code onto the page.

**A. lib/ copy + assemble.py (default for 2D films; wiring and simpsons-3d drafts B and C).** Layout: `lib/<module>.js` verbatim copies, `lib/film.src.js` (the film, edit this),
`lib/assemble.py` (writes `../film.js`, GENERATED, never edit). Copy `factory/films/wiring-and-the-whole/lib/assemble.py` and change only `MODS` and `CUTS`.
Copy map: `core/timeline.js`, `structures/structures.js`, `patterns/<id>/pattern.js` -> `lib/<id>.js`, `materials/shader/pattern.js` -> `lib/shader.js`.

    MODS = ["timeline.js", "structures.js", "reveal.js", "camera.js"]          # order = dependency order, film.src.js is appended last
    CUTS = {                                                                    # per module: [(start_regex, end_regex_or_None[, replacement])]
      "camera.js": [(r"^  const SCENES = \{\};", r"^  const P_ = \{"),           # drop demo scenes (end anchor is NOT cut)
                    (r"^  const P_ = \{", r"^  window\.ARSENAL\.patterns\.camera = P_;",
                     "  const P_ = { id: 'camera', api: { sample, worldToScreen, screenToWorld, toCuts, EASE } };")],
    }
    parts = ["/* <film> · film.js is GENERATED by lib/assemble.py; edit lib/film.src.js. Modules: ... */",
             "window.ARSENAL = window.ARSENAL || {}; ['patterns','structures','materials','brands','core'].forEach(function (k) { window.ARSENAL[k] = window.ARSENAL[k] || {}; });"]
    for m in MODS: parts.append("/* ── lib/%s sha256 %s%s ── */\n" % (m, sha16, " (cut)" if cut else "") + strip(cut(src, CUTS.get(m, []))))
    parts.append(open("film.src.js").read())          # written to ../film.js

`strip()` removes comments and indentation (a string/regex-aware scanner; copy it as is). The sha256 header proves each copy is verbatim; if you must edit a copy, make it ONE line,
mark it `// [film/draft] the ONLY edit to this copy: <why>` (draft B's `P.kit`), and prefer a CUTS replacement instead (draft C's webgl-scene `api`, shader `shaders`).
CUTS used so far: annotations drops `SCENES` -> `DEFAULTS`; glyphs-iso drops `ISO` (breaks `ARSENAL.iso`, keep it if you draw iso boxes) and the demo `PAT`, keeping `ARSENAL.glyphs`;
camera keeps `api` only; reveal drops `LAYOUTS` -> `DEFAULTS` (then every call needs `paths`); webgl-scene drops demo keys, 1,000-box field, labels, keeping `buildHeadline`, `mkCam`, `project`.
`node --check film.js` and gate G1/G3 prove the remainder parses and is clock-free. Run assemble before build: `python3 <film>/lib/assemble.py && python3 factory/kit2/build.py <film> --brand ... --chrome none`.

film.src.js shape (header comment, then one IIFE):

    (function () { 'use strict';
    const F = window.FILM, P = F.params, A = window.ARSENAL;
    const TLM = A.core.timeline, S = A.structures, REV = A.patterns.reveal, CAM = A.patterns.camera.api, GL = A.glyphs, ANN = A.patterns.annotations;
    const tl = TLM.timeline().init({...}); tl.beat('hook').play(...)...; const TL = tl.compile(); const SC = {hook: TLM.scene(0, 9.2, null, {fade: .5}), ...};
    let PILE, TOK, REVW;                                    // built once in setup, never in render
    window.FILM_RENDER = {
      async setup(p, K) { TOK = {...from K.C, K.FONT}; PILE = S.scatter(P.n, box, F.seed); REVW = REV.setup(p, {seed: F.seed}, {paths, dur, ease}); },
      render(t, s, K) { /* pure of t and s.answer; REV.draw(p, localT, REVW, null, TOK) ... */ },
    }; })();

Seeds: `F.seed` (film.json) only; one `S.mulberry32(F.seed)` per use. Claims: every on-screen digit is `P.<name>` from film.json params / claims.json, never a literal.

**B. kit2 `libs` (draft A; webgl films with small film.js).** film.json `"libs": ["lib/camera.js", "arsenal/patterns/webgl-scene/pattern.js"]` (film dir first, then repo root); no assemble.py,
no CUTS, no strip: files go in as-is, in order, before film.js. Use when one or two modules are needed unchanged or a draft writes its own 3D lib. Costs: unstripped comments and demo blocks add to the page;
lib bytes do NOT count toward G8 film code (film.js + film.json + claims.json) but do count toward the 1.3 MB page; G3 clock-scans libs. Patches cannot be made by CUTS here: copy the module into lib/ and edit one line.

---

## 4. Costs and limits

| budget | limit | measured | what pushes it |
|---|---|---|---|
| page | < 1.3 MB (G8; build.py WARNs) | wiring 1,265,027 B (NOTES.md says 1,256,849: rebuilt since); simpsons-3d shipped 1,269,544 B; drafts 1,251,776 / 1,269,458 | p5 + embedded WOFF2 faces dominate (5 faces in draft C); `fonts3d` TTF data URLs (43 KB per face, 4 KB with `{"key","text"}` subset); unstripped `libs`; a second brand face. Leaves ~35-50 KB of headroom: do not add a face late |
| film code | film.js + film.json + claims.json < 120 KB (G8) | wiring film.js 95.6 KB (6 modules, 122.6 KB raw + film.src.js 38.5 KB, cut and stripped); simpsons 44-80 KB | raw module sizes: annotations 34.8 KB, maps-matrices 31.6, data-marks 29.5, handwriting 22.4, glyphs-iso 22.4, transitions 22.7, rhythm 22.4, physics 21.6, grid-type 20, morph-type 19.2, camera 18.9, particles-text 17.7, structures 17, mass 16.4, reveal 14.6, timeline 15, webgl-scene 15.1, shader 13. Cut demo blocks; 6 modules + a 38 KB film is the practical ceiling |
| time | mean < 1.5 s/frame (frames.mjs, SwiftShader 1920x1080) | simpsons-3d 0.21 s (final), drafts 0.42-0.66 s; neon/extruded reveal frames 1.3-2 s | any p5 lit shader, webgl-scene (0.5-0.7 s), shader post (1.9-2.5 s), mass webgl (0.1-0.2 s), full-canvas `createGraphics` texture per frame (0.8 s), filter on every frame instead of the reveal window |
| 2D per frame | harness ms (table 1) | 2D chains stay under 0.05 s | layers 28, physics 22, timeline chart 23, drift 45 at t=6, transitions 13 (ledger turn dearest: 44 strips), chalk/marker with thousands of bars |
| setup | seconds, outside the frame budget | morph-type/particles-text < 1 s, mass webgl bake 0.1-1.5 s, physics flock 0.1 s | async font decode; `buildGeometry` bake; contour pairing |
| purity | G2a/G2b identical at 3 times | every lane `identical` (README, SEATS) | carrying history (feedback, particles in `drift` carry it inside a fixed re-sim), `Math.random`, `Date`, `performance`, shared `noise()` state read in draw |
| duration | case 60-75 s, feature 90-120 s (G format), 3 s brand card | wiring 112 s + card | physics keyframe memory beyond ~60 s |

Cap the chain: one lead module per beat (the thing the viewer reads), at most two supporting modules, one backdrop; every module past six is a code-budget decision. Cheapest first: structures + timeline +
reveal + annotations is the 2D spine that shipped 112 s at 95 KB; add glyphs-iso, camera, morph-type only when a beat needs them; reach for webgl only when depth is the claim, and then choose `manager`.
