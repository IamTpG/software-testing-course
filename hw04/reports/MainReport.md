# HW04 — AI-Driven Automation Testing on EShop: Main Report

| | |
|---|---|
| **Exercise** | HW04-AI — Automation Testing on EShop |
| **Student** | Lê Thiên Phú (`23127244`) |
| **Fork under test** | https://github.com/IamTpG/eshop-sut |
| **AI tool used** | Claude Code (Claude Sonnet 5) — see AI Audit Report appendix |
| **Automation framework** | Playwright (TypeScript), data-driven (external JSON), 3-browser (Chromium/Firefox/WebKit) |
| **Features automated** | Same 3 selected in HW02: FR-04 (Pool A), FR-08 (Pool B), FR-19 (Pool C) |

Per-feature case selection, exact rationale for every included/excluded case, and technical notes are in each feature's own document — this report summarizes and synthesizes across all three:

- [FR-04 — Personal Profile Management: Selected Cases](../automation/tests/fr04-profile/SELECTED-CASES.md)
- [FR-08 — Checkout: Selected Cases](../automation/tests/fr08-checkout/SELECTED-CASES.md)
- [FR-19 — User Management (Admin): Selected Cases](../automation/tests/fr19-user-management/SELECTED-CASES.md)
- [Full autonomous-session decision log](../automation/AUTONOMOUS-SESSION-LOG.md)
- [Per-feature AI Audit Logs](../automation/ai-audit-log/)

---

## 1. System under test & feature selection

**SUT:** EShop (React web + React admin + Express/SQLite backend), the same instructor-provided application used in HW02, pulled fresh into `hw04/eshop-sut/`.

Feature selection is unchanged from HW02, per the assignment's instruction to automate the same three web features (Pool D/mobile is excluded here since this homework automates the web frontend):

| Pool | Feature | Surface |
|---|---|---|
| A | FR-04 — Personal Profile Management | Web (`frontend-web`, `PUT /api/users/me`) |
| B | FR-08 — Checkout | Web (`frontend-web`, `POST /api/checkout`) |
| C | FR-19 — User Management (Admin) | Web (`frontend-admin`, a *second*, separate SPA on its own port) |

---

## 2. Methodology

### 2.1 Tooling and structure

- **Playwright Test** (TypeScript), scaffolded with `npm init playwright@latest`, configured for 3 browser projects and an HTML reporter whose title is stamped `Run by: 23127244 | {ISO timestamp}` at every run (satisfying the anti-cheat requirement — verified by rendering the report in a headless browser and reading `document.title`, since the title is set client-side by the report's own JS, not baked into the static HTML).
- **Page Object Model**: one class per screen (`LoginPage`, `ProfilePage`, `HomePage`, `CartPage`, `CheckoutPage`, `AdminLoginPage`, `AdminUsersPage`), each exposing locators and intent-revealing action methods rather than raw selectors scattered through specs.
- **Data-driven design**: every feature's cases live in external JSON files under `automation/data/`, never hardcoded inline. A small number of authored `test()` templates loop over these files, so 39 distinct, individually-reported test cases come from ~10 script files, not 39 hand-written test bodies.
- **`data-testid` instrumentation**: none of the three frontends (`frontend-web`, `frontend-admin`) had stable selectors (no `id`/`name`, labels not `htmlFor`-linked). Added non-functional `data-testid` attributes throughout — standard Playwright practice, zero behavior change, verified by re-running the app manually after each addition.

### 2.2 A custom Agent Skill for the workflow

Built a `playwright-automation` Agent Skill (`automation/.claude/skills/playwright-automation/SKILL.md`, submitted alongside this report per §7), enforcing a strict, step-by-step, human-in-the-loop workflow — the AI is walked through the technique, not asked to "generate all the test scripts" in one shot:

| Step | Activity |
|---|---|
| 0 | Scope & code grounding — read the actual page/component source and the source BVA report before designing anything; the BVA report's expected results are the oracle, code-reading is only for locating real selectors |
| 1 | Page Object design — propose locators/actions grounded in the real DOM, get sign-off before writing code |
| 2 | Data schema design — propose the external data file shape before populating rows |
| 3 | Assertion strategy — assign each case to one of ≥3 distinct assertion patterns, tabulated for verification |
| 4 | Script generation — data file first, then the spec, one feature at a time |
| 5 | Execution & multi-browser run — for every failure, explicitly decide script-bug vs. product-bug before declaring done |
| 6 | Audit log capture — append a dated entry per step for the AI Audit Report appendix |

### 2.3 Process note: interactive vs. autonomous phases

FR-04 was completed fully interactively — every skill step paused for explicit approval (case selection, selector strategy, Page Object design, assertion-pattern mapping) before proceeding, including live back-and-forth on ambiguous scope calls (e.g. whether to include ≥12 cases as raw scripts or as data-driven rows, how to treat cases the UI structurally cannot reach without reinterpreting them).

FR-08 and FR-19 were completed under an **explicit, bounded delegation**: after FR-04 established the pattern, the student authorized continuing FR-08/FR-19 autonomously ("decide yourself if you get into problems, no need to ask anything from me. Important decisions must be logged so I can review them"), then went offline. Every non-obvious judgment call during that phase — case-selection tradeoffs, scope exclusions, and every bug found and fixed — was written to `AUTONOMOUS-SESSION-LOG.md` and the per-feature audit logs in real time, specifically so the student could review the full reasoning trail afterward rather than just the output. The student did review this on return, then asked targeted follow-up questions (about reproducibility, artifact provenance, and flaky-test risk) that were answered from the actual configuration and verified empirically, not from memory. This is presented transparently rather than glossed over: it is a legitimate instance of Bloom-AI **G9.4 (Collaborate with AI)** — setting explicit boundaries, delegating with an audit requirement, and critically reviewing the result — not unsupervised, undocumented automation.

### 2.4 Human review policy for negative/bug-catching cases

For every case where HW02 confirmed a real defect, the automated assertion targets the **spec-correct expected outcome**, not the SUT's current (buggy) behavior. A failing assertion is therefore the intended bug-detection signal, per the assignment's own framing ("wherever a failing assertion reveals a genuine defect, a bug report"). Every such case is annotated in its script with the originating HW02 bug reference, and every single failure across all three features was manually re-verified against the corresponding HW02 finding before being accepted as a real product defect rather than a broken script — detailed in §5.

---

## 3. Results summary

| Feature | Cases automated | Scripts | Data files | Browser runs | Passed | Failed | Skipped |
|---|---|---|---|---|---|---|---|
| FR-04 Profile Management | 12 | 3 | 3 | 36 | 15 | 21 | 0 |
| FR-08 Checkout | 15 | 4 | 4 | 45 | 9 | 36 | 0 |
| FR-19 User Management | 12 | 3 | 3 | 36 | 7 | 25 | 4 |
| **Total** | **39** | **10** | **10** | **117** | **31** | **82** | **4** |

(A 40th case, a SUT-connectivity smoke test unrelated to any of the three features, also runs — 3 more browser runs, 3 passed — kept separate from the official count above since it isn't one of the ≥12-per-feature cases.)

All numbers are from the actual final `npx playwright test` run (report: `automation/playwright-report/`, title `Run by: 23127244 | {timestamp}`), reproduced multiple times with identical results after all script fixes (see §5). 117 browser runs across the suite is well above the ≥9-total-browser-runs requirement, and every feature runs on all 3 browsers (FR-19's 2 account-deletion cases are a deliberate, documented single-browser exception — see §4.3).

**Assertion pattern diversity** (≥3 distinct patterns, required): network/response assertion, DOM/persisted-state assertion, and dialog assertion are all used, tabulated per case in each feature's `SELECTED-CASES.md`.

---

## 4. Confirmed defects (all re-derived independently via UI automation, matching HW02)

### FR-04 — Profile Management

| Defect | Cases | HW02 ref |
|---|---|---|
| Phone regex mismatch (frontend vs. spec) — every spec-valid phone rejected, wrong-prefix values wrongly accepted | TC-11, TC-13, TC-15, TC-23 | BUG-A-11 |
| Empty phone blocks unrelated Name/Address saves | TC-11 | BUG-A-12 |
| Zero server-side validation on Name/Address (empty, whitespace, oversized all silently persisted) | TC-06, TC-07, TC-09 | BUG-A-13 |

### FR-08 — Checkout

| Defect | Cases | HW02 ref |
|---|---|---|
| Backend never recalculates `total_amount` from the server-side cart — client value persisted verbatim, including negative/zero/decimal/architectural-extreme values | TC-05–TC-14 | BUG-B-08 |
| No cart-size guard — an order is created even for an empty cart | TC-16, TC-17 | BUG-B-10 |

### FR-19 — User Management (Admin)

| Defect | Cases | HW02 ref |
|---|---|---|
| No role check on either admin endpoint — any authenticated session (any role string) can view/act on user data | TC-05, TC-15, + 6 added-value role variants | BUG-C-08 |
| **Critical: no self-deletion guard** — an admin can delete their own currently-logged-in account through a plain "Xóa" click, with no confirmation | TC-14 | F2 (critical, HW02 §Summary item 2) |

### 4.1 No-defect confirmations (equally load-bearing evidence)

TC-01–TC-04, TC-37 (FR-04 boundary/happy-path saves), TC-01, TC-04, TC-18 (FR-08 honest total, guest page-view access, coupon-applied checkout persisting faithfully), TC-03, ADMIN-LOGIN-BLOCK, TC-06 (FR-19 admin GET, blocked non-admin login attempt, correct other-user deletion) all pass, confirming the automation isn't just bug-seeking — it correctly distinguishes broken from working behavior.

### 4.2 GitHub Issues status

All defects above are **re-confirmations** of HW02-documented findings (the FR-04/FR-08/FR-19 bugs were already discovered and analyzed in HW02's Domain Testing pass — this homework demonstrates they are also triggerable through real browser automation, cross-browser, not just direct API calls). New GitHub Issues on `IamTpG/eshop-sut` for this homework's submission, each with a screenshot from a failed automated run, are tracked separately — see the accompanying Bug Report draft.

### 4.3 Known, documented scope limitation: FR-19's single-browser destructive cases

TC-06 (admin deletes another user) and TC-14 (admin deletes their own account) permanently remove rows from the shared seeded database, and there is no reseed mechanism available mid-run (the backend only reseeds on a full process restart, which happens automatically once per `npx playwright test` invocation, not per browser). Running either case on more than one browser project within the same invocation was tried and found to actively corrupt results (§5, Gap 6) — restricted to WebKit only, with the reasoning fully documented in `SELECTED-CASES.md`.

---

## 5. AI Gap Analysis — what the AI got wrong, and why

Per the assignment's requirement to report what the AI got wrong or missed and why, categorized as **prompt/input quality**, **AI tool limitation**, or **inherent technique/complexity** (same taxonomy HW02 used, for consistency). All 6 were caught during Step 5 (execution & review) of the skill's workflow — none were caught by static code reading; every one required actually running the suite and noticing an inconsistency.

### Gap 1 — Async-fetch race in FR-04's `ProfilePage.goto()` (AI tool limitation)

**What happened.** A negative-case test's "baseline" value was read via `.inputValue()` immediately after navigation, before `Profile.jsx`'s async `GET /api/users/me` had populated the field. Different browsers have different navigation/paint timing, so the race surfaced inconsistently: Chromium showed the correct 3/3 failures for the invalid-Name/Address group, Firefox showed 0/3, WebKit showed 2/3 — for a server-side bug that cannot legitimately vary by browser.

**Why the AI missed it.** Generating a `goto()` that just calls `page.goto()` is the "obviously correct" default; nothing about a static read of the component would flag that its fields are empty until an async fetch resolves. Only cross-browser execution exposed it, because a real bug wouldn't vary by browser and this result did.

**Lesson.** When results disagree across browsers for a scenario with no browser-specific code path in the SUT, that disagreement itself is the signal of a script defect, not a real finding — treated as a hard rule for the rest of the session (applied again in Gaps 2, 3, 5, 6).

### Gap 2 — Hard navigation silently wiping in-memory cart state, FR-08 (AI tool limitation)

**What happened.** `CheckoutPage.goto()` used `page.goto('/checkout')`. `CartContext.jsx` holds the cart in plain `useState`, with zero persistence. A hard navigation reloads the whole SPA, resetting that state — so a cart built via clicks on the Home page was silently empty by the time Checkout rendered. Caught because the *honest*-value case (TC-01, no known bug) failed its product-list assertion — a strong signal the script, not the product, was wrong.

**Why the AI missed it.** `page.goto()` is the standard Playwright navigation call; nothing about it looks wrong without first reading `CartContext.jsx` closely enough to notice the *absence* of `localStorage`/persistence — an easy omission when several files are being read for selector-grounding rather than architecture review.

**Lesson.** For any SPA with meaningful client-side-only state, navigation between screens must go through the app's own in-app links/buttons, not a URL-based `goto()`, or that state silently resets.

### Gap 3 — Coupon usage-cap not accounting for repeated cross-browser runs, FR-08 (prompt/input quality — test-design scoping)

**What happened.** `SAVE10`'s seed data allows only 1 use per account. Since all 3 browser projects share one live database within a single suite run, Chromium's pass consumed the account's only use; Firefox and WebKit both then got a 400 "already used" error instead of a computed discount.

**Why the AI missed it.** This is not a timing race but a scoping oversight: the test was designed correctly for a single execution, without accounting for the suite's own repeat-3x-per-run structure interacting with a *consumable* piece of fixture data (as opposed to an *overwritable* field, which every other mutation in the suite is).

**Lesson.** Any seeded fixture with a use-count or other consumption limit needs to be checked against how many times the suite will legitimately need to consume it, not just whether a single pass works.

### Gap 4 — Wrong SPA origin, FR-19 (AI tool limitation — configuration oversight)

**What happened.** The global Playwright config's `baseURL` targets `frontend-web` (`:5173`). FR-19 needed `frontend-admin`, a second, separate SPA on `:5174` — every FR-19 test was silently navigating to the wrong application, producing 30-second timeouts and "element not found" errors across the board.

**Why the AI missed it.** The project began as a single-frontend setup (FR-04/FR-08); when FR-19 introduced a second frontend, the config's single global `baseURL` was carried over without being reconsidered for a multi-SPA project — an assumption that was true when made and became false without an obvious trigger to revisit it.

**Lesson.** Adding a genuinely new architectural element (a second frontend) to a project warrants an explicit pass over previously-set-once config, not just new code layered on top.

### Gap 5 — Race in `AdminUsersPage.deleteUser()`, FR-19 (AI tool limitation, same family as Gap 1)

**What happened.** `deleteUser()` awaited only the `DELETE` response, not the app's own unawaited follow-up `fetchData()` GET that actually refreshes the rendered table. TC-14 (the critical self-deletion bug) then read a stale row count and *passed* — looking like the bug didn't exist, when it did.

**Why the AI missed it.** Reading the app's `deleteUser` handler, `axios.delete(...)` is awaited but the following `fetchData()` call is not — an easy detail to miss when scanning for the network call that matters, since the DELETE itself does complete successfully.

**Lesson.** When a UI action triggers a secondary, unawaited network refresh, the test must wait for that refresh specifically, not just the primary action — verified by explicitly identifying both calls in the source before writing the wait, not by only testing that some wait exists.

### Gap 6 — Cross-browser test-execution-order defect, FR-19 (AI tool limitation — the most consequential finding of the session)

**What happened.** The destructive script (account deletion) was originally restricted to `chromium` via `test.skip`, assumed to be a safe, isolated choice. Playwright, however, runs whole *projects* in declaration order — all of chromium's tests across every file, then all of firefox's, then all of webkit's (confirmed empirically by reading the actual run sequence in the log, not assumed from documentation). Since `chromium` is declared first, its destructive pass deleted both seed accounts before Firefox's and WebKit's passes had even begun. Every later test depending on those accounts was corrupted — most seriously, all 8 role-bypass cases *passed* on Firefox/WebKit instead of failing: not because the underlying critical bug (BUG-C-08) was fixed, but because a broken login (the account no longer existed) coincidentally left the app sitting on its login form, which the "correctly rejected" assertion mistook for the app correctly rejecting a non-admin session.

**Why the AI missed it.** This required knowledge of Playwright's specific project-scheduling semantics combined with the SUT's specific irreversible-mutation characteristics — a genuinely non-obvious interaction, not a simple oversight. It is also the most dangerous class of the six: it produced a suite that *looked* healthy (mostly green) while silently failing to test what it claimed to test.

**Lesson.** For a destructive test that can only safely run once per suite invocation, "restrict to one browser" is necessary but not sufficient — *which* browser matters, specifically whichever one is scheduled to run last, and that scheduling order should be verified empirically (by reading actual run output) rather than assumed from a project's declared order or general intuition.

### Cross-cutting lesson

Every one of these six defects was caught by **execution**, not by static code review, and every one that involved multi-browser inconsistency was caught specifically by treating "browser-dependent results for a server-side-only bug" as a hard signal of a script defect rather than a real finding — a principle worth stating explicitly since it generalizes well beyond this assignment.

---

## 6. Test cases not automated, and why

Full per-case reasoning lives in each feature's `SELECTED-CASES.md`; summarized here:

- **FR-04** (37 HW02 cases, 12 automated): TC-05 (empty name — blocked by native HTML `required` before any request fires), TC-08/10/22 (field omission — a real form can't omit a JSON key), TC-24–33 (Email/Role — no UI field exists for either, including the critical role-escalation bug TC-31, which has no UI surface to trigger it through), TC-34/35 (auth-state — would require reinterpreting the assertion).
- **FR-08** (20 HW02 cases, 15 automated): TC-02/03 (auth-state, same reinterpretation issue as FR-04's TC-34/35), TC-15 (field omission), TC-19 (`shipping_address` — the real Checkout UI never sends this field at all, despite the backend accepting it), TC-20 (forged `user_id` — can't inject an extra JSON key via form interaction).
- **FR-19** (15 HW02 cases, 12 automated — the lowest 1:1 correspondence of the three, for feature-specific structural reasons): TC-01/02 (table-size boundaries reachable only as a side effect of destructive deletes already covered by TC-06/TC-14), TC-04 (subsumed by TC-15 — if the Users panel renders for a bypassed non-admin session, that data necessarily came from the same endpoint TC-04 tests directly), TC-07 (self-delete via raw API — TC-14 already covers the same defect through the real UI, and only one account-destroying case can safely run per invocation), TC-08/09/10/11 (delete-by-nonexistent-id — the Users table only ever renders real rows, so there is no "Xóa" button for an id that doesn't exist), TC-12/13 (non-admin/garbage-role deletes admin — same one-destructive-case-per-invocation constraint as TC-07).

None of these exclusions were used to pad the automated count elsewhere with fabricated cases — where a feature (FR-19) fell short of 12 pre-existing UI-native IDs, the gap was filled by data-driven expansion of an already-precedented, already-justified technique (more role values through the same bypass HW02 itself established for TC-15) rather than inventing an unrelated new mechanism.

---

*Appendices — AI Critique and AI Audit Report — are provided as separate documents per the submission structure.*
