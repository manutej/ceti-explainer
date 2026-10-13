---
id: p5-gui
title: "p5.gui"
type: Library
aliases: ["QuickSettings", "bitcraftlab p5.gui"]
sources: [S94, S95, S99]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.gui

## Definition

p5.gui (bitcraftlab) auto-generates a GUI from sketch variables using QuickSettings, supports instance mode via p.createGui(this), and uses Min/Max/Step suffixes for slider ranges. [S99]

## Details

- The README lists no p5 version support and no releases, and the QuickSettings repo URL guess 404ed, so maintenance and 2.x compatibility are unknown. [S99]
- It depends on QuickSettings (bit101). [S99]

## In explainer work

Prefer [[tweakpane]] or [[lil-gui]] for new work given the undocumented status. [S99][S94]

## Relations

- alternative_to [[tweakpane]] — auto-generated versus hand-bound panel [S99][S94]
- alternative_to [[lil-gui]] — same job [S99][S95]
- related_to [[instance-mode]] — supports it via createGui(this) [S99]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S94] — Tweakpane docs home (Tweakpane (cocopon), undated, shows 4.0.5)
- [S95] — lil-gui docs (George Michael Brower, undated)
- [S99] — p5.gui README (bitcraftlab, undated)
