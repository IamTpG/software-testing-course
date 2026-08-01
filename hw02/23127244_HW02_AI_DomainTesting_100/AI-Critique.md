# AI Critique (§10)

Working on this assignment, the biggest thing I learned is that AI is great at following a process step by step, but it's not good at knowing when to stop and question itself.

The clearest mistake was in FR-08 (Checkout). The AI said there was a bug because a logged-out user could still open the checkout page just by typing the URL. Sounded like a real bug at first. But re-reading the spec, it only said "logged-in users can checkout" - it never said the page itself has to be blocked. The backend already rejected the actual payment with a 401, so nothing was really broken. The AI basically invented a stricter rule than the spec said, probably because blocking the page just "feels" more secure.

The AI also completely missed a bug that wasn't about any input at all: when an admin changes an order's status, the mobile app doesn't refresh until you cancel or place a new order. I only found this by using the app myself, not from any test case. That's fair though - Domain Testing and BVA test input values and boundaries, not two screens going out of sync over time, so this bug was never something the technique could catch.

I also noticed the AI can be confidently wrong about things it never actually ran, like assuming a coupon discount calculated correctly, when the formula was actually multiplying the price instead of discounting it - only caught once I made it actually execute the test.

Main lesson: I still have to double-check everything the AI says, both against the real spec and by running the code myself. AI is a fast assistant for designing test cases, but I can't just trust its conclusions blindly.
