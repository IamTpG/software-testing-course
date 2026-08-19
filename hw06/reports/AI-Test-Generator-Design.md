# AI-Driven API Test Generator — Design (Section 7, Create level G9.5)

## 1. What this is

A design for a tool that takes the EShop API specification (plus, where available, read
access to the SUT's own source code) and produces a runnable Postman collection + CSV
data file + audit trail for one endpoint — the same artifacts this homework produced by
hand for `GET /api/products`, `POST /api/cart`, and `POST /api/admin/coupons`.

The design is **not** "prompt an LLM once for test cases." Every design decision below is
a direct generalization of a mistake or a discovery made while doing this homework's
actual pipeline three times — see the "Grounded in" note under each stage.

## 2. Design principle

**An assumption is not a test oracle. Only an observed behavior is.**

Across all 3 APIs in this homework, 4 + 4 + 7 = 15 of the 120 AI-generated cases had a
wrong *expected* value, and every single one failed for the same underlying reason: a
plausible-sounding assumption about framework or business-logic behavior stood in for an
actual check against the running system. The generator's central mechanism is therefore
not "generate creative test cases" (LLMs are already good at that) — it's **forcing every
generated expectation through a live-execution gate before it's allowed to become a test
oracle.**

## 3. Pipeline stages

### Stage 1 — Ground (read before generating)
Read the target endpoint's spec entry (method, path, params/body schema, auth
requirement) **and**, if source access is available, the actual handler code and any
directly-relevant schema/constraints (DB column types, defaults, middleware). Extract:
does it write to a DB? Require auth? Check a role? Use string concatenation or
parameterized queries?
*Grounded in: reading `server.js` first is what surfaced API1's raw-SQL-concatenation and
API3's missing role check before a single test case was written — spec text alone shows
neither.*

### Stage 2 — Generate (three parallel lenses, not one prompt)
For the grounded endpoint, generate candidate cases along three independent dimensions:
- **Domain partitions**: per-field equivalence classes and boundaries (missing, wrong
  type, empty/zero/negative, min/max, malformed whole-body shapes).
- **Security**: cross-reference the endpoint's Stage-1 characteristics against the
  SEC-01–07 checklist (has a DB query → SQLi probes; requires auth → token
  presence/validity/signature boundaries; admin-only → role-escalation probes; renders
  user text elsewhere → XSS probes).
- **Schema**: response shape/type/field assertions from the documented response, plus a
  same-endpoint success-vs-error Content-Type consistency check.
*Grounded in: treating these as three separate generation passes (not one mega-prompt) is
literally what Section 6 requires ("driven step by step... not a single generic
prompt"), and is why each API's case list cleanly separates into 3 audit-reviewable
categories instead of one undifferentiated pile.*

### Stage 3 — Verify (the gate)
For every generated case, execute it against a live/sandboxed instance of the SUT and
record the **actual** status code / response shape. Compare against the generator's
predicted expectation.
- If they match: keep the prediction, mark verified.
- If they differ: **the observed behavior wins.** Overwrite the expectation, and record
  *why* the prediction was wrong (which framework/business-logic assumption failed) —
  this becomes the audit trail's reasoning, not a discarded scratch note.
*Grounded in: this stage is the direct generalization of the human "audit" step that
caught PA-09/12/17, PB-24/25/27/29, and PC-08/15/18/19/20/23/30 in this homework — every
one of those corrections came from actually running the request, not from reasoning
harder about it.*

### Stage 4 — Extend (combinatorial + cross-cutting pass)
After Stage 3, explicitly prompt for cases that Stage 2's per-field, per-lens generation
structurally cannot produce:
- **Combined-hostile-field** cases (every field adversarial at once, not one at a time).
- **Cross-endpoint chains** (does a malformed value accepted here silently break a
  *different* endpoint's logic downstream?).
- **Comparative/contrast** cases (do two similar-looking inputs get inconsistent
  treatment — e.g. one falsy boundary "fixed" by a fallback, another silently accepted?).
- **Mass-assignment / mass-cross-API** probes, when a sibling endpoint's known
  vulnerability class (e.g. missing allowlist) can be tested for on this endpoint too.
*Grounded in: this is exactly EXT-01…05 / EXT2-01…05 / EXT3-01…05 across the 3 APIs — the
"why did the AI miss this" reasoning recorded for every one of those 15 cases converges
on one of these four structural blind spots in single-pass, single-field generation.*

### Stage 5 — Emit
Produce: a Postman collection (folder per stage — setup / data-driven body-or-query
variation / stateful verification, **not** one folder that blindly replays setup on every
CSV row), a CSV data file per data-driven folder, and an audit-trail document per stage
(generation log, audit log, extension log) with reasoning, not just pass/fail.
*Grounded in: the setup/data-driven/verify folder split exists specifically because a
single-folder + `-d` run replays stateful setup requests on every iteration — discovered
the hard way during API2's first dry-run.*

### Stage 6 — Execute & lock
Run the emitted collection via Newman. Any assertion failure at this stage is fed back as
a **second** correction pass — even Stage 3's verification can miss something (a
generalization from one similar case applied to a case that wasn't actually re-checked
individually; a stale value colliding with prior test data) — so this stage is not
optional even after Stage 3.
*Grounded in: PA-34 (an audit generalization from PA-12 that didn't hold), and PC-33
(a UNIQUE-constraint collision with earlier manual testing) — both were only caught here,
not at Stage 3.*

## 4. Pseudocode

```python
def generate_api_test_suite(endpoint_spec, sut_source_path=None, sut_live_url=None,
                              sec_checklist=SEC_01_TO_07):
    # --- Stage 1: Ground ---
    grounding = {
        "method": endpoint_spec.method,
        "path": endpoint_spec.path,
        "params": endpoint_spec.params,          # query/body fields + documented types
        "response_schema": endpoint_spec.response_schema,
        "requires_auth": endpoint_spec.requires_auth,
    }
    if sut_source_path:
        handler_code = read_handler_source(sut_source_path, endpoint_spec)
        grounding.update({
            "uses_raw_sql": detect_string_concatenated_query(handler_code),
            "checks_role": detect_role_check(handler_code),
            "db_schema": read_related_table_schema(sut_source_path, endpoint_spec),
            "validates_fields": detect_input_validation(handler_code),
        })

    # --- Stage 2: Generate (3 independent lenses) ---
    domain_cases   = generate_domain_partition_cases(grounding.params, grounding.db_schema)
    security_cases = generate_security_cases(grounding, sec_checklist)
    schema_cases   = generate_schema_cases(grounding.response_schema)
    candidates = domain_cases + security_cases + schema_cases   # target >= 35

    # --- Stage 3: Verify (the gate -- every candidate must clear this) ---
    verified = []
    for case in candidates:
        actual = execute_against_live_sut(sut_live_url, case.request)
        if actual != case.predicted_expectation:
            case.audit_label = "INVALID" if case.predicted_expectation.status_class_differs(actual) \
                                else "INCOMPLETE"
            case.audit_reasoning = explain_mismatch(case.predicted_expectation, actual, grounding)
            case.predicted_expectation = actual          # observed behavior wins
        else:
            case.audit_label = "VALID"
        verified.append(case)

    # --- Stage 4: Extend (structural blind spots Stage 2 cannot reach) ---
    extended = []
    extended += generate_combined_hostile_case(verified)            # all fields adversarial at once
    extended += generate_cross_endpoint_chain_cases(grounding, sut_source_path)
    extended += generate_comparative_contrast_cases(verified)       # e.g. 0 vs -5 falsy-boundary
    extended += generate_cross_api_pattern_probe(grounding, prior_findings_registry)
    for case in extended:
        case.actual = execute_against_live_sut(sut_live_url, case.request)
        case.why_ai_missed_it = explain_structural_blind_spot(case)  # Stage 4's contract
    require(len(extended) >= 5)

    all_cases = verified + extended

    # --- Stage 5: Emit ---
    collection = build_postman_collection(
        endpoint_spec,
        stages=split_by_statefulness(all_cases),   # setup / data-driven / verify folders
    )
    data_files = {stage: build_csv(cases) for stage, cases in collection.data_driven_stages()}
    audit_trail = {
        "generation_log": render_generation_log(candidates, grounding),
        "audit_log":      render_audit_log(verified),
        "extension_log":  render_extension_log(extended),
    }

    # --- Stage 6: Execute & lock ---
    results = run_newman(collection, data_files)
    for failure in results.failures:
        # A failure here means Stage 3/4 missed something -- correct and re-run,
        # never silently adjust the assertion to just make it pass.
        root_cause = diagnose_failure(failure, sut_live_url)
        apply_correction(collection, data_files, audit_trail, root_cause)
    final_results = run_newman(collection, data_files)
    require(final_results.failures == [])

    return collection, data_files, audit_trail, final_results
```

## 5. Diagram

**🔴 MANUAL — self-drawn, not AI-generated (Section 11 anti-cheat requirement).**
Draw the 6-stage pipeline above (Ground → Generate → Verify → Extend → Emit →
Execute & Lock) as a flowchart, with:
- The **Verify** stage shown as a decision gate feeding back into itself (mismatch →
  correct expectation → re-verify), since that's the design's core mechanism.
- The **Execute & Lock** stage's failure path looping back to Verify/Extend, not just to
  itself — it's a second correction pass, not a rubber stamp.
- Optionally, annotate each stage with which real bug/finding from this homework it's
  grounded in (see the "Grounded in" notes in Section 3 above), to show the design isn't
  generic.

Any tool is fine (paper + photo, Excalidraw, draw.io, PowerPoint) as long as *you* made
the layout/shape decisions — not an AI image generator or an AI-driven diagramming
prompt.
