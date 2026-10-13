---
id: p5-media-element
title: "p5.MediaElement"
type: Construct
aliases: ["media element", "Video scrubber"]
sources: [S98, S103, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.MediaElement

## Definition
`p5.MediaElement` is the `p5.Element` subclass returned by `createVideo`, `createAudio` and `createCapture`, with 19 members: addCue, autoplay, clearCues, connect, disconnect, duration, hideControls, loop, noLoop, onended, pause, play, removeCue, showControls, speed, src, stop, time, volume [S103][S357].

## Details
- `time(t)` seeks to t seconds and `time()` returns elapsed seconds; `duration()` returns length [S103].
- `speed` accepts a rate (negative reverses, browser-dependent and may be rough) [S103].
- `onended` does not fire while the media loops; `connect` is intended for use with the p5.sound add-on [S103].
- Autoplay-policy handling and promise behavior in 2.x are not documented on the reference pages [S98].

## In explainer work
The basis for scrubbers: hide the element, draw it with `image()` and set position from a slider with `v.time(t)`; `addCue` supports narration sync [S98][S357].

## Relations
- part_of [[module-dom]] — class in DOM [S357]
- part_of [[hub-language-core]] (structural)
- is_a [[p5-element]] — subclass [S103]
- related_to [[dom-media]] — creator functions [S98]
- integrates_with [[p5-sound]] — connect() targets p5.sound [S103]
- enables [[audio-master-clock]] — time() as a clock source (inference) [S103]

## Sources
- [S98] — p5.js reference: createVideo()
- [S103] — p5.js reference: p5.MediaElement
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
