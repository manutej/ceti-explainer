---
id: audio-post-mux
title: "Audio muxing after render"
type: Pattern
aliases: ["Audio after the fact", "audio mux"]
sources: [S137, S138, S147, S310, S313]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Audio muxing after render

## Definition

Audio post-muxing is the pattern of rendering a silent video first and adding the voiceover afterwards with ffmpeg, because stepped and virtual-clock capture do not record audio. [S137][S138]

## Details

- A representative mux is `ffmpeg -i v.mp4 -i vo.wav -c:v copy -c:a aac -shortest out.mp4`. [S137]
- CCapture breaks audio sync because audio plays in real time while capture uses simulated time; it offers renderAudioFrames() only for audio-reactive visuals. [S137][S138]
- No published tool that records p5 plus audio in sync was found beyond that helper; sources only say to mux in ffmpeg. [S138][S137]
- Plan cue points by frame index to seconds so voiceover timing is computed rather than recorded. [S137]
- p5.videorecorder is the exception: it records in real time through MediaRecorder and includes p5.sound output by default, but cannot be frame-exact. [S310]
- Mediabunny's audio-source API was not verified, and the old mp4-muxer handled video and audio muxing. [S147]

## In explainer work

For narrated explainers keep the voiceover as the timeline authority ([[audio-master-clock]]), export silent frames with [[frame-stepped-export]], then mux. [S313][S137] Voiceover marker times become data, so the same cue file drives live playback and export. [S313]

## Patterns

### Pattern: voiceover after render
When to use: every narrated explainer.
```js
// markers.json holds beat times in seconds; scenes read them as data
const frameOfBeat = (sec, fps) => Math.round(sec * fps);
// shell: render silent mp4 first, then
// ffmpeg -i v.mp4 -i vo.wav -c:v copy -c:a aac -shortest out.mp4
```
Pitfalls: -shortest trims to the shorter stream; confirm both durations match. [S137]

## Relations

- uses [[ffmpeg]] — performs the audio mux [S137]
- depends_on [[png-sequence-ffmpeg]] — requires a rendered silent video first [S137]
- related_to [[audio-master-clock]] — live playback uses the audio clock; export uses frame/fps [S313]
- related_to [[p5-videorecorder]] — real-time recorder that does include audio [S310]
- related_to [[mediabunny]] — an in-browser muxer family [S147]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S147] — Vanilagy/mp4-muxer README (Vanilagy, undated)
- [S310] — p5.videorecorder README (Caleb Foss, undated)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
