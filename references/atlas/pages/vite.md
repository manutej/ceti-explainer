---
id: vite
title: "Vite"
type: Tool
aliases: ["Vite bundler"]
sources: [S145, S245, S247, S248, S249, S250]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Vite

## Definition

Vite is the dev server and bundler used in community p5 plus TypeScript projects; known 2.x pitfalls are preload() errors and global-mode typing. [S247][S248]

## Details

- A Vite plus TypeScript user hit a "reading 'pixels'" error using preload(), fixed by async setup and await loadImage. [S247]
- Another got TS80007 awaiting loadImage, attributed to outdated @types/p5. [S247]
- In 2.1.1, TypeScript global mode needed both `import "p5/global"` and `import p5 from "p5"`; the proposed fix of exporting default p5 from global.d.ts had unconfirmed merge status. [S248]
- No primary documentation on Vite bundling pitfalls for 2.x beyond these was found. [S247]

## In explainer work

Use instance mode per component under Vite, and bundlers are why p5.capture (no bundler support) is awkward there. [S250][S145] See [[typescript-types]]. [S245]

## Relations

- related_to [[typescript-types]] — bundled types are the 2.x fix for stale @types/p5 [S245][S247]
- related_to [[instance-mode]] — recommended inside bundled apps [S250]
- related_to [[async-setup]] — replaces the preload() that errors under Vite [S247]
- related_to [[p5-wrapper-react]] — React wrapper often used with Vite [S249]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S145] — tapioca24/p5.capture README (tapioca24, undated)
- [S245] — PR #8114 TypeScript type generation refactor (p5.js contributors, undated)
- [S247] — Discourse: preload() with Vite + TypeScript error (Processing Community Forum, undated)
- [S248] — p5.js issue #8302 (TS + `import p5/global`, v2.1.1) (p5.js contributors, undated)
- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S250] — antfu/p5i README (Anthony Fu, undated)
