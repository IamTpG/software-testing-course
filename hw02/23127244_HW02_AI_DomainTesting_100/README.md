# HW02 — Domain Testing on EShop

**Student:** Lê Thiên Phú (`23127244`) · **Fork:** https://github.com/IamTpG/eshop-sut
**AI tool:** Claude Code (Claude Sonnet 5 / Opus 4.8) — declared in the AI Audit Report

Domain Testing and Boundary Value Analysis applied to four EShop features (one per pool),
driven by a custom `domain-testing` Agent Skill using a strict 6-step, human-in-the-loop
workflow. Every test case was executed for real — API cases via `curl`, UI/mobile cases
manually — and each defect is evidenced with a GitHub Issue (screenshot attached there).

---

## Self-assessment (assessment template §15)

| No. | Criteria | Max | Self-assessed |
|---|---|---|---|
| 1 | Feature A — FR-04 Profile (Domain + Boundary) | 25 | 25 |
| 2 | Feature B — FR-08 Checkout (Domain + Boundary) | 25 | 25 |
| 3 | Feature C — FR-19 Admin Users (Domain + Boundary) | 25 | 25 |
| 4 | Feature D — FR-11 Order History, Mobile (Domain + Boundary) | 15 | 15 |
| 5 | Agent Skills | 10 | 10 |
| | **Total** | **100** | **100** |

> The self-assessed grade also forms the ZIP filename:
> `23127244_HW02_AI_DomainTesting_100.zip`.

---

## Test summary report

| Feature | Designed | Executed | Passed | Failed | Not executed | Bugs |
|---|---:|---:|---:|---:|---:|---:|
| FR-04 — Profile Management | 37 | 37 | 18 | 19 | 0 | 5 |
| FR-08 — Checkout | 20 | 20 | 6 | 14 | 0 | 4 |
| FR-19 — Admin User Management | 15 | 15 | 4 | 11 | 0 | 3 |
| FR-11 — Order History (Mobile) | 11 | 11 | 9 | 2 | 0 | 2 |
| **Total** | **83** | **83** | **37** | **46** | **0** | **14** |

- **Features tested:** 4 (one per pool A/B/C/D)
- **Test cases designed:** 83 · **executed:** 83 · **not yet executed:** 0
- **Passed:** 37 (system behaved per spec) · **Failed:** 46 (revealed a defect)
- **Confirmed in-scope bugs:** 14 (each filed as a GitHub issue with a screenshot)
- **Bonus findings (out of the 4 features' scope, noted separately):** 2 — the `SAVE10`
  coupon-math inversion (FR-09) and the mobile order-history staleness (sync/FR-20)
- **Demo videos:** _[YouTube link](https://youtu.be/JARFqrMMOLU)_

> Pass/Fail is derived from each report's per-case "Actual / Bug flag" column: **Pass** =
> observed behavior matched the spec; **Fail** = the case revealed a confirmed defect. A few
> borderline "executed, no observable defect" cases (e.g. FR-04 TC-30) are counted as Pass.
> "Failed test cases" (46) is larger than "bugs" (14) because many cases exercise the same
> underlying defect (e.g. FR-08's eleven `total_amount` tampering cases all stem from one
> missing-recalculation bug).

---

## Repository contents

| Path | Contents |
|---|---|
| `MainReport.pdf` | Combined PDF: Main Report + all 4 feature reports, in one document |
| `reports/MainReport.md` | Umbrella report: methodology, consolidated bug inventory, **AI Gap Analysis** |
| `reports/FR-04-ProfileManagement/DomainTesting_BVA.md` | Full FR-04 Domain Testing + BVA report |
| `reports/FR-08-Checkout/DomainTesting_BVA.md` | Full FR-08 report |
| `reports/FR-19-UserManagement/DomainTesting_BVA.md` | Full FR-19 report |
| `reports/FR-11-OrderHistory-Mobile/DomainTesting_BVA.md` | Full FR-11 report |
| `Bug-Report.md` / `Bug-Report.pdf` | Standalone bug report — all 14 confirmed defects, cross-linked to their GitHub Issues |
| `AI-Critique.md` / `AI-Critique.pdf` | AI Critique (§10) |
| `AI-Audit-Report.md` / `AI-Audit-Report.pdf` | AI Audit Report (§9) — per-artifact prompt/output/verdict table, tally, disclosure |
| `commit_log.txt` | Full git commit history (§12) |
| `skills/domain-testing/SKILL.md` | The `domain-testing` Agent Skill (§7) |
| `prompt_log.txt` | Raw AI interaction log — source material for the AI Audit Report |

> Bug screenshots are attached directly to each GitHub Issue (linked from the reports' defect
> summaries) rather than duplicated as local files in this submission.

---

## How the work was done

1. **Design** — `/domain-testing` skill walked step-by-step through variable hunt → EP →
   BVA → combinatorics → test-case generation for each feature (recorded in `prompt_log.txt`).
2. **Execute** — API cases run via `curl` against a freshly-seeded backend; UI/mobile cases
   run manually. Each report's "Actual" column holds observed results, not predictions.
3. **Report** — bugs documented in the per-feature reports, the Main Report inventory, and
   as GitHub issues with screenshots.

> **On git commit granularity (§12):** the assignment asks for a commit per testing step.
> The step-by-step procedure itself was performed in dedicated `/domain-testing` sessions
> and is preserved verbatim in `prompt_log.txt`; commits here are grouped per completed
> deliverable (skill, per-feature report, execution results, evidence). The full commit log
> is provided as a separate text file.
