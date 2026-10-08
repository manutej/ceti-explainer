// explorable: the generative-UI format. Not a film: a page with controls. State (vals) fully determines the drawing.
// Pure module: setup(p, ctx, params) -> st; draw(p, t, st, params, tokens) reads st.vals only (t is accepted for the
// contract and ignored; scripted time enters through pathAt(), which the demo's seek() turns into st.vals).
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const W = 960, H = 540, PAD = 48;
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const comma = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const f1 = x => (Math.round(x * 10) / 10).toFixed(1);

  // ---- claims: every number on the page comes from one of these formulas ---------------------------------------------
  const CLAIMS = {
    sample: {
      title: 'Sample-size explorer',
      formulas: ['margin = 1.96 x sqrt( p (1 - p) / n )', 'survey_i = p + z_i x sqrt( p (1 - p) / n ),  z_i ~ N(0, 1), 20 seeded draws'],
      limit: 'Covers random sampling error only (95% level, normal approximation); a biased sample is wrong at any n.',
      compute(v) { const p = v.p / 100, sd = Math.sqrt(p * (1 - p) / v.n); return { p, sd, margin: 1.96 * sd }; },
    },
    queue: {
      title: 'Queue explorer',
      formulas: ['wait multiplier = rho / (1 - rho)', 'wait = multiplier x service time', 'jobs waiting = rho^2 / (1 - rho)'],
      limit: 'One server, random arrivals and service times (M/M/1), long-run average; steadier arrivals wait less.',
      compute(v) { const r = v.rho / 100, mult = r / (1 - r); return { r, mult, wait: mult * v.svc, lq: r * r / (1 - r) }; },
    },
    compound: {
      title: 'Compounding explorer',
      formulas: ['balance(y) = 1,000 x (1 + r)^y', 'simple(y) = 1,000 x (1 + r x y)', 'doubling time = ln 2 / ln(1 + r);  rule of 72: 72 / (100 r)'],
      limit: 'Constant rate every year; no inflation, tax or fees, and real returns vary.',
      compute(v) {
        const r = v.rate / 100, P = 1000, final = P * Math.pow(1 + r, v.years), simple = P * (1 + r * v.years);
        return { r, P, final, simple, mult: final / P, dbl: r > 0 ? Math.LN2 / Math.log(1 + r) : Infinity, rule72: r > 0 ? 72 / v.rate : Infinity };
      },
    },
  };
  const dbl = x => isFinite(x) ? f1(x) + ' years' : 'never';

  function lines(kind, v, st) {
    const c = CLAIMS[kind].compute(v, st);
    if (kind === 'sample') { const k = surveys(v, st.seedBase).filter(s => Math.abs(s - c.p) <= c.margin + 1e-12).length;
      return [`20 surveys of n = ${comma(v.n)}, true share ${v.p}%: margin of error +/-${f1(c.margin * 100)} points.`, `${k} of 20 surveys land inside the band.`]; }
    if (kind === 'queue') return [`At ${v.rho}% busy a job waits ${f1(c.mult)} x its service time: ${f1(c.wait)} min when service takes ${v.svc} min.`, `About ${f1(c.lq)} jobs are waiting on average.`];
    return [`1,000 at ${f1(v.rate)}% for ${v.years} years grows to ${comma(c.final)}, ${f1(c.mult)} x the start (simple interest: ${comma(c.simple)}).`, `Doubling time ${dbl(c.dbl)}; the rule of 72 says ${dbl(c.rule72)}.`];
  }
  function surveys(v, seedBase) {   // 20 deterministic surveys: depends only on (n, p, run, seed)
    const r = mulberry32(seedBase + v.run * 7919), p = v.p / 100, sd = Math.sqrt(p * (1 - p) / v.n), out = [];
    for (let i = 0; i < 20; i++) { const u1 = Math.max(r(), 1e-9), u2 = r(), z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      out.push(clamp(Math.round((p + z * sd) * v.n) / v.n, 0, 1)); }
    return out;
  }

  // ---- control specs (the page builds p5 DOM controls from these) ----------------------------------------------------
  const CONTROLS = {
    sample: [
      { id: 'n', type: 'slider', log: true, min: 25, max: 4000, steps: 100, label: 'Sample size n', unit: 'people' },
      { id: 'n', type: 'number', min: 10, max: 10000, step: 1, label: 'or type n' },
      { id: 'p', type: 'chips', label: 'True share', options: [[30, '30%'], [50, '50%'], [70, '70%']] },
      { id: 'run', type: 'action', label: 'Re-run 20 surveys', text: 'Re-run' },
    ],
    queue: [
      { id: 'rho', type: 'slider', min: 5, max: 97, step: 1, label: 'Utilisation', unit: '% busy' },
      { id: 'rho', type: 'chips', label: 'Jump to', options: [[50, '50%'], [80, '80%'], [90, '90%'], [95, '95%']] },
      { id: 'svc', type: 'number', min: 1, max: 60, step: 1, label: 'Service time (min)' },
    ],
    compound: [
      { id: 'rate', type: 'slider', min: 0, max: 15, step: 0.5, label: 'Yearly rate', unit: '%' },
      { id: 'years', type: 'number', min: 1, max: 40, step: 1, label: 'Years' },
      { id: 'years', type: 'chips', label: 'Jump to', options: [[10, '10 y'], [20, '20 y'], [30, '30 y']] },
    ],
  };
  const DEFAULTS = { sample: { n: 400, p: 50, run: 1 }, queue: { rho: 80, svc: 5 }, compound: { rate: 7, years: 30 } };
  // scripted paths over t in [0, dur]: from/to eased (cubic in-out); constants held. Snapped to the control step.
  const PATHS = {
    sample: { n: { from: 25, to: 2500, log: true }, p: 50, run: 1 },
    queue: { rho: { from: 30, to: 95 }, svc: 5 },
    compound: { rate: 7, years: { from: 2, to: 30 } },
  };
  const SNAP = { n: [10, 10000, 1], p: [0, 100, 1], run: [1, 99, 1], rho: [5, 97, 1], svc: [1, 60, 1], rate: [0, 15, 0.5], years: [1, 40, 1] };
  const ease = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  function pathAt(kind, t, dur) {
    const e = ease(clamp(t / (dur || 6), 0, 1)), out = {};
    for (const [k, s] of Object.entries(PATHS[kind])) {
      let x = typeof s === 'number' ? s : s.log ? s.from * Math.pow(s.to / s.from, e) : s.from + (s.to - s.from) * e;
      const [lo, hi, st] = SNAP[k]; out[k] = clamp(Math.round(x / st) * st, lo, hi);
    }
    return out;
  }
  function sliderValue(spec, idx) { return spec.log ? Math.round(spec.min * Math.pow(spec.max / spec.min, idx / spec.steps)) : spec.min + idx * (spec.step || 1); }
  function sliderIndex(spec, v) { return spec.log ? Math.round(spec.steps * Math.log(clamp(v, spec.min, spec.max) / spec.min) / Math.log(spec.max / spec.min)) : Math.round((clamp(v, spec.min, spec.max) - spec.min) / (spec.step || 1)); }
  function snap(id, x) { const [lo, hi, st] = SNAP[id]; return clamp(Math.round(x / st) * st, lo, hi); }

  // ---- drawing helpers -----------------------------------------------------------------------------------------------
  function T(p, tok, role, size, align, base) { const f = tok.type[role]; p.textFont(f.family); p.textWeight(f.weight); p.textSize(size); p.textAlign(align || p.LEFT, base || p.BASELINE); }
  function head(p, tok, title, sub, big, bigSub) {
    p.noStroke(); p.fill(tok.color.ink); T(p, tok, 'disp', 30, p.LEFT); p.text(title, PAD, 52);
    p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.LEFT); p.text(sub, PAD, 74);
    p.fill(tok.color.accent); T(p, tok, 'disp', 64, p.RIGHT); p.text(big, W - PAD, 62);
    p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.RIGHT); p.text(bigSub, W - PAD, 82);
  }
  function foot(p, tok, line, limit) {
    p.noStroke(); p.fill(tok.color.ink); T(p, tok, 'mono', 14, p.LEFT); p.text(line, PAD, 498);
    p.fill(tok.color.muted); T(p, tok, 'mono', 11, p.LEFT); p.text('Limit: ' + limit, PAD, 522);
  }
  const hline = (p, tok, x0, x1, y) => { p.stroke(tok.color.line); p.strokeWeight(1); p.line(x0, y, x1, y); };

  function drawSample(p, v, st, tok) {
    const c = CLAIMS.sample.compute(v), est = surveys(v, st.seedBase), X = f => PAD + (W - 2 * PAD) * f, m = c.margin;
    const k = est.filter(s => Math.abs(s - c.p) <= m + 1e-12).length;
    head(p, tok, `20 surveys, each asks ${comma(v.n)} people`, `True share ${v.p}%. Each dot is one survey's answer; the band is the claimed margin.`, `+/-${f1(m * 100)}`, 'points, 95% margin of error');
    const y0 = 128, dy = 15.5;
    p.noStroke(); p.fill(tok.color.panel); p.rect(X(clamp(c.p - m, 0, 1)), 108, X(clamp(c.p + m, 0, 1)) - X(clamp(c.p - m, 0, 1)), 346);
    p.stroke(tok.color.accent); p.strokeWeight(1.5); p.line(X(clamp(c.p - m, 0, 1)), 108, X(clamp(c.p - m, 0, 1)), 454); p.line(X(clamp(c.p + m, 0, 1)), 108, X(clamp(c.p + m, 0, 1)), 454);
    p.strokeWeight(2); p.line(X(c.p), 104, X(c.p), 454);
    est.forEach((s, i) => {
      const y = y0 + i * dy, inside = Math.abs(s - c.p) <= m + 1e-12;
      p.stroke(tok.color.line); p.strokeWeight(1); p.line(PAD, y, W - PAD, y);
      p.stroke(tok.color.ink); p.strokeWeight(1.5); p.fill(inside ? tok.color.ink : tok.color.accent); p.circle(X(s), y, 9);
    });
    hline(p, tok, PAD, W - PAD, 462);
    p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.CENTER);
    for (let q = 0; q <= 100; q += 25) { p.stroke(tok.color.line); p.line(X(q / 100), 462, X(q / 100), 468); p.noStroke(); p.text(q + '%', X(q / 100), 482); }
    foot(p, tok, `${k} of 20 surveys land inside the band (filled dots); ${20 - k} outside (accent).`, CLAIMS.sample.limit);
    p.describe(`Sample-size explorer. Twenty simulated surveys of ${v.n} people each, true share ${v.p} percent, drawn as dots on a 0 to 100 percent axis. The margin of error band is plus or minus ${f1(m * 100)} points. ${k} of 20 surveys land inside the band.`, p.FALLBACK);
  }

  function drawQueue(p, v, st, tok) {
    const c = CLAIMS.queue.compute(v), r = c.r, RMAX = 0.98, YMAX = 40, px0 = PAD + 34, px1 = 520, py0 = 120, py1 = 440;
    const X = q => px0 + (px1 - px0) * q / RMAX, Y = m => py1 - (py1 - py0) * Math.min(m, YMAX) / YMAX;
    head(p, tok, 'The busier the server, the longer the line', `Random arrivals, one server. Each job takes ${v.svc} min of service.`, `x${f1(c.mult)}`, `wait = ${f1(c.wait)} min`);
    [1, 5, 10, 20, 40].forEach(m => { hline(p, tok, px0, px1, Y(m)); p.noStroke(); p.fill(tok.color.muted); T(p, tok, 'mono', 11, p.RIGHT); p.text('x' + m, px0 - 6, Y(m) + 4); });
    p.stroke(tok.color.ink); p.strokeWeight(2); p.noFill(); p.beginShape();
    for (let q = 0; q <= RMAX + 1e-9; q += 0.005) { const m = q / (1 - q); if (m > YMAX) { p.vertex(X(q), Y(YMAX)); break; } p.vertex(X(q), Y(m)); }
    p.endShape();
    p.stroke(tok.color.accent); p.strokeWeight(1.5); p.drawingContext.setLineDash([4, 4]); p.line(X(r), py1, X(r), Y(c.mult)); p.line(px0, Y(c.mult), X(r), Y(c.mult)); p.drawingContext.setLineDash([]);
    p.fill(tok.color.accent); p.stroke(tok.color.ink); p.strokeWeight(1.5); p.circle(X(r), Y(c.mult), 14);
    p.noStroke(); p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.CENTER);
    [0, 25, 50, 75, 95].forEach(q => p.text(q + '%', X(q / 100), py1 + 20));
    p.text('utilisation (share of time the server is busy)', (px0 + px1) / 2, py1 + 38);
    // the pile: expected jobs waiting, as marks
    const bx = 590, cell = 27, per = 12, n = Math.min(Math.round(c.lq), per * 7);
    p.noStroke(); p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.LEFT); p.text('being served', bx + 32, 146); p.text(`waiting, on average (${f1(c.lq)})`, bx, 200);
    p.stroke(tok.color.ink); p.strokeWeight(1.5); p.fill(tok.color.accent); p.rect(bx, 130, 22, 22);
    for (let i = 0; i < n; i++) {
      const col = i % per, row = Math.floor(i / per), j = st.jitter[i];
      p.stroke(tok.color.ink); p.strokeWeight(1.5); p.fill(tok.color.panel); p.rect(bx + col * cell + j[0] * 2.5, py1 - 22 - row * cell + j[1] * 2.5, 22, 22);
    }
    if (Math.round(c.lq) > n) { p.noStroke(); p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.LEFT); p.text('+' + (Math.round(c.lq) - n) + ' more', bx, 214); }
    foot(p, tok, `Wait = ${f1(c.mult)} x ${v.svc} min = ${f1(c.wait)} min.  Going from 80% to 95% busy multiplies the wait by ${f1((0.95 / 0.05) / (0.8 / 0.2))}.`, CLAIMS.queue.limit);
    p.describe(`Queue explorer. A curve of the wait multiplier against utilisation climbs steeply near 100 percent. At ${v.rho} percent busy the wait is ${f1(c.mult)} times the service time, ${f1(c.wait)} minutes for a ${v.svc} minute service, with about ${f1(c.lq)} jobs waiting, drawn as a pile of boxes.`, p.FALLBACK);
  }

  function drawCompound(p, v, st, tok) {
    const c = CLAIMS.compound.compute(v), Y = v.years, x0 = PAD, x1 = W - PAD, yb = 440, ht = 310, gap = Y > 24 ? 2 : 4, bw = (x1 - x0 - gap * (Y - 1)) / Y, sc = ht / c.final;
    head(p, tok, `1,000 at ${f1(v.rate)}% a year for ${v.years} years`, 'Bars: balance each year (grey = put in, accent = interest). Line: simple interest.', comma(c.final), `x${f1(c.mult)} the start`);
    const bx = y => x0 + (y - 1) * (bw + gap);
    for (let y = 1; y <= Y; y++) {
      const b = c.P * Math.pow(1 + c.r, y), hb = b * sc, hp = Math.min(c.P * sc, hb);
      p.noStroke(); p.fill(tok.color.muted); p.rect(bx(y), yb - hp, bw, hp);
      if (hb > hp) { p.fill(tok.color.accent); p.rect(bx(y), yb - hb, bw, hb - hp); }
    }
    if (2 * c.P < c.final * 0.999) { p.stroke(tok.color.ink); p.strokeWeight(1); p.drawingContext.setLineDash([5, 4]); p.line(x0, yb - 2 * c.P * sc, x1, yb - 2 * c.P * sc); p.drawingContext.setLineDash([]); p.noStroke(); p.fill(tok.color.ink); T(p, tok, 'mono', 11, p.LEFT); p.text('2 x start', x0 + 4, yb - 2 * c.P * sc - 5); }
    p.noFill(); p.stroke(tok.color.ink); p.strokeWeight(2.5); p.beginShape();
    for (let y = 1; y <= Y; y++) p.vertex(bx(y) + bw / 2, yb - c.P * (1 + c.r * y) * sc);
    p.endShape();
    p.noStroke(); p.fill(tok.color.ink); T(p, tok, 'mono', 11, p.RIGHT); p.text('simple interest ends at ' + comma(c.simple), x1, 112);
    hline(p, tok, x0, x1, yb + 1);
    p.noStroke(); p.fill(tok.color.muted); T(p, tok, 'mono', 12, p.CENTER);
    for (let y = 1; y <= Y; y++) if (y === 1 || y === Y || (y % 5 === 0 && Y - y >= 3)) p.text(y, bx(y) + bw / 2, yb + 20);
    p.text('years', (x0 + x1) / 2, yb + 38);
    foot(p, tok, `Doubling time ${dbl(c.dbl)} (rule of 72: ${dbl(c.rule72)}).  Interest earned ${comma(c.final - c.P)} vs ${comma(c.simple - c.P)} with simple interest.`, CLAIMS.compound.limit);
    p.describe(`Compounding explorer. ${Y} bars show the balance of 1,000 growing at ${f1(v.rate)} percent a year; it reaches ${comma(c.final)} after ${Y} years, ${f1(c.mult)} times the start, against ${comma(c.simple)} with simple interest. Doubling time is ${dbl(c.dbl)}.`, p.FALLBACK);
  }

  ARSENAL.patterns['explorable'] = {
    id: 'explorable', atlas: ['event-driven-redraw', 'dom-controls', 'instance-mode', 'explorable-documents-template', 'describe', 'access-statement', 'pointer-events'], renderer: 'p2d',
    params: { kind: 'sample', dur: 6, seed: 20260508, vals: null },
    variants: [
      { name: 'sample-size', params: { kind: 'sample' } },
      { name: 'queue', params: { kind: 'queue' } },
      { name: 'compounding', params: { kind: 'compound' } },
    ],
    W, H, CLAIMS, CONTROLS, DEFAULTS, PATHS, claimsFor: (kind, v, st) => CLAIMS[kind].compute(v, st), lines, pathAt, sliderValue, sliderIndex, snap,
    setup(p, ctx, params) {
      const pr = Object.assign({}, this.params, params), r = mulberry32(ctx.seed || pr.seed), jitter = [];
      for (let i = 0; i < 96; i++) jitter.push([r() - 0.5, r() - 0.5]);
      return { kind: pr.kind, seedBase: (ctx.seed || pr.seed) >>> 0, jitter, vals: Object.assign({}, DEFAULTS[pr.kind], pr.vals || {}) };
    },
    draw(p, t, st, params, tokens) {
      p.background(tokens.color.bg); p.push();
      ({ sample: drawSample, queue: drawQueue, compound: drawCompound })[st.kind](p, st.vals, st, tokens);
      p.pop();
    },
  };
})();
