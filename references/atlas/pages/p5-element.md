---
id: p5-element
title: "p5.Element"
type: Construct
aliases: ["DOM wrapper", "DOM element"]
sources: [S11, S90, S92, S100, S103, S111, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.Element

## Definition
`p5.Element` is the wrapper returned by DOM helpers, exposing style, layout and attribute methods, event methods, and the raw element as `elt` [S92]. The 2.x reference lists 36 members [S357].

## Details
- Members include addClass, attribute, center, changed, child, class, doubleClicked, draggable, dragLeave, dragOver, drop, elt, hasClass, height, hide, html, id, input, mouseClicked/Moved/Out/Over/Pressed/Released/Wheel, parent, position, remove, removeAttribute, removeClass, show, size, style, toggleClass, value, width [S357].
- Event methods accept a callback; passing `false` disables it; some mobile browsers may fire mousePressed, mouseReleased and mouseClicked on a quick tap [S92].
- `remove()` also stops audio/video streams and clears callbacks [S92].
- `input` and `changed` are documented under `p5.Element`; the exact difference between them is not documented in the fetched pages [S357][S111].
- Touch events were removed from `p5.Element` in 2.x **[changed in 2.x]** [S11].

## In explainer work
Use `.parent('controls')` to mount sliders in page layout, and `s.input(redraw)` with `noLoop()` for event-driven redraw (test `input` vs `changed`) [S90][S100].

## Relations
- part_of [[module-dom]] — class in DOM [S357]
- part_of [[hub-language-core]] (structural)
- related_to [[p5-media-element]] — subclass for media [S103]
- related_to [[dom-controls]] — returned by creators [S90]
- related_to [[event-driven-redraw]] — input/changed trigger redraw [S100]
- related_to [[pointer-events]] — mouse* methods follow pointer model (inference) [S92]

## Sources
- [S11] — p5.js-compatibility add-ons
- [S90] — p5.js reference: createSlider()
- [S92] — p5.js reference: p5.Element
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S103] — p5.js reference: p5.MediaElement
- [S111] — p5.js reference: changed()
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
