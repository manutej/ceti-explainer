# factory/kit · the 75-second case kit

Derived from films/opera-house ("The Tender Set"). A builder writes three files in `factory/films/<id>/`:
`film.json`, `film.js`, `claims.json`. Then:

    python3 factory/kit/build.py factory/films/<id>            # -> factory/films/<id>/build/<id>.html
    python3 factory/kit/build.py factory/films/<id> --out build/x.html

It prints the path, bytes and sha256 (same inputs, same bytes). It refuses a font that is not in
vendor/fonts.lock.json or whose bytes do not match the lock, a p5 that does not match vendor/SHA256SUMS,
a film.json missing a required key, and a missing claims.json. It warns over 1.3 MB page / 120 KB film code.

| file | role |
|------|------|
| kit.js | window.KIT: retained SVG pool, primitives, chrome, captions, cards, commit box, brand card, paper ground, maths, mount/render |
| player.js | the page: player, scrub, CC, chapters, sealed commit (pause, 8 s, "no answer"), rail, try-it, transcript, sources, honest limits; window.__film, window.__ctrl |
| shell.html | page template; placeholders {{FONTS}} {{PALETTE}} {{TITLE}} {{EYEBROW}} {{LEDE}} {{P5}} {{FILM}} {{KIT}} {{FILMJS}} {{PLAYER}} |
| build.py | assembles the page |
| smoke/ | a 20 s film that touches every helper; shots/ has stills |

## film.json

| key | type | notes |
|-----|------|-------|
| id | string | file name of the build |
| title, eyebrow, lede | string | page header (HTML-escaped) and `chrome` block title default |
| dur | number | total seconds INCLUDING the 3 s brand card (e.g. 75) |
| seed | int, optional | paper ground + p5 noiseSeed (default 23) |
| palette | {paper, ink, accent, muted, chalk, dark, soft} hex | any key omitted falls back to the Tender Set; optional page, panel, pageMuted for the HTML page |
| type | {disp, mono, sans?} | CSS families; each must be in `fonts` (defaults Big Shoulders Display / IBM Plex Mono) |
| fonts | [{family, weight, style}] | each must exist in vendor/fonts.lock.json (family exactly as the lock spells it) |
| commit | {at, prompt, default, min, max, unit, title?, step?} | `at`: the page pauses here; film mode uses `default` |
| chapters | [{id, t0, t1, eyebrow, title}] | buttons + `chrome` eyebrow/title; `#id` deep-links |
| cards | [{id, t0, t1, q: [lines], sub, subAt, label?}] optional | dark question cards via `KIT.card` |
| captions | [[t0, t1, text]] | drawn by the kit at 28 units (max 2 lines, ~50 mono chars each); also the transcript |
| brand | {takeaway, at?} | end card at `at` (default dur − 3) |
| sources | [[key, text]] | at least 3 |
| honest | string or [string] | honest-limits paragraphs on the page |
| tryit | {title, note, seek, inputs: [{id, label, min, max, step, value, unit}]} optional | needs FILM_RENDER.tryit |

Anything else (your data, timings, ledger rows) can live in film.json too: it is `window.FILM` / `KIT.FILM`.

## The FILM_RENDER contract

```js
window.FILM_RENDER = {
  setup(p, K) {},            // once, after the p5 canvas exists; precompute here (seeded shuffles, quantiles)
  render(t, state, K) {},    // PURE: draw frame t. No Math.random / Date / performance / frameCount / millis.
  tryit(values, state, K) {},// optional: HTML string for the try-it output pane (values = state.try)
  captions: false,           // optional: draw captions yourself (K.caption(t, {..}))
  brand: false,              // optional: draw the brand card yourself (K.brandCard(t, t0, line))
  ground: false,             // optional: no paper ground
};
```

Per frame the kit: clears the canvas, draws the paper ground, calls `render(tm, state, K)` inside
ctx.save/restore, draws the caption, draws the brand card when t ≥ brand.at, then `endFrame()`.
From brand.at on, `tm` is frozen at brand.at − 0.001, so the material's last frame holds under the card.

`state.answer` is the commit: a number, `'none'` (timer ran out / "No answer"), or `null` (not yet; live page).
Film mode sets it to `commit.default`. `K.answered(state)` is true only for a number. Never show anything
numeric derived from it before the commit's seal (`commit.at + 4.5`). `state.try` holds try-it values and
`state.tryOn` turns true once the viewer touches the panel.

## KIT reference (all on window.KIT, passed as K)

- Pool: `E(key, tag, layer, attrs, text)`; layers bottom→top `field marks labels chrome cap card top`.
  Call every frame an element is visible; untouched elements are stripped and detached at `endFrame`, so the
  SVG at t is byte-identical however you seek there. Keys are global: make them unique.
- Primitives: `tx(key, layer, x, y, s, {size, fam: mono|disp|sans, fill, anchor, ls, op, weight, rot, tr})`,
  `ln(key, layer, x1, y1, x2, y2, {stroke, w, op, dash})`, `rc(key, layer, x, y, w, h, {fill, fo, stroke, w, rx, op, dash, tr})`,
  `path(key, layer, d, {...})`, `dim(key, layer, x1, x2, y, label, op, {size, stroke})`,
  `stamp(key, layer, cx, cy, scale, text, {op, rim, face, rot, w, h, fs})`.
- Sheet: `chrome(t, chapter|null, {ledger: {title, rows: [[t, text]], hl}, block: {title, lines: [2], slotLabel, slot, open}, marks})`.
  `LAYOUT`: content x 48–664, y 104–400; ledger x 700, from y 44, 19 per row (max 4 rows while the commit box
  shows, ~12 otherwise); title block 700,312 230×84; captions from y 446 to 480. Ledger text is 12 units:
  chrome only, never a result.
- Devices: `caption(t, o)`, `card(t, c)`, `roll(t, t0, dur, key)` (nothing before t0; use t0 = 0 for the
  opening unroll), `commitBox(t, state, {x, y, w, h, title, prompt, seal, out})` (default box 700,150 230×150),
  `brandCard(t, t0, line)`.
- Canvas: `K.p` (p5), `K.ctx` (Canvas2D, design units, density 2), `makeGround(p, seed, palette)`,
  `pencil(x1, y1, x2, y2, u, seed, {col, w, a, over})`.
- Maths: `clamp seg ease eout lerp typed fmtK mulberry32 shuffle(arr, seed) PhiInv wrap rgba(key|hex, a) hexRgb`.
- Data: `FILM DUR FILM_MODE C (palette) FONT LAYOUT state chapterAt capAt cardAt brandAt answerStr answered`.

Hooks for workers (player.js): `window.__film.{ready(), seek(t) -> {t, error}, only(groups), info}` and
`window.__ctrl.{play, pause, seek, setState(obj), state, duration}`. `?film=1` = bare 1920×1080 stage.

## A 30-line example (film.js)

```js
(function () {
const F = window.FILM; let ORDER;
window.FILM_RENDER = {
  setup(p, K) { ORDER = K.shuffle([...Array(F.n).keys()], 7); },
  render(t, s, K) {
    const { tx, rc, dim, seg, ease, fmtK, C, LAYOUT: { content: B } } = K;
    K.chrome(t, null, { ledger: { title: 'LEDGER', rows: F.ledger }, block: { title: 'CASE 01', lines: ['SHEET 1', 'ISSUED'], slot: t > F.commit.at + 4.5 ? 'SEALED' : null } });
    K.roll(t, 0, 1.0);
    if (t < 16) {                                     // HOOK
      dim('plan', 'labels', B.x0, B.x0 + 400, 220, '12 MO', seg(t, 1, 1.6));
      tx('h', 'labels', B.x0, 300, K.typed('Everyone signed it.', t, 2, 20), { fam: 'disp', size: 40 });
    }
    if (t >= 7 && t < 17) K.commitBox(t, s, { title: 'YOUR GUESS', prompt: 'OF 1,000' });   // COMMIT
    if (t >= 36) {                                    // THE COUNT: marks first, ratio after
      const k = Math.round(F.hits * seg(t, 38, 50)), ctx = K.ctx;
      for (let i = 0; i < F.n; i++) {
        const lit = ORDER.indexOf(i) < k && ORDER.indexOf(i) < F.hits;
        ctx.fillStyle = lit ? K.rgba('accent', 0.9) : K.rgba('ink', 0.75);
        ctx.fillRect(B.x0 + (i % 40) * 14, B.y0 + 20 + Math.floor(i / 40) * 14, 10, 10);
      }
      tx('k', 'labels', B.x0, 390, fmtK(k) + ' OF ' + fmtK(F.n), { fam: 'disp', size: 40, fill: C.accent });
      if (K.answered(s)) tx('you', 'labels', B.x0 + 380, 390, 'YOU SAID ' + s.answer, { size: 28, op: seg(t, 52, 53) });
    }
  },
};
})();
```

## Things a builder must know

- Every pooled key must be unique across the film; reuse a key only for the same element.
- Draw canvas mass in `render` from t only; precompute in `setup`. The kit resets the transform each frame.
- Captions at 28 units take the bottom band (y ≈ 406–490); keep the structure inside `LAYOUT.content`.
- `roll` and `card` share fixed keys (`rl.*`, `cd.*`); one at a time, or pass a `key` to `roll`.
- The commit HTML overlay sits over the default commit box position; if you move the box, the overlay stays.
- The kit does not patch itself per film: if you need more, add it to your film.js and note it in NOTES.md.
- Probe: `node factory/kit/probe.mjs $PWD/factory/films/<id>/build/<id>.html $PWD/<shots-dir> 5,20,45,73`
  (absolute paths): zero-error load, stills, re-seek purity of SVG and canvas, the live commit (pause, seal,
  8 s "no answer"). Its live checks assume commit.at is reachable by playing from commit.at − 0.3.
