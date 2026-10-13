# archive/eval/ — frame-level evaluation of episodes

Turns an episode into a corpus you can measure. See `HANDOFF-JEV-EVAL.md` (beside this file) for the
workstreams, the question design rules, and the anti-pattern registry.

## `frame-items.mjs`

One Jev item per frame, sampled on the episode's own clock — beat midpoints, so no item
straddles a transition.

```bash
cd skills/ceti-explainer
node ../../eval/frame-items.mjs reference/self-attention.js /tmp/sa.items.json      # 8 items
node ../../eval/frame-items.mjs reference/self-attention.js /tmp/sa.items.json 3    # 24 items
```

Each item is `{ id, state: { t, beatIndex, beatLabel, caption, visibleText } }` —
`itemsFile`-shaped for `JEV-works/kit/run.ts`.

Verified 2026-10-05, Node v22.23.2: all four references (`self-attention`, `oauth`, `tcp`,
`binary-search`) gate PASS and yield 8 items each.

## What does NOT belong here

Geometry, overlap, type size and palette are **deterministic** and already gated by
`skills/ceti-explainer/assets/gate.mjs`. Do not re-ask a model what the gate proves — see
`HANDOFF-JEV-EVAL.md` §2.1 and `JEV-works` LESSONS.md L3.

`visibleText` is a *text projection* of the frame. Jev cannot see the frame, so questions
that implicitly need pixels will come back confident and useless (L5).
