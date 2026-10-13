---
id: p5-shader
title: "p5.Shader"
type: Construct
aliases: ["createShader", "loadShader", "shader object", "LYGIA", "LYGIA shader library"]
sources: [S49, S51, S58, S64, S156]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.Shader

## Definition
`p5.Shader` wraps a vertex plus fragment GPU program with `setUniform` and hook modification; `createShader(vert, frag)` builds one from GLSL strings and `loadShader` loads files (async in 2.x), aimed at advanced users and add-on authors [S51][S58][S64].

## Details
- `createShader` accepts an options object declaring hooks that users customise with `modify()`; hooks are called in GLSL with a `HOOK_` prefix [S58].
- The reference recommends the strands builders (`buildMaterialShader`, `buildStrokeShader`, `buildFilterShader`) for most users [S58].
- Built-in names include `aPosition`, `aTexCoord`, `aVertexColor`, `uModelViewMatrix`, `uProjectionMatrix` and `tex0` [S64].
- Loops need constant bounds; declare precision consistently (`highp` recommended) [S64].
- LYGIA is a multi-language shader function library by Patricio Gonzalez Vivo listed on p5js.org libraries [S156].
- `inspectHooks()` lists the hooks available on a shader [S51].

## In explainer work
Hand-written GLSL remains the stable base; for common edits (tint, wobble, rim light) prefer strands and hooks, and use `uniformTexture(framebuffer)` for post effects [S49][S58].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[webgl-mode]] — all shaders work there [S58]
- related_to [[shader-hooks]] — customised via `modify()` [S51]
- alternative_to [[p5-strands]] — JS-authored route [S58]
- related_to [[filter-shaders]] — fragment-only variant [S64]
- related_to [[async-setup]] — `await loadShader` [S64]

## Sources
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S51] — Reference baseMaterialShader()
- [S58] — Reference createShader()
- [S64] — Introduction to GLSL (tutorial)
- [S156] — p5.js Libraries page
