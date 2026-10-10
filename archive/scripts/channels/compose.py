#!/usr/bin/env python3
"""
channels/compose.py — the text layers of every channel, set in the brand faces (Fraunces 300 italic · DM Sans ·
Space Mono, the same woff2 the film inlines) and rendered by headless Chromium at the export size.

    Comp().shot(html_body, w, h, path, transparent=False, css="") → [{qa, x, y, w, h, px}]   (measured boxes, export px)

Every element that carries type is tagged data-qa="<name>" so QA can measure its box and size at the export size
(Q3 safe zones, Q8 type floor) instead of trusting the template. Templates below: caption plate, hook overlay,
end card, carousel slide, LinkedIn page, text page, OG card, reel cover. Positions are in viewBox units (u, the
960-wide basis of core/layout.js) and multiplied by k = export px per u.
"""
import html as H
import json
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
ASSETS = os.path.abspath(os.path.join(LIB, "..", "assets"))
if not os.path.exists(os.path.join(ASSETS, "build_film.py")):   # merged layout: <root>/scripts/channels
    ASSETS = os.path.abspath(os.path.join(HERE, "..", "..", "skills", "p5-explainer", "assets"))
sys.path.insert(0, ASSETS)
from build_film import fonts_css  # noqa: E402

TOK = {
    "notebook": dict(ground="#F6F3EC", ground2="#EFEBE1", panel="#FBF9F4", ink="#1B1B1F", dim="#5E5B55", line="rgba(27,27,31,0.15)",
                     grid="rgba(27,27,31,0.045)", accent="#B8651B", machine="#1F4FB8", person="#B8651B", error="#B8322A", remedy="#1F7A4D",
                     plate="rgba(246,243,236,0.90)"),
    "dark": dict(ground="#0E1014", ground2="#0B0D11", panel="#171B23", ink="#F5EFE3", dim="#A39A89", line="rgba(245,239,227,0.13)",
                 grid="rgba(245,239,227,0.035)", accent="#CE9A6A", machine="#CE9A6A", person="#6E8CA8", error="#D88B5C", remedy="#8FA985",
                 plate="rgba(14,16,20,0.72)"),
}

_FONTS = None


def fonts():
    global _FONTS
    if _FONTS is None:
        _FONTS = fonts_css()
    return _FONTS


def esc(s):
    return H.escape(str(s), quote=True)


def base_css(chrome, w, h, k, grid=True, transparent=False):
    t = TOK[chrome]
    cell = w / 40.0
    bg = "transparent" if transparent else t["ground"]
    gridcss = (f"background-image:linear-gradient({t['grid']} 1px, transparent 1px), linear-gradient(90deg, {t['grid']} 1px, transparent 1px);"
               f"background-size:{cell:.3f}px {cell:.3f}px;") if grid and not transparent else ""
    return f"""{fonts()}
:root {{ --ground:{t['ground']}; --panel:{t['panel']}; --ink:{t['ink']}; --dim:{t['dim']}; --line:{t['line']}; --accent:{t['accent']};
  --machine:{t['machine']}; --person:{t['person']}; --error:{t['error']}; --remedy:{t['remedy']}; --plate:{t['plate']}; --k:{k}; }}
* {{ box-sizing:border-box; margin:0; padding:0; }}
html, body {{ width:{w}px; height:{h}px; overflow:hidden; background:{bg}; }}
body {{ position:relative; color:var(--ink); font-family:"DM Sans", sans-serif; -webkit-font-smoothing:antialiased; {gridcss} }}
.mono {{ font-family:"Space Mono", monospace; }}
.disp {{ font-family:"Fraunces", Georgia, serif; font-style:italic; font-weight:300; }}
.abs {{ position:absolute; }}
.bg {{ position:absolute; inset:0; width:{w}px; height:{h}px; }}
"""


class Comp:
    def __init__(self, workdir):
        from playwright.sync_api import sync_playwright
        self.dir = workdir
        os.makedirs(workdir, exist_ok=True)
        self._pw = sync_playwright().start()
        self.b = self._pw.chromium.launch(args=["--font-render-hinting=none"])
        self.pg = self.b.new_page(device_scale_factor=1)
        self.n = 0

    def shot(self, body, w, h, path, chrome="notebook", transparent=False, css="", grid=True):
        k = w / 960.0
        doc = f"""<!doctype html><html><head><meta charset="utf-8"><style>{base_css(chrome, w, h, k, grid, transparent)}{css}</style></head>
<body>{body}</body></html>"""
        self.n += 1
        f = os.path.join(self.dir, f"_layer{self.n % 7}.html")
        open(f, "w", encoding="utf-8").write(doc)
        self.pg.set_viewport_size({"width": w, "height": h})
        self.pg.goto("file://" + f)
        self.pg.evaluate("async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => 0))); }")
        boxes = self.pg.evaluate("""() => [...document.querySelectorAll('[data-qa]')].filter(e => e.textContent.trim()).map(e => { const r = e.getBoundingClientRect();
            return { qa: e.dataset.qa, x: r.x, y: r.y, w: r.width, h: r.height, px: parseFloat(getComputedStyle(e).fontSize), text: e.innerText.slice(0, 80) }; })""")
        os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
        self.pg.screenshot(path=path, clip={"x": 0, "y": 0, "width": w, "height": h}, omit_background=transparent)
        return boxes

    def close(self):
        self.b.close()
        self._pw.stop()


def px(u, k):
    return f"{u * k:.2f}px"


# ───────────────────────── templates (each returns (body, css)) ─────────────────────────

def caption_plate(lines, lay, k, chrome):
    """burned caption (CHANNELS §2.4): DM Sans 500 at lay.fs.cap, ≤ 2 lines; notebook = paper plate + hairline rule above"""
    C = lay["caption"]
    nb = chrome == "notebook"
    fs = lay["fs"]["cap"]
    style = (f"left:{px(C['x0'], k)}; width:{px(C['x1'] - C['x0'], k)}; bottom:{px(lay['vh'] - C['y1'], k)};")
    plate = ("background:var(--plate); border-top:1.5px solid var(--ink); border-radius:0;" if nb
             else f"background:var(--plate); border-radius:{px(12, k)};")
    body = f"""<div class="abs cap" style="{style}"><div class="plate" style="{plate} padding:{px(14, k)} {px(18, k)};">
{''.join(f'<div class="ln" data-qa="caption">{esc(l)}</div>' for l in lines)}</div></div>"""
    css = f""".cap {{ display:flex; justify-content:center; }} .plate {{ text-align:center; }}
.ln {{ font-family:"DM Sans"; font-weight:500; font-size:{px(fs, k)}; line-height:1.18; color:var(--ink); white-space:nowrap; }}"""
    return body, css


def hook_overlay(lines, lay, k, chrome, accent_last=True, top=None, size=56):
    """the cold-open line (CHANNELS §2.5 H1/H2): Fraunces 300 italic, 80 u at 9:16, in the head region (no chrome)"""
    F = lay["F"]
    hd = lay["head"]
    nb = chrome == "notebook"
    y = top if top is not None else hd["titleY"] - 96
    spans = []
    for i, l in enumerate(lines):
        col = "var(--machine)" if (accent_last and i == len(lines) - 1) else "var(--ink)"
        spans.append(f'<span style="color:{col}">{esc(l)}</span>')
    rows = [f'<div data-qa="hook">{" ".join(spans)}</div>']   # one line, the counted part in the answer colour
    align = "left" if nb else "center"
    body = f"""<div class="abs hook disp" style="left:{px(F['x0'], k)}; width:{px(F['x1'] - F['x0'], k)}; top:{px(y, k)}; text-align:{align};">{''.join(rows)}</div>"""
    css = f""".hook div {{ font-size:{px(size, k)}; line-height:1.04; letter-spacing:-0.01em; text-wrap:balance; }}"""
    return body, css


def cover_extra(kicker, claim, lay, k, chrome):
    """the reel cover only (the profile grid shows y 213–1493 u): a kicker, the claim and the mark under the figure"""
    F = lay["F"]
    body = f"""<div class="abs cx" style="left:{px(F['x0'], k)}; width:{px(F['x1'] - F['x0'], k)}; top:{px(F['y1'] + 70, k)};">
<p class="mono kk" data-qa="kicker">{esc(kicker)}</p><h2 class="disp" data-qa="claim">{'<br>'.join(esc(c) for c in claim)}</h2></div>
{whale_svg(F['x0'], F['y1'] + 330, 190, k, chrome)}"""
    css = f""".kk {{ font-size:{px(28, k)}; letter-spacing:0.16em; color:var(--accent); margin-bottom:{px(18, k)}; }}
.cx h2 {{ font-size:{px(64, k)}; line-height:1.05; letter-spacing:-0.01em; }}"""
    return body, css


def end_card(aha, cta, url, lay, k, chrome, honesty=None):
    """the reel / video end card: the aha line, the honesty line small, one CTA, the brand (≤ 1 s for reels)"""
    S = lay["safe"]
    F = lay["F"]
    cx0, cw = F["x0"], F["x1"] - F["x0"]
    hon = f'<p class="hon" data-qa="honesty">{esc(honesty)}</p>' if honesty else ""
    body = f"""<div class="abs ec" style="left:{px(cx0, k)}; width:{px(cw, k)}; top:{px(S['y0'] + (S['y1'] - S['y0']) * 0.22, k)};">
<p class="eb mono" data-qa="eyebrow">CETI EXPLAINERS</p>
<h1 class="disp" data-qa="aha">{esc(aha)}</h1>{hon}
<p class="cta mono" data-qa="cta">{esc(cta)}</p>
<p class="url mono" data-qa="url">{esc(url)}</p></div>
{whale_svg(F['x0'] + 0, S['y1'] - 120, 150, k, chrome)}"""
    css = f""".ec h1 {{ font-size:{px(72, k)}; line-height:1.04; margin:{px(18, k)} 0 {px(30, k)}; }}
.eb {{ font-size:{px(28, k)}; letter-spacing:0.18em; color:var(--accent); }}
.hon {{ font-size:{px(28, k)}; color:var(--dim); line-height:1.3; margin-bottom:{px(40, k)}; max-width:{px(700, k)}; }}
.cta {{ display:inline-block; font-size:{px(30, k)}; color:var(--ink); border:2px solid var(--ink); border-radius:999px; padding:{px(12, k)} {px(28, k)}; }}
.url {{ font-size:{px(28, k)}; color:var(--dim); margin-top:{px(22, k)}; }}"""
    return body, css


def whale_svg(x, y, w, k, chrome):
    """the CETI whale mark (scene-kit WPATHS, 600×360 source space), as a hairline signature"""
    t = TOK[chrome]
    paths = ["M88 168 C 96 152, 118 138, 152 138 C 188 138, 220 148, 252 162 C 292 178, 332 192, 376 198 C 418 204, 456 206, 488 198 C 510 192, 524 184, 532 176",
             "M88 168 C 92 158, 104 150, 124 148 C 156 144, 196 154, 240 168 C 286 184, 336 196, 388 200",
             "M232 180 C 248 210, 280 232, 322 238 C 308 224, 290 208, 276 192",
             "M488 198 C 512 198, 532 192, 548 178 C 562 166, 572 148, 572 130 C 558 138, 542 148, 528 158 C 540 152, 556 142, 568 126 C 552 132, 534 142, 518 154"]
    s = w * k / 500.0
    return (f'<svg class="abs" style="left:{px(x, k)}; top:{px(y, k)}; overflow:visible" width="{w * k:.1f}" height="{w * k * 0.4:.1f}" viewBox="80 110 500 160">'
            + "".join(f'<path d="{d}" fill="none" stroke="{t["ink"]}" stroke-width="{2.2 / max(s, 0.1):.2f}" stroke-linecap="round" opacity="0.8"/>' for d in paths)
            + f'<circle cx="150" cy="160" r="4" fill="{t["accent"]}"/></svg>')


def slide(bg, s, i, n, lay, k, chrome, max_words=25, swipe=True, li=False):
    """a carousel slide (CHANNELS §4.3): the frame-bank still (bare: no module head, no foot line) + a designed text
    layer in the head zone (kicker, headline ≤ 9 words) and the foot zone (body, source tag, swipe cue, counter)"""
    F = lay["F"]
    S = lay["safe"]
    x0, w = F["x0"], F["x1"] - F["x0"]
    words = len([w for w in s.get("body", "").split() if w not in ("%", "·", "×", "=", "÷", "+", "—")])
    if words > max_words:
        raise ValueError(f"slide {i + 1}: body is {words} words > {max_words}")
    kick = f'<p class="kick mono" data-qa="kicker">{esc(s.get("kicker", ""))}</p>' if s.get("kicker") else ""
    head = f"""<div class="abs top" style="left:{px(x0, k)}; width:{px(w, k)}; top:{px(S['y0'] + 6, k)};">{kick}<h2 class="disp" data-qa="headline">{esc(s['headline'])}</h2></div>"""
    hon = f'<p class="hon" data-qa="honesty">{esc(s["honestyLine"])}</p>' if s.get("honestyLine") else ""
    src = f'<span class="src mono" data-qa="source">[{esc(s["source"])}]</span>' if s.get("source") else ""
    sw = f'<span class="sw mono" data-qa="swipe">swipe →</span>' if swipe else ""
    url = f'<span class="sw mono" data-qa="url">{esc(s["url"])}</span>' if s.get("url") else ""
    foot_top = lay["F"]["y1"] + 10
    foot = f"""<div class="abs ft" style="left:{px(x0, k)}; width:{px(w, k)}; top:{px(foot_top, k)}; bottom:{px(lay['vh'] - S['y1'] + 2, k)};">
<p class="body" data-qa="body">{esc(s.get('body', ''))}</p>{hon}
<div class="row">{sw}{url}{src}<span class="ctr mono" data-qa="counter">{i + 1} / {n}</span></div></div>"""
    sig = whale_svg(F["x0"] + (F["x1"] - F["x0"]) / 2 - 150, F["y0"] + (F["y1"] - F["y0"]) * 0.62, 300, k, chrome) if s.get("cta") else ""
    body = f'<img class="bg" src="file://{bg}">' + head + sig + foot
    hs = 50
    css = f""".kick {{ font-size:{px(28, k)}; letter-spacing:0.14em; color:var(--accent); margin-bottom:{px(10, k)}; }}
.top h2 {{ font-size:{px(hs, k)}; line-height:1.06; letter-spacing:-0.01em; text-wrap:balance; }}
.ft {{ display:flex; flex-direction:column; }}
.body {{ font-size:{px(32 if not li else 28, k)}; line-height:{1.24 if not li else 1.2}; color:var(--ink); text-wrap:pretty; }}
.hon {{ font-size:{px(28, k)}; line-height:1.2; color:var(--dim); margin-top:{px(6, k)}; }}
.row {{ position:absolute; left:0; right:0; bottom:0; display:flex; gap:{px(24, k)}; align-items:baseline; line-height:1; }}
.sw, .src, .ctr {{ font-size:{px(28, k)}; color:var(--dim); }}
.sw {{ color:var(--accent); }} .ctr {{ margin-left:auto; }}"""
    return body, css


def text_page(p, i, n, lay, k, chrome):
    """a LinkedIn document page without a figure: cover, setup, arithmetic, honesty, sources, CTA"""
    S = lay["safe"]
    x0 = S["x0"] + 16
    w = S["x1"] - S["x0"] - 32
    parts = []
    if p.get("kicker"):
        parts.append(f'<p class="kick mono" data-qa="kicker">{esc(p["kicker"])}</p>')
    if p.get("headline"):
        parts.append(f'<h1 class="disp {p.get("hclass", "")}" data-qa="headline">{esc(p["headline"])}</h1>')
    if p.get("body"):
        parts.append(f'<p class="body" data-qa="body">{esc(p["body"])}</p>')
    if p.get("lines"):
        parts.append('<div class="lines mono">' + "".join(f'<p data-qa="line" class="{"hl" if j == len(p["lines"]) - 1 else ""}">{esc(l)}</p>' for j, l in enumerate(p["lines"])) + "</div>")
    if p.get("items"):
        parts.append('<ul class="items">' + "".join(f'<li data-qa="item">{esc(x)}</li>' for x in p["items"]) + "</ul>")
    if p.get("after"):
        parts.append(f'<p class="body after" data-qa="body">{esc(p["after"])}</p>')
    if p.get("url"):
        parts.append(f'<p class="url mono" data-qa="url">{esc(p["url"])}</p>')
    if p.get("brand"):
        parts.append(f'<p class="brand mono" data-qa="brand">{esc(p["brand"])}</p>')
    if p.get("mark"):
        parts.append(whale_svg(0, 0, 220, k, chrome).replace('class="abs"', 'class="mark"').replace(f"left:{px(0, k)}; top:{px(0, k)}; ", f"display:block; margin-top:{px(56, k)}; "))
    fig = f'<img class="abs fig" src="file://{p["figure"]}" style="left:0; top:{px(p.get("figTop", 560), k)}; width:{960 * k:.0f}px;">' if p.get("figure") else ""
    body = f"""{fig}<div class="abs pg" style="left:{px(x0, k)}; width:{px(w, k)}; top:{px(S['y0'] + 40, k)};">{''.join(parts)}</div>
<div class="abs foot mono" style="left:{px(x0, k)}; width:{px(w, k)}; bottom:{px(lay['vh'] - S['y1'] + 10, k)};"><span></span><span data-qa="counter">{i + 1} / {n}</span></div>
"""
    css = f""".kick {{ font-size:{px(28, k)}; letter-spacing:0.16em; color:var(--accent); margin-bottom:{px(26, k)}; }}
.pg h1 {{ font-size:{px(76, k)}; line-height:1.03; letter-spacing:-0.015em; margin-bottom:{px(36, k)}; text-wrap:balance; }}
.pg h1.xl {{ font-size:{px(84, k)}; }}
.body {{ font-size:{px(34, k)}; line-height:1.36; color:var(--ink); max-width:{px(800, k)}; text-wrap:pretty; }}
.after {{ margin-top:{px(40, k)}; color:var(--dim); font-size:{px(32, k)}; }}
.brand {{ font-size:{px(32, k)}; color:var(--ink); margin-top:{px(30, k)}; }}
.lines p {{ font-size:{px(32, k)}; line-height:1.2; padding:{px(20, k)} 0; border-bottom:1px solid var(--line); white-space:pre; }}
.lines p.hl {{ color:var(--machine); font-weight:700; border-bottom:2px solid var(--machine); }}
.items {{ list-style:none; }}
.items li {{ font-size:{px(32, k)}; line-height:1.34; padding:{px(18, k)} 0 {px(18, k)} {px(36, k)}; border-top:1px solid var(--line); position:relative; }}
.items li::before {{ content:"—"; position:absolute; left:0; color:var(--accent); }}
.url {{ font-size:{px(34, k)}; color:var(--machine); margin-top:{px(40, k)}; }}
.foot {{ display:flex; justify-content:space-between; font-size:{px(28, k)}; color:var(--dim); }}
.fig {{ }}"""
    return body, css


def og_card(bg, title, kicker, chrome):
    """1200 × 630 social card (OG / LinkedIn link preview; text inside the centre 1000 × 500, survives 1200 × 627)"""
    k = 1200 / 960.0
    body = f"""<img class="abs" src="file://{bg}" style="right:36px; top:24px; height:582px;">
<div class="abs og" style="left:{px(80, k)}; top:{px(110, k)}; width:{px(470, k)};">
<p class="kick mono" data-qa="kicker">{esc(kicker)}</p><h1 class="disp" data-qa="headline">{esc(title)}</h1>
<p class="brand mono" data-qa="brand">CETI EXPLAINERS · cetiai.co</p></div>"""
    css = f""".kick {{ font-size:21px; letter-spacing:0.16em; color:var(--accent); margin-bottom:22px; }}
.og h1 {{ font-size:56px; line-height:1.04; letter-spacing:-0.01em; text-wrap:balance; }}
.brand {{ font-size:19px; color:var(--dim); margin-top:30px; }}"""
    return body, css
