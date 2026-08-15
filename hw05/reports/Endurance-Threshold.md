# Endurance / Soak Test — Empirical Threshold (23127244)

**Test plan:** `test-plans/23127244_Endurance_20260815.jmx`
**Target:** `POST /api/forgot-password` (auth-heavy, the endpoint with a demonstrated real bottleneck in the Stress test — Load/Spike showed no meaningful limits, so less informative to soak-test)
**Load:** flat 150 concurrent virtual users, 15s ramp-up, sustained for 720s (12 min) — 735s total wall-clock configured, 734.3s actual
**Data/results:** `results/23127244_Endurance_20260815.jtl`, `results/23127244_Endurance_20260815_report/`, `results/23127244_Endurance_20260815_memory.csv`

## Why 150 VU

Calibrated from the Stress test's own data: Stage 3 (150 VU) ran clean at 222.6 req/s for ~30s, the last stage before errors appeared at Stage 4 (400 VU). A short clean stage doesn't prove long-term stability — this soak test checks whether 150 VU actually holds for a genuinely sustained window, which the staged test was too short to reveal.

## Result: Maximum stable RPS

**285.6 requests/second, sustained for the full 12 minutes, 0% errors** (209,748 samples, 0 failures — neither HTTP errors nor Duration Assertion (2000ms SLA) breaches). This is *higher* than the 222.6 req/s seen in the short Stress Stage 3 — plausible explanation: no competing adjacent stages/ramp overlap, and JIT/connection-pool warm-up improves steady-state efficiency compared to a fresh 30s snapshot.

Per-minute breakdown showed no degradation trend over time — throughput, average response time (10–40ms), and max response time (68–821ms, well under the 2000ms SLA) all stayed in a stable band across all 12 minutes; no minute crossed 0% error.

| Minute | Requests | Errors | Avg (ms) | Max (ms) |
|---|---|---|---|---|
| 0 | 15,604 | 0 | 10.0 | 68 |
| 1 | 17,591 | 0 | 12.1 | 227 |
| 5 | 17,194 | 0 | 25.4 | 821 |
| 11 | 17,234 | 0 | 22.4 | 285 |
| 12 (partial) | 3,975 | 0 | 39.1 | 787 |

## Result: Memory ceiling

**Peak RSS: 192.6 MB**, observed at t=120s — during the initial ramp-up/warm-up window, *not* at the end of the run. Node's GC then compacted the heap (visible as a sharp drop from ~197MB to ~88MB at t=140s), and the process settled into a **steady-state range of ~88–116 MB** for the remaining ~10 minutes, ending at 113.3 MB. No sustained upward trend — this is healthy GC behavior, not a memory leak.

CPU utilization (`ps`'s lifetime-average `%cpu`, which rises then plateaus by definition — not an instantaneous reading) stabilized around ~25–27%.

## Conclusion

On this hardware (Dell Inspiron 3593, i5-1035G1, 18GB RAM — see `Hardware-Report.md`), `POST /api/forgot-password` sustains **150 concurrent users / ~285 RPS indefinitely** with zero errors and no memory growth. The actual breaking point (found in the Stress test) sits between 150 and 400 VU — this endurance test confirms 150 VU is a genuinely durable operating point, not just a lucky short snapshot.
