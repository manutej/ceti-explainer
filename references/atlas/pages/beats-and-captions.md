---
id: beats-and-captions
title: "Beats and captions"
type: Pattern
aliases: ["captions from timeline"]
sources: [S47, S289, S313, S322]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Beats and captions

## Definition

Beats and captions derive both the narrative structure and the on-screen subtitles from the same timeline, as Manim attaches subcaptions to play() calls. [S322]

## Details

- Manim's play() accepts subcaption arguments, and Scene provides add_subcaption() and add_sound(). [S322]
- In the p5 blueprint, tl.beat(label, caption) stores the cursor time; a caption function finds the latest beat at or before t and fades it in over about 300 ms. [S322]
- Captions are drawn after resetMatrix() so camera moves do not shift them. [S322]
- Beat labels double as chapter markers and as cue names for voiceover markers ([[audio-master-clock]]). [S313]

## In explainer work

Pair captions with an accessible description via describe() for published embeds; the 2.1 contrast checker helps validate caption-on-background pairs. [S289][S47]

## Patterns

### Pattern: captions from beats
When to use: every narrated explainer. [S322]
```js
function captions(t) {
  const b = tl.beats.findLast(b => t >= b.start); if (!b) return;
  const a = constrain((t - b.start) / 0.3, 0, 1);
  push(); resetMatrix(); fill(20, 255 * a); textAlign(CENTER); textSize(22);
  text(b.caption, width / 2, height - 40); pop();
}
```
Pitfalls: draw after the camera transform is reset. [S322]

## Relations

- related_to [[timeline-builder]] — beats are recorded by the builder [S322]
- related_to [[audio-master-clock]] — marker times line beats up with narration [S313]
- related_to [[describe]] — screen-reader description to accompany captions [S289]
- part_of [[explainer-engine-blueprint]] — pattern P6 [S322]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S289] — describe() reference (p5js.org, v2.3.3 reference)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
