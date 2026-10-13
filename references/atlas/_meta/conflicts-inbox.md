# conflicts-inbox — append one line per conflict found while writing (C4 folds into open-questions)

slug | conflict (one line) | S-ids
---|---|---
p2dhdr | conflict | 2.0.0 notes name P2DHDR canvas + RGBHDR mode vs. 2.3.1 rename HDR->P3 (RGBP3/P2DP3 in reference): naming of the HDR/P3 constants differs across versions | S4, S1, S9
p2dhdr | conflict (corrected S-ids; ignore S9 in previous line) | S4, S10, S62
p5-vector | conflict | S74 vs S11: createVector() zero-arg form: reference = deprecated with warning; compat README = explicit dimensions required
shape-custom-shapes | conflict | Tutorial says Bezier shape must start with vertex() but its final example starts with bezierVertex; reference says initial anchor needed only when no earlier vertices | S26, S6
shape-attributes | conflict | 2.0 notes name linesMode(SIMPLE) in one place and strokeMode in a changelog entry (WebGL stroke simplification); naming unresolved | S4, S359
collision-curve-packing | conflict | S367, S373 (Fidenza authoring toolchain: reviewer says 'Quill'/Quil source, Hobbs says Clojure; shipped artifact p5-style JS; declared p5 version unconfirmed)
ccapture | conflict | S131 vs S138 (maintenance: "unmaintained 8 years, p5 0.9.0" vs README documenting WebCodecs mp4/webm, gifenc, p5 recipe)
p5-capture | conflict | S145 vs S159 (README gives no version/releases while npm shows 1.6.1 published 2026-04-15; p5 2.x status unstated)
p3-hdr-color | conflict | RGBHDR (2.0.0 notes) vs RGBP3 (reference, lists not in 2.0 notes) vs HDR renamed to P3 in 2.3.1: constant naming differs by version | S4, S62, S30
color-mode | conflict | Default channel ranges for HWB/LAB/LCH/OKLAB/OKLCH/RGBP3 and lerpColor hue-path handling are undocumented in the reference (gap, not source disagreement) | S30, S42
cdn-version-pinning | conflict | S47 vs S11 vs S404 (Web Editor 2.x default: July 2026 per Foundation blog, August per compatibility README; editor release v2.22.0 dated 31 Jul)
third-party-timeline-driving | conflict | S332 vs S321 (whether GSAP tweens plain objects: docs fetched show selector examples only; Remotion hook restricts to elements)
text-to-points | conflict | Signature in reference is (str,x,y,options) but capability-map pattern passes a font size before options | S32, S4
text-width | conflict | compat README inconsistent on textWidth vs fontWidth leading/trailing space handling; 2.1.0 notes a textWidth fix; PR 8088 fontWidth merge status unverified | S115, S120, S44
text-to-contours | conflict | Reference spells textToContours/textToModel; Coding Train video and 2.0 prose spell textContours/textModel | S46, S32
motion-canvas | conflict | S316, S324 vs S312, S313, S314 (original reported unmaintained/site offline vs docs pages fetchable 2026-10-08)
p5js-compatibility | conflict | compat README says 1.x supported until Aug 2026 vs dev-update: no 1.x updates after end of March 2026 | S11, S75
decorators-api | conflict | Decorator API dated to 2.2.3 (23 Mar) vs 2.3.0 with initial guide in 2.3.3 | S119, S274, S10
addon-events-api | conflict | Add-on Events API (2.1) vs lifecycles via registerAddon (2.0): B16 calls the 2.1 API a lifecycle-hooks API; B06 shows lifecycle hooks already in 2.0 | S47, S117
perf-regressions-2x | conflict | S4, S267 (2.0 notes: textToPoints ~350% faster; perf branch: no quantified 2.x text-performance data)
version-2x-migration | conflict | Editor default date: Foundation blog says July 2026; issue 8870 / forum plan say start of August 2026; issue marks editor update done 31 Jul; B21 says switched 2026-07-31 | S47, S114, S75
version-2x-migration | conflict | 2.3.0 release dated 28 May (GitHub release page) vs 22 Jun 2026 (Foundation write-up) | S121, S274
