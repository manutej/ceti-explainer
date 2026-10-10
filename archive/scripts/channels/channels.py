#!/usr/bin/env python3
"""
channels/channels.py — one plan → six channels (CHANNELS.md §2, §4, §5, §6).

    python3 channels/channels.py <plan.json> --channel reel|carousel|linkedin-pdf|linkedin-video|blog|newsletter|all
                                 [--out <dir>] [--copy <copy.json>] [--workers 2] [--fps 30] [--no-video]

The plan is never edited: each adapter READS the compiled timeline (channels/timeline.mjs), picks beats by class,
re-times them (keep · drop · reorder · compress · freeze), renders frames of the SAME page re-laid at the
channel's aspect (core/build_plan.py --aspect, core/layout.js) with scripts/film_render.py, and sets the text
layers in the brand faces (channels/compose.py). Words come from the writer's copy.json next to the plan
(a skeleton is written on the first run); numbers come from the film and are checked against it (Q6).

Outputs (under --out, default <plan dir>/channels/):
  reel/            reel.9x16.mp4 · reel.cover.png · reel.srt · post.txt · stills/
  carousel/        slide-01.png … slide-NN.png (1080×1350) · post.txt
  linkedin-pdf/    document.pdf · pages/page-NN.png · post.txt
  linkedin-video/  video.4x5.mp4 (or 1x1) · video.srt · cover.png · post.txt
  blog/            post.md · stills/*.png (1920×1080) · og.png (1200×630) · embed.html
  newsletter/      email.html (600 px, inline styles, no JS) · email.txt · subject.txt · stills/ · count.gif
  frames.json      the frame bank: [{name, t, aspect, variant, path}]
  qa.json          the CHANNELS §5 rubric: automated checks (Q3 Q6 Q8 Q10 Q11 + durations, captions) and the eyes-on checklist
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
LIB = os.path.dirname(HERE)
SCRIPTS = os.path.abspath(os.path.join(LIB, "..", "..", "..", "scripts"))
if not os.path.isdir(os.path.join(LIB, "core")):   # merged layout: <root>/scripts/channels, the plan library in <root>/library/plan
    LIB = os.path.abspath(os.path.join(HERE, "..", "..", "library", "plan"))
    SCRIPTS = os.path.abspath(os.path.join(HERE, ".."))   # film_render.py is expected here (not in the sources yet)
sys.path.insert(0, HERE)
import compose as C  # noqa: E402
import qa as Q  # noqa: E402

EXPORT = {"16x9": (1920, 1080), "1x1": (1080, 1080), "4x5": (1080, 1350), "9x16": (1080, 1920)}

# CHANNELS §2.1–2.3, reconciled with research/CHANNEL-SPECS.md (see channels/README.md)
ADAPTERS = {
    "reel": {"aspect": "9x16", "duration": [20, 35], "cap": 45, "captions": "burned", "hook": "H1 + the counted gap, cold open",
             "survive": {"hook": "◐", "po": "●", "commit": "◐", "wrong": "◐", "break": "●", "count": "● longest", "gap": "↑ cold open",
                         "contrast": "○", "name": "●", "honesty": "◐ end card", "recap": "○", "land": "● + CTA ≤ 1 s"}},
    "carousel": {"aspect": "4x5", "slides": [8, 10], "maxWords": 25, "figureMin": 0.45},
    "linkedin-pdf": {"aspect": "4x5", "pages": [8, 12], "maxWords": 45, "maxMB": 100, "maxPages": 300},
    "linkedin-video": {"aspect": "4x5", "duration": [45, 75], "captions": "burned + .srt", "hook": "H4 text-first"},
    "blog": {"aspect": "16x9", "stills": [4, 6], "words": [900, 1400]},
    "newsletter": {"width": 600, "words": [250, 350], "gifMB": 1.0, "gifHardMB": 1.5, "gifSeconds": 6, "gifFps": 10, "htmlKB": 102},
}


def log(*a):
    print("·", *a, flush=True)


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print(r.stdout[-3000:], r.stderr[-3000:], file=sys.stderr)
        raise SystemExit("failed: " + " ".join(cmd[:4]))
    return r.stdout


class Job:
    def __init__(self, plan_path, out, copy_path, workers, fps):
        self.plan_path = os.path.abspath(plan_path)
        self.plan = json.load(open(self.plan_path))
        self.id = self.plan["meta"]["id"]
        self.chrome = self.plan["meta"].get("chrome", "dark")
        self.out = os.path.abspath(out or os.path.join(os.path.dirname(self.plan_path), "channels"))
        self.work = os.path.join(self.out, "_work")
        os.makedirs(self.work, exist_ok=True)
        self.workers, self.fps = workers, fps
        self.TL = json.loads(run(["node", os.path.join(HERE, "timeline.mjs"), self.plan_path]))
        self.L = self.TL["layouts"]
        cp = copy_path or os.path.join(os.path.dirname(self.plan_path), "copy.json")
        if not os.path.exists(cp):
            json.dump(skeleton(self.TL), open(cp, "w"), indent=2, ensure_ascii=False)
            raise SystemExit(f"wrote a copy skeleton to {cp}: fill it in (every number must be one the film prints), then re-run")
        self.copy = json.load(open(cp))
        self.frames = []          # the frame bank record
        self.qa = {"plan": self.plan_path, "generated": time.strftime("%Y-%m-%d %H:%M"), "channels": {}}
        self.pages = {}
        self._comp = None

    # ── pages and renders ──
    @staticmethod
    def vkey(aspect, bare="", scale=1, nogrid=False):
        """the render variant key: aspect, hidden regions, export scale, paper grid"""
        return aspect + ("-" + bare.replace(",", "-") if bare else "") + (f"-x{scale:g}" if scale != 1 else "") + ("-ng" if nogrid else "")

    def page(self, aspect, bare="", scale=1, nogrid=False):
        tag = self.vkey(aspect, bare, scale, nogrid).replace(aspect + "-", aspect + ".", 1) if (bare or scale != 1 or nogrid) else aspect
        p = os.path.join(self.work, "build", f"{self.id}.{tag}.html")
        if p not in self.pages:
            cmd = ["python3", os.path.join(LIB, "core", "build_plan.py"), self.plan_path, "--aspect", aspect, "--out", p, "--no-lint"]
            if bare:
                cmd += ["--bare", bare]
            if scale != 1:
                cmd += ["--scale", str(scale)]
            if nogrid:
                cmd += ["--nogrid"]
            run(cmd)
            # a page whose content changed invalidates every still and segment rendered from it
            import hashlib
            hsh = hashlib.md5(open(p, "rb").read()).hexdigest()
            hp = p + ".md5"
            if not os.path.exists(hp) or open(hp).read() != hsh:
                key = self.vkey(aspect, bare, scale, nogrid)
                shutil.rmtree(os.path.join(self.work, "stills", key), ignore_errors=True)
                sd = os.path.join(self.work, "seg")
                if os.path.isdir(sd):
                    for x in os.listdir(sd):
                        if x.startswith(key + "@"):
                            shutil.rmtree(os.path.join(sd, x), ignore_errors=True)
                open(hp, "w").write(hsh)
            self.pages[p] = True
        return p

    def stills(self, aspect, names, bare="", sub=None, scale=1, nogrid=False):
        """frame-bank stills at an aspect: {name: path} (names may also be raw times)"""
        html = self.page(aspect, bare, scale, nogrid)
        w, h = int(EXPORT[aspect][0] * scale), int(EXPORT[aspect][1] * scale)
        tof = lambda n: self.TL["frames"][n] if isinstance(n, str) else float(n)
        times = sorted({tof(n) for n in names})
        d = os.path.join(self.work, "stills", self.vkey(aspect, bare, scale, nogrid))
        os.makedirs(d, exist_ok=True)
        need = [t for t in times if not os.path.exists(os.path.join(d, f"t_{t:07.2f}.png"))]
        if need:
            run(["python3", os.path.join(SCRIPTS, "film_render.py"), html, "--out", d, "--stills", ",".join(f"{t:.2f}" for t in need),
                 "--workers", str(min(self.workers, len(need))), "--w", str(w), "--h", str(h)])
        out = {}
        for n in names:
            t = tof(n)
            out[n] = os.path.join(d, f"t_{t:07.2f}.png")
            rec = {"name": str(n), "t": t, "aspect": aspect, "variant": self.vkey(aspect, bare, scale, nogrid), "path": os.path.relpath(out[n], self.out)}
            if rec not in self.frames:
                self.frames.append(rec)
        return out

    def segment(self, aspect, a, b, rate, bare="", tag="seg", scale=1, nogrid=False):
        """frames of [a, b) of the film at a playback rate (compress = rate > 1): film_render --fps fps/rate"""
        html = self.page(aspect, bare, scale, nogrid)
        w, h = int(EXPORT[aspect][0] * scale), int(EXPORT[aspect][1] * scale)
        fr = self.fps / rate
        d = os.path.join(self.work, "seg", f"{self.vkey(aspect, bare, scale, nogrid)}@{a:.2f}-{b:.2f}-{rate:.3f}")
        n0, n1 = int(round(a * fr)), int(round(b * fr))
        files = [os.path.join(d, f"f{i:05d}.jpg") for i in range(n0, n1)]
        if not all(os.path.exists(f) for f in files):
            os.makedirs(d, exist_ok=True)
            run(["python3", os.path.join(SCRIPTS, "film_render.py"), html, "--out", d, "--from", f"{a:.4f}", "--to", f"{b:.4f}",
                 "--fps", f"{fr:.6f}", "--workers", str(self.workers), "--w", str(w), "--h", str(h), "--format", "jpg"])
            files = [os.path.join(d, f"f{i:05d}.jpg") for i in range(n0, n1)]
        return [f for f in files if os.path.exists(f)]

    @property
    def comp(self):
        if self._comp is None:
            self._comp = C.Comp(os.path.join(self.work, "layers"))
        return self._comp

    def ph(self, pred):
        for p in self.TL["phases"]:
            if pred(p):
                return p
        raise KeyError("no phase for adapter")

    def leaf(self, p):
        return p["id"].split(".")[-1]

    def channel_dir(self, name):
        d = os.path.join(self.out, name)
        os.makedirs(d, exist_ok=True)
        return d


# ───────────────────────────── text helpers ─────────────────────────────

def split_lines(text, maxc=32, maxl=2):
    import re
    text = re.sub(r"(\d) %", "\\1\u00a0%", text)          # a number never parts from its unit
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) > maxc and cur:
            lines.append(cur)
            cur = w
        else:
            cur = cand
    if cur:
        lines.append(cur)
    if len(lines) > maxl:
        raise ValueError(f"caption too long for {maxl} lines of ≤ {maxc}: {text!r}")
    if len(lines) == 2 and len(lines[1]) < 0.4 * len(lines[0]):   # balance: no short last line
        words = text.split(" ")
        best = min(range(1, len(words)), key=lambda i: abs(len(" ".join(words[:i])) - len(" ".join(words[i:]))))
        a, b = " ".join(words[:best]), " ".join(words[best:])
        if max(len(a), len(b)) <= maxc:
            lines = [a, b]
    return lines


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def write_srt(path, caps):
    with open(path, "w", encoding="utf-8") as f:
        for i, (a, b, text) in enumerate(caps):
            f.write(f"{i + 1}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n\n")


def skeleton(TL):
    return {"_doc": "Fill every field; numbers must be ones the film prints (QA Q6).", "url": "", "hashtags": [], "honestyLine": TL["honesty"][0] if TL["honesty"] else "",
            "reel": {"hook": ["", ""], "captions": {k: "" for k in ["city", "question", "commit", "wrong", "break", "count1", "count2", "count3", "gap", "name", "land"]}, "cta": "", "post": {"hookLine": "", "caption": ""}},
            "carousel": {"slides": [{"frame": n, "kicker": "", "headline": "", "body": ""} for n in ["question", "po.first", "wrong", "break", "count", "gap", "contrast", "named", "land"]], "post": {"hookLine": "", "caption": ""}},
            "linkedin": {}, "video": {}, "blog": {"title": "", "sections": []}, "newsletter": {}}


# ───────────────────────────── video assembly ─────────────────────────────

class Timeline:
    """an edit decision list over film time: entries of frames + overlays, crossfaded at the cuts"""

    def __init__(self, job, aspect, fps):
        self.job, self.aspect, self.fps = job, aspect, fps
        self.entries = []   # {frames:[paths], overlays:[(path, f0, f1)], label}

    def add_seg(self, a, b, rate, bare="", label="", caps=(), overlay=None):
        fr = self.fps / rate
        n = int(round(b * fr)) - int(round(a * fr))
        get = lambda: self.job.segment(self.aspect, a, b, rate, bare)
        self.entries.append({"get": get, "n": n, "label": label, "caps": list(caps), "overlay": overlay, "src": [round(a, 3), round(b, 3), round(rate, 3), bare or "full"]})

    def add_freeze(self, t_name_or_t, dur, bare="", label="", caps=(), overlay=None):
        t = self.job.TL["frames"][t_name_or_t] if isinstance(t_name_or_t, str) else t_name_or_t
        n = int(round(dur * self.fps))
        get = lambda: self.job.segment(self.aspect, t, t + 1.0 / self.fps, 1.0, bare)[:1] * n
        self.entries.append({"get": get, "n": n, "label": label, "caps": list(caps), "overlay": overlay, "src": [t, t, 0, bare or "full"]})

    def render(self, out_mp4, xf=4):
        """write frames with burned captions/overlays (PIL alpha composite), crossfade xf frames at each cut, encode H.264"""
        from PIL import Image
        job, lay = self.job, self.job.L[self.aspect]
        W, Hh = EXPORT[self.aspect]
        d = os.path.join(job.work, "frames-" + os.path.basename(out_mp4).split(".")[0])
        if os.path.exists(d):
            shutil.rmtree(d)
        os.makedirs(d)
        cap_cache, caps_out, n_out = {}, [], 0
        k = W / 960.0

        def plate(text):
            if text not in cap_cache:
                lines = split_lines(text, 32 if self.aspect == "9x16" else 36)
                body, css = C.caption_plate(lines, lay, k, job.chrome)
                p = os.path.join(job.work, "layers", f"cap-{self.aspect}-{len(cap_cache):03d}.png")
                boxes = job.comp.shot(body, W, Hh, p, job.chrome, transparent=True, css=css)
                cap_cache[text] = (Image.open(p).convert("RGBA"), boxes)
            return cap_cache[text][0]

        prev_tail = None
        out_frames = []
        t_out = 0.0
        for e in self.entries:
            e["frames"] = e["get"]()
            n = len(e["frames"])
            dur = n / self.fps
            ov = Image.open(e["overlay"]).convert("RGBA") if e.get("overlay") else None
            # captions: [(rel0, rel1, text)] in seconds of this entry
            caps = [(c[0], c[1], c[2]) for c in e["caps"]]
            for (c0, c1, text) in caps:
                caps_out.append((t_out + c0, t_out + min(c1, dur), text))
                plate(text)
            for i, f in enumerate(e["frames"]):
                im = Image.open(f).convert("RGB").copy()
                if ov is not None:
                    im.paste(ov, (0, 0), ov)
                tt = i / self.fps
                for (c0, c1, text) in caps:
                    if c0 <= tt < c1:
                        a = min(1.0, (tt - c0) / 0.15, (c1 - tt) / 0.12)
                        pl = plate(text)
                        if a < 1:
                            al = pl.getchannel("A").point(lambda v, a=a: int(v * a))
                            pl = pl.copy()
                            pl.putalpha(al)
                        im.paste(pl, (0, 0), pl)
                out_frames.append(im)
                if len(out_frames) > xf + 2:
                    fim = out_frames.pop(0)
                    fim.save(os.path.join(d, f"{n_out:05d}.jpg"), quality=94)
                    n_out += 1
            # crossfade into the next entry: blend the last xf frames of this one with the first of the next (done lazily)
            e["_n"] = n
            t_out += dur
            prev_tail = e
        # flush, with crossfades realised as short dissolves at the cuts (the frames are already in order: soften the
        # first xf frames after each cut against the previous frame)
        for fim in out_frames:
            fim.save(os.path.join(d, f"{n_out:05d}.jpg"), quality=94)
            n_out += 1
        # dissolves: at each cut index c, frames c..c+xf-1 become blend(prev frame c-1, frame) with rising weight
        cuts, acc = [], 0
        for e in self.entries[:-1]:
            acc += e["_n"]
            cuts.append(acc)
        for c in cuts:
            if c <= 0 or c + xf >= n_out:
                continue
            last = Image.open(os.path.join(d, f"{c - 1:05d}.jpg")).convert("RGB")
            for j in range(xf):
                p = os.path.join(d, f"{c + j:05d}.jpg")
                cur = Image.open(p).convert("RGB")
                Image.blend(last, cur, (j + 1) / (xf + 1)).save(p, quality=94)
        dur = n_out / self.fps
        run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(self.fps), "-i", os.path.join(d, "%05d.jpg"),
             "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
             "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high", "-r", str(self.fps),
             "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", out_mp4])
        cap_boxes = [b for (_, bx) in cap_cache.values() for b in bx]
        return {"duration": round(dur, 2), "frames": n_out, "captions": caps_out, "cap_boxes": cap_boxes, "frames_dir": d}


# ───────────────────────────── QA helpers ─────────────────────────────

def boxes_px_to_u(boxes, W):
    k = W / 960.0
    return [{"text": b.get("text", ""), "x0": b["x"] / k, "y0": b["y"] / k, "x1": (b["x"] + b["w"]) / k, "y1": (b["y"] + b["h"]) / k, "px": b["px"]} for b in boxes]


def probe_check(job, aspect, times, bare="", label=""):
    """Q3 + Q8 on the film's own type at the given frames of an aspect page"""
    W, Hh = EXPORT[aspect]
    res = Q.probe(job.page(aspect, bare), times, W, Hh, job.comp.b)
    lay = job.L[aspect]
    safe, floor, sizes = [], [], {}
    for t, bx in res.items():
        safe += Q.safe_zone(bx, lay, f"{label}@{t}")
        f, s = Q.type_floor(bx, W, where=f"{label}@{t}")
        floor += f
        sizes[str(t)] = s
    return {"frames": len(res), "safe_zone_violations": safe, "type_floor_violations": floor, "sizes_px_per_frame": sizes}


def layer_check(job, aspect, boxes, label):
    W, Hh = EXPORT[aspect]
    bu = boxes_px_to_u(boxes, W)
    f, s = Q.type_floor(bu, W, where=label)
    return {"safe_zone_violations": Q.safe_zone(bu, job.L[aspect], label), "type_floor_violations": f, "sizes_px": s}


def verdict(d):
    bad = []
    for k, v in d.items():
        if isinstance(v, dict) and "pass" in v and not v["pass"]:
            bad.append(k)
    return "PASS" if not bad else "FAIL: " + ", ".join(bad)


def file_mb(p):
    return round(os.path.getsize(p) / 1e6, 3)


def ffprobe_dur(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).strip())


# ───────────────────────────── channels ─────────────────────────────

def ch_reel(job, render_video=True):
    """IG reel (CHANNELS §2.3): cold open on the counted gap, then the question, the city, the guess, the wrong
    model, the break, the count (the longest beat), the gap, the name, the land + one-word CTA. 9:16, burned captions."""
    d = job.channel_dir("reel")
    cp, lay = job.copy["reel"], job.L["9x16"]
    W, Hh = EXPORT["9x16"]
    k = W / 960.0
    TL = Timeline(job, "9x16", job.fps)
    P = job.ph
    lf = job.leaf
    r0 = job.TL["phases"][0]
    ask, com = P(lambda p: p["beat"] == "hook"), P(lambda p: p["beat"] == "commit")
    runw, brk = P(lambda p: lf(p) == "run-wrong"), P(lambda p: lf(p) == "break")
    close = P(lambda p: p["beat"] == "build" and p["a"] >= brk["b"])
    cnt, gap = P(lambda p: p["beat"] == "count"), P(lambda p: p["beat"] == "gap")
    name = P(lambda p: p["beat"] == "name" and p["a"] > cnt["a"])
    land = P(lambda p: p["beat"] == "land")
    c = cp["captions"]
    hook_png = os.path.join(job.work, "layers", "reel-hook.png")
    body, css = C.hook_overlay(cp["hook"], lay, k, job.chrome, top=lay["head"]["titleY"] - 52)
    hook_boxes = job.comp.shot(body, W, Hh, hook_png, job.chrome, transparent=True, css=css)
    end_png = os.path.join(job.work, "layers", "reel-end.png")
    body, css = C.end_card(job.TL["aha"][0].upper() + job.TL["aha"][1:] + ".", cp["cta"], job.copy["url"], lay, k, job.chrome, honesty=job.copy["honestyLine"])
    end_boxes = job.comp.shot(body, W, Hh, end_png, job.chrome, transparent=False, css=css)
    count_span = (cnt["b"] - 0.2) - close["a"]
    count_rate = max(1.0, count_span / 6.6)
    plan = [
        ("cold open: the counted gap", "freeze", ("cover", 1.7, "head,foot"), [(0, 1.7, None)], hook_png),
        ("the city (the PO)", "seg", (r0["a"] + 0.1, r0["a"] + 2.5, 1.2, ""), [(0.05, 2.0, c["city"])], None),
        ("the question", "seg", (ask["a"], com["a"] + 1.2, 1.0, ""), [(0.05, 2.4, c["question"])], None),
        ("the common answer", "seg", (com["b"] - 0.75, com["b"] + 0.35, 1.0, ""), [(0.0, 1.1, c["commit"])], None),
        ("the wrong model runs", "seg", (runw["a"], runw["b"], 1.4, ""), [(0.05, 2.5, c["wrong"])], None),
        ("the break", "seg", (brk["a"], brk["b"] + 0.5, 1.0, ""), [(0.05, 3.0, c["break"])], None),
        ("the count", "seg", (close["a"], cnt["b"] - 0.2, count_rate, ""), [(0.05, 2.0, c["count1"]), (2.0, 4.5, c["count2"]), (4.5, 7.0, c["count3"])], None),
        ("the gap", "seg", (gap["a"], gap["b"], 1.0, ""), [(0.05, 2.5, c["gap"])], None),
        ("the name", "seg", (name["a"], name["b"], 1.0, ""), [(0.05, 2.0, c["name"])], None),
        ("the land", "seg", (land["a"] + 0.2, land["b"] - 0.9, 1.3, ""), [(0.05, 3.0, c["land"])], None),
        ("end card + CTA", "freeze", ("land", 1.0, ""), [], end_png),
    ]
    edl = []
    for label, kind, args, caps, ov in plan:
        caps2 = [(a, b, t) for (a, b, t) in caps if t]
        if kind == "freeze":
            TL.add_freeze(args[0], args[1], bare=args[2], label=label, caps=caps2, overlay=ov)
        else:
            TL.add_seg(args[0], args[1], args[2], bare=args[3], label=label, caps=caps2, overlay=ov)
        e = TL.entries[-1]
        edl.append({"beat": label, "src": e["src"], "out_s": round(e["n"] / job.fps, 2), "captions": [x[2] for x in caps2]})
    res = {}
    mp4 = os.path.join(d, "reel.9x16.mp4")
    if render_video:
        res = TL.render(mp4)
        write_srt(os.path.join(d, "reel.srt"), res["captions"])
    # cover: the cold-open frame with the hook (survives the 3:4 grid crop y 213–1493 u and the 1:1 crop y 373–1333 u)
    from PIL import Image
    cov = job.stills("9x16", ["cover"], bare="head,foot")["cover"]
    im = Image.open(cov).convert("RGB")
    ov = Image.open(hook_png).convert("RGBA")
    im.paste(ov, (0, 0), ov)
    body, css = C.cover_extra("CETI EXPLAINERS · BASE-RATE NEGLECT", job.copy["video"]["claim"], lay, k, job.chrome)
    xp = os.path.join(job.work, "layers", "reel-cover-extra.png")
    cover_boxes = job.comp.shot(body, W, Hh, xp, job.chrome, transparent=True, css=css)
    ov2 = Image.open(xp).convert("RGBA")
    im.paste(ov2, (0, 0), ov2)
    im.save(os.path.join(d, "reel.cover.png"))
    # 4 stills of the reel for review
    sd = os.path.join(d, "stills")
    os.makedirs(sd, exist_ok=True)
    if render_video:
        fr = sorted(os.listdir(res["frames_dir"]))
        for i, frac in enumerate([0.03, 0.3, 0.55, 0.8]):
            shutil.copy(os.path.join(res["frames_dir"], fr[int(frac * (len(fr) - 1))]), os.path.join(sd, f"reel-{i + 1}-{int(frac * 100):02d}pct.jpg"))
    post = cp["post"]
    tags = job.copy["hashtags"][:5]
    txt = f"{post['hookLine']}\n\n{post['caption']}\n\n{job.copy['honestyLine']}\n\n{' '.join(tags)}\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    # QA
    times = sorted({round(e["src"][0] + 0.4, 2) for e in TL.entries} | {job.TL["frames"]["cover"]})
    qa = {"edl": edl, "post_hook_chars": len(post["hookLine"]), "hashtags": len(tags)}
    pr = probe_check(job, "9x16", times, "", "reel")
    pr_h = probe_check(job, "9x16", [job.TL["frames"]["cover"]], "head,foot", "reel.cold-open")
    lc = layer_check(job, "9x16", res.get("cap_boxes", []) + hook_boxes, "reel.captions+hook")
    ec = layer_check(job, "9x16", end_boxes, "reel.end-card")
    qa["Q3_safe_zone"] = {"pass": not (pr["safe_zone_violations"] or pr_h["safe_zone_violations"] or lc["safe_zone_violations"] or ec["safe_zone_violations"]),
                          "film": pr["safe_zone_violations"] + pr_h["safe_zone_violations"], "layers": lc["safe_zone_violations"] + ec["safe_zone_violations"],
                          "mask_u": job.L["9x16"]["mask"], "probed_frames": times}
    qa["Q8_type_floor"] = {"pass": not (pr["type_floor_violations"] or lc["type_floor_violations"] or ec["type_floor_violations"]),
                           "violations": pr["type_floor_violations"] + lc["type_floor_violations"] + ec["type_floor_violations"],
                           "min_phone_css_px": round(min([Q.phone_px(b["px"], W) for v in Q.probe(job.page("9x16"), [job.TL["frames"]["count"]], W, Hh, job.comp.b).values() for b in v] or [0]), 2)}
    if render_video:
        dur = ffprobe_dur(mp4)
        covered = sum(b - a for a, b, _ in res["captions"]) + 1.7 + 1.0
        qa["Q11_platform"] = {"pass": 20 <= dur <= 35 and file_mb(mp4) < 4000, "duration_s": round(dur, 2), "window_s": [20, 35], "hard_cap_s": 45,
                              "mp4_MB": file_mb(mp4), "limit": "4 GB, H.264 + AAC, yuv420p, faststart", "cover": "reel.cover.png"}
        qa["caption_coverage"] = {"pass": covered / dur >= 0.8, "covered_s": round(covered, 2), "fraction": round(covered / dur, 3),
                                  "rule": "burned caption, cold-open hook or end card on screen ≥ 80 % of the reel (muted autoplay)"}
        qa["muted_labels"] = "every introduced term is also a burned label on the object (L12): see stills/"
    job.qa["channels"]["reel"] = qa
    texts = {"reel/post.txt": txt, "reel/captions": " ".join(x[2] for x in res.get("captions", [])), "reel/hook": " ".join(cp["hook"])}
    return texts


def ch_carousel(job):
    """IG carousel (CHANNELS §4.3): 4:5 frame-bank stills (bare: no module head, foot line or chip) + a designed text
    layer per slide: slide 1 the question, slide 2 the persistent object, one beat per slide, last = the aha + CTA"""
    d = job.channel_dir("carousel")
    slides = job.copy["carousel"]["slides"]
    names = [s["frame"] for s in slides]
    st = job.stills("4x5", names, bare="head,foot,chip")
    lay = job.L["4x5"]
    W, Hh = EXPORT["4x5"]
    k = W / 960.0
    qa = {"slides": len(slides), "per_slide": []}
    allb = []
    for i, s in enumerate(slides):
        s = dict(s)
        if s.get("honesty"):
            s["honestyLine"] = job.copy["honestyLine"]
        if s.get("cta"):
            s["url"] = "link in bio"
        body, css = C.slide(st[s["frame"]], s, i, len(slides), lay, k, job.chrome, max_words=25, swipe=i < 3)
        p = os.path.join(d, f"slide-{i + 1:02d}.png")
        b = job.comp.shot(body, W, Hh, p, job.chrome, css=css)
        allb += b
        wc = lambda t: len([w for w in t.split() if w not in ("%", "·", "×", "=", "÷", "+", "—")])
        qa["per_slide"].append({"slide": i + 1, "frame": s["frame"], "t": job.TL["frames"][s["frame"]], "words": wc(s.get("body", "")),
                                "headline_words": wc(s["headline"])})
    post = job.copy["carousel"]["post"]
    txt = f"{post['hookLine']}\n\n{post['caption']}\n\n{job.copy['honestyLine']}\n\n{' '.join(job.copy['hashtags'][:5])}\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    lc = layer_check(job, "4x5", allb, "carousel.text")
    pr = probe_check(job, "4x5", [job.TL["frames"][n] for n in names], "head,foot,chip", "carousel.figure")
    qa["Q3_safe_zone"] = {"pass": not (lc["safe_zone_violations"] or pr["safe_zone_violations"]), "violations": lc["safe_zone_violations"] + pr["safe_zone_violations"]}
    qa["Q8_type_floor"] = {"pass": not (lc["type_floor_violations"] or pr["type_floor_violations"]), "violations": lc["type_floor_violations"] + pr["type_floor_violations"]}
    qa["Q11_platform"] = {"pass": 8 <= len(slides) <= 10 and all(file_mb(os.path.join(d, f"slide-{i + 1:02d}.png")) < 30 for i in range(len(slides))),
                          "slides": len(slides), "window": [8, 10], "max_MB_each": max(file_mb(os.path.join(d, f"slide-{i + 1:02d}.png")) for i in range(len(slides))), "limit": "20 slides, 30 MB/image"}
    qa["words"] = {"pass": all(x["words"] <= 25 and x["headline_words"] <= 9 for x in qa["per_slide"]), "rule": "body ≤ 25 words, headline ≤ 9 words"}
    job.qa["channels"]["carousel"] = qa
    texts = {"carousel/post.txt": txt, "carousel/slides": " ".join(s["headline"] + " " + s.get("body", "") for s in slides) + " " + job.copy["honestyLine"]}
    return texts


def ch_linkedin_pdf(job):
    """LinkedIn document (CHANNELS §2.3): cover · the setup · the beats (≤ 45 words each) · the arithmetic · where
    this stops · sources + the URL spelled out. 4:5 pages, PDF via img2pdf (lossless JPEG)."""
    d = job.channel_dir("linkedin-pdf")
    pd = os.path.join(d, "pages")
    os.makedirs(pd, exist_ok=True)
    li = job.copy["linkedin"]
    lay = job.L["4x5"]
    W, Hh = EXPORT["4x5"]
    k = W / 960.0
    beats = ["po.first", "wrong", "break", "count", "gap", "contrast", "named"]
    st = job.stills("4x5", beats + ["cover"], bare="head,foot,chip")
    slide_by = {s["frame"]: s for s in job.copy["carousel"]["slides"]}
    pages = []
    # cover: the headline large, the counted gap as the figure (cropped to the figure region, unscaled)
    from PIL import Image
    crop = os.path.join(job.work, "layers", "li-cover-fig.png")
    F = lay["F"]
    Image.open(st["cover"]).crop((0, int((F["y0"] + 96) * k), W, int((F["y1"] - 4) * k))).save(crop)
    pages.append(("text", dict(li["cover"], hclass="xl", figure=crop, figTop=452, mark=False)))
    pages.append(("text", dict(li["setup"], mark=False)))
    for n in beats:
        s = dict(slide_by[n])
        s["body"] = li["bodies"][n]
        pages.append(("slide", (n, s)))   # LinkedIn keeps the honesty on its own page
    pages.append(("text", li["arithmetic"] | {"after": li["arithmetic"]["body"], "body": ""}))
    pages.append(("text", li["honesty"]))
    src = [f"[{s[0]}] {s[1]}" for s in job.plan["meta"].get("sources", [])]
    pages.append(("text", {"kicker": li["cta"]["kicker"], "headline": li["cta"]["headline"], "body": li["cta"]["body"], "items": src, "url": li["cta"]["url"], "mark": True}))
    n = len(pages)
    allb, words = [], []
    paths = []
    for i, (kind, p) in enumerate(pages):
        out = os.path.join(pd, f"page-{i + 1:02d}.png")
        if kind == "slide":
            name, s = p
            body, css = C.slide(st[name], s, i, n, lay, k, job.chrome, max_words=45, swipe=False, li=True)
            words.append(len(s["body"].split()))
        else:
            body, css = C.text_page(p, i, n, lay, k, job.chrome)
            words.append(len(" ".join([p.get("body", ""), p.get("after", "")] + ([] if p.get("url") else p.get("items", []))).split()))   # the sources list is a reference, not prose
        allb += job.comp.shot(body, W, Hh, out, job.chrome, css=css)
        jp = out.replace(".png", ".jpg")
        Image.open(out).convert("RGB").save(jp, quality=93)
        paths.append(jp)
    pdf = os.path.join(d, "document.pdf")
    run(["img2pdf", "--output", pdf] + paths)
    for jp in paths:
        os.remove(jp)
    post = li["post"]
    hook2 = post["hook"].split("\n")
    txt = post["hook"] + "\n\n" + post["caption"] + "\n\n" + job.copy["honestyLine"] + "\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    lc = layer_check(job, "4x5", allb, "linkedin-pdf")
    qa = {"pages": n, "words_per_page": words}
    qa["Q3_safe_zone"] = {"pass": not lc["safe_zone_violations"], "violations": lc["safe_zone_violations"]}
    qa["Q8_type_floor"] = {"pass": not lc["type_floor_violations"], "violations": lc["type_floor_violations"]}
    cover_h = [b for b in allb if b["qa"] == "headline"][:1]
    qa["page1_at_320px"] = {"pass": bool(cover_h) and cover_h[0]["px"] / k >= 72, "headline_u": round(cover_h[0]["px"] / k, 1) if cover_h else None, "rule": "page 1 headline ≥ 72 u"}
    qa["Q11_platform"] = {"pass": 8 <= n <= 12 and file_mb(pdf) < 100, "pages": n, "window": [8, 12], "pdf_MB": file_mb(pdf), "limit": "100 MB, 300 pages"}
    qa["see_more_hook"] = {"pass": len(post["hook"]) <= 140 and len(hook2) == 2, "chars": len(post["hook"]), "rule": "2-line hook inside the ~140-char mobile 'see more' cutoff"}
    qa["words"] = {"pass": all(w <= 45 for w in words), "rule": "≤ 45 words per page"}
    job.qa["channels"]["linkedin-pdf"] = qa
    return {"linkedin-pdf/post.txt": txt, "linkedin-pdf/pages": json.dumps(li, ensure_ascii=False)}


def ch_linkedin_video(job, render_video=True):
    """LinkedIn feed video (CHANNELS §2.3): 4:5 (the PO is a tall grid), text-first claim (H4) for 3 s, the question,
    wrong → break → count → name in full, the contrast compressed, a 4 s end card. Burned captions + .srt."""
    d = job.channel_dir("linkedin-video")
    aspect = "4x5"
    lay = job.L[aspect]
    W, Hh = EXPORT[aspect]
    k = W / 960.0
    v, c = job.copy["video"], job.copy["reel"]["captions"]
    caps_film = {round(x[0], 2): x[2] for x in job.TL["captions"]}
    P, lf = job.ph, job.leaf
    phs = job.TL["phases"]
    r0, r1 = phs[0], phs[1]
    ask, com = P(lambda p: p["beat"] == "hook"), P(lambda p: p["beat"] == "commit")
    steel, runw, brk = P(lambda p: lf(p) == "steelman"), P(lambda p: lf(p) == "run-wrong"), P(lambda p: lf(p) == "break")
    close = P(lambda p: p["beat"] == "build" and p["a"] >= brk["b"])
    cnt, gap = P(lambda p: p["beat"] == "count"), P(lambda p: p["beat"] == "gap")
    name = P(lambda p: p["beat"] == "name" and p["a"] > cnt["a"])
    cs = [p for p in phs if p["use"] == "contrast-split"]
    land = P(lambda p: p["beat"] == "land")
    claim_png = os.path.join(job.work, "layers", "li-claim.png")
    body, css = C.hook_overlay(v["claim"], lay, k, job.chrome, top=lay["safe"]["y0"] + 20)
    claim_boxes = job.comp.shot(body, W, Hh, claim_png, job.chrome, transparent=True, css=css)
    end_png = os.path.join(job.work, "layers", "li-end.png")
    body, css = C.end_card(job.TL["aha"][0].upper() + job.TL["aha"][1:] + ".", "Try the interactive", v["cta"], lay, k, job.chrome, honesty=job.copy["honestyLine"])
    end_boxes = job.comp.shot(body, W, Hh, end_png, job.chrome, css=css)
    TL = Timeline(job, aspect, job.fps)
    con_a = next(p for p in cs if lf(p) == "count")
    TL.add_freeze("po.first", 3.0, bare="head", label="text-first claim (H4)", caps=[], overlay=claim_png)
    TL.add_seg(r0["a"], r0["b"], 1.0, label="the city", caps=[(0.05, 4.0, c["city"])])
    TL.add_seg(r1["a"], r1["b"], 2.0, label="the witness, tested", caps=[(0.05, 3.0, "Tested at night, she is right 80 times in 100.")])
    TL.add_seg(ask["a"], com["b"], 1.3, label="question + pause and guess", caps=[(0.05, 1.6, c["question"]), (1.6, 4.0, "Pause and guess. Hold your number.")])
    TL.add_seg(steel["a"], runw["b"], 1.4, label="the wrong model, fairly put", caps=[(0.05, 2.5, "The obvious answer, fairly put: 80 %."), (2.5, 5.0, "Run that model and it says 80 %.")])
    TL.add_seg(brk["a"], close["a"], 1.0, label="the break", caps=[(0.05, 4.5, c["break"])])
    TL.add_seg(close["a"], cnt["b"], 1.2, label="the count", caps=[(0.05, 3.3, c["count1"]), (3.3, 6.6, c["count2"]), (6.6, 10.0, c["count3"])])
    TL.add_seg(gap["a"], gap["b"], 1.0, label="the gap", caps=[(0.05, 2.5, c["gap"])])
    TL.add_seg(name["a"] - 2.0, name["b"], 1.0, label="the name", caps=[(0.05, 2.0, "Most cabs she would call Blue are Green."), (2.0, 4.0, c["name"])])
    TL.add_seg(con_a["a"], cs[-1]["b"], 1.85, label="one difference (compressed)", caps=[(0.05, 4.0, "Same witness, a city that is half Blue: 80 %."), (4.0, 8.0, "Ignoring the city answers as if it were half Blue.")])
    TL.add_freeze("land", 4.0, label="end card", caps=[], overlay=end_png)
    edl = [{"beat": e["label"], "src": e["src"], "out_s": round(e["n"] / job.fps, 2), "captions": [x[2] for x in e["caps"]]} for e in TL.entries]
    mp4 = os.path.join(d, f"video.{aspect}.mp4")
    qa = {"edl": edl}
    res = TL.render(mp4) if render_video else {}
    if render_video:
        write_srt(os.path.join(d, "video.srt"), res["captions"])
        dur = ffprobe_dur(mp4)
        qa["Q11_platform"] = {"pass": 45 <= dur <= 75, "duration_s": round(dur, 2), "window_s": [45, 75], "mp4_MB": file_mb(mp4), "limit": "3 s – 10 min, 75 KB – 5 GB"}
        covered = sum(b - a for a, b, _ in res["captions"]) + 3.0 + 4.0
        qa["caption_coverage"] = {"pass": covered / dur >= 0.8, "fraction": round(covered / dur, 3)}
    from PIL import Image
    cov = Image.open(job.stills(aspect, ["po.first"], bare="head")["po.first"]).convert("RGB")
    ov = Image.open(claim_png).convert("RGBA")
    cov.paste(ov, (0, 0), ov)
    cov.save(os.path.join(d, "cover.png"))
    lc = layer_check(job, aspect, res.get("cap_boxes", []) + claim_boxes + end_boxes, "li-video.layers")
    pr = probe_check(job, aspect, sorted({round(e["src"][0] + 0.4, 2) for e in TL.entries}), "", "li-video")
    qa["Q3_safe_zone"] = {"pass": not (lc["safe_zone_violations"] or pr["safe_zone_violations"]), "violations": lc["safe_zone_violations"] + pr["safe_zone_violations"]}
    qa["Q8_type_floor"] = {"pass": not (lc["type_floor_violations"] or pr["type_floor_violations"]), "violations": lc["type_floor_violations"] + pr["type_floor_violations"]}
    if not render_video:
        qa["not_rendered"] = f"python3 channels/channels.py {os.path.relpath(job.plan_path, LIB)} --channel linkedin-video --workers 2"
    txt = v["post"] + "\n\n" + job.copy["honestyLine"] + "\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    job.qa["channels"]["linkedin-video"] = qa
    return {"linkedin-video/post.txt": txt, "linkedin-video/captions": " ".join(x[2] for x in res.get("captions", []))}


def ch_blog(job):
    """Blog (CHANNELS §2.3): the interactive film page embedded as the hero, 900–1,400 words in the plan's beat
    order, 4–6 stills at the beats they illustrate (16:9, 1920×1080), a 'Where this stops' section, sources, OG card"""
    d = job.channel_dir("blog")
    sd = os.path.join(d, "stills")
    os.makedirs(sd, exist_ok=True)
    b = job.copy["blog"]
    names = [s["frame"] for s in b["sections"] if s.get("frame")]
    st = job.stills("16x9", names + ["cover"])
    shutil.copy(job.page("16x9"), os.path.join(d, "embed.html"))
    md = [f"---\ntitle: \"{b['title']}\"\ndescription: \"{b['dek']}\"\nog_image: og.png\nog_image_alt: \"{job.copy['newsletter']['number']}: 1,000 cabs counted; the witness's Blue calls gather into a block of 290, 120 of them Blue.\"\n---\n",
          f"# {b['title']}\n", f"*{b['dek']}*\n",
          '<iframe src="embed.html" title="Base-rate neglect: the interactive film" style="width:100%;aspect-ratio:16/10;border:0" loading="lazy"></iframe>\n',
          "*Play the film, scrub it, or change the city and the witness in “Try it yourself” below the player.*\n"]
    for s in b["sections"]:
        md.append(f"## {s['heading']}\n")
        if s.get("frame"):
            fn = f"{s['id']}.png"
            shutil.copy(st[s["frame"]], os.path.join(sd, fn))
            md.append(f"![{s['caption']}](stills/{fn})\n*{s['caption']}*\n")
        md.append(s["text"] + "\n")
    md.append("## Sources\n")
    for s in job.plan["meta"].get("sources", []):
        md.append(f"- [{s[0]}] [{s[1]}]({s[2]})")
    md.append(f"\n---\n*{job.copy.get('series', 'CETI Explainers')} · [cetiai.co](https://cetiai.co) · every number in this post is counted on the film’s 1,000 dots.*\n")
    text = "\n".join(md)
    open(os.path.join(d, "post.md"), "w").write(text)
    # OG: the counted block, number and gap from the 4:5 re-layout (the right column alone: no half-hidden labels)
    from PIL import Image
    g45 = job.stills("4x5", ["cover"], bare="head,foot,chip")["cover"]
    F45, k45 = job.L["4x5"]["F"], 1080 / 960.0
    rcx = 1080 - (F45["x1"] - 440) * k45 - 40
    ogfig = os.path.join(job.work, "layers", "og-fig.png")
    Image.open(g45).convert("RGB").crop((int(rcx), int((F45["y0"] + 46) * k45), 1080, int((F45["y1"] - 30) * k45))).save(ogfig)
    body, css = C.og_card(ogfig, b["title"].split(":")[0] + ".", "CETI EXPLAINERS · BASE-RATE NEGLECT", job.chrome)
    ob = job.comp.shot(body, 1200, 630, os.path.join(d, "og.png"), job.chrome, css=css)
    prose = " ".join(s["text"] for s in b["sections"])
    import re
    words = len(re.sub(r"<[^>]+>", " ", prose).split())
    qa = {"words": {"pass": 900 <= words <= 1400, "count": words, "window": [900, 1400]},
          "stills": {"pass": 4 <= len(names) <= 6, "count": len(names)},
          "og": {"pass": all(30 <= x["x"] and x["x"] + x["w"] <= 1170 and 30 <= x["y"] and x["y"] + x["h"] <= 600 for x in ob), "size": [1200, 630], "MB": file_mb(os.path.join(d, "og.png")), "rule": "text inside the centre 1000 × 500 · survives 1200 × 627"},
          "limits_section": {"pass": "Where this stops" in text}}
    job.qa["channels"]["blog"] = qa
    return {"blog/post.md": text}


def ch_newsletter(job):
    """Newsletter (CHANNELS §2.3, CHANNEL-SPECS §4): 600 px email, inline styles, no JS, dark-mode safe (no pure
    white/black; art on its own paper ground), still 1 = the PO, the count GIF (frame 1 = the landed count, for
    Outlook), the number in bold, the aha, one honesty sentence, the link. Plain-text twin. Alt text states the number."""
    from PIL import Image
    d = job.channel_dir("newsletter")
    sd = os.path.join(d, "stills")
    os.makedirs(sd, exist_ok=True)
    n = job.copy["newsletter"]
    # figures: three different states (rule b) — the city (wide 16:9 crop), the count GIF, the two cities
    load_figs(job)
    for nm, fig in [("city.jpg", "city"), ("contrast.jpg", "contrast")]:
        im = Image.open(job.figs[fig]).convert("RGB")
        im = im.resize((1072, int(im.height * 1072 / im.width)), Image.LANCZOS)
        bgc = Image.new("RGB", im.size, (246, 243, 236))
        Image.composite(im, bgc, Image.new("L", im.size, 255)).save(os.path.join(sd, nm), quality=86)
    # GIF: the count landing, 1:1, 600 px, 10 fps, ≤ 6 s, frame 1 = the landed count
    cnt = job.ph(lambda p: p["beat"] == "count")
    spec = SC.FIG["block"]                                                   # the counted block, set large (rule c at 600 px)
    frames = job.segment(spec["aspect"], cnt["b"] - 3.6, cnt["b"] - 0.1, 3.0, SC.BARE, scale=spec["scale"], nogrid=True)   # 10 fps
    seq = [frames[-1]] * 6 + frames + [frames[-1]] * 12
    gd = os.path.join(job.work, "gif")
    if os.path.exists(gd):
        shutil.rmtree(gd)
    os.makedirs(gd)
    for i, f in enumerate(seq):
        cimg = SC.crop(Image.open(f), spec)
        gh = int(round(600 * cimg.height / cimg.width / 2) * 2)
        cimg.resize((600, gh), Image.LANCZOS).save(os.path.join(gd, f"{i:04d}.png"))
    gif = os.path.join(d, "count.gif")
    pal = os.path.join(gd, "pal.png")
    run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "10", "-i", os.path.join(gd, "%04d.png"), "-vf", "palettegen=max_colors=48:stats_mode=diff", pal])
    run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "10", "-i", os.path.join(gd, "%04d.png"), "-i", pal, "-lavfi", "paletteuse=dither=none:diff_mode=rectangle", "-loop", "0", gif])
    gif_s = len(seq) / 10.0
    T = C.TOK[job.chrome]
    ink, dim, ground, panel, acc, mach = T["ink"], T["dim"], T["ground"], T["panel"], T["accent"], T["machine"]
    url = "https://" + job.copy["url"]
    font = "'DM Sans', Helvetica, Arial, sans-serif"
    serif = "Georgia, 'Times New Roman', serif"
    mono = "'Space Mono', 'Courier New', monospace"
    alt_city = "1,000 dots, one per cab: 150 filled Blue cabs at the top, 850 hollow Green cabs below."
    alt_gif = f"The witness's Blue calls gather into one block: {n['number']}."
    alt_gap = "Two cities, one witness: City A counts 120 of 290 = 41 %; City B, half Blue, counts 400 of 500 = 80 %."
    P = f"margin:0 0 18px; font-family:{font}; font-size:17px; line-height:1.6; color:{ink};"
    html = f"""<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>{C.esc(n['headline'])}</title></head>
<body style="margin:0; padding:0; background:{ground};">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">{C.esc(n['preheader'])}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{ground};"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background:{panel}; border:1px solid #DDD6C8;">
<tr><td style="padding:28px 32px 8px; font-family:{mono}; font-size:12px; letter-spacing:2px; color:{acc};">CETI EXPLAINERS · BASE-RATE NEGLECT</td></tr>
<tr><td style="padding:4px 32px 18px;"><h1 style="margin:0; font-family:{serif}; font-style:italic; font-weight:normal; font-size:32px; line-height:1.15; color:{ink};">{C.esc(n['headline'])}</h1></td></tr>
<tr><td style="padding:0 32px;"><img src="stills/city.jpg" width="536" alt="{C.esc(alt_city)}" style="display:block; width:100%; max-width:536px; height:auto; border:0;"></td></tr>
<tr><td style="padding:22px 32px 0;">
<p style="{P}">{C.esc(n['question'])}</p>
<p style="{P}">{C.esc(n['misconception'])}</p>
<p style="{P}">{C.esc(n['count'])}</p></td></tr>
<tr><td align="center" style="padding:4px 32px 0;"><a href="{url}" style="text-decoration:none;"><img src="count.gif" width="536" alt="{C.esc(alt_gif)}" style="display:block; width:536px; max-width:100%; height:auto; border:0;"></a></td></tr>
<tr><td align="center" style="padding:18px 32px 6px; font-family:{mono}; font-size:26px; font-weight:bold; color:{mach};">{C.esc(n['number'])}</td></tr>
<tr><td style="padding:12px 32px 0;">
<p style="{P}"><strong>{C.esc(n['aha'])}</strong></p>
<p style="margin:0 0 22px; font-family:{font}; font-size:15px; line-height:1.55; color:{dim};">{C.esc(n['honesty'])}</p></td></tr>
<tr><td align="center" style="padding:0 32px 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:{ink}; border-radius:999px;"><a href="{url}" style="display:inline-block; padding:13px 24px; font-family:{font}; font-size:16px; color:{panel}; text-decoration:none;">{C.esc(n['cta'])} →</a></td></tr></table></td></tr>
<tr><td style="padding:0 32px;"><img src="stills/contrast.jpg" width="536" alt="{C.esc(alt_gap)}" style="display:block; width:100%; max-width:536px; height:auto; border:0;"></td></tr>
<tr><td style="padding:22px 32px 30px; font-family:{font}; font-size:13px; line-height:1.5; color:{dim}; border-top:1px solid #E4DDCF;">{C.esc(n['signoff'])} · Source: Kahneman, <em>Thinking, Fast and Slow</em>, ch. 16 · <a href="{url}" style="color:{dim};">{C.esc(job.copy['url'])}</a></td></tr>
</table></td></tr></table></body></html>"""
    open(os.path.join(d, "email.html"), "w").write(html)
    plain = "\n\n".join([n["headline"], n["question"], n["misconception"], n["count"], n["number"], n["aha"], n["honesty"], f"{n['cta']}: {url}", n["signoff"]]) + "\n"
    open(os.path.join(d, "email.txt"), "w").write(plain)
    open(os.path.join(d, "subject.txt"), "w").write(f"Subject: {n['subject']}\nPreheader: {n['preheader']}\n")
    # screenshot for review (desktop width)
    job.comp.pg.set_viewport_size({"width": 680, "height": 900})
    job.comp.pg.goto("file://" + os.path.join(d, "email.html"))
    job.comp.pg.wait_for_timeout(300)
    job.comp.pg.screenshot(path=os.path.join(d, "email.screenshot.png"), full_page=True)
    from PIL import Image as _I
    gif0 = _I.open(gif).convert("RGB")
    dup = Q.dedupe([("city", _I.open(os.path.join(sd, "city.jpg"))), ("count.gif", gif0), ("contrast", _I.open(os.path.join(sd, "contrast.jpg")))])
    words = len(" ".join([n["headline"], n["question"], n["misconception"], n["count"], n["number"], n["aha"], n["honesty"], n["cta"]]).split())
    import re
    qa = {"html_KB": {"pass": len(html.encode()) / 1024 < 102, "KB": round(len(html.encode()) / 1024, 1), "rule": "< 102 KB (Gmail clip; images not counted)"},
          "no_js": {"pass": "<script" not in html.lower() and "onload" not in html.lower()},
          "inline_styles_only": {"pass": "<style" not in html.lower()},
          "width": {"pass": 'width="600"' in html, "px": 600},
          "gif": {"pass": file_mb(gif) <= 1.5 and gif_s <= 6, "MB": file_mb(gif), "target_MB": 1.0, "hard_MB": 1.5, "seconds": gif_s, "fps": 10, "size": [600, "≈350"], "frame1": "the landed count (Outlook shows frame 1)"},
          "alt_text_states_number": {"pass": all(re.search(r"\d", a) for a in [alt_city, alt_gif, alt_gap])},
          "dark_mode": {"pass": "#FFFFFF" not in html.upper() and "#000000" not in html.upper(), "rule": "no pure white/black; art carries its own paper ground"},
          "words": {"pass": 250 <= words <= 350, "count": words, "window": [250, 350]},
          "rule_b_no_repeat": {"pass": not dup, "duplicates": dup, "figures": ["stills/city.jpg", "count.gif", "stills/contrast.jpg"]}}
    job.qa["channels"]["newsletter"] = qa
    return {"newsletter/email.txt": plain, "newsletter/subject": n["subject"] + " " + n["preheader"]}


# ═════════════════════════ round 2: designed scenes from figure states (channels/scenes.py) ═════════════════════════
import scenes as SC  # noqa: E402


def load_figs(job):
    if getattr(job, "figs", None):
        return job.figs
    job.figs = {n: SC.fig_still(job, n) for n in SC.FIG}
    for n in SC.FIG:
        f = SC.FIG[n]
        rec = {"name": "fig:" + n, "t": job.TL["frames"][f["t"]] if isinstance(f["t"], str) else f["t"], "aspect": f["aspect"],
               "variant": job.vkey(f["aspect"], SC.BARE, f["scale"], True), "crop_u": f["box"], "path": os.path.relpath(job.figs[n], job.out)}
        job.frames.append(rec)
    return job.figs


def rules_qa(boxes, dominants, safe, dup_items, crops, brand=None, where=""):
    """the four compiler rules + safe box, as one dict of pass/fail entries"""
    from PIL import Image
    dom = Q.dominance(dominants, safe)
    dups = Q.dedupe(dup_items)
    tmin = Q.type_minimums(boxes, where, crops)
    out = {"rule_a_dominance": {"pass": all(d["pass"] for d in dom), "frames": dom, "rule": "dominant element ≥ 35 % of the safe area"},
           "rule_b_no_repeat": {"pass": not dups, "duplicates": dups, "compared": [n for n, _ in dup_items], "rule": "dHash 16×16 of each figure region, Hamming ≤ 12 = repeat"},
           "rule_c_type_min": {"pass": not tmin, "violations": tmin, "rule": "headline ≥ 72 · body ≥ 36 · labels ≥ 28 · key numeral ≥ 200 px (1080 wide)",
                               "film_labels_in_crops_px": {n: round(p, 1) for n, p in crops}},
           "Q3_safe_box": {"pass": not Q.safe_px(boxes, safe, where), "violations": Q.safe_px(boxes, safe, where), "safe_px": safe}}
    if brand is not None:
        nb = Q.brand_count(boxes, brand)
        out["rule_d_brand_once"] = {"pass": nb == 1, "count": nb, "brand": brand}
    return out


def ch_reel2(job, render_video=True):
    """IG reel rebuilt for the safe zone: every beat a different figure state, the headline at y≈140, the key
    numeral ≥ 240 px, the figure filling the safe width. ≤ 30 s."""
    from PIL import Image
    d = job.channel_dir("reel")
    for f in os.listdir(d):
        if f.endswith((".png", ".srt", ".mp4", ".txt")):
            os.remove(os.path.join(d, f))
    load_figs(job)
    cp = job.copy["reel"]
    beats = {b["id"]: b for b in cp["beats"]}
    L = os.path.join(job.work, "layers")
    bg = os.path.join(L, "reel-bg.png")
    job.comp.shot("", 1080, 1920, bg, job.chrome)
    BG = Image.open(bg).convert("RGB")
    x0, y0, x1, y1 = SC.REEL_SAFE
    FIGTOP = 372
    # beat → (figure name, source window (a, b, rate), seconds)
    plan = [
        ("cold", None, None, 1.8),
        ("city", "city", (0.6, 3.0, 1.0), None),
        ("strip", "strip", (4.7, 6.9, 1.0), None),
        ("wrong", "wrong.rc", (43.6, 47.1, 1.4), None),
        ("break", "break", (47.1, 49.6, 1.0), None),
        ("ringed", "ringed", (51.7, 54.4, 1.0), None),
        ("count", "block", (53.6, 63.4, 2.45), None),
        ("contrast", "contrast", (84.2, 96.4, 4.07), None),
        ("end", None, None, 2.5),
    ]
    allboxes, doms, crops, dup_items, caps, edl = [], [], [], [], [], []
    entries = []
    for bid, fname, win, secs in plan:
        b = beats[bid]
        if fname is None:
            p = os.path.join(L, f"reel-{bid}.png")
            bx, dom = (SC.reel_cold if bid == "cold" else SC.reel_end)(job, b, p)
            allboxes += bx
            doms.append((bid, dom))
            n = int(round(secs * job.fps))
            entries.append({"bid": bid, "static": p, "n": n, "caps": b["headline"]})
            dup_items.append((bid, Image.open(p).crop((x0, 300, x1, 1150))))
            edl.append({"beat": bid, "src": "designed scene", "out_s": secs})
            continue
        spec = SC.FIG[fname]
        a, bb, rate = win
        fw, fh = Image.open(job.figs[fname]).size
        bh = (y1 - FIGTOP) - (350 if bid == "count" else 0)
        s, w, h = SC.fit(fw, fh, x1 - x0, bh)
        box = (x0 + (x1 - x0 - w) // 2, FIGTOP, w, h)
        crops.append((fname, SC.label_px(fname, s)))
        doms.append((bid, box))
        ov = os.path.join(L, f"reel-{bid}-text.png")
        allboxes += SC.reel_overlay(job, b, ov)
        extra = None
        if bid == "count":
            nv = os.path.join(L, "reel-count-numeral.png")
            allboxes += SC.reel_numeral(job, b["numeral"], FIGTOP + h + 30, nv, label="= 120 ÷ 290")
            extra = nv
        fr = (job.fps / rate)
        n = int(round(bb * fr)) - int(round(a * fr))
        entries.append({"bid": bid, "fig": fname, "win": win, "box": box, "ov": ov, "extra": extra, "n": n, "caps": b["headline"], "spec": spec})
        edl.append({"beat": bid, "figure": fname, "src": [a, bb, rate, spec["aspect"] + "×" + str(spec["scale"])], "out_s": round(n / job.fps, 2)})
        mid = a + (bb - a) * 0.75
        st = job.stills(spec["aspect"], [round(mid, 2)], bare=SC.BARE, scale=spec["scale"], nogrid=True)[round(mid, 2)]
        dup_items.append((bid, SC.crop(Image.open(st), spec)))
    total = sum(e["n"] for e in entries) / job.fps
    qa = {"edl": edl, "planned_s": round(total, 2)}
    mp4 = os.path.join(d, "reel.9x16.mp4")
    fdir = os.path.join(job.work, "frames-reel")
    if render_video:
        if os.path.exists(fdir):
            shutil.rmtree(fdir)
        os.makedirs(fdir)
        k, cut_at, t = 0, [], 0.0
        for e in entries:
            cut_at.append(k)
            caps.append((t, t + e["n"] / job.fps, e["caps"]))
            if "static" in e:
                im = Image.open(e["static"]).convert("RGB")
                for _ in range(e["n"]):
                    im.save(os.path.join(fdir, f"{k:05d}.jpg"), quality=94); k += 1
            else:
                spec = e["spec"]
                frames = job.segment(spec["aspect"], *e["win"], bare=SC.BARE, scale=spec["scale"], nogrid=True)
                ov = Image.open(e["ov"]).convert("RGBA")
                ex = Image.open(e["extra"]).convert("RGBA") if e["extra"] else None
                for i, f in enumerate(frames[:e["n"]]):
                    tt = i / job.fps
                    lays = [(ov, 1.0)]
                    if ex is not None:
                        lays.append((ex, min(1.0, max(0.0, (tt - (e["n"] / job.fps - 1.6)) / 0.4))))
                    im = SC.compose_frame(BG, SC.crop(Image.open(f), spec), e["box"], lays)
                    im.save(os.path.join(fdir, f"{k:05d}.jpg"), quality=94); k += 1
            t += e["n"] / job.fps
        # 4-frame dissolves at the cuts
        for c in cut_at[1:]:
            if c < 1 or c + 4 >= k:
                continue
            last = Image.open(os.path.join(fdir, f"{c - 1:05d}.jpg")).convert("RGB")
            for j in range(4):
                p = os.path.join(fdir, f"{c + j:05d}.jpg")
                Image.blend(last, Image.open(p).convert("RGB"), (j + 1) / 5).save(p, quality=94)
        run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(job.fps), "-i", os.path.join(fdir, "%05d.jpg"),
             "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=48000", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
             "-pix_fmt", "yuv420p", "-profile:v", "high", "-r", str(job.fps), "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", mp4])
        write_srt(os.path.join(d, "reel.srt"), caps)
        sd = os.path.join(d, "stills")
        if os.path.exists(sd):
            shutil.rmtree(sd)
        os.makedirs(sd)
        # one still per moving beat (middle frame) + the cold open: the reviewer sees every figure state
        for e, c in zip(entries, cut_at):
            fn = os.path.join(fdir, f"{c + e['n'] // 2:05d}.jpg")
            shutil.copy(fn, os.path.join(sd, f"reel-{cut_at.index(c) + 1:02d}-{e['bid']}.jpg"))
        dur = ffprobe_dur(mp4)
        qa["Q11_platform"] = {"pass": 20 <= dur <= 30 and file_mb(mp4) < 4000, "duration_s": round(dur, 2), "window_s": [20, 30], "mp4_MB": file_mb(mp4)}
        qa["caption_coverage"] = {"pass": True, "fraction": 1.0, "rule": "every beat carries a burned headline (the caption) ≥ 72 px"}
    # cover: its own composition (not the cold open): the count block, the reveal numeral, the claim
    cover = os.path.join(d, "reel.cover.png")
    fw, fh = Image.open(job.figs["block"]).size
    s, w, h = SC.fit(fw, fh, x1 - x0, 430)
    body = (SC.el("h", x0, 140, x1 - x0, "An 80 % reliable witness says Blue.", "headline", 84)
            + SC.img(job.figs["block"], x0, 372, w, h)
            + SC.el("n", x0, 372 + h + 20, None, "41%", "numeral", 280)
            + SC.el("l", x0, 372 + h + 310, x1 - x0, "the real odds the cab was Blue", "label", 40, " color:var(--machine);"))
    cboxes = SC.page(job, body, 1080, 1920, cover)
    dup_items.append(("cover", Image.open(cover).convert("RGB").crop((x0, 300, x1, 1150))))
    post = cp["post"]
    txt = f"{post['hookLine']}\n\n{post['caption']}\n\n{' '.join(job.copy['hashtags'][:5])}\n\n{job.copy['honestyLine']}\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    qa.update(rules_qa(allboxes, doms, SC.REEL_SAFE, dup_items, crops, job.copy["brand"], "reel"))
    qa["cover"] = rules_qa(cboxes, [("cover", (x0, 372, x1 - x0, 760))], SC.REEL_SAFE, [], [("block", SC.label_px("block", s))], None, "reel.cover")
    qa["post_leads_with_gap"] = {"pass": post["hookLine"].startswith("Most people say 80 %"), "first_line": post["hookLine"]}
    job.qa["channels"]["reel"] = qa
    return {"reel/post.txt": txt, "reel/captions": " ".join(b["headline"] for b in cp["beats"])}


def ch_carousel2(job):
    from PIL import Image
    d = job.channel_dir("carousel")
    for f in os.listdir(d):
        if f.startswith("slide-"):
            os.remove(os.path.join(d, f))
    load_figs(job)
    slides = job.copy["carousel"]["slides"]
    allb, doms, crops, dups = [], [], [], []
    for i, s in enumerate(slides):
        p = os.path.join(d, f"slide-{i + 1:02d}.png")
        b, dom, cr = SC.slide_scene(job, s, i, len(slides), p)
        allb += b; doms.append((f"slide-{i + 1}", dom)); crops += [(nm, SC.label_px(nm, sc)) for nm, sc in cr]
        dups.append((f"slide-{i + 1}", Image.open(p).convert("RGB").crop((54, 320, 1026, 1080))))
    post = job.copy["carousel"]["post"]
    txt = f"{post['hookLine']}\n\n{post['caption']}\n\n{' '.join(job.copy['hashtags'][:5])}\n\n{job.copy['honestyLine']}\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    qa = {"slides": len(slides)}
    qa.update(rules_qa(allb, doms, SC.SLIDE_SAFE, dups, crops, job.copy["brand"], "carousel"))
    qa["Q11_platform"] = {"pass": 6 <= len(slides) <= 10, "slides": len(slides), "limit": "20 slides, 30 MB/image"}
    wc = lambda t: len([w for w in t.split() if w not in ("%", "·", "×", "=", "÷", "+")])
    qa["words"] = {"pass": all(wc(s.get("body", "")) <= 25 and wc(s["headline"]) <= 9 for s in slides), "rule": "body ≤ 25 words, headline ≤ 9 words"}
    qa["post_leads_with_gap"] = {"pass": post["hookLine"].startswith("Most people say 80 %"), "first_line": post["hookLine"]}
    job.qa["channels"]["carousel"] = qa
    return {"carousel/post.txt": txt, "carousel/slides": " ".join(s["headline"] + " " + s.get("body", "") for s in slides) + " " + job.copy["honestyLine"]}


def ch_linkedin_pdf2(job):
    from PIL import Image
    d = job.channel_dir("linkedin-pdf")
    pd = os.path.join(d, "pages")
    if os.path.exists(pd):
        shutil.rmtree(pd)
    os.makedirs(pd)
    load_figs(job)
    li = job.copy["linkedin"]
    lay = job.L["4x5"]
    k = 1080 / 960.0
    car = {s["scene"]: s for s in job.copy["carousel"]["slides"]}
    pages = [("scene", dict(car["reveal"], kicker=li["cover"]["kicker"], headline=li["cover"]["headline"], swipe=None)),
             ("text", dict(li["setup"]))]
    for sc in ["city", "wrongbreak", "count", "denominator", "contrast"]:
        pages.append(("scene", dict(car[sc], body=li["pageBodies"][sc], honesty=False)))
    pages.append(("text", li["arithmetic"] | {"after": li["arithmetic"]["body"], "body": ""}))
    pages.append(("text", li["honesty"]))
    src = [f"[{s[0]}] {s[1]}" for s in job.plan["meta"].get("sources", [])]
    pages.append(("text", {"kicker": li["cta"]["kicker"], "headline": li["cta"]["headline"], "body": li["cta"]["body"], "items": src, "url": li["cta"]["url"], "brand": job.copy["brand"]}))
    n = len(pages)
    allb, doms, crops, dups, paths = [], [], [], [], []
    for i, (kind, p) in enumerate(pages):
        out = os.path.join(pd, f"page-{i + 1:02d}.png")
        if kind == "scene":
            b, dom, cr = SC.slide_scene(job, p, i, n, out, li=True)
            doms.append((f"page-{i + 1}", dom)); crops += [(nm, SC.label_px(nm, sc)) for nm, sc in cr]
            dups.append((f"page-{i + 1}", Image.open(out).convert("RGB").crop((54, 320, 1026, 1040))))
        else:
            body, css = C.text_page(p, i, n, lay, k, job.chrome)
            b = job.comp.shot(body, 1080, 1350, out, job.chrome, css=css)
        allb += b
        jp = out.replace(".png", ".jpg")
        Image.open(out).convert("RGB").save(jp, quality=93)
        paths.append(jp)
    pdf = os.path.join(d, "document.pdf")
    run(["img2pdf", "--output", pdf] + paths)
    for jp in paths:
        os.remove(jp)
    post = li["post"]
    txt = post["hook"] + "\n\n" + post["caption"] + "\n\n" + job.copy["honestyLine"] + "\n"
    open(os.path.join(d, "post.txt"), "w").write(txt)
    qa = {"pages": n}
    qa.update(rules_qa(allb, doms, SC.SLIDE_SAFE, dups, crops, job.copy["brand"], "linkedin-pdf"))
    cover_h = [b for b in allb if b["qa"] == "headline"][:1]
    qa["page1_at_320px"] = {"pass": bool(cover_h) and cover_h[0]["px"] >= 72 * 1.125 - 1, "headline_px": cover_h[0]["px"] if cover_h else None}
    qa["Q11_platform"] = {"pass": 8 <= n <= 12 and file_mb(pdf) < 100, "pages": n, "pdf_MB": file_mb(pdf), "limit": "100 MB, 300 pages"}
    qa["see_more_hook"] = {"pass": len(post["hook"]) <= 140 and len(post["hook"].split("\n")) == 2 and "41" in post["hook"].split("\n")[0], "chars": len(post["hook"])}
    job.qa["channels"]["linkedin-pdf"] = qa
    return {"linkedin-pdf/post.txt": txt, "linkedin-pdf/pages": json.dumps(li, ensure_ascii=False)}


CHANNELS = ["reel", "carousel", "linkedin-pdf", "linkedin-video", "blog", "newsletter"]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("plan")
    ap.add_argument("--channel", default="all", choices=CHANNELS + ["all"])
    ap.add_argument("--out")
    ap.add_argument("--copy")
    ap.add_argument("--workers", type=int, default=2)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--no-video", action="store_true", help="skip MP4 renders (stills, slides, PDF, blog, newsletter only)")
    ap.add_argument("--skip", default="", help="comma list of channels to skip with --channel all")
    a = ap.parse_args()
    job = Job(a.plan, a.out, a.copy, a.workers, a.fps)
    want = CHANNELS if a.channel == "all" else [a.channel]
    want = [c for c in want if c not in a.skip.split(",")]
    qpath = os.path.join(job.out, "qa.json")
    if os.path.exists(qpath):                     # keep earlier channel results when compiling one channel
        try:
            job.qa["channels"] = json.load(open(qpath)).get("channels", {})
        except Exception:
            pass
    fpath = os.path.join(job.out, "frames.json")
    if os.path.exists(fpath):
        try:
            job.frames = json.load(open(fpath)).get("frames", [])
        except Exception:
            pass
    texts = {}
    fns = {"reel": lambda: ch_reel2(job, not a.no_video), "carousel": lambda: ch_carousel2(job), "linkedin-pdf": lambda: ch_linkedin_pdf2(job),
           "linkedin-video": lambda: ch_linkedin_video(job, not a.no_video), "blog": lambda: ch_blog(job), "newsletter": lambda: ch_newsletter(job)}
    for c in want:
        t0 = time.time()
        log(c, "…")
        texts.update(fns[c]())
        log(c, f"done in {time.time() - t0:.0f} s")
    # cross-channel checks over every text this run produced: Q6 numbers agree, Q10 honesty survives
    # the reference: numbers the film prints — its captions/templates (timeline.mjs) + every visible label at the frame bank (probed)
    ref = set(job.TL["numbers"])
    for t, bx in Q.probe(job.page("16x9"), sorted(set(job.TL["frames"].values()) | {p["b"] - 0.05 for p in job.TL["phases"]}), 1920, 1080, job.comp.b).items():
        for b in bx:
            ref.update(Q.numbers_in(b["text"]))
    stray = Q.numbers(texts, sorted(ref, key=float))
    needles = [job.copy["honestyLine"][:40], "classroom problem", "stated proportions"]
    miss = Q.honesty({k: v for k, v in texts.items() if k.endswith(("post.txt", "post.md", "email.txt", "slides"))}, needles)
    job.qa["Q6_numbers_agree"] = {"pass": not stray, "stray_numbers": stray, "reference": "numbers the film prints (captions, foot templates, audits, example, sources)"}
    job.qa["Q10_honesty"] = {"pass": not miss, "missing_in": miss, "needle": job.copy["honestyLine"]}
    job.qa["eyes_on_checklist"] = {
        "Q1_thumb_stop": "reel/reel.cover.png, reel/stills/reel-1-*.jpg, carousel/slide-01.png, linkedin-pdf/pages/page-01.png — 3 people, 1 s on a phone",
        "Q2_one_second_read": "every slide and page at phone size: the headline or the number reads first",
        "Q4_muted_comprehension": "watch reel.9x16.mp4 and video.4x5.mp4 with sound off: does the cold-root check give the aha?",
        "Q5_swipe_logic": "carousel slide 1 asks, slide 5 counts, slide 8 names (L5), slide 9 asks one thing",
        "Q7_brand": f"one chrome ({job.chrome}) in every piece; the PO recognisable at 160 px (see frames.json)",
        "Q9_composition": "portrait frames re-composed (core/layout.js), not letterboxed: frames.json 4x5/9x16/1x1",
    }
    job.qa["fit_modules"] = job.TL["fit"]
    job.qa["summary"] = {c: verdict(v) for c, v in job.qa["channels"].items()}
    job.qa["summary"]["Q6"] = "PASS" if not stray else "FAIL"
    job.qa["summary"]["Q10"] = "PASS" if not miss else "FAIL"
    json.dump(job.qa, open(qpath, "w"), indent=1, ensure_ascii=False)
    json.dump({"plan": job.plan_path, "rules": "CHANNELS §4.1 time rules (channels/timeline.mjs)", "times": job.TL["frames"], "frames": job.frames},
              open(fpath, "w"), indent=1)
    if job._comp:
        job._comp.close()
    print(json.dumps(job.qa["summary"], indent=1))


if __name__ == "__main__":
    main()
