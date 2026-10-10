#!/usr/bin/env python3
"""tweak.py <base> [transforms...] [--out DIR] [--print] [--force]
tweak.py --matrix [--out DIR]
tweak.py --fonts

Derive a new brand pack from an existing one with composable transforms done in OKLCH (colour math is local,
no dependencies). <base> is a pack id (arsenal/brands/<id>.json, then arsenal/brands/derived/<id>.json) or a path.
Transforms apply left to right, so order is meaningful (`--accent X --mono` differs from `--mono --accent X`).

  --hue <deg>        rotate accent, accent2 and the tinted neutrals by <deg>; L and C kept (so ground/ink lightness holds)
  --hue-accents-only  with --hue: leave the tinted ground/ink/panel/muted where they are
  --dark | --light   perceptual twin: grounds by OKLCH lightness inversion (clamped to a usable band), every
                     foreground re-solved at its own hue/chroma to the SAME WCAG ratio it had, so contrast order holds
  --contrast <n>     push ink/chalk (0.03 L per step), accent/accent2 (0.04) and muted (0.02) away from (+n) or
                     toward (-n) their ground
  --accent <hex>     set accent; accent2 = its complement (h+180) at matched lightness and chroma
  --mono             one-accent system: neutrals ~desaturated, accent2 becomes a grey, accent keeps its chroma
  --type d/m/b       swap faces, e.g. "Jost:700/Space Mono/DM Sans"; use _ to keep a role ("_/Space Mono/_").
                     Faces come only from vendor/fonts.lock.json
  --tempo <x>        beat_s *= x
  --texture <name>   paper | none | grain | halftone

Output: <base>--<transforms> (a base that already has `--` just gets `-<transforms>` appended) written to
arsenal/brands/derived/<id>.json after the pack passes brand_check.py. Any gate that a transform breaks is
auto-nudged: the offending foreground's OKLCH lightness is stepped (hue and chroma kept) until the gate passes,
and the nudge is reported. --matrix writes the dark/light twin of every pack in arsenal/brands/ plus a README.
"""
import argparse, json, math, os, re, shutil, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import brand_check as bc  # noqa: E402

ROOT = bc.ROOT
BRANDS = os.path.join(ROOT, 'arsenal', 'brands')
DERIVED = os.path.join(BRANDS, 'derived')
TEXTURES = ['paper', 'none', 'grain', 'halftone']
NEUTRALS = ('bg', 'ink', 'panel', 'chalk', 'muted')
ACCENTS = ('accent', 'accent2')

# ----------------------------------------------------------------------------- OKLCH math (Ottosson 2020)

def _s2l(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _l2s(x):
    x = min(1.0, max(0.0, x))
    return 255 * (12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055)


def _cbrt(x):
    return math.copysign(abs(x) ** (1 / 3), x)


def hex_to_lch(h):
    r, g, b = (_s2l(c) for c in bc.rgb(h))
    l = _cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
    m = _cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
    s = _cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    C = math.hypot(a, bb)
    return L, C, (math.degrees(math.atan2(bb, a)) % 360 if C > 1e-4 else 0.0)


def _lin(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    return (4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)


def _in_gamut(rgb, eps=1e-5):
    return all(-eps <= v <= 1 + eps for v in rgb)


def lch_to_hex(L, C, h):
    """Gamut-map by reducing chroma at fixed L and h (keeps lightness and hue identity)."""
    L = min(1.0, max(0.0, L))
    C = max(0.0, C)
    if L >= 1.0:
        rgb = (1.0, 1.0, 1.0)
    elif L <= 0.0:
        rgb = (0.0, 0.0, 0.0)
    else:
        rgb = _lin(L, C, h)
        if not _in_gamut(rgb):
            lo, hi = 0.0, C
            for _ in range(32):
                mid = (lo + hi) / 2
                if _in_gamut(_lin(L, mid, h)):
                    lo = mid
                else:
                    hi = mid
            rgb = _lin(L, lo, h)
    return '#%02X%02X%02X' % tuple(round(_l2s(v)) for v in rgb)


def fmt_lch(hx):
    L, C, h = hex_to_lch(hx)
    return f'L{L:.2f} C{C:.3f} h{h:5.1f}'


def norm_hex(s):
    s = s.strip()
    if not re.fullmatch(r'#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})', s):
        raise SystemExit(f'not a hex colour: {s!r} (use #RGB or #RRGGBB)')
    s = s.lstrip('#')
    if len(s) == 3:
        s = ''.join(c * 2 for c in s)
    return '#' + s.upper()


def polarity(bg):
    return 'dark' if hex_to_lch(bg)[0] < 0.5 else 'light'


def solve_L(fg, bg, target, direction):
    """Same hue/chroma as fg, lightness nearest to bg that reaches WCAG ratio `target` against bg.
    direction +1: lighter than bg, -1: darker. If unattainable returns the extreme."""
    L0, C, h = hex_to_lch(fg)
    bgL = hex_to_lch(bg)[0]
    ratio = lambda L: bc.contrast(lch_to_hex(L, C, h), bg)
    if direction > 0:
        lo, hi = bgL, 1.0
        if ratio(hi) < target:
            return lch_to_hex(hi, C, h)
        for _ in range(40):
            mid = (lo + hi) / 2
            lo, hi = (lo, mid) if ratio(mid) >= target else (mid, hi)
        return lch_to_hex(hi, C, h)
    lo, hi = 0.0, bgL
    if ratio(lo) < target:
        return lch_to_hex(lo, C, h)
    for _ in range(40):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if ratio(mid) >= target else (lo, mid)
    return lch_to_hex(lo, C, h)


def rgba_parts(line):
    """-> (r, g, b, alpha) from rgba()/rgb()/#RRGGBB(AA)/#RGB, else None."""
    m = re.fullmatch(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)', line.strip())
    if m:
        return int(m[1]), int(m[2]), int(m[3]), float(m[4]) if m[4] else 1.0
    m = re.fullmatch(r'#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})?', line.strip())
    if m:
        r, g, b = bc.rgb('#' + m[1])
        return r, g, b, round(int(m[2], 16) / 255, 2) if m[2] else 1.0
    return None


# ----------------------------------------------------------------------------- fonts

def load_lock():
    return json.load(open(bc.LOCK))['fonts']


def resolve_face(spec, cur, fonts):
    """spec: 'Family', 'Family:700', 'Family:400:italic'. Weight defaults to the current weight, else the nearest."""
    parts = [p.strip() for p in spec.split(':')]
    fam_in = parts[0].replace('_', ' ')
    fams = sorted({f['family'] for f in fonts})
    fam = next((f for f in fams if f.lower() == fam_in.lower()), None)
    if not fam:
        raise SystemExit(f'--type: family {fam_in!r} is not in vendor/fonts.lock.json. Available: ' + ', '.join(fams))
    style = 'italic' if any(p.lower() == 'italic' for p in parts[1:]) else ('normal' if len(parts) > 2 else None)
    wt = next((int(p) for p in parts[1:] if p.isdigit()), None)
    cand = [f for f in fonts if f['family'] == fam and (style is None or f['style'] == style)]
    if style is None:
        cand = [f for f in cand if f['style'] == 'normal'] or cand
    if not cand:
        raise SystemExit(f'--type: no {style} face for {fam}')
    have = sorted({f['weight'] for f in cand})
    if wt is not None and wt not in have:
        raise SystemExit(f'--type: {fam} has no weight {wt} in the lock; it has {have}')
    if wt is None:
        wt = min(have, key=lambda w: (abs(w - cur.get('weight', 400)), w))
    face = next(f for f in cand if f['weight'] == wt)
    out = {'family': fam, 'weight': wt}
    if face['style'] == 'italic':
        out['style'] = 'italic'
    return out


# ----------------------------------------------------------------------------- context + transforms

class Ctx:
    def __init__(self, pack):
        self.pack = json.loads(json.dumps(pack))
        self.log, self.descr, self.tokens = [], [], []
        self.sync2 = False          # accent2 is the complement of accent at matched lightness
        self.ink0 = pack['color']['ink']

    def say(self, s):
        self.log.append(s)

    @property
    def col(self):
        return self.pack['color']


def tok_num(x):
    s = f'{abs(x):g}'.replace('.', 'p')
    return ('m' if x < 0 else '') + s


def complement(acc):
    L, C, h = hex_to_lch(acc)
    return lch_to_hex(L, C, (h + 180) % 360)


def resync(ctx):
    if ctx.sync2:
        ctx.col['accent2'] = complement(ctx.col['accent'])


def t_hue(ctx, deg, accents_only=False):
    col = ctx.col
    roles = list(ACCENTS) + ([] if accents_only else list(NEUTRALS))
    for r in roles:
        L, C, h = hex_to_lch(col[r])
        if r in ACCENTS or C > 0.008:     # achromatic greys have no hue to rotate
            col[r] = lch_to_hex(L, C, (h + deg) % 360)
    ctx.say(f'hue {deg:+g} deg: ' + ('accents' if accents_only else 'accents + tinted neutrals') + ' rotated, L and C kept')
    ctx.descr.append(f'hue {deg:+g}')
    ctx.tokens.append('hue' + tok_num(deg))


def knee(r, at=4.0, slope=0.3):
    """Monotone compression of very high ratios so a gold accent does not turn to mud on the other side."""
    return r if r <= at else at + (r - at) * slope


def t_twin(ctx, target):
    col = dict(ctx.col)
    if polarity(col['bg']) == target:
        ctx.say(f'--{target}: ground is already {target} (L {hex_to_lch(col["bg"])[0]:.2f}); no change')
        return
    bgL, bgC, bgh = hex_to_lch(col['bg'])
    nb = min(max(1 - bgL, 0.16), 0.22) if target == 'dark' else min(max(1 - bgL, 0.945), 0.975)
    new = {'bg': lch_to_hex(nb, bgC * (0.7 if target == 'dark' else 1.0), bgh)}
    pL, pC, ph = hex_to_lch(col['panel'])
    off = max(abs(pL - bgL), 0.025)
    npL = nb + off if (target == 'dark' or nb + off <= 0.99) else nb - off
    new['panel'] = lch_to_hex(npL, pC, ph)
    direction = 1 if target == 'dark' else -1
    for r in ('ink', 'accent', 'accent2', 'muted'):
        ratio = bc.contrast(col[r], col['bg'])
        ratio = knee(ratio, 12.0, 0.4) if r == 'ink' else knee(ratio)   # one knee for accent/accent2/muted keeps their mutual order
        new[r] = solve_L(col[r], new['bg'], ratio, direction)
    new['chalk'] = solve_L(col['chalk'], new['panel'], knee(bc.contrast(col['chalk'], col['panel']), 12.0, 0.4), direction)
    before = {r: bc.contrast(col[f], col[g]) for r, f, g in
              [('ink', 'ink', 'bg'), ('accent', 'accent', 'bg'), ('accent2', 'accent2', 'bg'), ('muted', 'muted', 'bg'), ('chalk', 'chalk', 'panel')]}
    ctx.col.update(new)
    resync(ctx)
    after = {r: bc.contrast(ctx.col[f], ctx.col[g]) for r, f, g in
             [('ink', 'ink', 'bg'), ('accent', 'accent', 'bg'), ('accent2', 'accent2', 'bg'), ('muted', 'muted', 'bg'), ('chalk', 'chalk', 'panel')]}
    ordered = all(after[a] <= after[b] + 0.05 for a in before for b in before if before[a] < before[b] - 1e-9)
    ctx.say(f'--{target}: bg L {bgL:.2f}->{nb:.2f}, panel offset {off:.3f}; foregrounds re-solved to their source WCAG ratios (accent/accent2/muted above 4.0:1 soft-compressed x0.3 so accents stay vivid; ink/chalk above 12:1 x0.4 so a twin is never pure black); '
            f'contrast order {"preserved" if ordered else "CHANGED (clamped at lightness limits)"}: '
            + ', '.join(f'{r} {before[r]:.1f}->{after[r]:.1f}' for r in before))
    ctx.descr.append(target)
    ctx.tokens.append(target)


STEP = {'ink': 0.03, 'chalk': 0.03, 'accent': 0.04, 'accent2': 0.04, 'muted': 0.02}


def t_contrast(ctx, n):
    col = ctx.col
    for r, k in STEP.items():
        ground = 'panel' if r == 'chalk' else 'bg'
        L, C, h = hex_to_lch(col[r])
        gL = hex_to_lch(col[ground])[0]
        sgn = 1 if L >= gL else -1
        L2 = L + sgn * n * k
        if sgn > 0:
            L2 = min(0.99, max(gL + 0.05, L2))
        else:
            L2 = max(0.01, min(gL - 0.05, L2))
        col[r] = lch_to_hex(L2, C, h)
    resync(ctx)
    ctx.say(f'contrast {n:+g}: ink/chalk {n*0.03:+.2f} L, accents {n*0.04:+.2f} L, muted {n*0.02:+.2f} L, away from ground when positive')
    ctx.descr.append(f'contrast {n:+g}')
    ctx.tokens.append('c' + tok_num(n))


def t_accent(ctx, hx):
    hx = norm_hex(hx)
    ctx.col['accent'] = hx
    ctx.sync2 = True
    resync(ctx)
    ctx.say(f'accent {hx}; accent2 {ctx.col["accent2"]} = complement at matched lightness ({fmt_lch(hx)} -> {fmt_lch(ctx.col["accent2"])})')
    ctx.descr.append(f'accent {hx}')
    ctx.tokens.append('acc' + hx.lstrip('#').lower())


def t_mono(ctx):
    col = ctx.col
    for r in NEUTRALS:
        L, C, h = hex_to_lch(col[r])
        col[r] = lch_to_hex(L, C * 0.15, h)
    mL = hex_to_lch(col['muted'])[0]
    iL = hex_to_lch(col['ink'])[0]
    a2 = lch_to_hex(mL + 0.35 * (iL - mL), 0.0, 0)
    col['accent2'] = a2
    ctx.sync2 = False
    ctx.say(f'mono: neutrals chroma x0.15, accent {col["accent"]} keeps its chroma, accent2 -> grey {a2}')
    ctx.descr.append('mono')
    ctx.tokens.append('mono')


def t_type(ctx, spec, fonts):
    parts = [p.strip() for p in spec.split('/')]
    if len(parts) != 3:
        raise SystemExit('--type needs disp/mono/body, e.g. "Jost:700/Space Mono/DM Sans" (use _ to keep a role)')
    changed, slug = [], ''
    for role, p in zip(('disp', 'mono', 'body'), parts):
        if p in ('', '_', '-', '='):
            continue
        face = resolve_face(p, ctx.pack['type'][role], fonts)
        if face != ctx.pack['type'][role]:
            ctx.pack['type'][role] = face
            changed.append(f'{role} {face["family"]} {face["weight"]}')
            slug += re.sub(r'[^a-z0-9]', '', face['family'].lower().split()[0])
    if not changed:
        ctx.say('--type: no change')
        return
    ctx.say('type: ' + '; '.join(changed))
    ctx.descr.append('type ' + '/'.join(parts))
    ctx.tokens.append('type' + slug)


def t_tempo(ctx, x):
    t = ctx.pack['tempo']
    new = round(min(10.0, t['beat_s'] * x), 3)
    if new <= 0:
        raise SystemExit('--tempo must be > 0')
    ctx.say(f'tempo x{x:g}: beat_s {t["beat_s"]:g} -> {new:g}' + (' (clamped to the schema maximum 10)' if t['beat_s'] * x > 10 else ''))
    t['beat_s'] = new
    ctx.descr.append(f'tempo x{x:g}')
    ctx.tokens.append('tempo' + tok_num(x))


def t_texture(ctx, name):
    if name not in TEXTURES:
        raise SystemExit(f'--texture must be one of {TEXTURES}')
    if ctx.pack['texture'] == name:
        ctx.say(f'texture already {name}; no change')
        return
    ctx.say(f'texture {ctx.pack["texture"]} -> {name}')
    ctx.pack['texture'] = name
    ctx.descr.append(f'texture {name}')
    ctx.tokens.append(name)


# ----------------------------------------------------------------------------- gate repair

def gate_failures(col):
    return [(fg, bg, mn, lab) for fg, bg, mn, lab in bc.GATES if bc.contrast(col[fg], col[bg]) < mn]


def autonudge(ctx):
    """Step the failing foreground's OKLCH lightness (hue/chroma fixed) until its gate passes. Returns notes."""
    notes = []
    col = ctx.col
    for fg, bg, mn, lab in gate_failures(col):
        r0 = bc.contrast(col[fg], col[bg])
        L0, C, h = hex_to_lch(col[fg])
        pref = 1 if bc.lum(col[fg]) >= bc.lum(col[bg]) else -1
        found = None
        for sgn in (pref, -pref):
            L = L0
            while 0.0 <= L <= 1.0:
                L += sgn * 0.004
                hx = lch_to_hex(L, C, h)
                if bc.contrast(hx, col[bg]) >= mn + 0.01:
                    found = hx
                    break
            if found:
                break
        if found:
            notes.append(f'NUDGED {lab}: {fg} {col[fg]} -> {found} (L {L0:.2f}->{hex_to_lch(found)[0]:.2f}, hue and chroma kept); '
                         f'{r0:.2f}:1 -> {bc.contrast(found, col[bg]):.2f}:1 (min {mn})')
            col[fg] = found
        else:
            notes.append(f'UNFIXABLE {lab}: no lightness of {fg} reaches {mn}:1 on {col[bg]}')
    if notes:
        resync(ctx)
    return notes


# ----------------------------------------------------------------------------- driver

def fmt_pack(p):
    j = lambda o: json.dumps(o, ensure_ascii=False)
    c = ',\n    '.join(f'{j(k)}: {j(v)}' for k, v in p['color'].items())
    lines = [f'{{ "id": {j(p["id"])}, "name": {j(p["name"])},',
             '  "color": {\n    ' + c + ' },',
             '  "type": { ' + ', '.join(f'{j(k)}: {j(v)}' for k, v in p['type'].items()) + ' },',
             f'  "texture": {j(p["texture"])}, "tempo": {j(p["tempo"])},']
    for extra in ('ramps', 'weights'):
        if extra in p:
            lines.append(f'  {j(extra)}: {j(p[extra])},')
    lines.append(f'  "voice": {j(p["voice"])} }}')
    return '\n'.join(lines) + '\n'


def find_pack(base):
    cands = [base, os.path.join(BRANDS, base + '.json'), os.path.join(DERIVED, base + '.json')]
    for c in cands:
        if os.path.isfile(c):
            return c
    raise SystemExit(f'base pack {base!r} not found (tried {", ".join(os.path.relpath(c) for c in cands)})')


def apply_ops(pack, ops, fonts):
    ctx = Ctx(pack)
    for name, val in ops:
        if name == 'hue':
            t_hue(ctx, val[0], val[1])
        elif name in ('dark', 'light'):
            t_twin(ctx, name)
        elif name == 'contrast':
            t_contrast(ctx, val)
        elif name == 'accent':
            t_accent(ctx, val)
        elif name == 'mono':
            t_mono(ctx)
        elif name == 'type':
            t_type(ctx, val, fonts)
        elif name == 'tempo':
            t_tempo(ctx, val)
        elif name == 'texture':
            t_texture(ctx, val)
    return ctx


def derive(base_path, ops, outdir=DERIVED, write=True, force=False, quiet=False, fonts=None):
    """Returns dict(ok, id, path, pack, ctx, nudges, report)."""
    fonts = fonts or load_lock()
    pack0 = json.load(open(base_path))
    ctx = apply_ops(pack0, ops, fonts)
    if not ctx.tokens:
        return dict(ok=False, id=pack0['id'], error='no effective transform (everything was a no-op)', ctx=ctx, nudges=[], report='')
    nudges = autonudge(ctx)
    col = ctx.col
    if hex_to_lch(col['ink'])[0] != hex_to_lch(ctx.ink0)[0] or col['ink'] != ctx.ink0:
        pr = rgba_parts(col['line'])
        alpha = pr[3] if pr else 0.18
        r, g, b = bc.rgb(col['ink'])
        col['line'] = f'rgba({r},{g},{b},{alpha:g})'
    bid = pack0['id']
    toks = '-'.join(ctx.tokens)
    pack = ctx.pack
    pack['id'] = f'{bid}-{toks}' if '--' in bid else f'{bid}--{toks}'
    pack['name'] = f'{pack0["name"]} [{", ".join(ctx.descr)}]'
    v = pack['voice']
    prev = v.get('derived', {})
    v['derived'] = {'from': prev.get('from', bid), 'transforms': prev.get('transforms', []) + ctx.descr}
    tmp = tempfile.mkdtemp(prefix='tweak-')
    try:
        tp = os.path.join(tmp, pack['id'] + '.json')
        open(tp, 'w').write(fmt_pack(pack))
        ok, rep, _ = bc.check(tp, json.load(open(bc.SCHEMA)), json.load(open(bc.LOCK)))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    rep = re.sub(r'^(== \S+)  \(.*\)$', lambda m: m[1] + '  (' + os.path.relpath(os.path.join(outdir, pack['id'] + '.json'), ROOT) + ')', rep, count=1, flags=re.M)
    path = None
    if write and (ok or force):
        os.makedirs(outdir, exist_ok=True)
        path = os.path.join(outdir, pack['id'] + '.json')
        open(path, 'w').write(fmt_pack(pack))
    return dict(ok=ok, id=pack['id'], path=path, pack=pack, base=pack0, ctx=ctx, nudges=nudges, report=rep)


def print_result(res, base):
    ctx = res['ctx']
    print(f'{base["id"]}  ->  {res["id"]}')
    for s in ctx.log:
        print('  ' + s)
    for n in res['nudges']:
        print('  ' + n)
    if not res['nudges']:
        print('  gates: no nudge needed')
    old, new = base['color'], res['pack']['color']
    print('\n  role     old      new      new (OKLCH)')
    for r in ('bg', 'panel', 'ink', 'chalk', 'muted', 'accent', 'accent2'):
        mark = ' ' if old[r] == new[r] else '*'
        print(f'  {r:<8} {old[r]}  {new[r]} {mark} {fmt_lch(new[r])}')
    print(f'  line     {old["line"]}  ->  {new["line"]}\n')
    print(res['report'])
    print(('wrote ' + os.path.relpath(res['path'], ROOT)) if res.get('path') else 'NOT written (check failed; pass --force to keep)')


# ----------------------------------------------------------------------------- matrix

def matrix(outdir, fonts):
    files = sorted(f for f in os.listdir(BRANDS) if f.endswith('.json') and f != 'schema.json')
    rows, packs, allok = [], [], True
    os.makedirs(outdir, exist_ok=True)
    for f in files:
        bp = os.path.join(BRANDS, f)
        base = json.load(open(bp))
        pol = polarity(base['color']['bg'])
        target = 'light' if pol == 'dark' else 'dark'
        res = derive(bp, [(target, None)], outdir=outdir, fonts=fonts, force=True)
        allok &= res['ok']
        print(f'{base["id"]:<14} {pol:>5} -> {res["id"]:<28} {"PASS" if res["ok"] else "FAIL"}'
              + (f'  ({len(res["nudges"])} nudge)' if res['nudges'] else ''))
        c = res['pack']['color']
        packs.append(res['pack'])
        cr = lambda a, b: f'{bc.contrast(c[a], c[b]):.1f}'
        rows.append((base, pol, res, c, cr))
    L = ['# Derived packs: the dark / light matrix', '',
         'Generated by `python3 arsenal/tools/tweak.py --matrix`. Do not edit; rerun the tool.', '',
         'Each pack in `arsenal/brands/` has a perceptual twin on the other side of the lightness axis. Grounds come from OKLCH '
         'lightness inversion (dark ground L 0.16-0.22 (chroma x0.7), light ground L 0.945-0.975, panel keeps its offset from the ground). Every '
         'foreground (ink, accent, accent2, muted, chalk) keeps its own hue and chroma, and its lightness is re-solved so it reaches '
         'the same WCAG ratio it had in the source, which keeps the contrast order. Type, texture, tempo and voice are copied. '
         'Provenance lives in `voice.derived`. Every twin below was run through `brand_check.py`.', '',
         '| Base | Side | Twin | bg | panel | ink | accent | accent2 | muted | ink/bg | accent/bg | muted/bg | chalk/panel | Nudged | Check |',
         '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    for base, pol, res, c, cr in rows:
        b = base['color']
        L.append(f'| `{base["id"]}` | {pol} to {"light" if pol == "dark" else "dark"} | [`{res["id"]}`]({res["id"]}.json) | '
                 f'`{b["bg"]}` > `{c["bg"]}` | `{b["panel"]}` > `{c["panel"]}` | `{b["ink"]}` > `{c["ink"]}` | `{b["accent"]}` > `{c["accent"]}` | '
                 f'`{b["accent2"]}` > `{c["accent2"]}` | `{b["muted"]}` > `{c["muted"]}` | '
                 f'{bc.contrast(b["ink"], b["bg"]):.1f} > {cr("ink", "bg")} | {bc.contrast(b["accent"], b["bg"]):.1f} > {cr("accent", "bg")} | '
                 f'{bc.contrast(b["muted"], b["bg"]):.1f} > {cr("muted", "bg")} | {bc.contrast(b["chalk"], b["panel"]):.1f} > {cr("chalk", "panel")} | '
                 f'{len(res["nudges"]) or "none"} | {"PASS" if res["ok"] else "FAIL"} |')
    L += ['', 'Contrast columns read source > twin. Gates: ink/bg 4.5, chalk/panel 4.5, accent/bg 3, muted/bg 3.', '',
          'Use a twin like any pack: `?brand=<id>` on a demo page, or load `packs.js` (same shape as `brands/packs.js`).', '',
          'Other files in this directory are single-transform outputs of `tweak.py` (see `arsenal/tools/TWEAKS.md`).', '']
    nn = [(r[2]['id'], n) for r in rows for n in r[2]['nudges']]
    if nn:
        L += ['## Nudges', ''] + [f'- `{i}`: {n}' for i, n in nn] + ['']
    open(os.path.join(outdir, 'README.md'), 'w').write('\n'.join(L))
    js = ['// generated by arsenal/tools/tweak.py --matrix; do not edit. Source: arsenal/brands/*.json',
          'window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };']
    js += [f"ARSENAL.brands[{json.dumps(p['id'])}] = {json.dumps(p, separators=(',', ':'))};" for p in packs]
    open(os.path.join(outdir, 'packs.js'), 'w').write('\n'.join(js) + '\n')
    print(f'\nwrote {len(packs)} twins + README.md + packs.js in {os.path.relpath(outdir, ROOT)}  ->  {"ALL PASS" if allok else "FAILURES"}')
    return 0 if allok else 1


# ----------------------------------------------------------------------------- CLI

class Op(argparse.Action):
    def __init__(self, option_strings, dest, **kw):
        self.conv = kw.pop('conv', None)
        super().__init__(option_strings, dest, **kw)

    def __call__(self, parser, ns, values, option_string=None):
        ops = getattr(ns, 'ops', None) or []
        ops.append((self.dest, self.conv(values) if self.conv else (None if self.nargs == 0 else values)))
        ns.ops = ops


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('base', nargs='?', help='pack id or path')
    ap.add_argument('--hue', action=Op, conv=lambda v: (float(v), False), metavar='DEG')
    ap.add_argument('--hue-accents-only', action='store_true')
    ap.add_argument('--dark', action=Op, nargs=0)
    ap.add_argument('--light', action=Op, nargs=0)
    ap.add_argument('--contrast', action=Op, conv=float, metavar='N')
    ap.add_argument('--accent', action=Op, metavar='HEX')
    ap.add_argument('--mono', action=Op, nargs=0)
    ap.add_argument('--type', action=Op, metavar='DISP/MONO/BODY')
    ap.add_argument('--tempo', action=Op, conv=float, metavar='X')
    ap.add_argument('--texture', action=Op, metavar='NAME')
    ap.add_argument('--out', default=DERIVED, help='output directory (default arsenal/brands/derived)')
    ap.add_argument('--print', action='store_true', help='also print the pack JSON')
    ap.add_argument('--force', action='store_true', help='write even if brand_check fails')
    ap.add_argument('--matrix', action='store_true')
    ap.add_argument('--fonts', action='store_true', help='list families/weights available for --type')
    a = ap.parse_args(argv)
    fonts = load_lock()
    if a.fonts:
        for fam in sorted({f['family'] for f in fonts}):
            print(f'{fam:<28}', ' '.join(f'{f["weight"]}{"i" if f["style"] == "italic" else ""}' for f in fonts if f['family'] == fam))
        return 0
    if a.matrix:
        return matrix(os.path.abspath(a.out), fonts)
    ops = getattr(a, 'ops', None) or []
    if not a.base or not ops:
        ap.print_usage()
        print('need a base pack and at least one transform (or --matrix / --fonts)')
        return 2
    names = [o[0] for o in ops]
    if 'dark' in names and 'light' in names:
        print('--dark and --light are mutually exclusive')
        return 2
    if a.hue_accents_only:
        ops = [(n, (v[0], True)) if n == 'hue' else (n, v) for n, v in ops]
    path = find_pack(a.base)
    res = derive(path, ops, outdir=os.path.abspath(a.out), force=a.force, fonts=fonts)
    if res.get('error'):
        print(res['error'])
        for s in res['ctx'].log:
            print('  ' + s)
        return 2
    print_result(res, res['base'])
    if a.print:
        print(fmt_pack(res['pack']))
    return 0 if res['ok'] else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
