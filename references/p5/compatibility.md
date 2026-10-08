# p5 2.3.4 — Compatibility matrix

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

| Library | Version (npm, 2026-10-05) | p5 2.x status | Evidence |
|---|---|---|---|
| p5 core WEBGL + strands | 2.3.4 | **works** | `[TESTED]` render_test.py |
| p5 WEBGPU addon (`p5.webgpu.js`) | 2.3.4 | **unknown on GPU; broken headless here** | `[TESTED-negative]`; APIs verified in source |
| p5.sound | 0.4.1 | **works** (new API, see §2.1) | `[TESTED]` osc→FFT/Amplitude; README claims 1.x+2.x |
| Tone.js | 15.1.22 | **works** (independent of p5) | `[UNVERIFIED-this-run]`; p5.sound bundles Tone 15 |
| ml5 | 1.4.0 | **partial→works**: Promise constructors under 2.x; models need network | `[TESTED]` integration path; `[SOURCE]` ml5 p5Utils comment "p5 2.x does not have registerMethod" |
| p5.capture | 1.6.1 | **works** | `[TESTED]` png-zip download under 2.3.4 |
| p5.record.js | 0.3.0 | **likely works** (PF-maintained, 2.x era) | `[UNVERIFIED]` npm README |
| saveGif (core) | 2.3.4 | **works** | `[TESTED]` |
| p5.js-svg | 1.6.0 | **broken** | `[TESTED]` TypeError; README "compatible with p5.js v1.11.x"; issue #279 open |
| @p5-wrapper/react | 5.0.4 | **works (requires 2.x)** | `[SOURCE]` peerDeps `p5 >= 2.0.0`, react ≥ 19 |
| p5.js-compatibility (preload/shapes/data/events) | — | **works** (bridges 1.x code) | `[UNVERIFIED-fetch]` GitHub README |
| p5.brush | 2.2.3 | **works (requires 2.x)** | `[SOURCE]` peerDeps `p5 ^2.2` |
| CCapture.js | 2.0.0 | **unknown** | npm metadata only |
| p5.createloop | 0.3.1 (2023) | **unknown/likely stale** | npm metadata only |
| vpype (Python) | — | **n/a (post-process SVG)** | `[UNVERIFIED]` |
