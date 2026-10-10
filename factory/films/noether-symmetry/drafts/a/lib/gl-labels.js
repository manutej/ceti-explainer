/* arsenal/patterns/gl-labels · temporally coherent labels for WEBGL scenes (renderer: webgl)
   solve(t, camera, anchors, opts) -> { placements, counts } is a pure function of t:
   1. project every anchor with the same math as p5's worldToScreen (checked against it in the demo: stats().projErr);
   2. occlusion by an ANALYTIC occluder list (world AABBs, segment eye -> anchor, slab test), not a depth readback,
      because hysteresis needs the scene at past samples and a readback only sees the frame just drawn;
   3. a deterministic greedy in screen space: order = priority desc, then id order (array index); 24 candidate boxes
      per label (8 directions x 3 leader lengths, fixed preference, NE first); a box must miss placed boxes, placed leaders, anchor dots,
      the reserve rects and the safe margin;
   4. hysteresis without mutable state: the greedy is re-run at a fixed grid of past samples (k / fps, k <= t * fps)
      and each label's visibility and candidate are DEBOUNCED over that window (a value changes only after it has held
      for `hold` samples), so a visible label stays visible unless pushed for >= hold frames and a re-seek returns
      the same frame. The per-sample greedy is memoised by sample index (a cache of a pure function, not state);
   5. a final pass at t places the debounced-visible labels (incumbents only) with their debounced candidate first.
   The travelling callout follows one anchor per schedule segment and HARD CUTS between anchors (no cross-fade; its
   window never crosses a cut). drawGL() draws leaders + text flat in the pack's faces; kit() emits K.ln/K.tx with
   data-role for a kit2 film. No Math.random/Date/frameCount/millis anywhere. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  /* ---------- roles: the three type sizes of the kit (DECISIONS: results never in the smallest face) ---------- */
  const ROLES = {
    result:    { size: 28, fam: 'disp', color: 'accent', data: 'must-read', sub: 'secondary' },
    secondary: { size: 14, fam: 'mono', color: 'ink',    data: 'secondary', sub: 'chrome' },
    chrome:    { size: 12, fam: 'mono', color: 'muted',  data: 'chrome',    sub: 'chrome' },
  };
  const DIRS = [[1, -1], [-1, -1], [1, 1], [-1, 1], [1, 0], [-1, 0], [0, -1], [0, 1]];   // NE first: above-right, off the mark
  const MULT = [1, 2.2, 3.4];
  const DEF = { w: 960, h: 540, fps: 30, hold: 8, window: 0, leader: 20, margin: 14, pad: 3, dot: 3.5, occlusion: true, avoidDots: true,
    reserve: [], occluders: null, near: 1, maxShown: Infinity, callout: null, measure: null };

  /* ---------- camera: {eye, look, up?, fov? (vertical, rad), ortho? (zoom: extent multiplier), aspect?} or a function of t ---------- */
  function camOf(camera, t) {
    let c = typeof camera === 'function' ? camera(t) : camera;
    if (c && c.eyeX != null) c = { eye: [c.eyeX, c.eyeY, c.eyeZ], look: [c.centerX, c.centerY, c.centerZ], up: [c.upX, c.upY, c.upZ], fov: c.cameraFOV, aspect: c.aspectRatio };   // a p5.Camera (static)
    return c;
  }
  function basis(c) {
    const z = nrm(sub(c.eye, c.look)), x = nrm(cross(c.up || [0, 1, 0], z)), y = cross(z, x);
    return { z, x, y };
  }
  /* screen point in sheet units (origin top-left, y down), as p5's worldToScreen returns under this camera and an identity model matrix */
  function projector(c, W, H) {
    const B = basis(c), asp = c.aspect || W / H;
    if (c.ortho != null) {
      const s = c.ortho || 1;
      return (P) => { const r = sub(P, c.eye), xc = dot(r, B.x), yc = dot(r, B.y), d = -dot(r, B.z); return [(1 + xc / (W / 2 * s)) / 2 * W, (1 + yc / (H / 2 * s)) / 2 * H, d]; };
    }
    const f = 1 / Math.tan((c.fov || 0.8) / 2);
    return (P) => { const r = sub(P, c.eye), xc = dot(r, B.x), yc = dot(r, B.y), d = -dot(r, B.z); return d <= 1e-6 ? [NaN, NaN, d] : [(1 + f / asp * xc / d) / 2 * W, (1 + f * yc / d) / 2 * H, d]; };
  }
  /* segment from the viewer to P against axis-aligned boxes {min:[x,y,z], max:[x,y,z]} (perspective: from the eye; ortho: from the image plane) */
  function occludedBy(c, B, P, occ) {
    const o = c.ortho != null ? (() => { const d = -dot(sub(P, c.eye), B.z); return [P[0] + B.z[0] * d, P[1] + B.z[1] * d, P[2] + B.z[2] * d]; })() : c.eye;
    const dv = sub(P, o);
    for (let i = 0; i < occ.length; i++) {
      const b = occ[i]; let t0 = 0, t1 = 1 - 1e-3, hit = true;
      for (let a = 0; a < 3; a++) {
        if (Math.abs(dv[a]) < 1e-12) { if (o[a] < b.min[a] || o[a] > b.max[a]) { hit = false; break; } continue; }
        let u0 = (b.min[a] - o[a]) / dv[a], u1 = (b.max[a] - o[a]) / dv[a]; if (u0 > u1) { const s = u0; u0 = u1; u1 = s; }
        if (u0 > t0) t0 = u0; if (u1 < t1) t1 = u1; if (t0 > t1) { hit = false; break; }
      }
      if (hit) return i;
    }
    return -1;
  }

  /* ---------- label geometry ---------- */
  function styleOf(a, o) {
    const r = ROLES[a.role] || ROLES.secondary, rs = ROLES[r.sub];
    const size = Math.max(r.size, a.size || 0), fam = a.fam || r.fam;
    const m = o.measure || ((s, z, f) => s.length * z * (f === 'disp' ? 0.46 : 0.6));
    const w1 = m(String(a.text), size, fam), w2 = a.sub ? m(String(a.sub), rs.size, rs.fam) : 0;
    const cap = size * (fam === 'disp' ? 0.74 : 0.72), h2 = a.sub ? rs.size * 1.25 : 0, p = o.pad;
    return { size, fam, color: a.color || r.color, dataRole: r.data, subSize: rs.size, subFam: rs.fam, subDataRole: rs.data,
      w: Math.max(w1, w2) + 2 * p, h: cap + h2 + 2 * p, cap, p };
  }
  function candBox(ax, ay, s, c, L) {
    const d = DIRS[c % 8], m = MULT[Math.floor(c / 8)], k = d[0] && d[1] ? 0.72 : 1, ex = ax + d[0] * L * m * k, ey = ay + d[1] * L * m * k;
    const x0 = d[0] > 0 ? ex : d[0] < 0 ? ex - s.w : ex - s.w / 2, y0 = d[1] > 0 ? ey : d[1] < 0 ? ey - s.h : ey - s.h / 2;
    return { x0, y0, x1: x0 + s.w, y1: y0 + s.h, ex, ey };
  }
  const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
  const free = (b, occ) => { for (let i = 0; i < occ.length; i++) if (hit(b, occ[i])) return false; return true; };
  /* segment vs rect (Liang-Barsky): a leader may not run through a placed box, and a box may not sit on a placed leader */
  function segHit(x0, y0, x1, y1, r) {
    let u0 = 0, u1 = 1; const dx = x1 - x0, dy = y1 - y0;
    for (const [pp, q] of [[-dx, x0 - r.x0], [dx, r.x1 - x0], [-dy, y0 - r.y0], [dy, r.y1 - y0]]) {
      if (Math.abs(pp) < 1e-12) { if (q < 0) return false; continue; }
      const u = q / pp; if (pp < 0) { if (u > u1) return false; if (u > u0) u0 = u; } else { if (u < u0) return false; if (u < u1) u1 = u; }
    }
    return u0 < u1;
  }
  const leadFree = (ax, ay, b, occ, from, leads) => {
    for (let i = from; i < occ.length; i++) if (segHit(ax, ay, b.ex, b.ey, occ[i])) return false;
    for (let i = 0; i < leads.length; i++) if (segHit(leads[i][0], leads[i][1], leads[i][2], leads[i][3], b)) return false;
    return true;
  };

  /* ---------- one sample: project, cull, occlude, greedy (fixed order) ---------- */
  function frame(t, camera, anchors, o) {
    const c = camOf(camera, t), W = o.w, H = o.h, pr = projector(c, W, H), B = basis(c);
    const list = typeof anchors === 'function' ? anchors(t) : anchors, n = list.length, P = new Array(n);
    for (let i = 0; i < n; i++) {
      const a = list[i], q = pr([a.x, a.y, a.z]);
      const off = !(q[2] > o.near) || !(q[0] >= 0 && q[0] <= W && q[1] >= 0 && q[1] <= H);
      const oc = !off && o.occlusion && o.occluders && o.occluders.length ? occludedBy(c, B, [a.x, a.y, a.z], o.occluders) : -1;
      P[i] = { i, a, x: q[0], y: q[1], depth: q[2], off, occ: oc >= 0, occBy: oc };
    }
    return { t, c, P };
  }
  function calloutAt(t, o) {
    const S = o.callout && o.callout.schedule; if (!S || !S.length) return null;
    let j = -1; for (let i = 0; i < S.length; i++) if (S[i].t <= t + 1e-9) j = i;
    if (j < 0) return null;
    const e = S[j]; return e.id == null ? null : { seg: j, t0: e.t, id: e.id, text: e.text, sub: e.sub, role: e.role || 'result', size: e.size || o.callout.size || 32, color: e.color || o.callout.color };
  }
  function makeOcc(o) {
    const M = o.margin, occ = [{ x0: -1e5, y0: -1e5, x1: 1e5, y1: M }, { x0: -1e5, y0: o.h - M, x1: 1e5, y1: 1e5 }, { x0: -1e5, y0: -1e5, x1: M, y1: 1e5 }, { x0: o.w - M, y0: -1e5, x1: 1e5, y1: 1e5 }];
    for (const r of o.reserve || []) occ.push({ x0: r[0], y0: r[1], x1: r[2], y1: r[3] });
    return occ;
  }
  const dotBox = (x, y, r) => ({ x0: x - r, y0: y - r, x1: x + r, y1: y + r });

  /* greedy over `order` (indices); prefs(i) -> candidate list; force(i) -> place even if blocked */
  function greedy(F, order, o, styles, prefs, force, L, extraOcc) {
    const occ = makeOcc(o).concat(extraOcc || []), res = new Map(), r = o.dot + 1, leads = [], NM = 4 + (o.reserve || []).length;
    let shown = 0;
    for (const i of order) {
      const q = F.P[i], s = styles[i];
      if (shown >= o.maxShown) { res.set(i, { placed: false, why: 'cap' }); continue; }
      const db = dotBox(q.x, q.y, r);
      if (!free(db, occ) && !force(i)) { res.set(i, { placed: false, why: 'dot' }); continue; }
      let got = -1, bx = null;
      for (const c of prefs(i)) { const b = candBox(q.x, q.y, s, c, L(i)); if (free(b, occ) && !hit(b, db) && leadFree(q.x, q.y, b, occ, NM, leads)) { got = c; bx = b; break; } }
      let overlap = false;
      if (got < 0) { if (!force(i)) { res.set(i, { placed: false, why: 'blocked' }); continue; } got = prefs(i)[0]; bx = candBox(q.x, q.y, s, got, L(i)); overlap = true; }
      occ.push(bx); if (o.avoidDots) occ.push(db); leads.push([q.x, q.y, bx.ex, bx.ey]); shown++;
      res.set(i, { placed: true, c: got, box: bx, overlap });
    }
    return res;
  }
  const PREF = Array.from({ length: DIRS.length * MULT.length }, (_, i) => i);
  function orderOf(F, idx) {
    return idx.slice().sort((a, b) => (F.P[b].a.priority || 0) - (F.P[a].a.priority || 0) || a - b);
  }

  /* raw sample k: fixed-order greedy, callout (if any) first. Returns per-index {ok, c} and the callout's {ok, c} */
  function rawSample(k, camera, anchors, o, styles, coStyle, prev) {
    const t = k / o.fps, F = frame(t, camera, anchors, o), n = F.P.length, co = calloutAt(t, o);
    const coIdx = co ? F.P.findIndex((q) => q.a.id === co.id) : -1;
    let extra = [], coRes = null;
    if (coIdx >= 0 && !F.P[coIdx].off) {
      const st = coStyle(co, F.P[coIdx].a), sty = styles.slice(); sty[coIdx] = st;
      const pc = prev && prev.co && prev.co.seg === co.seg ? prev.co.c : -1;   // sticky within a segment; a cut starts canonical
      const r = greedy(F, [coIdx], o, sty, () => stick(pc), () => true, () => (o.callout.leader || 52), []).get(coIdx);
      coRes = { ok: true, c: r.c, seg: co.seg }; extra = [r.box, dotBox(F.P[coIdx].x, F.P[coIdx].y, o.dot + 1)];
    }
    const idx = []; for (let i = 0; i < n; i++) if (i !== coIdx && !F.P[i].off && !F.P[i].occ) idx.push(i);
    const g = greedy(F, orderOf(F, idx), o, styles, (i) => stick(prev ? prev.cs[i] : -1), () => false, () => o.leader, extra);
    const ok = new Uint8Array(n), cs = new Int8Array(n).fill(-1), why = new Array(n);
    for (let i = 0; i < n; i++) { const q = F.P[i]; why[i] = i === coIdx ? 'callout' : q.off ? 'off' : q.occ ? 'occluded' : 'blocked'; }
    for (const [i, r] of g) { if (r.placed) { ok[i] = 1; cs[i] = r.c; why[i] = 'shown'; } else why[i] = r.why === 'dot' ? 'blocked' : r.why; }
    return { ok, cs, why, co: coRes };
  }

  /* exact Schmitt debounce over the whole clip (chain mode: every sample <= k0 is already memoised): the value of the newest run of raw
     visibility that held >= hold samples; the run touching k = 0 counts. Pure of t, so no re-seek can change it. */
  function schmitt(i, k0, hold, get) {
    let k = k0, v = get(k).ok[i];
    for (;;) {
      let len = 0; while (k >= 0 && get(k).ok[i] === v) { len++; k--; }
      if (len >= hold || k < 0) return v;
      v = get(k).ok[i];
    }
  }
  const STICK = PREF.map((c) => [c].concat(PREF.filter((x) => x !== c)));
  const stick = (c) => (c >= 0 ? STICK[c] : PREF);
  /* debounce, newest first: the value of the newest run that held >= hold samples; a run that reaches the start of the clip counts */
  function debounce(vals, hold, reachesStart, fallback) {
    let i = 0; const n = vals.length;
    while (i < n) {
      let j = i; while (j < n && vals[j] === vals[i]) j++;
      if (j - i >= hold || (j === n && reachesStart)) return vals[i];
      i = j;
    }
    return fallback;   // contested for the whole window: hidden (visibility) / canonical (candidate)
  }

  /* ---------- memo: per (anchors, camera, options) the raw samples by index; pure (a cache of a deterministic function) ---------- */
  const MEMO = new WeakMap();
  function memoFor(anchors, camera, o) {
    let m1 = MEMO.get(anchors); if (!m1) MEMO.set(anchors, (m1 = new WeakMap()));
    const ck = typeof camera === 'object' || typeof camera === 'function' ? camera : null;
    let m2 = ck ? m1.get(ck) : null; if (!m2) { m2 = new Map(); if (ck) m1.set(ck, m2); }
    const key = JSON.stringify([o.w, o.h, o.fps, o.leader, o.margin, o.pad, o.dot, o.occlusion, o.avoidDots, o.reserve, o.near, o.maxShown, o.callout, o.sticky, o.occluders ? o.occluders.length : 0, o.measureKey || '']);
    let m3 = m2.get(key); if (!m3) { m3 = new Map(); m2.set(key, m3); }
    if (m3.size > 40000) m3.clear();
    return m3;
  }

  function solve(t, camera, anchors, opts) {
    const o = Object.assign({}, DEF, opts || {}), list0 = typeof anchors === 'function' ? anchors(t) : anchors, n = list0.length;
    const styles = list0.map((a) => styleOf(a, o));
    const coStyle = (co, a) => styleOf({ text: co.text != null ? co.text : a.text, sub: co.sub != null ? co.sub : a.sub, role: co.role, size: co.size, color: co.color }, o);
    const hold = Math.max(0, o.hold | 0), M = o.window || Math.max(1, 4 * hold), memo = memoFor(anchors, camera, o), chain = o.sticky !== 'window';
    const k0 = Math.floor(t * o.fps + 1e-6), co = calloutAt(t, o);
    // raw(k): the fixed-order greedy at sample k. sticky 'chain' (default): each sample prefers the candidate of sample k-1, a deterministic
    // recursion from k = 0 (memoised, so a cold seek to t costs t * fps greedies once). sticky 'window': no recursion, canonical preference.
    const raw = (k) => {
      let r = memo.get(k); if (r) return r;
      if (!chain) { r = rawSample(k, camera, anchors, o, styles, coStyle, null); memo.set(k, r); return r; }
      let j = k; while (j > 0 && !memo.has(j - 1)) j--;
      for (let m = j; m <= k; m++) memo.set(m, rawSample(m, camera, anchors, o, styles, coStyle, m > 0 ? memo.get(m - 1) : null));
      return memo.get(k);
    };
    // window of samples, newest first, clipped at 0 and (for the callout) at its cut
    const ks = []; for (let k = k0; k > k0 - M && k >= 0; k--) ks.push(k);
    const reachesStart = ks[ks.length - 1] === 0;
    const R = hold ? ks.map(raw) : [raw(k0)];
    const vis = new Uint8Array(n), cand = new Int8Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      if (chain && hold) { vis[i] = schmitt(i, k0, hold, (k) => memo.get(k) || raw(k)); }   // exact: walk back until a run held >= hold
      else { const v = R.map((r) => r.ok[i]); vis[i] = hold ? debounce(v, hold, reachesStart, 0) : v[0]; }
      const cs = R.map((r) => r.cs[i]).filter((c) => c >= 0); cand[i] = cs.length ? (chain || !hold ? cs[0] : debounce(cs, hold, true, cs[0])) : 0;
    }
    // final pass at t: the callout first (hard cut: its candidate is debounced only within its own segment), then the incumbents
    const F = frame(t, camera, anchors, o), out = [], extra = [];
    let coIdx = -1;
    if (co) {
      coIdx = F.P.findIndex((q) => q.a.id === co.id);
      if (coIdx >= 0 && !F.P[coIdx].off) {
        const kc = Math.ceil(co.t0 * o.fps - 1e-6), seg = R.filter((r, j) => ks[j] >= kc && r.co && r.co.seg === co.seg).map((r) => r.co.c);
        const c0 = seg.length ? seg[0] : 0, st = coStyle(co, F.P[coIdx].a), sty = styles.slice(); sty[coIdx] = st;
        const r = greedy(F, [coIdx], o, sty, () => [c0].concat(PREF.filter((c) => c !== c0)), () => true, () => (o.callout.leader || 52), []).get(coIdx);
        extra.push(r.box, dotBox(F.P[coIdx].x, F.P[coIdx].y, o.dot + 1));
        out.push(place(F.P[coIdx], st, r, true, co));
      } else coIdx = -1;
    }
    const inc = []; for (let i = 0; i < n; i++) if (i !== coIdx && vis[i] && !F.P[i].off && (!co || F.P[i].a.id !== co.id)) inc.push(i);
    const g = greedy(F, orderOf(F, inc), o, styles, (i) => [cand[i]].concat(PREF.filter((c) => c !== cand[i])), () => true, () => o.leader, extra);
    const placed = []; for (const i of orderOf(F, inc)) { const r = g.get(i); if (r && r.placed) placed.push(place(F.P[i], styles[i], r, false, null)); }
    out.splice(0, 0, ...placed.reverse());   // draw order: lowest priority up, the callout last, so a result is never under a grace label
    // counts (a film captions these; count before ratio)
    const last = raw(k0), cnt = { total: n, onscreen: 0, occluded: 0, shown: out.length, crowded: 0, overlap: out.filter((q) => q.overlap).length, callout: co && coIdx >= 0 ? co.id : null };
    for (let i = 0; i < n; i++) { const q = F.P[i]; if (q.off) continue; cnt.onscreen++; if (q.occ) cnt.occluded++; }
    cnt.crowded = Math.max(0, cnt.onscreen - cnt.occluded - cnt.shown);
    return { t, placements: out, counts: cnt, why: last.why };
  }
  function place(q, s, r, isCallout, co) {
    const a = q.a, b = r.box, d = DIRS[r.c % 8], right = d[0] < 0;
    const text = isCallout && co.text != null ? co.text : a.text, sb = isCallout && co.sub != null ? co.sub : a.sub;
    const tx = right ? b.x1 - s.p : d[0] === 0 ? (b.x0 + b.x1) / 2 : b.x0 + s.p, align = right ? 'right' : d[0] === 0 ? 'center' : 'left';
    return { id: a.id, text: String(text), sub: sb != null ? String(sb) : null, role: isCallout ? co.role : (a.role || 'secondary'),
      dataRole: s.dataRole, subDataRole: s.subDataRole, size: s.size, fam: s.fam, subSize: s.subSize, subFam: s.subFam, color: s.color,
      ax: q.x, ay: q.y, depth: q.depth, occluded: q.occ, box: [b.x0, b.y0, b.x1, b.y1], lead: [q.x, q.y, b.ex, b.ey], cand: r.c,
      tx, ty: b.y0 + s.p + s.cap, sy: b.y0 + s.p + s.cap + s.subSize * 1.15, align, overlap: !!r.overlap, callout: !!isCallout };
  }

  /* ---------- drawing: flat, after the scene, under p5's default camera (1 unit = 1 sheet unit at z = 0) ---------- */
  function drawGL(p, placements, tk, fonts, hud, look) {
    look = Object.assign({ plate: 0.78, leadW: 1.25 }, look || {});
    p.push(); p.resetMatrix(); p.resetShader(); p.noLights(); if (hud) p.setCamera(hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    const ox = -p.width / 2, oy = -p.height / 2, col = (r) => tk.color[r] || tk.color.ink;
    for (const q of placements) {
      const c = p.color(col(q.color));
      if (look.plate > 0) { const pc = p.color(tk.color.bg); pc.setAlpha(255 * look.plate); p.noStroke(); p.fill(pc); p.rect(q.box[0] + ox, q.box[1] + oy, q.box[2] - q.box[0], q.box[3] - q.box[1]); }
      p.stroke(c); p.strokeWeight(q.callout ? 1.6 : look.leadW); p.line(q.lead[0] + ox, q.lead[1] + oy, q.lead[2] + ox, q.lead[3] + oy);
      p.noStroke(); p.fill(c); p.circle(q.ax + ox, q.ay + oy, q.callout ? 8 : 6);
      if (q.occluded && q.callout) { p.fill(tk.color.bg); p.circle(q.ax + ox, q.ay + oy, 4); }   // hollow dot: the anchor is behind a mark
      text(p, q.text, q.tx, q.ty, q.size, c, fonts[q.fam] || fonts.disp, q.align, ox, oy);
      if (q.sub) text(p, q.sub, q.tx, q.sy, q.subSize, p.color(tk.color.muted), fonts[q.subFam] || fonts.mono, q.align, ox, oy);
    }
    p.pop();
  }
  function text(p, s, x, y, size, c, font, al, ox, oy) {
    if (!font) return; p.noStroke(); p.fill(c); p.textFont(font); p.textSize(size); p.textAlign(p.LEFT, p.BASELINE);
    const w = p.textWidth(s), x0 = al === 'right' ? x - w : al === 'center' ? x - w / 2 : x; p.text(s, x0 + ox, y + oy, 2000);
  }
  /* kit2: placements -> SVG (data-role carried); K.ln / K.tx are the kit's facade (layer 'labels' is a film layer) */
  function kit(K, placements, layer) {
    layer = layer || 'labels'; const C = K.ROLES || {};
    placements.forEach((q, j) => {
      const key = 'gll.' + q.id + (q.callout ? '.co' : '');
      K.ln(key + '.l', layer, q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: C[q.color] || C.ink, w: q.callout ? 1.6 : 1.25 });
      K.tx(key + '.t', layer, q.tx, q.ty, q.text, { fam: q.fam, size: q.size, anchor: q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start', fill: C[q.color] || C.ink, role: q.dataRole });
      if (q.sub) K.tx(key + '.s', layer, q.tx, q.sy, q.sub, { fam: q.subFam, size: q.subSize, anchor: q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start', fill: C.muted, role: q.subDataRole });
    });
  }

  /* ---------- the demo scene: a seeded box field (data = columns), one custom Lambert shader from roles ---------- */
  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN;' +
    'void main(){ vN = aNormal; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
  const FRAG = 'precision highp float; varying vec3 vN; uniform vec3 uColor; uniform float uAmb, uKey; uniform vec3 uKeyDir;' +
    'void main(){ vec3 n = normalize(vN); float l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + 0.12 * max(dot(n, vec3(-0.6, -0.2, 0.7)), 0.0); gl_FragColor = vec4(uColor * l, 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };

  function field(params, seed) {
    if (Array.isArray(params.data)) return params.data.map((d, i) => Object.assign({ i }, d));
    const rng = mulberry32(seed), C = params.cols, Rw = params.rows, cell = params.cell, cols = [];
    const ph = [rng() * 6.28, rng() * 6.28];
    for (let r = 0; r < Rw; r++) for (let c = 0; c < C; c++) {
      const u = c / Math.max(1, C - 1), v = r / Math.max(1, Rw - 1), b = 0.5 + 0.3 * Math.sin(u * 4.4 + ph[0]) * Math.cos(v * 3.6 + ph[1]);
      const val = clamp(b + (rng() - 0.5) * 0.5, 0.05, 1);
      cols.push({ i: cols.length, id: String.fromCharCode(65 + (r % 26)) + (c + 1), x: (c - (C - 1) / 2) * cell, z: (r - (Rw - 1) / 2) * cell, h: params.hmin + val * params.hmax, value: Math.round(val * params.scale) });
    }
    return cols;
  }
  function anchorsOf(cols, params) {
    const by = cols.slice().sort((a, b) => b.value - a.value || a.i - b.i), rank = new Map(by.map((c, j) => [c.i, j + 1]));
    let pick = cols;
    if (params.anchors < cols.length) { const rng = mulberry32(params.pickSeed); pick = cols.map((c) => [rng(), c]).sort((a, b) => a[0] - b[0]).slice(0, params.anchors).map((x) => x[1]).sort((a, b) => a.i - b.i); }
    return pick.map((c) => {
      const rk = rank.get(c.i), res = rk <= params.results;
      return { id: c.id, x: c.x, y: -c.h - 0.5, z: c.z, text: res ? fmt(c.value) : c.id + ' · ' + fmt(c.value), sub: res ? c.id + ' · RANK ' + rk + ' OF ' + cols.length : null,
        role: res ? 'result' : rk > cols.length * params.chromeBelow ? 'chrome' : 'secondary', priority: c.value + (res ? 1e6 : 0), col: c };
    });
  }
  function camFn(params) {
    const K = params.cam;
    return (t) => {
      const u = smooth(clamp(t / params.dur)), a = K.a0 + (K.a1 - K.a0) * u, el = lerp(K.el0, K.el1, u), R = lerp(K.r0, K.r1, u);
      return { eye: [K.look[0] + R * Math.cos(el) * Math.sin(a), K.look[1] - R * Math.sin(el), K.look[2] + R * Math.cos(el) * Math.cos(a)], look: K.look, up: [0, 1, 0], fov: lerp(K.fov0, K.fov1, u) };
    };
  }
  /* measure in the loaded p5 font; memoised by (string, size, face) */
  function measurer(p, fonts) {
    const m = new Map();
    return (s, size, fam) => {
      const k = fam + '|' + size + '|' + s; let w = m.get(k); if (w != null) return w;
      const f = fonts[fam] || fonts.disp; if (!f) return s.length * size * 0.55;
      p.push(); p.textFont(f); p.textSize(size); w = p.textWidth(s); p.pop(); m.set(k, w); return w;
    };
  }
  async function faceFor(p, spec, fallback) {
    const F = window.ARSENAL_FONTS || {}, key = spec ? spec.family + '|' + spec.weight : '', use = F[key] ? key : fallback;
    const cache = (p.__gllFonts = p.__gllFonts || {});
    if (!F[use]) return { font: null, key: null, want: key };
    if (!cache[use]) cache[use] = p.loadFont(F[use]);
    return { font: await cache[use], key: use, want: key };
  }
  function optsOf(st, params) {
    return { w: st.w, h: st.h, fps: params.fps, hold: params.hold, leader: params.leader, occlusion: params.occlusion, occluders: params.occlusion ? st.occ : null,
      reserve: params.reserve, callout: st.callout, maxShown: params.maxShown, measure: st.measure, measureKey: st.fontKey };
  }
  function count(t, st, params) { return solve(t, st.cam, st.anchors, optsOf(st, params)).counts; }

  A.patterns['gl-labels'] = {
    id: 'gl-labels', atlas: ['world-to-screen', 'webgl-mode', 'p5-camera', 'camera-slerp', 'build-geometry', 'p5-shader', 'frontier-2026'],
    renderer: 'webgl',
    ROLES, solve, drawGL, kit, count, project: (cam, W, H) => projector(cam, W, H),
    params: { dur: 12, fps: 30, hold: 8, leader: 20, occlusion: false, maxShown: Infinity, callout: null,
      cols: 12, rows: 8, cell: 34, gap: 8, hmin: 10, hmax: 110, scale: 480, anchors: 30, pickSeed: 5, results: 3, chromeBelow: 2, data: null,
      reserve: [[24, 470, 470, 530]], plate: 0.78, readout: true,
      cam: { a0: 0.35, a1: 0.35 + 5.2, el0: 0.62, el1: 0.5, r0: 760, r1: 700, fov0: 0.72, fov1: 0.72, look: [0, -50, 0] } },
    variants: [
      { name: 'orbit-30', params: {} },
      { name: 'occlusion-200', params: { cols: 20, rows: 10, cell: 26, gap: 6, hmax: 150, anchors: 200, results: 5, chromeBelow: 0.7, occlusion: true,
        cam: { a0: -0.5, a1: 0.9, el0: 0.32, el1: 0.62, r0: 820, r1: 760, fov0: 0.75, fov1: 0.72, look: [0, -60, 0] } } },
      { name: 'callout-travel', params: { cols: 8, rows: 6, cell: 44, gap: 10, hmax: 140, anchors: 14, results: 0, occlusion: true, pickSeed: 9,
        callout: { leader: 56, size: 32, schedule: [{ t: 0, id: 'A1' }, { t: 3, id: 'C5' }, { t: 6, id: 'F8' }, { t: 9, id: 'E2' }] },
        cam: { a0: 2.2, a1: 3.9, el0: 0.5, el1: 0.36, r0: 720, r1: 600, fov0: 0.74, fov1: 0.74, look: [0, -60, 0] } } },
    ],
    async setup(p, ctx, params) {
      const seed = ctx.seed == null ? 7 : ctx.seed, tk = ctx.tokens || (A.brands && A.brands['ceti-dark']);
      const cols = field(params, seed), st = { seed, cols, w: ctx.w || p.width, h: ctx.h || p.height, sh: p.createShader(VERT, FRAG), work: p.createCamera(), hud: p.createCamera(), fontNote: [] };
      st.anchors = anchorsOf(cols, params);
      // callout schedule names grid ids; the callout text is the column's value, its sub the rank (a claim with a source: the data row)
      st.callout = params.callout ? JSON.parse(JSON.stringify(params.callout)) : null;
      if (st.callout) {
        const rank = new Map(cols.slice().sort((a, b) => b.value - a.value || a.i - b.i).map((c, j) => [c.id, j + 1]));
        const byId = new Map(cols.map((c) => [c.id, c]));
        st.anchors = st.anchors.filter((a) => !st.callout.schedule.some((e) => e.id === a.id));
        for (const e of st.callout.schedule) { const c = byId.get(e.id); if (!c) continue; st.anchors.push({ id: c.id, x: c.x, y: -c.h - 0.5, z: c.z, text: c.id + ' · ' + fmt(c.value), role: 'secondary', priority: c.value, col: c });
          e.text = fmt(c.value); e.sub = c.id + ' · RANK ' + rank.get(c.id) + ' OF ' + cols.length; }
      }
      const bw = params.cell - params.gap;
      st.occ = cols.map((c) => ({ min: [c.x - bw / 2, -c.h, c.z - bw / 2], max: [c.x + bw / 2, 0, c.z + bw / 2] }));
      st.geom = p.buildGeometry(() => { p.noStroke(); for (const c of cols) { p.push(); p.translate(c.x, -c.h / 2, c.z); p.box(bw, c.h, bw); p.pop(); } });
      st.bw = bw; st.cam = camFn(params);
      const d = ctx.fonts && ctx.fonts.disp ? { font: ctx.fonts.disp, key: 'ctx' } : await faceFor(p, tk && tk.type.disp, 'Big Shoulders Display|600');
      const m = ctx.fonts && ctx.fonts.mono ? { font: ctx.fonts.mono, key: 'ctx' } : await faceFor(p, tk && tk.type.mono, 'IBM Plex Mono|400');
      st.fonts = { disp: d.font, mono: m.font || d.font };
      if (d.want && d.key !== d.want) st.fontNote.push('disp ' + d.want + ' -> ' + d.key); if (m.want && m.key !== m.want) st.fontNote.push('mono ' + m.want + ' -> ' + m.key);
      st.fontKey = d.key + '/' + m.key; st.measure = measurer(p, st.fonts);
      return st;
    },
    draw(p, t, st, params, tk) {
      const W = st.w, H = st.h, c = st.cam(t), w = st.work;
      if (params.clear !== false) p.background(tk.color.bg);
      w.camera(c.eye[0], c.eye[1], c.eye[2], c.look[0], c.look[1], c.look[2], 0, 1, 0); w.perspective(c.fov, W / H, 8, 8000);
      p.setCamera(w); p.noLights();
      const sol = solve(t, st.cam, st.anchors, optsOf(st, params));
      // scene: the field, the labelled columns lifted in tone, the callout's column in its role colour
      const sh = st.sh, bg = p.color(tk.color.bg); p.shader(sh); p.noStroke();
      sh.setUniform('uAmb', 0.62); sh.setUniform('uKey', 0.42); sh.setUniform('uKeyDir', nrm([-0.35, 0.8, -0.45]));
      sh.setUniform('uColor', rgb(p, p.lerpColor(bg, p.color(tk.color.muted), 0.55))); p.model(st.geom);
      const one = (cc, col) => { sh.setUniform('uColor', rgb(p, col)); p.push(); p.translate(cc.x, -cc.h / 2, cc.z); p.box(st.bw + 1, cc.h + 1, st.bw + 1); p.pop(); };
      for (const q of sol.placements) { const a = st.anchors.find((x) => x.id === q.id); if (a) one(a.col, q.callout ? p.color(tk.color.accent) : p.lerpColor(bg, p.color(tk.color.ink), q.role === 'result' ? 0.62 : 0.4)); }
      sh.setUniform('uColor', rgb(p, p.lerpColor(bg, p.color(tk.color.panel), 0.9))); p.push(); p.translate(0, 1, 0); p.box(3000, 2, 3000); p.pop();
      p.resetShader();
      // labels, flat, in the pack's faces
      drawGL(p, sol.placements, tk, st.fonts, st.hud, { plate: params.plate });
      if (params.readout && st.fonts.disp) {
        const k = sol.counts, ox = -W / 2, oy = -H / 2;
        p.push(); p.resetMatrix(); p.setCamera(st.hud);
        text(p, fmt(k.shown), 36, H - 34, 40, p.color(tk.color.accent), st.fonts.disp, 'left', ox, oy);
        p.textFont(st.fonts.disp); p.textSize(40); const w0 = p.textWidth(fmt(k.shown));
        text(p, 'LABELS SHOWN OF ' + fmt(k.total) + ' ANCHORS', 44 + w0, H - 50, 14, p.color(tk.color.ink), st.fonts.mono, 'left', ox, oy);
        text(p, fmt(k.occluded) + ' BEHIND A COLUMN · ' + fmt(k.crowded) + ' CROWDED OUT · ' + fmt(k.total - k.onscreen) + ' OFF SCREEN', 44 + w0, H - 34, 12, p.color(tk.color.muted), st.fonts.mono, 'left', ox, oy);
        p.pop();
      }
      return sol;
    },
  };
})();
