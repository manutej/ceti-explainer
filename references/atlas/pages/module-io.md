---
id: module-io
title: "IO module"
type: Module
aliases: ["IO", "IO/Input", "IO/Table", "p5.Table", "p5.TableRow", "p5.XML", "p5.PrintWriter"]
sources: [S1, S4, S11, S115, S357, S358, S359]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# IO module

## Definition
The IO module has 28 entries in three groups: Input (19), Table (2: `p5.Table`, `p5.TableRow`, both deprecated) and Time & Date (7: `day`, `hour`, `millis`, `minute`, `month`, `second`, `year`) [S357][S359]. In the 2.x reference the 1.x "Output" items were re-filed under Input [S357][S358].

## Details
- Input: close, createWriter, httpDo, httpGet, httpPost, loadBlob, loadBytes, loadJSON, loadStrings, loadTable, loadXML, p5.PrintWriter, p5.XML, save, saveJSON, saveStrings, saveTable, setContent, write; `close` and `write` are documented as global pages for `p5.PrintWriter` members [S357].
- `loadBytes` returns a `Uint8Array` directly and `loadTable`'s second parameter became a separator **[changed in 2.x]**; `p5.Table` is deprecated with a friendlier replacement planned [S11][S359].
- All `load*` functions return promises in 2.x; see [[async-setup]] [S115].
- `p5.XML` has 17 members [S357].
- `millis` supplies wall-clock time; for deterministic renders prefer `frameCount`-derived time over `millis` (see [[millis]]) [S357][S4].

## In explainer work
Rated **Medium**: `loadJSON`/`loadStrings` drive data explainers and `save` handles exports; Table is **Low** because deprecated [S357][S359].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[millis]] — Time & Date member [S357]
- related_to [[module-data]] — removed data helpers [S358]
- depends_on [[async-setup]] — loaders return promises [S115]
- related_to [[p5js-compatibility]] — data.js restores removed items [S11]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
