# p5 2.3.4 — Input

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

- Handlers receive the PointerEvent: `p.mousePressed = (e) => { e.pressure; e.pointerType; }` (pen pressure,
  touch vs mouse). For deterministic renders replay a scripted Signal (`Studio.gestures(stream, {...})`) through
  the same function your handlers call; call `Studio.live(p)` on the first real input to resume live play.
- Provide a keyboard path for any pointer-driven piece (focusable canvas + `keyIsDown`), or say why not.
### 7.1 Input changes in 2.x `[SOURCE]`

- **Pointer events unify mouse, pen and touch.** `mousePressed/mouseDragged/…` fire for touch, and `touches[]` is still filled from active pointers. `touchStarted/Moved/Ended` survive only in the FES name lists, so don't rely on them. Use mouse* handlers.
- `mouseButton` is now an **object**: `mouseButton.left/.right/.center` (1.x: `mouseButton === LEFT`).
- `keyIsDown('ArrowLeft')` takes **key strings**. `key`/`code` follow KeyboardEvent semantics. Numeric `keyCode` constants moved to the compatibility `events.js` addon.
- `preload()` is **removed**, and FES says so explicitly: "The preload() function has been removed in p5.js 2.0…". Use `async function setup(){ x = await loadImage(...) }`. The `processing/p5.js-compatibility` addons (`preload.js`, `shapes.js`, `data.js`, `events.js`) restore 1.x behaviour.
- Shapes: `curveVertex` became `splineVertex`, and `bezierVertex` takes single points (shapes.js restores the old form).
- New: `pointer lock` (`requestPointerLock/exitPointerLock`), `movedX/movedY`, `deltaTime`, `worldToScreen/screenToWorld` (handy for hit-testing in WEBGL).
