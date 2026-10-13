#!/usr/bin/env node
// export.mjs <demo.html> [--variant v] [--fps 30] [--out dir] [--sel canvas] [--query "?film=1"] [--viewport 960x540]
//            [--dsf 2] [--dur s] [--from s] [--to s] [--gif-seconds 10] [--gif-width 480] [--name base]
//            [--shutter 0.35] [--samples auto|N] [--max-samples 48] [--cuts t,t,..] [--ssaa k] [--shards k/n | n] [--crf 16] [--preset medium]
// Frame-stepped export: seek each frame i to t = i/fps (time is SET, never observed), screenshot the element, then
// ffmpeg -> MP4 (libx264, yuv420p, tagged bt709/tv) and a palette GIF (<= 10 s, skipped with --gif-seconds 0). Verifies determinism by
// re-rendering up to four frames out of order (middle, first after a cut, heaviest sample count, first) and comparing SHA-256 with
// the exported PNGs. Prints seconds per frame and totals; writes export.json (incl. the sample count of every frame).
// Hooks required on the page: window.__film = { ready(), seek(t, variant?), info: { dur, variants? } } (sync draw).
//
// MOTION BLUR + TEMPORAL AA (D15)   --shutter s   fraction of a frame the shutter is open (0.35 = 126 deg, 0.5 = 180 deg)
//                                   --samples N|auto   sub-frames per frame (auto: chosen per frame from the measured motion)
//  * A page whose render runs gl-post's renderAccumulated reads window.__EXPORT = {samples, shutter, fps, cuts} (set before the
//    page loads) and accumulates in linear light inside seek(t), with Halton jitter: the exporter then just screenshots ("page" mode).
//  * Any other film ("exporter" mode, nothing to change in the film): the exporter seeks N sub-times tk = t + ((k+.5)/N - .5)*shutter/fps,
//    screenshots each and averages the PNGs in LINEAR light (sRGB decode, mean, encode). Sub-times never cross a cut. `auto` probes the two
//    ends of the shutter: identical pictures = a hold (N = 1, no cost); else the displacement D (px over the shutter, from
//    sum|dI| / sum|grad I|) picks N = ceil(D/2) snapped up to 8/16/32/48 (a step of <= 2 px between sub-frames).
//  * --ssaa k renders k times the pixels (dsf*k) and box-filters down in linear light: spatial AA for holds (floor-grid moire), any film.
//  * Cuts (no sub-frame crosses one): film.json `cuts: [t..]`, the rig's `cut` moves, and --cuts t,t,... Declare every hard cut.
//  * --from/--to seconds window; --shards k/n renders frames i with (i - first) % n == k-1 (run all k, or --shards n to spawn n workers);
//    the last worker to finish joins the frames into one MP4 and one export.json.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { resolve, basename, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

/* ───────────── PNG codec (8-bit RGB/RGBA, non-interlaced: what Chromium screenshots) and linear-light accumulation ───────────── */
export function pngDecode(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let p = 8, w = 0, h = 0, ct = 0, bd = 0, il = 0; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('latin1', p + 4, p + 8), d = p + 8;
    if (type === 'IHDR') { w = buf.readUInt32BE(d); h = buf.readUInt32BE(d + 4); bd = buf[d + 8]; ct = buf[d + 9]; il = buf[d + 12]; }
    else if (type === 'IDAT') idat.push(buf.subarray(d, d + len));
    else if (type === 'IEND') break;
    p = d + len + 4;
  }
  if (bd !== 8 || il !== 0 || (ct !== 2 && ct !== 6)) throw new Error(`unsupported PNG (depth ${bd}, colour type ${ct}, interlace ${il})`);
  const ch = ct === 6 ? 4 : 3, stride = w * ch, raw = zlib.inflateSync(Buffer.concat(idat)), px = new Uint8Array(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], s = y * (stride + 1) + 1, o = y * stride, up = o - stride;
    for (let x = 0; x < stride; x++) {
      const r = raw[s + x], a = x >= ch ? px[o + x - ch] : 0, b = y ? px[up + x] : 0;
      let v;
      if (f === 0) v = r; else if (f === 1) v = r + a; else if (f === 2) v = r + b; else if (f === 3) v = r + ((a + b) >> 1);
      else { const c = x >= ch && y ? px[up + x - ch] : 0, pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v = r + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      px[o + x] = v;
    }
  }
  if (ch === 3) return { w, h, data: px };
  const rgb = new Uint8Array(w * h * 3); for (let i = 0, j = 0; i < px.length; i += 4, j += 3) { rgb[j] = px[i]; rgb[j + 1] = px[i + 1]; rgb[j + 2] = px[i + 2]; }
  return { w, h, data: rgb };
}
export function pngEncode(w, h, rgb) {
  const stride = w * 3, raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) { raw[y * (stride + 1)] = 1; const o = y * stride, s = y * (stride + 1) + 1;   // filter 1 (Sub): deterministic, compresses flat areas
    for (let x = 0; x < stride; x++) raw[s + x] = (rgb[o + x] - (x >= 3 ? rgb[o + x - 3] : 0)) & 255; }
  const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8);
    b.writeUInt32BE(zlib.crc32(b.subarray(4, 8 + data.length)) >>> 0, 8 + data.length); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 3 })), chunk('IEND', Buffer.alloc(0))]);
}
const S2L = new Float32Array(256); for (let i = 0; i < 256; i++) { const x = i / 255; S2L[i] = x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }
const L2S = new Uint8Array(65536); for (let i = 0; i < 65536; i++) { const x = i / 65535; L2S[i] = Math.round(255 * (x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055)); }
/* mean of N sub-frames in linear light, with an optional k x k box downsample (ssaa), then re-encoded as sRGB */
export class Accum {
  constructor(ssaa = 1) { this.k = ssaa; this.n = 0; this.w = 0; this.h = 0; this.sum = null; }
  add(img) {
    const k = this.k; if (!this.sum) { this.w = img.w / k; this.h = img.h / k; this.sum = new Float32Array(this.w * this.h * 3); }
    if (img.w !== this.w * k || img.h !== this.h * k) throw new Error('accum: size changed between sub-frames');
    const sum = this.sum, d = img.data;
    if (k === 1) { for (let i = 0; i < d.length; i++) sum[i] += S2L[d[i]]; }
    else for (let y = 0; y < img.h; y++) { const row = ((y / k) | 0) * this.w * 3, src = y * img.w * 3;
      for (let x = 0; x < img.w; x++) { const o = row + ((x / k) | 0) * 3, s = src + x * 3; sum[o] += S2L[d[s]]; sum[o + 1] += S2L[d[s + 1]]; sum[o + 2] += S2L[d[s + 2]]; } }
    this.n++;
  }
  png() {
    const k = this.k, sc = 65535 / (this.n * k * k), out = new Uint8Array(this.sum.length);
    for (let i = 0; i < out.length; i++) { const v = Math.round(this.sum[i] * sc); out[i] = L2S[v > 65535 ? 65535 : v]; }
    return pngEncode(this.w, this.h, out);
  }
}
/* the exporter's twin of gl-post's cutClamp / sub-frame times (kept identical on purpose) */
export function cutClamp(tk, t, cuts, dur) {
  let lo = 0, hi = dur == null ? Infinity : dur;
  for (const c of cuts || []) { if (c <= t + 1e-9) lo = Math.max(lo, c); else hi = Math.min(hi, c - 1e-6); }
  return Math.min(hi, Math.max(lo, tk));
}
export const subTimes = (t, N, shutter, fps, cuts, dur) => Array.from({ length: N }, (_, k) => cutClamp(t + ((k + 0.5) / N - 0.5) * shutter / fps, t, cuts, dur));
/* motion between two pictures of the same size: D = sum|dI| / sum|grad I| over the pixels that changed (brightness constancy;
   backing px, divided by ssaa), changed = their fraction. Saturates for jumps larger than an edge width; a full-field change (changed > 0.25) is therefore never below 16 */
export function probeMotion(a, b, ssaa = 1) {
  const w = a.w, h = a.h, Ya = new Uint8Array(w * h), Yb = new Uint8Array(w * h);
  for (let i = 0, j = 0; j < w * h; i += 3, j++) { Ya[j] = (54 * a.data[i] + 183 * a.data[i + 1] + 19 * a.data[i + 2]) >> 8; Yb[j] = (54 * b.data[i] + 183 * b.data[i + 1] + 19 * b.data[i + 2]) >> 8; }
  let sd = 0, sg = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, d = Math.abs(Ya[i] - Yb[i]); if (d <= 3) continue;
    const gx = (Ya[i + 1] + Yb[i + 1] - Ya[i - 1] - Yb[i - 1]) / 4, gy = (Ya[i + w] + Yb[i + w] - Ya[i - w] - Yb[i - w]) / 4;
    sd += d; sg += Math.hypot(gx, gy); n++;
  }
  return { D: sg > 0 ? sd / sg / ssaa : 0, changed: n / (w * h) };
}
export const tierN = (D, changed, maxN = 48) => { let n = Math.max(8, Math.ceil(D / 2)); if (changed > 0.25) n = Math.max(n, 16); n = n <= 8 ? 8 : n <= 16 ? 16 : n <= 32 ? 32 : 48; return Math.min(n, maxN); };

/* One output frame at time t. shot(tk) -> PNG Buffer of the picture seeked to tk. cfg: { fps, shutter, samples: N | 'auto', cuts, dur, maxSamples, ssaa }.
   Returns { png, samples, D, renders }. Pure in t when shot is. */
export async function renderFrame(shot, t, cfg) {
  const ss = cfg.ssaa || 1, shutter = +cfg.shutter || 0, fps = cfg.fps || 30; let renders = 0;
  const sh = async (tk) => { renders++; return shot(tk); };
  const one = (buf) => { if (ss === 1) return buf; const a = new Accum(ss); a.add(pngDecode(buf)); return a.png(); };
  let N = cfg.samples === 'auto' ? 'auto' : Math.max(1, Math.round(+cfg.samples || 1)), D = null;
  if (!(shutter > 0) || N === 1) return { png: one(await sh(t)), samples: 1, D, renders };
  if (N === 'auto') {
    const half = shutter / fps / 2, ta = cutClamp(t - half, t, cfg.cuts, cfg.dur), tb = cutClamp(t + half, t, cfg.cuts, cfg.dur);
    if (tb - ta < 1e-6) return { png: one(await sh(t)), samples: 1, D: 0, renders };
    const A = await sh(ta), B = await sh(tb);
    if (A.equals(B)) return { png: one(A), samples: 1, D: 0, renders };                    // a hold: both ends of the shutter are the same picture
    const m = probeMotion(pngDecode(A), pngDecode(B), ss); D = +m.D.toFixed(2); N = tierN(m.D, m.changed, cfg.maxSamples || 48);
  }
  const acc = new Accum(ss); let prevT = null, prevImg = null;
  for (const tk of subTimes(t, N, shutter, fps, cfg.cuts, cfg.dur)) {
    if (tk !== prevT) { prevImg = pngDecode(await sh(tk)); prevT = tk; }                  // clamped sub-times repeat: reuse the render
    acc.add(prevImg);
  }
  return { png: acc.png(), samples: N, D, renders };
}

/* ───────────── command line ───────────── */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) await main();

async function main() {
  const argv = process.argv.slice(2);
  const opt = (k, d) => (argv.includes('--' + k) ? argv[argv.indexOf('--' + k) + 1] : d);
  if (!argv[0] || argv[0].startsWith('--')) { console.error('usage: export.mjs <demo.html> --variant v --fps 30 --out dir [--sel canvas] [--from s --to s] [--shutter 0.35 --samples auto|N] [--shards k/n]'); process.exit(2); }
  const html = resolve(argv[0]), fps = +opt('fps', 30), sel = opt('sel', 'canvas'), query = opt('query', '');
  const [vw, vh] = opt('viewport', '960x540').split('x').map(Number), dsf = +opt('dsf', 2), ssaa = Math.max(1, Math.round(+opt('ssaa', 1)));
  const gifSec = +opt('gif-seconds', 10), gifW = +opt('gif-width', 480), crf = opt('crf', '16'), preset = opt('preset', 'medium');
  const out = resolve(opt('out', 'export-out')), framesDir = out + '/frames';
  const samplesArg = opt('samples', undefined), shutterArg = opt('shutter', undefined);
  const shutter = shutterArg != null ? +shutterArg : samplesArg != null && samplesArg !== '1' ? 0.35 : 0;
  const samples = samplesArg != null ? (samplesArg === 'auto' ? 'auto' : Math.max(1, Math.round(+samplesArg))) : shutter > 0 ? 'auto' : 1;
  const maxSamples = +opt('max-samples', 48), userCuts = String(opt('cuts', '')).split(',').filter(Boolean).map(Number);
  const sha = (b) => createHash('sha256').update(b).digest('hex');
  const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 }).toString();
  const T0 = Date.now();

  // --shards n  (or all/n): spawn n workers of this script, each --shards k/n, and wait; the last to finish joins
  const sharg = opt('shards', '1/1'), spawnAll = /^(all\/)?\d+$/.test(sharg) && +sharg.replace('all/', '') > 1;
  if (spawnAll) {
    const n = +sharg.replace('all/', ''), run = opt('run', String(Date.now()));
    const base = argv.filter((a, i) => !(['--shards', '--run'].includes(a) || ['--shards', '--run'].includes(argv[i - 1])));
    const codes = await Promise.all(Array.from({ length: n }, (_, k) => new Promise((ok) => {
      const c = spawn(process.execPath, [fileURLToPath(import.meta.url), ...base, '--shards', `${k + 1}/${n}`, '--run', run], { stdio: ['ignore', 'pipe', 'pipe'] });
      const tag = (d) => String(d).split('\n').filter(Boolean).forEach((l) => console.log(`[${k + 1}/${n}] ${l}`));
      c.stdout.on('data', tag); c.stderr.on('data', tag); c.on('exit', (code) => ok(code));
    })));
    process.exit(codes.some((c) => c) ? 1 : 0);
  }
  const [shK, shN] = sharg.includes('/') ? sharg.split('/').map(Number) : [1, 1];
  mkdirSync(framesDir, { recursive: true });

  let chromium;
  try { ({ chromium } = await import('/opt/node-tools/node_modules/playwright/index.mjs')); } catch { ({ chromium } = await import('playwright')); }
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(existsSync);
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const pg = await b.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: dsf * ssaa });
  pg.setDefaultTimeout(0);                                                               // a 48-sample frame at 4K can pass 30 s: no screenshot timeout
  const errs = []; pg.on('console', (m) => m.type() === 'error' && errs.push(m.text())); pg.on('pageerror', (e) => errs.push(String(e)));
  const X = { fps }; if (samplesArg != null || shutterArg != null) { X.samples = samples; X.shutter = shutter; }
  await pg.addInitScript((x) => { window.__EXPORT = x; }, X);                            // read by gl-post's renderAccumulated (page mode)
  await pg.goto('file://' + html + query, { waitUntil: 'load' });
  await pg.evaluate(() => window.__film.ready());
  const info = await pg.evaluate(() => window.__film.info);
  const variant = opt('variant', (info.variants && info.variants[0]) || undefined);
  if (info.variants && !info.variants.includes(variant)) { console.error(`unknown variant ${variant}; have ${info.variants}`); process.exit(2); }
  const filmDur = +opt('dur', info.dur || 4);
  const from = +opt('from', 0), to = Math.min(+opt('to', filmDur), filmDur), first = Math.round(from * fps), last = Math.floor(to * fps + 1e-9), count = last - first;
  if (!(count > 0)) { console.error(`empty window ${from}..${to} s`); process.exit(2); }
  const name = opt('name', basename(html, '.html') + (variant ? '-' + variant : '')), run = opt('run', 'solo');
  const mine = []; for (let i = first; i < last; i++) if ((i - first) % shN === shK - 1) mine.push(i);

  // cuts: film.json `cuts`, the rig's `cut` moves, --cuts
  const filmCuts = await pg.evaluate(() => { const F = (window.KIT && window.KIT.FILM) || {}, c = (F.cuts || []).slice();
    for (const m of (F.rig && F.rig.moves) || []) if (m.move === 'cut' && m.t0 != null) c.push(m.t0); return c.map(Number).filter(Number.isFinite); });
  const cuts = [...new Set([...filmCuts, ...userCuts])].sort((a, c) => a - c);
  await pg.evaluate((c) => { window.__EXPORT.cuts = c; }, cuts);
  const el = pg.locator(sel).first();
  const seek = (t) => pg.evaluate(([t, v]) => { window.__film.seek(t, v); return null; }, [t, variant]);
  const pageSamples = () => pg.evaluate(() => (window.__EXPORT && window.__EXPORT.last ? window.__EXPORT.last : null));
  const shot = async (t) => { await seek(t); return el.screenshot({ type: 'png', animations: 'disabled', timeout: 0 }); };
  const fname = (i) => `${framesDir}/f${String(i).padStart(5, '0')}.png`;

  // which side does the blur live on? probe one seek: gl-post consumed __EXPORT -> the page accumulates ("page"); else the exporter does
  let mode = 'off';
  if (samplesArg != null || shutterArg != null) {
    await seek(first / fps); const used = await pg.evaluate(() => !!(window.__EXPORT && window.__EXPORT.used));
    mode = used ? 'page' : (shutter > 0 && samples !== 1 ? 'exporter' : 'off');
  }
  const cfg = { fps, shutter, samples, cuts, dur: filmDur, maxSamples, ssaa };
  const grab = async (t) => {
    if (mode === 'exporter' || ssaa > 1) { const r = await renderFrame(shot, t, mode === 'exporter' ? cfg : { fps, shutter: 0, samples: 1, ssaa }); return Object.assign(r, { pageSamples: null }); }
    const png = await shot(t), L = await pageSamples(); return { png, samples: L ? L.samples : 1, D: null, renders: 1, pageSamples: L ? L.samples : null, warn: L && L.warn && L.warn.length ? L.warn : undefined };
  };

  // 1. capture this shard's frames
  const hashes = new Map(), perFrame = [], tc = Date.now(); let renders = 0; const warns = new Set();
  for (const [n, i] of mine.entries()) {
    const a = Date.now(), r = await grab(i / fps); writeFileSync(fname(i), r.png); hashes.set(i, sha(r.png)); renders += r.renders;
    if (r.warn) r.warn.forEach((w) => warns.add(w));
    perFrame.push([i, r.samples, Date.now() - a, r.D]);
    if ((n + 1) % 30 === 0 || n === mine.length - 1) console.log(`  frame ${n + 1}/${mine.length} (index ${i}, t ${(i / fps).toFixed(2)} s): ${r.samples} samples, ${((Date.now() - tc) / (n + 1) / 1000).toFixed(2)} s/frame so far`);
  }
  const capture_s = (Date.now() - tc) / 1000;

  // 2. determinism: re-render the middle frame, the first frame after a cut, the heaviest-sample frame and the first, after seeking elsewhere
  const heavy = perFrame.reduce((m, f) => (f[1] > (m ? m[1] : 0) ? f : m), null);
  const afterCut = cuts.map((c) => Math.ceil(c * fps - 1e-9)).find((i) => hashes.has(i));
  const picks = [...new Set([mine[Math.floor(mine.length / 2)], afterCut, heavy && heavy[0], mine[0]].filter((x) => x != null))], verify = [];
  for (const i of picks) {
    await seek((((i - first) * 7 + 13) % count + first) / fps); await seek(0);           // scramble the page state first
    const again = sha((await grab(i / fps)).png), f = perFrame.find((q) => q[0] === i);
    verify.push({ frame: i, t: +(i / fps).toFixed(4), samples: f[1], exported: hashes.get(i).slice(0, 12), rerendered: again.slice(0, 12), identical: again === hashes.get(i) });
  }
  await b.close();

  // shard record; the last worker to finish (atomic lock) joins
  const sdir = `${out}/.shards`; mkdirSync(sdir, { recursive: true }); if (shN === 1) rmSync(`${sdir}/${run}.join`, { recursive: true, force: true });
  const rec = { k: shK, n: shN, frames: mine.length, perFrame, verify, renders, capture_s, errors: errs, warns: [...warns] };
  writeFileSync(`${sdir}/${run}.${shK}-of-${shN}.json`, JSON.stringify(rec));
  const have = (k) => existsSync(`${sdir}/${run}.${k}-of-${shN}.json`);
  if (!Array.from({ length: shN }, (_, k) => have(k + 1)).every(Boolean)) { console.log(`shard ${shK}/${shN} done: ${mine.length} frames in ${capture_s.toFixed(1)} s (${(capture_s / mine.length).toFixed(2)} s/frame); the last worker joins`); process.exit(verify.every((v) => v.identical) && !errs.length ? 0 : 1); }
  try { mkdirSync(`${sdir}/${run}.join`); } catch { process.exit(0); }                    // another worker is joining
  const recs = Array.from({ length: shN }, (_, k) => JSON.parse(readFileSync(`${sdir}/${run}.${k + 1}-of-${shN}.json`, 'utf8')));

  // 3. ffmpeg: MP4 (bt709, tv range, tagged) and GIF
  const missing = []; for (let i = first; i < last; i++) if (!existsSync(fname(i))) missing.push(i);
  if (missing.length) { console.error(`missing ${missing.length} frames, first ${missing[0]}`); process.exit(1); }
  const tf = Date.now(), mp4 = `${out}/${name}.mp4`, gif = `${out}/${name}.gif`;
  sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-start_number', String(first), '-i', `${framesDir}/f%05d.png`, '-frames:v', String(count),
    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos:out_color_matrix=bt709:out_range=tv',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-crf', crf, '-preset', preset, '-movflags', '+faststart', mp4]);
  const mp4_s = (Date.now() - tf) / 1000, tg = Date.now(), gdur = Math.min(gifSec, count / fps);
  if (gdur > 0) sh('ffmpeg', ['-y', '-v', 'error', '-framerate', String(fps), '-start_number', String(first), '-i', `${framesDir}/f%05d.png`, '-t', String(gdur), '-vf',
    `fps=${Math.min(fps, 15)},scale=${gifW}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`, '-loop', '0', gif]);
  const gif_s = (Date.now() - tg) / 1000;

  // 4. probe the MP4: frame count, size and colour tags must match
  const ps = JSON.parse(sh('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
    'stream=nb_read_frames,width,height,pix_fmt,codec_name,r_frame_rate,color_space,color_primaries,color_transfer,color_range', '-of', 'json', mp4])).streams[0];
  const all = recs.flatMap((r) => r.perFrame).sort((a, c) => a[0] - c[0]), vAll = recs.flatMap((r) => r.verify), ns = all.map((f) => f[1]);
  const hist = {}; for (const n of ns) hist[n] = (hist[n] || 0) + 1;
  const capMax = Math.max(...recs.map((r) => r.capture_s)), sumFrameMs = all.reduce((s, f) => s + f[2], 0);
  const byN = {}; for (const f of all) (byN[f[1]] = byN[f[1]] || []).push(f[2]);
  const costByN = Object.fromEntries(Object.entries(byN).map(([n, a]) => [n, { frames: a.length, mean_s: +(a.reduce((s, x) => s + x, 0) / a.length / 1000).toFixed(2) }]));
  const total_s = (Date.now() - T0) / 1000, errors = recs.flatMap((r) => r.errors);
  const report = { html, variant: variant || null, fps, dur: filmDur, window: { from, to, first_frame: first, frames: count }, frames: count, size: [ps.width, ps.height], mp4, gif: gdur > 0 ? gif : null, probe: ps,
    mp4_frames_match: +ps.nb_read_frames === count, verify: vAll, deterministic: vAll.every((v) => v.identical),
    accum: { mode, shutter, samples_arg: samples, ssaa, max_samples: maxSamples, cuts, mean_samples: +(ns.reduce((s, x) => s + x, 0) / ns.length).toFixed(2), histogram: hist, warns: [...new Set(recs.flatMap((r) => r.warns))],
      renders: recs.reduce((s, r) => s + r.renders, 0), cost_by_samples: costByN, per_frame: all.map((f) => ({ i: f[0], n: f[1], ms: f[2], D: f[3] })) },
    shards: shN, seconds: { capture: +capMax.toFixed(2), per_frame: +(sumFrameMs / 1000 / count).toFixed(4), per_frame_wall: +(capMax / (count / shN)).toFixed(4), mp4: +mp4_s.toFixed(2), gif: +gif_s.toFixed(2), total: +total_s.toFixed(2) }, errors };
  writeFileSync(`${out}/${name}.export.json`, JSON.stringify(report, null, 1));
  for (const f of readdirSync(sdir)) if (f.startsWith(run + '.')) rmSync(`${sdir}/${f}`, { recursive: true, force: true });
  console.log(`${name}: ${count} frames @ ${fps}fps ${ps.width}x${ps.height} ${ps.codec_name}/${ps.pix_fmt} ${ps.color_space}/${ps.color_primaries}/${ps.color_transfer}/${ps.color_range}  mp4 frames ${ps.nb_read_frames} ${report.mp4_frames_match ? 'OK' : 'MISMATCH'}`);
  console.log(`  accumulation: mode ${mode}, shutter ${shutter}, samples ${samples}, mean N ${report.accum.mean_samples}, histogram ${JSON.stringify(hist)}${report.accum.warns.length ? ', WARN ' + report.accum.warns : ''}`);
  for (const v of vAll) console.log(`  verify frame ${v.frame} (t=${v.t}s, N=${v.samples}): ${v.exported} vs ${v.rerendered} ${v.identical ? 'IDENTICAL' : 'DIFF'}`);
  console.log(`  seconds/frame ${report.seconds.per_frame} (wall ${report.seconds.per_frame_wall} with ${shN} shard${shN > 1 ? 's' : ''})  capture ${report.seconds.capture}s  mp4 ${report.seconds.mp4}s  gif ${report.seconds.gif}s  TOTAL ${report.seconds.total}s  errors ${errors.length}`);
  process.exit(report.deterministic && report.mp4_frames_match && !errors.length ? 0 : 1);
}
