# Noether dual-loop × capability sheaf

Alet et al., *Noether Networks* (NeurIPS 2021, arXiv:2112.03321), meta-learn
useful conserved quantities **without** changing weights at adaptation time.
The `noether-harness` skill turns that into a coding dual-loop.

Batruin, arXiv:2608.13228, supplies the missing local-to-global predicate:
locally good components can still fail to glue.

## Slot map

| Noether object | Sheaf object | Gate |
|---|---|---|
| Conservation embedding g_φ | family of local sections on Propose/Tailor/Commit/Meta | — |
| Critical lens | hard membership s_v ∈ G_v plus exact restriction | sheaf-glue |
| Soft lens | distance to image of g_φ (metric sheaf) | ranking only |
| Soft pre-image | global sections with d(s, g_φ) < ε | non-empty and proper |
| ACV / closure verification | exact CSP Φ | sheaf-glue |
| Inner Tailor loop | glue ⇄ repair, bounded | sheaf-repair |
| Meta (outer) | discrete restriction maps, quotients | zero weight lock |
| Weight update | forbidden | forbidden |

## What would break the contract

- Meta trains a sheaf neural net on restriction maps.
- Tailor accepts because relative H¹ vanished while Φ failed.
- Propose skips kernel and lets free-text retrieval count as a stalk.
- Commit writes when only local G_v is true.

## Dual-loop as open cover

The four stages are the open sets. Restriction maps are consistency of the
conserved quantities as they move stage to stage. A committed run is a
global section of that conservation sheaf, and also a global section of
Batruin’s capability sheaf on L,C,O,P,V. Two sheaves, one commit.
