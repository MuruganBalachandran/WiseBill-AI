# Pricing data

Pricing was checked on **2026-07-20**. The audit stores the date of each audit so a shared report remains attributable to the price snapshot used to create it. Prices below are monthly USD list prices unless marked annual or custom. Custom-priced plans are never assigned a made-up list price: users enter their actual monthly spend, and the engine only recommends a change where it can calculate the alternative from a published plan.

## Cursor

- Hobby: $0 — https://cursor.com/pricing — verified 2026-07-20
- Pro: $20/user/month — https://cursor.com/pricing — verified 2026-07-20
- Teams Standard (shown as `business` in the API): $40/user/month — https://cursor.com/pricing — verified 2026-07-20
- Enterprise: custom — https://cursor.com/pricing — verified 2026-07-20

## GitHub Copilot

- Individual (Pro): $10/user/month — https://github.com/features/copilot/plans — verified 2026-07-20
- Business: $19/user/month — https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises — verified 2026-07-20
- Enterprise: $39/user/month, available with GitHub Enterprise Cloud — https://docs.github.com/en/copilot/concepts/billing/organizations-and-enterprises — verified 2026-07-20

## Claude

- Free: $0 — https://www.anthropic.com/pricing — verified 2026-07-20
- Pro: $20/user/month — https://www.anthropic.com/pricing — verified 2026-07-20
- Max: from $100/user/month — https://www.anthropic.com/pricing — verified 2026-07-20
- Team: $30/user/month billed monthly, or $25/user/month billed annually; five-seat minimum — https://www.anthropic.com/pricing — verified 2026-07-20
- Enterprise: custom — https://www.anthropic.com/pricing — verified 2026-07-20
- API direct: token-based; the engine does not estimate token usage from a total monthly bill — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-07-20

## ChatGPT and OpenAI API

- ChatGPT Free: $0 — https://chatgpt.com/pricing — verified 2026-07-20
- ChatGPT Plus: $20/user/month — https://chatgpt.com/pricing — verified 2026-07-20
- ChatGPT Team (marketed by OpenAI as Business): $25/user/month billed monthly, or $20/user/month billed annually; two-seat minimum — https://openai.com/business/pricing/ — verified 2026-07-20
- ChatGPT Enterprise: custom — https://openai.com/business/pricing/ — verified 2026-07-20
- OpenAI API direct: token-based and model-dependent; the engine uses the actual monthly spend entered by the user — https://openai.com/api/pricing/ — verified 2026-07-20

## Anthropic API direct

- API direct: token-based and model-dependent; the engine uses the actual monthly spend entered by the user — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-07-20

## Gemini

- Gemini Pro: $19.99/user/month — https://gemini.google/subscriptions/ — verified 2026-07-20
- Gemini Ultra: $99.99/user/month — https://gemini.google/subscriptions/ — verified 2026-07-20
- Gemini API: token-based and model-dependent; the engine uses the actual monthly spend entered by the user — https://ai.google.dev/gemini-api/docs/pricing — verified 2026-07-20

## v0

- Free: $0 — https://v0.app/pricing — verified 2026-07-20
- Premium: $20/user/month — https://v0.app/pricing — verified 2026-07-20
- Team: $30/user/month — https://v0.app/pricing — verified 2026-07-20
- Business: $100/user/month — https://v0.app/pricing — verified 2026-07-20
- Enterprise: custom — https://v0.app/pricing — verified 2026-07-20

## How the engine uses pricing

The engine is deliberately conservative. It only calculates savings for published, like-for-like alternatives: single-user Cursor Teams to Pro, a sub-five-seat Claude Team workspace to individual Pro seats, a one-seat ChatGPT Business workspace to Plus, duplicate Cursor/Copilot coding seats, and API spend that exceeds the comparable published chat-workspace floor. It does not claim credit savings without evidence that the company has credits, contract commitments, or a reseller agreement; that information is not requested by the MVP form. Those cases are surfaced as a manual-review opportunity rather than fabricated savings.
