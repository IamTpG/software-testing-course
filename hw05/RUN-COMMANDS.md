# HW05 — Phase 2 Run Commands (23127244)

Copy-paste reference for executing the 3 scenarios. See `TASKS-CHECKLIST.md` Phase 2 for the full context.

## Terminal A — backend (leave running the whole session)

```bash
cd /home/tpg/Projects/software-testing-course/hw05/eshop-sut/backend
node server.js
```

## Terminal B — resource monitor (leave running, keep visible)

```bash
top -p $(pgrep -f "node server.js" | head -1)
```

## Terminal C — JMeter runs

```bash
cd /home/tpg/Projects/software-testing-course/hw05/test-plans
source ../tools/env.sh
```

### 1. Dry run first (no recording — just confirm everything works)

```bash
jmeter -n -t 23127244_Load_20260815.jmx   -l ../results/23127244_Load_20260815.jtl   -e -o ../results/23127244_Load_20260815_report
jmeter -n -t 23127244_Stress_20260815.jmx -l ../results/23127244_Stress_20260815.jtl -e -o ../results/23127244_Stress_20260815_report
jmeter -n -t 23127244_Spike_20260815.jmx  -l ../results/23127244_Spike_20260815.jtl  -e -o ../results/23127244_Spike_20260815_report
```

Expected real durations: Load ≈5.5 min, Stress ≈3 min, Spike ≈1 min.

### 2. Cleanup before the REAL recorded run (required — JMeter appends to an existing .jtl, doesn't overwrite it)

```bash
rm -f  ../results/23127244_Load_20260815.jtl    && rm -rf ../results/23127244_Load_20260815_report
rm -f  ../results/23127244_Stress_20260815.jtl  && rm -rf ../results/23127244_Stress_20260815_report
rm -f  ../results/23127244_Spike_20260815.jtl   && rm -rf ../results/23127244_Spike_20260815_report
```

### 3. Start screen recording + Vietnamese narration, THEN run for real

```bash
jmeter -n -t 23127244_Load_20260815.jmx   -l ../results/23127244_Load_20260815.jtl   -e -o ../results/23127244_Load_20260815_report
jmeter -n -t 23127244_Stress_20260815.jmx -l ../results/23127244_Stress_20260815.jtl -e -o ../results/23127244_Stress_20260815_report
jmeter -n -t 23127244_Spike_20260815.jmx  -l ../results/23127244_Spike_20260815.jtl  -e -o ../results/23127244_Spike_20260815_report
```

Take a screenshot of Terminal B + Terminal C together during (or right after) each run.

## If you need to rerun any single scenario later

```bash
rm -f  ../results/23127244_{Load|Stress|Spike}_20260815.jtl
rm -rf ../results/23127244_{Load|Stress|Spike}_20260815_report
```
(substitute the actual scenario name — brace expansion above is illustrative, not literal)

## Hardware screenshot (one-time, if not already done)

```bash
! sudo apt install -y neofetch   # optional, only if you want a nicer visual than plain terminal info
neofetch
```
Screenshot the terminal (must show hostname `tpg-inspiron`), save to `reports/screenshots/`, reference it from `reports/Hardware-Report.md`.

## Stopping the backend when you're done

```bash
# Ctrl+C in Terminal A, or from another terminal:
pkill -f "node server.js"
```
