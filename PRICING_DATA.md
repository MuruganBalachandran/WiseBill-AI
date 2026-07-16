# AI Tool Pricing Data

All logic within the AI Spend Audit engine relies on the following pricing data. Prices are current as of the assignment submission week.

## Pricing Sources

### 1. Cursor
- **Source**: [https://cursor.com/pricing](https://cursor.com/pricing)
- **Hobby**: $0/mo
- **Pro**: $20/user/mo
- **Business**: $40/user/mo (Privacy mode enforced)

### 2. GitHub Copilot
- **Source**: [https://github.com/features/copilot#pricing](https://github.com/features/copilot#pricing)
- **Individual**: $10/user/mo
- **Business**: $19/user/mo
- **Enterprise**: $39/user/mo

### 3. Claude (Anthropic)
- **Source**: [https://www.anthropic.com/pricing](https://www.anthropic.com/pricing)
- **Free**: $0/mo
- **Pro**: $20/user/mo
- **Team**: $30/user/mo (Minimum 5 seats required)
- **API Direct**: Pay-as-you-go based on token usage.

### 4. ChatGPT (OpenAI)
- **Source**: [https://openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)
- **Plus**: $20/user/mo
- **Team**: $30/user/mo (Minimum 2 seats required)
- **Enterprise**: Custom (Assumed ~$60/user/mo for modeling)
- **API Direct**: Pay-as-you-go based on token usage.

### 5. Gemini
- **Source**: [https://gemini.google.com/advanced](https://gemini.google.com/advanced)
- **Advanced/Pro**: $20/user/mo
- **API**: Pay-as-you-go based on token usage.

### 6. Windsurf
- **Source**: [https://codeium.com/windsurf](https://codeium.com/windsurf)
- **Free**: $0/mo
- **Pro**: $20/user/mo

## Financial Assumptions used in Audit Engine:
1. **Seat Underutilization**: Buying a "Team" plan with fewer users than the required minimum is categorized as immediate budget waste.
2. **API vs Retail**: For heavy text-generation tasks scaling beyond 5-10 users, routing requests through the API via a unified frontend (like TypingMind or LibreChat) reduces per-seat costs by an estimated 60-80% compared to $20/mo retail licenses.
3. **Use-Case Alignment**: General-purpose chat interfaces (ChatGPT) used primarily for "Coding" yield lower ROI than dedicated IDEs (Cursor/Windsurf) which cost the same ($20/mo) but provide deeper codebase context.
