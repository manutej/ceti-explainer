/* ════════════════════════════════════════════════════════════════════
   Browser overlap auditor — the font-accurate belt-and-suspenders check.
   --------------------------------------------------------------------
   The gate's §15d uses estimated text widths; THIS runs in a real browser
   with the actual fonts, so it catches font-metric collisions the headless
   check can't. Use it after any font/brand change, and as the final QA.

   How to run:
     • Open the built .html in a browser, open DevTools console, paste this
       whole file, and read the JSON it returns; OR
     • via the Chrome tools: execute_javascript with this file's contents.

   It seeks the middle of every beat (and each 7→8-style boundary), then for
   every VISIBLE <text> reports: (a) overflow past the stage edges, and
   (b) pairwise overlap with another visible <text>. Returns a JSON report;
   an empty "issues" array per beat means clean.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const ctrl = window.__ctrl, svg = document.querySelector("[data-ex-stage] svg");
  if (!ctrl || !svg) return JSON.stringify({ error: "player/svg not found" });
  const beats = ctrl.beats, dur = ctrl.duration;
  const VW = 1000, EDGE = 6;

  function effOpacity(node) {
    let o = 1, n = node;
    while (n && n !== svg.parentNode) {
      const s = getComputedStyle(n); const v = parseFloat(s.opacity);
      o *= isNaN(v) ? 1 : v; n = n.parentNode;
    }
    return o;
  }
  const overlap = (a, b) => {
    const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return ox > EDGE && oy > 4 ? { ox: Math.round(ox), oy: Math.round(oy) } : null;
  };

  function sampleAt(t) {
    ctrl.seek(t);
    const texts = [...svg.querySelectorAll("text")]
      .filter(n => n.textContent.trim() && effOpacity(n) > 0.55)
      .map(n => ({ n, t: n.textContent.slice(0, 22), bb: n.getBBox() }));
    const issues = [];
    texts.forEach(o => {
      if (o.bb.x < EDGE || o.bb.x + o.bb.width > VW - EDGE)
        issues.push({ type: "edge", text: o.t, x: Math.round(o.bb.x), w: Math.round(o.bb.width) });
    });
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const ov = overlap(texts[i].bb, texts[j].bb);
      if (ov) issues.push({ type: "overlap", a: texts[i].t, b: texts[j].t, by: ov.ox + "x" + ov.oy });
    }
    return issues;
  }

  const report = [];
  beats.forEach((b, i) => {
    const mid = sampleAt(b.start + b.dur / 2);
    if (mid.length) report.push({ beat: i + 1, label: b.label, where: "mid", issues: mid.slice(0, 10) });
    if (i < beats.length - 1) { // boundary into the next beat
      const bnd = sampleAt(b.end);
      if (bnd.length) report.push({ beat: i + 1, label: b.label + "→" + beats[i + 1].label, where: "boundary", issues: bnd.slice(0, 10) });
    }
  });
  ctrl.seek(0);
  return JSON.stringify({ ok: report.length === 0, beats: beats.length, problems: report }, null, 1);
})();
