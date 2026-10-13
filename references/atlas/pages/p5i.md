---
id: p5i
title: "p5i"
type: Library
aliases: ["antfu/p5i"]
sources: [S249, S250]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5i

## Definition

p5i (Anthony Fu) is an instance-mode wrapper that allows destructuring and deferred mounting, with TypeScript types. [S250]

## Details

- Plain instance mode forces a prefix on every call, and destructuring functions from the instance loses `this` in callbacks, which p5i addresses. [S250]
- The author calls global mode a poor fit for multi-component pages because it pollutes window. [S250]
- Maintenance 2026 and p5 2.x: not stated in the README. [S250]

## In explainer work

Use for component-style explainer sketches when you want global-like syntax without globals. [S250]

## Relations

- alternative_to [[instance-mode]] — removes the verbosity of plain instance mode [S250]
- alternative_to [[p5-wrapper-react]] — lighter, framework-agnostic [S249][S250]
- related_to [[global-mode]] — avoids its window pollution [S250]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S250] — antfu/p5i README (Anthony Fu, undated)
