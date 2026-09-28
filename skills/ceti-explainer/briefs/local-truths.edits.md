# Edit log — local-truths (episode 1)

Writer-monad trace for META-PROMPT.md §6. One edit script per pass, appended,
never rewritten. Instance: `briefs/sheaf-glue.brief.json` → `episodes/01-local-truths.js`.

## pass 1 · 2026-09-28
gate:      brief-gate PASS (Φ motif ✓ claims 4/4 ✓ duration 40.2s ✓); warning "tag 44 chars"
critique:  untyped — the tag overran the 38-char width rule
edits:
  1. tag ← "Sheaf gluing · Čech H¹ · 3 patches"        (34 chars; keeps the real name and the count)
fixpoint:  no

## pass 2 · 2026-09-28
gate:      scaffold → gate FAIL — "__AUDIT() math invariant failed: DERIVED is null"
critique:  unbound — the derivation slot was owed (by design; the scaffold refuses to pass without it)
edits:
  1. DATA.DERIVED ← g_AB = A(p)−B(p), g_BC = B(q)−C(q), g_CA = C(r)−A(r); Σ; shifts (0, g_AB, g_AB+g_BC);
     glued corners; broken g_CA from the misread; leftover = |Σ'|      (worked_example.derivation, as code)
  2. __AUDIT ← also assert readings = true + datum for every (map, corner), and that glued corners
     agree from both maps that cover them                                   (B6; a sharp viewer's check)
  3. anchor ← road strip + patches A/B/C + corner ticks + loop hint eyebrow  (beat 1 only lights this)
  4. working ← one persistent profile chart; B/C groups translate by −shift·px during glue;
     A's path takes a 1 m wedge at r during the leftover beat                (B3, B7)
  5. detail ← six seg-gated scenes: readings · offsets · sum · shifts · misread · why   (B7)
  6. __REGIONS / __LAYOUT ← exposed                                          (B7, B8)
fixpoint:  no — gate PASS with audit note "g=(-3,-2,5) Σ=0 · shifts B -3 C -5 · glued r 9 p 12 q 20 · misread Σ=-1 → leftover 1 m"

## pass 3 · 2026-09-28
gate:      PASS; browser snapshots at every beat midpoint, the 7→8 boundary, and t = duration
critique:  sibling — the shell's caption band, top bar, scrub track, Tweaks panel and play icon
           carried hard-coded dark values, so `--preset ceti-course` re-skinned the diagram but
           not the furniture. Instance-independent: every light preset would fail the same way.
           last-beat — none; beat 8 re-lights the glued chart and swaps the patch labels only.
           untyped — the C∩A bracket at the right end had no dot for A's reading of r.
           overlap — the beat-7 guide line at y(10 m) crossed A's "12 m" label at p.
edits:
  1. shell.template.html ← nine chrome roles (--ex-chrome-bar/-band/-track/-tick/-panel,
     --ex-on-accent, --ex-shadow, --ex-shadow-soft, --ex-frame-hi) with the exact dark defaults;
     hard-coded rgba/hex replaced by the roles                            (λ-level; dark output unchanged)
  2. presets/ceti-course.css ← overrides for the nine chrome roles       (light furniture on cream)
  3. brk[C∩A] ← dashed ghost dot at y(A(r)) and label "A 9 m" to its right (typed: the loop's other end)
  4. below-labels ← +20 px (was +15); A's p label lerps above the dot once B's duplicate has faded
                                                                           (guide at y(10 m) now clears it)
fixpoint:  no

## pass 4 · 2026-09-28
gate:      brief-gate PASS · gate PASS · snapshots at 15.9 s, 28.0 s, 31.8 s clean ·
           reference modules unchanged (all four PASS) · dark reference page renders as before
critique:  none
edits:     (empty)
fixpoint:  yes

Open items carried, not blocking: the browser overlap auditor (`assets/audit-overlaps.js`) was not
run in a console in this pass; Playwright screenshots stood in for it. The comparison archetype
still has no reference (META-PROMPT.md §7); episode 2 is its test.
