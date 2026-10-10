---
id: shader-hooks
title: "Shader hooks"
type: Concept
aliases: ["modify()", "baseMaterialShader()", "Material hooks", "filterColor hook", "finalColor hook", "inspectHooks()", "strokeShader", "imageShader", "Material hooks (objectInputs, worldInputs, cameraInputs, pixelInputs, combineColors, finalColor)", "material shader hooks"]
sources: [S49, S50, S51, S52, S58, S274]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Shader hooks

## Definition
Shader hooks are named override points in p5's built-in shaders, filled with GLSL or p5.strands code via `modify()` or the strands builders **[2.x]** **[beta]** [S52][S58].

## Details
- The material shader has six hooks: `objectInputs`, `worldInputs`, `cameraInputs`, `pixelInputs`, `combineColors`, `finalColor` [S52].
- The filter shader has `filterColor`, supplying `texCoord`, `canvasSize`, `texelSize` and `canvasContent` [S49].
- `baseMaterialShader()` is the default shader for fills when lights or textures are used; `buildMaterialShader(fn)` equals `baseMaterialShader().modify(fn)`; both references are marked experimental and may change [S51][S52].
- Material-hook example uses include vertex animation, per-pixel shininess/metalness, bump mapping and rim lighting [S52].
- Since 2.3.0 a shader material can be written using only the `finalColor` hook [S274].
- Whether `modify()` exists in 1.x was not verified [S51].

## In explainer work
Hooks let an author wobble vertices or add rim light without a full pipeline; the LGM abstract says authors need not know GLSL, uniforms or vertex/fragment stages initially [S50][S52].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[p5-shader]] — hooks live on shaders [S58]
- enables [[p5-strands]] — strands code fills hooks [S52]
- related_to [[lights-and-materials]] — material hooks [S52]
- related_to [[filter-shaders]] — `filterColor` [S49]
- related_to [[lgm-2026-strands-talk]] — design rationale [S50]

## Sources
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S50] — Beginner-Friendly Shader Programming in p5.js v2 (LGM 2026 talk page)
- [S51] — Reference baseMaterialShader()
- [S52] — Reference buildMaterialShader()
- [S58] — Reference createShader()
- [S274] — What's New in p5.js 2.3.0!
