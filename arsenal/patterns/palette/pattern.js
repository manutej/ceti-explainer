/* palette: derive OKLCH ramps and a seeded probabilistic sampler from a brand pack; render a swatch sheet.
   Atlas: color-spaces-2x, color-mode, lerp-color, color-contrast, probabilistic-palette, generative-distributions.
   Roles only: this file never contains a colour literal; every colour comes from the pack passed in.

   lerpColor HUE HANDLING (measured on vendored p5 2.3.4, not documented upstream):
     - interpolation happens in the CURRENT colorMode, so set colorMode(OKLCH, 1, 0.4, 360) first. The default OKLCH
       ranges are L 0..100, C 0..100 (mapped onto 0..0.4), h 0..360; explicit maxima make the numbers literal.
     - hue takes the SHORTEST arc (350 -> 10 passes through 0/360, not through 180).
     - an achromatic end (chroma 0, hue 'none') borrows the other end's hue (CSS "powerless hue" rule).
     - colours created from hex BEFORE switching mode lerp correctly after the switch; the result is gamut-mapped
       into sRGB, so a mid step between two saturated hues can lose chroma and shift hue a little.
     - endpoints round-trip exactly (t=0 and t=1 return the input hex).
   Ramps are computed once in setup (colour creation is slow in 2.x), never per frame. */
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const EASE = {
    linear: x => x, quad: x => 1 - (1 - x) * (1 - x), cubic: x => 1 - Math.pow(1 - x, 3),
    expo: x => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)), sine: x => Math.sin(x * Math.PI / 2),
  };
  const isHex = s => typeof s === 'string' && /^#[0-9a-f]{6}$/i.test(s);
  function lum(h) {
    const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const n = parseInt(h.slice(1), 16);
    return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255);
  }
  function contrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  /* n hex steps from `from` to `to` (inclusive) through p5 colorMode(OKLCH) + lerpColor. */
  function ramp(p, from, to, n) {
    p.push();
    const a = p.color(from), b = p.color(to);             // created in the incoming mode, parsed from hex
    p.colorMode(p.OKLCH, 1, 0.4, 360);                   // interpolate perceptually
    const out = [];
    for (let i = 0; i < n; i++) out.push(p.lerpColor(a, b, n === 1 ? 0 : i / (n - 1)).toString('#rrggbb'));
    p.pop();
    return out;
  }

  /* Ramps for a pack: the optional pack.ramps, else bgInk and accentBg at 5 and 9 steps. */
  function brandRamps(p, tk) {
    const c = tk.color, spec = tk.ramps || { bgInk: { from: 'bg', to: 'ink', steps: [5, 9] }, accentBg: { from: 'accent', to: 'bg', steps: [5, 9] } };
    const out = [];
    for (const name of Object.keys(spec)) for (const n of (spec[name].steps || [5, 9]))
      out.push({ key: name + n, label: spec[name].from + ' > ' + spec[name].to + '  x' + n, steps: ramp(p, c[spec[name].from], c[spec[name].to], n) });
    return out;
  }

  const DEFAULT_WEIGHTS = { ink: 34, accent: 26, accent2: 8, muted: 20, panel: 12 };

  /* Seeded probabilistic sampler: weighted role choice (Fidenza style) plus a bounded-Gaussian tint toward ink or bg.
     Returns n {role, hex}. Same (pack, seed, weights) gives the same list. */
  function sample(p, tk, seed, n, weights, jitter) {
    const rng = mulberry32(seed), c = tk.color;
    const w = Object.entries(weights || tk.weights || DEFAULT_WEIGHTS).filter(e => isHex(c[e[0]]) && e[1] > 0);
    const total = w.reduce((s, e) => s + e[1], 0);
    const gauss = () => { const u = 1 - rng(), v = rng(); return clamp(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v), -2, 2) / 2; };
    p.push();
    const base = {}; for (const e of w) base[e[0]] = p.color(c[e[0]]);
    const ink = p.color(c.ink), bg = p.color(c.bg);
    p.colorMode(p.OKLCH, 1, 0.4, 360);
    const out = [];
    for (let i = 0; i < n; i++) {
      let t = rng() * total, role = w[w.length - 1][0];
      for (const e of w) { if ((t -= e[1]) < 0) { role = e[0]; break; } }
      const g = gauss() * jitter;                          // bounded to +-jitter
      out.push({ role, hex: p.lerpColor(base[role], g > 0 ? ink : bg, Math.abs(g)).toString('#rrggbb') });
    }
    p.pop();
    return out;
  }

  ARSENAL.palette = { mulberry32, ramp, brandRamps, sample, contrast, EASE, DEFAULT_WEIGHTS };

  function packFor(ctx, params, tokens) {
    return (params.brand && ARSENAL.brands[params.brand]) || (ctx && ctx.tokens) || tokens || ARSENAL.brands['ceti-dark'];
  }

  function setup(p, ctx, params) {
    const tk = packFor(ctx, params), rng = mulberry32((ctx.seed | 0) + 1013), tex = [];
    if (tk.texture === 'paper') for (let i = 0; i < 900; i++) tex.push([rng() * 960, rng() * 540, 0.6 + rng() * 1.4, 0.03 + rng() * 0.07]);
    if (tk.texture === 'grain') for (let i = 0; i < 2600; i++) tex.push([rng() * 960, rng() * 540, 1, 0.04 + rng() * 0.1]);
    const hs = []; for (let i = 0; i < 9; i++) hs.push(0.45 + rng() * 0.55);
    return {
      tk, tex, hs,
      ramps: brandRamps(p, tk),
      chips: sample(p, tk, (ctx.seed | 0) + 7, params.chips, null, params.jitter),
      cr: { ink: contrast(tk.color.ink, tk.color.bg), acc: contrast(tk.color.accent, tk.color.bg), mut: contrast(tk.color.muted, tk.color.bg), chalk: contrast(tk.color.chalk, tk.color.panel) },
    };
  }

  function draw(p, t, st, params, tokens) {
    const tk = st.tk, c = tk.color, ty = tk.type, ctx2 = p.drawingContext;
    const ease = EASE[tk.tempo.ease] || EASE.cubic, prog = clamp(t / tk.tempo.beat_s, 0, 1);
    const txt = (s, x, y, role, size, col, align) => {
      p.noStroke(); p.fill(col); p.textFont(ty[role].family); p.textWeight(ty[role].weight); p.textSize(size);
      p.textAlign(align || p.LEFT, p.BASELINE); p.text(s, x, y);
    };
    p.background(c.bg);
    // texture token
    p.noStroke();
    if (tk.texture === 'paper' || tk.texture === 'grain') {
      ctx2.save();
      for (const d of st.tex) { ctx2.globalAlpha = d[3]; ctx2.fillStyle = c.ink; ctx2.fillRect(d[0], d[1], d[2], d[2]); }
      ctx2.restore();
    } else if (tk.texture === 'halftone') {
      ctx2.save(); ctx2.fillStyle = c.line;
      for (let gy = 6; gy < 540; gy += 12) for (let gx = 6; gx < 960; gx += 12) {
        const r = 0.2 + 2.6 * clamp(1 - Math.hypot(960 - gx, 540 - gy) / 520, 0, 1);
        ctx2.beginPath(); ctx2.arc(gx, gy, r, 0, 6.2832); ctx2.fill();
      }
      ctx2.restore();
    }
    // header
    txt(tk.name, 32, 46, 'disp', 30, c.ink);
    txt('texture ' + tk.texture + '   ease ' + tk.tempo.ease + '   beat ' + tk.tempo.beat_s + ' s', 928, 30, 'mono', 11, c.muted, p.RIGHT);
    txt('contrast  ink ' + st.cr.ink.toFixed(1) + '  accent ' + st.cr.acc.toFixed(1) + '  muted ' + st.cr.mut.toFixed(1) + '  chalk ' + st.cr.chalk.toFixed(1), 928, 46, 'mono', 11, c.muted, p.RIGHT);
    p.stroke(c.line); p.strokeWeight(1); p.line(32, 58.5, 928, 58.5);
    // roles
    const roles = ['bg', 'ink', 'accent', 'accent2', 'muted', 'line', 'panel', 'chalk'], sw = 105, gap = 8;
    roles.forEach((r, i) => {
      const x = 32 + i * (sw + gap);
      p.noStroke(); p.fill(c[r]); p.rect(x, 74, sw, 60, 2);
      p.noFill(); p.stroke(c.line); p.rect(x + 0.5, 74.5, sw - 1, 59, 2);
      txt(r, x, 150, 'mono', 11, c.ink);
      txt(c[r].charAt(0) === '#' ? c[r].toUpperCase() : 'a=' + (c[r].split(',')[3] || '1').replace(/[ )]/g, ''), x, 162, 'mono', 9, c.muted);
    });
    // ramps and sampler
    const rows = st.ramps.concat([{ label: 'sample x' + st.chips.length, steps: st.chips.map(q => q.hex) }]);
    rows.forEach((row, i) => {
      const y = 180 + i * 28, n = row.steps.length, w = (768 - (n - 1) * 3) / n;
      txt(row.label, 32, y + 14, 'mono', 10, c.muted);
      row.steps.forEach((h, k) => {
        const x = 160 + k * (w + 3);
        p.noStroke(); p.fill(h); p.rect(x, y, w, 22);
        p.noFill(); p.stroke(c.line); p.rect(x + 0.5, y + 0.5, w - 1, 21);
      });
    });
    // three sample marks on panel
    const my = 340, mh = 168, mw = 288, mx = [32, 336, 640];
    mx.forEach(x => { p.fill(c.panel); p.stroke(c.line); p.rect(x + 0.5, my + 0.5, mw - 1, mh - 1, 3); });
    // mark 1: disc and ring, moves one beat
    let cx = mx[0] + mw / 2, cy = my + 72, e = ease(prog);
    p.stroke(c.line); p.line(mx[0] + 16, cy + 0.5, mx[0] + mw - 16, cy + 0.5); p.line(cx + 0.5, my + 14, cx + 0.5, my + 130);
    p.noStroke(); p.fill(c.accent); p.circle(cx, cy, 8 + 66 * e);
    p.noFill(); p.stroke(c.accent2); p.strokeWeight(2); p.circle(cx, cy, 20 + 96 * e); p.strokeWeight(1);
    txt('disc  accent + accent2', mx[0] + 16, my + mh - 14, 'mono', 10, c.muted);
    // mark 2: eight bars through the accent>bg 9 ramp, staggered by the ease
    const acc9 = (st.ramps.find(r => r.key.endsWith('9') && r.label.startsWith('accent')) || st.ramps[st.ramps.length - 1]).steps;
    for (let i = 0; i < 8; i++) {
      const bp = ease(clamp(prog * 1.5 - i * 0.07, 0, 1)), bh = 104 * st.hs[i] * bp, bx = mx[1] + 22 + i * 32;
      p.noStroke(); p.fill(acc9[i]); p.rect(bx, my + 130 - bh, 24, bh);
    }
    p.stroke(c.ink); p.line(mx[1] + 16, my + 130.5, mx[1] + mw - 16, my + 130.5);
    txt('bars  accent > bg ramp', mx[1] + 16, my + mh - 14, 'mono', 10, c.muted);
    // mark 3: type lockup, a count that lands on its beat
    txt(String(Math.round(42 * ease(prog))), mx[2] + 16, my + 74, 'disp', 72, c.accent);
    txt('n = 1,024 runs', mx[2] + 16, my + 98, 'mono', 12, c.muted);
    txt('Counts first, then the claim.', mx[2] + 16, my + 122, 'body', 15, c.chalk);
    p.stroke(c.line); p.line(mx[2] + 16, my + 132.5, mx[2] + mw - 16, my + 132.5);
    txt('type  disp / mono / body', mx[2] + 16, my + mh - 14, 'mono', 10, c.muted);
  }

  /* variants are built from every pack in ARSENAL.brands, so load brands/packs.js before this file */
  const P = { chips: 32, jitter: 0.18, brand: null };
  ARSENAL.patterns['palette'] = {
    id: 'palette', atlas: ['color-spaces-2x', 'color-mode', 'lerp-color', 'color-contrast', 'probabilistic-palette', 'generative-distributions', 'p3-hdr-color'],
    renderer: 'p2d',
    params: P,
    variants: Object.keys(ARSENAL.brands).map(b => ({ name: b, params: Object.assign({}, P, { brand: b }) })),
    setup, draw,
  };
})();
