---
id: scene-local-time
title: "Scene-local time"
type: Pattern
aliases: ["Remotion Sequence port", "Timeline/scene sequencing"]
sources: [S137, S301, S319]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Scene-local time

## Definition

Scene-local time shifts t per scene so each scene sees its own zero, as Remotion's Sequence does with its from offset and nested offsets adding up. [S319]

## Details

- A Remotion Sequence with from=30 makes its children see frame 0 at composition frame 30, and nested sequences add their offsets. [S319]
- Remotion's docs no longer recommend Sequence for new code, though the excerpt did not name the replacement. [S319]
- p5.SceneManager forwards p5 events to the active scene class and switches with showScene(), so it cannot seek backwards and is a router for games rather than a timeline. [S301]
- Time windows are the video-friendly alternative: render each scene whose [start, start+dur) contains t with local time t - start. [S319][S137]
- Fade at scene boundaries instead of hard cuts. [S137]

## In explainer work

Local time makes scenes reusable and reorderable and is pattern P5 of the [[explainer-engine-blueprint]]. [S319] Do not use [[p5-scenemanager]] for scrubbable video. [S301]

## Patterns

### Pattern: scene windows
When to use: multi-scene explainers that must scrub. [S319]
```js
const scenes = [ { start: 0, dur: 8, render: intro }, { start: 8, dur: 12, render: vectors } ];
function renderScenes(t) {
  for (const s of scenes)
    if (t >= s.start && t < s.start + s.dur) { push(); s.render(t - s.start, s.dur); pop(); }
}
```
Pitfalls: wrap each scene in push/pop so transforms do not leak. [S319]

## Relations

- related_to [[p5-scenemanager]] — router that cannot seek, so a window approach replaces it [S301]
- related_to [[remotion]] — Sequence is the origin of the idea [S319]
- related_to [[normalized-time]] — local time normalises to u in 0..1 [S137]
- part_of [[explainer-engine-blueprint]] — pattern P5 [S319]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S301] — p5.SceneManager README (mveteanu / CodeGuppy, undated)
- [S319] — Remotion `<Sequence>` (Remotion, undated)
