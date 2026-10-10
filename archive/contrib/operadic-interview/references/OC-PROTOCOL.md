# OC-PROTOCOL — filling slots, composing upward, and surfacing disagreements

The instrument only pays off in this phase: respondents talk in streams, the tree turns the
stream into evidence, and the consistency machinery turns evidence into findings. Grounding:
the operadic-consistency result (composed-vs-collapsed agreement as a label-free quality
signal) applied to a human respondent — the "model" being checked is the person, and
disagreement is treasure, not error.

## 1. FILL — parsing free speech into slots

- **Quote, don't paraphrase.** Put the respondent's words in the slot; add a bracketed gloss
  only if needed. Their vocabulary is data (it names their true categories).
- **Tag inferences.** An answer placed in a slot the respondent didn't explicitly address is
  marked `[inferred from: …]`. Untagged inference is the protocol's cardinal sin — it
  manufactures agreement that will later validate itself.
- **Never pad.** Empty slots stay empty. A slot filled with plausible invention poisons every
  compose step above it.
- **One answer can fill many slots** (a good story often hits three probes at once) — place it
  everywhere it lands, quoting the relevant fragment per slot.
- **Show the filled tree back** before composing, so the respondent corrects placements. This
  is cheap and prevents the expensive failure (composing on a mis-filed answer).

## 2. COMPOSE — carrying answers upward

Apply each subtree's stated compose rule, leaf → parent → root, writing the composition down
as you go: parent slot gets `[composed: rule → result, from Q_x.y, Q_x.z]`. Every step must be
auditable — a reader should be able to re-derive the root from the leaves and the rules alone.

**Auto-collapse rule:** an unanswered branch contributes nothing; its parent's value is
whatever was answered at or above it. A subtree with no answers at any depth is reported as
`unvalued` — never defaulted, never guessed.

**Coverage note per subtree:** which slots were answered, which ★ were hit. Low coverage with
high confidence is a contradiction; say so.

## 3. CHECK — composed vs. collapsed, at every node where both exist

Wherever a node holds BOTH a direct (collapsed) answer and a composed-from-children answer:

- **Agree** → confidence rises; record the agreement (it is evidence, not just absence of
  a problem).
- **Disagree** → a FINDING, never a silent resolution. Format:

```
FINDING @ node
  collapsed : "<their direct words>"
  composed  : <rule> over <children> → <result>
  gap hypothesis : one sentence on what could explain it (recency bias, aspiration vs.
                   behavior, a mis-filed quote, a missing child question)
  back to respondent : one question that would resolve it
```

Return findings to the respondent as questions, not verdicts ("your gut said X; your
details point at Y — which is wrong, the gut or the details?"). Both answers are theirs;
the protocol has no authority to prefer either.

**Root check (always, at the end):** after composing the root from everything, re-ask the
respondent the root question cold, one line. Composed-vs-cold-root is the cheapest full-tree
consistency check available — two valuations of the whole instrument for the price of one
extra question.

## 4. VALUATE — the same tree in other currencies (optional)

The filled tree supports re-valuation without re-asking anything:

- **Confidence** — per-slot confidence (explicit hedges lower it; episode detail raises it),
  composed by weakest-link (min) along each subtree → a principled confidence on the root.
- **Evidence** — union of quotes along the path → the root answer arrives with its full
  provenance attached (which lived episodes support the decision).
- **Coverage** — fraction of slots filled, ★-weighted → how much of the instrument's
  designed information was actually collected.
- **Effort** — respondent-minutes per subtree → which branches are expensive, informing the
  next tree's ★ placement and pruning.

Never build a second model of the interview to get these numbers; they are all readings of
the one filled tree.

## 5. CLOSE — what ships

The composed root answer + the findings list (including resolved ones and how they resolved)
+ the filled tree as a durable artifact + the coverage/confidence readout. If the engagement
runs under a ledger (noether-style), append one row: tree version, slots filled, findings
raised/resolved, root result. Escapes discovered later (the decision was made and reality
disagreed) point at the subtree that mis-composed — which is exactly the information that
improves the next tree.
