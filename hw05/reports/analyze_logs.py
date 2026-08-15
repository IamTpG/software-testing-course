#!/usr/bin/env python3
"""
HW05 Phase 5 - raw .jtl log analysis.
Computes everything directly from the raw JMeter CSV (.jtl) files, not from
the pre-generated statistics.json dashboards (used only as a cross-check).

Usage: python3 analyze_logs.py   (run from repo root, reads hw05/results/*.jtl)
"""
import csv, math, re
from collections import defaultdict, Counter

BASE = 'hw05/results/'
SCENARIOS = [
    ('LOAD', BASE + '23127244_Load_20260815.jtl'),
    ('STRESS', BASE + '23127244_Stress_20260815.jtl'),
    ('SPIKE', BASE + '23127244_Spike_20260815.jtl'),
    ('ENDURANCE', BASE + '23127244_Endurance_20260815.jtl'),
]


def percentile(sorted_vals, pct):
    """Nearest-rank percentile (rank = ceil(pct/100 * N)), i.e. the true
    order statistic of the sample -- not an approximated/streamed estimate."""
    n = len(sorted_vals)
    if n == 0:
        return None
    rank = max(1, min(n, math.ceil((pct / 100.0) * n)))
    return sorted_vals[rank - 1]


def load(path):
    with open(path, newline='', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def basic_stats(rows):
    elapsed = sorted(int(r['elapsed']) for r in rows)
    n = len(elapsed)
    errors = [r for r in rows if r['success'] != 'true']
    ts = [int(r['timeStamp']) for r in rows]
    dur_s = (max(ts) - min(ts)) / 1000.0 if n else 0
    return {
        'n': n, 'errors': len(errors),
        'err_rate': len(errors) / n * 100 if n else 0,
        'min': elapsed[0] if n else None,
        'avg': sum(elapsed) / n if n else 0,
        'p50': percentile(elapsed, 50), 'p90': percentile(elapsed, 90),
        'p95': percentile(elapsed, 95), 'p99': percentile(elapsed, 99),
        'max': elapsed[-1] if n else None,
        'duration_s': dur_s,
        'throughput': n / dur_s if dur_s > 0 else 0,
    }


def classify_failures(rows):
    """Group failureMessage by normalized pattern (strip the specific
    numbers) so e.g. 5000 near-identical Duration Assertion messages collapse
    into one bucket instead of one line each."""
    fails = [r for r in rows if r['success'] != 'true']
    cats = Counter()
    for r in fails:
        fm = (r['failureMessage'] or '').strip()
        if fm:
            norm = re.sub(r'[\d,]+(\.\d+)?', '#', fm.split('\n')[0])
        else:
            norm = f"HTTP {r['responseCode']} {r['responseMessage']} (no assertion message)"
        cats[norm] += 1
    return cats


def stage_key(thread_name):
    # "Stress Stage 4 (400 VU) 4-321" -> "Stress Stage 4 (400 VU)"
    return thread_name.rsplit(' ', 1)[0]


if __name__ == '__main__':
    all_rows = {}
    for name, path in SCENARIOS:
        rows = load(path)
        all_rows[name] = rows
        s = basic_stats(rows)
        print(f"\n=== {name} ({path}) ===")
        print(f"n={s['n']} errors={s['errors']} err_rate={s['err_rate']:.4f}% "
              f"duration={s['duration_s']:.1f}s throughput={s['throughput']:.2f} req/s")
        print(f"min={s['min']} avg={s['avg']:.2f} p50={s['p50']} p90={s['p90']} "
              f"p95={s['p95']} p99={s['p99']} max={s['max']} (ms)")
        for cat, cnt in classify_failures(rows).most_common():
            print(f"  [{cnt}x] {cat}")

    print("\n=== STRESS by stage ===")
    stages = defaultdict(list)
    for r in all_rows['STRESS']:
        stages[stage_key(r['threadName'])].append(r)
    for stage in sorted(stages):
        s = basic_stats(stages[stage])
        print(f"{stage}: n={s['n']} err={s['errors']} ({s['err_rate']:.3f}%) "
              f"avg={s['avg']:.1f} p50={s['p50']} p90={s['p90']} p95={s['p95']} "
              f"p99={s['p99']} max={s['max']} thr={s['throughput']:.2f}req/s")

    print("\n=== SPIKE by stage ===")
    stages = defaultdict(list)
    for r in all_rows['SPIKE']:
        stages[stage_key(r['threadName'])].append(r)
    for stage in sorted(stages):
        s = basic_stats(stages[stage])
        print(f"{stage}: n={s['n']} err={s['errors']} ({s['err_rate']:.3f}%) "
              f"avg={s['avg']:.1f} p50={s['p50']} p90={s['p90']} p95={s['p95']} "
              f"p99={s['p99']} max={s['max']} thr={s['throughput']:.2f}req/s")

    print("\n=== ENDURANCE by 1-minute bucket ===")
    rows = all_rows['ENDURANCE']
    t0 = min(int(r['timeStamp']) for r in rows)
    buckets = defaultdict(list)
    for r in rows:
        buckets[int((int(r['timeStamp']) - t0) / 1000.0 // 60)].append(r)
    for b in sorted(buckets):
        s = basic_stats(buckets[b])
        print(f"minute {b:2d}: n={s['n']} err={s['errors']} ({s['err_rate']:.2f}%) "
              f"avg={s['avg']:.1f} p50={s['p50']} p90={s['p90']} p95={s['p95']} "
              f"p99={s['p99']} max={s['max']}")
