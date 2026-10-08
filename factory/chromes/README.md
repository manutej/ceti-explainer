# Chromes

A chrome is the sheet a film is printed on: paper, rules, the eyebrow and title, a ledger or letterhead, the
caption band, the question card and the CETI brand card. Three are available. All stay inside the exec-clean
rule (Q6): typeset numbers in a mono face, paper and pencil texture at most, no icons, no hand-drawn figures.
`PREVIEW.html` renders each one at 960 by 540 with placeholder content and needs no kit; `preview.png` is
its headless screenshot.

**tender-set.js: the Tender Set.** This is the Opera House drafting sheet, taken out of
films/opera-house/film.js and parameterised. It has a manila diazo ground with roller banding and a crease
at x 680, trim marks, a mono eyebrow over a Big Shoulders title, and a REVISIONS ledger in the top right
whose rows type themselves in at their own times. A row can be highlighted in chalk. Below the ledger is a
230 by 84 title block with a DATE slot that takes a SEALED or OPENED stamp, and the caption runs full
measure in Plex Mono at 28. Its cards are black panels with a chalk display line. The geometry matches
factory/kit LAYOUT, so kit scenes drop straight in. Use it for anything that is planned, specified or
issued: schedules, budgets, tenders.

**ledger.js: the Ledger.** This is an accountant's page on cream stock, with a bound-gutter shadow and
edges foxed by noise. Blue-grey rules sit every 30 units under an oxblood double head rule. On the left,
a margin column behind a double oxblood rule holds the running tally, entered row by row. The latest
figure is inked oxblood and ruled under. Ten PARTICULARS rows carry the count, and `layout.rows.baseline(i)`
gives the baseline for setting marks on rule i. On the right, an AUDIT column has a dashed stamp slot.
The caption is set in Newsreader on the last two rules. Its cards are oxblood panels with a cream serif
line between double rules. Use it when the concept is a tally of cases, money or outcomes.

**memo.js: the Memo.** This is a one-page internal memorandum on bone-white bond, folded in thirds. It has
a MEMORANDUM letterhead with TO, FROM, DATE and FILE in Space Mono, and the chapter title is set as the RE:
line in DM Sans 600. A wide text column runs from x 48 to 680. A red-pencil rule at x 708 marks off the
margin, which holds the headline number: Space Mono 700 at 44, underlined twice in pencil, with up to four
15-unit lines under it. The caption is the memo's last line, full measure. There is no paperclip, logo or
icon. Its cards are slate panels with left-set bone type. Use it when the film's job is one decision and
one number for a manager.

| chrome | bg | ink | accent | muted | line | panel | chalk | faces (vendor/fonts.lock.json) |
|---|---|---|---|---|---|---|---|---|
| tender-set | `#E8DCC2` manila | `#1E3A5C` prussian | `#C8452E` red pencil | `#8E887C` concrete | `#5B6F86` blueprint | `#0A0D12` black | `#F2ECDD` | Big Shoulders Display 600, IBM Plex Mono 400/500 |
| ledger | `#F1E8D2` cream | `#2A2420` iron-gall | `#7A1F1F` oxblood | `#9C8F78` | `#8FA3A8` ledger ruling | `#3B1416` deep oxblood | `#F6EFDF` | Newsreader 400/600, Red Hat Mono 400/500 |
| memo | `#F4F1EA` bone | `#2F3A44` slate | `#B8322A` red pencil | `#7D8790` | `#C9C4B8` | `#2F3A44` slate | `#FBFAF6` | Space Mono 400/700, DM Sans 400/500/600 |

## Contract

Each file is a UMD-style module. Under CommonJS it exports the chrome. In a page it registers itself as
`globalThis.CETI_CHROMES[id]`, and that is the only global it touches. Every drawing function takes `kit`
first and calls only `kit.E/tx/ln/rc/stamp/caption`. The functions are pure: no randomness and no clock
reads. The memo's pencil wobble is an integer hash.

- `id`, `palette {bg, ink, accent, muted, line, panel, chalk}`, `fonts` (families) and `faces` (lock files).
- `type`: the CSS family strings the chrome passes as `fam`.
- `layout`: `safe` is the film's drawing area. The ledger also has `rows`, and the memo has `margin`.
- `roles`: the layers each function draws into. Chromes use `chrome`, `cap`, `card` and `top`, and the
  ledger and tender-set also use `field`. `marks` and `labels` are left to the film.
- `ground(p, seed)` returns a 960 by 540 p5.Graphics at density 2. It leaves `p.noiseSeed(seed)` set, so
  reseed after calling it.
- `frame(kit, t, ch, opts)` draws the per-frame chrome. `ch` is `{eyebrow, title}`. The opts differ by
  chrome and are documented at the top of each `frame`. `opts.caption === false` skips the caption.
- `card(kit, t, c)` takes `c {t0, t1, q: [lines], sub, subAt}`.
- `brand(kit, t, t0, takeaway)` is the 3-second end card. For the first 0.6 s the material's last frame
  holds and nothing is drawn. Then the panel, the CETI wordmark on its line and the takeaway (34 units,
  balanced over at most 2 lines) fade in.
- `toKit()` returns `{palette, type}` in the kit's key names (paper, ink, accent, muted, chalk, dark,
  soft) for film.json. The kit's own `caption` tick, `commitBox` and `pencil` then match the chrome.
- `with(overrides)` returns a re-parameterised copy, e.g. `with({block: {title: 'PROJECT X'}})`.

Notes for builders using factory/kit as published:
- `kit.tx` already accepts a CSS family string in `fam`.
- `kit.stamp` takes `face` but sets its text in `FILM.type.disp`. Put `toKit().type` in film.json so the
  slot stamp uses the chrome's face.
- Set `FILM_RENDER.brand = false` and call `chrome.brand(...)` yourself, otherwise the kit's own brand
  card draws over it.
- Sizes: chrome text is 12 units or more and never carries a result. Captions are 28. Card and brand
  text is 14 or more.
