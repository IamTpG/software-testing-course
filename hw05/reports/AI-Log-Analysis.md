# Performance Log Analysis & CI Threshold Proposal (23127244)

Computed directly from the raw `.jtl` CSVs in `results/` using `reports/analyze_logs.py`
(reproducible: `python3 hw05/reports/analyze_logs.py` from repo root). `statistics.json`
dashboards were used only as a cross-check, not as the source of the numbers below — see
[§6 Cross-check against statistics.json](#6-cross-check-against-statisticsjson-and-a-real-discrepancy-found)
for a real discrepancy this caught.

**Percentile method:** nearest-rank order statistic, `rank = ceil(p/100 * N)`, taken from the
full sorted `elapsed` column per scenario (or per stage/bucket where noted) — the exact value
that occurred in the data, not an interpolated or approximated estimate.

---

## 1. Load — `GET /api/products/:id`, 30 VU sustained ~300s

`results/23127244_Load_20260815.jtl`

| Metric | Value |
|---|---|
| Total samples | 4,265 |
| Errors | 0 |
| Error rate | 0.00% |
| Throughput | 14.31 req/s |
| Duration | 298.0s |
| min / avg | 0 / 1.22 ms |
| p50 / p90 / p95 / p99 / max | 1 / 2 / 2 / 3 / 32 ms |

**Failures:** none. No HTTP errors, no assertion failures.

This endpoint is trivially fast — a single indexed SQLite lookup on a 5-row seeded product
table. Sub-millisecond medians, max 32ms, zero errors at 30 concurrent users confirm no
meaningful bottleneck at this scale (consistent with `TASKS-CHECKLIST.md`'s note that Load's
own design process found no real limit for this endpoint in range).

---

## 2. Stress — `POST /api/forgot-password`, staged 30→80→150→400 VU

`results/23127244_Stress_20260815.jtl`

| Metric | Value |
|---|---|
| Total samples | 24,681 |
| Errors | 79 |
| Error rate | 0.3201% |
| Throughput (blended, all stages) | 190.54 req/s |
| Duration | 129.5s |
| min / avg | 3 / 240.33 ms |
| p50 / p90 / p95 / p99 / max | 27 / 621 / 658 / 739 / 7,682 ms |

The blended overall p50=27ms is misleading on its own (see §5) — it's dragged down by the
three fast, clean early stages; §5's per-stage breakdown is the number that actually matters
for this scenario.

**Failure classification (all 79):** 100% assertion failures, 0% HTTP-level errors.

- `responseCode` = 200 on every single failed sample (verified: `Counter` over `responseCode`
  among failed rows = `{'200': 79}`) — the SUT never returned an error status; every failure is
  the JMeter **Duration Assertion** tripping (`"The operation lasted too long: It took X
  milliseconds, but should not have lasted longer than 2,000 milliseconds"`), i.e. the test
  plan's own 2000ms SLA, not a functional bug.
- Overage range: 2,009ms (barely over) to 7,682ms (worst case, the single max in the dataset).
- All 79 failures land in **Stage 4 (400 VU)** — 0 failures in Stages 1-3 (verified by grouping
  `threadName` by stage and confirming the other 3 stages have `err=0`).

---

## 3. Spike — `POST /api/apply-coupon`, baseline 15 → spike 500 → recovery 15 VU

`results/23127244_Spike_20260815.jtl`

| Metric | Value |
|---|---|
| Total samples | 32,699 |
| Errors | 136 |
| Error rate | 0.4159% |
| Throughput (blended, all stages) | 603.85 req/s |
| Duration | 54.2s |
| min / avg | 0 / 118.11 ms |
| p50 / p90 / p95 / p99 / max | 97 / 161 / 200 / 401 / 4,237 ms |

**Failure classification (all 136):** 100% assertion failures, 0% HTTP-level errors.

- `responseCode` = 200 on every failed sample — again purely the JMeter **Duration Assertion**
  (`"...should not have lasted longer than 1,500 milliseconds"`), this scenario's SLA.
- Overage range: 1,503ms to 4,237ms (the single max in the dataset).
- All 136 failures land in **Stage 2 (Spike, 500 VU)** — 0 in Baseline or Recovery.

---

## 4. Endurance — `POST /api/forgot-password`, flat 150 VU sustained 12min

`results/23127244_Endurance_20260815.jtl`

| Metric | Value |
|---|---|
| Total samples | 209,748 |
| Errors | 0 |
| Error rate | 0.00% |
| Throughput | 285.63 req/s |
| Duration | 734.3s |
| min / avg | 0 / 20.59 ms |
| p50 / p90 / p95 / p99 / max | 8 / 51 / 107 / 186 / 821 ms |

**Failures:** none across all 209,748 samples.

---

## 5. Stress — breakdown by stage

Grouped by `threadName` stripped of its per-thread suffix (e.g. `"Stress Stage 4 (400 VU)
4-321"` → `"Stress Stage 4 (400 VU)"`), stats recomputed per group from `elapsed`:

| Stage | n | Errors | Err % | avg (ms) | p50 | p90 | p95 | p99 | max | Stage throughput |
|---|---|---|---|---|---|---|---|---|---|---|
| Stage 1 (30 VU) | 1,619 | 0 | 0.000% | 5.5 | 5 | 8 | 9 | 11 | 56 | 55.17 req/s |
| Stage 2 (80 VU) | 3,920 | 0 | 0.000% | 7.8 | 6 | 13 | 15 | 28 | 131 | 132.74 req/s |
| Stage 3 (150 VU) | 6,533 | 0 | 0.000% | 16.9 | 12 | 38 | 49 | 72 | 104 | 222.60 req/s |
| Stage 4 (400 VU) | 12,609 | 79 | **0.627%** | **458.6** | **533** | **658** | **691** | **802** | **7,682** | 317.33 req/s |

**Trend:** latency scales roughly linearly with concurrency through Stages 1-3 (p95: 9 → 15 →
49ms as VU triples each time — consistent with `TASKS-CHECKLIST.md`'s note that this endpoint
does a real DB write and SQLite serializes writers). Stage 3→4 is a step-change, not a
continuation of the linear trend: p50 jumps **12ms → 533ms (~44x)** and p95 jumps **49ms →
691ms (~14x)** for a ~2.7x increase in VU (150→400), and this is exactly where the 2000ms SLA
starts getting breached (0 errors through 150 VU, 0.627% at 400 VU). This is the endpoint's
breaking point: somewhere between 150 and 400 VU, SQLite's single-writer queue depth exceeds
what the connection/request pipeline can absorb within the SLA window, and the whole system
tips from "linear degradation" into "queueing collapse."

---

## 6. Endurance — 1-minute buckets over the 12-min run

Bucketed by `(timeStamp - t0) // 60000`, stats recomputed per bucket from `elapsed`:

| Minute | n | Errors | Err % | avg (ms) | p50 | p90 | p95 | p99 | max |
|---|---|---|---|---|---|---|---|---|---|
| 0 | 15,604 | 0 | 0.00% | 10.0 | 7 | 20 | 26 | 40 | 68 |
| 1 | 17,591 | 0 | 0.00% | 12.1 | 6 | 19 | 31 | 138 | 227 |
| 2 | 17,224 | 0 | 0.00% | 21.6 | 8 | 70 | 104 | 161 | 253 |
| 3 | 17,136 | 0 | 0.00% | 26.8 | 8 | 81 | 135 | 265 | 742 |
| 4 | 17,307 | 0 | 0.00% | 21.4 | 7 | 71 | 119 | 175 | 280 |
| 5 | 17,194 | 0 | 0.00% | 25.4 | 8 | 62 | 121 | 238 | 821 |
| 6 | 17,337 | 0 | 0.00% | 21.3 | 8 | 51 | 117 | 211 | 306 |
| 7 | 17,246 | 0 | 0.00% | 20.1 | 8 | 54 | 104 | 190 | 287 |
| 8 | 17,320 | 0 | 0.00% | 19.9 | 8 | 53 | 101 | 178 | 275 |
| 9 | 17,320 | 0 | 0.00% | 18.7 | 8 | 46 | 96 | 165 | 284 |
| 10 | 17,260 | 0 | 0.00% | 22.6 | 7 | 74 | 127 | 201 | 289 |
| 11 | 17,234 | 0 | 0.00% | 22.4 | 7 | 80 | 120 | 178 | 285 |
| 12* | 3,975 | 0 | 0.00% | 39.1 | 8 | 60 | 173 | 664 | 787 |

\* minute 12 is a partial bucket (~15s only — test ends at 734.3s, not 780s).

**Error rate:** flat at 0.00% for all 209,748 samples — no degradation signal here.

**Response time:** minutes 0-1 are a distinct, lower band (avg 10-12ms, p95 26-31ms) — a warm-up
effect (JIT/connection-pool warm-up, matches the memory sampler's own warm-up window below).
Minutes 2-11 settle into a **stable oscillating band** (avg 18.7-26.8ms, p95 96-135ms) with no
monotonic upward trend — minute 3's p95=135/max=742 and minute 5's max=821 are the two highest
points in the run, but minutes 6-9 immediately drop back down (p95 96-117ms), which rules out
sustained creep; it reads as noise/GC pauses, not a trend. The partial minute 12 (avg 39.1,
p99 664, max 787) is elevated but is only 15s of data at test teardown (thread pool draining) —
too small a sample and too close to test-end to trust as a real signal either way.

**Verdict: no error-rate or response-time degradation over the 12-minute window.** Steady state
is reached within ~2 minutes and holds.

**Supporting data — memory** (`results/23127244_Endurance_20260815_memory.csv`, `ps` sampled
every 10s): RSS climbs from 72MB → a peak of **197MB at t=120s** (warm-up), then a GC event
compacts it to **88MB at t=140s**, after which it drifts from ~92MB (t=160s) to ~116MB (t=722s,
end of run) — roughly **+24MB over the last ~9.5 minutes (~2.5MB/min)** post-GC-baseline. This
is a mild upward drift, not the sharp monotonic climb of a real leak, but 12 minutes is too
short to distinguish "slow leak" from "heap settling to a new steady size" with confidence —
flagged as a **watch item**, see §7's Endurance gate.

---

## 7. Proposed CI pass/fail thresholds

General approach: set p95/p99 gates at **1.5-2x the observed clean/steady-state value** (enough
margin to absorb CI-runner noise and small legitimate variance without masking a real
regression), keep error-rate gates near the observed rate plus a small buffer, and — critically
for Stress — **gate at a concurrency where the endpoint is known-healthy**, not at the
concurrency where it's already documented to fail its own SLA.

### `GET /api/products/:id` (Load profile — e.g. 30 VU / few minutes)

| Gate | Threshold | Reasoning |
|---|---|---|
| Error rate | ≤ 0.5% | Observed 0%; small buffer for CI-runner network blips, no real errors seen so the bar stays tight |
| p95 | ≤ 15ms | Observed 2ms (~7x margin) — endpoint is trivially fast, so a real regression (e.g. missing index, N+1 query on a join) would still trip this by a wide margin without false-failing on scheduler jitter |
| p99 | ≤ 30ms | Observed 3ms (10x margin) — wider tail margin since p99 is more outlier-sensitive on small CI VM samples |
| max | ≤ 200ms | Observed 32ms — catches a single pathological outlier (cold cache, GC pause) without hunting for perfection |
| Throughput | ≥ 12 req/s @ 30 VU | Observed 14.31; this test is think-time-bound, so throughput here mainly proves no VU is stuck/blocked, not raw capacity |

### `POST /api/forgot-password` (Stress profile — **run the CI check at ≤150 VU**, not 400 VU)

400 VU is a documented breaking point (§5), not a target SLA — asserting against it in CI would
fail on day one and every day after. The regression gate should run at the endpoint's known-safe
operating point and watch for any regression *below* that ceiling.

| Gate | Threshold | Reasoning |
|---|---|---|
| Error rate (≤150 VU) | ≤ 1% | Observed 0% through Stage 3 (150 VU); 1% buffer catches a regression that starts producing SLA breaches well before the known 400 VU ceiling |
| p95 (≤150 VU) | ≤ 100ms | Observed 49ms at Stage 3 (~2x margin) |
| p99 (≤150 VU) | ≤ 150ms | Observed 72ms at Stage 3 (~2x margin) |
| Existing 2000ms Duration Assertion violation rate, full staircase incl. 400 VU | ≤ 1% | Observed 0.627% at 400 VU — close enough to 1% that this gate would catch a real regression (e.g. the write path getting slower) pushing it over, while not failing on the currently-accepted breaking-point behavior |
| Documented ceiling (informational, not pass/fail) | ~400 VU / ~317 req/s is where SLA breaches begin | Re-verify this number stays in the same ballpark release over release; a large downward shift (e.g. breaking at 200 VU instead of 400) is itself a regression worth flagging even though no single-run gate catches it |

### `POST /api/apply-coupon` (Spike profile)

| Gate | Threshold | Reasoning |
|---|---|---|
| Baseline/Recovery error rate | 0% | Observed 0% both stages |
| Baseline/Recovery p95 | ≤ 15ms | Observed 4ms / 3ms (~4-5x margin) |
| Baseline/Recovery p99 | ≤ 25ms | Observed 6ms / 4ms |
| Spike-stage (500 VU) error rate | ≤ 1% | Observed 0.423% |
| Spike-stage p95 | ≤ 350ms | Observed 201ms (~1.7x margin) |
| Spike-stage p99 | ≤ 700ms | Observed 463ms (~1.5x margin) |
| **Recovery gate** | Recovery-stage p95 ≤ 2x Baseline-stage p95 | Resilience-specific check distinct from raw latency: this run recovered essentially instantly (recovery p95=3ms, *below* baseline's 4ms) — a future regression that leaves the system still elevated after the spike ends (e.g. leaked DB connections, exhausted pool) would show up here even if the spike-stage numbers themselves still passed |

### Endurance / soak (`POST /api/forgot-password`, 150 VU sustained)

| Gate | Threshold | Reasoning |
|---|---|---|
| Error rate, full run | ≤ 1% | Observed 0% across 209,748 samples |
| p95 per 1-min bucket | ≤ 300ms | Observed steady-state band 96-135ms (minutes 2-11); 300ms comfortably covers the noisiest observed point (minute 3's 135ms, minute 12's 173ms) with room for a real but non-catastrophic regression to still trip it |
| Trend check | No bucket's p95 > 1.5x the median p95 of the first 3 stable buckets (minutes 2-4) | Detects a *trend* rather than a fixed ceiling — this run's own worst bucket (minute 3, p95=135) is only ~1.2x its own baseline, so it passes; this is the gate meant to catch the "flat isn't actually flat, it's climbing slowly" case that a single fixed ceiling would miss |
| Throughput | Must not decay > 10% from the run's sustained average | Observed flat at ~285-293 req/s per full minute throughout; 10% covers real noise while catching an actual slowdown |
| Memory (soft/warn, not hard-fail) | Post-warm-up RSS growth ≤ 5MB/min sustained | Observed ~2.5MB/min after the t=140s GC event — under threshold, but 12 minutes is too short to rule out a slow leak with confidence (§6); recommend a 30-60min soak before trusting this gate's threshold long-term, and treat a breach here as "investigate," not an automatic hard-fail, until that longer run exists |

---

## 8. Cross-check against `statistics.json`, and a real discrepancy found

`sampleCount`, `errorCount`, `errorPct`, and `meanResTime` in every scenario's `statistics.json`
match the raw-CSV numbers above exactly (e.g. Stress: 24,681 / 79 / 0.32008427% /
240.33187472144647ms — matches to floating-point precision), confirming both are reading the
same underlying data.

**But the percentile columns disagree, and by a lot in one case.** Comparing
`statistics.json`'s `medianResTime`/`pct1`/`pct2`/`pct3` (JMeter's 90/95/99) against the true
order statistics computed above:

| Scenario | Metric | Raw-CSV (this analysis) | statistics.json | Diff |
|---|---|---|---|---|
| Stress | median (p50) | **27ms** | 175ms | **6.5x** |
| Stress | p90/95/99 | 621/658/739 | 634/668/757 | ~2-4% |
| Spike | p50 | 97ms | 98ms | ~1% (close) |
| Spike | p90/95/99 | 161/200/401 | 133/150/261 | JSON is **35-55% lower** |
| Endurance | p50 | 8ms | 7ms | close |
| Endurance | p90/95/99 | 51/107/186 | 74/122/218 | JSON is 20-45% **higher** |
| Load | all | 1/2/2/3 | 1/2/2/3 | matches |

I double-checked the raw-CSV median for Stress two independent ways before trusting it: (1) via
the `Latency` column instead of `elapsed` (median also 27), and (2) by directly counting —
12,354 of 24,681 samples (>50%) are ≤27ms, which *is* the definition of the median for this
dataset. So 27ms is correct for the raw data; `statistics.json`'s 175ms is not simply a
different-but-valid definition of "median."

The pattern across scenarios — errors get *larger* for Stress and Spike (both strongly
**bimodal**: a fast cluster from the low-VU stages/baseline sitting next to a slow cluster from
the high-VU/spike stage) and stay small for Load and Endurance (both closer to unimodal) — is
consistent with JMeter's HTML dashboard using an approximate/streaming percentile estimator for
the Statistics table (rather than the true order statistic used here), which is exactly the kind
of algorithm that loses accuracy on bimodal distributions. I can't confirm the specific algorithm
from the output alone, but the direction of the pattern (worst error where the distribution is
most bimodal) is a solid enough signal to say: **don't trust `statistics.json`'s percentile
columns for these scenarios — use the raw-CSV order statistics in §1-6 above**, which is also
why every threshold in §7 is anchored to the raw-CSV numbers, not the dashboard's.
