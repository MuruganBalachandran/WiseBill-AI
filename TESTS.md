# Tests Documentation

All automated tests are located in the `client/__tests__` directory and use the Jest testing framework.

## How to run the tests
From the `client` directory, run:
```bash
npm run test
```

## Test Coverage: `auditEngine.test.ts`
This file contains the 5 required core business logic tests for the Audit Engine.

1. **Test:** `handles optimal coding stack correctly`
   - **What it covers:** Verifies that a small team (3 seats) on an optimized plan (Cursor Pro) triggers the 'keep' / 'already_optimal' logic with $0 in savings.
2. **Test:** `flags phantom seats for Enterprise minimums`
   - **What it covers:** Verifies that a 2-person team attempting to use ChatGPT Enterprise is flagged for wasting money, as Enterprise requires minimum seat counts they cannot utilize. Recommends downgrading.
3. **Test:** `suggests IDE over general chat for coding`
   - **What it covers:** If a user's primary use case is `coding` but they are paying $20/mo for ChatGPT Plus, it suggests switching to an AI-native IDE (like Cursor) for the same price but significantly higher engineering ROI.
4. **Test:** `suggests API direct for heavy text routing`
   - **What it covers:** Identifies when large teams (50+ seats) are paying retail for Claude Team and suggests routing through Anthropic API Direct (via a frontend like LibreChat) to capture massive margin savings.
5. **Test:** `calculates annualized savings accurately`
   - **What it covers:** A strict mathematical assertion ensuring `totalMonthlySavings * 12` exactly equals `totalAnnualSavings` across a complex array of inputs.
