/* arsenal/patterns/generator/pattern.js · one scene, three generator authorings ([[generator-scenes]], [[timeline-builder]]).
   A packet is handed along n nodes; the same drawing is driven by three different scripts compiled once in setup(). */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const G = () => window.ARSENAL.generator;
  const DUR = 8;

  function layoutOf(n, kind) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      if (kind === 'ring') { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; pts.push({ x: 480 + 190 * Math.cos(a), y: 295 + 170 * Math.sin(a) }); }
      else pts.push({ x: 150 + (i * 660) / Math.max(1, n - 1), y: 300 });
    }
    return pts;
  }

  // the three authoring styles: same state graph, different prose
  const AUTHOR = {
    // 1. strictly sequential: yield* tween, yield wait. Reads like a script.
    sequence(g, s, P) {
      const { tween, wait, all } = g;
      return function* () {
        yield* tween(s.title, { a: 1 }, 0.5, 'outCubic');
        for (const nd of s.nodes) yield* tween(nd, { s: 1 }, 0.25, 'outBack');
        yield wait(0.3);
        yield* tween(s.pkt, { x: s.nodes[0].x, y: s.nodes[0].y, a: 1 }, 0.3, 'outCubic');
        for (let i = 0; i < s.nodes.length; i++) {
          if (i > 0) { yield* tween(s.pkt, { x: s.nodes[i].x, y: s.nodes[i].y }, P.hop_s, 'inOutCubic'); yield* tween(s.links[i - 1], { p: 1 }, 0.1, 'linear'); }
          yield* tween(s.nodes[i], { lit: 1 }, 0.2, 'outCubic');
          yield* tween(s.count, { v: i + 1 }, 0.2, 'linear');
          yield wait(0.15);
        }
        yield* tween(s.pkt, { a: 0 }, 0.3, 'linear');
      };
    },
    // 2. cascade: all() and stagger() overlap the beats; links draw while the packet is still travelling.
    cascade(g, s, P) {
      const { tween, wait, all, stagger, label } = g;
      return function* () {
        yield* all(tween(s.title, { a: 1 }, 0.5, 'outCubic'), stagger(0.12, ...s.nodes.map((nd) => tween(nd, { s: 1 }, 0.35, 'outBack'))));
        yield label('go');
        yield* tween(s.pkt, { x: s.nodes[0].x, y: s.nodes[0].y, a: 1 }, 0.25, 'outCubic');
        yield* tween(s.nodes[0], { lit: 1 }, 0.2, 'outCubic');
        for (let i = 1; i < s.nodes.length; i++) {
          yield* all(
            tween(s.pkt, { x: s.nodes[i].x, y: s.nodes[i].y }, P.hop_s, 'inOutCubic'),
            tween(s.links[i - 1], { p: 1 }, P.hop_s, 'inOutCubic'),
            tween(s.count, { v: i + 1 }, P.hop_s, 'linear'),
            (function* () { yield wait(P.hop_s * 0.8); yield* tween(s.nodes[i], { lit: 1 }, 0.25, 'outCubic'); })()
          );
        }
        yield* all(tween(s.pkt, { a: 0 }, 0.3, 'linear'), tween(s.pulse, { v: 1 }, 0.5, 'outExpo'));
      };
    },
    // 3. relay: a loop of hops with a return trip and a closing pulse; control flow (for / if) is the point.
    relay(g, s, P) {
      const { tween, wait, all, stagger } = g;
      return function* () {
        yield* all(tween(s.title, { a: 1 }, 0.4, 'outCubic'), ...s.nodes.map((nd) => tween(nd, { s: 1 }, 0.4, 'outExpo')));
        yield* tween(s.pkt, { x: s.nodes[0].x, y: s.nodes[0].y, a: 1 }, 0.2, 'outCubic');
        const n = s.nodes.length; let hops = 0;
        for (const dir of [1, -1]) {                         // out along the chain, then back
          const order = dir === 1 ? [...Array(n).keys()].slice(1) : [...Array(n).keys()].reverse().slice(1);
          let at = dir === 1 ? 0 : n - 1;
          for (const i of order) {
            yield* all(tween(s.pkt, { x: s.nodes[i].x, y: s.nodes[i].y }, P.hop_s * 0.7, 'inOutCubic'),
                       tween(s.links[Math.min(i, at)], { p: dir === 1 ? 1 : 0 }, P.hop_s * 0.7, 'linear'));
            yield* all(tween(s.nodes[i], { lit: dir === 1 ? 1 : 0.35 }, 0.15, 'outCubic'), tween(s.count, { v: ++hops }, 0.01, 'linear'));
            at = i;
          }
          yield wait(0.2);
        }
        yield* all(tween(s.pkt, { a: 0 }, 0.2, 'linear'), stagger(0.07, ...s.nodes.map((nd) => tween(nd, { lit: 1 }, 0.3, 'outCubic'))));
        yield* tween(s.pulse, { v: 1 }, 0.5, 'outExpo');
      };
    },
  };

  window.ARSENAL.patterns['generator'] = {
    id: 'generator', atlas: ['generator-scenes', 'timeline-builder', 'pure-function-of-t'], renderer: 'p2d',
    params: { author: 'sequence', layout: 'row', n: 5, hop_s: 0.6, dur: DUR, seed: 7 },
    variants: [
      { name: 'sequence', params: { author: 'sequence', layout: 'row', n: 5, hop_s: 0.6 } },
      { name: 'cascade', params: { author: 'cascade', layout: 'row', n: 4, hop_s: 0.9 } },
      { name: 'relay', params: { author: 'relay', layout: 'ring', n: 6, hop_s: 0.5 } },
    ],
    setup(p, ctx, params) {
      const g = G(), P = Object.assign({}, this.params, params), pos = layoutOf(P.n, P.layout);
      // compile ONCE: initial values are the t=0 state, the generator only declares intervals
      const s = {
        title: { a: 0 }, pulse: { v: 0 }, count: { v: 0 }, pkt: { x: pos[0].x - 60, y: pos[0].y, a: 0 },
        nodes: pos.map((q) => ({ x: q.x, y: q.y, s: 0, lit: 0 })),
        links: pos.slice(1).map(() => ({ p: 0 })),
      };
      const sc = g.scene(AUTHOR[P.author](g, s, P), { init: s, dur: P.dur });
      return { sc, P, labels: sc.labels };
    },
    draw(p, t, st, params, tk) {
      const c = tk.color, P = st.P, v = st.sc.at(t), n = v.nodes.length;
      p.push(); p.background(c.bg); p.noStroke();
      const mono = '"' + tk.type.mono.family + '", ui-monospace, monospace', disp = '"' + tk.type.disp.family + '", Impact, sans-serif';
      // links (partial lines from node i toward node i+1)
      p.strokeWeight(2); p.drawingContext.setLineDash([]);
      for (let i = 0; i < n - 1; i++) {
        const a = v.nodes[i], b = v.nodes[i + 1], k = v.links[i].p;
        p.stroke(c.line); p.line(a.x, a.y, b.x, b.y);
        if (k > 0) { p.stroke(c.accent); p.strokeWeight(3); p.line(a.x, a.y, a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k); p.strokeWeight(2); }
      }
      // nodes
      for (let i = 0; i < n; i++) {
        const nd = v.nodes[i], r = 26 * Math.max(0, nd.s) * (1 + 0.35 * Math.sin(Math.PI * Math.min(1, v.pulse.v)) * (nd.lit > 0.9 ? 1 : 0));
        if (r <= 0.5) continue;
        p.noStroke(); p.fill(c.panel); p.circle(nd.x, nd.y, r * 2);
        const lit = p.drawingContext; lit.save(); lit.globalAlpha = Math.max(0, Math.min(1, nd.lit)); p.fill(c.accent); p.circle(nd.x, nd.y, r * 2); lit.restore();
        p.noFill(); p.stroke(nd.lit > 0.5 ? c.chalk : c.muted); p.strokeWeight(2); p.circle(nd.x, nd.y, r * 2);
        p.noStroke(); p.fill(nd.lit > 0.5 ? c.bg : c.ink); p.textFont(mono); p.textSize(16); p.textAlign(p.CENTER, p.CENTER); p.text(String.fromCharCode(65 + i), nd.x, nd.y + 1);
      }
      // packet
      if (v.pkt.a > 0.01) {
        const ctx = p.drawingContext; ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, v.pkt.a));
        p.noStroke(); p.fill(c.accent2); p.circle(v.pkt.x, v.pkt.y, 18); p.noFill(); p.stroke(c.accent2); p.strokeWeight(1.5); p.circle(v.pkt.x, v.pkt.y, 30); ctx.restore();
      }
      // title + count (typeset, the only words)
      const ctx2 = p.drawingContext; ctx2.save(); ctx2.globalAlpha = Math.max(0, Math.min(1, v.title.a));
      p.noStroke(); p.fill(c.ink); p.textAlign(p.LEFT, p.TOP); p.textFont(disp); p.textSize(44); p.text('HANDOFF', 48, 40);
      p.textFont(mono); p.textSize(14); p.fill(c.muted); p.text('authored as ' + P.author + ' · compiled once', 50, 92);
      p.textAlign(p.RIGHT, p.TOP); p.textFont(disp); p.textSize(88); p.fill(c.accent); p.text(String(Math.round(v.count.v)), 912, 30);
      p.textFont(mono); p.textSize(14); p.fill(c.muted); p.text('HOPS', 912, 118);
      ctx2.restore();
      // clock bar (a pure readout of t)
      p.noStroke(); p.fill(c.line); p.rect(48, 510, 864, 3); p.fill(c.accent); p.rect(48, 510, 864 * Math.min(1, t / st.sc.dur), 3);
      p.pop();
    },
  };
})();
