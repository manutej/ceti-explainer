/* THE RUN · shared (revision 1) — "What an AI agent actually does" (glance).
   Mark rule: each column is one agent run; each knitted row is one step. Knitted top-down from a cast-on rod: a
   travelling needle forms each row left to right. A slip drops the stitch (peach slack loop = its address); the
   ladder runs up through every row already knitted (the whole run's work is lost) and the needle skips the dead
   column from then on. Count = hang the swatch sorted by drop row: the hem IS the survival curve, read against a
   copper thread pinned along the exact curve. Twin world (same draws) = the SAME swatch replayed with a hook that
   checks every row: a sage basting pass per row (the cost) and the ladders it catches latched back up (sage).
   Counts are read from column states driven by Atelier.AgentLoop. Kit run.kit.js is inlined by build.py --kit. */
(function () {
  const K = 20, N = 2000;
  const EX = Atelier.AgentLoop.exact(K, 0.95, 0.8, 1);
  // timeline (s)
  const T_CAST = 3.55, PULL0 = 7.55, PULL1 = 9.15, HOLD = 9.5, JUMP = 12.5;
  const TROW = j => (j < 4 ? 3.95 + 0.85 * j : 12.65 + (j - 4) * 0.37);   // j = 19 → 18.2
  const NEEDLE_OUT = 18.9, S1A = 19.2, S1B = 21.0, ACT2 = 22.5, S2A = 27.4, S2B = 29.2, DUR = 34;
  const TB = j => ACT2 + 0.35 + j * 0.2;                                   // the hook's checking pass along row j
  const C0 = 218, CM = 225, CWIN = 15;                                     // macro window (columns 218–232)
  const tau = (c, j) => (j < 4 ? (c < C0 ? 0 : c <= C0 + CWIN ? (c - C0) / CWIN * 0.6 : 0.6 + (c - C0 - CWIN) / (N - C0 - CWIN) * 0.05) : c / N * 0.3);
  const LAD = j => (j < 4 ? 0.14 : 0.03);
  const SX = 40, CWF = 0.44, RHF = 14, RY = 128, CWM = 60, RHM = 43.2, RYM = 150;
  const COL = { felt: '#E2D7C2', yarn: '#A8917A', light: '#EFE7D6', sage: '#77B062', peach: '#E5652A', card: '#F7F2E6' };
  const LENS = { w: 196, h: 142, mag: 34 };
  const TRACK = 229;                                                        // the lens follows run #229 (slips at steps 0 and 16)

  Atelier.film({
    id: 'run-shared',
    title: 'The Run — what an AI agent actually does',
    direction: 'G · The Run · knitted cloth',
    level: 'glance',
    duration: DUR,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: COL.felt,
    chapters: [{ t: 0, label: 'Title' }, { t: 3.6, label: 'One column, one run' }, { t: HOLD, label: 'Your marker' },
      { t: JUMP, label: '2,000 runs' }, { t: S1A, label: 'Hang it: the hem' }, { t: ACT2, label: 'Same runs, with a hook' }, { t: S2B, label: 'Both hems' }],
    captions: [
      { t0: 0.2, t1: 3.5, text: 'An AI agent works in a loop: plan, call a tool, read the result, check, repeat.' },
      { t0: 3.6, t1: 5.6, text: 'Each column is one run of an agent. Each knitted row is one step of the loop.' },
      { t0: 5.6, t1: 7.6, text: 'A step slips: the stitch drops, and the ladder undoes every step that run had done.' },
      { t0: 7.6, t1: JUMP, text: 'Your call: 20 rows, each right 95 % of the time. Where will the whole runs end?' },
      { t0: JUMP, t1: S1A, text: 'All 2,000 runs, knitted row by row. Pale slits are ladders: runs that failed.' },
      { t0: S1A, t1: ACT2, text: 'Hang the swatch sorted by the row that dropped: the hem is the survival curve.' },
      { t0: ACT2, t1: S2A, text: 'Same runs, same slips. A hook checks every row and latches 4 in 5 drops back up.' },
      { t0: S2A, t1: DUR, text: 'Checking costs a pass on every row of every run, and twice as many runs come out whole.' },
    ],
    state: { guess: 1800 },
    controls: [{ key: 'guess', type: 'commit', label: 'Whole runs of 2,000 after 20 steps (no checks)', min: 0, max: 2000, step: 10, jump: JUMP, countdown: 3,
      hint: 'Clip the marker on the rod where you think the whole runs will end.', format: v => Math.round(v).toLocaleString('en-US') }],
    engine: ctx => Atelier.AgentLoop({ N, k: K, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

    setup(p, ctx) {
      const KIT = window.RunKit; KIT.atlas();
      const A = ctx.engine, R = 22;    // m = 0 cast-on · m = j+1 step j · m = 21 bind-off (whole runs)
      const pal = [KIT.srgb(COL.yarn), KIT.srgb(COL.sage), KIT.srgb(COL.peach), KIT.srgb(COL.light)];
      ctx.G = { cols: N, rows: R, kind: new Uint8Array(N * R), col: new Uint8Array(N * R), pal, colX: new Float32Array(N), colW: new Float32Array(N),
        colA: new Float32Array(N).fill(1), sag: new Float32Array(N), y0: 0, rowH: 1, clip: [0, 0, 960, 540], idBase: 0, colBase: 0, jit: 0.14 };
      ctx.V = Object.assign({}, ctx.G, { colX: new Float32Array(N), colW: new Float32Array(N), sag: new Float32Array(N) });   // lens view
      // hang orders: whole first (plain, then saved for the on-world), then failed by drop row, latest first
      const order = w => {
        const f = A.failStep[w], key = c => (f[c] < 0 ? (w === 'on' && A.failStep.off[c] >= 0 ? 1e6 - 1 : 1e6) : f[c]);
        const idx = Array.from({ length: N }, (_, c) => c).sort((a, b) => key(b) - key(a) || a - b);
        const slot = new Int16Array(N); idx.forEach((c, i) => (slot[c] = i)); return slot;
      };
      ctx.slot1 = order('off'); ctx.slot2 = order('on');
      ctx.lam = new Float32Array(N); ctx.sm = new Float32Array(N); ctx.rowMax = new Float32Array(R);
      const l1 = KIT.chart('WHAT AN AI AGENT', 10, { weight: 600, track: 0.22 }), l2 = KIT.chart('ACTUALLY DOES', 10, { weight: 600, track: 0.22 });
      ctx.title = { l1, l2 };
      const TW = 150, TR = 30;
      ctx.tg = { cols: TW, rows: TR, kind: new Uint8Array(TW * TR), col: new Uint8Array(TW * TR), pal, colX: new Float32Array(TW), colW: new Float32Array(TW),
        colA: new Float32Array(TW).fill(1), sag: new Float32Array(TW), y0: 0, rowH: 1, clip: [0, 0, 960, 540], idBase: 0, colBase: 0, jit: 0.1 };
    },

    draw(p, t, ctx) {
      const KIT = window.RunKit, U = ctx.U, T = ctx.tokens, A = ctx.engine, KD = KIT.KIND, G = ctx.G, dc = p.drawingContext;
      const rk = Math.min(ctx.size.k, 1.5);
      if (!ctx.R || ctx.R.scale !== rk) { ctx.R = KIT.renderer(960, 540, rk); ctx.R.vig = 0.14; ctx.RL = KIT.renderer(LENS.w, LENS.h, rk); ctx.RL.vig = 0; }
      const R = ctx.R; KIT.felt(R, U, KIT.srgb(COL.felt)); KIT.clear(R);
      const fo = A.failStep.off, fn = A.failStep.on, RR = G.rows;

      /* ── camera: macro on columns 216–236 → the whole 2,000-column swatch (stretched sheen) ── */
      const e = U.smoothstep(0, 1, U.clamp((t - PULL0) / (PULL1 - PULL0)));
      const cw = Math.exp(U.lerp(Math.log(CWM), Math.log(CWF), e)), rh = Math.exp(U.lerp(Math.log(RHM), Math.log(RHF), e));
      const cx0 = CM + 0.5, cx1 = (480 - SX) / CWF, wz = (1 / CWM - 1 / cw) / (1 / CWM - 1 / CWF || 1), cx = U.lerp(cx0, cx1, wz);
      const rodY = U.lerp(RYM, RY, e), y0 = rodY - 0.45 * rh;
      const gx = c => 480 + (c - cx) * cw;
      const e1 = U.smoothstep(0, 1, U.clamp((t - S1A) / (S1B - S1A))), e2 = U.smoothstep(0, 1, U.clamp((t - S2A) / (S2B - S2A)));
      const act2 = t >= ACT2;

      /* ── column states ── */
      let whole = 0, rowsDone = 0, front = -1, frontRow = -1;
      for (let j = 0; j < K; j++) if (t >= TROW(j) + (j < 4 ? 0.66 : 0.31)) rowsDone = j + 1;
      for (let j = 0; j < K; j++) if (t >= TROW(j) && t < TROW(j) + (j < 4 ? 0.66 : 0.31)) { frontRow = j; }
      if (frontRow >= 0) { const u = t - TROW(frontRow); if (frontRow < 4) front = u < 0.6 ? C0 + u / 0.6 * CWIN : C0 + CWIN + (u - 0.6) / 0.05 * (N - C0 - CWIN); else front = u / 0.3 * N; }
      const rowMax = ctx.rowMax; rowMax.fill(0);
      const bindOn = t >= NEEDLE_OUT;
      for (let c = 0; c < N; c++) {
        const base = c * RR, f = fo[c];
        const fT = f >= 0 ? TROW(f) + tau(c, f) : Infinity, failed = t >= fT;
        // act 2: the latch (same draws, on-world)
        const g2 = fn[c], latch = act2 && f >= 0 && (g2 < 0 || g2 > f) ? TB(f) + 0.12 : Infinity, latched = t >= latch;
        const g2T = g2 >= 0 && g2 > f ? TB(g2) + 0.12 : (g2 >= 0 ? fT : Infinity);
        let alive = !failed;
        G.kind[base] = t >= T_CAST + tau(c, 0) * 0.8 ? KD.BIND : KD.EMPTY; G.col[base] = 0;
        for (let j = 0; j < K; j++) {
          const m = j + 1; let kind = KD.EMPTY, col = 0;
          const formed = t >= TROW(j) + tau(c, j);
          if (!latched) {
            if (formed && (!failed || j < f)) kind = KD.KNIT;
            if (failed) {
              if (j === f) { kind = KD.LOOP; col = 2; }
              else if (j < f && t >= fT + 0.1 + (f - 1 - j) * LAD(f)) kind = KD.CRIMP;
            }
          } else {
            // latched back up (the hook climbs from the drop to the cast-on), then the run knits on under the checking pass
            const shown = j <= f ? true : t >= TB(j);
            if (shown) kind = KD.KNIT;
            if (j === f) col = 1;
            if (j > f && j < (g2 >= 0 ? g2 : K) && A.slip(c, j) && A.caught(c, j) && A.retryOk(c, j) && t >= TB(j) + 0.12) col = 1;
            if (j < f && t < latch + (f - j) * 0.025) kind = KD.CRIMP;
            if (g2 >= 0 && g2 > f && t >= g2T) {
              if (j === g2) { kind = KD.LOOP; col = 2; }
              else if (j > g2) kind = KD.EMPTY;
              else if (t >= g2T + 0.1 + (g2 - 1 - j) * 0.03) { kind = KD.CRIMP; col = 0; }
            }
          }
          G.kind[base + m] = kind; G.col[base + m] = col;
        }
        alive = latched ? !(g2 >= 0 && t >= g2T) : !failed;
        G.kind[base + 21] = bindOn && alive && (rowsDone >= K || latched) && (!latched || t >= TB(K - 1)) ? KD.BIND : KD.EMPTY; G.col[base + 21] = 0;
        if (alive) whole++;
        // x: knitting order → hang order 1 → hang order 2
        const xg = gx(c), x1 = SX + ctx.slot1[c] * CWF, x2 = SX + ctx.slot2[c] * CWF;
        G.colX[c] = t < S1A ? xg : t < S2A ? U.lerp(xg, x1, e1) : U.lerp(x1, x2, e2);
        G.colW[c] = cw; G.colA[c] = 1;
        ctx.lam[c] = alive ? 0 : 1;
        if (cw < 2) for (let m = 0; m < RR; m++) if (G.kind[base + m]) rowMax[m] = Math.max(rowMax[m], G.colX[c] + cw);
      }
      // drape (closed form): a light sag where structure is lost — kept small so the hem still reads as the curve
      const sm = ctx.sm, lam = ctx.lam, Rk = 6, hang = (rowsDone + 1) * rh;
      if (t < S1A) {
        for (let c = 0; c < N; c++) { let a = 0, ws = 0; for (let d = -Rk; d <= Rk; d++) { const q = c + d; if (q < 0 || q >= N) continue; const ww = Rk + 1 - Math.abs(d); a += lam[q] * ww; ws += ww; } sm[c] = a / ws; }
        for (let c = 0; c < N; c++) G.sag[c] = 0.16 * hang * sm[c] * (1 - e1);
      } else G.sag.fill(0);
      G.y0 = y0; G.rowH = rh; G.clip = [0, Math.max(0, rodY - 0.6 * rh), 960, 540];

      /* ── title cloth: undyed yarn, the words knitted in in ecru (colourwork) ── */
      const tl = ctx.title, TG = ctx.tg, TW = Math.max(tl.l1.w, tl.l2.w) + 10, TR = 2 + tl.l2.h + 3 + tl.l1.h + 2;
      const gone = U.clamp((t - 2.95) / 0.65);
      if (t < 3.7) {
        const pitch = 880 / TW, tf = U.clamp((t - 0.2) / 2.3) * TR, fr = Math.min(TR, Math.floor(tf)), ph = fr >= TR ? 1 : U.ease.settle(tf - fr), rws = Math.min(TR, fr + 1);
        const yN = 150 + 640 * gone * gone;
        TG.cols = TW; TG.rows = rws; TG.rowH = HU() * pitch; TG.y0 = yN + (ph - 1) * HU() * pitch; TG.idBase = rws - 1; TG.clip = [0, yN - 2, 960, 540];
        const ox2 = Math.floor((TW - 10 - tl.l2.w) / 2), ox1 = Math.floor((TW - 10 - tl.l1.w) / 2);
        for (let c = 0; c < TW; c++) {
          TG.colX[c] = 40 + c * pitch; TG.colW[c] = pitch; TG.colA[c] = 1; TG.sag[c] = 0;
          for (let m = 0; m < rws; m++) {
            const rb = rws - 1 - m, cx2 = c - 5; let bit = 0;
            const y2 = rb - 2, y1 = rb - (2 + tl.l2.h + 3);
            if (y2 >= 0 && y2 < tl.l2.h && cx2 - ox2 >= 0 && cx2 - ox2 < tl.l2.w) bit = tl.l2.bits[(tl.l2.h - 1 - y2) * tl.l2.w + cx2 - ox2];
            if (y1 >= 0 && y1 < tl.l1.h && cx2 - ox1 >= 0 && cx2 - ox1 < tl.l1.w) bit = tl.l1.bits[(tl.l1.h - 1 - y1) * tl.l1.w + cx2 - ox1];
            TG.kind[c * rws + m] = KD.KNIT; TG.col[c * rws + m] = bit ? 3 : 0;
          }
        }
        KIT.paint(R, TG);
      }
      if (t >= T_CAST - 0.05) KIT.paint(R, G);
      KIT.finish(R, p, { blur: 3, dx: 2, dy: 3.5, shadow: 0.3 });

      /* ── rods and the travelling needle (slate) ── */
      const slate = { hi: '#E3ECF3', mid: '#7F98AF', lo: '#2F4458' };
      if (t < 3.7) KIT.needle(p, 30, 930, 150 + 640 * gone * gone, 9, slate);
      if (t >= T_CAST - 0.3) {
        const th = Math.max(2.4, 0.22 * rh), rod = { hi: '#B9C7D4', mid: '#4E6880', lo: '#1F2D3A' };
        KIT.needle(p, Math.max(-20, gx(-0.8)), Math.min(980, Math.max(gx(N + 0.8), 925)), rodY, Math.max(3.5, 0.34 * rh), rod);
        if (t < NEEDLE_OUT + 0.4 && t >= TROW(0)) {
          const out = U.clamp((t - NEEDLE_OUT) / 0.4);
          const rNew = frontRow >= 0 ? frontRow : rowsDone - 1;
          const yRow = r => y0 + (r + 2) * rh - 0.22 * rh;
          const xf = frontRow >= 0 ? gx(front) : null;
          dc.save(); dc.globalAlpha = 1 - out;
          const L = Math.max(-20, gx(-0.8)), Rr = Math.min(980, gx(N + 0.8));
          if (xf !== null) {
            KIT.needle(p, L, Math.max(L + 2, xf + 0.3 * cw), yRow(rNew), th, slate);
            if (rNew > 0) KIT.needle(p, Math.min(Rr - 2, xf - 0.3 * cw), Rr, yRow(rNew - 1), th, slate);
            // the working yarn (copper: what flows in) comes in at the meeting point
            const yy = yRow(rNew); const cop = { lo: '#6E4410', mid: '#A8702A', hi: '#E6B77A' };
            KIT.strand(p, [[xf, yy], [xf + 40, yy + 30], [xf + 150, 560]], Math.max(1.6, 0.16 * cw), cop);
          } else KIT.needle(p, L, Rr, yRow(Math.max(0, rNew)), th, slate);
          dc.restore();
        }
      }

      /* ── the check's cost: one sage basting pass along every row of every run ── */
      if (act2) {
        for (let j = 0; j < K; j++) {
          const u = U.clamp((t - TB(j)) / 0.18); if (u <= 0) continue;
          const y = y0 + (j + 1.5) * rh, x1 = SX + (Math.max(rowMax[j + 1], SX + 8) - SX) * u;
          dc.save(); dc.globalAlpha = 0.8; dc.strokeStyle = COL.sage; dc.lineWidth = 1.5; dc.setLineDash([4, 6]); dc.beginPath(); dc.moveTo(SX - 6, y); dc.lineTo(x1, y); dc.stroke();
          dc.restore();
        }
      }

      /* ── truth under the evidence: copper threads pinned along the exact survival curves ── */
      const thread = (w, a) => {
        const pts = []; for (let j = 0; j <= K; j++) pts.push([SX + CWF * A.expected[w][j], y0 + (j + 1.5) * rh]);
        const n = Math.max(2, Math.round(pts.length * a)); const cop = { lo: '#6E4410', mid: '#B07A30', hi: '#F0C98E' };
        KIT.strand(p, pts.slice(0, n), 3.2, cop);
        if (a >= 1) for (const j of [0, 10, 20]) { dc.save(); dc.fillStyle = '#2F4458'; dc.beginPath(); dc.arc(pts[j][0], pts[j][1], 3.2, 0, 7); dc.fill(); dc.fillStyle = '#E3ECF3'; dc.beginPath(); dc.arc(pts[j][0] - 1, pts[j][1] - 1, 1.1, 0, 7); dc.fill(); dc.restore(); }
        return pts;
      };
      // ghost of the first hem while the second hangs (persistent trace)
      if (t >= S2A) {
        dc.save(); dc.globalAlpha = 0.9 * U.clamp((t - S2A) / 0.6); dc.strokeStyle = T.peach; dc.lineWidth = 2.2; dc.setLineDash([4, 3]); dc.beginPath();
        for (let j = 0; j <= K; j++) { const x = SX + CWF * A.survivors.off[j], ya = y0 + (j + 1) * rh, yb = y0 + (j + 2) * rh; if (j === 0) dc.moveTo(x, ya); else dc.lineTo(x, ya); dc.lineTo(x, yb); }
        dc.stroke(); dc.restore();
      }
      let th1 = null, th2 = null;
      if (t >= S1B) { dc.save(); dc.globalAlpha = 1 - 0.55 * U.clamp((t - S2A) / 0.8); th1 = thread('off', U.clamp((t - S1B) / 0.7)); dc.restore(); }
      if (t >= S2B) th2 = thread('on', U.clamp((t - S2B) / 0.7));

      /* ── the linen tester (a weaver's thread-counting loupe) keeps true stitches in view ── */
      if (t >= PULL1 - 0.4) {
        const la = U.clamp((t - (PULL1 - 0.4)) / 0.4);
        const tx = G.colX[TRACK] + 0.5 * cw, lx = U.clamp(t < S1A ? gx(CM + 0.5) : tx, 120, 838), tr = 3.0;
        const ly = y0 + (tr + 0.5) * rh + 6;
        const V = ctx.V, M = LENS.mag / Math.max(1e-3, cw), RL = ctx.RL;
        const refX = t < S1A ? gx(CM + 0.5) : tx;
        V.rows = RR; V.kind = G.kind; V.col = G.col; V.rowH = M * cw * KIT.HU; V.y0 = LENS.h / 2 - (tr + 0.5) * V.rowH; V.clip = [0, 0, LENS.w, LENS.h];
        for (let c = 0; c < N; c++) { V.colX[c] = LENS.w / 2 + (G.colX[c] + 0.5 * cw - refX) * M - LENS.mag / 2 + (lx - refX) * 0; V.colW[c] = LENS.mag; }
        KIT.felt(RL, U, KIT.srgb(COL.felt), 17); KIT.clear(RL); KIT.paint(RL, V);
        const bx = lx - LENS.w / 2, by = ly - LENS.h / 2;
        dc.save(); dc.globalAlpha = la;
        dc.fillStyle = 'rgba(40,30,20,0.25)'; dc.fillRect(bx + 5, by + 7, LENS.w, LENS.h);
        KIT.finish(RL, p, { x: bx, y: by, blur: 2.5, dx: 2, dy: 3, shadow: 0.35 });
        // the hook, inside the lens, while it latches the tracked run
        const lt = TB(fo[TRACK]) + 0.12, hu = (t - (lt - 0.35)) / 0.9;
        if (hu > 0 && hu < 1) {
          dc.beginPath(); dc.rect(bx, by, LENS.w, LENS.h); dc.clip();
          const cxl = bx + LENS.w / 2, cyl = by + V.y0 + (fo[TRACK] + 1 + 0.45) * V.rowH;
          const inn = U.smoothstep(0, 0.35, hu), out = U.smoothstep(0.65, 1, hu), pull = U.smoothstep(0.3, 0.55, hu) * (1 - out);
          const d = (1 - inn + out * 1.5);
          KIT.hook(p, cxl + d * 2.4 * LENS.mag, cyl + d * 2.6 * LENS.mag + pull * 0.25 * LENS.mag, Math.atan2(2.6, 2.4), 5 * LENS.mag, 0.4 * LENS.mag, { hi: '#E4F0DA', mid: '#7FA86F', lo: '#35512C' });
        }
        dc.restore();
        // the tester's frame: slate metal, a counting scale along the top edge
        dc.save(); dc.globalAlpha = la; dc.strokeStyle = '#2F4458'; dc.lineWidth = 6; dc.strokeRect(bx - 3, by - 3, LENS.w + 6, LENS.h + 6);
        dc.strokeStyle = '#9FB3C6'; dc.lineWidth = 1.2; dc.strokeRect(bx - 5.5, by - 5.5, LENS.w + 11, LENS.h + 11);
        dc.fillStyle = '#E3ECF3'; for (let i = 0; i <= 10; i++) dc.fillRect(bx + i * LENS.w / 10 - 0.6, by - 6, 1.2, i % 5 ? 3 : 5);
        // where the lens looks: a small slate bracket on the swatch
        dc.restore();
      }

      /* ── tags: cards hanging on threads from the rod (all numbers read from the marks) ── */
      const tag = (x, yTop, lines, col, a, align = 'center') => {
        if (a <= 0) return;
        dc.save(); dc.globalAlpha = a; dc.font = '500 15px Jost';
        const w = Math.max(...lines.map((l, i) => (dc.font = (i ? '400 14px Jost' : '500 16px Jost'), dc.measureText(l).width))) + 20, h = 12 + lines.length * 19;
        const x0 = align === 'left' ? x - 10 : align === 'right' ? x - w + 10 : x - w / 2;
        dc.strokeStyle = 'rgba(60,50,40,0.7)'; dc.lineWidth = 1; dc.beginPath(); dc.moveTo(x, rodY - 2); dc.lineTo(x, yTop + h); dc.stroke();
        dc.fillStyle = 'rgba(60,45,30,0.22)'; dc.fillRect(x0 + 3, yTop + 4, w, h);
        dc.fillStyle = COL.card; dc.fillRect(x0, yTop, w, h);
        dc.fillStyle = col; dc.fillRect(x0, yTop, 4, h);
        lines.forEach((l, i) => { dc.font = i ? '400 14px Jost' : '500 16px Jost'; dc.fillStyle = i ? T.dim : T.ink; dc.textBaseline = 'top'; dc.fillText(l, x0 + 11, yTop + 7 + i * 19); });
        dc.restore();
      };
      const fmt = v => Math.round(v).toLocaleString('en-US');
      const C = ctx.commit, cd = C.countdown(t);
      // the marker clip (your prediction) on the rod
      if (t >= HOLD - 0.3) {
        const a = U.clamp((t - (HOLD - 0.3)) / 0.3), xm = SX + C.value * CWF;
        dc.save(); dc.globalAlpha = a; dc.fillStyle = T.ink; dc.beginPath(); dc.moveTo(xm - 5, rodY - 9); dc.lineTo(xm + 5, rodY - 9); dc.lineTo(xm + 3, rodY + 10); dc.lineTo(xm, rodY + 14); dc.lineTo(xm - 3, rodY + 10); dc.closePath(); dc.fill(); dc.restore();
        const lab = (C.auto ? 'a common guess: ' : 'your marker: ') + fmt(C.value);
        tag(xm, 8, cd !== null ? [lab, (C.auto || C.committed) ? 'knitting resumes in ' + Math.ceil(cd) : 'commit in the panel'] : [lab, C.auto ? 'sketch' : 'your guess'], T.ink, a, xm > 700 ? 'right' : 'center');
      }
      // the prediction question, in the corner of the board (not a modal)
      if (cd !== null || (t >= HOLD - 0.4 && t < JUMP + 0.6)) {
        const a = U.clamp((t - (HOLD - 0.4)) / 0.4) * (1 - U.clamp((t - JUMP) / 0.6));
        dc.save(); dc.globalAlpha = a; dc.fillStyle = T.ink; dc.font = '500 20px Jost'; dc.textBaseline = 'alphabetic';
        dc.fillText('20 rows, each step right 95 % of the time.', SX, 452); dc.font = '400 18px Jost';
        dc.fillText('Clip the marker where the whole runs will end, of 2,000.', SX, 478); dc.restore();
      }
      // selvage counter while knitting (right end of the rod)
      if (t >= PULL1 && t < S1A) tag(SX, 64, [fmt(whole) + ' whole so far', 'row ' + rowsDone + ' of 20'], T.ink, U.clamp((t - PULL1) / 0.4), 'left');
      // hang 1 and 2: counts at the whole-block edge, expectation on the copper thread
      if (t >= S1B) {
        const a1 = U.clamp((t - S1B - 0.3) / 0.4) * (t < S2A ? 1 : 1);
        const xe1 = SX + CWF * A.survivors.off[K];
        tag(xe1, 64, [fmt(A.survivors.off[K]) + ' whole, no checks', 'of 2,000 runs'], T.peach, a1, 'right');
        if (th1) { const q = th1[K]; dc.save(); dc.globalAlpha = U.clamp((t - S1B - 0.5) / 0.4); dc.font = '400 15px Jost'; dc.fillStyle = T.copper; dc.textBaseline = 'top'; dc.fillText('expected ' + fmt(A.expected.off[K]) + ' ± ' + Math.round(A.sd.off[K]), q[0] - 60, q[1] + 22); dc.restore(); }
      }
      if (act2 && t < S2A + 0.2) {
        const a = U.clamp((t - ACT2 - 0.2) / 0.4) * (1 - U.clamp((t - S2A) / 0.2));
        dc.save(); dc.globalAlpha = a; dc.font = '500 16px Jost'; dc.fillStyle = T.sage; dc.textBaseline = 'top';
        dc.fillText('the check: a hook passes along every row of every run', 470, 452); dc.font = '400 15px Jost'; dc.fillStyle = T.dim;
        dc.fillText('slip or no slip: 20 more passes, and time is the cost (sketch)', 470, 474); dc.restore();
      }
      if (t >= S2B) {
        const a2 = U.clamp((t - S2B - 0.2) / 0.4);
        const xe2 = SX + CWF * A.survivors.on[K];
        tag(xe2, 64, [fmt(A.survivors.on[K]) + ' whole, with the hook', A.saved.length.toLocaleString('en-US') + ' of them saved (sage)'], T.sage, a2, 'right');
        if (th2) { const q = th2[K]; dc.save(); dc.globalAlpha = U.clamp((t - S2B - 0.5) / 0.4); dc.font = '400 15px Jost'; dc.fillStyle = T.copper; dc.textBaseline = 'top'; dc.fillText('expected ' + fmt(A.expected.on[K]) + ' ± ' + Math.round(A.sd.on[K]), q[0] - 40, q[1] + 22); dc.restore(); }
      }

      /* ── macro labels (mark rule), on the felt under the cloth ── */
      if (t >= 4.0 && t < PULL0 + 0.3) {
        const a = U.clamp((t - 4.0) / 0.4) * (1 - U.clamp((t - PULL0) / 0.3)), yb = y0 + 6.4 * rh;
        dc.save(); dc.globalAlpha = a; dc.fillStyle = T.ink; dc.font = '500 19px Jost'; dc.textBaseline = 'alphabetic';
        const xc = gx(C0 + 2.5);
        dc.fillRect(xc - 1, y0 + 0.4 * rh, 2, yb - 26 - y0 - 0.4 * rh);
        dc.fillText('↑ one column = one run of the agent', xc - 8, yb);
        dc.font = '400 17px Jost'; dc.fillStyle = T.dim; dc.fillText('one row = one step: plan, call a tool, read, check', xc - 8, yb + 26);
        dc.restore();
      }
    },

    score(ctx) {
      const A = ctx.engine, ev = [];
      for (let r = 0; r < 24; r++) ev.push({ t: 0.25 + r * 0.095, kind: 'tick', gain: 0.22, freq: 2300 + 50 * (r % 3) });
      ev.push({ t: 2.6, kind: 'tone', freq: 392, dur: 0.9, gain: 0.4 });
      ev.push({ t: T_CAST, kind: 'click', gain: 0.5, freq: 1500 });
      for (let j = 0; j < K; j++) {
        const t = TROW(j);
        if (j < 3) for (let q = 0; q < 6; q++) ev.push({ t: t + q * 0.12, kind: 'tick', gain: 0.4, freq: 2000 + 80 * q });
        else ev.push({ t, kind: 'tick', gain: 0.55, freq: 2100 });
        const fo = A.failedAt('off', j);
        if (fo) ev.push({ t: t + (j < 3 ? 0.4 : 0.15), kind: 'clack', gain: Math.min(1.2, 0.35 + fo / 25), pan: -0.2, freq: 150 });
      }
      ev.push({ t: HOLD, kind: 'click', gain: 0.7, freq: 1200 });
      for (let i = 0; i < 3; i++) ev.push({ t: HOLD + i, kind: 'tone', freq: 660, dur: 0.14, gain: 0.35 });
      ev.push({ t: S1A, kind: 'tone', freq: 294, dur: 1.4, gain: 0.35 });
      ev.push({ t: S1B, kind: 'tone', freq: 440, dur: 0.9, gain: 0.45 });
      for (let j = 0; j < K; j++) {
        ev.push({ t: TB(j), kind: 'tick', gain: 0.3, freq: 2600, pan: 0.2 });
        let n = 0; for (let r = 0; r < A.N; r++) if (A.failStep.off[r] === j && (A.failStep.on[r] < 0 || A.failStep.on[r] > j)) n++;
        if (n) ev.push({ t: TB(j) + 0.12, kind: 'click', gain: Math.min(1, 0.3 + n / 40), pan: 0.25, freq: 1900 });
      }
      ev.push({ t: S2A, kind: 'tone', freq: 330, dur: 1.4, gain: 0.35 });
      ev.push({ t: S2B, kind: 'tone', freq: 523, dur: 1.6, gain: 0.5 });
      return ev;
    },

    meta(ctx) {
      const A = ctx.engine;
      return [
        { label: 'Whole runs · no checks', value: A.survivors.off[K], check: { world: 'off', k: K, p: 0.95, c: 0.8, N } },
        { label: 'Whole runs · hook on every row', value: A.survivors.on[K], check: { world: 'on', k: K, p: 0.95, c: 0.8, N } },
        { label: 'P(whole run) · no checks', value: A.exact.off[K], check: { world: 'off', k: K, p: 0.95, c: 0.8 } },
        { label: 'P(whole run) · with checks', value: A.exact.on[K], check: { world: 'on', k: K, p: 0.95, c: 0.8 } },
        { label: 'Runs saved by the hook', value: A.saved.length },
        { label: 'Seed (not chosen)', value: ctx.seed },
      ];
    },
  });
  function HU() { return window.RunKit.HU; }
})();
