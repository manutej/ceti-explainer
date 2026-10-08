// transitions · how one scene becomes the next. Each transition is a pure function of u in [0,1] over two scene
// renderers (A and B, each drawn once per frame into a frozen-size p5.Graphics layer). Pure of t. Roles only.
// Atlas: scene-local-time (scene() windows), layered-compositing (A/B layers), erase (cutout foil), easing-functions.
// Transitions: cut, dissolve, wipe (angle + soft edge), iris (open/close), push/slide, match cut, zoom-through, ledger turn.
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const sm = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const ease = (x) => { x = clamp(x, 0, 1); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const lerp = (a, b, k) => a + (b - a) * k;
  const TAU = Math.PI * 2, W = 960, H = 540;
  const TLm = () => { const t = window.ARSENAL.core && window.ARSENAL.core.timeline; if (!t) throw new Error('transitions: load arsenal/core/timeline.js first'); return t; };
  const cv = (g) => g.elt || g.canvas || g._renderer.canvas;
  const layer = (p, d) => { const g = p.createGraphics(W, H); g.pixelDensity(d); return g; };

  // ---- palette from roles -----------------------------------------------------------------------
  const FG = { bg: 'ink', panel: 'ink', accent: 'bg', ink: 'bg' };          // text role that reads on each ground role
  function pal(tk) {
    const TL = TLm(), base = {};
    for (const k of ['bg', 'ink', 'accent', 'accent2', 'muted', 'line', 'panel', 'chalk']) base[k] = TL.color.parse(tk.color[k]);
    return { id: tk.id, rgba(role, a) { const b = base[role]; return 'rgba(' + Math.round(b[0]) + ',' + Math.round(b[1]) + ',' + Math.round(b[2]) + ',' + (+(a * b[3]).toFixed(3)) + ')'; } };
  }

  // ---- setup: seeded data only ----------------------------------------------------------------
  function layout(seq) {                                                       // scene windows from {d, tr:{d}}: next starts when this one's transition starts
    let t0 = 0; return seq.map((s, i) => { const w = { t0, t1: t0 + s.d, trd: i < seq.length - 1 ? s.tr.d : 0 }; t0 = w.t1 - w.trd; return w; });
  }
  function setup(p, ctx, params) {
    const TL = TLm(), D = ctx.density || 2, rnd = mulberry32(ctx.seed >>> 0), seq = params.seq, lay = layout(seq), an = params.anchor;
    const S = { p, D, seq, lay, an, A: layer(p, D), B: layer(p, D), work: layer(p, D), P: null };
    S.wins = seq.map((s, i) => TL.scene(lay[i].t0, lay[i].t1, (f) => f, { fade: 0, hold: i === seq.length - 1 }));
    S.vals = Array.from({ length: 18 }, () => .25 + .75 * rnd()); S.maxI = S.vals.indexOf(Math.max.apply(null, S.vals));
    S.hits = new Set(); while (S.hits.size < 9) S.hits.add(Math.floor(rnd() * 128));
    S.walk = [.5]; for (let i = 1; i <= 40; i++) S.walk.push(clamp(S.walk[i - 1] + (rnd() - .5) * .22 + .008, .08, .95));
    S.cv = Array.from({ length: 35 }, () => .2 + .8 * rnd());
    S.rows = Array.from({ length: 9 }, () => .15 + .85 * rnd());
    S.pts = []; while (S.pts.length < 44) { const x = 90 + rnd() * 780, y = 90 + rnd() * 350; if (!an || Math.hypot(x - an.x, y - an.y) > an.r + 16) S.pts.push({ x, y, r: 2 + rnd() * 3 }); }
    return S;
  }

  // ---- scenes: (g, local t, X, spec). Each fills its own ground. ------------------------------------
  function begin(g, X, gr) { g.resetMatrix(); g.noStroke(); g.fill(X.P.rgba(gr, 1)); g.rect(0, 0, W, H); }
  function head(g, X, gr, left, right) {
    const f = FG[gr]; g.noStroke(); g.fill(X.P.rgba(f, .75)); g.textFont(X.tk.type.mono.family); g.textSize(11); g.textAlign(X.S.p.LEFT, X.S.p.TOP); g.text(left, 28, 22);
    if (right) { g.textAlign(X.S.p.RIGHT, X.S.p.TOP); g.text(right, W - 28, 22); }
  }
  function big(g, X, gr, str, x, y, size, al) {
    g.noStroke(); g.fill(X.P.rgba(FG[gr], 1)); g.textFont(X.tk.type.disp.family); g.textSize(size); g.textAlign(al || X.S.p.LEFT, X.S.p.BASELINE); g.text(str, x, y);
  }
  const SCENES = {
    bars(g, lt, X) {
      const S = X.S, P = X.P, v = S.vals, n = v.length, x0 = 70, x1 = 890, base = 440, top = 140, bw = (x1 - x0) / n; let sum = 0;
      begin(g, X, 'bg'); head(g, X, 'bg', '01 / COUNT', 'eighteen bars, one tallest');
      for (let i = 0; i < n; i++) {
        const k = ease((lt - .15 - i * .05) / .7), h = v[i] * (base - top) * k; sum += v[i] * k * 100;
        g.noStroke(); g.fill(i === S.maxI ? P.rgba('accent', 1) : P.rgba('muted', .85)); g.rect(x0 + i * bw + 4, base - h, bw - 8, h);
      }
      g.stroke(P.rgba('ink', .5)); g.strokeWeight(1); g.line(x0, base + .5, x1, base + .5);
      big(g, X, 'bg', String(Math.round(sum)), x1, 100, 72, X.S.p.RIGHT);
    },
    field(g, lt, X) {
      const S = X.S, P = X.P, cols = 16, rows = 8; begin(g, X, 'panel'); head(g, X, 'panel', '02 / FIELD', 'nine marked of one hundred twenty-eight');
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, x = 90 + c * 52, y = 120 + r * 46, d = Math.hypot(c - 7.5, (r - 3.5) * 1.6) / 9, k = ease((lt * 1.1 - d * .8) / .4); if (k <= 0) continue;
        g.noStroke();
        if (S.hits.has(i)) { g.fill(P.rgba('accent', 1)); g.circle(x, y, 11 * k); g.noFill(); g.stroke(P.rgba('accent', .6)); g.strokeWeight(1.2); g.circle(x, y, 22 * k); }
        else { g.fill(P.rgba('ink', .55)); g.circle(x, y, 5 * k); }
      }
    },
    line(g, lt, X) {
      const S = X.S, P = X.P, w = S.walk, n = w.length - 1, k = ease(lt / 2.4) * n, X0 = 70, X1 = 890; begin(g, X, 'accent'); head(g, X, 'accent', '03 / TREND', 'forty steps');
      g.stroke(P.rgba('bg', .25)); g.strokeWeight(1); for (let i = 0; i < 5; i++) g.line(X0, 150 + i * 70, X1, 150 + i * 70);
      g.noFill(); g.stroke(P.rgba('bg', 1)); g.strokeWeight(3.5); g.strokeJoin(X.S.p.ROUND); g.beginShape();
      const px = (i) => X0 + (X1 - X0) * i / n, py = (v) => 430 - v * 290;
      for (let i = 0; i <= Math.floor(k); i++) g.vertex(px(i), py(w[i]));
      const fl = Math.floor(k); let ex = px(fl), ey = py(w[fl]);
      if (fl < n) { const f = k - fl; ex = lerp(px(fl), px(fl + 1), f); ey = lerp(py(w[fl]), py(w[fl + 1]), f); g.vertex(ex, ey); }
      g.endShape(); g.noStroke(); g.fill(P.rgba('bg', 1)); g.circle(ex, ey, 14);
      big(g, X, 'accent', String(Math.round(w[fl] * 100)), X1, 100, 72, X.S.p.RIGHT);
    },
    table(g, lt, X, sp) {
      const S = X.S, P = X.P, rows = S.rows; begin(g, X, 'ink'); head(g, X, 'ink', sp && sp.tag || '04 / LEDGER', 'nine rows, two rules');
      g.stroke(P.rgba('accent2', .9)); g.strokeWeight(1.5); g.line(104, 0, 104, H); g.line(W / 2, 0, W / 2, H);
      for (let i = 0; i < rows.length; i++) {
        const y = 100 + i * 40, k = ease((lt - .1 - i * .08) / .5); g.stroke(P.rgba('bg', .22)); g.strokeWeight(1); g.line(40, y + 28, 920, y + 28);
        g.noStroke(); g.fill(P.rgba('bg', .85 * k)); g.textFont(X.tk.type.mono.family); g.textSize(12); g.textAlign(X.S.p.LEFT, X.S.p.BASELINE); g.text('ROW ' + String(i + 1).padStart(2, '0'), 120, y + 20);
        g.textAlign(X.S.p.RIGHT, X.S.p.BASELINE); g.text(String(Math.round(rows[i] * 900 * k)).padStart(3, ' '), 440, y + 20); g.fill(P.rgba('muted', k)); g.rect(520, y + 10, rows[i] * 340 * k, 10);
      }
    },
    cells(g, lt, X, sp) {
      const S = X.S, P = X.P, geo = cellGeo(sp); begin(g, X, 'bg'); head(g, X, 'bg', sp.tag || '05 / GRID', sp.cols + ' by ' + sp.rows + ' cells');
      for (let r = 0; r < sp.rows; r++) for (let c = 0; c < sp.cols; c++) {
        const i = r * sp.cols + c, x = geo.x0 + c * geo.w, y = geo.y0 + r * geo.h, k = ease((lt - (c + r) * .06) / .5), v = S.cv[i % S.cv.length];
        const tg = c === sp.target[0] && r === sp.target[1];
        g.stroke(P.rgba('line', 1)); g.strokeWeight(1); g.fill(P.rgba('panel', k)); g.rect(x, y, geo.w, geo.h);
        g.noStroke(); g.fill(P.rgba(tg ? 'accent' : 'muted', .9 * k)); g.rect(x + 8, y + geo.h - 14, (geo.w - 16) * v * k, 5);
        g.fill(P.rgba('ink', .6 * k)); g.textFont(X.tk.type.mono.family); g.textSize(10); g.textAlign(X.S.p.LEFT, X.S.p.TOP); g.text(String(i + 1).padStart(2, '0'), x + 8, y + 7);
        if (tg) { g.noFill(); g.stroke(P.rgba('accent', .55 + .45 * Math.sin(TAU * lt * .6))); g.strokeWeight(2); g.rect(x + 1, y + 1, geo.w - 2, geo.h - 2); }
      }
    },
    detail(g, lt, X, sp) {
      const P = X.P, k = ease(lt / 1.8), cx = W / 2, cy = 275; begin(g, X, 'bg'); head(g, X, 'bg', sp && sp.tag || '06 / DETAIL', 'one cell, opened');
      g.noFill(); for (let i = 3; i >= 1; i--) { g.stroke(P.rgba('line', 1)); g.strokeWeight(1); g.circle(cx, cy, 110 + i * 70); }
      g.stroke(P.rgba('accent', 1)); g.strokeWeight(5); g.arc(cx, cy, 250, 250, -Math.PI / 2, -Math.PI / 2 + TAU * .72 * k);
      big(g, X, 'bg', String(Math.round(128 * k)), cx, cy + 34, 108, X.S.p.CENTER);
      g.noStroke(); g.fill(P.rgba('muted', 1)); g.textFont(X.tk.type.mono.family); g.textSize(12); g.textAlign(X.S.p.CENTER, X.S.p.TOP); g.text('72 percent of the cell is filled', cx, cy + 176);
    },
    orbit(g, lt, X) {
      const P = X.P, a = X.S.an; begin(g, X, 'bg'); head(g, X, 'bg', 'A / ORBIT', 'the circle will not move');
      g.noFill(); g.stroke(P.rgba('ink', .35)); g.strokeWeight(1.2); for (let i = 0; i < 72; i++) { const th = TAU * i / 72 + lt * .25; g.line(a.x + Math.cos(th) * (a.r + 40), a.y + Math.sin(th) * (a.r + 40), a.x + Math.cos(th) * (a.r + 40 + (i % 6 ? 8 : 18)), a.y + Math.sin(th) * (a.r + 40 + (i % 6 ? 8 : 18))); }
      g.stroke(P.rgba('line', 1)); g.circle(a.x, a.y, (a.r + 130) * 2);
      g.noStroke(); for (let i = 0; i < 3; i++) { const th = lt * (.5 + i * .17) + i * 2.1; g.fill(P.rgba(i === 1 ? 'accent2' : 'accent', 1)); g.circle(a.x + Math.cos(th) * (a.r + 130), a.y + Math.sin(th) * (a.r + 130), 12); }
    },
    scatter(g, lt, X) {
      const S = X.S, P = X.P; begin(g, X, 'panel'); head(g, X, 'panel', 'B / POINT', 'the circle is now one big observation');
      g.stroke(P.rgba('ink', .5)); g.strokeWeight(1); g.line(70, 460.5, 890, 460.5); g.line(70.5, 70, 70.5, 460);
      g.noStroke(); S.pts.forEach((q, i) => { const k = ease((lt - .1 - i * .025) / .4); g.fill(P.rgba('ink', .6 * k)); g.circle(q.x, q.y, q.r * 2 * k); });
      g.stroke(P.rgba('accent2', .8)); g.strokeWeight(1.5); g.line(70, 440, 890, 120 + 30 * Math.sin(lt * .4));
    },
    ledgerM(g, lt, X) { SCENES.table(g, lt, X, { tag: 'C / STAMP' }); },
  };
  function cellGeo(sp) { const w = sp.cw, h = sp.cw * 9 / 16; return { w, h, x0: (W - sp.cols * w) / 2, y0: (H - sp.rows * h) / 2 + 14 }; }
  function cellRect(sp) { const g = cellGeo(sp); return { x: g.x0 + sp.target[0] * g.w, y: g.y0 + sp.target[1] * g.h, w: g.w, h: g.h }; }

  // ---- transitions: (c, A, B, u, X, tr, segA). c is the main 2D context in logical 960x540 units. u already in [0,1]. -------
  function put(c, X, g, x, y, w, h) { c.drawImage(cv(g), 0, 0, W * X.S.D, H * X.S.D, x == null ? 0 : x, y == null ? 0 : y, w == null ? W : w, h == null ? H : h); }
  const EZ = (tr) => (tr.ease === 'linear' ? (x) => x : tr.ease === 'smooth' ? sm : ease);
  const TR = {
    cut(c, A, B, u, X) { put(c, X, u < .5 ? A : B); },
    dissolve(c, A, B, u, X, tr) { put(c, X, A); c.globalAlpha = EZ(tr)(u); put(c, X, B); c.globalAlpha = 1; },
    wipe(c, A, B, u, X, tr) {                                                   // directional wipe with a soft edge: B shows behind a moving alpha ramp
      const ang = (tr.ang || 0) * Math.PI / 180, dx = Math.cos(ang), dy = Math.sin(ang), soft = Math.max(tr.soft == null ? 120 : tr.soft, .5);
      const pr = Math.abs(dx) * W / 2 + Math.abs(dy) * H / 2, e = lerp(-pr, pr + soft, EZ(tr)(u)), wc = X.S.work.drawingContext, D = X.S.D;
      wc.save(); wc.setTransform(D, 0, 0, D, 0, 0); wc.globalCompositeOperation = 'source-over'; wc.clearRect(0, 0, W, H); wc.drawImage(cv(B), 0, 0, W * D, H * D, 0, 0, W, H);
      const gr = wc.createLinearGradient(W / 2 + dx * (e - soft), H / 2 + dy * (e - soft), W / 2 + dx * e, H / 2 + dy * e);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); wc.globalCompositeOperation = 'destination-in'; wc.fillStyle = gr; wc.fillRect(0, 0, W, H); wc.restore();
      put(c, X, A); put(c, X, X.S.work);
      if (tr.rule !== false) { const q = e - soft / 2, nx = -dy, ny = dx, L = 900; c.strokeStyle = X.P.rgba('accent', .9 * Math.sin(Math.PI * u)); c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2 + dx * q - nx * L, H / 2 + dy * q - ny * L); c.lineTo(W / 2 + dx * q + nx * L, H / 2 + dy * q + ny * L); c.stroke(); }
    },
    iris(c, A, B, u, X, tr) {                                                   // hard circular edge; 'open' grows B from a point, 'close' shrinks A to it
      const cx = (tr.cx == null ? .5 : tr.cx) * W, cy = (tr.cy == null ? .5 : tr.cy) * H, R = Math.max(Math.hypot(cx, cy), Math.hypot(W - cx, cy), Math.hypot(cx, H - cy), Math.hypot(W - cx, H - cy)) * 1.02, k = EZ(tr)(u);
      const open = tr.mode !== 'close', r = (open ? k : 1 - k) * R; put(c, X, open ? A : B);
      c.save(); c.beginPath(); c.arc(cx, cy, Math.max(r, 0), 0, TAU); c.clip(); put(c, X, open ? B : A); c.restore();
      c.strokeStyle = X.P.rgba('accent', .95 * Math.sin(Math.PI * u)); c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, Math.max(r, 0), 0, TAU); c.stroke();
    },
    match(c, A, B, u, X, tr) {                                                  // everything but the anchor changes; the driver draws the anchor on top
      const a = X.S.an, e = sm((u - .2) / .6); c.save(); c.translate(a.x, a.y); c.scale(1 + .06 * ease(u), 1 + .06 * ease(u)); c.translate(-a.x, -a.y); put(c, X, A); c.restore();
      c.save(); c.globalAlpha = e; c.translate(a.x, a.y); c.scale(.94 + .06 * e, .94 + .06 * e); c.translate(-a.x, -a.y); put(c, X, B); c.restore();
    },
    zoom(c, A, B, u, X, tr, segA) {                                             // camera dives into segA's target cell; B IS that cell, then fills the frame
      const R = cellRect(segA), send = W / R.w, e = ease(u), s = Math.exp(e * Math.log(send)), f = (1 - 1 / s) / (1 - 1 / send);   // log-space zoom: constant perceived speed
      const vx = lerp(W / 2, R.x + R.w / 2, f), vy = lerp(H / 2, R.y + R.h / 2, f);
      c.save(); c.translate(W / 2, H / 2); c.scale(s, s); c.translate(-vx, -vy); put(c, X, A);
      c.globalAlpha = sm(u / .6); put(c, X, B, R.x, R.y, R.w, R.h); c.globalAlpha = 1; c.restore();
    },
    turn(c, A, B, u, X, tr) {                                                   // a ledger leaf: A's right half swings about the spine and lands as B's left half
      const th = Math.PI * ease(u), ct = Math.cos(th), sn = Math.sin(th), hx = W / 2, N = 44, F = 3000, D = X.S.D, hw = W / 2;
      c.save(); c.beginPath(); c.rect(0, 0, hx, H); c.clip(); put(c, X, A); c.restore();                         // left page: A until the leaf covers it
      c.save(); c.beginPath(); c.rect(hx, 0, hw, H); c.clip(); put(c, X, B); c.restore();                        // right page: B, revealed by the leaf
      const edge = hx + hw * ct * (F / (F - hw * sn)), shade = (x0, x1, a) => { const gr = c.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, 'rgba(0,0,0,' + a + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; };
      if (th < Math.PI / 2) { c.save(); c.beginPath(); c.rect(Math.max(edge, hx), 0, hw, H); c.clip(); shade(edge, edge + 150, .38 * sn); c.fillRect(edge, 0, 160, H); c.restore(); }
      else { c.save(); c.beginPath(); c.rect(0, 0, Math.min(edge, hx), H); c.clip(); shade(edge, edge - 150, .38 * sn); c.fillRect(edge - 160, 0, 160, H); c.restore(); }
      const front = th < Math.PI / 2, src = front ? A : B, pts = [];
      for (let k = 0; k <= N; k++) { const d = hw * k / N, z = d * sn, s = F / (F - z); pts.push({ d, x: hx + d * ct * s, s }); }
      for (let k = 0; k < N; k++) {
        const p0 = pts[k], p1 = pts[k + 1], dd = p1.d - p0.d, s = (p0.s + p1.s) / 2, xa = Math.min(p0.x, p1.x), wd = Math.abs(p1.x - p0.x) + .6;
        if (wd < .7) continue; const sx = front ? hx + p0.d : hx - p1.d;
        c.drawImage(cv(src), sx * D, 0, dd * D, H * D, xa, H / 2 - H * s / 2, wd, H * s);
        c.fillStyle = 'rgba(0,0,0,' + (.34 * sn * (.35 + .65 * (p0.d / hw))).toFixed(3) + ')'; c.fillRect(xa, H / 2 - H * s / 2, wd, H * s);
      }
      const gs = c.createLinearGradient(hx - 14, 0, hx + 14, 0); gs.addColorStop(0, 'rgba(0,0,0,0)'); gs.addColorStop(.5, 'rgba(0,0,0,.28)'); gs.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gs; c.fillRect(hx - 14, 0, 28, H);
    },
  };
  TR.push = function (c, A, B, u, X, tr) {                                      // push: both pages move; slide: B covers A, A trails at `cover` of the distance with a shadow
    const k = EZ(tr)(u), dir = tr.dir || 'left', cover = tr.cover == null ? 1 : tr.cover, vx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0, vy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const ox = -vx * W, oy = -vy * H;                                           // B starts one page behind the direction of travel
    put(c, X, A, vx * W * k * cover, vy * H * k * cover, W, H);
    put(c, X, B, ox + (-ox) * k + 0, oy + (-oy) * k, W, H);
    if (cover < 1 && vx) { const ex = vx < 0 ? W * (1 - k) : W * k, dr = vx < 0 ? -60 : 60, gr = c.createLinearGradient(ex, 0, ex + dr, 0); gr.addColorStop(0, 'rgba(0,0,0,' + (.35 * Math.sin(Math.PI * u)).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(Math.min(ex, ex + dr), 0, 60, H); }
  };

  // ---- the anchor (match cut): one circle, one position; only its dress changes ------------------
  function styleAt(X, a, b, k) {
    const TL = TLm(), P = X.P, mix = (fa, fb) => TL.color.mix(P.rgba(fa[0], fa[1]), P.rgba(fb[0], fb[1]), k, 'oklab');
    return { fill: mix(a.f, b.f), stroke: mix(a.s, b.s), sw: lerp(a.sw, b.sw, k), r2: lerp(a.r2, b.r2, k), dot: lerp(a.dot, b.dot, k) };
  }
  function drawAnchor(p, X, st) {
    const a = X.S.an; p.push(); p.fill(st.fill); if (st.sw > .05) { p.stroke(st.stroke); p.strokeWeight(st.sw); } else p.noStroke(); p.circle(a.x, a.y, a.r * 2);
    if (st.r2 > .02) { p.noFill(); p.stroke(X.P.rgba('accent2', st.r2)); p.strokeWeight(2); p.circle(a.x, a.y, a.r * 1.56); }
    if (st.dot > .02) { p.noStroke(); p.fill(X.P.rgba('ink', 1)); p.circle(a.x, a.y, 9 * st.dot); }
    p.pop();
  }

  // ---- hud: which transition, how far, where on the timeline ---------------------------------------
  function hud(p, X, t, label, u) {
    const P = X.P, S = X.S, dur = X.dur; p.push(); p.noStroke(); p.fill(P.rgba('bg', .86)); p.rect(0, 506, W, 34);
    p.fill(P.rgba('ink', 1)); p.textFont(X.tk.type.mono.family); p.textSize(11); p.textAlign(p.LEFT, p.CENTER); p.text(label + (u == null ? '' : '   u ' + u.toFixed(2)), 28, 523);
    const x0 = 420, x1 = 932; p.stroke(P.rgba('line', 1)); p.strokeWeight(1); p.line(x0, 523.5, x1, 523.5); p.noStroke();
    S.lay.forEach((w, i) => { if (w.trd) { p.fill(P.rgba('accent', .9)); p.rect(x0 + (x1 - x0) * (w.t1 - w.trd) / dur, 517, (x1 - x0) * w.trd / dur, 12); } });
    p.fill(P.rgba('ink', 1)); p.circle(x0 + (x1 - x0) * clamp(t / dur, 0, 1), 523.5, 8); p.pop();
  }

  // ---- draw ------------------------------------------------------------------------------------------
  function draw(p, t, S, prm, tk) {
    if (!S.P || S.P.id !== tk.id) S.P = pal(tk);
    const X = { S, P: S.P, tk, dur: prm.dur }, D = S.D, seq = S.seq; p.resetMatrix(); p.blendMode(p.BLEND); p.background(S.P.rgba('bg', 1));
    const act = []; S.wins.forEach((w, i) => { const f = w.at(t); if (f) act.push({ i, lt: f.t }); });
    const c = p.drawingContext; c.save(); c.setTransform(D, 0, 0, D, 0, 0);
    const a = act[0], b = act[1];
    const paint = (g, o) => { SCENES[seq[o.i].s](g, o.lt, X, seq[o.i]); };
    let label, u = null, an = null;
    paint(S.A, a);
    if (!b) { put(c, X, S.A); label = (a.i + 1) + '/' + seq.length + '  ' + seq[a.i].s + '  (hold)'; an = seq[a.i].style && { a: seq[a.i].style, b: seq[a.i].style, k: 0 }; }
    else {
      const tr = seq[a.i].tr; u = clamp((t - S.lay[b.i].t0) / tr.d, 0, 1); paint(S.B, b); TR[tr.k](c, S.A, S.B, u, X, tr, seq[a.i]);
      label = (a.i + 1) + '>' + (b.i + 1) + '  ' + tr.k + (tr.ang != null ? ' ' + tr.ang + 'deg' : '') + (tr.mode ? ' ' + tr.mode : '') + (tr.dir ? ' ' + tr.dir : '');
      if (seq[a.i].style) an = { a: seq[a.i].style, b: seq[b.i].style, k: sm((u - .1) / .8) };
    }
    c.restore();
    if (S.an && an) drawAnchor(p, X, styleAt(X, an.a, an.b, an.k));
    if (prm.hud) hud(p, X, t, label, u);
  }

  // ---- variants ------------------------------------------------------------------------------------------
  const ANCH = { x: 480, y: 270, r: 74 };
  const stOrbit = { f: ['bg', 0], s: ['ink', 1], sw: 2.5, r2: 0, dot: 1 }, stPoint = { f: ['accent', 1], s: ['accent', 1], sw: 0, r2: 0, dot: 0 }, stStamp = { f: ['ink', 0], s: ['accent2', 1], sw: 5, r2: 1, dot: 0 };
  const seqFour = [
    { s: 'bars', d: 4.6, tr: { k: 'wipe', d: 1.2, ang: 12, soft: 170 } },
    { s: 'field', d: 5.2, tr: { k: 'iris', d: 1.2, mode: 'open', cx: .62, cy: .43 } },
    { s: 'line', d: 4.2, tr: { k: 'turn', d: 1.4 } },
    { s: 'table', d: 1.8 },
  ];
  const seqPlain = [
    { s: 'bars', d: 4.1, tr: { k: 'cut', d: .2 } },
    { s: 'field', d: 4.7, tr: { k: 'dissolve', d: 1.2 } },
    { s: 'line', d: 4.0, tr: { k: 'push', d: 1.2, dir: 'left', cover: .3, ease: 'smooth' } },
    { s: 'table', d: 1.8 },
  ];
  const seqMatch = [
    { s: 'orbit', d: 4.7, style: stOrbit, tr: { k: 'match', d: 1.4 } },
    { s: 'scatter', d: 5.4, style: stPoint, tr: { k: 'match', d: 1.4 } },
    { s: 'ledgerM', d: 4.7, style: stStamp },
  ];
  const seqZoom = [
    { s: 'cells', d: 4.8, cols: 7, rows: 5, cw: 128, target: [4, 2], tag: '05 / GRID', tr: { k: 'zoom', d: 1.6 } },
    { s: 'cells', d: 5.6, cols: 4, rows: 3, cw: 160, target: [1, 1], tag: '05b / CELL 19', tr: { k: 'zoom', d: 1.6 } },
    { s: 'detail', d: 4.8, tag: '06 / DETAIL' },
  ];
  ARSENAL.patterns.transitions = {
    id: 'transitions', atlas: ['scene-local-time', 'layered-compositing', 'erase', 'easing-functions'], renderer: 'p2d',
    params: { dur: 12, hud: true, anchor: null, seq: seqFour },
    variants: [
      { name: 'four-scenes', params: { seq: seqFour } },
      { name: 'plain-cuts', params: { seq: seqPlain } },
      { name: 'match-cut', params: { seq: seqMatch, anchor: ANCH } },
      { name: 'zoom-through', params: { seq: seqZoom } },
    ],
    setup, draw
  };
})();
