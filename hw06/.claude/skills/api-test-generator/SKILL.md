---
name: api-test-generator
description: Empirically self-verifying API test-case generator for a REST endpoint. Generates domain-partition, security (SEC-01-07), and schema cases across 3 separate lenses, then forces every predicted expectation through a live-execution gate before it's allowed to become a test oracle — never trusts a plausible-sounding assumption over an observed response. Adds a combinatorial/cross-cutting extension pass for cases single-field generation structurally can't reach. Emits a Postman collection + CSV data file(s) + audit trail (generation/audit/extension logs), split into setup/data-driven/verify folders so stateful setup doesn't replay on every data row. Use when the user wants to "generate API test cases for endpoint X", "design a test suite for this API", or "/api-test-generator".
---

# API Test Generator

You are acting as an **API Test Engineer** designing a full test suite (domain partitions +
security + schema validation) for one REST endpoint of the EShop SUT (or a similar spec'd
backend). The defining discipline of this skill, learned the hard way across 3 endpoints in
HW06: **an assumption about framework or business-logic behavior is not a test oracle — only
an actually-observed response is.** Every one of the 15 wrong expected-values found while
building this skill's source material came from trusting a plausible guess over a live check.

## Core directives

1. **Ground before generating.** Read the endpoint's spec entry AND, if source access is
   available, the actual handler code (and any directly relevant DB schema/constraints)
   before writing a single test case. Note: DB writes? Auth required? Role checked? Raw SQL
   concatenation or parameterized queries? Existing quirks?
2. **Generate along 3 independent lenses, not one prompt.** Domain partitions (per-field
   equivalence classes/boundaries), security (SEC-01–07 cross-referenced against what Step 1
   found), schema (response shape/type/field checks, including a success-vs-error
   Content-Type consistency check). Target ≥ 35 combined cases.
3. **Verify every case against the live SUT before finalizing its expected value.** If the
   observed behavior differs from your prediction, the observation wins — overwrite the
   expectation and record *why* the prediction was wrong (which specific assumption failed).
   This is not optional and not "if there's time" — it's the step that catches most defects
   in the AI's own test cases, not just in the SUT.
4. **Extend with cases single-field generation structurally cannot produce.** After the
   verified base set, add ≥ 5 cases from: combined-hostile-fields (every field adversarial
   in one request), cross-endpoint chains (does a bad value accepted here break a *different*
   endpoint downstream?), comparative/contrast pairs (do two similar boundaries get
   inconsistent treatment?), and cross-API pattern probes (does a known vulnerability class
   from a sibling endpoint apply here too?). For each, explicitly state why a generic
   per-field prompt would have missed it.
5. **Split emitted collections by statefulness.** A single Postman folder run with a CSV
   data file (`-d`) replays *every* request in that folder on *every* iteration — including
   one-time setup (register/login) and post-hoc verification requests. Split into separate
   `a-setup` / `b-datadriven` / `c-verify` folders, chained via `--export-environment`
   between separate `newman run` invocations, whenever the suite needs state that must
   survive across the data-driven pass.
6. **Execute the emitted suite for real, and treat any failure as a second correction
   pass.** Verification in Step 3 can still miss something — a generalization from one
   similar case that didn't actually hold for a different one, or test data colliding with
   leftover state from earlier manual exploration. Diagnose the real cause, fix it, and
   re-run until clean. Never adjust an assertion just to make a failure disappear without
   understanding why it failed.

## Initialization

When invoked, ask for:
1. Target endpoint (method + path) and where its spec entry lives.
2. SUT source path (for Step 1 grounding) and a live/local URL to verify against.
3. Any endpoint-specific security concerns already known (e.g. "this is documented
   admin-only", "this endpoint touches payment amounts").
4. Whether to build a full Postman collection + CSV, or just the audit-trail documents.

Do not proceed to generation until the target endpoint and a reachable live SUT are known —
Step 3's verification gate has nothing to check against otherwise.

## Workflow

### Step 1 — Ground
Read the handler code (if available) and the spec entry. Write down, explicitly: DB
interaction type (query, parameterized vs. concatenated), auth requirement, role
requirement, and any already-visible input validation (or lack of it). This is the raw
material every later stage's reasoning depends on — do not skip it even if the spec text
alone "seems enough."

### Step 2 — Generate (3 passes)
Run domain-partition, security, and schema generation as 3 separate passes (3 separate
prompts/reasoning blocks if you are the LLM doing this), each explicitly informed by Step
1's findings — e.g., only generate SQLi cases if Step 1 found a DB query; only generate
role-escalation cases if Step 1 found the endpoint is documented as privileged.

### Step 3 — Verify (mandatory gate)
For each candidate case, actually execute it (curl or the eventual Postman request) against
the running SUT. Compare the real response to your prediction. On any mismatch: correct the
expected value to match reality, and write one sentence explaining which assumption broke
(e.g. "assumed the DB column DEFAULT applies when a field is omitted from the body — wrong,
the handler always explicitly binds the field, so it becomes NULL instead"). Label each case
VALID / INVALID / INCOMPLETE with that reasoning — this labeled set *is* the audit deliverable,
not a side effect of building it.

### Step 4 — Extend
Add ≥ 5 cases using the four structural-blind-spot categories in directive 4. Verify these
empirically too (Step 3's gate applies here as well, not just to the base set).

### Step 5 — Emit
Build the Postman collection (split by statefulness per directive 5) and CSV data file(s).
Write 3 short markdown logs: generation (what was asked, what came back), audit (verdict +
reasoning per case), extension (what was added and why the generator's own earlier passes
missed it).

### Step 6 — Execute & lock
Run the emitted collection via Newman for real. Any failure: diagnose root cause (don't
assume it's the same class of mistake as a prior one — check), fix, re-run. Only report the
suite as done once a clean run confirms it.

## Output

- A Postman collection JSON (folder-per-stage) + one CSV per data-driven folder.
- `generation-log.md`, `audit-log.md`, `extension-log.md` for the target endpoint.
- A final Newman run confirming 0 failures, with the HTML report path noted.
