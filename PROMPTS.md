# AI Spend Audit - LLM Prompts & Fallback Documentation

As per the assessment requirements, the mathematical logic for the audit is hardcoded in deterministic TypeScript (`server/src/services/auditEngine.ts`) because financial optimization calculations require 100% deterministic precision.

We use an LLM (**Anthropic Claude 3.5 Sonnet / Claude 3 Haiku** preferred, with fallbacks to Gemini 1.5 Flash / GPT-4o-mini) exclusively for generating a human-readable, ~100-word personalized executive summary paragraph of the audit results.

---

## 1. System & User Prompt Specifications

### System Prompt & Guidance
```text
You are WiseBill AI, a premium financial optimization assistant for SaaS stacks.
Analyze team audit data and output a concise, action-oriented, personalized optimization summary paragraph (~100 words).
```

### User Prompt Template
```text
You are WiseBill AI, a premium financial optimization assistant for SaaS stacks.
Analyze the following team audit data and output a concise, action-oriented, personalized optimization summary paragraph (~100 words).

WORKSPACE DETAILS:
- Team Size: ${teamSize} seats
- Primary Use Case: ${primaryUseCase}

ACTIVE SAAS TOOL STACK:
${toolStackText}

RECOMMENDED OPTIMIZATION ACTIONS:
${recommendationsText}

TOTAL ESTIMATED SAVINGS:
- Monthly Savings: $${totalMonthlySavings}/mo
- Annual Savings: $${totalAnnualSavings}/yr

INSTRUCTIONS:
1. Speak directly to the company in a professional, consulting tone.
2. Highlight the largest single source of waste (e.g., redundant autocomplete tools like Copilot when Cursor is active, or plan seat minimum inefficiencies).
3. Briefly mention the total projected annual savings.
4. Keep the summary under 120 words.
5. Do NOT output any conversational preambles, greetings, markdown headings, or bullet points. Output ONLY the raw paragraph text.
```

---

## 2. LLM Provider Hierarchy & Timeout Strategy

The service attempts LLM generation in the following priority order, protected by a **5-second `AbortController` timeout**:

1. **Anthropic API** (`claude-3-5-sonnet-20241022`) — Preferred
2. **Google Gemini API** (`gemini-1.5-flash`) — Secondary fallback
3. **OpenAI API** (`gpt-4o-mini`) — Tertiary fallback
4. **Deterministic Templated Summary** — Graceful offline fallback

---

## 3. Fallback Mechanism (`aiSummaryFallbackUsed: true`)

If no API key is set, or if an API call times out / encounters a network error, the system seamlessly falls back to a deterministic, high-quality template summary:

```text
Based on our audit of your ${teamSize}-seat team's SaaS stack, you can save $${totalMonthlySavings} per month, projecting to $${totalAnnualSavings} in total annual savings. ${wasteReason} Implementing the plan adjustments detailed below will eliminate this recurring waste immediately without impact to your development velocity.
```

If the stack is already 100% optimal ($0 savings):

```text
Your current SaaS tool stack is highly optimized. We reviewed your active subscriptions for a team size of ${teamSize} under a ${primaryUseCase} use case and found no overlaps or unnecessary billing tiers. You are operating at peak billing efficiency with zero monthly waste.
```
