"""finish_mp4.py <film.html> <frames_dir> <out.mp4> [--workers 2] [--fps 30]
Fills any missing f%05d.jpg frames (render.py naming) with a watchdog renderer (per-seek timeout → relaunch), then
muxes the MP4 exactly as runtime/render.py does (libx264 crf 18 yuv420p, score WAV from __atelier.audio(), soft
mov_text captions + .srt). Workaround for render.py workers that deadlock after their first frame."""
import argparse, base64, os, subprocess, sys, time, json
from multiprocessing import Process
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "runtime", "tools"))
import render as R   # FLAGS, open_film, write_srt, save_dataurl

def work(html, out, items):
    from playwright.sync_api import sync_playwright
    todo = list(items)
    while todo:
        with sync_playwright() as pw:
            try:
                b, pg, info = R.open_film(pw, html, None)
            except Exception as e:
                print("boot failed, retry", str(e)[:60], flush=True); continue
            pg.set_default_timeout(45000)
            try:
                while todo:
                    t, name = todo[0]
                    pg.evaluate("async (t) => window.__atelier.seek(t)", t)
                    R.save_dataurl(pg.evaluate("([f]) => window.__atelier.capture(f, 0.93)", ["jpg"]), os.path.join(out, name))
                    todo.pop(0)
            except Exception as e:
                print("restart after", todo[0][0], str(e)[:80], flush=True)
            try: b.close()
            except Exception: pass

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("html"); ap.add_argument("frames"); ap.add_argument("mp4")
    ap.add_argument("--workers", type=int, default=2); ap.add_argument("--fps", type=float, default=30)
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b, pg, info = R.open_film(pw, a.html, None); wav = pg.evaluate("() => window.__atelier.audio()"); b.close()
    n = int(round(info["duration"] * a.fps)); os.makedirs(a.frames, exist_ok=True)
    missing = [(i / a.fps, f"f{i:05d}.jpg") for i in range(n) if not os.path.exists(os.path.join(a.frames, f"f{i:05d}.jpg"))]
    print("missing", len(missing), "of", n, flush=True)
    t0 = time.time()
    ps = [Process(target=work, args=(a.html, a.frames, missing[k::a.workers])) for k in range(a.workers)]
    [p.start() for p in ps]; [p.join() for p in ps]
    print("filled in", round(time.time() - t0, 1), "s", flush=True)
    base = os.path.splitext(a.mp4)[0]; wp = base + ".wav"; open(wp, "wb").write(base64.b64decode(wav))
    srt = base + ".srt"; ncap = R.write_srt(info["captions"], srt, 0, n / a.fps)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(a.fps), "-i", os.path.join(a.frames, "f%05d.jpg"), "-ss", "0.000", "-i", wp, "-i", srt,
           "-map", "0:v", "-map", "1:a", "-map", "2:s", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "medium",
           "-c:a", "aac", "-b:a", "160k", "-c:s", "mov_text", "-metadata:s:s:0", "language=eng", "-t", f"{n / a.fps:.3f}", "-movflags", "+faststart", a.mp4]
    r = subprocess.run(cmd, capture_output=True, text=True); print("ffmpeg", r.returncode, r.stderr[-300:])
    print(json.dumps({"mp4": a.mp4, "frames": n, "captions": ncap}))

if __name__ == "__main__":
    main()
