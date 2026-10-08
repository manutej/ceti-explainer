#!/usr/bin/env python3
"""
build_plan.py — compile a film plan (or a module's demo plan) into ONE self-contained HTML film page.

    python3 build_plan.py <plan.json>                       → <dir>/build/<id>.<variant>.html
    python3 build_plan.py modules/<name>/demo.json --demo 0 → modules/<name>/build/demo-0.html
    python3 build_plan.py modules/<name>/demo.json --all    → both demos
    options: --variant p5|svg (default p5) · --p5 inline|cdn · --out PATH · --no-lint
             --aspect 16x9|1x1|4x5|9x16 (default 16x9; the page re-composes, CHANNELS §3; ?aspect= overrides)
             --bare head,foot,chip (stills for designed text layers: hide the module heads / foot lines / chips; ?bare=)

The page is the existing feature cut (assets/feature.template.html + feature-engine.js + scene-kit.js,
and bridge.js + p5 for the p5 variant), unchanged. The library is inlined in the data slot
(core: module, clock, po/*, roles, scene-kit, compile; then each used module), and the scenes slot is
one line: window.FEATURE = Film.compile(window.PLAN).FEATURE. p5 layers register during compile.
?film=1 works as for every feature cut (film_render.py), ?chrome=dark|notebook overrides the plan's chrome.
The plan linter (core/lint_plan.mjs) runs first; its table is printed and embedded in the bench panel.
"""
import argparse, json, os, subprocess, sys

CORE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(CORE)
ASSETS = os.path.abspath(os.path.join(LIB, "..", "assets"))
if not os.path.exists(os.path.join(ASSETS, "build_film.py")):
    # merged layout: <root>/library/plan/core/build_plan.py; the feature-cut assets stay in skills/p5-explainer/assets
    sys.path.insert(0, os.path.join(LIB, "..", "..", "scripts"))
    try:
        from paths import ceti_root  # <root>/scripts/paths.py: $CETI_ROOT, else walk up to .claude-plugin/plugin.json
    except ImportError:
        ceti_root = lambda start=None: None
    finally:
        sys.path.pop(0)
    _root = ceti_root(CORE) or os.path.abspath(os.path.join(LIB, "..", ".."))
    ASSETS = os.path.join(_root, "skills", "p5-explainer", "assets")
sys.path.insert(0, ASSETS)
from build_film import fonts_css, read, safe_js, PLUGIN, CE, CE_PRESETS, STUDIO_JS, P5_VERSION, CDN  # noqa: E402

CORE_FILES = ["module.js", "clock.js", "layout.js", "po/po.js", "po/track.js", "po/grid.js", "po/axis.js", "po/chain.js",
              "roles.js", "scene-kit.js", "wrap.js", "gates.js", "compile.js"]

NOTEBOOK_CSS = """
html[data-chrome=notebook] { --ex-ground:#F6F3EC; --ex-ground-2:#EFEBE1; --ex-ground-hi:#FBF9F4; --ex-panel:#FBF9F4; --ex-cell:#FFFFFF;
  --ex-ink:#1B1B1F; --ex-dim:#5E5B55; --ex-line:rgba(27,27,31,0.15); --ex-line-2:rgba(27,27,31,0.08); --ex-bar:rgba(27,27,31,0.2);
  --ex-accent:#B8651B; --ex-accent-fill:rgba(184,101,27,0.10); --ex-accent-glow:rgba(184,101,27,0.30);
  --ex-accent2:#1F7A4D; --ex-support:#1F4FB8; --ex-peach:#B8322A; color-scheme:light; }
html[data-chrome=notebook] body { background:var(--ex-ground); }
html[data-chrome=notebook] .stage { background-color:var(--ex-ground);
  background-image:linear-gradient(rgba(27,27,31,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(27,27,31,0.045) 1px, transparent 1px);
  background-size:calc(100% / 40) calc(100% / 22.5); }
html[data-chrome=notebook] .player { box-shadow:0 1px 0 var(--ex-line-2), 0 24px 50px -36px rgba(60,48,30,0.45); border-radius:6px; }
html[data-chrome=notebook] .capband { background:rgba(239,235,225,0.7); }
html[data-chrome=notebook] .btn#play { color:#FBF9F4; }
html[data-chrome=notebook] h1 { font-style:italic; }
/* ── module bench (demo pages only; hidden in film mode) ── */
.bench { margin-top:28px; border:1px solid var(--ex-line); border-radius:14px; padding:18px 20px; }
.bench h2 { font-family:var(--font-display); font-weight:300; font-style:italic; font-size:1.6rem; margin:0 0 4px; }
.bench .row { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin:10px 0; }
.bench .row a { font-family:var(--font-mono); font-size:12px; color:var(--ex-ink); border:1px solid var(--ex-line); border-radius:999px; padding:7px 12px; text-decoration:none; }
.bench .row a[aria-current=true] { border-color:var(--ex-accent); background:var(--ex-accent-fill); }
.bench .k { font-family:var(--font-mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--ex-dim); margin-right:6px; }
.strip { position:relative; height:58px; margin:14px 0 6px; border-top:1px solid var(--ex-line); }
.strip .seg { position:absolute; top:0; height:40px; border-left:1px solid var(--ex-line); padding:4px 0 0 5px; font-family:var(--font-mono); font-size:11px; color:var(--ex-dim); overflow:hidden; white-space:nowrap; cursor:pointer; }
.strip .seg:hover { background:var(--ex-accent-fill); }
.strip .seg b { color:var(--ex-ink); font-weight:400; }
.strip .seg .g { color:var(--ex-accent); }
.strip .head { position:absolute; top:-4px; width:2px; height:48px; background:var(--ex-accent); }
.badges { display:flex; flex-wrap:wrap; gap:8px; }
.badge { font-family:var(--font-mono); font-size:12px; border:1px solid var(--ex-line); border-radius:8px; padding:6px 10px; color:var(--ex-dim); }
.badge.ok { color:var(--ex-accent2); border-color:var(--ex-accent2); } .badge.bad { color:var(--ex-peach); border-color:var(--ex-peach); }
.laws { width:100%; border-collapse:collapse; margin-top:12px; font-family:var(--font-mono); font-size:12px; }
.laws td { border-top:1px solid var(--ex-line-2); padding:6px 8px 6px 0; color:var(--ex-dim); vertical-align:top; }
.laws td.s-PASS { color:var(--ex-accent2); } .laws td.s-FAIL { color:var(--ex-peach); } .laws td.s-SKIP { color:var(--ex-dim); }
.legend-g { font-family:var(--font-mono); font-size:11px; color:var(--ex-dim); }
html.is-film .bench { display:none !important; }
/* ── aspect (core/layout.js): the stage is 960 × vh units; film mode is the export size ── */
.stage { aspect-ratio:var(--stage-ar); }
html.is-film .stage { width:var(--film-w); height:var(--film-h); }
html:not(.is-film)[data-aspect="9x16"] .player { max-width:440px; margin:0 auto; }
html:not(.is-film)[data-aspect="4x5"] .player, html:not(.is-film)[data-aspect="1x1"] .player { max-width:620px; margin:0 auto; }
html[data-chrome=notebook]:not([data-aspect="16x9"]) .stage { background-size:2.5% var(--cell-y); }   /* square paper cells at every aspect */
html[data-nogrid="1"] .stage { background-image:none !important; }   /* crops for designed channel scenes */
html[data-bare~="head"] [data-region="head"], html[data-bare~="foot"] [data-role="foot"], html[data-bare~="chip"] [data-role="chip"] { opacity:0 !important; visibility:hidden !important; }
"""

BENCH_HTML = """
<section class="bench" id="bench" aria-label="Module bench">
  <h2>Module bench</h2>
  <div class="row" id="b-nav"></div>
  <div class="strip" id="b-strip" aria-label="Phase strip"></div>
  <p class="legend-g">● introduces · ◆ cue · ★ payoff · ‖ hold · N name-it-last — click a phase to jump</p>
  <div class="badges" id="b-badges"></div>
  <table class="laws" id="b-laws"></table>
</section>
"""

BENCH_JS = r"""
<script>
(function () {
  const go = () => {
    const F = window.FEATURE, c = window.__ctrl; if (!F || !c) return setTimeout(go, 50);
    const TL = F.timeline, LINT = window.LINT || { rows: [] }, B = window.BENCH || {}, dur = TL.dur;
    const nav = document.getElementById('b-nav'), q = new URLSearchParams(location.search), chrome = document.documentElement.dataset.chrome;
    const a = (href, txt, cur) => { const e = document.createElement('a'); e.href = href; e.textContent = txt; if (cur) e.setAttribute('aria-current', 'true'); return e; };
    if (B.siblings && B.siblings.length) { const k = document.createElement('span'); k.className = 'k'; k.textContent = 'instantiation'; nav.append(k);
      B.siblings.forEach(s => nav.append(a(s.href + (q.get('chrome') ? '?chrome=' + q.get('chrome') : ''), s.label, s.current))); }
    const k2 = document.createElement('span'); k2.className = 'k'; k2.textContent = 'chrome'; nav.append(k2);
    ['dark', 'notebook'].forEach(ch => nav.append(a('?chrome=' + ch, ch, ch === chrome)));
    const strip = document.getElementById('b-strip');
    TL.instances.forEach(i => i.phases.forEach(p => {
      const s = document.createElement('div'); s.className = 'seg';
      s.style.left = (p.a / dur * 100) + '%'; s.style.width = ((p.b - p.a) / dur * 100) + '%';
      const g = (p.introduces.length ? '●' : '') + (p.cue ? '◆' : '') + (p.payoff ? '★' : '') + (p.hold ? '‖' : '') + (p.names.length ? 'N' : '');
      s.innerHTML = '<b>' + p.id + '</b><br><span class="g">' + g + '</span>';
      s.title = p.id + ' ' + p.a.toFixed(1) + '–' + p.b.toFixed(1) + ' s' + (p.introduces.length ? ' · introduces ' + p.introduces.join(', ') : '') + (p.cue ? ' · cue ' + p.cue.target : '');
      s.addEventListener('click', () => { c.pause(); c.seek(p.a + 0.05); });
      strip.append(s);
    }));
    const head = document.createElement('div'); head.className = 'head'; strip.append(head);
    const tick = () => { head.style.left = (c.time / dur * 100) + '%'; requestAnimationFrame(tick); }; tick();
    const bd = document.getElementById('b-badges'), badge = (txt, cls) => { const e = document.createElement('span'); e.className = 'badge ' + (cls || ''); e.textContent = txt; bd.append(e); };
    const au = window.__AUDIT || {}; badge('audit ' + (au.ok ? 'PASS' : 'FAIL') + (au.note ? ' · ' + au.note : ''), au.ok ? 'ok' : 'bad');
    badge('lint ' + (LINT.ok ? 'PASS' : 'FAIL'), LINT.ok ? 'ok' : 'bad');
    TL.instances.forEach(i => { i.honesty.forEach(h => badge('honesty · ' + h)); if (i.evidence) badge('evidence · ' + i.evidence); badge('expertise · ' + i.expertise); });
    const tb = document.getElementById('b-laws');
    (LINT.rows || []).forEach(r => { const tr = document.createElement('tr'); tr.innerHTML = '<td>' + r.law + '</td><td class="s-' + r.status + '">' + r.status + '</td><td>' + r.where + '</td><td>' + r.msg + '</td>'; tb.append(tr); });
  };
  go();
})();
</script>
"""


def lint(plan_file, demo_idx):
    cmd = ["node", os.path.join(CORE, "lint_plan.mjs"), plan_file, "--json"] + (["--demo", str(demo_idx)] if demo_idx is not None else [])
    r = subprocess.run(cmd, capture_output=True, text=True)
    try:
        res = json.loads(r.stdout)
    except Exception:
        print(r.stdout, r.stderr, file=sys.stderr)
        raise SystemExit("lint_plan failed to run")
    for row in res["rows"]:
        print(f"  {row['law']:<5} {row['status']:<5} {str(row['where'])[:30]:<31} {row['msg']}")
    print("  lint:", "PASS" if res["ok"] else "FAIL")
    return res


ASPECT_BOOT = """
(function(){ var q = new URLSearchParams(location.search), A = { '16x9': [960, 540, 1920, 1080], '1x1': [960, 960, 1080, 1080], '4x5': [960, 1200, 1080, 1350], '9x16': [960, 1706.667, 1080, 1920] };
  var a = q.get('aspect') || window.DEFAULT_ASPECT || '16x9'; if (!A[a]) a = '16x9'; window.ASPECT = a;
  var d = document.documentElement, v = A[a], fs = parseFloat(q.get('fs') || window.DEFAULT_FS || 1) || 1; d.dataset.aspect = a;
  d.style.setProperty('--stage-ar', v[0] + ' / ' + v[1]); d.style.setProperty('--film-w', (v[2] * fs) + 'px'); d.style.setProperty('--film-h', (v[3] * fs) + 'px');
  if ((q.get('nogrid') || window.DEFAULT_NOGRID) === '1') d.dataset.nogrid = '1';
  var b = q.get('bare') != null ? q.get('bare') : (window.DEFAULT_BARE || ''); if (b) d.dataset.bare = b.split(',').join(' ');
  d.style.setProperty('--cell-y', (2.5 * 960 / v[1]).toFixed(4) + '%');
  var sv = document.getElementById('cv'); if (sv) sv.setAttribute('viewBox', '0 0 960 ' + v[1]); })();
"""


def build(plan, plan_file, demo_idx, out, variant, p5mode, do_lint, bench, aspect="16x9", bare="", fscale=1, nogrid=False):
    meta = plan.get("meta", {})
    lint_res = lint(plan_file, demo_idx) if do_lint else {"ok": None, "rows": []}
    used = []
    def walk(sp):   # every module the plan names, including the inners of combinators (inners first)
        if not isinstance(sp, dict):
            return
        for k, v in sp.items():
            if k not in ("params", "captions", "head") and isinstance(v, dict):
                walk(v)
        if sp.get("use") and sp["use"] not in used:
            used.append(sp["use"])
    for m in plan.get("modules", []):
        walk(m)
    lib_js = []
    for f in CORE_FILES:
        lib_js.append(f"/* ── library/core/{f} ── */\n" + read(os.path.join(CORE, f)))
    for u in used:
        mdir = os.path.join(LIB, "modules", u)
        lib_js.append(f"/* ── library/modules/{u}/module.js ── */\n" + read(os.path.join(mdir, "module.js")))
        if os.path.exists(os.path.join(mdir, "layer.js")):
            lib_js.append(read(os.path.join(mdir, "layer.js")))
    boot = ("window.PLAN = " + json.dumps(plan, ensure_ascii=False) + ";\nwindow.LINT = " + json.dumps(lint_res, ensure_ascii=False)
            + ";\nwindow.BENCH = " + json.dumps(bench or {}, ensure_ascii=False)
            + ";\n(function(){ var q = new URLSearchParams(location.search).get('chrome');"
              " document.documentElement.dataset.chrome = (q === 'dark' || q === 'notebook') ? q : (window.PLAN.meta.chrome || 'dark'); })();\n"
            + "window.DEFAULT_ASPECT = " + json.dumps(aspect) + "; window.DEFAULT_BARE = " + json.dumps(bare)
            + "; window.DEFAULT_FS = " + json.dumps(str(fscale)) + "; window.DEFAULT_NOGRID = " + json.dumps("1" if nogrid else "") + ";\n" + ASPECT_BOOT)
    tokens = "\n".join(l for l in read(os.path.join(CE, "ceti-tokens.css")).splitlines() if not l.strip().startswith("@import"))
    preset = read(os.path.join(CE_PRESETS, "ceti.css"))
    if variant == "p5":
        p5 = ("<script>\n/* p5 %s */\n%s\n</script>" % (P5_VERSION, safe_js(read(os.path.join(PLUGIN, "vendor", f"p5-{P5_VERSION}.min.js"))))
              if p5mode == "inline" else f'<script src="{CDN}"></script>')
        block = (p5 + "\n<script>\n/* ceti-p5-studio runtime */\n" + safe_js(read(STUDIO_JS))
                 + "\n</script>\n<script>\n/* P5Film bridge */\n" + safe_js(read(os.path.join(ASSETS, "bridge.js"))) + "\n</script>")
        label, footer = "module library · p5 cut", "explainer-module library · p5.js %s layers on the explainer clock" % P5_VERSION
    else:
        block, label, footer = "", "module library · SVG cut", "explainer-module library · SVG cut"
    rep = {
        "__TITLE__": meta.get("title", "plan"), "__DESCRIPTION__": meta.get("description", ""),
        "__VARIANT__": variant, "__VARIANT_LABEL__": label, "__FOOTER__": footer,
        "__FONTS_CSS__": fonts_css(), "__TOKENS_CSS__": tokens, "__PRESET__": preset,
        "__ENGINE_JS__": safe_js(read(os.path.join(ASSETS, "feature-engine.js"))),
        "__KIT_JS__": safe_js(read(os.path.join(ASSETS, "scene-kit.js"))),
        "__DATA_JS__": safe_js(boot + "\n;\n".join(lib_js)),
        "__SCENES_JS__": "window.FEATURE = Film.compile(window.PLAN, { aspect: window.ASPECT }).FEATURE;",
        "__LAYERS_JS__": "/* p5 layers are registered by Film.compile (one per module instance) */",
    }
    html = read(os.path.join(ASSETS, "feature.template.html"))
    for k, v in rep.items():
        html = html.replace(k, v)
    html = html.replace("</style>\n</head>", NOTEBOOK_CSS + "\n</style>\n</head>", 1)
    if bench is not None:
        html = html.replace('<section class="synth">', BENCH_HTML + '\n  <section class="synth">', 1)
        html = html.replace("</body>", BENCH_JS + "\n</body>")
        # the BENCH_JS replace above hit only the template's own </body> (p5 is not inlined yet)
    html = html.replace("__P5_BLOCK__", block, 1)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(html)
    print(f"✓ {out}  ({len(html.encode())/1024:.0f} KB)")
    return lint_res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("plan")
    ap.add_argument("--demo", type=int)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--variant", choices=["p5", "svg"], default="p5")
    ap.add_argument("--p5", choices=["inline", "cdn"], default="inline")
    ap.add_argument("--out")
    ap.add_argument("--no-lint", action="store_true")
    ap.add_argument("--aspect", default="16x9", choices=["16x9", "1x1", "4x5", "9x16"])
    ap.add_argument("--bare", default="", help="comma list: head,foot,chip — hidden in the page (stills for designed text layers)")
    ap.add_argument("--scale", type=float, default=1, help="film-mode export scale (2 → 2160×2700 at 4:5): crisp crops for channel scenes")
    ap.add_argument("--nogrid", action="store_true", help="no notebook paper grid on the stage (crops blend onto the scene's own paper)")
    a = ap.parse_args()
    path = os.path.abspath(a.plan)
    doc = json.load(open(path))
    base = os.path.dirname(path)
    ok = True
    if "demos" in doc:
        idxs = range(len(doc["demos"])) if (a.all or a.demo is None) else [a.demo]
        for i in idxs:
            plan = doc["demos"][i]
            sib = [{"href": f"demo-{j}.html", "label": d["meta"].get("short", f"demo {j}"), "current": j == i} for j, d in enumerate(doc["demos"])]
            suffix = "" if a.variant == "p5" else ".svg"
            out = a.out or os.path.join(base, "build", f"demo-{i}{suffix}.html")
            print(f"── {os.path.basename(base)} demo {i}: {plan['meta'].get('id')}")
            if a.aspect != "16x9" and not a.out:
                out = os.path.join(base, "build", f"demo-{i}{suffix}.{a.aspect}.html")
            r = build(plan, path, i, out, a.variant, a.p5, not a.no_lint, {"siblings": sib}, a.aspect, a.bare)
            ok = ok and r.get("ok") is not False
    else:
        tag = "" if a.aspect == "16x9" else "." + a.aspect
        out = a.out or os.path.join(base, "build", f"{doc['meta']['id']}.{a.variant}{tag}.html")
        r = build(doc, path, None, out, a.variant, a.p5, not a.no_lint, {"siblings": []}, a.aspect, a.bare, a.scale, a.nogrid)
        ok = r.get("ok") is not False
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
