---
id: etienne-jacob
title: "Etienne Jacob"
type: Practitioner
aliases: ["bleuje"]
sources: [S136, S184, S185, S186, S187, S188]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Etienne Jacob

## Definition
Etienne Jacob (bleuje) is a Paris-based software engineer who makes black-and-white looping animations and publishes the clearest written recipe for seamless loops [S184][S187][S186].

## Details
- His loops are black and white, often dot-based, built around space-filling curves and spirals [S187].
- His main tool is Processing (Java); he also uses openFrameworks and occasionally GLSL — not p5.js [S185].
- He exports MP4 for the main gallery and social media and offers a GIF gallery for smoother looping [S185].
- His recipe: a 1-periodic function of time, a mapping onto a visual property, and an offset function; any offset loops perfectly [S186].
- Offsets include radial distance, linear (x+2y), spiral (distance plus angle) and noise, and extend to 3D [S186].
- He treats looping as a constraint that shapes which forms are possible [S187].
- A TouchDesigner tutorial recreates one of his sketches, a sign of cross-tool influence [S136].

## In explainer work
- His periodic-function-plus-offset model is the backbone of [[loop-phase-animation]] and [[grid-offset-loop]]: make every frame a pure function of phase t [S186].
- Because he works in Processing, his techniques are lineage evidence — they port to p5 directly but are not p5 examples [S185].

## Relations
- uses [[processing]] — main animation tool [S185]
- uses [[openframeworks]] — secondary tool [S185]
- teaches [[loop-phase-animation]] — periodic-time tutorial [S186]
- demonstrates [[grid-offset-loop]] — offset-function examples [S186]
- related_to [[dave-whyte]] — same loop-GIF lineage [S188]
- related_to [[hub-people-community]] (structural)
## Sources
- [S184] — bleuje.com
- [S185] — bleuje FAQ: tools, export
- [S186] — bleuje loop tutorial
- [S187] — Colossal feature
- [S136] — TouchDesigner recreation
- [S188] — Bees and Bombs profile
