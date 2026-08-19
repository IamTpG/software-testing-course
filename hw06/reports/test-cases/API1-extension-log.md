# API 1 (`GET /api/products`) — Extension step log

5 original test cases added on top of the audited 38, covering things the AI-generated
set missed entirely (Section 6, requirement 3).

| ID | What it tests | Why the AI missed it |
|---|---|---|
| **EXT-01** | UNION-based SQL injection that exfiltrates every seeded user's `email` + plaintext `password` through the same injection point | The AI's SQLi cases (PA-18–21) stopped at boolean/error-based probing. A UNION payload requires knowing the target table's exact column count and order (`products` has 6 columns) — that's schema-aware exploitation, which needs an explicit self-verification step ("read the schema first") that a one-shot "generate SQLi test cases" prompt never performs on its own. |
| **EXT-02** | The 500 error path leaks the raw `SQLITE_ERROR: ...` engine message in the HTML body | AI-generated schema/error cases (PA-18, PA-21, PA-30) only assert the status code bucket. Checking response **body content** on an error path for information disclosure needs security-specific framing, not generic API-contract framing. |
| **EXT-03** | Negative test confirming stacked queries (`; SELECT ...`) do **not** execute via this driver | Requires SUT/driver-specific knowledge (`node-sqlite3`'s `db.all()` only prepares the first statement) that no generic prompt has. Also documents *why* a destructive payload like `DROP TABLE` was deliberately never attempted against the shared local instance — it wouldn't have worked anyway via this code path, but that conclusion needed verifying, not assuming. |
| **EXT-04** | Content-Type is `text/html` on the error path vs. `application/json` on success, for the *same* endpoint | AI generates schema checks per single response state. Comparing headers **across** two different states of the same request requires an explicit cross-case assertion the generation prompts never asked for. |
| **EXT-05** | The credential values leaked via EXT-01 are literal plaintext (`Admin123!`), not a bcrypt/argon2 hash | Requires security-engineering domain knowledge (what a real password hash looks like — `$2b$`/`$2a$` prefix, ~60 chars) to think to assert on. A generic prompt notices a field exists; it doesn't independently reason about whether its *format* is safe. |

EXT-01/02/03/05 all chain off the same confirmed SQL injection point and get folded
into one Critical-severity GitHub issue (see the bug report). EXT-04 is a separate,
lower-severity API-contract defect.
