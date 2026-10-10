/* THE MARGIN · native film — "Why AI sounds confident when it's wrong" (glance) · revision 1.
   SHOW, don't tell. A toy word-count model (labelled sketch) answers three questions. Its uncertainty exists — in
   the pencil DRAFT, where it weighs the words it has read (counts as five-bar gates, written in a hand that wavers
   as much as it is unsure). Then it writes the FAIR COPY in ink: the same steady hand every time, whatever the
   odds. The drafts are erased. Three identical, confident answers sit on the page and the viewer is asked which one
   is wrong — they cannot tell. Reveal: the 60 % one is right, the 82 % one is wrong. Then the viewer's own guess from
   the agent page is held up beside them (conditional: only if it was above the truth). Control: how often the toy
   model read "Sydney" re-runs counts → probability → which word → the draft; the fair copy never changes its hand. */
const MARGIN_READ = { paris: 19, lyon: 1, thimphu: 3, paro: 2, canberra: 3 };   // sketch counts (labelled on the page)

Atelier.film({
  id: 'margin-native',
  title: 'The Margin — why AI sounds confident when it’s wrong',
  direction: 'E · The Margin · field notebook',
  level: 'glance',
  duration: 27,
  size: [960, 540],
  renderer: 'p2d',
  fps: 30,
  seed: 3,
  ground: '#DCE4D6',
  chapters: [{ t: 0, label: 'Draft and fair copy' }, { t: 11.3, label: 'Which is wrong?' }, { t: 15.0, label: 'Reveal' }, { t: 18.7, label: 'The mirror' }],
  captions: [
    { t0: 0.2, t1: 3.3, text: 'A toy model (a sketch) that only counts which words it has read together.' },
    { t0: 3.3, t1: 8.6, text: 'In pencil it weighs the words; the shakier the draft, the less sure it is.' },
    { t0: 8.6, t1: 11.3, text: 'In ink it writes the answer, in the same steady hand every time.' },
    { t0: 11.3, t1: 15.0, text: 'The drafts are gone. Three confident answers. Which one is wrong?' },
    { t0: 15.0, t1: 18.7, text: 'The shaky one was right. The steady one was wrong. The ink never told you.' },
    { t0: 18.7, t1: 22.4, text: 'People do it too: a guess can feel as sure as a fact.' },
    { t0: 22.4, t1: 27, text: 'Fluency is not accuracy. Ask an AI to check its work, not how sure it sounds.' },
  ],
  state: { sydney: 14, mirror: Margin.storedGuess() },
  controls: [
    { key: 'sydney', type: 'range', label: 'Times the toy model read “Sydney” next to “Australia”', min: 0, max: 20, step: 1, jump: 8.0,
      hint: 'It read “Canberra” 3 times. Watch the pencil draft change — and the ink not change at all.', format: v => Math.round(v) + '×' },
  ],

  setup(p, ctx) {
    ctx.page = Margin.Page(p, ctx, { seed: ctx.seed, marginX: 792, onPage: (c, t) => eraser(c, t, ctx.cur) });
  },
  draw(p, t, ctx) {
    const P = nplan(ctx); ctx.cur = P;
    ctx.page.use(P.pl).draw(t, Margin.camera(P.cam, t));
  },
  score(ctx) {
    const P = nplan(ctx), ev = Margin.scratchScore(P.pl, { skip: s => s.family === 'crumb' });
    P.marks.forEach(m => ev.push(Object.assign({ gain: 0.5 }, m)));
    return ev;
  },
  meta(ctx) {
    const M = model(ctx.state.sydney);
    return [
      { label: 'Read “Sydney” (sketch)', value: M.s },
      { label: 'Read “Canberra” (sketch)', value: MARGIN_READ.canberra },
      { label: 'Model writes', value: M.word },
      { label: 'How sure it was · P(word)', value: M.P },
      { label: 'Correct?', value: M.right ? 'yes' : 'no' },
      { label: 'Fair-copy hand (same for all)', value: 'steady' },
    ];
  },
});

/** the toy model: argmax of read-counts; probability = count share */
function model(sydney) {
  const s = Math.round(sydney), c = MARGIN_READ.canberra, word = s > c ? 'Sydney' : 'Canberra', P = (word === 'Sydney' ? s : c) / (s + c);
  return { s, c, word, P, right: word === 'Canberra', other: word === 'Sydney' ? 'Canberra' : 'Sydney', nOther: word === 'Sydney' ? c : s, n: word === 'Sydney' ? s : c };
}

/** the eraser block, scrubbing row by row while the drafts are rubbed out */
function eraser(c, t, P) {
  if (!P || !P.erase) return;
  const E = P.erase.find(e => t >= e.t0 - 0.25 && t <= e.t1 + 0.25); if (!E) return;
  const u = Atelier.U.clamp((t - E.t0) / (E.t1 - E.t0)), x = E.x0 + (E.x1 - E.x0) * u, y = E.y + Math.sin(t * 46) * 5, lift = (t < E.t0 || t > E.t1) ? 1 : 0;
  c.save(); c.translate(x + lift * 6, y - lift * 8); c.rotate(-0.35 + Math.sin(t * 23) * 0.05);
  c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(26,42,36,0.22)'; c.filter = 'blur(2px)'; c.beginPath(); c.roundRect(-13 + 4 + lift * 6, -8 + 4 + lift * 6, 30, 17, 3); c.fill();
  c.filter = 'none'; c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#C9B3AD'; c.beginPath(); c.roundRect(-15, -9, 30, 17, 3); c.fill();
  c.fillStyle = '#DCC8C2'; c.beginPath(); c.roundRect(-15, -9, 30, 7, 3); c.fill();
  c.fillStyle = 'rgba(80,60,58,0.35)'; c.fillRect(-15, 5, 30, 3);
  c.restore();
}

function nplan(ctx) {
  const st = ctx.state, stored = st.mirror != null && ctx.mode !== 'film', g = stored ? Math.round(st.mirror) : 75;
  const key = Math.round(st.sydney) + '|' + g + '|' + stored;
  ctx.plans = ctx.plans || new Map();
  if (ctx.plans.has(key)) return ctx.plans.get(key);
  const M = model(st.sydney), Gs = Margin.G, W = Margin.Writer(ctx.seed), marks = [], erase = [];
  const pct = v => Math.round(100 * v) + '%';

  W.text('A', 'ink', 'Why AI sounds sure when it’s wrong', 64, 50, 13, { t0: 0.3, dur: 2.0, maxW: 640 });
  W.text('A', 'ink', 'its pencil draft (sketch: it only counts)', 300, 92, 6.2, { t0: 2.45, dur: 0.45, maxW: 270 });
  W.text('A', 'ink', 'its answer', 610, 92, 6.2, { t0: 2.95, dur: 0.2 });

  const QA = [
    { q: 'Capital of France?', a: 'Paris', b: 'Lyon', na: MARGIN_READ.paris, nb: MARGIN_READ.lyon, right: true },
    { q: 'Capital of Bhutan?', a: 'Thimphu', b: 'Paro', na: MARGIN_READ.thimphu, nb: MARGIN_READ.paro, right: true },
    { q: 'Capital of Australia?', a: M.word, b: M.other, na: M.n, nb: M.nOther, right: M.right },
  ];
  const fair = [];
  QA.forEach((Q, i) => {
    const yq = 146 + i * 84, t = 3.35 + i * 2.6, P = Q.na / (Q.na + Q.nb), flu = Margin.fluency(P);
    Q.P = P; Q.yq = yq;
    W.text('A', 'ink', Q.q, 64, yq, 8.4, { t0: t, dur: 0.6, maxW: 220 });
    // the draft: the model weighs both words, in a hand that wavers with its doubt
    const er = { t0: 11.35 + i * 0.5, t1: 11.35 + (i + 1) * 0.5 };
    const dOpt = { flu, jitter: 1 + (1 - flu) * 2.2, erase: { t0: er.t0, t1: er.t1, ghost: 0.12, x0: 296, x1: 545 } };
    const da = W.text('A', 'slate', Q.a, 300, yq - 8, 6.6, Object.assign({ t0: t + 0.65, dur: 0.3 + (1 - flu) * 0.35 }, dOpt));
    if (Q.na) W.marks('slate', Gs.gates(Q.na, Math.max(da.x1 + 10, 372), yq - 7, 8, 40 + i, 3.0), 5, Object.assign({ t0: t + 1.0 + (1 - flu) * 0.3, dur: 0.3 }, dOpt));
    const db = W.text('A', 'slate', Q.b, 300, yq + 12, 6.6, Object.assign({ t0: t + 1.35 + (1 - flu) * 0.3, dur: 0.25 + (1 - flu) * 0.3 }, dOpt));
    if (Q.nb) W.marks('slate', Gs.gates(Q.nb, Math.max(db.x1 + 10, 372), yq + 13, 8, 50 + i, 3.0), 5, Object.assign({ t0: t + 1.65 + (1 - flu) * 0.5, dur: 0.12 }, dOpt));
    W.marks('crumb', Margin.crumbs(296, 540, yq - 18, yq + 18, 14, 70 + i), 3, { t0: er.t0 + 0.05, dur: er.t1 - er.t0 - 0.05 });
    erase.push({ t0: er.t0, t1: er.t1, x0: 296, x1: 545, y: yq + 2 });
    // the fair copy: the same steady ink hand for every answer, whatever the odds
    const fc = W.text('A', 'ink', Q.a + '.', 610, yq + 4, 14, { t0: t + 2.0 + (1 - flu) * 0.2, dur: 0.55, seed: 4242 });
    fair.push(fc);
  });
  marks.push({ t: 11.35, kind: 'tick', freq: 900, gain: 0.5 }, { t: 11.85, kind: 'tick', freq: 900, gain: 0.5 }, { t: 12.35, kind: 'tick', freq: 900, gain: 0.5 });

  // which one is wrong? — the viewer's pencil hovers and marks a question beside each answer
  QA.forEach((Q, i) => W.text('B', 'graphite', '?', 806 + i * 2, Q.yq + 4, 11, { t0: 13.0 + i * 0.55, dur: 0.18, slant: -0.3 }));
  // reveal
  QA.forEach((Q, i) => {
    const tv = 15.1 + i * 0.35, fc = fair[i];
    if (Q.right) { W.marks('sage', Gs.tick(fc.x1 + 8, Q.yq + 4, 16, 22 + i), 9, { t0: tv, dur: 0.18 }); marks.push({ t: tv, kind: 'click', gain: 0.8 }); }
    else {
      W.marks('peach', [[604, Q.yq - 6, (604 + fc.x1) / 2, Q.yq - 8.5, fc.x1 + 3, Q.yq - 5]], 9, { t0: tv, dur: 0.18, weight: 1.8 });
      W.text('A', 'peach', Q.b, fc.x1 + 10, Q.yq + 20, 8.4, { t0: tv + 0.25, dur: 0.45 });
      marks.push({ t: tv, kind: 'clack', gain: 0.9 });
    }
  });
  // what it never showed: how sure it was (copper = probability)
  QA.forEach((Q, i) => W.text('A', 'copper', pct(Q.P) + ' sure', 830, Q.yq + 4, 8, { t0: 16.6 + i * 0.6, dur: 0.45 }));

  // the mirror, conditional on the viewer's own guess
  const high = g > 40;
  W.text('A', 'ink', stored ? (high ? 'Your guess earlier felt just as sure:' : 'Your guess earlier was close:') : 'A guess like this one feels just as sure:', 64, 420, 8, { t0: 18.8, dur: 0.95, maxW: 470 });
  const gg = W.text('B', 'graphite', g + '%', 610, 424, 14, { t0: 19.9, dur: 0.5, slant: -0.3, tag: 'mirror' });
  marks.push({ t: 19.9, kind: 'tone', freq: 440, dur: 0.9, gain: 0.45 });
  if (!stored) W.text('B', 'graphite', 'a sample guess', 610, 442, 4.8, { t0: 20.45, dur: 0.2, slant: -0.3 });
  if (high) W.marks('peach', [[604, 418, (604 + gg.x1) / 2, 415.5, gg.x1 + 3, 419]], 9, { t0: 20.75, dur: 0.18, weight: 1.8 });
  W.text('A', 'ink', 'truth: 36%', gg.x1 + 22, 424, 9, { t0: 21.0, dur: 0.6 });

  // the line it all comes to
  const fl = W.text('A', 'ink', 'fluency ≠ accuracy', 64, 506, 15, { t0: 22.5, dur: 1.7, weight: 1.05 });
  W.marks('peach', Gs.underline(60, fl.x1 + 6, 518, 41), 9, { t0: 24.3, dur: 0.22 });
  W.marks('peach', Gs.underline(74, fl.x1 - 6, 525, 42), 9, { t0: 24.55, dur: 0.2 });
  marks.push({ t: 24.3, kind: 'tone', freq: 330, dur: 1.4, gain: 0.45 });

  const pl = W.build();
  const cam = [
    { t: 0, x: 330, y: 70, z: 1.8 }, { t: 2.3, x: 340, y: 70, z: 1.75 }, { t: 3.0, x: 450, y: 120, z: 1.5 },
    { t: 5.6, x: 450, y: 146, z: 1.5 }, { t: 8.2, x: 450, y: 230, z: 1.5 }, { t: 10.8, x: 450, y: 314, z: 1.5 },
    { t: 11.6, x: 470, y: 235, z: 1.18 }, { t: 18.2, x: 500, y: 235, z: 1.12 }, { t: 18.9, x: 420, y: 420, z: 1.45 },
    { t: 21.9, x: 420, y: 420, z: 1.45 }, { t: 22.6, x: 330, y: 470, z: 1.35 }, { t: 24.9, x: 330, y: 470, z: 1.35 }, { t: 25.9, x: 480, y: 270, z: 1.0 },
  ];
  const P = { pl, cam, marks, erase };
  ctx.plans.set(key, P);
  return P;
}
