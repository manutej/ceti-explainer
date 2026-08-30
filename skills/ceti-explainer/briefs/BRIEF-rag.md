# Content Brief — RAG (Retrieval-Augmented Generation)

**Episode id:** `rag`  ·  **Title:** Retrieval-Augmented Generation
**Eyebrow:** AI Systems · 01  ·  **tag:** `Dense retrieval + grounded generation · top-k over a vector index`

## Mechanism (how it actually works)
A language model only knows what was baked into its weights at training time. RAG adds a second, swappable memory at *inference* time. The user's question is embedded into a vector. Every document chunk in a corpus has been pre-embedded into the **same** vector space and stored in an index. You score the query against every chunk by similarity (cosine of the angle between vectors), keep the **top-k** nearest, paste those chunks into the prompt as context, and let the model generate an answer **grounded** in them — usually with citations back to the source chunk. The weights never change; you change what the model knows by changing what you retrieve.

## Worked example (derive the numbers in code)
Query: **"What's our refund window?"**
Use a 4-D illustrative embedding space (label it as a projection of a real 1536-D space, e.g. `text-embedding-3-small`). Pre-embedded chunks:

| id | chunk (abridged) | embedding (illustrative) |
|----|------------------|--------------------------|
| c1 | "Returns accepted within 30 days of delivery." | [0.90, 0.20, 0.10, 0.30] |
| c2 | "Standard shipping takes 5–7 business days."    | [0.20, 0.85, 0.15, 0.10] |
| c3 | "Refunds are issued to the original payment method within 30 days." | [0.86, 0.18, 0.12, 0.40] |
| c4 | "Our warranty covers manufacturing defects for 1 year." | [0.45, 0.30, 0.55, 0.20] |
| c5 | "Contact support at help@acme.com."            | [0.10, 0.25, 0.20, 0.80] |

Query embedding **q = [0.92, 0.18, 0.08, 0.34]**.
Compute cosine similarity `cos(q,d) = (q·d) / (|q||d|)` for each chunk **in code**, sort, take **k = 3**. Expected ordering: c1 and c3 (the refund chunks) on top, then c4; c2 and c5 fall away. Work **one** cosine in full on screen (c1): show the dot product term-by-term, the two magnitudes, and the quotient. The answer ("**30 days**") is assembled only from the retrieved chunks.

## Anchor visual
A persistent **shelf of 5 document chunks** across the top, with the **query pill** entering from the left. The query and chunks become points/vectors; similarity becomes bars; the top-k light up; they flow into a prompt box; the answer streams out and points back to c1/c3.

## 8 beats
1. **The question** (intro) — a question arrives; the model alone can only guess from frozen training data.
2. **Embed everything** — query and every chunk become vectors in one shared space.
3. **Measure similarity** — cosine similarity between the query and each chunk (work c1 in full).
4. **Retrieve top-k** — sort by score; keep the k = 3 nearest; the rest fade.
5. **Build the context** — the retrieved chunks are pasted into the prompt alongside the question.
6. **Grounded generation** — the model reads question + context and writes the answer from it.
7. **Cite the source** — each claim points back to the chunk it came from (provenance).
8. **Why it matters** — knowledge lives in the index, not the weights; update the shelf, not the model.

## The aha (→ meta.synthesis)
The model's weights stay frozen. You change what it knows by changing what you retrieve — so the same model answers from today's documents, cites its sources, and hallucinates less. Retrieval is a memory you can edit.

## Refs (real)
Lewis et al. 2020 (RAG) · Karpukhin et al. 2020 (Dense Passage Retrieval) · cosine similarity over dense embeddings · ANN indexes (FAISS / HNSW).
