# 02 — Lineage and Frontier: The Story and State of the Art of Generative / Algorithmic Art

*Research lane for ceti-p5-studio. Compiled 2026-10-05 from primary sources (artists' essays, Processing Foundation, p5js.org, Art Blocks, fxhash, museum pages, interviews). Fetch log in §4.*

---

## 1. The Story: where we have been, the pivots, where we are going

### Prologue: rules before machines

Philip Galanter's 2003 paper insists generative art is "as old as art itself" — Islamic tilework, symmetric pattern, canon and fugue. The thing that makes it generative is not the computer but the **cession of control**: "the key element in generative art is then the system to which the artist cedes partial or total subsequent control." That sentence is the whole discipline. Every later chapter is a story about *what* is ceded, *how much*, and *what the artist keeps*.

Sol LeWitt wrote the conceptual charter in 1967 without touching a computer: "The idea becomes a machine that makes the art." His wall drawings are instruction sets executed by other hands — the first widely collected works where the artwork *is* the algorithm and the rendering is, in his words, "a perfunctory affair." Everything on Art Blocks half a century later inherits this legal and aesthetic premise: you own the program and the right to its outputs.

### 1965: the plotter decade

The first computer-drawn images appear almost simultaneously in Stuttgart and New Jersey. In February 1965 Georg Nees shows plotter drawings at the Studiengalerie of Stuttgart's Technische Hochschule — philosopher Max Bense's circle, where "generative aesthetics" was a term before it was a practice. Nees's *Schotter* (1968) is the field's first canonical image: a column of squares that begins in perfect order and, row by row, tumbles into disorder as random rotation and displacement are allowed to grow. Nees described the mechanism plainly: "the length and radius of the individual arcs are randomly chosen within the limits defined by the programmer." *Limits defined by the programmer* — there is Galanter's partial cession again. Frieder Nake, A. Michael Noll and Nees form the "3N" of early computer art.

Vera Molnár, who had been drawing with a self-invented "machine imaginaire" since 1959, got real computer access in 1968 and spent the next fifty-five years asking one question: how much disorder can a grid absorb before it stops being a grid? Her title *1% Disorder* and her phrase "the vulnerability of the right angle" are the earliest clear statements of the structured-randomness ethic — perturb a strong order by a tiny, controlled amount and the eye is rewarded with life rather than noise. Manfred Mohr took the opposite tack: no noise at all, only the exhaustive, rule-driven unfolding of the n-dimensional hypercube's edge structure, a "formal language" he has worked for five decades. Harold Cohen built AARON from the late 1960s to his death in 2016: not a neural network but a hand-encoded body of drawing knowledge — the Whitney's 2024 retrospective framed it as "a collaboration," the earliest sustained attempt to put an *artist's* process, rather than mathematics, into code.

Three positions were on the table by 1975 and are still the three positions today: **perturbed order** (Molnár, Nees), **exhaustive rule** (Mohr, LeWitt), and **encoded judgment** (Cohen).

### 1999–2013: the tools become the movement

The second pivot is pedagogical. John Maeda's *Design By Numbers* (1999, MIT Media Lab) was a deliberately tiny language — 100×100 pixels, grayscale — built to teach designers to think in code. Two of Maeda's students, Casey Reas and Ben Fry, wanted "a system that was as easy to use as Design By Numbers, but with a bridge to making more ambitious work." Processing was created on 9 August 2001. Its core insight was *sketching*: "Through sketching with code, unexpected paths are discovered and followed." The sketch, not the program, became the unit of creative-coding practice. Jared Tarbell's complexification.net (2003–05) — *Substrate*, *Happy Place*, *Node Garden* — demonstrated what Processing was for and set the open-source norm ("open-sourcing every project henceforth"). Marius Watz's Generator.x (2005) gave the scene a curatorial frame. Daniel Shiffman's *The Nature of Code* (2012) turned physics and emergence into a syllabus.

In 2013 Lauren Lee McCarthy started p5.js for the browser, and reframed the question of *who* codes. She was "frustrated by the lack of diversity in the open source world"; p5.js was built "with an intention to hold inclusion, diversity, and access as core values." The Processing Foundation (2012) made that a governance commitment. Shiffman's 2024 edition of *The Nature of Code* rewrote the whole book in p5.js, closing the loop: the canonical textbook of simulation-driven art now runs on the canonical browser library.

### 2014–2020: the essayists and the techniques

Between the tool and the market sits a decade of written craft knowledge that is still the field's best teaching material. Tyler Hobbs's essays (2014–2020) made explicit what the plotter generation knew implicitly: *when* randomness enters a composition is the artist's primary lever; non-uniform distributions (Gaussian, power-law) are the difference between oatmeal and composition; "RGB is for machines, HSB is for artists"; watercolor is recursive polygon deformation stacked at 4% opacity. Anders Hoff (inconvergent) published *On Generative Algorithms* — hyphae, differential line, sand splines, fractures — with the ethic "recreate some pattern or behaviour with as few and as simple rules as possible." Zach Lieberman's daily sketches (from 2016) turned the practice into a public ritual of "short poems," and the School for Poetic Computation (2013) gave it a philosophy. Nervous System's *Floraform* (2015) carried differential growth into 3D-printed objects. Maxim Gumin's WaveFunctionCollapse (2016) brought constraint solving into the toolbox.

Kate Compton's "10,000 bowls of oatmeal" essay (2016) named the central failure mode: "mathematically speaking they will all be completely unique. But the user will likely just see a lot of oatmeal." Her distinction between **perceptual differentiation** (it doesn't look repeated) and **perceptual uniqueness** (this one is memorable) is the yardstick every generative system should be held to.

### 2021: long-form, and the artist has nowhere to hide

The third pivot is economic and it changed the aesthetic. Art Blocks (launched November 2020) mints an output *at the moment of purchase* from a hash the artist never sees. Hobbs's August 2021 essay "The Rise of Long-Form Generative Art" named the consequence: previously "the artist could generate as many outputs as they pleased and then filter those down to a small set of favorites." Now 500–1000 outputs go straight to collectors uncurated, so the *distribution itself* must be good. Fidenza (June 2021, 999 editions) is the type specimen: flow-field segments with collision detection, ~30 colours composed into 20+ weighted palettes, a weighted-choice function that makes some traits rare. Dmitri Cherniak's *Ringers* (string wrapped around pegs; "an almost infinite number of ways") produced *The Goose* (#879), sold at Sotheby's in June 2023 for $6.2M. Kjetil Golid's *Archetype* (recursive rectangle partition → grid → recursive re-partition; 42 palettes, Order/Balance/Chaos layouts) is the cleanest published spec of a long-form feature system. Matt DesLauriers's *Meridian*, Monica Rizzolli's *Fragments of an Infinite Field*, Emily Xie's *Memories of Qilin* (which "intentionally de-emphasizes features and traits"), Zancan's *Garden, Monoliths* on fxhash (255 editions, plotted and hand-coloured on Arches paper) rounded out the canon. fxhash (November 2021, Tezos) added an uncurated, peer-to-peer counterweight. LACMA's 2023 accession of 22 works — Cherniak, DesLauriers, Rizzolli among them — and the Centre Pompidou's parallel accession put long-form into museums.

The speculative wave broke in 2022, but the aesthetic discipline it forced — *every seed must be good; the parameter space is the artwork* — is permanent. Note the counter-tendency too: curated-platform rarity tables created a "loot box" habit of collecting features rather than images; the best artists (Xie, Rizzolli) have been quietly pushing back by hiding or flattening traits.

### 2023–2026: the frontier

Four currents define now.

**1. The GPU is finally native in p5.** p5.js 2.0 (2025) shipped **p5.strands**, which lets you write shaders in JavaScript-style code (hooks on the material pipeline) and compiles them to GLSL; 2.1 added branches and loops; 2.2 (early 2026) shipped an experimental **WebGPU renderer** and a flatter strands API, with the same strands shader compiling to WGSL. Compute shaders (`buildComputeShader`, `createStorage`, `compute`) are slated for 2.3: "you can run a loop on thousands of things in the time it would normally take to run just one iteration of a regular for loop." Particle systems, reaction-diffusion, physarum, and Gaussian splats move from CPU-bound demos to real-time, high-resolution work inside the beginner's library.

**2. AI is a material, a competitor, and a provocation.** Refik Anadol's *Unsupervised* (MoMA, 2022–23) and the Dataland "museum of AI arts" (The Grand LA, 35,000 sq ft, opening June 2026) are the maximalist pole — and the most criticised: Eryk Salvaggio argues the work "only elevates the black box into something Godlike"; questions of "who made these artworks, how they were obtained, and why, are absent." Mario Klingemann's *Botto* (2021–; DAO-governed; ~$6M revenue; algorithms auctioned 2025) and Sasha Stiles's *A Living Poem* (MoMA, Sept 2025–Mar 2026; GPT-4 + p5.js, regenerating hourly, custom "Cursive Binary" font) are the reflective pole — AI as co-author with visible seams. Hand-coders, meanwhile, now argue for concision as proof of understanding: "finding the shortest description of a certain algorithm proves a fundamentally deep understanding of the exact thing you're trying to generate." For a studio built on an LLM, this is the live tension: the model must *earn* originality by shepherding randomness, not by regressing to the mean of its training set.

**3. The physical return.** Pen plotters (AxiDraw and successors), Licia He's watercolour-on-plotter practice ("the spontaneity that comes with watercolor helped me to stay away from the perfectionism mindset"), Zancan's hand-coloured plots, Genuary's "Pen Plotter Ready" day (2026, day 22), Nervous System's grown jewellery. Line-only, single-colour-per-pass, no-fills constraints produce a distinct aesthetic that reads as *authored* in a way pixels no longer do.

**4. Live, responsive, systemic.** Live coding — Strudel/TidalCycles for sound, Hydra and Punctual for visuals — has gone from algorave niche to meetup staple (Frankfurt NODE+CODE #23, April 2026). Generative identity systems, from the MIT Media Lab's 2011 three-spotlight algorithm (40,000 variants, one per staff member) to today's dynamic brand kits, are now standard agency practice. "Generative UI" is the 2025–26 product-design buzzword: interfaces assembled per-user at runtime. Typography-driven work (Genuary 2026 day 5: "Write 'Genuary'. Avoid using a font") and "no libraries, no canvas, only HTML elements" (day 28) show a scene deliberately constraining itself to stay inventive.

### Where it is going

The field's centre of gravity is shifting from *output* to *system quality*: can the algorithm hold a thousand seeds at once, hold a wall-sized print, hold a plotter, hold 60 fps on a phone, and still surprise on seed 998? The master skills have not changed since Molnár — perturbed order, exhaustive rule, encoded judgment — but the stack now lets one person do all three in a browser tab. The next pivots to watch: compute-shader-native p5 sketches (2.3+), WebGPU as default, LLM-assisted *parameter-space curation* (not image generation), and a return to constraint — plotter, monochrome, single-line, HTML-only — as the badge of authorship in an age of infinite images.

---

## 2. Technique Atlas

Cliché scale: 1 = fresh/rare, 3 = common but still rich, 5 = default beginner output; "cliché 5" is not "bad", it is "needs a twist to be yours."

| # | Technique | Core idea | Origin / reference | Cliché (1–5) | How to push beyond cliché |
|---|---|---|---|---|---|
| 1 | Flow fields | Grid of angles; particles step along them to draw curves | Hobbs essay 2020; Fidenza 2021 | 5 | Hobbs himself: don't use Perlin — build the field from image gradients, SDFs, attractors, or embedded objects; enforce min-distance; vary step length by region; dots instead of lines |
| 2 | Perlin / simplex noise | Smooth coherent randomness | Perlin 1983 (Oscar 1997) | 5 | Use as *one input* to a composition decision, never as the texture itself; curl noise; noise-of-noise (domain warp); quantise noise into discrete decisions |
| 3 | Domain warping | Feed noise through noise: `f(p + f(p))` | Quilez (iquilezles.org) | 4 | Warp a *structured* pattern (grid, type, stripes), not a blob; warp the palette lookup too |
| 4 | Circle packing | Place non-overlapping circles, largest first or random with rejection | Classic; Tarbell | 4 | Pack *along* a flow field or inside type glyphs; pack non-circles (SDF packing); use power-law radii (Hobbs) |
| 5 | Recursive subdivision | Split rectangles / triangles recursively | Molnár, Mondrian-likes; Golid *Archetype* 2021 | 4 | Golid: partition → grid → re-partition with *inherited* rules; non-axis-aligned splits; subdivide a Voronoi cell, not a rect |
| 6 | Truchet tiles | Tiles with rotational variants that connect at edges | Truchet 1704; Smith 1987 | 4 | Multi-scale truchet (Carlson); non-square tilings; tiles defined by SDF arcs with varying width |
| 7 | Wave Function Collapse | Constraint propagation with random collapse = "a generator that obeys constraints" | Gumin 2016; Merrell model synthesis | 3 | Use non-tile adjacency (colour, line direction); run WFC on a hex or Penrose lattice; combine with hand-authored "exemplar" images |
| 8 | L-systems | String rewriting → turtle graphics | Lindenmayer 1968; Prusinkiewicz | 3 | Stochastic + context-sensitive rules; grow on a surface; interpret symbols as *brush* actions, not just turn/forward |
| 9 | Space colonisation (venation) | Attractors pull branches; nodes consumed as reached | Runions et al. 2005 | 2 | Attractor sets from images/text; two competing colonies; growth into a plotter-friendly line hierarchy |
| 10 | Differential growth / differential line | Nodes attract neighbours, repel others, insert on stretch; curve buckles | Hoff *On Generative Algorithms*; Nervous System *Floraform* 2015 | 3 | Vary growth rate by a field ("the edge is the active growth area"); constrain inside a shape; 3D on a mesh |
| 11 | Reaction–diffusion (Gray–Scott) | Two chemicals, feed/kill rates → spots, stripes, labyrinths | Turing 1952; Pearson 1993 | 4 | Vary feed/kill spatially (Karl Sims maps); seed with type; run in compute shader and *then* vectorise for plotter |
| 12 | Diffusion-limited aggregation | Random walkers stick to a seed → dendrites | Witten–Sander 1981 | 3 | Bias walkers with a field; aggregate onto a line/text; colour by arrival time |
| 13 | Physarum / slime mould | Agents sense-and-steer on a trail map, deposit, diffuse, decay | Jones 2010; Sage Jenson 2019 | 3 | Multiple species with different sensor params; agents constrained by SDF; snapshot trails as hatching |
| 14 | Boids / flocking | Separation, alignment, cohesion | Reynolds 1987; Shiffman NoC | 4 | Draw the *history* not the birds; flock in a flow field; alignment to typography |
| 15 | Particle systems + forces | Mass, forces, integration | Shiffman NoC ch.2–4 | 5 | Move to compute shaders (p5 2.3) for 10⁶ particles; springs/verlet cloth; particles as *ink* with pressure |
| 16 | Strange attractors | Lorenz, Clifford, de Jong, Aizawa iterated maps | Lorenz 1963; Sprott | 3 | Project 3D attractors with depth-of-field; density-accumulate (histogram) then tone-map; plotter via stroke sampling |
| 17 | Voronoi / Delaunay | Nearest-site partition / dual triangulation | Voronoi 1908; Fortune; d3-delaunay | 4 | Weighted/centroidal (Lloyd) relaxation; Voronoi on non-Euclidean metrics (Manhattan, L∞); use cells as *rooms* for other techniques |
| 18 | Weighted Voronoi stippling | Lloyd's relaxation with density from an image | Secord 2002 | 3 | Stipple a *generated* field, not a photo; vary dot shape; TSP-connect points for single-line plots |
| 19 | Hatching / cross-hatching | Parallel lines whose density encodes tone | Engraving; Hobbs texture essays | 3 | Hatch along flow-field direction; hatch per Voronoi cell with its own angle; pressure-modulated plotter lines |
| 20 | Watercolour layering | Recursive polygon edge deformation; 30–100 layers at ~4% alpha; per-edge variance | Hobbs 2017 | 4 | Vary variance *per edge* (sharp vs soft boundaries); texture masks per layer; interleave colours |
| 21 | Sand / grain strokes (sandpainting) | Thousands of transparent dots along a curve | Tarbell *Sand Stroke*; Hoff *Sand Spline* | 3 | Sample density from curvature; multi-colour grains; use as the fill for other shapes |
| 22 | Substrate / crack growth | Cracks spawn perpendicular from existing cracks | Tarbell 2003 | 3 | Crack a *coloured* field; cracks obey a flow field; 3D cracks on a surface |
| 23 | Cellular automata | Local rules on a grid | Conway 1970; Wolfram | 4 | Non-square lattices; continuous CA (Lenia); "crazy rules" (Genuary 2026 d.9); CA as palette selector not image |
| 24 | Wallpaper / symmetry groups | 17 plane symmetry groups | Classical; Genuary 2026 d.17 | 2 | Break symmetry 1% (Molnár); symmetry group varies across canvas; apply to flow-field output |
| 25 | SDF raymarching | Signed distance functions marched per pixel | Hart 1996; Quilez; Shadertoy | 4 | p5.strands fragment hooks; combine 2D SDF with hatching instead of lighting; SDF booleans as composition layout |
| 26 | Shader feedback loops | Previous frame as texture input | Hydra; Shadertoy buffers | 3 | Feedback through a *displacement* not a blur; combine with WFC-generated masks |
| 27 | Image-based fields | Use luminance/gradient of an image as a field | Secord; countless | 3 | Use a *generated* image (another sketch's output); gradient-of-gradient |
| 28 | Dithering / halftone | Error diffusion or threshold patterns | Floyd–Steinberg 1976 | 3 | Custom dither kernels; halftone with non-dot shapes (glyphs, arcs); dither a generated field |
| 29 | Marching squares / contours | Iso-lines of a scalar field | Lorensen & Cline 1987 | 3 | Contour a noise field for plotter topography; vary iso-spacing; contour *text* SDFs |
| 30 | Polar / radial mapping | Remap x→angle, y→radius | Classical; Genuary 2026 d.10 | 4 | Multi-centre polar; log-polar spirals; polar warps of a grid system |
| 31 | Grid + jitter (Schotter) | Regular grid with growing random perturbation | Nees 1968; Molnár | 5 | Vary the *axis* of disorder (gradient, radial, noise-driven); jitter in parameter space not just position |
| 32 | Lissajous / harmonographs | Sum of damped sinusoids | 1800s | 4 | Modulate frequencies with noise; use as pen path with pressure; 3D harmonograph projected |
| 33 | Noise-driven typography | Glyph outlines deformed, filled or traced by fields | Lieberman; Genuary d.5 | 3 | Glyph as SDF driving packing/growth; variable-font axes as noise targets; "avoid using a font" — build letters from the technique |
| 34 | Stroke simulation (brush, pen pressure) | Width/opacity modulated along path; bristles as sub-strokes | Hobbs "How to Hack a Painting" 2017 | 3 | Bristle offsets per stroke; ink depletion over length; plotter *real* ink |
| 35 | String art / peg wrapping | Thread between pegs on a frame | Cherniak *Ringers* 2021 | 3 | Non-circular peg layouts; wrap order from TSP; physical plot |
| 36 | Fracture / cut-up (fractures) | Lines that stop when hitting others | Hoff *Fractures*; Tarbell | 3 | Fracture a *shape* with varying density; colour by region adjacency |
| 37 | Packing of non-circles / nesting | Rejection or SDF-based placement of arbitrary shapes | Many | 2 | Pack glyphs; pack along curves; pack with rotational search |
| 38 | Genetic / evolutionary | Mutate, select, breed parameter sets | Sims 1991; Genuary 2026 d.29 | 2 | Use LLM or human as the fitness function; evolve *rules* not images |
| 39 | Collage / texture compositing | Procedural paper, torn edges, layered cut-outs | Emily Xie *Memories of Qilin* 2022 | 2 | Generate the textures too; cut shapes from another technique's output |
| 40 | Quine / self-referential | Program whose output includes its source | Genuary d.11; "Boxes only", "16×16" constraints | 1 | Constraint-as-concept: HTML-only (d.28), one line (d.20), lowres (d.4) — the constraint *is* the originality |
| 41 | Gaussian splats / point-cloud rendering | Render millions of oriented splats on GPU | Kerbl et al. 2023; p5 WebGPU roadmap | 1 | Splats as generative primitives, not scans |
| 42 | Data-driven form | Real datasets drive geometry | Anadol (maximalist); Fry (*Valence*) | 3 | Keep the data legible — Salvaggio's critique: don't "elevate the black box" |

---

## 3. Principles of the Masters (attributed, quotes ≤25 words)

### On ceding control
- **Galanter (2003):** "the key element in generative art is then the system to which the artist cedes partial or total subsequent control." — *What is Generative Art?*
- **LeWitt (1967):** "The idea becomes a machine that makes the art." — *Paragraphs on Conceptual Art*, Artforum.
- **Nees (on Schotter):** "The length and radius of the individual arcs are randomly chosen within the limits defined by the programmer." — via Wikipedia/V&A.
- **Hobbs (2014):** "In some ways, the artist is merely setting up a perfect environment to discover great works of chance." — *Randomness in the Composition of Artwork*.

### On randomness and its shepherding
- **Hobbs (2014):** "Uniform distributions tend to form clumps or runs far more frequently than an untrained person would guess." — *Probability Distributions for Algorithmic Artists*.
- **Hobbs (2014):** "Not only is it easy to introduce randomness at any point in the composition, but the randomness itself can be controlled in many ways." — *Randomness in the Composition*.
- **Hoff (inconvergent):** "They want to be close, but not too close, to their two neighbors." — *Differential Line* (the whole of differential growth in one sentence).
- **Hoff:** "Part of the challenge is to try to recreate some pattern or behaviour with as few and as simple rules as possible." — *On Generative Algorithms: Introduction*.
- **Molnár:** *1% Disorder* (title) and "the vulnerability of the right angle" — via Centre Pompidou magazine.
- **Hobbs (2020):** "I actually recommend that you try to come up with your own distortion techniques instead of relying on Perlin noise." — *Flow Fields*.

### On composition and complexity
- **Galanter (2003):** interesting art lies "somewhere between the extremes of order and disorder" (effective complexity). — *What is Generative Art?*
- **Tarbell (2020):** "There are just two rules... watching the whole system unfold, I think gives you an idea of the potential depth." — Artnome interview.
- **Xie (2022):** "I love the infinite possibilities, the complexities arising from simple rule sets, and the emergent phenomena that algorithms produce." — Art Blocks interview.
- **Reas & Fry:** "Through sketching with code, unexpected paths are discovered and followed. Unique outcomes often emerge through the process." — *A Modern Prometheus*.

### On colour
- **Hobbs (2016):** "RGB is for machines, HSB is for artists." — *Working with Color in Generative Art*.
- **Hobbs (2016):** probability-weighted palettes (e.g. 70/20/10) + minor per-pick HSB jitter + context-triggered palette switches. — same essay.
- **Hobbs (2017):** "Segments with high variance will undergo large changes in each mutation round, and segments with low variance will undergo small changes." — *Watercolor* (edge-wise control of softness).
- **Manoloide (2021):** uses code to explore "how colours blend, give the sensation of a material." — Kate Vass interview.

### On curation, long-form and the oatmeal problem
- **Hobbs (2021):** "Every output will have something new about it, a little surprise that teaches you more about what is possible." — *The Rise of Long-Form Generative Art*.
- **Hobbs (2021):** "the artist has nowhere to hide." — same.
- **Compton (2016):** "mathematically speaking they will all be completely unique. But the user will likely just see a lot of oatmeal." — *So you want to build a generator*.
- **Compton:** "Perceptual uniqueness is much more difficult. It is the difference between... a face in a crowd scene and a character that is memorable." — same.
- **Cherniak (2021):** "My 'art' was about making sure someone could get an interesting and unique piece of work without any human interaction." — Bankless interview.
- **Xie (2022):** "Since each output needs to be compelling enough on its own, the format forces you to think more holistically." — Art Blocks.
- **Golid (2021):** Layout traits Order/Balance/Chaos; "Single: all shapes within a section with the same color." — *Archetype 101* (feature design as explicit spec).

### On restraint, error, play
- **Manoloide (2018):** "The most beautiful parts of the work are born from the errors." — via Kate Vass.
- **Licia He (2020):** "I focus on the rules that I am making and breaking." — Dirt Alley Design interview.
- **Licia He (2020):** "Just be an experimentalist and play with it." — same.
- **Lieberman:** daily sketches as "short poems"; "this installation is like my sketchbook and I'm inviting people to come inside." — Art in America.
- **Tarbell (2020):** "Just program something every day, even if it's something simple." — Artnome.
- **McCarthy (2019):** "The process and community are the lasting outputs." — *Making Space for the Future of p5.js*.

### On AI and authorship (2023–2026)
- **Salvaggio (2023):** "He only elevates the black box into something Godlike... we can only sit, look, and allow it to surveil us." — Cybernetic Forests on *Unsupervised*.
- **Klingemann (2025):** "I definitely don't believe machines have consciousness, but notice increasing self-reflection ability." — The Art Newspaper.
- **Anon. hand-coder (2026):** "Finding the shortest description of a certain algorithm proves a fundamentally deep understanding of the exact thing you're trying to generate." — Right Click Save post 51.
- **Stiles (2025):** combining AI with poetry "is a way of saying there's something very human about the fundamental impulses behind technologies like AI." — via Wikipedia, *A Living Poem*.

---

## 4. Fetch Log

| URL | What it gave | Credibility |
|---|---|---|
| https://www.tylerxhobbs.com/words/flow-fields | Flow-field recipe, params, anti-Perlin advice, 2020-02-03 | Primary (artist) — high |
| https://www.tylerxhobbs.com/words/probability-distributions-for-algorithmic-artists | Uniform/Gaussian/power-law guidance, 2014-10-18 | Primary — high |
| https://www.tylerxhobbs.com/words/working-with-color-in-generative-art | HSB, weighted palettes, 2016-10-23 | Primary — high |
| https://www.tylerxhobbs.com/words/a-guide-to-simulating-watercolor-paint-with-generative-art | Polygon deformation, 4% layers, edge variance, 2017-04-21 | Primary — high |
| https://www.tylerxhobbs.com/words/randomness-in-the-composition-of-artwork | When randomness enters; quotes, 2014-09-07 | Primary — high |
| https://www.tylerxhobbs.com/words/the-rise-of-long-form-generative-art | Long-form definition and quotes, 2021-08-06 | Primary — high |
| https://lostpixels.io/writings/code-review-fidenza | Fidenza code review: cSegs, collision, weighted choice, palettes, 2021-12-15 | Secondary technical — medium-high |
| https://ems.andrew.cmu.edu/.../kate-compton-oatmeal.pdf | Oatmeal problem; differentiation vs uniqueness | Primary (essay PDF) — high |
| https://www.philipgalanter.com/downloads/ga2003_paper.pdf | Definition; effective complexity | Primary (paper) — high |
| https://medium.com/@ProcessingOrg/p5-js-2-1-and-2-2-... | p5 2.1/2.2: strands branching/loops, WebGPU experimental, 2026-03-09 | Primary (Processing Foundation) — high |
| https://www.davepagurek.com/blog/p5-webgpu/ | WebGPU mode status, strands→WGSL, 2026-01-01 | Primary (p5 maintainer) — high |
| https://www.davepagurek.com/blog/p5-compute-shaders/ | Compute shader API, slated for 2.3, 2026-04-03 | Primary — high |
| https://inconvergent.net/2016/shepherding-random-grids/ | Random-grid shepherding techniques; links to companion essays | Primary (artist) — high |
| https://inconvergent.net/generative/ | *On Generative Algorithms* chapter list + ethos quotes | Primary — high |
| https://inconvergent.net/generative/differential-line/ | Differential line rule set | Primary — high |
| https://medium.com/processing-foundation/making-space-for-the-future-of-p5-js-... | McCarthy on p5.js values, 2019-11-25 | Primary — high |
| https://processingfoundation.org/about/history/ | DBN 1999, Processing 2001-08-09, Foundation 2012, p5.js 2013 | Primary — high |
| https://medium.com/processing-foundation/a-modern-prometheus-... | Reas/Fry on sketching and DBN lineage | Primary — high |
| https://en.wikiquote.org/wiki/Sol_LeWitt | 1967 quotes with source | Tertiary, sourced — medium-high |
| https://en.wikipedia.org/wiki/Georg_Nees | 1965 Stuttgart show, Schotter, Bense | Tertiary — medium |
| https://www.centrepompidou.fr/en/magazine/article/ai-nft-vera-molnar-a-step-ahead | Molnár timeline, 1% Disorder, machine imaginaire | Institutional — high |
| https://whitney.org/media/58412 | AARON retrospective Feb 3–May 19 2024, "collaboration" | Institutional — high |
| https://metaversal.banklesshq.com/p/talking-ringers-with-dmitri-cherniak | Ringers mechanism, quotes, 2021-02-24 | Secondary interview — medium |
| https://kjetil-golid.medium.com/archetype-101-2f17633dcc86 | Archetype algorithm and feature spec, 2021-02-28 | Primary — high |
| https://www.artblocks.io/articles/in-conversation-with-emily-xie | Xie on long-form and de-emphasising traits, 2022 | Primary platform interview — high |
| https://www.artnome.com/news/2020/8/24/interview-with-generative-artist-jared-tarbell | Substrate origin, open-source vow, quotes | Secondary interview — medium-high |
| https://zancan.art/Series/Garden-Monoliths | 255 editions, plotted on Arches, fxhash 2021 | Primary — high |
| https://www.dirtalleydesign.com/.../interview-with-licia-he | Plotter+watercolour pipeline, quotes, 2020-09-23 | Secondary interview — medium-high |
| https://www.katevassgalerie.com/blog/.../manoloide | Manoloide quotes on colour/error | Gallery interview — medium |
| https://www.artnews.com/.../zach-lieberman-artechouse-... | Daily sketch practice, "short poems" | Press review — medium |
| https://cyberneticforests.substack.com/p/ideologies-of-awe-and-ai-art-at-the | Salvaggio critique of *Unsupervised*, 2023-10-22 | Primary critical essay — high |
| https://www.npr.org/2026/04/25/.../dataland-... | Dataland June 2026 opening, 35k sq ft, critics | Press — high (note: fetch summary mis-stated year as 2024; article is April 2026 about a June 2026 opening) |
| https://www.theartnewspaper.com/2025/03/04/semi-autonomous-... | Botto: DAO, ~$6M, Feb 2025 algorithm auctions, Klingemann quote | Press — high |
| https://en.wikipedia.org/wiki/A_Living_Poem | Stiles at MoMA Sept 2025–Mar 2026, GPT-4 + p5.js | Tertiary — medium |
| https://www.rightclicksave.com/post/51/... | Hand-coded vs AI: concision argument (Sept 2026 post) | Secondary — medium (anonymous commenter) |
| https://www.boristhebrave.com/2020/04/13/wave-function-collapse-explained/ | WFC core idea, Gumin, Merrell | Expert blog — high |
| https://n-e-r-v-o-u-s.com/blog/?p=6721 | Floraform differential growth, 2015-06-22 | Primary — high |
| https://www.iconeye.com/design/mit-media-lab-logo-... | 2011 identity: 5×5 grid, 3 spotlights, 40,000 variants | Press — medium-high |
| https://www.artnews.com/.../lacma-acquires-generative-art-nfts-art-blocks-... | LACMA 22-work accession; artists; quotes | Press — high |
| https://outland.art/generative-art-nfts-fxhash-highlight/ | fxhash Nov 2021 Tezos; Highlight; post-2022 shift | Critical press — medium-high |
| https://www.misha.studio/iterations/genuary-2026/ | Full Genuary 2026 prompt list | Artist blog — high for prompt list |
| https://genuary.art/prompts | Prompt list (year unlabeled on page) | Primary — high |
| Failed/blocked: inconvergent.net/2016/shepherding-random-numbers (provenance), inconvergent archive (403), rightclicksave DesLauriers & Mohr interviews (paywalled body), livecoding.substack (429), objkt Watz interview (robots), MoMA press (404) | — | — |

---

## 5. Experience Notes and Open Questions

**What the research says a p5 studio must do to be "state of the art" rather than "oatmeal":**
1. Treat Perlin-noise flow fields, Schotter grids and plain particle trails as *cliché 5* — permissible only with a documented twist from the atlas column.
2. Every sketch should declare **where randomness enters** (structure vs. detail) and **which distribution** (uniform/Gaussian/power-law/weighted-choice). This is Hobbs's lever and it is cheap to make explicit in code.
3. Colour in HSB (or OKLCH — a modern improvement Hobbs predates) with probability-weighted palettes and per-pick jitter.
4. Build for **long-form**: render a seed grid (e.g. 3×3 or 5×5) by default and judge the *distribution*, not the lucky seed. Compton's test: are outputs *differentiated* (not repeated) and are some *unique* (memorable, describable)?
5. Prefer "fewest rules that produce the behaviour" (Hoff) — a concision ethic that also answers the 2026 "hand-coded vs AI" critique.
6. Offer the **physical/constraint register**: plotter-ready SVG (single stroke colour, no fills, path ordering), monochrome, single-line, HTML-only.
7. p5 2.x: use p5.strands for GPU work; know WebGPU is experimental (2.2) and compute shaders arrive in 2.3; keep a WebGL fallback.

**Open questions**
- Which p5.js version will the studio target as baseline? (2.x breaks some 1.x idioms; strands only in 2.x.)
- Should the studio include an explicit *trait/feature* system (Golid-style) or follow Xie/Rizzolli in de-emphasising traits? Possibly a switch.
- How to encode "perceptual uniqueness" as a check — a vision-model judge over a seed grid? Human-in-the-loop only?
- Plotter export: SVG path optimisation (TSP ordering, pen lifts) — in scope?
- Licensing/attribution norms: Tarbell's open-source ethic vs. Art Blocks on-chain exclusivity — what does the studio promise about originality of generated code?
- WebGPU timeline risk: Safari/Firefox support still experimental in early 2026; what fraction of users can run compute-shader sketches?

---

## 6. Three Knowledge Atoms

**Atom 1 — The three postures of cession (Galanter × Molnár × Mohr × Cohen).**
Generative art is defined by the system "to which the artist cedes partial or total subsequent control." Historically the cession takes three forms that remain the complete menu: *perturbed order* (strong structure + ≈1% disorder — Molnár, Nees's Schotter), *exhaustive rule* (no randomness, the rule unfolds — Mohr, LeWitt), and *encoded judgment* (the artist's own decision procedure in code — Cohen's AARON). A studio prompt should pick one posture explicitly; mixing all three is how work goes muddy.

**Atom 2 — Randomness is a design parameter, not a texture (Hobbs 2014–2020, Compton 2016).**
Two decisions dominate quality: *when* randomness enters (structural decisions → series-level variety; fine detail → polish) and *which distribution* governs it (uniform clumps; Gaussian for "about the same, with outliers"; power-law for "many small, few large"; weighted choice for rarity). The failure mode is Compton's oatmeal: mathematical uniqueness without perceptual uniqueness. The test is a seed grid, not a hero image.

**Atom 3 — The 2025–26 frontier is GPU-native p5 plus a return to constraint.**
p5.js 2.x ships p5.strands (JS-authored shaders → GLSL/WGSL), an experimental WebGPU renderer (2.2, early 2026) and compute shaders (2.3), moving physarum/reaction-diffusion/particle work to real time in the beginner's library. Simultaneously the scene is re-asserting authorship against diffusion-model imagery through constraint (pen plotter, one line, no font, HTML-only) and code concision ("the shortest description of a certain algorithm proves… deep understanding"). A studio that is both GPU-capable and constraint-literate sits exactly on the frontier.
