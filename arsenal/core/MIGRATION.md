# Migrating a factory film from seg()/ease()/T tables to core/timeline.js

Today (e.g. factory/films/survivorship/film.js): `seg(t,a,b)` is a clamped linear ramp, `ease()` is inout-cubic, and
every window is a literal pair of seconds scattered through render(). Retiming means editing ~60 numbers by hand.

| In film.js today | With the core |
|---|---|
| `seg(t,a,b)` | `track(k,[{t:a,v:0,ease:'linear'},{t:b,v:1}]).at(t)` |
| `ease(seg(t,a,b))` | same with `ease:'inout'` (identical to kit ease(); verified to 1e-9) |
| `seg(t,a,a+.4)*(1-seg(t,b-.35,b))` (fade in/out) | 4 keyframes: 0, 1, 1, 0 at a, a+.4, b-.35, b |
| `lerp(1,.45,seg(t,44,45))` | `{t:44,v:1},{t:45,v:.45}` |
| `seg(t, 0.4+i*.04, 0.55+i*.04)` in a loop | `tl.stagger(n, .04, (i,t)=>t.play('sq.'+i,1,.15))` |
| F.commit.at, F.chapters, F.captions times | `tl.beat(name, caption)`; `c.beatTime('commit')`, `c.captions()` |
| `if (t>=16 && t<36)` scene gates | `scene(t0,t1,fn,{fade})` with t0, t1 from `c.beatTime(...)` |

Steps
1. Add `<script src="arsenal/core/timeline.js">` before film.js; at load build `const c = timeline()....compile()` once
   (setup, not render). Keep render(t) pure: it only calls `c.at(key, t)`.
2. Author one beat per film.json chapter: `tl.beat('hook')`, `tl.beat('commit')`... then express every window as a
   play/wait/all/stagger relative to the beat cursor. Move times out of render(); render reads values by key.
3. Replace each `seg()` expression with a lookup of the same value; run the gate. Digits and claims must not move:
   the timeline changes motion, never the truth (INTERVIEW Q7). Compare film stills before and after.
4. Commit moments that a claim depends on (reveal of a number) stay as beats: `c.beatTime('commit')` is the single
   source for film.json `commit.at` and for the ledger rows (`F.ledger.filter(r => t >= r[0])`).
5. Colour tweens: use `colorMode` per track (oklab for accent shifts) with token roles; no hex in film.js.
6. Re-timing a film (75 s case to 40 s episode) becomes a second recipe over the same channel names; render() is
   untouched, as in patterns/timeline where one scene takes three recipes.
