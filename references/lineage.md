# Lineage — where we have been, and the principles worth keeping

*Condensed from research/02 (fetch log and credibility notes there). Quotes ≤ 25 words, attributed.*

## The story
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

## Principles of the masters
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

## Atoms
**Atom 1 — The three postures of cession (Galanter × Molnár × Mohr × Cohen).**
Generative art is defined by the system "to which the artist cedes partial or total subsequent control." Historically the cession takes three forms that remain the complete menu: *perturbed order* (strong structure + ≈1% disorder — Molnár, Nees's Schotter), *exhaustive rule* (no randomness, the rule unfolds — Mohr, LeWitt), and *encoded judgment* (the artist's own decision procedure in code — Cohen's AARON). A studio prompt should pick one posture explicitly; mixing all three is how work goes muddy.

**Atom 2 — Randomness is a design parameter, not a texture (Hobbs 2014–2020, Compton 2016).**
Two decisions dominate quality: *when* randomness enters (structural decisions → series-level variety; fine detail → polish) and *which distribution* governs it (uniform clumps; Gaussian for "about the same, with outliers"; power-law for "many small, few large"; weighted choice for rarity). The failure mode is Compton's oatmeal: mathematical uniqueness without perceptual uniqueness. The test is a seed grid, not a hero image.

**Atom 3 — The 2025–26 frontier is GPU-native p5 plus a return to constraint.**
p5.js 2.x ships p5.strands (JS-authored shaders → GLSL/WGSL), an experimental WebGPU renderer (2.2, early 2026) and compute shaders (2.3), moving physarum/reaction-diffusion/particle work to real time in the beginner's library. Simultaneously the scene is re-asserting authorship against diffusion-model imagery through constraint (pen plotter, one line, no font, HTML-only) and code concision ("the shortest description of a certain algorithm proves… deep understanding"). A studio that is both GPU-capable and constraint-literate sits exactly on the frontier.
