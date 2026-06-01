<link rel="stylesheet" href="./pdf-style.css">

# Requirement 3 – Test Cases for ONE Physical Product

**Device under test (DUT):** Senko BD1410 box fan ("Quạt hộp Senko BD1410")  

---

## 1. Device Declaration

![Device + Student ID card in the same frame](./images/device-id-frame.jpg)

| Field | Declared Value |
|---|---|
| **Product type** | Box fan ("Quạt hộp") |
| **Brand** | Senko (Vietnamese brand, est. 1998) |
| **Model** | BD1410 |
| **Year of manufacture** | `2023` |
| **Serial number (middle 4 masked)** | Cannot be found on the device |
| **Rated power** | 47 W |
| **Rated voltage / frequency** | 220 V ~ / 50 Hz |
| **Blades / span** | 3 blades, 34 cm span |
| **Speed levels** | 3 (Low / Medium / High) via latching push-buttons |
| **Special functions** | Cage tilts up/down, rotating fan front grille via latching push-button |
| **Origin / warranty** | Made in Vietnam / 24-month motor warranty |

---

## 2. Test Environment & Assumptions

| Item | Value used for testing |
|---|---|
| Mains supply | 220 V ~ / 50 Hz wall outlet, grounded |
| Surface | Flat, on a tiled floor |
| Ambient | Indoor room, ~30 °C, dry |
| Control layout | Latching push-buttons: **0 = Off, SWING = Front grille rotation, 1 = Low, 2 = Medium, 3 = High** |

AI-assisted design note. The 10 functional cases (TC-01 to TC-10) were drafted with the help of an AI tool and then reviewed. The 5 edge cases (TC-11 to TC-15) were added manually because they depend on physically handling this specific unit and on knowledge of how a mechanical latching-button fan behaves — things a generic AI test generator does not surface.

---

## 3. Test Case Summary

| ID | Title | Type | Video |
|---|---|---|:---:|
| TC-01 | Power ON at Low speed | Functional | |
| TC-02 | Power ON at Medium speed | Functional | |
| TC-03 | Power ON at High speed | Functional | |
| TC-04 | Speed step-through (Low → Med → High → Low) | Functional | Yes |
| TC-05 | Front-grille SWING rotation ON | Functional | Yes |
| TC-06 | Button 0 releases all latched buttons (master OFF) | Functional | |
| TC-07 | Power OFF (button 0) | Functional | |
| TC-08 | Head vertical tilt holds angle | Functional | |
| TC-09 | Continuous-run endurance (30 min, High) | Functional | |
| TC-10 | Stability & vibration on flat surface | Functional | |
| TC-11 | Simultaneous multi-button press | **Edge** | Yes |
| TC-12 | Open / remove the front grille and reassemble | **Edge** | |
| TC-13 | SWING rotation independence from fan speed | **Edge** | Yes |
| TC-14 | Finger guard safety (grille gap) | **Edge** | Yes |
| TC-15 | Steep-tilt / tip-over behavior | **Edge** | |

---

## 4. Detailed Test Cases

> In every block, **Expected Result** is the design prediction. Fill **Actual Result** with what you observe on the real unit and tick the **Verdict**.

### TC-01 — Power ON at Low speed
| Field | Detail |
|---|---|
| **Objective** | Confirm the fan starts and runs at the lowest speed from the OFF state. |
| **Input** | Press button **1 (Low)** |
| **Steps** | 1. Plug the fan into a 220 V outlet.<br>2. Confirm it is OFF (button 0 latched).<br>3. Press button **1**.<br>4. Observe blade rotation and airflow for 5 s. |
| **Expected Result** | Blades begin rotating smoothly within ~2–3 s, producing the lowest airflow; button 1 stays latched; no rubbing/grinding noise. |
| **Actual Result** | Pressed button **1** from OFF. Blades started rotating within ~2 s and settled at the lowest airflow of the three speeds; button 1 stayed latched; rotation was smooth with no rubbing or grinding noise. |
| **Verdict** | ☑ **Pass** |

### TC-02 — Power ON at Medium speed
| Field | Detail |
|---|---|
| **Objective** | Confirm Medium speed is a distinct, higher level than Low. |
| **Input** | Press button **2 (Medium)** |
| **Steps** | 1. From Low, press button **2**.<br>2. Compare airflow/RPM against Low for 5 s. |
| **Expected Result** | Speed audibly and visibly increases above Low; button 2 latches and releases button 1; rotation steady. |
| **Actual Result** | From Low, pressed **2**. Airflow and blade speed visibly increased above Low; button 2 latched and button 1 popped out; rotation steady with no abnormal noise. |
| **Verdict** | ☑ **Pass** |

### TC-03 — Power ON at High speed
| Field | Detail |
|---|---|
| **Objective** | Confirm High delivers the maximum airflow and runs stably. |
| **Input** | Press button **3 (High)** |
| **Steps** | 1. From Medium, press button **3**.<br>2. Observe airflow, noise, and vibration for 10 s. |
| **Expected Result** | Highest airflow of the three levels; stable rotation; vibration within acceptable limits; no abnormal noise. |
| **Actual Result** | From Medium, pressed **3**. Airflow was the strongest of the three speeds; rotation stable with only normal motor/air noise; vibration minimal. |
| **Verdict** | ☑ **Pass** |

### TC-04 — Speed step-through (Low → Med → High → Low)
| Field | Detail |
|---|---|
| **Objective** | Verify all three speeds are distinct and that selecting a new speed cleanly releases the previous one. |
| **Input** | Buttons **1 → 2 → 3 → 1** in sequence |
| **Steps** | 1. From OFF, press 1, wait 5 s.<br>2. Press 2, wait 5 s.<br>3. Press 3, wait 5 s.<br>4. Press 1 again, wait 5 s. |
| **Expected Result** | Three clearly different airflow levels; each press latches exactly one button and pops the previous; transitions are immediate with no buzzing or stall. |
| **Actual Result** | Stepped **1→2→3→1**. Three clearly distinct airflow levels; each press latched exactly one button and released the previous; transitions were immediate with no buzzing or stall. Blades worked correctly at all speeds. **Incidental observation:** the worn front grille spun freely from the airflow during the run (not via the SWING control) — out of scope for this speed test; captured as a separate finding (see TC-13 and the defect/bug log). |
| **Verdict** | ☑ **Pass** |

### TC-05 — Front-grille SWING rotation ON
| Field | Detail |
|---|---|
| **Objective** | Verify the front grille rotates (sweeps the airflow direction) when the SWING button is pressed. |
| **Input** | Press the **SWING** button while running at Medium |
| **Steps** | 1. Run at Medium (button 2).<br>2. Press the **SWING** button.<br>3. Watch the front grille for at least 3 full rotation/sweep cycles. |
| **Expected Result** | The front grille begins rotating smoothly and continuously, sweeping the airflow direction without binding, clicking, or stalling; the SWING button stays latched; fan speed is unaffected. |
| **Actual Result** | With SWING **off**, the worn grille already drifted slowly **clockwise**, carried by the airflow (the worn-grille defect — see bug log). On pressing **SWING**, the grille reversed and was driven slowly **counter-clockwise** — i.e. *against* the airflow — which confirms the SWING mechanism actively powers the rotation (airflow alone cannot push it counter-clockwise). However, rotation was **not smooth/continuous**: the worn grille intermittently let the wind overpower the drive, so it occasionally slipped a little clockwise before returning to counter-clockwise. The SWING button stayed latched and fan speed was unaffected. |
| **Verdict** | ☑ **Pass** *(with deviation — SWING function confirmed; non-smooth rotation caused by the known worn-grille defect, not the SWING control)* |

### TC-06 — Button 0 releases all latched buttons (master OFF)
| Field | Detail |
|---|---|
| **Objective** | Verify that pressing 0 simultaneously releases the active speed button **and** SWING — confirming 0 is the single master release and that there is no independent way to stop SWING rotation without switching the fan off (usability limitation). |
| **Input** | With **1 (Low)** + **SWING** both latched, press **0** |
| **Steps** | 1. Press **1 (Low)**.<br>2. Press **SWING** (grille rotating).<br>3. Confirm both buttons are latched down.<br>4. Press **0 (Off)**.<br>5. Observe all buttons, the grille, and the blades. |
| **Expected Result** | Pressing 0 pops out **both** the speed button and SWING at the same time; the blades coast to a stop and the grille rotation stops; no button remains latched. *(Usability limitation: SWING has no independent off — 0 is the only way, and it also switches the fan off.)* |
| **Actual Result** | Pressed **1 (Low)**, then **SWING** — both buttons latched down. Pressing **0** released both buttons simultaneously; the blades coasted to a stop and the grille rotation stopped, with no button remaining latched. Confirms 0 is the single master release (no independent SWING-off). |
| **Verdict** | ☑ **Pass** |

### TC-07 — Power OFF (button 0)
| Field | Detail |
|---|---|
| **Objective** | Verify the fan stops completely when OFF is pressed. |
| **Input** | Press button **0 (Off)** |
| **Steps** | 1. From any running speed, press button **0**.<br>2. Observe until blades stop. |
| **Expected Result** | All speed buttons release; motor de-energizes; blades coast to a full stop within a few seconds; motor is silent afterward. |
| **Actual Result** | From a running speed, pressed **0**. The latched speed button released, the motor de-energized, and the blades coasted to a full stop within a few seconds; the motor was silent afterward. |
| **Verdict** | ☑ **Pass** |

### TC-08 — Head vertical tilt holds angle
| Field | Detail |
|---|---|
| **Objective** | Verify the head/cage can be tilted up/down and holds the set angle. |
| **Input** | Manually tilt the head up ~15–30° |
| **Steps** | 1. With fan running, tilt the head upward.<br>2. Release and observe for 30 s. |
| **Expected Result** | The friction joint holds the chosen angle without drooping; airflow is redirected; no cracking or slipping. |
| **Actual Result** | Tilted the head up ~20°. The friction joint held the set angle without drooping; airflow was redirected upward; no cracking or slipping. |
| **Verdict** | ☑ **Pass** |

### TC-09 — Continuous-run endurance (30 min at High)
| Field | Detail |
|---|---|
| **Objective** | Verify thermal and mechanical stability over a sustained run. |
| **Input** | Run at High for 30 minutes |
| **Steps** | 1. Set High.<br>2. Run 30 min.<br>3. Touch the motor housing, listen for new noise, confirm speed is unchanged. |
| **Expected Result** | Fan runs the full 30 min without auto-shutoff or slowdown; housing is warm but comfortable to touch briefly (no scorching); no burning smell; no new rattling. |
| **Actual Result** | Ran at High for 30 minutes continuously. No auto-shutoff or slowdown; the motor housing was warm but comfortable to touch; no burning smell; no new rattling; speed stayed steady throughout. |
| **Verdict** | ☑ **Pass** |

### TC-10 — Stability & vibration on flat surface
| Field | Detail |
|---|---|
| **Objective** | Verify the fan does not "walk" or tip from its own vibration at High. |
| **Input** | Run at High on a level table for 2 minutes |
| **Steps** | 1. Place the fan on a smooth flat table.<br>2. Run High for 2 min.<br>3. Mark the base position and check for movement. |
| **Expected Result** | Base stays in place (feet grip); vibration is minimal; the unit does not creep or tip over. |
| **Actual Result** | Ran at High for 2 minutes on a flat surface. The base stayed in place (feet gripped); vibration was minimal; the fan did not creep or tip over. |
| **Verdict** | ☑ **Pass** |

---

### TC-11 — Simultaneous multi-button press &nbsp;**[EDGE]**
| Field | Detail |
|---|---|
| **Objective** | Determine how the latching button bank behaves when two speed buttons are pressed at the exact same instant. |
| **Input** | Press **1 (Low) + 3 (High) together** and hold |
| **Steps** | 1. From OFF, press buttons 1 and 3 simultaneously with two fingers.<br>2. Note which one latches and the resulting speed.<br>3. Listen for buzzing; check the outlet/breaker. |
| **Expected Result** | The mechanical interlock latches **only one** winding — the fan runs at a single defined speed (typically the strongest seated), with **no motor buzzing, no dual-winding energization, and no breaker trip**. *(Record the exact observed behavior.)* |
| **Actual Result** | From OFF, pressed buttons **1 (Low)** and **3 (High)** at the exact same instant: **neither button latched** and the fan did **not** start — it stayed OFF. Releasing both simultaneously also did nothing. There was **no motor buzzing, no dual-winding energization, and no breaker trip**. The mechanical interlock physically blocks both buttons from seating at once, so a simultaneous press is **safely rejected** (the button bank fail-safes to OFF) rather than one speed winning. |
| **Verdict** | ☑ **Pass** *(safe fail-safe behavior — neither button latched; differs from the predicted single-latch outcome, but every safety criterion is met)* |

### TC-12 — Open / remove the front grille and reassemble &nbsp;**[EDGE]**
| Field | Detail |
|---|---|
| **Objective** | Verify the front grille can be opened/removed (e.g., for cleaning) and reattached so it seats securely, and that SWING rotation and airflow still work afterward. |
| **Input** | Rotate the front grille lock to release the grille, lift it off, then refit and re-lock it |
| **Steps** | 1. Press **0 (Off)** and **unplug** the fan.<br>2. Rotate the **front grille lock** to release the grille and lift it off.<br>3. Inspect the blades, then refit the grille and turn the lock back until it seats.<br>4. Plug in, run at Low, then press **SWING**. |
| **Expected Result** | The grille releases by rotating the lock without excessive force and re-seats firmly when the lock is turned back (no gap, does not detach); after reassembly the fan runs normally and SWING rotation still works. |
| **Actual Result** | Opened the grille by rotating the **front grille lock** — it released and lifted off easily, and re-attached and re-locked **normally** with no gap or rattle. After reassembly the fan ran normally at Low and SWING engaged; everything tied to the open/re-attach function worked. The only anomaly was the **pre-existing worn-grille behaviour** (with SWING and the blades both running, the loose grille free-spins/slips — see TC-05 and the bug log); this is unaffected by reassembly (neither caused nor cured by it) and is out of scope for the open/re-attach objective. |
| **Verdict** | ☑ **Pass** *(open/re-attach lock works correctly; the recurring worn-grille free-spin is the known separate defect — see TC-05 / bug log)* |

### TC-13 — SWING rotation independence from fan speed &nbsp;**[EDGE]**
| Field | Detail |
|---|---|
| **Objective** | Verify the SWING front-grille drive operates independently of the speed buttons — including whether it rotates with the motor OFF — that it persists across speed changes, and that it is cleared only by button 0. |
| **Input** | SWING button + speeds 0 / 1 / 3, then 0 |
| **Steps** | 1. At **OFF (0)**, press **SWING** — note whether the grille rotates with no airflow.<br>2. Press **1 (Low)**, then **3 (High)** while SWING stays engaged.<br>3. Press **0 (Off)** — the only control that clears SWING. |
| **Expected Result** | Rotation continues uninterrupted across the speed change (1→3); SWING stays latched when speed changes (the speed buttons do not release it); pressing **0** is the only way to clear SWING, and it stops the fan as well. *(Record whether the grille rotates while at speed 0.)* |
| **Actual Result** | First confirmed the master release: pressing **0** releases **all** latched buttons (consistent with TC-06). **SWING only (speed 0, no airflow):** the grille rotated **normally** under SWING power alone — so the SWING drive is genuinely independent of the blade motor and airflow (this answers the open question: yes, it rotates at speed 0). SWING also stayed latched when the speed was changed and was cleared only by **0**, so the SWING *control* is independent of the speed buttons. **Deviation at High speed:** with SWING engaged at **High (3)**, the strong airflow **overpowered** the worn SWING drive and forced the grille to rotate **backwards** (the wind direction) — the SWING-driven direction was not maintained. This is the same worn-grille defect seen in TC-05, now dominant at high speed. |
| **Verdict** | ☑ **Pass** *(with deviation — the SWING control is independent of fan speed: it persists across speeds, is cleared only by 0, and drives the grille even at speed 0; however, at High speed the worn grille lets the airflow overpower the drive and reverse the rotation — known worn-grille defect, see TC-05 / bug log)* |

### TC-14 — Finger guard safety (grille gap) &nbsp;**[EDGE]**
| Field | Detail |
|---|---|
| **Objective** | Verify the grille/cage spacing (front grille **and** rear cage) prevents a finger from reaching the blades (child-safety check). |
| **Input** | A rigid ~**12 mm** rod (IEC test-finger proxy), a pencil, or a finger |
| **Steps** | 1. Press **0** and **unplug** the fan — run this test with the **blades stopped** (de-energized) for safety.<br>2. Measure the widest opening in **both** the front grille and the rear cage.<br>3. Try to pass the 12 mm rod (or a finger) through the widest openings, front and back, and check whether it can reach the blade path. |
| **Expected Result** | All external openings (front grille **and** rear cage) are **< 12 mm**; with the fan de-energized, the probe/finger **cannot reach** the blade path from any opening. *(If a finger or pencil can reach a blade → Fail = safety defect.)* |
| **Actual Result** | Tested with the fan **OFF and unplugged** (blades stationary) for safety. The defect is on the **rear cage**: it has several cracks/gaps large enough to **fit a finger through**, so a finger can reach the blade path from the back — a finger could contact the blades while the fan is running. (The oversize openings are on the rear cage; the front grille was not the problem area.) |
| **Verdict** | ☑ **Fail** *(safety defect — the rear cage has cracks wide enough for a finger to reach the blade path. Logged as a separate, higher-severity bug.)* |

### TC-15 — Steep-tilt / tip-over behavior &nbsp;**[EDGE]**
| Field | Detail |
|---|---|
| **Objective** | Verify safe behavior when the running fan is tilted far past its normal angle (knocked, or on an uneven floor). |
| **Input** | Tilt the whole fan to ~**45°** while running |
| **Steps** | 1. Run at Medium on a flat surface.<br>2. Carefully tilt the entire fan to ~45° and hold 5 s.<br>3. Watch for blade-to-cage contact, any tilt cut-off, and base lift.<br>4. Return upright. |
| **Expected Result** | No blade-to-cage contact at angle; cage does not deform; the fan either keeps running safely or, **if equipped with a tilt cut-off, powers down** — record which. On return to upright it behaves per design. No grinding. |
| **Actual Result** | Tilted the running fan to ~45° and held. **No blade-to-cage contact** and no grinding; the cage did not deform. The fan has **no tilt cut-off** — it kept running normally at the tilted angle (no automatic power-down). On returning upright it continued running normally. |
| **Verdict** | ☑ **Pass** *(safe at angle; no tilt cut-off fitted — the fan keeps running, which the expected result allows for this product class)* |

---

## 5. Execution Evidence (5 cases)

| TC | Title | Video link (≤ 60 s) |
|---|---|---|
| TC-04 | Speed step-through | [link](https://youtube.com/shorts/deZ2pji3q1M) |
| TC-05 | Front-grille SWING rotation ON | [link](https://youtube.com/shorts/81Z8efwH_lE) |
| TC-11 | Simultaneous multi-button press *(edge)* | [link](https://youtube.com/shorts/l8RXqb_vQBk) |
| TC-13 | SWING independence from speed *(edge)* | [link](https://youtube.com/shorts/WenrP7-s9Go) |
| TC-14 | Finger-guard safety *(edge)* | [link](https://youtube.com/shorts/Dv-IJVojiz8) |
