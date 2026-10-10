---
id: vscode-live-server
title: "VS Code workflow"
type: Tool
aliases: ["VS Code + Live Server", "Live Server", "P5 Server extension", "vscode-p5server", "p5.js 2.x Project Generator", "VS Code project generator"]
sources: [S137, S156, S238, S254]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# VS Code workflow

## Definition

The VS Code workflow for p5 uses plain editing plus Live Server (or the P5 Server extension, or a 2.0 project-generator extension) with one HTML file per sketch and a pinned CDN script. [S254][S156][S238]

## Details

- Oliver Steele lists three setups: P5 Server extension, Live Server, and Live Server plus GitHub; P5 Server is described as newer and less tested. [S254]
- The libraries page lists a 2.0 VS Code project generator, one of only two entries explicitly mentioning 2.x. [S156]
- A community user runs p5 2.x with no extension by pointing a script tag at a pinned jsDelivr release. [S238]
- p5.vscode itself was not found in searches. [S254]

## In explainer work

This is the lightest authoring setup for explainer sketches; combine with [[cdn-version-pinning]] and, for export, [[puppeteer-capture]]. [S238][S137]

## Relations

- related_to [[cdn-version-pinning]] — pinned script tag is the core of the workflow [S238]
- related_to [[p5js-web-editor]] — browser alternative [S254]
- related_to [[p5js-libraries-directory]] — lists the project generator [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S238] — How to manually modify the P5js plugin (stable version) to use the 2.0 version? (Processing Discourse (EricRogerGarcia, glv, quark), 2026-05-14 to 2026-06-01)
- [S254] — Oliver Steele, VS Code for p5.js (Oliver Steele, undated)
