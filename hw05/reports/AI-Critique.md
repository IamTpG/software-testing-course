# AI Critique (23127244)

The AI's most concrete miss in this homework wasn't in the analysis step — it was in the Spike
test's own design. Before building the test plan, I burst-tested `apply-coupon` with one-shot
curl bursts up to 2000 concurrent requests and found zero errors, concluding "no breaking point
in range." That conclusion was too confident. When the real, sustained 500-VU JMeter run actually
executed, 136 requests breached the 1500ms SLA — all real, all HTTP 200, none of them errors the
curl probe could have caught. The gap: a one-shot burst of N simultaneous requests and a sustained
stream of N concurrent connections re-firing continuously for 15 seconds are not the same load
shape, and the probe also didn't account for JMeter's own JVM competing for CPU with the backend
on the same laptop. The AI missed this because "verify empirically" isn't the same as "verify
under the same conditions as the real test" — a cheap proxy measurement can still mislead if its
shape differs from what's actually being validated.

The opposite lesson showed up in Task 2: I was skeptical of the fresh AI session's boldest claim —
that JMeter's own dashboard reports a 6.5x-wrong median — and went looking for the error. There
wasn't one; independent recomputation confirmed it twice. The principle I'm taking from both
cases together: reviewing AI output isn't about assuming it's wrong and hunting for a flaw to
report, and it isn't about trusting a "we checked it" claim at face value either. It's about
actually re-deriving the number a different way and being equally willing to report "this held up"
as "this was wrong."
