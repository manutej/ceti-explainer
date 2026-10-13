/* factory/tools/rubric-px.mjs · the pixel half of rubric.mjs (P2 P3 P4 P8 P11 P13 P16 P18 P21, raw P1 P7 P9): imported by rubric.mjs, not run alone.
   Frames: --mp4 is decoded by ffmpeg to a 320 x 180 raw file (random access) and to 1920 x 1080 on demand; without it the page renders them (c.full = the worker pool). */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pngDecode } from '../../arsenal/tools/export.mjs';

export async function run(c) {
const { o, fps, dur, N, MP4, S, gi, film, kn, docs, MV, CAPS, D, prop, R, ts, pct, med, mean, num, ARR, full } = c;
/* ── pixels: 320 x 180 frames from the mp4 (raw file, random access) or from page renders (prefetched on the stride grid) ── */
const W = 320, H = 180, FS = W * H * 3, cache = new Map(), pre = new Map(); let rawFd, rawFile;
function mk(rgb) {   // luma at 320 x 180 and 160 x 90, accent mask (chroma > 45, max channel > 110)
  const g = new Float32Array(W * H), g2 = new Float32Array(W * H / 4), m = new Uint8Array(W * H);
  for (let p = 0; p < W * H; p++) { const r = rgb[3 * p], v = rgb[3 * p + 1], b = rgb[3 * p + 2], x = Math.max(r, v, b); g[p] = 0.2126 * r + 0.7152 * v + 0.0722 * b; m[p] = x > 110 && x - Math.min(r, v, b) > 45 ? 1 : 0; }
  for (let y = 0; y < H / 2; y++) for (let x = 0; x < W / 2; x++) { const p = 2 * y * W + 2 * x; g2[y * W / 2 + x] = (g[p] + g[p + 1] + g[p + W] + g[p + W + 1]) / 4; }
  return { g, g2, m };
}
const F = (i) => { i = Math.max(0, Math.min(N - 1, i)); if (cache.has(i)) return cache.get(i); let f; if (MP4) { const b = Buffer.alloc(FS); fs.readSync(rawFd, b, 0, FS, i * FS); f = mk(b); } else if (!(f = pre.get(i))) throw new Error('frame ' + i + ' not prefetched'); cache.set(i, f); if (cache.size > 500) cache.delete(cache.keys().next().value); return f; };
const luma = (px, p) => 0.2126 * px[3 * p] + 0.7152 * px[3 * p + 1] + 0.0722 * px[3 * p + 2];
const shot = async (pg, i) => { await pg.evaluate((t) => { window.__film.seek(t); return new Promise((r) => requestAnimationFrame(() => r())); }, i / fps); return pngDecode(await pg.locator('#stage').first().screenshot({ type: 'png' })).data; };
async function frames(i, k = 1) {   // k consecutive frames at 1920 x 1080 rgb
  if (MP4) { const b = execFileSync('ffmpeg', ['-v', 'error', '-ss', String((i + 0.25) / fps), '-i', o.mp4, '-frames:v', String(k), '-vf', 'scale=1920:1080:flags=area', '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 }); return Array.from({ length: k }, (_, q) => new Uint8Array(b.buffer, b.byteOffset + q * 6220800, 6220800)); }
  return full(Array.from({ length: k }, (_, q) => i + q), shot);
}
async function prefetch(set) {
  const want = [...set].filter((i) => i >= 0 && i < N && !pre.has(i)).sort((a, b) => a - b); console.error(`rubric: rendering ${want.length} frames from the page`);
  const out = await full(want, async (pg, i) => { const px = await shot(pg, i), d = new Uint8Array(FS); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) { let s = 0; for (let j = 0; j < 6; j++) for (let q = 0; q < 6; q++) s += px[((y * 6 + j) * 1920 + x * 6 + q) * 3 + c]; d[(y * W + x) * 3 + c] = Math.round(s / 36); } return d; });
  want.forEach((i, q) => pre.set(i, mk(out[q])));
}
function openRaw() {
  rawFile = path.join(o.keepRaw || os.tmpdir(), `${path.basename(o.mp4)}.${fs.statSync(o.mp4).size}.320x180.rgb`);
  if (!fs.existsSync(rawFile) || fs.statSync(rawFile).size < FS * N) { fs.mkdirSync(path.dirname(rawFile), { recursive: true }); execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', o.mp4, '-vf', 'scale=320:180:flags=area', '-pix_fmt', 'rgb24', '-f', 'rawvideo', rawFile], { maxBuffer: 1 << 28 }); }
  rawFd = fs.openSync(rawFile, 'r');
}
const boxes = (D, i, sc, pad = 0) => (D[Math.min(N, i)] || []).filter((r) => r[2] >= 0.3).map((r) => [r[4] * sc - pad, r[5] * sc - pad, r[6] * sc + pad, r[7] * sc + pad]);
const fill = (ex, bs) => { for (const b of bs) for (let y = Math.max(0, b[1] | 0); y < Math.min(H, b[3]); y++) for (let x = Math.max(0, b[0] | 0); x < Math.min(W, b[2]); x++) ex[y * W + x] = 1; };
function subject(f, ex, acc) {   // accent mask, or the data (> 28/255 from the background mode); text boxes left out: count, centroid, 2/98 % edges, height fraction
  let bg = 0; if (!acc) { const h = new Uint32Array(64); for (let p = 0; p < W * H; p++) if (!ex[p]) h[f.g[p] >> 2]++; bg = h.indexOf(Math.max(...h)) * 4 + 2; }
  let n = 0, sx = 0, sy = 0; const rc = new Uint32Array(H), cc = new Uint32Array(W);
  for (let p = 0; p < W * H; p++) if (!ex[p] && (acc ? f.m[p] : Math.abs(f.g[p] - bg) > 28)) { const x = p % W, y = (p / W) | 0; n++; sx += x; sy += y; rc[y]++; cc[x]++; }
  const q = (h, a) => { let c = 0; for (let i = 0; i < h.length; i++) { c += h[i]; if (c >= a * n) return i; } return 0; };
  return { n, cx: sx / n, cy: sy / n, x0: q(cc, 0.02), x1: q(cc, 0.98), y0: q(rc, 0.02), y1: q(rc, 0.98), h: n ? (q(rc, 0.98) - q(rc, 0.02) + 1) / H : 0 };
}

/* ── moves: P2 settle, P3 overshoot, P4 anticipation; raw for P1 P7 P9 ── */
const win = (m, j) => { const nx = (MV.find((x, q) => q > j && x.t0 > m.t0 + 0.05) || { t0: dur + 9 }).t0, i0 = Math.round(m.t0 * fps), lo = Math.max(0, gi(i0 - 10)), hi = Math.min(N - 1, gi(Math.min(Math.round(m.t1 * fps) + Math.round(1.5 * fps), Math.round(nx * fps) - 1))), idx = []; for (let i = lo; i <= hi; i += S) idx.push(i); return idx; };
function moveMetrics(m, j, D) {
  const idx = win(m, j); if (idx.length < 5) return { id: m.id, skip: 1 };
  const fr = idx.map(F), n = fr.length, ex = new Uint8Array(W * H), Rg = new Uint8Array(W * H); let nR = 0; for (const i of idx) fill(ex, boxes(D, i, 1 / 3, 4));
  for (let p = 0; p < W * H; p++) if (!ex[p] && Math.abs(fr[0].g[p] - fr[n - 1].g[p]) > 12) { Rg[p] = 1; nR++; }   // R = pixels this move changed, text left out
  if (nR < 20) return { id: m.id, t0: m.t0, t1: m.t1, static: 1 };
  const en = fr.slice(0, -1).map((f, k) => { let s = 0, c = 0, nu = 0, de = 0; const g = fr[k + 1].g; for (let p = 0; p < W * H; p++) if (Rg[p]) { const d = Math.abs(f.g[p] - g[p]); s += d; if (d > 12) c++; nu += d; de += Math.abs(f.g[Math.min(W * H - 1, p + 1)] - f.g[Math.max(0, p - 1)]) / 2 + Math.abs(f.g[Math.min(W * H - 1, p + W)] - f.g[Math.max(0, p - W)]) / 2; } return { e: s / nR, mv: c / (W * H) >= 0.002 * S, sp: de ? (nu / de) * 6 * fps / S : 0 }; });
  const fl = med(en.map((x) => x.e).sort((x, y) => x - y).slice(0, Math.max(1, en.length >> 3))); let kl = -1, tot = 0, cum = 0, kon = -1, k98 = -1; en.forEach((x, k) => { if (x.mv) kl = k; }); for (let k = 0; k <= kl; k++) tot += Math.max(0, en[k].e - fl);
  for (let k = 0; k <= kl; k++) { cum += Math.max(0, en[k].e - fl); if (kon < 0 && cum >= 0.02 * tot) kon = k; if (k98 < 0 && cum >= 0.98 * tot) k98 = k; }   // fallback when no trace: 98 % of the motion mass
  const e3 = (a) => med(a.slice(-3)), pick = (acc) => { const T = fr.map((f) => subject(f, ex, acc)), tv = (k) => Math.abs(e3(T.map((f) => f[k])) - T[0][k]); let ft = 'cx', best = -1; for (const k of ['x0', 'x1', 'y0', 'y1']) if (tv(k) > best) { best = tv(k); ft = k; }
    const c = tv('cx') >= tv('cy') ? 'cx' : 'cy'; if (tv(c) >= 0.5 * best) { ft = c; best = tv(c); } return { T, ft, tr: best, ok: T[0].n >= 30 && T[n - 1].n >= 30 && best >= 3 }; };   // the centroid unless an edge travels twice as far
  let sub = pick(true), acc = true; if (!sub.ok) { sub = pick(false); acc = false; }
  const { T, ft, tr } = sub, ax = T.map((f) => f[ft]), dir = Math.sign(e3(ax) - ax[0]), ok = sub.ok, q = ok ? ax.map((v) => (dir * (v - ax[0])) / tr) : [], nE = T[n - 1].n;
  const kq = ok ? q.findIndex((p, k) => k >= 1 && p >= 0.98) : -1, ko = ok ? q.findIndex((p) => p >= 0.02) : -1; if (kq >= 0) { k98 = kq - 1; kon = ko; }
  let kr = k98; if (k98 >= 0) for (let k = k98 + 1; k < en.length; k++) { if (en[k].mv) kr = k; else if (k - kr > Math.max(1, Math.round(3 / S))) break; }   // motion after 98 % ends at the first quiet gap (4 frames)
  const good = (ref) => (k) => T[k].n >= 0.75 * ref && T[k].n <= 1.33 * ref; let os = null, ant = null;
  if (kq >= 0) { const ks = q.map((_, k) => k).filter((k) => k >= kq && good(nE)(k)); if (ks.length >= 3) os = Math.max(0, ...ks.map((k) => q[k] - 1)); }
  if (ko > 0) { const c = q.map((p, k) => [-p, k]).filter(([, k]) => k < ko && good(T[0].n)(k)).map((x) => x[0]).sort((a, b) => b - a); if (c.length >= 3) ant = Math.max(0, c[S > 1 ? 1 : 2]); }   // sustained: the 3rd largest counter-move frame
  const cA = Math.abs(e3(T.map((f) => f.cx)) - T[0].cx) >= Math.abs(e3(T.map((f) => f.cy)) - T[0].cy) ? 'cx' : 'cy', sc = ok ? T.slice(1).map((f, k) => Math.abs(f[cA] - T[k][cA]) * 6 * fps / S || 0) : [];
  const sm = (a, k) => mean(a.slice(Math.max(0, k - 1), k + 2)), v = en.map((x, k) => Math.max(sm(en.map((y) => y.sp), k), sc.length ? sm(sc, k) : 0)), kp = v.indexOf(Math.max(...v)), run = v.slice(Math.max(kon, 0), kr + 1), tail = run.slice(Math.floor(run.length * 0.8));
  return { id: m.id, t0: m.t0, t1: m.t1, hero: nR / (W * H) >= 0.03 && !ARR.test(docs[m.id + 'T0'] || ''), changedPct: R((nR / (W * H)) * 100, 1), trace: ok ? (acc ? 'accent ' : 'data ') + ft : 'energy', travelPx: ok ? R(tr * 6, 0) : null, axis: /x/.test(ft) ? 'x' : 'y',
    onset: kon < 0 ? null : ts(idx[kon]), t98: k98 < 0 ? null : ts(idx[k98 + 1]), lastMotion: k98 < 0 ? null : ts(idx[kr + 1]), settleS: k98 < 0 ? null : R((idx[kr + 1] - idx[k98 + 1]) / fps), windowCut: k98 >= 0 && kr + 1 >= n - 2, overshoot: R(os, 3), anticipation: R(ant, 3),
    peakPxS: R(v[kp], 0), peakShare: kon >= 0 && k98 > kon ? R((kp - kon) / (k98 - kon), 2) : null, ramp: tail.length ? R(v[kp] / Math.max(mean(tail), 30), 1) : null, kp: idx[kp], rest: idx[0] };
}
function moveProps(MM) {
  const hero = MM.filter((m) => m.hero && m.settleS != null), sp = hero.filter((m) => m.trace !== 'energy'), ok4 = hero.filter((m) => m.settleS >= 0.4);
  prop(2, { star: 1, method: 'script', bar: '98 % of travel to pixel diff < 0.2 % in >= 0.4 s on >= 60 % of hero moves (0.4-0.8 s)', measure: { heroMoves: hero.length, atLeast04: ok4.length, in04to08: hero.filter((m) => m.settleS >= 0.4 && m.settleS <= 0.8).length, medianS: med(hero.map((m) => m.settleS)) }, score: hero.length ? (ok4.length >= 0.6 * hero.length ? 1 : 0) : null, evidence: hero.map((m) => `${m.id} ${m.t98}->${m.lastMotion}s = ${m.settleS}${m.windowCut ? ' (window cut)' : ''}`) });
  const os = sp.filter((m) => m.overshoot != null), inB = os.filter((m) => m.overshoot >= 0.005 && m.overshoot <= 0.05), an = sp.filter((m) => m.anticipation != null), a1 = an.filter((m) => m.anticipation >= 0.01 && m.anticipation <= 0.05);
  prop(3, { method: 'script', bar: '0.5-4 % of travel on >= 50 % of traceable moves (5 % tolerance), none over 8 %', measure: { traced: os.length, inBand: inB.length, over8: os.filter((m) => m.overshoot > 0.08).length }, score: os.length ? (inB.length >= 0.5 * os.length && !os.some((m) => m.overshoot > 0.08) ? 1 : 0) : null, evidence: os.map((m) => `${m.id} ${pct(m.overshoot)} % of ${m.travelPx} px`) });
  prop(4, { method: 'script', bar: '1-3 % counter-move over >= 3 frames before >= 50 % of hero moves (5 % tolerance)', measure: { traced: an.length, inBand: a1.length, over5: an.filter((m) => m.anticipation > 0.05).length }, score: an.length ? (a1.length >= 0.5 * an.length ? 1 : 0) : null, evidence: an.map((m) => `${m.id} ${pct(m.anticipation)} %`) });
  const iv = hero.filter((m) => m.onset != null && m.lastMotion != null), ov = []; iv.forEach((a, q) => iv.slice(q + 1).forEach((b) => { const x = Math.min(a.lastMotion, b.lastMotion) - Math.max(a.onset, b.onset); if (x > 0.05) ov.push(`${a.id}+${b.id} ${R(x)}s`); }));
  prop(1, { star: 1, method: 'reader', raw: hero.map((m) => ({ id: m.id, peakShare: m.peakShare, peakPxS: m.peakPxS })) }); prop(7, { star: 1, method: 'reader', raw: { heroMoves: iv.length, overlaps: ov } });
  prop(9, { method: 'reader', raw: hero.filter((m) => m.ramp).map((m) => ({ id: m.id, peakOverTail: m.ramp })) });
}

/* ── whole film (mp4): P8 hard cuts, P11 gaps ── */
function scan() {   // s[i] = mean |luma diff| from frame i-1 to i (320 x 180); sh[i] = share > 12/255 at 160 x 90
  const s = new Float32Array(N), sh = new Float32Array(N), b = Buffer.alloc(FS), l = new Float32Array(W * H), g = new Float32Array(W * H / 4); let pl = new Float32Array(W * H), pg = new Float32Array(W * H / 4);
  for (let i = 0; i < N; i++) {
    fs.readSync(rawFd, b, 0, FS, i * FS); for (let p = 0; p < W * H; p++) l[p] = 0.2126 * b[3 * p] + 0.7152 * b[3 * p + 1] + 0.0722 * b[3 * p + 2];
    for (let y = 0; y < H / 2; y++) for (let x = 0; x < W / 2; x++) { const p = 2 * y * W + 2 * x; g[y * W / 2 + x] = (l[p] + l[p + 1] + l[p + W] + l[p + W + 1]) / 4; }
    if (i) { let a = 0, c = 0; for (let p = 0; p < W * H; p++) a += Math.abs(l[p] - pl[p]); for (let p = 0; p < W * H / 4; p++) if (Math.abs(g[p] - pg[p]) > 12) c++; s[i] = a / (W * H); sh[i] = c / (W * H / 4); }
    [pl, pg] = [l.slice(), g.slice()];
  }
  return { s, sh };
}
function cutProps(sc) {
  const J = new Set((film.chapters || []).map((c) => +c.t0).filter((t) => t > 0.5)); for (const t of film.cuts || []) J.add(+t); for (const [n, v] of Object.entries(kn)) if (/Cut$/.test(n) && num(v) && v > 0.5 && v < dur) J.add(v);
  const js = [...J].sort((a, b) => a - b).filter((t, q, a) => !q || t - a[q - 1] > 0.25), sp = [], d = (a, b) => { let c = 0; for (let p = 0; p < W * H; p++) c += Math.abs(F(a).g[p] - F(b).g[p]); return c / (W * H); };
  if (sc) { for (let i = 3; i < N - 2; i++) if (sc.s[i] >= 6 && sc.s[i] >= 2.5 * Math.max(sc.s[i - 1], sc.s[i + 1], 0.8 * sc.s[i - 2], 0.8 * sc.s[i + 2])) sp.push(i); }
  else for (const t of js) { const j = gi(Math.round(t * fps)), q = [d(j - 2 * S, j - S), d(j - S, j), d(j, j + S), d(j + S, j + 2 * S)]; if ((q[1] >= 6 && q[1] >= 2.5 * Math.max(q[0], q[2])) || (q[2] >= 6 && q[2] >= 2.5 * Math.max(q[1], q[3]))) sp.push(j); }
  const near = (t) => sp.some((i) => Math.abs(i / fps - t) <= 0.25), joins = js.map((t) => ({ t: R(t), hard: near(t) })), hard = joins.filter((x) => x.hard).map((x) => x.t), glitch = sp.filter((i) => !js.some((t) => Math.abs(i / fps - t) <= 0.25)).map((i) => R(i / fps)), m20 = Math.max(0, ...hard.map((t) => hard.filter((u) => u >= t && u < t + 20).length));
  prop(8, { method: 'partial', bar: 'hard cuts <= 1 per 20 s and <= 30 % of joins (script); >= 70 % of joins carried (reader)', measure: { joins: joins.length, hardJoins: hard.length, maxIn20s: m20, midShotSpikes: glitch, scan: sc ? 'every frame' : 'declared joins only' }, score: m20 > 1 || hard.length > 0.3 * joins.length ? 0 : 1, evidence: joins.map((x) => `${x.hard ? 'HARD' : 'soft'} join ${x.t}s`) });
  if (sc) { const run = []; let on = false; for (let i = 1; i < N; i++) { const m = sc.sh[i] >= 0.002; if (m && !on) run.push([i, i]); if (m) run[run.length - 1][1] = i; on = m; } const gp = run.slice(1).map((r, q) => (r[0] - run[q][1] - 1) / fps);
    prop(11, { method: 'reader', raw: { gaps: gp.length, le03: pct(gp.filter((x) => x <= 0.3).length / gp.length), ge12: pct(gp.filter((x) => x >= 1.2).length / gp.length), medianS: R(med(gp)) } }); }
}

/* ── P13 shot scale, P16 ladder, P18 grain, P21 fast-move legibility ── */
function shotProps(D, times) {
  const seq = [], cls = (h) => (h > 0.5 ? 'macro' : h >= 0.2 ? 'medium' : 'wide');
  for (const i of times) { const ex = new Uint8Array(W * H); fill(ex, boxes(D, i, 1 / 3, 3)); const d = subject(F(i), ex, false); if (d.n >= 30) seq.push({ t: ts(i), h: R(d.h), c: cls(d.h) }); }   // frames without data (a text-only hook) are skipped
  const mins = []; for (let m = 0; m * 60 < dur; m++) { const a = seq.filter((x) => x.t >= m * 60 && x.t < (m + 1) * 60); if (a.length * (MP4 ? 1 : 2) >= 20) mins.push({ minute: m, scales: ['macro', 'medium', 'wide'].filter((c) => a.filter((x) => x.c === c).length * (MP4 ? 1 : 2) >= 3) }); /* a scale needs >= 3 s of the minute: a transit does not count */ }
  let run = 0, mx = 0; seq.forEach((x, q) => { run = q && x.c === seq[q - 1].c ? run + (x.t - seq[q - 1].t) : 0; mx = Math.max(mx, run); });
  prop(13, { method: 'script', bar: '>= 3 scales per minute (macro > 0.5, medium 0.2-0.5, wide < 0.2 of frame height)', measure: { perMinute: mins, longestRunS: R(mx, 0), samples: seq.length }, score: mins.length ? (mins.every((m) => m.scales.length >= 3) ? 1 : 0) : null, evidence: mins.map((m) => `minute ${m.minute}: ${m.scales.join('/')}`).concat(mx > 30 ? [`risk: one scale for ${R(mx, 0)} s`] : []) });
}
async function lumProps(D) {
  const cand = []; for (let i = 5; i < N - 5; i += 3) if (D[i].some((r) => (/^must/.test(r[8] || '') || (!r[8] && r[3] >= 22)) && r[2] >= 0.99 && [i - 4, i + 4].every((j) => D[j].some((q) => q[0] === r[0] && q[2] >= 0.99)))) cand.push(i);
  const n = Math.min(8, cand.length), rows = [];
  for (let k = 0; k < n; k++) {
    const i = cand[Math.floor(((k + 0.5) * cand.length) / n)], px = (await frames(i))[0], L = new Float32Array(1920 * 1080), h = new Uint32Array(16); let low = 0, pk = 0;
    for (let p = 0; p < L.length; p++) { L[p] = luma(px, p); h[Math.min(15, L[p] >> 4)]++; if (L[p] < 5.1) low++; }
    for (const b of boxes(D, i, 2)) for (let y = Math.max(0, b[1] | 0); y < Math.min(1080, b[3]); y++) for (let x = Math.max(0, b[0] | 0); x < Math.min(1920, b[2]); x++) pk = Math.max(pk, L[y * 1920 + x]);
    rows.push({ t: ts(i), bins: h.filter((x) => x >= 0.02 * L.length).length, textPeak: R(pk, 0), floorPct: R((100 * low) / L.length, 4) });
  }
  if (!rows.length) return;
  const st = med(rows.map((r) => r.bins)), pk = Math.max(...rows.map((r) => r.textPeak)), fl = Math.max(...rows.map((r) => r.floorPct));
  prop(16, { method: 'script', bar: '>= 4 surface steps (16-level bins >= 2 % of pixels), text <= 245/255, <= 0.01 % of pixels under 2 % luma', measure: { medianSteps: st, textPeakMax: pk, floorPctMax: fl, shadowRimKnobs: ['lookRim', 'lookShadow'].filter((k) => kn[k] > 0), frames: rows }, score: rows.length ? (st >= 4 && pk <= 245 && fl <= 0.01 ? 1 : 0) : null, evidence: [`steps ${st}, text peak ${pk}, floor ${fl} %`] });
}
async function grainProps() {   // flat 40 x 40 cells (temporal-mean s.d. < 1/255, drift < 1.5) over 13 frames in the 3 longest holds: sigma of the frame difference / sqrt 2
  const ev = [0, dur, ...MV.flatMap((m) => [m.t0, m.t1]), ...CAPS.map((c) => c.t0)].sort((a, b) => a - b), gaps = ev.slice(1).map((t, q) => ({ a: ev[q], b: t })).filter((g) => g.b - g.a >= 1.2).sort((x, y) => y.b - y.a - (x.b - x.a) || x.a - y.a).slice(0, 3), sig = [];
  for (const g of gaps) {
    const i = Math.round(((g.a + g.b) / 2) * fps) - 6, fr = await frames(i, 13), E = [], O = [];
    for (let by = 40; by < 1040; by += 40) for (let bx = 40; bx < 1880; bx += 40) {
      const dd = fr.map((f) => { const a = []; for (let y = 0; y < 40; y += 2) for (let x = 0; x < 40; x += 2) a.push(luma(f, (by + y) * 1920 + bx + x)); return a; }), mi = dd[0].map((_, q) => mean(dd.map((a) => a[q]))), mm = mean(mi);
      if (Math.sqrt(mean(mi.map((v) => (v - mm) ** 2))) >= 1 || Math.max(...dd.map((a) => Math.abs(mean(a) - mean(dd[0])))) >= 1.5) continue;
      const s = (k) => { const d = dd[k + 1].map((v, q) => v - dd[k][q]), m = mean(d); return Math.sqrt(mean(d.map((v) => (v - m) ** 2)) / 2); }; let e = 0, od = 0; for (let k = 0; k < 12; k += 2) { e += s(k) / 6; od += s(k + 1) / 6; } E.push(e); O.push(od);
    }
    if (E.length) sig.push({ t: ts(i), cells: E.length, even: med(E), odd: med(O) });
  }
  const sd = sig.map((x) => (Math.max(x.even, x.odd) / 255) * 100), every = sig.filter((x, q) => sd[q] > 0.05 && Math.min(x.even, x.odd) >= 0.6 * Math.max(x.even, x.odd)).length, m = med(sd);
  prop(18, { method: 'script', bar: 'sigma 1-3 % in a flat patch (0.75 accepted: video coding smooths grain); 2 = new every frame', measure: { windows: sig.length, sigmaPct: sd.map((x) => R(x)), medianPct: R(m), everyFrame: every, banding: 'reader' }, score: sig.length ? (m >= 0.75 && m <= 3 ? (every === sig.length ? 2 : 1) : 0) : null, evidence: sig.map((x, q) => `@${x.t}s ${x.cells} flat cells: sigma ${R(sd[q])} % (even pairs ${R((x.even / 2.55))}, odd ${R(x.odd / 2.55)})`) });
}
const acc = (px, p) => { const x = Math.max(px[3 * p], px[3 * p + 1], px[3 * p + 2]); return x > 110 && x - Math.min(px[3 * p], px[3 * p + 1], px[3 * p + 2]) > 45; };
function runs(px, X) {   // accent runs along the motion axis on every 6th scanline: runs per occupied line; median 20-80 % rise (px) of the first edge on one-run lines
  let n = 0, sc = 0; const soft = [], at = (l, k) => luma(px, X ? l * 1920 + k : k * 1920 + l), U = X ? 1920 : 1080;
  for (let l = 0; l < (X ? 1080 : 1920); l += 6) {
    let r = 0, inside = false, gap = 9, first = -1; for (let u = 0; u < U; u++) { if (acc(px, X ? l * 1920 + u : u * 1920 + l)) { if (!inside && gap >= 2) { r++; if (first < 0) first = u; } inside = true; gap = 0; } else { inside = false; gap++; } }
    if (!r) continue; sc++; n += r;
    if (r === 1 && first > 12 && first < U - 13) { const lo = at(l, first - 12), c = at(l, first + 12) - lo; if (Math.abs(c) > 20) { let a = null, b = null; for (let k = first - 12; k <= first + 12; k++) { const q = (at(l, k) - lo) / c; if (a == null && q >= 0.2) a = k; if (b == null && q >= 0.8) b = k; } if (a != null && b != null) soft.push(b - a); } }
  }
  return { rps: n / Math.max(1, sc), soft: med(soft) };
}
async function ghostProps(MM) {
  const fast = MM.filter((m) => m.hero && m.peakPxS > 300), rows = [];
  for (const m of fast.slice(0, 16)) { const X = m.axis === 'x', d = m.peakPxS / fps, a = runs((await frames(m.kp + 1))[0], X), b = runs((await frames(m.rest))[0], X); rows.push({ id: m.id, pxS: m.peakPxS, pxFrame: R(d, 0), edgeRisePx: R(a.soft, 1), blurred: a.soft >= Math.max(2.5, 0.15 * d), runs: R(a.rps, 1), runsAtRest: R(b.rps, 1), ghosts: a.rps >= 3 && a.rps >= 2 * b.rps }); }
  prop(21, { method: 'script', bar: 'moves > 300 px/s blurred (edge rise >= 15 % of the per-frame step; a 0.35 shutter gives 35 %) and no discrete ghosts (runs >= 2x rest: read the spacing off the crop)', measure: { fastMoves: fast.length, rows }, score: rows.length ? (rows.some((r) => r.ghosts) || rows.filter((r) => r.blurred).length < 0.5 * rows.length ? 0 : 1) : null, evidence: rows.map((r) => `${r.id} ${r.pxS} px/s: edge rise ${r.edgeRisePx} px of ${r.pxFrame} px/frame, runs ${r.runs} vs ${r.runsAtRest}${r.ghosts ? ' GHOSTS' : ''}`) });
}


/* ── run ── */
async function pixels() {
  if (MP4) openRaw();
  const jt = [...(film.chapters || []).map((c) => +c.t0), ...Object.entries(kn).filter(([k]) => /Cut$/.test(k)).map((x) => x[1])], times = []; for (let t = 0.5; t < dur; t += MP4 ? 1 : 2) times.push(Math.min(N - 1, gi(Math.round(t * fps))));
  if (!MP4) { const need = new Set(times); MV.forEach((m, j) => win(m, j).forEach((i) => need.add(i))); for (const t of jt) for (let q = -2; q <= 2; q++) need.add(gi(Math.round(t * fps)) + q * S); await prefetch(need); }
  const MM = MV.map((m, j) => moveMetrics(m, j, D)); moveProps(MM); cutProps(MP4 ? scan() : null); shotProps(D, times); await lumProps(D); await grainProps(); await ghostProps(MM); return MM;
}
const MM = await pixels(); if (rawFd != null) fs.closeSync(rawFd); if (rawFile && !o.keepRaw) fs.rmSync(rawFile, { force: true });
return MM;
}
