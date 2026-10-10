---
name: sheaf-preserve
description: >
  Produce Ordering and Preservation stalks: edit order, test id, commit, namespace,
  path — what must not break, in what sequence. Binds to sheaf-kernel. Analog of
  meta-design in the sheaf-* family. Use when edits must keep public API, tests,
  and module boundaries. Trigger on "sheaf preserve", "ordering stalk",
  "preservation stalk", "edit atoms sheaf".
---

# sheaf-preserve

Fills vertices **O** and **P**. May run in parallel with `sheaf-localize` once
the kernel graph exists.

## Emits

- `s_O`: `{ apiRevision, editOrder, testId }`
- `s_P`: `{ path, commit, namespace }`
- Ordered edit atoms that respect O.

## Overlaps this skill is responsible for naming honestly

- O–C API revision
- P–C file + commit
- P–L file + namespace
- P–V file
- O–V test identifier

If path casing or a workspace prefix differs from Localization, **write the
difference**. Silent normalization here hides the obstruction from glue.

## When not

Greenfield files with no existing contract to preserve.
