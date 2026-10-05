# CETI Animated Explainer — Build Spec & Handoff

**Status:** v1 · Last updated 2026-06-08
**Scope:** Every animated explainer in the Animation-First suite (starting with the Transformer Series).
**Reference builds (the bar):** `self-attention.js` (gold standard) · `tokenization.js` (proves the engine generalizes).
**Content briefs:** `Transformer Series — Bible.html` — one fully-specified section per episode (mechanism, worked math, 8 beats, the "aha", refs).

> Read this top-to-bottom once. Then: copy `_TEMPLATE.html` + `_episode-template.js`, fill them in against the relevant Bible section, and run the QA checklist.

---

## 0. TL;DR — building one episode

1. Open the Bible section for the episode. The math, beats and aha are already specified.
2. `cp _episode-template.js  <epId>.js` and author the diagram (DATA → BEATS → BUILD → RENDER).
   The module **must end with** `window.EXPLAINER = <module>;`.
3. `cp _TEMPLATE.html  "<Title>.html"`, change the one `<script src="EPISODE.js">` line to your file, and set the `<title>`.
4. Add a card to `Transformer Series.html` (hub) with a small SVG thumbnail of the diagram.
5. Run the QA checklist (§15). Ship.

Everything else — clock, scrub bar, captions, chapters, keyboard, persistence, Tweaks — is inherited from `engine.js` + the shell. **Do not re-implement them.**

---

## 1. The non-negotiables

### MUST
- **One deterministic clock.** The whole episode is a pure function of time `t`. `render(t)` must reconstruct the exact frame for any `t`. (This is what makes scrub/replay/reduced-motion correct for free.)
- **Build once, mutate forever.** Create all SVG nodes in `build()`; in `render()` only set attributes / opacity / transform. Never create or destroy nodes inside `render()`.
- **Reuse `engine.js` unchanged.** Write only a content module. If you think you need an engine change, flag it — don't fork.
- **Exactly 8 beats**, total ~35–45s, beat 1 introduces the anchor, beat 8 is "Why it matters".
- **Academic-grade math, derived in code.** Every on-screen number must be internally consistent (compute it; don't hand-type derived values). One example worked in full, on screen.
- **CETI design tokens only** (`var(--ex-*)`, the three fonts). No raw hex inside the diagram.
- **CETI voice** in every caption, title, and synthesis (§10).
- **Canvas is 1000 × 464**, with a persistent anchor + a math lower-third gated by `setMath`.
- **End the module with `window.EXPLAINER = <module>;`**

### MUST NOT
- ❌ No `setTimeout`/`setInterval`/CSS keyframe sequencing to drive the animation. The clock is the only driver.
- ❌ No scroll-, IntersectionObserver-, or hover-triggered animation state.
- ❌ No new colors, gradients (beyond the approved ground wash), emoji, or AI-slop tropes.
- ❌ No hype words ("unlock", "supercharge", "revolutionize", "powerful", "game-changing").
- ❌ No text below 11px in the SVG; no tap target below 36px in chrome.
- ❌ Don't restyle raw HTML to fake CETI components — use the token layer.

---

## 2. Architecture — three parts

```
engine.js          ← the reusable timeline + player wiring (DO NOT EDIT per-episode)
<episode>.js       ← the content module: DATA, BEATS, build(), render()   ← YOU WRITE THIS
"<Title>.html"     ← the shell (copy of _TEMPLATE.html); binds meta + mounts the player
```

Shared assets: `ceti-tokens.css`, `ceti-motion.css` (the CETI token layer; loaded by the shell).
Tweaks: React + `tweaks-panel.jsx`, already wired in the shell.

---

## 3. Content module API (exact)

```js
window.EXPLAINER = {
  meta: {
    id,          // string — storageKey + filename stem (e.g. "self-attention")
    eyebrow,     // mono uppercase kicker, e.g. "Transformer Series · 04"
    title,       // Fraunces italic H1
    lede,        // HTML string; <em> one word
    synthTitle,  // HTML string; the closing section heading
    tag,         // mono line under the stage; put real param sizes here
    synthesis,   // 2–4 sentence durable takeaway (CETI voice)
  },
  beats: [ { id, label, dur, caption }, … ],   // dur in seconds; engine computes start/end/index
  build(stage, opts),   // opts = { beats (computed), duration, ex }. Create nodes once.
  render(t, ctx),       // ctx = { t, duration, beats, activeBeat, ex }. Pure mutation.
  setMath(on),          // toggle the worked-math lower-third (Tweaks hook)
}
```

In `build`, capture the computed beats: `opts.beats.forEach(b => D.beats[b.id] = b)` →
each beat now has `.start`, `.end`, `.index` (seconds).

---

## 4. Engine helpers — the `ex` toolkit (`window.CetiExplainer`)

```js
ex.ease       // { glaser, warmIn, defer, collect, rest, linear } — CETI eases only
ex.clamp(v,a=0,b=1)
ex.lerp(a,b,t)
ex.win(t, start, end, easing?)     // 0→1 progress across a window
ex.ramp(t, start, dur, easing?)    // 0→1 over `dur` seconds from `start` (default ease.defer)
ex.pulse(t, a, b, fade=0.35)       // ~1 inside [a,b], fades at both edges — use to show/hide a scene
ex.fmt(seconds)                    // "m:ss"
ex.cubicBezier(x1,y1,x2,y2)
```

Pattern: drive opacity/transform from beat windows.
```js
const B = D.beats;
setO(D.node, ex.ramp(t, B.score.start + 0.3, 0.5));            // fade in
setO(D.scene, ex.pulse(t, B.score.start, B.scale.end, 0.4));   // show only during these beats
```

---

## 5. HTML shell DOM contract

The shell (`_TEMPLATE.html`) already contains these. The engine finds them by attribute — keep them intact.

| Hook | Role |
|---|---|
| `[data-ex-root]` | the player root (focusable, keyboard) |
| `[data-ex-stage]` | where the module mounts its `<svg>` |
| `[data-ex-play]` `[data-ex-prev]` `[data-ex-next]` | transport buttons |
| `[data-ex-scrub]` `[data-ex-progress]` `[data-ex-handle]` `[data-ex-ticks]` | timeline (ticks auto-placed per beat) |
| `[data-ex-time]` `[data-ex-duration]` | time readout |
| `[data-ex-beatindex]` `[data-ex-beatlabel]` `[data-ex-caption]` | caption band (auto-filled per beat) |
| `[data-ex-chapters]` | chapter rail (engine builds buttons from `beats`) |
| `[data-meta-eyebrow|title|lede|tag|synthesis|synthtitle]` | bound from `meta` on load |

You normally edit **none** of these — only the `<script src>` line and `<title>`.

---

## 6. Geometry & layout conventions

- **viewBox `0 0 1000 464`.** The shell sizes the stage so diagram + caption + controls fit one viewport.
- **Anchor zone (top, y ≈ 40–200):** the element that persists across beats (token row, the word, the block). Continuity is pedagogy.
- **Working zone (middle):** scenes that cross-fade via `ex.pulse`. Only one "scene" visible at a time.
- **Lower-third (y ≈ 300–460):** the worked arithmetic / formula. **Gate its opacity by `flags.math`** so the Tweaks "Worked math" toggle works.
- **Type in SVG:** mono (`var(--font-mono)`) for numbers, ids, eyebrows; sans for words; ≥ 11px. The H1 title is Fraunces italic (in the HTML, not the SVG).
- **Whitespace ≥ ~30%.** Max ~3 focal points and one focal animation per beat; secondaries fade, never compete.

---

## 7. Beat model & captions

- **8 beats**, named in `label` (≤ ~18 chars — they appear in the chapter rail and caption band).
- **Durations** roughly: intro 3–4s, mechanism beats 4–5.5s, payoff 5–6s. Total 35–45s.
- **Beat 1** brings in the anchor (stagger reveals). **Beat 8** is always titled "Why it matters" and lands the aha.
- **Captions** = one short, plain-language sentence per beat — the *spoken* idea; the diagram does the showing. CETI voice (§10). The italic-emphasis word lives in the title/synthesis, not every caption.

---

## 8. The math bar (academic-grade)

- **Derive on screen, don't assert.** If you show attention weights, compute `softmax` in code and render the result. If you show a blend `z = Σ wᵢvᵢ`, compute `z`. A sharp viewer must not catch an inconsistency.
- **One example worked in full.** Show the actual arithmetic for a single case (e.g. `q·k = 1.30 + 0.80 + 0.25 + 0.35 = 2.70 → ÷√dₖ = 1.35`).
- **Be honest about abstraction.** If a scatter is a 2-D projection of 768-d space, say so. Use illustrative-but-labeled values, never wrong ones.
- **Cite real sizes** in `meta.tag` and lower-thirds (d_model, vocab, head count, param counts).
- **Cross-check against the Bible** section — the worked numbers there are the source of truth; if you change them, update the Bible.

---

## 9. Visual / design tokens

Defined at the top of every shell (mirror of the CETI marketing surface):

```
--ex-ground #0E1014   --ex-panel #171B23   --ex-cell #1C212B
--ex-ink #F5EFE3      --ex-dim #A39A89      --ex-line rgba(245,239,227,.13)
--ex-accent #CE9A6A (copper, lead)  --ex-accent-fill rgba(206,154,106,.14)  --ex-accent-glow …
--ex-accent2 #8FA985 (sage)  --ex-support #6E8CA8 (slate)  --ex-peach #D88B5C
```
Fonts: **Fraunces 300 italic** (display) · **DM Sans** (body/UI) · **Space Mono** (mono/eyebrows).
Eases: from `ceti-motion.css` (`--ease-glaser` etc). Use **one** saturated accent per scene.

---

## 10. Voice & copy (CETI)

- Warm, not cheerful. Confident, not loud. A little dry. No condescension.
- Short sentences. Aggressive verbs. Cut every word that can be cut.
- **"You"**, not "users". Sentence case headings. **One italic-emphasis word** per title/synthesis (the Glaser highlight).
- **No emoji.** No hype words. Concrete > grandiose ("re-reads the whole sentence" > "powerful attention mechanism").
- Maritime nomenclature (Bearings, Soundings, Course) is available but earn it — sparing.

---

## 11. Tweaks & player requirements (inherited — verify they work)

- **Player:** autoplay (unless reduced-motion), scrub with per-beat ticks, play/pause, prev/next step, chapter rail, time readout, `localStorage` resume.
- **Keyboard:** Space/k = play-pause; ←/→ = scrub 2s; Shift+←/→ = step beat; 1–8 = jump; Home/End.
- **Tweaks panel** (toolbar): **Pace** (0.5–1.75×), **Accent** (copper/sage/slate/peach), **Worked math** (on/off → `setMath`), **Captions** (on/off). Keep this set unless the episode needs a specific extra.

---

## 12. Robustness & accessibility

- `render(t)` is the only animator; the loop clamps `dt` (tab-switch safe) and pauses on `visibilitychange`.
- `prefers-reduced-motion`: engine skips autoplay; keep meaning legible at any paused `t` (don't hide content behind motion-only reveals).
- `<svg role="img" aria-label="…">`. Buttons have `aria-label`. Focus rings via the token glow — never `outline:none` without a replacement.

---

## 13. File & naming conventions

```
explainer/
  engine.js                    shared, do not edit per-episode
  ceti-tokens.css ceti-motion.css   token layer
  _TEMPLATE.html               copy → "<Title>.html"
  _episode-template.js         copy → <epId>.js
  SPEC.md                      this file
  Transformer Series.html      hub (add a card per shipped episode)
  Transformer Series — Bible.html   content briefs

  Self-Attention.html / self-attention.js          EP03 ✅
  Tokenization & Embeddings.html / tokenization.js EP01 ✅
```
`meta.id` == storageKey == file stem (kebab-case). Title-case the `.html` filename.

---

## 14. Build procedure

1. **Read** the Bible section. Note the worked numbers, the 8 beats, the aha.
2. **DATA** — implement the math; `console`-verify the derived figures match the Bible.
3. **BEATS** — transcribe labels + captions; tune `dur` to ~35–45s total.
4. **BUILD** — lay out anchor, scenes, lower-third; everything starts at opacity 0.
5. **RENDER** — gate each element on its beat window; gate the lower-third by `flags.math`.
6. **Shell** — copy `_TEMPLATE.html`, swap the script line + `<title>`.
7. **Hub** — add a card + thumbnail to `Transformer Series.html`.
8. **QA** — §15. Then `done` + a verifier pass.

---

## 15. QA checklist (per episode)

- [ ] Autoplays from 0; reaches the end; replays cleanly.
- [ ] Scrub to any point renders a correct, complete frame (no half-built states).
- [ ] Prev/next + chapter buttons land on the right beats; captions/labels update.
- [ ] All 8 beats are visually distinct; no two scenes overlap or collide.
- [ ] Every number is consistent and matches the Bible; one example worked in full.
- [ ] "Worked math" toggle hides/shows the lower-third; "Captions" toggle works; accent swatches recolor the diagram; pace changes speed.
- [ ] Diagram + caption + controls fit a normal laptop viewport.
- [ ] No console errors (Babel dev warning is fine). No raw hex / emoji / hype.
- [ ] Reduced-motion: content is legible paused.

---

## 15a. Automated quality gate (run before every ship)

Eyeballing doesn't scale and is how the bar slips. After loading the episode (`show_html`), run this in the page and **every assertion must pass**. It catches the failure modes we've actually hit: math that doesn't sum, beat counts drifting, captions overflowing, timing out of band, the wrong global.

```js
// paste into eval_js with the episode page loaded
(() => {
  const m = window.EXPLAINER;                 // convention is universal — must exist
  const b = m.beats, errs = [];
  const dur = b.reduce((a, x) => a + x.dur, 0);
  if (!m) errs.push("window.EXPLAINER missing");
  if (b.length !== 8) errs.push(`beats=${b.length}, expected 8`);
  if (dur < 33 || dur > 46) errs.push(`duration=${dur.toFixed(1)}s, want 35–45`);
  if (b[b.length-1].label.toLowerCase() !== "why it matters")
    errs.push(`last beat is "${b[b.length-1].label}", expected "Why it matters"`);
  const capMax = Math.max(...b.map(x => x.caption.length));
  if (capMax > 118) errs.push(`longest caption ${capMax} chars (>118 risks overflow)`);
  if (b.some(x => x.label.length > 20)) errs.push("a beat label >20 chars (chapter rail)");
  if (typeof m.setMath !== "function") errs.push("setMath() missing (Worked-math tweak)");
  if (m.meta.tag.length > 58) errs.push(`tag ${m.meta.tag.length} chars — may ellipsize`);
  if (!document.querySelector("[data-ex-stage] svg")) errs.push("no <svg> mounted");
  const tag = document.querySelector(".ex-stage-tag");
  if (tag && tag.getBoundingClientRect().height > 20) errs.push("stage tag wrapping (>1 line)");
  return errs.length ? "FAIL:\n- " + errs.join("\n- ") : "PASS · " + dur.toFixed(1) + "s";
})()
```

**Plus the math invariant** — write a few lines that recompute every derived figure from the raw inputs and assert they equal what the diagram shows (softmax weights sum to 1.0; each highlighted token is the argmax; a worked dot product equals its stated total). If a sharp viewer could catch an inconsistency, the gate must catch it first. Reference: the audit run against EP01/03/04 (softmax → 1.0000, animal 34%, q·k = 2.70 → 1.35, 512/8 = 64).

---

## 16. Subagent fan-out — task template (copy-paste)

> **Task:** Build **Episode <NN> · <Title>** of the CETI Transformer Series as a new animated explainer.
>
> **Read first (in this project):** `explainer/SPEC.md` (the build contract), the `EP <NN>` section of `explainer/Transformer Series — Bible.html` (your content brief — mechanism, worked math, 8 beats, the aha), and `explainer/self-attention.js` (the quality bar). Skim `explainer/engine.js` for the `ex` helpers.
>
> **Deliver:**
> 1. `explainer/<epId>.js` — a content module per `_episode-template.js`, ending with `window.EXPLAINER = <module>;`. All on-screen numbers derived in code and matching the Bible. 8 beats, ~35–45s. Anchor + cross-faded scenes + math lower-third gated by `setMath`.
> 2. `explainer/<Title>.html` — a copy of `_TEMPLATE.html` with the script line + `<title>` swapped.
> 3. A card + small SVG thumbnail added to `explainer/Transformer Series.html`.
>
> **Constraints:** Reuse `engine.js` unchanged. CETI tokens + voice only. Run the QA checklist (SPEC §15) **and the automated quality gate (§15a) — every assertion must PASS, plus the math invariant.** Then `done` on your `.html` and a verifier pass.
>
> **Do not touch:** `engine.js`, the shared CSS, or other episodes' files.

**Parallel-safety:** each episode is isolated (its own `.js` + `.html` + one card). The only shared write is the hub card — if fanning out concurrently, have each subagent append its card in episode order, or collect cards and add them in one pass afterward to avoid merge collisions.

---

## 17. Episode backlog

| EP | Title | Anchor visual | Status |
|----|-------|---------------|--------|
| 01 | Tokenization & Embeddings | char cells → token chips → embedding scatter | ✅ shipped |
| 02 | Positional Encoding | token row + stacked sine waves | ⏳ planned |
| 03 | Self-Attention | token row + softmax bars | ✅ shipped (bar) |
| 04 | Multi-Head Attention | token row + 3 parallel attention maps | ✅ shipped |
| 05 | The Transformer Block | one vector through attn→FFN with residual highway | ⏳ planned |
| 06 | Mixture of Experts | router → expert bank, top-2 lit | ⏳ planned |
| 07 | The Forward Pass | embed → N blocks → unembed → next-token | ⏳ capstone |

Recommended build order: **04 → 02 → 05 → 06 → 07** (04 reuses the most from Self-Attention; 07 last because it references all prior diagrams).
