# Command surface

Canonical:

```
/sheaf-run
```

Tagline (spoken or written, treated as the same command):

```
Glue what the dual-loop conserves.
Run the harness.
```

Short:

```
/sheaf
```

With scenario alias:

```
/sheaf-run hidden
/sheaf-run linear
/sheaf-run clean
/sheaf-run course
```

## Agent behaviour on receipt

1. Load `noether-harness` (loop, zero-weight, conservation).
2. Load `sheaf-harness` (this file).
3. Bind sheaf-kernel → localize ∥ preserve → glue ⇄ repair.
4. Execute until Commit or Abstain. Do not wait for per-skill confirmation.
5. Print Φ, mismatch ledger, and whether Meta recorded a discrete move.

## Standing rule (paste into a project)

```
On "/sheaf-run" or "Run the harness": execute sheaf-harness.
ACV = exact CSP. H¹ is diagnostic. Zero weight updates.
```
