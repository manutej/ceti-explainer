# sheaf-* family contract

Analogous to how meta-* binds to Zhang et al., *On Meta-Prompting* (arXiv:2312.06562):

| Family | Generator paper | What the generator emits |
|---|---|---|
| meta-* | 2312.06562 | example-agnostic prompt scaffolds |
| sheaf-* | 2608.13228 | finite capability sheaf + exact CSP |
| noether-harness | Alet et al. NeurIPS 2021 | dual-loop + conservation lens, zero weight |

Composition (strict):

```
sheaf-kernel
   ├─ sheaf-localize  →  s_L, s_C
   └─ sheaf-preserve  →  s_O, s_P
            │
            ▼
      sheaf-glue      →  Φ(c)
            │
            ├─ pass → commit
            └─ fail → sheaf-repair → sheaf-glue
```

Operator (the command, not a sixth vertex):

```
/sheaf-run     →  sheaf-harness
                 Propose / Tailor* / Commit / Meta
                 on top of noether-harness
```

Tagline: **Glue what the dual-loop conserves.**

Rules that keep the family honest:

1. Exact CSP is the only decision procedure for critical agreement.
2. Relative cohomology ranks and diagnoses. Never accepts.
3. Zero weight updates. Repair is discrete.
4. Local success is not glue. Localize/preserve do not skip glue.
5. Batruin’s SWE-bench discovery gate failed; do not claim real-world
   cohomological advantage.
6. Do not call the five skills by hand when the user asked to run the harness
   — that is `sheaf-harness`.
