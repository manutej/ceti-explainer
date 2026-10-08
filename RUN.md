# Plug and play

Clone this repo and you can gate and build a self-contained explainer HTML
file. No extra npm packages. Needs Python 3 and Node 18+.

```bash
git clone https://github.com/manutej/ceti-explainer.git
cd ceti-explainer/skills/ceti-explainer

# start from the template, or use the gold-standard reference
cp assets/_episode-template.js my-episode.js

node assets/gate.mjs my-episode.js
python3 assets/build.py my-episode.js "Title"
# writes Title.html next to the module; opens from disk, no server
```

Gold standard (derivation archetype):

```bash
node assets/gate.mjs reference/self-attention.js
python3 assets/build.py reference/self-attention.js "Self-attention"
```

Other references: `oauth.js` (process), `tcp.js` (state machine),
`binary-search.js` (code / trace).

## What must be present

`assets/engine.js` · `assets/gate.mjs` · `assets/shell.template.html` ·
`assets/ceti-tokens.css` · `assets/ceti-motion.css` · `assets/build.py` ·
`assets/_episode-template.js`

All present as of the engine-assets commit. Also `assets/snapshot.mjs`
(`node assets/snapshot.mjs <episode.js> <t> out.svg`) for a headless frame at any
time t — used by `eval/frame-items.mjs`. All four references gate PASS.

Course-film occupancy is separate: see `contrib/COURSE-E0.md`.
Command: `/sheaf-run course`

## Constraints

Cream `#FAF7F2` · vermillion `#D94F30` · ink `#2C2A28`.
No purple gradients. No emoji headings. Lookbook is a bar, not a corpus.
Persist generated stills, clips, and voice immediately.
