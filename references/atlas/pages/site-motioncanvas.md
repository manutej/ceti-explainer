---
id: site-motioncanvas
title: "Motion Canvas docs (source site)"
type: Site
aliases: ["motioncanvas.io (site)"]
sources: [S231, S312, S313, S314, S315]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# Motion Canvas docs (source site)

## Definition
**Motion Canvas docs** — the documentation of Motion Canvas, a TypeScript animation library with a generator-based timeline; operated by Motion Canvas. [S312]

Kind: **docs**; 5 registered sources, 5 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S231][S312][S313]

## What it contributes
- Motion Canvas allows separate preview and render frame rates [S315]
- By default, moving a Motion Canvas time event also moves all later events [S313]
- Motion Canvas has a built-in Latex component; the fill colour must be set or nothing is shown [S231]

## Pages that cite it

| page (13) | title |
|---|---|
| [[audio-master-clock]] | Audio master clock |
| [[audio-post-mux]] | Audio muxing after render |
| [[beats-and-captions]] | Beats and captions |
| [[derived-geometry]] | Derived geometry (signals-lite) |
| [[explainer-clock]] | One clock, three modes |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[ffmpeg]] | FFmpeg |
| [[generator-scenes]] | Generator scenes |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[manim]] | Manim |
| [[motion-canvas]] | Motion Canvas |
| [[open-questions]] | Open questions and conflicts |
| [[timeline-builder]] | Timeline builder (play/wait/all/stagger) |

## Reliability
- Coverage: 5 sources (5 rated primary, 0 secondary by the researchers); year range no year recorded, 5 without a recorded date. [S231][S312][S313]
- Noted gap: **Motion Canvas seeking.** I could not verify from the fetched docs how Motion Canvas seeks: whether it replays generators from the start or caches. Remotion explicitly documents the replay-from-zero cost for GSAP. [S315]
- Noted gap: **Motion Canvas status.** Sláma and HN commenters say the original project is unmaintained and motioncanvas.io is offline. Yet the motioncanvas.io docs pages were fetchable on 2026-10-08. Possibly a mirror or restored site; unresolved. [S312][S313][S314]

## Sources
- [S231] — Motion Canvas docs, LaTeX (docs; undated)
- [S312] — Motion Canvas Quickstart (docs; undated)
- [S313] — Motion Canvas Time Events (docs; undated)
- [S314] — Motion Canvas Signals (docs; undated)
- [S315] — Motion Canvas Rendering (docs; undated)
