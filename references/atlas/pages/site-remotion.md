---
id: site-remotion
title: "Remotion docs (source site)"
type: Site
aliases: ["remotion.dev (site)"]
sources: [S227, S317, S318, S319, S320, S321, S396, S397, S398]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# Remotion docs (source site)

## Definition
**Remotion docs** — the documentation of Remotion, the React-based programmatic video framework; operated by Remotion. [S227]

Kind: **docs**; 9 registered sources, 9 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S227][S317][S318]

## What it contributes
- Remotion's docs no longer recommend `<Sequence>` for new code [S319]
- Remotion is declarative and keyframe-based; Motion Canvas is imperative and procedural [S227]
- The Remotion Lottie page says rendering Lottie as SVG on other renderers is unsupported [S398]
- Remotion's stated rule is to drive all animation from `useCurrentFrame()` for determinism [S317]

## Pages that cite it

| page (21) | title |
|---|---|
| [[ai-assisted-p5]] | AI-assisted p5.js authoring |
| [[derived-geometry]] | Derived geometry (signals-lite) |
| [[explainer-clock]] | One clock, three modes |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[generator-scenes]] | Generator scenes |
| [[gsap]] | GSAP |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[lottie]] | Lottie |
| [[matter-js]] | Matter.js |
| [[motion-canvas]] | Motion Canvas |
| [[open-questions]] | Open questions and conflicts |
| [[p5play]] | p5play |
| [[pure-function-of-t]] | Pure function of t |
| [[remotion]] | Remotion |
| [[scene-local-time]] | Scene-local time |
| [[seeded-determinism]] | Seeded determinism |
| [[third-party-timeline-driving]] | Driving third-party timelines from p5 |
| [[three-js]] | three.js |
| [[timeline-builder]] | Timeline builder (play/wait/all/stagger) |
| [[track-tween]] | Track tween (alpha model) |
| [[video-export-pipeline]] | Video export pipeline |

## Reliability
- Coverage: 9 sources (9 rated primary, 0 secondary by the researchers); year range no year recorded, 9 without a recorded date. [S227][S317][S318]
- Researcher caveat on S227: vendor-authored, biased toward Remotion. This limits how far the wiki leans on the page [S227]
- Researcher caveat on S321: v4.0.517+. This limits how far the wiki leans on the page [S321]
- Noted gap: Source quality:  and  are aggregator-style, give no dates, and disagree in emphasis (one lists Motion Canvas as browser-only rendering and also mentions a headless CLI).  is vendor-authored and biased toward Remotion. 's Manim "LaTeX not mentioned" means the post is silent, not that Manim lacks LaTeX. [S227]
- Noted gap: **Motion Canvas seeking.** I could not verify from the fetched docs how Motion Canvas seeks: whether it replays generators from the start or caches. Remotion explicitly documents the replay-from-zero cost for GSAP. [S321]
- Noted gap: **Remotion `<Sequence>` deprecation direction.** The docs say Sequence is "no longer recommended for new code"  but the fetched excerpt did not name the replacement. [S319]

## Sources
- [S227] — Remotion vs Motion Canvas (Remotion docs) (docs; undated)
- [S317] — Remotion "CSS animations" troubleshooting (docs; undated)
- [S318] — Remotion "The fundamentals" (docs; undated)
- [S319] — Remotion `<Sequence>` (docs; undated)
- [S320] — Remotion `<ThreeCanvas>` (docs; undated)
- [S321] — Remotion `useGsapTimeline()` (docs; undated (v4.0.517+))
- [S396] — Remotion docs, Third-party libraries (docs; undated)
- [S397] — Remotion docs, GSAP (docs; undated)
- [S398] — Remotion docs, Lottie (docs; undated)
