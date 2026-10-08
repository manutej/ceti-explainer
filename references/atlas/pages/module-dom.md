---
id: module-dom
title: "DOM module"
type: Module
aliases: ["DOM", "HTML elements", "p5.File"]
sources: [S1, S11, S90, S92, S94, S95, S98, S99, S103, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# DOM module

## Definition
The DOM module has 24 entries: addElement (new), createA, createAudio, createButton, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createImg, createInput, createP, createRadio, createSelect, createSlider, createSpan, createVideo, `p5.Element`, `p5.File`, `p5.MediaElement`, removeElements, select and selectAll [S357]. `p5.File` (folded here) has 6 members: data, file, name, size, subtype, type [S357].

## Details
- DOM helpers return [[p5-element]], which wraps the raw `HTMLElement` as `elt` [S92].
- UI controls: see [[dom-controls]]; media: [[dom-media]] and [[p5-media-element]] [S90][S103].
- `input` and `changed` moved from the p5 namespace to `p5.Element` in the reference without a behavior change [S357].
- External GUI libraries (Tweakpane 4.x, lil-gui, p5.gui over QuickSettings) are alternatives to native helpers; p5.gui's 2.x compatibility is undocumented [S94][S95][S99].
- Touch events were removed from `p5.Element` along with the 1.x globals [S11].

## In explainer work
Rated **Medium**: sliders and buttons for scrubbers and play/pause controls; `p5.MediaElement` for narration sync (`time`, `addCue`) [S357]. Create controls once in `setup`, not in `draw` [S90].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[p5-element]] — wrapper class [S92]
- uses [[dom-controls]] — slider/select/input [S90]
- uses [[dom-media]] — video/audio/capture [S98]
- alternative_to [[tweakpane]] — external parameter pane [S94]
- alternative_to [[lil-gui]] — small GUI library [S95]

## Sources
- [S1] — Reference index (v2)
- [S11] — p5.js-compatibility add-ons
- [S90] — p5.js reference: createSlider()
- [S92] — p5.js reference: p5.Element
- [S94] — Tweakpane docs home
- [S95] — lil-gui docs
- [S98] — p5.js reference: createVideo()
- [S99] — p5.gui README
- [S103] — p5.js reference: p5.MediaElement
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
