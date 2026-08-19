# Postman Features Used (Section 6, technical requirements)

## Collections
One collection, `EShop-HW06.postman_collection.json`, organized into per-API folders
(mirroring the pipeline's 3 selected endpoints). Requests within API 2 and API 3 are
further split into `a` (setup) / `b` (data-driven) / `c` (verification) sub-folders — a
single "run the whole folder with a data file" invocation would otherwise replay stateful
setup/verification requests on every CSV iteration (this was discovered the hard way
during API 2's first dry-run and documented in `test-cases/API2-execution-log.md`).

## Environments
`EShop-HW06.postman_environment.json` holds `baseUrl`, `studentId`, and credential/token
placeholders (`userToken`, `adminToken`, etc., marked as `secret` type variables). Running
against a different deployment only requires swapping this one file — no request needs
editing.

## Variables (collection- and environment-scope)
- **Environment variables**: `baseUrl`, `studentId`, seeded credentials, and the JWTs
  captured at runtime (`userToken`, `adminToken`, `userTokenB`).
- **Collection variables**: ephemeral per-run values that don't belong in a checked-in
  environment file — dynamically generated unique emails (`cartUserAEmail`,
  `cartUserBEmail`, `couponsUserEmail`, all suffixed with `Date.now()` so re-running the
  suite never collides with a prior run's test users), and tampered-token values built at
  runtime (`tamperedToken`, `tamperedAdminToken`) for the signature-verification checks.

## Pre-request scripts
- **Collection-level**: attaches the required `X-Student-Id: 23127244` header to *every*
  request in the collection (the anti-cheat requirement), with a `console.log` so it's
  visible in the Postman Console for the required screenshot.
- **Request-level**: build the query string or request body dynamically from the current
  data-file row (`pm.iterationData.get(...)`) rather than raw string templating, so
  special characters (quotes, spaces, Unicode, `<script>` tags) are handled correctly by
  Postman's own encoding rather than manual escaping. Also used to construct a
  deliberately tampered JWT signature at runtime for the signature-verification tests.

## Test scripts (`pm.test` / Chai assertions)
Every request has status-code and (where relevant) response-schema/body assertions. Test
titles are dynamically built from the current data row's `id` (e.g. `PA-19: status code is
200`) so a Newman failure output is self-identifying without needing to cross-reference a
row number. Several test scripts assert against the SUT's actual (buggy) behavior with a
`BUG (...)` prefix in the test name — e.g. `EXT3-01: BUG (Critical) - the SAME non-admin
user then deletes it`, so a passing test doubles as **regression-locked evidence of a
confirmed defect**, not just a happy-path check.

## Data-driven testing (Collection Runner + Newman `-d`)
Three data files drive the bulk of the 133 automated cases:
- `data/api1_products_search.csv` — 40 rows
- `data/api2_cart_add.csv` — 31 rows
- `data/api3_coupons_create.csv` — 31 rows

Each row supplies the request body/query value plus the expected status/behavior, so a
single request definition covers dozens of test cases without duplicating requests.

## Chained runs via `--export-environment`
API 2 and API 3 each need state to persist across a setup step (register/login, capture a
JWT), the many data-driven iterations, and a verification step (round-trip integrity,
cross-user isolation, privilege-escalation checks) — all using the *same* captured token.
Achieved with `--export-environment` between three separate `newman run` invocations
(rather than one), so state flows forward correctly. Documented in each API's
`execution-log.md`.

## HTML reporting (`newman-reporter-htmlextra`)
Every run is executed with `--reporters cli,htmlextra` for a rich, browsable HTML report
(request/response bodies, headers, per-assertion pass/fail) — see `results/*.html`.

## CI/CD integration (GitHub Actions)
The full collection is re-run automatically via GitHub Actions on every push touching
`hw06/**` — see `.github/workflows/hw06-api-tests.yml` and `reports/CICD-Report.md`.

## Not used (and why)
- **Postman Monitors / Mock Servers**: this SUT runs locally (`localhost:4000`), not on a
  publicly reachable URL, so a Postman-hosted Monitor can't reach it, and a Mock Server
  wasn't needed since a real, working backend was available throughout. GitHub Actions
  fills the "scheduled/automated re-run" role a Monitor would otherwise provide.
- **Postman Workspaces**: this is a solo assignment with no team members to share a
  Postman workspace with; the collection/environment JSON files committed to this repo
  serve the same "shareable, versioned" purpose without needing a paid/team workspace.
