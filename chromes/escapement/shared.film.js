/* A · THE ESCAPEMENT — shared concept: "What an AI agent actually does" (glance). Revision 1.
   Mark rule: one module = one run; one tooth of the 20-tooth escape wheel = one step; one tick = one loop
   iteration. A slip is a tooth that passes the pallet with no impulse: the movement stops inside that step, its
   plates go dark, and the slipped tooth and the two dial ticks that bracket the step light peach (the address).
   Twin worlds in depth: the checked bank stands BEHIND the unchecked one on the same draws; its sage pawl catches
   4 slips in 5 and holds the movement one extra beat per catch (the cost, seen as lag). Ending: both banks re-rack
   by the step where each run stopped, so their silhouettes ARE the survival curves; the exact curve is engraved
   under them. Every count is read from the modules, which are driven only by Atelier.AgentLoop. */

/** pure plan from the engine (score/meta may run before setup) */
const ESC_PLAN = new WeakMap();
function escPlan(A) {
  let P = ESC_PLAN.get(A); if (P) return P;
  let hero = -1, best = 99;
  for (let r = 0; r < A.N; r++) { const f = A.failStep.off[r]; if (f >= 0 && A.failStep.on[r] < 0 && Math.abs(f - 7) < best) { best = Math.abs(f - 7); hero = r; } }
  const caught = Array.from({ length: A.N }, (_, r) => { const out = [], f = A.failStep.on[r]; for (let j = 0; j < 20; j++) if ((f < 0 || j < f) && A.slip(r, j)) out.push(j); return out; });
  const doneSteps = w => Array.from({ length: A.N }, (_, r) => (A.failStep[w][r] < 0 ? 20 : A.failStep[w][r]));
  const rank = w => { const d = doneSteps(w), idx = d.map((_, r) => r).sort((a, b) => d[b] - d[a] || a - b), out = new Int16Array(A.N); idx.forEach((r, i) => (out[r] = i)); return out; };
  // the checked bank's clock: a caught step costs one extra beat (the verifier holds the movement)
  const endUnits = Array.from({ length: A.N }, (_, r) => { const f = A.failStep.on[r], n = caught[r].length; return (f < 0 ? 20 : f + 1) + n; });
  const extra = caught.reduce((s, c) => s + c.length, 0);
  P = { hero, fH: A.failStep.off[hero], caught, done: { off: doneSteps('off'), on: doneSteps('on') }, rank: { off: rank('off'), on: rank('on') }, endUnits, extra,
    maxUnits: Math.max(20, ...endUnits) };
  ESC_PLAN.set(A, P); return P;
}
const ESC_T = { run0: 16.4, unit: 0.42, rack0: 27.0 };

Atelier.film({
  id: 'escapement-shared',
  title: 'The Escapement — what an AI agent actually does',
  direction: 'A · The Escapement',
  level: 'glance',
  duration: 34,
  size: [960, 540],
  renderer: 'webgl',
  fps: 30,
  seed: 1,
  ground: '#0A0E11',
  chapters: [
    { t: 0, label: 'One run' }, { t: 3.0, label: 'Anatomy' }, { t: 7.0, label: 'A slip' }, { t: 11.2, label: 'Your call' },
    { t: 16.4, label: 'Fifty runs, twice' }, { t: 26.8, label: 'Racked' }, { t: 30.0, label: 'Read it' },
  ],
  captions: [
    { t0: 0.2, t1: 3.0, text: 'An AI agent as a clock movement. One movement is one run of a task.' },
    { t0: 3.0, t1: 7.0, text: 'Each tick is one loop: plan, act, observe, check. Each tooth is one step, 20 to a run.' },
    { t0: 7.0, t1: 11.2, text: 'A slip: a tooth passes the pallet with no impulse. The movement stops inside that step.' },
    { t0: 11.2, t1: 16.4, text: 'Fifty runs, 20 steps each, every step right 95 % of the time. How many come home?' },
    { t0: 16.4, t1: 26.8, text: 'Same draws twice. Behind, a verifier pawl catches 4 slips in 5; each catch costs a beat.' },
    { t0: 26.8, t1: 30.0, text: 'Racked by the step where each one stopped, the runs draw their own survival curve.' },
    { t0: 30.0, t1: 34.0, text: 'Expected: about 18 of 50 home with no check, about 39 with one. Each run is one draw.' },
  ],
  state: { guess: 25 },
  controls: [
    { key: 'guess', type: 'commit', label: 'Hands that come home, no check (of 50)', min: 0, max: 50, step: 1, jump: 16.4, countdown: 3,
      hint: 'Commit before the bank runs.', format: v => Math.round(v) },
  ],
  fonts: [],
  engine: ctx => Atelier.AgentLoop({ N: 50, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    const A = ctx.engine;
    const X = ESC.escapement();
    const G = ESC.buildMovement(p, X, 'lo'), Ghi = ESC.buildMovement(p, X, 'hi');
    const D = { img: ESC.dataTexture(p, 100), part: 0, pivot: [0, 0], cols: 10, perBank: 50, pitch: [116, 148], banks: [0, 0, 0, 0], ratio: 0, off: [0, 0], hatch: 3.2 };
    const sh = ESC.movementShader(p, ctx, D), psh = ESC.partShader(p, ctx);
    const phiL = -Math.PI / 2 - X.E.beta * ESC.D2R, k0 = Math.round((phiL - X.th0) / X.pitch);
    const toothOf = j => (((k0 - j) % 20) + 20) % 20;
    const bar = p.buildGeometry(() => { ESC.prism(p, [[-0.5, 0], [0.5, 0], [0.5, 1], [-0.5, 1]], -6, 6, { front: ESC.M.PLATE, side: ESC.M.PLATE }); });
    ctx.S = { X, G, Ghi, D, sh, psh, bar, toothOf, tints: new Uint8Array(20) };
  },

  draw(p, t, ctx) {
    const { U, tokens: T, engine: A, S } = ctx, { X, G, D } = S, P = escPlan(A);
    const clamp = ESC.clamp, E = ESC.MV.E, HA = ESC.MV.H, TAU = ESC.TAU;
    const hud = ctx.layer('hud', { kind: 'p2d' }); hud.clear();
    // ── layout ──
    const PX = 116, PY = 148, ZB = 700, YB = -620, XB = 560;                       // the checked bank stands behind and above
    const gridPos = (w, r) => [(r % 10) * PX + (w === 'on' ? XB : 0), Math.floor(r / 10) * PY + (w === 'on' ? YB : 0), w === 'on' ? -ZB : 0];
    const RS = 0.62, RP = 74, HU = 74, YR = 1000, ZR = 420, XR = -1260, PITR = 0.16;   // the rack: scale, pitch, height per step
    const yR = w => YR + (w === 'on' ? ZR * Math.tan(PITR) : 0);           // the checked rack is lowered so both rails meet on screen
    const rackPos = (w, r) => { const k = P.rank[w][r], d = P.done[w][r]; return [XR + (k + 0.5) * RP, yR(w) - d * HU - 66 * RS, w === 'on' ? -ZR : 0]; };
    // ── timeline ──
    const keys = [[0.8, 0], [6.6, 3.6], [9.0, P.fH], [10.6, P.fH + 1]];
    let sHero = 0; for (let i = 0; i < keys.length - 1; i++) if (t >= keys[i][0]) sHero = keys[i][1] + (keys[i + 1][1] - keys[i][1]) * clamp((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0]), 0, 1);
    const rewind = U.seg(t, 11.6, 12.6, 'inOut');
    const units = Math.max(0, (t - ESC_T.run0) / ESC_T.unit);
    const hc = gridPos('off', P.hero);
    // ── camera: inspect → whole module → the two banks in depth → the rack ──
    const camA = { c: [hc[0] - 46, hc[1] - 22, 0], d: 182, fov: 34, yaw: 0.46, pit: 0.26 };
    const camB = { c: [hc[0] - 56, hc[1] + 4, 0], d: 245, fov: 34, yaw: 0.40, pit: 0.2 };
    const camK = { c: [700, 20, -350], d: 2480, fov: 34, yaw: 0.22, pit: 0.2 };
    const camR = { c: [XR + 25 * RP - 80, YR - 730, -200], d: 7700, fov: 18, yaw: 0, pit: PITR };
    const mixCam = (Pc, Q, u) => ({ c: Pc.c.map((v, i) => v + (Q.c[i] - v) * u), d: Math.exp(Math.log(Pc.d) + (Math.log(Q.d) - Math.log(Pc.d)) * u), fov: Pc.fov + (Q.fov - Pc.fov) * u, yaw: Pc.yaw + (Q.yaw - Pc.yaw) * u, pit: Pc.pit + (Q.pit - Pc.pit) * u });
    let cam = mixCam(camA, camB, U.seg(t, 6.7, 7.7, 'inOut'));
    cam = mixCam(cam, camK, U.seg(t, 11.2, 13.4, 'inOut'));
    cam = mixCam(cam, camR, U.seg(t, ESC_T.rack0 - 0.4, ESC_T.rack0 + 2.0, 'inOut'));
    const eye = [cam.c[0] + cam.d * Math.sin(cam.yaw) * Math.cos(cam.pit), cam.c[1] - cam.d * Math.sin(cam.pit), cam.c[2] + cam.d * Math.cos(cam.yaw) * Math.cos(cam.pit)];
    p.perspective(cam.fov * ESC.D2R, 960 / 540, cam.d * 0.3, cam.d * 4);
    p.camera(eye[0], eye[1], eye[2], cam.c[0], cam.c[1], cam.c[2], 0, 1, 0);
    // ── per-instance state, from the engine only ──
    const heroHi = t < 13.0;
    D.lift = U.seg(t, 11.4, 13.0, 'inOut');
    const px = D.img; px.loadPixels();
    const rackU = r => U.seg(t, ESC_T.rack0 + 0.03 * r, ESC_T.rack0 + 0.03 * r + 1.3, 'inOut');
    for (let i = 0; i < 100; i++) {
      const on = i >= 50, r = i % 50, w = on ? 'on' : 'off', f = A.failStep[w][r], isHero = !on && r === P.hero;
      let st, s;
      if (!on) { s = isHero && t < ESC_T.run0 ? sHero : Math.min(20, units); st = ESC.runState(X, s, f, null); }
      else { st = onState(X, units, f, P.caught[r]); s = st.sEq; }
      const tints = S.tints; tints.fill(0);
      if (on) for (const j of P.caught[r]) if (s > j + 0.06) tints[S.toothOf(j)] = 2;
      if (st.failed) tints[S.toothOf(f)] = 1;
      let th = st.th, hs = st.failed ? 1 : (s >= 20 ? 2 : 0);
      let dim = st.failed ? clamp((s - f - 0.15) / 0.6, 0, 1) : 0;
      if (isHero && t >= 11.6 && t < ESC_T.run0) { th = st.th * (1 - rewind); dim *= 1 - rewind; if (rewind > 0.55) { hs = 0; tints.fill(0); } }
      const g = gridPos(w, r), k = rackPos(w, r), u = rackU(P.rank[w][r]);
      const pos = [g[0] + (k[0] - g[0]) * u, g[1] + (k[1] - g[1]) * u, g[2] + (k[2] - g[2]) * u + 160 * Math.sin(Math.PI * u)];
      ESC.writeInstance(px, i, { th: X.th0 + th, al: st.al, pawl: st.pawl, hand: th, handState: hs, vis: (on ? 1 : 0) | (isHero && heroHi ? 2 : 0),
        stop: st.failed && !(isHero && rewind > 0.55 && t < ESC_T.run0) ? f : -1, dim, pos, scale: 1 + (RS - 1) * u }, tints);
    }
    px.updatePixels();
    ESC.drawMovements(p, G, S.Ghi, S.sh, D, X, 100, heroHi ? P.hero : null);
    // the rack: a rod under every module (its length is the steps it completed) and a rail per bank
    const rk = U.seg(t, ESC_T.rack0 + 0.6, ESC_T.rack0 + 2.4, 'inOut');
    if (rk > 0) {
      ESC.usePart(p, S.psh, 3);
      for (const w of ['off', 'on']) {
        const z = w === 'on' ? -ZR : 0;
        if (w === 'off') { p.push(); p.translate(XR + 25 * RP, YR + 8, z - 4); p.scale(50 * RP + 60, 16, 1); p.model(S.bar); p.pop(); }
        for (let r = 0; r < 50 && w === 'off'; r++) {
          const d = P.done[w][r], h = d * HU * rk; if (h < 1) continue;
          const x = XR + (P.rank[w][r] + 0.5) * RP;
          p.push(); p.translate(x, YR - h, z - 12); p.scale(5, h, 0.4); p.model(S.bar); p.pop();
        }
      }
      p.resetShader();
    }
    const w2s = (x, y, z) => { const v = p.worldToScreen(x, y, z || 0); return [v.x, v.y]; };
    // anchors for the close-up labels (projected while the 3D camera is live)
    let AC = null;
    if (t < 11.8) {
      const st = ESC.runState(X, sHero, P.fH, null), al = st.al, bk = X.E.back * ESC.D2R;
      const loc = (q, z) => w2s(hc[0] + E[0] + q[0], hc[1] + E[1] + q[1], z);
      const pp = (r, a) => X.toXY([[r, a]], al, 0)[0];
      const ka = X.th0 + st.th + S.toothOf(P.fH) * X.pitch, ha = st.th - Math.PI / 2;
      AC = { plan: loc(pp(X.ro + 0.1, X.psiL + bk * 0.25), 2.6), act: loc(pp(X.L - 0.6, X.psiL - (X.E.lock + X.E.imp * 0.7) * ESC.D2R), 2.6),
        observe: loc(pp(X.ri - 0.1, X.psiR - bk * 0.25), 2.6), check: loc(pp(X.L + 0.6, X.psiR + (X.E.lock + X.E.imp * 0.7) * ESC.D2R), 2.6),
        tooth: loc([X.E.R * Math.cos(ka), X.E.R * Math.sin(ka)], 2.6),
        hand: w2s(hc[0] + HA[0] + 24 * Math.cos(ha), hc[1] + HA[1] + 24 * Math.sin(ha), 6) };
    }
    // ── HUD (2D, design units; nothing that must be read is under 14 px) ──
    const H = hud, inkA = (a, hex) => U.color.rgba(hex || T.ink, a);
    const text = (str, x, y, size, col, align, wgt) => { H.textFont('Barlow'); H.textStyle(p.NORMAL); H.drawingContext.font = (wgt || 400) + ' ' + size + 'px Barlow'; H.drawingContext.fillStyle = col; H.drawingContext.textAlign = align === p.RIGHT ? 'right' : align === p.CENTER ? 'center' : 'left'; H.drawingContext.fillText(str, x, y); };
    const mono = (str, x, y, size, col, align) => { H.drawingContext.font = '400 ' + size + 'px "IBM Plex Mono"'; H.drawingContext.fillStyle = col; H.drawingContext.textAlign = align === p.RIGHT ? 'right' : align === p.CENTER ? 'center' : 'left'; H.drawingContext.fillText(str, x, y); };
    const width = (str, size, wgt) => { H.drawingContext.font = (wgt || 400) + ' ' + size + 'px Barlow'; return H.drawingContext.measureText(str).width; };
    const leader = (from, to, col, a) => { H.stroke(inkA(a, col)); H.strokeWeight(0.9); H.noFill(); const mx = to[0] - 26; H.line(from[0], from[1], mx, from[1]); H.line(mx, from[1], to[0], to[1]); H.noStroke(); H.fill(inkA(a, col)); H.circle(to[0], to[1], 3.6); };
    H.noStroke();
    // title bookend (sentence case, light: engraved, not a poster)
    const titleA = 1 - U.seg(t, 2.6, 3.2, 'inOut');
    if (titleA > 0) {
      text('What an AI agent', 54, 214, 48, inkA(titleA), p.LEFT, 300); text('actually does', 54, 268, 48, inkA(titleA), p.LEFT, 300);
      text('One movement is one run. One tooth is one step.', 56, 306, 18, inkA(0.72 * titleA));
    }
    // anatomy: the four phases of a tooth's passage, lit as they happen
    if (AC) {
      const a = U.seg(t, 3.0, 3.6, 'inOut') * (1 - U.seg(t, 6.6, 7.1, 'inOut'));
      const u = sHero - Math.floor(sHero);
      const ph = u < 0.14 ? 'act' : u < 0.5 ? 'observe' : u < 0.64 ? 'check' : 'plan';
      const rows = [['plan', 'Plan', 'the entry pallet holds the tooth'], ['act', 'Act', 'the tooth drives the impulse face'], ['observe', 'Observe', 'the exit pallet holds the next'], ['check', 'Check', 'impulse and drop: go on, or stop']];
      if (a > 0) rows.forEach(([k, name, sub], i) => {
        const y = 150 + i * 64, on = ph === k, aa = a * (on ? 1 : 0.45);
        text(name, 56, y, 25, inkA(aa, on ? T.copper : T.ink), p.LEFT, 500); text(sub, 56, y + 21, 15, inkA(aa * 0.85));
        leader([Math.max(250, 68 + width(sub, 15)), y + 16], AC[k], on ? T.copper : T.slate, aa * (on ? 0.95 : 0.6));
      });
      const b = U.seg(t, 7.3, 7.9, 'inOut') * (1 - U.seg(t, 11.0, 11.5, 'inOut'));
      if (b > 0) {
        const slipped = sHero > P.fH + 0.08;
        text('Step ' + (P.fH + 1) + ' of 20', 56, 172, 32, inkA(b, slipped ? T.peach : T.ink), p.LEFT, 500);
        const l1 = slipped ? 'The tooth slipped past the pallet.' : 'Each step, the pallet meets the tooth 95 % of the time.';
        text(l1, 56, 204, 18, inkA(b * 0.92));
        if (slipped) {
          const l2 = 'The movement stops inside this step.';
          text(l2, 56, 232, 16, inkA(b * 0.75));
          leader([68 + width(l1, 18), 198], AC.tooth, T.peach, b); leader([68 + width(l2, 16), 226], AC.hand, T.peach, b * 0.8);
        }
      }
    }
    // the two banks: labels in the material's own place (above each bank), legible
    const bankA = U.seg(t, 12.6, 13.4, 'inOut') * (1 - U.seg(t, ESC_T.rack0, ESC_T.rack0 + 0.6, 'inOut'));
    if (bankA > 0) {
      const f0 = w2s(-58, 666 + 30, 0), b0 = w2s(XB - 58, YB - 74 - 18, -ZB);
      text('No check', f0[0], f0[1] + 14, 17, inkA(bankA), p.LEFT, 500);
      text('With a verifier pawl, same draws', b0[0], b0[1], 16, inkA(bankA, T.sage), p.LEFT, 500);
      // the cost: the checked bank keeps ticking after the unchecked one has finished
      const lagA = U.seg(t, ESC_T.run0 + 20 * ESC_T.unit, ESC_T.run0 + 20 * ESC_T.unit + 0.4, 'inOut') * bankA;
      if (lagA > 0) { text('The checked bank is still ticking:', 640, 360, 17, inkA(lagA * 0.95, T.sage), p.LEFT, 500); text('every catch costs one more beat.', 640, 384, 17, inkA(lagA * 0.95, T.sage), p.LEFT, 500); }
    }
    // commit beat, in clockwork: a pendulum beats three times over the bank before it is released
    const C = ctx.commit, cd = C ? C.countdown(t) : null, qa = U.seg(t, 12.8, 13.4, 'inOut') * (1 - U.seg(t, 16.2, 16.6, 'inOut'));
    if (qa > 0) {
      const qx = 640, qy = 330;
      text('Fifty runs, 20 steps,', qx, qy, 20, inkA(qa), p.LEFT, 500);
      text('95 % a step. How many', qx, qy + 26, 20, inkA(qa), p.LEFT, 500);
      text('hands come home?', qx, qy + 52, 20, inkA(qa), p.LEFT, 500);
      const pvx = qx + 30, pvy = qy + 78, L = 52, tt = cd === null ? 0 : 3 - cd, swing = cd === null ? 0 : 0.42 * Math.cos(Math.PI * tt);
      if (cd !== null && (C.auto || C.committed)) {
        const bx = pvx + L * Math.sin(swing), by = pvy + L * Math.cos(swing);
        H.stroke(inkA(qa * 0.8, T.slate)); H.strokeWeight(1.5); H.line(pvx, pvy, bx, by); H.noStroke(); H.fill(inkA(qa, T.slate)); H.circle(pvx, pvy, 5); H.circle(bx, by, 12);
        for (let k = 0; k < 3; k++) { const lit = tt >= k + 0.5; H.fill(inkA(qa * (lit ? 0.95 : 0.3), lit ? T.ink : T.slate)); H.rect(qx + 84 + k * 16, pvy + 30, 9, 3); }
        mono(C.auto ? 'three beats: guess first' : 'committed', qx + 84, pvy + 58, 14, inkA(qa * 0.8));
      } else if (cd !== null) mono('set your number in the panel', qx, pvy + 30, 14, inkA(qa * 0.8, T.copper));
    }
    // the rack: survival silhouettes, the exact curve engraved under them, one numeral each
    const ra = U.seg(t, ESC_T.rack0 + 1.6, ESC_T.rack0 + 2.6, 'inOut');
    if (ra > 0) {
      const top = (w, j) => [XR, YR - j * HU - 132 * RS, w === 'on' ? -ZR : 0];
      // step scale on the left of the front rack
      for (let j = 0; j <= 20; j += 5) { const a0 = w2s(XR - 30, YR - j * HU, 0), a1 = w2s(XR - 8, YR - j * HU, 0); H.stroke(inkA(ra * 0.6, T.slate)); H.strokeWeight(1); H.line(a0[0], a0[1], a1[0], a1[1]); H.noStroke(); mono(String(j), a0[0] - 6, a0[1] + 5, 14, inkA(ra * 0.75), p.RIGHT); }
      const s0 = w2s(XR - 90, YR - 23.5 * HU, 0); mono('steps done', s0[0], s0[1], 14, inkA(ra * 0.65));
      for (const [w, col] of [['on', T.sage], ['off', T.copper]]) {
        const z = w === 'on' ? -ZR : 0, q = A.exact[w], pts = [];
        for (let j = 0; j <= 20; j += 0.25) { const jj = Math.min(20, j), n = 50 * Math.pow(w === 'off' ? A.exact.p : A.exact.pPrime, jj); pts.push(w2s(XR + n * RP, yR(w) - jj * HU - 132 * RS - 6, z)); }
        void q;
        H.noFill(); H.stroke(inkA(ra * 0.9, col)); H.strokeWeight(1.6); H.drawingContext.setLineDash([5, 4]); H.beginShape(); pts.forEach(v => H.vertex(v[0], v[1])); H.endShape(); H.drawingContext.setLineDash([]); H.noStroke();
        const home = A.survivors[w][20], ex = A.expected[w][20], pl = w2s(XR + (w === 'off' ? home * 0.5 : (A.survivors.off[20] + home) * 0.5) * RP, yR(w) - 20 * HU - 132 * RS - 26, z);
        text(String(home), pl[0], pl[1] - 18, 44, inkA(ra, w === 'off' ? T.ink : T.sage), p.CENTER, 300);
        text(w === 'off' ? 'home with no check' : 'home with the verifier, for +' + P.extra + ' beats', pl[0], pl[1] + 2, 15, inkA(ra * 0.85, w === 'off' ? T.ink : T.sage), p.CENTER, 500);
        const ce = pts[pts.length - 1];
        const c0 = pts[pts.length - 1]; void ce; mono('expected ' + ex.toFixed(1), c0[0] + 10, c0[1] + (w === 'off' ? 22 : -4), 14, inkA(ra * 0.85, col));
      }
      const lb = w2s(XR + 50 * RP, YR + 40, 0), lb2 = w2s(XR + A.survivors.on[20] * RP + 40, yR('on') - 20 * HU - 60, -ZR);
      void lb;
      void lb2;
      if (C && C.committed) { const g = w2s(XR + C.value * RP, YR - 20 * HU - 132 * RS - 4, 0); H.fill(inkA(ra, T.ink)); H.triangle(g[0], g[1] + 6, g[0] - 6, g[1] - 4, g[0] + 6, g[1] - 4); mono('your call ' + Math.round(C.value), g[0] + 9, g[1] - 4, 14, inkA(ra)); }
    }
    p.push(); p.resetShader(); p.noLights(); p.camera(); p.perspective(); p.clearDepth(); p.imageMode(p.CORNER); p.image(hud, -480, -270, 960, 540); p.pop();
  },

  score(ctx) {
    const A = ctx.engine, P = escPlan(A), ev = [];
    const keys = [[0.8, 0], [6.6, 3.6], [9.0, P.fH], [10.6, P.fH + 1]];
    const tOf = s => { for (let i = 0; i < keys.length - 1; i++) if (s >= keys[i][1] && s <= keys[i + 1][1]) return keys[i][0] + (keys[i + 1][0] - keys[i][0]) * (s - keys[i][1]) / (keys[i + 1][1] - keys[i][1]); return null; };
    for (let j = 0; j <= P.fH; j++) {
      if (j < P.fH) { ev.push({ t: tOf(j + 0.14), kind: 'tick', gain: 0.8, freq: 3600 }); ev.push({ t: tOf(j + 0.64), kind: 'tick', gain: 0.6, freq: 2900 }); }
      else ev.push({ t: tOf(j + 0.09), kind: 'clack', gain: 1.1, freq: 170 });
    }
    for (let i = 0; i < 3; i++) ev.push({ t: 13.4 + i + 0.5, kind: 'tick', gain: 0.9, freq: 2400 });   // the pendulum's three beats
    const tu = u => ESC_T.run0 + u * ESC_T.unit;
    for (let j = 0; j < 20; j++) {
      ev.push({ t: tu(j + 0.14), kind: 'tick', gain: 0.25 + 0.6 * Math.sqrt(A.survivors.off[j] / 50), freq: 3600, pan: -0.15 });
      const fo = A.failedAt('off', j); if (fo) ev.push({ t: tu(j + 0.09), kind: 'clack', gain: Math.min(1.4, 0.4 + fo / 3), pan: -0.2 });
    }
    // the checked bank on its own clock (lagging by one beat per catch)
    for (let r = 0; r < A.N; r++) {
      let u = 0; const f = A.failStep.on[r], cs = new Set(P.caught[r]);
      for (let j = 0; j < 20; j++) {
        if (j === f) { ev.push({ t: tu(u + 0.1), kind: 'clack', gain: 0.35, pan: 0.2, freq: 150 }); break; }
        if (cs.has(j)) { ev.push({ t: tu(u + 0.07), kind: 'click', gain: 0.45, pan: 0.25, freq: 1760 }); u += 2; } else u += 1;
      }
    }
    for (let u = 0; u < P.maxUnits; u++) { let alive = 0; for (let r = 0; r < A.N; r++) if (P.endUnits[r] > u && A.failStep.on[r] < 0 || (A.failStep.on[r] >= 0 && P.endUnits[r] > u + 1)) alive++; if (alive) ev.push({ t: tu(u + 0.64), kind: 'tick', gain: 0.15 + 0.5 * Math.sqrt(alive / 50), freq: 2900, pan: 0.15 }); }
    for (let k = 0; k < 50; k++) ev.push({ t: ESC_T.rack0 + 0.03 * k + 1.3, kind: 'click', gain: 0.18, freq: 2600 });
    ev.push({ t: ESC_T.rack0 + 2.4, kind: 'tone', freq: 392, dur: 1.6, gain: 0.5 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine, P = escPlan(A);
    return [
      { label: 'Hands home · no check', value: A.survivors.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8, N: 50 } },
      { label: 'Hands home · verifier', value: A.survivors.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8, N: 50 } },
      { label: 'P(run survives 20) · off', value: A.exact.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8 } },
      { label: 'P(run survives 20) · on', value: A.exact.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8 } },
      { label: 'Runs saved by the check', value: A.saved.length },
      { label: 'Extra beats spent by the verifier', value: P.extra },
      { label: 'seed', value: ctx.seed },
    ];
  },
});

/** the checked world's clock: a caught step = one beat of catch + one beat held by the verifier */
function onState(X, units, f, caught) {
  let u = units, done = 0;
  for (let j = 0; j < 20; j++) {
    if (j === f) { const st = ESC.runState(X, j + Math.min(u, 1.5), f, null); st.sEq = j + Math.min(u, 1.5); return st; }
    const c = caught.includes(j), dur = c ? 2 : 1;
    if (u < dur) {
      if (!c) { const st = ESC.runState(X, j + u, -1, null); st.sEq = j + u; return st; }
      if (u < 1) return { th: j * X.pitch + X.at(X.caught, u), al: X.alphaCaught(u), pawl: ESC.sstep(0.03, 0.09, u), failed: false, sEq: j + u };
      return { th: (j + 1) * X.pitch, al: 0, pawl: 1 - ESC.sstep(0.55, 1, u - 1), failed: false, sEq: j + 0.999 };
    }
    u -= dur; done = j + 1;
  }
  void done;
  return { th: 20 * X.pitch, al: 0, pawl: 0, failed: false, sEq: 20 };
}
