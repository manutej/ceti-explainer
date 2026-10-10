---
id: lifecycle-hooks
title: "Add-on lifecycle hooks"
type: Concept
aliases: ["lifecycles object", "presetup", "postdraw"]
sources: [S117, S118, S120, S350]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Add-on lifecycle hooks

## Definition
**[2.x]** Lifecycle hooks are functions an add-on assigns on the `lifecycles` object passed by [[register-addon]]: `presetup`, `postsetup`, `predraw`, `postdraw` and `remove`; they are awaited, so may be async [S117][S118].

## Details
- Order: presetup, postsetup, predraw, postdraw, remove [S118].
- 1.x mapping: beforePreload/beforeSetup -> presetup, afterSetup -> postsetup, pre -> predraw, post -> postdraw, remove -> remove **[changed in 2.x]** [S117].
- Example add-on: a `predraw` hook that stamps a start time and a `remove` hook for cleanup [S118].
- The 2.1 Add-on Events API extends this with event hooks (see [[addon-events-api]]) [S120].

## In explainer work
Hooks let an export or timeline add-on wrap every frame without editing sketch code: `predraw` advances a virtual clock, `postdraw` captures the frame (see [[virtual-clock-capture]]) [S118][S350].

## Relations
- part_of [[register-addon]] — argument of the add-on function [S118]
- part_of [[hub-language-core]] (structural)
- related_to [[version-2x-migration]] — registerMethod hook names became lifecycles [S117]
- related_to [[setup]] — presetup/postsetup surround it [S117]
- related_to [[draw]] — predraw/postdraw surround it [S117]
- related_to [[virtual-clock-capture]] — export add-on use case (inference) [S350]

## Sources
- [S117] — Designing an addon library system for p5.js 2.0
- [S118] — Creating an Addon Library
- [S120] — p5.js v2.1.0 release notes
- [S350] — Creating Libraries (2.x contributor docs)
