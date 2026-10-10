/* SEDIMENT DELTA · shared concept — "What an AI agent actually does" (glance), revision 1.
   One river leaves the uplands and forks: the same 2,000 grains (agent runs) go down both branches (twin worlds,
   common random numbers from Atelier.AgentLoop). The bare branch has 20 weirs (steps); the braided branch has the
   same weirs, each with a braid (a check: catches 80 % of slips, one retry) that is a detour and costs time. A run
   that fails settles on the outer bank AT its weir (prograding bar: flat top at water level, foreset at repose, so
   bar length ∝ failures there); finished runs build two fans into one bay. Dashed survey lines are the exact
   expectation. Every count on screen is read from settled grains. */
(() => {
  const { PAL, TONES, PathRiver, Deposit } = DK;
  const U = Atelier.U, h = U.h;
  const N = 2000, K = 20, HW = 16;
  const T_REL = 10.5, REL = 3.2, TB = 1.6, BS = 13, BE = 21, TS_BAR = 0.6, TS_DEL = 0.55;
  const T_COUNT = 27.0, T_INK = 30.8, DUR = 35;
  const TR = PathRiver({ pts: [[-40, 132], [20, 150], [80, 192], [135, 236], [172, 258]], nW: 0 });
  const RA = PathRiver({ pts: [[172, 258], [212, 222], [282, 170], [380, 132], [488, 146], [590, 114], [680, 126], [740, 168], [784, 196], [810, 203], [830, 200]], nW: K, ws0: 52, we: 34, valley: 40, plain: 26, side: 1 });
  const RB = PathRiver({ pts: [[172, 258], [218, 302], [304, 352], [404, 388], [514, 368], [616, 398], [704, 374], [756, 342], [792, 344], [814, 352], [832, 358]], nW: K, ws0: 52, we: 34, valley: 40, plain: 26, side: -1 });
  TR.valley = 44; TR.plain = 24;
  const V = (TR.L + RA.L) / 6.2;
  const coastX = y => 828 + 18 * (U.fbm(41, 3, y / 70) - 0.5) - 26 * Math.exp(-Math.pow((y - 280) / 60, 2));
  const sea = (x, y) => coastX(y) - x;
  const bank = s => 1 + 0.16 * (U.noise1(5, s / 17) - 0.5) + 0.08 * (U.noise1(6, s / 5.5) - 0.5);
  const STREAMS = DK.tributaries(17, 34, [TR, RA, RB], 960, 540, (x, y) => sea(x, y) > 40);
  const fanSpan = r => { const wd = U.clamp(Math.round(10 + 0.25 * r + 2.4 * (U.noise1(300, r / 4) - 0.5)), 8, 30), lo = Math.round(15.5 - (wd - 1) / 2); return [lo, lo + wd - 1]; };

  /* ───── simulation (pure in seed) ───── */
  function buildSim(A, seed) {
    const tau = new Float64Array(N), lane = new Float64Array(N), vel = new Float64Array(N), db = new Float64Array(N);
    for (let r = 0; r < N; r++) {
      const u = (r + h(seed, r, 7, 1)) / N;
      tau[r] = T_REL + REL * Math.acos(1 - 2 * u) / Math.PI;                 // a flood pulse
      lane[r] = (h(seed, r, 8, 3) - 0.5) * 1.72;
      vel[r] = V * (1.1 - 0.36 * Math.pow(lane[r] / 0.86, 2));               // fast thread, slow banks
      db[r] = TB - (BS + BE) / vel[r];                                       // each braid detour costs time
    }
    const worlds = {};
    for (const w of ['off', 'on']) {
      const R = w === 'off' ? RA : RB, f = A.failStep[w], side = R.side;
      const catches = new Array(N), tFail = new Float64Array(N).fill(Infinity), tMouth = new Float64Array(N).fill(Infinity);
      for (let r = 0; r < N; r++) {
        const cs = [];
        if (w === 'on') { const top = f[r] < 0 ? K : f[r]; for (let j = 0; j < top; j++) if (A.slip(r, j) && A.caught(r, j) && A.retryOk(r, j)) cs.push(j); }
        catches[r] = cs;
        if (f[r] >= 0) tFail[r] = tau[r] + (TR.L + R.weirS[f[r]]) / vel[r] + db[r] * cs.length;
        else tMouth[r] = tau[r] + (TR.L + R.L) / vel[r] + db[r] * cs.length;
      }
      const bars = [], place = new Array(N), failT = [];
      for (let j = 0; j < K; j++) {
        const sb = R.weirS[j] + 7, o = R.at(sb, side * (HW * bank(sb) + 2)), n = R.nrm(sb), tg = R.tan(sb);
        const D = Deposit({ cols: 4, hmax: 2, cell: 3.0, ox: o[0], oy: o[1], ux: side * n[0], uy: side * n[1], vx: tg[0], vy: tg[1], seed, key: (w === 'off' ? 100 : 200) + j });
        const ids = []; for (let r = 0; r < N; r++) if (f[r] === j) ids.push(r);
        ids.sort((a, b) => tFail[a] - tFail[b]);
        for (const r of ids) place[r] = D.add(r);
        bars.push({ D, s: sb, base: o, u: [side * n[0], side * n[1]] });
        failT.push(Float64Array.from(ids.map(r => tFail[r])));
      }
      const m = R.p(R.L), tg = R.tan(R.L);
      const Dd = Deposit({ cols: 32, hmax: 3, cell: 2.5, ox: m[0] + tg[0] * 1.5, oy: m[1] + tg[1] * 1.5, ux: tg[0], uy: tg[1], vx: -tg[1], vy: tg[0], seed, key: w === 'off' ? 300 : 400, centred: true, rows: 60, span: fanSpan });
      const surv = []; for (let r = 0; r < N; r++) if (f[r] < 0) surv.push(r);
      surv.sort((a, b) => tMouth[a] - tMouth[b]);
      for (const r of surv) place[r] = Dd.add(r);
      const catchT = []; for (let r = 0; r < N; r++) catches[r].forEach((j, i) => catchT.push(tau[r] + (TR.L + R.weirS[j] - BS) / vel[r] + db[r] * i));
      catchT.sort((a, b) => a - b);
      worlds[w] = { R, f, catches, tFail, tMouth, bars, place, failT, delta: Dd, surv, mouthT: Float64Array.from(surv.map(r => tMouth[r])), catchT };
    }
    const savedSet = new Uint8Array(N); for (const r of A.saved) savedSet[r] = 1;
    let delaySum = 0; for (const r of worlds.on.surv) delaySum += db[r] * worlds.on.catches[r].length;
    return { tau, lane, vel, db, worlds, savedSet, meanDelay: delaySum / Math.max(1, worlds.on.surv.length) };
  }

  function halfWidth(W, t) {                              // water half-width per section = runs still alive
    const lost = new Float64Array(K + 1); let acc = 0;
    for (let s = 0; s <= K; s++) { lost[s] = acc; if (s < K) acc += DK.countLE(W.failT[s], t); }
    return s => { const [a, b, u] = W.R.sectionBlend(s); return HW * bank(s) * (N - U.lerp(lost[a], lost[b], u)) / N; };
  }
  function braidPt(R, j, u, l0, l1) {                     // the braid loops round the weir on the inner (island) side
    const ss = U.lerp(R.weirS[j] - BS, R.weirS[j] + BE, u), apex = (HW + 13 + 2.5 * (U.noise1(9, j * 1.7) - 0.5)) * -R.side;
    const sw = Math.pow(Math.sin(Math.PI * u), 0.6);
    return R.at(ss, U.lerp(U.lerp(l0, l1, u), apex, sw));
  }
  function flowPos(S, W, r, sb, hw) {                     // position of run r at branch arc sb (time already mapped)
    const R = W.R, cs = W.catches[r];
    return { p: R.at(sb, S.lane[r] * hw(sb) * 0.92) };
  }

  Atelier.film({
    id: 'delta-shared',
    title: 'What an AI agent actually does',
    direction: 'C · Sediment Delta',
    level: 'glance',
    duration: DUR, size: [960, 540], renderer: 'p2d', fps: 30, seed: 1, ground: PAL.ground,
    chapters: [{ t: 0, label: 'The river' }, { t: 4, label: 'Weirs and braids' }, { t: 7.5, label: 'Your stake' }, { t: T_REL, label: 'The flood' }, { t: T_COUNT, label: 'Soundings' }, { t: T_INK, label: 'The survey' }],
    captions: [
      { t0: 0.3, t1: 4, text: 'One river, 2,000 grains of sand. Each grain is one run of an AI agent doing a 20-step job.' },
      { t0: 4, t1: 7.5, text: 'Each weir is one step: plan, call a tool, read the result. 95 of 100 grains pass each one.' },
      { t0: 7.5, t1: T_REL, text: 'The river forks; the same grains go both ways. How many reach the sea on the bare branch?' },
      { t0: T_REL, t1: 16.5, text: 'A run that fails settles on the bank at the weir where it failed. The bare branch shrinks.' },
      { t0: 16.5, t1: 21.5, text: 'The braided branch has a check at every weir: a detour that catches 4 slips in 5.' },
      { t0: 21.5, t1: T_COUNT, text: 'The detours cost time: the braided branch reaches the sea later.' },
      { t0: T_COUNT, t1: T_INK, text: 'Each weir keeps 95 of 100. Twenty in a row keep about 36 of 100. With checks, about 79.' },
      { t0: T_INK, t1: DUR, text: 'Dashed lines are the exact expectation. The sand is one draw from it.' },
    ],
    state: { guess: 1500 },
    controls: [
      { key: 'guess', type: 'commit', label: 'Grains reaching the sea on the bare branch (of 2,000)', min: 0, max: 2000, step: 10, jump: T_REL, countdown: 3,
        hint: 'Plant your stake in the bay before the flood leaves the gorge.', format: v => DK.fmt(v) },
    ],
    engine: ctx => { const A = Atelier.AgentLoop({ N, k: K, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }); A.sim = buildSim(A, ctx.seed); return A; },

    draw(p, t, ctx) {
      const A = ctx.engine, S = A.sim, surf = DK.cpu(ctx.size.k), dc = surf.c, C = ctx.commit, ex = A.exact;
      dc.drawImage(DK.terrain('shared2-' + ctx.seed, 960, 540, { seed: 11 + ctx.seed, rivers: [TR, RA, RB], streams: STREAMS, sea,
        base: (x, y) => 0.75 + 0.5 * U.clamp(1 - x / 900) + 0.25 * Math.abs(y - 270) / 270 }), 0, 0, 960, 540);
      const legendU = U.seg(t, 4.0, 6.0, 'enter'), countU = U.seg(t, T_COUNT, T_COUNT + 1.4, 'enter'), inkU = U.seg(t, T_INK, T_INK + 1.2, 'enter');
      const HALO = 'rgba(20,13,8,0.6)';

      // beds first (trunk and both branches), so the fork joins cleanly; then the trunk's water
      for (const R of [TR, RA, RB]) DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) + 2.2, '#2C2216');
      for (const R of [RA, RB]) { DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) + 0.6, '#A8916A'); DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) - 1.6, '#BBA57D'); }
      DK.channel(dc, TR, 0, TR.L + 2, s => HW * bank(s) + 1.2, '#7E8C88');
      DK.channel(dc, TR, 0, TR.L + 2, s => HW * bank(s), PAL.water);
      DK.channel(dc, TR, 0, TR.L + 2, s => HW * bank(s) * 0.45, U.rgba(PAL.waterDeep, 0.85));

      const counts = {};
      for (const w of ['off', 'on']) {
        const W = S.worlds[w], R = W.R, side = R.side, hw = halfWidth(W, t);
        DK.channel(dc, R, 0, R.L + 2, s => hw(s) + 1.4, '#7E8C88');
        DK.channel(dc, R, 0, R.L + 2, hw, PAL.water);
        DK.channel(dc, R, 0, R.L + 2, s => hw(s) * 0.45, U.rgba(PAL.waterDeep, 0.85));
        if (w === 'on') { const f = TR.p(TR.L); dc.beginPath(); dc.arc(f[0], f[1], HW * 1.05, 0, 6.2832); dc.fillStyle = PAL.water; dc.fill();
          dc.beginPath(); dc.arc(f[0], f[1], HW * 0.45, 0, 6.2832); dc.fillStyle = U.rgba(PAL.waterDeep, 0.85); dc.fill(); }
        { dc.beginPath();                                   // surface ripples drift downstream (pure in t)
          for (let i = 0; i < 130; i++) { const s = (h(7, i, side + 3, 0) * R.L + (34 + 18 * h(7, i, 3, 0)) * t) % R.L, q = R.at(s, (h(7, i, 4, 0) - 0.5) * 1.6 * hw(s)), tg = R.tan(s), L2 = 1.2 + 2 * h(7, i, 5, 0);
            dc.moveTo(q[0] - tg[0] * L2, q[1] - tg[1] * L2); dc.lineTo(q[0] + tg[0] * L2, q[1] + tg[1] * L2); }
          dc.strokeStyle = U.rgba('#A9C0D2', 0.36); dc.lineWidth = 0.6; dc.stroke(); }
        if (w === 'on') {                                   // braids: anabranches round every weir, islands between
          const bu = U.seg(t, 4.4, 7.0, 'enter');
          for (let j = 0; j < K; j++) {
            const uj = U.clamp(bu * 1.5 - j / K * 0.5); if (uj <= 0) continue;
            const l0 = -side * HW * 0.8, pts = [], isl = [];
            for (let i = 0; i <= 28; i++) pts.push(braidPt(R, j, i / 28, l0, l0));
            for (let i = 2; i <= 26; i++) { const ss = U.lerp(R.weirS[j] - BS, R.weirS[j] + BE, i / 28); isl.push(R.at(ss, -side * (HW * bank(ss) + 0.5))); }
            for (let i = 26; i >= 2; i--) { const q = braidPt(R, j, i / 28, l0, l0), ss = U.lerp(R.weirS[j] - BS, R.weirS[j] + BE, i / 28), n = R.nrm(ss); isl.push([q[0] + side * n[0] * 1.5, q[1] + side * n[1] * 1.5]); }
            dc.globalAlpha = uj;
            DK.polyline(dc, pts, '#7E8C88', 3.4); DK.polyline(dc, pts, PAL.water, 2.3);
            dc.beginPath(); isl.forEach((q, i) => (i ? dc.lineTo(q[0], q[1]) : dc.moveTo(q[0], q[1]))); dc.closePath(); dc.fillStyle = '#A8956C'; dc.fill();
            dc.strokeStyle = '#6F633F'; dc.lineWidth = 0.6; dc.stroke();
            const g0 = R.at(R.weirS[j] - BS + 1, -side * HW * 0.95);
            dc.beginPath(); dc.arc(g0[0], g0[1], 1.9, 0, 6.2832); dc.fillStyle = PAL.sage; dc.fill();
            dc.globalAlpha = 1;
          }
        }
        dc.lineCap = 'round';                                // weirs + white water
        for (let j = 0; j < K; j++) {
          const sj = R.weirS[j], hb = HW * bank(sj) + 0.5, a = R.at(sj, hb), b = R.at(sj, -hb);
          dc.beginPath(); dc.moveTo(a[0], a[1]); dc.lineTo(b[0], b[1]); dc.strokeStyle = 'rgba(44,34,22,0.55)'; dc.lineWidth = 2.4; dc.stroke();
          dc.beginPath(); dc.moveTo(a[0], a[1]); dc.lineTo(b[0], b[1]); dc.strokeStyle = U.rgba(PAL.weir, 0.8); dc.lineWidth = 1.1; dc.stroke();
          const fk = Math.floor(t * 10), hx = hw(sj + 3), tg = R.tan(sj); dc.beginPath();
          for (let q = 0; q < 8; q++) { const l = (h(ctx.seed, j + 40 * side, q, fk) - 0.5) * 2 * hx * 0.9, d = 1.8 + h(ctx.seed, j, q + 9, fk) * 5.5, P0 = R.at(sj + d, l), L2 = 0.6 + h(ctx.seed, j, q + 19, fk) * 1.3;
            dc.moveTo(P0[0] - tg[1] * L2, P0[1] + tg[0] * L2); dc.lineTo(P0[0] + tg[1] * L2, P0[1] - tg[0] * L2); }
          dc.strokeStyle = U.rgba('#EEF2F2', 0.6); dc.lineWidth = 0.7; dc.stroke();
        }
        // survey: exact bar tips (N·p^j·(1−p) failures at weir j) and exact banks (N·p^s alive)
        const surveyA = Math.max(0.5 * countU, inkU);
        if (surveyA > 0) {
          const pts = W.bars.map((B, j) => { const L = B.D.lengthFor((w === 'off' ? ex.failAt.off[j] : ex.failAt.on[j]) * N) + 1.3; return [B.base[0] + B.u[0] * L, B.base[1] + B.u[1] * L]; });
          DK.polyline(dc, pts, U.rgba(PAL.ink, 0.35 + 0.5 * surveyA), 0.9 + 0.5 * inkU, [3, 3]);
          const pr = w === 'off' ? ex.off : ex.on, hwx = s => { const [a, b, u] = R.sectionBlend(s); return HW * U.lerp(pr[a], pr[b], u); };
          const top = [], bot = []; for (let s = R.weirS[0]; s <= R.L; s += 3) { top.push(R.at(s, hwx(s))); bot.push(R.at(s, -hwx(s))); }
          DK.polyline(dc, top, U.rgba(PAL.ink, 0.25 + 0.35 * surveyA), 0.7, [2, 3]); DK.polyline(dc, bot, U.rgba(PAL.ink, 0.25 + 0.35 * surveyA), 0.7, [2, 3]);
        }
        // grains on this branch
        const settled = [], deltaPts = [], deltaSage = [], fly = { cu: [], pe: [], sg: [] }, barN = new Int32Array(K);
        let nDelta = 0;
        for (let r = 0; r < N; r++) {
          const local = t - S.tau[r], v = S.vel[r];
          if (local * v < TR.L) continue;                 // still in the trunk (drawn once, below)
          const fj = W.f[r];
          if (fj >= 0 && t >= W.tFail[r]) {
            const P = W.place[r], u = (t - W.tFail[r]) / TS_BAR;
            if (u >= 1) { settled.push(P); barN[fj]++; continue; }
            const s0 = R.weirS[fj], p0 = R.at(s0, S.lane[r] * hw(s0)), e = U.ease.enter(u), arc = Math.sin(Math.PI * e) * 5;
            fly.pe.push({ x: U.lerp(p0[0], P.x, e), y: U.lerp(p0[1], P.y, e) - arc }); continue;
          }
          if (fj < 0 && t >= W.tMouth[r]) {
            const P = W.place[r], u = (t - W.tMouth[r]) / TS_DEL;
            if (u >= 1) { nDelta++; (w === 'on' && S.savedSet[r] ? deltaSage : deltaPts).push(P); continue; }
            const p0 = R.at(R.L, S.lane[r] * hw(R.L) * 0.9), e = U.ease.enter(u);
            (w === 'on' && S.savedSet[r] ? fly.sg : fly.cu).push({ x: U.lerp(p0[0], P.x, e), y: U.lerp(p0[1], P.y, e) }); continue;
          }
          // in the branch: arc position with braid detours
          const cs = W.catches[r], DB = S.db[r];
          let i = 0, pos = null;
          for (; i < cs.length; i++) {
            const j = cs[i], ts = (TR.L + R.weirS[j] - BS) / v + DB * i;
            if (local < ts) break;
            if (local < ts + TB) { pos = braidPt(R, j, (local - ts) / TB, S.lane[r] * hw(R.weirS[j] - BS), S.lane[r] * hw(R.weirS[j] + BE) * 0.6); break; }
          }
          if (pos) { fly.sg.push({ x: pos[0], y: pos[1] }); continue; }
          const sb = v * (local - DB * i) - TR.L; if (sb > R.L) continue;
          const q = R.at(sb, S.lane[r] * hw(sb) * 0.92);
          (i > 0 && sb - (R.weirS[cs[i - 1]] + BE) < 36 ? fly.sg : fly.cu).push({ x: q[0], y: q[1] });
        }
        counts[w] = { delta: nDelta, bars: barN };
        DK.sediment(dc, settled, TONES.peach, { r: 1.1, rimR: 2.5, bodyR: 2.1 });
        { // the fan: turbid plume, sand, shelf, distributaries
          const m = R.p(R.L), tg = R.tan(R.L), L = W.delta.lengthFor(nDelta) + 4, rr = L * 0.75 + 24;
          dc.save(); dc.translate(m[0] + tg[0] * L * 0.55, m[1] + tg[1] * L * 0.55); dc.rotate(Math.atan2(tg[1], tg[0])); dc.scale(1, 0.45);
          const g = dc.createRadialGradient(0, 0, 0, 0, 0, rr); g.addColorStop(0, U.rgba('#8E8064', 0.4)); g.addColorStop(1, U.rgba('#8E8064', 0));
          dc.fillStyle = g; dc.beginPath(); dc.arc(0, 0, rr, 0, 6.2832); dc.fill(); dc.restore();
          DK.sediment(dc, deltaPts.concat(deltaSage), TONES.copper, { r: 1.1, rimR: 2.3, bodyR: 2.0, grainR: 0.85, fringe: U.mix(PAL.sea, '#5F8190', 0.62), fringe2: U.mix(PAL.sea, '#4A6878', 0.5) });
          if (deltaSage.length) DK.discs(dc, deltaSage, 0.95, PAL.sage);
          if (nDelta > 20) {
            const len = L - 6, sp = 2.5 * (10 + 0.25 * (L / 2.5)) * 0.32, nx = -tg[1], ny = tg[0], at = (a, l) => [m[0] + tg[0] * a + nx * l, m[1] + tg[1] * a + ny * l];
            DK.polyline(dc, [at(-2, 0), at(len * 0.45, 0)], '#4D6A84', 2.1);
            for (const k of [-1, 0, 1]) { const d = []; for (let i = 0; i <= 10; i++) { const u = i / 10; d.push(at(U.lerp(len * 0.45, len - Math.abs(k) * 3, u), k * sp * Math.pow(u, 0.8) + 0.8 * Math.sin(u * 7 + k))); } DK.polyline(dc, d, '#4D6A84', k === 0 ? 1.5 : 1.1); }
          }
        }
        DK.discs(dc, fly.cu, 1.15, '#D59D66'); DK.discs(dc, fly.sg, 1.2, PAL.sage); DK.discs(dc, fly.pe, 1.2, PAL.peach);
      }
      // grains in the trunk (both twins at once)
      { const pts = [];
        for (let r = 0; r < N; r++) { const sl = (t - S.tau[r]) * S.vel[r]; if (sl < 0 || sl >= TR.L) continue; const q = TR.at(sl, S.lane[r] * HW * bank(sl) * 0.92); if (q[0] > -4) pts.push({ x: q[0], y: q[1] }); }
        DK.discs(dc, pts, 1.15, '#D59D66'); }

      /* ───── the bay: isobaths of expectation, soundings, the stake ───── */
      for (const w of ['off', 'on']) {
        const W = S.worlds[w], R = W.R, m = R.p(R.L), tg = R.tan(R.L), nx = -tg[1], ny = tg[0], at = (a, l) => [m[0] + tg[0] * (a + 1.5) + nx * l, m[1] + tg[1] * (a + 1.5) + ny * l];
        const halfAt = n => { const r = W.delta.lengthFor(n) / 2.5, sp = fanSpan(Math.floor(r)); return (sp[1] - sp[0] + 1) * 2.5 / 2 + 6; };
        const sideY = w === 'off' ? 1 : -1;   // expectation label faces the open water between the fans
        if (countU > 0) {
          const e = A.expected[w][K], sd = A.sd[w][K], a0 = W.delta.lengthFor(e - sd), a1 = W.delta.lengthFor(e + sd), ae = W.delta.lengthFor(e), hh = halfAt(e);
          const q = [at(a0, -hh), at(a1, -hh), at(a1, hh), at(a0, hh)];
          dc.beginPath(); q.forEach((z, i) => (i ? dc.lineTo(z[0], z[1]) : dc.moveTo(z[0], z[1]))); dc.closePath(); dc.fillStyle = U.rgba(PAL.ink, 0.18 * countU); dc.fill();
          DK.polyline(dc, [at(ae, -hh - 3), at(ae, hh + 3)], U.rgba(PAL.ink, 0.6 + 0.4 * inkU), 1.0 + 0.4 * inkU, [2, 2]);
          DK.font(dc, 'serif', 14, 500, true);
          const lq = at(ae, sideY * (hh + 16));
          const lab = 'expected ' + DK.fmt(e) + ' ± ' + sd.toFixed(1), lw = dc.measureText(lab).width;
          DK.txt(dc, lab, Math.min(lq[0], 950 - lw / 2), lq[1] + 4, 'center', PAL.ink, 0.95 * countU, HALO);
        }
        if (t >= T_REL) {
          const n = counts[w].delta, L = W.delta.lengthFor(Math.max(n, 1)), q = at(Math.max(L, 30) + 34, -sideY * 2);
          DK.font(dc, 'serif', 26 + 6 * countU, 600, true);
          const qq = [950, w === 'off' ? 112 : 452];
          DK.txt(dc, DK.fmt(n), qq[0], qq[1], 'right', w === 'off' ? PAL.copper : PAL.sage, 1, HALO);
          DK.font(dc, 'serif', 14, 500, true);
          DK.txt(dc, 'reached the sea', qq[0], qq[1] + 16, 'right', PAL.dim, 1, HALO);
        }
      }
      if (t >= 7.5) {                                     // the stake (your guess) planted on the bare branch's axis
        const R = RA, W = S.worlds.off, m = R.p(R.L), tg = R.tan(R.L), g = U.clamp(C.value, 0, 2000), a = W.delta.lengthFor(g) + 1.5;
        const x = m[0] + tg[0] * a, y = m[1] + tg[1] * a, gu = U.seg(t, 7.5, 8.1, 'settle');
        dc.beginPath(); dc.moveTo(x, y + 14); dc.lineTo(x, y - 30 * gu); dc.strokeStyle = PAL.ink; dc.lineWidth = 1.4; dc.stroke();
        dc.beginPath(); dc.moveTo(x, y - 30 * gu); dc.lineTo(x + 9, y - 27 * gu); dc.lineTo(x, y - 24 * gu); dc.fillStyle = PAL.ink; dc.fill();
        DK.font(dc, 'serif', 14, 600, true);
        DK.txt(dc, (C.auto ? 'a guess: ' : 'your stake: ') + DK.fmt(g), x - 4, y - 34 * gu, 'right', PAL.ink, gu, HALO);
      }

      /* ───── names and labels at their marks ───── */
      const nameU = U.seg(t, 3.4, 5.0);
      DK.font(dc, 'serif', 17, 600, true);
      DK.letterAlong(dc, 'bare branch — no checks', RA, RA.L * 0.42, -(HW + 15), 2.2, { alpha: 0.95 * nameU });
      DK.letterAlong(dc, 'braided branch — a check at every weir', RB, RB.L * 0.47, (HW + 16), 2.0, { alpha: 0.95 * nameU });
      DK.font(dc, 'mono', 10, 500);
      for (let j = 0; j < K; j++) {
        if (!(j === 0 || (j + 1) % 5 === 0)) continue;
        for (const R of [RA, RB]) { const q = R.at(R.weirS[j] + 8, R.side * (HW + (R === RA ? 52 : 26))); DK.txt(dc, String(j + 1), q[0], q[1] + 3, 'center', PAL.dim, legendU, HALO); }
      }
      { const q = TR.at(TR.L - 20, -(HW + 20)); DK.font(dc, 'serif', 15, 500, true); DK.txt(dc, 'the same 2,000 runs go both ways', q[0] + 4, q[1] + 6, 'right', PAL.ink, U.seg(t, 7.5, 8.2) * (1 - U.seg(t, T_REL + 4, T_REL + 5)), HALO); }
      if (countU > 0) {                                   // the address: read from the bars
        const W = S.worlds.off, b0 = counts.off.bars[0], b19 = counts.off.bars[K - 1];
        DK.font(dc, 'caps', 14, 500);
        const q0 = W.R.at(W.bars[0].s, HW + 68), q1 = W.R.at(W.bars[K - 1].s, HW + 60);
        DK.caps(dc, b0 + ' FAILED AT WEIR 1', q0[0] - 12, q0[1], 1.2, 'left', PAL.peachHi, countU, HALO);
        DK.caps(dc, b19 + ' AT WEIR 20', q1[0] - 4, q1[1], 1.2, 'right', PAL.peachHi, countU, HALO);
        DK.font(dc, 'serif', 14, 600, true);
        DK.txt(dc, A.saved.length + ' sage grains: runs the braids saved', 948, 506, 'right', PAL.sage, countU, HALO);
        DK.txt(dc, 'each detour cost them ' + TB.toFixed(1) + ' s of film time', 948, 524, 'right', PAL.ink, countU, HALO);
      }

      // the island speaks: title, then the question (lettered like a landmass name, no box)
      const island = x => 268 + 10 * Math.sin(x / 120);
      const titleA = U.seg(t, 0.2, 1.0) * (1 - U.seg(t, 3.0, 4.0));
      if (titleA > 0) {
        DK.font(dc, 'serif', 40, 500, true); DK.lettering(dc, 'What an AI agent actually does', island, 500, 2.4, { alpha: titleA });
        DK.font(dc, 'caps', 14, 500); DK.caps(dc, '2,000 RUNS  ·  20 STEPS EACH', 500, 300, 2.6, 'center', PAL.dim, titleA, HALO);
      }
      const cd = C.countdown(t);
      if (cd !== null) {
        const a = U.seg(t, 7.5, 8.0) * (1 - U.seg(t, T_REL - 0.3, T_REL));
        DK.font(dc, 'serif', 28, 600, true); DK.lettering(dc, 'How many reach the sea on the bare branch?', island, 500, 1.3, { alpha: a });
        // the countdown lives in the gorge: three survey pins, one pulled each second before the flood leaves
        const g0 = TR.at(TR.L * 0.42, 0);
        for (let i = 0; i < 3; i++) {
          const up = cd > i, q = [g0[0] + 18 + i * 12, g0[1] + 26];
          dc.beginPath(); dc.moveTo(q[0], q[1]); dc.lineTo(q[0], q[1] - (up ? 14 : 4)); dc.strokeStyle = U.rgba(PAL.ink, a * (up ? 1 : 0.35)); dc.lineWidth = 1.4; dc.stroke();
          if (up) { dc.beginPath(); dc.arc(q[0], q[1] - 14, 2.4, 0, 6.2832); dc.fillStyle = U.rgba(PAL.copper, a); dc.fill(); }
        }
        DK.font(dc, 'serif', 14, 500, true);
        DK.txt(dc, C.auto ? 'pause and guess — the flood leaves the gorge' : C.committed ? 'stake planted — the flood leaves the gorge' : 'plant your stake in the panel', g0[0] + 56, g0[1] + 26, 'left', PAL.ink, a, HALO);
      }

      // title block (bottom left): what the marks mean — labels, not sentences
      if (legendU > 0) {
        const lx = 22, ly = 470;
        DK.font(dc, 'serif', 19, 600, true); DK.txt(dc, 'What an AI agent actually does', lx, ly, 'left', PAL.ink, legendU * (1 - titleA), HALO);
        dc.globalAlpha = legendU;
        DK.discs(dc, [{ x: lx + 4, y: ly + 16 }], 2.4, '#D59D66');
        DK.discs(dc, [{ x: lx + 2, y: ly + 37 }, { x: lx + 6.5, y: ly + 37 }, { x: lx + 4.2, y: ly + 33.3 }], 2.0, PAL.peach);
        dc.beginPath(); dc.moveTo(lx + 186, ly + 9); dc.lineTo(lx + 186, ly + 22); dc.strokeStyle = PAL.weir; dc.lineWidth = 1.4; dc.stroke();
        const bp = []; for (let i = 0; i <= 12; i++) { const u = i / 12; bp.push([lx + 178 + 18 * u, ly + 32 + 5 * Math.sin(Math.PI * u)]); }
        DK.polyline(dc, bp, '#7E8C88', 3.8); DK.polyline(dc, bp, PAL.water, 2.4);
        dc.globalAlpha = 1;
        DK.font(dc, 'caps', 14, 500);
        DK.txt(dc, 'grain = one run', lx + 14, ly + 21, 'left', PAL.ink, legendU, HALO);
        DK.txt(dc, 'failed: settles at its weir', lx + 14, ly + 41, 'left', PAL.ink, legendU, HALO);
        DK.txt(dc, 'weir = one step', lx + 196, ly + 21, 'left', PAL.ink, legendU, HALO);
        DK.txt(dc, 'braid = a check (a detour)', lx + 204, ly + 41, 'left', PAL.ink, legendU, HALO);
      }
      p.drawingContext.drawImage(surf.cv, 0, 0, 960, 540);
    },

    score(ctx) {
      const A = ctx.engine, S = A.sim, ev = [];
      ev.push({ t: 0.25, kind: 'tone', freq: 196, dur: 3.2, gain: 0.55, attack: 0.6 });
      ev.push({ t: 0.3, kind: 'tone', freq: 293.7, dur: 2.6, gain: 0.3, attack: 0.8 });
      for (let i = 0; i < 3; i++) ev.push({ t: 7.5 + i, kind: 'tick', freq: 2200, gain: 0.8 });
      const bin = (arr, kind, base, scale, pan, freq) => {
        const B = new Map(); for (const x of arr) { if (!isFinite(x)) continue; const k = Math.round(x / 0.06); B.set(k, (B.get(k) || 0) + 1); }
        for (const [k, n] of B) ev.push({ t: k * 0.06, kind, gain: Math.min(1.3, base + scale * Math.sqrt(n)), pan, freq });
      };
      bin(Array.from(S.worlds.off.tFail), 'clack', 0.15, 0.22, -0.35);
      bin(Array.from(S.worlds.on.tFail), 'clack', 0.12, 0.2, 0.35, 150);
      bin(S.worlds.on.catchT, 'click', 0.12, 0.16, 0.4, 1568);
      bin(Array.from(S.worlds.off.mouthT), 'tick', 0.05, 0.05, -0.2, 2600);
      bin(Array.from(S.worlds.on.mouthT), 'tick', 0.05, 0.05, 0.2, 3100);
      ev.push({ t: T_COUNT, kind: 'tone', freq: 392, dur: 1.6, gain: 0.6 });
      ev.push({ t: T_INK, kind: 'tone', freq: 293.7, dur: 2.8, gain: 0.5, attack: 0.3 });
      return ev;
    },

    meta(ctx) {
      const A = ctx.engine, S = A.sim;
      return [
        { label: 'Reached the sea · bare branch', value: S.worlds.off.surv.length, check: { world: 'off', k: K, p: 0.95, c: 0.8, N } },
        { label: 'Reached the sea · braided branch', value: S.worlds.on.surv.length, check: { world: 'on', k: K, p: 0.95, c: 0.8, N } },
        { label: 'P(run survives 20) · no checks', value: A.exact.off[K], check: { world: 'off', k: K, p: 0.95, c: 0.8 } },
        { label: 'P(run survives 20) · checks', value: A.exact.on[K], check: { world: 'on', k: K, p: 0.95, c: 0.8 } },
        { label: 'Saved by the braids (sage)', value: A.saved.length },
        { label: 'Bar at weir 1 / weir 20', value: A.failedAt('off', 0) + ' / ' + A.failedAt('off', K - 1) },
        { label: 'Mean detour delay per arriving run (s, film time)', value: +S.meanDelay.toFixed(2) },
        { label: 'Seed', value: ctx.seed },
      ];
    },
  });
})();
