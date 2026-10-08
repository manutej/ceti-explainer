---
id: p5-wrapper-react
title: "@p5-wrapper/react"
type: Library
aliases: ["@p5-wrapper/next", "react-p5 successor", "Framework wrapper"]
sources: [S247, S249, S250, S251]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# @p5-wrapper/react

## Definition

@p5-wrapper/react v5 is the React wrapper that requires p5 >= 2.0.0 and React >= 19, works in instance mode and ships its own types; Next.js users should use @p5-wrapper/next. [S249]

## Details

- The main component is P5Canvas (replacing ReactP5Wrapper in v5) with props sketch, updateWithProps, updater, fallback, error and loading. [S249]
- Types include Sketch and P5CanvasInstance; constructors are reached via p5.constructor, e.g. Vector. [S249]
- Plugins like p5.sound require setting p5 on window before importing. [S249]
- Unmount cleanup matters: a 1.7.0 bug left canvases orphaned when remove() ran before setup completed, relevant under hot reload; 2.x behaviour should be verified. [S251]
- Maintenance 2026: README current for v5; v4 users are pointed to older docs. **[2.x]** [S249]

## In explainer work

Use it to embed multiple explainer scenes in React pages; each scene is an instance-mode sketch, which also isolates clocks. [S249][S250]

## Relations

- uses [[instance-mode]] — sketches are instance-mode functions [S249]
- depends_on [[p5js-2x]] — v5 requires p5 >= 2.0.0 [S249]
- alternative_to [[p5i]] — framework wrapper versus tiny instance helper [S249][S250]
- related_to [[vite]] — common bundler pairing [S247]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S247] — Discourse: preload() with Vite + TypeScript error (Processing Community Forum, undated)
- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S250] — antfu/p5i README (Anthony Fu, undated)
- [S251] — p5.js issue #6311 (remove() before _setupDone leaves canvas; 1.7.0) (p5.js contributors, undated)
