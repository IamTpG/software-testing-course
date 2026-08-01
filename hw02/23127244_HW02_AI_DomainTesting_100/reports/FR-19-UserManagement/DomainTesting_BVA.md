# FR-19 — User Management (Admin): Domain Testing / BVA Test Case Suite

**Methodology:** Domain Testing via Equivalence Partitioning (EP) and Boundary Value Analysis (BVA), following a 6-step human-in-the-loop QA process. Combinatorial strategy: **Isolated Boundaries + Happy-Path Interactions** (Option C), with two deliberate UI-channel confirmatory cases beyond the core API-driven matrix. 15 test cases total.

**Source spec (FR-19, Vietnamese, instructor-provided):**
> Admin xem danh sách tất cả người dùng (không lộ mật khẩu).
> Admin có thể xóa người dùng, ngoại trừ không được xóa chính tài khoản đang đăng nhập.

**Code under test:**
- Frontend: `frontend-admin/src/App.jsx` (Users tab render, `fetchData`, `deleteUser`, login-time role gate)
- Backend: `backend/server.js` (`GET /api/admin/users`, `DELETE /api/admin/users/:id`, `authenticateToken`, `POST /api/login` JWT signing)
- DB schema: `backend/database.js` (`users` table — `role TEXT DEFAULT 'user'`, no `CHECK` constraint; `id INTEGER PRIMARY KEY AUTOINCREMENT`)

**Preconditions (unless a case states otherwise):** Actor holds a valid, signature-verifiable JWT (V6 assumption — authentication state itself, e.g. missing/expired tokens, is out of scope for FR-19). The specific `id`/`role` claims encoded in that token are the variable under test per case.

**Fixture (used throughout, drawn from actual `database.js` seed data):**

| id | name | email | role |
|---|---|---|---|
| 1 | Admin User | admin@eshop.com | admin |
| 2 | Test User | test@eshop.com | user |

---

## Assumption Legend

| Tag | Assumption |
|---|---|
| A1 | Fixture seed rows: id=1 "Admin User" (role=admin), id=2 "Test User" (role=user), per `database.js:91-93` — used throughout as concrete self/other/target identities — Step 0/3 |
| A2 | Obtaining a caller token with an arbitrary role (e.g. `"superadmin"`, EC3) requires first persisting that string to some user's DB `role` column (unconstrained TEXT, no `CHECK` constraint) and then performing a normal login — the login handler signs whatever value is present into the JWT (`server.js:51`) — Step 2 |
| A3 | V3's BVA is computed against the `id` column's structural domain (positive integer, `AUTOINCREMENT` floor = 1), independent of any specific row's existence — Step 3 |
| A4 | BVA's "valid, existing id" boundary points (LB=1, LB+1=2) collapse onto the already-planned self (EC5) / other (EC4) happy-path cases (TC-07 / TC-06 respectively), since the 2-row seed fixture assigns id=1 to the admin/self account and id=2 to the only available "other" account — no additional dedicated boundary cases needed — Step 4/5 combinatorial reduction |
| A5 | id-format invalid classes (`0`, `-1`, `"abc"`, `999999`) are each tested in isolation under a fixed valid `admin` caller role, independent of the self/other dimension, per the invalid-class isolation rule and the Step 4 finding that V2 only applies to V3=EC6 — Step 4 |
| A6 | Role-invalid isolated DELETE cases (TC-12/13) deliberately target the seeded Admin account (id=1) as the "other, existing" victim, rather than an arbitrary row, to demonstrate maximal real-world impact of the missing role check — Step 4/5 |
| A7 | GET's role-invalid isolated cases (TC-04/05) are fixed at table size N=2 (the normal seeded state), since table size does not interact with the role-rejection outcome — Step 4 |
| A8 | Password-field exclusion (V5) is checked as a standing oracle on every GET case in this suite, not a separately partitioned variable — Step 2 |
| A9 | TC-07, TC-12, and TC-13 are each destructive to the same seeded Admin row (id=1); each must be executed against an independently reseeded DB state, never sequentially against shared, unreset fixture data — Step 5 execution note |
| A10 | Non-admin-role cases (TC-04, TC-05, TC-12, TC-13, TC-15) require obtaining a valid JWT for a non-admin account via the shared `POST /api/login` endpoint (or the regular web frontend), since the admin panel's own login form blocks non-admin logins client-side (`App.jsx:65-68`) — this is a UI convenience gate only, not a security control, since the backend never checks role itself — Step 0/4 |
| A11 | TC-14/TC-15 (UI-channel cases) are added-value scenarios beyond the core EP/BVA methodology, included to demonstrate F1/F2 are trivially triggerable through the real admin UI, not just crafted API calls — mirrors the FR-04/FR-08 reports' treatment of bonus channel-crossing cases |

---

## 1. GET /api/admin/users — Happy-path × table size (V4 full cross, role=admin)
Channel: Direct API. Caller: role=`admin` (EC1) [A1].

| ID | Table size | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|
| TC-01 | 0 users (EC10) | LB | 200, `[]`, no crash | Executed (table emptied via TC-06+TC-07 deleting both seeded rows): 200, `[]` returned, no crash. Matches — `db.all` returns `[]` naturally; no branching to fail on | A8 |
| TC-02 | 1 user (EC11) | LB+1 | 200, array of 1, no `password` field | Executed (table shrunk to 1 row via TC-06): 200, array of 1 (Admin only), no `password` field present. Matches — `SELECT` explicitly excludes `password` | A8 |
| TC-03 | 2 users (EC12) | — | 200, array of 2, no `password` field | Executed on the freshly reseeded 2-row fixture: 200, array of 2, no `password` field present. Matches | A1, A8 |

## 2. GET /api/admin/users — Role isolated invalid classes (F1)
Channel: Direct API. Table size = 2 (fixed, A7).

| ID | Caller role | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-04 | `user` (EC2) | 403 — rejected, no data | Executed: 200, identical full 2-row list (both users, no password field) returned to a non-admin (`role:"user"`) caller. **Bug confirmed (F1):** no role gate exists | A7, A10 |
| TC-05 | `"superadmin"` (EC3, garbage) | 403 — rejected | Executed: with a freshly-minted JWT carrying `role:"superadmin"` (obtained by exploiting the FR-04 role-escalation bug then re-logging-in), 200, identical full list returned. **Bug confirmed (F1):** confirms the missing check is total, not merely "unrecognized real roles slip through" | A2, A7, A10 |

## 3. DELETE /api/admin/users/:id — Happy-path × self/other (V2 full cross, role=admin)
Channel: Direct API. Caller: role=`admin` (EC1), id=1.

| ID | Target | Class | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|---|
| TC-06 | id=2 (Test User) | EC4 — other | LB+1 | 200, Test User row removed | Executed: 200 "User deleted"; confirmed via subsequent GET that only Admin (id=1) remained. Matches — legitimate admin action succeeds correctly | A1, A4 |
| TC-07 | id=1 (own account) | EC5 — self | LB | 400/403 — rejected, account **not** deleted | Executed (on a freshly reset DB, per destructive-test protocol; DB reset again immediately after): 200 "User deleted"; confirmed via subsequent GET (using the still signature-valid admin token) that the users table was left empty. **Bug confirmed (F2, critical):** the admin's own row is removed; the calling account ceases to exist | A1, A4, A9 |

## 4. DELETE /api/admin/users/:id — Target-id isolated invalid classes (F4)
Channel: Direct API. Caller: role=`admin` (fixed, A5).

| ID | `id` value | Class | Boundary | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|---|---|
| TC-08 | `0` | EC-invalid | LB−1 | 400/404 — rejected | Executed: `200 "User deleted"`; confirmed via subsequent GET that both real rows (id=1, id=2) remained untouched. **Bug confirmed (F4):** `WHERE id = 0` matches 0 rows; handler ignores `this.changes`; false-positive success | A3, A5 |
| TC-09 | `-1` | EC8 | — | 400/404 — rejected | Executed: `200 "User deleted"`, 0 rows actually affected (both real rows confirmed intact afterward). **Bug confirmed (F4):** same false-positive 200 | A3, A5 |
| TC-10 | `"abc"` | EC9 | — | 400 — rejected (wrong type) | Executed: `200 "User deleted"`, 0 rows actually affected (both real rows confirmed intact afterward). **Bug confirmed (F4):** resolves the prior prediction exactly — SQLite's NUMERIC-affinity comparison fails to match any row for the non-numeric string, `this.changes` is ignored, and the handler still reports false-positive success | A5 |
| TC-11 | `999999` | EC7 | — | 404 — rejected (not found) | Executed: `200 "User deleted"`, 0 rows actually affected (both real rows confirmed intact afterward). **Bug confirmed (F4):** same false-positive 200 | A5 |

## 5. DELETE /api/admin/users/:id — Role isolated invalid classes (F1, compounded)
Channel: Direct API. Target: id=1 (Admin account — deliberately chosen victim, A6).

| ID | Caller role | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-12 | `user` (EC2) | 403 — rejected, Admin account untouched | Executed (on a freshly reset DB immediately before, and reset again immediately after, per destructive-test protocol): `DELETE /api/admin/users/1` using the plain `role:"user"` token → 200 "User deleted"; confirmed via GET that only Test User (id=2) remained — Admin account gone. **Bug confirmed (F1, critical, compounded):** total loss of the only admin account in the system, performed by a plain non-admin user | A1, A6, A9, A10 |
| TC-13 | `"superadmin"` (EC3, garbage) | 403 — rejected | Executed (on a freshly reset DB immediately before, and reset again immediately after, per destructive-test protocol): `DELETE /api/admin/users/1` using the `role:"superadmin"` garbage-role token → 200 "User deleted"; confirmed via GET that only Test User (id=2) remained. **Bug confirmed (F1):** confirms the missing check holds regardless of what nonsense role string is presented | A2, A6, A9, A10 |

## 6. UI-channel confirmatory cases (added-value, beyond core EP/BVA methodology) [A11]

| ID | Scenario | Expected (per spec) | Actual / Bug flag | Assumptions |
|---|---|---|---|---|
| TC-14 | Admin (role=admin) logs into `frontend-admin` normally, opens "Quản lý Người dùng", clicks "Xóa" on the row matching their own account | Action blocked or requires explicit confirmation before any request is sent | Executed (manual UI test): clicked "Xóa" on the Admin's own row — no confirmation dialog appeared at all, and the account was deleted immediately. **Bug confirmed (F2):** `deleteUser(u.id)` (`App.jsx:76-83`) fires unconditionally for any row, with no confirmation dialog and no self-id awareness — the app never decodes its own id (confirmed in Step 0). The DELETE succeeds exactly as in TC-07; the admin is locked out on the next request | A9, A11 |
| TC-15 | A non-admin token (obtained via the shared `POST /api/login`, e.g. Test User's credentials) is manually placed into `localStorage["adminToken"]`, and the admin panel is reloaded — bypassing the login form's client-side role check (`App.jsx:65-68`) entirely | Panel refuses to render / redirects a non-admin session | Executed (manual UI test): placed a non-admin token into `localStorage["adminToken"]` and reloaded the admin panel — the full dashboard rendered anyway. **Bug confirmed (F1):** `useEffect` (`App.jsx:34-39`) calls `fetchData()` for any truthy `token` regardless of role, including a working Users tab with delete buttons — same root cause as TC-04, now demonstrated through the real UI rather than a raw API call | A10, A11 |

---

## Summary of Confirmed/Expected Defects

1. **Critical: no role check on either admin/users endpoint (F1).** `GET /api/admin/users` and `DELETE /api/admin/users/:id` apply only `authenticateToken`, which verifies the JWT signature but never inspects `req.user.role`. Any authenticated account — a real `user`-role account or one carrying an arbitrary garbage role string — can list all users and delete any user, including the sole admin account (TC-04, TC-05, TC-12, TC-13). Confirmed reachable through the real UI, not just direct API calls (TC-15). **GitHub Issue:** [BUG-C-08 #41](https://github.com/dinosauce-285/Software-Testing-G02/issues/41)
2. **Critical: no self-deletion guard (F2).** The DELETE handler never compares `req.params.id` to `req.user.id`; an admin can delete their own currently-logged-in account, directly violating the spec's explicit exception clause (TC-07). Confirmed trivially triggerable via a normal UI click, with no confirmation dialog (TC-14). **GitHub Issue:** [BUG-C-09 #42](https://github.com/dinosauce-285/Software-Testing-G02/issues/42)
3. **Compounded severity:** F1 and F2 together mean a plain `user`-role account can delete the system's only admin account (TC-12) — a full administrative lockout, not merely an unauthorized read/delete of an arbitrary row.
4. **Minor: DELETE never validates rows affected (F4).** The handler ignores `this.changes`; deleting a non-existent (`999999`), negative (`-1`), zero (`0`), or non-numeric (`"abc"`) id all confirmed to return a false-positive `200 "User deleted"` with zero actual effect (TC-08, TC-09, TC-10, TC-11) — including the non-numeric case, confirmed via execution to behave identically via SQLite's type-affinity fallback. **GitHub Issue:** [BUG-C-10 #43](https://github.com/dinosauce-285/Software-Testing-G02/issues/43)
5. **No defect:** password is never exposed in any GET response, across all table sizes and even in the erroneous non-admin-accessible responses (TC-01–TC-05).
6. **No defect:** an admin deleting a different, existing user works correctly and is the only scenario in this suite that behaves per spec (TC-06).
