# Explainer Atelier — Art Direction v0 (coordinator's draft, for Fable consultation)

Status: initial directions, written to be argued with. Not a style guide. The CETI chrome stays the default
skin; what this document opens up is **depth** — what animation and p5.js can do that an HTML page of tweened
boxes cannot — and the art directions that put that depth in service of teaching.

---

## 0. The thesis

**Generic p5 is technique used as texture.** A flow field behind a title, glowing particles that "represent
data", a node graph with pulses that "represents a neural net". The marks mean nothing, so the viewer learns
nothing, so the motion is decoration.

**The edge is technique used as argument.** Every mark is a unit of the idea; every motion is a computation the
viewer can watch happen and therefore believe. The viewer should be able to say, after any shot, *"I saw it
happen"* — not *"I was told."*

The CETI line we keep: one clock (frame = f(t, state, seed)), honesty (every number derived or labelled
"sketch"), bookends, captions, the ladder. The CETI line we drop: one look, SVG-first, beats as slides.

## 1. The depth ladder of animation (what each rung can explain that the rung below cannot)

| Rung | What moves | What it can explain | HTML/SVG can? |
|---|---|---|---|
| 1 Tween | a thing from A to B | sequence, emphasis | yes — never the main event here |
| 2 Transformation | one object becomes another, identity preserved | equivalence, abstraction ("this list *is* this curve") | barely |
| 3 Simulation-as-evidence | the system actually runs; numbers emerge from marks | probability, compounding, emergence, cause | no |
| 4 Material | the medium has physics (ink bleeds, paper folds, sand pours, light accumulates) | conservation, diffusion, contamination, wear | no |
| 5 Space | a camera moves through a structure; scale is the event | hierarchy, magnitude, inside/outside | no |
| 6 Field | every pixel computes (shader / pixel buffer) | millions-at-once: vocabularies, embeddings, attention, noise vs signal | no |
| 7 Agency | the viewer's input re-runs the same model at the same t | prediction, intervention, "what if" | partially |
| 8 Sonification | sound is driven by the same data as the marks | rhythm of a process, failure you *hear* | no |

**Rule (extends p5-explainer's "count / conserve / respond"):** every hero sequence must reach **rung 3 or
higher**, and must combine at least **two rungs from 3–8**. A piece that peaks at rung 2 is an SVG film.

## 2. The anti-generic doctrine (banned as defaults — allowed only if the concept demands it and the crit agrees)

Perlin flow field as background · additive-glow particle swarm · node-and-edge "neural net" with travelling
pulses · spinning icosahedron / orbiting wireframe · matrix rain / binary digits · gradient mesh blobs · typewriter
text reveal · random pastel Voronoi · noise-wobble on everything · orbit-camera-around-nothing · "data" as sparkles
· a robot or brain icon for "AI" · the cream-paper + hairline + one-vermilion house habit (H1) · a framed object
floating on an empty page (H6).

**Positive tests a piece must pass:**
1. *Mark rule* — "each mark is one ___" is a true sentence for every animated element.
2. *Impossibility* — at least one moment that could not be made by tweening DOM/SVG.
3. *Belief* — the key number on screen is produced by the marks (counted, accumulated, measured), not typed.
4. *Silence test* — with captions off, a viewer can still narrate the idea from the motion.
5. *Batch test* — beside the other directions, it is recognisably a different film, not a palette swap.

## 3. What stays CETI across every direction (so nothing is "off-brand", and nothing is rigid)

- **Semantic colour is invariant; ground and material vary.** Copper = mass / what flows / probability;
  sage = verified / pass / type; peach = error / cost; slate = structure / the system; ink = text.
  (CETI tokens: ground #0E1014, panel #171B23, ink #F5EFE3, dim #A39A89, copper #CE9A6A, sage #8FA985,
  peach #D88B5C, slate #6E8CA8.) A direction may re-tune lightness/chroma for its ground but not re-assign meaning.
- **Type roles**: a display face, a text face, a mono for numbers. CETI default = Fraunces / DM Sans / Space Mono;
  a direction may swap faces when its material demands it (e.g. a ledger needs tabular figures).
- **Honesty beat** in every Grasp cut: what this does *not* show.
- **The ladder** (Glance / Grasp / Wield / Master) is a view of one concept module, not four films.

---

## 4. The directions (8)

Shared concept for all: **"What an AI agent actually does"** — goal → plan → act (tool) → observe → check →
repeat/stop. The number that must become visible: per-step success p = 0.95 compounds to 0.95^k
(k=5 → 0.774, 10 → 0.599, 20 → 0.358, 40 → 0.129). A check that catches c = 0.8 of step errors with one retry
lifts the effective per-step rate to p' = p + (1−p)·c·p = 0.988 (k=10 → 0.886, 20 → 0.785, 40 → 0.617).

### A. THE ESCAPEMENT — mechanism in a cutaway (rungs 5 · 3 · 8)
- **Borrowed from:** horology cutaways, Victorian engineering plates, orreries. Principle: a mechanism is
  understood when you can see *every* part move *because* of another part.
- **Depth:** true WEBGL 3D brass-and-glass mechanism, lit, with a section plane (shader clip) that cuts it open;
  forward kinematics are exact functions of t (gear ratios), so seek is exact.
- **Mark rule:** each tooth is one step; each tick of the escapement is one loop iteration.
- **Shared hero:** the agent loop is an escapement wheel: plan → act → observe → check are the four pallets.
  Each tick advances the work-gear one tooth. A 5 % tooth is cast in peach — it slips. Over 20 ticks the output
  hand drifts; a copper dial on the front face reads the fraction of runs where the hand is still true, and it
  falls 0.95 → 0.358 as the train gets longer. Engage the *check* — a sage ratchet pawl drops in — and slips are
  caught and re-struck; the dial now reads 0.785 at 20. Sound: each tick a click, each slip a dull clack.
- **Native concept:** *"Automating a business process: where the gears don't mesh"* (handoffs between systems).
- **Camera:** slow dolly from the watch face (outcome) to inside the movement (cause); never orbits for show.
- **Risk:** steampunk kitsch. Dodge: no rivets/ornament; machined, modern, Dieter-Rams-plain parts in slate metal.
- **Cost:** WEBGL ≤720p, low poly count (procedural gears), ~1–2 fps headless.

### B. THE INK TANK — material diffusion (rungs 4 · 3 · 6)
- **Borrowed from:** marbling (ebru), ink-in-water cinematography, chromatography.
- **Depth:** deterministic grid fluid (stable-fluids, fixed step from t=0, memoised checkpoints every 0.5 s so
  seek is fast) rendered per-pixel; dye is conserved.
- **Mark rule:** each drop is one action; dye volume is probability mass.
- **Shared hero:** a clear tank. The goal is a sage pattern pinned at the bottom. Each step, the agent drops copper
  ink through a channel; a 5 % chance per step a peach contaminant joins it. Contamination is *conserved* — you
  cannot unmix it — so the tank visibly clouds as k grows. The check is a membrane that catches 80 % of peach at
  each stage (you see it pool on the membrane). Wield: you set k and the membrane on/off; predict how cloudy.
- **Native concept:** *"How image generators work"* — diffusion run backwards: noise un-mixes into a picture
  (literal denoising in the same tank).
- **Risk:** screensaver fluid. Dodge: fluid only ever carries the quantity; fixed boundaries shaped like the
  process diagram; no free swirling.
- **Cost:** Canvas2D pixel grid 256×144 upscaled with a custom dither, or a strands shader for display.

### C. THE COLONY — Living Systems, redefined (rungs 3 · 6 · 7)
- **Borrowed from:** myrmecology field studies, Physarum transport-network research (slime mould re-drawing the
  Tokyo rail map), Lenia.
- **Depth:** a deterministic agent-based ecology: thousands of foragers with sensors, deposit/decay trail maps;
  run on a fixed step with checkpoints; an organisation chart is the terrain.
- **Mark rule:** each forager is one run of the agent; trail intensity is how often a path worked.
- **Shared hero:** 2,000 foragers leave the nest (the goal) for food (done) through a terrain of 20 junctions
  (steps). At each junction 5 % take a wrong turn and die out (their trails fade peach). What reaches the food is
  counted at the nest gate: 716 of 2,000 (0.358). Add sentinel nodes (checks) — wrong turns get turned back —
  1,570 arrive (0.785). The trail map itself is the chart.
- **Native concept:** *"Multi-agent orchestration"* — an orchestrator colony that spawns specialist sub-colonies;
  pheromone = shared memory; when memory is wrong, the whole colony is misled.
- **Risk:** physarum screensaver (cliché 3). Dodge: terrain is the business process, not noise; counts at gates;
  monochrome trails with semantic colour only at events.
- **Cost:** Canvas2D for ≤2k agents with fixed-step memo; trail map as a Float32 buffer.

### D. THE LEDGER IN MOTION — Boardroom, redefined (rungs 3 · 2 · 7)
- **Borrowed from:** Isotype (Neurath/Arntz), FT/Economist data journalism, double-entry bookkeeping.
- **Depth:** unit charts where every unit is a real countable thing (one invoice, one hour, one dollar); units
  physically move between accounts so totals are conserved and *seen* to balance; tabular figures tick from the
  marks, never typed.
- **Mark rule:** each pictogram is one invoice (one task, one hour).
- **Shared hero:** a 40-invoice reconciliation job. 40 pictograms march through the agent's 10 steps; at each step
  a 5 % sliver falls into an exceptions column. The P&L to the right updates from what actually passed:
  expected clean completion 0.599 of jobs at 10 steps; with checks, 0.886. Then the business translation: cost
  per clean job, hours returned, where the human review time goes.
- **Native concept:** *"The ROI of an AI pilot"* — the honest version: hours saved minus review hours minus
  failure cost, conserved and balanced on screen.
- **Risk:** corporate infographic. Dodge: Isotype rigour (one symbol = one fixed quantity, never scaled),
  hairline-free grid, real typographic hierarchy, motion only when value moves.
- **Cost:** Canvas2D, cheap; the craft is typographic.

### E. THE MARGIN — Field Notebook, redefined (rungs 7 · 4 · 2)
- **Borrowed from:** scientists' lab notebooks, Feynman's annotated diagrams, the client's own TF&S hub.
- **Depth:** a real pen model — pressure, speed-dependent width, ink depletion and re-dip, bleed into a
  procedurally generated paper fibre field (deterministic per seed); strokes draw on as functions of t.
- **Mark rule:** each stroke is one thought written down; the viewer's own guess is drawn in a second "hand".
- **Shared hero:** predict-commit-reveal. "An agent does 20 steps, each 95 % reliable. How often does the whole
  job succeed?" The viewer commits (live input; in the MP4 a held beat with a countdown). The pen then tallies
  20 × 0.95 by hand, the answer 36 % is ringed, and the viewer's guess sits beside it in their hand. Margin note:
  "this is why checks matter" → 78.5 %.
- **Native concept:** *"Why AI sounds confident when it's wrong"* (fluency ≠ accuracy) for non-technical staff.
- **Risk:** H1 house habit (cream + hairline + vermilion). Dodge: graph-paper green-grey ground, fountain-pen
  blue-black ink, CETI semantics only for annotations; heavy, characterful strokes.
- **Cost:** Canvas2D; stroke tessellation cached per seed.

### F. THE PAPER THEATRE — Little Worlds, redefined (rungs 5 · 2 · 7)
- **Borrowed from:** toy theatres, Lotte Reiniger's silhouette films (principle: character through silhouette
  and timing), architectural paper models.
- **Depth:** WEBGL 2.5D — flat cut-paper planes at real depths, a perspective camera with real parallax,
  soft contact shadows, depth-of-field via a two-pass blur shader; paper has a fibre normal map.
- **Mark rule:** each figure is one role (the agent, a tool, a human reviewer); each prop is one artefact.
- **Shared hero:** a tiny office stage. The agent (an abstract paper figure, not a robot) walks the loop between
  four stations (desk = plan, tool cabinet = act, window = observe, scale = check). A human reviewer stands at the
  gate. A dropped paper (the 5 %) drifts to the floor; the camera cranes up to show 20 laps — the floor littered.
- **Native concept:** *"What actually changes on a team when AI arrives"* (change management, roles shifting).
- **Risk:** Kurzgesagt imitation / cute mascots. Dodge: silhouette only, no faces, theatre staging grammar
  (wings, proscenium, light cues), muted CETI semantics on paper stock.
- **Cost:** WEBGL ≤720p, few planes, cheap.

### G. TYPOGRAPHIC MATTER — words as physical bodies (rungs 2 · 4 · 6)
- **Borrowed from:** concrete poetry, letterpress (type as metal you set by hand), Muriel Cooper's information
  landscapes.
- **Depth:** textToContours → extruded glyph meshes / SDF glyphs; text is cut into tokens that fall, stack, and
  are re-set; a shader renders ink-on-metal.
- **Mark rule:** each block is one token; each line of set type is one step's output.
- **Shared hero:** the agent's work is a forme being typeset. Each step sets one line; 5 % of lines contain a
  wrong sort (a peach letter) that prints. The camera pulls back to a long galley: misprints accumulate down the
  column. A proof-reader's check (sage) pulls wrong sorts before printing.
- **Native concept:** *"What a token and a context window are"* — the galley literally has a fixed length.
- **Risk:** kinetic-type-promo cliché. Dodge: physicality (weight, set, leading), no bounce easing, no
  word-by-word flash.
- **Cost:** WEBGL ≤720p with instanced glyph meshes, or Canvas2D contours.

### H. THE LIGHT TABLE — long exposure (rungs 6 · 3 · 8)
- **Borrowed from:** long-exposure light painting, cyanotype, Muybridge chronophotography.
- **Depth:** accumulation in a float buffer (each frame adds light; tone-mapped), so *history* is the image:
  many runs leave exposures; certain paths burn bright, rare paths stay faint.
- **Mark rule:** each streak is one run; brightness is frequency.
- **Shared hero:** 2,000 runs exposed onto one plate, each a thread of light through 20 gates. Failures are
  cut short and stay dim peach; the full-length bright sage path exposes to exactly 35.8 % of its potential
  brightness (the plate's densitometer reads it). Checks re-route faint failures back onto the bright path.
- **Native concept:** *"Embeddings: meaning as position"* — words exposed as points of light that cluster by
  meaning; the viewer drags a word and watches its neighbours.
- **Risk:** neon glow cliché. Dodge: tone-map to a photographic, cyanotype-like range (Prussian blue ground,
  not black), no bloom halos, grain from a seeded film-stock model.
- **Cost:** pixel buffer at ≤960×540 with per-frame accumulation memoised by checkpoint.

## 5. Differentiation matrix (first pass)

| | Ground | Dim | Material | Tempo | Teaching move | Audience |
|---|---|---|---|---|---|---|
| A Escapement | dark slate glass | 3D | machined metal | metronomic | mechanism / cause | exec + tech |
| B Ink Tank | clear water / white | 2D field | fluid | slow, viscous | conservation / contamination | general + tech |
| C Colony | earth umber | 2D sim | living | swarming → counted | emergence / population | tech + exec |
| D Ledger | CETI dark panel | 2D | print/data | crisp, discrete | counting / balancing | exec |
| E Margin | green-grey graph paper | 2D | ink on paper | hand-paced | predict / retrieve | non-technical |
| F Paper Theatre | warm stage black | 2.5D | cut paper | staged, theatrical | character / role | public + teams |
| G Typographic Matter | letterpress grey | 3D | metal type | heavy, mechanical | assembly / capacity | tech + writers |
| H Light Table | Prussian blue | 2D field | light | accumulating | frequency / history | tech + general |

## 6. How each direction meets the ladder (summary)
- **Glance (30 s):** the hero moment only, one number made by the marks.
- **Grasp (2 min):** the full loop, the compounding, the check, the honesty beat.
- **Wield:** one control re-runs the direction's own computation (k, checks on/off, c), with a committed
  prediction first.
- **Master:** the explorable: all parameters, plus a transfer question in a new setting.

## 7. Questions for the consultation
1. Which directions are still generic underneath (technique as texture)? Replace, don't polish.
2. What is genuinely at the edge of p5 2.3.4 in a browser, deterministic, and renderable on 2 CPUs?
3. Which hero sequences teach the compounding idea *better than a line chart would*? If one doesn't, cut it.
4. Is anything missing that would be more stunning and more CETI than one of these eight?
