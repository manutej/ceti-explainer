---
id: describe
title: "describe() and describeElement()"
type: Construct
aliases: ["describeElement()", "Accessible explainer canvas"]
sources: [S47, S289, S343, S348, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# describe() and describeElement()

## Definition
`describe(text, [display])` gives the whole canvas a screen-reader description; `display` is LABEL (visible) or FALLBACK (screen-reader only, the default); `describeElement(name, text)` labels one element or group [S289][S348].

## Details
- Descriptions should be 1 to 3 sentences for the whole canvas [S348].
- Remove the LABEL option before publishing, or screen readers hear duplicates [S348].
- Labels placed in `draw()` update automatically for animated sketches [S348].
- More than about 10 `describeElement()` calls suggests switching to vanilla ARIA; do not combine `textOutput()` with `describeElement()` [S348].
- Both functions are Environment-group entries [S357].

## In explainer work
Publish with `describe('Step 3 of 5: ...')` in `draw()` so the description tracks the current beat [S348][S289]. Pair with [[color-contrast]] checks for caption colors [S47].

## Patterns
**Accessible explainer canvas.** When: every published explainer. Pitfall: leaving LABEL on.
```js
function draw() {
  renderAt(t);
  describe(`Step ${step} of 5: ${captions[step]}`);
}
```

## Relations
- part_of [[module-environment]] — Environment-group entries [S357]
- part_of [[hub-language-core]] (structural)
- conflicts_with [[text-output]] — do not combine textOutput with describeElement [S348]
- related_to [[access-statement]] — accessibility values [S343]
- related_to [[pure-function-of-t]] — description updated per rendered state [S348]
- related_to [[color-contrast]] — complementary accessibility utility [S47]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S289] — describe() reference
- [S343] — p5.js Access Statement
- [S348] — Writing Accessible Canvas Descriptions (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
