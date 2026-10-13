---
id: p5-animation-framework
title: "p5_animationFramework"
type: Library
aliases: ["pirelaurent framework", "Scenario / Journey", "Tripod camera", "Terres Rares cyber opera"]
sources: [S302, S303]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5_animationFramework

## Definition

p5_animationFramework (pirelaurent) is a class hierarchy plus scenario/journey scheduler for p5 3D animations, built for the cyber-opera Terres Rares on a 3840x1080 totem. [S302][S303]

## Details

- Scenarios restart generators at set times; journeys define changes to any data over time, with parameters in one journey able to start and end at different times. [S302]
- It supports Bezier trajectories and time-warp functions, and mounts cameras on movable tripods that receive scenario-driven moves and jumps between tripods. [S302]
- Maintenance 2026 and 2.x: not stated; the forum announcement dates from 2022-04-07. [S303]

## In explainer work

Its tripod/camera split is the 3D precedent for the keyed camera in the [[explainer-engine-blueprint]]. [S302]

## Relations

- related_to [[explainer-engine-blueprint]] — source of the camera-choreography idea [S302]
- related_to [[generator-scenes]] — scenarios restart generators [S302]
- related_to [[p5-camera]] — tripods carry cameras [S302]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S302] — p5_animationFramework README (pirelaurent, undated)
- [S303] — 'Free productive animation framework for p5.js' (pirela (Processing Forum), 2022-04-07)
