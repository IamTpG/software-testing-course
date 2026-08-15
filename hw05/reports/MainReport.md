# HW05 — Performance Testing on EShop: Main Report

| | |
|---|---|
| **Exercise** | HW05-AI — Performance Testing on EShop |
| **Student** | Lê Thiên Phú (`23127244`) |
| **SUT** | https://github.com/ttbhanh/eshop-sut, vendored fresh into `hw05/eshop-sut/` |
| **AI tool used** | Claude Code (Claude Sonnet 5) throughout, plus one independent fresh Claude session for Task 2's analysis step — see `AI-Audit-Report.md` |
| **Tool** | Apache JMeter 5.6.3 (non-GUI), portable install under `hw05/tools/` |
| **Endpoint groups** | Read-heavy = `GET /api/products/:id`, Auth-heavy = `POST /api/forgot-password`, Transactional = `POST /api/apply-coupon` (not duplicated with groupmates) |

Supporting documents this report summarizes and synthesizes across:

- [Hardware Report](Hardware-Report.md)
- [Endurance / Soak Test — Empirical Threshold](Endurance-Threshold.md)
- [AI Log Analysis](AI-Log-Analysis.md) and [Optimization Proposals](Optimization-Proposals.md) (independent fresh-session output)
- [AI Misinterpretation Hunt & Optimization Judgment](AI-Misinterpretation-Hunt.md)
- [Continuous Performance Testing Proposal](Continuous-Performance-Testing-Proposal.md) (Task 3)
- [GitHub Issues draft / posted bugs](github-issues-draft.md)
- [AI Audit Report](AI-Audit-Report.md) · [AI Critique](AI-Critique.md)
- [`../TASKS-CHECKLIST.md`](../TASKS-CHECKLIST.md) — the full step-by-step working log, timestamped

---

## 1. Scope

Per Section 5, each of the 3 endpoint groups was mapped to exactly one scenario type:

| Group | Endpoint | Scenario | Why this pairing |
|---|---|---|---|
| Read-heavy | `GET /api/products/:id` | **Load** | Cheapest, most frequently-hit read in a real storefront — models everyday steady traffic |
| Auth-heavy | `POST /api/forgot-password` | **Stress** | Does a real DB write (SELECT+UPDATE); SQLite's single-writer model makes it the endpoint most likely to have a genuine breaking point |
| Transactional | `POST /api/apply-coupon` | **Spike** | Business-logic-heavy calculation step; chosen to test resilience to a sudden burst rather than a sustained ramp |

A 4th scenario, **Endurance/soak**, was also run per Section 6's requirement (against `forgot-password`, the endpoint with a demonstrated bottleneck — see §3).

---

## 2. Task 1 — AI-assisted design, execution, and human review

### 2.1 Methodology: self-verify → calibrate → build → smoke-test → execute

Every scenario followed the same discipline, driven step-by-step rather than by a single generic
prompt (full detail and reasoning trail in `TASKS-CHECKLIST.md` Phase 1-3):

1. **Self-verify against the real system first** — read the actual handler code and hit the live
   endpoint directly, before proposing any parameter. This alone found 3 of the 4 bugs reported in
   §2.4, all *before* any load was ever applied.
2. **Calibrate empirically, not by guessing** — for Stress and Spike, burst-tested the live
   endpoint at increasing concurrency using lightweight curl bursts before picking JMeter thread
   counts, and pushed further when the data left a number borderline (Stress's Stage 4 was bumped
   30VU→400VU after 300VU looked inconclusive; Spike's magnitude was probed to 2000 concurrent).
3. **Build**, following the required naming convention `23127244_{ScenarioType}_20260815`, one CSV
   per scenario (never shared), 3 distinct listener types across the 3 plans.
4. **Smoke-test before any real run** — a reduced-scale positive control (should pass) and a
   deliberately-broken negative control (should fail with the expected message), proving every
   assertion is genuinely live, not inert XML, before committing to the real execution.
5. **Execute for real**, with evidence: resource-monitor + tool screenshots in the same frame
   (Load/Stress/Spike screenshots confirmed by content, Machine ID redacted before committing),
   an OBS recording with Vietnamese narration (≥6 min, all 3 scenarios), raw `.jtl` logs, and full
   HTML dashboard reports.

### 2.2 Human review — what the design process caught and corrected

- **Stress Stage 4 thread count**: an initial 300 VU was reconsidered and bumped to 400 VU after
  burst-calibration data (up to 700 concurrent, no hard errors, only growing latency) suggested
  300 might produce a borderline, inconclusive result — corrected *before* building, not after a
  wasted run.
- **Spike's design philosophy**: an initial instinct to hunt for a breaking point (mirroring
  Stress) was corrected once calibration data (0% errors up to 2000 concurrent) showed this
  endpoint doesn't have one in the tested range — redesigned around resilience/recovery
  (baseline→spike→recovery) instead of an escalating staircase, which is the textbook-correct
  distinction between the two scenario types.
- **Real vs. probed results diverged once**: design-time curl probes suggested Spike had "no
  breaking point," but the real, sustained 500-VU JMeter run produced 136 Duration Assertion
  failures the one-shot probe didn't predict (root-caused: sustained concurrent load + JMeter's own
  JVM overhead on the same laptop differs from a momentary burst). Corrected understanding, not
  hidden — this is exactly why the AI Critique (§5) centers on this gap.

### 2.3 Results

| Scenario | Samples | Errors | Error rate | Notable finding |
|---|---|---|---|---|
| Load | 4,265 | 0 | 0.00% | No meaningful bottleneck; avg 1.22ms, max 32ms |
| Stress | 24,681 | 79 | 0.32% | Real breaking point between 150→400 VU: p95 jumps 49ms→691ms (~14x) for a 2.7x VU increase — SQLite single-writer queueing collapse |
| Spike | 32,699 | 136 | 0.42% | All failures are Duration Assertion breaches (HTTP 200 throughout), concentrated 100% in the spike stage; system never hard-fails, just breaches its own SLA under sustained burst |
| **Endurance** | 209,748 | 0 | 0.00% | **285.6 req/s sustained for 12 min, 0 errors** — see §3 |

All 4 raw `.jtl` files + HTML dashboards are committed under `results/`.

### 2.4 Bugs found and reported

Found incidentally during self-verification (Task 1's design step), not the focus of this
homework, but genuine and worth recording per Section 6:

| # | Bug | Severity | Status |
|---|---|---|---|
| [#7](https://github.com/IamTpG/software-testing-course/issues/7) | `products/:id` price field flips string/number by id parity | Minor | Posted |
| [#8](https://github.com/IamTpG/software-testing-course/issues/8) | `products/:id` returns HTTP 200 `{}` instead of 404 for unknown id | Minor | Posted |
| [#9](https://github.com/IamTpG/software-testing-course/issues/9) | `apply-coupon` percent-discount formula produces a large *negative* discount | Major | Posted |
| #4 (draft) | `products?search=` SQL injection — unauthenticated arbitrary WHERE-clause injection | **Critical** | **Drafted, not auto-posted** — found during the Agent Skill demo (§4); posting a working exploit payload was correctly blocked by safety controls, needs manual review (`github-issues-draft.md`) |

---

## 3. Endurance / soak test — empirical hardware threshold

12-minute flat 150 VU run against `forgot-password` (calibrated from Stress's own Stage 3 data,
which only ran clean for ~30s — too short to trust on its own). Full detail in
[`Endurance-Threshold.md`](Endurance-Threshold.md).

- **Maximum stable RPS: 285.6 req/s, 0% errors** across all 209,748 samples, no degradation trend
  in any of the 12 per-minute buckets — actually *higher* than the 30-second Stress snapshot
  suggested (222.6 req/s), consistent with no competing adjacent stage and JIT/connection warm-up.
- **Memory ceiling: peak 192.6 MB** during warm-up (t=120s, not at the end), then GC-compacted to
  a stable 88-116 MB for the remaining ~10 minutes — healthy garbage collection, not a leak.

---

## 4. Agent Skill

Built `.claude/skills/jmeter-perf-testing/SKILL.md`, encoding this homework's actual discipline
(self-verify → calibrate → build → smoke-test → execute → analyze) as a reusable workflow.
Demonstrated end-to-end on a **new** endpoint, `GET /api/products?search=`, not one of the 3
graded scenarios — real output in `skill-demo/`, not a paper skill:

- Step 0 (self-verify) found the SQL injection in §2.4 — confirmed live and non-destructively.
- Steps 1-5 completed cleanly: 20 VU Load-style design, smoke-tested (positive + negative
  control), real execution (1,059 samples, 0 errors, p95=3ms), independently cross-checked
  against the dashboard.
- Two actions were correctly blocked by the session's own safety controls rather than
  worked around: a `UNION SELECT`-based credential-extraction proof-of-concept, and posting
  the exploit write-up publicly. Both left for manual human decision.

Demo video (skill run end-to-end): see `README.md`'s submission section for the link.

---

## 5. Task 2 — AI analysis & misinterpretation hunt

Summary here; full detail, verification tables, and methodology in
[`AI-Misinterpretation-Hunt.md`](AI-Misinterpretation-Hunt.md).

An independent fresh Claude session (no access to this conversation) was given 2 self-contained
prompts: (1) analyze all 4 raw `.jtl` files directly and propose CI thresholds, (2) propose
concrete optimizations tied to the findings, verified against live runtime state. Its output was
then **independently re-verified**, not trusted — recomputing key statistics with separate code,
re-querying the live database directly, and for the two proposed SQL rewrites, actually **executing
both against a copy of the real database** and comparing results byte-for-byte.

**Misinterpretation hunt result:** no real misinterpretation found. Every checkable claim held up,
including the boldest one — that JMeter's own dashboard reports a **6.5x-wrong median** for Stress
(175ms vs. the true 27ms, confirmed two independent ways). Reported honestly as "verified clean"
rather than manufacturing a flaw to fill the template.

**Optimization judgment result: 8/8 classified feasible, 0 hallucinated.** Both proposed SQL
rewrites (WAL-adjacent query-collapsing for `forgot-password` and `apply-coupon`) were tested
against real data and preserve exact semantics; live PRAGMA state, SQLite version, and index list
were all independently re-queried and matched.

---

## 6. Task 3 — Continuous Performance Testing proposal

Full proposal, flow chart, and trade-off discussion: [`Continuous-Performance-Testing-Proposal.md`](Continuous-Performance-Testing-Proposal.md).

Summary: a tiered decision model (Skip → Smoke → Regression → Full) driven by path filters
(`backend/**` touched?) and event type (regular PR / merge / nightly / manual label), grounded in
this homework's own asymmetric findings — Load showed no cliff in any test run, Stress and Spike
both have demonstrated real breaking points, and Endurance's 12-minute cost only pays off at
nightly frequency. Regressions are flagged via two distinct checks (an absolute hard ceiling from
Task 2's gates, and a rolling 7-run baseline-drift check for slow trends a fixed ceiling would
miss), with a double-breach confirmation rule before blocking a merge, to reduce false positives
from CI-runner noise without silently ignoring a persistent regression.

---

## 7. Conclusion

Across 4 real JMeter runs (261,393 total samples) and one independently-verified AI analysis
round, this homework's central, consistently-reproduced finding is the asymmetry between a
read-only endpoint (`products/:id`, no meaningful limit found anywhere in the tested range) and a
write endpoint constrained by SQLite's single-writer model (`forgot-password`, a real, repeatedly
confirmed breaking point between 150-400 VU). That asymmetry shaped every downstream decision in
this homework — which scenario type paired with which endpoint, how the Endurance test was
targeted, and how Task 3's tiered CI model allocates its most expensive test only where the
evidence says it's worth the cost.

See `AI-Critique.md` for the required reflection on AI collaboration.
