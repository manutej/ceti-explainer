# Content Brief — MCP (Model Context Protocol)

**Episode id:** `mcp`  ·  **Title:** Model Context Protocol
**Eyebrow:** AI Systems · 02  ·  **tag:** `JSON-RPC 2.0 over stdio / HTTP · tools · resources · prompts`

## Mechanism (how it actually works)
An AI app is sealed off from your real tools and data. MCP is an open protocol that standardizes the connection — "USB-C for AI." A **host** (e.g. an AI desktop app) runs one **client** per connection; each client speaks to an **MCP server** over a transport (local **stdio** or remote **HTTP/SSE**) using **JSON-RPC 2.0**. A server exposes three primitives: **Tools** (functions the model can call), **Resources** (data the host can read into context), and **Prompts** (reusable templates). The lifecycle: an **initialize** handshake negotiates capabilities, then the client can **list** what the server offers, and the model can **call** a tool; the server runs it and returns a result that flows back to the model. Because the contract is shared, you build an integration **once** and every MCP host can use it.

## Worked example (derive the numbers in code)
Task: the user asks **"What's the weather in Tokyo?"** The host has a client connected to a **weather** MCP server.
1. **initialize** → server returns capabilities `{ tools: {}, resources: {} }`.
2. **tools/list** → `[ get_weather(city: string) ]`.
3. The model emits a call. The client sends JSON-RPC:
   `{ "jsonrpc":"2.0", "id":1, "method":"tools/call", "params":{ "name":"get_weather", "arguments":{ "city":"Tokyo" } } }`
4. Server executes and replies:
   `{ "jsonrpc":"2.0", "id":1, "result":{ "content":[ { "type":"text", "text":"Tokyo: 18°C, clear" } ] } }`
5. The model answers grounded in the live result.

**The integration math (work it in full on screen):** without a shared protocol, connecting **M** hosts to **N** tools needs **M × N** bespoke integrations. With MCP it's **M + N**. Worked: **M = 5 hosts, N = 20 tools → 5 × 20 = 100** custom connectors collapse to **5 + 20 = 25** — a **4× reduction** that keeps growing with scale. Derive the counts in code.

## Anchor visual
A persistent **host/client box on the left** and a **server (with its tools/resources/prompts) on the right**, joined by a **JSON-RPC channel** in the middle. The channel carries messages (initialize → list → call → result) across the beats; the M×N-vs-M+N comparison lives in the lower-third.

## 8 beats
1. **The wall** (intro) — the AI app is boxed off from your tools and data; it can't act.
2. **M × N glue** — connecting every app to every tool by hand is a combinatorial mess.
3. **One protocol** — MCP: a client talks to a server over JSON-RPC; M + N, not M × N.
4. **Handshake** — `initialize` negotiates capabilities between client and server.
5. **Discover** — `tools/list` (and resources/prompts) — the server advertises what it offers.
6. **Call a tool** — `tools/call` with arguments; the server executes (the Tokyo weather example).
7. **Result returns** — the result flows back as context; the model answers from live data.
8. **Why it matters** — build the server once; every MCP host can use it. M + N beats M × N.

## The aha (→ meta.synthesis)
Before MCP, every app wired itself to every tool by hand — M × N glue that never stopped growing. MCP makes the contract shared: a tool speaks the protocol once, and every host can call it. Integration stops being combinatorial.

## Refs (real)
Model Context Protocol spec (modelcontextprotocol.io) · JSON-RPC 2.0 · primitives: tools / resources / prompts · transports: stdio and streamable HTTP.
