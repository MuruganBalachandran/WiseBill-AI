# AI Spend Audit - LLM Prompts

As per the assignment requirements, the mathematical logic for the audit is hardcoded in TypeScript (`src/lib/auditEngine.ts`) because it requires deterministic financial precision. 

However, we use an LLM (Anthropic Claude 3 Haiku / OpenAI GPT-4o-mini) to generate a personalized, human-readable executive summary of the audit results.

## Summary Generation Prompt

**System Prompt:**
```text
You are a fractional CFO and AI tooling expert. Your goal is to review a company's current AI tooling spend and provide a concise, professional 100-word executive summary of their optimization opportunities. 

Tone: Direct, professional, and slightly urgent if savings are high. Do not use filler words.
```

**User Prompt:**
```text
Please generate a 100-word executive summary based on the following AI Spend Audit data:

Total Current Monthly Spend: ${totalCurrentSpend}
Total Potential Monthly Savings: ${totalMonthlySavings}
Total Potential Annual Savings: ${totalAnnualSavings}

Tool Breakdown & Recommendations:
{toolRecommendationsList}

Focus on the biggest areas of waste (e.g., phantom seats, overkill enterprise plans) and highlight the total annual savings clearly. If they are already optimized, congratulate them on running a lean tech stack. Do not explain the math, just summarize the business impact.
```

## Fallback Mechanism
If the API fails, times out, or the API key is missing, the system gracefully falls back to the following template:

```text
Based on your audit, your team is currently spending $X/mo on AI tools. By restructuring your stack according to our recommendations, you could capture $Y in annual savings. Review the detailed tool breakdown below to see exactly which licenses are underutilized and where switching tools provides better ROI.
```
