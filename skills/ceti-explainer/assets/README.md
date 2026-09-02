# Engine assets

| File | Role |
|---|---|
| `engine.js` | Deterministic clock + player. Do not edit. |
| `gate.mjs` | `node gate.mjs <episode.js>` — must print PASS |
| `snapshot.mjs` | Headless SVG frame at time t |
| `build.py` | Inline tokens + motion + engine + module into one HTML |
| `shell.template.html` | Player chrome |
| `ceti-tokens.css` | Role tokens |
| `ceti-motion.css` | Ease vocabulary |
| `_episode-template.js` | Copy this to start |
| `audit-overlaps.js` | Browser bbox auditor |

```bash
node assets/gate.mjs reference/self-attention.js
python3 assets/build.py reference/self-attention.js "Self-attention"
```
