---
id: events-keyboard
title: "Keyboard events"
type: Capability
aliases: ["keyIsDown", "key polling", "keyCode", "Portable keyboard stepping"]
sources: [S11, S27, S97, S115, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Keyboard events

## Definition
Keyboard events in p5 2.x keep `keyCode` numeric, add `code`, and `keyIsDown()` no longer accepts numeric key codes but takes strings (key or code values) or constants like `LEFT_ARROW` **[changed in 2.x]** [S11][S97][S357].

## Details
- Named keys should be tested with `key === 'Enter'` or `code === 'KeyA'` [S11].
- `keyIsDown(UP_ARROW)` works in both 1.x and 2.x and is the recommended portable pattern [S11][S27].
- The `events.js` compatibility add-on restores 1.x `keyCode` comparisons; the README omits it from the add-on intro list [S11][S115].
- The Events/Keyboard group has 8 entries, with `code` new in 2.x: code, key, keyCode, keyIsDown, keyIsPressed, keyPressed, keyReleased, keyTyped [S357].
- Relevance for explainers is medium: key-driven stepping through beats for interactive pieces, low for rendered video [S357].

## In explainer work
Use `keyPressed` with `code` comparisons to advance beats or toggle debug overlays during live presenting [S11][S357].

## Patterns
```js
function keyPressed() {
  if (code === 'ArrowRight') beat = min(beat + 1, lastBeat);   // layout-independent
  if (code === 'ArrowLeft') beat = max(beat - 1, 0);
}
```
Pitfalls: never pass numeric codes to `keyIsDown` in 2.x [S97].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-events]] — Events/Keyboard [S357]
- depends_on [[p5js-compatibility]] — `events.js` restores 1.x behaviour [S11]
- related_to [[version-2x-migration]] — keyboard change [S27]
- related_to [[pointer-events]] — sibling input group [S357]

## Sources
- [S11] — p5.js-compatibility add-ons
- [S27] — Teachers' Guide to p5.js v2
- [S97] — p5.js reference: keyIsDown()
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
