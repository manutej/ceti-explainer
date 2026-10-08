/* H · EXPOSURE — shared film (revision 1): "What an AI agent actually does" (glance).
   One round plate. Every dimension means something:
     radius  = steps survived (20 slit rings; a ray stops AT the ring where its run slipped: the address),
     angle   = share of runs (each run owns a wedge of 1/n of the circle; wedges are stacked by the ring where they
               stopped, longest first, clockwise from twelve o'clock).
   So the lit arc at any ring IS the survivors at that step, and at the rim it is the share that clears all 20.
   Exposure 10, then 100, then 2,000 runs on the same plate over the faint latent image of the EXPECTED staircase.
   Twin world = a second exposure of the same runs with checks on (onion-skin in one object): cyan light fills
   exactly the wedges the check saved; sage beads mark every step that had to be done twice (the cost).
   Clock law: frame = f(t, state, seed). */
(function () {
  const EX = window.EX, U = Atelier.U, PAL = EX.PAL;
  const N = 2000, K = 20, P = 0.95, C = 0.8;
  const G = { cx: 286, cy: 268, r0: 18, d: 9.5, gauge: 226 };
  G.ring = k => G.r0 + k * G.d;                 // slit ring k (1..20)
  G.rEnd = G.ring(K) + 9;                       // the finish band beyond slit 20
  G.box = Math.ceil(G.gauge + 26);
  const T = { title: [0, 3.4], trace: [3.5, 6.3], commit: 9.6, n10: 9.6, n100: 12.6, n2000: 15.6, reveal: 18.4, second: [21, 24.4], cost: 25, end: 29 };

  const seedOf = ctx => ctx.seed + 7919 * (ctx.state.draws | 0);
  const endOf = f => (f < 0 ? G.rEnd : G.ring(f + 1));          // a run that slipped at step f stops at ring f+1
  const angOf = a => -Math.PI / 2 + a * 2 * Math.PI;           // fraction of circle → canvas angle (clockwise from 12)
  const pol = (a, r) => [G.cx + r * Math.cos(angOf(a)), G.cy + r * Math.sin(angOf(a))];
  /** number of runs exposed at t: 10, then 100, then 2,000 (log ramps between, held beats) */
  function nAt(t) {
    if (t < T.n100 - 0.7) return 10;
    if (t < T.n100) return Math.round(10 * Math.pow(10, U.seg(t, T.n100 - 0.7, T.n100, 'inOut')));
    if (t < T.n2000 - 0.8) return 100;
    if (t < T.n2000) return Math.round(100 * Math.pow(20, U.seg(t, T.n2000 - 0.8, T.n2000, 'inOut')));
    return N;
  }
  /** the first n runs, stacked by stop ring (cleared first), ties by run index: ray ends for both worlds */
  const _ord = new Map();
  function order(A, sd, n) {
    const key = sd + '|' + n; if (_ord.has(key)) return _ord.get(key);
    const runs = []; for (let r = 0; r < n; r++) runs.push(r);
    const kf = r => (A.failStep.off[r] < 0 ? K : A.failStep.off[r]);
    runs.sort((a, b) => kf(b) - kf(a) || a - b);
    const eA = new Float32Array(n), eB = new Float32Array(n);
    runs.forEach((r, i) => { eA[i] = endOf(A.failStep.off[r]); eB[i] = endOf(A.failStep.on[r]); });
    const o = { runs, eA, eB }; if (_ord.size > 64) _ord.clear(); _ord.set(key, o); return o;
  }
  /** expected stop radius at angle fraction a (the exact staircase) */
  function expEnd(a) {
    if (a <= Math.pow(P, K)) return G.rEnd;
    const k = Math.floor(Math.log(a) / Math.log(P));      // P^(k+1) < a ≤ P^k → stopped at slit k+1
    return G.ring(Math.min(K, k + 1));
  }

  Atelier.film({
    id: 'exposure-shared',
    title: 'Exposure — why we can trust the number',
    direction: 'H · Exposure · the light table',
    level: 'glance',
    duration: 34,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: PAL.ground,
    chapters: [
      { t: 0, label: 'Plate' }, { t: 3.5, label: 'One run' }, { t: 6.6, label: 'Mark your guess' }, { t: 9.6, label: '10 runs' },
      { t: 12.6, label: '100 runs' }, { t: 15.6, label: '2,000 runs' }, { t: 21, label: 'Checks on' }, { t: 25, label: 'What checks cost' },
      { t: 29, label: 'The plate' },
    ],
    captions: [
      { t0: 0.3, t1: 3.4, text: 'A long exposure of AI agent runs. Each ray of light is one whole run.' },
      { t0: 3.5, t1: 6.5, text: 'Each ring is one step: plan, act, observe, check. A slip stops the ray at that ring.' },
      { t0: 6.6, t1: 9.6, text: 'Mark the rim: of 2,000 runs, how many pass all 20 rings? Each step is 95 % right.' },
      { t0: 9.6, t1: 12.6, text: 'Ten runs, stacked by where they stopped. The rim reads how many cleared. Too few to trust.' },
      { t0: 12.6, t1: 15.6, text: 'A hundred runs. The staircase edge creeps toward the expected one beneath it.' },
      { t0: 15.6, t1: 21, text: '2,000 runs: the edge sits on the expected staircase, and the band of doubt is thin.' },
      { t0: 21, t1: 25, text: 'Second exposure, same runs, checks on: a check catches 80 % of slips and retries once.' },
      { t0: 25, t1: 29, text: 'Each sage bead is a step done twice: checks cost time. Slips are assumed independent.' },
      { t0: 29, t1: 34, text: 'White: cleared without checks. Cyan: the runs the check saved. Read both on the rim.' },
    ],
    state: { guess: 1000, draws: 0 },
    controls: [
      { key: 'guess', type: 'commit', label: 'Runs that pass all 20 rings (of 2,000)', min: 0, max: 2000, step: 10, jump: T.commit, countdown: 3,
        hint: 'Each step is right 95 % of the time. Your guess is marked on the rim before the plate is exposed.', format: v => EX.fmt(Math.round(v)) },
      { key: 'draws', type: 'select', label: 'Re-expose from fresh draws', options: [[0, 'draws A'], [1, 'draws B'], [2, 'draws C']],
        hint: 'Another 2,000 runs: different noise, the same expected staircase.' },
    ],
    engine: ctx => Atelier.AgentLoop({ N, k: K, p: P, c: C, retry: 1, seed: seedOf(ctx) }),

    draw(p, t, ctx) {
      const A = ctx.engine, sd = seedOf(ctx), S = EX.surface(ctx.size.k, ctx.seed), R = S.R, dc = p.drawingContext;
      const X = ctx.X || (ctx.X = {});
      const bw = Math.round(2 * G.box * R), ox = Math.round((G.cx - G.box) * R), oy = Math.round((G.cy - G.box) * R);
      if (X.R !== R) {                                         // per-pixel polar coordinates of the plate, once
        X.R = R; X.bw = bw; X.E = new Float32Array(bw * bw); X.rho = new Float32Array(bw * bw); X.ang = new Float32Array(bw * bw); X.exp = new Float32Array(bw * bw);
        for (let y = 0; y < bw; y++) for (let x = 0; x < bw; x++) {
          const dx = (ox + x + 0.5) / R - G.cx, dy = (oy + y + 0.5) / R - G.cy, i = y * bw + x;
          X.rho[i] = Math.hypot(dx, dy); let a = (Math.atan2(dy, dx) + Math.PI / 2) / (2 * Math.PI); if (a < 0) a += 1; X.ang[i] = a;
          X.exp[i] = expEnd(Math.max(1e-6, a));
        }
      }
      if (X.sd !== sd) {
        X.sd = sd;
        // retries (cost): every caught slip up to the run's end in the checked world is a step done twice
        X.beads = []; let redo = 0, steps = 0;
        for (let r = 0; r < N; r++) {
          const f = A.failStep.on[r], top = f < 0 ? K - 1 : f; steps += top + 1;
          for (let j = 0; j <= top; j++) if (A.caught(r, j)) { redo++; X.beads.push([r, j]); }
        }
        X.redo = redo; X.steps = steps;
      }
      const n = t < T.n10 ? 10 : nAt(t), O = order(A, sd, n);
      const E = X.E, rho = X.rho, ang = X.ang, ex = X.exp;

      /* ── expose the plate (per pixel, polar) ─────────────────────────── */
      const plateOn = t >= T.trace[0];
      const traceHead = t < T.n10 ? G.r0 + (endOf(A.failStep.off[0]) - G.r0) * U.seg(t, T.trace[0] + 0.3, T.trace[1] - 0.4, 'linear') : 0;
      const runsOn = U.seg(t, T.n10, T.n10 + 0.5), latent = U.seg(t, T.n10 + 0.6, T.n10 + 1.8) * 0.3;
      const head2 = U.lerp(G.r0, G.rEnd + 1, U.seg(t, T.second[0], T.second[1], 'linear'));
      const showB = t >= T.second[0], gapW = n <= 400 ? 0.7 : 0;
      const EA = 30, EB = 0.4, core = 60 * U.seg(t, T.trace[0], T.trace[0] + 0.5);
      if (plateOn) {
        for (let i = 0; i < E.length; i++) {
          const r = rho[i]; if (r > G.rEnd + 1.5) { E[i] = 0; continue; }
          if (r < G.r0) { E[i] = core * (1 - 0.35 * r / G.r0); continue; }
          const a = ang[i];
          const q = (r - G.r0) / G.d, dq = Math.abs(q - Math.round(q)) * G.d, shade = Math.round(q) >= 1 && Math.round(q) <= K ? 1 - 0.5 * Math.max(0, 1 - dq / 0.9) : 1;
          let e = 0, lat = 0;
          // the faint latent image of the expected staircase
          if (latent > 0 && r <= ex[i]) lat = latent;
          if (t < T.n10) {
            const w = Math.abs(a < 0.5 ? a : a - 1) * 2 * Math.PI * r;            // arc distance from twelve o'clock
            if (w < 1.6 && r <= traceHead) e += 3 * EA * (1 - w / 1.6);
          } else {
            const fa = a * n, b = fa | 0, fb = fa - b;
            let cov = U.clamp(O.eA[b] - r + 0.5);
            if (gapW > 0) { const g = gapW / (2 * Math.PI * r) * n; cov *= U.smoothstep(0, g, fb) * U.smoothstep(0, g, 1 - fb); }
            e += cov * EA * runsOn;
            if (showB) { const cb = U.clamp(Math.min(O.eB[b], head2) - r + 0.5) * (1 - cov); e += cb * EB * EA; }
          }
          E[i] = (e * Math.pow(G.r0 / r, 1.6) + lat) * shade;      // a point source: light spreads as it travels outward
        }
      }
      EX.clear(S);
      if (plateOn) EX.tone(S, E, bw, bw, ox, oy, 1);
      const tA = EX.develop(t, 0.25, 2.5, -6, 4.6) * (1 - U.seg(t, 2.9, 3.45, 'inOut'));
      if (t < 3.5) EX.exposeMask(S, EX.mask(S, 'title', { text: 'EXPOSURE', font: '700 150px ' + EX.FONT.display, size: 150, x: 480, y: 300, align: 'center', spacing: 14 }), tA);
      EX.blit(p, S);
      dc.save();

      /* ── title card: subtitle + the characteristic curve the title develops along ── */
      if (t < 3.5) {
        const a = U.seg(t, 0.5, 1.1) * (1 - U.seg(t, 2.9, 3.4));
        EX.text(dc, 'What an AI agent actually does, and why we can trust the number', 480, 352, { size: 15, align: 'center', color: PAL.dim, alpha: a });
        const gx0 = 432, gy0 = 470, gw = 80, gh = 46, lo = -6, hi = 5, Dm = EX.density(hi) - EX.density(lo);
        dc.globalAlpha = a * 0.7; dc.strokeStyle = PAL.dim; dc.lineWidth = 0.8;
        dc.beginPath(); dc.moveTo(gx0, gy0 - gh - 4); dc.lineTo(gx0, gy0); dc.lineTo(gx0 + gw + 4, gy0); dc.stroke();
        dc.globalAlpha = a; dc.strokeStyle = PAL.copper; dc.lineWidth = 1.2; dc.beginPath();
        for (let i = 0; i <= 60; i++) { const l = lo + (hi - lo) * i / 60, X2 = gx0 + gw * i / 60, Y = gy0 - gh * (EX.density(l) - EX.density(lo)) / Dm; i ? dc.lineTo(X2, Y) : dc.moveTo(X2, Y); }
        dc.stroke();
        const ln = U.clamp(Math.log2(Math.max(1e-6, tA)), lo, hi), px = gx0 + gw * (ln - lo) / (hi - lo), py = gy0 - gh * (EX.density(ln) - EX.density(lo)) / Dm;
        dc.fillStyle = PAL.paper; dc.beginPath(); dc.arc(px, py, 2.6, 0, 2 * Math.PI); dc.fill(); dc.globalAlpha = 1;
        EX.text(dc, 'H&D curve: the title develops along it', gx0 + gw + 14, gy0 - gh + 12, { size: 12, color: PAL.dim, alpha: a });
      }
      if (!plateOn) { dc.restore(); return; }

      /* ── structure: slit rings (slate), ring numbers along twelve o'clock, the rim gauge ── */
      const st = U.seg(t, T.trace[0], T.trace[0] + 0.6);
      dc.globalAlpha = st * 0.32; dc.strokeStyle = PAL.slate; dc.lineWidth = 0.7;
      for (let k = 1; k <= K; k++) { dc.beginPath(); dc.arc(G.cx, G.cy, G.ring(k), 0, 2 * Math.PI); dc.stroke(); }
      dc.globalAlpha = st * 0.8; dc.beginPath(); dc.arc(G.cx, G.cy, G.rEnd, 0, 2 * Math.PI); dc.stroke();
      // the gauge: a densitometer ring around the rim, 0–100 % of runs, read clockwise from twelve
      dc.globalAlpha = st * 0.75; dc.strokeStyle = PAL.dim; dc.lineWidth = 1;
      for (let i = 0; i < 100; i++) {
        const L = i % 10 === 0 ? 9 : i % 5 === 0 ? 6 : 3, [x1, y1] = pol(i / 100, G.gauge), [x2, y2] = pol(i / 100, G.gauge + L);
        dc.beginPath(); dc.moveTo(x1, y1); dc.lineTo(x2, y2); dc.stroke();
      }
      dc.globalAlpha = 1;
      [['0', 0], ['25 %', 0.25], ['50 %', 0.5], ['75 %', 0.75]].forEach(([s, a]) => {
        const [x, y] = pol(a, G.gauge + 19); EX.text(dc, s, x, y + 5, { size: 14, align: 'center', color: PAL.dim, alpha: runsOn });
      });

      /* ── copper: the expected staircase (exact), drawn over the latent image ── */
      const cA = U.seg(t, T.n10 + 0.6, T.n10 + 1.8) * (showB ? 0.55 : 0.9);
      if (cA > 0) {
        if (!X.expPath) { const P2 = new Path2D(); for (let i = 0; i <= 1440; i++) { const a = Math.max(1e-6, i / 1440), [x, y] = pol(a, expEnd(a)); i ? P2.lineTo(x, y) : P2.moveTo(x, y); } X.expPath = P2; }
        dc.globalAlpha = cA; dc.strokeStyle = PAL.copper; dc.lineWidth = 1.3; dc.stroke(X.expPath); dc.globalAlpha = 1;
      }

      /* ── addresses: a peach tick where each run stopped ─────────────── */
      if (t >= T.n10) {
        const a = runsOn * (showB ? 0.55 : 1);
        dc.fillStyle = PAL.peach; dc.strokeStyle = PAL.peach;
        if (n <= 100) {
          dc.lineWidth = 2; dc.globalAlpha = a;
          for (let i = 0; i < n; i++) { const f = A.failStep.off[O.runs[i]]; if (f < 0) continue; dc.beginPath(); dc.arc(G.cx, G.cy, endOf(f), angOf((i + 0.15) / n), angOf((i + 0.85) / n)); dc.stroke(); }
        } else {
          dc.globalAlpha = a * 0.85;
          for (let i = 0; i < n; i++) { const f = A.failStep.off[O.runs[i]]; if (f < 0) continue; const [x, y] = pol((i + 0.5) / n, endOf(f)); dc.fillRect(x - 0.8, y - 0.8, 1.6, 1.6); }
        }
        dc.globalAlpha = 1;
      } else if (t >= T.trace[0] + 0.3) {
        const f = A.failStep.off[0];
        if (f >= 0 && traceHead >= endOf(f) - 0.01) {
          const [x, y] = pol(0, endOf(f)); dc.strokeStyle = PAL.peach; dc.lineWidth = 1.5; dc.beginPath(); dc.arc(x, y, 6, 0, 2 * Math.PI); dc.stroke();
          EX.text(dc, `stopped at ring ${f + 1}`, x + 12, y + 5, { size: 14, color: PAL.peach });
        }
      }
      /* the cost: sage beads where a step had to be done twice (second exposure) */
      if (showB) {
        const a = U.seg(t, T.second[0], T.second[0] + 0.4), hi = U.seg(t, T.cost, T.cost + 0.5) * (1 - 0.4 * U.seg(t, T.end, T.end + 0.6));
        const idx = new Int32Array(N); O.runs.forEach((r, i) => (idx[r] = i));
        dc.fillStyle = PAL.sage;
        for (const [r, j] of X.beads) {
          const rr = G.ring(j + 1); if (rr > head2) continue;
          const [x, y] = pol((idx[r] + 0.5) / N, rr), s = 1.4 + 1.2 * hi;
          dc.globalAlpha = a * (0.6 + 0.4 * hi); dc.fillRect(x - s / 2, y - s / 2, s, s);
        }
        dc.globalAlpha = 1;
      }

      /* ── the gauge readings: arcs integrated from the marks, numbers AT their marks ── */
      let clearA = 0, clearB = 0; for (let i = 0; i < n; i++) { if (O.eA[i] >= G.rEnd) clearA++; if (O.eB[i] >= G.rEnd) clearB++; }
      const fA = clearA / n, fB = clearB / n, eFrac = A.exact.off[K], eFracB = A.exact.on[K];
      if (t >= T.n10) {
        const a = runsOn;
        const arc = (a0, a1, r, w, col, al) => { if (a1 <= a0) return; dc.globalAlpha = al; dc.strokeStyle = col; dc.lineWidth = w; dc.beginPath(); dc.arc(G.cx, G.cy, r, angOf(a0), angOf(a1)); dc.stroke(); dc.globalAlpha = 1; };
        const tick = (f, col, al) => { const [x1, y1] = pol(f, G.gauge - 8), [x2, y2] = pol(f, G.gauge + 12); dc.globalAlpha = al; dc.strokeStyle = col; dc.lineWidth = 2; dc.beginPath(); dc.moveTo(x1, y1); dc.lineTo(x2, y2); dc.stroke(); dc.globalAlpha = 1; };
        // 95 % band of the estimate at this n (± 2 sd), on the gauge
        const sdn = Math.sqrt(eFrac * (1 - eFrac) / n);
        arc(Math.max(0, eFrac - 2 * sdn), Math.min(1, eFrac + 2 * sdn), G.gauge + 4, 9, PAL.copper, a * 0.5 * (showB ? 0.6 : 1));
        tick(eFrac, PAL.copper, a);
        arc(0, fA, G.gauge - 4, 4, PAL.paper, a);
        if (showB) {
          const hb = U.seg(t, T.second[1] - 0.4, T.second[1] + 0.3), sdb = Math.sqrt(eFracB * (1 - eFracB) / N);
          arc(fA, U.lerp(fA, fB, hb), G.gauge - 4, 4, PAL.cyan, 1);
          arc(eFracB - 2 * sdb, eFracB + 2 * sdb, G.gauge + 4, 9, PAL.copper, 0.5 * hb);
          tick(eFracB, PAL.copper, hb);
          if (hb > 0) { const [x, y] = pol(fB, G.gauge - 34); EX.text(dc, EX.fmt(clearB), x + 4, y + 9, { size: 26, weight: 500, align: 'left', color: PAL.sage, alpha: hb, halo: PAL.ground }); }
        }
        const rgt = Math.cos(angOf(fA)) >= -0.05, [x, y] = pol(Math.max(fA, 0.04), rgt ? G.gauge + 30 : G.gauge - 30);
        EX.text(dc, `${EX.fmt(clearA)}${n < N ? ' of ' + EX.fmt(n) : ''}`, x + 4, y + 9, { size: 26, weight: 500, align: 'left', alpha: a, halo: PAL.ground });
      }
      // the viewer's grease-pencil mark on the rim (and, during the commit beat, the enlarger timer sweeping the gauge)
      const C0 = ctx.commit;
      if (t >= T.commit - 3 && C0) {
        const gv = U.clamp(C0.value / N), cd = C0.countdown(t), ma = U.seg(t, T.commit - 3, T.commit - 2.6);
        const [x1, y1] = pol(gv, G.gauge - 14), [x2, y2] = pol(gv, G.gauge + 16), [xl, yl] = pol(gv, G.gauge - 30);
        dc.globalAlpha = ma * 0.95; dc.strokeStyle = PAL.ink; dc.lineCap = 'round'; dc.lineWidth = 3.2;
        dc.beginPath(); dc.moveTo(x1, y1); dc.quadraticCurveTo((x1 + x2) / 2 + 2, (y1 + y2) / 2 - 1, x2, y2); dc.stroke(); dc.lineCap = 'butt'; dc.globalAlpha = 1;
        const right = Math.cos(angOf(gv)) >= 0;
        EX.text(dc, `${C0.auto ? 'a guess' : 'your mark'}: ${EX.fmt(Math.round(C0.value))}`, xl, yl + 5, { size: 15, align: 'center', alpha: ma * (t >= T.second[0] ? 0.6 : 1), halo: PAL.ground });
        if (cd !== null && (C0.auto || C0.committed)) {
          const u = 1 - cd / C0.countdownDur;
          dc.globalAlpha = 0.9; dc.strokeStyle = PAL.ink; dc.lineWidth = 1.5; dc.beginPath(); dc.arc(G.cx, G.cy, G.gauge + 12, angOf(0), angOf(u)); dc.stroke();
          const [hx, hy] = pol(u, G.gauge + 12); dc.fillStyle = PAL.ink; dc.beginPath(); dc.arc(hx, hy, 3, 0, 2 * Math.PI); dc.fill(); dc.globalAlpha = 1;
        }
      }

      /* ── right column: few words, large, at the beats that need them ─── */
      const RX = 600;
      const lg = U.seg(t, T.trace[0] + 0.2, T.trace[0] + 0.7) * (1 - U.seg(t, T.commit - 3.3, T.commit - 3));
      if (lg > 0) {
        EX.text(dc, 'One ray is one whole run.', RX, 170, { size: 26, family: EX.FONT.display, weight: 500, alpha: lg });
        EX.text(dc, 'Each ring is one step:', RX, 214, { size: 18, alpha: lg });
        EX.text(dc, 'plan › act › observe › check', RX, 238, { size: 15, color: PAL.dim, alpha: lg });
        EX.text(dc, 'A slip stops it at that ring.', RX, 282, { size: 18, color: PAL.peach, alpha: lg });
      }
      const cm = U.seg(t, T.commit - 3, T.commit - 2.6) * (1 - U.seg(t, T.commit + 0.2, T.commit + 0.6));
      if (cm > 0) {
        EX.text(dc, 'Of 2,000 runs, how many', RX, 262, { size: 30, family: EX.FONT.display, weight: 500, alpha: cm });
        EX.text(dc, 'pass all 20 rings?', RX, 296, { size: 30, family: EX.FONT.display, weight: 500, alpha: cm });
        EX.text(dc, 'Mark it on the rim.', RX, 332, { size: 16, color: PAL.dim, alpha: cm });
        if (C0 && !C0.auto && !C0.committed) EX.text(dc, 'Commit in the panel to expose the plate.', RX, 358, { size: 14, color: PAL.copper, alpha: cm });
      }
      // the loupe: the rim around the expected value, enlarged ×(1/0.40): the 95 % band narrows as 1/√n
      if (t >= T.n10 - 0.2) {
        const a = U.seg(t, T.n10 - 0.2, T.n10 + 0.4) * (1 - 0.65 * U.seg(t, T.second[0], T.second[0] + 0.6));
        const lo = 0.16, hi = 0.56, sx0 = RX, sx1 = 920, sy = 150, fx = v => sx0 + (sx1 - sx0) * U.clamp((v - lo) / (hi - lo));
        const sdn = Math.sqrt(eFrac * (1 - eFrac) / n);
        EX.text(dc, n < N ? `${EX.fmt(n)} runs on the plate` : '2,000 runs on the plate', sx0, sy - 70, { size: 26, family: EX.FONT.display, weight: 500, alpha: a });
        EX.text(dc, 'the rim, magnified · copper: 95 % band', sx0, sy - 44, { size: 14, color: PAL.dim, alpha: a });
        dc.globalAlpha = a * 0.6; dc.fillStyle = PAL.dim; dc.fillRect(sx0, sy, sx1 - sx0, 1);
        for (let v = 0.2; v <= 0.55 + 1e-9; v += 0.05) dc.fillRect(fx(v) - 0.5, sy - 4, 1, 8);
        dc.globalAlpha = a * 0.6; dc.fillStyle = PAL.copper;
        const b0 = fx(eFrac - 2 * sdn), b1 = fx(eFrac + 2 * sdn); dc.fillRect(b0, sy - 14, b1 - b0, 28);
        dc.globalAlpha = a; dc.fillRect(fx(eFrac) - 0.75, sy - 18, 1.5, 36);
        dc.fillStyle = PAL.paper; dc.fillRect(fx(fA) - 1.5, sy - 12, 3, 24); dc.globalAlpha = 1;
        [0.2, 0.3, 0.4, 0.5].forEach(v => EX.text(dc, Math.round(v * 100) + ' %', fx(v), sy + 24, { size: 14, align: 'center', color: PAL.dim, alpha: a }));
        if (C0) { const g = C0.value / N; if (g >= lo && g <= hi) { dc.globalAlpha = a; dc.strokeStyle = PAL.ink; dc.lineWidth = 3; dc.lineCap = 'round'; dc.beginPath(); dc.moveTo(fx(g), sy - 22); dc.lineTo(fx(g) + 1, sy + 4); dc.stroke(); dc.lineCap = 'butt'; dc.globalAlpha = 1; } }
        EX.text(dc, `realised ${(fA * 100).toFixed(1)} %`, fx(fA), sy - 22, { size: 14, align: fA > 0.45 ? 'right' : 'left', alpha: a, halo: PAL.ground });
        // reveal: expected vs realised, one line, at the band
        const rv = U.seg(t, T.reveal, T.reveal + 0.5);
        if (rv > 0) {
          const z = (clearA - N * eFrac) / A.sd.off[K];
          EX.text(dc, `expected ${EX.fmt(N * eFrac)} ± ${EX.fmt(2 * A.sd.off[K])} · this plate ${EX.fmt(clearA)}`, sx0, sy + 54, { size: 14, color: PAL.copper, alpha: rv * a });
        }
      }
      // the second exposure + the cost, in the column
      if (showB) {
        const a = U.seg(t, T.second[0] + 0.3, T.second[0] + 0.8);
        EX.text(dc, 'Second exposure:', RX, 270, { size: 24, family: EX.FONT.display, weight: 500, alpha: a });
        EX.text(dc, 'same runs, checks on.', RX, 298, { size: 24, family: EX.FONT.display, weight: 500, alpha: a });
        EX.text(dc, 'Cyan = runs the check saved', RX, 326, { size: 16, color: PAL.cyan, alpha: a });
        const hb = U.seg(t, T.second[1] - 0.2, T.second[1] + 0.4);
        if (hb > 0) EX.text(dc, `${EX.fmt(clearB)} pass · expected ${EX.fmt(N * eFracB)} ± ${EX.fmt(2 * A.sd.on[K])}`, RX, 350, { size: 15, color: PAL.sage, alpha: hb });
        const ca = U.seg(t, T.cost, T.cost + 0.5);
        if (ca > 0) {
          EX.text(dc, `+${EX.fmt(X.redo)} steps done twice`, RX, 400, { size: 24, family: EX.FONT.display, weight: 500, color: PAL.sage, alpha: ca });
          EX.text(dc, `${(100 * X.redo / X.steps).toFixed(1)} % more work · one sage bead each`, RX, 424, { size: 15, color: PAL.dim, alpha: ca });
        }
      }
      dc.restore();
    },

    score(ctx) {
      const A = ctx.engine, ev = [];
      ev.push({ t: 0.3, kind: 'tone', freq: 98, dur: 3.0, gain: 0.35, attack: 1.2 });
      const f0 = A.failStep.off[0], last = f0 < 0 ? K : f0 + 1;
      for (let k = 1; k <= last; k++) ev.push({ t: T.trace[0] + 0.3 + (T.trace[1] - 0.7 - T.trace[0]) * (G.ring(k) - G.r0) / (G.rEnd - G.r0), kind: k === f0 + 1 ? 'clack' : 'tick', gain: 0.45, freq: k === f0 + 1 ? 170 : 3200 });
      for (let i = 0; i < 3; i++) ev.push({ t: T.commit - 3 + i, kind: 'tick', freq: 1200, gain: 0.5 });
      [T.n10, T.n100, T.n2000].forEach((t, i) => { for (let k = 0; k < 6 + i * 6; k++) ev.push({ t: t - 0.05 + k * 0.035 + 0.01 * U.h(9, i, k), kind: 'tick', gain: 0.25 + 0.05 * i, freq: 2200 + 1400 * U.h(5, i, k), pan: (U.h(6, i, k) - 0.5) * 0.7 }); });
      ev.push({ t: T.reveal + 0.1, kind: 'tone', freq: 392, dur: 1.4, gain: 0.55 });
      for (let k = 1; k <= K; k++) {
        let caught = 0; for (let r = 0; r < A.N; r++) if (A.caught(r, k - 1) && A.alive(r, 'on', k - 1)) caught++;
        if (caught) ev.push({ t: T.second[0] + (T.second[1] - T.second[0]) * (G.ring(k) - G.r0) / (G.rEnd - G.r0), kind: 'click', gain: Math.min(1, 0.25 + caught / 120), freq: 1568, pan: 0.2 });
      }
      ev.push({ t: T.cost + 0.1, kind: 'tone', freq: 523.3, dur: 1.4, gain: 0.4 });
      ev.push({ t: T.end + 0.2, kind: 'tone', freq: 196, dur: 3, gain: 0.45, attack: 0.5 });
      ev.push({ t: T.end + 0.3, kind: 'tone', freq: 293.7, dur: 2.6, gain: 0.28, attack: 0.5 });
      return ev;
    },

    meta(ctx) {
      const A = ctx.engine;
      let ten = 0; for (let r = 0; r < 10; r++) if (A.failStep.off[r] < 0) ten++;
      return [
        { label: 'Pass all 20 · checks off', value: A.survivors.off[K], check: { world: 'off', k: K, p: P, c: C, N } },
        { label: 'Pass all 20 · checks on', value: A.survivors.on[K], check: { world: 'on', k: K, p: P, c: C, N } },
        { label: 'P(pass) · off · expected', value: A.exact.off[K], check: { world: 'off', k: K, p: P, c: C } },
        { label: 'P(pass) · on · expected', value: A.exact.on[K], check: { world: 'on', k: K, p: P, c: C } },
        { label: 'Saved by the check', value: A.saved.length },
        { label: 'First 10 runs passed', value: ten },
        { label: 'Seed (draws)', value: seedOf(ctx) },
      ];
    },
  });
})();
