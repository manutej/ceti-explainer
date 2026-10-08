---
id: dom-controls
title: "DOM UI controls (createSlider, createSelect, createInput)"
type: Capability
aliases: ["createSlider", "createSelect", "createInput", "changed", "slider", "Slider-driven parameter explainer"]
sources: [S90, S94, S95, S99, S100, S108, S109, S111, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# DOM UI controls (createSlider, createSelect, createInput)

## Definition
The DOM creators `createSlider(min, max, [value], [step])`, `createSelect()` and `createInput()` build HTML controls and return [[p5-element]] objects [S90][S108][S109].

## Details
- `createSlider`: `step` of 0 gives continuous movement; the element is an `<input>` slider [S90].
- `createSelect`: dropdown (optionally multiple) with `option(name, value)`, `selected()`, `value()` and `disable()/enable()` per option or whole control [S108].
- `createInput`: text type by default with an optional default string [S109].
- `changed(fn)` runs a callback when the element changes; `false` disables it [S111]. Other related creators: createButton, createCheckbox, createRadio, createColorPicker [S357].
- Create controls once in `setup`, not in `draw` [S90].
- External libraries Tweakpane (dependency-free; Number, String, Boolean, Color, Point bindings, monitors, folders, tabs), lil-gui (about 29.8 kB) and p5.gui offer richer panels [S94][S95][S99].

## In explainer work
Slider-driven parameter explainers: bind one slider to one figure parameter; for expensive recomputation prefer lil-gui's `onFinishChange` semantics or `changed` over per-input handling [S95][S90].

## Patterns
**Slider-driven parameter explainer.** When: show how one value changes a figure. Pitfall: creating the slider inside `draw`.
```js
let s;
function setup() { createCanvas(400, 300); s = createSlider(0, 10, 3, 0.1); s.parent('controls'); }
function draw() { background(240); circle(200, 150, s.value() * 20); }
```

## Relations
- part_of [[module-dom]] — DOM creators [S357]
- part_of [[hub-language-core]] (structural)
- uses [[p5-element]] — returned wrapper [S90]
- alternative_to [[tweakpane]] — external pane [S94]
- alternative_to [[lil-gui]] — external GUI [S95]
- enables [[event-driven-redraw]] — input callbacks trigger redraw [S100]

## Sources
- [S90] — p5.js reference: createSlider()
- [S94] — Tweakpane docs home
- [S95] — lil-gui docs
- [S99] — p5.gui README
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S108] — p5.js reference: createSelect()
- [S109] — p5.js reference: createInput()
- [S111] — p5.js reference: changed()
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
