---
id: register-addon
title: "p5.registerAddon"
type: Construct
aliases: ["registerAddon", "addon API", "fn (p5.prototype alias)", "_removeSignal", "2.x add-on skeleton", "Dual-version add-on", "registerMethod (1.x)", "p5.prototype.registerMethod"]
sources: [S11, S115, S117, S118, S120, S274, S350, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.registerAddon

## Definition
**[2.x]** `p5.registerAddon(fn)` is the static function that registers an add-on; the add-on is a function `(p5, fn, lifecycles)` where `fn` aliases `p5.prototype` [S117][S118]. It is a new Structure-group entry and replaces `registerMethod` and the preload-counter methods **[changed in 2.x]** [S357][S117]. Folded topic register-method-1x: the 1.x hook API.

## Details
- Lifecycle hooks are assigned on the `lifecycles` object: `presetup`, `postsetup`, `predraw`, `postdraw`, `remove`; hooks are awaited and may be async (see [[lifecycle-hooks]]) [S117][S118].
- Event listeners should pass `this._removeSignal` as the signal for automatic cleanup [S118].
- Add-ons using it do not run on 1.x; a dual-version library can feature-test `p5.registerAddon` and fall back to `registerMethod` [S117].
- `registerPreloadMethod`, `_incrementPreload` and `_decrementPreload` are gone; return promises [S117][S115].
- Renderer registration for add-ons is not covered in the Creating Libraries doc [S350].

## In explainer work
A predraw/postdraw add-on is the clean place for a deterministic clock or frame capture: e.g. `lifecycles.postdraw` saves each frame [S118][S350].

## Patterns
**Dual-version add-on.** When: ship one library for 1.x and 2.x. Pitfall: new-syntax add-ons fail on 1.x.
```js
if (p5.registerAddon) p5.registerAddon((p5, fn, lc) => { lc.presetup = function () { /* init */ }; });
else p5.prototype.registerMethod('init', f);
```

## Relations
- part_of [[module-structure]] — new Structure entry [S357]
- part_of [[hub-language-core]] (structural)
- uses [[lifecycle-hooks]] — hook object [S118]
- related_to [[p5js-compatibility]] — compat add-ons restore loaders, not registerMethod hooks [S11]
- introduced_in [[release-2-0]] — redesigned add-on system [S117]
- related_to [[addon-events-api]] — 2.1 extension [S120]
- related_to [[decorators-api]] — related extension mechanism [S274]

## Sources
- [S11] — p5.js-compatibility add-ons
- [S115] — p5.js-compatibility README raw (differences list)
- [S117] — Designing an addon library system for p5.js 2.0
- [S118] — Creating an Addon Library
- [S120] — p5.js v2.1.0 release notes
- [S274] — What's New in p5.js 2.3.0!
- [S350] — Creating Libraries (2.x contributor docs)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
