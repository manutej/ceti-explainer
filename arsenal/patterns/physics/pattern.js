// physics: simulated motion that still scrubs. Fixed step dt=1/120, keyframes every 0.5 s built in setup,
// draw(t) = nearest keyframe + <=60 steps + one interpolation. Atlas: euler-integration, fixed-timestep,
// oscillation, steering-behaviors, real-time-vs-frame-based, nature-of-code, matter-js (the "bake it" advice).
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  const RATE = 120, DT = 1 / RATE, KEY = 60;          // 60 steps = 0.5 s
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;
  const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const font = (tk, role, px) => `${tk.type[role].weight} ${px}px "${tk.type[role].family}", ${role === 'mono' ? 'monospace' : 'sans-serif'}`;

  // ---- the simulator: spec {n, init(S, rng), step(S, i), probe?(S, m)}; S is one flat Float64Array ----
  function makeSim(spec, dur, seed, o) {
    const cap = o.maxSteps, total = Math.ceil(dur * RATE), keys = [];
    const S = new Float64Array(spec.n); spec.init(S, mulberry32(seed)); keys.push(S.slice());
    for (let i = 0; i < total; i++) { spec.step(S, i); if (spec.probe) spec.probe(S, i); if ((i + 1) % KEY === 0) keys.push(S.slice()); }
    return {
      dur, keys: keys.length,
      at(t) {                                          // O(1) seek: copy a keyframe, advance <= KEY steps (cap), one more for the lerp
        const tc = clamp(t, 0, dur), n = Math.floor(tc * RATE + 1e-7), f = clamp(tc * RATE - n, 0, 1);
        const k = Math.min(Math.floor(n / KEY), keys.length - 1), A = keys[k].slice();
        let i = k * KEY; const end = Math.min(n, i + cap); for (; i < end; i++) spec.step(A, i);
        const B = A.slice(); spec.step(B, i);
        return { a: A, b: B, f, steps: end - k * KEY, key: k };
      }
    };
  }

  // ---------------------------------------------------------------- scene: spring-settle of 40 labels
  const WORDS = 'claim count commit scale shape trace stage ratio cache queue index merge split probe route frame batch yield state gauge point layer chunk token slice shard cycle delta epoch trend limit ledger basis phase vault span drift tally brief proof round'.split(' ');
  function sceneSettle(P, W, H, seed, o) {
    const cols = P.cols, rows = P.rows, N = cols * rows, rng = mulberry32(seed ^ 0x51);
    const gx0 = 92, gy0 = 100, px = 82, py = 70, tgt = [], ini = [], om = [], ze = [], dl = [];
    for (let i = 0; i < N; i++) {
      tgt.push([gx0 + (i % cols) * px, gy0 + Math.floor(i / cols) * py]);
      ini.push([40 + rng() * 880, 40 + rng() * 460]);
      om.push(lerp(P.omega[0], P.omega[1], rng())); ze.push(lerp(P.zeta[0], P.zeta[1], rng()));
      dl.push(Math.round((0.15 + (i / N) * 1.6 + rng() * 0.3) * RATE) / RATE);   // release time, on the step grid
    }
    let probeI = 0, big = 0; for (let i = 0; i < N; i++) { const d = Math.abs(ini[i][0] - tgt[i][0]); if (d > big) { big = d; probeI = i; } }
    const cf = (x0, tx, w, z, tau) => { if (tau <= 0) return x0; const wd = w * Math.sqrt(1 - z * z), A = x0 - tx; return tx + Math.exp(-z * w * tau) * (A * Math.cos(wd * tau) + (z * w / wd) * A * Math.sin(wd * tau)); };
    let maxErr = 0; const trace = [], SUB = 8, HH = DT / SUB;
    const spec = {
      n: N * 4,
      init(S) { for (let i = 0; i < N; i++) { S[i * 4] = ini[i][0]; S[i * 4 + 1] = ini[i][1]; } },
      step(S, i) {
        const tt = i * DT;
        for (let k = 0; k < N; k++) {
          if (i < dl[k] * RATE - 0.5) continue;
          const w = om[k], c = 2 * ze[k] * w, b = k * 4;
          for (let s = 0; s < SUB; s++) {                 // 8 semi-implicit Euler substeps per 1/120 s step
            S[b + 2] += (-w * w * (S[b] - tgt[k][0]) - c * S[b + 2]) * HH; S[b] += S[b + 2] * HH;
            S[b + 3] += (-w * w * (S[b + 1] - tgt[k][1]) - c * S[b + 3]) * HH; S[b + 1] += S[b + 3] * HH;
          }
        }
      },
      probe(S, m) {                                   // the claim "closed form == sim", measured on all 40 labels
        const T = (m + 1) * DT;
        for (let k = 0; k < N; k++) {
          const tau = T - dl[k], b = k * 4;
          const ex = Math.abs(S[b] - cf(ini[k][0], tgt[k][0], om[k], ze[k], tau)), ey = Math.abs(S[b + 1] - cf(ini[k][1], tgt[k][1], om[k], ze[k], tau));
          if (ex > maxErr) maxErr = ex; if (ey > maxErr) maxErr = ey;
        }
        if (m % 6 === 5) trace.push([T, S[probeI * 4] - tgt[probeI][0]]);
      }
    };
    const sim = makeSim(spec, P.dur, seed, o);
    const curve = []; for (let s = 0; s <= 240; s++) { const T = (s / 240) * P.dur; curve.push([T, cf(ini[probeI][0], tgt[probeI][0], om[probeI], ze[probeI], T - dl[probeI]) - tgt[probeI][0]]); }
    return {
      sim, maxErr, N, info: { maxErr },
      draw(c, tk, t) {
        const q = sim.at(t), C = tk.color, a = q.a, b = q.b, f = q.f; let settled = 0;
        c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = font(tk, 'mono', 13);
        // target grid, faint
        c.strokeStyle = C.line; c.lineWidth = 1; for (let i = 0; i < N; i++) { c.strokeRect(tgt[i][0] - 35.5, tgt[i][1] - 17.5, 70, 34); }
        for (let i = 0; i < N; i++) {
          const x = lerp(a[i * 4], b[i * 4], f), y = lerp(a[i * 4 + 1], b[i * 4 + 1], f);
          const off = Math.hypot(x - tgt[i][0], y - tgt[i][1]), v = Math.hypot(a[i * 4 + 2], a[i * 4 + 3]);
          const done = off < 0.6 && v < 3 && t >= dl[i]; if (done) settled++;
          const moving = t >= dl[i];
          c.fillStyle = C.panel; c.strokeStyle = done ? C.accent : (moving ? C.ink : C.muted); c.lineWidth = done ? 1.6 : 1;
          c.beginPath(); c.roundRect(x - 35, y - 17, 70, 34, 4); c.fill(); c.stroke();
          c.fillStyle = done ? C.accent : C.ink; c.fillText(WORDS[i % WORDS.length], x, y + 1);
        }
        // inset: closed form vs sim for one label
        const X0 = 712, Y0 = 84, IW = 216, IH = 190, mid = Y0 + IH / 2, ex = (IH / 2 - 12) / big;
        c.fillStyle = C.bg; c.fillRect(X0 - 14, Y0 - 26, IW + 28, IH + 120);
        c.fillStyle = C.panel; c.fillRect(X0, Y0, IW, IH); c.strokeStyle = C.line; c.strokeRect(X0 + .5, Y0 + .5, IW, IH);
        c.beginPath(); c.moveTo(X0, mid); c.lineTo(X0 + IW, mid); c.stroke();
        c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = C.muted; c.font = font(tk, 'mono', 11);
        c.fillText('x(t) - target, label "' + WORDS[probeI % WORDS.length] + '"', X0, Y0 - 10);
        const px_ = (T) => X0 + (T / P.dur) * IW, py_ = (v) => mid - v * ex;
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); curve.forEach(([T, v], s) => s ? c.lineTo(px_(T), py_(v)) : c.moveTo(px_(T), py_(v))); c.stroke();
        c.fillStyle = C.ink; for (const [T, v] of trace) { if (T > t) break; c.beginPath(); c.arc(px_(T), py_(v), 1.5, 0, 6.2832); c.fill(); }
        const cx_ = px_(clamp(t, 0, P.dur)); c.strokeStyle = C.accent2; c.lineWidth = 1; c.beginPath(); c.moveTo(cx_, Y0); c.lineTo(cx_, Y0 + IH); c.stroke();
        c.fillStyle = C.accent; c.fillRect(X0, Y0 + IH + 20, 14, 2); c.fillStyle = C.ink; c.fillText('closed form', X0 + 20, Y0 + IH + 24);
        c.beginPath(); c.arc(X0 + 7, Y0 + IH + 38, 2, 0, 6.2832); c.fill(); c.fillText('fixed-step sim, dt 1/120', X0 + 20, Y0 + IH + 42);
        c.fillStyle = C.muted; c.fillText('max |sim - closed| = ' + maxErr.toFixed(2) + ' px (' + (100 * maxErr / big).toFixed(2) + '% of travel)', X0, Y0 + IH + 62);
        c.fillText('over all ' + N + ' labels, all steps', X0, Y0 + IH + 76);
        // counts first
        c.fillStyle = C.ink; c.font = font(tk, 'disp', 40); c.textAlign = 'left'; c.fillText(String(settled).padStart(2, '0'), 40, 470);
        c.font = font(tk, 'mono', 12); c.fillStyle = C.muted; c.fillText('of ' + N + ' labels settled', 98, 468);
        c.fillText('x(t) = x* + e^(-zeta w t) ( A cos wd t + zeta w / wd A sin wd t )   wd = w sqrt(1 - zeta^2)', 40, 498);
        return q;
      }
    };
  }

  // ---------------------------------------------------------------- scene: the pour
  function scenePour(P, W, H, seed, o) {
    const N = P.n, NC = P.cols, rng = mulberry32(seed ^ 0x9e), BASE = 505, PITCH = 9, MH = 7, MW = 40, CW = 54, CX0 = 480 - (NC * CW) / 2 + CW / 2;
    const cx = (c) => CX0 + c * CW, G = 1400, REST = P.restitution, HX = 480, HY = 96;
    const col = [], jit = [];
    for (let j = 0; j < N; j++) {
      const g = Math.sqrt(-2 * Math.log(rng() + 1e-9)) * Math.cos(6.2832 * rng());
      col.push(clamp(Math.round((NC - 1) / 2 + P.spread * g), 0, NC - 1)); jit.push((rng() - 0.5) * 30);
    }
    const cnt0 = N * 6;
    const spec = {
      n: N * 6 + NC,
      init(S) { for (let j = 0; j < N; j++) { S[j * 6 + 5] = col[j]; } },
      step(S, i) {
        const tt = i * DT;
        for (let j = 0; j < N; j++) {
          const b = j * 6, st = S[b + 3];
          if (st === 0) { if (tt >= j * P.rate) { S[b] = HX + jit[j]; S[b + 1] = HY; S[b + 2] = 0; S[b + 3] = 1; } continue; }
          if (st === 3) continue;
          S[b + 2] += G * DT; S[b + 1] += S[b + 2] * DT;
          if (st === 1) {
            const c = S[b + 5]; S[b] += (cx(c) - S[b]) * Math.min(1, 10 * DT);
            if (S[b + 1] >= BASE - S[cnt0 + c] * PITCH - MH / 2) { S[b + 4] = S[cnt0 + c]; S[cnt0 + c] += 1; S[b] = cx(c); S[b + 3] = 2; S[b + 1] = BASE - S[b + 4] * PITCH - MH / 2; S[b + 2] = -S[b + 2] * REST; }
          } else if (S[b + 2] > 0 && S[b + 1] >= BASE - S[b + 4] * PITCH - MH / 2) {
            S[b + 1] = BASE - S[b + 4] * PITCH - MH / 2; S[b + 2] = -S[b + 2] * REST;
            if (Math.abs(S[b + 2]) < 45) { S[b + 2] = 0; S[b + 3] = 3; }
          }
        }
      }
    };
    const sim = makeSim(spec, P.dur, seed, o);
    return {
      sim, N, info: {},
      draw(c, tk, t) {
        const q = sim.at(t), C = tk.color, a = q.a, b = q.b, f = q.f; let landed = 0;
        for (let k = 0; k < NC; k++) landed += a[cnt0 + k];
        // hopper
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(HX - 70, 40); c.lineTo(HX - 18, HY - 8); c.moveTo(HX + 70, 40); c.lineTo(HX + 18, HY - 8); c.stroke();
        // columns
        c.strokeStyle = C.line; c.lineWidth = 1; for (let k = 0; k <= NC; k++) { const x = CX0 - CW / 2 + k * CW; c.beginPath(); c.moveTo(x + .5, BASE - 330); c.lineTo(x + .5, BASE + 3); c.stroke(); }
        c.strokeStyle = C.ink; c.lineWidth = 1.5; c.beginPath(); c.moveTo(CX0 - CW / 2, BASE + 3.5); c.lineTo(CX0 + NC * CW - CW / 2, BASE + 3.5); c.stroke();
        for (let j = 0; j < N; j++) {
          const bb = j * 6, st = a[bb + 3]; if (st === 0) continue;
          const x = lerp(a[bb], b[bb], f), y = lerp(a[bb + 1], b[bb + 1], f);
          c.fillStyle = st === 3 ? C.ink : (st === 2 ? C.accent2 : C.accent); c.globalAlpha = st === 3 ? 0.88 : 1;
          c.beginPath(); c.roundRect(x - MW / 2, y - MH / 2, MW, MH, 1.5); c.fill(); c.globalAlpha = 1;
        }
        c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.font = font(tk, 'mono', 12); c.fillStyle = C.muted;
        for (let k = 0; k < NC; k++) c.fillText(String(a[cnt0 + k]), cx(k), BASE + 20);
        c.textAlign = 'left'; c.fillStyle = C.ink; c.font = font(tk, 'disp', 76); c.fillText(String(landed), 40, 116);
        c.font = font(tk, 'mono', 12); c.fillStyle = C.muted; c.fillText('of ' + N + ' marks landed', 42, 140);
        c.fillText('count rises on first contact', 42, 160);
        return q;
      }
    };
  }

  // ---------------------------------------------------------------- steering helpers
  function limitV(S, ix, m) { const d = Math.hypot(S[ix], S[ix + 1]); if (d > m) { S[ix] *= m / d; S[ix + 1] *= m / d; } }
  function steer(dx, dy, vx, vy, sp, maxF, out) {       // desired = dir * sp ; steer = desired - v, limited
    const d = Math.hypot(dx, dy) || 1e-9, sx = dx / d * sp - vx, sy = dy / d * sp - vy, m = Math.hypot(sx, sy);
    const k = m > maxF ? maxF / m : 1; out[0] += sx * k; out[1] += sy * k;
  }

  // ---------------------------------------------------------------- scene: flock of 60, seek + arrive
  function sceneFlock(P, W, H, seed, o) {
    const N = P.n, rng = mulberry32(seed ^ 0x77), MS = P.maxSpeed, MF = P.maxForce, R = P.arriveR;
    const way = [[800, 140, 0], [800, 140, 2.2], [770, 410, 4.2], [470, 270, 6]];
    const target = (tt) => { let x = way[0][0], y = way[0][1]; for (let k = 1; k < way.length; k++) { const f = smooth((tt - way[k - 1][2]) / (way[k][2] - way[k - 1][2])); if (tt >= way[k - 1][2]) { x = lerp(way[k - 1][0], way[k][0], f); y = lerp(way[k - 1][1], way[k][1], f); } } return [x, y]; };
    const ax = new Float64Array(N), ay = new Float64Array(N), o2 = [0, 0], s2 = [0, 0];
    const spec = {
      n: N * 4,
      init(S) { for (let i = 0; i < N; i++) { const r = 80 * Math.sqrt(rng()), th = 6.2832 * rng(); S[i * 4] = 150 + r * Math.cos(th); S[i * 4 + 1] = 300 + r * Math.sin(th); const h = 6.2832 * rng(); S[i * 4 + 2] = Math.cos(h) * 40; S[i * 4 + 3] = Math.sin(h) * 40; } },
      step(S, i) {
        const T = target(i * DT);
        for (let a = 0; a < N; a++) {
          const b = a * 4, x = S[b], y = S[b + 1], vx = S[b + 2], vy = S[b + 3];
          let sx = 0, sy = 0, hx = 0, hy = 0, hn = 0, mx = 0, my = 0, mn = 0;
          for (let k = 0; k < N; k++) {
            if (k === a) continue; const kb = k * 4, dx = x - S[kb], dy = y - S[kb + 1], d2 = dx * dx + dy * dy;
            if (d2 < 28 * 28 && d2 > 1e-6) { sx += dx / d2; sy += dy / d2; }
            if (d2 < 70 * 70) { hx += S[kb + 2]; hy += S[kb + 3]; hn++; mx += S[kb]; my += S[kb + 1]; mn++; }
          }
          o2[0] = 0; o2[1] = 0;
          if (sx || sy) { s2[0] = 0; s2[1] = 0; steer(sx, sy, vx, vy, MS, MF, s2); o2[0] += s2[0] * P.wSep; o2[1] += s2[1] * P.wSep; }
          if (hn) { s2[0] = 0; s2[1] = 0; steer(hx, hy, vx, vy, MS, MF, s2); o2[0] += s2[0] * P.wAli; o2[1] += s2[1] * P.wAli; s2[0] = 0; s2[1] = 0; steer(mx / mn - x, my / mn - y, vx, vy, MS, MF, s2); o2[0] += s2[0] * P.wCoh; o2[1] += s2[1] * P.wCoh; }
          const tx = T[0] - x, ty = T[1] - y, td = Math.hypot(tx, ty); s2[0] = 0; s2[1] = 0;
          steer(tx, ty, vx, vy, td < R ? MS * td / R : MS, MF, s2); o2[0] += s2[0] * P.wSeek; o2[1] += s2[1] * P.wSeek;
          ax[a] = o2[0]; ay[a] = o2[1];
        }
        for (let a = 0; a < N; a++) { const b = a * 4; S[b + 2] += ax[a] * DT; S[b + 3] += ay[a] * DT; limitV(S, b + 2, MS); S[b] += S[b + 2] * DT; S[b + 1] += S[b + 3] * DT; }
      }
    };
    const sim = makeSim(spec, P.dur, seed, o);
    return {
      sim, N, info: {},
      draw(c, tk, t) {
        const q = sim.at(t), C = tk.color, a = q.a, b = q.b, f = q.f, T = target(clamp(t, 0, P.dur)); let near = 0;
        c.strokeStyle = C.line; c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.arc(T[0], T[1], R, 0, 6.2832); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent2; c.lineWidth = 1.6; c.beginPath(); c.arc(T[0], T[1], 8, 0, 6.2832); c.moveTo(T[0] - 13, T[1]); c.lineTo(T[0] + 13, T[1]); c.moveTo(T[0], T[1] - 13); c.lineTo(T[0], T[1] + 13); c.stroke();
        for (let i = 0; i < N; i++) {
          const k = i * 4, x = lerp(a[k], b[k], f), y = lerp(a[k + 1], b[k + 1], f), vx = lerp(a[k + 2], b[k + 2], f), vy = lerp(a[k + 3], b[k + 3], f);
          const sp = Math.hypot(vx, vy) || 1e-9, ux = vx / sp, uy = vy / sp, d = Math.hypot(x - T[0], y - T[1]);
          if (d < R) near++;
          c.strokeStyle = C.line; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x, y); c.lineTo(x - vx * 0.16, y - vy * 0.16); c.stroke();
          c.fillStyle = d < R && sp < P.maxSpeed * 0.5 ? C.accent : C.ink;
          c.beginPath(); c.moveTo(x + ux * 8, y + uy * 8); c.lineTo(x - ux * 5 - uy * 4.2, y - uy * 5 + ux * 4.2); c.lineTo(x - ux * 5 + uy * 4.2, y - uy * 5 - ux * 4.2); c.closePath(); c.fill();
        }
        c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = C.ink; c.font = font(tk, 'disp', 48); c.fillText(String(near).padStart(2, '0'), 40, 80);
        c.font = font(tk, 'mono', 12); c.fillStyle = C.muted; c.fillText('of ' + N + ' inside the arrive radius', 98, 78);
        c.fillText('seek + arrive, separation / alignment / cohesion', 40, 500);
        return q;
      }
    };
  }

  // ---------------------------------------------------------------- scene: seek vs arrive, one agent each
  function sceneSteer(P, W, H, seed, o) {
    const MS = P.maxSpeed, MF = P.maxForce, R = P.arriveR, LY = [170, 375];
    const hops = [[780, 0, 0], [260, -45, 3], [620, 40, 5.6]];
    const target = (lane, tt) => { let h = hops[0]; for (const k of hops) if (tt >= k[2]) h = k; return [h[0], LY[lane] + h[1]]; };
    const s2 = [0, 0];
    const spec = {
      n: 8,
      init(S) { S[0] = 420; S[1] = LY[0] + 30; S[4] = 420; S[5] = LY[1] + 30; },
      step(S, i) {
        for (let L = 0; L < 2; L++) {
          const b = L * 4, T = target(L, i * DT), dx = T[0] - S[b], dy = T[1] - S[b + 1], d = Math.hypot(dx, dy); s2[0] = 0; s2[1] = 0;
          steer(dx, dy, S[b + 2], S[b + 3], L === 1 && d < R ? MS * d / R : MS, MF, s2);
          S[b + 2] += s2[0] * DT; S[b + 3] += s2[1] * DT; limitV(S, b + 2, MS); S[b] += S[b + 2] * DT; S[b + 1] += S[b + 3] * DT;
        }
      }
    };
    const sim = makeSim(spec, P.dur, seed, o);
    return {
      sim, N: 2, info: {},
      draw(c, tk, t) {
        const q = sim.at(t), C = tk.color, a = q.a, b = q.b, f = q.f, names = ['seek', 'arrive'];
        c.textBaseline = 'alphabetic';
        for (let L = 0; L < 2; L++) {
          const T = target(L, clamp(t, 0, P.dur)), k = L * 4;
          c.strokeStyle = C.line; c.lineWidth = 1; c.beginPath(); c.moveTo(40, LY[L] + 90 + .5); c.lineTo(920, LY[L] + 90 + .5); c.stroke();
          if (L === 1) { c.setLineDash([3, 5]); c.beginPath(); c.arc(T[0], T[1], R, 0, 6.2832); c.stroke(); c.setLineDash([]); }
          c.strokeStyle = C.accent2; c.lineWidth = 1.6; c.beginPath(); c.arc(T[0], T[1], 8, 0, 6.2832); c.moveTo(T[0] - 13, T[1]); c.lineTo(T[0] + 13, T[1]); c.moveTo(T[0], T[1] - 13); c.lineTo(T[0], T[1] + 13); c.stroke();
          // trail: sample the same sim in the past (still a pure function of t)
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.beginPath(); let started = false;
          for (let s = 30; s >= 0; s--) { const tq = t - s * 0.045; if (tq < 0) continue; const r = sim.at(tq), x = lerp(r.a[k], r.b[k], r.f), y = lerp(r.a[k + 1], r.b[k + 1], r.f); c.globalAlpha = 0.15 + 0.85 * (1 - s / 30); if (started) c.lineTo(x, y); else c.moveTo(x, y); started = true; }
          c.stroke(); c.globalAlpha = 1;
          const x = lerp(a[k], b[k], f), y = lerp(a[k + 1], b[k + 1], f), vx = lerp(a[k + 2], b[k + 2], f), vy = lerp(a[k + 3], b[k + 3], f), sp = Math.hypot(vx, vy), ux = sp > 1e-6 ? vx / sp : 1, uy = sp > 1e-6 ? vy / sp : 0;
          c.fillStyle = C.ink; c.beginPath(); c.moveTo(x + ux * 13, y + uy * 13); c.lineTo(x - ux * 8 - uy * 7, y - uy * 8 + ux * 7); c.lineTo(x - ux * 8 + uy * 7, y - uy * 8 - ux * 7); c.closePath(); c.fill();
          c.textAlign = 'left'; c.fillStyle = C.ink; c.font = font(tk, 'disp', 30); c.fillText(names[L], 40, LY[L] - 96);
          c.font = font(tk, 'mono', 12); c.fillStyle = C.muted; c.fillText('distance ' + String(Math.round(Math.hypot(x - T[0], y - T[1]))).padStart(3, ' ') + ' px   speed ' + String(Math.round(sp)).padStart(3, ' '), 40, LY[L] - 76);
        }
        c.textAlign = 'left'; c.fillStyle = C.muted; c.font = font(tk, 'mono', 12); c.fillText('steer = desired - velocity, limited to max force; arrive scales desired speed inside the radius', 40, 515);
        return q;
      }
    };
  }

  const SCENES = { settle: sceneSettle, pour: scenePour, flock: sceneFlock, steer: sceneSteer };
  const BASE = { scene: 'settle', dur: 8, maxSteps: 240, seed: 7 };
  window.ARSENAL.patterns.physics = {
    id: 'physics', atlas: ['euler-integration', 'fixed-timestep', 'oscillation', 'steering-behaviors', 'real-time-vs-frame-based', 'nature-of-code', 'matter-js'], renderer: 'p2d',
    params: Object.assign({}, BASE, {
      cols: 8, rows: 5, zeta: [0.3, 0.5], omega: [6.5, 9],                         // settle
      n: 150, rate: 0.035, restitution: 0.35, spread: 1.9,                          // pour (cols reused: set 10)
      maxSpeed: 150, maxForce: 260, arriveR: 110, wSep: 1.6, wAli: 0.8, wCoh: 0.6, wSeek: 1.0 // flock / steer
    }),
    variants: [
      { name: 'settle', params: { scene: 'settle' } },
      { name: 'pour', params: { scene: 'pour', cols: 10, n: 150 } },
      { name: 'flock', params: { scene: 'flock', n: 60 } },
      { name: 'steer', params: { scene: 'steer', maxSpeed: 260, maxForce: 600, arriveR: 130 } }
    ],
    setup(p, ctx, params) {
      const P = Object.assign({}, this.params, params), seed = (ctx && ctx.seed != null) ? ctx.seed : P.seed;
      const sc = SCENES[P.scene](P, 960, 540, seed, P); sc.P = P; return sc;
    },
    draw(p, t, state, params, tokens) {
      const c = p.drawingContext, tk = tokens;
      p.background(tk.color.bg);
      c.save(); const q = state.draw(c, tk, t); c.restore();
      c.save(); c.textAlign = 'right'; c.textBaseline = 'alphabetic'; c.font = font(tk, 'mono', 10); c.fillStyle = tk.color.muted;
      c.fillText('t ' + clamp(t, 0, state.P.dur).toFixed(2) + ' s   key ' + q.key + ' + ' + q.steps + ' steps of 1/120', 930, 530); c.restore();
    }
  };
})();
