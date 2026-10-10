# noether-symmetry · v2 director's note (owner feedback on v1, 2026-10-10)

Owner's words on v1: "COOL, but not sure it captures the CONCEPT of conserved quantities. Distracting text overlap and confusing
text movements; simpler ways to add text elements. The dots are good but a little large; not enough of a point cloud; increase
the granularity. The important thing is to make it accessible." This film is now PART 1 of a three-part series (introduce the
concept); parts 2 and 3 take the applications, so part 1 may give the concept all its time.

## The concept, said plainly (this is what the film must land, in this order)
1. A conserved quantity is a number you can work out at any moment, and it comes out the same every time, while everything
   else swings. Show it before you name it: one orbit, one moving dot, three readouts side by side: DISTANCE (swings),
   SPEED (swings), DISTANCE × SPEED (flat). The flat bar is the whole idea. Hold it.
2. Earth is the real case: the two measured moments (147.095 / 30.29, 152.100 / 29.29), the two products, 0.011 % apart.
   Same readout panel, numbers landing in place. No flying words.
3. Why is it fixed? Because of a symmetry: a change that changes nothing. Turn the whole orbit picture under a still readout:
   the product does not move. "Turn it: nothing changes. That is why spin is conserved." Then "Start the clock later: nothing
   changes. That is why energy is conserved." Noether, 1918: every such symmetry fixes one number. (Two symmetries → two
   fixed numbers; keep it at two.)
4. Many orbits at once: a true point cloud (300 orbits × 100 moments = 30,000 fine dots). Sort the same dots by their fixed
   number: tangle → shells. Follow ONE orbit through the sort: its 100 dots travel together and land on ONE shell, and as its
   dot moves in time it slides along the shell and never leaves it. That is "conserved" as a picture: a dot that cannot leave
   its shell. Then the second sort (by energy → layers), same follow. Drop the cut plane (a third sort that adds no concept).
5. Not quantum, not even physics: a tiny network learning. Its weights move a lot (0.24); a sum that a symmetry fixes moves
   0.00095, about 250 times less. Same picture: shells. One frame, both numbers, counts before the ratio. (Part 2 goes deeper;
   here it is one beat: "this is not only planets".)
6. Fluids plate (Kelvin's circulation, wordless), honest line on stage, Monday question, card.

## Text rules for v2 (the overlap and the confusing motion)
- No text ever moves across the stage. A text element fades in where it will stay, or hard-cuts. Remove the formula-bind
  flights entirely; the formula is a static readout panel whose numbers update in place.
- One readout panel (right third of the stage, fixed), one caption band, one small corner tag (SIMULATED / MEASURED, and the
  lay axis words beneath it). Nothing else. At most three text elements besides the caption on any frame.
- No text over the cloud: the cloud's projected bounds stay clear of the panel and the tag. Pins (gl-labels) only for the
  followed orbit and the shell count, with leaders, outside the cloud's silhouette, and hard-cut on viewpoint changes.
- Captions: one line, lay words, one idea each; a 10-year-old should follow. Say "a number that never changes" before
  "conserved quantity"; say "a change that changes nothing" before "symmetry".

## Point cloud
- perOrbit 10 → 100 (states 30,000; rebuilt from the Kepler solution, so no data cost). dotR about 1.0–1.3 world units, with
  the depth size cue; the followed orbit's dots a little brighter, not bigger. Network: as many training states as the page
  budget allows (target 10,000: 100 runs × 100 steps; the delta-coded data is the only cost); dotRNet to match.
- Shell outline rings stay (they read well). Colour by energy stays.

## Keep
Chapters and 153 s; the camera grammar (≤ 1 move per 8 s, holds ≥ 2.5 s, labels hard-cut on viewpoint change); the measured
Earth numbers and their claims; the network numbers and claims; honest line on stage; card last; G11 clean; page < 1.3 MB
(the removed formula flights and cut plane pay for the finer cloud); commit off.
