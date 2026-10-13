#!/usr/bin/env python3
"""ladder.py <frame.png> [<floor-only.png>]: the luminance ladder of a rendered frame, in % of sRGB code (luma = .2126 R + .7152 G + .0722 B of the
codes). bg = median of two corner patches; P50 / P99 / share above 70 %; marks = unsaturated pixels 10-40 % (P10 / P50 / P90); lit = saturated
pixels below 80 %; hero = pixels above 80 % (count, max). The floor-only frame (a variant at t = 0, nothing arrived) gives the pool peak.
Labels are masked (top right band, bottom left block). Needs Pillow and numpy."""
import sys, json
import numpy as np
from PIL import Image

def luma(a): return (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]) / 255.0

def box(x, k):
    c = np.cumsum(np.cumsum(np.pad(x, ((1, 0), (1, 0))), 0), 1); n = x.shape[0] - k + 1; m = x.shape[1] - k + 1
    return (c[k:k + n, k:k + m] - c[:n, k:k + m] - c[k:k + n, :m] + c[:n, :m]) / (k * k)

def mask(h, w):
    m = np.ones((h, w), bool); m[:int(0.13 * h), int(0.40 * w):] = False; m[int(0.74 * h):, :int(0.30 * w)] = False; return m

def main():
    a = np.array(Image.open(sys.argv[1]).convert('RGB')).astype(float); h, w, _ = a.shape
    L = luma(a); M = mask(h, w); mx = a.max(2); mn = a.min(2); sat = (mx - mn) / np.maximum(mx, 1)
    p = int(0.12 * h)
    bg = float(np.median(np.concatenate([L[p // 2:p, p // 2:p].ravel(), L[-p:-p // 2, -p:-p // 2].ravel()])))
    v = L[M]; r = {'bg': round(bg * 100, 1), 'p50': round(float(np.median(v)) * 100, 1), 'p99': round(float(np.percentile(v, 99)) * 100, 1), 'share_above_70': round(float((v > 0.70).mean()) * 100, 2)}
    light = bg > 0.5; lo, hi = (0.45, 0.85) if light else (0.10, 0.40)
    mk = M & (sat < 0.30) & (L > lo) & (L < hi) & (np.abs(L - bg) > 0.02)
    if mk.any(): q = np.percentile(L[mk], [10, 50, 90]) * 100; r['marks'] = {'p10': round(q[0], 1), 'p50': round(q[1], 1), 'p90': round(q[2], 1), 'share': round(float(mk[M].mean()) * 100, 2)}
    lit = M & (sat >= 0.35) & (L > 0.12) & (L < 0.80)
    if lit.any(): q = np.percentile(L[lit], [10, 50, 90]) * 100; r['lit'] = {'p10': round(q[0], 1), 'p50': round(q[1], 1), 'p90': round(q[2], 1), 'share': round(float(lit[M].mean()) * 100, 2)}
    hero = M & ((L < 0.15) & (sat < 0.30) if light else (L > 0.80)); r['hero'] = {'pixels': int(hero.sum()), 'share': round(float(hero[M].mean()) * 100, 3), ('min' if light else 'max'): round(float((L[hero].min() if light and hero.any() else L[M].max())) * 100, 1)}
    if len(sys.argv) > 2:
        f = np.array(Image.open(sys.argv[2]).convert('RGB')).astype(float); Lf = luma(f); Mf = mask(h, w)
        k = 61; s = box(np.where(Mf, Lf, np.nan_to_num(np.median(Lf[Mf]))), k); r['pool_peak'] = round(float(s.max()) * 100, 1); r['floor_corner'] = round(float(np.median(Lf[p // 2:p, p // 2:p])) * 100, 1)
    print(json.dumps(r))

main()
