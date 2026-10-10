# kit2 contract · what a film folder must carry and what the kit gives film.js

Sources: factory/kit2/{README.md,kit2.js,build.py,player.js}, factory/tools/gate.mjs, factory/FORMAT.md.
A film is a folder `factory/films/<id>/` with `film.json`, `film.js`, `claims.json` (+ optional `lib/*.js`).
kit2 owns time, the SVG layers, captions, commit box, cards, brand card, chrome, ground. The film owns the canvas.

## 1. Build

    python3 factory/kit2/build.py factory/films/<id> [--brand ID|film] [--chrome ID|none] [--material ID] [--out PATH]
    node factory/tools/gate.mjs factory/films/<id>/build/<page>.html --film factory/films/<id> \
         --kit factory/kit2/kit2.js --kit factory/kit2/player.js [--json out.json] [--shots dir] [--quick]

- Output (default): `<film-dir>/build/<id>.<brandId>.<chromeId>.html`, plus `.<material>` when the material is not
  `ink`. `--brand film` gives brandId `film`. `--out` relative paths resolve against the film dir.
- Flag defaults: `film.json look {brand, chrome, material}`, else `film`, `tender-set`, `ink`. Flags win over `look`.
- `--brand` = `arsenal/brands/<ID>.json` or a path to a `.json` pack (needs `id, color{bg,ink,accent,muted},
  type{disp,mono}`); `film` synthesises a pack from film.json `palette`/`type`/`fonts` (card = palette.dark).
- `--chrome` = `factory/kit2/chromes/<ID>.js`, else `factory/chromes/<ID>.js`; `none` = no furniture (plain cards).
- Byte-reproducible: same inputs, same bytes. Prints bytes, sha256, faces, contrast of ink/muted/accent on paper.
- build.py REFUSES (exit with message): film.json missing any of `id title eyebrow lede dur commit chapters captions
  brand sources honest`; commit lacking `at`, `prompt`, `default`; brand lacking `takeaway`; missing claims.json;
  `level` not exec|manager|engineer; `renderer` not 2d|webgl; webgl with `--material` other than ink; knobs/knobs_doc
  that do not match (section 3); unknown brand/chrome/material id; a pack face absent from vendor/fonts.lock.json or
  whose sha256 differs; `fonts3d` key not in arsenal/fonts/fonts.js; `libs` path not found; a script containing
  `</script`. It only WARNS: page > 1.3 MB, film code > 120 KB, ink/muted/accent under 4.5:1, exec + non-ink material
  (the gate then FAILs G10), exec + grain/halftone pack (drawn flat, G10 WARN), object-form claims.json (array is canonical).
- Script order in the page: p5 2.3.4 (vendored), FILM (film.json), KIT2 (brand, chrome id, material id), chrome module,
  material module, [KIT2_FONTS3D], kit2.js, libs (in order), film.js, player.js. No runtime fetch, no Google Fonts.

## 2. film.json, field by field (G = read by the gate; K = read by kit2/player; B = build.py requirement)

| field | type | notes |
|---|---|---|
| id | string | B. Names the page. Gate prints it. |
| title, eyebrow, lede | string | B. Page head only (shell/player); eyebrow also feeds the memo chrome's FROM. Not drawn on the film canvas. |
| format | "case" \| "feature" \| "smoke" | G (G4a). Default case: material 60-75 s, total <= 78. feature: 90-120 / 123. smoke: 5-20 / 25 (infrastructure tests only, never shipped). |
| level | "exec" \| "manager" \| "engineer" | G (G10), K. Default exec (ink, texture none/paper only). Drafts that use webgl/neon declare `manager`. |
| renderer | "2d" \| "webgl" | K. Default 2d. webgl: section 6. Published as `info.renderer`, `axes.renderer`, meta tag. |
| look | {brand, chrome, material} | build flag defaults; apply_findings.py records it (brand/chrome findings only change this). |
| dur | number (s) | B, G, K. Total length INCLUDING the brand card. 75 for a case (72 s material + 3 s card). |
| seed | integer | K. `K.SEED` (default 23); p5 `noiseSeed(seed)` set before setup and again after. Use it for every shuffle. |
| palette, type, fonts | objects/list | only for `--brand film`. palette keys paper ink accent muted chalk dark soft (panel optional); type {disp, mono, sans?}; fonts [{family, weight}] = exactly the faces embedded. |
| params | object | G5a: scope of claim formulas (wins over claim ids and count numbers). Put every raw datum the film draws here. |
| commit | {at, prompt, default, title?, unit?, min?, max?, step?} | B needs at/prompt/default. G4c: `at` in 8-16 s. `default` is the film-mode guess (K.state.answer). title = box heading (default "YOUR NUMBER"), unit = line under it, min/max/step bound the live input (step < 1 keeps decimals). The live page pauses at `at` for an 8 s box; no answer = "none". Nothing numeric from the answer before `at`. |
| count | {at, ...numbers} | G7 + G5a. `at` = second the count structure is first drawn; no %, "N in M", "N out of M" before it (SVG text or caption). Numeric fields join the claim-formula scope. |
| chapters | [{id, beat, t0, t1, eyebrow, title, card?, device?}] | G4b/G4c/G7/G9, K (player markers, K.chrome title, K.chapterAt). Beats HOOK, COMMIT, CASE, COUNT, MONDAY in this order, t0 ascending; the gate reads `beat`, else `id`/`name`/`title`. `card:true` counts toward the G9 limit of 2. |
| cards | [{id, t0, t1, q[], sub?, subAt?, fadeOut?, label?}] | K (K.card, K.cardAt) and G9. Full-screen question cards; at most 2 in the whole film (chapters card:true + cards). |
| captions | [[t0, t1, "text"], ...] | G5b (every number must be a claim value or a claim `renders` string), G7, K. kit2 draws them, 28 units, 2 lines max, in the chrome's caption geometry. <= 60 chars (apply_findings limit). Silent film: captions carry it. `window.NOCAP` hides them. |
| brand | brand {takeaway, at?, dur?} | B needs takeaway. G4a: material = dur - brand.dur, else dur - brand.at, else dur - 3. `brand.at` default dur - 3. kit2 freezes the film at `at - 0.001` and draws the card from `at`. G4d: takeaway non-empty and frame at dur-1 not blank. |
| sources | [[key, "citation"], ...] | G4f needs >= 3. Keys are what claims.json `source` cites. Shown on the live page. |
| honest | string \| string[] | B, G4e (non-empty). One honest-limits line is the law. Shown on the live page. |
| tryit | {title, note, seek, inputs[{id,label,min,max,step,value,unit}]} | optional live-page panel; needs `FILM_RENDER.tryit(values, state, K) -> HTML`. Values land in `state.try`. |
| fonts3d | ["Family\|wt" \| {key, text}] | K (webgl). Keys exist in arsenal/fonts/fonts.js: Big Shoulders Display\|600, IBM Plex Mono\|400, Sofia Sans Extra Condensed\|700, Space Mono\|400, Jost\|600, Red Hat Mono\|400. `text` subsets the TTF to those glyphs (+ space): 4 KB, not 43 KB. |
| libs | ["lib/x.js", ...] | B inlines in order between kit2.js and film.js (film dir first, then repo root, e.g. `arsenal/patterns/webgl-scene/pattern.js`). G3 scans them like film.js. Counts toward the built page size (G8), not film code. |
| knobs, knobs_doc | object, list | B enforces, K reads, apply_findings.py edits only here. See knob-catalogue.md. |
| claims.json | array (or {film, claims}) | B requires it; G5. Fields in factory/tools/README.md: id, text, value, formula?, tolerance?, source?, renders?, appears_at?. |

Size: film.js + film.json + claims.json < 120 KB, page < 1.3 MB (G8). A webgl film with fonts3d and libs sat at 1.270 MB.

## 3. film.js contract

    window.FILM_RENDER = {
      setup(p, K),            // optional, may be async (webgl); runs once after the canvas exists
      render(t, state, K),    // required; called with t in [0, dur - 0.001 at the brand card]
      ground: false,          // optional: no kit ground image
      brand: false,           // optional: film draws its own brand card (no auto card at brand.at)
      captions: false,        // optional: film draws its own captions
      tryit(values, state, K) // optional, see tryit
    };

- `render` is a pure function of `(t, state)`; the player and the gate may call it at any t in any order. `state` =
  `K.state` = `{answer, try?}`; `answer` is a number, `'none'`, or null (film mode: `commit.default`). `state` is
  the only input besides t, K and constants built in `setup`.
- Every frame kit2 clears the canvas, draws the ground, calls `render` inside save/restore (2d: with the content-box
  matrix), then draws captions, the brand card (if `t >= brand.at`), then `endFrame()` prunes the SVG pool.
- Hidden SVG elements are cleared (attributes and text) by `endFrame`; key every element with a stable string key.

### Purity rules (G2a/G2b compare canvas bytes and SVG innerHTML after re-seeks and A->B vs B->A)
Not allowed in film.js, libs, kit files (G3 scan, comments blanked): `Math.random`, `Date`, `performance.now`,
`frameCount`, `millis()`, `requestAnimationFrame`, `deltaTime`, `p.random`/`p.randomGaussian`. (Only files named
`*player*` may use rAF/Date/performance.now.) Also forbidden by law, not by scan: reading a previous frame's state,
mutating `K.knobs`, caching per-frame results in closures that change with call order, `p.noise` without the fixed
`noiseSeed`, accumulating counters, lazy init inside `render`. Why: seeking must equal playing; the evaluator scrubs
and the gate re-seeks. Allowed: `K.mulberry32(seed)`/`K.shuffle(arr, seed)` re-created each call or at setup, a table
baked in `setup`, `p.noise` after `noiseSeed`. In webgl, set the camera from t every frame; never rely on the last one.

## 4. K API (window.KIT, passed to setup/render)

| helper | signature | purpose |
|---|---|---|
| K.FILM, K.DUR, K.W, K.H, K.SEED, K.FILM_MODE | const | film.json, dur, 960, 540, seed, `?film=1` |
| K.C | {paper ink accent soft muted line panel chalk dark onDark} | brand roles (hex). Use these, never literals; chalk = surface ink reads on; dark/onDark = card ground/type |
| K.FONT | {mono, disp, sans} | CSS font-family strings for the pack's roles (sans = body) |
| K.LAYOUT | {W,H,content,ledger,block,slot,cap} | kit's 960 sheet: content 48,104-664,400; cap y 480 size 28 |
| K.clamp, K.seg, K.ease, K.eout, K.lerp | (x,a,b) (t,a,b) (u) (u) (a,b,u) | seg = clamped 0-1 ramp between two times; ease = cubic in-out; eout = cubic out |
| K.typed | (s, t, t0, cps=40) | typewriter prefix |
| K.fmtK | (n) | en-US thousands separators |
| K.mulberry32, K.shuffle | (seed) -> rng; (arr, seed) -> copy | the only randomness |
| K.PhiInv | (p) | inverse normal CDF |
| K.wrap | (s, maxW, size, fam='mono') -> lines | deterministic wrap from average advances (no DOM measuring) |
| K.rgba, K.hexRgb | (role\|hex, a) -> css; (hex) -> [r,g,b] | colour helpers |
| K.contrast, K.resolveRoles, K.ADV | (a,b) WCAG ratio; pack -> roles; advances per em | role tooling |
| K.E | (key, tag, layer, attrs, text) | retained SVG element. Layers: field, marks, labels, chrome, cap, card, top |
| K.tx | (key, layer, x, y, s, o) | text. o: fam mono\|disp\|sans, size, anchor, fill, op, ls, weight, rot, tr, **role** must-read\|secondary\|chrome, kit |
| K.ln / K.rc / K.path | (key, layer, x1,y1,x2,y2, o) / (key, layer, x,y,w,h, o) / (key, layer, d, o) | SVG line (o.stroke,w,dash,op) / rect (fill,fo,stroke,w,rx,tr) / path |
| K.dim | (key, layer, x1, x2, y, label, op, o) | dimension line with arrows and label |
| K.stamp | (key, layer, cx, cy, s, text, o) | rotated stamp; text >= 14 units; role secondary |
| K.chrome | (t, chapter, opts) | draw the chrome furniture. opts: `ledger{rows:[[t,text]..]}`, `block{title, lines, slot}`, `marks`. No-op for chrome none |
| K.caption | (t, o) | kit2 calls it; films do not (unless `captions:false`) |
| K.card | (t, c) | question card from film.cards entry |
| K.roll | (t, t0, dur=0.5, key) | sheet unrolls over the dark role (top layer) |
| K.brandCard | (t, t0, line) | auto-drawn; film calls it only with `brand:false` |
| K.commitBox | (t, state, o) -> {op, sealed} | draws the commit box; o: at, x=700, y=150, w=230, h=150, title, prompt, seal, out. Publishes K.commitGeom |
| K.answerStr, K.answered | (state) | "__" / an em dash for none / the digits; typeof answer number |
| K.makeGround, K.ground | (p, seed) | ground graphic (flat bg, paper, chrome stock, material texture) |
| K.pencil | (x1,y1,x2,y2,u,seed,o) | straightedge stroke through the material (2d only; no-op in webgl) |
| K.chapterAt, K.cardAt, K.capAt, K.brandAt | (t) | film.json lookups |
| K.knob, K.knobs, K.knobs_doc | (name, fallback) -> value clamped to range/options; frozen object; doc list | section 7 |
| K.p, K.ctx | p5 instance; Canvas2D context (a material proxy unless ink; null in webgl) | draw with these |
| K.RENDERER, K.GL | '2d'\|'webgl'; bool | |
| K.world, K.flat, K.font3d, K.cam0, K.gl, K.canvas, K.fonts3d, K.glAttrs | webgl only | section 6 |
| K.AXES, K.KIT2, K.BRAND, K.ROLES, K.CHROME, K.MATERIAL | what was injected | `AXES = {brand, chrome, material, texture, texture_declared, level, renderer, box}` |
| K.t, K.mount, K.render, K.ready, K.poolSize, K.svg, K.commitGeom, K.state | internals | do not call mount/render from film.js |

Layer order, bottom to top: canvas, SVG layers field, marks, labels, chrome, cap, card, top. `marks` and `labels`
carry the content-box transform; cap, card, top, chrome stay on the 960 sheet.

## 5. Canvas vs SVG split, coordinates (2d)

- Sheet: 960 x 540 design units, origin top-left, y down. Canvas is 960 x 540 at pixelDensity 2 (1920 x 1080 in film
  mode). `render` draws in sheet units with `K.ctx`/`K.p`; kit2 has already set the transform.
- Canvas (film draws): mass and texture - bars, squares, dots, fills, wall of marks, pencil lines. Only `fillRect`,
  `strokeRect` and `K.pencil` pass through a non-ink material; arcs/paths stay ink.
- SVG (kit draws, film asks): everything with words or digits (`K.tx` with a role), rules and rects that must stay
  crisp, the commit box (`K.commitBox`), captions, cards, roll, brand card, chrome. Every digit on screen is SVG text
  or a claim-backed canvas figure; the gate (G5c, G6) only reads SVG text, so results belong in SVG, tagged.
- Legibility by role: must-read (headline numbers, the count, captions, commit box) >= 28 units; secondary
  (labels) >= 14; chrome (eyebrows, ledgers, axis ticks) >= 12 and never a result. Always pass `role`.
- Content box: the kit-authored film box is x 40-938, y 96-410 (content 48-664 x 104-400, commit column 700-930).
  A chrome with `contentBox` rescales it (memo 0.885, ledger 0.784); `chrome none` and `tender-set` are identity.
  Text keeps floors under scaling. A film written against `K.CHROME.layout` ignores the map (`KIT2.box:false`).
- Display-face compensation shrinks `fam:'disp'` text in a wider pack face (never under 28/14/12 floors).
- Colours: use K.C roles. Off-role text fills are mixed toward ink to reach 4.5:1; canvas hexes are not.

## 6. Coordinates and rules for renderer webgl

- Canvas `p.createCanvas(960, 540, p.WEBGL)`, pixelDensity 2; origin at the CENTRE, y down, `K.cam0` = default camera
  (at z=0 one unit = one sheet unit). `K.world(x, y, z=0)` -> `[x-480, y-270, z]`. `K.flat(fn)` runs `fn(p)` in sheet
  units (default camera, identity, depth cleared, origin top-left, content-box map applied) and leaves cam0 active.
- Pin SVG text to a 3D point: with your camera set, `const v = p.worldToScreen(p.createVector(x,y,z))`; `v.x, v.y`
  are sheet units; draw with `K.tx(..., {role})`.
- Per frame kit2 does `setCamera(cam0), resetMatrix, resetShader, noLights, background(paper), clear depth`, ground
  image if the ground is not flat, then `render` in push/pop, then the SVG. Set your camera from t every frame.
- `setup` may be `async`: `buildGeometry`, `createShader`, `createFilterShader`, `createFramebuffer` (a camera inside
  `fb.begin()` must be `fb.createCamera()`), `textToModel`. Material must be ink; `K.ctx` is null; `K.pencil` no-op.
- 3D text needs fonts3d; `K.fonts3d['Family|wt']` is the p5.Font; `K.font3d('disp'|'mono'|key)` falls back to any loaded.
- Post: draw into a framebuffer, `p.image(fb, -480, -270, 960, 540)` under cam0, then `p.filter(shader)`. Software GL
  costs ~0.4 s/frame, 1.6 s on filter frames: keep the filter inside the reveal window (a knob).
- preserveDrawingBuffer is on so the gate's `toDataURL` reads the frame just drawn; the stage holds exactly one canvas.

## 7. Knobs (brief; full catalogue in knob-catalogue.md)

`"knobs": {name: value}` plus `"knobs_doc": [{name, range:[lo,hi] | options:[...], step?, what}]`. build.py refuses a
knob without a doc entry, a doc entry without a value, a value outside range/options, a missing `what`, a bad range.
film.js: `const KN = {x: K.knob('x', fallback)}` once at load, or `K.knobs.x` per frame; never write a knob. A knob
never carries an on-screen number (those are claims). `window.__film.info.knobs = [{name, value, range|options, step, what}]`.

## 8. Hooks (what the gate and evaluators drive)

- `?film=1`: bare 1920 x 1080 stage (class `film` on body), `K.render(0)` after mount, no player UI.
- `window.__film = {ready(), seek(t), only(groups), info}`: `ready()` awaits mount and fonts and renders; `seek(t)`
  renders synchronously and returns `{t, error}`; `only(['figure'|'ground'|'svg'|'bg'])` hides layers for isolation
  shots; `info = {id, title, dur, chapters, cards, captions, commit, brand{at,takeaway}, axes, renderer, knobs,
  knobs_doc}`.
- `window.__ctrl = {play, pause, seek, duration, state, setState(o)}`; `setState({answer: 4})` re-renders at the
  current t. Live mode pauses at `commit.at` and opens the HTML input over `K.commitGeom`.
- Gate stage selector: `#stage`, `.ex-stage-frame` or `[data-stage]`. Errors land in `window.__error`.
