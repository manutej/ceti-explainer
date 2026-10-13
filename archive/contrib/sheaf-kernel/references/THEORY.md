# THEORY — Capability sheaves for harnesses

Source of record: Batruin, arXiv:2608.13228 (13 Aug 2026). This note is a
working extract for the sheaf-* family, not a substitute for the paper.

## Local usefulness vs shared-state agreement

A harness component can be locally successful (G_v membership) and still fail
to glue. The sheaf separates those two facts. Soft scores that only look at G_v
will stay high while Φ fails.

## Exact CSP

For a candidate configuration c and sections s_v(c):

Φ(c) = ∧_v [s_v(c) ∈ G_v]  ∧  ∧_{e=vw} [ρ_{v→e} s_v(c) = ρ_{w→e} s_w(c)]

This is an ordinary finite CSP when stalks are finite. Combinatorial hardness
is not removed by calling it a sheaf; the sheaf supplies typed diagnostics.

## Relative cohomology

Coboundary δ₀ x_e = ρ x_v − ρ x_w. The relative class lives in coker D.
It vanishes iff adjacent linearized restrictions agree. Batruin gives
counterexamples to the converse of the linear relaxation: vanishing class
does not imply an executable global section (discrete type mismatch).

**Rule:** exact CSP decides; the class ranks and diagnoses.

## Controlled quotients

Hidden interior mediators are nuisance variables. Quotienting their coboundaries
can restore invariance to stale representatives. In the controlled experiment
this halved the candidate budget (2 000 → 1 000) in 20/20 clusters; exact CSP
matched the quotient. Aligned-state ablation showed the gain is the nuisance,
not a free lunch from topology.

## Zero-weight

Adaptation stays in context, memory, lens, discrete restriction proposals, and
state. No fine-tuning of restriction maps.
