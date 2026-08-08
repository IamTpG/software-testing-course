# Autonomous Session Log

Started 2026-08-09, after the user handed off with: "continue with FR-08 and FR-19 respectively, UI test cases only, decide yourself if you get into problems, log important decisions for review." This file is the single place to review everything decided without a check-in. Newest entries at the bottom of each feature's section.

---

## FR-04 — Personal Profile Management (done before handoff, summarized here for completeness)

- Selected exactly 12 pre-existing HW02 test cases (TC-01/02/03/04/06/07/09/11/13/15/23/37), all driven via real UI interaction, none invented, none with expected results changed. Full rationale in `tests/fr04-profile/SELECTED-CASES.md`.
- Added `data-testid` attributes to `Login.jsx`/`Profile.jsx` (no existing stable selectors existed).
- Moved TC-05 out of scope entirely (native HTML `required` blocks it from ever reaching the network via UI — can't reproduce the bug that way without reinterpreting the case).
- Found and fixed a real script defect: `ProfilePage.goto()` didn't wait for the async profile fetch, causing a cross-browser-inconsistent race in the baseline-capture logic. Fixed by waiting for the `GET /api/users/me` response inside `goto()`.
- Final result: 12 cases x 3 browsers = 36 runs, 15 passed / 21 failed. All 21 failures independently verified as known, browser-consistent product defects (BUG-A-11, BUG-A-12, BUG-A-13 from HW02) — none are script bugs.

---

## FR-08 — Checkout

(entries added as work proceeds)

---

## FR-19 — User Management (Admin)

(entries added as work proceeds)
