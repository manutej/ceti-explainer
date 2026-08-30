# CETI Explainer — Handoff

Everything a new author (human or agent) needs to ship an A-grade animated explainer with this skill. Read `SKILL.md` for the full contract; this is the operational guide.

## What this produces
A **single self-contained `.html`** — one animated SVG diagram that builds a concept over ~40s with a video-like player (scrub, captions, chapter rail, keyboard), a deterministic clock (every frame reproducible), a dependency-free Tweaks panel, and brand theming. Opens straight from disk; no build step, no network needed.

## Quickstart
```bash
cp assets/_episode-template.js my-topic.js          # author DATA · BEATS · build · render
node assets/gate.mjs my-topic.js                     # must print PASS (all checks)
python3 assets/build.py my-topic.js "My Topic"       # → "My Topic.html"
```
Re-skin: `--preset ceti|owala`, `--brand "Acme"`, `--theme themes/acme.css`.

## Architecture
```
assets/engine.js          deterministic clock + player + the `ex` toolkit   (don't edit per episode)
assets/ceti-tokens.css    type / spacing / radius
assets/ceti-motion.css    easing vocabulary
assets/shell.template.html self-contained shell (vanilla Tweaks) — has __PRESET__/__THEME__/__BRAND__ slots
assets/build.py           inlines everything into one .html  (--preset/--brand/--theme)
assets/gate.mjs           automated quality gate (run before every ship)
assets/snapshot.mjs       headless single-frame render for visual QA (no browser)
assets/audit-overlaps.js  browser overlap auditor (font-accurate; paste in console / run via Chrome)
presets/                  built-in palettes: ceti.css (default), owala.css
themes/                   how-to + example brand (example-helio.css)
reference/                gold-standard modules — READ THESE (self-attention, rag-style, oauth, tcp, binary-search)
briefs/                   example content briefs
```
You write **one file** (`<id>.js`); the rest is inherited.

## The module contract (exact)
```js
window.EXPLAINER = { meta, beats, build, render, setMath };
window.__AUDIT   = () => ({ ok, msg, note });           // consistency invariant (gate calls it)
window.__REGIONS = () => ({ working:[…], detail:[…] }); // §15b one-scene-per-region
window.__LAYOUT  = () => [block, …];                    // §15d no two visible blocks overlap
```
- `meta`: `id` (kebab), `eyebrow`, `title`, `lede`, `synthTitle`, `tag` (≤38 chars), `synthesis`.
- `beats`: exactly 8, total 35–45s, beat 8 = "Why it matters".
- `build(stage,{beats,duration,ex})`: create every node ONCE.
- `render(t,ctx)`: pure mutation from time — no setTimeout, no state machine.

## The `ex` toolkit
`ease{glaser,warmIn,defer,collect,rest,linear}` · `clamp` · `lerp` · `win(t,a,b,ease?)` · `ramp(t,start,dur,ease?)` · `pulse(t,a,b,f)` (lone element only) · **`seg(t,a,b,f)`** (same-region cross-fade) · **`fit(node,maxW,min?)`** (shrink text to fit) · `fmt(s)` · `cubicBezier`.

## Preventing overlaps — the system (this is the big one)
Overlap is the #1 failure in diagram animation. It's handled in three layers; all are automatic:

1. **Prevent.** Three zones (anchor ~34–124 / working ~130–292 / detail ~300–456). One block = one `<g>` in one zone. One working scene at a time (`ex.seg`). Fade an anchor device out before a panel lands where it sits. Wrap variable/long text in `ex.fit`. Inset movers from boxes.
2. **Enforce (gate, must pass).**
   - **§15d** — list blocks in `__LAYOUT`; the gate computes each block's real bbox every frame and **fails on any visible overlap**. (Proven: reverting a fixed pill to its old timing reproduces `blocks #0 & #2 OVERLAP 318×19px at t=5.1s`.)
   - **§15b** — `__REGIONS` + `ex.seg`: at most one scene lit per region.
   - **§15a** — `ex.fit` + tag width: text can't overflow/ellipsize.
3. **Verify font-accurately.** After any font/brand change, run `assets/audit-overlaps.js` in a browser (real `getBBox`).

## QA workflow (every episode, in order)
1. `node assets/gate.mjs <id>.js` → **PASS** (8 beats, 35–45s, last beat "Why it matters", math invariant, §15a/§15b/§15d).
2. `node assets/snapshot.mjs <id>.js <t> out.svg && convert -density 200 out.svg out.png` — eyeball the **middle of every beat AND the 7→8 boundary**.
3. Browser pass: open the built HTML; run `audit-overlaps.js` in the console; confirm autoplay → end → replay, scrub shows clean frames, the 4 Tweaks work, fits one viewport.

> No browser locally? `snapshot.mjs` (geometry-faithful, prunes faded nodes) + the gate cover layout/logic; do the browser pass on any machine with Chrome before final ship.

## Player & keybindings
Bound at **document level** (work the instant the page loads — no click-to-focus), and guarded so a focused input keeps its keys:
`Space`/`k` play-pause · `←`/`→` scrub 2s · `Shift`+`←`/`→` step beat · `1`–`8` jump · `Home`/`End`. The pace slider keeps its arrows; a focused button keeps Space. Autoplays unless reduced-motion.

## Theming, presets, brand
- Diagrams use **role tokens only** (`--ex-*`), so palette swaps need no diagram changes.
- Built-in presets: `--preset ceti` (dark, default), `--preset owala` (warm plum/rose).
- Custom brand: `--theme file.css` (a `:root{}` overriding the 12 color roles; wins over preset). `--brand "Name"` sets the wordmark.
- **Type gotcha:** fonts change text width. Default fonts are locked for pixel-clean layout; presets change colors only. If a brand needs its own fonts, name them in `--font-*`, then re-run the browser overlap auditor — `ex.fit` catches overflow, but verify cross-element collisions.

## Archetypes (match motion to the concept)
Derivation · Process/pipeline · State machine · Code/trace · Transformation · Comparison. The reference set has a worked example of each — copy the closest one. The contract is identical across all; only what you draw changes.

## Add to the gallery
Build the reference's HTML into `gallery/`, and (optional) regenerate `gallery/gallery.png` by snapshotting one strong beat per reference and `montage`-ing them.

## Troubleshooting
- **Gate: "blocks #a & #b OVERLAP"** → §15d caught a collision; re-place, fade one out as the other arrives, or move zones.
- **Gate: "N scenes lit per region"** → you used `pulse` for same-region scenes; switch to `ex.seg`.
- **Gate: "tag … will ellipsize"** → shorten `meta.tag` to ≤38 chars.
- **Gate: "render() threw"** → you created/referenced a node in `render` that `build` didn't make; build once, mutate only.
- **Text overflows under a brand font** → wrap it in `ex.fit(node, maxW)`; never position by `chars × px`.
