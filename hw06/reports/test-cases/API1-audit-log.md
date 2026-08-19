# API 1 (`GET /api/products`) — Audit step log

Human review of all 38 AI-generated cases from `API1-generation-log.md`, verified
empirically against the live SUT (`curl` against `http://localhost:4000`) rather than
taken on faith.

## Verdicts

| ID | Verdict | Why |
|---|---|---|
| PA-01 – PA-08 | VALID | Confirmed exactly as generated |
| **PA-09** | **INVALID → corrected** | AI assumed a single space is JS-falsy like an empty string, so it lumped this in with the absent-param partition. Wrong: a single space is truthy, so it *does* take the SQL LIKE branch. It only happens to also return all 5 products, but for a completely different reason (every seeded name contains a space, so the wildcard-wrapped space matches all of them). Same visible number, wrong mechanism — corrected the reasoning, kept expected_behavior as `all_5` since it happened to still be right. |
| PA-10, PA-11 | VALID | Confirmed |
| **PA-12** | **INVALID → corrected** | AI assumed the server trims leading/trailing whitespace before matching (common in real search UIs). It doesn't — zero trimming anywhere in `server.js`. `'% iPhone %'` requires a literal space immediately before "iPhone" in the stored name, and there isn't one (it's the first word). Corrected expected_behavior from `all_5` to `empty`. |
| PA-13 | VALID | Confirmed — 200, empty, no crash on a 2000-char input |
| **PA-14** | **INCOMPLETE → completed** | AI only wrote "should be handled gracefully" as the expectation — not falsifiable. Traced through `qs`'s duplicate-key parsing (→ array) and JS's `Array.prototype.toString()` (`['a','b'].toString()` → `"a,b"`) to get a concrete, checkable expected value: 200, empty array. |
| PA-15, PA-16 | VALID | Confirmed — Vietnamese diacritics match correctly across a word boundary |
| **PA-17** | **INVALID → corrected** | AI assumed `search[]=x` is equivalent to a plain string search for `"x"`. Wrong: with that key shape, `req.query.search` (the literal key `"search"`) is `undefined`, not an array — the else branch runs and all 5 products come back, regardless of `x`. Corrected expected_behavior from "count of names containing x" to `all_5`. |
| PA-18 – PA-38 | VALID | Confirmed against the live SUT |

## Summary
- 34 / 38 correct as generated.
- 4 / 38 required correction (2 invalid due to unverified whitespace-trimming/parameter-shape
  assumptions, 1 invalid due to a parsing-model error, 1 incomplete due to a non-falsifiable
  expected result).
- Root cause pattern across all 4: the AI reasoned about *plausible* framework/SUT behavior
  instead of the *actual* behavior — exactly why the empirical `curl` verification pass in
  this conversation (documented in the tool transcript) was run before finalizing the CSV,
  rather than trusting the first draft.

See the `audit_notes` column in `API1-products-search-cases.csv` for the per-row detail.
