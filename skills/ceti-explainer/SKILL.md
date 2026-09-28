---
name: ceti-explainer
description: >-
  Build a gold-standard animated technical explainer: one moving SVG diagram that
  builds a complex concept step by step with real numbers, in a video-like player
  (scrub, captions, chapters, keyboard) on a deterministic clock so every frame is
  reproducible. Output is a single self-contained HTML file that works offline. Use
  when the user wants to explain how something works as a smooth, followable
  animation — ML/AI internals (attention, embeddings, RAG, MCP), systems and
  protocols (TCP, OAuth), algorithms, data structures, or any interconnected
  technical flow. Triggers: animated explainer, explainer video, explain X
  visually, show how X works step by step, animated diagram of X. Two formats:
  the ~40s 8-beat episode (default) and the ~2-min 7-movement feature cut
  (LONGFORM.md) — for video requests, lay audiences, or broad topics. Not for
  marketing pages, scroll-driven essays, slide decks, or static posters.
---

# CETI Animated Explainer

**Course occupancy (E0).** When the brief is a short-course *film*
(2-minute lecture, optional 5-minute seam test) rather than a
deterministic SVG episode, occupy Tailor/Commit of `noether-harness`.
`ceti-research` proposes the atlas. Command: `/sheaf-run course`.
See **`COURSE-E0.md`**. Persist every generated asset immediately.

**Two formats.** This file specifies the **short episode** (8 beats, ~40s, anchor + working zone + detail band) — the default for one tight mechanism. For a **feature cut** (~1:50–2:15, seven movements, scene archetypes A1–A7, brand-assembly bookends, speed chips, resume) read **`LONGFORM.md`** — choose it when the brief says *video*, *two minutes*, a lay audience, or a topic too broad for one anchor. The deterministic contract below (one clock, build-once, seg-not-pulse, paused == playing, token roles only) binds both formats.

You are building one episode: a single animated diagram that teaches one technical idea by **building it on screen over ~40 seconds**, the way the gold-standard `reference/self-attention.js` teaches attention. The goal is not the math for its own sake — it is **a complex, interconnected flow made effortless to follow** through smooth, paced, reproducible animation.

> Read this top to bottom once. Then read `reference/self-attention.js` in full — it is the bar. Then build.

**Typed contract.** `META-PROMPT.md` is this file as a functor: typed slots, the brief→module map, every rule paired with the program that checks it, and the edit-script refinement loop. Author a brief (`briefs/brief.schema.json`), gate it (`assets/brief-gate.mjs`), scaffold the module (`assets/scaffold.mjs`), then follow the build procedure below.

---

## What you produce

A **single self-contained `.html` file** (no external JS, opens straight from disk) containing: the hero (eyebrow / italic title / lede), the player (stage + caption band + transport + scrub + chapter rail + keyboard), the closing synthesis, and a dependency-free Tweaks panel. You write **one file** — the content module — and run a build script that inlines everything else.

```
You write:   briefs/<ep-id>.brief.json  ← the typed brief (mechanism · worked example · 8 beats · aha · Φ)
Gate:        node assets/brief-gate.mjs briefs/<ep-id>.brief.json   ←  must print PASS
Scaffold:    node assets/scaffold.mjs briefs/<ep-id>.brief.json -o <ep-id>.js
You author:  <ep-id>.js            ← DATA (DERIVED) · anchor · scenes · render
Verify:      node assets/gate.mjs <ep-id>.js                ←  must print PASS
Build:       python3 assets/build.py <ep-id>.js "<Title>" [--preset ceti|owala|ceti-course]
```

Everything else — the clock, scrub, captions, chapters, keyboard, persistence, Tweaks, all styling — is inherited from `assets/engine.js` + the shell. **Do not reimplement them.**

---

## Method — decide before you draw

Treat this like a design director, not a coder reaching for SVG. Resolve these on paper first; they determine everything downstream:

1. **Audience & purpose** — who's watching and what's the ONE thing they leave knowing? That's beat 8.
2. **Critique the obvious version** — the naive take on this topic (a static labelled diagram, a wall of formulae) and why it fails. Your job is the version that *moves to teach*.
3. **Archetype** — which row of the catalog below fits (derivation / process / code / state / transformation / comparison)? This fixes your anchor and your motion.
4. **The anchor** — the single element that persists across all 8 beats. Continuity is the pedagogy.
5. **The worked example** — the concrete instance with real, derivable artifacts (numbers, payloads, trace). The spine of the diagram.
6. **The 8-beat arc** — each beat adds exactly one idea; name the focal motion of each.
7. **Hierarchy & motion** — one focal animation per beat; what fades as what arrives. (Palette, type, spacing are already fixed by the theme — don't reinvent them.)

Then build, and **render-validate every step** (gate + snapshots). Don't accumulate unseen frames.

## Build procedure

1. **Get the content brief.** You need: the *mechanism* (how it actually works), a *worked example with real numbers*, the *8 beats*, and the *aha* (the one-line payoff). If the user hasn't supplied one, write it first (see "The content brief" below) and make the numbers real — look them up if unsure. The diagram is only as good as the brief.
2. **Copy the template.** `cp assets/_episode-template.js <ep-id>.js`.
3. **DATA** — implement the math. Derive every on-screen number in code (compute the softmax / average / score; never hand-type a derived value). Lock one fully-worked example.
4. **BEATS** — transcribe the 8 labels + captions; tune `dur` so the total is 35–45s.
5. **BUILD** — lay out the anchor, the working-zone scenes, and the math lower-third. Create every node once; start everything at opacity 0.
6. **RENDER** — gate each element on its beat window with `ex.ramp` / `ex.win` / `ex.pulse`. Gate the lower-third by `flags.math`. One scene visible at a time.
7. **AUDIT** — fill in `window.__AUDIT()` to recompute and assert the worked figures.
8. **Gate** — `node assets/gate.mjs <ep-id>.js`. Every assertion must PASS. Fix and re-run until it does.
9. **Build** — `python3 assets/build.py <ep-id>.js "<Title>"`. Open the HTML to spot-check.

---

## The non-negotiables

### MUST
- **One deterministic clock.** The episode is a pure function of time `t`. `render(t)` must reconstruct the exact frame for any `t`. This is what makes scrub / replay / reduced-motion correct for free.
- **Build once, mutate forever.** Create all SVG nodes in `build()`; in `render()` only set attributes / opacity / transform. Never create or destroy nodes in `render()`.
- **Reuse `engine.js` unchanged.** Write only a content module.
- **Exactly 8 beats**, total ~35–45s. Beat 1 introduces the anchor; beat 8 is titled exactly **"Why it matters"** and lands the aha.
- **Real, consistent artifacts, derived in code.** Whatever the detail band shows — numbers, a payload, a trace, a count — derive it in code so it can't contradict itself. One example worked in full. (For math: compute the softmax; for a protocol: `JSON.stringify` the real message; for a process: the real counts.)
- **Paused frame == playing frame.** Because `render(t)` is pure, pausing just lets you stare at instant `t` — so any frame a viewer can scrub to must be clean. **No two scenes half-lit in the same region.** For same-region cross-fades use **`ex.seg`**, never `ex.pulse` (pulse spills its fades outside the window, so adjacent scenes double-expose into mush). Expose your scene groups via `window.__REGIONS` so the gate proves it.
- **No two visible blocks overlap.** Make every top-level block one `<g>` and list them in **`window.__LAYOUT`**; the gate (§15d) computes real bounding boxes every frame and fails the build on any collision. See "Preventing overlaps" — this is non-negotiable.
- **Label every illustration.** Each scene carries a short mono eyebrow saying what it is; numbers/axes/strips are labelled. No unlabelled abstract shapes.
- **Token roles only** (`var(--ex-*)`, the three `--font-*`). No raw hex inside the diagram — that's what lets any brand re-skin it.
- **Canvas is 1000 × 464**, with a persistent anchor + a detail band gated by `setMath`/`setDetail`.
- **End the module with `window.EXPLAINER = <module>;`**

### MUST NOT
- ❌ No `setTimeout` / `setInterval` / CSS-keyframe sequencing to drive the animation. The clock is the only driver.
- ❌ No scroll-, IntersectionObserver-, or hover-triggered animation state.
- ❌ No new colors or gradients (beyond the ground wash), no emoji, no AI-slop.
- ❌ No hype words ("unlock", "supercharge", "revolutionize", "powerful", "seamless", "game-changing").
- ❌ No SVG text below 11px.
- ❌ No `ex.pulse` for two scenes that share a region — use `ex.seg`.
- ❌ Don't introduce brand-new layout in the final beat — reuse the anchor you already built (see "The last beat" below).
- ❌ Don't fake the chrome with raw HTML — the shell already provides it.

---

## Architecture

```
assets/engine.js        the reusable clock + player wiring   (DO NOT EDIT)
assets/ceti-tokens.css  colors, type, spacing                (inlined at build)
assets/ceti-motion.css  the warm ease vocabulary             (inlined at build)
assets/shell.template.html  the self-contained shell + vanilla Tweaks
<ep-id>.js              YOUR content module
```

### Content-module API (exact)
```js
window.EXPLAINER = {
  meta: { id, eyebrow, title, lede, synthTitle, tag, synthesis },
  beats: [ { id, label, dur, caption }, … ],   // engine adds .start/.end/.index
  build(stage, opts),   // opts = { beats(computed), duration, ex }. Create nodes once.
  render(t, ctx),       // ctx = { t, duration, beats, activeBeat, ex }. Pure mutation.
  setMath(on),          // toggle the detail band (Tweaks hook; alias: setDetail)
};
// strongly recommended — the gate uses these:
window.__AUDIT  = () => ({ ok: true/false, msg, note });    // consistency invariant
window.__REGIONS = () => ({ working: [g,…], detail: [g,…] }); // shared-region scene groups
```
In `build`, capture computed beats: `opts.beats.forEach(b => D.beats[b.id] = b)`.
`__REGIONS` returns, per shared region, the array of scene `<g>` nodes whose opacity you drive — the gate sweeps every frame and fails if more than one is lit at once.

### The `ex` toolkit (`window.CetiExplainer`)
```
ex.ease     { glaser, warmIn, defer, collect, rest, linear }   — CETI eases only
ex.clamp(v,a=0,b=1)         ex.lerp(a,b,t)
ex.win(t, start, end, ease?)        0→1 progress across a window
ex.ramp(t, start, dur, ease?)       0→1 over `dur` seconds from `start`
ex.pulse(t, a, b, fade=0.35)        ~1 inside [a,b], fades at both edges (LONE element only)
ex.seg(t, a, b, fade=0.4)           fades CONTAINED in-window — same-region cross-fades
ex.fit(textNode, maxWidth, min=9)   shrink an SVG <text> to fit maxWidth (call in build)
ex.fmt(seconds)             ex.cubicBezier(x1,y1,x2,y2)
```
Patterns:
```js
const B = D.beats;
setO(D.node, ex.ramp(t, B.b2.start + 0.3, 0.5));               // fade a thing in
// Same region, consecutive scenes → ex.seg (fades stay INSIDE the window, so
// scenes hand off through a brief empty gap; never two half-lit = no mush):
setO(D.sceneA, ex.seg(t, B.b3.start + 0.2, B.b4.end, 0.4) * detailOn);
setO(D.sceneB, ex.seg(t, B.b5.start + 0.2, B.b6.end, 0.4) * detailOn);
// ex.pulse is only for a lone element with empty space around it, never for
// two scenes competing for the same region.
```

---

## Visual grammar (the look that makes it land)

- **viewBox `0 0 1000 464`.** Three horizontal zones, always:
  - **Anchor (top, y≈34–200):** the element that *persists* across every beat — the token row, the document set, the request packet. Continuity is the pedagogy; the viewer never loses the thread.
  - **Working zone (middle):** scenes that **cross-fade** via `ex.pulse`. Only ONE scene visible at a time. This is where the current step happens.
  - **Lower-third (y≈300–460):** the worked arithmetic / formula. Gate its opacity by `flags.math`.
- **Show the mechanism as motion**, not as a static labeled picture: a value *flows* into a cell; a bar *grows* from a score; a number *morphs* from raw → scaled → percentage; the winning element *brightens* while the rest *dim*. Motion carries meaning — never decorative.
- **One focal animation per beat.** Max ~3 focal points. Secondaries fade; they never compete. Whitespace ≥ ~30%.

### Preventing overlaps — the general solution (READ THIS)
Overlapping text/diagram blocks are the #1 failure mode in diagrammatic animation. Don't fix them one-by-one — make them structurally impossible and **machine-enforced**. Three layers, all required:

**1 — Prevent by construction.**
- **Three zones, fixed y-bands.** Every block lives in exactly one:

  | Zone | y-band | holds |
  |------|--------|-------|
  | Anchor | ~34–124 | the one persistent element (token row / shelf / host+server graph) |
  | Working | ~130–292 | the current scene — ONE visible at a time, cross-faded with `ex.seg` |
  | Detail | ~300–456 | the worked math / payload / trace, gated by `flags.math` |

- **One block = one `<g>`.** A "block" is anything that shouldn't be overlapped by another: a panel, a scene, an anchor item (pill/chip), the traveling packet. Put its content *inside* that group; nesting is fine, siblings colliding is not.
- **A persistent anchor must clear every scene it coexists with.** If an anchor device (e.g. a query pill) would sit where a later panel renders, **fade it out as that panel arrives** (the gold standard fades its "QUERY" tag at the softmax beat) — don't park it in the gap between zones. Don't restate the same content in two visible places.
- **Auto-fit / wrap text** so it never exceeds its box: wrap every variable or long `<text>` in `ex.fit(node, maxWidth)`. Never place something at `x = chars × pixels` (font-specific); read `node.getComputedTextLength()` at render time instead (guarded for the gate).
- **Reserve a lane for moving elements.** A mover (packet, dot) travels inside a corridor inset from any box by at least its half-width + margin, so it can never land on a box at the ends of its path.

**2 — Enforce automatically (these gate checks must PASS — overlaps can't ship):**
- **`window.__LAYOUT = () => [block, …]`** — list every top-level block. The gate's **§15d** computes each block's *real* bounding box (walking `<g>` translates + opacity) on every frame and **fails the build if two visible blocks overlap**. This is the durable fix: a regression is caught, not eyeballed.
- **`window.__REGIONS = () => ({region:[scene,…]})`** + **`ex.seg`** — gate **§15b** fails if >1 scene is lit per region at any instant (paused-frame mush).
- **`ex.fit`** + tag width (**§15a**) — text can't overflow its box or ellipsize.

**3 — Verify font-accurately (when a browser is available).** Run the browser overlap auditor (`reference/audit-overlaps.js`, see HANDOFF) — it uses real `getBBox()` so it catches font-metric collisions between *any* elements, not just declared blocks. Use it after any font/brand change.

**If the gate flags an overlap (§15d):** re-place the block, **fade one of the two out** as the other arrives, or move it to a different zone. Then re-gate. Never ship an overlap.
- **Type:** mono (`var(--font-mono)`) for numbers, ids, eyebrows; sans for words; ≥ 11px. The H1 is Fraunces italic (handled by the shell).
- **One saturated accent per scene** (copper by default). Use sage / slate / peach for secondary actors, sparingly.

### Tokens (reference roles, never raw hex)
```
--ex-ground #0E1014   --ex-panel #171B23   --ex-cell #1C212B
--ex-ink #F5EFE3      --ex-dim #A39A89      --ex-line rgba(245,239,227,.13)
--ex-accent #CE9A6A (copper, lead)   --ex-accent-fill / --ex-accent-glow
--ex-accent2 #8FA985 (sage)   --ex-support #6E8CA8 (slate)   --ex-peach #D88B5C
```
Fonts: **Fraunces 300 italic** (display) · **DM Sans** (body/UI) · **Space Mono** (mono/eyebrows).

### Type gotcha — fonts change text width (read this)
Layouts are positioned in fixed SVG coordinates, but **text width depends on the font**. Swap in a brand font with wider metrics and labels can overflow their boxes or collide. Two defenses, use both:

1. **Default fonts are locked + bundled.** Out of the box you get pixel-clean layouts; presets change *colors only*.
2. **Auto-fit any variable or long text.** In `build()`, wrap every text that could vary (captions inside panels, worked arithmetic, payloads/JSON, definitions, anything whose content isn't a fixed short token) with `ex.fit(node, maxWidth)`. It measures the *rendered* width at runtime and shrinks the font until it fits — so even a wider brand font stays inside its box. Never compute an x-offset from `chars × pixels` (that magic number is font-specific); if you must place something after text, read `node.getComputedTextLength()` at render time (guard for the Node gate, which can't measure).

If a brand insists on custom fonts: add their `<link>`/`@font-face`, name them in `--font-*`, then **re-run the browser QA** — `ex.fit` will catch overflows but check collisions between separate elements yourself.

### Brand / theming — this is not welded to CETI
The CETI palette + fonts above are just the **default**. Because every diagram references *role tokens* (`--ex-*`, `--font-*`) and never raw hex, any company re-skins it without touching diagram code. Two built-in **preset palettes** ship: `ceti` (deep editorial dark, default) and `owala` (warm plum + dusty rose). Layer a brand theme on top:
```
python3 assets/build.py ep.js "Title" --preset owala                       # built-in palette
python3 assets/build.py ep.js "Title" --brand "Acme Labs" --theme acme.css  # custom brand
python3 assets/build.py ep.js "Title" --preset owala --theme acme.css       # preset + tweaks
```
A theme/preset is a `:root { … }` block overriding the 12 color roles (injected after the base; `--theme` wins over `--preset`). See `presets/`, `themes/README.md`, and the alternate brand `themes/example-helio.css`. Keep WCAG AA on new pairs (the `wcag-contrast` skill audits a palette). For fonts, see the type gotcha above.

---

## The detail band (math is only ONE kind)

The lower-third is the **"show your work" band**. Worked math is the canonical case, but the same slot carries whatever evidence the concept needs. Pick what fits the topic:

- **Worked math** — derive the figures on screen (softmax, a dot product, an average). `q·k = 1.30 + 0.80 + 0.25 + 0.35 = 2.70 → ÷√dₖ = 1.35`.
- **Real payload / code** — show the actual message or snippet, `JSON.stringify`'d so it can't drift (e.g. a JSON-RPC request/response, a SQL query, a config).
- **A worked trace** — a few rows of real state as a value moves through (stack frames, a packet's headers, a token stream).
- **A count / comparison** — a derived figure that lands the point (`M × N = 100` vs `M + N = 25`, before/after).
- **Key terms** — 2–3 labelled definitions when the idea is vocabulary, not numbers.

Whichever you pick: **derive it in code, don't assert it.** A sharp viewer must not catch an inconsistency, and `__AUDIT()` must catch it first if they could. Be honest about abstraction (if a scatter is a 2-D projection of 768-d space, say so). Put real sizes / names / versions in `meta.tag` and the band.

## Archetypes — choose the motion that fits the concept

Not every explainer is a derivation. Match the anchor + working-zone motion + detail band to the kind of process:

| Archetype | Anchor (persists) | Working-zone motion | Detail band |
|-----------|-------------------|---------------------|-------------|
| **Derivation** (attention, RAG scoring) | the inputs (token row, doc shelf) | values flow → scores → bars → result | the worked arithmetic |
| **Process / pipeline** (MCP, OAuth, deploy, a request) | the endpoints + the channel between | one packet travels the channel per stage | the real payload at each step |
| **Code / call trace** | the code block or call stack | the active line / frame highlights as it steps | variable values / output |
| **State machine** (TCP, a lifecycle) | the state graph (nodes + edges) | the current node lights; the taken edge animates | the triggering event / guard |
| **Transformation** (parse, compile, ETL) | source shape on the left | structure morphs A → B | the rule applied this step |
| **Comparison** (with/without, naive/optimized) | the two columns | the same input runs down both | the metric that differs |

The contract (one clock, build-once, 8 beats, anchor + cross-faded scenes + detail band, `seg` for same-region) is **identical across archetypes** — only what you draw changes. `self-attention.js` is a Derivation; the MCP example is a Process. Both use the exact same engine and shell.

---

## Voice & copy (CETI)

Warm, not cheerful. Confident, not loud. A little dry. Short sentences, aggressive verbs, cut every word that can be cut. **"You"**, not "users". Sentence-case headings. **One italic-emphasis word** per title/synthesis. No emoji, no hype. Concrete beats grandiose ("re-reads the whole sentence" > "powerful attention mechanism"). Captions are the *spoken* idea — one plain sentence per beat; the diagram does the showing.

---

## The content brief (write this before any code)

A good episode starts from a tight brief. Capture, for the concept:

- **Mechanism** — how it actually works, in 2–4 sentences of plain mechanism (no hand-waving).
- **Worked example** — a concrete instance with **real numbers** you can derive on screen. This is the spine of the diagram.
- **Anchor visual** — the one persistent element (what sits at the top the whole time).
- **8 beats** — each adds exactly one idea. Beat 1 = introduce the anchor; beat 8 = "Why it matters". For each: a ≤18-char label and a ≤118-char caption.
- **The aha** — the single durable line the viewer leaves with → becomes `meta.synthesis`.
- **Refs** — real sources for the numbers and claims.

`reference/self-attention.js` is a complete worked instance of all of the above. Read it.

---

## The quality gate (run before every ship)

`node assets/gate.mjs <ep-id>.js` loads the engine + your module under a DOM shim, runs `build()` once and `render(t)` across the **whole timeline** (catching crashes, undefined nodes, NaN attributes), and asserts the contract: `window.EXPLAINER` exists; exactly 8 beats; 35–45s; last beat is "Why it matters"; captions ≤118 chars; labels ≤20; `setMath`/`setDetail` present; `meta.tag` width-safe (**§15a** — char + estimated-px, keep ≤ ~38); `meta.id` kebab-case; an `<svg>` mounted. **§15b:** if you expose `window.__REGIONS`, it sweeps every frame and fails if more than one scene is lit per region (the paused-frame mush check). **§15d:** if you expose `window.__LAYOUT` (your top-level blocks), it computes each block's real bbox every frame and fails on any visible-block overlap (the general anti-collision gate). It also calls `window.__AUDIT()` and fails on a consistency mismatch.

**Every assertion must PASS before you build and ship.** Eyeballing doesn't scale; the gate is how the bar holds.

### Visual QA without a browser (catch collisions)
The gate proves the code runs; it can't see overlaps. Snapshot real frames:
```
node assets/snapshot.mjs <ep-id>.js <t-seconds> out.svg   # faithful single frame
# then rasterize to eyeball:  convert -density 200 out.svg -resize 1500x out.png
```
It prunes invisible (faded) nodes, so you see exactly what's on screen at time `t`. Snapshot the **middle of every beat** (e.g. each `beats[i].start + dur/2`) and check: nothing overlaps, each panel's content sits inside it, only one working-zone scene shows, the lower-third stays below y≈302. Fix any collision, re-gate, re-snapshot.

A browser-only check even snapshots can't do: open the built HTML, confirm autoplay → end → replay, scrub to any point shows a complete frame, the four Tweaks work, and the diagram + caption + controls fit one laptop viewport.

## The last beat — where it always falls apart (devil in the details)

The final beat ("Why it matters") is the most-failed section: scenes get bolted on, the detail band collides with a lingering working scene, the synthesis doesn't land. Discipline:

- **Reuse, don't invent.** Beat 8 should resolve elements already on screen (re-light the anchor, show the before/after the diagram earned) — not introduce a brand-new layout under time pressure.
- **One thing fades as one thing arrives.** Snapshot the **7→8 boundary**, not just the middle of 8 — that transition is where two scenes double-expose.
- **Land the aha.** The caption is the spoken payoff; `meta.synthesis` is the durable 2–4 sentence version. They should agree and be concrete.
- **End-state legibility.** At `t = duration` the frame must be a clean, complete summary (reduced-motion users may only ever see it paused).

## Failure-mode log (§15c) — every bug we've hit, and the guardrail that now blocks it

| Symptom | Root cause | Guardrail |
|---------|-----------|-----------|
| Frozen "double-exposure" mush mid-scrub (two detail scenes stacked) | `pulse()` fades spill *outside* the window, so adjacent same-region scenes overlap | **`ex.seg`** (fades contained in-window) + gate **§15b** region sweep via `__REGIONS` |
| A persistent label/pill sits on top of a panel that appears later | anchor element parked where a working panel later renders | **§15d** block-overlap gate (`__LAYOUT`) fails the build on any visible-block collision; fade the anchor as the panel arrives / move to another zone |
| Two text/diagram blocks overlap under a different brand font | layout tuned to one font's metrics; no automated spatial check | `ex.fit` (width) + **§15d** real-bbox overlap gate + the browser `getBBox` auditor for font-accurate sibling checks |
| `tag` shows an ellipsis | char-count check passed but rendered width didn't | gate **§15a** width estimate; keep `meta.tag` ≤ ~38 chars |
| Worked number contradicts the diagram | a derived value was hand-typed | derive in code + assert in `window.__AUDIT()` (gate calls it) |
| `render()` crashes when scrubbed to a point | a node referenced before `build()` created it | build-once / mutate-only; gate sweeps the whole timeline |
| Last beat looks broken | new layout introduced in beat 8 | reuse the anchor; snapshot the 7→8 boundary (see above) |
| Looks great on your screen, breaks on another | raw hex / fixed brand assumptions | role tokens only; theme-swappable; AA-checked

---

## Files in this skill

- `assets/engine.js` — the deterministic clock + player (reuse unchanged).
- `assets/ceti-tokens.css`, `assets/ceti-motion.css` — the token + motion layer.
- `assets/shell.template.html` — the self-contained shell (vanilla Tweaks, no React).
- `assets/_episode-template.js` — copy this to start a new episode.
- `assets/build.py` — inline everything into one `.html`.
- `assets/gate.mjs` — the automated quality gate (§15a tag, §15b region, §15d block-overlap, math invariant).
- `assets/brief-gate.mjs` — the brief gate: decides every rule that can be decided before code, prints the Φ ledger.
- `assets/scaffold.mjs` — brief → module skeleton; `__AUDIT` fails until `DERIVED` exists.
- `META-PROMPT.md` — the typed contract (slots, functor, binding rules → checks, refinement loop).
- `briefs/brief.schema.json` — the brief type. `briefs/*.brief.json` — typed instances (`rag`, `mcp`, `sheaf-glue`).
- `assets/snapshot.mjs` — headless single-frame snapshot for visual QA (no browser).
- `assets/audit-overlaps.js` — browser overlap auditor (font-accurate; run via console/Chrome).
- `presets/` — built-in palettes: `ceti.css` (default), `owala.css`, `ceti-course.css` (cream / vermillion / ink, light chrome).
- `themes/` — `README.md` (how to re-skin) + `example-helio.css` (a complete alternate brand).
- `briefs/` — worked content briefs (`BRIEF-rag.md`, `BRIEF-mcp.md`).
- `reference/` — gold-standard modules across archetypes: `self-attention.js` (derivation, **read first**), `oauth.js` (process), `tcp.js` (state machine), `binary-search.js` (code/trace).
- `gallery/gallery.png` — visual catalog of the reference set.
- `reference/SPEC-original.md` — the original production spec (deeper background).
- `LONGFORM.md` — the feature-cut format (~2 min, 7 movements, archetypes A1–A7, speed chips, brand bookends).
- `reference/longform/feature-cut-v2.js` — gold-standard long-format engine + scenes ("Generative AI, explained simply", 110s).
- `reference/longform/feature-cut-v2.html` — the shipped self-contained artifact (shell + tokens + chrome).
- `HANDOFF.md` — the operational guide (build, QA, theming, keybindings, troubleshooting).
