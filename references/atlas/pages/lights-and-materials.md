---
id: lights-and-materials
title: "Lights and materials"
type: Capability
aliases: ["3D/Lights", "3D/Material", "lighting"]
sources: [S47, S49, S52, S357, S358]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Lights and materials

## Definition
Lights and materials in WEBGL are the 3D/Lights group (ambientLight, directionalLight, imageLight, lightFalloff, lights, noLights, panorama, pointLight, specularColor, spotLight) and the 3D/Material group of 17 entries [S357].

## Details
- 3D/Material includes ambientMaterial, createFilterShader, createShader, emissiveMaterial, loadShader, metalness, normalMaterial, p5.Shader, resetShader, shader, shininess, specularMaterial, texture, textureMode, textureWrap; `imageShader` and `strokeShader` are new in 2.x [S357].
- The four `base*Shader` entries moved from 3D/Material to the strands submodule [S357][S358].
- `buildMaterialShader` shaders are auto-applied when lights exist [S49].
- The lights and material reference pages themselves were not fetched in the shader branch, so no per-function claims are made here [S47].
- The capability map rates 3D/Lights low to medium: needed only for shaded 3D scenes [S357].

## In explainer work
Flat diagrams do not need lighting; shaded 3D concepts (molecules, vectors in space) do, and material hooks give rim-light or per-pixel effects [S357][S52].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-3d]] — Lights and Material groups [S357]
- depends_on [[webgl-mode]] — WEBGL only [S357]
- related_to [[shader-hooks]] — material hook customisation [S52]
- related_to [[p5-shader]] — materials are shaders [S357]
- related_to [[p5-strands]] — strands material builders [S49]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S52] — Reference buildMaterialShader()
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
