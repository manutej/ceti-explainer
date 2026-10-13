---
id: game-lab
title: "Code.org Game Lab"
type: Platform
aliases: []
sources: [S199, S223, S224]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Code.org Game Lab

## Definition
Game Lab is Code.org's K-12 programming environment built on p5.js and p5.play, with a gamelab-api.js layer whose syntax differs slightly from official p5.play [S223].

## Details
- It runs on p5.js and p5.play through its own API layer [S223].
- No source was found for a Code.org curriculum teaching p5.js directly [S223].
- CodeHS also uses p5play in its game design curriculum [S224].

## In explainer work
- Many students first meet p5 through this forked layer, so explainers aimed at K-12 audiences should note syntax differences (see [[p5play]]) [S223].

## Relations
- depends_on [[p5play]] — built on p5.play [S223]
- uses [[p5js]] — underlying runtime [S223]
- related_to [[khan-academy-live-editor]] — another K-12 code environment [S199]
- related_to [[hub-people-community]] (structural)
## Sources
- [S223] — Code.org forum on migrating Game Lab code
- [S224] — CodeHS p5play library
- [S199] — Khan context
