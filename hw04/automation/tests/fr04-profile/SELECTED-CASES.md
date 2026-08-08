# FR-04 — Personal Profile Management: Selected Cases for Automation

Source: [`hw02/.../FR-04-ProfileManagement/DomainTesting_BVA.md`](../../../hw02/23127244_HW02_AI_DomainTesting_100/reports/FR-04-ProfileManagement/DomainTesting_BVA.md)

12 of the 37 HW02 test cases were selected — all driven purely through the real browser UI (`Profile.jsx`), none invented, none with their field-under-test value or expected result changed. Grouped into 3 scripts, one data file each.

| Script | Data file | Cases | Assertion pattern |
|---|---|---|---|
| `profile-valid-boundary.spec.ts` | `data/fr04-valid-boundary.json` | TC-01, TC-02, TC-03, TC-04, TC-37 (5) | Network/response assertion (status 200) + reload-and-verify, since `PUT /api/users/me` only ever returns `{"message": "Profile updated"}` (no echoed fields) so status alone can't confirm persistence |
| `profile-invalid-fields.spec.ts` | `data/fr04-invalid-fields.json` | TC-06, TC-07, TC-09 (3) | Persisted-state assertion: reload the page, assert the (buggy) value still shows via the field's DOM state |
| `profile-phone-bugs.spec.ts` | `data/fr04-phone-bugs.json` | TC-11, TC-13, TC-15, TC-23 (4) | Dialog assertion: assert the `window.alert()` text (blocked vs. wrongly accepted) |

Three distinct assertion mechanisms across the suite (network/response, DOM/persisted-state, dialog), satisfying the >=3-distinct-pattern requirement without leaving pure-UI scope.

## Filler consistency note (not a modification)

7 of these cases (TC-01/02/03/04/06/07/09) test Name/Address; Phone is only a filler value, not the field under test. HW02's Direct-API report used an empty-string phone filler for these (valid, since Phone is optional per spec). On the UI channel that filler doesn't work: an empty phone trips the frontend's buggy regex and blocks the *entire* form submission (this is TC-11's bug), which would mask Name/Address behind an unrelated failure. The report's own methodology already anticipated this exact problem (assumption A7: "filler value for a field NOT under test is chosen to avoid masking the field that IS under test") — TC-37 already used a different filler (`"912345678"`, tagged A8) for this reason. These 7 cases reuse that same already-established A8 filler on the UI channel. The field under test, and its expected result, are unchanged from the source report.

## Excluded — structurally impossible via UI (not attempted, not modified to fit)

- **TC-05** (empty name) — the Name `<input>` has a native HTML5 `required` attribute; an empty submission never reaches the network, so the UI can't reproduce the backend's "zero validation" bug for this specific case.
- **TC-08/TC-10/TC-22** (field omitted from the JSON body entirely) — a real form always sends all 3 fields together; there is no user interaction that omits a key.
- **TC-24-33** (Email immutability, Role escalation, incl. the critical `#TC-31` privilege-escalation bug) — neither field is exposed anywhere in the UI; there is no element to interact with.
- **TC-34/TC-35** (auth-state: missing/invalid token) — testable via UI only by reinterpreting the assertion (observed page state instead of the literal 401/403 response), which would mean not automating the case as originally defined. Left out to keep this batch strictly unmodified.

These are documented here as candidates for a future API-channel batch, and — since TC-31 is the single most severe defect found in HW02 — worth calling out explicitly in the final report's gap analysis as a known coverage gap of this UI-only automation pass.
