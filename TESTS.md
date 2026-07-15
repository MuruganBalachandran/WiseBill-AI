# Audit Engine Tests

The core business logic of WiseBill AI is the audit engine (`server/src/services/engine.ts`). It is written as a pure function to ensure testability.

## Test Coverage (`server/tests/auditEngine.test.ts`)

1. **Overkill Seat Detection:** 
   - *Test:* Input a team of 3 using a plan with a 5-seat minimum (e.g., Claude Team).
   - *Expectation:* Engine flags it and recommends downgrading to individual Pro seats.
2. **Cheaper Alternative (Overlap):**
   - *Test:* Input both Cursor Pro and GitHub Copilot Business.
   - *Expectation:* Engine flags Copilot as redundant (since Cursor has native autocomplete) and recommends dropping Copilot for 100% savings on that line item.
3. **API Break-even Analysis:**
   - *Test:* Input a low-usage ChatGPT Plus plan ($20/mo) for a mixed use case.
   - *Expectation:* Engine suggests moving to OpenAI API direct if estimated API usage falls below $20.
4. **Already Optimal (<$100 case):**
   - *Test:* Input a lean stack (1 dev on Cursor Pro).
   - *Expectation:* Engine correctly returns 0 monthly savings and recommends "keep".
5. **Cheaper Plan (Same Vendor):**
   - *Test:* Input ChatGPT Enterprise for a 2-person team.
   - *Expectation:* Engine flags that Enterprise is meant for 150+ seats and recommends downgrading to ChatGPT Team.
