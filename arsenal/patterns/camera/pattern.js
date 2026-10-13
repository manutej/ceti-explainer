// arsenal/patterns/camera/pattern.js · 2D camera choreography on Canvas2D (renderer p2d)
// Atlas: camera-choreography, camera-slerp (WEBGL cousin), world-to-screen, easing-functions, derived-geometry.
// Camera = tracks {x, y, zoom} (+ focus rect/alpha) keyed on a timeline. Pure function of t. Roles only (tokens).
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  // ---------- small maths ----------
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, u) => a + (b - a) * u;
  const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const EASE = {
    linear: u => u,
    quad: u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2,
    cubic: u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2,
    sine: u => (1 - Math.cos(Math.PI * u)) / 2,
    expo: u => u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2
  };

  // ---------- the camera model: keyed tracks ----------
  // key = { t, x, y, zoom, fx, fy, fw, fh, fa, label, ease?, cut? }.  Between keys i -> j (j.cut false) every channel
  // follows u = ease(j.ease || default)((t - i.t)/(j.t - i.t)); zoom is tweened in LOG space; a cut holds key i
  // until j.t and then jumps to j.  Hold = two keys with the same values.
  function sample(keys, t, defEase) {
    const n = keys.length; let a, b, u = 0, label;
    if (t <= keys[0].t) { a = b = keys[0]; label = a.label; }
    else if (t >= keys[n - 1].t) { a = b = keys[n - 1]; label = a.label; }
    else {
      let i = 0; while (i < n - 2 && keys[i + 1].t <= t) i++;
      a = keys[i]; b = keys[i + 1];
      if (b.cut) { b = a; label = a.label; }
      else { const raw = (t - a.t) / (b.t - a.t); u = (EASE[b.ease || defEase] || EASE.cubic)(clamp(raw, 0, 1)); label = raw >= .5 ? b.label : a.label; }
    }
    return {
      x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), u)),
      fx: lerp(a.fx, b.fx, u), fy: lerp(a.fy, b.fy, u), fw: lerp(a.fw, b.fw, u), fh: lerp(a.fh, b.fh, u), fa: lerp(a.fa, b.fa, u),
      label: label, moving: u > 0 && u < 1
    };
  }
  function keyBuilder() {
    const keys = []; let last = { fx: 0, fy: 0, fw: 1, fh: 1, fa: 0, label: '' };
    const api = { keys, key(t, x, y, zoom, o) { const k = Object.assign({}, { fx: last.fx, fy: last.fy, fw: last.fw, fh: last.fh, fa: last.fa, label: last.label }, { t, x, y, zoom }, o || {}); keys.push(k); last = k; return api; } };
    return api;
  }
  // mode 'cut': every camera move becomes a cut at the middle of its window (focus jumps with it).
  function toCuts(keys) {
    return keys.map((k, i) => {
      const p = keys[i - 1]; if (!p || k.cut) return k;
      if (p.x === k.x && p.y === k.y && p.zoom === k.zoom) return k;
      return Object.assign({}, k, { t: (p.t + k.t) / 2, cut: true });
    });
  }

  // ---------- worldToScreen / screenToWorld (view centre at the middle of the canvas) ----------
  function worldToScreen(x, y, cam, W, H) { return { x: (x - cam.x) * cam.zoom + W / 2, y: (y - cam.y) * cam.zoom + H / 2 }; }
  function screenToWorld(sx, sy, cam, W, H) { return { x: (sx - W / 2) / cam.zoom + cam.x, y: (sy - H / 2) / cam.zoom + cam.y }; }

  // ---------- text in screen space (legibility rule) ----------
  function fontOf(T, role, size, weight) { const f = T.type[role]; return `${weight || f.weight} ${size}px "${f.family}", sans-serif`; }
  function txt(ctx, T, s, x, y, o) {
    ctx.font = fontOf(T, o.role || 'body', Math.max(o.min || 0, o.size || 13), o.weight);
    ctx.fillStyle = T.color[o.fill || 'ink']; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
    ctx.globalAlpha = o.a == null ? 1 : o.a; ctx.fillText(s, x, y); ctx.globalAlpha = 1;
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }

  // ---------- scenes ----------
  const SCENES = {};

  // ===== map: three clusters, three zoom-ins, a pull-back =====
  SCENES.map = {
    build(p, rnd, P, W, H) {
      const WW = 1920, WH = 1080, R = 150;
      const defs = [
        { cx: 520, cy: 360, c: 'accent', title: 'COLLECT', names: ['Sensors', 'Logs', 'Forms', 'Feeds', 'Scans', 'Surveys'] },
        { cx: 1420, cy: 400, c: 'accent2', title: 'SHAPE', names: ['Clean', 'Join', 'Label', 'Dedupe', 'Sample', 'Split'] },
        { cx: 960, cy: 830, c: 'ink', title: 'SERVE', names: ['Index', 'Cache', 'Rank', 'Route', 'Guard', 'Report'] }];
      defs.forEach(d => {
        d.nodes = d.names.map((nm, i) => { const a = i / 6 * Math.PI * 2 + rnd() * .6, r = 55 + rnd() * 80; return { x: d.cx + Math.cos(a) * r, y: d.cy + Math.sin(a) * r, name: nm }; });
        d.edges = []; const seen = {};
        d.nodes.forEach((n, i) => {
          const ds = d.nodes.map((m, j) => [j, Math.hypot(m.x - n.x, m.y - n.y)]).filter(e => e[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, 2);
          ds.forEach(e => { const k = Math.min(i, e[0]) + '-' + Math.max(i, e[0]); if (!seen[k]) { seen[k] = 1; d.edges.push([i, e[0]]); } });
        });
      });
      const near = (d, o) => d.nodes.reduce((b, n) => Math.hypot(n.x - o.cx, n.y - o.cy) < Math.hypot(b.x - o.cx, b.y - o.cy) ? n : b);
      const links = [[0, 1], [1, 2], [2, 0]].map(([i, j]) => [near(defs[i], defs[j]), near(defs[j], defs[i])]);
      const wide = { x: WW / 2, y: WH / 2, zoom: .46 }, Z = 1.5, pad = R + 18;
      const kb = keyBuilder().key(0, wide.x, wide.y, wide.zoom, { label: 'The territory' }).key(1, wide.x, wide.y, wide.zoom);
      let t = 1;
      defs.forEach((d, i) => {
        const f = { fx: d.cx - pad, fy: d.cy - pad, fw: pad * 2, fh: pad * 2, fa: 1, label: '0' + (i + 1) + ' · ' + d.title };
        kb.key(t + 1.4, d.cx, d.cy, Z, f).key(t + 2.4, d.cx, d.cy, Z); t += 2.4;
      });
      kb.key(t + 1.8, wide.x, wide.y, wide.zoom, { fa: 0, label: 'Pulled back' }).key(P.dur, wide.x, wide.y, wide.zoom);
      return { WW, WH, R, defs, links, keys: kb.keys, drift: { vx: 3, vy: 1.5, vz: .004 } };
    },
    world(ctx, S, cam, T, P) {
      const z = cam.zoom, w = S.scene, c = T.color, px = 1 / z;
      ctx.lineWidth = px; ctx.strokeStyle = c.line; ctx.globalAlpha = .55;
      ctx.beginPath(); for (let g = -240; g <= 2160; g += 120) { ctx.moveTo(g, -240); ctx.lineTo(g, 1320); if (g <= 1320) { ctx.moveTo(-240, g); ctx.lineTo(2160, g); } }
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.lineWidth = 2 * px; ctx.strokeStyle = c.line; ctx.strokeRect(0, 0, w.WW, w.WH);
      w.defs.forEach(d => {
        circle(ctx, d.cx, d.cy, w.R); ctx.fillStyle = c.panel; ctx.fill(); ctx.lineWidth = 1.5 * px; ctx.strokeStyle = c[d.c]; ctx.globalAlpha = .6; ctx.stroke(); ctx.globalAlpha = 1;
        ctx.lineWidth = 1.2 * px; ctx.strokeStyle = c.muted; ctx.beginPath();
        d.edges.forEach(e => { ctx.moveTo(d.nodes[e[0]].x, d.nodes[e[0]].y); ctx.lineTo(d.nodes[e[1]].x, d.nodes[e[1]].y); }); ctx.stroke();
      });
      ctx.setLineDash([7 * px, 5 * px]); ctx.lineWidth = 1.4 * px; ctx.strokeStyle = c.muted; ctx.beginPath();
      w.links.forEach(l => { ctx.moveTo(l[0].x, l[0].y); ctx.lineTo(l[1].x, l[1].y); }); ctx.stroke(); ctx.setLineDash([]);
      w.defs.forEach(d => d.nodes.forEach(n => { circle(ctx, n.x, n.y, 6 * px); ctx.fillStyle = c.bg; ctx.fill(); circle(ctx, n.x, n.y, 4.2 * px); ctx.fillStyle = c[d.c]; ctx.fill(); }));
    },
    labels(ctx, S, cam, T, P, W, H) {
      const w = S.scene, m = P.labelMin, c = T.color;
      w.defs.forEach(d => {
        const s = worldToScreen(d.cx, d.cy - w.R, cam, W, H), ty = s.y - 10; // sits on the ring
        txt(ctx, T, d.title, s.x, Math.max(ty, 96), { role: 'disp', size: 20, min: m, fill: d.c, align: 'center' });
        const a = smooth(.9, 1.3, cam.zoom);
        d.nodes.forEach(n => { const q = worldToScreen(n.x, n.y, cam, W, H); if (q.x < -80 || q.x > W + 80 || q.y < -20 || q.y > H + 20) return; txt(ctx, T, n.name, q.x + 9, q.y - 8, { role: 'mono', size: 11, min: m, fill: 'ink', a }); });
      });
    }
  };

  // ===== timeline: constant-speed pan, labels pinned (clamped on screen, never scaled) =====
  SCENES.timeline = {
    build(p, rnd, P, W, H) {
      const L = 5400, x0 = 480, x1 = L - 480, names = ['Founding', 'First draft', 'Spin-out', 'Merger', 'Open data', 'Rebrand', 'Standard', 'Fork', 'Archive', 'Reboot', 'Audit', 'Sunset', 'Revival', 'Ledger'];
      const ev = []; let x = 330;
      names.forEach((nm, i) => { x += 300 + rnd() * 160; if (x < L - 200) ev.push({ x, name: nm, dy: (i % 2 ? 1 : -1) * (70 + rnd() * 110), year: Math.round(1950 + x / 60) }); });
      const kb = keyBuilder().key(0, x0, -40, 1, { label: 'Timeline' }).key(P.dur, x1, -40, 1, { ease: 'linear' });
      return { L, ev, keys: kb.keys, drift: { vx: 0, vy: 0, vz: 0 }, speed: (x1 - x0) / P.dur, y0: -40 };
    },
    world(ctx, S, cam, T, P, W, H) {
      const z = cam.zoom, w = S.scene, c = T.color, px = 1 / z;
      const x0 = cam.x - W / 2 / z - 40, x1 = cam.x + W / 2 / z + 40;
      ctx.lineWidth = 2 * px; ctx.strokeStyle = c.muted; ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x1, 0); ctx.stroke();
      ctx.lineWidth = px; ctx.strokeStyle = c.line; ctx.beginPath();
      for (let g = Math.floor(x0 / 60) * 60; g <= x1; g += 60) { const maj = Math.round(g / 60 + 1950) % 10 === 0; ctx.moveTo(g, maj ? -26 : -9); ctx.lineTo(g, maj ? 26 : 9); }
      ctx.stroke();
      ctx.lineWidth = 1.5 * px; ctx.strokeStyle = c.accent; ctx.beginPath();
      w.ev.forEach(e => { if (e.x < x0 || e.x > x1) return; ctx.moveTo(e.x, 0); ctx.lineTo(e.x, e.dy); }); ctx.stroke();
      w.ev.forEach(e => { if (e.x < x0 || e.x > x1) return; circle(ctx, e.x, 0, 5.5 * px); ctx.fillStyle = c.bg; ctx.fill(); circle(ctx, e.x, 0, 4 * px); ctx.fillStyle = c.accent; ctx.fill(); });
    },
    pinned(ctx, S, cam, T, P, W, H) {
      txt(ctx, T, String(Math.round(1950 + cam.x / 60)), W - 28, 70, { role: 'disp', size: 56, min: P.labelMin, fill: 'accent', align: 'right' });
      ctx.strokeStyle = T.color.accent; ctx.globalAlpha = .7; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(W / 2, H / 2 + 40 - 30); ctx.lineTo(W / 2, H / 2 + 40 + 30); ctx.stroke(); ctx.globalAlpha = 1;
    },
    labels(ctx, S, cam, T, P, W, H) {
      const w = S.scene, m = P.labelMin, c = T.color, ay = worldToScreen(0, 0, cam, W, H).y;
      for (let g = Math.ceil((cam.x - W / 2 / cam.zoom) / 600) * 600; g < cam.x + W / 2 / cam.zoom; g += 600) {
        const q = worldToScreen(g, 0, cam, W, H); txt(ctx, T, String(1950 + g / 60), q.x, ay + 46, { role: 'mono', size: 11, min: m, fill: 'muted', align: 'center' });
      }
      w.ev.forEach(e => {
        const q = worldToScreen(e.x, e.dy, cam, W, H), top = e.dy < 0;
        ctx.font = fontOf(T, 'body', 14); const tw = Math.max(ctx.measureText(e.name).width, 34), half = tw / 2 + 4, lo = 20 + half, hi = W - 20 - half;
        if (q.x < lo - 150 || q.x > hi + 150) return;
        const x = clamp(q.x, lo, hi), pinned = x !== q.x;
        const yName = top ? q.y - 22 : q.y + 34, yYear = top ? q.y - 8 : q.y + 18;
        if (pinned) { ctx.strokeStyle = c.accent; ctx.lineWidth = 1; ctx.globalAlpha = .5; ctx.beginPath(); ctx.moveTo(x, q.y); ctx.lineTo(q.x < x ? x - half - 6 : x + half + 6, q.y); ctx.stroke(); ctx.globalAlpha = 1; }
        txt(ctx, T, e.name, x, yName, { role: 'body', size: 14, min: m, fill: 'ink', align: 'center' });
        txt(ctx, T, String(e.year), x, yYear, { role: 'mono', size: 11, min: m, fill: 'accent', align: 'center' });
      });
    }
  };

  // ===== grid: 100 cells, zoom into one, focus mask, then a hard cut back out =====
  SCENES.grid = {
    build(p, rnd, P, W, H) {
      const N = 10, cell = 100, gap = 14, step = cell + gap, size = N * step - gap, cells = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) cells.push({ r, c, v: Math.round(10 + rnd() * 89), bars: [0, 1, 2, 3, 4].map(() => .15 + rnd() * .8) });
      const tr = 3, tc = 6, tx = tc * step + cell / 2, ty = tr * step + cell / 2, mid = size / 2, pad = 10;
      const rect = { fx: tc * step - pad, fy: tr * step - pad, fw: cell + 2 * pad, fh: cell + 2 * pad };
      const kb = keyBuilder().key(0, mid, mid, .44, { label: '100 cells' }).key(.8, mid, mid, .44)
        .key(2, mid, mid, .44, Object.assign({ fa: 1, label: 'One cell, r' + (tr + 1) + ' · c' + (tc + 1) }, rect))
        .key(2.4, mid, mid, .44).key(5.2, tx, ty, 4.6).key(8.4, tx, ty, 4.6)
        .key(8.4 + 0.001, mid, mid, .44, { fa: 0, cut: true, label: 'Cut back: the whole grid' }).key(P.dur, mid, mid, .44);
      return { N, cell, step, size, cells, tr, tc, keys: kb.keys, drift: { vx: 1.2, vy: .6, vz: .008, t0: 5.2, t1: 8.4 } };
    },
    world(ctx, S, cam, T, P, W, H) {
      const z = cam.zoom, w = S.scene, c = T.color, px = 1 / z, tgt = w.tr * w.N + w.tc;
      w.cells.forEach((q, i) => {
        const x = q.c * w.step, y = q.r * w.step, s = worldToScreen(x, y, cam, W, H), sz = w.cell * z;
        if (s.x > W || s.y > H || s.x + sz < 0 || s.y + sz < 0) return; // cull by projected box
        const on = i === tgt;
        ctx.beginPath(); ctx.roundRect(x, y, w.cell, w.cell, 6); ctx.fillStyle = c.panel; ctx.fill();
        ctx.lineWidth = (on ? 2 : 1) * px; ctx.strokeStyle = on ? c.accent : c.line; ctx.stroke();
        const bw = w.cell * .12, gx = w.cell * .08;
        ctx.fillStyle = on ? c.accent : c.muted; ctx.globalAlpha = on ? 1 : .8;
        q.bars.forEach((b, k) => { const bh = b * w.cell * .5; ctx.fillRect(x + w.cell * .16 + k * (bw + gx), y + w.cell * .78 - bh, bw, bh); });
        ctx.globalAlpha = 1;
      });
    },
    labels(ctx, S, cam, T, P, W, H) {
      const w = S.scene, m = P.labelMin;
      w.cells.forEach(q => {
        const s = worldToScreen(q.c * w.step, q.r * w.step, cam, W, H), sz = w.cell * cam.zoom;
        if (s.x > W || s.y > H || s.x + sz < 0 || s.y + sz < 0 || sz < 40) return;
        const size = clamp(11 * Math.sqrt(cam.zoom / .44), 11, 26);
        txt(ctx, T, String(q.v), s.x + sz * .12, s.y + sz * .22, { role: 'mono', size, min: m, fill: 'ink' });
      });
    },
    pinned(ctx, S, cam, T, P, W, H) {
      const w = S.scene, c = T.color, a = cam.fa; if (a < .01) return;
      const q = w.cells[w.tr * w.N + w.tc], x = W - 224, y = 24;
      ctx.globalAlpha = a; ctx.beginPath(); ctx.roundRect(x, y, 200, 98, 8); ctx.fillStyle = c.panel; ctx.fill(); ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.stroke(); ctx.globalAlpha = 1;
      txt(ctx, T, 'r' + (w.tr + 1) + ' · c' + (w.tc + 1), x + 16, y + 38, { role: 'disp', size: 28, min: P.labelMin, fill: 'accent', a });
      txt(ctx, T, 'value ' + q.v, x + 16, y + 62, { role: 'mono', size: 13, min: P.labelMin, fill: 'ink', a });
      txt(ctx, T, '1 of ' + w.cells.length + ' cells', x + 16, y + 82, { role: 'body', size: 12, min: P.labelMin, fill: 'muted', a });
    }
  };

  // ---------- the pattern ----------
  const P_ = {
    id: 'camera', atlas: ['camera-choreography', 'camera-slerp', 'world-to-screen', 'easing-functions', 'derived-geometry'], renderer: 'p2d',
    params: { scene: 'map', mode: 'move', dur: 12, kenburns: 1, focus: true, ease: '', labelMin: 11 },
    variants: [
      { name: 'map', params: { scene: 'map', mode: 'move' } },
      { name: 'map-cuts', params: { scene: 'map', mode: 'cut', kenburns: 0 } },
      { name: 'timeline', params: { scene: 'timeline', mode: 'move', kenburns: 0, focus: false, ease: 'linear' } },
      { name: 'grid', params: { scene: 'grid', mode: 'move' } }
    ],
    setup(p, ctx, params) {
      const P = Object.assign({}, P_.params, params), rnd = mulberry32((ctx && ctx.seed) | 0 || 23), W = p.width, H = p.height;
      const scene = SCENES[P.scene].build(p, rnd, P, W, H);
      const keys = P.mode === 'cut' ? toCuts(scene.keys) : scene.keys;
      return { W, H, scene, keys, cam: null };
    },
    draw(p, t, S, params, T) {
      const P = Object.assign({}, P_.params, params), sc = SCENES[P.scene], W = S.W, H = S.H, ctx = p.drawingContext;
      const cam = sample(S.keys, t, P.ease || (T.tempo && T.tempo.ease) || 'cubic');
      const d = S.scene.drift, k = P.kenburns; // ken burns: slow continuous drift, a function of t only
      const dt = d.t0 == null ? t : (t >= d.t0 && t < d.t1 ? t - d.t0 : 0); // optional window: drift only while holding
      cam.x += d.vx * dt * k; cam.y += d.vy * dt * k; cam.zoom *= Math.exp(d.vz * dt * k);
      S.cam = cam;
      S.worldToScreen = (x, y) => worldToScreen(x, y, cam, W, H); S.screenToWorld = (x, y) => screenToWorld(x, y, cam, W, H);
      p.background(T.color.bg);
      p.push(); p.translate(W / 2, H / 2); p.scale(cam.zoom); p.translate(-cam.x, -cam.y);   // world space
      sc.world(ctx, S, cam, T, P, W, H);
      p.pop();
      p.push(); p.resetMatrix();                                                              // screen space, under the mask
      sc.labels(ctx, S, cam, T, P, W, H);
      if (P.focus && cam.fa > .002) {                                                          // focus: dim everything outside the region
        const a = worldToScreen(cam.fx, cam.fy, cam, W, H), w = cam.fw * cam.zoom, h = cam.fh * cam.zoom;
        ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.roundRect(a.x, a.y, w, h, 10);
        ctx.globalAlpha = .82 * cam.fa; ctx.fillStyle = T.color.bg; ctx.fill('evenodd'); ctx.globalAlpha = cam.fa * .9;
        ctx.beginPath(); ctx.roundRect(a.x, a.y, w, h, 10); ctx.strokeStyle = T.color.accent; ctx.lineWidth = 1.5; ctx.stroke(); ctx.globalAlpha = 1;
      }
      if (sc.pinned) sc.pinned(ctx, S, cam, T, P, W, H);
      // pinned furniture, identical on every scene: stage label, zoom readout, progress rail
      txt(ctx, T, cam.label || '', 28, 44, { role: 'disp', size: 24, min: P.labelMin, fill: 'ink' });
      txt(ctx, T, 'x' + cam.zoom.toFixed(2) + (P.mode === 'cut' ? '  cut' : cam.moving ? '  move' : '  hold'), 28, H - 30, { role: 'mono', size: 11, min: P.labelMin, fill: 'muted' });
      const rx0 = 28, rx1 = W - 28, ry = H - 16, u = clamp(t / P.dur, 0, 1);
      ctx.strokeStyle = T.color.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx0, ry); ctx.lineTo(rx1, ry); ctx.stroke();
      ctx.strokeStyle = T.color.accent; ctx.beginPath(); ctx.moveTo(rx0, ry); ctx.lineTo(lerp(rx0, rx1, u), ry); ctx.stroke();
      if (S.scene.speed) txt(ctx, T, 'constant ' + Math.round(S.scene.speed) + ' px/s', W - 28, H - 30, { role: 'mono', size: 11, min: P.labelMin, fill: 'muted', align: 'right' });
      p.pop();
    },
    api: { sample, worldToScreen, screenToWorld, toCuts, EASE }
  };
  window.ARSENAL.patterns.camera = P_;
})();
