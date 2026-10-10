// layers · layered compositing, cutout reveals and freeze layers. Pure of t. Roles only.
// Atlas: layered-compositing, p5-graphics, erase, blend-mode, pixel-density (+ ping-pong-feedback as the foil).
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const ease = x => { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const TAU = Math.PI * 2;

  // A layer is a p5.Graphics with density set EXPLICITLY (2.x does not inherit it from the canvas).
  function layer(p, w, h, dens) { const g = p.createGraphics(w, h); g.pixelDensity(dens); return g; }
  // Freeze: copy into a p5.Image, drop the Graphics, so p5 stops re-uploading a texture that never changes.
  function freeze(g) { const img = g.get(); g.remove(); return img; }
  // Role colour with alpha (0..255). One scratch colour per role keeps the per-frame cost low.
  function pal(p, tk) {
    const c = {}, sc = {}; for (const k of ['bg', 'ink', 'accent', 'accent2', 'muted', 'line', 'panel', 'chalk']) { c[k] = p.color(tk.color[k]); sc[k] = p.color(tk.color[k]); }
    return { id: tk.id, c, a(role, al) { const s = sc[role]; s.setAlpha(al); return s; } }; // c: pristine roles; sc: scratch for alpha
  }

  // ---- setup -----------------------------------------------------------------------------------
  function setup(p, ctx, params) {
    const W = ctx.W || 960, H = ctx.H || 540, D = ctx.density || 2, rnd = mulberry32(ctx.seed >>> 0);
    const S = { W, H, D, mode: params.mode, rnd0: ctx.seed };
    // per-frame animated layer: cleared and redrawn every frame (the only thing that is not frozen)
    S.live = layer(p, W, H, D);
    if (params.mode === 'spot' || params.mode === 'iris') {
      // dense field: cols x rows = 1,000 marks, jittered grid, each a short tick at a seeded angle
      const cols = params.cols, rows = params.rows, mx = 54, my = 70;
      const dx = (W - 2 * mx) / (cols - 1), dy = (H - 2 * my) / (rows - 1);
      const marks = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++)
        marks.push({ x: mx + c * dx + (rnd() - .5) * dx * .5, y: my + r * dy + (rnd() - .5) * dy * .5, a: rnd() * TAU, l: 5 + rnd() * 5, hit: false });
      const order = marks.map((_, i) => i); // seeded partial shuffle picks the targets
      for (let i = 0; i < params.targets; i++) { const j = i + Math.floor(rnd() * (order.length - i)); [order[i], order[j]] = [order[j], order[i]]; marks[order[i]].hit = true; }
      S.marks = marks; S.nmarks = marks.length;
      S.field = null; S.fieldTk = null; // frozen lazily on first draw, when tokens exist
      // soft mask for the spotlight: radial alpha, frozen once
      const m = layer(p, 256, 256, D), g = m.drawingContext, gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(clamp(1 - params.soft, .05, .95), 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256); S.mask = freeze(m);
    }
    if (params.mode === 'wipe') {
      const v = []; for (let i = 0; i < params.bars; i++) v.push(.12 + .88 * rnd());
      S.vals = v; S.sorted = v.slice().sort((a, b) => a - b);
      S.before = null; S.after = null; S.work = layer(p, W, H, D);
    }
    if (params.mode === 'comets') {
      const cs = [], ks = [1, 1, 2, 1, 2, 1, 2];
      for (let i = 0; i < params.n; i++) cs.push({ a: 150 + rnd() * 270, b: 70 + rnd() * 130, rot: (rnd() - .5) * 1.6, k: ks[i % ks.length], ph: rnd() * TAU, wob: .08 + rnd() * .1, ps: rnd() * TAU, role: ['accent', 'accent2', 'chalk', 'accent', 'accent2'][i % 5], cx: (rnd() - .5) * 70, cy: (rnd() - .5) * 40 });
      S.comets = cs; S.stars = [];
      for (let i = 0; i < params.stars; i++) S.stars.push({ x: rnd() * W, y: rnd() * H, r: .4 + rnd() * 1.1, a: 40 + rnd() * 120 });
      S.bg = null;
    }
    return S;
  }

  // ---- frozen layers (built on first draw because they need tokens; built once, never again) ----
  function freezeField(p, S, P, tk) {
    const g = layer(p, S.W, S.H, S.D); g.clear(); g.noFill();
    for (const m of S.marks) {
      const ca = Math.cos(m.a) * m.l / 2, sa = Math.sin(m.a) * m.l / 2;
      if (m.hit) { g.stroke(P.a('accent', 255)); g.strokeWeight(1.6); g.line(m.x - ca * 1.5, m.y - sa * 1.5, m.x + ca * 1.5, m.y + sa * 1.5); g.noStroke(); g.fill(P.a('accent', 255)); g.circle(m.x, m.y, 4.2); g.noFill(); }
      else { g.stroke(P.a('ink', 235)); g.strokeWeight(1); g.line(m.x - ca, m.y - sa, m.x + ca, m.y + sa); }
    }
    S.field = freeze(g); S.fieldTk = tk.id;
  }
  function freezeBars(p, S, P, tk, prm) {
    const N = prm.bars, x0 = 90, x1 = S.W - 90, base = 450, top = 120, bw = (x1 - x0) / N;
    const a = layer(p, S.W, S.H, S.D), b = layer(p, S.W, S.H, S.D); a.clear(); b.clear();
    // BEFORE: raw order, muted
    b.noStroke(); S.vals.forEach((v, i) => { b.fill(P.a('muted', 230)); b.rect(x0 + i * bw + 1.5, base - v * (base - top), bw - 3, v * (base - top)); });
    b.stroke(P.a('line', 255)); b.strokeWeight(1); b.line(x0, base + .5, x1, base + .5);
    // AFTER: ground, ghost outline of where each bar came from, then the sorted bars in accent
    a.noStroke(); a.fill(P.a('bg', 255)); a.rect(0, 0, S.W, S.H);
    a.noFill(); a.stroke(P.a('line', 255)); a.strokeWeight(1);
    S.vals.forEach((v, i) => a.rect(x0 + i * bw + 1.5, base - v * (base - top), bw - 3, v * (base - top)));
    a.noStroke(); S.sorted.forEach((v, i) => { a.fill(P.a(i === N - 1 ? 'accent2' : 'accent', 255)); a.rect(x0 + i * bw + 1.5, base - v * (base - top), bw - 3, v * (base - top)); });
    a.stroke(P.a('ink', 255)); a.strokeWeight(1); a.line(x0, base + .5, x1, base + .5);
    S.before = freeze(b); S.after = freeze(a); S.barsTk = tk.id; S.geo = { x0, x1, base, top, bw };
  }
  function freezeSky(p, S, P, prm) {
    const g = layer(p, S.W, S.H, S.D); g.clear(); g.noStroke();
    for (const s of S.stars) { g.fill(P.a('ink', s.a)); g.circle(s.x, s.y, s.r * 2); }
    g.noFill(); g.strokeWeight(1);
    S.comets.forEach(c => { g.stroke(P.a('line', 255)); g.beginShape(); for (let i = 0; i <= 120; i++) { const q = cometPos(c, i / 120 * prm.dur / c.k, prm, S); g.vertex(q.x, q.y); } g.endShape(); });
    g.noStroke(); g.fill(P.a('panel', 255)); g.circle(S.W / 2, S.H / 2, 26); g.stroke(P.a('muted', 255)); g.noFill(); g.circle(S.W / 2, S.H / 2, 26);
    S.sky = freeze(g);
  }
  function cometPos(c, s, prm, S) { // closed path, periodic in prm.dur / c.k: any s (even negative) is valid
    const u = TAU * c.k * s / prm.dur + c.ph;
    let x = c.a * Math.cos(u) + c.a * c.wob * Math.cos(3 * u + c.ps), y = c.b * Math.sin(u) + c.b * c.wob * Math.sin(2 * u);
    const cr = Math.cos(c.rot), sr = Math.sin(c.rot);
    return { x: S.W / 2 + c.cx + x * cr - y * sr, y: S.H / 2 + c.cy + x * sr + y * cr };
  }

  // ---- draw ------------------------------------------------------------------------------------
  function label(p, tk, P, text, right) {
    p.noStroke(); p.fill(P.a('muted', 255)); p.textFont(tk.type.mono.family); p.textSize(11); p.textAlign(p.LEFT, p.TOP); p.text(text, 28, 22);
    if (right) { p.textAlign(p.RIGHT, p.TOP); p.fill(P.a('ink', 255)); p.text(right, 960 - 28, 22); }
  }

  function draw(p, t, S, prm, tk) {
    if (!S.P || S.P.id !== tk.id) { S.P = pal(p, tk); S.field = S.before = S.after = S.sky = null; }
    const P = S.P, W = S.W, H = S.H, live = S.live;
    p.blendMode(p.BLEND); p.background(P.c.bg);
    const u = t / prm.dur;

    if (S.mode === 'spot' || S.mode === 'iris') {
      if (!S.field) freezeField(p, S, P, tk);
      p.image(S.field, 0, 0, W, H);                       // frozen layer 1: the dense field, stamped, never redrawn
      // animated layer: a veil over the field with a window opened in it
      live.clear(); live.noStroke(); live.fill(P.a('bg', prm.veil)); live.rect(0, 0, W, H);
      let cx, cy, r;
      if (S.mode === 'spot') {
        cx = W / 2 + prm.sweepX * Math.sin(TAU * u); cy = H / 2 + prm.sweepY * Math.sin(TAU * 2 * u);
        r = prm.radius * (.55 + .45 * ease(t / 0.9)) * (1 + .06 * Math.sin(TAU * 3 * u));
        const ctx2 = live.drawingContext; ctx2.save(); ctx2.globalCompositeOperation = 'destination-out'; // soft hole from the frozen graphics mask
        live.image(S.mask, cx - r * 1.35, cy - r * 1.35, r * 2.7, r * 2.7); ctx2.restore();
      } else {
        cx = W / 2; cy = H / 2; const k = ease(u / prm.irisEnd); r = k * Math.hypot(W / 2, H / 2) * 1.02;
        live.erase(255, 0); live.circle(cx, cy, r * 2); live.noErase();  // hard iris: erase() subtracts the disc from the veil
      }
      p.image(live, 0, 0, W, H);
      // glow ring, composited with ADD
      p.push(); p.blendMode(p.ADD); p.noFill(); p.stroke(P.a('accent', S.mode === 'iris' ? 120 : 70)); p.strokeWeight(S.mode === 'iris' ? 2 : 6);
      if (S.mode === 'iris' ? r < Math.hypot(W, H) / 2 : true) p.circle(cx, cy, r * 2 * (S.mode === 'spot' ? .9 : 1)); p.pop();
      let n = 0, hit = 0; for (const m of S.marks) if (Math.hypot(m.x - cx, m.y - cy) < r * (S.mode === 'spot' ? .8 : 1)) { n++; if (m.hit) hit++; }
      label(p, tk, P, S.mode === 'spot' ? 'SPOTLIGHT / 1,000 MARKS / ONE WINDOW' : 'IRIS / ERASE() OPENS THE VEIL', `${n} in window / ${hit} of ${prm.targets} targets`);
    }

    if (S.mode === 'wipe') {
      if (!S.before || S.barsTk !== tk.id) freezeBars(p, S, P, tk, prm);
      const k = ease((u - prm.hold) / (1 - 2 * prm.hold)), slant = prm.slant, edge = prm.edge;
      const wx = -edge - 40 + k * (W + edge + 80);
      p.image(S.before, 0, 0, W, H);                      // frozen layer 1: before
      const w = S.work; w.clear(); w.image(S.after, 0, 0, W, H); w.noStroke(); // frozen layer 2 into the work buffer
      const q = (xa, xb) => w.quad(xa + slant * (0 - H / 2), 0, xb + slant * (0 - H / 2), 0, xb + slant * (H / 2), H, xa + slant * (H / 2), H);
      w.erase(255, 0); q(wx, W + 400);                    // everything right of the edge is erased: the cutout
      const NS = 24; for (let i = 0; i < NS; i++) { w.erase(255 * (1 - (i + .5) / NS), 0); q(wx - edge + i * edge / NS, wx - edge + (i + 1) * edge / NS + .6); }
      w.noErase();
      p.image(w, 0, 0, W, H);
      p.push(); p.blendMode(p.ADD); p.stroke(P.a('chalk', 150)); p.strokeWeight(2); p.line(wx - slant * H / 2, 0, wx + slant * H / 2, H); p.pop();
      label(p, tk, P, 'WIPE / SAME 36 VALUES / BEFORE AND AFTER', k < .02 ? 'before: raw order' : k > .98 ? 'after: sorted' : 'erase() moves the edge');
    }

    if (S.mode === 'comets') {
      if (!S.sky) freezeSky(p, S, P, prm);
      p.image(S.sky, 0, 0, W, H);
      live.clear(); live.noFill(); live.strokeCap(p.ROUND);
      const K = prm.trail, dt = prm.span / K;
      S.comets.forEach(c => {
        let prev = cometPos(c, t, prm, S);
        for (let j = 1; j <= K; j++) {                    // the trail is the PATH sampled at t - j*dt, never the previous frame
          const q = cometPos(c, t - j * dt, prm, S), f = 1 - j / K;
          live.stroke(P.a(c.role, 255 * f * f)); live.strokeWeight(.8 + 4.2 * f); live.line(prev.x, prev.y, q.x, q.y); prev = q;
        }
        const h = cometPos(c, t, prm, S); live.noStroke();
        live.fill(P.a(c.role, 60)); live.circle(h.x, h.y, 22); live.fill(P.a(c.role, 120)); live.circle(h.x, h.y, 12); live.fill(P.a('chalk', 255)); live.circle(h.x, h.y, 5.5);
      });
      p.push(); p.blendMode(p.ADD); p.image(live, 0, 0, W, H); p.pop();   // glow layer composited with ADD
      label(p, tk, P, 'COMET TRAILS / PURE OF T', `trail = path(t - k * ${(prm.span / K * 1000).toFixed(0)} ms), k = 1..${K}`);
    }
  }

  const base = { dur: 8, mode: 'spot' };
  ARSENAL.patterns.layers = {
    id: 'layers', atlas: ['layered-compositing', 'p5-graphics', 'p5-framebuffer', 'erase', 'blend-mode', 'ping-pong-feedback', 'pixel-density'], renderer: 'p2d',
    params: Object.assign({}, base, { cols: 40, rows: 25, targets: 14, radius: 118, soft: .45, veil: 232, sweepX: 330, sweepY: 140, irisEnd: .75,
      bars: 36, hold: .12, edge: 70, slant: .18, n: 5, trail: 80, span: 1.1, stars: 380 }),
    variants: [
      { name: 'spotlight', params: { mode: 'spot' } },
      { name: 'iris', params: { mode: 'iris', veil: 245 } },
      { name: 'wipe', params: { mode: 'wipe' } },
      { name: 'comets', params: { mode: 'comets' } }
    ],
    setup, draw
  };
})();
