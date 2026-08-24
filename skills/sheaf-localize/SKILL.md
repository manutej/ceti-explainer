---
name: sheaf-localize
description: >
  Produce Localization and Contract stalks for a capability sheaf: path, symbol,
  namespace, API revision, source commit as typed signatures. Binds to sheaf-kernel.
  Analog of meta-planning in the sheaf-* family. Use when a harness repair needs
  typed “where” and “what interface” instead of free-text retrieval. Trigger on
  "sheaf localize", "localization stalk", "contract stalk", "typed file+API signature".
---

# sheaf-localize

Fills vertices **L** and **C** of the sheaf instantiated by `sheaf-kernel`.

Local usefulness is not glue. This skill never claims a global section.

## Requires

`sheaf-kernel` has already emitted the incidence graph. If it has not, run kernel
first.

## Emits

- `s_L`: `{ path, symbol, namespace }` and G_L ∈ {true, false}
- `s_C`: `{ path, apiRevision, commit }` and G_C ∈ {true, false}

G_v is true only when a deterministic tool agrees (index hit, revision ledger).
Do not mark good to make later glue easier.

## Workflow

1. Resolve the file and symbol from the issue and repo index → L.
2. Resolve API revision and source commit → C.
3. Write both as field dictionaries. Shared field `path` on L and C should
   match if they refer to the same file; if they do not, write the disagreement
   honestly.
4. Hand sections to `sheaf-glue` (after `sheaf-preserve` has also run).

## When not

The file and API are already locked by ordinary types and you are not composing
with other harness components.
