# Tests Documentation

All automated audit-engine tests are located in `server/tests/auditEngine.test.ts` and run using Node's native test runner via `tsx`.

## How to run the tests
From the `server` directory, run:
```bash
npm test
```

## Test Coverage: `auditEngine.test.ts` (7 Passing Tests)

1. **Test:** `1. Overkill-seat detection: 1 seat on Cursor Teams Standard`
   - **What it covers:** Verifies that a single user on a Cursor Business (Teams Standard) plan ($40/mo) is flagged for seat overkill and recommended to downgrade to Cursor Pro ($20/mo), capturing $20/mo ($240/yr) in savings.
2. **Test:** `2. Cheaper plan (same vendor): 2 seats on Claude Team`
   - **What it covers:** Verifies that a 2-person team on Claude Team ($125/mo due to the 5-seat floor minimum) is recommended to switch to individual Claude Pro licenses ($40/mo total), capturing $85/mo in savings.
3. **Test:** `3. Cheaper alternative tool: Overlapping Cursor + Copilot`
   - **What it covers:** Detects redundant autocomplete tools when a user pays for both Cursor Pro and GitHub Copilot for coding, recommending cancellation of Copilot to capture $10/mo in savings.
4. **Test:** `4. Already-optimal: entire stack spend < $100`
   - **What it covers:** Verifies that lean stacks with no wasteful plan tiers return `already_optimal` status with $0 in artificial savings.
5. **Test:** `5. API-direct vs subscription breakeven: high API usage`
   - **What it covers:** Evaluates when high pay-as-you-go API direct spend ($300/mo) exceeds team subscription breakeven, recommending migration to flat-rate Team plans.
6. **Test:** `6. Retail vs Startup Credits Advisory: API spend below team breakeven`
   - **What it covers:** Advises lower-tier developer API spend ($40/mo) to leverage cloud startup credits (e.g., AWS Activate / OpenAI for Startups) rather than upgrading prematurely.
7. **Test:** `7. Duplicate chat tool consolidation: ChatGPT + Claude Pro for coding`
   - **What it covers:** Detects redundant general chat subscriptions when both ChatGPT Plus and Claude Pro are active for coding, recommending consolidation to capture $20/mo in savings.
