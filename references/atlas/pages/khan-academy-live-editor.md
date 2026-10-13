---
id: khan-academy-live-editor
title: "Khan Academy Live Editor"
type: Platform
aliases: ["Computer Programming curriculum editor", "John Resig", "StructuredJS", "Editor-beside-canvas lesson"]
sources: [S199, S200, S201, S202, S204]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Khan Academy Live Editor

## Definition
The Khan Academy Live Editor is the real-time code editor beside a canvas that powers Khan Academy's computer-programming curriculum; it runs JavaScript via a customised ProcessingJS, not p5.js [S201][S199].

## Details
- Khan's CS section launched in 2012, built by John Resig with JavaScript and Processing.js [S199].
- Each lesson paired a live editor (left) with a canvas (right) and a video or interactive track; code ran automatically, with sliders on numbers, colour pickers and live error messages [S199].
- The Live Editor supports JS (via Processing.js), web code and SQL; Resig also built StructuredJS to analyse learner code structure for hints [S201].
- Khan's ProcessingJS variant excludes Java-like syntax (class, extends), restricts images and sounds, and uses degrees by default; the support page does not mention p5.js [S200].
- A 2015 Khan blog post described the editor as used by millions of students [S202].
- A 2012 reviewer found it fun but lacking guidance for moving to independent HTML5/JS [S199].

## In explainer work
- It is the template for "explain by letting the learner edit code": literal sliders and instant re-run make a parameter's effect visible (see [[coding-train-episode-package]]) [S199].
- CHI '23 found auto-refresh polarizing in p5 classrooms, so copy the layout but give learners control over when code runs [S204].

## Relations
- uses [[processingjs]] — JS mode runs on Processing.js [S201]
- related_to [[coding-train-episode-package]] — editor-beside-canvas lineage [S199]
- related_to [[p5js-web-editor]] — p5's equivalent browser editor [S204]
- related_to [[p5-education-research]] — auto-refresh evidence [S204]
- related_to [[hub-people-community]] (structural)
## Sources
- [S199] — Dice on Khan's 2012 CS launch
- [S200] — Khan ProcessingJS support page
- [S201] — Resig, Khan Academy project page
- [S202] — Khan CS blog on the real-time editor
- [S204] — CHI '23 editor study
