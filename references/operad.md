# The design operad — composable units for prompt-to-sketch work

*Internal reference. Users see "the parts must agree with the whole"; agents use the structure below.*
Grounding: colored operads (May 1972; Leinster 2004), operadic consistency (Bottman, Liu & Richardson,
arXiv:2606.13649), and the studio's own `meta-operad` skill. The categorical facts that justify the laws
are standard (a colored operad's composition is associative and equivariant); what is new here is the
**choice of colors and operations for generative visual design** and the two algebras that make
originality and coherence checkable.

## 1. Why an operad

A generative sketch is not a list of features; it is a **tree of many-in, one-out operations**: a field and a
set of seed points *grow* into paths; paths and a palette are *marked* into a layer; layers are *composed*
into a frame. Writing that tree down, with typed ports, buys four things:

1. **Coherence by construction** — two units can only be plugged together when their port types match, so
   "random features stacked in one draw loop" (failure B5) is not expressible.
2. **Parallel build lanes** — disjoint subtrees commute, so separate agents can build them at the same time
   (the algebraic license for fan-out; lanes that touch the same port are never parallel).
3. **Originality as a property of the composite** — every unit alone may be a cliché; the *composition* of
   units that rarely co-occur, joined through matching types, is where unfamiliar work comes from.
4. **A checkable invariant** — the sketch generated directly from the brief (total collapse) and the sketch
   assembled unit by unit (full decomposition) must agree on declared perceptual features. Disagreement
   localizes which edge of the design broke.

## 2. Colors (port types)

| Color | What flows | Concrete JS shape (studio convention) |
|---|---|---|
| `Canvas` | format, size, margins, density | `{w, h, d, margin, aspect}` |
| `Stream` | an independent seeded random source | `Studio.stream('structure' \| 'detail' \| 'colour' \| …)` |
| `Palette` | role-weighted colours + source | `Studio.palette({...})` → `{ground, roles, pick()}` |
| `Field` | scalar or vector function of position (and t) | `(x, y, t?) => number \| [dx, dy]` |
| `Regions` | closed areas with ids | `[{id, poly:[[x,y]…], depth, tags}]` |
| `Points` | positioned seeds, optionally weighted | `[[x, y, w?]…]` |
| `Paths` | ordered polylines with per-vertex attributes | `[{pts:[[x,y]…], w:[…]?, tag}]` |
| `Glyphs` | font outlines as contours | `font.textToContours(…)` → `[[{x,y}…]…]` |
| `Signal` | time series from sound, input or data | `{t:[…], v:[…]}` or a live sampler |
| `Layer` | rendered marks on a buffer | `p5.Graphics` / `p5.Framebuffer` / draw list |
| `Frame` | the composed image at time t | the main canvas after compose |
| `Time` | the clock | `Studio.clock({mode})` |
| `Index` | a position in an enumerated finite space (exhaustive-rule posture: the seed selects *which* member) | integer + a verified bijection seed → member |

If you cannot name the color of an edge, you do not yet understand that step — split it.

## 3. Operations (units)

Arity is written `inputs → output`. The **technique** column is the implementation family (full atlas in
`technique-atlas.md`); a unit is the slot, the technique is what fills it.

| Unit | Signature | Techniques that fill it | Cost class | Determinism |
|---|---|---|---|---|
| **Enumerate** | `Rule → Points \| Regions \| Paths (tagged)` | all members of a finite combinatorial space: bracketings, tilings, permutations, CA rules, words | low–mid | pure |
| **Select** | `Index × Enumerate → …` | the exhaustive-rule seed: which member/cycle/face; must be a verified bijection over the space | low | pure |
| **Judge** | `Candidates × Rules → Candidates` | encoded judgment: a decision procedure (accept/reject, gap-closing, copyist's choice) applied to proposals | low–mid | pure |
| **Frame** | `Brief → Canvas` | poster 4:5, print 2:3, square ≥1080, cinema 16:9, plotter A3 | — | pure |
| **Ground** | `Canvas × Palette × Stream → Layer` | paper tone, grain, gradient in lightness, procedural paper (Xie) | low | pure |
| **Field** | `Canvas × Stream (× Time) → Field` | noise, curl, domain warp, SDF, image/type gradient, attractors, data | low–mid | pure |
| **Partition** | `Canvas × Stream → Regions` | recursive subdivision, Voronoi/Lloyd, grid, WFC, Truchet, symmetry groups | low | pure |
| **Typeset** | `Glyphs × Canvas → Regions` | text → contours → regions/SDF (`font.textToContours`) | mid | pure (font-dependent) |
| **Place** | `(Canvas \| Regions) × Stream → Points` | Poisson disc, Gaussian clusters, lattice + 1% disorder (Molnár), weighted stippling | low–mid | pure |
| **Grow** | `Points × Field × Stream (× Regions) → Paths` | flow tracing w/ collision (Hobbs), differential growth, DLA, space colonization, walkers, physarum, string wrap | mid–high | sim (fixed dt) |
| **Mark** | `(Paths \| Points \| Regions) × Palette × Stream → Layer` | hatch, stipple, sand spline, brush bristles, watercolor layering, flat fill, plotter line | mid–high | pure |
| **Mask** | `Layer × Regions → Layer` | clip, erase, invert-clip (`clip(cb,{invert})`) | low | pure |
| **Listen** | `Signal → Field \| Stream \| Points` | FFT bands, amplitude envelope, pointer path, dataset columns | low | pure if recorded |
| **Post** | `Layer (× Time) → Layer` | grain, strands filter, feedback (ping-pong FBO), dither/halftone, misregistration | mid (GPU) | pure/sim |
| **Compose** | `Layer₁ × … × Layerₙ (× Palette) → Frame` | ordered blend, multiply, screen-print overprint | low | pure |
| **Animate** | `Frame-generator × Time → Frame` | still · loop (pure in t) · sim (fixed dt, replay) · scroll | — | declared |
| **Export** | `Frame → File` | PNG @ density, SVG layers (plotter), frame sequence → MP4/GIF | — | pure |

A sketch is a **tree** whose root is `Export ∘ Animate ∘ Compose(…)`. Write it in the header as `Units:`.
Example: `Compose(Ground(paper), Mask(Mark(hatch)(Grow(flow)(Place(poisson), Field(sdf-type))), Typeset("CETI")))`.

## 4. Laws (and what each buys in practice)

1. **Typing.** `f ∘ᵢ g` is legal only if `g`'s output color equals `f`'s i-th input color. *Practice:* the
   concept skill rejects a tree with an untyped or mismatched edge before any code exists.
2. **Sequential associativity.** `(f ∘ g) ∘ h = f ∘ (g ∘ h)`. *Practice:* you may refactor where a helper
   boundary sits without changing the image; a refactor that changes the image is a bug, detectable by
   frame hash.
3. **Parallel associativity (disjoint slots commute).** Plugging into slot i and slot j (i ≠ j) in either
   order gives the same tree. *Practice:* units in disjoint subtrees can be built by separate agents at
   the same time; units sharing a port (e.g. two units writing the same `Palette`) must be sequential.
4. **Stream independence.** Each unit draws from its own named stream. *Practice:* changing the colour
   stream never moves a single point; tuning detail never reshuffles structure. (Hobbs: *when* randomness
   enters is the artist's main lever — named streams make "when" explicit.)
5. **Immutability downstream.** A resolved slot (palette, canvas) is read, never redefined, by later units;
   changes happen only through a named edit (§6).

## 5. Algebras: one tree, several valuations

The same tree is evaluated in different value algebras. Never build a second, drifting model of the work.

| Algebra | Value per unit | Composition | Used for |
|---|---|---|---|
| **Render** | p5 code | substitution | the sketch itself |
| **Typicality** | cliché score 1–5 from the atlas, and pair co-occurrence | unit scores combine; *pairs* that rarely co-occur lower typicality | originality planning before code |
| **Cost** | ms/frame or ms/still estimate | sum (with per-frame vs once split) | performance budget, escape-hatch decision |
| **Determinism** | pure / sim / live | weakest link (min) | can it be scrubbed, replayed, exported frame-exact? |
| **Evidence** | lineage citations | union | colophon, attribution, ethics |
| **Accessibility** | flashes/s, motion, contrast of drawn text | max of risk | reduced-motion still, ≤ 3 flashes/s |

**Typicality, operationally.** Score each *load-bearing* edge (a join between two technique-filled units that
the intent depends on) 1–5 by how often you have seen that pairing (flow-field-into-hatching: 3; differential
growth masked by type contours and marked as stipple: 1). Structural joins — `Ground → Compose`, `Animate`,
`Export`, `Frame` — are not scored. Two rules, both required:
1. at least one load-bearing edge scores **≤ 2** (somewhere the work is unfamiliar), and
2. tree typicality = mean of the three highest load-bearing edges **≤ 3.5** (the rest isn't all stock).
This is the generative counterpart of verbalized sampling: originality enters at the joins. The builder's own
scores are self-graded; the cliché seat is the external check.

## 6. Edit scripts (named, schema-preserving refinements)

Revision never means "make it better". It is a list of named edits, each with a rationale tied to a finding:

| Edit | Changes | Typical trigger |
|---|---|---|
| `SwapTechnique(unit, a→b)` | the technique filling one slot | cliché seat REJECT on that unit |
| `Reweight(stream, dist)` | uniform → gauss/pareto/weighted | MET-no-hierarchy, CRAFT-UNIFORM |
| `Silence(region)` | add a Mask that carves negative space | MET-uniform-coverage, MET-texture-only (texture covering the frame) |
| `Graft(mass)` | add one dense region / solid mark at a typed port | MET-sparse-flat (an evenly sparse page has no mass — more silence cannot help) |
| `Reframe(canvas)` | format, margin, anchor off-axis | MET-centered, MET-no-margin |
| `Revalue(palette)` | lightness structure, one accent, transpose | colour seat, MET-rms_contrast |
| `Subtract(unit)` | remove a unit (Rams test) | intent seat: "decoration" |
| `Graft(unit)` | add one unit at a typed port | "single trick" craft finding |
| `Repose(posture)` | perturbed-order ↔ exhaustive-rule ↔ encoded-judgment | concept seat: no point of view |
| `Retime(clock)` | still ↔ loop ↔ sim | intent mismatch (B14) |
| `Reallocate(series)` | move a piece to an unused ground / accent / layout flex in the set | series.py HOUSE-LOOK, cliché seat 'shared habit' |

Precedence when edits conflict: **accessibility ⊐ brief constraints ⊐ originality ⊐ aesthetic preference.**
Converged ⇔ all gates pass ∧ the last critique pass produced the identity edit (no named edits), capped at
three passes; otherwise ship the best version with open issues stated.

**Coherence of refinement.** Two independent edits (on disjoint units) applied in either order must give the
same render. If they don't, the units were not independent — the tree is mis-drawn. Fix the tree, not the
pixels.

## 7. Operadic consistency for images (the OC check)

- **Tier 1 (always for a flagship piece):** generate once from the brief directly (total collapse: "one
  prompt, whole sketch") and once through the decomposition (concept → unit tree → forge). Render both at
  the same seed. Compare on the **declared invariants** of the brief (e.g. dominant hue family, value
  structure, negative-space band, focal location, motion energy). Agreement within tolerance → the
  decomposition is faithful. Disagreement → the failing invariant names the edge (palette disagrees ⇒ the
  `Palette` edge; focal point disagrees ⇒ `Frame`/`Partition`).
- **Tier 2:** add one mid-collapse per internal unit (e.g. merge `Grow ∘ Place` into one prompt).
- OC is **calibration, not truth**: two versions can agree and both be dull. It catches *decomposition
  theater* (a tree that does not recompose to the brief) and localizes defects; the seats judge quality.

## 8. Worked tree (shape only — copy the level, not the content)

```
Brief:  "a poster about listening — quiet, dense in one place, empty in another"
Posture: perturbed-order
Tree:   Export(png@2x)
          ∘ Animate(still)
          ∘ Compose( Ground(paper·grain),
                     Mark(stipple, Palette, detail)( Place(weighted, structure)( Field(signal→density) ) ),
                     Mark(hairline, Palette)( Partition(lattice+1%disorder) ) )
Edges (load-bearing): signal→Field 2 · Field→Place 2 · Place→Mark(stipple) 3 · Partition→Mark(hairline) 4   ⇒ top-3 mean 3.0 ≤ 3.5 ✓ · min edge 2 ≤ 2 ✓
Streams: structure | detail | colour
Invariants (for OC + seats): one dense region ≤ 30% of area; ≥ 45% negative space; one accent hue ≤ 8% of ink
```
