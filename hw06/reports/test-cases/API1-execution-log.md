# API 1 (`GET /api/products`) — Execution step log

## Setup
- SUT backend running locally on `http://localhost:4000` (port 3000 was taken by an
  unrelated project; `PORT` env var made configurable — see `TASKS-CHECKLIST.md` Phase 0).
- Postman collection: `postman/EShop-HW06.postman_collection.json`
- Environment: `postman/EShop-HW06.postman_environment.json` (`baseUrl=http://localhost:4000`, `studentId=23127244`)
- Every request carries `X-Student-Id: 23127244` via a **collection-level pre-request script**
  (`console.log` added so it's visible in the Postman Console for the anti-cheat screenshot).

## Runs
Two Newman invocations for API 1 (the data-driven set and the 3 fixed-URL-shape edge
cases need different CSV/no-CSV modes, so they're two runs rather than one):

1. **Data-driven (40 cases, PA-02–PA-38 minus the 3 special-shape ones, plus EXT-01–05):**
   ```
   newman run EShop-HW06.postman_collection.json -e EShop-HW06.postman_environment.json \
     -d data/api1_products_search.csv \
     --folder "Search products (data-driven, 40 cases via CSV)" \
     --reporters cli,htmlextra \
     --reporter-htmlextra-export ../results/23127244_API1_products-search_datadriven.html
   ```
   Result: **40/40 iterations, 178/178 assertions passed, 0 failed.**

2. **Fixed-URL-shape edge cases (PA-01 absent param, PA-14 duplicate param, PA-17 bracket-array):**
   ```
   newman run EShop-HW06.postman_collection.json -e EShop-HW06.postman_environment.json \
     --folder "PA-01 - No search param at all" \
     --folder "PA-14 - Duplicate search query parameter" \
     --folder "PA-17 - Bracket-array search shape (search[]=x)" \
     --reporters cli,htmlextra \
     --reporter-htmlextra-export ../results/23127244_API1_products-search_edgecases.html
   ```
   Result: **3/3 requests, 3/3 assertions passed, 0 failed.**

**Total: 43/43 test cases pass** (all pre-audited/corrected expected values hold against the
live SUT), reports saved under `results/`.

## A mistake caught only at execution time
PA-34 (trailing-space-only search, `"iPhone "`) was marked `empty` (0 results) during the
earlier audit pass, generalizing from PA-12 (leading+trailing spaces together, which
correctly returns 0). Running it for real against the live SUT returned 1 result, not 0 —
the audit's generalization was wrong: the real product name `"iPhone 15 Pro Max"` has a
literal space immediately after "iPhone" (before "15"), so the trailing-space-only pattern
does match it, while the leading-space case still doesn't (no product starts with a space).
Corrected in `API1-products-search-cases.csv` (row re-labeled `INVALID`, corrected
expected value `count=1`) and in `postman/data/api1_products_search.csv`. Kept here as an
honest record that even the "audited" pass wasn't perfect until it was actually executed —
consistent with this whole homework's discipline of not trusting an assumption until it's
been run against the real system.

## Bugs identified (see the GitHub Issues bug report for full write-ups)
1. **Critical — SQL injection (SEC-05) chained with plaintext passwords (SEC-01).**
   `search` is concatenated directly into the SQL query. A UNION-based payload dumps every
   seeded user's email + plaintext password through this public, unauthenticated endpoint.
2. **Medium — verbose DB error disclosure.** Malformed `search` values trigger a 500 with
   the raw `SQLITE_ERROR: ...` message and "Database Error" HTML page returned to the client.
3. **Low — API contract inconsistency.** Success responses are `application/json`; error
   responses on the same endpoint are `text/html`, breaking a uniform-JSON-API expectation.
