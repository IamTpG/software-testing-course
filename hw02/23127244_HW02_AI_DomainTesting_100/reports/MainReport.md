# HW02 — Domain Testing on EShop: Main Report

| | |
|---|---|
| **Exercise** | HW02-AI — Domain Testing on EShop |
| **Student** | Lê Thiên Phú (`23127244`) |
| **Fork under test** | https://github.com/IamTpG/eshop-sut |
| **AI tool used** | Claude Code (Claude Sonnet 5 / Opus 4.8) — see AI Audit Report appendix |
| **Techniques** | Equivalence Partitioning (EP), Boundary Value Analysis (BVA), combinatorial selection |

This is the umbrella report. Each feature has a full, standalone Domain Testing + BVA report with the complete step-by-step derivation, variable matrices, partition maps, boundary tables, and per-test-case execution results:

- [FR-04 — Personal Profile Management](FR-04-ProfileManagement/DomainTesting_BVA.md)
- [FR-08 — Checkout](FR-08-Checkout/DomainTesting_BVA.md)
- [FR-19 — User Management (Admin)](FR-19-UserManagement/DomainTesting_BVA.md)
- [FR-11 — Order History View (Mobile)](FR-11-OrderHistory-Mobile/DomainTesting_BVA.md)

---

## 1. System Under Test & feature selection

**SUT:** EShop — a Vietnamese e-commerce demo application (React web + React admin + React Native mobile + Express/SQLite backend), pulled from the instructor repository and forked.

Four features were selected, one per pool, per the assignment's no-duplication rule:

| Pool | Feature | Surface |
|---|---|---|
| A | FR-04 — Personal Profile Management | Web (`PUT /api/users/me`) |
| B | FR-08 — Checkout | Web (`POST /api/checkout`) |
| C | FR-19 — User Management (Admin) | Admin panel (`GET`/`DELETE /api/admin/users`) |
| D | FR-11 — Order History View | Mobile (`GET /api/orders/my-orders`, `/orders/:id`) |

---

## 2. Methodology

Testing was driven by a custom Claude Code **`domain-testing` Agent Skill** built for this assignment (submitted separately with a demo video). The skill enforces a strict, human-in-the-loop 6-step workflow, and the AI was used as a *disciplined assistant* walked through every step — never as a single black-box "find the bugs" prompt.

| Step | Activity |
|---|---|
| 0 | Pre-requisite validation — read the actual source (frontend, backend route, DB schema), compare code against the instructor's spec, elicit ambiguities |
| 1 | Variable hunt — enumerate explicit and implicit input/output/state variables |
| 2 | Domain + Equivalence Partitioning — define each variable's domain, split into valid/invalid classes |
| 3 | Boundary Value Analysis — LB/LB±1, UB/UB±1 on ordered domains |
| 4 | Multi-variable dependencies & combinatorial strategy (Pairwise / Exhaustive / Isolated-Boundaries + Happy-Path) |
| 5 | Test-case generation with selection optimization (combine valid classes, isolate invalid classes) |

After design, every **Direct-API** test case was executed for real via `curl` against a freshly-seeded backend, and every **UI/Mobile** test case was executed manually in the browser / Expo app. Each report's "Actual / Bug flag" column records observed results, not predictions.

---

## 3. Results summary

| Feature | Test cases designed | Channel split | Distinct confirmed defects |
|---|---|---|---|
| FR-04 Profile | 37 | API + UI | 5 |
| FR-08 Checkout | 20 | API + UI | 4 |
| FR-19 Admin Users | 15 | API + UI | 3 |
| FR-11 Order History | 11 | API + UI | 2 |
| **Total** | **83** | | **14 in-scope + 2 bonus** |

> The 14 in-scope defects are each filed as a GitHub issue (see `github-issues/`). Test-case
> pass/fail/not-executed counts are in `HW02-README.md`, derived from each report's per-case
> "Actual" column.

---

## 4. Consolidated bug inventory

Severity: **CRIT** = critical (security or spec-core violation), **MAJ** = major functional defect, **MIN** = minor / contract inconsistency.

### FR-04 — Profile Management

| # | Sev | Defect | Test cases | Screenshot | Issue |
|---|---|---|---|---|---|
| 1 | CRIT | **Role privilege escalation** — `PUT /api/users/me` writes a client-supplied `role`, letting any user self-promote to `admin` | TC-31, TC-33 | `FR-04-TC-31-1/2` | [BUG-A-10 #32](https://github.com/dinosauce-285/Software-Testing-G02/issues/32) |
| 2 | MAJ | **Phone regex mismatch** — frontend regex rejects spec-valid numbers (start-0, 10–11 digits) and accepts spec-invalid ones (wrong prefix) | TC-11/13/15/23 | `FR-04-TC-11/13/15/23` | [BUG-A-11 #33](https://github.com/dinosauce-285/Software-Testing-G02/issues/33) |
| 3 | MAJ | **Empty phone blocks unrelated saves** — optional phone left empty blocks saving name/address | TC-11 | `FR-04-TC-11` | [BUG-A-12 #34](https://github.com/dinosauce-285/Software-Testing-G02/issues/34) |
| 4 | MAJ | **Zero server-side validation** on name/phone/address (empty, whitespace, oversized, malformed all persisted) | TC-05–07, 17–21 | — | [BUG-A-13 #35](https://github.com/dinosauce-285/Software-Testing-G02/issues/35) |
| 5 | MIN | **Silent NULL-coercion on field omission** — omitting a field wipes it to NULL instead of leaving it unchanged | TC-08/10/22 | `FR-04-TC-08-1/2` | [BUG-A-14 #36](https://github.com/dinosauce-285/Software-Testing-G02/issues/36) |

### FR-08 — Checkout

| # | Sev | Defect | Test cases | Screenshot | Issue |
|---|---|---|---|---|---|
| 1 | CRIT | **Backend never recalculates `total_amount`** — client value persisted verbatim (spec explicitly forbids) | TC-05–15, 17 | `FR-08-TC-01-editable-total` | [BUG-B-08 #38](https://github.com/dinosauce-285/Software-Testing-G02/issues/38) |
| 2 | CRIT | **Checkout total directly editable in UI** — plain editable `<input>`, opposite of spec | TC-01, 05–15 | `FR-08-TC-01-editable-total` | [BUG-B-07 #37](https://github.com/dinosauce-285/Software-Testing-G02/issues/37) |
| 3 | MAJ | **Cart never cleared after successful checkout** | TC-01 | `FR-08-TC-01-cart-not-cleared-1/2` | [BUG-B-09 #39](https://github.com/dinosauce-285/Software-Testing-G02/issues/39) |
| 4 | MAJ | **No cart-size guard** — order created for an empty cart; stacks with #1 into a fully-priced phantom order | TC-16/17 | — | [BUG-B-10 #40](https://github.com/dinosauce-285/Software-Testing-G02/issues/40) |
| 5 | MIN | `total_amount` accepts negative / zero / decimal / null (part of #1's root cause) | TC-07–09, 14/15 | — | same as #1 |

### FR-19 — User Management (Admin)

| # | Sev | Defect | Test cases | Screenshot | Issue |
|---|---|---|---|---|---|
| 1 | CRIT | **No role check on admin endpoints** — any authenticated user (any role string) can list/delete users, incl. the sole admin | TC-04/05/12/13/15 | `FR-19-TC-04`, `FR-19-TC-15-1/2` | [BUG-C-08 #41](https://github.com/dinosauce-285/Software-Testing-G02/issues/41) |
| 2 | CRIT | **No self-deletion guard** — admin can delete own logged-in account, no confirmation dialog | TC-07/14 | `FR-19-TC-14-1/2` | [BUG-C-09 #42](https://github.com/dinosauce-285/Software-Testing-G02/issues/42) |
| 3 | MIN | **DELETE ignores `this.changes`** — non-existent / malformed ids return false-positive `200 "User deleted"` | TC-08–11 | `FR-19-TC-11` | [BUG-C-10 #43](https://github.com/dinosauce-285/Software-Testing-G02/issues/43) |

### FR-11 — Order History (Mobile)

| # | Sev | Defect | Test cases | Screenshot | Issue |
|---|---|---|---|---|---|
| 1 | CRIT | **IDOR on `GET /api/orders/:id`** — no auth, no ownership filter; any caller reads any user's order | TC-10 | `FR-11-TC-10` | [BUG-D-10 #44](https://github.com/dinosauce-285/Software-Testing-G02/issues/44) |
| 2 | MAJ | **No status color differentiation** — spec requires color-coded statuses; all render identical | TC-11 | `FR-11-TC-11` | [BUG-D-11 #45](https://github.com/dinosauce-285/Software-Testing-G02/issues/45) |

### Bonus findings (outside the 4 assigned features' scope, surfaced during testing)

| Sev | Defect | How found | Owning FR |
|---|---|---|---|
| CRIT | **`SAVE10` coupon math inversion** — percent formula treats `discount_value` (10) as a whole number, so a "10% off" coupon multiplies the total ~10× (58,000,000 → 580,000,000) | Execution of FR-08 TC-18 | FR-09 |
| MAJ | **Mobile order-history staleness** — admin status changes never refresh the user's history screen until they cancel/place an order | Exploratory testing | FR-11/FR-20 (sync) |

---

## 5. AI Gap Analysis

Per requirement §6.3: below are the concrete cases where the AI-driven process missed, mis-scored, or could not resolve something on its own — and *why*, categorized as **prompt/input quality**, **AI tool limitation**, or **inherent technique/complexity**.

### Gap 1 — False positive: over-flagged the checkout "route guard" (prompt/interpretation)

**What happened.** For FR-08, the AI reported "no route guard on `/checkout`" as a bug: a logged-out user can open the checkout page by URL. Manual testing plus a careful re-reading of the literal spec showed this is **not** a defect — the spec says *"chỉ người dùng đã đăng nhập mới tiến hành thanh toán được"* (only logged-in users may **proceed to checkout/payment**), which constrains the checkout *action*, not page visibility. The action is correctly blocked (the API returns 401 for any guest payment attempt).

**Why the AI missed it.** Prompt/interpretation bias. The AI over-interpreted the requirement, reading an implied "the page must be inaccessible" security expectation into text that only constrained the payment action. LLMs are biased toward flagging anything that "looks insecure," even when it isn't spec-mandated. The correction came from human domain judgment and literal-spec re-reading — not from the model. **Lesson:** the human must hold the AI to the *literal* requirement and reject inferred requirements the spec never states.

### Gap 2 — Complete miss: mobile order-history staleness (inherent technique limitation)

**What happened.** When an admin changes an order's status, the mobile user's order-history screen does not refresh until the user cancels or places another order. Domain Testing + BVA never surfaced this; it was found by exploratory ("just using the app") testing.

**Why the AI missed it.** This is an inherent limitation of the *technique*, not a failure of the model. EP and BVA operate on the domain of **input values** — they ask "for input X in class P, is the behavior correct?" This defect has no offending input value at all; it is a **temporal, cross-actor state-synchronization gap** between two independent clients (admin panel and mobile app) over time. No input partition or boundary could ever target it. It belongs to state-transition testing or exploratory/session-based testing. **Lesson:** domain testing is powerful for input-driven correctness but structurally blind to timing/state-sync bugs; a complete test strategy must combine techniques.

### Gap 3 — Wrong static assumption caught only by execution: `SAVE10` coupon math (scoping + tool limitation)

**What happened.** During FR-08 *design*, the AI assumed applying `SAVE10` (10% off) would produce `final_amount = 52,200,000`. **Execution** revealed the real result is `580,000,000` — the coupon arithmetic is inverted (`total × (1 − discount_value)` with `discount_value = 10`, not `0.10`).

**Why the AI missed it.** Two compounding causes. (a) **Scoping/prompt:** coupon internals were explicitly out of scope (owned by FR-09), so the Step-0 code-grounding never read the coupon-calculation code — the AI reasoned from the spec's *intent* ("10% off") and assumed correctness. (b) **Tool limitation:** static reasoning cannot catch an arithmetic bug it never looked at; only running the endpoint exposed it. **Lesson:** predicted results from static code-reading are hypotheses — actually executing the tests is what converts them to facts, and dynamic testing routinely catches what static reasoning assumes away.

### Gap 4 — Could not resolve runtime behavior alone: field-omission NULL coercion (tool limitation)

**What happened.** The AI correctly *designed* the field-omission cases (FR-04 TC-08/10/22, FR-08 TC-15) but had to mark their expected results **"undetermined pending execution"** — it could not predict whether the Node `sqlite3` driver would bind an omitted (`undefined`) parameter as SQL `NULL`, throw, or leave the column unchanged. Execution resolved it: the driver silently coerces to `NULL`, wiping the field.

**Why the AI missed it.** Tool limitation. A static-analysis model cannot reliably determine runtime, library-version-specific driver behavior without executing. Notably, the AI handled this *well* — it flagged the uncertainty honestly instead of guessing a confident-but-possibly-wrong answer. **Lesson:** a trustworthy AI assistant should mark what it cannot know rather than fabricate certainty; execution then closes the gap.

### Gap 5 — Anchoring on the wrong oracle without the human's spec (prompt/input quality)

**What happened.** The AI's code inspection found the frontend phone regex `/^[1-9][0-9]{8,9}$/`. Left to the code alone, it would have treated that implementation as the correct oracle. The authoritative rule — *"starts with 0, 10–11 digits"* — came from the **human supplying the instructor's Vietnamese spec**, which contradicts the code. Only with that spec did the regex become a *bug* rather than the standard.

**Why the AI missed it (would have).** Prompt/input quality. The AI grounds itself in the code plus whatever spec it is given; when the code contradicts the true requirement and that requirement is not in the prompt, the AI anchors on the implemented behavior. The human's domain knowledge (Vietnamese phone format) and possession of the real spec were essential to setting the correct oracle. **Lesson:** the AI's output is only as correct as the requirements it is given — the human owns supplying and validating the source of truth.

### Cross-cutting reliability note

During API execution one sub-session self-reported "27 test cases run" when 32 had actually been executed (a counting slip in its own summary, while the underlying work was correct and complete). This reinforces that **every AI claim was independently verified** against the actual report files and code before being accepted — the human review loop is not optional.

---

## 6. Scope discipline

Two findings were deliberately kept **out** of the assigned features' defect counts and are recorded as bonus notes only: the `SAVE10` coupon-math bug (owned by FR-09) and the order-history staleness bug (a sync concern spanning FR-11/FR-20). Conversely, one initially-reported FR-08 finding (the checkout "route guard") was **retracted** after manual verification showed it did not violate the literal spec. Maintaining these boundaries — reporting real bugs in-scope, flagging out-of-scope ones separately, and retracting false positives — was a deliberate part of the process.

---

*Appendices — AI Critique (§10) and AI Audit Report (§9) — are provided as separate documents per the submission structure.*
