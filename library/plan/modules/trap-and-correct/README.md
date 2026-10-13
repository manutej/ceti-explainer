# trap-and-correct

**Move.** confront-the-misconception + run-the-wrong-model (PED #4, #5: Muller et al. 2008; Posner 1982; Kendeou;
Lewandowsky). NAR A2, device 18 steel-man. Operad entry: MODULE-OPERAD §2. Combinator `M_wrong × M_right → M`:
the wrong model is lightweight (params), the right one is a module in slot `right`. trap∘trap is refused.

**Ports.** needs `gap` ∪ right.needs · gives `wrong dissatisfied instance` ∪ right.gives · PO = the right's (shared:
the correction is a state change of ONE object) · τ = {T1 T3 T5 T6 T7 T8} ∩ right.types.

**Params.** `wrong {name, steelman ≤ 90, works, says}` (credited where it works) · `observed {line, box}` (the fact it
ignored and where it sits on the object) · `read` (the right's counted answer) · `fresh {label, read, line, wrongSays?}`
(a second case; `line` may use `{top} {of} {value}`) · `scale` · `unit` · `meter {x0,x1,y,min,max}` · `card {x,y,w}` ·
`spliceAfter` (right phases that set the scene first, default 1) · `notes`.

**Phases.** `r.<first spliceAfter>` (the object appears) → steelman 3.5 s → run-wrong 3.5 s (the meter fills to its
answer, judgement colour) → break 2.5 s (payoff: a ≤ 1 s cue rings what it ignored; its answer gets the dashed
error outline) → break-hold 2 s → `r.<rest>` (the right module, on the same anchors) → fruitful 3.5 s (a fresh case on
the same meter: the count moves, the wrong model does not). The right module is frozen during the trap's own phases.

**CPR interface.** `reveal()` = commit before `steelman`, reveal after the right's payoff; `answerAxis()` = the
meter, so the viewer's guess, the wrong model and the count share one axis.

**Numbers.** `wrongSays` · `truth` · `freshRight` · `freshWrong` · `r.*`. Audit: right audit ∧ steelman present
(≤ 90) ∧ `works` present ∧ truth and fresh derivable ∧ the wrong model actually breaks on the case.

**Colour variables.** `wrongModel` (judgement) · `gapMark` (the ignored fact) · `answer` (+ the right's).

**Fails.** a strawman; wrong and right on different objects; ending on the wrong model's image; naming the principle
before the break (L5).

**Demos.** `build/demo-0.html` (AI, dark: an AI-text detector, illustrative rates — "90 % accurate, so 90 %" → 90 of
135 = 67 %; fresh: unflagged → 855 of 865 human) · `build/demo-1.html` (cabs: 80 % → 120/290 = 41 %; fresh: if she said
Green → 680/710 = 96 %). `node test.mjs`.
