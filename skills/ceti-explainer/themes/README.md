# Theming — make this any brand

Diagrams reference **role tokens only** (`var(--ex-*)`, `var(--font-*)`), never raw hex. So re-skinning is a token swap — no diagram code changes.

```
python3 assets/build.py mything.js "My Thing" --brand "Acme Labs" --theme themes/acme.css
```

A theme file is just a `:root { … }` block overriding these (it's injected last, so it wins):

**Color roles (12)**
| token | role |
|-------|------|
| `--ex-ground` / `--ex-ground-2` / `--ex-ground-hi` | page background wash |
| `--ex-panel-hi` / `--ex-panel-lo` | stage frame gradient |
| `--ex-ink` | primary text / strong marks |
| `--ex-dim` | secondary text / quiet marks |
| `--ex-line` | hairlines, borders (use an alpha of ink) |
| `--ex-panel` | card / panel fill |
| `--ex-cell` | inner cell fill (vector/matrix cells) |
| `--ex-bar` | neutral bar fill (alpha of ink) |
| `--ex-accent` (+ `-fill` `-glow`) | the lead accent (one per scene) |
| `--ex-accent2` | secondary actor |
| `--ex-support` | tertiary actor |

**Type roles (3):** `--font-display` (the italic H1), `--font-sans` (body/UI), `--font-mono` (numbers/eyebrows/code).

Notes:
- Keep WCAG AA: `--ex-ink` on `--ex-panel` and `--ex-accent` on `--ex-ground` should both clear 4.5:1 (run the `wcag-contrast` skill if unsure).
- `-fill` ≈ accent at ~0.15 alpha, `-glow` ≈ ~0.35 alpha, `-line` ≈ ink at ~0.13 alpha.
- For a **light** theme, raise the grounds/panels and darken ink/line — every surface is tokenized, so it inverts cleanly.
- Custom webfonts: add the brand's `<link>`/`@font-face` via your own injection; the theme file can then just name them in `--font-*`. `@import` inside the injected block won't load (CSS ignores `@import` after other rules).

`example-helio.css` is a complete alternate brand (cool slate-blue + electric-blue) you can copy.
