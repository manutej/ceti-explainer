---
id: coding-train-episode-package
title: "Coding Train episode package"
type: Pattern
aliases: ["Video plus runnable sketch", "explainer distribution"]
sources: [S105, S132, S142, S182, S199, S204, S209, S210, S211, S217, S221, S385, S386, S387]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Coding Train episode package

## Definition
The Coding Train episode package is the distribution pattern of pairing every explainer video with timestamped chapters, a runnable web-editor sketch, reference links and a community remix showcase, so each episode compounds [S386][S142][S387].

## Details
- Challenge pages embed the video, list chapters, link a runnable p5 web-editor sketch and host a showcase of viewer remixes [S386][S142].
- Long derivations are split into parts that each end in a working sketch, as in the three-part Fourier challenge [S221].
- The lineage runs back to Khan Academy's live editor, which paired a code editor (left) with a canvas (right) and a video track, running code automatically [S199].
- Variants: embedded simulations in slide lessons via editor iframes (Dynamic Learning) and markdown explorables with instance-mode canvases [S211][S105].
- Classroom evidence: CHI '23 found linting and auto-format well received but auto-refresh polarizing, lifted from 3.1 to 3.7 by delay and lint-aware refresh [S204].
- NYC teaching fellows found teachers new to CS need pedagogy support, not just content; Everyone Can Code used ~90-minute modules with half instruction, half experimentation [S209][S210].
- ITP Camp taught a train-in-Teachable-Machine, deploy-with-ml5-in-p5 sequence as a packaged session [S217].

## In explainer work
- For a p5 explainer, the package turns a one-off video into a reusable asset: the sketch is the "source", the video the narration, the showcase the feedback loop [S386][S385].
- Shiffman notes the web editor works poorly on mobile and tablet, so embeds need a fallback (video or GIF) [S385].

## Patterns
**Name:** video + runnable sketch + showcase.
**When to use:** publishing any p5 explainer that viewers should be able to remix [S386].
```text
episode/
  video.mp4        chapters: 00:00 intro, 02:10 idea, ...
  sketch-link      editor.p5js.org/<account>/<sketch>   (one per part)
  refs.md          reference pages + prior episodes (prerequisites)
  showcase/        viewer remixes, moderated
```
**Pitfalls:** challenges assume prior Track concepts, so list prerequisites; auto-refresh in the editor can crash capture or annoy learners — give control over when code runs [S182][S204][S132].

## Relations
- part_of [[coding-train]] — the show's publishing format [S386]
- uses [[p5js-web-editor]] — hosts runnable sketches [S386]
- related_to [[khan-academy-live-editor]] — editor-beside-canvas ancestor [S199]
- related_to [[explorable-documents-template]] — explorable variant [S105]
- related_to [[dynamic-learning]] — slide-embedded variant [S211]
- related_to [[p5-education-research]] — editor-feature evidence [S204]
- related_to [[hub-people-community]] (structural)
## Sources
- [S386], [S142], [S387] — challenge pages
- [S221] — CC 130 multi-part structure
- [S199] — Khan Academy CS launch
- [S211] — Dynamic Learning
- [S105] — explorable documents template
- [S204] — CHI '23 editor study
- [S209], [S210] — NYC schools; Everyone Can Code
- [S217] — ITP Camp ML session
- [S385] — Shiffman interview
- [S182], [S132] — prerequisites; auto-refresh warning
