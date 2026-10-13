/* factory/kit2/materials/basic.js · the fallback materials (ink, pencil) when arsenal/materials/drawn is absent.
   Same interface as arsenal/materials/drawn/materials.js:
     mark(p, kind, x, y, w, h, st, tokens)  kind: rect | bar | dot | line;  st {seed, i, u, role, a}
     texture(p, box, tokens)                box {x, y, w, h, seed}
   Pure: every wobble comes from mulberry32(st.seed + st.i). */
(function (root) {
  'use strict';
  const A = root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const col = (tk, role) => tk.color[role || 'ink'] || tk.color.ink;
  function speck(c, r, box, n, colr, a) { c.fillStyle = colr; for (let i = 0; i < n; i++) { c.globalAlpha = a * (0.4 + 0.6 * r()); c.fillRect(box.x + r() * box.w, box.y + r() * box.h, 1, 1); } }
  const ink = {
    id: 'ink',
    mark(p, kind, x, y, w, h, st, tk) {
      st = st || {}; const u = st.u == null ? 1 : st.u; if (u <= 0) return;
      const c = p.drawingContext; c.save(); c.globalAlpha = st.a == null ? 1 : st.a; c.fillStyle = c.strokeStyle = col(tk, st.role);
      if (kind === 'bar') c.fillRect(x, y, w * u, h);
      else if (kind === 'rect') c.strokeRect(x, y, w, h);
      else if (kind === 'dot') { c.beginPath(); c.arc(x, y, w / 2 * u, 0, 2 * Math.PI); c.fill(); }
      else { c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * u, y + h * u); c.stroke(); }
      c.restore();
    },
    texture(p, box, tk) { if (tk.texture !== 'grain') return; const c = p.drawingContext; c.save(); speck(c, mulberry32((box.seed | 0) + 90001), box, Math.round(box.w * box.h / 220), tk.color.ink, 0.06); c.restore(); },
  };
  const pencil = {
    id: 'pencil',
    mark(p, kind, x, y, w, h, st, tk) {
      st = st || {}; const u = st.u == null ? 1 : st.u; if (u <= 0) return;
      const c = p.drawingContext, r = mulberry32((st.seed | 0) + (st.i | 0));
      c.save(); c.globalAlpha = (st.a == null ? 1 : st.a) * 0.9; c.strokeStyle = col(tk, st.role); c.lineWidth = 1.1; c.lineCap = 'round';
      const line = (x1, y1, x2, y2) => { const j = () => (r() - 0.5) * 1.2; c.beginPath(); c.moveTo(x1 + j(), y1 + j()); c.quadraticCurveTo((x1 + x2) / 2 + j(), (y1 + y2) / 2 + j(), x1 + (x2 - x1) * u + j(), y1 + (y2 - y1) * u + j()); c.stroke(); };
      if (kind === 'bar') { for (let k = -h; k < w * u; k += 3) line(x + Math.max(0, k), y + Math.max(0, -k), x + Math.min(w * u, k + h), y + Math.min(h, h - (k + h - Math.min(w * u, k + h)))); line(x, y, x + w * u, y); line(x, y + h, x + w * u, y + h); }
      else if (kind === 'rect') { line(x, y, x + w, y); line(x + w, y, x + w, y + h); line(x + w, y + h, x, y + h); line(x, y + h, x, y); }
      else if (kind === 'dot') { c.beginPath(); c.arc(x, y, w / 2 * u, 0, 2 * Math.PI); c.stroke(); }
      else line(x, y, x + w, y + h);
      c.restore();
    },
    texture(p, box, tk) { const c = p.drawingContext; c.save(); speck(c, mulberry32((box.seed | 0) + 90002), box, Math.round(box.w * box.h / 140), tk.color.ink, 0.07); c.restore(); },
  };
  A.materials.ink = A.materials.ink || ink;
  A.materials.pencil = A.materials.pencil || pencil;
})(typeof window !== 'undefined' ? window : globalThis);
