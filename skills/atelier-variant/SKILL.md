---
name: atelier-variant
description: "Make a VARIANT of a finished factory film with zero film edits: a client-branded version (any of the 22 brand packs or a tweak.py derivative matching a client's hex, dark or light twin, mono, warmer or cooler), a different chrome (tender-set, ledger, memo, none), a material or level change, and the planned cuts (9:16 reel, LinkedIn cut). Builds with kit2, gates, shoots a contact sheet, seats the BRAND not the film, records the look. Use for 'rebrand this film for <client>', 'make a dark version', 'match our accent colour', 'client-branded versions', 'swap the chrome', 'social cut of X', 'portrait reel', 'brand matrix', or the P3 kind of test. Not for changing what the film says (that is atelier-draft on a new brief)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` and the laws in `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md`. The film's
> sources are never edited here; only packs, chromes, materials, levels and cut parameters. No git from this skill.

# atelier-variant · finished film → faithful variant

The category: **the same claims and motion under a different design system or frame, judged on whether the
brand holds, not on whether the film works (it already passed).** Instances differ in pack, chrome, material,
level and cut; the procedure and the checks do not.

## Typed slots

```
Film:      factory/films/<id>/  (gate PASS, look recorded in film.json)
Ask:       {kind: brand|chrome|material|level|cut, spec: str}            // "match #1F6FEB", "dark twin", "ledger chrome", "9:16"
Pack:      PackId | path to a derived pack (arsenal/brands/derived/ or factory/films/<id>/brand.<id>.json)
Transforms: list[tweak.py flags]                                          // references/tweak-recipes.md
Look:      {brand, chrome, material, level, renderer}
Page:      build/<id>.<brand>.<chrome>.html
Checks:    brand_check.py (contrast) → build → gate --quick → contact sheet at 3 beat times → brand seat
Seat:      {pack, bg, roles honoured: list, pins legible: bool, reveal reads: bool, verdict SHIP|REVISE, why}
Record:    factory/films/<id>/variants/<name>/{pack.json?, gate.json, contact.png, report.json, SEAT.md}
```

## Procedure

1. **Find the base pack the page was really built from**, then resolve the ask. The base is
   `factory/films/<id>/brand.<look.brand>.json` when that file exists (a film-local copy, usually because the library
   pack's display face is italic-only or unvendored), else `arsenal/brands/<look.brand>.json`; record the path you used
   in SEAT.md. An existing id for the ask: use it. A client spec: derive with
   `python3 arsenal/tools/tweak.py <base> <transforms> --out <dir>` (recipes in `references/tweak-recipes.md`),
   check it with `python3 arsenal/tools/brand_check.py <pack>` (WCAG and vendored faces). A pack whose display face
   is not vendored non-italic needs a film-local copy with a vendored face (`brand.<id>.json` in the film dir; pass
   its path to build.py).
2. **Build and gate**: `python3 factory/kit2/build.py factory/films/<id> --brand <pack|path> --chrome <chrome>
   [--material m]`; `node factory/tools/gate.mjs <page> --film factory/films/<id> --kit factory/kit2 --quick --json
   <record>/gate.json`. Exec level refuses non-ink materials and textures (G10); do not fight it.
3. **Shoot the contact sheet** at three times computed from film.json (`dur`, `chapters`, `count.at`), never guessed:
   the CASE picture (midpoint of the CASE chapter), the reveal (`count.at` + 2 s, or the COUNT chapter's last third),
   and the brand card (`dur - 1.5`). `node arsenal/tools/shoot.mjs <page> --out <record> --times <f1,f2,f3>` takes
   FRACTIONS of `dur` (t / dur, three decimals). Keep contact.png and report.json; delete the full stills.
4. **Seat the brand** from the contact sheet: do the box or mark colours follow accent / accent2 / muted, do
   pins and captions stay legible on the new bg, does the reveal read (a glow on dark, plain on paper is by
   design), does the type role (disp / mono / body) carry. Verdict SHIP or REVISE with the role that fails.
5. **Record and hand back** (≤ 120 words): look, page path and bytes (the page stays in `build/`, decision D10; the
   record holds its path and sha256 in SEAT.md, never a copy), gate verdict, seat verdict, the pack path, and whether
   the derived pack is promoted: promote to `arsenal/brands/derived/` only when it is not client-confidential, passes
   brand_check.py and reads well on one other film; a client pack stays film-local, with its `id` renamed to
   `<client>-<light|dark>` and its `name`/`notes` rewritten for the client (tweak.py inherits the base's notes).

## Rules

- Zero edits to film.js, film.json claims, captions or knobs; a variant that needs one is a new draft.
- A derived pack is named `<base>--<transforms>` and carries `voice.derived` (tweak.py does this).
- A light twin of a dark pack keeps the base hue in its ground (a navy base gives a lavender paper); when the client
  wants neutral paper, set `bg`, `panel` and `line` by hand to a paper triple from an existing light pack (recipe in
  tweak-recipes.md) and re-run brand_check.py.
- Face classes for "grotesk / serif / mono" asks are in brand-packs.md; pick within the vendored set only.
- A 9:16 cut is not available until kit2 has a portrait basis (docs/PROTOTYPES.md P2); say so instead of cropping.

## References (read on demand)

- `references/brand-packs.md` — schema roles and what each drives, the 22 packs, twins, vendored faces, contrast gate.
- `references/tweak-recipes.md` — tweak.py transforms and recipes for the common client asks; shoot/sweep usage.
- `${CLAUDE_PLUGIN_ROOT}/factory/films/simpsons-3d/PROTOTYPE.md` §P3 — a measured brand switch to calibrate against.
