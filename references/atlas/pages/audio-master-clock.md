---
id: audio-master-clock
title: "Audio master clock"
type: Pattern
aliases: ["voiceover markers", "Audio as master clock"]
sources: [S11, S27, S137, S138, S158, S165, S313, S330, S340]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Audio master clock

## Definition

The audio master clock pattern uses the voiceover's playback time as t and stores named voiceover markers as data, the p5 analogue of Motion Canvas waitUntil time events that are dragged to line up with narration. [S313]

## Details

- Motion Canvas waitUntil('event') pauses until a named event that the user drags in the editor to align with narration; by default moving one event also moves all later ones, and useDuration('event') makes an animation last exactly as long as an event. [S313]
- Theatre.js attachAudio decodes audio into a Web Audio context and plays it in sync whenever the sequence plays; audio may need a user gesture before the AudioContext can start. [S330]
- p5.sound v1's SoundFile.addCue(time, callback, value) is event-based, suiting triggers but not seeking. [S340]
- p5 2.x loads audio with `await` in async setup (preload is gone), so decode and marker fetches belong there. **[2.x]** [S11][S27]
- p5.sound was rebuilt on Tone.js in Dec 2024, and its 2.x status is stated only as working with both p5 1 and 2. [S165][S158]
- Scrubbing is implemented as playFrom(sliderValue): stop the source, start a new buffer source at that offset, and record the context start time. [S330]
- Real-time audio cannot be stepped by virtual-clock capture. [S138]

## In explainer work

Use audio as t in live and scrub modes, but switch to frame/fps for export and mux the voiceover afterwards ([[audio-post-mux]]). [S138][S137] The clock lives in [[explainer-clock]]. [S330]

## Patterns

### Pattern: audio clock plus markers
When to use: any recorded voiceover; durations come from markers, not code. [S313]
```js
// markers.json: {"intro":0,"arrow":3.4,"sum":9.1}  (edited by ear)
const ctx = new AudioContext(); let buf, src;
async function setup() { createCanvas(1280, 720);
  buf = await ctx.decodeAudioData(await (await fetch('vo.mp3')).arrayBuffer()); }
function playFrom(sec) { src?.stop(); src = ctx.createBufferSource(); src.buffer = buf;
  src.connect(ctx.destination); src.start(0, sec); clock.audio = { ctx, start: ctx.currentTime - sec }; }
```
Pitfalls: start only after a user gesture. [S330]

## Relations

- part_of [[explainer-engine-blueprint]] — pattern P7 [S313]
- related_to [[explainer-clock]] — audio is one source of clock.now() [S330]
- uses [[async-setup]] — decode audio and fetch markers before the first frame [S11][S27]
- related_to [[p5-sound]] — p5.sound is the p5-native audio add-on [S158]
- related_to [[theatre-js]] — attachAudio is a comparable mechanism [S330]
- related_to [[audio-post-mux]] — export uses mux, not the audio clock [S137]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S27] — Teachers' Guide to p5.js v2 (p5.js, undated)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S158] — p5.sound.js repo (Processing Foundation, undated)
- [S165] — Announcing the new p5.sound.js library (Processing Foundation, 2024-12-16)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S340] — p5.SoundFile `addCue()` (v1 reference) (p5.js, undated)
