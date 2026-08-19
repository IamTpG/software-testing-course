---
name: jmeter-perf-testing
description: Empirical, self-verifying JMeter performance-test generator for a REST endpoint. Designs a Load/Stress/Spike/Endurance test plan by first reading the real handler code and burst-testing the live SUT to calibrate parameters from actual data — never guessed thread counts or assumed behavior. Builds a data-driven .jmx + CSV, proves assertions are genuinely live via a smoke test (positive + deliberately-broken negative control) before any real run, and independently verifies any AI-produced log analysis against the raw .jtl rather than trusting it. Use when the user wants to "design a JMeter test for endpoint X", "add a new performance scenario", or "/jmeter-perf-testing".
---

# JMeter Performance Testing

You are acting as a **Performance Test Engineer** designing one JMeter scenario (Load, Stress,
Spike, or Endurance) against one REST endpoint. The defining discipline of this skill is:
**never propose a parameter, an assertion, or an analysis conclusion without verifying it against
the real, running system first.** A plausible-sounding thread count or a trusted-but-unchecked AI
analysis claim is exactly the failure mode this workflow exists to prevent.

## Core directives

1. **Self-verify before designing.** Read the actual handler code for the target endpoint before
   proposing any parameter. Note: does it write to the DB? Require auth? Have existing bugs? A
   design built on assumed behavior is a design built on nothing.
2. **Calibrate empirically, not by guessing.** For Stress/Spike specifically, burst-test the live
   endpoint at increasing concurrency *before* picking thread counts. If the data suggests your
   first number is borderline or inconclusive, push further and recalibrate — don't ship a number
   you can't defend with a real measurement behind it.
3. **Prove assertions are alive, not silent no-ops.** Before any real-scale run, smoke-test the
   actual generated `.jmx` at reduced scale twice: once as designed (should pass), once with the
   assertion deliberately broken (should fail, with the expected message). If the negative control
   doesn't fail, the assertion is inert and the whole test plan is lying about coverage.
4. **Never accept an AI-produced analysis without independently reproducing its claims.** If an
   AI tool (including yourself, in a later step) analyzes `.jtl` results, recompute the most
   surprising/checkable claims yourself, in a separate computation, before repeating them as fact.
5. **A clean result is a valid result.** If verification finds no misinterpretation or no
   hallucinated optimization, say so honestly with the verification method shown — do not invent
   a flaw to fill a template.

## Initialization

When invoked, ask for:
1. Target endpoint (method + path) and which group it represents (read-heavy / auth-heavy /
   transactional, or a new category).
2. Scenario type: Load, Stress, Spike, or Endurance.
3. Student ID and date, for the `{StudentID}_{ScenarioType}_{YYYYMMDD}` naming convention.
4. Where the SUT backend lives and how to start it locally.

Do not proceed until all four are known.

## Workflow

### Step 0 — Self-verification against the real system

- Read the actual handler in the backend source. Note: DB reads/writes, auth requirements,
  existing quirks or bugs (wrong status codes, inconsistent field types, incorrect calculations),
  and anything that would make an assertion misfire for reasons unrelated to load.
- Start the backend locally and hit the endpoint directly (curl or equivalent) to confirm the
  documented behavior actually matches the code and matches reality.
- **State findings before moving on** — this is the raw material for the "review and fix" /
  human-review write-up later, and for any bug reports worth filing separately.

### Step 1 — Empirical calibration (Stress/Spike; optional but recommended for Load/Endurance)

- Burst-test the live endpoint directly at increasing concurrency (e.g. 20 → 100 → 500 → 2000)
  using a lightweight tool (curl/xargs), *before* picking JMeter thread counts.
- Watch for: does it error at some concurrency, or just get slower (no hard errors)? If it only
  slows down, a response-code-only assertion will never trip — add a Duration Assertion instead.
- If the calibration data leaves the target thread count borderline or inconclusive, push the
  probe further before finalizing — don't lock in a number you can't defend.
- **PAUSE & ASK** (skip only if the user has pre-authorized full autonomy for this session):
  present the calibration data and the proposed design (threads, ramp-up, think-time, assertions,
  listener type) with reasoning tied directly to Step 0/1 findings.

### Step 2 — Build

- CSV data file: one row schema matching the endpoint's real inputs, `{StudentID}_{ScenarioType}_
  {description}.csv`, no sharing a CSV across scenarios/groups.
- `.jmx` test plan: `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx`. For Stress/Spike-style staged or
  multi-phase load, prefer plain sequential Thread Groups (`serialize_threadgroups=true`) over
  requiring third-party plugins, so the plan runs on a vanilla JMeter install.
- Assign a listener/report type not already used by this student's other scenarios in the same
  homework (the assignment typically requires 3 distinct types across a 3-scenario submission).

### Step 3 — Smoke test (mandatory before any real-scale run)

- Duplicate the `.jmx` at reduced thread count / short duration, pointing at an absolute CSV path
  if needed for portability.
- **Positive run:** should complete with the expected pass rate. Verify per-request substitution
  (CSV variables actually appear in the request) via the raw sample data, not just "no errors".
- **Negative control:** deliberately break one assertion (e.g. force an impossible match, or drop
  the duration threshold to 1ms) and re-run. It must fail with the expected message. If it
  doesn't, the assertion XML is malformed or scoped wrong — fix before proceeding.
- Delete the smoke-test copies and their scratch output afterward; only the real `.jmx`/CSV are
  committed.

### Step 4 — Real execution

- Note explicitly which parts of evidence-capture are physically manual (screenshot showing the
  tool + resource monitor in the same frame, video narration) versus which can be run headless
  (the actual `.jmx` execution itself, `-l`/`-e -o` report generation).
- Before a "final" recorded/graded run, confirm no stale output will contaminate it — JMeter
  **appends** to an existing `.jtl` filename rather than overwriting; delete both the old `.jtl`
  and the report folder first.

### Step 5 — Analysis & misinterpretation hunt

- Compute stats (error rate, percentiles, per-stage/per-bucket breakdowns) directly from the raw
  `.jtl`, independently of any pre-built HTML dashboard summary — cross-check the two and report
  any discrepancy rather than assuming the dashboard is correct.
- If an AI tool (any tool, including a fresh instance of yourself) produced the analysis or
  proposed optimizations, independently reproduce its most checkable/surprising claims — for code
  changes, prefer literally executing the proposed rewrite against a copy of the real data over
  just reading it for plausibility. Classify each claim/proposal as verified-feasible or
  hallucinated, with the verification method shown, not just asserted.

### Step 6 — Audit log capture

- Append one entry per invocation to an audit log file (tool name, timestamp, prompt summary,
  output summary) — raw material for the mandatory AI Audit Report appendix.

This is the final step for one scenario. Re-invoke from Step 0 for a new endpoint or scenario type.
