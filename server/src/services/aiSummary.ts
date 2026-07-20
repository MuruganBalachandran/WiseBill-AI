// region imports
import { IGenerationInput } from '../types/index.js';
// endregion

// region prompt construction

const buildPrompt = (input: IGenerationInput): string => {
  const { teamSize, primaryUseCase, spendInputs, results, totalMonthlySavings, totalAnnualSavings } = input;

  const toolStackText = spendInputs
    .map(i => `* ${i.toolId} (Plan: ${i.plan}, Monthly Spend: $${i.monthlySpend}, Seats: ${i.seats}, Use Case: ${i.useCase})`)
    .join('\n');

  const recommendationsText = results
    .map(r => `* Tool: ${r.toolId}, Recommendation: ${r.recommendedAction} (New Plan: ${r.recommendedPlan}), Savings: $${r.monthlySavings}/mo. Reason: ${r.reasonText}`)
    .join('\n');

  return `You are WiseBill AI, a premium financial optimization assistant for SaaS stacks.
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
5. Do NOT output any conversational preambles, greetings, markdown headings, or bullet points. Output ONLY the raw paragraph text.`;
};

// endregion

// region llm api handlers

// Anthropic Claude API handler with 5-second timeout (preferred provider)
const callAnthropicApi = async (prompt: string): Promise<string | null> => {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const data = (await response.json()) as any;
      const text = data?.content?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    }
    console.warn(`Anthropic API returned status ${response.status}. Falling back.`);
  } catch (err) {
    console.error('Error or timeout invoking Anthropic API:', err);
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
};

// Google Gemini API handler with 5-second timeout
const callGeminiApi = async (prompt: string): Promise<string | null> => {
  if (!process.env.GEMINI_API_KEY) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      }
    );

    if (response.ok) {
      const data = (await response.json()) as any;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    }
    console.warn(`Gemini API returned status ${response.status}. Falling back.`);
  } catch (err) {
    console.error('Error or timeout invoking Gemini API:', err);
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
};

// OpenAI API handler with 5-second timeout
const callOpenAiApi = async (prompt: string): Promise<string | null> => {
  if (!process.env.OPENAI_API_KEY) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });

    if (response.ok) {
      const data = (await response.json()) as any;
      const text = data?.choices?.[0]?.message?.content;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    }
    console.warn(`OpenAI API returned status ${response.status}. Falling back.`);
  } catch (err) {
    console.error('Error or timeout invoking OpenAI API:', err);
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
};

// High-quality deterministic fallback summary generator
const generateFallbackSummary = (input: IGenerationInput): string => {
  const { teamSize, primaryUseCase, results, totalMonthlySavings, totalAnnualSavings } = input;

  if (totalMonthlySavings <= 0) {
    return `Your current SaaS tool stack is highly optimized. We reviewed your active subscriptions for a team size of ${teamSize} under a ${primaryUseCase} use case and found no overlaps or unnecessary billing tiers. You are operating at peak billing efficiency with zero monthly waste.`;
  }

  // find the recommendation with the highest savings
  const sortedSavings = [...results].sort((a, b) => b.monthlySavings - a.monthlySavings);
  const highestSaving = sortedSavings[0];

  let wasteReason = '';
  if (highestSaving.toolId === 'copilot' && highestSaving.recommendedAction === 'switch_tool') {
    wasteReason = 'Your primary source of spend inefficiency comes from overlapping coding autocomplete subscriptions, specifically paying for separate GitHub Copilot seats alongside Cursor.';
  } else if (highestSaving.recommendedAction === 'downgrade_plan') {
    wasteReason = `Your primary source of waste is plan minimum overages, particularly with your ${highestSaving.toolId} subscription where plan seat minimum criteria exceed your active team count.`;
  } else if (highestSaving.recommendedAction === 'switch_tool') {
    wasteReason = `We identified substantial savings by migrating your pay-as-you-go ${highestSaving.toolId} developer API spend over into flat-rate enterprise or team subscriptions.`;
  } else {
    wasteReason = `We identified immediate savings by adjusting billing plans and subscriptions across your active tools, led by optimization of your ${highestSaving.toolId} plan.`;
  }

  return `Based on our audit of your ${teamSize}-seat team's SaaS stack, you can save $${totalMonthlySavings.toFixed(2)} per month, projecting to $${totalAnnualSavings.toFixed(2)} in total annual savings. ${wasteReason} Implementing the plan adjustments detailed below will eliminate this recurring waste immediately without impact to your development velocity.`;
};

// endregion

// region main generateAiSummary service function

export const generateAiSummary = async (input: IGenerationInput): Promise<{ summary: string; fallbackUsed: boolean }> => {
  const prompt = buildPrompt(input);

  // 1. Try Anthropic API first (preferred provider)
  const anthropicResult = await callAnthropicApi(prompt);
  if (anthropicResult) {
    return { summary: anthropicResult, fallbackUsed: false };
  }

  // 2. Try Gemini API fallback
  const geminiResult = await callGeminiApi(prompt);
  if (geminiResult) {
    return { summary: geminiResult, fallbackUsed: false };
  }

  // 3. Try OpenAI API fallback
  const openAiResult = await callOpenAiApi(prompt);
  if (openAiResult) {
    return { summary: openAiResult, fallbackUsed: false };
  }

  // 4. Graceful Fallback: Return structured templated summary
  const fallbackSummary = generateFallbackSummary(input);
  return { summary: fallbackSummary, fallbackUsed: true };
};

// endregion
