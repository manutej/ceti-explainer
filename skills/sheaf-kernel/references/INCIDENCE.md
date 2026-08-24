# Incidence graph (Batruin § construction)

Vertices (typed stalks):

| v | Requirement | Typical fields |
|---|---|---|
| L | Localization | file path, namespace alias, symbol |
| C | Contract | file path, API revision, source commit |
| O | Ordering | API revision, edit order, test identifier |
| P | Preservation | file path, source commit, namespace alias |
| V | Verification | file path, symbol, test identifier |

Six overlaps (restriction = field projection):

1. L–V — file, symbol
2. L–P — file, namespace
3. C–P — file, commit
4. O–V — test identifier
5. P–V — file
6. C–O — API revision

Do not add edges that were not observed. Do not treat a workspace prefix or
integer file handle as automatically equal to a path string — that is either a
mismatch (glue) or a candidate for discrete quotient (repair).
