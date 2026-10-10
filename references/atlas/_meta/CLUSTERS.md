# CLUSTERS — phase-2 page-writer assignments for `p5js-explainer-atlas`

Phase 1 (EXTRACT) output. Every slug in `graph/entities.jsonl` is assigned to exactly one cluster below. 300 pages total.
Machine-readable twin: `_meta/pages.jsonl` (one JSON per slug: slug, title, type, cluster, aliases, branches, branch_ids, section_ids, sections, candidate_sources, folded).
Branch→S-id conversion: `_meta/source-map.tsv` (column 1 branch id, column 2 S id). Corpus dir: `/home/claude/research_notes/p5js explainer frontier/`.

## 0. Shared conventions (all four writers MUST follow — wikictl measure enforces most of these)

### 0.1 File + frontmatter
- One file per slug: `pages/<slug>.md`. Filename stem == `id` == the slug listed here. Never invent a new slug; never rename one.
- Frontmatter EXACTLY these keys. **Start from the pre-rendered, YAML-validated `frontmatter` string in `_meta/pages.jsonl` for your slug** (title/aliases are JSON-quoted so ':' '@' etc. are safe); then fill `sources`, `confidence`, optional `version`:
```yaml
---
id: <slug>
title: <title from entities.jsonl>
type: <type from entities.jsonl>      # must match the index or sync.index fails
aliases: [<copy the aliases list verbatim from entities.jsonl>]   # do NOT add new aliases (entity.unique gate); quote any alias containing ':' '#' '[' or starting with '@' / '*' / '&'
sources: [S12, S40, ...]             # every S-id cited inline in the body, ascending
confidence: high|medium|low          # high = primary docs agree; medium = single/secondary source; low = conflicting/inferred
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"                       # optional: 2.x | 1.x | both | n/a — what the page's API facts describe
---
```
- If you want an extra alias, DON'T — put the name in prose instead. Alias sets are globally disjoint now; adding one can collide.

### 0.2 Body sections (in this order; `##` headings, exact names)
1. `# <Title>` (H1, once)
2. `## Definition` — 1–3 sentences, cited.
3. `## Details` — the substance: API signature/semantics, version facts, numbers, caveats. Use `###` sub-heads freely.
4. `## In explainer work` — how this matters for building explainer animations/videos (scrub, determinism, export, legibility). Cited.
5. `## Patterns` — only if the page owns a reusable pattern (Pattern/Technique pages: required). Name, when-to-use, own-written snippet ≤15 lines in ``` fences, pitfalls. Paraphrase; never copy corpus code verbatim beyond a line.
6. `## Relations` — bullets `- <predicate> [[slug]] — one clause why [S#]`. Predicates: is_a, part_of, related_to, uses, depends_on, enables, integrates_with, alternative_to, supersedes, replaced_in_2x, introduced_in, exports_to, authored_by, maintained_by, teaches, demonstrates, conflicts_with.
7. `## Sources` — bullets `- [S#] — what this source contributes`. (This section is excluded from coverage counting.)
- Hub pages (index, hub-*, capability-map, mastery-ladder, explainer-engine-blueprint, video-export-pipeline, frontier-2026, version-2x-migration, open-questions) may replace `In explainer work` with topical sections, but keep Definition, Relations, Sources.
- Conflicts: wherever sources disagree, add a `> **Conflict:** ... [S#] vs [S#]` blockquote in Details AND list it on `open-questions` (C4 integrates; other writers append a line to `_meta/conflicts-inbox.md`: `<slug> | conflict | S-ids`).

### 0.3 Links
- Wiki links: `[[slug]]` only (slug form, lowercase-hyphen). `[[slug|display text]]` allowed. Link ONLY to slugs in `graph/entities.jsonl` (all 300 will exist after phase 2, so cross-cluster links are fine). Folded items (e.g. text-to-paths → p5-font) have NO page — link the parent slug (see `folded` in pages.jsonl / alias lists).
- Every page: ≥3 typed links in Relations, and link back to its cluster hub (C1 → [[hub-language-core]], C2 → [[hub-motion-rendering]], C3 → [[hub-explainer-production]], C4 → [[hub-people-community]]). Module pages link their capabilities/constructs; constructs link their module.
- External URLs: don't paste raw URLs in prose; the S-id carries the URL.

### 0.4 Citations / provenance (prov.coverage gate ≥ 0.90)
- Inline `[S#]` at end of every substantive sentence/bullet (any prose or bullet line ≥ 60 chars outside Sources/Unverified/tables/code/blockquotes is counted). Multiple: `[S4][S19]`.
- Convert corpus ids mechanically: `[B07-3]` → look up `source-map.tsv` → `[S#]`. NEVER cite a B-id in a page; never invent an S-id (only S1–S416 exist).
- `[B10-24-none]` = no source. Claims with no source go under a `## Unverified` heading (excluded from coverage), never uncited in Details.
- Inferences by branch authors (marked "inference"/"my inference") → keep the citation of the facts they rest on and say "(inference)".
- `candidate_sources` in pages.jsonl = S-ids derived from the branch rows/sections for that slug: start there, but also grep the corpus Claims for the slug's title/aliases — Claims carry most of the facts.

### 0.5 Version flags
- Inline badges, exactly: `**[2.x]**` (exists/behaves this way in 2.x), `**[1.x only]**` (removed in 2.x), `**[changed in 2.x]**` (exists in both, semantics differ), `**[main / unreleased]**` (merged on main, not in 2.3.4), `**[beta]**` (reference flags experimental/beta).
- Version anchors: 2.0.0 released 2025-04-17; 2.1 types/addon events/contrast; 2.2 WebGPU (experimental); 2.3.0 compute shaders (2026-06-22); latest 2.3.4 (2026-09-25); 2.4 on main (instances()). 1.x frozen end of March 2026 (npm tag `r1` = 1.11.13); Web Editor default switched to 2.x on 2026-07-31 (editor v2.22.0). Cite these, don't restate uncited.

### 0.6 Hygiene
- Paraphrase; quotes ≤15 words, max one per source. Own snippets only.
- Body ≥ 40 words (stub floor) — aim 150–500 words for leaf pages, more for hubs. No padding: density of typed links + citations beats prose.
- Don't edit `graph/entities.jsonl`, `wiki.yaml`, `sources/SOURCES.md`, or other clusters' pages. Triples: append new edges to `graph/triples.jsonl` as `{"subject":slug,"predicate":<declared>,"object":slug,"sources":["S#"],"origin":"C<n>"}` — both ends must be existing slugs. 178 edges already seeded from branch Relations.
- After writing a batch: `python3 /mnt/skills/plugins/noether-wiki/scripts/wikictl.py measure /home/claude/wiki/p5js-explainer-atlas --quiet` — expected remaining violations are only `entity X has no page` for pages not yet written (and, until all clusters finish, link.integrity for links to unwritten pages). Fix anything else on your own pages.

## 1. Cluster summary

| cluster | scope | pages |
|---|---|---|
| C1 | Language & core API — modules, capabilities, constructs, capability map, 2.x migration (B01, B02, B05, B06, B18, B19) | 74 |
| C2 | Motion, timing, rendering, performance, WebGL/shaders, interaction input, generative technique (B03, B04, B07, B15, parts of B05/B16/B20) | 68 |
| C3 | Explainer production — engine architecture, export pipelines, tools, libraries, alternatives, tooling, AI tooling (B08, B09, B12, B14, B17, B21, parts of B16) | 87 |
| C4 | People, works, education, community, frontier, releases, atlas hubs (B10, B11, B13, B16, B20 + hub pages) | 71 |

Hub pages (exempt from orphan lens; write them last within your cluster, linking every page of your cluster): `index` (C4), `hub-language-core` (C1), `hub-motion-rendering` (C2), `hub-explainer-production` (C3), `hub-people-community` (C4), `capability-map` (C1), `mastery-ladder` (C4), `explainer-engine-blueprint` (C3), `video-export-pipeline` (C3), `frontier-2026` (C4), `version-2x-migration` (C1), `open-questions` (C4).

Hub ownership rule: each `hub-*` page lists and links EVERY slug in its cluster, grouped by type. `index` (C4) links all hubs + the 12 synthesis pages + every Module page. `open-questions` (C4) aggregates every `## Gaps and disagreements` section B01–B21 plus `_meta/conflicts-inbox.md`.

## C1 — Language & core API — modules, capabilities, constructs, capability map, 2.x migration (B01, B02, B05, B06, B18, B19)

Columns: slug · type · title · branches · draw-from (branch ids → convert via source-map.tsv; `sec:` = branch sections to read) · folded-in (no own page)

| slug | type | title | branches | draw-from | folded-in |
|---|---|---|---|---|---|
| `capability-map` | Concept | Capability map of p5.js 2.x | B19 | B19-2, B19-1, B19-3, B19-4, B19-5, B19-7, B19-8, B19-9, B19-10, B19-11, B19-14, B19-16 · sec: B19:Summary, B19:Patterns/Relevance-matrix, B19:Claims/Per-category-counts | module-foundation |
| `hub-language-core` | Concept | Hub: Language and core API | B01 B02 B05 B06 B18 B19 | B18-2, B18-3, B18-4, B18-5, B18-6, B18-7, B18-8, B18-9, B18-10, B18-11, B18-12, B18-13, B18-14, B18-15 …(+17, see pages.jsonl) |  |
| `version-2x-migration` | Concept | 1.x to 2.x migration | B01 B06 B13 B14 B19 B21 | B01-27, B06-5 | teachers-guide-v2 |
| `addon-events-api` | Capability | Add-on Events API | B06 B16 | B06-12, B16-1 |  |
| `color-contrast` | Capability | Color contrast checker | B06 B16 | B06-12, B16-1 |  |
| `decorators-api` | Capability | Decorators API | B16 B19 | B16-3, B16-9, B19-7 |  |
| `dom-controls` | Capability | DOM UI controls (createSlider, createSelect, createInput) | B05 | B05-3, B05-22, B05-23, B05-25, B05-5, B05-7, B05-8, B05-9, B05-10, B05-11, B05-12, B05-14, B05-15, B05-17 · sec: B05:Patterns |  |
| `dom-media` | Capability | DOM media (createVideo, createAudio, createCapture) | B05 | B05-6, B05-12, B05-18 |  |
| `friendly-error-system` | Capability | Friendly Error System | B01 B13 B15 B18 | B01-1, B01-10, B13-4, B13-13, B15-1, B18-6 |  |
| `p5-svg-main-branch` | Capability | Native SVG import/export (unreleased) | B19 | B19-5 |  |
| `shape-2d-primitives` | Capability | 2D primitives | B01 B19 | B01-1, B19-2 |  |
| `shape-attributes` | Capability | Shape attributes | B01 B19 | B01-1, B19-2 |  |
| `shape-curves` | Capability | Curves (bezier and spline functions) | B01 B06 B19 | B01-1, B01-4, B01-12, B01-22, B01-23, B06-6, B19-2 | bezier-functions, spline-functions |
| `shape-custom-shapes` | Capability | Custom shapes | B01 B18 B19 | B01-3, B01-20, B01-26, B18-14, B19-2 | custom-shapes-tutorial, vertex-api-rfc-6766 |
| `vertex-property` | Capability | vertexProperty() | B06 B19 | B06-1 |  |
| `access-statement` | Concept | Access Statement | B18 | B18-2 |  |
| `color-spaces-2x` | Concept | 2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH) | B02 B06 B18 | B02-1, B06-1, B06-18, B02-3, B02-4, B02-5, B02-8, B02-9, B02-11, B02-12, B02-13, B02-14, B02-18 · sec: B02:Patterns |  |
| `drawing-state` | Concept | Drawing state | B18 | B18-9 |  |
| `global-mode` | Concept | Global mode | B14 B18 | B14-10, B18-15 |  |
| `immediate-mode` | Concept | Immediate-mode drawing | B18 | B18-2, B18-3, B18-4, B18-5, B18-6, B18-7, B18-8, B18-9, B18-10, B18-11, B18-12, B18-13, B18-14, B18-15 …(+5, see pages.jsonl) |  |
| `instance-mode` | Concept | Instance mode | B05 B14 B18 | B05-9, B05-15, B14-9, B14-10, B18-15, B05-3, B05-5, B05-7, B05-8, B05-10, B05-11, B05-12, B05-14, B05-17 …(+7, see pages.jsonl) · sec: B05:Patterns, B14:Patterns, B18:P5 |  |
| `lifecycle-hooks` | Concept | Add-on lifecycle hooks | B06 B09 | B06-9, B06-10, B09-2, B09-3 |  |
| `sketch-concept` | Concept | Sketch (sketching with code) | B18 | B18-3 |  |
| `async-setup` | Construct | async setup() | B01 B02 B05 B06 B13 B14 B17 B18 B19 | B01-2, B01-4, B02-14, B05-10, B05-26, B06-6, B13-7, B14-4, B17-45, B17-46, B18-16, B18-18, B19-7, B19-9 · sec: B18:P7, B19:Patterns/async |  |
| `begin-contour` | Construct | beginContour() / endContour() | B01 B18 | B01-24, B18-14 |  |
| `bezier-order` | Construct | bezierOrder() | B01 B06 B18 | B01-7, B06-1, B06-6, B18-16 |  |
| `bezier-vertex` | Construct | bezierVertex() | B01 B06 | B01-6, B01-2, B01-3, B01-5, B01-8, B01-9, B01-10, B01-13, B01-15, B01-18, B01-20, B01-23, B01-24, B01-26 · sec: B01:Patterns |  |
| `blend-mode` | Construct | blendMode() | B02 | B02-7 |  |
| `color-mode` | Construct | colorMode() | B02 B18 | B02-1, B18-16 |  |
| `create-canvas` | Construct | createCanvas() | B01 B18 | B01-14, B18-10, B18-11 | p2d-renderer |
| `curve-api-1x` | Construct | 1.x curve API (removed) | B06 B19 | B19-3, B19-9 |  |
| `describe` | Construct | describe() and describeElement() | B16 B18 | B16-24, B18-7, B16-1, B16-23 · sec: B18:P6, B16:P4 |  |
| `draw` | Construct | draw() | B01 B18 | B01-8, B18-8 |  |
| `erase` | Construct | erase() / noErase() | B02 | B02-12 |  |
| `lerp-color` | Construct | lerpColor() | B02 B17 | B02-13, B17-44 |  |
| `load-font` | Construct | loadFont() | B02 B06 B20 | B02-4, B06-1, B06-8, B20-31 |  |
| `p2dhdr` | Construct | P2DHDR canvas | B01 B06 B18 | B01-4, B06-1, B18-16 |  |
| `p3-hdr-color` | Construct | RGBP3 / RGBHDR wide-gamut color | B02 B06 B16 | B02-1, B02-14, B06-1, B06-18, B16-4 |  |
| `p5-color` | Construct | p5.Color | B02 B19 | B02-1, B02-2, B19-2, B19-4 |  |
| `p5-element` | Construct | p5.Element | B05 B19 | B05-5, B19-2 |  |
| `p5-font` | Construct | p5.Font | B02 B19 | B02-3, B02-4, B19-2 | text-to-paths |
| `p5-media-element` | Construct | p5.MediaElement | B05 B19 | B05-17, B19-2 |  |
| `preload` | Construct | preload() | B01 B06 B13 B18 B19 | B01-4, B01-11, B06-5, B13-7, B18-16, B18-18, B19-7, B19-8, B19-9 |  |
| `push-pop` | Construct | push() and pop() | B01 B18 | B01-15, B18-9, B18-10, B18-14 · sec: B18:P2 |  |
| `register-addon` | Construct | p5.registerAddon | B01 B06 B09 B18 | B01-1, B06-9, B06-10, B09-2, B09-3, B18-19, B09-7, B09-9, B09-15, B09-16, B09-17, B09-20 · sec: B09:Patterns | register-method-1x |
| `setup` | Construct | setup() | B01 B18 | B01-2, B18-8, B18-16 |  |
| `spline-vertex` | Construct | splineVertex() | B01 B06 B17 B18 | B01-4, B01-5, B06-1, B06-6, B17-45, B18-16, B06-5, B06-9, B06-16, B06-17 · sec: B06:Patterns |  |
| `text-output` | Construct | textOutput() / gridOutput() | B16 B18 | B16-23, B18-7 |  |
| `text-to-contours` | Construct | textToContours() | B02 B06 B13 B16 B17 B18 B20 | B02-14, B02-18, B13-11, B16-4, B16-25, B17-39, B18-16, B20-28, B20-32 |  |
| `text-to-model` | Construct | textToModel() | B02 B06 B15 B16 B20 | B02-4, B02-18, B06-1, B06-8, B15-18, B20-28, B20-31 |  |
| `text-to-points` | Construct | textToPoints() | B02 B17 B19 | B02-3, B17-39 |  |
| `text-weight` | Construct | textWeight() and variable fonts | B02 B06 B13 B16 B20 | B02-5, B02-17, B06-1, B13-9, B13-11, B16-25, B20-28 | p5-variablefont |
| `text-width` | Construct | textWidth() / fontWidth() | B02 B06 | B02-6, B02-16, B06-6, B06-8 |  |
| `p5-woff2` | Library | p5.woff2 add-on | B06 B20 | B06-1, B06-8 |  |
| `p5js-compatibility` | Library | p5.js-compatibility add-ons | B01 B02 B04 B05 B06 B09 B13 B14 B16 B18 B19 | B01-11, B02-14, B04-12, B05-10, B05-26, B06-2, B06-6, B09-4, B13-3, B13-7, B13-8, B14-3, B16-11, B18-18 …(+1, see pages.jsonl) |  |
| `module-color` | Module | Color module | B02 B19 | B19-2 | color-setting |
| `module-constants` | Module | Constants module | B01 B19 | B01-1, B19-2, B19-3 |  |
| `module-data` | Module | Data module | B06 B19 | B19-2, B19-3, B19-9 | data-dict-1x |
| `module-dom` | Module | DOM module | B05 B19 | B19-2 |  |
| `module-environment` | Module | Environment module | B01 B19 | B01-1, B19-2 |  |
| `module-events` | Module | Events module | B05 B19 | B19-2 | events-acceleration |
| `module-image` | Module | Image module | B02 B19 | B02-11, B19-2 | p5-image, load-image |
| `module-io` | Module | IO module | B19 | B19-2, B19-3, B19-4 |  |
| `module-math` | Module | Math module | B04 B19 | B19-2, B19-4, B19-6 | math-quaternion |
| `module-rendering` | Module | Rendering module | B01 B19 | B01-1, B19-2, B19-3 |  |
| `module-shape` | Module | Shape module | B01 B19 | B01-1 |  |
| `module-structure` | Module | Structure module | B01 B19 | B01-1, B19-2, B19-7 |  |
| `module-transform` | Module | Transform module | B01 B18 B19 | B01-1, B18-10, B19-2, B19-3, B18-9, B18-14 · sec: B18:P2, B18:P3 |  |
| `module-typography` | Module | Typography module | B02 B19 | B19-2 |  |
| `p5js` | Platform | p5.js | B18 | B18-1 |  |
| `p5js-1x` | Platform | p5.js 1.x | B06 B19 B21 | B19-3, B19-10, B21-11 |  |
| `release-2-0` | Release | p5.js 2.0 | B01 B02 B06 | B06-1 |  |
| `release-2-1` | Release | p5.js 2.1 | B06 B16 | B06-1, B06-2, B06-3, B06-4, B06-5, B06-6, B06-7, B06-8, B06-9, B06-10, B06-11, B06-12, B06-13, B06-14 …(+42, see pages.jsonl) |  |
| `p5js-reference` | Tool | p5.js Reference | B01 B19 | B19-1, B19-14, B19-15 |  |

## C2 — Motion, timing, rendering, performance, WebGL/shaders, interaction input, generative technique (B03, B04, B07, B15, parts of B05/B16/B20)

Columns: slug · type · title · branches · draw-from (branch ids → convert via source-map.tsv; `sec:` = branch sections to read) · folded-in (no own page)

| slug | type | title | branches | draw-from | folded-in |
|---|---|---|---|---|---|
| `hub-motion-rendering` | Concept | Hub: Motion, timing and rendering | B03 B04 B07 B15 | grep branches (synthesis page) |  |
| `antialiasing` | Capability | Antialiasing (smooth, setAttributes) | B01 B15 | B15-6, B15-9 |  |
| `events-keyboard` | Capability | Keyboard events | B05 B06 B19 | B05-11, B06-5, B06-6, B19-2 |  |
| `gpu-instancing` | Capability | GPU instancing (instances()) | B03 B16 B19 | B03-3, B03-17, B16-4, B16-6, B16-10 · sec: B16:P1 |  |
| `lights-and-materials` | Capability | Lights and materials | B19 | B19-2 |  |
| `math-trigonometry` | Capability | Trigonometry and angleMode | B04 B18 B19 | B04-6, B04-9, B18-10, B19-2 |  |
| `p5-strands` | Capability | p5.strands | B02 B03 B04 B06 B13 B14 B15 B16 B18 B19 | B02-2, B03-1, B03-3, B03-5, B03-6, B03-14, B04-1, B04-17, B06-12, B06-13, B06-14, B13-9, B13-11, B14-2 …(+9, see pages.jsonl) | strands-builders, p5-env, p5-warp |
| `pointer-events` | Capability | Pointer events (2.x) | B05 B06 B19 | B05-16, B06-1, B06-6, B19-2, B19-3, B19-9 | touch-events-1x |
| `shape-3d-models` | Capability | 3D models | B03 B19 | B03-10, B19-2 |  |
| `shape-3d-primitives` | Capability | 3D primitives | B15 B19 | B15-2, B19-2 |  |
| `webgl-mode` | Capability | WEBGL mode | B03 B18 | B03-13, B18-10, B18-11 |  |
| `webgpu-compute` | Capability | WebGPU compute shaders | B03 B16 B19 | B03-12, B03-15, B16-3, B19-2 |  |
| `webgpu-renderer` | Capability | WebGPU renderer | B01 B03 B06 B14 B15 B16 B19 | B01-10, B01-14, B03-2, B03-11, B06-13, B06-14, B06-15, B14-2, B15-17, B16-1, B16-4, B19-4, B19-7, B16-2 …(+1, see pages.jsonl) · sec: B16:P2 |  |
| `world-to-screen` | Capability | worldToScreen() / screenToWorld() | B06 B18 | B06-1, B06-8, B18-16 |  |
| `easing-functions` | Concept | Easing functions | B04 B20 | B04-18, B04-19, B20-27, B04-3, B04-4, B04-5, B04-6, B04-7, B04-8, B04-9, B04-10, B04-14, B04-15, B04-16 …(+6, see pages.jsonl) · sec: B04:Patterns |  |
| `fixed-timestep` | Concept | Fixed-timestep rendering | B07 | B07-9, B07-16 |  |
| `generative-distributions` | Concept | Distributions for generative variety | B20 | B20-6 |  |
| `normalized-time` | Concept | Normalized time t (playhead) | B07 B21 | B07-13, B07-17, B21-7 |  |
| `oscillation` | Concept | Oscillation and harmonic motion | B04 | B04-23 |  |
| `perf-regressions-2x` | Concept | 2.x performance regressions | B06 B15 | B06-1, B06-6, B06-8, B06-17, B06-19, B15-13, B15-14, B15-18 |  |
| `pure-function-of-t` | Concept | Pure function of t | B01 B07 B17 B18 | B01-2, B01-3, B01-5, B01-6, B01-8, B01-9, B01-10, B01-13, B01-15, B01-18, B01-20, B01-23, B01-24, B01-26 …(+4, see pages.jsonl) · sec: B07:P1, B18:P1, B01:Patterns |  |
| `real-time-vs-frame-based` | Concept | Real-time vs frame-based animation | B07 | B07-1, B07-6, B07-7, B07-15, B07-17 · sec: B07:P6 |  |
| `resolution-independence` | Concept | Resolution independence | B20 | B20-3, B20-10, B20-43 · sec: B20:P2 |  |
| `shader-hooks` | Concept | Shader hooks | B03 B06 B16 | B03-3, B03-5, B03-6, B03-13, B06-1, B06-8, B16-3 |  |
| `build-geometry` | Construct | buildGeometry() | B06 B15 B19 | B06-6, B15-2, B15-11, B19-2 |  |
| `delta-time` | Construct | deltaTime | B07 B17 B18 | B07-1, B17-42, B18-23 |  |
| `filter` | Construct | filter() | B02 B03 | B02-9, B03-8 |  |
| `filter-shaders` | Construct | Filter shaders | B02 B03 B15 B20 | B02-9, B02-14, B03-19, B15-2, B20-30 | contact-shadow-filter |
| `frame-count` | Construct | frameCount | B01 B04 B07 B18 | B01-8, B04-23, B07-6 |  |
| `frame-rate` | Construct | frameRate() | B01 B07 B15 B18 | B01-18, B07-2, B15-1, B18-8 |  |
| `lerp` | Construct | lerp() | B04 | B04-5, B04-17 |  |
| `loop-control` | Construct | noLoop(), loop(), isLooping() | B01 B07 B18 | B01-8, B01-29, B07-5, B18-8 |  |
| `map-norm-constrain` | Construct | map(), norm(), constrain() | B04 B19 | B04-4, B04-17, B19-2 |  |
| `millis` | Construct | millis() | B07 B19 | B07-7, B19-2 |  |
| `mouse-button-object` | Construct | mouseButton object | B05 B06 | B05-10, B06-5 |  |
| `noise` | Construct | noise() | B04 B07 B19 | B04-1, B04-7, B04-14, B04-21, B07-8, B19-2 |  |
| `p5-camera` | Construct | p5.Camera | B03 B19 | B03-9, B19-2, B19-6 |  |
| `p5-framebuffer` | Construct | p5.Framebuffer | B01 B03 B15 B18 B19 | B01-13, B03-7, B03-16, B15-3, B15-4, B18-13, B19-2 |  |
| `p5-graphics` | Construct | p5.Graphics (createGraphics) | B01 B15 B18 B19 | B01-13, B15-7, B15-8, B18-11, B18-12, B19-2 |  |
| `p5-shader` | Construct | p5.Shader | B03 B16 B19 | B03-5, B03-13, B03-19, B16-35, B19-2 | lygia |
| `p5-vector` | Construct | p5.Vector | B04 B19 | B04-3, B04-10, B04-16, B04-23, B19-2 |  |
| `pixel-density` | Construct | pixelDensity() | B01 B02 B15 | B01-17, B02-8, B15-5 |  |
| `pixels-array` | Construct | pixels[] and loadPixels() | B02 B15 B19 | B02-8, B02-10, B15-10, B19-2 |  |
| `random` | Construct | random() and randomGaussian() | B04 B19 | B04-2, B04-15, B19-2 |  |
| `random-seed` | Construct | randomSeed() and noiseSeed() | B04 B07 | B04-2, B04-8, B04-14, B04-15, B07-3, B07-4 |  |
| `redraw` | Construct | redraw() | B01 B07 B17 | B01-9, B07-5, B17-43 |  |
| `module-3d` | Module | 3D module | B03 B18 B19 | B18-10, B19-2 | 3d-interaction |
| `arc-length-reveal` | Pattern | Arc-length path reveal | B17 B19 | B17-14, B19-2, B19-8 · sec: B17:P8, B19:Patterns/draw-on |  |
| `camera-choreography` | Pattern | Camera choreography | B17 | B17-4, B17-40 · sec: B17:P10 |  |
| `event-driven-redraw` | Pattern | Event-driven redraw | B05 | B05-14, B05-3, B05-5, B05-7, B05-8, B05-9, B05-10, B05-11, B05-12, B05-15, B05-17 · sec: B05:Patterns |  |
| `hi-res-render` | Pattern | High-resolution offline render | B15 | B15-1, B15-2, B15-3, B15-4, B15-6, B15-8, B15-9, B15-11, B15-15, B15-19, B15-22, B15-24, B15-25 · sec: B15:Patterns |  |
| `layered-compositing` | Pattern | Layered compositing | B01 B03 B15 B18 B19 | B18-11, B18-12, B18-13, B19-2 · sec: B18:P4, B19:Patterns/layered |  |
| `seeded-determinism` | Pattern | Seeded determinism | B07 B08 B17 B20 | B08-9, B20-3, B20-10, B07-3, B07-4, B17-21, B17-26, B20-43 · sec: B07:P2, B17:P12, B20:P1 |  |
| `shape-morph` | Pattern | Shape and text morph | B01 B02 B17 B19 | B17-51, B17-39 · sec: B17:P9, B19:Patterns/text-to-points |  |
| `camera-slerp` | Technique | Camera slerp | B03 B17 | B03-9, B17-40, B03-2, B03-3, B03-6, B03-7, B03-11, B03-16, B03-17, B03-18, B03-19 · sec: B03:Patterns |  |
| `collision-curve-packing` | Technique | Collision-checked curve packing | B20 | B20-2, B20-3 |  |
| `euler-integration` | Technique | Motion algorithm (Euler integration) | B04 | B04-20, B04-24 |  |
| `flow-field` | Technique | Flow field | B04 B20 | B04-22, B04-26, B20-2, B20-1 · sec: B20:P3 |  |
| `grid-offset-loop` | Technique | Grid offset loop | B10 B20 | B10-10, B10-12, B20-26, B20-29 · sec: B20:P6 |  |
| `loop-phase-animation` | Technique | Loop-phase animation | B07 B10 B20 | B07-13, B10-10, B20-27, B20-29 · sec: B20:P5 | loopsin |
| `noise-loop` | Technique | Seamless noise loop | B07 | B07-11, B07-14, B07-19, B07-8 · sec: B07:P3 |  |
| `performance-profiling` | Technique | Performance profiling | B13 B15 | B13-13, B15-1, B15-2 | optimizing-sketches-tutorial |
| `ping-pong-feedback` | Technique | Ping-pong feedback framebuffers | B03 B15 | B03-16, B15-3, B03-2, B03-3, B03-6, B03-7, B03-9, B03-11, B03-17, B03-18, B03-19, B15-1, B15-2, B15-4 …(+9, see pages.jsonl) · sec: B03:Patterns, B15:Patterns |  |
| `probabilistic-palette` | Technique | Probabilistic palette | B20 | B20-1, B20-3, B20-7, B20-4 · sec: B20:P4 |  |
| `random-walk` | Technique | Random walk | B04 | B04-21 |  |
| `steering-behaviors` | Technique | Steering behaviors | B04 | B04-22 |  |
| `triangle-subdivision` | Technique | Self-balancing triangle subdivision | B20 | B20-8 | chaikin-curve |
| `lgm-2026-strands-talk` | Work | LGM 2026 p5.strands talk | B03 | B03-4 |  |

## C3 — Explainer production — engine architecture, export pipelines, tools, libraries, alternatives, tooling, AI tooling (B08, B09, B12, B14, B17, B21, parts of B16)

Columns: slug · type · title · branches · draw-from (branch ids → convert via source-map.tsv; `sec:` = branch sections to read) · folded-in (no own page)

| slug | type | title | branches | draw-from | folded-in |
|---|---|---|---|---|---|
| `explainer-engine-blueprint` | Concept | Explainer engine blueprint | B17 | B17-12, B17-16, B17-18, B17-21, B17-22, B17-24, B17-26, B17-27, B17-28, B17-39, B17-43, B17-45 · sec: B17:Summary, B17:P15 |  |
| `hub-explainer-production` | Concept | Hub: Explainer production | B08 B09 B12 B14 B17 B21 | grep branches (synthesis page) |  |
| `video-export-pipeline` | Concept | Video export pipeline | B07 B08 B12 B13 B15 | B07-9, B07-12, B07-15, B07-16, B07-18, B08-3, B08-5, B08-6, B08-7, B08-8, B08-9, B08-13, B08-14, B15-19 …(+2, see pages.jsonl) |  |
| `typescript-types` | Capability | Bundled TypeScript types | B14 | B14-2, B14-5, B14-7, B14-8 | types-p5 |
| `ai-assisted-p5` | Concept | AI-assisted p5.js authoring | B14 B16 | B14-12, B16-26, B16-27, B16-36 | reflexa, spellburst, critical-ai-tutorials, chatting-with-code-tutorial |
| `save-canvas` | Construct | saveCanvas() | B08 B13 | B08-8 |  |
| `save-frames` | Construct | saveFrames() | B08 B13 B15 B17 | B08-2, B13-1, B15-19, B17-41 |  |
| `save-gif` | Construct | saveGif() | B08 B18 B20 | B08-1, B18-24, B20-33 |  |
| `canvas-capture` | Library | canvas-capture | B08 | B08-14 |  |
| `ccapture` | Library | CCapture.js | B07 B08 B12 B13 B15 B17 B20 | B07-16, B08-5, B12-5, B13-1, B13-2, B13-10, B15-19, B17-12, B20-36 | p5-webm-capture |
| `d3` | Library | D3 | B21 | B21-21 |  |
| `gsap` | Library | GSAP | B17 B21 | B17-37, B17-38 |  |
| `lil-gui` | Library | lil-gui | B05 | B05-8 |  |
| `lottie` | Library | Lottie | B21 | B21-25 |  |
| `manim-js` | Library | Manim.js | B17 B20 | B17-33, B20-38 |  |
| `matter-js` | Library | Matter.js | B09 | B09-20 |  |
| `mediabunny` | Library | Mediabunny | B08 | B08-6, B08-7 |  |
| `ml5js` | Library | ml5.js | B09 B11 B16 | B09-1, B09-7, B09-21, B11-21, B16-7 |  |
| `p5-animation-framework` | Library | p5_animationFramework | B17 | B17-4, B17-5 |  |
| `p5-anims` | Library | p5.animS | B17 | B17-14 |  |
| `p5-brush` | Library | p5.brush | B09 | B09-5 |  |
| `p5-capture` | Library | p5.capture | B08 B09 B10 B13 B15 B16 B17 B20 | B08-3, B09-1, B09-7, B10-22, B13-14, B13-15, B15-19, B16-35, B17-10, B17-11, B20-34 |  |
| `p5-collide2d` | Library | p5.collide2D | B09 | B09-10 |  |
| `p5-create-loop` | Library | p5.createLoop | B07 B08 B09 B17 | B07-19, B08-15, B09-1, B09-7, B17-13 |  |
| `p5-fillgradient` | Library | p5.fillGradient | B09 | B09-17 |  |
| `p5-grain` | Library | p5.grain | B09 | B09-15 |  |
| `p5-gui` | Library | p5.gui | B05 | B05-13 |  |
| `p5-node` | Library | p5-node | B08 | B08-16 |  |
| `p5-polar` | Library | p5.Polar | B09 | B09-24 |  |
| `p5-record` | Library | p5.record.js | B07 B08 B12 B13 B15 | B07-9, B08-8, B12-8, B13-1, B15-19 |  |
| `p5-riso` | Library | p5.riso | B09 | B09-1 |  |
| `p5-save-frames` | Library | p5.save-frames | B07 | B07-12 |  |
| `p5-scenemanager` | Library | p5.SceneManager | B17 | B17-3 |  |
| `p5-scribble` | Library | p5.scribble | B09 | B09-16 |  |
| `p5-sound` | Library | p5.sound | B09 B16 B17 B19 | B09-6, B09-13, B16-5, B16-13, B17-49, B17-50, B19-2, B19-3, B19-11, B19-14, B19-16 |  |
| `p5-teach` | Library | p5.teach.js | B16 B17 B20 | B16-35, B17-30, B17-31, B20-39 |  |
| `p5-tree` | Library | p5.tree | B09 B16 | B09-1, B09-7, B16-35 |  |
| `p5-tween` | Library | p5.tween | B09 B17 | B09-19, B17-1 |  |
| `p5-videorecorder` | Library | p5.videorecorder | B16 B17 | B16-35, B17-15 |  |
| `p5-wrapper-react` | Library | @p5-wrapper/react | B14 | B14-9 |  |
| `p5i` | Library | p5i | B14 | B14-10 |  |
| `p5js-svg` | Library | p5.js-svg | B09 | B09-1, B09-7, B09-9 | p5-plotsvg |
| `p5play` | Library | p5play | B09 B11 | B09-18, B11-28, B11-29 |  |
| `q5js` | Library | q5.js | B09 B13 | B09-18, B13-8 |  |
| `rough-js` | Library | rough.js | B09 | B09-11 |  |
| `theatre-js` | Library | Theatre.js | B17 B21 | B17-34, B17-35, B21-10 |  |
| `three-js` | Library | three.js | B21 | B21-22 |  |
| `timeplate` | Library | JS timeline micro-libraries | B17 | B17-7, B17-8, B17-9 | mattdesl-keyframes, timeliner |
| `tone-js` | Library | Tone.js | B09 B19 | B09-6, B09-7, B19-11 |  |
| `tweakpane` | Library | Tweakpane | B05 | B05-7 |  |
| `audio-master-clock` | Pattern | Audio master clock | B17 | B17-18, B17-35, B17-45, B17-46, B17-50 · sec: B17:P7 |  |
| `audio-post-mux` | Pattern | Audio muxing after render | B08 | B08-5, B08-6, B08-7, B08-8, B08-9, B08-15 · sec: B08:Patterns |  |
| `beats-and-captions` | Pattern | Beats and captions | B17 | B17-27 · sec: B17:P6 |  |
| `cdn-version-pinning` | Pattern | CDN version pinning | B13 B14 B16 B21 | B13-6, B16-3, B16-4, B16-11, B16-18 · sec: B16:P3 |  |
| `derived-geometry` | Pattern | Derived geometry (signals-lite) | B17 | B17-19 · sec: B17:P11 |  |
| `explainer-clock` | Pattern | One clock, three modes | B17 | B17-11, B17-12 · sec: B17:P1 |  |
| `scene-local-time` | Pattern | Scene-local time | B07 B17 | B07-15, B17-3, B17-24 · sec: B17:P5, B07:P7 |  |
| `third-party-timeline-driving` | Pattern | Driving third-party timelines from p5 | B17 B21 | B17-25, B17-26, B17-34, B17-37, B17-38, B21-2, B21-3, B21-7, B21-8, B21-10, B21-14, B21-15, B21-16, B21-17 · sec: B17:P14, B21:Patterns |  |
| `timeline-builder` | Pattern | Timeline builder (play/wait/all/stagger) | B17 | B17-16, B17-26, B17-27 · sec: B17:P3 |  |
| `track-tween` | Pattern | Track tween (alpha model) | B17 | B17-28, B17-22, B17-44 · sec: B17:P2 |  |
| `butter` | Platform | Butter for Developers | B08 B12 B13 | B08-8, B12-5, B13-1 |  |
| `p5js-libraries-directory` | Platform | p5.js libraries directory | B09 B16 B19 | B09-1 |  |
| `p5js-web-editor` | Platform | p5.js Web Editor | B14 B18 B20 B21 | B14-3, B14-4, B18-17, B20-21, B20-23, B20-26 |  |
| `webcodecs` | Platform | WebCodecs | B08 | B08-5, B08-18 |  |
| `electron-ffmpeg-export` | Technique | Electron + ffmpeg export | B07 B08 B12 B13 B15 | B07-9, B08-8, B12-5, B13-1, B15-19 |  |
| `frame-stepped-export` | Technique | Frame-stepped export | B07 B08 B12 B13 B15 B17 B19 B20 | B12-8, B15-19, B17-11, B17-12, B07-5, B07-6, B07-9, B07-15, B17-10, B17-15, B17-20, B17-41, B17-43, B19-2 …(+5, see pages.jsonl) · sec: B07:P4, B17:P13, B20:P7, B19:Patterns/deterministic |  |
| `generator-scenes` | Technique | Generator scenes | B17 | B17-16, B17-17 · sec: B17:P4 |  |
| `kinetic-typography` | Technique | Kinetic typography | B16 B20 | B16-4, B16-25, B20-28, B20-31, B20-32 · sec: B16:P5, B20:P8 |  |
| `png-sequence-ffmpeg` | Technique | PNG sequence + ffmpeg | B08 B13 B15 | B08-8, B08-9 |  |
| `puppeteer-capture` | Technique | Puppeteer headless capture | B07 B08 B14 | B07-15, B08-9 |  |
| `virtual-clock-capture` | Technique | Virtual-clock capture | B07 B08 | B07-16 · sec: B07:P5 |  |
| `algorithmic-art-skill` | Tool | algorithmic-art skill | B16 | B16-17 |  |
| `canvas-sketch` | Tool | canvas-sketch | B07 B08 B21 | B07-17, B08-13, B21-6, B21-7, B21-8, B21-2, B21-3, B21-10, B21-14, B21-15, B21-16, B21-17 · sec: B21:Patterns |  |
| `custom-build-server` | Tool | Custom build server | B16 | B16-31 |  |
| `ffmpeg` | Tool | FFmpeg | B07 B08 B15 | B07-9, B07-15, B07-18, B08-9, B15-19 |  |
| `genart-mcp` | Tool | genart-mcp | B16 | B16-19 |  |
| `hermes-agent-p5js-skill` | Tool | hermes-agent p5js skill | B14 B16 | B14-13, B16-18 |  |
| `manim` | Tool | Manim | B12 B16 B17 B20 | B12-7, B16-20, B16-22, B17-17, B17-27, B17-28, B17-29, B20-37, B20-39 | manim-web |
| `motion-canvas` | Tool | Motion Canvas | B12 B17 | B12-1, B12-3, B12-6, B17-16, B17-17, B17-18, B17-19, B17-21 |  |
| `openframeworks` | Tool | openFrameworks | B10 B21 | B10-9, B21-23 |  |
| `processing-p5-mode` | Tool | Processing p5.js Mode | B13 | B13-1, B13-6 |  |
| `remotion` | Tool | Remotion | B12 B17 B21 | B12-1, B12-2, B17-22, B17-23, B17-24, B17-26, B21-1, B21-2, B21-3, B21-4 |  |
| `revideo` | Tool | Revideo | B12 B17 | B12-2, B12-4, B17-16 |  |
| `teachable-machine` | Tool | Teachable Machine | B11 | B11-20 |  |
| `touchdesigner` | Tool | TouchDesigner | B07 B21 | B21-26 |  |
| `vite` | Tool | Vite | B14 | B14-7, B14-8 |  |
| `vscode-live-server` | Tool | VS Code workflow | B09 B14 B16 | B14-15, B16-35 | p5-server-extension, p5-project-generator |

## C4 — People, works, education, community, frontier, releases, atlas hubs (B10, B11, B13, B16, B20 + hub pages)

Columns: slug · type · title · branches · draw-from (branch ids → convert via source-map.tsv; `sec:` = branch sections to read) · folded-in (no own page)

| slug | type | title | branches | draw-from | folded-in |
|---|---|---|---|---|---|
| `frontier-2026` | Concept | Frontier 2026 | B16 B19 B21 | B16-1, B16-2, B16-3, B16-4, B16-6, B16-7, B16-8, B16-9, B16-10, B16-11, B16-12, B16-13, B16-14, B16-15 …(+24, see pages.jsonl) |  |
| `hub-people-community` | Concept | Hub: People, works and community | B10 B11 B13 B16 B20 | grep branches (synthesis page) |  |
| `index` | Concept | p5.js Explainer Atlas |  | B18-2, B18-3, B18-4, B18-5, B18-6, B18-7, B18-8, B18-9, B18-10, B18-11, B18-12, B18-13, B18-14, B18-15 …(+17, see pages.jsonl) |  |
| `mastery-ladder` | Concept | Mastery ladder | B18 | B18-6, B18-7, B18-8, B18-9, B18-10, B18-11, B18-12, B18-13, B18-14, B18-15, B18-16, B18-18, B18-19, B18-20 …(+2, see pages.jsonl) · sec: B18:Patterns/Mastery-curriculum, B18:Patterns/Expert-vs-novice |  |
| `open-questions` | Concept | Open questions and conflicts | B10 | B01-6, B01-26, B02-3, B02-14, B02-15, B02-18, B03-17, B03-18, B04-10, B04-11, B04-12, B04-14, B04-21, B06-1 …(+165, see pages.jsonl) · sec: ALL:Gaps |  |
| `community-export-pain` | Concept | Video export as community pain point | B08 B12 B13 | B12-3, B12-5, B12-8, B13-1, B13-2, B13-5, B13-10, B13-12, B13-13, B13-14, B13-15 |  |
| `editor-default-switch` | Concept | Web Editor default switch to 2.x | B06 B16 B21 | B21-11, B21-13 |  |
| `genuary` | Concept | Genuary | B10 B13 B20 | B10-19, B13-12, B20-30 |  |
| `llm-explainer-agents` | Concept | LLM explainer-video agents | B16 | B16-20, B16-21, B16-22 |  |
| `oss-microgrants` | Concept | OSS Microgrants Program | B16 | B16-6, B16-30 |  |
| `p5-education-research` | Concept | p5.js education research | B11 B18 | B11-6, B11-9, B18-21 | shape-toolbox |
| `p5js-governance` | Concept | p5.js project leadership | B03 B16 B18 | B03-1, B03-3, B03-4, B03-16, B03-19, B18-1 |  |
| `pf-fellowships` | Concept | Processing Foundation Fellowships | B11 B16 | B11-10, B11-14, B16-15 |  |
| `processing-community-day` | Concept | Processing Community Day | B16 | B16-16, B16-33 |  |
| `processingjs` | Library | ProcessingJS | B11 | B11-1, B11-2 |  |
| `coding-train-episode-package` | Pattern | Coding Train episode package | B11 B20 | B11-1, B11-6, B11-11, B11-12, B11-13, B11-19, B11-25, B11-26, B20-23, B20-25, B20-26, B20-27 · sec: B20:P9, B11:Patterns |  |
| `art-blocks` | Platform | Art Blocks | B20 | B20-10, B20-11, B20-13, B20-18, B20-3, B20-43 · sec: B20:P1 | ringers |
| `coding-train` | Platform | The Coding Train | B02 B04 B10 B20 | B02-18, B04-25, B04-26, B10-4, B10-5, B20-20, B20-22, B20-24 |  |
| `fxhash` | Platform | fxhash | B20 | B20-43 |  |
| `game-lab` | Platform | Code.org Game Lab | B11 | B11-28 |  |
| `gorilla-sun` | Platform | Gorilla Sun | B20 | B20-45 |  |
| `khan-academy-live-editor` | Platform | Khan Academy Live Editor | B11 | B11-1, B11-3 |  |
| `p5js-2x` | Platform | p5.js 2.x | B06 B14 B16 B19 B21 | B14-1, B16-9, B16-12, B19-8, B19-10, B21-15 |  |
| `p5js-showcase` | Platform | p5.js Showcase | B11 | B11-15 |  |
| `processing` | Platform | Processing | B10 B18 B21 | B10-9, B10-12, B18-3, B18-5, B21-24 | design-by-numbers |
| `processing-foundation` | Platform | Processing Foundation | B16 B18 | B16-14, B16-15, B18-4 |  |
| `akshat-patil` | Practitioner | Akshat Patil | B03 B16 | B03-18, B16-6 |  |
| `amy-goodchild` | Practitioner | Amy Goodchild | B20 | B20-46 |  |
| `barney-codes` | Practitioner | Barney Codes | B10 | B10-17 |  |
| `ben-fry` | Practitioner | Ben Fry | B18 | B18-3 |  |
| `ben-kovach` | Practitioner | Ben Kovach | B20 | B20-17 | edifice |
| `casey-reas` | Practitioner | Casey Reas | B18 | B18-3, B18-22 |  |
| `craig-kaplan` | Practitioner | Craig S. Kaplan | B20 | B20-30 | spatial-hashing |
| `daniel-shiffman` | Practitioner | Daniel Shiffman | B04 B07 B10 B11 B17 B18 B20 | B04-20, B04-25, B07-11, B10-4, B11-22, B11-25, B17-51, B18-4, B18-25, B20-22, B20-23 |  |
| `dave-pagurek` | Practitioner | Dave Pagurek | B03 B06 B07 B08 B13 B15 B16 B20 | B03-1, B03-14, B06-8, B06-16, B07-9, B08-8, B13-1, B13-13, B15-2, B15-13, B16-1, B16-2 |  |
| `dave-whyte` | Practitioner | Dave Whyte (Bees and Bombs) | B10 B20 | B10-12, B20-29 |  |
| `etienne-jacob` | Practitioner | Etienne Jacob | B07 B10 | B07-14, B10-8, B10-11 |  |
| `jazon-jiao` | Practitioner | Jazon Jiao | B17 B20 | B17-33 |  |
| `kazuki-umeda` | Practitioner | Kazuki Umeda | B10 | B10-23 |  |
| `kenneth-lim` | Practitioner | Kenneth Lim | B05 B06 B13 B16 | B05-27, B06-9, B13-7, B16-4, B16-31 |  |
| `kit-kuksenok` | Practitioner | Kit Kuksenok | B03 B06 B13 B16 B18 | B03-4, B06-8, B06-17, B13-3, B16-12, B16-32, B18-1 |  |
| `kjetil-golid` | Practitioner | Kjetil Golid | B20 | B20-16 |  |
| `lauren-lee-mccarthy` | Practitioner | Lauren Lee McCarthy | B10 B18 | B10-20, B18-1, B18-5 |  |
| `matt-deslauriers` | Practitioner | Matt DesLauriers | B07 B08 B17 | B07-17, B08-13 |  |
| `patt-vira` | Practitioner | Patt Vira | B10 B20 | B10-13, B10-21, B20-41 |  |
| `saskia-freeke` | Practitioner | Saskia Freeke | B10 | B10-18 |  |
| `snowfro` | Practitioner | Snowfro (Erick Calderon) | B20 | B20-13 |  |
| `tapioca24` | Practitioner | tapioca24 | B08 B13 B17 | B08-4, B17-10 |  |
| `tim-rodenbroeker` | Practitioner | Tim Rodenbröker | B10 | B10-15, B10-16 |  |
| `tyler-hobbs` | Practitioner | Tyler Hobbs | B20 | B20-1, B20-9 |  |
| `zach-lieberman` | Practitioner | Zach Lieberman | B20 | B20-44 |  |
| `release-2-2` | Release | p5.js 2.2 | B06 B16 | B06-1, B06-2, B06-3, B06-4, B06-5, B06-6, B06-7, B06-8, B06-9, B06-10, B06-11, B06-12, B06-13, B06-14 …(+31, see pages.jsonl) |  |
| `release-2-3` | Release | p5.js 2.3 | B06 B16 B19 | B16-3 |  |
| `release-2-4` | Release | p5.js 2.4 | B16 B19 | B16-6, B16-9 |  |
| `golan-levin-loop-templates` | Tool | Golan Levin loop templates | B20 | B20-27 |  |
| `archetype` | Work | Archetype | B20 | B20-15, B20-16 |  |
| `chromie-squiggle` | Work | Chromie Squiggle | B20 | B20-12, B20-13 |  |
| `coding-challenge-130` | Work | Coding Challenge 130: Fourier epicycles | B11 | B11-25 |  |
| `coding-challenge-24` | Work | Coding Challenge 24: Perlin noise flow field | B04 | B04-26 |  |
| `coding-challenges` | Work | Coding Challenges | B10 B20 | B10-6, B20-25, B20-26 |  |
| `dynamic-learning` | Work | Dynamic Learning | B11 | B11-13 |  |
| `everyone-can-code` | Work | Everyone Can Code | B11 | B11-12 |  |
| `explorable-documents-template` | Work | Explorable Documents template | B05 B11 | B05-19, B11-26 |  |
| `fidenza` | Work | Fidenza | B20 | B20-1, B20-5 |  |
| `generative-design-book` | Work | Generative Design (p5 edition) | B20 | B20-40 |  |
| `getting-started-with-p5js` | Work | Getting Started with p5.js | B18 | B18-22 |  |
| `icm-itp` | Work | Introduction to Computational Media (ITP) | B11 | B11-16 |  |
| `nature-of-code` | Work | The Nature of Code | B04 B10 B11 B18 B20 | B04-20, B10-2, B10-3, B11-22, B11-24, B18-25, B20-19, B20-21, B20-22 |  |
| `nyu-ml-courses` | Work | NYU ML-for-the-arts courses | B11 | B11-17, B11-18 |  |
| `siena-physics-demos` | Work | Siena College physics demos | B11 | B11-27 |  |
| `ual-video-exporter-template` | Work | UAL CCI video exporter template | B07 B13 | B13-5 |  |

