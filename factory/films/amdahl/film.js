/* amdahl · "Ten Times Faster" · Amdahl's law as a count of hours.
   One clock: render(t, state, K) is pure. Structures: the hour row, the commit box, the IBM strip, the brand card. */
(function () {
'use strict';
const F = window.FILM;
const X0 = 56, P = 6, MW = 4.2, RY = 200, RH = 80;           // hour h sits at x = X0 + P·h
const xh = (h) => X0 + P * h;
let KIND = null;                                              // per-mark kind: work | queue | ai
const D0 = 32, D1 = 62;                                       // drafting marks [32, 62)
const SX0 = 56, SW = 588, DAY = 84, PH = SW / 56;             // IBM strip: 7 days × 8 working hours
const SLIV = PH * 1.5, AFTER = PH * 4;                        // 15.75 and 42 units

function role(el, r) { if (el) el.setAttribute('data-role', r); return el; }

window.FILM_RENDER = {
  setup() {
    KIND = [];
    for (const st of F.steps) for (let i = 0; i < st.h; i++) KIND.push(st.kind);
  },

  render(t, s, K) {
    const { tx, ln, rc, seg, ease, eout, lerp, C } = K;
    const T = (key, layer, x, y, str, o, r) => role(tx(key, layer, x, y, str, o), r || 'must-read');
    const ch = K.chapterAt(t), A = F.commit.at, SEAL = A + 4.5;
    const rows = F.ledger; let hl = null; rows.forEach((r, i) => { if (t >= r[0]) hl = i; });
    const none = s.answer === 'none';
    K.chrome(t, ch, {
      ledger: { title: 'CASE LEDGER', rows, hl },
      block: { title: 'AMDAHL', lines: ['100-HOUR MODEL', 'IBM CREDIT CASE'], open: 0.4, slotLabel: 'GUESS',
               slot: t >= SEAL ? (none ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 1.0);
    const ctx = K.ctx;
    const ink = K.hexRgb(C.ink), acc = K.hexRgb(C.accent);
    const col = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;
    const mix = (a, b, u) => [0, 1, 2].map(i => Math.round(lerp(a[i], b[i], u)));

    /* ───────── HOOK + COMMIT (0–16): the row, the claim, the commit box ───────── */
    if (t < 16) {
      const out = 1 - seg(t, 15.8, 16.0);
      const red = seg(t, 8.2, 9.0);
      for (let i = 0; i < 100; i++) {
        const a = seg(t, 0.3 + 0.009 * i, 0.55 + 0.009 * i) * out; if (a <= 0) continue;
        const k = KIND[i];
        let c = ink, al = k === 'queue' ? 0.5 : 0.95;
        if (k === 'ai') c = mix(ink, acc, red);
        ctx.fillStyle = col(c, al * a);
        ctx.fillRect(xh(i) + 0.9, RY, MW, RH);
      }
      // step boundaries, hairlines under the row
      const sep = seg(t, 4.0, 4.6) * out;
      if (sep > 0) { let h = 0; F.steps.forEach((st, j) => { h += st.h; if (j < 9) ln('hk.sp' + j, 'marks', xh(h), RY + RH + 3, xh(h), RY + RH + 11, { op: 0.7 * sep }); }); }
      // the claim
      const ca = seg(t, 0.6, 1.0) * (1 - 0.6 * seg(t, 8.2, 9.0)) * out;
      T('hk.claim', 'labels', 356, 146, '“AI will make this 10× faster.”', { fam: 'disp', size: 40, anchor: 'middle', op: ca });
      const ba = seg(t, 1.2, 1.8) * (1 - 0.6 * seg(t, 8.2, 9.0)) * out;
      if (ba > 0) {
        ln('hk.b0', 'marks', xh(0), 190, xh(100), 190, { op: ba, w: 1 });
        ln('hk.b1', 'marks', xh(0), 190, xh(0), 196, { op: ba, w: 1 });
        ln('hk.b2', 'marks', xh(100), 190, xh(100), 196, { op: ba, w: 1 });
      }
      const ha = seg(t, 4.0, 4.4) * out;
      T('hk.ctr', 'labels', 656, 180, '100 HOURS', { size: 28, weight: 500, anchor: 'end', op: ha });
      T('hk.in', 'labels', 56, 304, 'REQUEST IN', { size: 14, weight: 500, ls: '0.1em', op: ha * (1 - seg(t, 8.2, 8.6)) }, 'secondary');
      T('hk.done', 'labels', 656, 304, 'DONE', { size: 14, weight: 500, ls: '0.1em', anchor: 'end', op: ha * (1 - seg(t, 8.2, 8.6)) }, 'secondary');
      // COMMIT: drafting named, the box
      T('cm.dl', 'labels', xh(47), 326, 'DRAFTING · 30 HOURS', { size: 28, weight: 500, anchor: 'middle', fill: C.accent, op: seg(t, 8.2, 8.8) * out });
      const box = K.commitBox(t, s, { title: F.commit.title, prompt: '× FASTER · WHOLE JOB', seal: Infinity, out: 15.5 });
      if (t >= SEAL && box.op > 0) {
        const k = seg(t, SEAL, SEAL + 0.22);
        K.stamp('cm.st', 'marks', 815, 256, lerp(1.4, 0.9, eout(k)), none ? 'NO ANSWER' : 'SEALED', { op: k * box.op, h: 50, fs: 32 });
      }
    }

    /* ───────── CASE (16–36): IBM Credit at true scale ───────── */
    if (t >= 16 && t < 36) {
      const out = 1 - seg(t, 35.6, 36.0);
      const g = seg(t, 16.3, 17.4) * out;
      const inst = ease(seg(t, 29.5, 30.5));
      const sl = SLIV * ease(seg(t, 22.0, 22.8)) * (1 - inst);       // the work sliver, grows then vanishes
      const hx0 = SX0 + (sl > 0 || inst > 0 ? SLIV * (1 - inst) : 0); // waiting starts after the sliver
      const hx1 = SX0 + SW - SLIV * inst;                              // the strip's end moves 90 minutes left
      if (g > 0) {
        const wEnd = lerp(SX0, hx1, g);
        ctx.save();
        ctx.beginPath(); ctx.rect(Math.min(SX0, wEnd), 220, Math.max(0, wEnd - SX0), 60); ctx.clip();
        ctx.fillStyle = col(ink, 0.10 * out); ctx.fillRect(SX0, 220, hx1 - SX0, 60);
        ctx.strokeStyle = col(ink, 0.32 * out); ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let x = SX0 - 60; x < hx1 + 60; x += 6) { ctx.moveTo(x, 280); ctx.lineTo(x + 60, 220); }
        ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = col(ink, 0.8 * out); ctx.lineWidth = 1; ctx.strokeRect(SX0, 220, wEnd - SX0, 60);
        for (let d = 0; d <= 7; d++) {
          const a = seg(t, 16.3 + 0.15 * d, 16.6 + 0.15 * d) * out;
          ln('cs.tk' + d, 'marks', SX0 + DAY * d, 210, SX0 + DAY * d, 218, { op: 0.8 * a, w: 1 });
        }
      }
      if (sl > 0) { ctx.fillStyle = col(acc, 0.95 * out); ctx.fillRect(SX0, 220, sl, 60); }
      T('cs.days', 'labels', SX0 + SW, 200, '7 DAYS', { size: 28, weight: 500, anchor: 'end', op: seg(t, 17.0, 17.5) * out });
      T('cs.desk', 'labels', SX0, 304, 'ONE FINANCING REQUEST · 5 DESKS', { size: 14, weight: 500, ls: '0.06em', op: seg(t, 17.2, 17.7) * out }, 'secondary');
      T('cs.work', 'labels', SX0, 200, '90 MINUTES OF WORK', { size: 28, weight: 500, fill: C.accent, op: seg(t, 22.0, 22.6) * (1 - 0.65 * seg(t, 30.0, 30.6)) * out });
      const wa = seg(t, 28.0, 28.5) * out;
      if (wa > 0) {
        const cx = (hx0 + hx1) / 2;
        rc('cs.wbg', 'labels', cx - 186, 236, 372, 30, { fill: C.chalk, op: 0.92 * wa });
        T('cs.wait', 'labels', cx, 259, 'WAITING BETWEEN DESKS', { size: 28, weight: 500, anchor: 'middle', op: wa });
      }
      T('cs.save', 'labels', SX0 + SW, 304, '−90 MIN', { size: 28, weight: 500, anchor: 'end', fill: C.accent, op: seg(t, 29.8, 30.3) * out });
      const af = ease(seg(t, 32.0, 33.0)) * out;
      if (af > 0) {
        T('cs.aft', 'labels', SX0, 326, 'AFTER THE REDESIGN', { size: 14, weight: 500, ls: '0.1em', op: af }, 'secondary');
        rc('cs.ab', 'marks', SX0, 334, AFTER * ease(seg(t, 32.0, 33.0)), 30, { fill: C.ink, op: out });
        T('cs.ah', 'labels', SX0 + AFTER + 12, 358, '4 HOURS', { size: 28, weight: 500, op: seg(t, 32.6, 33.1) * out });
        T('cs.an', 'labels', SX0 + AFTER + 142, 356, 'ONE PERSON · NO HANDOFFS', { size: 14, weight: 500, ls: '0.06em', op: seg(t, 32.8, 33.3) * out }, 'secondary');
      }
    }

    /* ───────── COUNT (36–62) and MONDAY (62–72): one mark per hour ───────── */
    if (t >= 36) {
      const rowIn = seg(t, 36.0, 37.0), dimM = lerp(1, 0.3, seg(t, 62.0, 62.6));
      const n = Math.floor(100 * seg(t, 37.4, 41.4));                     // first tally
      const sh1 = ease(seg(t, 45.2, 46.6)) * 27 * P, sh2 = ease(seg(t, 59.0, 59.8)) * 3 * P;
      const lab = 1 - seg(t, 62.0, 62.6);                                  // count labels leave at Monday
      // leaving marks: last 27 of drafting, then the 3 that were left
      const leave = (i) => {
        if (i >= 35 && i < D1) { const a = 43.0 + 0.05 * (i - 35); return seg(t, a, a + 0.8); }
        if (i >= D0 && i < 35) { const a = 58.2 + 0.05 * (i - D0); return seg(t, a, a + 0.6); }
        return 0;
      };
      let removed = 0;
      for (let i = D0; i < D1; i++) if (leave(i) >= 0.5) removed++;
      const end = 100 - 27 * (sh1 / (27 * P)) - 3 * (sh2 / (3 * P));     // hours where the row now ends
      // untouched tally order: 0..31 then 62..99
      const u = Math.floor(70 * seg(t, 48.4, 51.4));
      for (let i = 0; i < 100; i++) {
        const k = KIND[i];
        const lv = leave(i);
        if (lv >= 1) continue;
        const dx = i >= D1 ? -sh1 - sh2 : 0;
        const tall = i < n ? 1 : 0.22;
        let al = (k === 'queue' ? 0.5 : 0.95) * tall * rowIn * dimM * (1 - lv);
        const c = k === 'ai' ? acc : ink;
        ctx.fillStyle = col(c, al);
        ctx.fillRect(xh(i) + 0.9 + dx, RY - 40 * eout(lv), MW, RH);
        // second tally: a tick under each untouched mark as it is counted
        const ui = i < D0 ? i : i >= D1 ? i - 30 : -1;
        if (ui >= 0 && ui < u) { ctx.fillStyle = col(ink, 0.9 * lab * (1 - seg(t, 53.6, 54.0))); ctx.fillRect(xh(i) + 0.9 + dx, RY + RH + 5, MW, 3); }
      }
      // pencil cursor during the first tally
      if (n > 0 && n < 100) ln('ct.cur', 'marks', xh(n), 192, xh(n), 290, { stroke: C.accent, w: 1.2 });
      // counter
      let ctr = '';
      if (t < 43.0) ctr = n + ' HOURS';
      else if (t < 52.0) ctr = (100 - removed) + ' HOURS';
      else ctr = 'DONE · HOUR ' + (removed >= 30 ? 70 : 73);
      T('ct.ctr', 'labels', 656, 180, ctr, { size: 28, weight: 500, anchor: 'end', op: rowIn * lab });
      // 30 → 3
      const dlx = lerp(xh(47), xh(33.5), ease(seg(t, 45.2, 46.6)));
      T('ct.dl', 'labels', dlx, 326, '30 → 3', { size: 28, weight: 500, anchor: 'middle', fill: C.accent, op: seg(t, 42.0, 42.4) * (1 - seg(t, 53.4, 53.8)) });
      // ghost of the old end
      const gh = seg(t, 45.2, 46.6) * lab;
      if (gh > 0) {
        rc('ct.gh', 'marks', xh(end), RY, xh(100) - xh(end), RH, { stroke: C.ink, w: 0.75, dash: '4 3', op: 0.5 * gh });
        T('ct.ghl', 'labels', xh(100), 304, 'WAS 100', { size: 14, weight: 500, anchor: 'end', ls: '0.08em', op: gh }, 'secondary');
      }
      // untouched brackets + tally label
      const bu = seg(t, 48.0, 48.4) * (1 - seg(t, 53.6, 54.0));
      if (bu > 0) {
        [[0, 32], [35, 73]].forEach(([a, b], j) => {
          ln('ct.br' + j, 'marks', xh(a) + 1, 296, xh(b) - 1, 296, { op: bu, w: 1 });
          ln('ct.bl' + j, 'marks', xh(a) + 1, 292, xh(a) + 1, 296, { op: bu, w: 1 });
          ln('ct.bm' + j, 'marks', xh(b) - 1, 292, xh(b) - 1, 296, { op: bu, w: 1 });
        });
        T('ct.un', 'labels', 356, 366, 'UNTOUCHED ' + u, { size: 28, weight: 500, anchor: 'middle', op: bu });
      }
      // done rule (the TRUE pin)
      const dr = seg(t, 52.0, 52.4) * lab;
      const xe = xh(end);
      if (dr > 0) ln('ct.dr', 'marks', xe, 188, xe, t >= 54 ? 300 : 290, { w: 1.5, op: dr });
      // pins: the promise, you, the truth — all on the same hour axis
      const pa = seg(t, 54.0, 54.6) * lab;
      if (pa > 0) {
        const pins = [];
        pins.push({ k: 'pr', x: xh(10), w: 'PROMISE', big: '10×', hr: 'HOUR 10', c: C.ink });
        const ceil = removed >= 30;
        pins.push({ k: 'tr', x: xe, w: 'TRUE', big: ceil ? '1.43×' : '1.37×', hr: ceil ? 'HOUR 70' : 'HOUR 73', c: C.ink, rule: true });
        if (K.answered(s)) {
          const g = s.answer, hrs = Math.min(100, Math.max(1, 100 / g));
          pins.push({ k: 'yo', x: xh(hrs), w: 'YOU', big: g + '×', hr: 'HOUR ' + Math.round(hrs), c: C.accent, you: true });
        }
        const you = pins.find(p => p.you);
        pins.forEach(p => { p.anchor = 'middle'; p.lx = p.x; });
        if (you) {
          const half = (p) => Math.max(p.big.length * 16.8, p.hr.length * 8.4, p.w.length * 8.4) / 2 + 6;
          for (const o of pins) {
            if (o === you) continue;
            if (Math.abs(o.x - you.x) < half(o) + half(you)) {
              const left = you.x <= o.x;
              you.anchor = left ? 'end' : 'start'; you.lx = you.x + (left ? -6 : 6);
              o.anchor = left ? 'start' : 'end'; o.lx = o.x + (left ? 6 : -6);
            }
          }
        }
        pins.forEach(p => {
          if (!p.rule) ln('ct.p' + p.k, 'marks', p.x, 188, p.x, 300, { stroke: p.c, w: 1.2, op: pa });
          const lx = Math.max(52, Math.min(660, p.lx));
          T('ct.pw' + p.k, 'labels', lx, 318, p.w, { size: 14, weight: 500, ls: '0.1em', anchor: p.anchor, fill: p.c, op: pa }, 'secondary');
          T('ct.pb' + p.k, 'labels', lx, 348, p.big, { size: 28, weight: 500, anchor: p.anchor, fill: p.c, op: pa });
          T('ct.ph' + p.k, 'labels', lx, 368, p.hr, { size: 14, weight: 500, ls: '0.06em', anchor: p.anchor, fill: p.c, op: pa }, 'secondary');
        });
        if (s.answer === 'none') T('ct.na', 'labels', xh(25), 318, 'NO ANSWER', { size: 14, weight: 500, ls: '0.1em', anchor: 'middle', op: pa }, 'secondary');
      }
      // the ratio: only now, after the count
      const r1 = seg(t, 55.0, 55.4) * (1 - seg(t, 59.8, 60.1)) * lab;
      const r2 = seg(t, 59.8, 60.1) * lab;
      if (r1 > 0) T('ct.r1', 'labels', 56, 146, '100 ÷ 73 = 1.37×', { fam: 'disp', size: 44, op: r1 });
      if (r2 > 0) {
        T('ct.r2', 'labels', 56, 146, '100 ÷ 70 = 1.43×', { fam: 'disp', size: 44, op: r2 });
        T('ct.law', 'labels', 56, 170, 'THE CEILING · AMDAHL, 1967', { size: 14, weight: 500, ls: '0.1em', fill: C.accent, op: r2 }, 'secondary');
      }

      /* MONDAY */
      if (t >= 62.0) {
        const q = seg(t, 62.3, 62.9);
        T('mo.q1', 'labels', 356, 136, 'Of every 100 hours it takes,', { fam: 'disp', size: 36, anchor: 'middle', op: q });
        T('mo.q2', 'labels', 356, 176, 'how many does the AI touch?', { fam: 'disp', size: 36, anchor: 'middle', op: seg(t, 62.6, 63.2) });
        T('mo.h', 'labels', 356, 326, 'Half the hours? Never more than 2×.', { fam: 'disp', size: 30, anchor: 'middle', fill: C.accent, op: seg(t, 64.0, 64.5) });
        const hl2 = seg(t, 67.0, 67.5);
        T('mo.l1', 'labels', 356, 362, "A teaching model, not IBM's numbers.", { fam: 'disp', size: 30, anchor: 'middle', op: hl2 });
        T('mo.l2', 'labels', 356, 396, 'Faster work can also move the queues.', { fam: 'disp', size: 30, anchor: 'middle', op: hl2 });
      }
    }
  },

  tryit(v) {
    const a = +v.touched, sp = +v.speed, rest = 100 - a, now = rest + a / sp;
    const su = now > 0 ? 100 / now : Infinity, cap = rest > 0 ? 100 / rest : Infinity;
    const f = (x) => isFinite(x) ? x.toFixed(2) + '×' : 'no limit';
    const h = (x) => (Math.round(x * 100) / 100).toString();
    return `<div class="ex">THE COUNT</div><div class="big">${h(now)} OF 100 HOURS</div>` +
      `<div class="ex">${rest} untouched + ${a} ÷ ${sp} = ${h(now)} hours</div>` +
      `<p>100 ÷ ${h(now)} = <b>${f(su)}</b> faster. Even instant: at most <b>${f(cap)}</b>.</p>`;
  },
};
})();
