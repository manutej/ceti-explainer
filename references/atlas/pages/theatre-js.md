---
id: theatre-js
title: "Theatre.js"
type: Library
aliases: ["@theatre/core", "Theatre.js Sheet Object", "onValuesChange", "attachAudio", "Theatre sequence.position"]
sources: [S329, S330, S331, S332, S403]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Theatre.js

## Definition

Theatre.js is a visual sequencing toolkit of projects, sheets, objects and sequences with a seekable playhead, a studio editor and audio attachment. [S329][S330]

## Details

- sequence.position is the playhead in seconds and can be read or set; sequence.play({iterationCount, range, rate}) returns a Promise resolving true on completion or false if interrupted. [S329]
- object.onValuesChange(cb) fires on any prop change (returning an unsubscribe) and object.value gives the current values; Sheet Objects can represent THREE objects, divs or virtual objects. [S329][S403]
- attachAudio({source}) decodes audio into Web Audio and plays it in sync with the sequence, possibly needing a user gesture; how sync is kept is undocumented. [S330]
- Prop types accept plain-value shorthand for numbers, booleans and strings. [S331]
- No documented p5 integration exists; examples are DOM, Three and R3F, and nothing covers a custom canvas. [S403][S329]

## In explainer work

A p5 explainer can set sheet.sequence.position from the engine clock and read obj.value in draw() to get a visual keyframe editor (inference, untested). [S329][S403] Maintenance 2026 and p5 2.x: not stated in the docs read. [S329]

## Relations

- related_to [[third-party-timeline-driving]] — p5 reads values from it each frame [S329]
- alternative_to [[audio-master-clock]] — attachAudio is a built-in version of the audio clock [S330]
- related_to [[gsap]] — another timeline engine [S332]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S329] — Theatre.js @theatre/core API (Theatre.js, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S331] — Theatre.js 'Prop types' (Theatre.js, undated)
- [S332] — GSAP core docs (GSAP (Webflow), undated)
- [S403] — Theatre.js docs, Sheet Objects (Theatre.js, undated)
