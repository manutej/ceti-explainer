# Plug and play

Clone this repo and you can gate, scaffold, and build a self-contained
explainer HTML file. No npm packages. Needs Python 3 and Node 18+.

```bash
git clone https://github.com/manutej/ceti-explainer.git
cd ceti-explainer/skills/ceti-explainer

# 1. write a typed brief (copy one) and gate it — nothing else starts until PASS
cp briefs/rag.brief.json briefs/my-topic.brief.json
node assets/brief-gate.mjs briefs/my-topic.brief.json

# 2. scaffold the module: immutable slots filled, __AUDIT fails until you derive
node assets/scaffold.mjs briefs/my-topic.brief.json -o my-topic.js

# 3. author DATA → anchor → scenes → render, then gate
node assets/gate.mjs my-topic.js               # must print PASS

# 4. build one offline HTML file
python3 assets/build.py my-topic.js "My Topic" --preset ceti-course
```

The contract behind those four commands is `META-PROMPT.md`. The prose
version is `SKILL.md`.

## Gold standards

```bash
node assets/gate.mjs reference/self-attention.js        # derivation
node assets/gate.mjs reference/oauth.js                 # process
node assets/gate.mjs reference/tcp.js                   # state machine
node assets/gate.mjs reference/binary-search.js         # code trace
```

## Episode 1 of the course

```bash
cd ceti-explainer
node skills/ceti-explainer/assets/brief-gate.mjs skills/ceti-explainer/briefs/sheaf-glue.brief.json
node skills/ceti-explainer/assets/gate.mjs episodes/01-local-truths.js
python3 skills/ceti-explainer/assets/build.py episodes/01-local-truths.js \
  "Local truths, global maps" episodes/01-local-truths.html --preset ceti-course
```

Open `episodes/01-local-truths.html` from disk.

## What must be present

`assets/engine.js` · `assets/gate.mjs` · `assets/brief-gate.mjs` ·
`assets/scaffold.mjs` · `assets/snapshot.mjs` · `assets/shell.template.html` ·
`assets/ceti-tokens.css` · `assets/ceti-motion.css` · `assets/build.py` ·
`assets/_episode-template.js` · `briefs/brief.schema.json`

Course-film occupancy is separate: see `COURSE-E0.md`.
Command: `/sheaf-run course`

## Constraints

Cream `#FAF7F2` · vermillion `#D94F30` · ink `#2C2A28` (`--preset ceti-course`).
No purple gradients. No emoji headings. Lookbook is a bar, not a corpus.
Persist generated stills, clips, and voice immediately.
