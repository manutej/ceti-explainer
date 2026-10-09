# factory/kit2 · the case kit with brand, chrome and material injected

kit2 is factory/kit with three variables pulled out of kit.js. The drawing API is the same, so a film.js
written for kit runs unchanged (PROOF.md: 2 films × 4 brands × 4 chromes, 32 of 32 gate PASS, zero film edits).
factory/kit is untouched and the shipped films still build against it.

    python3 factory/kit2/build.py <film-dir> [--brand ID|film] [--chrome ID|none] [--material ID] [--out PATH]
    # film.json may carry "level": "exec" (default) | "manager" | "engineer" (DECISIONS Q6; gate row G10)
    # optional film.json: "renderer": "webgl", "fonts3d", "libs", "knobs" + "knobs_doc", "look" {brand, chrome,
    # material} (the flag defaults; apply_findings.py records it). A pack face may be italic-only (style honoured).
    # -> <film-dir>/build/<id>.<brand>.<chrome>[.<material>].html, prints bytes, sha256, faces, role contrast

| file | role |
|------|------|
| kit2.js | window.KIT: kit's API, plus role resolver, chrome facade + adapters, material proxy, ground |
| player.js | kit's player; the commit overlay follows `K.commitGeom`; try-it pane guarded |
| shell.html | kit's shell; CSS variables generated from the pack; `<meta name="kit2" content="brand=… chrome=… material=…">` |
| build.py | assembles the page; byte-reproducible (same inputs, same bytes) |
| probe.mjs | kit's probe with the SHIP defect 4 fixes |
| materials/basic.js | fallback ink + pencil, used only when arsenal/materials/drawn/materials.js is absent |
| proof/ | matrix.py (the proof), stills.mjs, contact sheets, gate JSON per cell, results.json |

## The injection contract

The page carries `window.KIT2 = {brand: <pack object>, chrome: '<id>', material: '<id>'}` (written by
build.py before the chrome and material scripts and kit2.js). Script order: p5, FILM, KIT2, chrome module,
material module, kit2.js, film.js, player.js. Optional switches on the same object: `metrics: false` (no
display-face compensation), `window: false` (chrome drawn over the content box), `guard: false` (no
off-role text lift).

**Brand.** A pack per arsenal/brands/schema.json. Every colour the kit draws is a role from `resolveRoles`;
`K.C` keeps kit's key names so film.js reads the same names:

| K.C key | from the pack | used for |
|---|---|---|
| paper | color.bg | the ground |
| ink | color.ink | marks and type |
| accent / soft | color.accent / color.accent2 | emphasis / second voice |
| muted, line, panel | color.muted, color.line (alpha composited over bg), color.panel | secondary text, hairlines, surfaces |
| chalk | color.panel | the surface ink reads on: stamp face, commit-box wash, ledger highlight |
| dark | color.card if present; light ground: darker of panel/ink; dark ground: darker of panel/bg | question card, brand card, roll |
| onDark | first of bg, panel, chalk, ink, white at ≥ 7:1 on dark, else the best | card and brand-card type |

Faces: `type.disp`, `type.mono`, `type.body` (kit's `fam: 'sans'` = body). Each `{family, weight}` must be
in vendor/fonts.lock.json (build.py refuses otherwise, and checks every file's sha256). build.py also embeds
disp 600, mono 500/700 and body 600 when the lock has them, because films and chromes ask for those weights.
The default weight of an unweighted `tx` is the pack's weight for that role.
Fields read: `id, color.{bg, ink, accent, accent2, muted, line, panel, chalk, card?}, type.{disp, mono,
body}.{family, weight}, texture, voice.end_card`. Not read yet: `name, tempo, voice.register, ramps, weights`.
`--brand film` (the default) builds a pack from film.json `palette/type/fonts`, with `card` = palette.dark,
so a film keeps its own look.

**Chrome.** Any module registered as `globalThis.CETI_CHROMES[id]` with the factory/chromes interface
(`frame(kit, t, ch, opts)`, `card(kit, t, c)`, `brand(kit, t, t0, takeaway)`, `ground(p, seed)`,
`with(overrides)`, `layout.cap`). build.py looks in factory/kit2/chromes/<id>.js, then factory/chromes/<id>.js.
kit2 calls `chrome.with({palette: {bg, ink, accent, muted, line, panel: dark, chalk: onDark}, type: {disp,
mono, serif: disp, sans: body}})`, so the chrome is drawn in the brand. `none` draws no furniture; cards and
the brand card then use kit2's plain ones.
- `K.chrome(t, chapter, opts)` (the kit call films already make) maps the kit's sheet options
  (`ledger.rows`, `block.{title, lines, slot}`) to the chrome's own with `chrome.fromKit(opts, t, ch)` if
  the module defines it, else kit2's adapter for tender-set, ledger and memo, else a pass-through.
- The chrome draws through a facade kit: every chrome text gets a `data-role` (chrome/field layer →
  `chrome`; cap → `must-read`; card/top → `must-read` at ≥ 28 units, else `secondary`); stamps → `secondary`.
- Content box: a chrome may expose `contentBox(brandPack, mode)` → `{x0, y0, x1, y1, align}` (960 basis). kit2
  asks for mode `'kit'` (a film authored on kit's sheet; `'native'` = `layout.safe` for a film drawn against the
  chrome) and lays the film's box (content plus commit column, x 40–938, y 96–410) inside it with one uniform
  scale `s = min(1, box / film box)`: fit, never crop, never enlarge; flush left/top for `align: 'start'`, else
  centred. The SVG layers `marks` and `labels` get `translate(ox oy) scale(s)`, the canvas the same matrix for
  `FILM_RENDER.render`, `K.commitGeom` the mapped geometry (the player's overlay). Captions, cards, roll, brand
  card and chrome stay on the 960 sheet. Film text keeps the floors: rendered size = max(min(size, floor),
  size·s), floor 28/14/12 by the authored size. Boxes: tender-set = the film box (identity), memo 48–924 ×
  166–444 start (s 0.885; RE:, TO/FROM/DATE/FILE and the head stay whole), ledger 120–824 × 128–448 centred
  (s 0.784; TALLY/PARTICULARS/AUDIT heads, margin and AUDIT slot stay whole). `KIT2.box: false` turns it off.
- Window: furniture in the chrome and field layers is cut out of the (mapped) film boxes (content, and the
  commit box during the COMMIT chapter): straight rules are split around it, any other element that would
  intersect it is not drawn. Pure: a function of t.
- Captions are drawn by kit2 in the chrome's `layout.cap` geometry and face (`chrome.capFam`, else
  tender-set mono, ledger disp, memo body).
- Ground: pack `texture: 'paper'` with a chrome → the chrome's own stock, re-coloured; otherwise a flat bg
  (plus kit's paper blotch when `paper` and chrome `none`), then the material's texture.

**Level and axes.** film.json `level` (`exec` default, `manager`, `engineer`; build.py refuses anything else). At
`exec` a pack texture other than `none`/`paper` (neon-lab's `grain`) is drawn flat and the drop is recorded; the
material is never overridden (`--material chalk` on an exec film builds, build.py prints a note, the gate FAILs
it). kit2 publishes `K.AXES = {brand, chrome, material, texture (as rendered), texture_declared, level, box}`;
player.js exposes it as `window.__film.info.axes`; the shell's `<meta name="kit2">` carries brand, chrome,
material, texture and level. Gate row G10 reads them (factory/tools/README.md). `KIT2.levelGuard: false` keeps
the declared texture (then G10 FAILs an exec page with grain).

**Material.** Any module in `ARSENAL.materials[id]` with the arsenal/materials/drawn interface
`mark(p, kind, x, y, w, h, state, tokens)` and `texture(p, box, tokens)`. build.py loads
arsenal/materials/drawn/materials.js when it exists (ink, pencil, stitch, chalk, marker, blueprint), else
materials/basic.js. For any material but `ink`, `K.ctx` is a proxy of the p5 Canvas2D context: `fillRect` →
`mark('bar')`, `strokeRect` → `mark('rect')`. The colour the film set becomes its pack role when it is one,
else role `ink` on a token copy carrying that colour; its alpha becomes `state.a`; the seed is an integer
hash of the geometry, so re-seeks are identical. `K.pencil` → `mark('line')`. `texture()` runs once over the
ground. Materials get the pack's own roles (chalk = text on panel).

## Renderer webgl (film.json `"renderer": "webgl"`)

kit2 creates the film canvas with `p.createCanvas(960, 540, p.WEBGL)`, pixelDensity 2, the same 960 x 540 basis.
The SVG layers (captions, commit box, chrome, cards, brand card, eyebrows, every `data-role` text) still draw on top
in screen space, so G5/G6/G7 read them as before. Material must be `ink` (build.py refuses another: the drawn
materials are Canvas2D marks); `K.ctx` is null, `K.pencil` is a no-op. Proof: `smoke-webgl/` (gate PASS, below).

- **Coordinates.** WEBGL origin is the centre. `K.cam0` is p5's default camera: at z = 0 one unit = one sheet unit.
  `K.world(x, y, z)` maps sheet units (origin top-left) to it: `[x - 480, y - 270, z]`. `K.flat(fn)` draws in sheet
  units (default camera, identity, depth cleared, origin top-left, the chrome's content-box map applied) and leaves
  `K.cam0` active. To pin SVG text to a 3D point: `const v = p.worldToScreen(p.createVector(x, y, z))` while your
  camera is set; `v.x, v.y` are sheet units; draw with `K.tx(...)` (role it).
- **Each frame** kit2 does: `setCamera(K.cam0)`, `resetMatrix()`, `resetShader()`, `noLights()`, `background(paper)`,
  depth cleared, ground image when the ground is not flat (texture paper/grain), then `FILM_RENDER.render(t, s, K)`
  inside push/pop, then the SVG. A film sets its own camera every frame (keyed on t), never relies on the last frame.
- **Setup** may be `async setup(p, K)` (awaited): bake geometry (`buildGeometry`), shaders (`createShader`,
  `createFilterShader`), framebuffers (`createFramebuffer`; a camera used inside `fb.begin()` must be
  `fb.createCamera()`, a main-canvas camera draws the scene upside down), `textToModel` headlines.
- **3D fonts.** WEBGL text and `textToModel` need a loaded TTF. film.json `"fonts3d": ["Big Shoulders Display|600"]`
  or `[{"key": "...|600", "text": "0123456789,%"}]` (subset with fontTools to those glyphs: 4 KB instead of 43 KB).
  Keys are those in arsenal/fonts/fonts.js: Big Shoulders Display|600, IBM Plex Mono|400, Sofia Sans Extra
  Condensed|700, Space Mono|400, Jost|600, Red Hat Mono|400 (no Fraunces: ceti-boardwalk's display face has no 3D
  cut; use one of these for extruded type). `K.fonts3d[key]` is the p5.Font; `K.font3d('disp')` returns the pack's
  role face if loaded, else the first loaded face.
- **Post.** A post pass is the film's: draw into `fb`, `p.image(fb, -480, -270, 960, 540)` under `K.cam0`, then
  `p.filter(shader)` (smoke-webgl does a 12-tap neon). Software GL cost: about 0.4 s/frame plain, 1.6 s on the
  filter frames (SwiftShader, 1920 x 1080 backing); keep the filter to the reveal window.
- **Purity / gate.** preserveDrawingBuffer is on (p5 2.3.4 default; kit2 re-sets it if the context says otherwise;
  `K.glAttrs` records it), and the kit draws synchronously inside `__film.seek`, so G2a's `canvas.toDataURL()` reads
  the frame just drawn. p5's hidden WEBGL text canvas is parked outside the stage (`#kit-park`): the stage holds one
  canvas, `K.canvas`. `window.__film.info.axes.renderer` and `info.renderer` are `'webgl'`; the meta tag carries
  `renderer=webgl`.
- **libs.** film.json `"libs": ["lib/scene.js"]` inlines scripts (film dir first, then the repo root, e.g.
  `arsenal/patterns/webgl-scene/pattern.js`) between kit2.js and film.js; the gate's G3 scans them like film.js.

## Knobs (film.json `knobs` + `knobs_doc`; the evaluator's only numeric lever)

Every number an evaluator may tune is a knob. film.json:

    "knobs": { "camSwing": 0.8, "neonGain": 1.0, "look": "ortho" },
    "knobs_doc": [
      { "name": "camSwing", "range": [0, 1], "step": 0.05, "what": "camera swing front to side (1 = quarter turn)" },
      { "name": "neonGain", "range": [0, 2], "step": 0.1,  "what": "neon glow on the reveal frame (0 = off)" },
      { "name": "look", "options": ["ortho", "persp"], "what": "projection of the department view" }
    ]

Rules (build.py refuses otherwise): every knob has exactly one knobs_doc entry with `what` and either `range: [lo, hi]`
(numbers) or `options: [...]`; every value is inside its range / options; no undocumented knobs. film.js reads
`K.knob(name, fallback)` (the film.json value, clamped to the documented range; an option outside `options` falls
back), or `K.knobs[name]` (frozen object), once at load (`const KN = { camSwing: window.KIT.knob('camSwing', 0.8) }`)
or per frame; never hard-codes a tunable, never writes a knob. Timings an evaluator may move are knobs too (seconds).
Knobs never carry an on-screen number (those are claims). `window.__film.info.knobs` = `[{name, value, range |
options, step, what}]`, `info.knobs_doc` = the table. factory/tools/apply_findings.py changes knobs only inside it.

## Kit defects fixed (factory/SHIP.md)

1. `data-role` on every kit text: `tx` takes `o.role`; captions and commit title/value `must-read`, commit
   prompt and every stamp `secondary`, countdown `chrome`, chrome furniture by layer. Stamp text never
   sets under 14 units. Film text without a role stays untagged (the gate classes it as before).
2. Countdown digit tagged `data-role="chrome" data-kit="countdown"`. The film-mode default is shown whole
   after A + 1.2 s (no partial "10" while "100" types); goodhart's G5c list lost that item.
3. One claims shape: the bare array is canonical. build.py accepts the object form and prints a note.
4. probe.mjs: no try-it panel is reported, not thrown; the typed answer comes from the commit range.
5. The commit overlay is placed on the box the film drew (`K.commitGeom`), not the default position.

## For the gate (defects 6 to 9 live in factory/tools/gate.mjs; not edited here)

6. `--kit` with a directory throws EISDIR in `clockScan`. Fix: if `fs.statSync(k).isDirectory()`, push every
   `*.js` in it (player-named files keep their allowance); else on a bad path print the usage line. Until
   then pass files: `--kit factory/kit2/kit2.js --kit factory/kit2/player.js --kit
   arsenal/materials/drawn/materials.js --kit factory/chromes/<id>.js`.
7. G5c should skip text whose nearest `data-role` is `chrome` (kit2 tags the countdown and all chrome so)
   and accept a number strictly between 0 and a claimed value on the same element key (running counters).
8. G5c's number regex should take repeated thousands groups: `\d{1,3}(?:,\d{3})+`.
9. Wrap the browser rows in try/finally and always write `--json` with `pass: false` and the error.
Also seen: G5a's 200 ms `vm` timeout fails a claim when 6 gates run in parallel; 1 s would be safer.

## Migration from kit (one command)

    python3 factory/kit2/build.py factory/films/<id>            # brand from film.json, tender-set chrome, ink

The film folder is not touched except build/<id>.film.tender-set.html. The look is the film's own palette
and faces on the tender-set chrome module (1.5 to 2.9 % of pixels differ from the kit build: the module's
title block and caption sit a few units lower than kit's built-in sheet). A new look is a flag:
`--brand ceti-dark --chrome ledger --material pencil`. Gate it with the `--kit` files listed under defect 6.

## What still binds a film to a look

- Coordinates. Films draw at fixed positions on kit's sheet (`GX = 48`, `RX = 56`, `CX = 482`, commit box
  700,150). kit2 now scales that whole film box into the chrome's `contentBox` (memo ×0.885, ledger ×0.784), so
  the chrome keeps its furniture; but text held at its floor grows relative to the scaled geometry (a 14-unit
  label in the ledger is 1.28× its authored proportion), and a film cannot use the memo's margin headline or the
  ledger's ruled rows. A film that wants a chrome's own layout reads `K.CHROME.layout` (new films).
- Display-face metrics. Positions assume Big Shoulders' advance; wider faces are set smaller (measured
  ratio, floors 28/14/12). At the floors a wide face can still collide; none did in the 32 cells.
- Colours in film data. survivorship's `you: #2D5DA8` is a hex, not a role: kit2 lifts its text to 4.5:1,
  but its canvas squares keep the hex (2.9:1 on ceti-dark).
- Material reach. Only canvas `fillRect`/`strokeRect` and `K.pencil` go through the material. Canvas paths
  (survivorship's hole dots: `arc` + `fill`) and every SVG mark (`ln/rc/path`) stay ink.
- Tempo and motion. `tempo.ease/beat_s` are not read: films hand-time with `seg/ease`.
- Chrome text. Chromes hard-code the CETI wordmark and their caption face is chosen per chrome id
  (`capFam`); `voice.end_card` reaches only the plain brand card (chrome `none`).
- Texture. `halftone` is not drawn by any ground; `grain` comes only from the material's texture.
