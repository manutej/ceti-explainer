/* ════════════════════════════════════════════════════════════════════
   layer: yard — load on the rails, the throat, then the vocabulary sweep
   means:  M3b "each mark is one thousandth of the model's probability mass" (1,000 marks)
           M3d "each mark is one token of the 128,256-token vocabulary" (one baked hairline stub per token)
   z:      6 (under the SVG rails, blades, token labels, p / p′ numbers, counter)
   scenes: M3 (TS.SC.s3): fill TS.T.m3.queue · close · reseat (the throat) · take (chosen by state.u) · ghost
           · fold · comb · sweep · step2
   cost:   see report (≤1,000 arc-length lookups + ≤12 fills; comb = 3 drawImage + 5 rings)
   --------------------------------------------------------------------
   Track i (shared with the SVG lane): cubic J → (J.x+64, J.y) → (J.x+86, ys[i]) → (xBend, ys[i]), then
   straight to fan.x1. Every mark moves ALONG these curves (arc-length tables built in setup).
   Ribbon: track i's load sits ON its rails between queue.x0 and x1: 6 rows at 3.6 pitch centred on ys[i],
   columns at (x1 − x0)/113 (113 columns hold the largest queue, USD 677), mark 2.6. Length = count.
   Fill (36.0–37.6): each mark rolls out of J along its track to its slot, deepest first, single file.
   Throat (39.9–41.3): each closed mark rides its own track back to J, passes the throat single file and
   climbs its open track to its slot (closed-form path = reverse(track c) ⧺ track o, ease in-out).
   Comb: 128,256 stubs in 126 blocks of 1,024 (32 × 32 at 1-unit pitch, 2-unit gutters, 24 blocks a row;
   the last block holds the 256-token tail), baked once. Powers of ten: at the end of the fold the comb
   opens on a close-up of the junction's 8 candidates (vector rail-stubs, 24×), then zooms out
   exponentially (glaser, fold end → TS.T.m3.lit) about their centroid to the whole field (baked bitmap,
   nearest-neighbour while magnified, cross-faded with the vector stubs). The 4 open stubs keep a fixed
   on-screen size with small rings (staggered 0.1 s from lit). The sweep brightens the field just behind
   the SVG line over TS.T.m3.sweep. At TS.T.m3.step2 the open set is the closing quote's stub alone.
   window.__COMB_LIT = { candidates, step1, step2, focus } in viewBox units (at 1×).
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const SN = (v) => Math.round(v * 2) / 2;   // snap to the film's device pixels (2 px / unit): AA-free, so the raster can't vary with GPU cache state
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const parse = (css) => css.match(/[\d.]+/g).map(Number);
  const mix = (a, b, f, al) => `rgba(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)},${Math.max(0, al).toFixed(4)})`;
  const ROWS = 6, NCOL = 113, M = 512;
  let C, TR, cache = {}, comb;

  /* ---- track tables: TR[i] = { len, curve (arc length of the bend), xy: Float32Array(M+1)*2 } ---- */
  function buildTracks() {
    const G = TS.G, J = G.J, F = G.fan;
    return F.ys.map(y => {
      const P = [[J.x, J.y], [J.x + 64, J.y], [J.x + 86, y], [F.xBend, y]];
      const at = (u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
      const pts = []; for (let i = 0; i <= 200; i++) pts.push(at(i / 200));
      const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const curve = L[L.length - 1];
      pts.push([F.x1, y]); L.push(curve + (F.x1 - F.xBend));
      const len = L[L.length - 1], xy = new Float32Array((M + 1) * 2); let j = 0;
      for (let k = 0; k <= M; k++) { const s = len * k / M; while (j < L.length - 2 && L[j + 1] < s) j++; const f = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
        xy[2 * k] = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f; xy[2 * k + 1] = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f; }
      return { len, curve, y, xy };
    });
  }
  function onTrack(i, s, out) {
    const T = TR[i], q = Math.max(0, Math.min(M, s / T.len * M)), k = Math.min(M - 1, q | 0), f = q - k, a = T.xy;
    out[0] = a[2 * k] + (a[2 * k + 2] - a[2 * k]) * f; out[1] = a[2 * k + 1] + (a[2 * k + 3] - a[2 * k + 1]) * f;
  }
  /* slot j on track i → arc position s and lateral (row) offset */
  function slot(i, j) {
    const Q = TS.G.queue, cp = (Q.x1 - Q.x0) / NCOL, c = Math.floor(j / ROWS), r = j % ROWS;
    const x = Q.x0 + cp * (c + 0.5);
    return { s: TR[i].curve + (x - TS.G.fan.xBend), off: (r - (ROWS - 1) / 2) * Q.pitch, x, c };
  }
  /* lateral offset fades in over the last 14 units before the slot (single file in the throat) */
  const latK = (dist) => { const u = Math.max(0, Math.min(1, 1 - dist / 14)); return u * u * (3 - 2 * u); };

  /* ---- plan for a constrain flag (cached) ---- */
  function plan(constrain) {
    const key = constrain ? 'c' : 'f';
    if (cache[key]) return cache[key];
    const R = TS.renorm(constrain), before = TS.counts(R.p), after = constrain ? TS.counts(R.pp) : before.slice();
    const marks = [];  // {i, j, s, off, fill: [t0], mover?: {...}}
    for (let i = 0; i < 8; i++) for (let j = 0; j < before[i]; j++) { const sl = slot(i, j); marks.push({ i, j, s: sl.s, off: sl.off, c: sl.c }); }
    // fill order per track: deepest first; start times interleaved by fraction
    for (let i = 0; i < 8; i++) {
      const own = marks.filter(m => m.i === i).sort((a, b) => b.j - a.j);
      own.forEach((m, k) => { m.f0 = k / Math.max(1, own.length); });
    }
    // the throat: closed marks (sorted nearest-J first) ↔ new open slots (shallowest first, merged by fraction)
    const movers = [];
    if (constrain) {
      const src = marks.filter(m => !R.allow[m.i]).sort((a, b) => a.s - b.s || a.off - b.off);
      const dst = [];
      for (let i = 0; i < 8; i++) if (R.allow[i]) { const g = after[i] - before[i]; for (let n = 0; n < g; n++) { const sl = slot(i, before[i] + n); dst.push({ i, f: (n + 0.5) / g, s: sl.s, off: sl.off }); } }
      dst.sort((a, b) => a.f - b.f || a.i - b.i);
      src.forEach((m, k) => { m.mv = { k: k / Math.max(1, src.length - 1), to: dst[k] }; movers.push(m); });
    }
    return (cache[key] = { R, before, after, marks, movers });
  }

  /* ---- the comb: 126 blocks of 1,024 stubs (32 × 32 at 1-unit pitch), 2-unit gutters, 24 blocks a row ---- */
  const BS = 32, PER = BS * BS, BX = 24, GUT = 2, BPITCH = BS + GUT;   // field units (baked at 2 px / unit)
  function stubXY(id, out) {   // field position (viewBox units) of token id's stub centre
    const b = Math.floor(id / PER), k = id % PER;
    out[0] = comb.ox + (b % BX) * BPITCH + (k % BS) + 0.25; out[1] = comb.oy + Math.floor(b / BX) * BPITCH + Math.floor(k / BS) + 0.25;
  }
  function bakeComb(L) {
    const G = TS.G, CB = G.comb, W = Math.round((CB.x1 - CB.x0) * 2), H = Math.round((CB.y1 - CB.y0) * 2);
    const nb = Math.ceil(TS.VOCAB / PER), rowsB = Math.ceil(nb / BX);
    const fw = BX * BPITCH - GUT, fh = rowsB * BPITCH - GUT;
    const o = { W, H, nb, ox: CB.x0 + Math.round((CB.x1 - CB.x0 - fw) / 2), oy: CB.y0 + Math.round((CB.y1 - CB.y0 - fh) / 2) };
    comb = o;
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d'); g.fillStyle = L.rgba(L.pal.ink, 1);
    const p = [0, 0];
    for (let id = 0; id < TS.VOCAB; id++) { stubXY(id, p); g.fillRect(Math.round((p[0] - 0.25 - CB.x0) * 2), Math.round((p[1] - 0.25 - CB.y0) * 2), 1, 1); }
    o.cv = cv;
    // the 8 candidates of the junction, seated close together in one block near the centre (illustrative ids)
    const fb = 2 * BX + 11, seats = [[9, 14], [13, 12], [17, 15], [21, 13], [11, 18], [15, 19], [20, 18], [24, 16]];
    o.cand = seats.map(([cx, cy], i) => { const id = fb * PER + cy * BS + cx; stubXY(id, p); return { i, id, x: p[0], y: p[1], tok: TS.CANDS[i].tok }; });
    o.F = { x: o.cand.reduce((a, q) => a + q.x, 0) / 8, y: o.cand.reduce((a, q) => a + q.y, 0) / 8 };
    const allow = TS.renorm(true).allow;
    o.s1 = o.cand.filter((q, i) => allow[i]);
    o.s2 = o.cand.filter(q => q.tok === '"');           // after "USD": the closing quote is the whole open set
    const pub = (q) => ({ id: q.id, tok: q.tok, x: +q.x.toFixed(2), y: +q.y.toFixed(2) });
    window.__COMB_LIT = { candidates: o.cand.map(pub), step1: o.s1.map(pub), step2: o.s2.map(pub), focus: { x: +o.F.x.toFixed(2), y: +o.F.y.toFixed(2) } };
    return o;
  }

  P5Film.layer('yard', {
    z: 6,
    setup(p, L) {
      C = { ink: parse(L.rgba(L.pal.ink, 1)), dim: parse(L.rgba(L.pal.dim, 1)), acc: parse(L.rgba(L.pal.accent, 1)) };
      TR = buildTracks(); plan(true); plan(false);
      comb = bakeComb(L);
    },

    draw(p, t, L, ctx) {
      const T = TS.T.m3, SC = TS.SC.s3, G = TS.G, ex = ctx.ex, E = ex.ease, c = L.ctx;
      touch(c);
      if (t < T.queue[0] - 0.05 || t > SC[1] + 0.05) return;
      const st = ctx.state || TS.STATE, constrain = st.constrain !== false, rm = ctx.rm;
      const P = plan(constrain), R = P.R, u = st.u != null ? st.u : TS.U;
      const chosen = TS.sample(R.pp, u);
      const scene = ex.fade(t, SC);
      const tmp = [0, 0];

      /* ---------------- M3b: ribbons, the throat ---------------- */
      const fold = E.collect(ex.prog(t, T.fold[0], T.fold[1]));
      const qA = scene * (1 - fold);
      if (qA > 0.002) {
        c.save();
        if (fold > 0) { c.translate(0, G.J.y * fold * 0.5); c.scale(1, 1 - 0.5 * fold); }
        const ghostOn = constrain ? ex.seg(t, T.ghost[0], T.ghost[1], 0.5) : 0, usI = TS.CANDS.findIndex(k => k.tok === 'US');
        const takeK = rm ? (t >= T.take[1] ? 1 : 0) : E.glaser(ex.prog(t, T.take[0], T.take[1]));
        const openK = constrain ? (rm ? (t >= T.close ? 1 : 0) : E.rest(ex.prog(t, T.close, T.close + T.closeDur))) : 0;
        let ci = 0; const closeK = [];
        for (let i = 0; i < 8; i++) if (!R.allow[i]) { const a = T.close + (ci++) * T.closeStagger; closeK[i] = rm ? (t >= a ? 1 : 0) : E.rest(ex.prog(t, a, a + T.closeDur)); }
        const colOf = (i) => {
          const g = 1 - 0.65 * ghostOn * (i === usI ? 0 : 1);
          if (R.allow[i]) {
            const isC = i === chosen, f = constrain ? openK : (isC ? takeK : 0);
            const a = 0.66 + 0.24 * f - (isC ? 0 : (constrain ? 0.36 : 0.2) * takeK);
            return mix(C.ink, C.acc, f, a * qA * g);
          }
          const f = closeK[i] || 0; return mix(C.ink, C.dim, f, (0.66 - 0.4 * f) * qA * g);
        };
        const fillSpan = T.queue[1] - T.queue[0], MW = 2.5, MH = 2;          // a mark is a short car along the rails
        const v0 = 520;                                 // fill speed (units/s): deepest slot (~650) arrives by queue[1]
        const buckets = []; for (let i = 0; i < 8; i++) buckets.push([]);
        const flightA = [], flightB = [];               // throat: on the closed track (A) / on the open track (B)
        for (const m of P.marks) {
          // fill: roll out of J along the track, deepest first
          let s, off, i = m.i, onB = false, inFlight = false;
          const t0 = T.queue[0] + m.f0 * (fillSpan - m.s / v0);
          if (rm) { if (t < T.queue[1]) continue; s = m.s; off = m.off; }
          else {
            const d = (t - t0) * v0; if (d <= 0) continue;
            s = Math.min(m.s, d); off = m.off * latK(m.s - s);
          }
          if (m.mv) {
            const mv = m.mv, a = T.reseat[0] - 0.05 + 0.45 * mv.k, D = T.reseat[1] - T.reseat[0] - 0.4;
            const q = rm ? (t >= T.reseat[1] ? 1 : 0) : ex.prog(t, a, a + D);
            if (q > 0) {
              const tot = m.s + mv.to.s, d = tot * ex.eio(q);
              if (d < m.s) { s = m.s - d; off = m.off * latK(d); }
              else { i = mv.to.i; s = d - m.s; off = mv.to.off * latK(mv.to.s - s); onB = true; }
              inFlight = q < 1;
            }
          }
          onTrack(i, s, tmp);
          if (inFlight) (onB ? flightB : flightA).push(tmp[0], tmp[1] + off);
          else buckets[i].push(tmp[0], tmp[1] + off);
        }
        const fill = (arr, style) => { if (!arr.length) return; c.beginPath(); for (let n = 0; n < arr.length; n += 2) c.rect(SN(arr[n] - MW / 2), SN(arr[n + 1] - MH / 2), MW, MH); c.fillStyle = style; c.fill(); };
        for (let i = 0; i < 8; i++) fill(buckets[i], colOf(i));
        fill(flightA, mix(C.ink, C.dim, 0.5, 0.62 * qA));
        fill(flightB, mix(C.ink, C.acc, 0.75, 0.85 * qA));
        c.restore();
      }

      /* ---------------- M3d: the comb — powers-of-ten zoom-out, then the sweep ---------------- */
      if (t >= T.comb[0] && comb) {
        const CB = G.comb, F = comb.F, S0 = 24, z0 = T.fold[1], z1 = T.lit;
        const zp = rm ? (t >= z1 ? 1 : 0) : E.glaser(ex.prog(t, z0, z1));
        const s = Math.exp(Math.log(S0) * (1 - zp));                    // exponential: 24× → 1×
        const inA = rm ? 1 : E.defer(ex.prog(t, T.comb[0], z0 + 0.1)), A = scene * inA;
        const scr = (x, y, o) => { o[0] = F.x + (x - F.x) * s; o[1] = F.y + (y - F.y) * s; };
        const sw = rm ? (t >= T.sweep[1] ? 1 : 0) : E.defer(ex.prog(t, T.sweep[0], T.sweep[1]));
        const s2k = !constrain ? 0 : rm ? (t >= T.step2 ? 1 : 0) : E.rest(ex.prog(t, T.step2, T.step2 + 0.35));
        c.save();
        c.beginPath(); c.rect(CB.x0, CB.y0, CB.x1 - CB.x0, CB.y1 - CB.y0); c.clip();
        // 1) the baked field under the zoom transform (nearest-neighbour while magnified)
        const bmA = 1 - ex.clamp((s - 6) / 6);
        if (bmA > 0) {
          c.save(); c.translate(F.x, F.y); c.scale(s, s); c.translate(-F.x, -F.y);
          c.imageSmoothingEnabled = s < 1.5;
          c.globalAlpha = 0.26 * A * bmA; c.drawImage(comb.cv, CB.x0, CB.y0, comb.W / 2, comb.H / 2);
          if (sw > 0) {
            const sx = Math.round(comb.W * sw), xs = CB.x0 + sx / 2;
            c.globalAlpha = 0.2 * A * bmA; c.drawImage(comb.cv, 0, 0, Math.max(1, sx), comb.H, CB.x0, CB.y0, Math.max(1, sx) / 2, comb.H / 2);
            if (sw < 1) {
              const b1 = Math.min(sx, 80), b2 = Math.min(sx, 24);
              c.globalAlpha = 0.35 * A * bmA; c.drawImage(comb.cv, sx - b1, 0, Math.max(1, b1), comb.H, xs - b1 / 2, CB.y0, Math.max(1, b1) / 2, comb.H / 2);
              c.globalAlpha = 0.6 * A * bmA; c.drawImage(comb.cv, sx - b2, 0, Math.max(1, b2), comb.H, xs - b2 / 2, CB.y0, Math.max(1, b2) / 2, comb.H / 2);
            }
          }
          c.restore(); c.globalAlpha = 1;
        }
        // 2) the vector close-up: each stub a short rail-stub, drawn from the table while magnified
        const vA = ex.clamp((s - 5) / 5);
        if (vA > 0) {
          const x0 = F.x - (F.x - CB.x0) / s, x1 = F.x + (CB.x1 - F.x) / s, y0 = F.y - (F.y - CB.y0) / s, y1 = F.y + (CB.y1 - F.y) / s;
          const w = Math.max(0.5, 0.16 * s), h = 0.62 * s, o = [0, 0], cands = new Set(comb.cand.map(q => q.id));
          c.beginPath();
          const bc0 = Math.max(0, Math.floor((x0 - comb.ox) / BPITCH)), bc1 = Math.min(BX - 1, Math.floor((x1 - comb.ox) / BPITCH));
          const br0 = Math.max(0, Math.floor((y0 - comb.oy) / BPITCH)), br1 = Math.floor((y1 - comb.oy) / BPITCH);
          for (let br = br0; br <= br1; br++) for (let bc = bc0; bc <= bc1; bc++) {
            const b = br * BX + bc; if (b >= comb.nb) continue;
            const bx = comb.ox + bc * BPITCH, by = comb.oy + br * BPITCH;
            const c0 = Math.max(0, Math.floor(x0 - bx) - 1), c1 = Math.min(BS - 1, Math.ceil(x1 - bx)), r0 = Math.max(0, Math.floor(y0 - by) - 1), r1 = Math.min(BS - 1, Math.ceil(y1 - by));
            for (let r = r0; r <= r1; r++) for (let cc = c0; cc <= c1; cc++) {
              const id = b * PER + r * BS + cc; if (id >= TS.VOCAB || cands.has(id)) continue;
              scr(bx + cc + 0.25, by + r + 0.25, o); c.rect(SN(o[0] - w / 2), SN(o[1] - h / 2), Math.max(0.5, SN(w)), SN(h));
            }
          }
          c.fillStyle = mix(C.ink, C.ink, 0, 0.3 * A * vA); c.fill();
          // the 8 candidates: brighter; the masked four dim at the close
          c.beginPath(); comb.cand.forEach(q => { if (!R.allow[q.i] || !constrain) { scr(q.x, q.y, o); c.rect(SN(o[0] - w / 2), SN(o[1] - h / 2), Math.max(0.5, SN(w)), SN(h)); } });
          c.fillStyle = mix(C.ink, C.ink, 0, 0.75 * A * vA); c.fill();
        }
        c.restore();
        // 3) the open stubs at a fixed on-screen size, so they stay findable at 1×
        if (constrain) {
          const o = [0, 0], lit = [], rings = [];
          const sh = (q, a) => { scr(q.x, q.y, o); lit.push(o[0], o[1], a); };
          comb.s1.forEach((q, k) => { sh(q, A * (1 - 0.9 * s2k)); rings.push([F.x, F.y, ex.prog(t, T.lit + 0.1 * k, T.lit + 0.1 * k + 0.6), 1 - s2k]); });
          comb.s2.forEach(q => { const on = rm ? (t >= T.step2 ? 1 : 0) : E.glaser(ex.prog(t, T.step2 + 0.15, T.step2 + 0.3)); if (on > 0) sh(q, A * on); rings.push([o[0], o[1], ex.prog(t, T.step2 + 0.15, T.step2 + 0.75), on]); });
          const ww = Math.max(1.5, Math.min(0.16 * s, 4)), hh = Math.max(7, Math.min(0.62 * s, 15));
          for (let n = 0; n < lit.length; n += 3) { if (lit[n + 2] <= 0.01) continue; c.fillStyle = mix(C.acc, C.acc, 0, lit[n + 2]); c.fillRect(SN(lit[n] - ww / 2), SN(lit[n + 1] - hh / 2), SN(ww), SN(hh)); }
          // rings: one halo around the open set (they sit together at 1×), one burst per ignition, staggered
          c.lineWidth = 0.6;
          const near = ex.clamp((2 - s) / 0.8);
          for (const [x, y, rp, a] of rings) {
            if (a <= 0.01 || near <= 0) continue;
            if (!rm && rp > 0 && rp < 1) { c.beginPath(); c.arc(x, y, 10 + 22 * E.glaser(rp), 0, Math.PI * 2); c.strokeStyle = mix(C.acc, C.acc, 0, (1 - rp) * 0.8 * a * A * near); c.stroke(); }
          }
          const ha = Math.max(1 - s2k, s2k) * near * A;
          const hq = comb.s2[0], hx = s2k > 0.5 ? F.x + (hq.x - F.x) * s : F.x, hy = s2k > 0.5 ? F.y + (hq.y - F.y) * s : F.y;
          if (ha > 0.01) { c.beginPath(); c.arc(hx, hy, s2k > 0.5 ? 7 : 13, 0, Math.PI * 2); c.strokeStyle = mix(C.acc, C.acc, 0, 0.6 * ha); c.stroke(); }
        }
      }
    },
  });
})();
