---
id: site-theatrejs
title: "Theatre.js docs (source site)"
type: Site
aliases: ["theatrejs.com (site)"]
sources: [S329, S330, S331, S403]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# Theatre.js docs (source site)

## Definition
**Theatre.js docs** — the documentation of Theatre.js, a keyframe animation toolkit for JavaScript; operated by Theatre.js. [S329]

Kind: **docs**; 4 registered sources, 4 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S329][S330][S331]

## What it contributes
- Theatre.js `sequence.position` is the playhead in seconds and can be read or set [S329]
- Theatre.js audio playback may need a user gesture before the AudioContext can start [S330]
- Theatre.js number, boolean and string props accept plain-value shorthand in `sheet.object` [S331]

## Pages that cite it

| page (10) | title |
|---|---|
| [[audio-master-clock]] | Audio master clock |
| [[explainer-clock]] | One clock, three modes |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[gsap]] | GSAP |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[open-questions]] | Open questions and conflicts |
| [[p5-sound]] | p5.sound |
| [[theatre-js]] | Theatre.js |
| [[third-party-timeline-driving]] | Driving third-party timelines from p5 |
| [[tone-js]] | Tone.js |

## Reliability
- Coverage: 4 sources (4 rated primary, 0 secondary by the researchers); year range no year recorded, 4 without a recorded date. [S329][S330][S331]
- Noted gap: **Theatre.js + p5.** No documented p5 integration exists. Theatre's examples are DOM, Three and R3F. P14 is my own design based on documented APIs. How `attachAudio` actually keeps sync (audio-clock-driven or not) is not documented. [S329][S330]

## Sources
- [S329] — Theatre.js @theatre/core API (docs; undated)
- [S330] — Theatre.js "Using Audio" (docs; undated)
- [S331] — Theatre.js "Prop types" (docs; undated)
- [S403] — Theatre.js docs, Sheet Objects (docs; undated)
