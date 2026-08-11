# AI Audit Log — FR-04 Personal Profile Management

**AI tool:** Claude Code (Claude Sonnet 5)
**Date:** 2026-08-09
**Skill applied:** `playwright-automation` (`.claude/skills/playwright-automation/SKILL.md`)

## Step 0 — Scope & code grounding

- **Prompt:** asked to select and automate >=12 FR-04 test cases from the HW02 BVA report, UI-only.
- **Output:** read `Profile.jsx`, `Login.jsx`, `AuthContext.jsx`, `database.js` seed data, and the HW02 FR-04 BVA report. Found: no stable selectors exist on Login/Profile inputs (no id/name/testid, labels not `htmlFor`-linked); native HTML `required` on the Name field blocks TC-05 from ever reaching the network via UI; the PUT response never echoes updated fields.
- **Human decisions made from this:** added `data-testid` attributes to both files (non-functional, standard practice); moved TC-05 out of the UI-only batch entirely; settled the batch at exactly 12 pre-existing cases (TC-01/02/03/04/06/07/09/11/13/15/23/37), grouped into 3 scripts/3 data files.

## Step 1-3 — Page Object, data schema, assertion strategy

- **Output:** `pages/LoginPage.ts`, `pages/ProfilePage.ts`, `fixtures/test-fixtures.ts` (API-speed login instead of repeated UI login per case), 3 JSON data files under `data/`.
- **Human decisions made from this:** required 3 *distinct* assertion patterns (network/response, DOM/persisted-state, dialog) rather than reusing one pattern per group, since the PUT response body carries no field data and a single pattern would be a weaker check.

## Step 4 — Script generation

- **Output:** `profile-valid-boundary.spec.ts`, `profile-invalid-fields.spec.ts`, `profile-phone-bugs.spec.ts`, each a data-driven loop over its JSON file.
- **Human review:** the negative-case scripts assert the *spec-correct* expected outcome (not the SUT's current buggy behavior) so a failing assertion is the bug-detection signal, per the assignment's stated intent. Each failure is annotated with a `known-defect` tag pointing at the originating HW02 bug ID.

## Step 5 — Execution & review

- **First run result:** cross-browser inconsistent (Chromium 7 failed, Firefox 4 failed, WebKit 6 failed for the same 12 cases) — flagged as suspicious since the underlying bugs are server-side and shouldn't vary by browser.
- **Root cause found by human review:** `ProfilePage.goto()` didn't wait for the async `GET /api/users/me` that populates the form; a direct `.inputValue()` read in the invalid-fields test's baseline capture raced against it. This is exactly the kind of AI mistake the assignment asks to catch: the generated code worked on the happy path but had an unguarded async race that only surfaced under real browser-timing variance.
- **Fix:** made `goto()` wait for the response before returning.
- **Final result (all 3 browsers, after fix):** 15 passed / 21 failed, fully consistent across browsers. All 21 failures verified as known, pre-existing HW02 defects (BUG-A-11, BUG-A-12, BUG-A-13) — zero script defects remaining.

## Gap noted for the report

TC-31 (critical role-escalation bug) and TC-26 (email immutability) could not be included in this UI-only batch — neither field has any UI control to interact with. This is a deliberate, documented scope decision (see `tests/fr04-profile/SELECTED-CASES.md`), not an oversight.
