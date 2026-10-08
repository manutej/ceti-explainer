# The arsenal · shared brief for every agent · 2026-10-08

Repo /home/user/ceti-explainer (no git commands; the orchestrator commits). Read first: arsenal/INTERVIEW.md,
factory/FORMAT.md, factory/kit/README.md, and the atlas pages your lane cites (references/atlas/pages/<slug>.md;
the atlas index is references/atlas/pages/index.md; cite pages as [[slug]]).

## What the arsenal is
A pattern library of professional animation capability for explainers, modular so brand, chrome, material,
structure, motion, format and renderer vary independently (INTERVIEW.md Q2). Every entry is a pure module with
a demo page, a card and stills, verified headless.

## Contract for a pattern module  (arsenal/patterns/<id>/pattern.js)
```js
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
ARSENAL.patterns['<id>'] = {
  id: '<id>', atlas: ['<slug>', ...], renderer: 'p2d' | 'webgl',
  params: { /* defaults; every param documented in card.md with its range */ },
  variants: [ { name, params }, ... ],          // at least 3, showing the RANGE of the pattern, not one look
  setup(p, ctx, params) { return state; },       // pure of (params, ctx.seed); mulberry32(ctx.seed) for any draw
  draw(p, t, state, params, tokens) { ... }      // pure of t (seconds); no Math.random/Date/frameCount/millis
};
```
`tokens` is a brand pack (arsenal/brands/<id>.json): { id, color: {bg, ink, accent, accent2, muted, line, panel,
chalk}, type: {disp, mono, body}: {family, weight}, texture: 'paper'|'none'|'grain'|'halftone', tempo: {ease, beat_s},
voice: {...} }. Modules read ROLES, never hex. Default pack: arsenal/brands/ceti-dark.json (the orchestrator wrote
it; if absent, write it from factory/kit/README.md's palette and tell the orchestrator).

## Demo page  (arsenal/patterns/<id>/demo.html)
Standalone, loads `../../../vendor/p5-2.3.4.min.js` and `./pattern.js` by relative path (file:// works), a brand
pack inline or via `?brand=`, 960×540 canvas, pixelDensity(2), noLoop(); exposes `window.__film = { ready, seek(t),
info }` like the factory films, and `?variant=<name>&t=<s>` to render one variant at one time. Draw nothing else.

## Verification (every lane)
`node arsenal/tools/shoot.mjs arsenal/patterns/<id>/demo.html --out arsenal/patterns/<id>/shots` renders each
variant at t = 0, 1/3, 2/3, end, checks re-seek purity (canvas pixels identical), writes a contact sheet and
`shots/report.json`. Look at the contact sheet yourself once. Fix at most twice. Record seconds per frame.

## Card  (arsenal/patterns/<id>/card.md)
Name; what it is for (one paragraph); when NOT to use; params with ranges; the three variants described; atlas
citations [[slug]] with the S-ids they carry; pitfalls; cost (s/frame at 960×540 ×2 density); renderer; fallback if
any API is beta or unreleased. Under 80 lines.

## Rules
Pure function of t; seeds in setup; no runtime fetches; no Google Fonts; vendored p5 only; nothing outside your
folder except what your lane names; no polish rounds; ship with WARNs written in the card. Hand back under 150
words: path, variants, s/frame, what failed.
