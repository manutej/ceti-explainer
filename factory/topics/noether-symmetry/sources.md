# noether-symmetry · sources, grades, what was opened (2026-10-10)

Egress: WebFetch failed on every host (nssdc.gsfc.nasa.gov, arxiv.org, wikipedia.org, ssd.jpl.nasa.gov: ENOTFOUND or proxy 403, `curl` through the proxy also 403). Nothing was opened; every row below was read through WebSearch (extended) result text quoting the page. Grade: A = primary seen consistently in more than one extraction or recomputed here; B = secondary or seen once; C = commentary only (none on screen).

| id | claim | source | opened? | grade |
|---|---|---|---|---|
| S1 | Earth perihelion 147.095 and aphelion 152.100 million km; eccentricity 0.0167; average speed 29.78 km/s (the planetary sheet rounds to 147.1 / 152.1 / 0.017) | https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html ; https://nssdc.gsfc.nasa.gov/planetary/factsheet/ | no; two extractions agree | A |
| S2 | Earth speed at perihelion 30.29 km/s and at aphelion 29.29 km/s (an independent DE430 figure quoted by a homework site: 30.28 and 29.3) | https://en.wikipedia.org/wiki/Earth's_orbit | no | B (primary behind it not named) |
| S3 | GM_sun = 1.3271244e20 m^3/s^2 (stored as 1.32712440018e11 km^3/s^2), nominal solar mass parameter | IAU 2015 Resolution B3, https://www.iau.org/static/resolutions/IAU2015_English.pdf | no; from memory | B (off screen) |
| S4 | Noether 1918, Nachr. Ges. Wiss. Goettingen, Math.-phys. Kl., 235-257; Tavel translation 1971; context | https://arxiv.org/abs/2004.09254 ; https://arxiv.org/pdf/1902.01989 | no | B (year, pages), A (theorem) |
| S5 | elementary derivation for physics undergraduates | Hanc, Tuleja, Hancova, Am. J. Phys. 72, 428-435 (2004) https://ui.adsabs.harvard.edu/abs/2004AmJPh..72..428H | no | A (bibliographic) |
| S6 | under gradient flow the differences of squared layer norms stay constant; layers balance on their own | Du, Hu, Lee, NeurIPS 2018, arXiv 1806.00900, https://arxiv.org/abs/1806.00900 | no; abstract in 3 extractions | A |
| S7 | architecture symmetries give conservation laws of SGD's continuous limit "analogous to Noether's theorem"; weight decay and finite learning rate break them | Kunin, Sagastuy-Brena, Ganguli, Yamins, Tanaka, ICLR 2021, arXiv 2012.04728 | no | A (claim), B (VGG-16 check) |
| S8 | kinetic symmetry breaking; motion of the Noether charge in learning | Tanaka and Kunin, NeurIPS 2021, arXiv 2105.02716 | no | A (abstract), B (detail) |
| S9 | Kelvin's circulation theorem follows from particle-relabelling symmetry by Noether's theorem | Salmon, Annu. Rev. Fluid Mech. 20, 225-256 (1988) http://adsabs.harvard.edu/abs/1988AnRFM..20..225S ; Salmon 2013 https://pordlabs.ucsd.edu/rsalmon/salmon.2013.pdf ; arXiv 1801.09729 ; arXiv math/0702827 | no | B |
| S10 | conservation of the capital-output ratio on efficient paths of an idealised growth model, by analogy to energy | Samuelson, PNAS 67(3):1477-1479 (1970) https://www.pnas.org/doi/10.1073/pnas.67.3.1477 ; Sato and Ramachandran (eds.) 1990 https://link.springer.com/book/10.1007/978-94-017-1145-6 | no | B (result), C (Noether framing); off screen |
| S11 | the simulations (orbits, network) and every derived number | recompute.py, seed 20261010 | run | simulation (labelled MODEL on stage) |

Not used on screen: Halley's comet (r x v differs by 1.2 % between sources, C as a pair); ecology and epidemics (no Noether source, C); Jacobi constant and mission design (no explicit Noether source, C); equivariant networks (Cohen and Welling 2016: 2.28 % rotated MNIST, 4.19 / 6.46 % CIFAR-10, B, a cousin not a conservation law).

Reproduce: `python3 -I factory/topics/noether-symmetry/recompute.py` (about 60 s, numpy only; add `--write` to rewrite data/orbit_table.json, data/orbits.json, data/network.json, data/recompute_out.json). The data/ files in the page are orbit_table.json (31 KB, rebuilds the 3,000 orbit states with the Kepler solution) and network.json (190 KB, 3,000 rows of 3 PCA coordinates, 3 conserved coordinates, loss; quantise to 3 decimals and move to `libs` if the page nears its 1.3 MB budget). orbits.json (the full state table: x y z vx vy vz v E Lx Ly Lz |L| phase) is for verification and is not shipped.
