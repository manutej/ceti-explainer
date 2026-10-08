/* ════════════════════════════════════════════════════════════════════
   core/po/track.js — the switchyard: one entry line, a junction J, n tracks
   --------------------------------------------------------------------
   Generalised from films/typesafe (data.js G.J/fan/queue + layers/yard.js
   buildTracks/onTrack/slot). Track i: cubic J → (J.x+64, J.y) → (J.x+86, ys[i])
   → (xBend, ys[i]), then straight to x1. Every mark moves ALONG these curves.
   spec: { kind:'track', id, n, context? (the line above the yard) }
   anchors: J, track:i (bend point), end:i
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  const PO = root.PO;
  const M = 512;   // arc-length table resolution
  PO.kind('track', {
    create(spec) {
      const n = spec.n || 8, top = spec.top || 162, bot = spec.bottom || 428;
      const ys = Array.from({ length: n }, (_, i) => n === 1 ? (top + bot) / 2 : top + (bot - top) * i / (n - 1));
      const J = { x: 250, y: Math.round((top + bot) / 2 - 1) };
      const geom = { n, J, entry: { x0: 60, x1: J.x, y: J.y }, fan: { xBend: 400, x1: 900, ys },
        labels: { tokX: 416, probX: 872 }, queue: { x0: 470, x1: 860, rows: 6, pitch: 3.6 }, context: { x: 60, y: 126 } };
      const anchors = { J };
      ys.forEach((y, i) => { anchors['track:' + i] = { x: geom.fan.xBend, y }; anchors['end:' + i] = { x: geom.fan.x1, y }; });
      return { geom, anchors, state: { context: spec.context || '' } };
    },
    /** arc-length tables, one per track: { len, curve (arc length of the bend), xy Float32Array } */
    tables(geom) {
      const J = geom.J, F = geom.fan;
      return F.ys.map(y => {
        const P = [[J.x, J.y], [J.x + 64, J.y], [J.x + 86, y], [F.xBend, y]];
        const at = (u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
        const pts = []; for (let i = 0; i <= 200; i++) pts.push(at(i / 200));
        const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        const curve = L[L.length - 1];
        pts.push([F.x1, y]); L.push(curve + (F.x1 - F.xBend));
        const len = L[L.length - 1], xy = new Float32Array((M + 1) * 2); let j = 0;
        for (let k = 0; k <= M; k++) {
          const s = len * k / M; while (j < L.length - 2 && L[j + 1] < s) j++;
          const f = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
          xy[2 * k] = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f; xy[2 * k + 1] = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f;
        }
        return { len, curve, y, xy, ctrl: P };
      });
    },
    onTrack(TR, i, s, out) {
      const T = TR[i], q = Math.max(0, Math.min(M, s / T.len * M)), k = Math.min(M - 1, q | 0), f = q - k, a = T.xy;
      out[0] = a[2 * k] + (a[2 * k + 2] - a[2 * k]) * f; out[1] = a[2 * k + 1] + (a[2 * k + 3] - a[2 * k + 1]) * f;
      return out;
    },
    /** slot j of a ribbon on track i: rows × columns between queue.x0 and x1 */
    slot(geom, TR, i, j, ncol) {
      const Q = geom.queue, cp = (Q.x1 - Q.x0) / ncol, c = Math.floor(j / Q.rows), r = j % Q.rows;
      const x = Q.x0 + cp * (c + 0.5);
      return { s: TR[i].curve + (x - geom.fan.xBend), off: (r - (Q.rows - 1) / 2) * Q.pitch, x, c };
    },
  });
})(typeof window !== 'undefined' ? window : globalThis);
