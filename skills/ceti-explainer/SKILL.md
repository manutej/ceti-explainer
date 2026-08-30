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

---

## What you produce

A **single self-contained `.html` file** (no external JS, opens straight from disk) containing: the hero (eyebrow / italic title / lede), the player (stage + caption band + transport + scrub + chapter rail + keyboard), the closing synthesis, and a dependency-free Tweaks panel. You write **one file** — the content module — and run a build script that inlines everything else.

```
You write:   <ep-id>.js            ← the content module (DATA · BEATS · build · render)
Build:       python3 assets/build.py <ep-id>.js "<Title>"   →  "<Title>.html"
Verify:      node assets/gate.mjs <ep-id>.js                ←  must print PASS
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
- No `setTimeout` / `setInterval` / CSS-keyframe sequencing to drive the animation. The clock is the only driver.
- No scroll-, IntersectionObserver-, or hover-triggered animation state.
- No new colors or gradients (beyond the ground wash), no emoji, no AI-slop.
- No hype words ("unlock", "supercharge", "revolutionize", "powerful", "seamless", "game-changing").
- No SVG text below 11px.
- No `ex.pulse` for two scenes that share a region — use `ex.seg`.
- Don't introduce brand-new layout in the final beat — reuse the anchor you already built (see "The last beat" below).
- Don't fake the chrome with raw HTML — the shell already provides it.

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

---

## Visual grammar

- **viewBox `0 0 1000 464`.** Three horizontal zones: Anchor (top, y≈34–200), Working zone (middle, one scene at a time), Lower-third (y≈300–460) gated by `flags.math`.
- **Show the mechanism as motion**, not as a static labeled picture.
- **One focal animation per beat.** Max ~3 focal points. Whitespace ≥ ~30%.

### Preventing overlaps
Three layers, all required:
1. Three zones, fixed y-bands. One block = one `<g>`. Same-region scenes use `ex.seg`. Fade an anchor device out before a panel lands where it sits. Wrap variable text in `ex.fit`.
2. Gate enforcement: `window.__LAYOUT` (§15d block overlap), `window.__REGIONS` + `ex.seg` (§15b), `ex.fit` + tag width (§15a).
3. Browser overlap auditor after any font/brand change.

Token roles only. Default fonts: Fraunces 300 italic, DM Sans, Space Mono. Presets change colors only.

See `LONGFORM.md` for the feature-cut format. See `COURSE-E0.md` for film occupancy. Command: `/sheaf-run course`.

## Files in this skill

- `assets/engine.js` — deterministic clock + player (reuse unchanged).
- `assets/ceti-tokens.css`, `assets/ceti-motion.css` — token + motion layer.
- `assets/shell.template.html` — self-contained shell.
- `assets/_episode-template.js` — copy this to start a new episode.
- `assets/build.py` — inline everything into one `.html`.
- `assets/gate.mjs` — quality gate (§15a tag, §15b region, §15d block-overlap).
- `assets/snapshot.mjs` — headless single-frame snapshot.
- `assets/audit-overlaps.js` — browser overlap auditor.
- `presets/` — `ceti.css`, `owala.css`.
- `themes/` — theming README + `example-helio.css`.
- `briefs/` — `BRIEF-rag.md`, `BRIEF-mcp.md`.
- `reference/` — gold-standard modules: `self-attention.js`, `oauth.js`, `tcp.js`, `binary-search.js`.
- `LONGFORM.md` — feature-cut format.
- `COURSE-E0.md` — film / short-course occupancy.
- `HANDOFF.md` — operational guide.
