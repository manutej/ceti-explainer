# A · The Escapement

**Mechanism as cause.** Plain machined regulator modules in slate metal on dark glass. Each has an escape wheel, a
Graham deadbeat anchor, an involute train to a black dial, and a section hatched where material is cut. One module
is one agent run, one tooth is one step, and one tick is one loop.

Files: `shared.film.js` and `native.film.js` are the films. `escapement.kit.js` holds the geometry, the solved
escapement and the shaders; `build.sh` builds both. `build/` holds the pages
and `out/` the gates, sheets and MP4s.

## Ladder
**Glance (built).**
- *Shared (33 s).* One module in section, with plan/act/observe/check lit on the pallet faces. Step 8 slips: no
  impulse, the pendulum dies, and the hand stops inside step 8.
- The viewer commits a guess, then the camera pulls back to two banks of 50 on the same draws. 19 white hands
  come home vs 41 with a sage verifier pawl, counted into drums by a reading head, over expected ± sd.
- *Native (30 s), "Every handoff adds a step".* Pocket wheels hand steel-ball jobs across involute meshes, and
  drops stack under the handoff that lost them. Wield: 1–8 handoffs, and the same 60 jobs re-run.

**Grasp (2 min, spec).**
- THE TRACE is engraved tooth by tooth on one plate (plan, `fetch_purchase_orders`, observation).
- Tooth 7 slips ("Acme Corp" ≠ "ACME Corporation"). The pawl catches it, the retry by tax ID passes, and the module
  shrinks into a wall of 2,000 (a third, dial-only LOD).
- Honesty beats: one jolt knocks every module at the same tooth (correlated errors beat the pawls), and checked
  pendulums beat slower (checks cost time).
- Transfer: 10 steps at 99 % (0.904) vs 20 at 97 % (0.544).

**Wield (spec).** Set the pallet engagement (→ p) and place three pawls on a budget, then commit a home count. One
bank runs. Logged: prediction error, and whether the pawls went where slips cluster. Target: ≥ 80 % over 20 steps
(p ≈ 0.989).

**Master (spec).**
- An explorable wall: k, p, c, retries, correlation, verifier cost.
- Hover a module to read its `AgentLoop.events`.
- The exact survival curve is engraved under the wall.

## Known weaknesses (after revision 1)
- In the rack, modules are about 12 px. The silhouette carries the read; dials are texture.
- The 28 s re-rack transition is busy (100 modules in flight). It is honest to object identity, but noisy.
- The verifier's +1 beat per catch is a sketch cost model.
- The native check is shown only as an expected value (N = 40 cannot show a ~1.6-job effect in one draw).
- At seed 1 the unchecked native trains run above expectation (+2 sd at 6 handoffs), and the dashed lines show it.
- The close-up neighbours Ciechanowski's *Mechanical Watch*. The counted, racked wall is the wedge.
