# Technique atlas — 42 generative techniques mapped to operad units

*Source: research/02-lineage-and-frontier.md (primary sources cited there). Cliché 1 = rare, 5 = default beginner output. "Cliché 5" is not "bad"; it means the technique needs a twist to be yours. The Unit column says which slot of the design operad (operad.md §3) the technique fills; cost is per still at ~1080², CPU p5 unless noted.*

**How to use:** in CONCEPT, pick the unit tree first, then fill each slot with a technique. Score each *edge* (pair of joined techniques) for how often you have seen that pairing; originality enters at the joins (operad.md §5).

| # | Technique | Unit | Cost | Core idea | Origin / reference | Cliché | Push beyond cliché |
|---|---|---|---|---|---|---|---|
| 1 | Flow fields | Grow (Field→Paths) | mid | Grid of angles; particles step along them to draw curves | Hobbs essay 2020; Fidenza 2021 | 5 | Hobbs himself: don't use Perlin — build the field from image gradients, SDFs, attractors, or embedded objects; enforce min-distance; vary step length by region; dots instead of lines |
| 2 | Perlin / simplex noise | Field | low | Smooth coherent randomness | Perlin 1983 (Oscar 1997) | 5 | Use as *one input* to a composition decision, never as the texture itself; curl noise; noise-of-noise (domain warp); quantise noise into discrete decisions |
| 3 | Domain warping | Field | low | Feed noise through noise: `f(p + f(p))` | Quilez (iquilezles.org) | 4 | Warp a *structured* pattern (grid, type, stripes), not a blob; warp the palette lookup too |
| 4 | Circle packing | Place | mid | Place non-overlapping circles, largest first or random with rejection | Classic; Tarbell | 4 | Pack *along* a flow field or inside type glyphs; pack non-circles (SDF packing); use power-law radii (Hobbs) |
| 5 | Recursive subdivision | Partition | low | Split rectangles / triangles recursively | Molnár, Mondrian-likes; Golid *Archetype* 2021 | 4 | Golid: partition → grid → re-partition with *inherited* rules; non-axis-aligned splits; subdivide a Voronoi cell, not a rect |
| 6 | Truchet tiles | Partition + Mark | low | Tiles with rotational variants that connect at edges | Truchet 1704; Smith 1987 | 4 | Multi-scale truchet (Carlson); non-square tilings; tiles defined by SDF arcs with varying width |
| 7 | Wave Function Collapse | Partition | mid | Constraint propagation with random collapse = "a generator that obeys constraints" | Gumin 2016; Merrell model synthesis | 3 | Use non-tile adjacency (colour, line direction); run WFC on a hex or Penrose lattice; combine with hand-authored "exemplar" images |
| 8 | L-systems | Grow | low | String rewriting → turtle graphics | Lindenmayer 1968; Prusinkiewicz | 3 | Stochastic + context-sensitive rules; grow on a surface; interpret symbols as *brush* actions, not just turn/forward |
| 9 | Space colonisation (venation) | Grow | mid | Attractors pull branches; nodes consumed as reached | Runions et al. 2005 | 2 | Attractor sets from images/text; two competing colonies; growth into a plotter-friendly line hierarchy |
| 10 | Differential growth / differential line | Grow (sim) | high | Nodes attract neighbours, repel others, insert on stretch; curve buckles | Hoff *On Generative Algorithms*; Nervous System *Floraform* 2015 | 3 | Vary growth rate by a field ("the edge is the active growth area"); constrain inside a shape; 3D on a mesh |
| 11 | Reaction–diffusion (Gray–Scott) | Field (sim, GPU) | high CPU / low GPU | Two chemicals, feed/kill rates → spots, stripes, labyrinths | Turing 1952; Pearson 1993 | 4 | Vary feed/kill spatially (Karl Sims maps); seed with type; run in compute shader and *then* vectorise for plotter |
| 12 | Diffusion-limited aggregation | Grow (sim) | high | Random walkers stick to a seed → dendrites | Witten–Sander 1981 | 3 | Bias walkers with a field; aggregate onto a line/text; colour by arrival time |
| 13 | Physarum / slime mould | Grow (sim, GPU) | high CPU / low GPU | Agents sense-and-steer on a trail map, deposit, diffuse, decay | Jones 2010; Sage Jenson 2019 | 3 | Multiple species with different sensor params; agents constrained by SDF; snapshot trails as hatching |
| 14 | Boids / flocking | Grow (sim) | mid | Separation, alignment, cohesion | Reynolds 1987; Shiffman NoC | 4 | Draw the *history* not the birds; flock in a flow field; alignment to typography |
| 15 | Particle systems + forces | Grow (sim, GPU at scale) | high | Mass, forces, integration | Shiffman NoC ch.2–4 | 5 | Move to compute shaders (p5 2.3) for 10⁶ particles; springs/verlet cloth; particles as *ink* with pressure |
| 16 | Strange attractors | Grow → Points | mid | Lorenz, Clifford, de Jong, Aizawa iterated maps | Lorenz 1963; Sprott | 3 | Project 3D attractors with depth-of-field; density-accumulate (histogram) then tone-map; plotter via stroke sampling |
| 17 | Voronoi / Delaunay | Partition | mid | Nearest-site partition / dual triangulation | Voronoi 1908; Fortune; d3-delaunay | 4 | Weighted/centroidal (Lloyd) relaxation; Voronoi on non-Euclidean metrics (Manhattan, L∞); use cells as *rooms* for other techniques |
| 18 | Weighted Voronoi stippling | Place + Mark | high | Lloyd's relaxation with density from an image | Secord 2002 | 3 | Stipple a *generated* field, not a photo; vary dot shape; TSP-connect points for single-line plots |
| 19 | Hatching / cross-hatching | Mark | mid | Parallel lines whose density encodes tone | Engraving; Hobbs texture essays | 3 | Hatch along flow-field direction; hatch per Voronoi cell with its own angle; pressure-modulated plotter lines |
| 20 | Watercolour layering | Mark | high | Recursive polygon edge deformation; 30–100 layers at ~4% alpha; per-edge variance | Hobbs 2017 | 4 | Vary variance *per edge* (sharp vs soft boundaries); texture masks per layer; interleave colours |
| 21 | Sand / grain strokes (sandpainting) | Mark | high | Thousands of transparent dots along a curve | Tarbell *Sand Stroke*; Hoff *Sand Spline* | 3 | Sample density from curvature; multi-colour grains; use as the fill for other shapes |
| 22 | Substrate / crack growth | Grow | mid | Cracks spawn perpendicular from existing cracks | Tarbell 2003 | 3 | Crack a *coloured* field; cracks obey a flow field; 3D cracks on a surface |
| 23 | Cellular automata | Field / Partition (sim) | mid | Local rules on a grid | Conway 1970; Wolfram | 4 | Non-square lattices; continuous CA (Lenia); "crazy rules" (Genuary 2026 d.9); CA as palette selector not image |
| 24 | Wallpaper / symmetry groups | Partition | low | 17 plane symmetry groups | Classical; Genuary 2026 d.17 | 2 | Break symmetry 1% (Molnár); symmetry group varies across canvas; apply to flow-field output |
| 25 | SDF raymarching | Field + Post (GPU) | GPU | Signed distance functions marched per pixel | Hart 1996; Quilez; Shadertoy | 4 | p5.strands fragment hooks; combine 2D SDF with hatching instead of lighting; SDF booleans as composition layout |
| 26 | Shader feedback loops | Post (sim, GPU) | GPU | Previous frame as texture input | Hydra; Shadertoy buffers | 3 | Feedback through a *displacement* not a blur; combine with WFC-generated masks |
| 27 | Image-based fields | Field | low | Use luminance/gradient of an image as a field | Secord; countless | 3 | Use a *generated* image (another sketch's output); gradient-of-gradient |
| 28 | Dithering / halftone | Post / Mark | mid | Error diffusion or threshold patterns | Floyd–Steinberg 1976 | 3 | Custom dither kernels; halftone with non-dot shapes (glyphs, arcs); dither a generated field |
| 29 | Marching squares / contours | Grow (Field→Paths) | mid | Iso-lines of a scalar field | Lorensen & Cline 1987 | 3 | Contour a noise field for plotter topography; vary iso-spacing; contour *text* SDFs |
| 30 | Polar / radial mapping | Frame transform | low | Remap x→angle, y→radius | Classical; Genuary 2026 d.10 | 4 | Multi-centre polar; log-polar spirals; polar warps of a grid system |
| 31 | Grid + jitter (Schotter) | Place | low | Regular grid with growing random perturbation | Nees 1968; Molnár | 5 | Vary the *axis* of disorder (gradient, radial, noise-driven); jitter in parameter space not just position |
| 32 | Lissajous / harmonographs | Grow | low | Sum of damped sinusoids | 1800s | 4 | Modulate frequencies with noise; use as pen path with pressure; 3D harmonograph projected |
| 33 | Noise-driven typography | Typeset | mid | Glyph outlines deformed, filled or traced by fields | Lieberman; Genuary d.5 | 3 | Glyph as SDF driving packing/growth; variable-font axes as noise targets; "avoid using a font" — build letters from the technique |
| 34 | Stroke simulation (brush, pen pressure) | Mark | mid | Width/opacity modulated along path; bristles as sub-strokes | Hobbs "How to Hack a Painting" 2017 | 3 | Bristle offsets per stroke; ink depletion over length; plotter *real* ink |
| 35 | String art / peg wrapping | Grow | mid | Thread between pegs on a frame | Cherniak *Ringers* 2021 | 3 | Non-circular peg layouts; wrap order from TSP; physical plot |
| 36 | Fracture / cut-up (fractures) | Grow | mid | Lines that stop when hitting others | Hoff *Fractures*; Tarbell | 3 | Fracture a *shape* with varying density; colour by region adjacency |
| 37 | Packing of non-circles / nesting | Place | high | Rejection or SDF-based placement of arbitrary shapes | Many | 2 | Pack glyphs; pack along curves; pack with rotational search |
| 38 | Genetic / evolutionary | search over params (meta) | very high | Mutate, select, breed parameter sets | Sims 1991; Genuary 2026 d.29 | 2 | Use LLM or human as the fitness function; evolve *rules* not images |
| 39 | Collage / texture compositing | Ground / Compose | mid | Procedural paper, torn edges, layered cut-outs | Emily Xie *Memories of Qilin* 2022 | 2 | Generate the textures too; cut shapes from another technique's output |
| 40 | Quine / self-referential | Frame (constraint) | low | Program whose output includes its source | Genuary d.11; "Boxes only", "16×16" constraints | 1 | Constraint-as-concept: HTML-only (d.28), one line (d.20), lowres (d.4) — the constraint *is* the originality |
| 41 | Gaussian splats / point-cloud rendering | Mark (GPU) | GPU (WebGPU) | Render millions of oriented splats on GPU | Kerbl et al. 2023; p5 WebGPU roadmap | 1 | Splats as generative primitives, not scans |
| 42 | Data-driven form | Listen → Field | low | Real datasets drive geometry | Anadol (maximalist); Fry (*Valence*) | 3 | Keep the data legible — Salvaggio's critique: don't "elevate the black box" |

## Edge (pairing) typicality — starter table

Seen-often pairings (score 4–5): flow field → thin lines on dark; noise → hue; circle packing → flat fills on cream; Truchet → random rotation; particles → additive glow; Voronoi → random pastel fills; L-system → green tree.

Under-explored pairings (score 1–2), each still type-correct: type contours (Typeset) → differential growth (Grow) → stipple (Mark); signal envelope (Listen) → Poisson density (Place) → hairline marks; WFC regions (Partition) → per-region hatch angle (Mark); physarum trails (Grow) → vectorised plotter paths (Export svg); SDF of a glyph (Field) → string-wrap pegs (Grow); reaction–diffusion (Field) → halftone screen angle (Post); recursive subdivision (Partition) → watercolor per cell with inherited variance (Mark); attractor density histogram (Grow→Points) → tone-mapped stipple (Mark).

Add a row here whenever a seat or a human calls a pairing fresh or stale; this table is the studio's learned prior.
