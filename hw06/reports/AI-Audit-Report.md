# HW06 — AI Audit Report (Mandatory Appendix, Section 9)

**Declaration:** *I use AI tools for the following tasks.*

**AI tool used:** Claude (Claude Sonnet 5), via Claude Code CLI, for the entire pipeline —
reading SUT source, generating test cases, empirically verifying them, auditing,
extending, building Postman collections + Newman data files, executing test runs,
setting up CI/CD, designing the Agent Skill, and drafting all reports including this one.

**No other AI tool was used** (no ChatGPT/Gemini/Copilot/Cursor) — Claude Code was used
throughout the whole homework in one continuous session per work period, driven
interactively step-by-step rather than with single generic prompts, per Section 6's
requirement.

This report is a condensed, chronological index of that session. Full prompt/output
detail for each generation pass is preserved in the per-API `generation-log.md` files
(which record the actual paraphrased prompts and outputs) — this document exists to give
the required tool/date/prompt/output shape at the top level without duplicating that
content wholesale.

## Phase 0 — Setup (2026-08-19, ~11:15–11:32)

| Time | Prompt (paraphrased) | Output |
|---|---|---|
| 11:15 | "Suggest APIs needing the least effort — least setup, simplest fields — across Pool A/B/C, avoiding my groupmate's picks (login, checkout, admin-orders-status)." | Recommended `GET /api/products`, `POST /api/cart`, `POST /api/admin/coupons` with a rationale table; user confirmed via AskUserQuestion. |
| 11:20 | "Start Phase 0: re-sync the fork, vendor a fresh clone, confirm the 3 endpoints respond, locate SEC-01–07." | Re-synced `IamTpG/eshop-sut`, vendored into `hw06/eshop-sut/`, found port 3000 conflicted with an unrelated local project (patched `PORT` env override), confirmed all 3 endpoints live, located SEC-01–07 in the fork's `README.md` (not the API spec doc). Commit `d634152`. |

## Phase 1 — API pipelines (2026-08-19, 11:42–12:33)

Each of the 3 APIs went through the same 4-interaction cycle (generate → audit → extend →
execute), each its own commit. Representative entries below; full detail in
`test-cases/API{1,2,3}-{generation,audit,extension,execution}-log.md`.

| Time | API | Step | Prompt (paraphrased) | Output |
|---|---|---|---|---|
| 11:42 | 1 | Generate | "Read the `GET /api/products` handler before generating anything; then generate domain-partition, security, and schema cases as 3 separate passes." | Found raw SQL string concatenation (SEC-05). 38 cases. Commit `c84e013`. |
| 11:43 | 1 | Audit | "Verify each of the 38 cases empirically against the live SUT; correct any wrong expected values with reasoning." | 4/38 corrected (whitespace/parsing assumptions). Commit `d4fa6d1`. |
| 11:43 | 1 | Extend | "Add ≥5 cases the generation pass structurally couldn't reach — combined-hostile, cross-endpoint, comparative, or negative-scoping cases." | 5 cases, headlined by a UNION-based credential-exfiltration SQLi. Commit `69265a7`. |
| 11:52 | 1 | Execute | "Build the Postman collection + CSV, run via Newman, fix any real execution-time failures." | 43/43 pass after fixing PA-34 (caught only at execution, not audit). Commit `08f96bf`. |
| 12:07 | 1 | Bugs | "Draft the GitHub Issues for the confirmed bugs, don't post yet." | Critical (SQLi+plaintext passwords) + Low (Content-Type inconsistency) drafted. Commit `0e10806`. |
| 12:11–12:21 | 2 | (same 4 steps) | "Read `POST /api/cart` + auth middleware first; then generate/audit/extend/execute." | Found zero field validation. 40 generated (4 corrected), 5 extended, 45/45 executed. Commits `c320779`…`6d63e62`. |
| 12:24–12:33 | 3 | (same 4 steps) | "Read `POST /api/admin/coupons` + `DELETE .../:id` + coupons schema first; then generate/audit/extend/execute." | Found **no role check on either admin handler** before writing a single test case. 40 generated (7 corrected — the most of any API), 5 extended (headlined by a full non-admin create+delete lifecycle proof), 45/45 executed after fixing a real mid-execution data-contamination bug (PC-33). Commits `6a94d30`…`86622b4`. |

## Phase 2 — Postman features & CI/CD (2026-08-19, 13:17–13:23)

| Time | Prompt (paraphrased) | Output |
|---|---|---|
| 13:17 | "Set up GitHub Actions running Newman against the vendored SUT, triggered on hw06/** changes." | `.github/workflows/hw06-api-tests.yml` added; first push triggered an all-green run (`32222854961`, 32s). Commit `3635afc`. |
| 13:19 | "Deliberately break exactly one test case for the CI/CD demo requirement, push, capture the failing run." | Edited `PA-03`'s expected count; run `32222958305` failed with exactly 1 assertion failure. Commit `57db2f3`. |
| 13:21 | "Revert the deliberate failure, confirm green again." | Run `32223059167` confirmed green. Commit `96c2e41`. |
| 13:22 | "Write the CI/CD report with both runs' links and the pipeline config." | `CICD-Report.md` written. Commit `41c1bcd`. |

## Phase 3 — Agent Skill (2026-08-19, 13:34)

| Time | Prompt (paraphrased) | Output |
|---|---|---|
| 13:34 | "Design a 6-stage AI test generator, grounded explicitly in mistakes this homework's own pipeline made — not generic textbook stages. Write pseudocode. Build a reusable skill. Demo it on a new endpoint, not one of the 3 graded APIs." | `AI-Test-Generator-Design.md` (design + pseudocode), `.claude/skills/api-test-generator/SKILL.md`, and a full demo trail against `POST /api/register` (`skill-demo/`) — 21 cases, 3 corrections, 5 extensions, 2 clean Newman runs, 3 bonus findings (plaintext passwords confirmed at the source, silent account-lockout bug, no format validation). Commit `6adfc27`. |

## Human review discipline applied throughout

Every AI-generated test case's *expected value* was treated as a hypothesis, not a fact,
until checked against the live SUT (`curl` first, then the actual Postman/Newman
request) — this is the single mechanism behind every audit correction and extension case
in this homework. Concretely:
- **15 of 118** AI-generated cases across the 3 graded APIs had a wrong expected value,
  caught and corrected with documented reasoning (see each `audit-log.md`).
- **2 additional mistakes** (PA-34, PC-33) survived the audit pass and were only caught
  when the Postman/Newman suite was actually run — documented honestly rather than
  silently patched, in each `execution-log.md`.
- **7 bugs** in the SUT itself were found this way, ranging from Critical (SQL injection,
  broken access control) to informational (no JWT expiry) — none were accepted from the
  AI's first draft without independent empirical confirmation.

## AI Critique

See `AI-Critique.md` for the required 200–300 word reflection.
