/* survivorship · "The Missing Planes" · the 75-second case.
   One clock: render(t, state, K) draws frame t from t alone. The count is 400 squares, one per plane, in the
   memo's own groups (Wald 1943, Part I example): rows 1-16 = 320 home unhit, rows 17-19 = 60 home holed,
   row 20 = 20 never came home. Hole dots per holed plane follow the memo's 32 / 20 / 4 / 2 / 2.
   Only randomness: hole-dot layout, mulberry32(1943 + i), precomputed in setup. */
(function () {
'use strict';
const F = window.FILM, PR = F.params;
const YOU = F.you || '#2D5DA8';
const GX = 48, GY = 110, P = 13.5, CS = 11, GAP = 9;
const gx = (c) => GX + c * P;
const gy = (r) => GY + r * P + (r >= 16 ? GAP : 0) + (r >= 19 ? GAP : 0);
const HIT = (PR.returned - PR.unhit) + (PR.flew - PR.returned);   // 80
const LOST = PR.flew - PR.returned;                                // 20
const HOLED = PR.returned - PR.unhit;                              // 60
let HOLES = null;   // per holed plane: [[dx, dy], ...] inside the cell

function holesOf(i) {   // memo: 32 with 1, 20 with 2, 4 with 3, 2 with 4, 2 with 5
  const b = [PR.hit1, PR.hit2, PR.hit3, PR.hit4, PR.hit5];
  let acc = 0; for (let k = 0; k < 5; k++) { acc += b[k]; if (i < acc) return k + 1; }
  return 5;
}

window.FILM_RENDER = {
  setup(p, K) {
    HOLES = [];
    for (let i = 0; i < HOLED; i++) {
      const r = K.mulberry32(1943 + i), n = holesOf(i), pts = [];
      for (let tries = 0; pts.length < n && tries < 400; tries++) {
        const x = 2.4 + r() * (CS - 4.8), y = 2.4 + r() * (CS - 4.8);
        if (pts.every(([a, b]) => Math.hypot(a - x, b - y) >= 2.7) || tries > 300) pts.push([x, y]);
      }
      HOLES.push(pts);
    }
    const mk = K.svg && K.svg.querySelector('[data-layer="marks"]');
    if (mk) mk.setAttribute('data-role', 'secondary');   // the kit's SEALED stamp text lives here: a device, not a result
  },

  render(t, s, K) {
    const { seg, ease, lerp, C } = K, ctx = K.ctx;
    const T = (key, x, y, str, o, role) => { const el = K.tx(key, 'labels', x, y, str, o); if (role) el.setAttribute('data-role', role); return el; };
    const SEAL = F.commit.at + 4.5;
    const ans = s.answer;
    const g = typeof ans === 'number' ? Math.max(0, Math.min(100, ans)) : null;

    // ── sheet chrome
    const rows = F.ledger.filter(r => t >= r[0]);
    K.chrome(t, null, {
      ledger: { title: 'CASE FILE', rows, hl: rows.length - 1 },
      block: { title: 'MISSING PLANES', lines: ['WALD MEMO · PART I', 'ISSUED FOR REVIEW'], open: 0.6, slotLabel: 'GUESS',
               slot: t >= SEAL ? (ans === 'none' ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 0.9);

    // ── canvas mass: the planes
    // 1. unhit (rows 0-15), from 37.6, 80 per second
    if (t >= 37.6) {
      const dimU = lerp(1, 0.45, seg(t, 44, 45));
      for (let j = 0; j < PR.unhit; j++) {
        const a = seg(t, 37.6 + j / 80, 37.6 + j / 80 + 0.12);
        if (a <= 0) break;
        ctx.fillStyle = K.rgba('ink', 0.30 * a * dimU);
        ctx.fillRect(gx(j % 20), gy(Math.floor(j / 20)), CS, CS);
      }
    }
    // 2. holed (rows 16-18): hero at scale 2 until 16 s, then into the grid
    {
      const u = ease(seg(t, 16, 17));
      const ox = GX, oy = lerp(196, gy(16), u), sc = lerp(2, 1, u);
      const dimH = t >= 62 ? lerp(1, 0.5, seg(t, 62, 62.8)) : 1;
      ctx.save(); ctx.translate(ox, oy); ctx.scale(sc, sc);
      for (let i = 0; i < HOLED; i++) {
        const a = seg(t, 0.4 + i * 0.04, 0.55 + i * 0.04);
        if (a <= 0) break;
        const x = (i % 20) * P, y = Math.floor(i / 20) * P;
        ctx.fillStyle = K.rgba('ink', 0.92 * a * dimH);
        ctx.fillRect(x, y, CS, CS);
        ctx.fillStyle = C.paper;
        for (const [hx, hy] of HOLES[i]) { ctx.beginPath(); ctx.arc(x + hx, y + hy, 1.15, 0, 2 * Math.PI); ctx.fill(); }
      }
      ctx.restore();
    }
    // 3. the 20 that never came home (row 19): dashed red outlines, then the truth fill
    if (t >= 42.4) {
      ctx.save(); ctx.setLineDash([2.2, 1.6]); ctx.lineWidth = 1.1;
      for (let k = 0; k < LOST; k++) {
        const a = seg(t, 42.4 + k * 0.08, 42.4 + k * 0.08 + 0.1);
        if (a <= 0) break;
        ctx.strokeStyle = K.rgba('accent', 0.95 * a);
        ctx.strokeRect(gx(k) + 0.55, gy(19) + 0.55, CS - 1.1, CS - 1.1);
      }
      ctx.restore();
      for (let k = 0; k < LOST; k++) {
        const a = seg(t, 52.4 + k * 0.06, 52.4 + k * 0.06 + 0.1);
        if (a <= 0) break;
        ctx.fillStyle = K.rgba('accent', 0.85 * a);
        ctx.fillRect(gx(k), gy(19), CS, CS);
      }
    }
    // 4. the viewer's guess, placed on the 80 hit planes (from row 19 upward)
    const kc = g == null ? null : Math.round(g * HIT / PR.per);
    if (kc != null && t >= 50) {
      for (let m = 0; m < kc; m++) {
        const a = seg(t, 50 + m * 0.06, 50 + m * 0.06 + 0.1);
        if (a <= 0) break;
        const r = 19 - Math.floor(m / 20), c = m % 20, truthOn = r === 19 && t >= 52.4 + c * 0.06;
        ctx.fillStyle = `rgba(${K.hexRgb(YOU).join(',')},${(truthOn ? 1 : 0.88) * a})`;
        if (truthOn) ctx.fillRect(gx(c), gy(r), CS, 3);   // a blue tick on top of the red truth
        else ctx.fillRect(gx(c), gy(r), CS, CS);
      }
    }

    // ── HOOK 0-8 and COMMIT 8-16 (S1 hero + the question)
    if (t < 16.5) {
      const op = seg(t, 1.2, 1.6) * (1 - seg(t, 16, 16.4));
      if (op > 0) {
        T('h.n', 48, 334, String(HOLED), { size: 56, weight: 500, op }, 'must-read');
        T('h.ns', 134, 334, 'came home with holes', { size: 18, op }, 'secondary');
      }
      const ob = seg(t, 4.2, 4.8) * (1 - seg(t, 8, 8.4));
      if (ob > 0) {
        K.path('h.br', 'marks', 'M 48 191 L 48 184 L 583 184 L 583 191', { stroke: C.ink, w: 1.5, op: ob });
        T('h.bl', 48, 168, 'ARMOUR HERE?', { fam: 'disp', size: 40, op: ob, ls: '0.04em' }, 'must-read');
      }
      const oq = seg(t, 9.6, 10.0) * (1 - seg(t, 15.8, 16.2));
      if (oq > 0) {
        T('q.1', 48, 136, 'Out of ' + PR.per + ' planes hit,', { fam: 'disp', size: 36, op: oq }, 'must-read');
        T('q.2', 48, 174, 'how many never came home?', { fam: 'disp', size: 36, op: oq }, 'must-read');
      }
    }
    if (t >= 9 && t < 16.6) K.commitBox(t, s, { title: F.commit.title, prompt: 'LOST · PER ' + PR.per + ' HIT', out: 16.0 });

    // ── CASE 16-36: the memo ledger
    if (t >= 16.2 && t < 36.2) {
      const oc = seg(t, 16.4, 17.0) * (1 - seg(t, 35.4, 36));
      T('c.org', 48, 122, 'STATISTICAL RESEARCH GROUP · COLUMBIA', { size: 14, op: oc, ls: '0.1em', weight: 500 }, 'secondary');
      T('c.who', 48, 160, 'ABRAHAM WALD · ' + PR.year, { fam: 'disp', size: 40, op: oc, ls: '0.03em' }, 'must-read');
      T('c.ttl', 48, 182, 'A Method of Estimating Plane Vulnerability Based on Damage of Survivors', { size: 14, op: oc }, 'secondary');
      K.ln('c.rule', 'marks', 48, 194, 664, 194, { w: 0.9, op: oc });
      const row = (k, y, n, lab, t0, col) => {
        const o = oc * seg(t, t0, t0 + 0.4); if (o <= 0) return;
        T('c.n' + k, 150, y, String(n), { size: 32, weight: 500, anchor: 'end', op: o, fill: col }, 'must-read');
        T('c.l' + k, 166, y, lab, { size: 18, op: o, fill: col }, 'secondary');
      };
      row(1, 234, PR.flew, 'flew', 21.2, C.ink);
      row(2, 270, PR.returned, 'came home', 23.0, C.ink);
      row(3, 306, LOST, 'never came home', 27.2, C.accent);
      const oh = oc * seg(t, 27.6, 28.0);
      if (oh > 0) {
        T('c.h0', 340, 352, 'the ' + HOLED + ' holed:', { size: 18, op: oh }, 'secondary');
        T('c.h1', 340, 374, PR.hit1 + ' one hole · ' + PR.hit2 + ' two', { size: 18, op: oh }, 'secondary');
        T('c.h2', 340, 396, (HOLED - PR.hit1 - PR.hit2) + ' three to five', { size: 18, op: oh }, 'secondary');
      }
      const ou = oc * seg(t, 32.0, 32.5);
      if (ou > 0) {
        K.ln('c.u', 'marks', 108, 314, 150, 314, { stroke: C.accent, w: 1.6, op: ou });
        K.rc('c.qb', 'marks', 350, 284, 112, 30, { stroke: C.accent, w: 1, dash: '4 3', op: ou });
        T('c.q', 362, 305, 'holes  ?', { size: 18, op: ou, fill: C.accent, weight: 500 }, 'secondary');
      }
    }

    // ── COUNT 36-62 and MONDAY 62-72 (S4)
    if (t >= 36) {
      const out62 = 1 - seg(t, 62, 62.6);
      const oh = seg(t, 36.2, 36.6) * out62;
      if (oh > 0) {
        T('k.h', 340, 128, String(PR.flew), { size: 28, weight: 500, op: oh }, 'must-read');
        T('k.hs', 404, 128, 'flew · one square per plane', { size: 16, op: oh }, 'secondary');
      }
      if (t >= 37.6) {
        const ou = seg(t, 41.6, 41.9) * lerp(1, 0.55, seg(t, 44, 45)) * out62;
        const n = PR.unhit;
        if (ou > 0) {
          T('k.un', 340, 170, String(n), { size: 28, weight: 500, op: ou }, 'must-read');
          T('k.us', 404, 170, 'came home, no holes', { size: 16, op: ou }, 'secondary');
        }
      }
      if (t >= 41.8) {
        const o = seg(t, 41.8, 42.2), late = t >= 57.4;
        T('k.hn', 340, 364, String(HOLED), { size: 28, weight: 500, op: o * (t >= 62 ? lerp(1, 0.6, seg(t, 62, 62.8)) : 1) }, 'must-read');
        T('k.hs2', 390, 364, late ? 'home · 0 of ' + HOLED + ' lost' : 'came home with holes', { size: 16, op: o }, 'secondary');
      }
      if (t >= 42.4) {
        const o = seg(t, 42.4, 42.8), late = t >= 57.4;
        T('k.mn', 340, 400, String(LOST), { size: 28, weight: 500, op: o, fill: C.accent }, 'must-read');
        T('k.ms', 390, 400, late ? 'the data you needed' : 'never came back', { size: 16, op: o, fill: C.accent }, 'secondary');
      }
      const ob = seg(t, 45, 46.2);
      if (ob > 0) K.path('k.br', 'marks', `M 318 ${gy(16)} L 323 ${gy(16)} L 323 ${gy(19) + CS} L 318 ${gy(19) + CS}`, { stroke: C.ink, w: 1.4, op: ob });
      const o80 = seg(t, 46.2, 46.6) * (1 - seg(t, 49.7, 50.0));
      if (o80 > 0) T('k.80', 340, 214, HIT + ' hit = ' + HOLED + ' + ' + LOST, { size: 28, weight: 500, op: o80 }, 'must-read');
      if (t >= 50 && t < 62.6) {
        const sw = t < 56 ? seg(t, 50, 50.3) * (1 - seg(t, 55.7, 55.95)) : seg(t, 56, 56.3) * out62;
        const late = t >= 56;
        let ys;
        if (kc == null) ys = late ? 'YOU   —' : 'YOU   no guess';
        else if (late) ys = 'YOU   ' + g + ' in ' + PR.per;
        else ys = 'YOU   ' + kc + ' of ' + HIT;
        if (sw > 0) T('k.you', 340, 214, ys, { size: 28, weight: 500, op: sw, fill: YOU }, 'must-read');
        if (t >= 52.4) {
          const st = t < 56 ? seg(t, 52.4, 52.7) * (1 - seg(t, 55.7, 55.95)) : seg(t, 56, 56.3) * out62;
          const n = LOST;
          const ts = late ? 'TRUE  ' + Math.round(PR.per * LOST / HIT) + ' in ' + PR.per : 'TRUE  ' + n + ' of ' + HIT;
          if (st > 0) T('k.tru', 340, 252, ts, { size: 28, weight: 500, op: st, fill: C.accent }, 'must-read');
        }
        const orr = seg(t, 54, 54.4) * out62;
        if (orr > 0) {
          T('k.r', 340, 316, '1 in ' + (HIT / LOST), { fam: 'disp', size: 56, op: orr }, 'must-read');
          T('k.rs', 446, 316, LOST + ' ÷ ' + HIT, { size: 16, op: orr }, 'secondary');
        }
      }
      if (t >= 62.4) {
        const om = seg(t, 62.4, 62.9);
        ['Before we copy', 'the winners: who did', 'the same thing and', 'isn’t in this data?'].forEach((l, i) =>
          T('m.q' + i, 340, 150 + i * 40, l, { fam: 'disp', size: 34, op: om, ls: '0.01em' }, 'must-read'));
      }
    }
  },

  tryit(v, s, K) {
    const L = Math.max(0, Math.min(60, Math.round(v.lost))), hit = HOLED + L;
    const per = hit ? Math.round(PR.per * L / hit) : 0;
    const mine = typeof s.answer === 'number' ? `<p>You sealed ${s.answer} in ${PR.per}.</p>` : '';
    return `<div class="ex">SURVIVORS FIXED · ${PR.unhit} UNHIT, ${HOLED} HOLED</div>` +
      `<div class="big">${L} OF ${hit} HIT PLANES LOST</div>` +
      `<div class="ex">${L} ÷ ${hit} · ${per} IN ${PR.per}</div>` +
      `<p>The survivors' data looks the same whatever you choose: it always shows 0 of ${HOLED} lost.</p>` + mine;
  },
};
})();
