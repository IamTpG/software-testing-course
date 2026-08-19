# AI Critique

Across three APIs, 15 of 118 AI-generated test cases had a wrong expected value, and all
15 shared one failure mode: the AI substituted a *plausible* assumption for an *actual*
check. It assumed Express trims whitespace before matching (it doesn't), that a duplicate
cart item merges like a real e-commerce cart (it doesn't), that a documented admin-only
endpoint actually enforces that role (it doesn't). The AI wasn't hallucinating facts about
the world — it was reasoning correctly about how *most* systems behave, and quietly
treating that as a substitute for reading *this* system's code. That's a subtler failure
than a wrong fact: it's confidently applying the right prior to the wrong evidence base.

The AI also never caught its own blind spot without being pushed past it. Every one of
the 15 extension cases across the three APIs — the UNION-based credential leak, the
full non-admin coupon lifecycle, the cross-endpoint NULL-type chain — required explicitly
asking "what would a single-field, single-endpoint generation pass structurally miss?"
The AI's first pass was thorough within its own frame; it never widened that frame on its
own.

The principle I take from this: an AI's test cases are a hypothesis set, not an oracle,
until each one is run against the real system — and "run against the real system" has to
happen even *after* a human audit pass, since two mistakes (PA-34, PC-33) survived my own
audit and were only caught when Newman actually executed them. Verification isn't a step
you do once; it's a property the whole pipeline needs to keep proving, including of
itself.
