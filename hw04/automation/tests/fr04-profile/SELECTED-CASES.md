# FR-04 — Personal Profile Management: Selected Cases for Automation

Source: [`hw02/.../FR-04-ProfileManagement/DomainTesting_BVA.md`](../../../hw02/23127244_HW02_AI_DomainTesting_100/reports/FR-04-ProfileManagement/DomainTesting_BVA.md)

15 of the 37 HW02 test cases were selected to (a) cover every EP/BVA category for this feature, (b) balance positive/negative/edge types, and (c) preserve every confirmed HW02 defect so the automation suite has real bug-detection value.

| # | HW02 ID | Category | Type | Channel | Rationale |
|---|---|---|---|---|---|
| 1 | TC-02 | Name/Address boundary | Positive/edge | UI | LB+1 valid save, confirms happy path |
| 2 | TC-04 | Name/Address boundary | Positive/edge | UI | UB (100/255 char) valid save |
| 3 | TC-37 | Full form | Positive | UI | End-to-end save of all 3 fields |
| 4 | TC-05 | Name invalid | Negative | UI | Bug: empty name silently accepted |
| 5 | TC-06 | Name invalid | Negative | UI | Bug: whitespace-only name accepted |
| 6 | TC-07 | Name invalid | Negative/edge | UI | Bug: 101-char name, no cap enforced |
| 7 | TC-09 | Address invalid | Negative/edge | UI | Bug: 256-char address, no cap enforced |
| 8 | TC-11 | Phone | Negative | UI | Bug: empty phone blocks the whole form |
| 9 | TC-13 | Phone | Negative | UI | Bug: spec-valid 10-digit phone wrongly rejected |
| 10 | TC-15 | Phone | Negative/edge | UI | Bug: spec-valid 11-digit phone wrongly rejected |
| 11 | TC-23 | Phone | Negative | UI | Bug: wrong-prefix phone wrongly accepted |
| 12 | TC-34 | Auth state | Negative | API (Playwright `request`) | No auth header -> 401 |
| 13 | TC-35 | Auth state | Negative/edge | API (Playwright `request`) | Malformed JWT -> 403 |
| 14 | TC-26 | Email immutability | Negative | API (Playwright `request`) | Spec invariant: email never changes via this endpoint |
| 15 | TC-31 | Role escalation | Negative/critical | API (Playwright `request`) | Critical bug: self-promotion to `admin` |

**Channel note:** the UI form (`Profile.jsx`) only exposes Name, Phone, Address. Email and Role have no UI control, so TC-26/31/34/35 are driven via Playwright's `request` fixture instead of form interaction — still automating against this feature's session/auth boundary, just not a form-fill.

**Not automated this round (candidates for a later pass if time allows):** TC-08/10/22 (NULL-coercion-on-field-omission bug), TC-01/03 and TC-12/14/16 (redundant boundary/API-channel duplicates of cases already covered above), TC-17-22 (additional isolated invalid phone classes beyond TC-11/13/15/23), TC-24/25/27/28-30/32/33/36 (secondary email/role/cross-user cases).
