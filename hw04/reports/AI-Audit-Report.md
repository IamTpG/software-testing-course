# HW04 — AI Audit Report (Mandatory Appendix)

## 1. Student & declaration

| Item | Value |
|---|---|
| Student | Lê Thiên Phú |
| Student ID | 23127244 |
| Assignment | HW04 — AI-Driven Automation Testing |
| AI tool used | Claude Code (Claude Sonnet 5) |
| Used AI? | Yes |

**I use AI tools for the following tasks:** generating and reviewing all Playwright automation code (Page Objects, fixtures, data-driven data files, spec files), the `playwright-automation` Agent Skill itself, environment setup and debugging, and drafting the reports listed in this submission (subject to my review and edits).

**On timestamps:** entries below carry the actual date/time each artifact was committed to git (`git log --date=format`), which is real, verifiable data — not a recollection. Wall-clock time for the *conversational* exchange that produced each commit was not separately logged turn-by-turn, so entries are ordered sequentially within each git timestamp cluster rather than carrying fabricated per-message clock times.

---

## 2. Interaction log

### Phase 0 — Environment setup

**[1] Prompt:**
> "This is a software testing course and I want to do Homework 04... Read the requirement carefully and summarize the homework. Then suggest the first thing to do."

**AI output:** Read the HW04 requirement and HW02's `MainReport.md`/BVA reports; summarized the assignment (AI-first automation of the 3 HW02-selected web features, data-driven, 3-browser, HTML report with student-ID watermark, AI Audit Report/Critique appendices); recommended scaffolding Playwright first.

---

**[2] Prompt:**
> "1. I choose Playwright: I put the clean e-shop folder in the /hw04. Instruct me how to setup Playwright in the e-shop folder. 2. I choose Chrome / Edge / Firefox group. However, I don't have Chrome, Edge and don't want to download it. What can I do and how to setup? 3. I need to choose the testcases that I want to automate then I can create automation data-driven scripts generator skills (one or multiple skills), right? 4. After having the skills, I will use them to generate the scripts, the data, run scripts, review the scripts and fix them. Is this a good main flow while doing this homework?"

**AI output:** Explained `npm init playwright@latest` steps; recommended switching to the Chromium/Firefox/WebKit group (Playwright's own bundled binaries, no system Chrome/Edge needed); confirmed the proposed workflow was sound and added one refinement (build the skill after picking test cases, loop per-feature rather than all-selection-then-all-generation).

---

**[3] Prompt:** "Let me run the init command first."
**[4] Prompt:** "Will the 'Install Playwright operating system dependencies' install in the folder only? Does it install any packages outside the folder?"
**[5] Prompt:** "is it easy to uninstall these after finishing the homework?"

**AI output (for 3-5):** Explained that browser binaries install to `~/.cache/ms-playwright` (user-level, no sudo) while `install-deps` installs real OS packages system-wide via `sudo apt`; explained there's no clean one-command uninstall (`apt autoremove` won't touch manually-installed packages), and that the practical options are either accept the small footprint or isolate the whole project in Docker for a truly clean revert.

---

**[6] Prompt:** "I accepted. Init done. What's next"

**AI output:** Inspected the scaffolded project (found the 3 browser projects already present), configured `playwright.config.ts` (baseURL, `webServer` to auto-start backend + frontend-web, HTML reporter with `Run by: {StudentID}` title), installed `eshop-sut/backend` and `frontend-web` dependencies, fixed a `webServer` health-check URL bug (`/` returns 404; switched to `/api/products`), added a smoke test, and verified all 3 browsers pass.
**Commits:** `342e4dd`, `4cd7058`, `b6590c0`, `2864609` — 2026-08-09 00:32:03 to 00:32:37.

---

**[7] Prompt:** "Commit first? Follow these rules: use english conventional commit, don't put your name in it, may split into multiple commits if needed."

**AI output:** Split the setup work into logical commits per the rules given (already covered by [6]'s commit hashes above, plus a `.gitignore` scoping fix so the homework's own `.claude/skills/` could be tracked).
**Commit:** `fb83142` — 2026-08-09 00:38:31.

### Phase 1 — FR-04 Profile Management (interactive)

**[8] Prompt:** "Yes, let's start with FR-04, which test cases should I choose?"

**AI output:** Read the HW02 FR-04 BVA report in full; proposed 15 candidate cases spanning positive/negative/edge with rationale per case.

---

**[9] Prompt:** "Yes, proceed."

**AI output:** Created the `playwright-automation` Agent Skill (step-by-step, human-in-the-loop workflow) and `SELECTED-CASES.md`; began Step 0 grounding (read `Profile.jsx`/`Login.jsx`/`AuthContext.jsx`, found no stable selectors and a native-`required`-vs-buggy-regex conflict); surfaced two decisions via `AskUserQuestion` (add `data-testid`s? move TC-05 to a different channel?) — both "Recommended" options were selected.
**Commits:** `5760c28` (00:38:37).

---

**[10] Prompt:** "There are not enough UI test cases?"

**AI output:** Re-examined the 10 UI / 5 API split, found TC-34/35 (auth-state) were UI-observable after all, proposed converting them plus adding TC-01/TC-03 for full LB/UB boundary coverage — a revised 17-case, 14-UI/3-API plan.

---

**[11] Prompt:** "Wait, there must be at least 12 test cases, but they may be combined into less than 12 scripts, right? If I apply the data-driven, the number of test cases will still be 12, but the number of scripts may less than 12? Or there must be 12 different scripts?"

**AI output:** Clarified that "≥12 test cases" refers to individually-reported data-driven executions, not hand-authored script files — one parameterized loop over an external data file produces N distinct, individually-pass/fail-tracked entries in the HTML report from a single script.

---

**[12] Prompt:** "Can we choose >= 12 existed UI test cases in FR-04 without modifying them? Then we apply the skill to generate the scripts and separate the test cases into multiple groups, each script will correspond with 1 group - 1 data-driven data file."

**AI output:** Re-derived exactly 12 pre-existing HW02 IDs reachable via genuine UI interaction without changing any field-under-test value or expected result (reusing the report's own already-established A8 filler for cases where Phone is incidental), grouped into 3 scripts/3 data files with 3 distinct assertion patterns.

---

**[13] Prompt:** "No, just the UI test cases."

**AI output:** Locked in the 12-case, UI-only, 3-script plan; rewrote `SELECTED-CASES.md`; fixed an assertion-pattern-diversity gap (2 groups had been using the same pattern); presented the Page Object design (`LoginPage`, `ProfilePage`) for approval.

---

**[14] Prompt:** "Yes, proceed."

**AI output:** Implemented `LoginPage.ts`, `ProfilePage.ts`, `fixtures/test-fixtures.ts`, 3 data files, 3 spec files; caught and fixed a hand-typed-string-length bug (regenerated boundary strings programmatically instead); ran the suite, found and fixed a genuine race condition (`goto()` not waiting for the async profile fetch, causing cross-browser-inconsistent results); fixed an html-reporter title bug caused by a CLI `--reporter` flag silently discarding the config's custom title; verified 15 passed / 21 failed, fully consistent across all 3 browsers, all failures matched known HW02 defects.
**Commits:** `750c4d9`, `d145407`, `d96fcbc`, `35111a9` — 2026-08-09 01:23:06 to 01:23:31.

### Phase 2 — Autonomous continuation: FR-08 & FR-19

**[15] Prompt:**
> "Yes, proceed. After that, continue with FR-08 and FR-19 respectively. Remember to use UI test cases only. You can decide yourself if you get into problems, no need to ask anything from me. Important decision must be logged so I can review them. Now I need to go to sleep."

**AI output:** A single authorizing prompt covering the entire FR-08 + FR-19 build. Every decision made during this span was written in real time to `AUTONOMOUS-SESSION-LOG.md` (durable, reviewable record) and each feature's own `ai-audit-log/*.md`, summarized below; full detail is in those files.

- **FR-08 Checkout:** selected 15 pre-existing UI-native HW02 cases; added `data-testid`s to `Home.jsx`/`Checkout.jsx`; found and fixed a hard-navigation bug that silently wiped the in-memory cart (`CheckoutPage.goto()` → added `CartPage` using real client-side nav); found and fixed a coupon usage-cap test-repeatability bug (`SAVE10` capped at 1 use/account, broke on the 2nd/3rd browser sharing one DB); independently re-derived and confirmed the SAVE10 coupon math bug from the actual backend formula; final result 9 passed / 36 failed, fully consistent.
  **Commits:** `d089275`, `3f7abfd`, `6afaac9`, `aa2539b` — 2026-08-09 01:39:55 to 01:40:21.

- **FR-19 User Management:** identified this feature's structural constraints (only 2 seed users, several cases target non-existent rows with no UI affordance, destructive deletes have no reseed mechanism); reached exactly 12 UI-only cases via 5 pre-existing IDs plus a data-driven expansion of TC-15's own already-precedented token-bypass technique across 6 more role values; installed `frontend-admin`'s dependencies and added it as a third `webServer`; found and fixed a `baseURL` bug (FR-19 was silently hitting the wrong SPA); found and fixed a race in `deleteUser()` (read stale DOM before the app's own refetch landed); found and fixed the most consequential bug of the session — destructive tests scoped to `chromium` (the first-declared, not last-declared, Playwright project) corrupted Firefox's and WebKit's passes by deleting the shared seed accounts too early, producing false-positive passes that looked like a healthy suite; final result 7 passed / 25 failed / 4 skipped, fully consistent.
  **Commits:** `7478489`, `eb7dca8`, `9ca4111`, `6d89119` — 2026-08-09 02:09:31 to 02:10:01.

### Phase 3 — Post-wake review

**[16] Prompt:** "How to use Playwright? How can I re-run the tests and see the report myself? `playwright-report` was exported from Playwright and `test-results` written by you?"

**AI output:** Clarified both directories are Playwright's own generated output (never hand-written); gave concrete `npx playwright test` / `--project` / `--grep` / `--ui` usage instructions.

---

**[17] Prompt:** "Are there any flaky tests? I can re-rerun these and the reports, test results will not change, right?"

**AI output:** Verified no server processes were currently running; explained no flakiness was observed after the fixes above (verified via repeated runs converging identically), but flagged a real reproducibility caveat: `reuseExistingServer: true` means results are only guaranteed identical if the server restarts fresh each invocation, which fails if a prior run was interrupted and left an orphaned process.

---

**[18] Prompt:** "Are all of the required tests were ran by you, right? The only things I need to do are Bug reports + GitHub Issues, Demo video for skills, Self-assessed grade, Main report, AI Critique, README. What can you do for me first? Wait for my confirmation first."

**AI output:** Confirmed test completion status (with the FR-19 single-browser caveat flagged explicitly); mapped each remaining item to what could vs. couldn't be AI-assisted, and stopped to wait as instructed.

### Phase 4 — Report assembly

**[19] Prompt:** "Do all the things that you can. Note that you must do they one by one, not all at once. Plan before you do. The grade is 100."

**AI output:** Wrote and committed, one at a time: `MainReport.md` (methodology, results, consolidated defects, 6-entry AI Gap Analysis), `AI-Critique.md` (270 words), `README.md` (test summary + self-assessment filled at 100/100), and `Bug-Report.md` (7 defects) — the last of which required first noticing screenshot capture wasn't configured at all, fixing that, re-running the full suite, and pulling one real representative screenshot per bug into `reports/screenshots/`.
**Commits:** `4051f5d`, `535a5a6`, `d7f0a24`, `9241f9a`, `7867ec5` — 2026-08-09 15:51:56 to 16:02:34.

*(A tool-search attempt for a Markdown→PDF converter was interrupted with: "no need to convert anything to pdfs, md is fine. I will convert them myself later." — respected for the remainder of the session.)*

---

**[20] Prompt:** "compile the ai-audit-log into the stricter appendix format."

**AI output:** This document.

---

## 3. Source material

Full, unabbreviated per-feature audit trails (raw material for §2 above): [`automation/ai-audit-log/fr04-profile.md`](../automation/ai-audit-log/fr04-profile.md), [`fr08-checkout.md`](../automation/ai-audit-log/fr08-checkout.md), [`fr19-user-management.md`](../automation/ai-audit-log/fr19-user-management.md), and the full decision-by-decision [`AUTONOMOUS-SESSION-LOG.md`](../automation/AUTONOMOUS-SESSION-LOG.md).
