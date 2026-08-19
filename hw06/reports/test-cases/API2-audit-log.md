# API 2 (`POST /api/cart`) — Audit step log

Human review of all 40 AI-generated cases from `API2-generation-log.md`, verified
empirically against the live SUT.

## Verdicts

| ID | Verdict | Why |
|---|---|---|
| PB-01 – PB-23 | VALID | Confirmed exactly as generated — every field-level boundary case is accepted with 200, no validation anywhere |
| **PB-24** | **INVALID → corrected** | AI assumed a JSON-array body would be rejected as "not a valid cart item shape." Wrong: the handler has zero type checking; the array is pushed into the cart as-is. Corrected 400/rejected → 200/accepted. |
| **PB-25** | **INVALID → corrected** | AI assumed the JSON literal `null` — syntactically valid JSON — would be accepted and passed through. Wrong: Express body-parser's default `strict` mode only accepts a top-level object or array; any other JSON value is rejected with 400 before the handler runs. Corrected 200/accepted → 400/rejected. |
| **PB-27** | **INVALID → corrected** | AI assumed a missing/mismatched Content-Type causes a client error. Wrong: body-parser silently skips parsing (doesn't reject), leaving `req.body` `undefined`; that still gets pushed, and `JSON.stringify` turns the `undefined` array element into `null` on the next GET. Corrected 400/rejected → 200/accepted_but_corrupted. |
| **PB-29** | **INVALID → corrected** | AI assumed real cart semantics (merge repeat adds, increment quantity) — a reasonable UX assumption, wrong for this implementation. The handler unconditionally pushes with no existing-id lookup; duplicate adds create duplicate line items. Corrected merged_quantity → duplicate_entries_not_merged. |
| PB-30 – PB-40 | VALID | Confirmed against the live SUT (413 size limit, 401/403 auth boundaries, confirmed per-user cart isolation, unescaped XSS payload stored verbatim, schema/round-trip checks all hold) |

## Summary
- 36 / 40 correct as generated.
- 4 / 40 required correction — all 4 share the same root cause as API1's audit findings:
  the AI reasoned from *plausible* framework/business-logic behavior ("a real cart would
  merge duplicates," "malformed content-type should be rejected," "an array isn't a valid
  item") instead of the *actual*, unvalidated behavior of this specific handler.
- Net effect: this audit pass reinforces the single biggest finding for this API —
  **`POST /api/cart` has no server-side input validation whatsoever** — well before the
  dedicated extension cases make that finding explicit.

See the `audit_notes` column in `API2-cart-cases.csv` for the per-row detail.
