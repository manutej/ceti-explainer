---
id: module-data
title: "Data module"
type: Module
aliases: ["Data", "Data/Conversion", "Data/LocalStorage", "Data/Utility Functions", "1.x Dictionary and Array functions (removed)", "p5.TypedDict", "createStringDict", "createNumberDict"]
sources: [S1, S4, S11, S115, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Data module

## Definition
The Data module has 19 entries in 2.x, down from 37 in 1.x: Conversion (9: boolean, byte, char, float, hex, int, str, unchar, unhex), LocalStorage (4: clearStorage, getItem, removeItem, storeItem) and Utility Functions (6: nf, nfc, nfp, nfs, shuffle, splitTokens deprecated) [S357][S358].

## Details
- **[1.x only]** Removed: `createStringDict`, `createNumberDict`, `p5.TypedDict`, `p5.StringDict`, `p5.NumberDict`, and the array helpers `append`, `arrayCopy`, `concat`, `reverse`, `shorten`, `sort`, `splice`, `subset`; string helpers `join`, `match`, `matchAll`, `split`, `trim` are also gone from the reference. Use native JS instead (folded topic data-dict-1x) [S358][S115][S357].
- `p5.Table` and `splitTokens` are deprecated, not removed [S4].
- `data.js` in [[p5js-compatibility]] restores the removed items [S11][S115].
- `createVector()` without dimensions is deprecated; pass explicit zeros [S115][S357].

## In explainer work
Rated **Low**: `nf` is useful for formatting on-screen numbers; `storeItem`/`getItem` give per-viewer persistence [S357]. Many older tutorials call removed helpers; replace with array methods or load `data.js` [S115].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- depends_on [[p5js-compatibility]] — data.js restores 1.x helpers [S11]
- related_to [[module-io]] — table and loader changes [S357]
- related_to [[version-2x-migration]] — helper removals [S115]
- related_to [[p5-vector]] — createVector dimension guidance [S115]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
