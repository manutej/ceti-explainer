---
id: lil-gui
title: "lil-gui"
type: Library
aliases: []
sources: [S90, S94, S95, S99]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# lil-gui

## Definition

lil-gui is a small (about 29.8 kB minified) GUI library by George Michael Brower that builds controllers from property types via add(), addColor() and addFolder(). [S95]

## Details

- add(obj, prop) yields checkbox, text, number or button controllers; min and max give a slider; an array or object gives a dropdown. [S95]
- onChange fires per change and onFinishChange when a change completes, suited to slow handlers; the UMD build exposes lil.GUI, default width 245 px. [S95]
- p5-specific wiring tutorials were not found. [S95]
- Maintenance 2026 and p5 2.x: framework-independent; dates not retrieved. [S95]

## In explainer work

Use onFinishChange for expensive recomputation such as re-resampling text contours. [S95]

## Relations

- alternative_to [[tweakpane]] — smaller, simpler [S94][S95]
- alternative_to [[dom-controls]] — external panel instead of p5 DOM helpers [S95][S90]
- related_to [[p5-gui]] — another GUI route [S99]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S90] — p5.js reference: createSlider() (p5.js, v2.3.3 docs)
- [S94] — Tweakpane docs home (Tweakpane (cocopon), undated, shows 4.0.5)
- [S95] — lil-gui docs (George Michael Brower, undated)
- [S99] — p5.gui README (bitcraftlab, undated)
