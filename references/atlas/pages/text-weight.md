---
id: text-weight
title: "textWeight() and variable fonts"
type: Construct
aliases: ["textWeight", "variable fonts", "variable font support", "Weight-animated caption", "p5.variableFont", "opentype.js", "Arthur Cloche", "arthurcloche"]
sources: [S4, S33, S34, S43, S45, S241, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# textWeight() and variable fonts

## Definition
**[2.x]** `textWeight(n)` sets font weight and updates the canvas style's `font-variation-settings`; with no argument it returns the current weight [S34]. It is the native route to variable fonts, which 2.0 added [S4].

## Details
- A newsletter reports 2.0 lets sketches animate weight, width and slant [S241].
- Needs a variable font; static fonts will not change [S34][S33].
- Replaces the 1.x community add-on p5.variableFont, which targeted p5.js 1.7.0, needed opentype.js 1.3.4 and lacked WEBGL support [S45].
- A 2021 maintainer comment wanted variable fonts to start as an add-on; that predates 2.0 [S43].
- Combining with `textToPoints` is undocumented [S45].

## In explainer work
Weight-animated caption: `textWeight(map(sin(t),-1,1,300,800)); text('attention', 40, 80);` for kinetic emphasis [S34].

## Patterns
**Weight-animated caption.** When: emphasis on a word. Pitfall: static fonts ignore weight.
```js
textWeight(map(sin(t), -1, 1, 300, 800));
text('attention', 40, 80);
```

## Relations
- part_of [[module-typography]] — Typography entry [S357]
- part_of [[hub-language-core]] (structural)
- depends_on [[load-font]] — requires a variable font [S34]
- related_to [[p5-font]] — variable fonts load through fonts objects [S33]
- enables [[kinetic-typography]] — animated weight [S241]
- introduced_in [[release-2-0]] — new in 2.0 [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S33] — loadFont() reference
- [S34] — textWeight() reference
- [S43] — Issue 4992, variable font support request
- [S45] — p5.variableFont
- [S241] — Make JavaScript art with p5.js 2.0 (This Week in JavaScript)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
