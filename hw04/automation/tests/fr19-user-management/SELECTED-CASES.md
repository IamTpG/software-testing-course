# FR-19 — User Management (Admin): Selected Cases for Automation

Source: [`hw02/.../FR-19-UserManagement/DomainTesting_BVA.md`](../../../hw02/23127244_HW02_AI_DomainTesting_100/reports/FR-19-UserManagement/DomainTesting_BVA.md)

This feature has structural constraints the other two don't: only 2 seed users total, several invalid-id delete cases target rows that don't exist (no UI element to click for a non-existent id), and the self/other-admin-deletion cases are irreversible with no DB reseed mechanism available mid-run (the server only reseeds on a full restart). 12 cases were still reached UI-only, but via a different shape than FR-04/FR-08: 5 pre-existing HW02 IDs (TC-03, TC-05, TC-06, TC-14, TC-15), plus a data-driven expansion of the one legitimate, already-precedented UI technique this feature has (TC-15's localStorage token-injection bypass) across more role values, rather than padding with API-only filler cases (which the "UI only" instruction rules out).

`data-testid` hooks added to `frontend-admin/src/App.jsx` (login inputs/button, users nav tab, users table body, per-row `admin-user-row-{id}` / `admin-delete-user-{id}`), same non-functional pattern as the other two features.

| Script | Data file | Cases | Assertion pattern | Repeatable across 3 browsers? |
|---|---|---|---|---|
| `user-management-role-bypass.spec.ts` | `data/fr19-role-bypass.json` | TC-15, TC-05 + 6 added-value role variants (8) | DOM/UI-state | Yes - role overwrite is idempotent, not a row deletion |
| `user-management-readonly.spec.ts` | `data/fr19-readonly.json` | TC-03, ADMIN-LOGIN-BLOCK (added-value) (2) | DOM/UI-state + dialog | Yes - no mutation at all |
| `zz-user-management-destructive.spec.ts` | `data/fr19-destructive.json` | TC-06, TC-14 (2) | DOM/UI-state (row count) | **No - WebKit only** (see below) |

## Why the role-bypass script is data-driven-expanded rather than 1:1 with HW02

TC-04 (raw API GET as a `user`-role caller) and TC-15 (UI: inject a non-admin token, panel renders anyway) test the same underlying defect (F1: no role check) at different depths. Once TC-15 is automated, TC-04 doesn't add an independently distinct UI assertion — if the Users panel renders real data for a non-admin session, that data necessarily came from `GET /api/admin/users` succeeding for that caller, which is exactly what TC-04 checks directly. TC-04 is treated as subsumed by TC-15, not separately automated.

That leaves the batch short of 12 pre-existing UI-native IDs. TC-08/09/10/11 (delete with id=0/-1/"abc"/999999) are genuinely impossible via UI - the Users table only ever renders the seeded rows (id=1, id=2), so there is no "Xóa" button for a non-existent id to click. Rather than fill the gap with API-only cases (which the instruction to use UI test cases only rules out), the gap is filled by expanding TC-15's own already-precedented technique (A11: "added-value scenarios... mirrors the FR-04/FR-08 reports' treatment of bonus channel-crossing cases") across 6 further non-admin role values (`moderator`, `"0"`, `"999"`, `ADMIN`, `null`, `admin ` with trailing space) - legitimate equivalence-class sampling of "any non-admin role string" through a real, already-justified UI mechanism, not a new one invented to hit the count.

One role value from the original idea had to be dropped: an empty-string role can't be used for this technique at all, because the backend's own bug this setup relies on (`if (role) { ...update... }` in `PUT /api/users/me`) treats an empty string as falsy and silently skips the update - the same bug used to *set up* the test would silently no-op for that specific value. Replaced with `"0"` (a non-empty, falsy-*looking* but JS-truthy string) instead.

## The destructive script's browser restriction

TC-06 (admin deletes Test User) and TC-14 (admin deletes their own account) permanently remove rows. Within one `npx playwright test` invocation the DB is never reseeded between browser projects (only a full server restart reseeds it, and the server is started once for the whole run) - so a second browser attempting either case would either find the target already gone (a false-positive "delete" of a row that isn't there, masking whether the guard actually works) or, in TC-14's case specifically, find that the *admin account itself* no longer exists, breaking every other admin-login-dependent test that happens to run afterward, in this file or any other.

`test.skip` restricts both cases to a single browser. That browser must be **webkit specifically, not chromium** - confirmed empirically, not just assumed: Playwright runs whole projects in declaration order (all of chromium's tests across every file, then all of firefox's, then all of webkit's), not interleaved per-file. `playwright.config.ts` declares `chromium, firefox, webkit` in that order, so webkit runs last. An earlier version of this suite restricted the destructive cases to chromium (the first-declared project) - since chromium's pass ran before Firefox/WebKit's, it deleted both seed accounts before those browsers' passes had even started, corrupting every test in this file's siblings that logs in as either account (their results inverted - failures that should have been failures started passing on stale/broken state instead). Restricting to webkit (last-declared) instead means every other browser's non-destructive pass completes cleanly first. The file is also named to run alphabetically last within this folder, so within webkit's own pass, its non-destructive files still run before this one.

## Excluded - structurally impossible via UI (not attempted, not modified to fit)

- **TC-01/TC-02** (GET with 0/1 users - table-size boundary) - reaching these states requires the very destructive deletes above to have already run in a specific order, which conflicts with keeping those isolated and minimal (see above). Not independently automated; TC-06 and TC-14's own assertions already exercise the underlying table-mutation code path.
- **TC-04** - subsumed by TC-15, see above.
- **TC-07** - self-delete via a raw `DELETE` call; TC-14 already covers the same underlying defect (F2) through the real UI, and only one account-destroying case can safely run per suite invocation (see above) - TC-14 was chosen over TC-07 because it was already a precedented UI case in HW02, where TC-07 was Direct-API-only.
- **TC-08/09/10/11** (delete with id=0/-1/"abc"/999999) - no UI element exists for a non-existent id; these are only reachable via a raw API call.
- **TC-12/TC-13** (non-admin/garbage-role deletes the admin account) - same underlying defect as TC-14, and running an additional account-destroying case would conflict with the one-per-invocation constraint above.

These remain candidates for a future API-channel batch if pursued later.
