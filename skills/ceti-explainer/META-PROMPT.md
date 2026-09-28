# META-PROMPT — the typed contract for one explainer episode

This file is the **λ-level meta-prompt** for the category *deterministic animated
technical explainer*. It is built with the method of Zhang, Yuan & Yao,
*Meta Prompting for AI Systems* (arXiv:2311.11482): a meta-prompt is an
**example-agnostic, typed structure** that says *how to think* about every
instance of a category, never *what to think* about one instance.

`SKILL.md` is the prose contract (read it once). This file is the same contract
as a **functor**: every slot of a brief maps to exactly one slot of a module,
and every binding rule maps to exactly one machine check. Nothing here is a
solved instance. The solved instances live in `briefs/*.brief.json` and
`reference/*.js`.

```
μ   noether-harness/assets/meta-meta-prompt.txt   generator of generators
λ   this file                                     the explainer category
·   briefs/<id>.brief.json  →  <id>.js  →  <Title>.html   one instance
```

Pipeline (each arrow is a program, not a vibe):

```
brief.json ──brief-gate──▶ scaffold ──author──▶ module.js ──gate──▶ build ──▶ Title.html
     ▲                                                   │
     └──────────────── edit script (RMP pass) ◀──────────┘
```

---

## 1. Category

**Category.** A ~40-second, 8-beat, single-diagram explainer of one technical
mechanism, rendered as a pure function of time on a fixed 1000×464 canvas, with
a persistent anchor, one working scene at a time, and a detail band that shows
its work.

**Free variables (change per instance).** topic · archetype · anchor · the
worked example and its numbers · the eight ideas · the aha · the sources ·
the motif family · the palette preset.

**Invariants (never change).** one clock · build-once/mutate-only · exactly 8
beats, 35–45 s, beat 8 = "Why it matters" · three zones · one lit scene per
region · no visible-block overlap · every on-screen figure derived in code and
asserted · token roles only · no hype · CETI voice.

A meta-prompt that only fits one topic has overfit. Test any change to this
file against the four reference archetypes (`self-attention` derivation,
`oauth` process, `tcp` state machine, `binary-search` code trace) and the
course instance (`sheaf-glue` transformation) before committing it.

---

## 2. Typed slots

The schema is `briefs/brief.schema.json`. The types below are the contract.

```xml
<episode_schema>

  <input name="Brief" type="json{brief.schema.json}">
    <slot name="id"            type="kebab-case"/>
    <slot name="title"         type="str"/>
    <slot name="eyebrow"       type="str · 'Series · NN'"/>
    <slot name="tag"           type="str ≤ 38 chars · real sizes / names / year"/>
    <slot name="audience"      type="{ who: str, leaves_knowing: str }"/>
    <slot name="archetype"     type="enum{derivation, process, code, state, transformation, comparison}"/>
    <slot name="critique_of_obvious" type="str · why the static diagram fails"/>
    <slot name="mechanism"     type="str · 2–4 sentences, plain mechanism"/>
    <slot name="anchor"        type="{ what: str, motif: str, zone: 'anchor' }"/>
    <slot name="worked_example" type="{ inputs: json, derivation: str, expected: json, abstraction_note?: str }"/>
    <slot name="detail_band"   type="enum{worked_math, payload, trace, count, terms}"/>
    <slot name="beats"         type="list[Beat] · length 8"/>
    <slot name="aha"           type="str ≥ 40 chars · becomes meta.synthesis"/>
    <slot name="lede"          type="html · one italic word"/>
    <slot name="refs"          type="list[{ title: str, url?: str, year?: int }] · ≥ 1"/>
    <slot name="conserved"     type="{ motif: str, claims: list[Claim], duration_s: number }"/>
  </input>

  <type name="Beat">
    <slot name="id"            type="kebab-case · unique"/>
    <slot name="label"         type="str ≤ 18 chars (chapter rail)"/>
    <slot name="dur"           type="seconds · 2–8"/>
    <slot name="caption"       type="str ≤ 118 chars · the spoken idea, one sentence"/>
    <slot name="idea"          type="str · exactly one idea this beat adds"/>
    <slot name="focal_motion"  type="str · the ONE thing that moves"/>
    <slot name="region"        type="enum{anchor, working, detail}"/>
    <slot name="claims"        type="list[Claim.id] · which conserved claims this beat carries"/>
    <slot name="reuses"        type="list[Beat.id] · beat 8 only: what it re-lights"/>
  </type>

  <type name="Claim">
    <slot name="id"     type="kebab-case"/>
    <slot name="text"   type="str · a true sentence"/>
    <slot name="ref"    type="int · index into refs"/>
  </type>

  <intermediate name="Geometry"  type="{ VW: 1000, VH: 464, anchor_y: [34,124], working_y: [130,292], detail_y: [300,456] }"/>
  <intermediate name="SceneSet"  type="list[{ region, beat_window: [start,end], group: <g> }]"/>
  <intermediate name="Windows"   type="map[Beat.id → { start, end, index }]  (computed by the engine)"/>

  <output name="Module" type="js">
    <slot name="meta"       type="{ id, eyebrow, title, lede, synthTitle, tag, synthesis }"/>
    <slot name="beats"      type="list[{ id, label, dur, caption }] · length 8"/>
    <slot name="build"      type="(stage, { beats, duration, ex }) → void · creates every node once"/>
    <slot name="render"     type="(t, ctx) → void · pure mutation from t"/>
    <slot name="setMath"    type="(on: bool) → void"/>
    <slot name="__AUDIT"    type="() → { ok: bool, msg?, note? } · recomputes expected from inputs"/>
    <slot name="__REGIONS"  type="() → { working: list[g], detail: list[g] }"/>
    <slot name="__LAYOUT"   type="() → list[g]"/>
  </output>

  <output name="Artifact" type="html · single file · offline"/>
  <output name="GateReport" type="text · 'PASS · …' or 'FAIL: …'"/>

</episode_schema>
```

---

## 3. The functor — brief slot → module slot

Every brief slot lands in exactly one place. `assets/scaffold.mjs` performs the
mechanical part of this map; the author performs the rest.

| Brief slot | Module slot | Who |
|---|---|---|
| `id, title, eyebrow, tag, lede` | `meta.*` | scaffold |
| `aha` | `meta.synthesis` | scaffold |
| `beats[i].{id,label,dur,caption}` | `beats[i]` | scaffold |
| `worked_example.inputs` | `const INPUTS` (immutable) | scaffold |
| `worked_example.expected` | `const EXPECTED` (asserted, never displayed) | scaffold |
| `worked_example.derivation` | `DERIVED = f(INPUTS)` — code the author writes | author |
| `anchor` | the one `<g>` built in beat 1 and never destroyed | author |
| `beats[i].focal_motion` | the single `ex.ramp/win/seg` that dominates beat i | author |
| `beats[i].region` | which zone that beat's scene group lives in | author |
| `detail_band` | the lower-third scenes, gated by `flags.math` | author |
| `beats[7].reuses` | what `render` re-lights in beat 8 | author |
| `conserved.motif` | the visual family of every scene | author |
| `refs` | `meta.tag` carries the real name / size / year | scaffold |

A resolved slot is **immutable downstream**. `INPUTS` never change after the
brief passes; on-screen numbers are read from `DERIVED`, never from `EXPECTED`
and never typed by hand. The only named morphism that may change a resolved
slot is an **edit script** (§6).

---

## 4. Procedure — how to think, in order

This is the Propose → Tailor → Commit → Meta loop of `noether-harness`,
specialised to one episode.

1. **Propose (brief).** Fill every slot of `Brief`. Do the research first:
   real mechanism, real numbers, real sources. Name the archetype. Name the
   anchor. Write the eight ideas so each beat adds exactly one. Write the aha.
   Run `node assets/brief-gate.mjs briefs/<id>.brief.json`. Nothing else
   starts until it prints PASS.
2. **Scaffold.** `node assets/scaffold.mjs briefs/<id>.brief.json -o <id>.js`.
   The module now carries the brief's immutable slots and a failing `__AUDIT`
   that names what is still owed.
3. **Tailor (author).** In this order, and only this order:
   1. `DERIVED` — implement `worked_example.derivation` in code.
   2. Anchor — build it; it is the only thing on screen for beat 1.
   3. Scenes — one `<g>` per (beat, region); everything starts at opacity 0.
   4. `render` — one focal motion per beat; same-region hand-offs use `ex.seg`.
   5. Beat 8 — re-light what `reuses` names; add no new layout.
   6. `__REGIONS`, `__LAYOUT` — expose every scene group and block.
4. **Gate.** `node assets/gate.mjs <id>.js` must print PASS. Then snapshot the
   middle of every beat and the 7→8 boundary.
5. **Commit.** `python3 assets/build.py <id>.js "<Title>" [--preset …]`.
   Open it. Autoplay → end → replay. Scrub to five random `t`. Tweaks work.
6. **Meta (refine).** Run §6 until the edit script is empty.

If the category is better served by a program than by prose, say so: the
worked example **is** a program (`DERIVED`), which is why it can be asserted.

---

## 5. Binding rules → machine checks

A rule that no program checks is a wish. Every rule below names its checker.

| # | Rule | Checked by |
|---|---|---|
| B1 | Exactly 8 beats; durations sum to 35–45 s | brief-gate, gate |
| B2 | Beat 8 label is exactly "Why it matters" and `reuses` ≥ 1 earlier beat | brief-gate (label, reuses), gate (label) |
| B3 | Beat 1 lives in the anchor region; the anchor persists to `t = duration` | brief-gate (region), snapshot at `t = duration` |
| B4 | One idea, one focal motion per beat | brief-gate (fields present, single sentence) |
| B5 | Captions ≤ 118 chars, labels ≤ 18, tag ≤ 38 | brief-gate, gate §15a |
| B6 | `worked_example.expected` is derived in code, not typed | scaffold (`EXPECTED` only reachable from `__AUDIT`), gate (`__AUDIT`) |
| B7 | One lit scene per region at every instant | gate §15b via `__REGIONS` |
| B8 | No two visible blocks overlap at any instant | gate §15d via `__LAYOUT`, browser auditor |
| B9 | `render` is pure in `t`; no timers, no observers | gate timeline sweep (crash + NaN), code review |
| B10 | Token roles only, no raw hex inside the diagram | `grep -E '#[0-9a-fA-F]{3,6}' <id>.js` must be empty |
| B11 | No hype words, no emoji, CETI voice | brief-gate (wordlist + emoji scan) |
| B12 | Every conserved claim is carried by ≥ 1 beat and cites a ref | brief-gate (Φ: claims) |
| B13 | One motif family: `anchor.motif == conserved.motif` | brief-gate (Φ: motif) |
| B14 | `conserved.duration_s == Σ beats.dur` | brief-gate (Φ: duration) |
| B15 | Every scene carries an eyebrow label; no SVG text < 11 px | snapshot review, `grep 'font-size": *(9|10)\b'` |

Rules B12–B14 are the **sheaf-glue Φ** of `noether-harness`: motif ∧ claims ∧
duration. A brief that fails Φ is not repaired by a new aesthetic; it is
repaired by restricting a slot (`sheaf-repair`: fewer claims, a shorter cut).

---

## 6. Recursive refinement — the edit-script monad

Do not ship the first draft. Each pass appends an **edit script** to
`briefs/<id>.edits.md`. The log is the Writer monad: nested passes flatten into
one linear trace, so the history says exactly why every slot has its value.

**One pass:**

1. Run brief-gate and gate. Copy the first failing line verbatim.
2. Critique against the category, not the instance. Ask, in order:
   - **Leaked instance?** Did a specific number get typed on screen instead of derived?
   - **Untyped slot?** A beat with two ideas, a scene with no eyebrow, a tag with no real name.
   - **Unbound slot?** A claim no beat carries; a beat that carries nothing; an anchor that vanishes.
   - **Uncheckable?** A rule you added that no program in §5 checks.
   - **Last beat?** Did beat 8 invent layout instead of re-lighting `reuses`?
   - **Sibling test.** Would this change still be right for a process episode? a state machine?
3. Write the edit script (format below). Apply it. Re-run the gates.
4. Stop at a **fixpoint**: a pass whose edit script is empty and whose gates PASS.
   Typical depth is 3–5 passes.

**Edit script format** (append; never rewrite earlier passes):

```
## pass N · <date>
gate:      PASS | FAIL — <first failing assertion, verbatim>
critique:  leaked-instance | untyped | unbound | uncheckable | last-beat | sibling | none
edits:
  1. <slot path> ← <new value or change>        (why)
  2. …
fixpoint:  yes | no
```

When an edit changes **this file** rather than an instance, it is a Meta move
on the λ level: record it in `briefs/_META.edits.md` and re-test against all
five instances before committing.

---

## 7. Category-completeness test

Before a change to this file lands, walk one instance of each archetype
through §2–§5 on paper and confirm no slot is missing and no rule is
instance-specific:

| Archetype | Anchor | Working motion | Detail band | Reference |
|---|---|---|---|---|
| derivation | inputs (token row, doc shelf) | values → scores → bars | worked_math | `reference/self-attention.js` |
| process | endpoints + channel | a packet per stage | payload | `reference/oauth.js` |
| state | the state graph | the lit node, the taken edge | trace | `reference/tcp.js` |
| code | the code block / stack | the active line | trace | `reference/binary-search.js` |
| transformation | source shape | A morphs to B | terms / count | `briefs/sheaf-glue.brief.json` |
| comparison | two columns | same input down both | count | — (open) |

The comparison row has no reference yet. The first comparison episode must
also serve as its test.

---

## 8. Voice, restated as rules

Warm, not cheerful. Confident, not loud. "You", not "users". One italic word
per title. Captions are the spoken idea: one plain sentence per beat, the
diagram does the showing. Concrete beats grandiose. Banned: unlock,
supercharge, revolutionize, powerful, seamless, game-changing, unleash,
cutting-edge, magic. The brief gate enforces the list; taste enforces the rest.
