# Wave FILMS-GL · three two-minute films that show the WebGL arsenal · 2026-10-10

One brief for every lane in this wave. The stage contract is factory/PIPELINE.md; the skills are skills/ATELIER.md
(atelier-brief for the topic packages, atelier-draft for the drafts, atelier-select for the blind selection). Laws:
CLAUDE.md and factory/FORMAT.md. The arsenal playbook: skills/atelier-draft/references/chain-recipes.md (R17–R28 are
the Wave GL recipes), the cards under arsenal/patterns/gl-*/card.md, the seats in arsenal/SEATS-GL.md (read the
WARNs of the lanes you use), the rule for when 3D earns its place in arsenal/WAVE-GL.md.

## Why
Nine WebGL lanes exist and none has been hosted in a film. Three films, three subjects a lay viewer can follow
(data, a neural network, mathematics), each chaining three DIFFERENT WebGL lanes so all nine are shown once, each at
least two minutes of material, each shipped through draft → select → fix → ship and published as an artifact.

## Shape of every film
- format `feature`, `dur` 123 (120 s of material + the 3 s CETI card; the gate caps a feature at 123). Beats scaled from
  skills/atelier-brief/references/formats.md: HOOK 0–9 · COMMIT 9–18 · CASE 18–58 · COUNT 58–108 · MONDAY 108–120.
- level `manager` (webgl and a post allowed), renderer `webgl`, chrome `none`, material `ink`; brand per film below.
- Every digit a claim with a formula, a source, or a `recompute` command (a script in the topic folder that
  regenerates the numbers deterministically: fixed seeds, numpy 2.5 is available; the gate recomputes formulas).
- Counts before ratios; the viewer commits before any number; one honest line; the CETI card last; captions carry it.
- The three WebGL lanes are the film's structures (at most four structures in all, the brand card not counted); flat
  lanes (track-unit, formula-bind, uncertainty-hop, scale-anchor) may be used in addition when they carry a beat.
- Labels through gl-labels where pins are needed (the seats' top fix); results never in the smallest face.
- Every tunable a knob (film.json knobs + knobs_doc); s/frame ≤ 1.5 headless on the heaviest frame; page < 1.3 MB.

## The three films
| id | subject (accessible) | the gap the film shows | WebGL lanes (all three must carry a beat) | brand |
|---|---|---|---|---|
| women-and-children | DATA · the Titanic's 2,201 people (Dawson 1995 table: class × sex × age × survived) | "Women and children first" was true on average; by class the picture reverses for some groups, and third-class children fared worse than first-class men | gl-stack-city (2,201 marks pooled → split by class and sex, tagged units), gl-labels (pins on slabs), gl-post (the reveal as a moment: selective bloom on the counted group, tone map always) | ceti-boardwalk-dark |
| how-a-network-learns | NEURAL NETWORK · a two-layer network learning Fisher's 150 irises | "The network figures it out" means: a loss surface, a ball rolling downhill, and a boundary that moves; the gap is that most of the drop happens in the first few dozen steps and the last 1 % costs most of the time | gl-pointcloud (the 150 flowers in 3 measured dimensions, the brushed set = the ones the boundary gets right at step k), gl-heightfield (the loss surface over two weights with the descent path and a section cut), gl-ribbons (signal flowing through the layers, width = weight, marks = the 150 examples riding each epoch) | ceti-neosage-dark |
| a-bell-from-dice | MATHEMATICS · the central limit theorem with dice | "Random means anything can happen" versus the bell that appears when you add: 100,000 rolls of five dice, counted one by one, partitioned first by the first die (flat), then by the sum (a bell); the exact probabilities by combinatorics agree with the count | gl-instances (100,000 rolls as one instanced draw, counted in; the flat ortho layer), gl-volume (the sums as a cell cloud with a travelling cut; the tail beyond 25 lit), gl-camera-rig (the move from the flat field to the sum partition and into the tail is the argument; its keys are knobs) | midnight-ink (film-local copy from factory/films/wiring-and-the-whole/brand.midnight-ink.json) |

## Stages and roles
1. BRIEF (Opus, one lane per film): factory/topics/<id>/{brief.md, claims.json, beats.md, data/, recompute.py}; the
   beats.md header names format feature, dur 123, level manager, renderer webgl, chrome none, brand, and the chain
   with the three WebGL lanes in beat order. claims.json in the one shape (skills/atelier-brief/references/claims-shape.md).
2. DRAFT ×2 (Opus, parallel, distinct registers): factory/films/<id>/drafts/{a,b}/ per atelier-draft.
3. SELECT (Opus, blind) → findings.r1 → tool → findings.r2 → tool, per atelier-select and PIPELINE.md.
4. SHIP: seat, PROTOTYPE.md measurements, catalogue, gallery, artifact, commit per lane, push.
No git from any lane; the orchestrator commits.
