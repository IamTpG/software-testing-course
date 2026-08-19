# API 3 (`POST /api/admin/coupons`) — Extension step log

5 original test cases added on top of the audited 40.

| ID | What it tests | Why the AI missed it |
|---|---|---|
| **EXT3-01** | Same non-admin user creates AND deletes a coupon end-to-end, zero admin involvement | PC-29/30 test create and delete as isolated probes. Proving the compounded real-world impact needs cross-referencing the spec's explicit "Admin Only" declaration against actual behavior — a single-endpoint generation prompt doesn't do that. |
| **EXT3-02** | Traces how a NULL-`type` coupon (from PC-08) would silently misbehave in the *separate* `apply-coupon` endpoint | Requires reading a second endpoint's code and connecting it to a finding on this one — a cross-endpoint chain no per-endpoint prompt produces. |
| **EXT3-03** | Contrasts `max_uses_per_user:0` (silently "fixed" to 1) against `-5` (silently accepted as-is) as one combined finding | Requires JS `||`-semantics domain knowledge and a deliberate side-by-side comparison — not something per-field boundary generation does on its own. |
| **EXT3-04** | Confirms the destructuring-based field allowlist is a genuine (if accidental) mass-assignment defense, explicitly contrasted against API2's cart | Requires comparing this endpoint's behavior against a *different API's* finding — cross-API synthesis, not a single-endpoint task. |
| **EXT3-05** | Portfolio-level synthesis: each of the 3 APIs' worst bug is a *different class* of defect (API1 SQLi, API2 no validation, API3 no access control) | Only visible after testing all three APIs — no single-endpoint prompt has that vantage point. |

EXT3-01 is the sharpest demonstration of the headline SEC-03 finding. EXT3-02/03 round
out the domain-partition analysis with cross-endpoint/comparative reasoning. EXT3-04/05
are best used directly in the main report's cross-API comparison section.
