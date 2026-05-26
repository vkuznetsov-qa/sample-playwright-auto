# sample-playwright-auto

A Playwright automation sample for collection and asset workflows on pics.io.

---

## Project Focus: What, Why & How

### 1. What & Why
In a Digital Asset Management (DAM) tool like Pics.io, the "Collections" feature is the primary way users organize and find their work. This test suite focuses on the **Organization Workflow**. If the tree structure loses track of assets or fails during core actions, the product becomes unusable.

### 2. Testing Scope (Strategic Decisions)

* **Functional (In Scope for Automation):** Automated validation of internal CRUD operations for the folder tree and drag-and-drop mechanics.
* **UI/UX, Edge Cases & Consistency (Production Vision):** Conceptualized in the test plan for manual exploratory testing, cross-browser infrastructure, and visual regression (e.g., tree-view responsiveness, extreme name lengths).

### 3. AI Tooling Usage
* **Tool Used:** GitHub Copilot
* **Where it helped:** Used during the scripting phase for code auto-completion and proactive refactoring. Copilot assisted in identifying repetitive logical blocks within the test files and suggested grouping them into reusable helper modules. This optimization significantly improved the readability, maintainability, and reusability of the page object components and utilities.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and provide `CLIENT_LOGIN` / `CLIENT_PASSWORD`.
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Available commands

- `npm test` — run the test suite
- `npm run test:headed` — run tests with a visible browser
- `npm run test:report` — open the HTML report
