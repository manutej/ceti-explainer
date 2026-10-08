# TWEAKS: ten recipes for `tweak.py`

`python3 arsenal/tools/tweak.py <base> <transforms...>` derives a new brand pack in OKLCH, runs `brand_check.py` on it, and
writes it to `arsenal/brands/derived/<id>.json` only if it passes. `<base>` is a pack id (searched in `arsenal/brands/`, then
`derived/`) or a path. Add `--out DIR` to write elsewhere, `--print` to see the JSON. Transforms run left to right.

Id rule: `<base>--<tokens>`; a base that already has `--` just gets `-<tokens>` appended, so derived packs chain.
Tokens: `dark` `light` `hue40` `huem30` `c2` `cm3` `acc0a7b5c` `mono` `typejost` `tempo1p5` `grain`.
Provenance goes in `voice.derived` (`from`, `transforms`).

Gate repair: if a transform pushes ink/bg or chalk/panel below 4.5, or accent/bg or muted/bg below 3, the tool steps that
foreground's OKLCH lightness (hue and chroma fixed) until the gate passes, and prints a `NUDGED ...` line with before and after.
If `--accent` was used, accent2 is re-derived from the nudged accent so the complement relation holds.

| Transform | What it does |
|---|---|
| `--hue <deg>` | rotates accent, accent2 and the tinted neutrals; L and C kept, so ground and ink lightness hold. `--hue-accents-only` leaves the ground alone |
| `--dark` / `--light` | perceptual twin. Grounds by lightness inversion (dark L 0.16-0.22, light L 0.945-0.975); each foreground keeps hue and chroma and is re-solved to its source WCAG ratio, softly compressed at the top; reports whether contrast order held. No-op if the pack is already that side |
| `--contrast <n>` | ink/chalk 0.03 L per step, accents 0.04, muted 0.02, away from the ground (+) or toward it (-). Use `--contrast=-3` for negatives |
| `--accent <hex>` | sets accent; accent2 = complement (h+180) at the same L and C |
| `--mono` | neutrals chroma x0.15, accent keeps chroma, accent2 becomes a grey between muted and ink |
| `--type d/m/b` | swap faces, `Family[:weight][:italic]`, `_` keeps a role. Only faces in `vendor/fonts.lock.json`; `--fonts` lists them |
| `--tempo <x>` | `beat_s` times x (capped at the schema's 10) |
| `--texture <name>` | `paper`, `none`, `grain`, `halftone` |

## 1. The dark sheet: a light brand on a dark screen
`python3 arsenal/tools/tweak.py tender-set --dark`
For the drafting-sheet brand when the film plays on a dark stage or a dark-mode page. Navy ink becomes a pale blue (hue kept), the
rust accent keeps its hue at a lightness that still reads on near-black. Output `tender-set--dark`.

## 2. The print twin: a dark brand for a handout, PDF or poster still
`python3 arsenal/tools/tweak.py ceti-dark --light`
Same hue identity, ink and accent flipped to sit on a pale ground. The gold accent goes to a deep amber rather than mud.

## 3. Hue-shift a whole brand for a sibling series
`python3 arsenal/tools/tweak.py ceti-dark --hue 150`
Rotates the gold and red accents (and the faint tint in the neutrals) by 150 degrees, keeping every lightness, so contrast
numbers are unchanged. Use it to give a second series its own colour family without a redesign.

## 4. A client accent colour, with its second voice made for you
`python3 arsenal/tools/tweak.py swiss-grid --accent '#0A7B5C'`
Drops the client's green in as `accent` and builds `accent2` as its complement at matched lightness, so the "wrong" colour
sits at the same visual weight. If the green is too dark for the ground, the nudge line says how far it moved.

## 5. Projector or bright-room boost
`python3 arsenal/tools/tweak.py neon-lab --contrast 3`
Pushes ink, chalk, accents and muted away from the ground (about +0.1 L). For a washed-out projector, a phone in sunlight, or
thin condensed type at small size.

## 6. A quieter register: lower contrast and a slower beat
`python3 arsenal/tools/tweak.py ceti-dark --contrast=-3 --tempo 1.6`
Pulls everything toward the ground and stretches `beat_s` from 4 to 6.4 s. For late-evening, reflective or ambient pieces.
Anything pulled under a gate is nudged back and reported.

## 7. One-accent system for a serious data film
`python3 arsenal/tools/tweak.py tender-set --mono`
Neutrals go nearly grey, accent2 becomes a grey, and the rust accent is the only colour on screen, so a highlighted number
cannot be confused with decoration.

## 8. Swap the display and mono faces
`python3 arsenal/tools/tweak.py swiss-grid --type 'Sofia Sans Extra Condensed:700/Space Mono/_'`
Condensed display and a squarer mono, body unchanged. Weights are checked against the lock; `--type 'Foo/_/_'` prints the
families you can use. For a Jost body at another weight: `--type '_/_/Jost:500'`.

## 9. Social cut: grain and a faster beat
`python3 arsenal/tools/tweak.py ceti-dark --texture grain --tempo 0.6`
Adds the grain texture and takes the 4 s beat to 2.4 s. For a vertical teaser cut from a long film.

## 10. Chain it: a different brand in one line, then adjust the result
`python3 arsenal/tools/tweak.py ceti-dark --light --accent '#2255ff' --texture paper --type '_/_/Newsreader'`
then
`python3 arsenal/tools/tweak.py ceti-dark--light-acc2255ff-paper-typenewsreader --hue 20`
The first line makes a paper-textured light brand with a blue accent and a serif body; the second rotates that derived pack,
because `<base>` also searches `arsenal/brands/derived/`. Order matters: `--accent` before `--hue` rotates the accent you set.

## The matrix
`python3 arsenal/tools/tweak.py --matrix` writes the opposite-side twin of every pack in `arsenal/brands/` to
`arsenal/brands/derived/` (`<id>--dark` or `<id>--light`), plus `README.md` (before and after hex and contrast table) and
`packs.js`. Re-run it after adding or changing a base pack.
