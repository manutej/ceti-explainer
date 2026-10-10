/* A · THE ESCAPEMENT — native concept: "Every handoff adds a step" (glance). Revision 1.
   A process as a gear train. Each wheel is a system; each mesh between two wheels is a HANDOFF. A job is a steel
   ball riding on a wheel's body; at every mesh it hops across to the next wheel. A failed handoff is a hop that
   misses: the ball falls at that mesh onto the shelf below (the address). Three trains are the SAME train grown
   longer — the 2-handoff train is the first three wheels of the 6, which is the first seven of the 12 — and they
   share the 40 jobs' draws, so a longer train can only lose more. The trays at the right are the ruler; the dashed
   line in each tray is the exact expectation (product of the sketch reliabilities), the balls one draw from it.
   Wheels: exact involute profiles (m = 6, 20°), varied tooth counts, mesh phases solved along the chain. */
const NAT = {
  Z: [16, 20, 12, 18, 10, 17, 13, 19, 11, 16, 12, 18, 14],          // tooth counts (m = 6 → pitch radius 3·z)
  Q: [0.97, 0.95, 0.96, 0.92, 0.97, 0.94, 0.96, 0.93, 0.97, 0.95, 0.91, 0.96],   // sketch reliability per handoff
  N: 40, m: 6, V: 240, dt: 0.1, hop: 0.13, delta: 12, ballR: 7, rows: [2, 6, 12], rowStart: [2.4, 6.2, 10.0], rowIn: [0.0, 4.6, 8.4],
};
function natEngine(ctx) {
  const U = ctx.U, seed = ctx.seed, rows = NAT.rows.slice();
  rows[2] = Math.max(1, Math.min(12, Math.round(ctx.state.handoffs)));
  const fail = Int8Array.from({ length: NAT.N }, (_, j) => { for (let i = 0; i < 12; i++) if (U.h(seed, j, i, 0) >= NAT.Q[i]) return i; return -1; });
  const R = rows.map(n => {
    const p = NAT.Q.slice(0, n).reduce((a, q) => a * q, 1);
    const f = Array.from(fail, x => (x >= 0 && x < n ? x : -1));
    let del = 0; const rank = f.map(x => (x < 0 ? del++ : -1)), drops = new Int16Array(n), slot = f.map(x => (x >= 0 ? drops[x]++ : -1));
    return { n, p, f, rank, slot, drops, delivered: del, expected: NAT.N * p, sd: Math.sqrt(NAT.N * p * (1 - p)) };
  });
  // one check at the riskiest handoff of the longest chain (expected only — at N = 40 one draw cannot show it)
  const n3 = rows[2]; let m = 0; for (let i = 1; i < n3; i++) if (NAT.Q[i] < NAT.Q[m]) m = i;
  const qm = NAT.Q[m] + (1 - NAT.Q[m]) * 0.8 * NAT.Q[m];
  return { rows: R, risk: m, expCheck: NAT.N * R[2].p / NAT.Q[m] * qm, seed };
}

Atelier.film({
  id: 'escapement-native',
  title: 'The Escapement — every handoff adds a step',
  direction: 'A · The Escapement',
  level: 'glance',
  duration: 30,
  size: [960, 540],
  renderer: 'webgl',
  fps: 30,
  seed: 1,
  ground: '#0A0E11',
  chapters: [{ t: 0, label: 'The train' }, { t: 2.4, label: 'Two handoffs' }, { t: 4.6, label: 'Six' }, { t: 8.4, label: 'Twelve' }, { t: 23.5, label: 'Read the trays' }],
  captions: [
    { t0: 0.2, t1: 2.4, text: 'A process as a gear train. Each wheel is a system; each ball is one job.' },
    { t0: 2.4, t1: 6.2, text: 'At every mesh the job hops to the next system. A missed hop drops the job right there.' },
    { t0: 6.2, t1: 10.0, text: 'The same train with six handoffs: the same forty jobs, so it can only lose more.' },
    { t0: 10.0, t1: 17.0, text: 'Twelve handoffs. The reliabilities are a sketch; the multiplying is not.' },
    { t0: 17.0, t1: 23.5, text: 'Each tray is one draw. The dashed line is what to expect: about 37, 30 and 21 of 40.' },
    { t0: 23.5, t1: 30.0, text: 'One check at the weakest handoff buys back about one job. Cutting six handoffs buys eight.' },
  ],
  state: { handoffs: 12 },
  controls: [
    { key: 'handoffs', type: 'range', label: 'Handoffs in the longest train', min: 1, max: 12, step: 1, format: v => Math.round(v),
      hint: 'The same 40 jobs re-run through a shorter or longer third train.', jump: 10.0 },
  ],
  fonts: [],
  engine: natEngine,

  setup(p, ctx) {
    const M = ESC.M, sh = ESC.partShader(p, ctx), F = c => p.fill(c, 0, 0);
    // one geometry per tooth count: involute rim, crossings, hub (built once)
    const gears = {};
    for (const z of new Set(NAT.Z)) gears[z] = p.buildGeometry(() => {
      const g = ESC.involute(z, NAT.m, 20, 5), ri = g.rf - 5;
      const inner = g.pts.map(q => { const a = Math.atan2(q[1], q[0]); return [ri * Math.cos(a), ri * Math.sin(a)]; });
      ESC.band(p, g.pts, inner, -4, 4, { front: M.WHEEL, side: M.WHEEL }, true);
      ESC.prism(p, ESC.circle(ri + 0.5, 64), -3, 2.5, { front: M.TRAIN, side: M.TRAIN });
      for (let s = 0; s < 5; s++) { const a = s * ESC.TAU / 5; ESC.prism(p, ESC.quad(Math.cos(a), Math.sin(a), 2.0, 5, ri - 1), 2.5, 3.6, { front: M.WHEEL }); }
      ESC.prism(p, ESC.circle(6, 24), 2.5, 5.5, { front: M.WHEEL, side: M.WHEEL });
      ESC.prism(p, ESC.circle(2.4, 16), 5.5, 6.0, { front: M.BORE });
    });
    const ball = p.buildGeometry(() => {
      const r = NAT.ballR, nu = 16, nv = 10, P = (i, j) => { const u = ESC.TAU * i / nu, v = Math.PI * j / nv, x = Math.sin(v) * Math.cos(u), y = Math.cos(v), z = Math.sin(v) * Math.sin(u); p.normal(x, y, z); p.vertex(r * x, r * y, r * z); };
      p.beginShape(p.TRIANGLES); F(M.BALL);
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { P(i, j); P(i + 1, j); P(i + 1, j + 1); P(i, j); P(i + 1, j + 1); P(i, j + 1); }
      p.endShape();
    });
    // tray: 10 × 4 dimples, sectioned edge hatched; shelf: a cut slate bar
    const tray = p.buildGeometry(() => {
      ESC.prism(p, ESC.roundRect(-8, -8, 118, 52, 6, 3), -8, -2, { front: M.PLATE, side: M.EDGE });
      ESC.prism(p, [[-8, 52], [118, 52], [118, 58], [-8, 58]], -8, 6, { front: M.CUT, side: M.EDGE });
      for (let k = 0; k < 40; k++) ESC.prism(p, ESC.circle(5.2, 14, 0, 5 + Math.floor(k / 4) * 11, 6 + (k % 4) * 11), -2, -1.7, { front: M.BORE });
    });
    const bar = p.buildGeometry(() => { ESC.prism(p, [[0, 0], [1, 0], [1, 1], [0, 1]], -8, 8, { front: M.CUT, side: M.EDGE }); });
    const pawl = p.buildGeometry(() => { ESC.prism(p, [[-3, -2.4], [44, -1.6], [50, 0], [44, 1.8], [-3, 2.4]], 6, 9, { front: M.PAWL, side: M.PAWL }); ESC.prism(p, ESC.circle(4, 20), 5, 10, { front: M.PAWL, side: M.PAWL }); });
    // the chain: centres zig-zag a little; mesh angle λ_i from wheel i to i+1
    const r = NAT.Z.map(z => NAT.m * z / 2), cx = [0], cy = [0], lam = [];
    for (let i = 0; i < 12; i++) { const a = (i % 2 ? -1 : 1) * 0.26 * (i % 3 === 2 ? 0.4 : 1); lam.push(a); cx.push(cx[i] + (r[i] + r[i + 1]) * Math.cos(a)); cy.push(cy[i] + (r[i] + r[i + 1]) * Math.sin(a)); }
    const T = ctx.tokens, C = hx => ctx.U.color.hex2rgb(hx);
    ctx.S = { sh, gears, ball, tray, bar, pawl, r, cx, cy, lam, col: { copper: C(T.copper), peach: C(T.peach) } };
  },

  draw(p, t, ctx) {
    const { U, tokens: T, engine: E, S } = ctx, clamp = ESC.clamp, TAU = ESC.TAU;
    const hud = ctx.layer('hud', { kind: 'p2d' }); hud.clear();
    const ROWY = [0, 250, 500], XT = 1230, XIN = -230, rb = S.r.map(x => x - NAT.delta);
    // ── camera: one front elevation, a touch from above ──
    const cxs = 560, cys = 275, visW = 1880, fov = 16, d = (visW * 540 / 960) / 2 / Math.tan(fov / 2 * ESC.D2R), pit = 0.07;
    p.perspective(fov * ESC.D2R, 960 / 540, d * 0.5, d * 2);
    p.camera(cxs, cys - d * Math.sin(pit), d * Math.cos(pit), cxs, cys, 0, 0, 1, 0);
    p.noStroke(); ESC.usePart(p, S.sh, 4.5);
    const sh = S.sh, mdl = (g, x, y, z, a, tintRGB, sc) => { p.push(); p.translate(x, y, z || 0); if (a) p.rotateZ(a); if (sc) p.scale(sc[0], sc[1], sc[2]); ESC.tint(sh, tintRGB); p.model(g); p.pop(); };
    // ── per row: wheels (exact mesh phase along the chain), balls, shelf, tray ──
    const segs = [];   // per wheel i: arc entry/exit angles, direction, time on wheel
    for (let i = 0; i <= 12; i++) {
      const dir = i % 2 ? -1 : 1, aIn = i === 0 ? Math.PI : S.lam[i - 1] + Math.PI;
      segs.push({ dir, aIn, arc: n => { const aOut = i === n ? 0 : S.lam[i]; let a = dir * (aOut - aIn); a = ((a % TAU) + TAU) % TAU; if (a < 0.3) a += TAU; return a; } });
    }
    const tallies = [];
    E.rows.forEach((R, k) => {
      const y0 = ROWY[k], n = R.n, t0 = NAT.rowStart[k], tin = NAT.rowIn[k];
      const shown = i => i <= 2 || t >= tin + 0.18 * (i - 2) + 0.2, slide = i => (i <= 2 ? 0 : (1 - U.seg(t, tin + 0.18 * (i - 2), tin + 0.18 * (i - 2) + 0.5, 'inOut')) * 700);
      if (t < tin - 0.05 && k > 0) { tallies.push(null); return; }
      // wheel angles: wheel 0 turns at V / r0 once the row runs; the chain follows by exact meshing
      const om0 = NAT.V / S.r[0], th = [t < t0 ? 0 : om0 * (t - t0)];
      for (let i = 0; i < n; i++) th.push(ESC.meshAngle(th[i], NAT.Z[i], NAT.Z[i + 1], S.lam[i]));
      for (let i = 0; i <= n; i++) if (shown(i)) mdl(S.gears[NAT.Z[i]], S.cx[i] + slide(i), y0 + S.cy[i], 0, th[i]);
      // shelf under the train, rail to the tray, the tray (one per row, aligned: the ruler), the input tray
      const shelfY = y0 + 92;
      mdl(S.bar, XIN, shelfY, 0, 0, null, [XT - XIN + 130, 7, 1]);
      mdl(S.tray, XT, y0 - 26, 0); mdl(S.tray, XIN, y0 - 26, 0);
      if (k === 2 && t >= 23.5) { const mi = E.risk, mx = S.cx[mi] + S.r[mi] * Math.cos(S.lam[mi]), my = y0 + S.cy[mi] + S.r[mi] * Math.sin(S.lam[mi]); mdl(S.pawl, mx + 40, my + 55, 8, Math.atan2(-55, -40) - 0.1 * (1 - U.seg(t, 23.5, 24.2, 'inOut'))); }
      // balls: closed-form path — input tray → wheel 0 → hop … → wheel n → rail → output tray (or a fall at a mesh)
      const tray = (x0, j) => [x0 + 5 + Math.floor(j / 4) * 11, y0 - 26 + 6 + (j % 4) * 11, 6];
      let del = 0; const drops = new Int16Array(n);
      for (let j = 0; j < NAT.N; j++) {
        const f = R.f[j], te = t0 + 0.4 + j * NAT.dt; let pos = null, col = 'copper';
        const entry = [S.cx[0] - rb[0], y0 + S.cy[0], 8];
        if (t < te - 0.35) pos = tray(XIN, j);
        else if (t < te) { const a = tray(XIN, j), u = U.seg(t, te - 0.35, te, 'inOut'); pos = [a[0] + (entry[0] - a[0]) * u, a[1] + (entry[1] - a[1]) * u - 18 * Math.sin(Math.PI * u), 8]; }
        else {
          let tau = t - te; const last = f >= 0 ? f : n;
          for (let i = 0; i <= last; i++) {
            const sg = segs[i], arcI = sg.arc(n), dur = arcI * S.r[i] / NAT.V;
            if (tau < dur) { const a = sg.aIn + sg.dir * arcI * (tau / dur); pos = [S.cx[i] + rb[i] * Math.cos(a), y0 + S.cy[i] + rb[i] * Math.sin(a), 8]; break; }
            tau -= dur;
            const ax = S.cx[i] + rb[i] * Math.cos(i === n ? 0 : S.lam[i]), ay = y0 + S.cy[i] + rb[i] * Math.sin(i === n ? 0 : S.lam[i]);
            if (i === last && f >= 0) {                     // the hop misses: forward off the wheel, down onto the shelf at this mesh
              const k2 = R.slot[j], yEnd = shelfY - NAT.ballR - k2 * (2 * NAT.ballR + 0.5), u = clamp(tau / 0.45, 0, 1);
              pos = [ax + 6 * u, ay + (yEnd - ay) * u * u, 8 + 14 * Math.min(1, tau / 0.1)]; col = 'peach';
              if (u >= 1) drops[f]++;
              break;
            }
            if (i === n) {                                    // off the last wheel, along the rail, into the tray
              const o = tray(XT, R.rank[j]), u = U.seg(tau, 0, 0.25 + (o[0] - ax) / 900, 'inOut');
              pos = [ax + (o[0] - ax) * u, ay + (o[1] - ay) * u - 20 * Math.sin(Math.PI * u), 8];
              if (u >= 1) del++;
              break;
            }
            if (tau < NAT.hop) { const u = tau / NAT.hop, bx = S.cx[i + 1] + rb[i + 1] * Math.cos(S.lam[i] + Math.PI), by = y0 + S.cy[i + 1] + rb[i + 1] * Math.sin(S.lam[i] + Math.PI); pos = [ax + (bx - ax) * u, ay + (by - ay) * u, 8 + 10 * Math.sin(Math.PI * u)]; break; }
            tau -= NAT.hop;
          }
        }
        if (pos) mdl(S.ball, pos[0], pos[1], pos[2], 0, S.col[col]);
      }
      tallies.push({ del, drops });
    });
    p.resetShader();
    const w2s = (x, y, z) => { const v = p.worldToScreen(x, y, z || 0); return [v.x, v.y]; };
    // ── HUD (≥ 14 px for anything that must be read) ──
    const H = hud, inkA = (a, hex) => U.color.rgba(hex || T.ink, a), X2 = H.drawingContext;
    const text = (str, x, y, size, col, align, wgt, fam) => { X2.font = (wgt || 400) + ' ' + size + 'px ' + (fam || 'Barlow'); X2.fillStyle = col; X2.textAlign = align || 'left'; X2.fillText(str, x, y); };
    const titleA = 1 - U.seg(t, 2.0, 2.6, 'inOut');
    if (titleA > 0) { text('Every handoff', 420, 300, 50, inkA(titleA), 'left', 300); text('adds a step', 420, 356, 50, inkA(titleA), 'left', 300); }
    E.rows.forEach((R, k) => {
      const tl = tallies[k]; if (!tl) return;
      const a = k === 0 ? U.seg(t, 2.2, 2.8, 'inOut') : U.seg(t, NAT.rowIn[k], NAT.rowIn[k] + 0.6, 'inOut');
      const lab = w2s(XIN - 14, ROWY[k] + 4, 0);
      text(String(R.n), lab[0], lab[1] + 8, 30, inkA(a), 'right', 300); text(R.n === 1 ? 'handoff' : 'handoffs', lab[0], lab[1] + 26, 14, inkA(a * 0.75), 'right');
      // the tray: realised count beside it, the exact expectation as a dashed line across it
      const tx = w2s(XT + 124, ROWY[k] - 6, 0);
      if (t >= NAT.rowStart[k] + 0.8) text(String(tl.del), tx[0] + 6, tx[1] + 12, 30, inkA(0.95, T.copper), 'left', 300);
      const ea = U.seg(t, 17.0 + 0.5 * k, 17.6 + 0.5 * k, 'inOut');
      if (ea > 0) {
        const ex = R.expected, xe = XT + 5 + (ex / 4) * 11 - 5.5, e0 = w2s(xe, ROWY[k] - 34, 10), e1 = w2s(xe, ROWY[k] + 34, 10);
        H.stroke(inkA(ea, T.ink)); H.strokeWeight(1.6); X2.setLineDash([4, 3]); H.line(e0[0], e0[1], e1[0], e1[1]); X2.setLineDash([]); H.noStroke();
        text('expect ' + ex.toFixed(1), e1[0], e1[1] + 16, 14, inkA(ea * 0.85), 'center', 400, '"IBM Plex Mono"');
      }
      // drop counts under each mesh (the address)
      if (t >= 17.0) for (let i = 0; i < R.n; i++) if (tl.drops[i]) { const mx = S.cx[i] + S.r[i] * Math.cos(S.lam[i]), m = w2s(mx, ROWY[k] + 108, 0); text(String(tl.drops[i]), m[0], m[1], 14, inkA(0.9 * U.seg(t, 17, 17.6, 'inOut'), T.peach), 'center', 500, '"IBM Plex Mono"'); }
    });
    // one check vs fewer handoffs (expected values; at N = 40 a single draw cannot show a ~1-job effect)
    const ca = U.seg(t, 23.5, 24.3, 'inOut');
    if (ca > 0 && E.rows[2].n >= 2) {
      const R = E.rows[2], xe = XT + 5 + (E.expCheck / 4) * 11 - 5.5, e0 = w2s(xe, ROWY[2] - 34, 10), e1 = w2s(xe, ROWY[2] + 34, 10);
      H.stroke(inkA(ca, T.sage)); H.strokeWeight(1.6); X2.setLineDash([4, 3]); H.line(e0[0], e0[1], e1[0], e1[1]); X2.setLineDash([]); H.noStroke();
      text('one check at the ' + Math.round(NAT.Q[E.risk] * 100) + ' % handoff: expect ' + E.expCheck.toFixed(1), e0[0] + 40, e0[1] - 10, 14, inkA(ca, T.sage), 'right', 500);
      void R;
    }
    if (t >= 2.6) { const s0 = w2s(XIN, ROWY[2] + 150, 0); text('handoff reliabilities 91–97 % each — a sketch; 40 jobs, the same draws in every train', s0[0], s0[1], 14, inkA(0.6 * U.seg(t, 2.6, 3.2, 'inOut'))); }
    p.push(); p.resetShader(); p.noLights(); p.camera(); p.perspective(); p.clearDepth(); p.imageMode(p.CORNER); p.image(hud, -480, -270, 960, 540); p.pop();
  },

  score(ctx) {
    const E = natEngine(ctx), ev = [];
    // delivered clicks per row (pitch rises with the row) and a clack per dropped job, at the computed times
    E.rows.forEach((R, k) => {
      const t0 = NAT.rowStart[k];
      for (let j = 0; j < NAT.N; j++) {
        const te = t0 + 0.4 + j * NAT.dt;
        if (j % 4 === 0) ev.push({ t: te, kind: 'tick', gain: 0.25, freq: 3000 + 300 * k });
        if (R.f[j] >= 0) ev.push({ t: te + 0.6 + 0.35 * R.f[j], kind: 'clack', gain: 0.4, freq: 160 + 20 * k });
      }
    });
    ev.push({ t: 17.0, kind: 'tone', freq: 392, dur: 1.2, gain: 0.45 });
    ev.push({ t: 23.5, kind: 'click', gain: 0.6, freq: 1760 });
    return ev;
  },

  meta(ctx) {
    const E = natEngine(ctx);
    return [
      ...E.rows.flatMap(R => [{ label: R.n + ' handoffs · delivered (of 40)', value: R.delivered }, { label: R.n + ' handoffs · expected', value: +R.expected.toFixed(2) }]),
      { label: 'One check at the weakest handoff · expected', value: +E.expCheck.toFixed(2) },
      { label: 'Reliabilities', value: 'sketch' }, { label: 'seed', value: E.seed },
    ];
  },
});
