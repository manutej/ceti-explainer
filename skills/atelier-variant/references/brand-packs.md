# Brand packs: schema, the 22 packs, the font and contrast gates, how kit2 applies one

A pack is tokens only: eight colour roles, three type roles, a texture, a tempo, a voice. Films and modules read roles,
never hex. Source of truth: `arsenal/brands/schema.json`; one file per pack `arsenal/brands/<id>.json`; the generated
bundle `arsenal/brands/packs.js`; provenance and the add-a-pack steps in `arsenal/brands/README.md`.

## Schema, role by role (required: id, name, color, type, texture, tempo, voice)
| key | what it is | what it drives in a film | gate |
|---|---|---|---|
| `id` | lowercase-hyphen, equals the file stem; `--` marks a derived pack (`<base>--<transforms>`) | output file name `<film>.<id>.<chrome>.html`; `<meta name="kit2">` | brand_check: id must equal the file name |
| `name`, `notes[]` | label; provenance of any deliberate departure (e.g. a lightness nudge) | nothing on screen | none |
| `color.bg` | the ground | page and stage background (`K.C.paper`); everything is judged against it | ground for the 4 contrast gates |
| `color.ink` | body text and numerals on bg | marks, type, headline digits (`K.C.ink`) | ink/bg >= 4.5 |
| `color.accent` | the one live colour | the emphasised mark, the committed number marker, the reveal (`K.C.accent`) | accent/bg >= 3.0 |
| `color.accent2` | the second voice: the "other" or "wrong" colour | contrasting series, the counter-case (`K.C.soft`) | info only (reported) |
| `color.muted` | secondary text and rules | ghost marks, ledgers, unlit state, chrome text (`K.C.muted`) | muted/bg >= 3.0 |
| `color.line` | hairlines; alpha allowed (`rgba()`); the only role that may carry alpha | rules and grids, composited over bg | none |
| `color.panel` | raised surface | commit-box wash, stamp face, ledger highlight, cards (`K.C.panel`, also `K.C.chalk`) | surface for chalk |
| `color.chalk` | highest-emphasis text ON panel; same polarity as bg (darker than ink on a light pack) | text sitting on panels and cards; candidate for card type | chalk/panel >= 4.5 |
| `color.card` (NOT allowed by the schema; only the synthesised `--brand film` pack carries it) | darker ground for the question and brand cards | card ground (`K.C.dark`) | none |
| `type.disp` | `{family, weight, style?}` headlines and big numerals | headline, big counts, the committed number; metrics compensation applies when the face is wider | face in lock |
| `type.mono` | labels, ledger, digits | tick labels, counters, claims | face in lock |
| `type.body` | running text | captions, prose, commit prompt | face in lock |
| `texture` | `paper` / `none` / `grain` / `halftone` | ground treatment (see "What kit2 does" below) | enum |
| `tempo` | `{ease: linear|quad|cubic|expo|sine, beat_s: 0 < s <= 10}` | seconds per beat and ease family for arsenal modules that read it | range |
| `voice` | `{register, end_card, ...}` | `register` is a one-line description of the house voice for writers; `end_card` is the wordmark on the plain card | non-empty |
| `ramps`, `weights` (optional) | named OKLCH ramps between two roles; role weights for the seeded palette sampler | the arsenal palette pattern only | none |
`additionalProperties: false` on the pack, `color` and `type`; `voice` allows extra keys (tweak.py adds `voice.derived`).

## The 22 packs
Faces are disp / body / mono; `i` = italic-only face. L = light ground, D = dark ground. Tempo in the pack is ease +
beat_s. Every pack has a derived twin on the other side (next section).
| id | L/D | register | faces | derived from |
|---|---|---|---|---|
| ceti-dark | D | typeset numbers, few words | Big Shoulders Display 600 / DM Sans 400 / IBM Plex Mono 400 | CETI house default |
| ceti-marketing | D | deep-sea ground, copper lead, few words, slow | Fraunces 300i / DM Sans 400 / Space Mono 400 | CETI marketing site hex |
| ceti-boardwalk-dark | D | lakeside boardwalk at dusk, soft violet and ember | Fraunces 300i / DM Sans 400 / Space Mono 400 | CETI design system (Academy) |
| ceti-boardwalk-light | L | same, light | same as above | CETI design system (Academy) |
| ceti-coastal-dark | D | quiet coast, teal water, warm sand | Fraunces 300i / DM Sans 400 / Space Mono 400 | CETI design system (Academy) |
| ceti-coastal-light | L | same, light (accent nudged to 3.0:1) | same as above | CETI design system (Academy) |
| ceti-greenhouse-dark | D | greenhouse in low sun, moss and clay | Fraunces 300i / DM Sans 400 / Space Mono 400 | CETI design system (Academy) |
| ceti-greenhouse-light | L | same, light | same as above | CETI design system (Academy) |
| ceti-neosage-dark | D | sage and plum, a notebook that argues gently | Fraunces 300i / DM Sans 400 / Space Mono 400 | CETI design system (Academy) |
| ceti-neosage-light | L | same, light | same as above | CETI design system (Academy) |
| ceti-owala-soft | L | warm cream, one deep ink, berry live colour, teal other voice | Fraunces 300i / DM Sans 400 / Space Mono 400 | Owala soft hex |
| tender-set | L | drafting sheet, revisions ledger; paper texture | Big Shoulders Display 600 / IBM Plex Mono 400 / IBM Plex Mono 400 | the original factory kit look |
| swiss-grid | L | grid, flush left, one accent (red / blue) | Jost 600 / Jost 400 / Red Hat Mono 400 | authored |
| neon-lab | D | glow on black, thin rules; grain | Sofia Sans Extra Condensed 700 / DM Sans 400 / Space Mono 400 | authored |
| editorial-serif | L | long-form magazine essay, unhurried, one red mark; paper | Fraunces 400i / Newsreader 400 / DM Mono 400 | authored |
| terminal | D | command line reporting back, terse, lowercase; grain | Red Hat Mono 500 / 400 / 400 | authored |
| newsprint | L | front page, flat declaratives; halftone | Alegreya Sans 500 / Alegreya Sans 400 / DM Mono 400 | authored |
| midnight-ink | D | letterpress invitation by candlelight, formal and slow; paper | Cormorant Garamond 500i / Newsreader 400 / DM Mono 400 | authored |
| pastel-pop | L | friendly sticker sheet, bouncy, a joke allowed | Jost 700 / Jost 400 / DM Mono 400 | authored |
| blueprint | D | drafting sheet: dimensions, callouts, exact; grain | IBM Plex Mono 500 / 400 / 400 | authored |
| warm-lab | L | researcher at the bench, concrete, show the sample; paper | DM Sans 600 / DM Sans 400 / DM Mono 400 | authored |
| high-vis | D | site warning sign, imperative, one instruction per beat; halftone | Sofia Sans Extra Condensed 700 / Barlow Semi Condensed 500 / Space Mono 400 | authored |
Tempo: 2.5 s (terminal linear, high-vis and pastel-pop expo) is fastest, midnight-ink 5 s sine slowest; the ten CETI-system packs are expo 4 s.
Pick by register first (what the audience expects), then ground (projector, dark-mode page, print), then faces.

## The derived/ twins
`arsenal/brands/derived/<base>--light.json` or `--dark.json`: 22 files made by `python3 arsenal/tools/tweak.py --matrix`
(never hand-edit; re-run after changing a base). Grounds come from OKLCH lightness inversion (dark ground L 0.16-0.22,
light ground L 0.945-0.975); every foreground keeps its hue and chroma and is re-solved to the SAME WCAG ratio it had in
the source, so the contrast order holds. Type, texture, tempo and voice are copied; `voice.derived` records `from` and
`transforms`. `derived/README.md` has the before/after hex and ratios (a PASS for all 22). Twins are not reachable by id in
build.py or apply_findings (see tweak-recipes.md): pass the path or copy the file.

## The vendored-face constraint
- Faces come only from `vendor/fonts.lock.json` (files in `vendor/fonts/`, sha256-checked). No Google Fonts, no runtime
  fetches. List them: `python3 arsenal/tools/tweak.py --fonts`. Available: Alegreya Sans 400/500; Barlow 300-600;
  Barlow Semi Condensed 500/600; Big Shoulders Display 600; Cormorant Garamond 500 italic; DM Mono 400; DM Sans
  400/500/600; Fraunces 300 italic and 400 italic; IBM Plex Mono 400/500; IBM Plex Sans Condensed 400/600; IM Fell English
  400; Jost 400-700; Newsreader 400/600; Red Hat Mono 400/500; Sofia Sans Extra Condensed 500/600/700; Space Mono 400/700.
- Italic-only faces: Fraunces (300i, 400i) and Cormorant Garamond (500i) exist only as italics, so a pack using them
  declares `"style": "italic"` on that role; asking for them upright, or a missing weight, is refused. `family` is the
  CSS family exactly as the lock spells it; `weight` is an integer multiple of 100.
- kit2 `build.py` refuses a pack whose role face (family, weight, style) is not in the lock, and checks every font file's
  sha256. It also embeds the kit's working weights when the lock has them in the pack's style (disp 600, mono 500 and
  700, body 600); a missing optional weight is skipped, a missing declared one is fatal.
- WebGL text and extruded type use TTFs from `arsenal/fonts/fonts.js` (Big Shoulders Display 600, IBM Plex Mono 400,
  Sofia Sans Extra Condensed 700, Space Mono 400, Jost 600, Red Hat Mono 400), listed in film.json `fonts3d`; a pack with
  another disp face leaves 3D headlines on the first loaded fallback, so check them on the contact sheet.
- Wider display faces: kit2 sets display text smaller by the measured advance ratio (floors 28 / 14 / 12 units), so a
  switch to a wider face can crowd at the floors; look.

## brand_check.py, the contrast gate
`python3 arsenal/tools/brand_check.py arsenal/brands/<id>.json [more...] [--emit-js arsenal/brands/packs.js]`
Checks: schema; id equals the file stem; each type face in the lock; WCAG 2.x ratios ink/bg >= 4.5, chalk/panel >= 4.5,
accent/bg >= 3.0, muted/bg >= 3.0 (info only: accent2/bg, ink/panel). Exit 1 on any failure. Use opaque colours for
contrast; only `line` may carry alpha. Note the gate does not check accent2/bg: confirm a second voice still reads when
the pack goes on a contact sheet. `--emit-js` regenerates the bundle from the packs you pass, in that order.

## How kit2 applies a pack (zero film edits)
Build: `python3 factory/kit2/build.py factory/films/<id> --brand <pack id | path to .json | film> --chrome <id> [--material ink]`
(`--brand film`, the default, synthesises a pack from film.json). Roles resolve once (`resolveRoles`):
bg -> ground; ink -> marks and type; accent / accent2 -> emphasis / second voice; muted, line (composited over bg), panel;
chalk -> the surface (panel); dark -> `card` or the darker of panel and ink/bg (question and brand cards); onDark -> the
first of bg, panel, chalk, ink, white at >= 7:1 on it. Faces: type.disp / mono / body (body = the film's "sans").
Proven (factory/kit2/PROOF.md): 2 films x 4 brands x 4 chromes = 32 of 32 gate PASS with zero edits to film.js, film.json
or claims.json; a 3D film rebuilt under editorial-serif, swiss-grid and a tweak derivative with zero edits, 4 s per build,
gate PASS with the same single warning (the running-counter WARN), build bytes within the 1.3 MB limit.
What changes for free: ground, ink, accent, second voice, muted, lines, panels, cards, headline faces (with size
compensation), brand-card colours, the plain end card wordmark (`voice.end_card`, only with chrome `none`), the page's
CSS variables, and any role-driven effect a film has (a 3D film's neon glow shows on dark grounds and is plain ink on paper, by design).
What does not change:
- Colours a film hard-codes as hex rather than roles (kit2 lifts only text fills to 4.5:1; canvas fills keep the hex).
- Absolute positions authored for the original display face; wider faces are shrunk, not repositioned.
- `tempo` and `voice.register`: kit2 does not read them (films hand-time with their own segments); they inform writers
  and arsenal modules.
- Texture: at level `exec` only `none` and `paper` are drawn; `grain` and `halftone` are drawn flat and the gate's G10
  WARNs (`texture none (declared grain)`). The material stays `ink` at exec level (chalk/pencil FAIL G10).
- Chromes hard-code the CETI wordmark; `voice.end_card` reaches only the plain card.
After a build, run the gate and look at a contact sheet: judge the brand (hierarchy kept, second voice distinct, glow or
label colours legible on the new ground), not the film (see tweak-recipes.md for the commands).
