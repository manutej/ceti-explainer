# simpsons-3d draft C · "the instrument"

Build: `python3 lib/assemble.py` (film.js = morph-type, shader, webgl-scene copies in lib/, cut and stripped, + lib/film.src.js), then
`python3 factory/kit2/build.py <this dir> --brand ceti-boardwalk-dark --chrome none`. kit2 had `renderer:"webgl"`, knobs and fonts3d (no standalone shell needed).
Page 1,269,458 B (limit 1.3 MB; tight: p5 + 5 woff2 faces). Film code 80.1 KB.

**Measured:** 0.42 s/frame (frames.mjs, 151 frames, headless software GL); 0.2-0.5 s typical, 1.3-1.5 s on neon/extruded reveal frames (55-57 s) and at 36.8 s.
**Gate:** PASS (G1-G10). Only WARN: G5c, the arrival counters tick through 270, 462, ... (counts in progress).

## Design
Boxes are ONE geometry (4,526 boxes, buildGeometry); per-box data (split delta, light threshold, stagger, arrival) rides in the geometry's uv and vertex-colour
channels and a role-lit vertex shader moves/lights/dims from uniforms. Pooled: two columns, admitted at the bottom, front view (men taller).
Split: 12 slabs normalised to 20 layers, so lit height = rate; turntable 0 to 90 degrees while boxes pour into slabs. Labels are SVG pins from worldToScreen.
Headline = arsenal morph-type on a P2D layer (45 -> 30 -> six pairs). Reveal = textToModel "2" (webgl-scene) + neon bloom (GLSL header of the shader material), reveal frames only.

## Deviations and warnings
- The turn is not a pure change of viewpoint: occlusion makes one object with a pooled front and a split side impossible, so boxes re-arrange during the turn (like the 2D film's split).
- Mono face (Space Mono) for headline and numerals: arsenal fonts have no Fraunces; the hook headline uses Fraunces italic in SVG only.
- Captions are data in film.json (kit copies them at load), not knobs; caption 12 shortened to one line ("the easy two" dropped).
- Level "manager" (neon not exec-clean, Q6). pencil() is a no-op under webgl; the Monday strike is an SVG line.
- Remaining: neon on the numeral is strong at peak (neonGain/neonThr); previous department's rates sit close to the focused pin at 14 u.
- 52 knobs, all in knobs_doc (name, range/options, what it moves).
