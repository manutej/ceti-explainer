#!/usr/bin/env python3
"""
render.py — frame workers for Atelier films (Playwright/Chromium, SwiftShader WebGL).

    python3 render.py <film.html> --out <dir> [--fps 30] [--from S --to E] [--stills t1,t2,..]
                      [--workers 2] [--format jpg|png] [--w 960]
                      [--mp4 film.mp4] [--burn] [--upscale 1280] [--sheet sheet.jpg]

Each worker opens <film.html>?film=1&w=W (chromeless, exact render size), awaits __atelier.ready, then for each
frame i calls __atelier.seek(i/fps) and captures the canvas pixels (canvas.toDataURL — WEBGL keeps its drawing
buffer). Frames are sharded across workers (interleaved). Time is set, never observed.

--mp4 stitches frames with ffmpeg (libx264, yuv420p, crf 18), muxes the score from __atelier.audio() (offline
WebAudio → WAV) and the captions as a soft subtitle track (an .srt is written next to the MP4; --burn burns them).
--sheet writes a labelled contact sheet of the stills.
"""
import argparse, base64, json, os, subprocess, sys, time
from multiprocessing import Process, Queue

FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist",
         "--disable-gpu-vsync", "--disable-frame-rate-limit", "--font-render-hinting=none", "--autoplay-policy=no-user-gesture-required"]


def film_url(html, w=None):
    q = "?film=1" + (f"&w={w}" if w else "")
    return "file://" + os.path.abspath(html) + q


def open_film(pw, html, w=None, errs=None):
    b = pw.chromium.launch(args=FLAGS)
    pg = b.new_page(viewport={"width": 640, "height": 360}, device_scale_factor=1)
    if errs is not None:
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.on("console", lambda m: m.type == "error" and errs.append(f"console: {m.text}"))
    pg.goto(film_url(html, w))
    pg.wait_for_function("window.__atelier !== undefined", timeout=60000)
    pg.evaluate("() => window.__atelier.ready")
    info = pg.evaluate("() => window.__atelier.info()")
    pg.set_viewport_size({"width": info["size"][0], "height": info["size"][1]})
    return b, pg, info


def save_dataurl(url, path):
    with open(path, "wb") as f:
        f.write(base64.b64decode(url.split(",", 1)[1]))


def worker(idx, html, out, times, names, w, fmt, q):
    from playwright.sync_api import sync_playwright
    errs, t0 = [], time.time()
    with sync_playwright() as pw:
        b, pg, info = open_film(pw, html, w, errs)
        t1 = time.time()
        for t, name in zip(times, names):
            r = pg.evaluate("async (t) => window.__atelier.seek(t)", t)
            url = pg.evaluate("([f]) => window.__atelier.capture(f, 0.93)", [fmt])
            save_dataurl(url, os.path.join(out, name))
        viol = pg.evaluate("() => window.__atelier.violations.slice(0, 5)")
        errs += [f"clock-law: {v}" for v in viol]
        b.close()
    q.put({"worker": idx, "frames": len(times), "boot_s": round(t1 - t0, 2), "render_s": round(time.time() - t1, 2), "errors": errs[:8]})


def get_info_and_audio(html, w, want_audio):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b, pg, info = open_film(pw, html, w)
        wav = pg.evaluate("() => window.__atelier.audio()") if want_audio else None
        b.close()
    return info, wav


def srt_time(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{sec:02d},{ms:03d}"


def write_srt(caps, path, t0=0.0, t1=1e9):
    n, lines = 0, []
    for c in caps:
        a, b = max(c["t0"], t0), min(c["t1"], t1)
        if b <= a:
            continue
        n += 1
        lines += [str(n), f"{srt_time(a - t0)} --> {srt_time(b - t0)}", c["text"], ""]
    open(path, "w", encoding="utf-8").write("\n".join(lines))
    return n


HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, "..", "..", "vendor", "fonts")   # <root>/vendor/fonts (merged layout)
_TTF_DIR = None


def vendor_ttf_dir():
    """Space Mono 400 and DM Sans 400 from vendor/fonts as TTF in a temp dir (Pillow and libass want sfnt files).
    Returns None when the vendored fonts or fontTools are missing (callers fall back to DejaVu)."""
    global _TTF_DIR
    if _TTF_DIR is not None:
        return _TTF_DIR or None
    _TTF_DIR = ""
    try:
        import tempfile
        from fontTools.ttLib import TTFont
        d = tempfile.mkdtemp(prefix="atelier-fonts-")
        for fn in ("space-mono-latin-400-normal.woff2", "dm-sans-latin-400-normal.woff2"):
            f = TTFont(os.path.join(FONT_DIR, fn), recalcTimestamp=False); f.flavor = None
            f.save(os.path.join(d, fn.replace(".woff2", ".ttf")))
        _TTF_DIR = d
    except Exception:
        pass
    return _TTF_DIR or None


def contact_sheet(paths, labels, out, cols=None):
    from PIL import Image, ImageDraw, ImageFont
    ims = [Image.open(p).convert("RGB") for p in paths]
    tw = 480; th = round(ims[0].height * tw / ims[0].width)
    cols = cols or min(3, len(ims)); rows = -(-len(ims) // cols); pad, lab = 12, 26
    sheet = Image.new("RGB", (cols * (tw + pad) + pad, rows * (th + lab + pad) + pad), (14, 16, 20))
    d = ImageDraw.Draw(sheet)
    font = None
    for fp in ([os.path.join(vendor_ttf_dir(), "space-mono-latin-400-normal.ttf")] if vendor_ttf_dir() else []) + [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"]:
        try:
            font = ImageFont.truetype(fp, 14); break
        except Exception:
            pass
    font = font or ImageFont.load_default()
    for i, (im, lb) in enumerate(zip(ims, labels)):
        x = pad + (i % cols) * (tw + pad); y = pad + (i // cols) * (th + lab + pad)
        sheet.paste(im.resize((tw, th), Image.LANCZOS), (x, y + lab))
        d.text((x, y + 5), lb, fill=(163, 154, 137), font=font)
    sheet.save(out, quality=92)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html"); ap.add_argument("--out", required=True)
    ap.add_argument("--fps", type=float, default=30)
    ap.add_argument("--from", dest="t0", type=float, default=0.0)
    ap.add_argument("--to", dest="t1", type=float, default=None)
    ap.add_argument("--stills", default=None)
    ap.add_argument("--workers", type=int, default=2)
    ap.add_argument("--format", choices=["jpg", "png"], default=None)
    ap.add_argument("--w", type=int, default=None, help="render width (height keeps the film's aspect)")
    ap.add_argument("--mp4", default=None); ap.add_argument("--burn", action="store_true")
    ap.add_argument("--upscale", type=int, default=None, help="lanczos upscale width for the MP4")
    ap.add_argument("--no-audio", action="store_true")
    ap.add_argument("--sheet", default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    fmt = a.format or ("png" if a.stills else "jpg")

    info, wav = get_info_and_audio(a.html, a.w, bool(a.mp4) and not a.no_audio)
    dur = info["duration"]
    if a.stills:
        times = [float(x) for x in a.stills.split(",")]
        names = [f"t_{x:06.2f}.{fmt}" for x in times]
    else:
        t1 = dur if a.t1 is None else min(a.t1, dur)
        n0, n1 = int(round(a.t0 * a.fps)), int(round(t1 * a.fps))
        times = [i / a.fps for i in range(n0, n1)]
        names = [f"f{i - n0:05d}.{fmt}" for i in range(n0, n1)]

    k = max(1, min(a.workers, len(times)))
    q, procs, wall = Queue(), [], time.time()
    for wi in range(k):
        pr = Process(target=worker, args=(wi, a.html, a.out, times[wi::k], names[wi::k], a.w, fmt, q)); pr.start(); procs.append(pr)
    # watchdog: a stalled SwiftShader worker must not hang the render — collect with a timeout, then re-render
    # whatever frames are missing in a fresh worker (up to 2 rescue passes)
    import queue as _queue
    budget = 120 + 30 * (len(times) // k + 1)
    reps, t_end = [], time.time() + budget
    while len(reps) < len(procs) and time.time() < t_end:
        try: reps.append(q.get(timeout=5))
        except _queue.Empty: pass
        if all(not pr.is_alive() for pr in procs) and q.empty(): break
    for pr in procs:
        pr.join(timeout=2)
        if pr.is_alive(): pr.terminate()
    for rescue in range(2):
        miss = [(t, n) for t, n in zip(times, names) if not os.path.exists(os.path.join(a.out, n))]
        if not miss: break
        print(f"[render] rescue pass {rescue + 1}: {len(miss)} missing frames", file=sys.stderr)
        rq = Queue(); pr = Process(target=worker, args=(90 + rescue, a.html, a.out, [m[0] for m in miss], [m[1] for m in miss], a.w, fmt, rq)); pr.start()
        try: reps.append(rq.get(timeout=120 + 30 * len(miss)))
        except _queue.Empty: pass
        pr.join(timeout=2)
        if pr.is_alive(): pr.terminate()
    still_missing = [n for n in names if not os.path.exists(os.path.join(a.out, n))]
    reps = sorted(reps, key=lambda r: r["worker"]) or [{"worker": 0, "render_s": 0, "errors": ["no worker reported"], "boot_s": 0}]
    wall = time.time() - wall
    render_s = max(r["render_s"] for r in reps)
    errs = [e for r in reps for e in r["errors"]]
    if still_missing:   # after the rescue passes: report the gap and refuse to mux (ffmpeg would stop at the first gap)
        errs.append(f"{len(still_missing)} frame(s) still missing after rescue, first {still_missing[0]}")
    summary = {"html": a.html, "film": info["id"], "renderer": info["renderer"], "size": info["size"], "frames": len(times), "workers": k,
               "wall_s": round(wall, 1), "render_s": render_s, "s_per_frame_wall": round(render_s / max(1, len(times)), 3),
               "s_per_frame_per_worker": round(sum(r["render_s"] for r in reps) / max(1, len(times)), 3),
               "boot_s": [r["boot_s"] for r in reps], "errors": errs, "missing": len(still_missing)}

    if a.mp4 and a.stills:
        print("[render] --mp4 is ignored with --stills (render a frame range for an MP4)", file=sys.stderr)
    if a.mp4 and not a.stills and still_missing:
        print(f"[render] not muxing {a.mp4}: {len(still_missing)} frame(s) missing", file=sys.stderr)
        a.mp4 = None

    if a.mp4 and not a.stills:
        base = os.path.splitext(a.mp4)[0]
        cmd = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(a.fps), "-i", os.path.join(a.out, f"f%05d.{fmt}")]
        n_in = 1
        if wav:
            wp = base + ".wav"; open(wp, "wb").write(base64.b64decode(wav))
            cmd += ["-ss", f"{a.t0:.3f}", "-i", wp]; n_in += 1
        t_end = times[-1] + 1 / a.fps if times else 0
        srt = base + ".srt"; ncap = write_srt(info["captions"], srt, a.t0, t_end)
        vf = []
        if a.upscale:
            vf.append(f"scale={a.upscale}:-2:flags=lanczos")
        if a.burn and ncap:
            fd = vendor_ttf_dir()   # burn with the bundled DM Sans when available (else the system DejaVu Sans)
            fam, fdir = ("DM Sans", f":fontsdir={fd}") if fd else ("DejaVu Sans", "")
            vf.append(f"subtitles={srt}{fdir}:force_style='FontName={fam},FontSize=18,BorderStyle=3,Outline=1,Shadow=0,BackColour=&H700E1014'")
        if ncap and not a.burn:
            cmd += ["-i", srt]
        cmd += ["-map", "0:v"] + (["-map", "1:a"] if wav else []) + (["-map", f"{n_in}:s"] if ncap and not a.burn else [])
        if vf:
            cmd += ["-vf", ",".join(vf)]
        cmd += ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium"]
        if wav:
            cmd += ["-c:a", "aac", "-b:a", "160k"]
        if ncap and not a.burn:
            cmd += ["-c:s", "mov_text", "-metadata:s:s:0", "language=eng"]
        cmd += ["-t", f"{len(times) / a.fps:.3f}", "-movflags", "+faststart", a.mp4]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode:
            errs.append("ffmpeg: " + r.stderr[-400:])
        summary["mp4"] = a.mp4; summary["audio"] = bool(wav); summary["captions"] = ncap

    if a.sheet and a.stills:
        contact_sheet([os.path.join(a.out, n) for n in names], [f"{info['id']}  t={t:.2f}s" for t in times], a.sheet)
        summary["sheet"] = a.sheet

    json.dump(summary, open(os.path.join(a.out, "render.json"), "w"), indent=2)
    print(json.dumps(summary, indent=2))
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
