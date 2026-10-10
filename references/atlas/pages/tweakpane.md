---
id: tweakpane
title: "Tweakpane"
type: Library
aliases: ["pane"]
sources: [S90, S94, S95, S99, S110]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Tweakpane

## Definition

Tweakpane is a dependency-free parameter pane with input bindings (Number, String, Boolean, Color, Point), monitors including graphs, folders, buttons, tabs, theming and plugins; docs show v4.0.5. [S94]

## Details

- It loads from jsDelivr as an ES module, and has migration guides to v4 and from dat.GUI. [S94][S110]
- It is an alternative to p5's native DOM helpers such as createSlider. [S94][S90]
- p5-specific wiring tutorials were not found; bind it to a params object the sketch reads each frame. [S94]
- Maintenance 2026 and p5 2.x: framework-independent, so 2.x is not a constraint (inference); release dates were not retrieved. [S94]

## In explainer work

Use it to tune explainer parameters live, then freeze the values into the timeline data for export. [S94][S95]

## Relations

- alternative_to [[lil-gui]] — same job, richer monitors and plugins [S94][S95]
- alternative_to [[dom-controls]] — external panel instead of createSlider [S94][S90]
- related_to [[p5-gui]] — another GUI route [S99]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S90] — p5.js reference: createSlider() (p5.js, v2.3.3 docs)
- [S94] — Tweakpane docs home (Tweakpane (cocopon), undated, shows 4.0.5)
- [S95] — lil-gui docs (George Michael Brower, undated)
- [S99] — p5.gui README (bitcraftlab, undated)
- [S110] — Tweakpane getting started (Tweakpane, undated)
