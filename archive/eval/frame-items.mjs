/* frame-items.mjs — turn an episode into one Jev item per frame.
   Usage: node frame-items.mjs <episode.js> <out.items.json> [samplesPerBeat=1]
   Requires assets/snapshot.mjs + assets/engine.js beside the episode's skill root. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [, , epPath, outPath, perBeatArg] = process.argv;
if (!epPath || !outPath) {
  console.error("usage: node frame-items.mjs <episode.js> <out.items.json> [samplesPerBeat]");
  process.exit(1);
}
const perBeat = Math.max(1, Number(perBeatArg ?? 1));
const SKILL = path.resolve(path.dirname(epPath), "..");
const SNAP = path.join(SKILL, "assets", "snapshot.mjs");
if (!fs.existsSync(SNAP)) { console.error(`missing ${SNAP} — the engine assets are not here`); process.exit(2); }

/* beats come from the module itself, so the sample grid is the real clock */
const src = fs.readFileSync(epPath, "utf8");
const beats = [];
{ // engine adds .start/.end; recompute them the same way: cumulative dur
  const re = /\{\s*id:\s*["']([^"']+)["'][^}]*?label:\s*["']([^"']+)["'][^}]*?dur:\s*([\d.]+)[^}]*?caption:\s*(["'`])([\s\S]*?)\4/g;
  let m, t = 0;
  while ((m = re.exec(src))) {
    const dur = Number(m[3]);
    beats.push({ id: m[1], label: m[2], caption: m[5].replace(/\s+/g, " ").trim(), start: t, end: t + dur });
    t += dur;
  }
}
if (!beats.length) { console.error("no beats parsed — check the module's beats array shape"); process.exit(3); }

const textOf = (svg) =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1].trim()).filter(Boolean);

const items = [];
const tmp = path.join(process.env.TMPDIR ?? "/tmp", `frame-${process.pid}.svg`);
for (const b of beats) {
  for (let k = 0; k < perBeat; k++) {
    const t = +(b.start + ((k + 0.5) * (b.end - b.start)) / perBeat).toFixed(2);
    execFileSync(process.execPath, [SNAP, epPath, String(t), tmp], { stdio: "pipe" });
    const svg = fs.readFileSync(tmp, "utf8");
    items.push({
      id: `${path.basename(epPath, ".js")}@t${t}`,
      state: { t, beatIndex: beats.indexOf(b) + 1, beatLabel: b.label, caption: b.caption, visibleText: textOf(svg) },
    });
  }
}
fs.rmSync(tmp, { force: true });
fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
console.log(`wrote ${items.length} frame items (${beats.length} beats × ${perBeat}) → ${outPath}`);
