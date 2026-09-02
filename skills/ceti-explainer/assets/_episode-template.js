(function () {
  const NS = "http://www.w3.org/2000/svg";
  const ex = window.CetiExplainer;
  const S = { beats: {}, scenes: [], math: true };
  const DATA = (() => {
    const q = [2, 1];
    const keys = [[1, 0], [0, 2], [2, 1]];
    const values = [0.2, 0.5, 0.9];
    const scores = keys.map((key) => q[0] * key[0] + q[1] * key[1]);
    const scale = Math.sqrt(q.length);
    const scaled = scores.map((score) => score / scale);
    const shifted = scaled.map((score) => score - Math.max(...scaled));
    const exp = shifted.map((score) => Math.exp(score));
    const sumExp = exp.reduce((sum, value) => sum + value, 0);
    const weights = exp.map((value) => value / sumExp);
    const context = weights.reduce((sum, weight, index) => sum + weight * values[index], 0);
    return { q, keys, values, scores, scaled, exp, weights, context, sumWeights: weights.reduce((sum, value) => sum + value, 0) };
  })();

  const meta = {
    id: "episode-template",
    eyebrow: "8-beat explainer template",
    title: "One query reading three keys",
    lede: "Use this copy-paste starter to swap in your own mechanism while keeping the deterministic SVG player intact.",
    synthTitle: "Starter takeaway",
    tag: "Deterministic SVG episode starter",
    synthesis: "The template already carries the contract: eight beats, one pure timeline, and a worked read that can be inspected at every frame."
  };

  const beats = [
    { id: "anchor", label: "Set the scene", dur: 4.4, caption: "Start with one query looking across three remembered tokens." },
    { id: "scores", label: "Score q·k", dur: 4.8, caption: "Each key meets the query as a dot product, so relevance becomes a score." },
    { id: "scaled", label: "Scale it", dur: 4.7, caption: "Scaling keeps the softmax stable as the vector width grows." },
    { id: "exp", label: "Exponentials", dur: 4.9, caption: "Exponentials turn relative gaps into positive attention mass." },
    { id: "weights", label: "Normalize", dur: 4.8, caption: "Normalizing makes the three weights sum to one." },
    { id: "values", label: "Mix values", dur: 4.7, caption: "Those weights blend the value signals into one context read." },
    { id: "detail", label: "Inspect math", dur: 4.6, caption: "The lower detail band keeps every intermediate quantity inspectable." },
    { id: "why", label: "Why it matters", dur: 5.7, caption: "Attention stays interpretable because one query becomes one weighted read over context." }
  ];

  function svg(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([name, value]) => node.setAttribute(name, value));
    if (text != null) node.textContent = text;
    return node;
  }

  function panel(y, eyebrow, title, lines, accent) {
    const g = svg("g", { opacity: 0 });
    g.appendChild(svg("rect", { x: 92, y, width: 816, height: 118, rx: 24, fill: "var(--ex-panel)", stroke: "var(--ex-line)" }));
    g.appendChild(svg("text", { x: 122, y: y + 28, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, eyebrow));
    g.appendChild(svg("text", { x: 122, y: y + 58, fill: "var(--ex-ink)", "font-family": "var(--font-display)", "font-style": "italic", "font-size": 26 }, title));
    lines.forEach((line, index) => {
      g.appendChild(svg("text", { x: 122, y: y + 84 + index * 20, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, line));
    });
    g.bar = svg("rect", { x: 122, y: y + 94, width: 0, height: 8, rx: 4, fill: accent || "var(--ex-accent)" });
    g.appendChild(g.bar);
    return g;
  }

  function build(stage, opts) {
    S.beats = {};
    opts.beats.forEach((beat) => { S.beats[beat.id] = beat; });
    stage.textContent = "";
    const root = svg("svg", { xmlns: NS, viewBox: "0 0 1000 464", width: 1000, height: 464, role: "img", "aria-label": meta.title });
    root.appendChild(svg("rect", { x: 0, y: 0, width: 1000, height: 464, fill: "var(--ex-ground)" }));

    S.anchor = svg("g", {});
    S.anchor.appendChild(svg("rect", { x: 64, y: 40, width: 872, height: 72, rx: 24, fill: "var(--ex-panel-hi)", stroke: "var(--ex-line)" }));
    S.anchor.appendChild(svg("text", { x: 96, y: 68, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, "ANCHOR"));
    S.anchor.appendChild(svg("text", { x: 96, y: 96, fill: "var(--ex-ink)", "font-family": "var(--font-display)", "font-style": "italic", "font-size": 28 }, "One query, three remembered keys"));
    ["q", "k₁", "k₂", "k₃"].forEach((label, index) => {
      const x = 610 + index * 72;
      S.anchor.appendChild(svg("rect", { x, y: 58, width: 56, height: 32, rx: 16, fill: index === 0 ? "var(--ex-accent-fill)" : "var(--ex-cell)", stroke: index === 0 ? "var(--ex-accent)" : "var(--ex-line)" }));
      S.anchor.appendChild(svg("text", { x: x + 20, y: 79, fill: "var(--ex-ink)", "font-family": "var(--font-mono)", "font-size": 14 }, label));
    });
    root.appendChild(S.anchor);

    S.scenes = [
      panel(138, "01 — anchor", "One query, three keys", ["q = [2, 1] reads across three stored keys."], "var(--ex-accent)"),
      panel(138, "02 — score", "Dot products", DATA.scores.map((score, index) => `score${index + 1} = ${score.toFixed(2)}`), "var(--ex-support)"),
      panel(138, "03 — scale", "Divide by √2", DATA.scaled.map((score, index) => `scaled${index + 1} = ${score.toFixed(3)}`), "var(--ex-accent2)"),
      panel(138, "04 — exp", "Exponentials", DATA.exp.map((value, index) => `exp${index + 1} = ${value.toFixed(3)}`), "var(--ex-peach)"),
      panel(138, "05 — weights", "Softmax weights", DATA.weights.map((value, index) => `w${index + 1} = ${value.toFixed(3)}`), "var(--ex-accent)"),
      panel(138, "06 — values", "Weighted values", DATA.values.map((value, index) => `v${index + 1} = ${value.toFixed(2)}`), "var(--ex-support)"),
      panel(138, "07 — detail", "Inspect the math", ["Every number shown here is derived in code."], "var(--ex-accent2)"),
      panel(138, "08 — payoff", "Weighted read", [`context = ${DATA.context.toFixed(3)}`, "One query becomes one weighted summary."], "var(--ex-accent)")
    ];
    S.scenes.forEach((scene) => root.appendChild(scene));

    S.detail = svg("g", { opacity: 1 });
    S.detail.appendChild(svg("rect", { x: 64, y: 322, width: 872, height: 102, rx: 24, fill: "var(--ex-panel-lo)", stroke: "var(--ex-line)" }));
    S.detail.appendChild(svg("text", { x: 92, y: 350, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, "DETAIL BAND"));
    S.detail.appendChild(svg("text", { x: 92, y: 378, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, `scores = ${DATA.scores.map((value) => value.toFixed(2)).join(', ')}`));
    S.detail.appendChild(svg("text", { x: 92, y: 402, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, `weights = ${DATA.weights.map((value) => value.toFixed(3)).join(', ')} · sum = ${DATA.sumWeights.toFixed(3)}`));
    S.detail.appendChild(svg("text", { x: 92, y: 422, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 15 }, `context = ${DATA.context.toFixed(3)} from values ${DATA.values.map((value) => value.toFixed(2)).join(', ')}`));
    root.appendChild(S.detail);

    stage.appendChild(root);
    S.svg = root;
    window.__REGIONS = () => ({ working: S.scenes });
    window.__LAYOUT = () => [S.anchor, ...S.scenes, S.detail];
  }

  function render(t, ctx) {
    const fadeAnchor = ex.ramp(t, 0, 1.2, ex.ease.warmIn);
    S.anchor.setAttribute("opacity", fadeAnchor.toFixed(3));
    S.scenes.forEach((scene, index) => {
      const beat = ctx.beats[index];
      const opacity = ex.seg(t, beat.start, beat.end, 0.42);
      scene.setAttribute("opacity", opacity.toFixed(3));
      scene.bar.setAttribute("width", (Math.max(0, opacity) * 210).toFixed(2));
    });
    const detailOn = S.math && (!ctx.flags || ctx.flags.math !== false);
    S.detail.setAttribute("opacity", detailOn ? ex.ramp(t, 0.4, 0.8, ex.ease.defer).toFixed(3) : "0");
  }

  function setMath(on) {
    S.math = !!on;
  }

  const episode = { meta, beats, build, render, setMath, setDetail: setMath };
  window.__AUDIT = () => ({ ok: Math.abs(DATA.sumWeights - 1) < 1e-9, msg: "weights sum to 1", note: `context=${DATA.context.toFixed(3)}` });
  window.EXPLAINER = episode;
})();
