---
id: p5-scenemanager
title: "p5.SceneManager"
type: Library
aliases: ["SceneManager"]
sources: [S300, S301]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.SceneManager

## Definition

p5.SceneManager (mveteanu / CodeGuppy) is a router that forwards p5 events (setup, draw, mousePressed) to the active scene class and switches with showScene(). [S301]

## Details

- It is a scene router for games and apps, not a timeline: it has no time-based scheduling. [S301]
- The official directory lists it under Utilities. [S300]
- Maintenance 2026 and p5 2.x compatibility: not stated. [S301][S300]

## In explainer work

Do not use it for scrubbable video since it cannot seek backwards; use time windows ([[scene-local-time]]) instead. [S301]

## Relations

- alternative_to [[scene-local-time]] — event-switched scenes versus time-windowed scenes [S301]
- related_to [[p5js-libraries-directory]] — listed in Utilities [S300]
- related_to [[explainer-engine-blueprint]] — explains why the blueprint avoids routers [S301]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S301] — p5.SceneManager README (mveteanu / CodeGuppy, undated)
