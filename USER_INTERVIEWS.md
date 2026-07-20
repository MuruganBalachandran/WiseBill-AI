# User Interviews

> **Note:** Raw notes from three short calls I did this week with my network to validate the AI Spend Audit idea.

### Interview 1: Saran Kumar (AI/ML Engineer @ GOML)
- **Current Setup:** Spends heavily on API usage (OpenAI and Anthropic) for model testing, plus uses Cursor Pro for daily coding. 
- **The Problem:** "I constantly lose track of my API spend across different accounts. I'm paying $20/mo for Cursor, but also racking up like $50/mo on the OpenAI API for side projects. Sometimes I forget to turn off automated scripts."
- **Reaction to the tool:** "If a tool could tell me when my pay-as-you-go API spend gets so high that I should just buy a flat-rate ChatGPT Plus or Enterprise subscription instead, that would save me money immediately."
- **The most surprising thing they said:** I assumed developers tracked their API usage closely, but he admitted he just sets up auto-recharge and ignores it until the bill hits $100+.
- **What it changed about your design:** It made me realize the tool needs to explicitly call out "API direct" as a tool type and compare it against flat-rate subscriptions, rather than just comparing subscription vs subscription.

### Interview 2: Jai Varshan (SDET @ HashedIn)
- **Current Setup:** Uses GitHub Copilot for writing test automation scripts, and sometimes ChatGPT for regex or debugging.
- **The Problem:** "The company pays for Copilot, but I know a lot of the QA guys don't even have it installed properly in their IDEs. They just use the free ChatGPT web version."
- **Reaction to the tool:** "If the management saw a report showing they are paying $19/mo per head for Copilot seats that the testing team isn't even activating, they'd definitely cut those licenses."
- **The most surprising thing they said:** People are assigned expensive IDE licenses (Copilot) by IT but literally don't use them because they prefer a chat interface.
- **What it changed about your design:** I added a "Primary Use Case" dropdown. If someone selects "mixed" or "writing" but pays for an IDE extension, the engine flags it as a mismatch.

### Interview 3: Sathya (Technical Support Engineer @ Temenos)
- **Current Setup:** Uses ChatGPT Plus ($20/mo) to help draft customer responses and analyze massive error logs.
- **The Problem:** "My whole support pod bought ChatGPT Plus on our own credit cards and we expense it. But honestly, I only use it for maybe 15 minutes a day when a really weird log comes in."
- **Reaction to the tool:** "It makes total sense. If the company just bought a team plan and pooled our usage, or if they realized we only need the cheaper API for simple log parsing, they'd save a ton compared to expensing 10 individual $20 subscriptions."
- **The most surprising thing they said:** That employees are swiping their own cards and expensing it. This means the company's finance team likely has zero visibility into the actual software being used.
- **What it changed about your design:** It confirmed that the primary target audience is the CFO/Finance lead, not the developer. I updated the tone of the AI summary and the results page to focus heavily on "total annual savings" which appeals directly to finance.
