# API 2 (`POST /api/cart`) — Extension step log

5 original test cases added on top of the audited 40.

| ID | What it tests | Why the AI missed it |
|---|---|---|
| **EXT2-01** | One request with every field simultaneously hostile (negative price, negative quantity, nonexistent id, oversized name) | AI's boundary cases vary one field at a time. Proving the *compounded*, single-request risk needs deliberate adversarial framing the generation prompts never asked for. |
| **EXT2-02** | Mass-assignment: fields that look like trust/privilege flags (`isAdminAddedFreeItem`, `discount_override`) | Requires OWASP-style mass-assignment framing, not a generic "try an extra field" prompt (PB-28 only proved *some* extra field is accepted, not that trust-implying ones are). |
| **EXT2-03** | Chained defect: a Content-Type-missing POST silently produces a `null` entry visible on a *later* GET | Needs connecting two separate request/response observations across two different calls — no single-request generation prompt does that. |
| **EXT2-04** | Reframes PB-29 (duplicate adds) as a business-logic defect, pushed to 3 repeats with no cap | Requires e-commerce domain judgment about what a cart *should* do, not just the raw factual observation. |
| **EXT2-05** | JWT tokens are issued with no `exp` claim — permanently valid | Requires decoding the token's own claims and comparing against what a well-formed JWT should contain; the AI's auth cases only tested header presence/integrity, never the token's content. |

EXT2-01/02/03/04 all reinforce one headline finding (zero input validation on
`POST /api/cart`) and get folded into a single Medium-severity bug report. EXT2-05 is a
separate, lower-severity hardening recommendation (no single SEC-01–07 item names it
directly, but it's squarely in SEC-02's spirit).
