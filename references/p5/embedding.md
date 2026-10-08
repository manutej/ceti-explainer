# p5 2.3.4 — Embedding

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

### 9.1 Instance mode (the only mode for apps)

```js
// [SOURCE] — instance mode; async setup is fine
const sketch = (p) => {
  let img;
  p.setup = async () => { p.createCanvas(600, 400, p.WEBGL); img = await p.loadImage('/a.jpg'); };
  p.draw = () => { p.background(240); p.texture(img); p.plane(300, 200); };
};
const inst = new p5(sketch, document.getElementById('stage'));   // later: inst.remove()
```

Strands in instance mode: call `p.buildMaterialShader(cb)`. The transpiler handles instance-mode identifiers (`_runStrandsInGlobalMode` exists for the global case) `[SOURCE; instance-mode strands UNVERIFIED]`.

### 9.2 React / shadcn: @p5-wrapper/react 5.0.4

- v5 breaking changes: `ReactP5Wrapper` became **`P5Canvas`**; peer deps **p5 ≥ 2.0.0, react ≥ 19, react-dom ≥ 19**. Next.js needs `@p5-wrapper/next` (dynamic, no SSR).
- Props reach the sketch through `p5.updateWithProps = props => {…}`. The `updater` prop bridges p5 state back into React, and `fallback`, `loading` and `error` props render alternate UIs.

```tsx
// [SOURCE: package README]
import { P5Canvas, type Sketch } from "@p5-wrapper/react";
const sketch: Sketch<{ hue: number }> = p5 => {
  let hue = 0;
  p5.setup = () => p5.createCanvas(480, 320, p5.WEBGL);
  p5.updateWithProps = props => { hue = props.hue; };
  p5.draw = () => { p5.background(p5.color(`oklch(0.7 0.15 ${hue})`)); };
};
export default function Card({ hue }: { hue: number }) {
  return <div className="rounded-xl border bg-card overflow-hidden"><P5Canvas sketch={sketch} hue={hue} /></div>;
}
```

The README's add-on example imports `"p5/lib/addons/p5.sound"`, but **that path does not exist in p5 2.x**: p5.sound is a separate npm package. The working form is `window.p5 = p5; await import("p5.sound")` `[SOURCE: inspected the packages]`. In shadcn layouts, give the wrapper a fixed aspect box and size the canvas from `ResizeObserver` → `p5.resizeCanvas()`, since `windowResized` only fires on window changes `[UNVERIFIED pattern]`.

### 9.3 DOM/CSS overlays and SVG hybrids

- p5 DOM (`createDiv/createSlider/createButton/…`) still ships in core. For UI, prefer real HTML/CSS layered over the canvas: an `position:absolute` overlay with `pointer-events:none` except on controls. It's crisper, accessible and themeable, and keeps text out of WebGL, where `text()` needs `loadFont` and costs a lot.
- **SVG hybrid:** use an inline `<svg>` sibling with the same viewBox as the canvas for vector labels, annotations or plotter paths. The canvas carries fields, shaders and particles, and the SVG carries crisp geometry and text. Hit-test via `worldToScreen()` in WEBGL.
- CSS blend: `mix-blend-mode` on a transparent WEBGL canvas over HTML (`clear()` each frame) is cheap compositing `[UNVERIFIED]`.

---
