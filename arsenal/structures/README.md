# ARSENAL.structures · layouts for counts

Pure layout functions. They return positions and sizes and never draw, so material, motion and brand stay independent.
Load `structures.js` (browser global `ARSENAL.structures`, or `require` in node). Units are the caller's; fit() assumes a 960 basis.

Layout = `{ kind, n, box, size, legible, items:[{i,x,y,w,h,g,a,hl}], ...extras }`. `x,y` are mark CENTRES; `i` is a stable mark
identity (transitions match by `i`/index); `g` group; `a` alpha; `hl` highlight flag. `box` = `{x,y,w,h}`.

| call | returns |
|---|---|
| `fit(box, n, {gap=.2, min=7, basis=960, cols, maxSize})` | `{cols,rows,pitch,size,legible,group}`; if size < 7 units, `legible:false` and `group` = marks per symbol to recover it |
| `grid(n, cols\|0, box, opts)` | row-major cells, centred; cols 0 = best fit |
| `wall(n, box, sortKey)` | stacked histogram of bricks; sortKey = array or fn(i); extras `bins, heights` |
| `ring(n, r, {cx,cy,inner})` | concentric rings (a disc) when one ring cannot stay legible; items carry `rot, r` |
| `columns(groups, box, {labels,groupGap,spread})` | one stack per group growing up from the baseline; extras `groups:[{n,label,x,y,w,h,cx}]` |
| `rows(groups, box, opts)` | the transpose: bands left to right, stacked down |
| `timeline(events, box, {size,labelW,pad,laneH})` | events = times or `{t,label}`; items get `stem`, `ly`, `side`, `lane`; extras `axis` |
| `tree(nodes, box, {maxSize})` | nodes = parent indices or `{parent}`; tidy contour layout; extras `edges:[{from,to,x1,y1,x2,y2}]` |
| `scatter(n, box, seed, {shrink=.65})` | seeded blue noise (Mitchell best-candidate) |
| `transition(A, B, u, {stagger,by,arc,ease})` | interpolates by index; `stagger` 0..1.. spreads starts by `by` = 'index'/'x'/'y'/fn; `arc` bends paths; unmatched marks fade |
| `highlight(layout, pred)` | copy with `hl` set where `pred(item,i)`; adds `hits`, `hitCount` |

`groups` for columns/rows may be counts, `{n,label}`, or arrays of mark indices (use arrays to keep identity across a transition from a grid).

Rules: no Math.random or Date; the only seed is scatter's. Drawing is the caller's job (see `patterns/structures-demo`).
WARN: scatter can overlap a few marks (best-candidate, not Poisson-disk); lower `shrink` or raise `candidates` for a stricter field.
WARN: ring spreads n across rings by capacity, so ring counts per ring are even, not full; wall bin count follows the largest legible pitch.
