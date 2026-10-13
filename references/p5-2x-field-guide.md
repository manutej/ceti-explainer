# p5.js 2.3.4 field guide — index

Split by surface so you load only what the step needs. Each file is self-contained. Full research behind it,
with fetch logs: `../docs/research/01-p5-2x-docs.md` and `../docs/research/04-advanced-surfaces.md`.

| File | Load when | Words |
|---|---|---|
| `p5/contract.md` | always, before writing any sketch | 130 |
| `p5/what-changed.md` | first time on 2.x, or porting | 675 |
| `p5/breaking-1x-habits.md` | porting 1.x code; a lint API-* finding | 474 |
| `p5/performance.md` | cost budget, escape hatches | 345 |
| `p5/snippets.md` | shapes, OKLCH alpha, textToContours, strands examples | 221 |
| `p5/webgl-strands.md` | WEBGL, framebuffers, p5.strands, instancing, WebGPU | 1864 |
| `p5/sound.md` | p5.sound 0.4, Web Audio, Tone.js, mic | 662 |
| `p5/input.md` | pointer, keyboard, touch, camera | 202 |
| `p5/export.md` | stills, print, SVG/plotter, GIF, video | 661 |
| `p5/embedding.md` | instance mode in pages, React/shadcn, overlays | 394 |
| `p5/compatibility.md` | is library X safe on p5 2.x? | 253 |

The five lines every sketch must obey (details in `p5/contract.md`): `<meta charset="utf-8">` first · p5 pinned
to 2.3.4 · instance mode with the studio template · `async setup()` + `await` (never `preload()`) · scene built as
data in setup, `draw()` only renders.
