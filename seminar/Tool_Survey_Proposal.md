# Seminar Proposal: Stage S1
**Topic:** T02 — Web Automation Testing
**Team Members:** [Student 1], [Student 2], [Student 3], [Student 4]

## 1. Candidate Tools
We will evaluate three tools spanning the traditional and AI-augmented directions required by the T02 brief:

- **Playwright (traditional, main):** Microsoft-backed, multi-browser engine with codegen and trace-viewer; the recommended default for end-to-end browser tests.
- **Cypress (backup):** Developer-experience-focused runner with a time-travel debugger, used as fallback if Playwright integration with the EShop SUT proves problematic.
- **AI coding assistants (AI-augmented):** A family of natural-language code generators that produce Playwright test scripts and locator strategies, which we then audit, run, and refactor:
  - **Cursor / GitHub Copilot** — IDE-embedded autocomplete and chat for in-editor test generation.
  - **Claude (Anthropic, Claude Code)** — agentic CLI/IDE assistant strong at multi-step refactors and reasoning over the EShop DOM.
  - **Codex (OpenAI, Codex CLI)** — terminal-native agent for generating and iterating on test specs from natural-language scenarios.

## 2. Comparison Matrix

| Criterion | Playwright | Cypress | AI assistants (Cursor/Copilot, Claude, Codex) |
| :--- | :--- | :--- | :--- |
| **Licence cost** | Free, open-source (Apache 2.0) | Free OSS core; paid Cloud dashboard | Free tiers / student trials; paid for full use |
| **Learning curve** | Moderate; async API, rich docs | Gentle; intuitive DX, fast onboarding | Low to use; needs skill to audit AI output |
| **EShop fit** | Excellent; covers FR-02 login, FR-07 cart, FR-08 checkout multi-browser | Good; Chrome-family focus limits cross-browser | N/A standalone; augments the host framework |
| **AI capability** | None native (used as the executor) | None native | Core strength: test-gen + locator suggestions |
| **Community** | Very large, fast-growing | Large, mature | Very large; backed by Microsoft, Anthropic, OpenAI |

## 3. Recommended Pick & Rationale
**Recommendation: Playwright paired with an AI assistant (Cursor/Copilot, Claude, or Codex).** Playwright is the stable traditional executor for the three EShop flows, while the AI assistant supplies the mandatory AI angle by generating tests we audit against hand-written ones. This directly fulfils the T02 milestones to "set up Playwright" and "rewrite one flow using an AI tool."

- Playwright's trace-viewer and retry tooling let us **measure first-run vs 10th-run flakiness** on a network-throttled environment and investigate the root cause of any flaky test.
- The pairing enables a controlled experiment to **compare AI-generated locators against hand-written `data-test-id` locators**, quantifying stability under small DOM changes.
- Both tools are free or trial-accessible and backed by large communities, keeping cost low while maximising maintainability evidence over the 4–6 week study window.

## 4. AI Disclosure
We used **Claude (Anthropic)** to research candidate tools, summarise official documentation, and draft the structure of this comparison matrix. Every factual claim — licence terms, multi-browser support, and the EShop functional-requirement mapping (FR-02, FR-07, FR-08) — was **manually cross-checked** against the official Playwright, Cypress, and vendor documentation, and against the T02 brief and Master Guide. No tool selection was delegated to AI; the final recommendation reflects the team's own judgement.
