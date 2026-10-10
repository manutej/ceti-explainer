/* arsenal/patterns/gl-ribbons · flows as 3D ribbons / tubes along splines between node slabs (renderer: webgl)
   A sankey in depth: nodes are slabs (height = units through the node), links are cubic splines in x, y, z whose
   width is proportional to the quantity they carry. Units ride the ribbons as marks (1 mark = params.unit units), so
   every number on screen is a count of marks that have landed. Two timing models: 'flow' (stage windows, uniform
   departures with seeded jitter) and 'queue' (seeded Poisson arrivals, FIFO single server, waiting marks stack on the
   queue slab). draw(t) is pure of t: departures, arrivals and service starts are solved in setup; draw only compares
   them with t. Ribbons are baked once (buildGeometry, arc-length uv) and grow in the fragment shader (discard u > grow);
   marks are one beginShape(TRIANGLES) batch per frame. Labels: worldToScreen pins drawn flat with the pack's faces. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const add = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

  /* ---------- shader: role-coloured Lambert, arc-length growth, travelling stripes, depth fog (GLSL ES 1.00) ---------- */
  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord;' +
    'uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN; varying vec2 vUV; varying float vD;' +
    'void main(){ vN = aNormal; vUV = aTexCoord; vec4 mv = uModelViewMatrix * vec4(aPosition, 1.0); vD = -mv.z; gl_Position = uProjectionMatrix * mv; }';
  const FRAG = 'precision highp float; varying vec3 vN; varying vec2 vUV; varying float vD;' +
    'uniform vec3 uColor, uBg, uKeyDir; uniform float uAmb, uKey, uFlat, uGrow, uStripe, uLen, uPhase, uFog0, uFog1, uFogK;' +
    'void main(){ if (vUV.x > uGrow) discard; vec3 n = normalize(vN);' +
    ' float l = mix(uAmb + uKey * max(dot(n, -uKeyDir), 0.0), 1.0, uFlat); vec3 c = uColor * l;' +
    ' float s = step(0.5, fract(vUV.x * uLen - uPhase)); c = mix(c, uBg, uStripe * 0.22 * s);' +
    ' float f = clamp((vD - uFog0) / max(uFog1 - uFog0, 1.0), 0.0, 1.0) * uFogK; gl_FragColor = vec4(mix(c, uBg, f), 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const role = (tk, r) => tk.color[r] || tk.color.ink;

  /* ---------- data: { nodes:[{id,label,layer,z,role,show}], links:[[s,t,q,role]|{s,t,q,role}] } or a bare links array ---------- */
  function normData(data) {
    const raw = Array.isArray(data) ? { links: data } : (data || {});
    const links = (raw.links || []).map((l) => Array.isArray(l) ? { s: l[0], t: l[1], q: +l[2], role: l[3] } : Object.assign({}, l, { q: +l.q }));
    const byId = {}, nodes = [];
    for (const n of raw.nodes || []) { const m = Object.assign({ label: String(n.id).toUpperCase() }, n); byId[m.id] = m; nodes.push(m); }
    for (const l of links) for (const id of [l.s, l.t]) if (!byId[id]) { const m = { id, label: String(id).toUpperCase() }; byId[id] = m; nodes.push(m); }
    for (const n of nodes) { n.in = []; n.out = []; }
    for (const l of links) { byId[l.s].out.push(l); byId[l.t].in.push(l); }
    // layers: explicit, else longest path from a source
    for (let it = 0; it < nodes.length + 1; it++) for (const n of nodes) if (n.layer == null || n._inf) {
      n._inf = true; n.layer = n.in.length ? 1 + Math.max(...n.in.map((l) => byId[l.s].layer == null ? 0 : byId[l.s].layer)) : 0;
    }
    for (const n of nodes) { n.vin = n.in.reduce((a, l) => a + l.q, 0); n.vout = n.out.reduce((a, l) => a + l.q, 0); n.v = Math.max(n.vin, n.vout); }
    return { nodes, links, byId, L: 1 + Math.max(...nodes.map((n) => n.layer)) };
  }

  function layout(G, params) {
    const { X, H, gap, slabW, zSpread } = params, L = G.L, layers = [];
    for (let l = 0; l < L; l++) layers.push(G.nodes.filter((n) => n.layer === l));
    const k = params.k || Math.min(...layers.map((ns) => (H - (ns.length - 1) * gap) / Math.max(1e-9, ns.reduce((a, n) => a + n.v, 0))));
    layers.forEach((ns, l) => {
      const tot = ns.reduce((a, n) => a + n.v * k, 0) + (ns.length - 1) * gap; let y = -tot / 2;
      ns.forEach((n, i) => {
        n.x = L > 1 ? -X / 2 + l * X / (L - 1) : 0; n.h = Math.max(2, n.v * k); n.y0 = y; n.yc = y + n.h / 2; y += n.h + gap;
        n.z = n.z != null ? n.z : (i - (ns.length - 1) / 2) * zSpread; n.w = n.slabW || slabW;
      });
    });
    for (const n of G.nodes) {   // stack link ends on the slab faces, ordered by the far end so ribbons do not cross at the face
      let y = n.y0 + (n.h - n.vout * k) / 2; [...n.out].sort((a, b) => G.byId[a.t].yc - G.byId[b.t].yc).forEach((l) => { l.w = l.q * k; l.ys = y + l.w / 2; y += l.w; });
      y = n.y0 + (n.h - n.vin * k) / 2; [...n.in].sort((a, b) => G.byId[a.s].yc - G.byId[b.s].yc).forEach((l) => { l.yt = y + l.w / 2; y += l.w; });
    }
    G.k = k;
  }

  /* ---------- a link's spline, resampled at uniform arc length, with a frame (T along, W across = width, N = depth) ---------- */
  function splineOf(G, l, params) {
    const a = G.byId[l.s], b = G.byId[l.t];
    const P0 = [a.x + a.w / 2, l.ys, a.z], P3 = [b.x - b.w / 2, l.yt, b.z], c = (P3[0] - P0[0]) * params.curv;
    const P1 = [P0[0] + c, P0[1], P0[2]], P2 = [P3[0] - c, P3[1], P3[2]];
    const bz = (u) => { const v = 1 - u, A0 = v * v * v, A1 = 3 * v * v * u, A2 = 3 * v * u * u, A3 = u * u * u; return [0, 1, 2].map((i) => A0 * P0[i] + A1 * P1[i] + A2 * P2[i] + A3 * P3[i]); };
    const M = 240, raw = [], cum = [0];
    for (let i = 0; i <= M; i++) raw.push(bz(i / M));
    for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1], raw[i][2] - raw[i - 1][2]));
    const len = cum[M], S = params.seg, pos = [], T = [], W = [], N = [];
    let j = 0;
    for (let i = 0; i <= S; i++) {
      const s = len * i / S; while (j < M - 1 && cum[j + 1] < s) j++;
      const f = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]); pos.push([0, 1, 2].map((q) => lerp(raw[j][q], raw[j + 1][q], f)));
      const t = nrm([raw[j + 1][0] - raw[j][0], raw[j + 1][1] - raw[j][1], raw[j + 1][2] - raw[j][2]]);
      const w = nrm(add([0, 1, 0], t, -t[1])); T.push(t); W.push(w); N.push(cross(t, w));
    }
    return { len, pos, T, W, N, S };
  }
  function frameAt(sp, s) {   // s in [0,1] of arc length
    const x = clamp(s) * sp.S, i = Math.min(sp.S - 1, Math.floor(x)), f = x - i, L3 = (a, b) => [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];
    return { p: L3(sp.pos[i], sp.pos[i + 1]), t: nrm(L3(sp.T[i], sp.T[i + 1])), w: nrm(L3(sp.W[i], sp.W[i + 1])), n: nrm(L3(sp.N[i], sp.N[i + 1])) };
  }
  function depthOf(l, params) { return params.shape === 'tube' ? Math.min(l.w, params.tubeMax) : Math.min(params.thick, Math.max(1.2, l.w)); }

  function bakeRibbon(p, l, params) {
    const sp = l.sp, hw = l.w / 2, hd = depthOf(l, params) / 2, S = sp.S;
    return p.buildGeometry(() => {
      p.noStroke(); p.beginShape(p.TRIANGLES);
      const V = (i, off, n, v) => { const q = add(sp.pos[i], off); p.normal(n[0], n[1], n[2]); p.vertex(q[0], q[1], q[2], i / S, v); };
      if (params.shape === 'tube') {
        const R = params.ring;
        for (let i = 0; i < S; i++) for (let r = 0; r < R; r++) {
          const ring = (ii, rr) => { const a = rr / R * Math.PI * 2, c = Math.cos(a), s = Math.sin(a); const d = add(sp.W[ii].map((x) => x * c), sp.N[ii], s); return { off: add(sp.W[ii].map((x) => x * c * hw), sp.N[ii], s * hd), n: nrm(d) }; };
          const a0 = ring(i, r), a1 = ring(i, r + 1), b0 = ring(i + 1, r), b1 = ring(i + 1, r + 1);
          V(i, a0.off, a0.n, 0); V(i + 1, b0.off, b0.n, 0); V(i + 1, b1.off, b1.n, 0); V(i, a0.off, a0.n, 0); V(i + 1, b1.off, b1.n, 0); V(i, a1.off, a1.n, 0);
        }
      } else {
        const faces = [['N', 1], ['N', -1], ['W', -1], ['W', 1]];   // front, back, top, bottom
        for (let i = 0; i < S; i++) for (const [ax, sg] of faces) {
          const c = (ii, sw, sn) => add(sp.W[ii].map((x) => x * sw * hw), sp.N[ii], sn * hd);
          const corner = ax === 'N' ? [[-1, sg], [1, sg]] : [[sg, -1], [sg, 1]];
          const nm = (ii) => (ax === 'N' ? sp.N[ii] : sp.W[ii]).map((x) => x * sg);
          const [p0, p1] = corner;
          V(i, c(i, p0[0], p0[1]), nm(i), 0); V(i + 1, c(i + 1, p0[0], p0[1]), nm(i + 1), 0); V(i + 1, c(i + 1, p1[0], p1[1]), nm(i + 1), 0);
          V(i, c(i, p0[0], p0[1]), nm(i), 0); V(i + 1, c(i + 1, p1[0], p1[1]), nm(i + 1), 0); V(i, c(i, p1[0], p1[1]), nm(i), 0);
        }
      }
      p.endShape();
    });
  }

  /* ---------- timing: flow model (stage windows) ---------- */
  function timeFlow(G, params, rng) {
    const L = G.L, stages = Math.max(1, L - 1), span = (params.dur - params.lead - params.tail) / stages;
    for (const l of G.links) {
      const st = G.byId[l.s].layer, ws = params.lead + st * span * (1 - params.overlap);
      const we = ws + span, travel = params.travel || Math.min(2.2, span * 0.45);
      l.ws = ws; l.growEnd = ws + params.grow; l.travel = travel;
      const n = Math.ceil(l.q / params.unit), d0 = ws + params.grow * 0.4, d1 = Math.max(d0 + 0.01, we - travel), dep = [];
      for (let m = 0; m < n; m++) dep.push(d0 + (m + 0.5 + (rng() - 0.5) * params.jitter) / n * (d1 - d0));
      dep.sort((a, b) => a - b);
      l.marks = dep.map((d, m) => ({ dep: d, arr: d + travel, lane: (((m * 0.6180339887) + rng() * 0.15) % 1) * 2 - 1, units: Math.min(params.unit, l.q - m * params.unit) }));
    }
  }

  /* ---------- timing: queue model (seeded Poisson arrivals, FIFO, one server at mu per second) ---------- */
  function buildQueue(params, data, rng) {
    const Qp = params.queue, arr = [];
    if (data && Array.isArray(data.arrivals)) arr.push(...data.arrivals.map(Number).sort((a, b) => a - b));
    else { let t = Qp.t0; for (;;) { t += -Math.log(1 - rng()) / Qp.lambda; if (t > Qp.t1) break; arr.push(t); } }
    const svc = 1 / Qp.mu, units = []; let free = -1e9;
    arr.forEach((a, k) => { const r = a + Qp.travel1, s = Math.max(r, free); free = s + svc; units.push({ k, a, r, s, d: s + Qp.travel2, lane: (((k * 0.6180339887) + rng() * 0.15) % 1) * 2 - 1 }); });
    const served = units.filter((u) => u.s <= params.dur).length, lab = Object.assign({ src: 'ARRIVALS', queue: 'IN QUEUE', done: 'SERVED' }, (data && data.labels) || {});
    const G = normData({ nodes: [{ id: 'src', label: lab.src, layer: 0, role: 'ink', show: 'arrived' }, { id: 'queue', label: lab.queue, layer: 1, role: 'muted', show: 'waiting', slabW: Qp.queueW }, { id: 'done', label: lab.done, layer: 2, role: 'accent', show: 'in' }],
      links: [{ s: 'src', t: 'queue', q: units.length, role: 'muted' }, { s: 'queue', t: 'done', q: Math.max(1, served), role: 'accent' }] });
    G.units = units; G.served = served; return G;
  }
  const nBefore = (arr, t, key) => { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m][key] <= t) lo = m + 1; else hi = m; } return lo; };

  /* ---------- count(t): what is on screen, as counts (a film captions these) ---------- */
  function count(t, st, params) {
    const G = st.G, out = { t, riding: 0, waiting: 0, marks: 0, landed: {}, links: [], unit: params.unit };
    if (params.model === 'queue') {
      const U = G.units, R = nBefore(U, t, 'r'), S = nBefore(U, t, 's'), D = nBefore(U, t, 'd'), Aa = nBefore(U, t, 'a');
      out.arrived = Aa; out.inQueue = R; out.waiting = Math.max(0, R - S); out.started = S; out.served = D; out.riding = (Aa - R) + (S - D);
      out.headWait = out.waiting > 0 ? t - U[S].r : 0;
      out.delay = U.reduce((a, u) => a + Math.max(0, Math.min(t, u.s) - u.r) * (t >= u.r ? 1 : 0), 0);   // unit-seconds spent waiting so far
      out.landed = { src: Aa, queue: out.waiting, done: D }; out.marks = out.riding + out.waiting;
      out.links = [{ s: 'src', t: 'queue', q: U.length, landed: R }, { s: 'queue', t: 'done', q: G.served, landed: D }];
      return out;
    }
    for (const n of G.nodes) out.landed[n.id] = n.in.length ? 0 : n.vout;
    for (const l of G.links) {
      const nd = nBefore(l.marks, t, 'dep'), na = nBefore(l.marks, t, 'arr'), u = Math.min(l.q, na * params.unit);
      out.riding += nd - na; out.landed[l.t] += u; out.links.push({ s: l.s, t: l.t, q: l.q, landed: u, riding: nd - na });
    }
    out.marks = out.riding; return out;
  }

  /* ---------- cameras ---------- */
  function mkCam(p, k) { const c = p.createCamera(); c.camera(k.eye[0], k.eye[1], k.eye[2], k.look[0], k.look[1], k.look[2], 0, 1, 0); c.perspective(k.fov || 0.7, p.width / p.height, 8, 8000); return c; }
  function pathAt(keys, u) { let i = 0; while (i < keys.length - 2 && u > keys[i + 1].t) i++; const a = keys[i], b = keys[i + 1], x = clamp((u - a.t) / (b.t - a.t)); return { i, amt: smooth(x), a, b }; }

  /* ---------- fonts: the pack's faces from window.ARSENAL_FONTS (TTF data URLs), cached per p5 instance ---------- */
  async function faceFor(p, spec, fallback) {
    const F = window.ARSENAL_FONTS || {}, key = spec ? spec.family + '|' + spec.weight : '', use = F[key] ? key : fallback;
    const cache = (p.__glrFonts = p.__glrFonts || {});
    if (!F[use]) return { font: null, key: null, want: key };
    if (!cache[use]) cache[use] = p.loadFont(F[use]);
    return { font: await cache[use], key: use, want: key };
  }

  /* ---------- drawing ---------- */
  function useShader(p, st, tk, params) {
    const sh = st.sh; p.shader(sh);
    sh.setUniform('uBg', rgb(p, tk.color.bg)); sh.setUniform('uKeyDir', nrm([-0.35, 0.6, -0.7]));
    sh.setUniform('uAmb', params.amb); sh.setUniform('uKey', 1.05 - params.amb); sh.setUniform('uFlat', 0);
    sh.setUniform('uGrow', 9); sh.setUniform('uStripe', 0); sh.setUniform('uLen', 1); sh.setUniform('uPhase', 0);
    sh.setUniform('uFog0', params.fog[0]); sh.setUniform('uFog1', params.fog[1]); sh.setUniform('uFogK', params.fogK);
    return sh;
  }
  function slab(p, sh, n, h, col, D, dz) {
    if (h <= 0.01) return; sh.setUniform('uColor', rgb(p, col));
    p.push(); p.translate(n.x, n.y0 + n.h - h / 2, n.z); p.box(n.w + dz, h, D + dz); p.pop();
  }

  function drawMarks(p, sh, st, t, params, tk) {
    const G = st.G, ms = params.markSize, lift = 0.9, tris = [];
    const quad = (c, a, b, n) => { const P = (sa, sb) => add(add(c, a, sa * ms / 2), b, sb * ms / 2); tris.push([P(-1, -1), P(1, -1), P(1, 1), n], [P(-1, -1), P(1, 1), P(-1, 1), n]); };
    const onRibbon = (l, s, lane) => {
      const f = frameAt(l.sp, s), hw = l.w / 2, hd = depthOf(l, params) / 2, room = Math.max(0, hw - ms * 0.7), y = lane * room;
      const zf = params.shape === 'tube' ? hd * Math.sqrt(Math.max(0, 1 - (y / Math.max(hw, 1e-6)) ** 2)) : hd;
      quad(add(add(f.p, f.w, y), f.n, zf + lift), f.t, f.w, f.n);
    };
    if (params.model === 'queue') {
      const U = G.units, [l1, l2] = G.links, q = G.byId.queue, cell = ms * 1.55, cols = Math.max(1, Math.floor((q.w - 4) / cell));
      const S = nBefore(U, t, 's');
      for (const u of U) {
        if (t >= u.a && t < u.r) onRibbon(l1, (t - u.a) / (u.r - u.a), u.lane);
        else if (t >= u.r && t < u.s) { const rk = u.k - S, cx = q.x - q.w / 2 + 2 + cell * ((rk % cols) + 0.5), cy = q.y0 + q.h - cell * (Math.floor(rk / cols) + 0.5); quad([cx, cy, q.z + params.slabD / 2 + lift + 0.6], [1, 0, 0], [0, 1, 0], [0, 0, 1]); }
        else if (t >= u.s && t < u.d) onRibbon(l2, (t - u.s) / (u.d - u.s), u.lane);
      }
    } else {
      for (const l of G.links) for (const m of l.marks) { if (m.dep > t) break; if (t < m.arr) onRibbon(l, (t - m.dep) / l.travel, m.lane); }
    }
    if (!tris.length) return 0;
    sh.setUniform('uColor', rgb(p, role(tk, params.markRole))); sh.setUniform('uFlat', params.markFlat); sh.setUniform('uGrow', 9);
    p.noStroke(); p.beginShape(p.TRIANGLES);
    for (const [a, b, c, n] of tris) { p.normal(n[0], n[1], n[2]); p.vertex(a[0], a[1], a[2], 0, 0); p.vertex(b[0], b[1], b[2], 0, 0); p.vertex(c[0], c[1], c[2], 0, 0); }
    p.endShape(); sh.setUniform('uFlat', 0);
    return tris.length / 2;
  }

  function labels(p, st, tk, t, params, cnt) {
    const G = st.G, W = p.width, H = p.height, f = st.fonts, pins = [];
    for (const n of G.nodes) {
      const side = n.layer === 0 ? 'left' : n.layer === G.L - 1 ? 'right' : 'top';
      const at = side === 'left' ? [n.x - n.w / 2 - 8, n.yc, n.z] : side === 'right' ? [n.x + n.w / 2 + 8, n.yc, n.z] : [n.x, n.y0 - 8, n.z];
      const v = p.worldToScreen(new p5.Vector(at[0], at[1], at[2]));
      const show = n.show || (n.in.length ? 'in' : 'total'), val = cnt.landed[n.id];
      pins.push({ id: n.id, x: v.x, y: v.y, side, big: fmt(val), small: n.label, role: n.role || 'ink', show });
    }
    const out = { pins, readout: null };
    const R = params.readout || {};
    if (params.model === 'queue') out.readout = { big: fmt(cnt.waiting), small: (params.queue.say || 'WAITING NOW · {arr} ARRIVED · {srv} SERVED · HEAD OF LINE {hw} S').replace('{arr}', fmt(cnt.arrived)).replace('{srv}', fmt(cnt.served)).replace('{hw}', cnt.headWait.toFixed(1)) };
    else if (R.node && G.byId[R.node]) { const tot = G.nodes.filter((n) => !n.in.length).reduce((a, n) => a + n.vout, 0); out.readout = { big: fmt(cnt.landed[R.node]), small: 'OF ' + fmt(tot) + ' ' + (params.unitName || 'UNITS') + ' · ' + G.byId[R.node].label }; }
    out.unitLine = '1 MARK = ' + fmt(params.unit) + ' ' + (params.unit === 1 ? (params.unitSingular || 'UNIT') : (params.unitName || 'UNITS')) + ' · WIDTH = QUANTITY';
    if (params.labels === 'none' || !f.disp) return out;
    p.push(); p.resetMatrix(); p.resetShader(); p.noLights(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    const ox = -W / 2, oy = -H / 2;
    const txt = (s, x, y, size, col, font, al, op) => {
      const c = p.color(col); c.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(c); p.textFont(font); p.textSize(size); p.textAlign(p.LEFT, p.BASELINE);
      const w = p.textWidth(s), x0 = al === 'right' ? x - w : al === 'center' ? x - w / 2 : x; p.text(s, x0 + ox, y + oy, 2000); return w;
    };
    const plate = (x, y, w, h) => { const c = p.color(tk.color.bg); c.setAlpha(205); p.noStroke(); p.fill(c); p.rect(x + ox, y + oy, w, h); };
    for (const q of pins) {
      if (q.x < -40 || q.x > W + 40 || q.y < -40 || q.y > H + 40) continue;
      p.textFont(f.disp); p.textSize(params.pinBig); const wb = p.textWidth(q.big); p.textFont(f.mono); p.textSize(12); const ws = p.textWidth(q.small);
      const ww = Math.max(wb, ws), al = q.side === 'left' ? 'right' : q.side === 'right' ? 'left' : 'center';
      const xa = al === 'right' ? q.x - ww : al === 'center' ? q.x - ww / 2 : q.x, yb = q.side === 'top' ? q.y - 18 : q.y + 2;
      plate(xa - 4, yb - params.pinBig * 0.86 - 2, ww + 8, params.pinBig * 0.86 + 22);
      txt(q.big, al === 'right' ? q.x : al === 'center' ? q.x : q.x, yb, params.pinBig, role(tk, q.role === 'muted' ? 'ink' : q.role), f.disp, al);
      txt(q.small, q.x, yb + 15, 12, tk.color.muted, f.mono, al);
    }
    if (out.readout) { txt(out.readout.big, 36, H - 58, 64, tk.color.accent, f.disp, 'left'); txt(out.readout.small, 38, H - 32, 13, tk.color.muted, f.mono, 'left'); }
    txt(out.unitLine, 36, 40, 12, tk.color.muted, f.mono, 'left');
    p.pop();
    return out;
  }

  A.patterns['gl-ribbons'] = {
    id: 'gl-ribbons', atlas: ['webgl-mode', 'build-geometry', 'shape-curves', 'spline-vertex', 'vertex-property', 'world-to-screen', 'camera-slerp', 'p5-shader', 'gpu-instancing', 'frontier-2026'],
    renderer: 'webgl',
    params: {
      model: 'flow', shape: 'band', data: null, dur: 12,
      X: 640, H: 340, gap: 22, k: 0, slabW: 22, slabD: 34, zSpread: 0, curv: 0.5, thick: 18, tubeMax: 60, seg: 40, ring: 12,
      unit: 1, unitName: 'UNITS', unitSingular: 'UNIT', markSize: 3.2, markRole: 'chalk', markFlat: 0.35,
      lead: 0.5, tail: 1.6, grow: 0.9, overlap: 0, travel: 0, jitter: 0.9,
      stripes: 0, stripeLen: 26, stripeSpeed: 0.6, amb: 0.62, fog: [500, 1400], fogK: 0.35, ribbonMix: 0.8,
      queue: { lambda: 8, mu: 5.2, t0: 0.4, t1: 9.0, travel1: 1.3, travel2: 1.1, queueW: 84 },
      readout: null, labels: 'gl', pinBig: 26, clear: true,
      cam: [{ t: 0, eye: [-160, -150, 820], look: [0, 0, 0], fov: 0.66 }, { t: 1, eye: [360, -250, 660], look: [30, 0, 0], fov: 0.66 }],
    },
    variants: [
      { name: 'funnel-two-layer', params: {
        data: { nodes: [{ id: 'visit', label: 'VISITORS', layer: 0, role: 'ink' }, { id: 'signup', label: 'SIGNED UP', layer: 1, role: 'accent' }, { id: 'left', label: 'LEFT', layer: 1, role: 'muted' }],
          links: [['visit', 'signup', 320, 'accent'], ['visit', 'left', 680, 'muted']] },
        X: 520, unitName: 'VISITORS', unitSingular: 'VISITOR', readout: { node: 'signup' }, markSize: 2.6 } },
      { name: 'sankey-multistage', params: {
        data: { nodes: [
          { id: 'req', label: 'REQUESTS', layer: 0, role: 'ink' },
          { id: 'auto', label: 'AUTO-ROUTED', layer: 1, role: 'muted' }, { id: 'man', label: 'MANUAL', layer: 1, role: 'muted' },
          { id: 'res', label: 'RESOLVED', layer: 2, role: 'muted' }, { id: 'rew', label: 'REWORK', layer: 2, role: 'accent2' }, { id: 'esc', label: 'ESCALATED', layer: 2, role: 'accent2' },
          { id: 'closed', label: 'CLOSED', layer: 3, role: 'muted' }, { id: 'reo', label: 'REOPENED', layer: 3, role: 'accent' }],
          links: [['req', 'auto', 1500, 'muted'], ['req', 'man', 900, 'muted'],
            ['auto', 'res', 1200, 'muted'], ['auto', 'rew', 250, 'accent2'], ['auto', 'esc', 50, 'accent2'],
            ['man', 'res', 500, 'muted'], ['man', 'rew', 250, 'accent2'], ['man', 'esc', 150, 'accent2'],
            ['res', 'closed', 1700, 'muted'], ['rew', 'closed', 300, 'muted'], ['rew', 'reo', 200, 'accent'], ['esc', 'closed', 120, 'muted'], ['esc', 'reo', 80, 'accent']] },
        X: 700, H: 330, zSpread: 70, unit: 10, unitName: 'REQUESTS', readout: { node: 'reo' }, stripes: 0.7, pinBig: 22, travel: 1.5,
        cam: [{ t: 0, eye: [-520, -200, 600], look: [0, -10, 0], fov: 0.72 }, { t: 0.5, eye: [-60, -170, 860], look: [0, 0, 0], fov: 0.66 }, { t: 1, eye: [560, -300, 560], look: [0, 0, 0], fov: 0.72 }] } },
      { name: 'queue-arrivals', params: {
        model: 'queue', X: 560, H: 320, k: 2.6, gap: 22, slabD: 30, unitName: 'CUSTOMERS', unitSingular: 'CUSTOMER', markSize: 6, markFlat: 0.6, stripes: 0.5,
        cam: [{ t: 0, eye: [-40, -80, 780], look: [0, 0, 0], fov: 0.64 }, { t: 1, eye: [300, -230, 640], look: [20, 0, 0], fov: 0.64 }] } },
      { name: 'funnel-tubes', params: {
        shape: 'tube', tubeMax: 70, seg: 32, ring: 10,
        data: [['VISITORS', 'SIGNED UP', 320, 'accent'], ['VISITORS', 'LEFT', 680, 'muted'], ['SIGNED UP', 'PAID', 48, 'accent'], ['SIGNED UP', 'LAPSED', 272, 'muted']],
        X: 620, H: 300, gap: 40, unitName: 'VISITORS', unitSingular: 'VISITOR', readout: { node: 'PAID' }, markSize: 2.6, labels: 'gl',
        cam: [{ t: 0, eye: [-420, -120, 640], look: [0, 0, 0], fov: 0.7 }, { t: 1, eye: [300, -320, 700], look: [0, 0, 0], fov: 0.7 }] } },
    ],
    count,
    async setup(p, ctx, params) {
      const seed = ctx.seed == null ? 11 : ctx.seed, rng = mulberry32(seed), tk = ctx.tokens || (A.brands && A.brands['ceti-dark']);
      const G = params.model === 'queue' ? buildQueue(params, params.data, rng) : normData(params.data);
      layout(G, params);
      for (const l of G.links) l.sp = splineOf(G, l, params);
      if (params.model !== 'queue') timeFlow(G, params, rng);
      else { const [l1, l2] = G.links; l1.ws = 0; l1.growEnd = params.queue.t0 + 0.2; l2.ws = 0; l2.growEnd = (G.units[0] ? G.units[0].s : 1) + 0.05; l1.travel = params.queue.travel1; l2.travel = params.queue.travel2; }
      p.push(); p.textureMode(p.NORMAL); for (const l of G.links) l.geom = bakeRibbon(p, l, params); p.textureMode(p.IMAGE); p.pop();
      const st = { seed, G, sh: p.createShader(VERT, FRAG), work: p.createCamera(), hud: p.createCamera(), fonts: {}, fontNote: [] };
      st.cams = params.cam.map((k) => mkCam(p, k));
      if (ctx.fonts && ctx.fonts.disp) st.fonts = ctx.fonts;
      else if (params.labels !== 'none') {
        const d = await faceFor(p, tk && tk.type.disp, 'Big Shoulders Display|600'), m = await faceFor(p, tk && tk.type.mono, 'IBM Plex Mono|400');
        st.fonts = { disp: d.font, mono: m.font || d.font };
        if (d.key !== d.want) st.fontNote.push('disp ' + d.want + ' -> ' + d.key); if (m.key !== m.want) st.fontNote.push('mono ' + m.want + ' -> ' + m.key);
      }
      return st;
    },
    draw(p, t, st, params, tk) {
      const u = clamp(t / params.dur), G = st.G;
      if (params.clear !== false) p.background(tk.color.bg);
      const path = pathAt(params.cam, u), w = st.work;
      w.slerp(st.cams[path.i], st.cams[path.i + 1], path.amt);
      w.perspective(lerp(path.a.fov || 0.7, path.b.fov || 0.7, path.amt), p.width / p.height, 8, 8000);
      p.setCamera(w); p.noLights();
      const sh = useShader(p, st, tk, params), bg = p.color(tk.color.bg), cnt = count(t, st, params);
      // slabs: a ghost at full height, the role-coloured fill rising with what has landed (sources start full)
      for (const n of G.nodes) {
        const col = p.color(role(tk, n.role || 'ink')), ghost = p.lerpColor(bg, p.color(tk.color.muted), 0.28);
        slab(p, sh, n, n.h, ghost, params.slabD, 0);
        const v = n.show === 'waiting' ? 0 : n.show === 'arrived' ? cnt.landed[n.id] : n.in.length ? cnt.landed[n.id] : n.vout;
        slab(p, sh, n, n.h * clamp(v / Math.max(1e-9, n.v)), p.lerpColor(bg, col, n.role === 'muted' ? 0.75 : 0.95), params.slabD, 1.2);
      }
      // ribbons: baked, grown along arc length in the fragment shader, stripes travel on t
      for (const l of G.links) {
        const grow = clamp((t - l.ws) / Math.max(1e-6, l.growEnd - l.ws)); if (grow <= 0) continue;
        sh.setUniform('uColor', rgb(p, p.lerpColor(bg, p.color(role(tk, l.role || G.byId[l.t].role || 'muted')), params.ribbonMix)));
        sh.setUniform('uGrow', smooth(grow) * 1.0001); sh.setUniform('uStripe', params.stripes);
        sh.setUniform('uLen', l.sp.len / params.stripeLen); sh.setUniform('uPhase', t * params.stripeSpeed * (l.sp.len / params.stripeLen) / Math.max(0.5, l.travel * 4));
        p.model(l.geom);
      }
      sh.setUniform('uStripe', 0);
      const drawn = drawMarks(p, sh, st, t, params, tk);
      p.resetShader();
      const lab = labels(p, st, tk, t, params, cnt);
      cnt.drawnMarks = drawn; cnt.pins = lab.pins; cnt.readout = lab.readout; cnt.fontNote = st.fontNote;
      return cnt;
    },
  };
})();
