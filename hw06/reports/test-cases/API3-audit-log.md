# API 3 (`POST /api/admin/coupons`) — Audit step log

Human review of all 40 AI-generated cases, verified empirically against the live SUT.

## Verdicts

| ID | Verdict | Why |
|---|---|---|
| PC-01 – PC-07 | VALID | Confirmed exactly as generated |
| **PC-08** | **INVALID → corrected** | AI assumed the DB column `DEFAULT 'percent'` applies when `type` is omitted. Wrong: the handler always explicitly binds all 6 fields, so omitted → `undefined` → bound as `NULL`, not the column default. Confirmed live: `type: null` stored — breaks `apply-coupon`'s branching downstream (see EXT3-02). |
| PC-09 – PC-14 | VALID | Confirmed |
| **PC-15** | **INVALID → corrected** | AI assumed server-side range validation caps a percent discount at 100. Wrong: none exists. `discount_value:500` for a percent coupon is accepted as-is. Corrected 400/rejected → 200/created_no_cap. |
| PC-16, PC-17 | VALID | Confirmed |
| **PC-18** | **INVALID → corrected** | Same root cause as PC-08 — `min_order_amount`'s `DEFAULT 0` never applies; confirmed live it's stored as `NULL`. |
| **PC-19** | **INVALID → corrected** | AI assumed creating an already-expired coupon is rejected as an obvious logic error. Wrong: no such check exists. Corrected 400/rejected → 200/created_no_expiry_check. |
| **PC-20** | **INVALID → corrected** | AI assumed the `DATETIME` column type implies format validation. Wrong: SQLite has no real type enforcement, and the handler adds none either. Corrected 400/rejected → 200/created_no_format_check. |
| PC-21, PC-22 | VALID | Confirmed |
| **PC-23** | **INVALID → corrected** | AI assumed the `|| 1` fallback treats every non-positive `max_uses_per_user` value like it treats `0`. Wrong: JS `||` only substitutes for *falsy* values — `-5` is truthy and passes straight through, stored as literal `-5`. Corrected `created_coerced_to_1` → `created_not_coerced`. |
| PC-24 – PC-28 | VALID | Confirmed — PC-27 in particular is a *good* finding: the destructuring-based allowlist correctly blocks an `is_active:0` mass-assignment attempt (contrast with API2's cart, which has no such protection) |
| **PC-29** | VALID, and the headline finding | Confirmed live: a **regular, non-admin user successfully created a coupon** (200, not 403) — SEC-03 completely unenforced. |
| **PC-30** | **INVALID → corrected** | AI assumed the sibling `DELETE` endpoint, documented in the same admin-only section, would also reject a non-admin caller. Wrong: same missing-role-check bug — a regular user successfully deleted an existing coupon. Corrected 403/forbidden → 200/deleted_no_role_check. |
| PC-31 – PC-40 | VALID | Confirmed — auth-presence/signature checks hold, SQLi/XSS payloads are stored as inert literals (parameterized query works correctly here), error-path Content-Type is JSON not HTML |

## Summary
- 33 / 40 correct as generated.
- 7 / 40 required correction — **all 7 share one root cause**: the AI over-assumed this
  admin endpoint validates its inputs and enforces its documented access-control model,
  when in fact almost none of that validation exists. This is the opposite failure mode
  from a security standpoint compared to API1/API2's individual corrections — here the
  AI wasn't wrong about a technical mechanism, it was wrong to extend charitable trust to
  an admin-labeled endpoint without verifying the access control was actually implemented.

See the `audit_notes` column in `API3-coupons-cases.csv` for the per-row detail.
