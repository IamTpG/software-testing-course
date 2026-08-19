# API 1 (`GET /api/products`) — Generation step log

Excerpt for the AI Audit Report (Section 9). This session (Claude Sonnet 5, Claude Code CLI)
was driven step-by-step, not with one generic prompt, per Section 6's requirement.

## Interaction 1 — 2026-08-19 — Read the SUT implementation before generating anything
**Prompt (paraphrased from conversation):** "Read the `GET /api/products` handler in
`server.js` before designing any test cases — don't generate from the spec text alone."
**Output:** Found `server.js:141-157` builds the SQL query via raw template-string
concatenation (`WHERE name LIKE '%${searchQuery}%'`), a direct SEC-05 violation. No auth
required on this route. Error path returns raw `err.message` in an HTML body with a 500
status. This grounded every later test case in the real code path, not assumptions.

## Interaction 2 — 2026-08-19 — Generate domain-partition test cases for the `search` param
**Prompt:** "Enumerate equivalence classes and boundary values for the single `search`
query parameter: presence/absence, case sensitivity, SQL LIKE special characters (`%`,
`_`), Unicode/Vietnamese text, whitespace handling, duplicate/malformed parameter shapes,
and length boundaries."
**Output:** 16 domain-partition cases (PA-01 through PA-16, plus PA-31/32/34/35/36 added
in a follow-up pass) — see `API1-products-search-cases.csv`.

## Interaction 3 — 2026-08-19 — Generate security test cases against SEC-01–SEC-07
**Prompt:** "Given the confirmed string-concatenation SQL query, generate SEC-05-focused
SQL injection probes (syntax-breaking, boolean-based bypass, boolean-based blind), plus a
check for reflected/XSS-style payloads on the response, referencing the SEC-01–SEC-07
list in `eshop-sut/README.md`."
**Output:** 6 security cases (PA-17 through PA-22).

## Interaction 4 — 2026-08-19 — Generate schema-validation test cases
**Prompt:** "Generate schema-validation cases for the response: content-type, top-level
shape, per-field presence/type, and a check for the error path's content-type versus the
success path's."
**Output:** 8 schema cases (PA-23 through PA-30, plus PA-33/38).

**Result of this generation pass: 38 test cases**, drafted BEFORE empirical verification
or human audit — see `API1-products-search-cases.csv` at this commit for the raw,
pre-audit expected values (4 of them are wrong or incomplete; corrected in the next commit
during the audit pass, with reasoning kept in the CSV's `audit_notes` column).
