# palette

**What it is for.** Derives, from a brand pack, OKLCH ramps (bg>ink and accent>bg at 5 and 9 steps, or the pack's own
`ramps`) through p5 2.x `colorMode(OKLCH)` + `lerpColor`, and a seeded probabilistic sampler (weighted role choice
plus a bounded-Gaussian tint). The demo is a swatch sheet per brand pack: the eight colour roles, four ramps, 32
sampled chips, and three sample marks (disc, bars, type lockup) that move on the pack's `tempo`. Use it to judge a
brand before any film is built, and as the API (`ARSENAL.palette`) other patterns call for ramps and weighted picks.

**When NOT to use.** Not a chart colour system (no diverging or categorical scales). Not for per-pixel colour: ramps
are made in `setup`, colour creation is slow in 2.x [[color-spaces-2x]].

## API (window.ARSENAL.palette)
- `ramp(p, fromHex, toHex, n)` -> n hex strings, inclusive of both ends.
- `brandRamps(p, pack)` -> `[{key,label,steps}]`; reads optional `pack.ramps` {name:{from,to,steps}}.
- `sample(p, pack, seed, n, weights?, jitter?)` -> `[{role,hex}]`; weights default to `pack.weights`, else
  ink 34 / accent 26 / accent2 8 / muted 20 / panel 12.
- `contrast(hexA, hexB)` WCAG ratio; `mulberry32`, `EASE`.

## Params
| param | default | range | note |
|---|---|---|---|
| brand | null | pack id in ARSENAL.brands | null uses ctx.tokens |
| chips | 32 | 4..64 | sampler strip length |
| jitter | 0.18 | 0..0.4 | max tint toward ink (or bg), bounded Gaussian |

## Variants
`ceti-dark`, `neon-lab`, `swiss-grid`, `tender-set`: the same sheet under each pack. Dark and luminous (grain), light
and flat (hard accent), warm paper with a navy ink. Different texture, ease and beat per pack.

## lerpColor hue handling (measured on p5 2.3.4; the reference is silent [[lerp-color]] [[color-mode]])
Interpolates in the current mode, so call `colorMode(OKLCH, 1, 0.4, 360)` first (default ranges are L 0..100, C 0..100
mapped to 0..0.4, so `color(0.7,0.15,350)` silently reads as near-black). Hue takes the shortest arc (350 to 10
crosses 0). An achromatic end borrows the other end's hue. Hex colours made before the switch lerp correctly.
Mid steps between saturated hues are gamut-clipped to sRGB, so chroma can dip. Endpoints round-trip exactly.

## Atlas
[[color-spaces-2x]] [[color-mode]] [[lerp-color]] [[color-contrast]] (the WCAG maths is re-implemented in JS and
Python; p5's `color.contrast()` 2.1+ is not called) [[probabilistic-palette]] [[generative-distributions]]
(bounded Gaussian) [[p3-hdr-color]] (wide gamut not used; sRGB only).

## Pitfalls
- `chalk` means highest-emphasis text on `panel`, same polarity as bg: on light packs it is darker than ink.
- `line` is rgba and is never ramped or contrast-gated.
- The demo needs `arsenal/brands/packs.js` (regenerate: `python3 arsenal/tools/brand_check.py arsenal/brands/*.json --emit-js arsenal/brands/packs.js`).
- Setup receives the pack through `ctx.tokens` (the contract's setup signature has no tokens argument).

## Cost
about 9.4 ms/frame draw at 960x540 x2 (shoot.mjs, 16 frames); setup (ramps + 32 chips, ~100 colour objects) is a
one-off, tens of ms. Renderer p2d.

## Fallback
None needed: OKLCH modes are stable 2.x. If a build lacks them, `ramp` can be replaced by a pure-JS OKLab lerp.
