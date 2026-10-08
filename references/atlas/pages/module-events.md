---
id: module-events
title: "Events module"
type: Module
aliases: ["Events", "Device motion events", "Events/Acceleration", "device motion"]
sources: [S1, S10, S11, S97, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Events module

## Definition
The Events module has 49 entries in three groups: Pointer (22), Keyboard (8) and Acceleration (19) [S357]. Pointer merges the 1.x Mouse and Touch submodules **[changed in 2.x]** [S358][S357]. Folded topic Events/Acceleration is device motion (`accelerationX/Y/Z`, `deviceMoved`, `deviceOrientation`, `deviceShaken`, `rotationX/Y/Z`, `setMoveThreshold`, `setShakeThreshold`, `turnAxis` and previous-value variants) [S357].

## Details
- Pointer: doubleClicked, exitPointerLock, mouseButton, mouseClicked, mouseDragged, mouseIsPressed, mouseMoved, mousePressed, mouseReleased, mouseWheel, mouseX, mouseY, movedX, movedY, pmouseX/Y, pwinMouseX/Y, requestPointerLock, touches, winMouseX/Y [S357].
- `mouseButton` became an object of booleans (left, right, center) and `touchStarted/Moved/Ended` were removed in favor of mouse handlers plus `touches` [S11].
- Keyboard: `code` is new; `keyCode` is deprecated in favor of `key`/`code`; `keyIsDown()` takes strings or constants in 2.x and `keyIsDown(UP_ARROW)` works in both versions [S357][S97][S11].
- `events.js` in [[p5js-compatibility]] restores 1.x keyCode behavior [S11].
- 2.3.1 fixed `orbitControl` after a touch swipe and `mouseIsPressed` after clicking DOM elements [S10].

## In explainer work
Rated **Medium**: key-driven stepping through beats (`keyPressed` + `code`) for interactive explainers; low for rendered video [S357]. See [[events-keyboard]] and [[pointer-events]].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[pointer-events]] — unified pointer group [S357]
- uses [[events-keyboard]] — keyboard group [S357]
- uses [[mouse-button-object]] — boolean-object mouseButton [S11]
- related_to [[p5js-compatibility]] — events.js [S11]
- replaced_in_2x [[pointer-events]] — Mouse + Touch merged [S358]

## Sources
- [S1] — Reference index (v2)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S97] — p5.js reference: keyIsDown()
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
