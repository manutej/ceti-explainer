// node lib/camknobs.mjs -> prints the camera rig's knobs + knobs_doc (gl-camera-rig toKnobs) for lib/cam.base.json, with the 4-point scene stub
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(here, 'gl-camera-rig.js'), 'utf8'), ctx);
const RIG = ctx.window.ARSENAL.patterns['gl-camera-rig'].rig;
const script = JSON.parse(fs.readFileSync(path.join(here, 'cam.base.json'), 'utf8'));
const scene = { points: [[0, 0, 0], [0, -50, 0], [0, -60, 0], [0, -30, 0]] };
process.stdout.write(JSON.stringify(RIG.toKnobs(script, scene, { prefix: 'cam' })));
