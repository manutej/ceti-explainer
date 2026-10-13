# generator · generator-authored scenes

**What it is for.** Writing a scene as prose (`yield* tween`, `yield wait`, `yield* all`) in the style of Motion Canvas
and Revideo, while keeping seek cheap: the generator runs once in `setup()`, a virtual cursor turns each tween into an
absolute interval, and `draw` calls `compiled.at(t)`, a binary-search lookup (pure function of t). The demo hands a packet
along n nodes, authored three ways. Module: `arsenal/core/generator.js`.

**When NOT to use.** One-off easings (use a track tween directly, [[timeline-builder]]); anything whose timing depends
on runtime input or physics (a generator is a fixed script); the same property tweened by two parallel branches.

## Params
- `author` sequence | cascade | relay; `layout` row | ring; `n` 3..8 nodes; `hop_s` 0.3..1.5 s per hop; `dur` 8 s
  (the scene is padded to at least `dur`); `seed` (unused, nothing is drawn at random).

## Core API (generator.js)
`scene(genFn, {init, dur})` -> `{dur, end, labels, stats, at(t), value(target, prop, t)}`. Vocabulary: `tween(target,
{prop: to}, dur, ease)`, `set`, `wait(s)` (yield it), `label(name)`, `all(...)`, `stagger(gap, ...)`, `delay`,
`sequence`. Values: numbers, number arrays, `#rrggbb`. Eases: linear, inCubic, outCubic, inOutCubic, outExpo, outBack.

## Variants
- **sequence**: strictly sequential tweens and waits, one beat at a time; 5 nodes in a row.
- **cascade**: `all()` and `stagger()` overlap beats; links draw while the packet travels; 4 nodes.
- **relay**: for-loop out and back with control flow, then a staggered close and pulse; 6 nodes on a ring.

## Atlas
[[generator-scenes]] (compile, then seek the schedule; yields only pace authoring) S311, S321; [[timeline-builder]]
(the cursor is the clock); [[pure-function-of-t]].

## Pitfalls
- Yields do not time anything; the cursor does. Never read `Date`/`Math.random` in a scene.
- `from` is resolved at compile time from the track's value at the cursor, so reorder branches carefully inside `all`.
- Declare every animated value in `init` (the compiled `at()` clones that graph); a missing prop has no track.
- Compare to true generator semantics (replay per seek): rejected, O(t) per frame.

## Cost
Measured at 960x540, density 2: draw 7.5 ms/frame (shoot.mjs). Export: 0.14-0.17 s/frame (PNG screenshot dominates),
8 s at 30 fps = 240 frames in ~35-40 s, plus MP4 10-15 s and GIF 5-10 s. Compile: sub-millisecond.

## Renderer / fallback
p2d only; no beta APIs. No fallback needed.
