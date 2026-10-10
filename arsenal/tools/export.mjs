#!/usr/bin/env node
// export.mjs <demo.html> [--variant v] [--fps 30] [--out dir] [--sel canvas] [--query "?film=1"] [--viewport 960x540]
//            [--dsf 2] [--dur s] [--gif-seconds 10] [--gif-width 480] [--name base]
// Frame-stepped export: seek each frame i to t = i/fps (time is SET, never observed), screenshot the element, then
// ffmpeg -> MP4 (libx264, yuv420p) and a palette GIF (<= 10 s). Verifies determinism by re-rendering three frames
// out of order and comparing SHA-256 with the exported PNGs. Prints seconds per frame and totals; writes export.json.
// Hooks required on the page: window.__film = { ready(), seek(t, variant?), info: { dur, variants? } } (sync draw).
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
let chromium;
try { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); } catch { ({ chromium } = await import('playwright')); }

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes('--' + k) ? argv[argv.indexOf('--' + k) + 1] : d);
if (!argv[0] || argv[0].startsWith('--')) { console.error('usage: export.mjs <demo.html> --variant v --fps 30 --out dir [--sel canvas]'); process.exit(2); }
const html = resolve(argv[0]), fps = +opt('fps', 30), sel = opt('sel', 'canvas'), query = opt('query', '');
const [vw, vh] = opt('viewport', '960x540').split('x').map(Number), dsf = +opt('dsf', 2);
const gifSec = +opt('gif-seconds', 10), gifW = +opt('gif-width', 480);
const out = resolve(opt('out', 'export-out')), framesDir = out + '/frames';
const sha = (b) => createHash('sha256').update(b).digest('hex');
const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const T0 = Date.now();
rmSync(framesDir, { recursive: true, force: true }); mkdirSync(framesDir, { recursive: true });

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
const b = await chromium.launch(exe ? { executablePath: exe } : {});
const pg = await b.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: dsf });
const errs = []; pg.on('console', (m) => m.type() === 'error' && errs.push(m.text())); pg.on('pageerror', (e) => errs.push(String(e)));
await pg.goto('file://' + html + query, { waitUntil: 'load' });
await pg.evaluate(() => window.__film.ready());
const info = await pg.evaluate(() => window.__film.info);
const variant = opt('variant', (info.variants && info.variants[0]) || undefined);
if (info.variants && !info.variants.includes(variant)) { console.error(`unknown variant ${variant}; have ${info.variants}`); process.exit(2); }
const dur = +opt('dur', info.dur || 4), N = Math.floor(dur * fps + 1e-9);
const name = opt('name', basename(html, '.html') + (variant ? '-' + variant : ''));
const el = pg.locator(sel).first();
const seek = (t) => pg.evaluate(([t, v]) => { window.__film.seek(t, v); return null; }, [t, variant]);
const shot = async (t) => { await seek(t); return el.screenshot({ type: 'png', animations: 'disabled' }); };
const fname = (i) => `${framesDir}/f${String(i).padStart(5, '0')}.png`;

// 1. capture every frame in order
const hashes = new Array(N); const tc = Date.now();
for (let i = 0; i < N; i++) { const buf = await shot(i / fps); hashes[i] = sha(buf); writeFileSync(fname(i), buf); }
const capture_s = (Date.now() - tc) / 1000;

// 2. determinism: re-render frames N0, N1, N2 after seeking elsewhere; hash must equal the exported PNG
const picks = [...new Set([Math.floor(N * 0.1), Math.floor(N / 2), N - 1])].slice(0, 3), verify = [];
for (const i of picks) {
  await seek(((i * 7 + 13) % N) / fps); await seek(0);                  // scramble the page state first
  const again = sha(await shot(i / fps));
  verify.push({ frame: i, t: +(i / fps).toFixed(4), exported: hashes[i].slice(0, 12), rerendered: again.slice(0, 12), identical: again === hashes[i] });
}
await b.close();

// 3. ffmpeg: MP4 and GIF
const tf = Date.now();
const mp4 = `${out}/${name}.mp4`, gif = `${out}/${name}.gif`;
sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${framesDir}/f%05d.png`, '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-preset', 'medium', '-movflags', '+faststart', mp4]);
const mp4_s = (Date.now() - tf) / 1000, tg = Date.now();
const gfps = Math.min(fps, 15), gdur = Math.min(gifSec, dur);
sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-i', `${framesDir}/f%05d.png`, '-t', String(gdur), '-vf',
  `fps=${gfps},scale=${gifW}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`, '-loop', '0', gif]);
const gif_s = (Date.now() - tg) / 1000;

// 4. probe the MP4: frame count and size must match the capture
const probe = sh('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames,width,height,pix_fmt,codec_name,r_frame_rate', '-of', 'json', mp4]);
const ps = JSON.parse(probe).streams[0];
const total_s = (Date.now() - T0) / 1000;
const report = { html, variant: variant || null, fps, dur, frames: N, size: [ps.width, ps.height], mp4, gif, probe: ps,
  mp4_frames_match: +ps.nb_read_frames === N, verify, deterministic: verify.every((v) => v.identical),
  seconds: { capture: +capture_s.toFixed(2), per_frame: +(capture_s / N).toFixed(4), mp4: +mp4_s.toFixed(2), gif: +gif_s.toFixed(2), total: +total_s.toFixed(2) }, errors: errs };
writeFileSync(`${out}/${name}.export.json`, JSON.stringify(report, null, 1));
console.log(`${name}: ${N} frames @ ${fps}fps ${ps.width}x${ps.height} ${ps.codec_name}/${ps.pix_fmt}  mp4 frames ${ps.nb_read_frames} ${report.mp4_frames_match ? 'OK' : 'MISMATCH'}`);
for (const v of verify) console.log(`  verify frame ${v.frame} (t=${v.t}s): ${v.exported} vs ${v.rerendered} ${v.identical ? 'IDENTICAL' : 'DIFF'}`);
console.log(`  seconds/frame ${report.seconds.per_frame}  capture ${report.seconds.capture}s  mp4 ${report.seconds.mp4}s  gif ${report.seconds.gif}s  TOTAL ${report.seconds.total}s  errors ${errs.length}`);
process.exit(report.deterministic && report.mp4_frames_match && !errs.length ? 0 : 1);
