# API 2 (`POST /api/cart`) — Execution step log

## Structural note: 3 chained Newman runs, not 1
Unlike API 1, this API needs stateful setup (register/login a test user, capture the JWT)
*before* the data-driven body-variation cases, and stateful verification (round-trip
integrity, duplicate-add counting, cross-user isolation) *after* them. Running everything
as one folder with `-d` would replay the setup/verification requests on all 31 CSV
iterations (confirmed by an early dry-run — it silently created 31 different throwaway
users). Split into 3 folders, chained via `--export-environment` / `-e`:

1. **`API 2a - Setup`** (1 iteration): register + login a fresh, uniquely-timestamped test
   user, capture `{{userToken}}`. Also covers **EXT2-05** here (decodes the JWT payload,
   asserts no `exp` claim) and **PB-40** (fresh cart is `[]`).
   ```
   newman run EShop-HW06.postman_collection.json -e EShop-HW06.postman_environment.json \
     --folder "API 2a - Pool B - Setup (register/login cart-test user A)" \
     --export-environment /tmp/env1.json \
     --reporters cli,htmlextra --reporter-htmlextra-export ../results/23127244_API2_cart_setup.html
   ```
   Result: **4/4 assertions pass.**

2. **`API 2b - Add to cart (data-driven, 31 cases)`**: reuses `{{userToken}}` from stage 2a
   via `-e /tmp/env1.json`.
   ```
   newman run EShop-HW06.postman_collection.json -e /tmp/env1.json \
     -d data/api2_cart_add.csv \
     --folder "API 2b - Pool B - Add to cart (data-driven, 31 cases via CSV)" \
     --export-environment /tmp/env2.json \
     --reporters cli,htmlextra --reporter-htmlextra-export ../results/23127244_API2_cart_datadriven.html
   ```
   Result: **31/31 iterations, 59/59 assertions pass.**

3. **`API 2c - Verification, error handling & security`**: reuses the same `{{userToken}}`
   (now with 31+ items in its cart) via `-e /tmp/env2.json`.
   ```
   newman run EShop-HW06.postman_collection.json -e /tmp/env2.json \
     --folder "API 2c - Pool B - Verification, error handling & security" \
     --reporters cli,htmlextra --reporter-htmlextra-export ../results/23127244_API2_cart_verify.html
   ```
   Result: **14/14 requests, 15/15 assertions pass.**

**Total: 45/45 test cases pass** (78 assertions across the 3 stages), reports in `results/`.
Every request carries `X-Student-Id: 23127244` via the same collection-level pre-request
script used for API 1.

## Bugs identified (see the GitHub Issues bug report for full write-ups)
1. **Medium — zero server-side input validation on `POST /api/cart`.** Every field
   (`id`/`name`/`price`/`quantity`) accepts any JSON-serializable value — wrong types,
   negative/zero/extreme numbers, missing fields, even a JSON array or empty object as the
   whole body — with no rejection. Confirmed individually (PB-02…22) and combined into one
   maximally-hostile single request (EXT2-01). Chains into a mass-assignment gap (EXT2-02):
   arbitrary fields like `isAdminAddedFreeItem` are stored verbatim with no allowlist.
2. **Low — Content-Type-missing requests silently corrupt the cart's shape (EXT2-03).** A
   POST without a matching Content-Type header isn't rejected; `req.body` ends up
   `undefined`, gets pushed anyway, and `JSON.stringify` turns it into a `null` array
   element on the next GET — a client iterating the cart has to defensively handle `null`.
3. **Low — duplicate adds are never merged, with no cap (PB-29/EXT2-04).** Re-adding the
   same product id creates a new, separate line item every time instead of incrementing
   quantity, and nothing bounds how many times this can repeat.
4. **Informational/hardening — JWTs are issued with no `exp` claim (EXT2-05).** Decoded a
   real token's payload: `{id, role, iat}` only. Tokens are valid forever; there's no
   revocation mechanism either. Not one of SEC-01–07 verbatim, but in SEC-02's spirit.

## What held up well (worth documenting as passing controls, not just failures)
- **Auth enforcement is solid**: missing header → 401, malformed token → 403, *tampered
  signature* → 403 (real signature verification, not just structural JWT parsing), missing
  `Bearer ` prefix → 401 (PB-31–34).
- **Cross-user cart isolation is solid** (PB-35): a second user's cart never sees the
  first user's dozens of added items — carts are correctly scoped per authenticated
  `req.user.id`, with no client-controllable user-id parameter to exploit.
- **No SQL injection surface here** (contrast with API 1): cart storage is a plain
  in-memory JS object (`userCarts`), not a database query — confirmed by reading
  `server.js:290-295` before testing, which is *why* PB-36's XSS-style payload test exists
  instead of a SQLi one for this API — the risk model genuinely differs per endpoint.
