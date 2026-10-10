/* arsenal/patterns/gl-stack-city · a counts matrix as a city of unit boxes that re-partitions on t (renderer: webgl)
   The simpsons-3d move generalised: groups x categories counts, one seeded box per unit (or per k units), every box
   baked ONCE into one p5.Geometry with two homes (pooled slab, split slab) carried as per-vertex attributes; a role-lit
   vertex shader moves each box from its pooled home to its split home on t (seeded stagger, arc lift), lights hits
   bottom-up and dims categories for the reveal. Layouts: stacked bars (row or grid) and a squarified treemap city.
   LOD: above `budget` boxes, one box stands for k = ceil(units / budget) units (the readout says so).
   Labels are pinned with worldToScreen and drawn flat after the camera is released, in the pack's faces.
   draw(t) is a pure function of t; seeds in setup (mulberry32); no fetch; roles only (no hex). */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const ID = 'gl-stack-city';
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const seg = (u, a, b) => clamp((u - a) / (b - a));
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sum = (a) => a.reduce((x, y) => x + y, 0);
  const MAXP = 12;   // palette / mask uniform array size (groups or categories coloured; categories masked)

  /* Berkeley 1973, six largest departments: applicants and admitted by sex (Bickel, Hammel & O'Connell 1975). */
  const BERKELEY = {
    groups: ['MEN', 'WOMEN'], cats: ['A', 'B', 'C', 'D', 'E', 'F'],
    n: [[825, 560, 325, 417, 191, 373], [108, 25, 593, 375, 393, 341]],
    hit: [[512, 353, 120, 138, 53, 22], [89, 17, 202, 131, 94, 24]],
    unit: 'APPLICANT', units: 'APPLICANTS', hitWord: 'ADMITTED',
    source: 'BICKEL, HAMMEL & O’CONNELL 1975 · SCIENCE 187:398',
  };

  /* illustrative matrix, seeded: lognormal-ish group and category weights, per-category base rate, small group effect */
  function synth(spec, seed) {
    const rng = mulberry32((seed * 2654435761 + (spec.seed || 1)) >>> 0), G = spec.G, C = spec.C;
    const ln = () => Math.exp((rng() + rng() + rng() - 1.5) * (spec.skew || 1.1));
    const wg = Array.from({ length: G }, ln), wc = Array.from({ length: C }, ln);
    const raw = wg.map((a) => wc.map((b) => a * b * (0.45 + rng())));
    const Z = sum(raw.map(sum)), n = raw.map((r) => r.map((x) => Math.max(1, Math.round(spec.total * x / Z))));
    const rc = wc.map(() => 0.12 + 0.7 * rng()), eg = wg.map(() => (rng() - 0.5) * 0.16);
    const hit = spec.hits === false ? null : n.map((r, g) => r.map((x, c) => Math.round(x * clamp(rc[c] + eg[g], 0.03, 0.95))));
    return { groups: wg.map((_, g) => 'G' + (g + 1)), cats: wc.map((_, c) => 'C' + (c + 1)), n, hit,
      unit: spec.unit || 'UNIT', units: spec.units || 'UNITS', hitWord: spec.hitWord || 'HITS', source: 'ILLUSTRATIVE · SEEDED MATRIX (seed ' + seed + ')' };
  }
  function resolveData(d, seed) {
    if (!d) return BERKELEY;
    if (d.synth) return synth(d.synth, seed);
    return Object.assign({ unit: 'UNIT', units: 'UNITS', hitWord: 'HITS', source: '' }, d);
  }

  /* squarified treemap (Bruls et al.): vals -> rects {x, z, w, d} in the given rect; index-aligned, zero values -> null */
  function squarify(vals, x, z, w, d) {
    const tot = sum(vals), out = vals.map(() => null); if (tot <= 0) return out;
    const items = vals.map((v, i) => ({ v, i })).filter((o) => o.v > 0).sort((a, b) => b.v - a.v || a.i - b.i);
    items.forEach((o) => { o.a = o.v * w * d / tot; });
    const r = { x, z, w, d };
    const worst = (row, side) => { const s = sum(row.map((o) => o.a)); let mx = 0, mn = Infinity; for (const o of row) { mx = Math.max(mx, o.a); mn = Math.min(mn, o.a); } return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)); };
    const place = (row) => {
      const s = sum(row.map((o) => o.a));
      if (r.w >= r.d) { const cw = s / r.d; let zz = r.z; for (const o of row) { const hh = o.a / cw; out[o.i] = { x: r.x, z: zz, w: cw, d: hh }; zz += hh; } r.x += cw; r.w -= cw; }
      else { const ch = s / r.w; let xx = r.x; for (const o of row) { const ww = o.a / ch; out[o.i] = { x: xx, z: r.z, w: ww, d: ch }; xx += ww; } r.z += ch; r.d -= ch; }
    };
    let row = [], i = 0;
    while (i < items.length) {
      const side = Math.min(r.w, r.d), cand = row.concat([items[i]]);
      if (!row.length || worst(cand, side) <= worst(row, side)) { row = cand; i++; } else { place(row); row = []; }
    }
    if (row.length) place(row);
    return out;
  }
  const inset = (q, g) => q && { x: q.x + g / 2, z: q.z + g / 2, w: Math.max(0, q.w - g), d: Math.max(0, q.d - g) };

  /* ── the two partitions ──
     A slab is a home for an ordered list of boxes: footprint a (x) by b (z) cells, filled layer by layer from the ground.
     pooled: one slab per group. split: one slab per (category, group). Box order inside a slab puts hits at the bottom. */
  function slabFrom(P, cx, cz, a, b, n) { return { cx, cz, a, b, n, layers: Math.ceil(n / (a * b)), P }; }
  function slot(sl, s) {
    const F = sl.a * sl.b, layer = Math.floor(s / F), r = s % F, ix = r % sl.a, iz = Math.floor(r / sl.a), P = sl.P;
    return [sl.cx + (ix + 0.5 - sl.a / 2) * P, -(layer + 0.5) * P, sl.cz + (iz + 0.5 - sl.b / 2) * P];
  }
  function slabInRect(P, q, n) {   // treemap block: as many whole cells as fit, as many layers as needed
    const a = Math.max(1, Math.floor(q.w / P)), b = Math.max(1, Math.floor(q.d / P));
    return slabFrom(P, q.x + q.w / 2, q.z + q.d / 2, a, b, n);
  }

  function layouts(st, params) {
    const D = st.data, G = D.groups.length, C = D.cats.length, P = params.size + params.gap, nb = st.nb;
    const gTot = nb.map(sum), cTot = D.cats.map((_, c) => sum(nb.map((r) => r[c])));
    const pooled = [], split = [];   // pooled[g], split[c][g]
    if (params.layout === 'treemap') {
      const total = sum(gTot), S = Math.sqrt(total / params.cityLayers * params.slack) * P, W = S * params.aspect, Dd = S / params.aspect;
      const rg = squarify(gTot, -W / 2, -Dd / 2, W, Dd);
      for (let g = 0; g < G; g++) pooled[g] = slabInRect(P, inset(rg[g] || { x: 0, z: 0, w: P, d: P }, params.street), gTot[g]);
      const rc = squarify(cTot, -W / 2, -Dd / 2, W, Dd);
      for (let c = 0; c < C; c++) {
        const q = inset(rc[c] || { x: 0, z: 0, w: P, d: P }, params.street), rq = squarify(nb.map((r) => r[c]), q.x, q.z, q.w, q.d);
        split[c] = []; for (let g = 0; g < G; g++) split[c][g] = slabInRect(P, inset(rq[g] || { x: q.x, z: q.z, w: P, d: P }, params.gap * 2), nb[g][c]);
      }
      st.ground = { w: W + params.street * 2, d: Dd + params.street * 2, rc: rc.map((q) => inset(q, params.street)), rg: rg.map((q) => inset(q, params.street)) };
    } else {
      // split footprints first (they set the grid pitch the pooled columns sit on)
      const fp = (n) => {
        if (params.split === 'rate') { const Fl = Math.max(1, Math.ceil(n / params.layers)), a = Math.min(params.depth, Fl); return [a, Math.ceil(Fl / a)]; }
        return [params.slabFoot[0], params.slabFoot[1]];
      };
      const F = D.cats.map((_, c) => D.groups.map((_, g) => fp(nb[g][c])));
      if (params.arrange === 'grid') {
        const mA = Math.max(...F.flat().map((f) => f[0])), mB = Math.max(...F.flat().map((f) => f[1]));
        const sx = mA * P + params.slabGap, sz = Math.max(mB * P + params.pairGap, 0);
        for (let c = 0; c < C; c++) { split[c] = []; for (let g = 0; g < G; g++) split[c][g] = slabFrom(P, (c - (C - 1) / 2) * sx, (g - (G - 1) / 2) * sz, F[c][g][0], F[c][g][1], nb[g][c]); }
        const pb = Math.max(1, Math.min(params.foot[1], Math.floor((sz - params.gap) / P)));
        for (let g = 0; g < G; g++) pooled[g] = slabFrom(P, params.poolX, (g - (G - 1) / 2) * sz, params.foot[0], pb, gTot[g]);
        st.ground = { w: C * sx + params.slabGap, d: G * sz + params.pairGap * 2 };
      } else {   // row: pooled columns side by side along x, split pairs along z (the simpsons-3d arrangement)
        let w = (C - 1) * params.slabGap + C * (G - 1) * params.pairGap; F.forEach((fc) => fc.forEach((f) => { w += f[1] * P; }));
        let z = w / 2;   // descending z, so after the turn category 0 reads first (left)
        for (let c = 0; c < C; c++) { split[c] = []; for (let g = 0; g < G; g++) { const [a, b] = F[c][g]; split[c][g] = slabFrom(P, 0, z - b * P / 2, a, b, nb[g][c]); z -= b * P + (g < G - 1 ? params.pairGap : params.slabGap); } }
        const pw = params.foot[0] * P, gx = params.groupGap;
        for (let g = 0; g < G; g++) pooled[g] = slabFrom(P, (g - (G - 1) / 2) * (pw + gx), 0, params.foot[0], params.foot[1], gTot[g]);
        st.ground = { w: Math.max(G * (pw + gx), params.depth * P * 4), d: w + params.slabGap * 2 };
      }
    }
    const ext = (sls) => { let r = 0, h = 0; for (const s of sls) { r = Math.max(r, Math.hypot(Math.abs(s.cx) + s.a * P / 2, Math.abs(s.cz) + s.b * P / 2)); h = Math.max(h, s.layers * P); } return { r, h }; };
    Object.assign(st, { P, G, C, pooled, split, gTot, cTot, extP: ext(pooled), extS: ext(split.flat()) });
  }

  /* ── boxes: per-cell box counts, then each box gets its two homes, its stagger and its arrival rank ── */
  function buildBoxes(p, st, params) {
    const D = st.data, G = D.groups.length, C = D.cats.length, rng = mulberry32(st.seed ^ 0x51ab);
    const units = sum(D.n.map(sum)), k = Math.max(params.k, Math.ceil(units / params.budget));
    const nb = D.n.map((r) => r.map((x) => (x > 0 ? Math.max(1, Math.round(x / k)) : 0)));
    const nh = D.hit ? D.hit.map((r, g) => r.map((x, c) => Math.min(nb[g][c], Math.round(x / k)))) : nb.map((r) => r.map(() => 0));
    Object.assign(st, { units, k, nb, nh, boxes: sum(nb.map(sum)), hasHit: !!D.hit });
    layouts(st, params);
    // boxes of each cell, hits first; one seeded key per box decides order within a slab and the stagger
    const box = [];
    for (let g = 0; g < G; g++) for (let c = 0; c < C; c++) for (let j = 0; j < nb[g][c]; j++) box.push({ g, c, hit: j < nh[g][c], j, key: rng() });
    // pooled homes
    const byG = D.groups.map(() => []); box.forEach((b) => byG[b.g].push(b));
    const sorters = {
      'hit-cat': (a, b) => (b.hit - a.hit) || (a.c - b.c) || (a.key - b.key),
      'cat-hit': (a, b) => (a.c - b.c) || (b.hit - a.hit) || (a.key - b.key),
      'hit-seeded': (a, b) => (b.hit - a.hit) || (a.key - b.key),
    };
    const maxPool = Math.max(...byG.map((l) => l.length)), hitTot = byG.map((l) => l.filter((b) => b.hit).length);
    byG.forEach((l, g) => { l.sort(sorters[params.pooledSort] || sorters['hit-cat']); let hr = 0; l.forEach((b, s) => { b.from = slot(st.pooled[g], s); b.ar = (s + 0.5) / maxPool; b.ls = b.hit ? (hr++ + 0.5) / Math.max(1, hitTot[g]) : 2; }); });
    // split homes (hits at the bottom of each slab, seeded within)
    for (let c = 0; c < C; c++) for (let g = 0; g < G; g++) {
      const l = box.filter((b) => b.g === g && b.c === c).sort(sorters['hit-seeded']);
      l.forEach((b, s) => { b.to = slot(st.split[c][g], s); b.cs = (s + 0.5) / l.length; });
    }
    // stagger: seeded, mixed with category order so a film can make the slabs peel off in sequence (orderMix 0..1)
    box.forEach((b) => { b.ms = clamp(lerp(rng(), (b.c + b.cs * 0.8) / C, params.orderMix)); });
    st.maxPool = maxPool; st.box = box;
    // tagged units: {g, c, j} (j-th box of cell g,c; hits come first) or 'GROUP/CAT/j' by name
    const nameIdx = (arr, x) => (typeof x === 'number' ? x : arr.indexOf(x));
    st.tags = (params.tag || []).map((q) => {
      if (typeof q === 'string') { const [g, c, j] = q.split('/'); q = { g: nameIdx(D.groups, g), c: nameIdx(D.cats, c), j: +j || 0 }; }
      return box.find((b) => b.g === nameIdx(D.groups, q.g) && b.c === nameIdx(D.cats, q.c) && b.j === (q.j || 0));
    }).filter(Boolean);
    st.tags.forEach((b) => { b.tag = true; });
    // both partitions are valid charts: every home is unique (no two boxes share a cell) and every box has both homes
    const uniq = (key) => new Set(box.map((b) => b[key].map((x) => Math.round(x * 100)).join(','))).size === box.length;
    st.homesOK = { pooled: uniq('from'), split: uniq('to') };
    // bake: 5 faces per box (the bottom face is never seen), 20 vertices, 10 triangles; homes ride as vertex properties
    const FACES = [   // normal, then 4 corners (unit cube, centred); y is down in p5, so -y is the top
      [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]],
      [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]],
      [[0, 0, -1], [[1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]]],
      [[1, 0, 0], [[1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]]],
      [[-1, 0, 0], [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]]],
    ];
    const geo = new p5.Geometry(1, 1), N = box.length, V = N * 20;
    const vs = new Array(V), ns = new Array(V), faces = new Array(N * 10);
    const aFrom = new Float32Array(V * 3), aTo = new Float32Array(V * 3), aInfo = new Float32Array(V * 4), aArr = new Float32Array(V * 2);
    const nv = FACES.map((f) => new p5.Vector(...f[0]));
    let v = 0, f = 0;
    for (let i = 0; i < N; i++) {
      const b = box[i];
      for (let q = 0; q < 5; q++) {
        const base = v;
        for (const cr of FACES[q][1]) {
          vs[v] = new p5.Vector(cr[0] * 0.5, cr[1] * 0.5, cr[2] * 0.5); ns[v] = nv[q];
          aFrom.set(b.from, v * 3); aTo.set(b.to, v * 3);
          aInfo[v * 4] = b.g; aInfo[v * 4 + 1] = b.c; aInfo[v * 4 + 2] = b.ls; aInfo[v * 4 + 3] = b.ms;
          aArr[v * 2] = b.ar; aArr[v * 2 + 1] = b.tag ? 1 : 0; v++;
        }
        faces[f++] = [base, base + 1, base + 2]; faces[f++] = [base, base + 2, base + 3];
      }
    }
    geo.vertices = vs; geo.vertexNormals = ns; geo.faces = faces;
    const prop = (name, arr, size) => { geo._userVertexPropertyHelper(name, [], size); geo[name + 'Src'] = Array.from(arr); };
    prop('aFrom', aFrom, 3); prop('aTo', aTo, 3); prop('aInfo', aInfo, 4); prop('aArr', aArr, 2);
    st.geo = geo; st.verts = V;
  }

  /* ── reversal: the groups with the highest and lowest pooled rate; categories where the low group does better ── */
  function reversal(st) {
    const D = st.data; if (!D.hit) return null;
    const pr = D.groups.map((_, g) => sum(D.hit[g]) / Math.max(1, sum(D.n[g])));
    let hi = 0, lo = 0; pr.forEach((r, g) => { if (r > pr[hi]) hi = g; if (r < pr[lo]) lo = g; });
    if (hi === lo) return null;
    const cats = D.cats.map((_, c) => D.hit[lo][c] * D.n[hi][c] > D.hit[hi][c] * D.n[lo][c]);
    return { hi, lo, cats, count: cats.filter(Boolean).length, pooledHi: pr[hi], pooledLo: pr[lo] };
  }

  /* ── shader: positions, lighting and colour per vertex (faces are flat, so per-vertex Lambert is exact); trivial fragment ── */
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aFrom; attribute vec3 aTo; attribute vec4 aInfo; attribute vec2 aArr;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uSize, uMove, uStag, uLift, uArr, uArrW, uDrop, uLit, uDim, uMaskOn, uColorBy, uMaskDim;
uniform vec3 uPal[${MAXP}]; uniform float uMask[${MAXP}];
uniform vec3 uAmb, uKey, uRim, uKeyDir, uRimDir, uBg, uTag;
varying vec3 vCol;
void main(){
  float a = clamp((uArr - aArr.x) / uArrW, 0.0, 1.0);
  float u = clamp(uMove * (1.0 + uStag) - aInfo.w * uStag, 0.0, 1.0);
  float e = u * u * u * (u * (u * 6.0 - 15.0) + 10.0);
  vec3 c = mix(aFrom, aTo, e);
  c.y -= sin(3.14159265 * u) * uLift + (1.0 - a) * (1.0 - a) * uDrop;
  float sc = 0.35 + 0.65 * a;
  vec3 pos = c + aPosition * uSize * sc;
  int gi = int(aInfo.x + 0.5), ci = int(aInfo.y + 0.5);
  int pi = uColorBy > 1.5 ? 0 : (uColorBy > 0.5 ? ci : gi);
  float tg = step(0.5, aArr.y);
  vec3 hue = mix(uPal[pi], uTag, tg);
  float lit = max(step(aInfo.z, uLit), tg);
  vec3 base = mix(mix(hue, uBg, uDim), hue, lit);
  vec3 l = uAmb + uKey * max(dot(aNormal, -uKeyDir), 0.0) + uRim * max(dot(aNormal, -uRimDir), 0.0);
  vec3 col = base * l;
  float m = uMask[ci];
  vCol = mix(col, uBg, uMaskOn * (1.0 - m) * uMaskDim);
  gl_Position = (a <= 0.0) ? vec4(3.0, 3.0, 3.0, 1.0) : uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
}`;
  const FRAG = 'precision highp float; varying vec3 vCol; void main(){ gl_FragColor = vec4(vCol, 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };

  /* role palette: accent2, ink, muted, chalk; more than 4 -> a ramp accent2 -> ink -> muted. accent is reserved for the tag and results */
  function palette(p, tk, n) {
    const c = tk.color;
    if (n <= 4) return [c.accent2, c.ink, c.muted, c.chalk].slice(0, Math.max(1, n)).map((x) => p.color(x));
    const st = [p.color(c.accent2), p.color(c.ink), p.color(c.muted)];
    return Array.from({ length: n }, (_, i) => { const u = i / (n - 1) * 2, j = Math.min(1, Math.floor(u)); return p.lerpColor(st[j], st[j + 1], u - j); });
  }

  /* ── fonts: the pack's faces from arsenal/fonts/fonts.js (TTF data URLs); a missing face falls back visibly (st.faceNote) ── */
  async function faces(p, tk) {
    const F = window.ARSENAL_FONTS || {}, cache = (p.__glscFonts = p.__glscFonts || {}), out = {}, notes = [];
    const fall = { disp: ['Big Shoulders Display|600', 'Jost|600', 'Sofia Sans Extra Condensed|700'], mono: ['IBM Plex Mono|400', 'Red Hat Mono|400', 'Space Mono|400'] };
    for (const role of ['disp', 'mono']) {
      const want = tk.type[role].family + '|' + tk.type[role].weight;
      const key = F[want] ? want : fall[role].find((k) => F[k]);
      if (key !== want) notes.push(role + ': ' + want + ' not in fonts.js, using ' + key);
      if (!key) continue;
      if (!cache[key]) cache[key] = await p.loadFont(F[key]);
      out[role] = cache[key];
    }
    return { f: out, note: notes.join('; ') };
  }

  /* ── camera: orbit (azimuth, elevation) keyed on the move, orthographic, fitted to the lerp of both layouts ── */
  function camera(p, st, params, u) {
    const mv = smooth(seg(u, params.beats.move[0], params.beats.move[1]));
    const az = lerp(params.az[0], params.az[1], mv) * Math.PI / 180 + (u - 0.5) * params.drift * Math.PI / 180;
    const el = lerp(params.elev[0], params.elev[1], mv) * Math.PI / 180;
    const R = lerp(st.extP.r, st.extS.r, mv), Ht = lerp(st.extP.h, st.extS.h, mv);
    const look = [0, -Ht * params.lookY, 0], dist = 3000;
    const eye = [look[0] + dist * Math.cos(el) * Math.sin(az), look[1] - dist * Math.sin(el), look[2] + dist * Math.cos(el) * Math.cos(az)];
    const W = p.width, H = p.height, fit = lerp(params.fit[0], params.fit[1], mv);
    const hh = Math.max(R * 1.08 * H / W, Ht * 0.86, 40) * fit;
    const cam = st.cam;
    cam.camera(eye[0], eye[1], eye[2], look[0], look[1], look[2], 0, 1, 0);
    cam.ortho(-hh * W / H, hh * W / H, -hh, hh, 1, 6000);
    p.setCamera(cam);
    return { az, el, mv };
  }

  /* ── state from t (shared by draw and count) ── */
  function phase(st, params, t) {
    const u = clamp(t / params.dur), B = params.beats;
    const arr = seg(u, B.arrive[0], B.arrive[1]) * (1 + params.arrW), lit = st.hasHit ? seg(u, B.lit[0], B.lit[1]) * 1.0001 : 2;
    const move = seg(u, B.move[0], B.move[1]), rev = params.reveal === 'reversal' && st.rev ? seg(u, B.reveal[0], B.reveal[1]) : 0;
    // boxes shown: per pooled slab, the boxes with ar < arr (ar = (s + 0.5) / maxPool)
    const shownPer = st.gTot.map((n) => (arr <= 0 ? 0 : Math.min(n, Math.max(0, Math.ceil(arr * st.maxPool - 0.5)))));
    const boxes = sum(shownPer);
    const name = u < B.arrive[1] ? 'arrive' : u < B.move[0] ? 'pooled' : u < B.move[1] ? 'move' : rev > 0 ? 'reveal' : 'split';
    return { u, arr, lit, move, rev, boxes, name };
  }

  /* CPU twin of the vertex shader: where box b is at this phase (same formula, so pins, trails and check() agree with the pixels) */
  function boxAt(st, params, ph, b, uOverride) {
    const a = clamp((ph.arr - b.ar) / params.arrW);
    const u = uOverride != null ? uOverride : clamp(ph.move * (1 + params.stagger) - b.ms * params.stagger), e = smooth(u);
    const y = lerp(b.from[1], b.to[1], e) - (Math.sin(Math.PI * u) * params.lift + (1 - a) * (1 - a) * params.drop);
    return { c: [lerp(b.from[0], b.to[0], e), y, lerp(b.from[2], b.to[2], e)], a, u, sc: 0.35 + 0.65 * a, shown: ph.arr > b.ar };
  }

  /* congruence guard: every in-between frame is a valid chart. Same boxes (count), same total volume and stacked height,
     every box has exactly one pooled home and one split home, and boxes x k accounts for the units (rounding residual). */
  function check(st, params, ph) {
    let shown = 0, vol = 0, hgt = 0, travelling = 0; const s3 = Math.pow(params.size, 3);
    for (const b of st.box) { const q = boxAt(st, params, ph, b); if (!q.shown) continue; shown++; vol += Math.pow(q.sc, 3) * s3; hgt += q.sc * params.size; if (q.u > 0 && q.u < 1) travelling++; }
    const done = ph.u >= params.beats.arrive[1], expBoxes = done ? st.boxes : ph.boxes;
    const volume = shown ? vol / (expBoxes * s3) : 0, height = shown ? hgt / (expBoxes * params.size) : 0;
    const resid = sum(st.nb.map(sum)) * st.k - st.units;
    const ok = shown === expBoxes && st.homesOK.pooled && st.homesOK.split && (!done || (Math.abs(volume - 1) < 1e-9 && Math.abs(height - 1) < 1e-9));
    return { ok, boxes: shown, expected: expBoxes, volume: +volume.toFixed(6), height: +height.toFixed(6), travelling, homes: st.homesOK, unitsResidual: resid, k: st.k, phase: ph.name };
  }

  /* tagged units: accent box (shader), an outline drawn over everything, the trail of its own path so far, a travelling pin */
  function drawTags(p, st, params, tk, ph) {
    if (!st.tags.length) return [];
    const out = [], c = tk.color, D = st.data;
    p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT); p.resetShader();
    for (const b of st.tags) {
      const q = boxAt(st, params, ph, b); if (q.a < 1) continue;
      const ac = p.color(c.accent), gh = p.color(c.accent); gh.setAlpha(110);
      if (q.u > 0) {   // trail: the box's own path from its pooled home to here, plus a ghost of the home it left
        p.noFill(); p.stroke(gh); p.strokeWeight(1.5); p.beginShape();
        for (let i = 0; i <= 32; i++) { const r = boxAt(st, params, ph, b, q.u * i / 32); p.vertex(r.c[0], r.c[1], r.c[2]); }
        p.endShape();
        p.push(); p.translate(b.from[0], b.from[1], b.from[2]); p.strokeWeight(1); p.box(params.size); p.pop();
      }
      p.noFill(); p.stroke(ac); p.strokeWeight(2); p.push(); p.translate(q.c[0], q.c[1], q.c[2]); p.box(params.size * 1.2); p.pop();
      const what = D.groups[b.g] + ' \u00b7 ' + D.cats[b.c] + ' \u00b7 ' + (b.hit ? D.hitWord : 'NOT ' + D.hitWord);
      out.push({ p: [q.c[0], q.c[1] - params.size, q.c[2]], lines: [[st.k === 1 ? 'ONE ' + D.unit : 'ONE BOX = ' + fmt(st.k) + ' ' + D.units, 'mono', 10, c.accent], [what, 'mono', 9, c.ink]],
        op: seg(ph.u, params.beats.arrive[1], params.beats.arrive[1] + 0.03), side: true });
    }
    return out;
  }

  function drawGround(p, st, params, tk) {
    const g = st.ground, bg = p.color(tk.color.bg);
    p.resetShader(); p.noStroke();
    const pc = p.lerpColor(bg, p.color(tk.color.panel), 0.95);
    p.fill(pc); p.push(); p.translate(0, 0.6, 0); p.rotateX(Math.PI / 2); p.plane(g.w + 40, g.d + 40); p.pop();
    if (params.layout === 'treemap' && g.rc) {   // category blocks drawn as ground plates (the split partition's streets)
      const lc = p.lerpColor(pc, p.color(tk.color.muted), 0.22);
      p.fill(lc);
      for (const q of g.rc) if (q) { p.push(); p.translate(q.x + q.w / 2, 0.3, q.z + q.d / 2); p.rotateX(Math.PI / 2); p.plane(q.w, q.d); p.pop(); }
    }
  }

  function drawBoxes(p, st, params, tk, ph) {
    const sh = st.sh, c = tk.color, bg = p.color(c.bg), U = (k, v) => sh.setUniform(k, v);
    p.shader(sh); p.noStroke(); p.fill(255);
    U('uSize', params.size); U('uMove', ph.move); U('uStag', params.stagger); U('uLift', params.lift); U('uArr', ph.arr); U('uArrW', params.arrW); U('uDrop', params.drop);
    U('uLit', ph.lit); U('uDim', params.dim); U('uColorBy', params.colorBy === 'cat' ? 1 : params.colorBy === 'none' ? 2 : 0);
    const pal = palette(p, tk, params.colorBy === 'cat' ? st.C : params.colorBy === 'none' ? 1 : st.G), flat = [];
    for (let i = 0; i < MAXP; i++) flat.push(...rgb(p, pal[Math.min(i, pal.length - 1)]));
    U('uPal', flat);
    const mask = []; for (let i = 0; i < MAXP; i++) mask.push(st.rev && st.rev.cats[i] ? 1 : 0);
    U('uMask', mask); U('uMaskOn', ph.rev); U('uMaskDim', params.maskDim);
    U('uAmb', rgb(p, p.lerpColor(bg, p.color(c.chalk), 0.62))); U('uKey', rgb(p, p.lerpColor(bg, p.color(c.chalk), 0.42)));
    U('uRim', rgb(p, p.lerpColor(bg, p.color(c.accent2), 0.18)));
    U('uKeyDir', norm([-0.35, 0.85, -0.4])); U('uRimDir', norm([0.75, 0.25, 0.6])); U('uBg', rgb(p, c.bg)); U('uTag', rgb(p, c.accent));
    p.model(st.geo);
    p.resetShader();
  }

  /* pins: label anchors in world space, with their text and opacity (built from t only) */
  function pins(st, params, tk, ph) {
    const D = st.data, P = st.P, out = [], c = tk.color, R = st.rev;
    const top = (s) => [s.cx, -s.layers * P - 8, s.cz];
    const opPool = ph.arr >= 1 ? seg(ph.u, params.beats.arrive[1], params.beats.arrive[1] + 0.03) * (1 - seg(ph.u, params.beats.move[0] - 0.005, params.beats.move[0] + 0.03)) : 0;
    const opSplit = seg(ph.u, params.beats.move[1] - 0.005, params.beats.move[1] + 0.04);
    const L = params.labels;
    if (L === 'none') return out;
    if (opPool > 0) for (let g = 0; g < st.G; g++) {
      const n = sum(D.n[g]), h = D.hit ? sum(D.hit[g]) : null, s = st.pooled[g];
      const big = h != null ? fmt(h) + ' / ' + fmt(n) : fmt(n);
      const rate = h != null && ph.lit >= 1 ? Math.round(100 * h / n) + '%' : '';
      if (L === 'axis') { out.push({ p: top(s), lines: [[fmt(n), 'disp', 13, c.ink], [D.groups[g], 'mono', 9, c.muted]], op: opPool, dy: (g % 2) * 26 }); continue; }
      out.push({ p: top(s), lines: [[rate, 'disp', 26, c.ink], [big, 'disp', 17, c.ink], [D.groups[g] + (h != null ? ' \u00b7 ' + D.hitWord + ' / ALL' : ''), 'mono', 10, c.muted]].filter((x) => x[0]), op: opPool, lead: true });
    }
    if (opSplit > 0) {
      if (L === 'slab') for (let cc = 0; cc < st.C; cc++) for (let g = 0; g < st.G; g++) {
        const n = D.n[g][cc], h = D.hit ? D.hit[g][cc] : null, s = st.split[cc][g], m = ph.rev > 0 && R && !R.cats[cc] ? 1 - 0.7 * ph.rev : 1;
        out.push({ p: top(s), lines: [[h != null ? Math.round(100 * h / n) + '%' : fmt(n), 'disp', 19, c.ink], [h != null ? fmt(h) + '/' + fmt(n) : '', 'disp', 12, c.ink], [D.cats[cc] + ' \u00b7 ' + D.groups[g], 'mono', 9, c.muted]].filter((x) => x[0]), op: opSplit * m, dy: (g % 2) * 44 });
      }
      if (L === 'block') for (let cc = 0; cc < st.C; cc++) {
        const ss = st.split[cc], n = sum(D.n.map((r) => r[cc])), x = sum(ss.map((s) => s.cx * s.n)) / Math.max(1, sum(ss.map((s) => s.n))), z = sum(ss.map((s) => s.cz * s.n)) / Math.max(1, sum(ss.map((s) => s.n)));
        out.push({ p: [x, -Math.max(...ss.map((s) => s.layers)) * P - 8, z], lines: [[fmt(n), 'disp', 18, c.ink], [D.cats[cc], 'mono', 10, c.muted]], op: opSplit });
      }
      if (L === 'axis') {
        const fz = Math.max(...st.split.flat().map((s) => s.cz + s.b * P / 2)) + 18, lx = Math.min(...st.split.flat().map((s) => s.cx - s.a * P / 2)) - 14;
        for (let cc = 0; cc < st.C; cc++) out.push({ p: [st.split[cc][0].cx, 0, fz], lines: [[D.cats[cc], 'mono', 10, c.muted]], op: opSplit, flat: true });
        for (let g = 0; g < st.G; g++) out.push({ p: [lx, 0, st.split[0][g].cz], lines: [[D.groups[g], 'mono', 10, c.muted]], op: opSplit, flat: true, right: true });
        // the largest cells, by count
        const cells = []; D.n.forEach((r, g) => r.forEach((n, cc) => cells.push({ g, cc, n })));
        cells.sort((a, b) => b.n - a.n || a.g - b.g || a.cc - b.cc);
        cells.slice(0, params.pinsMax).forEach((q, i) => out.push({ p: top(st.split[q.cc][q.g]), lines: [[fmt(q.n), 'disp', 18, c.accent], [D.cats[q.cc] + ' · ' + D.groups[q.g] + ' · #' + (i + 1), 'mono', 9, c.muted]], op: opSplit, lead: true }));
      }
    }
    return out;
  }

  function hud(p, st, params, tk, ph, pts, ck) {
    const f = st.fonts, c = tk.color, W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, D = st.data;
    p.push(); p.resetMatrix(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT); p.resetShader();
    if (!f.disp || !f.mono) { p.pop(); return; }
    const txt = (s, x, y, size, col, font, al, op) => {
      const cc = p.color(col); cc.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(cc); p.textFont(f[font]); p.textSize(size);
      const A2 = al || 'L'; p.textAlign(A2 === 'R' ? p.RIGHT : A2 === 'C' ? p.CENTER : p.LEFT, p.BASELINE);
      p.text(s, x + ox - (A2 === 'R' ? 2000 : A2 === 'C' ? 1000 : 0), y + oy, 2000);
    };
    // pinned labels (flat, centred over the anchor; 'lead' pins get a short leader)
    for (const q of pts) {
      if (q.op <= 0.01 || q.x < 8 || q.x > W - 8 || q.y < 8 || q.y > H + 8) continue;
      if (q.side) {   // travelling tag pin: leader up-right, text left-aligned
        const lc = p.color(c.accent); lc.setAlpha(255 * q.op); p.stroke(lc); p.strokeWeight(1); p.line(q.x + ox, q.y + oy, q.x + 18 + ox, q.y - 22 + oy);
        txt(q.lines[0][0], q.x + 22, q.y - 36, q.lines[0][2], q.lines[0][3], 'mono', 'L', q.op); txt(q.lines[1][0], q.x + 22, q.y - 24, q.lines[1][2], q.lines[1][3], 'mono', 'L', q.op); continue;
      }
      let y = q.y - (q.flat ? -12 : 6) - (q.dy || 0);
      if (q.lead || q.dy) { const lc = p.color(c.muted); lc.setAlpha(255 * q.op); p.stroke(lc); p.strokeWeight(1); p.line(q.x + ox, q.y + oy, q.x + ox, q.y - 14 - (q.dy || 0) + oy); y -= 14; }
      const ls = q.flat ? q.lines : q.lines.slice().reverse();
      for (const [s, font, size, col] of ls) { txt(s, q.x, y, size, col, font, q.right ? 'R' : 'C', q.op); y += q.flat ? size + 3 : -(size + 3); }
    }
    // legend (colour = group, or category)
    const by = params.colorBy, names = by === 'cat' ? D.cats : by === 'none' ? [] : D.groups, pal = palette(p, tk, by === 'cat' ? st.C : st.G);
    let lx = 36; const ly = 40;
    names.slice(0, MAXP).forEach((nm, i) => { p.noStroke(); p.fill(pal[i]); p.rect(lx + ox, ly - 9 + oy, 10, 10); txt(nm, lx + 15, ly, 10, c.muted, 'mono'); lx += 22 + nm.length * 7.2; });
    if (st.hasHit) { p.fill(p.lerpColor(pal[0], p.color(c.bg), params.dim)); p.rect(lx + 8 + ox, ly - 9 + oy, 10, 10); txt('DIM = NOT ' + D.hitWord, lx + 23, ly, 10, c.muted, 'mono'); }
    // the count readout: boxes on screen, what one box stands for, the exact total in units
    const ux = D.unit.toLowerCase();
    txt(fmt(ph.boxes), 36, H - 62, 58, ph.boxes > 0 ? c.accent : c.ink, 'disp');
    txt('BOXES · 1 BOX = ' + (st.k === 1 ? '1 ' + D.unit : fmt(st.k) + ' ' + D.units + (st.k > params.k ? ' (LOD, BUDGET ' + fmt(params.budget) + ')' : '')) + ' · ' + fmt(st.units) + ' ' + D.units + ' IN ALL', 38, H - 38, 10, c.muted, 'mono');
    const part = ph.move <= 0 ? 'POOLED BY GROUP' : ph.move >= 1 ? 'SPLIT BY CATEGORY' : 'RE-PARTITIONING · ' + Math.round(100 * ph.move) + '%';
    txt(part, W - 36, 40, 10, c.muted, 'mono', 'R');
    if (params.checkLine && ck) txt('CHECK ' + (ck.ok ? 'OK' : 'FAIL') + ' \u00b7 ' + fmt(ck.boxes) + ' OF ' + fmt(ck.expected) + ' BOXES \u00b7 VOLUME ' + (100 * ck.volume).toFixed(1) + '% \u00b7 ' + fmt(ck.travelling) + ' IN FLIGHT', W - 36, 54, 9, ck.ok ? c.muted : c.accent2, 'mono', 'R');
    if (D.source) txt(D.source, W - 36, H - 24, 9, c.muted, 'mono', 'R');
    if (ph.rev > 0 && st.rev) {
      const R = st.rev;
      txt(D.groups[R.lo] + ' HIGHER IN ' + R.count + ' OF ' + st.C, W - 36, H - 62, 30, c.accent, 'disp', 'R', ph.rev);
      txt('POOLED: ' + Math.round(100 * R.pooledLo) + '% vs ' + Math.round(100 * R.pooledHi) + '% · SAME BOXES, NEW PARTITION', W - 36, H - 42, 10, c.muted, 'mono', 'R', ph.rev);
    }
    p.pop();
  }

  const PAT = {
    id: ID, atlas: ['webgl-mode', 'build-geometry', 'gpu-instancing', 'p5-shader', 'world-to-screen', 'camera-slerp', 'frontier-2026'],
    renderer: 'webgl',
    params: {
      data: null,                 // matrix {groups, cats, n[g][c], hit?[g][c], unit, units, hitWord, source} | {synth:{G, C, total, seed, hits}} | null = Berkeley 1973
      layout: 'bars',             // bars | treemap
      split: 'rate',              // bars: rate (every split slab `layers` high, footprint ~ count: lit height = rate) | count (fixed footprint, height ~ count)
      arrange: 'row',             // bars: row (pooled along x, split pairs along z) | grid (categories along x, groups along z)
      k: 1, budget: 20000,        // units per box; LOD: k rises to ceil(units / budget) above the box budget
      size: 6.4, gap: 0.8,        // box edge and gap (world units); pitch = size + gap
      foot: [12, 10],             // pooled slab footprint in cells (x, z)
      slabFoot: [4, 4], layers: 20, depth: 4, // split slab: fixed footprint (count) | layers and depth (rate)
      slabGap: 16, pairGap: 5, groupGap: 28, poolX: 0,
      cityLayers: 6, slack: 1.35, aspect: 1.25, street: 10,   // treemap: target storeys, area slack, ground aspect, street width
      pooledSort: 'hit-cat',      // hit-cat | cat-hit | hit-seeded
      colorBy: 'group',           // group | cat | none
      dim: 0.58, maskDim: 0.78,   // misses mixed toward bg; masked categories at the reveal
      dur: 14,
      beats: { arrive: [0.03, 0.24], lit: [0.25, 0.31], move: [0.42, 0.72], reveal: [0.82, 0.88] },
      arrW: 0.04, drop: 60, stagger: 0.25, lift: 22, orderMix: 0.5,
      az: [28, 104], elev: [26, 16], drift: 6, fit: [1.22, 1.0], lookY: 0.45,
      reveal: 'reversal',         // reversal | none
      labels: 'slab',             // slab | block | axis | none
      pinsMax: 3,
      tag: [],                    // units to follow: [{g, c, j}] (j-th box of cell g,c; hits first) or ['GROUP/CAT/j']
      checkLine: true,            // draw the check(t) line (top right); a film turns it off and reads check() instead
    },
    variants: [
      { name: 'bars-2x6', params: { tag: ['WOMEN/A/0'] } },
      { name: 'bars-2x6-k10', params: { k: 10, size: 9, gap: 1.2, foot: [8, 6], layers: 12, depth: 3, tag: ['WOMEN/A/0'] } },
      { name: 'treemap-4x8', params: { layout: 'treemap', data: { synth: { G: 4, C: 8, total: 6400, seed: 48, hits: true } }, labels: 'block', reveal: 'none', az: [34, 58], elev: [44, 40], fit: [1.0, 1.08], pooledSort: 'hit-seeded', orderMix: 0.3, lift: 30, tag: [{ g: 0, c: 3, j: 0 }] } },
      { name: 'big-12x12-lod', params: { arrange: 'grid', split: 'count', data: { synth: { G: 12, C: 12, total: 240000, seed: 144, hits: true, skew: 0.9 } }, budget: 12000, size: 5, gap: 1, foot: [9, 6], slabFoot: [3, 3], slabGap: 10, pairGap: 18,
        labels: 'axis', reveal: 'none', az: [90, 32], elev: [24, 34], fit: [1.05, 1.32], orderMix: 0.7, lift: 16, tag: [{ g: 5, c: 7, j: 0 }] } },
    ],
    check(t, st, params) { return Object.assign({ t }, check(st, params, phase(st, params, t))); },
    count(t, st, params) {
      const ph = phase(st, params, t);
      return { boxes: ph.boxes, k: st.k, unitsApprox: Math.min(st.units, ph.boxes * st.k), units: st.units, phase: ph.name, move: ph.move, reversals: st.rev ? st.rev.count : null };
    },
    async setup(p, ctx, params) {
      const st = { seed: ctx.seed == null ? 7 : ctx.seed };
      st.data = resolveData(params.data, st.seed);
      if (st.data.groups.length > MAXP || st.data.cats.length > MAXP) throw new Error(ID + ': at most ' + MAXP + ' groups and categories');
      buildBoxes(p, st, params);
      st.rev = reversal(st);
      st.sh = p.createShader(VERT, FRAG); st.cam = p.createCamera(); st.hud = p.createCamera();
      const fz = await faces(p, ctx.tokens); st.fonts = fz.f; st.faceNote = fz.note;
      return st;
    },
    draw(p, t, st, params, tk) {
      const ph = phase(st, params, t);
      p.background(tk.color.bg); p.noLights();
      const view = camera(p, st, params, ph.u);
      drawGround(p, st, params, tk);
      drawBoxes(p, st, params, tk, ph);
      const tg = drawTags(p, st, params, tk, ph);
      const pl = pins(st, params, tk, ph).concat(tg).map((q) => { const v = p.worldToScreen(new p5.Vector(q.p[0], q.p[1], q.p[2])); return Object.assign(q, { x: v.x, y: v.y }); });
      const ck = params.checkLine ? check(st, params, ph) : null;
      hud(p, st, params, tk, ph, pl, ck);
      return { boxes: ph.boxes, k: st.k, phase: ph.name, move: +ph.move.toFixed(3), check: ck && ck.ok };
    },
  };
  A.patterns[ID] = PAT;
})();
