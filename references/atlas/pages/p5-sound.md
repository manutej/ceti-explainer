---
id: p5-sound
title: "p5.sound"
type: Library
aliases: ["p5.sound.js", "Tommy Martinez", "p5.SoundFile.addCue", "addCue", "1.x p5.sound extras"]
sources: [S103, S114, S137, S138, S158, S159, S165, S249, S310, S330, S340, S357, S358, S405]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.sound

## Definition

p5.sound.js is the official audio add-on, rebuilt from scratch on Tone.js (announced 2024-12-16) as a minimal abstraction that works with both p5 1 and 2. [S158][S165]

## Details

- Maintenance 2026: npm 0.4.1 published 2026-07-21 (LGPL-2.1, depends on tone ^15.0.2), released as part of the 2.x default switch, with 11 open issues and 1 open PR at fetch time. **[2.x]** [S159][S114][S158]
- The 2.x reference documents 24 classes versus 30+ in 1.x; Part, Phrase, Score, SoundLoop, MonoSynth, PolySynth, SoundRecorder, PeakDetect and others are gone. **[changed in 2.x]** [S357][S358]
- Kept classes include SoundFile, FFT, Amplitude and AudioIn, useful for narration playback and audio-reactive visuals. [S357]
- The Foundation says the old p5.js-sound is no longer maintained, and the Download page warns the Complete Library zip's p5.sound.js is outdated and incompatible with 2.x. [S165][S405]
- p5.SoundFile.addCue(time, callback, value) existed in v1; its status in the rebuild is not stated. [S340]
- Plugins like p5.sound need window.p5 set first when imported through @p5-wrapper/react. [S249]
- p5.MediaElement.connect is intended for use with this add-on. [S103]

## In explainer work

Use SoundFile for narration only as a clock source with care: real-time playback cannot be stepped, so export silent and mux ([[audio-post-mux]]). [S138][S137] See [[audio-master-clock]]. [S330]

## Relations

- depends_on [[tone-js]] — wraps Tone.js [S158][S159]
- integrates_with [[p5js-2x]] — states compatibility with p5 1 and 2 [S158]
- related_to [[audio-master-clock]] — narration clock source [S158]
- related_to [[p5-videorecorder]] — recorder that includes its output [S310]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S103] — p5.js reference: p5.MediaElement (p5.js, v2.3.3 docs)
- [S114] — Issue #8870 plan to make 2.x the Editor default (processing/p5.js, 2026)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S158] — p5.sound.js repo (Processing Foundation, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S165] — Announcing the new p5.sound.js library (Processing Foundation, 2024-12-16)
- [S249] — P5-wrapper/react README (P5 Wrapper authors, undated)
- [S310] — p5.videorecorder README (Caleb Foss, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S340] — p5.SoundFile `addCue()` (v1 reference) (p5.js, undated)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types) (Processing Foundation, 2026-09-30)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries) (Processing Foundation, 2026-10-02)
- [S405] — p5.js Download page (p5.js team, undated)
