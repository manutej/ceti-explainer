# Brand packs

A brand pack is tokens only: colour roles, type roles, texture, tempo, voice. Patterns read roles, never hex.
Schema: `schema.json`. Each pack is `<id>.json`; `packs.js` is generated from them.

| id | register | ground | ink | accent | faces | texture | tempo (ease, beat) |
|---|---|---|---|---|---|---|---|
| ceti-dark | typeset numbers, few words | #0F1115 | #EDE8DF | #E0B27A | Big Shoulders Display 600; DM Sans 400; IBM Plex Mono 400 | none | cubic 4s |
| neon-lab | glow on black, thin rules | #07080C | #E8F1FF | #3DF5C3 | DM Sans 400; Sofia Sans Extra Condensed 700; Space Mono 400 | grain | expo 3s |
| swiss-grid | grid, flush left, one accent | #FFFFFF | #111111 | #E63312 | Jost 400; Jost 600; Red Hat Mono 400 | none | expo 3s |
| tender-set | drafting sheet, revisions ledger | #E8DCC2 | #1E3A5C | #C8452E | Big Shoulders Display 600; IBM Plex Mono 400 | paper | cubic 4s |
| editorial-serif | a long-form magazine essay, unhurried, one red mark in the margin | #F6F0E2 | #1C1A17 | #8E2A2A | DM Mono 400; Fraunces 400 it; Newsreader 400 | paper | cubic 4.5s |
| terminal | a command line reporting back, terse, lowercase, no adjectives | #0A0D0A | #C9E8CF | #39FF7A | Red Hat Mono 400; Red Hat Mono 500 | grain | linear 2.5s |
| newsprint | a front page: flat declaratives, the headline does the arguing | #D9D5CC | #111111 | #C4161C | Alegreya Sans 400; Alegreya Sans 500; DM Mono 400 | halftone | quad 3.5s |
| midnight-ink | a letterpress invitation read by candlelight, formal and slow | #0F1A33 | #EDE6D3 | #D4AF5A | Cormorant Garamond 500 it; DM Mono 400; Newsreader 400 | paper | sine 5s |
| pastel-pop | a friendly sticker sheet: bouncy, plain words, a joke allowed | #FFF4EC | #241F3A | #E8336D | DM Mono 400; Jost 400; Jost 700 | none | expo 2.5s |
| blueprint | a drafting sheet: dimensions, callouts and notes, exact and unadorned | #0B2A5B | #F2F7FF | #4FE3F5 | IBM Plex Mono 400; IBM Plex Mono 500 | grain | quad 3.5s |
| warm-lab | a friendly researcher at the bench: curious, concrete, show the sample | #EBDCC3 | #3B2618 | #D94F3A | DM Mono 400; DM Sans 400; DM Sans 600 | paper | cubic 4s |
| high-vis | a site warning sign: imperative, capitalised, one instruction per beat | #0C0C0C | #F4F4F0 | #FFD500 | Barlow Semi Condensed 500; Sofia Sans Extra Condensed 700; Space Mono 400 | halftone | expo 2.5s |

Faces are limited to what `vendor/fonts.lock.json` ships, so some roles use a weight or style the lock offers
(Fraunces and Cormorant Garamond exist only as italics).

## Add a pack
1. Copy a pack to `arsenal/brands/<id>.json` (id is lowercase-hyphen and must equal the file name). Fill all eight
   colour roles, three type roles, `texture` (paper, none, grain, halftone), `tempo` and `voice.register`/`end_card`.
2. Take family, weight and style only from `vendor/fonts.lock.json`.
3. Check: `python3 arsenal/tools/brand_check.py arsenal/brands/<id>.json`. Gates: ink/bg 4.5, chalk/panel 4.5,
   accent/bg 3.0, muted/bg 3.0. `chalk` is highest-emphasis text on `panel`: darker than ink on a light pack.
4. Regenerate the bundle (pass every pack, in the order you want):
   `python3 arsenal/tools/brand_check.py arsenal/brands/*.json --emit-js arsenal/brands/packs.js`
5. Palette demo: its variants list is hard-coded in `arsenal/patterns/palette/pattern.js`; add the id there to see it.
