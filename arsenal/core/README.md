# arsenal/core/timeline.js · the authoring core

Pure of t (no Math.random, Date, frameCount, millis). Load before any pattern: `<script src="core/timeline.js">`.
Exposes `ARSENAL.core.timeline` (and `module.exports` under node). Atlas: [[track-tween]] [[timeline-builder]]
[[scene-local-time]] [[beats-and-captions]] [[generator-scenes]].

## track(key, keyframes, {colorMode})
`track('x', [{t:0, v:0}, {t:2, v:100, ease:'out'}, {t:3, v:40}])` -> `{at(t), intervals(), segs, duration}`.
The ease on a keyframe governs the segment LEAVING it. Before the first key it holds the first value; after the
last it holds the last. Values are numbers or colours ('#hex', 'rgba()'); never mixed on one track.
Eases: linear smooth in out inout expo back step, or any u->u function. `inout` equals the factory kit's ease().
Colours: `colorMode` 'rgb' | 'hsl' | 'oklab' is fixed per track at compile time, then lerped in that space
(returns an `rgba()` string). Pass token roles (tokens.color.muted), never literals.

## timeline() -> builder, compiled once
```js
const tl = timeline().init({ title: 0, hl: tokens.color.muted }).colorMode('hl', 'oklab');
tl.play('title', 1, 0.7, 'out')            // play(key, to, dur=1, ease='smooth', {from}); starts from the live value
  .wait(0.3)                               // wait(s)
  .beat('count', 'Count them.')            // beat(name, caption) records the cursor
  .all(t => t.play('a', 1, 1), t => t.play('b', 1, 2))                 // parallel; cursor = latest end
  .stagger(16, 0.2, (i, t) => t.play('dot.' + i, 1, 0.5), {order:'center'});  // order: start | end | center
const c = tl.compile();                    // frozen; any later builder call recompiles
c.at('title', t)  c.values(t)  c.duration  c.beats  c.beatTime('count')  c.intervals(key)  c.captions()
```
`play({a:1, b:2}, dur, ease)` animates several keys together. Overlapping plays on one key: the latest-started wins.
Seeking is a binary search over absolute intervals, never a replay. `tl.at(key, t)` compiles lazily.

## scene(t0, t1, fn, {fade, fadeIn, fadeOut, hold}) / sequence(specs, {fade}) / scenes(list)
`fn(frame, ...args)` with `frame = {t: local seconds, dur, u: t/dur, a: cross-fade alpha}`. Overlap neighbouring
windows by their fade to cross-fade; `hold` keeps the last scene on after t1. `sequence([{dur, fn}], {fade})` lays
scenes end to end with overlap; `scenes([...])` runs an explicit list (windows from beat times). `.run(t, host, ...args)`
calls `host.enter(frame)` / `host.exit(frame)` around each active scene (p5: save/globalAlpha, restore).

## captions(list, {fade=0.3, end}) -> f(t) -> {text, a, i, local} | null
`captions([{t, text, end?}])`; the latest entry at or before t owns the screen and fades in; `compiled.captions()` builds
the list from beats that carry text. Draw after the scene, outside any scene alpha.

## Demo and checks
`patterns/timeline/` re-times one scene three ways with no scene-code change. Migration: core/MIGRATION.md.
