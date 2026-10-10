# How a network learns · brief

id: `how-a-network-learns` · Wave FILMS-GL (factory/WAVE-FILMS-GL.md) · date 2026-10-10 · explorer: Opus (BRIEF lane)
room: manager · format: feature, dur 123 (120 s of material + the 3 s CETI card) · commit: none (D11)
Every on-screen digit is a claim in `claims.json`; the numbers tagged S4 come from `recompute.py` and nothing else.

> **DATA WARNING. Check this before the film goes public.** `data/iris.csv` was typed from memory: this lane had no
> network. Its column sums match the published summary statistics (means 5.843 / 3.057 / 3.758 / 1.199, per-species means
> such as setosa 5.006 / 3.428 / 1.462 / 0.246), and it carries Fisher's values for rows 35 and 38 (the Bezdek et al. 1999
> corrections). Even so, the 150 rows MUST be checked row by row against the UCI copy (S3, `bezdekIris.data`) before
> public use. UCI's older `iris.data` differs in rows 35 and 38; if that file is used, re-run `recompute.py` and re-check
> every S4 claim.

## Subject
`{kind: concept (ML lesson), name: "a two-layer network learning Fisher's irises", source_material: [data/iris.csv, recompute.py, S1, S2, S3]}`

## Audience
manager. The room: people who sign off on "we'll train a model on it", have watched a loss curve in a slide, and were
told "the network figures it out".

## The belief
"The network figures it out." People picture learning as a steady climb: every step a bit better, until it is done.

## The gap (the two pictures)
- **Belief picture:** the number of flowers it gets right climbs at a steady rate over the 1,000 steps.
- **Count picture:** after 10 steps it already gets 135 flowers right. By step 34, 90 % of the total loss drop has
  happened. Getting from 140 to 148 right takes 208 steps. The last 769 steps add no flower at all. The 2 flowers it
  never gets right sit where versicolor and virginica overlap in the measurements.

## The everyday situation (HOOK, 0–12 s)
A model is "still training". Someone asks how long until it is good. The usual answer assumes steady progress.

## The fixture (CASE, 12–58 s)
**Fisher's iris table.** Edgar Anderson measured irises from the Gaspé Peninsula (1935). R. A. Fisher used 150 of them in
1936: 50 each of *Iris setosa*, *versicolor* and *virginica*, with 4 measurements each (sepal length and width, petal
length and width, in cm). It is one of the most reproduced tables in statistics.
- Setosa stands apart: its longest petal is 1.9 cm, and the shortest versicolor petal is 3.0 cm.
- Versicolor (3.0–5.1 cm) and virginica (4.5–6.9 cm) overlap in petal length. 37 flowers sit inside the shared band.

## The model (declared; `recompute.py` holds it all)
- Inputs: the 4 measurements, z-scored per column (population SD). Network 4 → 8 (tanh) → 3 (softmax): 67 weights and biases.
- Init: `numpy.random.default_rng(0)`, W ~ N(0, 1/fan_in), biases 0. Loss: mean softmax cross-entropy (nats).
- Training: full-batch plain gradient descent, learning rate 0.5, 1,000 steps. No momentum, no regularisation, no
  train/test split: the film is about learning, not generalising (the honest line says so).
- "Right" = the most probable species is the true one.
- **Seed rule (honest):** seed 0 is the first seed tried. We did not choose it for the story. The learning rate (0.5) and
  the step count (1,000) were chosen once, from {0.1, 0.3, 0.5, 1.0} and seeds {0, 1, 2, 7}, as a typical fast setting,
  before the claims were written. Over seeds 0–19 with nothing else changed: 122 to 139 right after 10 steps, the 90 %
  drop step between 31 and 63, and 148 right at step 1,000 on all 20 seeds (claims robust_*; live page limits block).
- Loss surface (heightfield): the two weights that travel furthest from init to final (W2[2,2] and W1[2,2]) form a
  120 × 80 grid, and the other 65 parameters are held at their final values. This follows the 2-D slice idea of S6,
  with coordinate axes in place of random directions. The path's real loss (all 67 moving) starts above the slice
  (1.393 against 0.214 on the slice) and meets it at step 1,000. The film draws the path at its real height, with a drop
  line to the ground, and says in a 14-unit footnote that the ground is the slice at the end.

## The mechanism (what THE COUNT draws)
Gradient descent takes steps in proportion to the slope. At the start, almost every flower is wrong and the slope is
steep, so a few steps fix most of them: setosa is separable on one measurement, and most versicolor and virginica flowers
sit far from the overlap. Once only the flowers inside the overlap are left, the loss surface is a long flat valley. The
slope is small, so each step moves the boundary a little, and the last flowers cost hundreds of steps. Two never come
right: row 84 (versicolor, called virginica) and row 134 (virginica, called versicolor). Their measurements put them on
the other species' side. The loss keeps falling after the count stops (0.050 at step 231, 0.039 at step 1,000), because
the network grows more confident about flowers it already has right.

## Count
- `[{unit: "flower", n: 150, lands_at: correct_0}]`. One mark is one flower, at true scale, in every lane. The first
  count lands at 61 s (`correct_0` = 13 on the ribbon slabs). The answer `correct_10` = 135 lands at 66 s.
- Second count (feature): steps. `step_90_drop` 34, `step_reach_140` 23, `steps_140_to_148` 208, `steps_after_best` 769,
  all on the step clock of the brushed point cloud (84–108 s).

## Commit
None (D11): the coordinator's brief change on 2026-10-10 says these are plain videos with no sealed answer. film.json
carries `"commit": {"enabled": false}`. The hook still asks the question "After 10 steps, how many does it get right?" as a
caption with no input box, and COUNT answers it.

## Monday
- question: "When the curve goes flat, which cases is it still missing?"
- honest_limit: "Graded on the 150 it learned from; new flowers untested." (one line: the fixture shows how training
  loss and training accuracy move. It says nothing about accuracy on unseen data, about large models, or about other
  optimisers.)

## Takeaway (brand card, ≤ 60 chars)
"Fast at first. The last few cost the most." (42)

## Look
`{brand: ceti-neosage-dark, chrome: none, material: ink, renderer: webgl, level: manager}`. Fraunces and DM Sans are not in
arsenal/fonts for the GL lanes, so the pins fall back to Big Shoulders / IBM Plex Mono (card WARN). Draw the pins with
`K.tx` through gl-labels so that the brand faces hold.

## Chain (beat order)
gl-pointcloud (R20) → gl-heightfield (R18) → gl-ribbons (R19) → gl-pointcloud again (the same structure, brushed), with
gl-labels for the pins. Three WebGL structures. The CETI card is not counted. See beats.md.

## Sources
- **S1** Fisher RA. The use of multiple measurements in taxonomic problems. *Annals of Eugenics* 1936;7(2):179–188.
  doi:10.1111/j.1469-1809.1936.tb02137.x. (The 150-row table.)
- **S2** Anderson E. The irises of the Gaspé Peninsula. *Bulletin of the American Iris Society* 1935;59:2–5. (The measurements.)
- **S3** Fisher RA. Iris [dataset]. UCI Machine Learning Repository, 1988. doi:10.24432/C56C76. With Bezdek JC, Keller JM,
  Krishnapuram R, Kuncheva LI, Pal NR. Will the real iris data please stand up? *IEEE Trans Fuzzy Systems*
  1999;7(3):368–369 (rows 35 and 38). **Verify iris.csv against this copy.**
- **S4** `factory/topics/how-a-network-learns/recompute.py` (this package; numpy, seed 0). Run `--check` to re-derive every S4 claim.
- **S5** Rumelhart DE, Hinton GE, Williams RJ. Learning representations by back-propagating errors. *Nature*
  1986;323:533–536. (Gradient descent through a hidden layer.)
- **S6** Li H, Xu Z, Taylor G, Studer C, Goldstein T. Visualizing the loss landscape of neural nets. *NeurIPS* 2018. (2-D slices of a loss surface.)

Verification note: the citations were written from memory with no network (DOIs included). Check them along with the rows.

## What this film is NOT
- Not a claim about generalisation, overfitting or test accuracy (there is no split; that is the honest line).
- Not "networks are slow" or "networks are fast": one tiny network, one dataset, one learning rate.
- Not a tour of backprop algebra: no gradient formula on screen, only the slope as the ground's tilt.
- Not deep learning at scale: the shape of this loss curve is typical, but it proves nothing for a large model.
- Not a picture of the whole 67-dimensional surface: the heightfield is a declared 2-D slice.
- Not LDA: Fisher's own linear discriminant is a footnote at most, never the case.
