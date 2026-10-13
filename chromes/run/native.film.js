/* THE RUN · native — "Tokens and the context window" (glance).
   Mark rule (native): each column is one token; each knitted row is one generation step, knitted through every
   stitch on the needle; the needle holds a fixed number of stitches (the context window). A new token casts on at
   the right; the oldest is bound off at the left. Tokens come from a real byte-pair-encoding tokenizer trained in
   setup on this film's own script (a toy: real tokenizers learn ~100k pieces). Control: the number of BPE merges
   re-trains nothing, re-encodes everything, and re-knits the film. Kit (run.kit.js) is appended by make.sh. */
(function () {
  const NW = 24;                                    // needle length in stitches (sketch)
  const PROMPT = 'Reconcile invoice 4471 from ACME Corporation against our purchase orders.';
  const GEN = ' Fetching the purchase orders. 38 of 40 lines match. Two totals differ, so I will check each line again before I approve the payment.';
  const CORPUS = [
    'An agent reconciles invoices against purchase orders. It fetches the purchase orders, reads each invoice line, matches the line totals,',
    'and checks the vendor name and the tax ID. When a line does not match, it checks the order again before it approves the payment.',
    'The invoice total must match the order total. Each payment needs an approval. The agent reads the order, the invoice and the payment',
    'record, then it writes a short report of what matched and what did not. Reconciling is slow work: every invoice from every corporation',
    'has lines, and every line has a total. A purchase order from a corporation lists the lines the company agreed to buy. Fetching the orders',
    'is the first step; matching the lines is the second; checking the totals is the third; approving the payment is the last. If two totals',
    'differ, the agent will check the line again, and it will check the vendor before it approves anything. The report lists the lines that',
    'match, the lines that differ, and the orders it could not find. A corporation may send an invoice against several purchase orders.',
    'Reconcile the invoice, check the lines, approve the payment, and report. Before the payment, check the order. Before the report, check the totals.',
    PROMPT, GEN].join(' ');
  const FACT = 'ACME';
  const MMAX = 300;

  /* ── a real BPE: train merges on CORPUS once; encode with the first M merges ── */
  const chunks = s => s.match(/ ?[A-Za-z]+| ?[0-9]+| ?[^A-Za-z0-9 ]+| +/g) || [];
  const SEP = '\u0001';
  function train(corpus, max) {
    const fq = new Map(); for (const c of chunks(corpus)) fq.set(c, (fq.get(c) || 0) + 1);
    const words = [...fq.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([w, n]) => ({ s: Array.from(w), n }));
    const merges = [];
    for (let m = 0; m < max; m++) {
      const pc = new Map();
      for (const w of words) for (let i = 0; i < w.s.length - 1; i++) { const k = w.s[i] + SEP + w.s[i + 1]; pc.set(k, (pc.get(k) || 0) + w.n); }
      let best = null, bn = 1;
      for (const [k, n] of pc) if (n > bn || (n === bn && best !== null && k < best)) { best = k; bn = n; }
      if (!best) break;
      const [a, b] = best.split(SEP); merges.push([a, b]);
      for (const w of words) { const o = []; for (let i = 0; i < w.s.length; i++) { if (i < w.s.length - 1 && w.s[i] === a && w.s[i + 1] === b) { o.push(a + b); i++; } else o.push(w.s[i]); } w.s = o; }
    }
    return merges;
  }
  const MERGES = train(CORPUS, MMAX);
  function encode(text, M) {
    const rank = new Map(); MERGES.slice(0, M).forEach(([a, b], i) => rank.set(a + SEP + b, i));
    const out = []; let off = 0;
    for (const c of chunks(text)) {
      let s = Array.from(c);
      for (;;) {
        let br = Infinity, bi = -1;
        for (let i = 0; i < s.length - 1; i++) { const r = rank.get(s[i] + SEP + s[i + 1]); if (r !== undefined && r < br) { br = r; bi = i; } }
        if (bi < 0) break;
        const a = s[bi], b = s[bi + 1], o = [];
        for (let i = 0; i < s.length; i++) { if (i < s.length - 1 && s[i] === a && s[i + 1] === b) { o.push(a + b); i++; } else o.push(s[i]); }
        s = o;
      }
      for (const tk of s) { out.push({ text: tk, at: off }); off += tk.length; }
    }
    return out;
  }
  /** everything the film shows, as a pure function of the merge count */
  function model(M) {
    M = Math.max(0, Math.min(MERGES.length, Math.round(M)));
    const all = PROMPT + GEN, toks = encode(PROMPT, M).concat(encode(GEN, M).map(t => ({ text: t.text, at: t.at + PROMPT.length })));
    const P = encode(PROMPT, M).length, G = toks.length - P;
    // word index per token (a token belongs to the word of its first non-space char)
    let wi = -1; const fa = all.indexOf(FACT), fb = fa + FACT.length;
    toks.forEach((t, i) => { if (i === 0 || t.text[0] === ' ') wi++; t.word = wi; t.fact = t.at < fb && t.at + t.text.length > fa; });
    const start = r => Math.max(0, P + r - NW);              // first token on the needle after r generated tokens
    const factIdx = toks.map((t, i) => (t.fact ? i : -1)).filter(i => i >= 0), lastFact = Math.max(...factIdx);
    const factNeverFit = lastFact < start(0);
    const factOffRow = factNeverFit ? 0 : Math.max(1, lastFact - P + NW + 1);  // first row with no fact stitch on the needle
    // the prompt word with the most tokens (the "one word, n tokens" callout)
    const per = new Map(); toks.slice(0, P).forEach((t, i) => { if (!per.has(t.word)) per.set(t.word, []); per.get(t.word).push(i); });
    let bestW = null; for (const [w, ids] of per) if (!bestW || ids.length > bestW.ids.length) bestW = { w, ids };
    return { M, toks, P, G, start, factIdx, lastFact, factNeverFit, factOffRow: Math.min(factOffRow, G + 1), bestW, cpt: all.length / toks.length };
  }
  const DEF = MERGES.length;
  // timeline
  const TK0 = 3.6, TK1 = 6.8, GEN0 = 8.0, GEN1 = 19.4, MID0 = 19.7, MID1 = 21.6, PB0 = 22.6, PB1 = 25.4;
  const rowT = (r, G) => (r === 0 ? TK1 : GEN0 + (r - 1) / Math.max(1, G) * (GEN1 - GEN0));
  const COL = { felt: '#E2D7C2', moorit: '#A8917A', grey: '#8A867E', copper: '#C27A33', light: '#EFE7D6', peach: '#E5652A', mooritF: '#C9B9A5', greyF: '#B9B6B0' };
  const D0 = model(DEF);
  const offT = rowT(D0.factOffRow, D0.G);

  Atelier.film({
    id: 'run-native',
    title: 'The Run — tokens and the context window',
    direction: 'G · The Run · knitted cloth',
    level: 'glance',
    duration: 28,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: COL.felt,
    chapters: [{ t: 0, label: 'Title' }, { t: TK0, label: 'Tokens, not words' }, { t: GEN0, label: 'Knitting the reply' }, { t: +offT.toFixed(2), label: 'A fact is dropped' }, { t: MID0, label: 'The middle' }, { t: PB0, label: 'The whole scarf' }],
    captions: [
      { t0: 0.2, t1: TK0, text: 'A language model reads and writes text as tokens: pieces of words, not words.' },
      { t0: TK0, t1: GEN0, text: 'Each token is one stitch. The needle holds a fixed number: the context window.' },
      { t0: GEN0, t1: 10.4, text: 'Each new token is knitted as a row through every stitch on the needle.' },
      { t0: 10.4, t1: offT, text: 'The needle is full. This app then drops the oldest token for every new one.' },
      { t0: offT, t1: MID0, text: 'ACME has been dropped. From this row on, the model cannot see it at all.' },
      { t0: MID0, t1: PB0, text: 'Sketch: even on the needle, models often recall the middle less well than the ends.' },
      { t0: PB0, t1: 28, text: 'The reply is the whole scarf, but the model only ever sees what is on the needle.' },
    ],
    state: { merges: DEF },
    controls: [{ key: 'merges', type: 'range', label: 'Tokenizer vocabulary (BPE merges learned)', min: 0, max: MERGES.length, step: 1,
      hint: '0 = one token per character. More merges = longer pieces, so more words fit on the same needle.', format: v => Math.round(v) + ' merges', jump: GEN0 }],
    engine: ctx => model(ctx.state.merges),

    setup(p, ctx) {
      const KIT = window.RunKit; KIT.atlas();
      ctx.pal = [KIT.srgb(COL.moorit), KIT.srgb(COL.grey), KIT.srgb(COL.copper), KIT.srgb(COL.light), KIT.srgb(COL.peach), KIT.srgb(COL.mooritF), KIT.srgb(COL.greyF)];
      const C = 400, Rr = 400;
      ctx.g = { cols: 0, rows: 1, kind: new Uint8Array(C * Rr), col: new Uint8Array(C * Rr), pal: ctx.pal, colX: new Float32Array(C), colW: new Float32Array(C), colA: new Float32Array(C).fill(1),
        sag: new Float32Array(C), y0: 0, rowH: 1, clip: [0, 0, 960, 540], idBase: 0, colBase: 0, jit: 0.1 };
      ctx.tg = { cols: 0, rows: 1, kind: new Uint8Array(200 * 20), col: new Uint8Array(200 * 20), pal: ctx.pal, colX: new Float32Array(200), colW: new Float32Array(200), colA: new Float32Array(200).fill(1),
        sag: new Float32Array(200), y0: 0, rowH: 1, clip: [0, 0, 960, 540], idBase: 0, colBase: 0, jit: 0.1 };
      ctx.title = KIT.chart('THE CONTEXT WINDOW', 10, { weight: 600, track: 0.22 });
    },

    draw(p, t, ctx) {
      const KIT = window.RunKit, U = ctx.U, T = ctx.tokens, E = ctx.engine, KD = KIT.KIND, HU = KIT.HU, dc = p.drawingContext;
      const rk = Math.min(ctx.size.k, 1.5);
      if (!ctx.R || ctx.R.scale !== rk) { ctx.R = KIT.renderer(960, 540, rk); ctx.R.vig = 0.14; }
      const R = ctx.R; KIT.felt(R, U, KIT.srgb(COL.felt)); KIT.clear(R);
      const { toks, P, G, start } = E, NT = P + G;
      const pb = U.smoothstep(0, 1, U.clamp((t - PB0) / (PB1 - PB0)));
      const pitchF = Math.min(14, 800 / NT, 370 / ((G + 1) * HU));
      const pitch = Math.exp(U.lerp(Math.log(27), Math.log(pitchF), pb)), NY = U.lerp(262, 150, pb), X0 = 910 - NW * pitch, rowH = HU * pitch;
      const fmt = v => Math.round(v).toLocaleString('en-US');

      /* ── rows formed (row 0 = reading the prompt; row r = r tokens generated) ── */
      let rf = 0; if (t >= TK1) { rf = 1; for (let r = 1; r <= G; r++) if (t >= rowT(r, G)) rf = r + 1; }
      const rNew = rf - 1, ph = rf ? U.ease.settle(U.clamp((t - rowT(Math.max(0, rNew), G)) / Math.min(0.28, 0.85 * (GEN1 - GEN0) / Math.max(1, G)))) : 0;
      const mid = U.smoothstep(0, 1, U.clamp((t - MID0) / (MID1 - MID0))) * (1 - pb);
      const castF = t < TK1 ? U.clamp((t - TK0) / (TK1 - 0.5 - TK0)) * P : P, castN = Math.floor(castF + 1e-9);
      const sC = rf ? U.lerp(start(Math.max(0, rNew - 1)), start(Math.max(0, rNew)), rNew > 0 ? ph : 1) : Math.max(0, castF - NW);
      const xOf = i => X0 + (i - sC) * pitch;
      const live0 = rf ? start(Math.max(0, rNew)) : Math.max(0, castN - NW), live1 = rf ? P + Math.max(0, rNew) : castN;
      const baseCol = tk => (tk.fact ? 2 : (tk.word % 2 ? 1 : 0));

      /* ── the cloth ── */
      const g = ctx.g;
      if (rf > 0) {
        g.cols = NT; g.rows = rf; g.rowH = rowH; g.y0 = NY + (ph - 1) * rowH; g.idBase = rf - 1; g.clip = [0, NY - 0.05 * pitch, 960, 540];
        for (let i = 0; i < NT; i++) {
          g.colX[i] = xOf(i); g.colW[i] = pitch; g.colA[i] = 1; g.sag[i] = 0;
          const tk = toks[i], bc = baseCol(tk), rLast = i - P + NW;
          for (let m = 0; m < rf; m++) {
            const r = rf - 1 - m, on = i < P + r && i >= start(r);
            let kind = on ? KD.KNIT : KD.EMPTY, col = bc;
            if (on && r === rLast && r < rf - 1) { kind = KD.BIND; if (tk.fact) col = 4; }
            if (on && m <= 2 && mid > 0) {   // lost in the middle (sketch): the middle of the needle is held loosely, its colour fades
              const d = (i - start(r)) / NW, hw = 0.24 * mid;
              if (Math.abs(d - 0.5) < hw) { kind = KD.LOOSE; if (!tk.fact) col = bc === 1 ? 6 : 5; }
            }
            g.kind[i * rf + m] = kind; g.col[i * rf + m] = col;
          }
        }
        KIT.paint(R, g);
      } else if (castN > 0) {
        g.cols = castN; g.rows = 1; g.rowH = rowH; g.y0 = NY - 0.45 * rowH; g.idBase = 0; g.clip = [0, NY - 0.05 * pitch, 960, 540];
        for (let i = 0; i < castN; i++) { g.colA[i] = i >= Math.floor(sC) ? 1 : 0; g.colX[i] = xOf(i); g.colW[i] = pitch; g.sag[i] = 0; g.kind[i] = KD.KNIT; g.col[i] = baseCol(toks[i]); }
        KIT.paint(R, g);
      }

      /* ── title cloth (undyed yarn, ecru letters knitted in) ── */
      const tl = ctx.title, TW = tl.w + 12, TR = tl.h + 4, gone = U.clamp((t - 3.0) / 0.7);
      if (t < 3.8) {
        const tg = ctx.tg, tp = 880 / TW, tf = U.clamp((t - 0.25) / 2.1) * TR, fr = Math.min(TR, Math.floor(tf)), pp = fr >= TR ? 1 : U.ease.settle(tf - fr), rws = Math.min(TR, fr + 1);
        const yN = 210 + 600 * gone * gone;
        tg.cols = TW; tg.rows = rws; tg.rowH = HU * tp; tg.y0 = yN + (pp - 1) * HU * tp; tg.idBase = rws - 1; tg.clip = [0, yN - 2, 960, 540];
        for (let c = 0; c < TW; c++) {
          tg.colX[c] = 40 + c * tp; tg.colW[c] = tp; tg.colA[c] = 1; tg.sag[c] = 0;
          for (let m = 0; m < rws; m++) { const y = rws - 1 - m - 2, cx = c - 6; const bit = y >= 0 && y < tl.h && cx >= 0 && cx < tl.w ? tl.bits[(tl.h - 1 - y) * tl.w + cx] : 0; tg.kind[c * rws + m] = KD.KNIT; tg.col[c * rws + m] = bit ? 3 : 0; }
        }
        KIT.paint(R, tg);
        ctx.tN = [30, 930, yN];
      }

      KIT.finish(R, p, { blur: 3, dx: 2, dy: 3.5, shadow: 0.3 });
      const slate = { hi: '#E3ECF3', mid: '#7F98AF', lo: '#2F4458' };
      if (t < 3.8) KIT.needle(p, ctx.tN[0], ctx.tN[1], ctx.tN[2], 9, slate);
      if (t >= TK0 - 0.4) {
        const a = U.clamp((t - (TK0 - 0.4)) / 0.4);
        dc.save(); dc.globalAlpha = a; KIT.needle(p, X0 - 0.35 * pitch, X0 + (NW + 0.35) * pitch, NY, Math.max(3, 0.3 * pitch), slate); dc.restore();
      }

      /* ── token labels, horizontal, in three tiers above their live stitches ── */
      const la = 1 - U.clamp((t - PB0) / 0.6);
      if (la > 0) {
        dc.save(); dc.font = '400 14px "Space Mono"'; dc.textBaseline = 'alphabetic'; dc.textAlign = 'center';
        for (let i = Math.max(0, Math.floor(sC) - 1); i < Math.min(NT, Math.max(live1, castN)); i++) {
          const x = xOf(i) + pitch / 2; if (x < X0 - pitch * 1.2) continue;
          const leaving = i < live0 ? 1 - ph : 1, a = U.clamp((x - (X0 - pitch * 0.9)) / (pitch * 0.9)) * leaving * la;
          if (a <= 0.01 || (rf === 0 && i < sC - 0.5)) continue;
          const tk = toks[i], tier = i % 3, ty = NY - 0.3 * pitch - 14 - tier * 21;
          dc.globalAlpha = a; dc.fillStyle = 'rgba(30,33,36,0.35)'; dc.fillRect(x - 0.5, ty + 4, 1, NY - 0.3 * pitch - ty - 6);
          dc.fillStyle = tk.fact ? T.copper : T.ink; dc.fillText(tk.text.replace(/ /g, '·'), x, ty);
        }
        dc.restore();
      }

      /* ── the prompt, as tokens: dim once a token is dropped ── */
      const tA = U.clamp((t - 3.3) / 0.5);
      if (tA > 0) {
        dc.save(); dc.font = '400 20px Jost'; dc.textBaseline = 'alphabetic';
        const mw = s => dc.measureText(s).width, y = 50;
        let x = Math.max(40, 480 - mw(PROMPT) / 2); const xs = [];
        for (let i = 0; i < P; i++) {
          const tk = toks[i], w = mw(tk.text), lead = tk.text[0] === ' ' ? mw(' ') : 0;
          const gone2 = rf ? (i < start(Math.max(0, rNew)) ? 1 : 0) : (i < Math.floor(sC) ? 1 : 0);
          dc.globalAlpha = tA * (gone2 ? 0.45 : 1); dc.fillStyle = tk.fact ? (gone2 ? T.peach : T.copper) : T.ink;
          dc.fillText(tk.text, x, y);
          dc.globalAlpha = tA * (gone2 ? 0.3 : 1) * (i < castN || rf ? 1 : 0.3);
          dc.fillStyle = tk.fact ? COL.copper : (tk.word % 2 ? COL.grey : COL.moorit); dc.fillRect(x + lead + 1, y + 8, Math.max(2, w - lead - 2), 4);
          if (gone2 && tk.fact) { dc.globalAlpha = tA; dc.fillStyle = T.peach; dc.fillRect(x + lead, y - 7, w - lead, 2.2); }
          xs.push([x + lead, w - lead]); x += w;
        }
        const bw = E.bestW, ca = U.clamp((t - 4.6) / 0.5) * (1 - U.clamp((t - GEN0 - 2) / 0.6));
        if (bw && bw.ids.length > 1 && ca > 0) {
          const a0 = xs[bw.ids[0]]; dc.globalAlpha = ca; dc.fillStyle = T.ink; dc.font = '500 15px Jost'; dc.textBaseline = 'top';
          dc.fillText('↑ 1 word, ' + bw.ids.length + ' tokens', a0[0], y + 18);
        }
        dc.restore();
      }

      /* ── readouts (from the tokenizer and the needle) ── */
      if (t >= TK0) {
        const a = U.clamp((t - TK0) / 0.5);
        const onN = Math.max(0, Math.min(NW, live1 - live0));
        const lEnd = live1, wOk = new Map();
        for (let i = 0; i < NT; i++) { const w = toks[i].word, on = i >= live0 && i < lEnd; wOk.set(w, (wOk.has(w) ? wOk.get(w) : true) && on); }
        let words = 0; for (const v of wOk.values()) if (v) words++;
        dc.save(); dc.globalAlpha = a; dc.textBaseline = 'alphabetic'; dc.textAlign = 'left';
        dc.font = '500 18px Jost'; dc.fillStyle = T.ink; dc.fillText(onN + ' tokens on the needle', 40, 116);
        dc.font = '400 16px Jost'; dc.fillStyle = T.dim; dc.fillText('= ' + words + ' whole words', 40, 138);
        dc.fillText('toy tokenizer: ' + E.M + ' merges', 40, 160);
        const fOn = E.factIdx.some(i => i >= live0 && i < lEnd), fGone = rf && !fOn && !E.factNeverFit && rNew >= E.factOffRow;
        dc.font = '500 18px Jost';
        if (E.factNeverFit) { dc.fillStyle = T.peach; dc.fillText('ACME never fit on the needle', 40, 196); }
        else if (fGone) { dc.fillStyle = T.peach; dc.fillText('ACME dropped at row ' + E.factOffRow, 40, 196); dc.font = '400 15px Jost'; dc.fillStyle = T.dim; dc.fillText('the model can\u2019t see it now', 40, 216); }
        else if (fOn) { dc.fillStyle = T.copper; dc.fillText('ACME is on the needle', 40, 196); }
        dc.restore();
      }
      const ma = mid * (1 - U.clamp((t - (PB0 - 0.5)) / 0.5));
      if (ma > 0) {
        dc.save(); dc.globalAlpha = ma; dc.textAlign = 'center'; dc.textBaseline = 'alphabetic';
        dc.font = '500 17px Jost'; dc.fillStyle = T.ink; dc.fillText('sketch: the middle of the needle is held loosely', 600, 92);
        dc.font = '400 15px Jost'; dc.fillStyle = T.dim; dc.fillText('models often recall the start and end of their window best', 600, 112);
        dc.restore();
      }

      /* ── the final image: the whole scarf, and what the model can see ── */
      const fa = U.clamp((t - (PB1 - 0.3)) / 0.6);
      if (fa > 0 && rf > 1) {
        dc.save(); dc.globalAlpha = fa; dc.textBaseline = 'alphabetic';
        dc.font = '500 17px Jost'; dc.fillStyle = T.ink; dc.textAlign = 'right';
        dc.fillText('on the needle: all the model can see', 910, NY - 0.3 * pitch - 12);
        const mm = Math.floor((rf - 1) * 0.55), r = rf - 1 - mm, xl = xOf(start(r)) - 10, yl = NY + (mm + 0.5) * rowH;
        dc.fillStyle = T.peach; dc.fillText('dropped by the app, oldest first', xl, yl);
        if (!E.factNeverFit) {
          const fi = E.factIdx, xa = xOf(fi[0]), xb = xOf(fi[fi.length - 1] + 1), yb = NY + rf * rowH + 22;
          dc.fillStyle = T.copper; dc.fillRect(xa, yb - 16, xb - xa, 2.5); dc.textAlign = 'left'; dc.font = '500 16px Jost';
          dc.fillText('ACME, knitted in at the start', xa, yb + 4);
        }
        dc.restore();
      }
    },

    score(ctx) {
      const E = ctx.engine, ev = [];
      for (let r = 0; r < 14; r++) ev.push({ t: 0.25 + r * 0.15, kind: 'tick', gain: 0.2, freq: 2300 });
      ev.push({ t: 2.4, kind: 'tone', freq: 392, dur: 0.8, gain: 0.35 });
      for (let i = 0; i < E.P; i++) ev.push({ t: TK0 + i / E.P * (TK1 - 0.5 - TK0), kind: 'click', gain: E.toks[i].fact ? 0.7 : 0.25, freq: E.toks[i].fact ? 1300 : 1900 });
      let last = -1;
      for (let r = 0; r <= E.G; r++) { const t = rowT(r, E.G); if (t - last < 0.12) continue; last = t; ev.push({ t, kind: 'tick', gain: 0.5, freq: 2100 }); }
      if (!E.factNeverFit && E.factOffRow <= E.G) ev.push({ t: rowT(E.factOffRow, E.G) + 0.02, kind: 'clack', gain: 1.0, freq: 140 });
      ev.push({ t: MID0, kind: 'tone', freq: 330, dur: 1.2, gain: 0.35 }); ev.push({ t: PB0, kind: 'tone', freq: 262, dur: 2.2, gain: 0.35 }); ev.push({ t: PB1, kind: 'tone', freq: 392, dur: 1.4, gain: 0.4 });
      return ev;
    },

    meta(ctx) {
      const E = ctx.engine;
      return [
        { label: 'BPE merges learned (toy)', value: E.M },
        { label: 'Prompt tokens', value: E.P },
        { label: 'Reply tokens (rows)', value: E.G },
        { label: 'Characters per token', value: +E.cpt.toFixed(2) },
        { label: 'Needle (window, sketch)', value: NW },
        { label: 'ACME leaves at row', value: E.factNeverFit ? 'never fit' : (E.factOffRow > E.G ? 'stays' : E.factOffRow) },
      ];
    },
  });
  function hx(a) { return Math.round(Math.max(0, Math.min(255, a))).toString(16).padStart(2, '0'); }
  window.__runTok = { model, MERGES };
})();
