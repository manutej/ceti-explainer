/* SEDIMENT DELTA · native — "Correlated failure" (glance), revision 1.
   A dome with one spring: four rivers radiate from it to the coast, one per day (500 agent runs a day, a check at
   every weir). Every run reads the spring — a shared source (a price list) — at step 2. Independent slips are the
   engine's own draws (Atelier.AgentLoop, 5 % a step; checks catch 4 in 5 and retry). On a day the shared source
   is wrong, a landslide at weir 2 dams the valley: every grain of that day piles up behind it and the channel
   below is abandoned. The checks downstream read the same source, so they catch nothing that day.
   Control (what-if, sketch): how many of the four days the source is wrong. Each fan carries a dashed ghost: where
   it would stop without checks (the engine's twin world). Counts are read from settled grains. */
(() => {
  const { PAL, TONES, PathRiver, Deposit } = DK;
  const U = Atelier.U, h = U.h;
  const D = 4, ND = 500, N = D * ND, K = 20, P = 0.95, CC = 0.8, HW = 10, SRC = 1;   // SRC: step index that reads the source (step 2)
  const T_REL = 6.0, REL = 2.4, TB = 0.7, BS = 9, BE = 15, T_COUNT = 17.6, T_INK = 22.6, DUR = 28;
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const RIV = [
    [[440, 52], [404, 90], [350, 140], [290, 196], [232, 262], [176, 330], [124, 392], [84, 446]],
    [[460, 60], [446, 112], [424, 176], [404, 246], [384, 316], [366, 386], [352, 446]],
    [[488, 60], [516, 112], [552, 172], [586, 240], [616, 312], [644, 380], [664, 446]],
    [[508, 52], [566, 78], [640, 110], [718, 156], [784, 218], [828, 294], [858, 372], [878, 446]],
  ].map((pts, d) => PathRiver({ pts: DK.meander(pts, 50 + d, 9 + 3 * (d % 2), 120 + 20 * d), nW: K, ws0: 44, we: 22, valley: 24, plain: 15 }));
  const coastY = x => 444 + 12 * (U.fbm(43, 3, x / 60) - 0.5);
  const sea = (x, y) => coastY(x) - y;
  const bank = s => 1 + 0.18 * (U.noise1(5, s / 15) - 0.5) + 0.08 * (U.noise1(6, s / 5) - 0.5);
  const STREAMS = DK.tributaries(29, 36, RIV, 960, 540, (x, y) => sea(x, y) > 30 && y > 40);
  const V = 540 / 5.6;
  const fanSpan = r => { const wd = U.clamp(Math.round(7 + 0.3 * r + 1.6 * (U.noise1(310, r / 4) - 0.5)), 5, 18), lo = Math.round(9.5 - (wd - 1) / 2); return [lo, lo + wd - 1]; };
  const lakeSpan = r => { const wd = U.clamp(Math.round(7 + 0.35 * r), 7, 18), lo = Math.round(13.5 - (wd - 1) / 2); return [lo, lo + wd - 1]; };

  function build(A, seed, bad) {
    const order = Array.from({ length: D }, (_, d) => d).sort((a, b) => h(seed, a, 0, 99) - h(seed, b, 0, 99));
    const isBad = new Uint8Array(D); for (let i = 0; i < bad; i++) isBad[order[i]] = 1;
    const tau = new Float64Array(N), lane = new Float64Array(N), vel = new Float64Array(N), db = new Float64Array(N);
    const fail = new Int16Array(N), dam = new Uint8Array(N), catches = new Array(N), tFail = new Float64Array(N).fill(Infinity), tMouth = new Float64Array(N).fill(Infinity), place = new Array(N);
    for (let r = 0; r < N; r++) {
      const d = (r / ND) | 0, m = r % ND, u = (m + h(seed, r, 7, 1)) / ND, R = RIV[d];
      tau[r] = T_REL + REL * Math.acos(1 - 2 * u) / Math.PI;
      lane[r] = (h(seed, r, 8, 3) - 0.5) * 1.72;
      vel[r] = V * (1.1 - 0.36 * Math.pow(lane[r] / 0.86, 2));
      db[r] = TB - (BS + BE) / vel[r];
      let f = A.failStep.on[r];
      if (isBad[d] && (f < 0 || f >= SRC)) { f = SRC; dam[r] = 1; }       // the shared source is wrong: everyone stops at step 2
      fail[r] = f;
      const cs = [], top = f < 0 ? K : f; for (let j = 0; j < top; j++) if (A.slip(r, j) && A.caught(r, j) && A.retryOk(r, j)) cs.push(j);
      catches[r] = cs;
      if (f >= 0) tFail[r] = tau[r] + R.weirS[f] / vel[r] + db[r] * cs.length; else tMouth[r] = tau[r] + R.L / vel[r] + db[r] * cs.length;
    }
    const days = [];
    for (let d = 0; d < D; d++) {
      const R = RIV[d], ids = []; for (let m = 0; m < ND; m++) ids.push(d * ND + m);
      const bars = [], failT = [];
      for (let j = 0; j < K; j++) {
        const sb = R.weirS[j] + 6, o = R.at(sb, HW * bank(sb) + 2), n = R.nrm(sb), tg = R.tan(sb);
        const Dp = Deposit({ cols: 3, hmax: 2, cell: 2.4, ox: o[0], oy: o[1], ux: n[0], uy: n[1], vx: tg[0], vy: tg[1], seed, key: 40 * d + j });
        const fl = ids.filter(r => fail[r] === j).sort((a, b) => tFail[a] - tFail[b]);
        for (const r of fl) if (!dam[r]) place[r] = Dp.add(r);
        bars.push(Dp); failT.push(Float64Array.from(fl.map(r => tFail[r])));
      }
      let lake = null, tSlide = Infinity;
      if (isBad[d]) {                                        // dammed lake: grains pile upstream of the slide
        const sw = R.weirS[SRC] - 4, o = R.p(sw), tg = R.tan(sw);
        lake = Deposit({ cols: 28, hmax: 2, cell: 2.3, ox: o[0], oy: o[1], ux: -tg[0], uy: -tg[1], vx: tg[1], vy: -tg[0], seed, key: 900 + d, centred: true, rows: 40, span: lakeSpan });
        const dv = ids.filter(r => dam[r]).sort((a, b) => tFail[a] - tFail[b]);
        for (const r of dv) place[r] = lake.add(r);
        tSlide = dv.length ? tFail[dv[0]] - 0.6 : Infinity;
      }
      const m = R.p(R.L), tg = R.tan(R.L);
      const delta = Deposit({ cols: 20, hmax: 2, cell: 2.3, ox: m[0] + tg[0] * 1.5, oy: m[1] + tg[1] * 1.5, ux: tg[0], uy: tg[1], vx: -tg[1], vy: tg[0], seed, key: 700 + d, centred: true, rows: 40, span: fanSpan });
      const surv = ids.filter(r => fail[r] < 0).sort((a, b) => tMouth[a] - tMouth[b]);
      for (const r of surv) place[r] = delta.add(r);
      let off = 0; if (!isBad[d]) for (const r of ids) if (A.failStep.off[r] < 0) off++;   // the twin world without checks
      days.push({ R, bars, failT, lake, delta, surv: surv.length, off, tSlide, bad: !!isBad[d] });
    }
    const catchT = [], failAll = [], damT = [];
    for (let r = 0; r < N; r++) {
      const R = RIV[(r / ND) | 0];
      catches[r].forEach((j, i) => catchT.push(tau[r] + (R.weirS[j] - BS) / vel[r] + db[r] * i));
      if (fail[r] >= 0) (dam[r] ? damT : failAll).push(tFail[r]);
    }
    const good = D - bad, pOn = A.exact.on[K];
    return { tau, lane, vel, db, fail, dam, catches, tFail, tMouth, place, days, bad, isBad, catchT, failAll, damT,
      mouthT: Array.from(tMouth).filter(isFinite), E: good * ND * pOn, sd: Math.sqrt(good * ND * pOn * (1 - pOn)) };
  }

  function halfWidth(day, t) {
    const lost = new Float64Array(K + 1); let acc = 0;
    for (let s = 0; s <= K; s++) { lost[s] = acc; if (s < K) acc += DK.countLE(day.failT[s], t); }
    return s => { const [a, b, u] = day.R.sectionBlend(s); return HW * bank(s) * (ND - U.lerp(lost[a], lost[b], u)) / ND; };
  }
  function braidPt(R, j, u, l0) {
    const ss = U.lerp(R.weirS[j] - BS, R.weirS[j] + BE, u), sw = Math.pow(Math.sin(Math.PI * u), 0.6);
    return R.at(ss, U.lerp(l0, -(HW + 7), sw));
  }

  Atelier.film({
    id: 'delta-native',
    title: 'Correlated failure',
    direction: 'C · Sediment Delta',
    level: 'glance',
    duration: DUR, size: [960, 540], renderer: 'p2d', fps: 30, seed: 1, ground: PAL.ground,
    chapters: [{ t: 0, label: 'Four days, one spring' }, { t: T_REL, label: 'The flood' }, { t: T_COUNT, label: 'Soundings' }, { t: T_INK, label: 'The record' }],
    captions: [
      { t0: 0.3, t1: 3.2, text: 'Four days of an AI agent: 500 runs a day, a check at every step.' },
      { t0: 3.2, t1: T_REL, text: 'The spring is a shared source: a price list that every run reads at step 2.' },
      { t0: T_REL, t1: 11.5, text: 'One day the price list is wrong. Every run reads it, so every run stops at step 2.' },
      { t0: 11.5, t1: T_COUNT, text: 'The checks downstream read the same price list. They catch slips, not this.' },
      { t0: T_COUNT, t1: T_INK, text: 'Good days: checks lift a fan from about 36 to 79 of 100. The bad day: none either way.' },
      { t0: T_INK, t1: DUR, text: 'Checks that read the same source cannot catch it. Check the source with something else.' },
    ],
    state: { bad: 1 },
    controls: [
      { key: 'bad', type: 'range', label: 'Days the shared source is wrong (what-if, of 4)', min: 0, max: 4, step: 1, jump: T_REL,
        hint: 'Re-runs the week on the same random draws. Slips stay 5 % a step; checks stay on.', format: v => String(Math.round(v)) },
    ],
    engine: ctx => { const A = Atelier.AgentLoop({ N, k: K, p: P, c: CC, retry: 1, seed: ctx.seed }); A.sim = build(A, ctx.seed, Math.round(ctx.state.bad)); return A; },

    draw(p, t, ctx) {
      const A = ctx.engine, S = A.sim, surf = DK.cpu(ctx.size.k), dc = surf.c, HALO = 'rgba(20,13,8,0.6)';
      dc.drawImage(DK.terrain('native2-' + ctx.seed, 960, 540, { seed: 23 + ctx.seed, rivers: RIV, streams: STREAMS, sea,
        base: (x, y) => 0.5 + 1.1 * Math.exp(-(Math.pow((x - 474) / 320, 2) + Math.pow((y - 40) / 300, 2))) }), 0, 0, 960, 540);
      const legendU = U.seg(t, 3.2, 4.8), countU = U.seg(t, T_COUNT, T_COUNT + 1.4, 'enter'), inkU = U.seg(t, T_INK, T_INK + 1.2);

      // the spring (the shared source) at the summit
      { const c = [474, 46]; dc.beginPath(); dc.ellipse(c[0], c[1], 44, 17, 0, 0, 6.2832); dc.fillStyle = '#2C2216'; dc.fill();
        dc.beginPath(); dc.ellipse(c[0], c[1], 41.5, 15, 0, 0, 6.2832); dc.fillStyle = PAL.water; dc.fill();
        dc.beginPath(); dc.ellipse(c[0], c[1] + 1, 24, 7, 0, 0, 6.2832); dc.fillStyle = U.rgba(PAL.waterDeep, 0.9); dc.fill(); }

      const counts = new Int32Array(D);
      for (let d = 0; d < D; d++) {
        const day = S.days[d], R = day.R, hw = halfWidth(day, t);
        DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) + 1.8, '#2C2216');
        DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) + 0.4, '#A8916A');
        DK.channel(dc, R, 0, R.L + 2, s => HW * bank(s) - 1.2, '#BBA57D');
        DK.channel(dc, R, 0, R.L + 2, s => (hw(s) > 0.3 ? hw(s) + 1 : 0), '#7E8C88');
        DK.channel(dc, R, 0, R.L + 2, hw, PAL.water);
        DK.channel(dc, R, 0, R.L + 2, s => hw(s) * 0.42, U.rgba(PAL.waterDeep, 0.85));
        const bu = U.seg(t, 3.6, 5.6);
        for (let j = 0; j < K; j++) {                     // braids (checks) and weirs
          const pts = []; for (let i = 0; i <= 16; i++) pts.push(braidPt(R, j, i / 16, -HW * 0.7));
          dc.globalAlpha = bu; DK.polyline(dc, pts, '#7E8C88', 2.8); DK.polyline(dc, pts, day.bad && t > day.tSlide + 1.5 ? '#A8916A' : PAL.water, 1.8); dc.globalAlpha = 1;
          const sj = R.weirS[j], hb = HW * bank(sj) + 0.4, a = R.at(sj, hb), b = R.at(sj, -hb);
          dc.beginPath(); dc.moveTo(a[0], a[1]); dc.lineTo(b[0], b[1]); dc.strokeStyle = U.rgba(PAL.weir, 0.75); dc.lineWidth = 0.9; dc.stroke();
        }
        const settled = [], deltaPts = [], lakePts = [], fly = { cu: [], pe: [], sg: [] };
        for (let m = 0; m < ND; m++) {
          const r = d * ND + m, local = t - S.tau[r]; if (local < 0) continue;
          const f = S.fail[r];
          if (f >= 0 && t >= S.tFail[r]) {
            const Pq = S.place[r], u = (t - S.tFail[r]) / (S.dam[r] ? 0.8 : 0.55);
            if (u >= 1) { (S.dam[r] ? lakePts : settled).push(Pq); continue; }
            const s0 = R.weirS[f] - (S.dam[r] ? 4 : 0), p0 = R.at(s0, S.lane[r] * hw(s0)), e = U.ease.enter(u), arc = Math.sin(Math.PI * e) * 3;
            fly.pe.push({ x: U.lerp(p0[0], Pq.x, e), y: U.lerp(p0[1], Pq.y, e) - arc }); continue;
          }
          if (f < 0 && t >= S.tMouth[r]) {
            const Pq = S.place[r], u = (t - S.tMouth[r]) / 0.5;
            if (u >= 1) { deltaPts.push(Pq); counts[d]++; continue; }
            const p0 = R.at(R.L, S.lane[r] * hw(R.L) * 0.9), e = U.ease.enter(u);
            fly.cu.push({ x: U.lerp(p0[0], Pq.x, e), y: U.lerp(p0[1], Pq.y, e) }); continue;
          }
          const cs = S.catches[r], v = S.vel[r], DB = S.db[r]; let i = 0, pos = null;
          for (; i < cs.length; i++) {
            const j = cs[i], ts = (R.weirS[j] - BS) / v + DB * i;
            if (local < ts) break;
            if (local < ts + TB) { pos = braidPt(R, j, (local - ts) / TB, S.lane[r] * hw(R.weirS[j] - BS)); break; }
          }
          if (pos) { fly.sg.push({ x: pos[0], y: pos[1] }); continue; }
          const sb = v * (local - DB * i); if (sb > R.L) continue;
          const q = R.at(sb, S.lane[r] * hw(sb) * 0.9);
          (i > 0 && sb - (R.weirS[cs[i - 1]] + BE) < 26 ? fly.sg : fly.cu).push({ x: q[0], y: q[1] });
        }
        // the landslide: a scarp on the dome flank and a debris tongue that dams the valley at weir 2
        if (day.bad && t >= day.tSlide) {
          const u = U.ease.enter(U.clamp((t - day.tSlide) / 0.9)), sw = R.weirS[SRC], c0 = R.at(sw + 3, 0), n = R.nrm(sw), tg = R.tan(sw);
          const ang = Math.atan2(n[1], n[0]), pts = [];
          for (let i = 0; i <= 30; i++) {
            const th = -Math.PI * 0.62 + 1.24 * Math.PI * i / 30, rr = (1 + 0.28 * (h(ctx.seed, d, i, 31) - 0.5)) * u;
            const ax = Math.cos(th) * 30 * rr, ay = Math.sin(th) * 46 * rr;                    // long axis across the valley
            pts.push([c0[0] + tg[0] * ax * 0.9 + n[0] * (ay - 14 * u), c0[1] + tg[1] * ax * 0.9 + n[1] * (ay - 14 * u)]);
          }
          dc.beginPath(); pts.forEach((q, i) => (i ? dc.lineTo(q[0], q[1]) : dc.moveTo(q[0], q[1]))); dc.closePath();
          dc.fillStyle = '#8C7759'; dc.fill(); dc.strokeStyle = 'rgba(30,20,12,0.55)'; dc.lineWidth = 0.8; dc.stroke();
          const sc = R.at(sw + 3, HW + 40 * u);                // the scarp the slope tore from
          dc.beginPath(); dc.ellipse(sc[0], sc[1], 30 * u, 12 * u, ang + Math.PI / 2, Math.PI * 1.05, Math.PI * 1.95); dc.strokeStyle = 'rgba(20,12,7,0.9)'; dc.lineWidth = 1.6; dc.stroke();
          const stones = []; for (let i = 0; i < 90; i++) { const th = -Math.PI * 0.6 + 1.2 * Math.PI * h(ctx.seed, d, i, 32), rr = u * Math.sqrt(h(ctx.seed, d, i, 33));
            stones.push({ x: c0[0] + tg[0] * Math.cos(th) * 27 * rr + n[0] * (Math.sin(th) * 42 * rr - 14 * u), y: c0[1] + tg[1] * Math.cos(th) * 27 * rr + n[1] * (Math.sin(th) * 42 * rr - 14 * u) }); }
          DK.discs(dc, stones, 1.0, '#5E4D3A'); DK.discs(dc, stones.slice(0, 36), 0.7, '#C2AC88');
        }
        DK.sediment(dc, settled, TONES.peach, { r: 0.95, rimR: 2.4, bodyR: 2.0 });
        DK.sediment(dc, lakePts, TONES.peach, { r: 0.95, rimR: 2.3, bodyR: 1.95 });
        if (deltaPts.length) DK.sediment(dc, deltaPts, TONES.copper, { r: 0.95, rimR: 2.2, bodyR: 1.9, grainR: 0.85, fringe: U.mix(PAL.sea, '#5F8190', 0.62), fringe2: U.mix(PAL.sea, '#4A6878', 0.5) });
        DK.discs(dc, fly.cu, 1.0, '#D59D66'); DK.discs(dc, fly.sg, 1.05, PAL.sage); DK.discs(dc, fly.pe, 1.05, PAL.peach);
      }

      // soundings at each fan: realised (from settled grains); dashed ghost = where it stops without checks
      for (let d = 0; d < D; d++) {
        const day = S.days[d], R = day.R, m = R.p(R.L), tg = R.tan(R.L), nx = -tg[1], ny = tg[0];
        const at = (a, l) => [m[0] + tg[0] * (a + 1.5) + nx * l, m[1] + tg[1] * (a + 1.5) + ny * l];
        if (countU > 0 && !day.bad) {
          const a = day.delta.lengthFor(day.off), r0 = Math.floor(a / 2.3), sp = fanSpan(r0), hh = (sp[1] - sp[0] + 1) * 2.3 / 2 + 5;
          DK.polyline(dc, [at(a, -hh), at(a, hh)], U.rgba(PAL.ink, 0.55 + 0.45 * inkU), 1.2, [3, 2.5]);
          if (d === 0) { DK.font(dc, 'serif', 14, 500, true); DK.txt(dc, 'dashed: ' + day.off + ' without checks', m[0] + 18, m[1] - 14, 'left', PAL.ink, countU, HALO); }
        }
        if (t >= T_REL + 4) {
          const q = at(10, 0), n = counts[d];
          DK.font(dc, 'serif', 22 + 4 * countU, 600, true);
          DK.txt(dc, String(n), q[0] + (d === 3 ? -34 : 30), Math.min(532, q[1] + 30), d === 3 ? 'right' : 'left', day.bad ? PAL.peachHi : PAL.copper, 1, HALO);
        }
      }

      // names along the rivers; the spring; the dam's address
      DK.font(dc, 'serif', 16, 600, true);
      for (let d = 0; d < D; d++) { const R = RIV[d], q = R.p(R.L * 0.6), dx = [-34, -30, 30, 32][d]; DK.caps(dc, DAYS[d], q[0] + dx, q[1], 1.6, d < 2 ? 'right' : 'left', PAL.ink, 0.95 * legendU, 'rgba(20,13,8,0.6)'); }
      DK.font(dc, 'serif', 15, 500, true);
      DK.txt(dc, 'the spring: one price list every run reads at step 2', 474, 20, 'center', PAL.ink, legendU, HALO);
      const firstBad = S.days.findIndex(x => x.bad);
      if (firstBad >= 0 && t >= S.days[firstBad].tSlide + 0.6) {
        const day = S.days[firstBad], R = day.R, q = R.at(R.weirS[SRC] + 30, (firstBad < 2 ? 1 : -1) * 64), a = U.seg(t, day.tSlide + 0.6, day.tSlide + 1.3);
        DK.font(dc, 'serif', 16, 600, true);
        DK.txt(dc, DAYS[firstBad] + ': the price list was wrong.', q[0], q[1], firstBad < 2 ? 'right' : 'left', PAL.peachHi, a, HALO);
        DK.font(dc, 'serif', 15, 500, true);
        DK.txt(dc, 'all ' + ND + ' runs stopped at step 2; the checks below read it too', q[0], q[1] + 18, firstBad < 2 ? 'right' : 'left', PAL.ink, a, HALO);
      }

      // the week's sounding (top right): realised total read from the fans, expectation as a range
      if (t >= T_REL + 4) {
        const tot = Array.from(counts).reduce((a, b) => a + b, 0);
        DK.font(dc, 'serif', 34 + 4 * countU, 600, true); DK.txt(dc, DK.fmt(tot), 944, 64, 'right', PAL.copper, 1, HALO);
        DK.font(dc, 'serif', 15, 500, true); DK.txt(dc, 'of 2,000 reached the sea this week', 944, 84, 'right', PAL.ink, 1, HALO);
        if (countU > 0) DK.txt(dc, 'expected with ' + S.bad + ' bad day' + (S.bad === 1 ? '' : 's') + ': ' + DK.fmt(S.E) + ' ± ' + S.sd.toFixed(1), 944, 103, 'right', PAL.dim, countU, HALO);
      }

      // title block (top left): fades in place, no wipe
      const titleA = U.seg(t, 0.2, 1.0);
      DK.font(dc, 'serif', 30, 500, true); DK.txt(dc, 'Correlated failure', 22, 46, 'left', PAL.ink, titleA, HALO);
      DK.font(dc, 'caps', 14, 500); DK.caps(dc, 'FOUR DAYS · ONE SHARED SOURCE', 23, 68, 1.6, 'left', PAL.dim, titleA, HALO);
      if (legendU > 0) {
        DK.font(dc, 'caps', 14, 500);
        dc.globalAlpha = legendU; DK.discs(dc, [{ x: 28, y: 92 }], 2.3, '#D59D66'); DK.discs(dc, [{ x: 26, y: 112 }, { x: 30.5, y: 112 }, { x: 28.2, y: 108.4 }], 1.9, PAL.peach); DK.polyline(dc, [[22, 128], [36, 128]], PAL.ink, 1.2, [3, 2.5]); dc.globalAlpha = 1;
        DK.txt(dc, 'grain = one run', 44, 97, 'left', PAL.ink, legendU, HALO);
        DK.txt(dc, 'failed: settles where it stopped', 44, 117, 'left', PAL.ink, legendU, HALO);
        DK.txt(dc, 'dashed = the fan without checks', 44, 133, 'left', PAL.ink, legendU, HALO);
      }
      p.drawingContext.drawImage(surf.cv, 0, 0, 960, 540);
    },

    score(ctx) {
      const S = ctx.engine.sim, ev = [];
      ev.push({ t: 0.25, kind: 'tone', freq: 174.6, dur: 3, gain: 0.5, attack: 0.5 });
      const bin = (arr, kind, base, scale, pan, freq) => {
        const B = new Map(); for (const x of arr) { if (!isFinite(x)) continue; const k = Math.round(x / 0.06); B.set(k, (B.get(k) || 0) + 1); }
        for (const [k, n] of B) ev.push({ t: k * 0.06, kind, gain: Math.min(1.3, base + scale * Math.sqrt(n)), pan, freq });
      };
      bin(S.failAll, 'clack', 0.12, 0.2, -0.2); bin(S.catchT, 'click', 0.1, 0.14, 0.3, 1568); bin(S.mouthT, 'tick', 0.04, 0.05, 0.1, 2800); bin(S.damT, 'clack', 0.2, 0.12, 0, 95);
      S.days.forEach(d => { if (isFinite(d.tSlide)) { ev.push({ t: d.tSlide, kind: 'clack', freq: 55, gain: 1.8 }); ev.push({ t: d.tSlide, kind: 'tone', freq: 49, dur: 1.6, gain: 0.8, attack: 0.04 }); } });
      ev.push({ t: T_COUNT, kind: 'tone', freq: 349.2, dur: 1.4, gain: 0.5 });
      ev.push({ t: T_INK, kind: 'tone', freq: 261.6, dur: 2.6, gain: 0.5, attack: 0.3 });
      return ev;
    },

    meta(ctx) {
      const A = ctx.engine, S = A.sim, good = S.days.filter(d => !d.bad), sGood = good.reduce((a, d) => a + d.surv, 0);
      const rows = [
        { label: 'Reached the sea this week', value: S.days.reduce((a, d) => a + d.surv, 0) },
        { label: 'Expected (bad days deliver 0)', value: +S.E.toFixed(1) },
        { label: 'Bad days (what-if, sketch)', value: S.bad },
        { label: 'P(run survives) · checks, good day', value: A.exact.on[K], check: { world: 'on', k: K, p: P, c: CC } },
        { label: 'P(run survives) · no checks', value: A.exact.off[K], check: { world: 'off', k: K, p: P, c: CC } },
        { label: 'Seed', value: ctx.seed },
      ];
      if (good.length) rows.splice(1, 0, { label: 'Reached the sea · good days', value: sGood, check: { world: 'on', k: K, p: P, c: CC, N: good.length * ND } });
      return rows;
    },
  });
})();
