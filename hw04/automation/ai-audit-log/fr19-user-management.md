# AI Audit Log — FR-19 User Management (Admin)

**AI tool:** Claude Code (Claude Sonnet 5)
**Date:** 2026-08-09 (autonomous continuation, user handed off and went to sleep)
**Skill applied:** `playwright-automation` (`.claude/skills/playwright-automation/SKILL.md`)

## Step 0 — Scope & code grounding

- Read `frontend-admin/src/App.jsx` (a second, separate SPA from frontend-web), the `GET/DELETE /api/admin/users` handlers, `POST /api/login`'s JWT signing, and the HW02 FR-19 BVA report.
- Found several structural constraints unique to this feature: only 2 seed users total; TC-08/09/10/11 (delete with invalid ids) target rows that don't exist, and the Users table only ever renders real rows, so there is no UI element to click for a non-existent id; TC-06/07/12/13/14 are all irreversible row deletions with no DB reseed mechanism available mid-run; the admin panel's own login form blocks non-admin logins client-side (A10), so TC-04 has no direct UI equivalent beyond what TC-15's bypass technique already demonstrates.
- **Decisions made from this:** reached exactly 12 UI-only cases via 5 pre-existing HW02 IDs plus a data-driven expansion of TC-15's own already-precedented bypass technique across 6 more role values (equivalence-class sampling of "any non-admin role", not new cases invented from nothing). Full reasoning and every excluded ID documented in `SELECTED-CASES.md`.

## Step 1-4 — Page Objects, fixtures, data, scripts

- Output: `pages/AdminLoginPage.ts`, `pages/AdminUsersPage.ts`, `fixtures/admin-fixtures.ts`, 3 JSON data files, 3 spec files.
- Added a third `webServer` entry (`frontend-admin`, port 5174) and installed its dependencies.

## Step 5 — Execution & review (3 real defects found and fixed, one severe)

1. **baseURL bug.** First run: every test timed out or failed to find elements. Root cause: the global config's `baseURL` targets frontend-web (`:5173`); FR-19 needed `:5174`. Fixed by overriding the `baseURL` option fixture inside `admin-fixtures.ts` so every consuming file gets it automatically.
2. **Race condition in `deleteUser()`.** After fixing (1), TC-14 (critical self-deletion bug) passed when it should have failed - the row-count assertion read the table before the app's own follow-up `fetchData()` re-fetch had landed, silently checking stale DOM. Fixed by waiting for both the DELETE response and the follow-up GET before returning.
3. **Cross-browser test-execution-order defect (the most consequential finding of the session).** After fixing (2), the destructive script was scoped to `chromium` via `test.skip`. Playwright runs whole projects in declaration order (confirmed by reading the actual run sequence in the log: all of chromium's tests across every file, then all of firefox's, then all of webkit's - not interleaved per file). Since chromium is declared first, its destructive pass deleted both seed accounts before Firefox's and WebKit's passes had even begun. Every later test depending on those accounts was corrupted - most alarmingly, all 8 role-bypass cases *passed* on Firefox/WebKit instead of failing, not because the bug was fixed but because a broken login (account gone) coincidentally left the app on its login form, which the assertion mistook for "correctly rejected". This is a dangerous class of failure specifically because it looks like a healthy, passing suite. Fixed by restricting the destructive tests to `webkit` (the last-declared project) instead.

Final result (all 3 browsers, after all fixes): 36 runs (12 cases, TC-06/TC-14 skipped on chromium/firefox by design), 7 passed / 25 failed / 4 skipped, fully consistent. All failures verified as known product defects (BUG-C-08, and TC-14's critical F2 self-deletion bug) - zero script defects remaining.

## Gap noted for the report

TC-01/02/04/07/08/09/10/11/12/13 could not be included in this UI-only batch for structural reasons documented in `SELECTED-CASES.md` (no UI affordance for non-existent ids; TC-04 subsumed by TC-15; TC-07/12/13 redundant with TC-14 given the one-account-destroying-case-per-invocation constraint) - a deliberate, documented scope decision, not an oversight. This is the feature with the least 1:1 correspondence to its original HW02 case list of the three automated - worth calling out explicitly when presenting the automation coverage.
