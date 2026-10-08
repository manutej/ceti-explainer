// fields: ambient, generative motion that stays a pure function of (seed, t).
// Streamline backdrop, seamless grid wave, pen-trail drifters, breathing texture.
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fract = (v) => v - Math.floor(v);
  const fade = (f) => f * f * f * (f * (f * 6 - 15) + 10);
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // stateless hash -> [0,1) for per-entity draws that survive any seek order
  function hrand(seed, i, k, j) {
    return mulberry32((seed ^ Math.imul(i + 1, 0x9E3779B1) ^ Math.imul(k + 1, 0x85EBCA6B) ^ Math.imul(j + 1, 0xC2B2AE35)) | 0)();
  }

  // 4D value noise from a seeded lattice (noise(): value noise, no p5 global state).
  function makeNoise(rng) {
    const P = new Uint16Array(512), T = new Float32Array(256);
    const idx = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const s = idx[i]; idx[i] = idx[j]; idx[j] = s; }
    for (let i = 0; i < 512; i++) P[i] = idx[i & 255];
    for (let i = 0; i < 256; i++) T[i] = rng();
    const g = (a, b, c, d) => T[P[P[P[P[a] + b] + c] + d]];
    return function n4(x, y, z, w) {
      const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), wi = Math.floor(w);
      const u = fade(x - xi), v = fade(y - yi), s = fade(z - zi), q = fade(w - wi);
      const x0 = xi & 255, x1 = (xi + 1) & 255, y0 = yi & 255, y1 = (yi + 1) & 255;
      const z0 = zi & 255, z1 = (zi + 1) & 255, w0 = wi & 255, w1 = (wi + 1) & 255;
      const L = (a, b, t) => a + (b - a) * t;
      const f = (w_) => {
        const a = L(L(g(x0, y0, z0, w_), g(x1, y0, z0, w_), u), L(g(x0, y1, z0, w_), g(x1, y1, z0, w_), u), v);
        const b = L(L(g(x0, y0, z1, w_), g(x1, y0, z1, w_), u), L(g(x0, y1, z1, w_), g(x1, y1, z1, w_), u), v);
        return L(a, b, s);
      };
      return L(f(w0), f(w1), q);
    };
  }
  // Seamless: noise on a circle of radius R in (z,w); period is whole cycles of theta.
  // Returns roughly -1..1, widened because value noise clusters mid-range.
  function loopField(n4, x, y, theta, R, fs) {
    const cz = R * Math.cos(theta) + 17.3, cw = R * Math.sin(theta) + 5.9;
    const a = n4(x * fs, y * fs, cz, cw);
    const b = n4(x * fs * 2.1 + 31, y * fs * 2.1 + 7, cz * 1.7, cw * 1.7);
    return clamp(((a + 0.4 * b) / 1.4 - 0.5) * 2.6, -1, 1);
  }

  // ---- streamlines (Jobard-Lefer style spacing check, Hobbs-style noise angle) ----
  function traceStreamlines(n4, rng, prm, W, H) {
    const { dsep, step, fs, swirl } = prm, dtest = dsep * 0.5, cell = dsep;
    const gw = Math.ceil(W / cell) + 2, gh = Math.ceil(H / cell) + 2;
    const grid = Array.from({ length: gw * gh }, () => []);
    const lines = [], dead = [];
    const ang = (x, y) => loopField(n4, x, y, 0, 0.0001, fs) * Math.PI * swirl;
    function near(x, y, rad, id, idx) {
      const cx = Math.floor(x / cell) + 1, cy = Math.floor(y / cell) + 1, r2 = rad * rad;
      for (let j = cy - 1; j <= cy + 1; j++) for (let i = cx - 1; i <= cx + 1; i++) {
        if (i < 0 || j < 0 || i >= gw || j >= gh) continue;
        for (const q of grid[j * gw + i]) {
          if (dead[q.id]) continue;
          if (q.id === id && Math.abs(q.k - idx) < 14) continue;
          const dx = q.x - x, dy = q.y - y;
          if (dx * dx + dy * dy < r2) return true;
        }
      }
      return false;
    }
    function put(x, y, id, k) {
      const cx = Math.floor(x / cell) + 1, cy = Math.floor(y / cell) + 1;
      if (cx >= 0 && cy >= 0 && cx < gw && cy < gh) grid[cy * gw + cx].push({ x, y, id, k });
    }
    const inside = (x, y) => x > -10 && x < W + 10 && y > -10 && y < H + 10;
    for (let tries = 0; tries < prm.tries && lines.length < prm.maxLines; tries++) {
      const sx = rng() * W, sy = rng() * H, id = lines.length;
      if (near(sx, sy, dsep, -1, 0)) continue;
      const fwd = [], bwd = [];
      put(sx, sy, id, 0);
      for (const dir of [1, -1]) {
        let x = sx, y = sy;
        const out = dir === 1 ? fwd : bwd;
        for (let k = 1; k < prm.maxSteps; k++) {
          const a = ang(x, y);
          x += Math.cos(a) * step * dir; y += Math.sin(a) * step * dir;
          if (!inside(x, y) || near(x, y, dtest, id, k * dir)) break;
          out.push(x, y); put(x, y, id, k * dir);
        }
      }
      const pts = [];
      for (let i = bwd.length - 2; i >= 0; i -= 2) pts.push(bwd[i], bwd[i + 1]);
      pts.push(sx, sy);
      for (let i = 0; i < fwd.length; i += 2) pts.push(fwd[i], fwd[i + 1]);
      if (pts.length / 2 < prm.minPts) { dead[id] = true; lines.push(null); continue; }
      lines.push({ pts: Float32Array.from(pts), n: pts.length / 2, step });
    }
    return lines.filter(Boolean);
  }
  function ptAt(ln, fi, out) {
    const i = clamp(Math.floor(fi), 0, ln.n - 2), f = clamp(fi - i, 0, 1), p = ln.pts;
    out[0] = p[2 * i] + (p[2 * i + 2] - p[2 * i]) * f; out[1] = p[2 * i + 1] + (p[2 * i + 3] - p[2 * i + 1]) * f;
  }

  const A = window.ARSENAL.patterns;
  const BASE = {
    seed: 7, period: 6, amp: 1,
    // streamlines
    fs: 0.0042, swirl: 1.5, dsep: 15, step: 3, tries: 3000, maxLines: 520, maxSteps: 260, minPts: 14,
    pulseFrac: 0.4, pulseLen: 80, lineAlpha: 0.9, lineW: 1,
    // gridwave
    spacing: 24, waveLen: 300, warp: 0.35, lift: 8, dot: 2.4,
    // drift
    count: 230, trail: 26, speed: 70, dt: 1 / 30, loopR: 0.9, driftFs: 0.0024, penW: 1.6,
    // breath
    tick: 19, jitter: 6, tickLen: 9,
    mode: 'streamlines'
  };

  A.fields = {
    id: 'fields', atlas: ['flow-field', 'noise-loop', 'loop-phase-animation', 'grid-offset-loop', 'noise', 'random-seed', 'seeded-determinism', 'golan-levin-loop-templates'],
    renderer: 'p2d',
    params: BASE,
    variants: [
      { name: 'streamlines', params: { mode: 'streamlines' } },
      { name: 'gridwave', params: { mode: 'gridwave' } },
      { name: 'drift', params: { mode: 'drift' } },
      { name: 'breath', params: { mode: 'breath', amp: 1 } }
    ],

    setup(p, ctx, params) {
      const W = ctx.w || 960, H = ctx.h || 540, rng = mulberry32(ctx.seed != null ? ctx.seed : params.seed);
      const n4 = makeNoise(rng), st = { W, H, n4, mode: params.mode, seed: ctx.seed != null ? ctx.seed : params.seed };
      if (params.mode === 'streamlines') {
        st.lines = traceStreamlines(n4, rng, params, W, H);
        st.lines.forEach((ln, i) => {
          ln.len = (ln.n - 1) * ln.step;
          ln.u0 = rng(); ln.m = rng() < 0.35 ? 2 : 1; ln.ph = rng();
          ln.pulse = ln.len > params.pulseLen * 1.2 && rng() < params.pulseFrac;
        });
      } else if (params.mode === 'gridwave') {
        const cols = Math.ceil(W / params.spacing) + 2, rows = Math.ceil(H / params.spacing) + 2;
        st.cols = cols; st.rows = rows;
        st.cx = W * (0.4 + 0.2 * rng()); st.cy = H * (0.4 + 0.2 * rng());
        st.ox = -(cols * params.spacing - W) / 2; st.oy = -(rows * params.spacing - H) / 2;
      } else if (params.mode === 'breath') {
        const sp = params.tick, cols = Math.ceil(W / sp) + 1, rows = Math.ceil(H / sp) + 1, n = cols * rows;
        const x = new Float32Array(n), y = new Float32Array(n), ph = new Float32Array(n);
        for (let j = 0, k = 0; j < rows; j++) for (let i = 0; i < cols; i++, k++) {
          x[k] = i * sp + (rng() - 0.5) * 2 * params.jitter; y[k] = j * sp + (rng() - 0.5) * 2 * params.jitter; ph[k] = rng();
        }
        st.bx = x; st.by = y; st.bph = ph; st.n = n;
      } else if (params.mode === 'drift') {
        st.life = []; st.life0 = [];
      }
      return st;
    },

    draw(p, t, st, params, tokens) {
      const W = st.W, H = st.H, c = tokens.color, ctx = p.drawingContext;
      const P = params.period, ph = t / P, theta = TAU * ph, amp = params.amp;
      p.background(c.bg);
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const mode = st.mode;

      if (mode === 'streamlines') {
        ctx.strokeStyle = c.line; ctx.lineWidth = params.lineW;
        for (const ln of st.lines) {
          ctx.globalAlpha = clamp(params.lineAlpha * amp * (0.7 + 0.3 * Math.sin(TAU * (ph + ln.ph))), 0, 1);
          ctx.beginPath(); ctx.moveTo(ln.pts[0], ln.pts[1]);
          for (let i = 1; i < ln.n; i++) ctx.lineTo(ln.pts[2 * i], ln.pts[2 * i + 1]);
          ctx.stroke();
        }
        // pulses: phase along the precomputed line, a function of t only
        const q = [0, 0], r = [0, 0], SEG = 7;
        ctx.strokeStyle = c.accent; ctx.lineWidth = params.lineW * 1.8;
        for (const ln of st.lines) {
          if (!ln.pulse) continue;
          const u = fract(ln.u0 + ln.m * ph), env = Math.sin(Math.PI * u);
          const head = u * (ln.n - 1), span = params.pulseLen / ln.step;
          for (let s = 0; s < SEG; s++) {
            const a = head - span * (1 - s / SEG), b = head - span * (1 - (s + 1) / SEG);
            if (b <= 0 || a >= ln.n - 1) continue;
            ptAt(ln, Math.max(a, 0), q); ptAt(ln, b, r);
            ctx.globalAlpha = clamp(env * amp * Math.pow((s + 1) / SEG, 1.6), 0, 1);
            ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.stroke();
          }
        }
      }

      else if (mode === 'gridwave') {
        const { cols, rows, ox, oy, cx, cy } = st, sp = params.spacing, n4 = st.n4;
        const X = new Float32Array(cols), Y = new Float32Array(cols), Wv = new Float32Array(cols);
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const x = ox + i * sp, y = oy + j * sp, d = Math.hypot(x - cx, y - cy);
            const wob = loopField(n4, x, y, theta, params.loopR, 0.0035);
            // phase offset by distance from the source; whole cycles of t so the loop closes
            const w = Math.sin(TAU * (ph - d / params.waveLen + params.warp * wob));
            X[i] = x; Y[i] = y - params.lift * amp * w; Wv[i] = w;
          }
          ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.globalAlpha = 0.9;
          ctx.beginPath(); ctx.moveTo(X[0], Y[0]);
          for (let i = 1; i < cols; i++) ctx.lineTo(X[i], Y[i]);
          ctx.stroke();
          for (let i = 0; i < cols; i++) {
            const w01 = (Wv[i] + 1) / 2, crest = w01 > 0.86;
            ctx.fillStyle = crest ? c.accent : c.ink;
            ctx.globalAlpha = clamp((crest ? 0.95 : 0.22 + 0.55 * w01) * (0.4 + 0.6 * amp), 0, 1);
            ctx.beginPath(); ctx.arc(X[i], Y[i], params.dot * (0.45 + 0.9 * w01), 0, TAU); ctx.fill();
          }
        }
      }

      else if (mode === 'drift') {
        drawDrift(p, t, st, params, tokens, ctx);
      }

      else if (mode === 'breath') {
        const n4 = st.n4, L = params.tickLen;
        ctx.strokeStyle = c.muted; ctx.lineWidth = 1;
        // three alpha tiers keep it to three strokes
        const tiers = [[], [], []];
        for (let k = 0; k < st.n; k++) {
          const x = st.bx[k], y = st.by[k];
          const a = loopField(n4, x, y, theta, 0.7, 0.0028) * Math.PI;
          const b = 0.5 + 0.5 * Math.sin(TAU * (ph + st.bph[k] * 0.35 + 0.0004 * x));
          const len = L * (0.45 + 0.55 * b), ca = Math.cos(a) * len / 2, sa = Math.sin(a) * len / 2;
          tiers[Math.min(2, Math.floor(b * 3))].push(x - ca, y - sa, x + ca, y + sa);
        }
        const alphas = [0.14, 0.26, 0.42];
        for (let tI = 0; tI < 3; tI++) {
          ctx.globalAlpha = clamp(alphas[tI] * amp, 0, 1); ctx.beginPath();
          const s = tiers[tI];
          for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  };

  // Particles re-integrated from t=0 with a fixed step every frame: position is f(seed,t) only.
  function drawDrift(p, t, st, prm, tokens, ctx) {
    const c = tokens.color, n4 = st.n4, dt = prm.dt, K = prm.trail, P = prm.period;
    const nSteps = Math.floor(t / dt + 1e-9), frac = clamp(t / dt - nSteps, 0, 1);
    const sp = prm.speed * dt, seed = st.seed, W = st.W, H = st.H;
    const field = (x, y, tt) => loopField(n4, x, y, TAU * tt / P, prm.loopR, prm.driftFs) * Math.PI * 0.9;
    const tiers = 4;
    const buf = Array.from({ length: tiers }, () => []);
    const heads = [];
    const hx = new Float32Array(K + 1), hy = new Float32Array(K + 1);
    for (let i = 0; i < prm.count; i++) {
      let k = 0, x, y, age, life;
      const spawn = () => {
        x = hrand(seed, i, k, 0) * W; y = hrand(seed, i, k, 1) * H;
        life = Math.floor((2.2 + 3.2 * hrand(seed, i, k, 2)) / dt);
        age = 0; k++;
      };
      // first life starts partway through so t=0 is already populated
      spawn(); age = Math.floor(hrand(seed, i, 99, 3) * life);
      let n = 0; // number of trail points stored (ring)
      let w = 0;
      for (let s = -K; s < nSteps; s++) {
        if (age >= life || x < -20 || x > W + 20 || y < -20 || y > H + 20) { spawn(); n = 0; w = 0; }
        hx[w % (K + 1)] = x; hy[w % (K + 1)] = y; w++; n = Math.min(n + 1, K);
        const a = field(x, y, s * dt);
        x += Math.cos(a) * sp; y += Math.sin(a) * sp; age++;
      }
      if (age >= life) { spawn(); n = 0; w = 0; }
      hx[w % (K + 1)] = x; hy[w % (K + 1)] = y; w++; n = Math.min(n + 1, K);
      // fractional sub-step toward the next state
      const a = field(x, y, nSteps * dt), px = x + Math.cos(a) * sp * frac, py = y + Math.sin(a) * sp * frac;
      const fadeIn = clamp(age / 12, 0, 1), fadeOut = clamp((life - age) / 18, 0, 1), env = Math.min(fadeIn, fadeOut);
      if (env <= 0.01) continue;
      // trail points oldest..newest, then the interpolated head
      const pts = [];
      for (let j = n; j >= 1; j--) { const q = (w - j) % (K + 1); pts.push(hx[q], hy[q]); }
      pts.push(px, py);
      const m = pts.length / 2;
      for (let j = 0; j < m - 1; j++) {
        const f = (j + 1) / (m - 1), tier = Math.min(tiers - 1, Math.floor(f * tiers));
        buf[tier].push(pts[2 * j], pts[2 * j + 1], pts[2 * j + 2], pts[2 * j + 3]);
      }
      heads.push(px, py, env);
    }
    ctx.strokeStyle = c.ink;
    for (let tI = 0; tI < tiers; tI++) {
      ctx.globalAlpha = clamp(prm.amp * (0.12 + 0.55 * (tI + 1) / tiers), 0, 1);
      ctx.lineWidth = prm.penW * (0.45 + 0.55 * (tI + 1) / tiers);
      ctx.beginPath(); const s = buf[tI];
      for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
      ctx.stroke();
    }
    ctx.fillStyle = c.accent;
    for (let i = 0; i < heads.length; i += 3) {
      ctx.globalAlpha = clamp(prm.amp * heads[i + 2], 0, 1);
      ctx.beginPath(); ctx.arc(heads[i], heads[i + 1], prm.penW * 1.15, 0, TAU); ctx.fill();
    }
  }
})();
