#!/usr/bin/env python3
"""brand_check.py <pack.json> [more packs...] [--emit-js out.js]

Validates a brand pack against arsenal/brands/schema.json, checks every type family+weight(+style) exists in
vendor/fonts.lock.json, computes WCAG 2.x contrast and prints a report. Exit 1 if any pack fails.

Contrast gates: ink/bg >= 4.5, chalk/panel >= 4.5, accent/bg >= 3.0, muted/bg >= 3.0.
Info (never fails): accent2/bg, ink/panel.
--emit-js writes arsenal/brands/packs.js style output: ARSENAL.brands[id] = <pack> for every pack given.
"""
import json, re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SCHEMA = os.path.join(ROOT, 'arsenal', 'brands', 'schema.json')
LOCK = os.path.join(ROOT, 'vendor', 'fonts.lock.json')

GATES = [  # (fg, bg, minimum, label)
    ('ink', 'bg', 4.5, 'ink/bg'),
    ('accent', 'bg', 3.0, 'accent/bg'),
    ('muted', 'bg', 3.0, 'muted/bg'),
    ('chalk', 'panel', 4.5, 'chalk/panel'),
]
INFO = [('accent2', 'bg', 'accent2/bg'), ('ink', 'panel', 'ink/panel')]


def rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(h):
    def f(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (f(c) for c in rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def validate(pack, schema):
    try:
        import jsonschema
    except ImportError:
        return ['jsonschema not installed: schema validation skipped'], True
    v = jsonschema.Draft202012Validator(schema)
    errs = [f"{'/'.join(map(str, e.absolute_path)) or '<root>'}: {e.message}" for e in sorted(v.iter_errors(pack), key=lambda e: list(map(str, e.absolute_path)))]
    return errs, False


def check(path, schema, lock):
    pack = json.load(open(path))
    lines, ok = [], True
    if not isinstance(pack, dict):
        return False, f'== {path}\n  FAIL not a JSON object\n  => FAIL', {'id': '?'}
    lines.append(f"== {pack.get('id', '?')}  ({os.path.relpath(path, ROOT)})")
    errs, skipped = validate(pack, schema)
    if skipped:
        lines.append('  WARN schema    ' + errs[0])
    elif errs:
        ok = False
        for e in errs:
            lines.append('  FAIL schema    ' + e)
    else:
        lines.append('  ok   schema')
    if os.path.splitext(os.path.basename(path))[0] != pack.get('id'):
        ok = False
        lines.append(f"  FAIL id        '{pack.get('id')}' does not match file name")
    have = {(f['family'], f['weight'], f['style']) for f in lock['fonts']}
    for role, face in (pack.get('type') if isinstance(pack.get('type'), dict) else {}).items():
        key = (face.get('family'), face.get('weight'), face.get('style', 'normal'))
        if key in have:
            lines.append(f"  ok   type.{role:<5} {key[0]} {key[1]} {key[2]}")
        else:
            ok = False
            near = sorted(w for (f, w, s) in have if f == key[0])
            hint = f" (lock has {key[0]} at {near})" if near else ' (family not in lock)'
            lines.append(f"  FAIL type.{role:<5} {key[0]} {key[1]} {key[2]} not in vendor/fonts.lock.json{hint}")
    col = pack.get('color') if isinstance(pack.get('color'), dict) else {}
    for fg, bg, mn, label in GATES:
        if fg in col and bg in col and re.fullmatch(r'#[0-9A-Fa-f]{6}', col[fg]) and re.fullmatch(r'#[0-9A-Fa-f]{6}', col[bg]):
            r = contrast(col[fg], col[bg])
            good = r >= mn
            ok &= good
            lines.append(f"  {'ok  ' if good else 'FAIL'} {label:<12} {r:5.2f}:1  (min {mn})  {col[fg]} on {col[bg]}")
        else:
            ok = False
            lines.append(f"  FAIL {label:<12} role missing or not #RRGGBB")
    for fg, bg, label in INFO:
        if fg in col and bg in col and re.fullmatch(r'#[0-9A-Fa-f]{6}', col[fg]) and re.fullmatch(r'#[0-9A-Fa-f]{6}', col[bg]):
            lines.append(f"  info {label:<12} {contrast(col[fg], col[bg]):5.2f}:1")
    for name, rp in (pack.get('ramps') or {}).items():
        for k in ('from', 'to'):
            if rp.get(k) not in col:
                ok = False
                lines.append(f"  FAIL ramps.{name}.{k} role '{rp.get(k)}' not in color")
    lines.append(f"  => {'PASS' if ok else 'FAIL'}")
    return ok, '\n'.join(lines), pack


def main(argv):
    emit = None
    if '--emit-js' in argv:
        i = argv.index('--emit-js')
        emit = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    if not argv:
        print(__doc__)
        return 2
    argv = [a for a in argv if os.path.basename(a) != 'schema.json']
    schema = json.load(open(SCHEMA))
    lock = json.load(open(LOCK))
    allok, packs = True, []
    for p in argv:
        ok, rep, pack = check(p, schema, lock)
        print(rep)
        allok &= ok
        packs.append(pack)
    if emit:
        js = ['// generated by arsenal/tools/brand_check.py --emit-js; do not edit. Source: arsenal/brands/*.json',
              'window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };']
        for pk in packs:
            js.append(f"ARSENAL.brands[{json.dumps(pk['id'])}] = {json.dumps(pk, separators=(',', ':'))};")
        open(emit, 'w').write('\n'.join(js) + '\n')
        print('wrote', os.path.relpath(emit, ROOT))
    print(f"\n{sum(1 for _ in packs)} pack(s): {'ALL PASS' if allok else 'FAILURES'}")
    return 0 if allok else 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
