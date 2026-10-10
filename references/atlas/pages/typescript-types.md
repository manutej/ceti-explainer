---
id: typescript-types
title: "Bundled TypeScript types"
type: Capability
aliases: ["p5.d.ts", "p5/global", "global.d.ts", "@types/p5", "DefinitelyTyped p5"]
sources: [S10, S47, S245, S247, S248, S249, S250]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Bundled TypeScript types

## Definition

p5.js ships bundled TypeScript types generated from its docs, a single p5.d.ts plus global.d.ts, credited to release 2.1; the old @types/p5 package is stale for 2.x. [S47][S245][S247]

## Details

- The generation refactor proposed in PR #8114 emits p5.d.ts and global.d.ts with integration tests in test/types; p5.strands GLSL methods are typed as any and length(vec) is omitted (merge status not confirmed) [S245].
- @types/p5 still types loadImage as synchronous, so awaiting it raises TS80007, and its latest version was not confirmed. [S247]
- In 2.1.1, global mode needed both `import "p5/global"` and `import p5 from "p5"`; the proposed fix of `export default p5` had unconfirmed merge status. [S248]
- v2.3.4 fixed a missing type declarations issue. [S10]
> **Conflict:** bundled types are credited to 2.1 [S47] yet a v2.3.4 fix mentions missing type declarations [S10]; the #8302 status is unverified.

## In explainer work

Use the bundled types (and instance mode per component) to catch the preload-to-await migration mistakes that LLM-written sketches make. [S247][S250] See [[vite]]. [S248]

## Relations

- related_to [[vite]] — where the 2.x typing pitfalls were reported [S247][S248]
- related_to [[async-setup]] — types make the await pattern checkable [S247]
- related_to [[p5-wrapper-react]] — ships its own Sketch types too [S249]
- related_to [[release-2-1]] — introduced TypeScript support [S47]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4) (p5.js maintainers, Jul to 25 Sep (2.3.x))
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S245] — PR #8114 TypeScript type generation refactor (p5.js contributors, undated)
- [S247] — Discourse: preload() with Vite + TypeScript error (Processing Community Forum, undated)
- [S248] — p5.js issue #8302 (TS + `import p5/global`, v2.1.1) (p5.js contributors, undated)
- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S250] — antfu/p5i README (Anthony Fu, undated)
