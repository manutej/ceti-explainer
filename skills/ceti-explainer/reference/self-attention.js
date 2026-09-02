(function () {
  const NS = "http://www.w3.org/2000/svg";
  const ex = window.CetiExplainer;
  const S = { beats: {}, scenes: [], math: true };
  const DATA = (() => {
    const q = [2, 1];
    const keys = [[1, 0], [0, 2], [2, 1]];
    const labels = ["the", "word", "context"];
    const values = [0.2, 0.5, 0.9];
    const raw = keys.map((key) => q[0] * key[0] + q[1] * key[1]);
    const scale = Math.sqrt(q.length);
    const scaled = raw.map((score) => score / scale);
    const maxScaled = Math.max(...scaled);
    const shifted = scaled.map((score) => score - maxScaled);
    const exp = shifted.map((score) => Math.exp(score));
    const sumExp = exp.reduce((sum, value) => sum + value, 0);
    const weights = exp.map((value) => value / sumExp);
    const context = weights.reduce((sum, weight, index) => sum + weight * values[index], 0);
    return { q, keys, labels, values, raw, scaled, exp, weights, context, sumWeights: weights.reduce((sum, value) => sum + value, 0) };
  })();

  const meta = {
    id: "self-attention",
    eyebrow: "Worked attention read",
    title: "Self-attention with one exact softmax",
    lede: "Follow a single query as it scores three keys, turns those scores into weights, and mixes values into one context read.",
    synthTitle: "Why the mechanism sticks",
    tag: "Self-attention worked example",
    synthesis: "Self-attention is a weighted read over context: one query scores every key, the softmax turns those scores into weights, and the value mix produces the context the next layer uses."
  };

  const beats = [
    { id: "anchor", label: "Set the anchor", dur: 4.6, caption: "One query will read across three keys that stand in for nearby tokens." },
    { id: "score", label: "Score q·k", dur: 4.8, caption: "Dot products say how much each key lines up with the query." },
    { id: "scale", label: "Scale it", dur: 4.7, caption: "Divide by √2 so the softmax sees tempered score gaps." },
    { id: "exp", label: "Exponentials", dur: 4.8, caption: "Exponentials keep everything positive while preserving the ranking." },
    { id: "weights", label: "Normalize", dur: 4.9, caption: "Softmax turns the three exponentials into weights that sum to one." },
    { id: "mix", label: "Mix values", dur: 4.7, caption: "Those weights now scale the value signals attached to each key." },
    { id: "context", label: "Read context", dur: 4.5, caption: "Adding the weighted values yields one context number for this query." },
    { id: "why", label: "Why it matters", dur: 5.6, caption: "Attention stays readable because every output can be traced back to a normalized weighted read." }
  ];

  function svg(tag, attrs, text) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([name, value]) => node.setAttribute(name, value));
    if (text != null) node.textContent = text;
    return node;
  }

  function buildRow(y, label, title, lines, accent) {
    const g = svg("g", { opacity: 0 });
    g.appendChild(svg("rect", { x: 84, y, width: 832, height: 122, rx: 24, fill: "var(--ex-panel)", stroke: "var(--ex-line)" }));
    g.appendChild(svg("text", { x: 118, y: y + 30, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, label));
    g.appendChild(svg("text", { x: 118, y: y + 62, fill: "var(--ex-ink)", "font-family": "var(--font-display)", "font-style": "italic", "font-size": 27 }, title));
    lines.forEach((line, index) => {
      g.appendChild(svg("text", { x: 118, y: y + 88 + index * 18, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, line));
    });
    g.bar = svg("rect", { x: 118, y: y + 100, width: 0, height: 8, rx: 4, fill: accent });
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
    S.anchor.appendChild(svg("rect", { x: 56, y: 34, width: 888, height: 84, rx: 24, fill: "var(--ex-panel-hi)", stroke: "var(--ex-line)" }));
    S.anchor.appendChild(svg("text", { x: 92, y: 64, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, "ANCHOR"));
    S.anchor.appendChild(svg("text", { x: 92, y: 96, fill: "var(--ex-ink)", "font-family": "var(--font-display)", "font-style": "italic", "font-size": 28 }, "Query q = [2, 1] reads three remembered keys"));
    DATA.labels.forEach((label, index) => {
      const x = 616 + index * 96;
      S.anchor.appendChild(svg("rect", { x, y: 56, width: 74, height: 34, rx: 17, fill: index === 2 ? "var(--ex-accent-fill)" : "var(--ex-cell)", stroke: index === 2 ? "var(--ex-accent)" : "var(--ex-line)" }));
      S.anchor.appendChild(svg("text", { x: x + 15, y: 78, fill: "var(--ex-ink)", "font-family": "var(--font-mono)", "font-size": 13 }, label));
    });
    root.appendChild(S.anchor);

    S.scenes = [
      buildRow(138, "01 — anchor", "One query, three keys", ["q = [2, 1] and keys keep three token memories in reach."], "var(--ex-accent)"),
      buildRow(138, "02 — score", "Raw dot products", DATA.raw.map((score, index) => `${DATA.labels[index]}: ${score.toFixed(2)}`), "var(--ex-support)"),
      buildRow(138, "03 — scale", "Divide by √2", DATA.scaled.map((score, index) => `${DATA.labels[index]}: ${score.toFixed(3)}`), "var(--ex-accent2)"),
      buildRow(138, "04 — exp", "Shift and exponentiate", DATA.exp.map((value, index) => `${DATA.labels[index]}: ${value.toFixed(3)}`), "var(--ex-peach)"),
      buildRow(138, "05 — weight", "Softmax weights", DATA.weights.map((value, index) => `${DATA.labels[index]}: ${value.toFixed(3)}`), "var(--ex-accent)"),
      buildRow(138, "06 — values", "Attach value signals", DATA.values.map((value, index) => `${DATA.labels[index]}: ${value.toFixed(2)}`), "var(--ex-support)"),
      buildRow(138, "07 — mix", "Weighted context", [`0.2·${DATA.weights[0].toFixed(3)} + 0.5·${DATA.weights[1].toFixed(3)} + 0.9·${DATA.weights[2].toFixed(3)}`], "var(--ex-accent2)"),
      buildRow(138, "08 — payoff", "One weighted read", [`context = ${DATA.context.toFixed(3)}`, `weights sum = ${DATA.sumWeights.toFixed(3)}`], "var(--ex-accent)")
    ];
    S.scenes.forEach((scene) => root.appendChild(scene));

    S.detail = svg("g", { opacity: 1 });
    S.detail.appendChild(svg("rect", { x: 56, y: 320, width: 888, height: 108, rx: 24, fill: "var(--ex-panel-lo)", stroke: "var(--ex-line)" }));
    S.detail.appendChild(svg("text", { x: 92, y: 348, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12, "letter-spacing": "0.12em" }, "DETAIL BAND"));
    S.detail.appendChild(svg("text", { x: 92, y: 376, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, `q·k = ${DATA.raw.map((value) => value.toFixed(2)).join(', ')} and scaled = ${DATA.scaled.map((value) => value.toFixed(3)).join(', ')}`));
    S.detail.appendChild(svg("text", { x: 92, y: 398, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 16 }, `weights = ${DATA.weights.map((value) => value.toFixed(3)).join(', ')} so Σw = ${DATA.sumWeights.toFixed(3)}`));
    S.detail.appendChild(svg("text", { x: 92, y: 420, fill: "var(--ex-ink)", "font-family": "var(--font-sans)", "font-size": 15 }, `context = ${DATA.context.toFixed(3)} from values ${DATA.values.map((value) => value.toFixed(2)).join(', ')}`));
    root.appendChild(S.detail);

    S.tagProbe = svg("text", { x: 816, y: 110, fill: "var(--ex-dim)", "font-family": "var(--font-mono)", "font-size": 12 }, meta.tag);
    ex.fit(S.tagProbe, 120);
    root.appendChild(S.tagProbe);

    stage.appendChild(root);
    S.svg = root;
    window.__REGIONS = () => ({ working: S.scenes });
    window.__LAYOUT = () => [S.anchor, ...S.scenes, S.detail];
  }

  function render(t, ctx) {
    S.anchor.setAttribute("opacity", ex.ramp(t, 0, 1.2, ex.ease.warmIn).toFixed(3));
    S.scenes.forEach((scene, index) => {
      const beat = ctx.beats[index];
      const opacity = ex.seg(t, beat.start, beat.end, 0.42);
      scene.setAttribute("opacity", opacity.toFixed(3));
      scene.bar.setAttribute("width", (opacity * 230).toFixed(2));
    });
    const detailOn = S.math && (!ctx.flags || ctx.flags.math !== false);
    S.detail.setAttribute("opacity", detailOn ? ex.ramp(t, 0.35, 0.9, ex.ease.defer).toFixed(3) : "0");
    S.tagProbe.setAttribute("opacity", ex.ramp(t, 0.6, 1.2, ex.ease.defer).toFixed(3));
  }

  function setMath(on) {
    S.math = !!on;
  }

  window.__AUDIT = () => ({ ok: Math.abs(DATA.sumWeights - 1) < 1e-9, msg: "weights sum to 1", note: `context=${DATA.context.toFixed(3)}` });
  window.EXPLAINER = { meta, beats, build, render, setMath, setDetail: setMath };
})();
