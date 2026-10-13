---
id: timeplate
title: "JS timeline micro-libraries"
type: Library
aliases: ["keyframes (mattdesl)", "keytime", "Timeliner", "zz85/timeliner"]
sources: [S304, S305, S306, S307]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# JS timeline micro-libraries

## Definition

JS timeline micro-libraries (timeplate, mattdesl/keyframes, Timeliner) are small non-p5 helpers for millisecond timelines, unitless keyframe lists and an embeddable keyframe GUI. [S305][S306][S307]

## Details

- timeplate composes millisecond timelines with Timeplate.parallel and Timeplate.series using normalised 0 to 1 keyframe offsets. [S305]
- mattdesl/keyframes uses unitless time, clamps before the first and after the last key, and exposes interpolation(t) returning [startIndex, endIndex, factor] for custom easing. [S306]
- Timeliner is a lightweight embeddable GUI that writes keyframed values onto a plain JS target object, making it library-agnostic. [S307]
- A 2020 forum request for a Premiere-like p5 timeline got no substantive answer as of 2023. [S304]
- Maintenance 2026 and p5 2.x: not established; the READMEs read were undated. [S305][S306][S307]

## In explainer work

Timeliner is the closest drop-in for a scrubbable keyframe GUI feeding p5 state; keyframes' interpolation(t) maps onto the [[track-tween]] model. [S307][S306]

## Relations

- related_to [[track-tween]] — keyframes interpolation is the same idea [S306]
- related_to [[timeline-builder]] — compiled alternative authoring layer [S305]
- related_to [[third-party-timeline-driving]] — Timeliner writes onto a plain object p5 reads [S307]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S304] — 'P5.js Simple Timeline' (Processing Forum, 2020)
- [S305] — timeplate README (ScarletsFiction/StefansArya, undated)
- [S306] — keyframes README (Matt DesLauriers, undated)
- [S307] — Timeliner README (HalfdanJ (fork of zz85), undated)
