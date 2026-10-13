/* F · BUNRAKU — native concept: "What changes on a team when AI arrives" (glance). Revision 1.
   Before: one person walks the plank — plans, acts and checks every move, and slips too (a sketch: people are not
   perfect either). The person is lifted out; a puppet (the AI) is flown in; the model and the tools take the copper and
   slate rods; the person comes back unhooded and takes the sage check rod. Then fifty stages, three times on the
   engine's own draws: one person per stage (the engine's check), one person per three stages, one person per row.
   A person who checks k stages stands above them with k rods; the sketch assumption, on screen: attention splits
   evenly, so each stage's slip is caught 0.8/k of the time. Closing image: one person's rods stretched across a row. */
Atelier.film({
  id: 'bunraku-native',
  title: 'Bunraku — who holds the rods when AI arrives',
  direction: 'F · Bunraku',
  level: 'glance',
  duration: 34.5,
  size: [960, 540],
  renderer: 'webgl',
  fps: 30,
  seed: 1,
  ground: '#0B0908',
  chapters: [
    { t: 0, label: 'Title' }, { t: 3.6, label: 'Before' }, { t: 8.9, label: 'The exchange' }, { t: 14.0, label: 'One person per stage' },
    { t: 21.4, label: 'One per three' }, { t: 27.0, label: 'One per row' }, { t: 32.0, label: 'The rods' },
  ],
  captions: [
    { t0: 0.3, t1: 3.6, text: 'What changes on a team when AI arrives? Watch who holds which rod.' },
    { t0: 3.6, t1: 8.9, text: 'Before: one person walks the plank — plans, acts, checks. People slip too (sketch).' },
    { t0: 8.9, t1: 14.0, text: 'After: the AI performs. The model plans, tools act, and the person takes the check rod.' },
    { t0: 14.0, t1: 21.4, text: 'Fifty stages, one person at each check rod. Where a puppet falls, the curtain closes.' },
    { t0: 21.4, t1: 27.0, text: 'Same fifty runs, same slips. Now each person checks three stages from above.' },
    { t0: 27.0, t1: 32.0, text: 'One person per row. Sketch: attention splits evenly, so each catch is rarer.' },
    { t0: 32.0, t1: 34.5, text: 'The work moved from the plank to the rods. How many rods can one hand hold?' },
  ],
  state: { span: 'row' },
  controls: [
    { key: 'span', type: 'select', label: 'Wield · stages one person checks (third run)', options: [['1', '1'], ['2', '2'], ['5', '5'], ['row', 'a row (10)']],
      hint: 'Re-runs the third district on the same draws. Sketch assumption: attention splits evenly, so each stage is caught 0.8 ÷ k of the time.', jump: 27.0 },
  ],
  fonts: [],
  engine: ctx => Atelier.AgentLoop({ N: 50, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    const A = ctx.engine, T = ctx.tokens;
    const defs = BK.partDefs(ctx, [
      BK.stencilDef(BK.PID.title, [{ text: 'WHO HOLDS', size: 20, y: -2 }, { text: 'THE RODS', size: 20, y: 18 }], 'Bodoni Moda', 120, 50, 7),
      BK.tagDef(BK.PID.tag0, 'BEFORE', 'plans, acts, checks; slips too', T.copper, 'Instrument Sans', 72, 15),
      BK.tagDef(BK.PID.tag1, 'PLAN', 'the model', T.copper, 'Instrument Sans'),
      BK.tagDef(BK.PID.tag2, 'ACT', 'the tools', T.slate, 'Instrument Sans'),
      BK.tagDef(BK.PID.tag3, 'CHECK', 'the person', T.sage, 'Instrument Sans'),
      BK.boardDef('Gloock'),
    ]);
    const atlas = BK.buildAtlas(p, ctx, defs);
    const G = { atlas, table: BK.makeTable(p, atlas.table) };
    G.props = BK.buildProps(p, atlas.table, [{ slot: 4, part: BK.PID.title }, { slot: 5, part: BK.PID.tag0 }, { slot: 6, part: BK.PID.tag1 }, { slot: 7, part: BK.PID.tag2 }, { slot: 8, part: BK.PID.tag3 },
      { rod: true, slot: 18 }, { rod: true, slot: 20 }, { rod: true, slot: 22 }, { rod: true, slot: 24 }, { rod: true, slot: 26 }, { rod: true, slot: 28 }, { rod: true, slot: 30 }]);
    G.props2 = BK.buildProps(p, atlas.table, Array.from({ length: 25 }, (_, i) => ({ slot: 4 + i, part: BK.PID.opBare })));
    G.hero = nHero(A);
    G.L = BK.district(A.N, G.hero, [10, 10, 10, 10, 10], 290, 300, 300);
    G.D = BK.makeData(p, A.N + 2);
    BK.initRender(p, G);
    ctx.G = G;
    ctx.layer('hud', { kind: 'p2d' });
  },

  draw(p, t, ctx) {
    const G = ctx.G, A = ctx.engine, U = ctx.U, L = G.L, D = G.D, S = BK.S;
    const hero = G.hero, F = L.origin(hero), rowH = L.rowOf[hero];
    const RUNS = [{ t0: 16.2, span: '1' }, { t0: 21.8, span: '3' }, { t0: 27.4, span: ctx.state.span || 'row' }];
    const runI = t < 21.4 ? 0 : (t < 27.0 ? 1 : 2), R = RUNS[runI];
    const W = spanWorld(G, A, U, R.span);
    const district = t >= 14.0, crane = U.seg(t, 14.0, 16.2, 'inOut');
    const clockOf = (t0, ev, mv) => {
      const d = Array.from({ length: 20 }, (_, j) => (ev.some(e => e.step === j && e.kind === 'catch') ? 2 : 1));
      const acc = [0]; for (let j = 0; j < 20; j++) acc.push(acc[j] + d[j]);
      return { m: tt => { const g = (tt - t0) / mv; if (g <= 0) return 0; for (let j = 0; j < 20; j++) if (g < acc[j + 1]) return j + (g - acc[j]) / d[j]; return 20; },
        t: m => { m = BK.clamp(m, 0, 20); const j = Math.min(19, Math.floor(m)); return t0 + mv * (acc[j] + (m - j) * d[j]); } };
    };
    const PR = A.N, PR2 = A.N + 1;
    D.clearRow(PR2); D.stage(PR2, 0, 0, 0, 1);
    const reset = runI === 0 ? 1 : U.seg(t, R.t0 - 0.4, R.t0 - 0.05, 'inOut');
    const closing = runI < 2 ? U.seg(t, RUNS[runI + 1].t0 - 0.9, RUNS[runI + 1].t0 - 0.5, 'inOut') : 0;
    // the people: span 1 → one standing in each stage; span k → one above each group of k with k rods
    const overhead = district && R.span !== '1';
    const lift = overhead ? U.seg(t, R.t0 - 0.4, R.t0, 'inOut') : 0;
    let pi = 0;
    const handOf = new Array(A.N);
    if (overhead) for (const g of W.groups) {
      const xs = g.map(r => L.origin(r)[0]), o0 = L.origin(g[0]), cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const sc = (g.length >= 5 ? 1.35 : 1.0) + (o0[2] === 0 ? 0.75 * U.seg(t, 32.1, 33.6, 'inOut') : 0);
      const feet = [cx, o0[1] - 168, o0[2] - 34];
      D.card(PR2, 4 + pi, 0, feet[0], feet[1], feet[2], lift, sc, 0, BK.PID.opBare); pi++;
      const hand = [cx + 6 * sc, feet[1] - 112 * sc, feet[2] + 8];
      for (const r of g) handOf[r] = hand;
    }
    for (; pi < 25; pi++) D.card(PR2, 4 + pi, 0, 0, 0, 0, 0, 1, 0, BK.PID.opBare);
    for (let r = 0; r < A.N; r++) {
      const row = L.rowOf[r], o = L.origin(r);
      if (!district) {
        if (r !== hero) { BK.writeStage(D, { row, origin: o, m: 0, t, tOf: () => 0, ev: [], walk: false, light: 0, caret: false, curtain: 1 }); continue; }
        const person = t < 9.95;
        const evB = [{ step: 5, kind: 'catch' }], cB = clockOf(3.9, evB, 0.36), cA2 = clockOf(12.8, BK.engineEvents(A, hero, 'on'), 0.24);
        const fly = person ? 300 * U.seg(t, 8.9, 9.9, 'exit') : 300 * (1 - U.seg(t, 10.1, 11.3, 'settle'));
        const m = person ? Math.min(11, cB.m(t)) : cA2.m(t);
        BK.writeStage(D, { row, origin: o, m, t, tOf: person ? cB.t : cA2.t, ev: person ? evB : BK.engineEvents(A, hero, 'on'),
          skin: person ? 'person' : null, fly, opA: person ? 0 : U.seg(t, 11.2, 12.4, 'inOut'), rodA: person ? 0 : U.seg(t, 11.6, 12.6, 'inOut'),
          chkPart: BK.PID.opBare, chkStand: true, caret: false, light: 1 });
        continue;
      }
      const ev = W.ev[r], clk = clockOf(R.t0, ev, 0.2);
      const away = overhead;
      const wake = r === hero ? 1 : U.seg(t, 14.1, 15.8, 'inOut');
      let curtain;
      if (runI === 0 && t < 15.8 && r !== hero) curtain = 1 - wake;
      if (runI > 0 && t < R.t0) curtain = 1 - reset;
      if (closing > 0 && W.fail[r] < 0) curtain = closing;
      const oc = handOf[r] ? [handOf[r][0] - o[0], handOf[r][1] - o[1], handOf[r][2] - o[2]] : null;
      BK.writeStage(D, { row, origin: o, m: clk.m(t), t, tOf: clk.t, ev, chkPart: BK.PID.opBare, chkStand: true, caret: false,
        light: runI === 0 ? wake : U.lerp(0.25, 1, reset), curtain,
        chkBodyA: away ? 1 - lift : 1, chkFrom: away && lift > 0.5 ? oc : null, chkW: away ? 3.2 : 1.6,
        rodA: o[2] === 0 ? 1 : 1 - 0.75 * U.seg(t, 32.1, 33.6, 'inOut') });
    }
    // props: title, tags, threads
    D.clearRow(PR); D.stage(PR, F[0], F[1], F[2], 1);
    const titleY = -84 - 210 * U.seg(t, 3.0, 4.0, 'exit') - 170 * (1 - U.seg(t, 0.0, 1.4, 'settle')), titleA = t < 4.2 ? 1 : 0;
    D.card(PR, 4, 0, 0, titleY, 25, titleA, 1, 0, BK.PID.title);
    for (const sx of [-1, 1]) D.rod(PR, sx < 0 ? 18 : 20, [sx * 55, -320, 25], [sx * 55, titleY - 20.7, 25], [sx * 55, titleY - 20.7, 25], titleA, 0.35, 3);
    const tag = (slot, rodSlot, part, x, y, a0, a1, b0, b1) => {
      const u = U.seg(t, a0, a1, 'settle') * (1 - U.seg(t, b0, b1, 'exit')), yy = y - 160 * (1 - u);
      D.card(PR, slot, 0.03 * Math.sin(3 * t + slot), x, yy, 14, u > 0 ? 1 : 0, 1, 0, part);
      D.rod(PR, rodSlot, [x, -330, 14], [x, yy - 7.6, 14], [x, yy - 7.6, 14], u > 0 ? 1 : 0, 0.3, 3);
    };
    tag(5, 22, BK.PID.tag0, -6, -96, 4.2, 5.0, 8.4, 9.0);
    tag(6, 24, BK.PID.tag1, -52 - 62, -92, 11.4, 12.1, 13.6, 14.2);
    tag(7, 26, BK.PID.tag2, -52 + 4, -100, 11.8, 12.5, 13.6, 14.2);
    tag(8, 28, BK.PID.tag3, -52 + 70, -92, 12.2, 12.9, 13.6, 14.2);
    { const hx0 = BK.S.xStep(t < 9.95 ? Math.min(11, clockOf(3.9, [{ step: 5, kind: 'catch' }], 0.36).m(t)) : 0), fl = t < 9.95 ? 300 * U.seg(t, 8.9, 9.9, 'exit') : 300 * (1 - U.seg(t, 10.1, 11.3, 'settle'));
      const on = (t > 8.8 && t < 11.8) ? 1 - U.seg(t, 11.3, 11.8, 'inOut') : 0;
      D.rod(PR, 30, [hx0 - 3, -330, 0.5], [hx0 - 3, -66 - fl, 0.5], [hx0 - 3, -66 - fl, 0.5], on, 0.3, 3); }
    D.upload();
    // camera: close → district (long lens) → the front row and its one person
    const follow = U.seg(t, 3.9, 4.9, 'inOut') * (1 - U.seg(t, 8.4, 9.4, 'inOut'));
    const hxs = BK.S.xStep(t < 9.95 ? Math.min(11, clockOf(3.9, [{ step: 5, kind: 'catch' }], 0.36).m(t)) : 0);
    let eye = [F[0] - 10 + follow * hxs * 0.4, -40, 330 - 40 * follow], tgt = [F[0] + follow * hxs * 0.5, -40, 0];
    let fov = 30, K = 22;
    if (crane > 0) {
      const dEye = [0, -1180, 6200], dTgt = [0, -330, -600], lift2 = Math.sin(crane * Math.PI / 2);
      eye = [U.lerp(eye[0], dEye[0], crane), U.lerp(eye[1], dEye[1], lift2), U.lerp(eye[2], dEye[2], crane)];
      tgt = tgt.map((v, i) => U.lerp(v, dTgt[i], crane)); fov = U.lerp(30, 17.7, Math.pow(crane, 0.6)); K = U.lerp(22, 5, crane);
      const fin = U.seg(t, 32.1, 33.9, 'inOut');
      if (fin > 0) {
        const fEye = [0, -300, 1550], fTgt = [0, -215, 0];
        eye = eye.map((v, i) => U.lerp(v, fEye[i], fin)); tgt = tgt.map((v, i) => U.lerp(v, fTgt[i], fin)); fov = U.lerp(fov, 34, fin); K = U.lerp(K, 40, fin);
      }
    }
    const house = district ? U.lerp(0.06, 0.32, crane) + 0.3 * U.seg(t, 32.1, 33.4, 'inOut') : 0.05;
    BK.render(p, ctx, G, { eye, tgt, fov, K, house, light: { pos: S.light, aim: S.aim, R: S.lightR }, ranges: L.ranges, props: G.props, props2: G.props2, propsRow: PR,
      title: titleA > 0 ? [BK.PID.title, 0, titleY, 25] : null, titleRow: rowH });
    nHud(p, t, ctx, RUNS, G, A, U);
  },

  score(ctx) {
    const A = ctx.engine, ev = [];
    ev.push({ t: 0.35, kind: 'tone', freq: 131, dur: 1.6, gain: 0.7 });
    for (let j = 0; j < 11; j++) { const tt = 3.9 + 0.36 * (j + (j > 5 ? 1 : 0)); ev.push({ t: tt + 0.02, kind: 'tick', freq: 1500, gain: 0.45 }); if (j === 5) ev.push({ t: tt + 0.2, kind: 'clack', gain: 0.6, freq: 170 }); }
    ev.push({ t: 9.0, kind: 'tone', freq: 220, dur: 0.9, gain: 0.35 }); ev.push({ t: 10.2, kind: 'tone', freq: 165, dur: 1.1, gain: 0.35 });
    for (let k = 0; k < 3; k++) ev.push({ t: 11.4 + k * 0.4, kind: 'click', freq: [880, 660, 990][k], gain: 0.35 });
    for (const [t0, span] of [[16.2, '1'], [21.8, '3'], [27.4, ctx.state.span || 'row']]) {
      const W = spanWorld({}, A, Atelier.U, span);
      for (let j = 0; j < 20; j++) { ev.push({ t: t0 + j * 0.2 + 0.01, kind: 'tick', freq: 2100, gain: 0.26 }); let n = 0; for (let r = 0; r < A.N; r++) if (W.fail[r] === j) n++; if (n) ev.push({ t: t0 + j * 0.2 + 0.12, kind: 'clack', gain: Math.min(1.2, 0.35 + n * 0.22), freq: 150 }); }
      for (let i = 0; i < W.lit; i++) ev.push({ t: t0 + 4.6 + 0.6 * i / W.lit, kind: 'tick', freq: 1000, gain: 0.2 });
    }
    ev.push({ t: 32.4, kind: 'tone', freq: 196, dur: 1.6, gain: 0.45 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine, W3 = spanWorld({}, A, Atelier.U, '3'), Wc = spanWorld({}, A, Atelier.U, ctx.state.span || 'row');
    return [
      { label: 'Stages lit · one person per stage', value: A.survivors.on[20], check: { world: 'on', k: 20, N: 50 } },
      { label: 'Stages lit · one person per 3 (sketch model)', value: W3.lit },
      { label: 'Expected · one per 3 (sketch)', value: +W3.exp.toFixed(1) },
      { label: 'Stages lit · third run (sketch model)', value: Wc.lit },
      { label: 'Expected · third run (sketch)', value: +Wc.exp.toFixed(1) },
    ];
  },
});

function nHero(A) {
  for (let r = 0; r < A.N; r++) { const e = A.events(r, 'on'); if (A.failStep.on[r] < 0 && e.length && e[0].step === 1) return r; }
  return 0;
}
/* span world on the engine's draws: within each row, groups of k adjacent stages share one person; catch = c / k.
   k = 1 reproduces the engine's checked world exactly. Groups of 3 in a row of 10: 3, 3, 4. */
function spanWorld(G, A, U, span) {
  const key = 'sw' + span;
  if (G[key]) return G[key];
  const L = G.L || BK.district(A.N, nHero(A), [10, 10, 10, 10, 10], 290, 300, 300), { seed, p, c, k } = A.params;
  const W = { ev: [], fail: new Int16Array(A.N).fill(-1), lit: 0, exp: 0, size: new Array(A.N).fill(1), groups: [] };
  const byCell = new Array(L.cells.length); for (let r = 0; r < A.N; r++) byCell[L.rowOf[r]] = r;
  for (const [base, n] of L.ranges) {
    const kk = span === 'row' ? n : Math.max(1, parseInt(span, 10) || 1);
    const sizes = []; let left = n; while (left > 0) { let s = Math.min(kk, left); if (left - s > 0 && left - s < kk && kk > 1 && left - s < Math.ceil(kk / 2)) s = left; sizes.push(s); left -= s; }
    let i0 = 0;
    for (const m of sizes) { const g = []; for (let i = i0; i < i0 + m; i++) { const r = byCell[base + i]; W.size[r] = m; g.push(r); } W.groups.push(g); i0 += m; }
  }
  for (let r = 0; r < A.N; r++) {
    const ce = c / W.size[r], ev = [];
    for (let j = 0; j < k; j++) {
      if (!(U.h(seed, r, j, 0) > p)) continue;
      if (U.h(seed, r, j, 1) < ce && U.h(seed, r, j, 2) < p) { ev.push({ step: j, kind: 'catch' }); continue; }
      ev.push({ step: j, kind: 'fall' }); W.fail[r] = j; break;
    }
    W.ev.push(ev); if (W.fail[r] < 0) W.lit++;
    W.exp += Math.pow(p + (1 - p) * ce * p, k);
  }
  W.sd = Math.sqrt(Array.from({ length: A.N }, (_, r) => { const q = Math.pow(p + (1 - p) * (c / W.size[r]) * p, k); return q * (1 - q); }).reduce((a, b) => a + b, 0));
  G[key] = W;
  return W;
}
/* the apron board: one chalk ruler 0–50, one row of strokes per run (a stroke per lit stage), an expectation notch each */
function nHud(p, t, ctx, RUNS, G, A, U) {
  const H = ctx.layer('hud'); H.clear();
  const a = U.seg(t, 19.6, 20.2, 'inOut');
  if (a <= 0) return;
  const g = H.drawingContext;
  g.save(); g.globalAlpha = a;
  const grd = g.createLinearGradient(0, 428, 0, 540); grd.addColorStop(0, 'rgba(9,8,7,0)'); grd.addColorStop(0.18, 'rgba(9,8,7,0.95)'); grd.addColorStop(1, 'rgba(6,5,5,1)');
  g.fillStyle = grd; g.fillRect(0, 428, 960, 112);
  g.fillStyle = 'rgba(214,201,176,0.85)'; g.fillRect(0, 442, 960, 3.2);
  g.restore();
  const ink = '#EDE8DC', sage = '#A9C69B';
  const X0 = 150, X1 = 860, xs = v => X0 + (X1 - X0) * v / 50, base = 512;
  const labs = ['1 per stage', '1 per 3', null];
  BK.chalk(H, U, c => {
    c.globalAlpha = a; c.lineCap = 'round'; c.strokeStyle = ink; c.lineWidth = 2;
    c.beginPath(); c.moveTo(X0, base); c.lineTo(X1, base); c.stroke();
    for (let v = 0; v <= 50; v += 5) { c.lineWidth = v % 25 === 0 ? 2 : 1.3; c.beginPath(); c.moveTo(xs(v), base); c.lineTo(xs(v), base + (v % 25 === 0 ? 8 : 4)); c.stroke(); }
    c.fillStyle = ink; c.font = '400 14px "Instrument Sans"'; c.textAlign = 'center'; c.fillText('0', xs(0), base + 22); c.fillText('50', xs(50), base + 22);
    c.fillText('sketch: one person’s attention splits evenly over the stages they check', xs(25), base + 24);
    RUNS.forEach((R, k) => {
      const sw = U.seg(t, R.t0 + 4.6, R.t0 + 5.2, 'linear'); if (sw <= 0) return;
      const W = spanWorld(G, A, U, R.span), n = Math.floor(sw * W.lit + 1e-6), y1 = 452 + k * 18, y0 = y1 + 13;
      c.strokeStyle = k === 0 ? sage : ink; c.lineWidth = 2;
      for (let i = 0; i < n; i++) { const x = xs(i + 0.5) + (U.h(51, i, k) - 0.5) * 1.6; c.beginPath(); c.moveTo(x, y0); c.lineTo(x + 0.8, y1); c.stroke(); }
      c.fillStyle = k === 0 ? sage : ink; c.textAlign = 'right'; c.font = '400 14px "Instrument Sans"';
      const lab = labs[k] || (R.span === 'row' ? '1 per row' : '1 per ' + R.span);
      c.fillText(lab, X0 - 44, y0); c.font = '400 17px "Gloock"'; c.fillText(String(n), X0 - 10, y0 + 1);
      c.globalAlpha = a * U.seg(t, R.t0 + 5.2, R.t0 + 5.5, 'inOut'); c.beginPath(); c.moveTo(xs(W.exp), y0 + 1); c.lineTo(xs(W.exp) - 4, y0 + 6); c.lineTo(xs(W.exp) + 4, y0 + 6); c.closePath(); c.fill(); c.globalAlpha = a;
    });
    c.globalAlpha = a; c.fillStyle = ink; c.textAlign = 'right'; c.font = '400 14px "Instrument Sans"'; c.fillText('▲ expected', 952, 470);
  });
  p.push(); p.resetShader(); p.noLights(); p.camera(); p.perspective(); p.clearDepth(); p.imageMode(p.CORNER); p.image(H, -480, -270, 960, 540); p.pop();
}
