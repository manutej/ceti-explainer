---
id: explainer-clock
title: "One clock, three modes"
type: Pattern
aliases: ["live/scrub/export clock", "single clock"]
sources: [S137, S146, S308, S313, S317, S318, S330, S337]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# One clock, three modes

## Definition

One clock, three modes is the explainer-engine pattern in which all scene code reads a single clock.t, which is live wall time, an audio-derived time, a scrub-slider value, or frame/fps during export. [S146][S308][S317]

## Details

- The governing invariant comes from Remotion: every frame is a function of the frame number, and CSS animations, timers or free-running clocks flicker or drift when frames render independently. [S317][S318]
- Scene code must never read millis(), frameCount or deltaTime directly; deltaTime is only the milliseconds the previous frame took. [S337]
- Live mode: a stutter makes time jump instead of slowing the clock, which is the correct behaviour for sync with audio. [S313]
- Export mode ignores wall time entirely, as the CCapture and p5.capture write-ups stress: duration comes from frameCount divided by framerate. [S146][S308]
- Priority order in the engine: export frame/fps, then audio clock, then live performance.now, then scrubbed value. [S308][S330]

## In explainer work

This is gate 1 of the [[explainer-engine-blueprint]]; it is what lets one scene implementation serve a preview, a scrubber and [[frame-stepped-export]]. [S317] Draw loops must render `state(t)` rather than accumulate state with `x += speed`, which breaks seeking. [S337][S317]

## Patterns

### Pattern: the clock object
When to use: always; this replaces every direct time read. [S317]
```js
const clock = { mode: 'live', frame: 0, fps: 30, t0: 0, scrub: 0, audio: null,
  now() {
    if (this.mode === 'export') return this.frame / this.fps;
    if (this.audio) return this.audio.ctx.currentTime - this.audio.start;
    return this.mode === 'live' ? (performance.now() - this.t0) / 1000 : this.scrub;
  } };
function draw() { renderAt(clock.now()); }   // scenes receive t only
```
Pitfalls: any scene that calls millis() reintroduces a second clock. [S337]

## Relations

- related_to [[pure-function-of-t]] — the rule that scene code is a function of the clock value [S317]
- enables [[frame-stepped-export]] — export mode sets t from the frame index [S308]
- related_to [[audio-master-clock]] — audio mode sources t from AudioContext time [S330]
- related_to [[real-time-vs-frame-based]] — formalises the live versus frame decision [S137]
- related_to [[delta-time]] — explains why deltaTime must not drive scenes [S337]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S318] — Remotion 'The fundamentals' (Remotion, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S337] — `deltaTime` reference (p5.js, undated)
