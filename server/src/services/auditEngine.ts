// region imports
import { ISpendInput, IAuditResult, IAuditResponse } from '../types/index.js';
import { PRICING_DATA } from '../constants/pricing.js';
// endregion

// region helper evaluators

// Evaluates plan fit and minimum seat requirements for vendor downgrade recommendations
const evaluatePlanFit = (
  input: ISpendInput,
  toolPricing: typeof PRICING_DATA[string]
): { action: 'downgrade_plan'; plan: string; savings: number; reason: string } | null => {
  const { toolId, plan, monthlySpend, seats } = input;

  // Rule A: Cursor Business (Teams Standard $40/mo) for 1 seat -> Cursor Pro ($20/mo)
  if (toolId === 'cursor' && plan === 'business' && seats === 1) {
    const proCost = toolPricing?.plans?.pro?.costPerSeat ?? 20;
    const savings = Math.max(0, monthlySpend - proCost);
    return {
      action: 'downgrade_plan',
      plan: 'pro',
      savings,
      reason: `Downgrade to Cursor Pro ($${proCost}/mo). Cursor Teams Standard ($40/mo) admin controls are unnecessary for 1 seat, saving $${savings}/mo.`,
    };
  }

  // Rule B: Claude Team (5-seat min @ $30/mo monthly or $25/mo annual) for < 5 seats
  if (toolId === 'claude' && plan === 'team' && seats < 5) {
    const proCost = toolPricing?.plans?.pro?.costPerSeat ?? 20;
    const totalProCost = seats * proCost;
    const savings = Math.max(0, monthlySpend - totalProCost);
    return {
      action: 'downgrade_plan',
      plan: 'pro',
      savings,
      reason: `Downgrade to Claude Pro ($${proCost}/user/mo). The Claude Team plan enforces a 5-seat minimum charge ($150/mo floor), which is overkill for ${seats} user${seats > 1 ? 's' : ''}. Moving to Pro costs $${totalProCost}/mo, saving $${savings}/mo.`,
    };
  }

  // Rule C: ChatGPT Team (2-seat min @ $25/mo monthly or $20/mo annual) for 1 seat
  if (toolId === 'chatgpt' && plan === 'team' && seats < 2) {
    const plusCost = toolPricing?.plans?.plus?.costPerSeat ?? 20;
    const savings = Math.max(0, monthlySpend - plusCost);
    return {
      action: 'downgrade_plan',
      plan: 'plus',
      savings,
      reason: `Downgrade to ChatGPT Plus ($${plusCost}/mo). ChatGPT Team requires a 2-seat minimum ($50/mo floor), which is overkill for a single user, saving $${savings}/mo.`,
    };
  }

  // Rule D: Gemini Ultra ($99.99/mo) -> Gemini Pro ($19.99/mo)
  if (toolId === 'gemini' && plan === 'ultra') {
    const proCost = toolPricing?.plans?.pro?.costPerSeat ?? 19.99;
    const totalProCost = seats * proCost;
    const savings = Math.max(0, monthlySpend - totalProCost);
    return {
      action: 'downgrade_plan',
      plan: 'pro',
      savings,
      reason: `Downgrade to Gemini Pro ($${proCost}/user/mo). Gemini Ultra ($99.99/user/mo) is unnecessary for standard tasks, saving $${savings}/mo for ${seats} seat${seats > 1 ? 's' : ''}.`,
    };
  }

  // Rule E: v0 Business ($100/mo) for 1 seat -> v0 Premium ($20/mo)
  if (toolId === 'v0' && plan === 'business' && seats === 1) {
    const premiumCost = toolPricing?.plans?.premium?.costPerSeat ?? 20;
    const savings = Math.max(0, monthlySpend - premiumCost);
    return {
      action: 'downgrade_plan',
      plan: 'premium',
      savings,
      reason: `Downgrade to v0 Premium ($${premiumCost}/mo). v0 Business ($100/mo) features are unnecessary for a single user, saving $${savings}/mo.`,
    };
  }

  return null;
};

// Evaluates tool redundancy and overlap (e.g. Cursor + Copilot, duplicate chat tools)
const evaluateOverlap = (
  input: ISpendInput,
  spendInputs: ISpendInput[],
  primaryUseCase: string
): { action: 'switch_tool'; plan: string; savings: number; reason: string } | null => {
  const { toolId, plan, monthlySpend } = input;

  // Rule A: Overlapping coding tools (Cursor + GitHub Copilot)
  const hasActiveCursor = spendInputs.some(i => i.toolId === 'cursor' && i.plan !== 'hobby' && i.plan !== 'free');
  if (toolId === 'copilot' && hasActiveCursor && plan !== 'free' && monthlySpend > 0) {
    return {
      action: 'switch_tool',
      plan: 'free',
      savings: monthlySpend,
      reason: `Cancel GitHub Copilot. Cursor includes native inline autocompletion and chat capabilities, making a separate Copilot subscription ($${monthlySpend}/mo) redundant.`,
    };
  }

  // Rule B: Duplicate general chat subscriptions for single users (ChatGPT + Claude + Gemini)
  const isChatTool = toolId === 'claude' || toolId === 'chatgpt' || toolId === 'gemini';
  if (isChatTool && monthlySpend > 0 && input.seats === 1) {
    const activeChatTools = spendInputs.filter(i => (i.toolId === 'claude' || i.toolId === 'chatgpt' || i.toolId === 'gemini') && i.monthlySpend > 0);
    if (activeChatTools.length > 1) {
      // Determine primary tool to keep based on primaryUseCase
      let keptToolId = 'claude'; // default preferred for coding/writing
      if (primaryUseCase === 'data' || primaryUseCase === 'research') {
        keptToolId = 'chatgpt';
      }

      if (toolId !== keptToolId) {
        const keptToolName = keptToolId === 'claude' ? 'Claude Pro' : 'ChatGPT Plus';
        return {
          action: 'switch_tool',
          plan: 'free',
          savings: monthlySpend,
          reason: `Cancel ${toolId.toUpperCase()} ($${monthlySpend}/mo). You already have an active ${keptToolName} subscription tailored for your ${primaryUseCase} use case, eliminating duplicate chat costs.`,
        };
      }
    }
  }

  return null;
};

// Evaluates API direct spend vs flat-rate team subscription breakeven
const evaluateApiBreakeven = (
  input: ISpendInput
): { action: 'switch_tool'; plan: string; savings: number; reason: string } | null => {
  const { toolId, monthlySpend, seats } = input;

  if ((toolId === 'anthropic_api' || toolId === 'openai_api') && monthlySpend > 0) {
    const costPerSeat = 25; // standard team seat cost
    const minSeats = toolId === 'anthropic_api' ? 5 : 2; // minimum seats required for team plan
    const requiredSeats = Math.max(minSeats, seats);
    const teamFloorCost = requiredSeats * costPerSeat;

    if (monthlySpend > teamFloorCost) {
      const savings = monthlySpend - teamFloorCost;
      const targetTeamName = toolId === 'anthropic_api' ? 'Claude Team' : 'ChatGPT Team';
      return {
        action: 'switch_tool',
        plan: 'team',
        savings,
        reason: `Switch to ${targetTeamName}. Your pay-as-you-go API spend ($${monthlySpend}/mo) exceeds the flat-rate team subscription cost ($${teamFloorCost}/mo for ${requiredSeats} seats), saving $${savings}/mo.`,
      };
    }
  }

  return null;
};

// Evaluates startup credit opportunities for API direct spend or high spend
const evaluateCredits = (
  input: ISpendInput
): { action: 'use_credits'; plan: string; savings: number; reason: string } | null => {
  const { toolId, monthlySpend } = input;

  // Rule: API direct spend or high spend qualifies for Startup Credit Programs (OpenAI / Anthropic / AWS)
  if ((toolId === 'openai_api' || toolId === 'anthropic_api') && monthlySpend > 0) {
    const provider = toolId === 'openai_api' ? 'OpenAI Founders Program' : 'Anthropic Startup Credits / AWS Activate';
    return {
      action: 'use_credits',
      plan: input.plan,
      savings: monthlySpend,
      reason: `Apply for ${provider}. Early-stage companies qualify for $2,500 to $25,000 in free API credits, offsetting your monthly retail spend of $${monthlySpend} to $0.`,
    };
  }

  return null;
};

// endregion

// region main runAudit engine function

export const runAudit = (
  spendInputs: ISpendInput[],
  teamSize: number,
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed'
): IAuditResponse => {
  const results: IAuditResult[] = [];
  let totalMonthlySavings = 0;

  for (const input of spendInputs) {
    const { toolId, plan, monthlySpend } = input;
    const toolPricing = PRICING_DATA[toolId];

    let recommendedAction: 'keep' | 'downgrade_plan' | 'switch_tool' | 'use_credits' | 'already_optimal' = 'already_optimal';
    let recommendedPlan: string | null = plan;
    let monthlySavings = 0;
    let reasonText = `Your current plan is well-suited for your usage.`;

    // Priority 1: Overlap & Redundancy Check
    const overlapResult = evaluateOverlap(input, spendInputs, primaryUseCase);

    // Priority 2: Plan Fit & Minimum Seat Overkill Check
    const planFitResult = evaluatePlanFit(input, toolPricing);

    // Priority 3: API Breakeven Check (Calculates savings from published plan alternative)
    const breakevenResult = evaluateApiBreakeven(input);

    // Priority 4: Startup Credits Advisory Check (Used when no published plan breakeven fits or as credit advisory)
    const creditResult = evaluateCredits(input);

    // Select recommendation in priority order
    if (overlapResult && overlapResult.savings > 0) {
      recommendedAction = overlapResult.action;
      recommendedPlan = overlapResult.plan;
      monthlySavings = overlapResult.savings;
      reasonText = overlapResult.reason;
    } else if (planFitResult && planFitResult.savings > 0) {
      recommendedAction = planFitResult.action;
      recommendedPlan = planFitResult.plan;
      monthlySavings = planFitResult.savings;
      reasonText = planFitResult.reason;
    } else if (breakevenResult && breakevenResult.savings > 0) {
      recommendedAction = breakevenResult.action;
      recommendedPlan = breakevenResult.plan;
      monthlySavings = breakevenResult.savings;
      reasonText = breakevenResult.reason;
    } else if (creditResult && creditResult.savings > 0) {
      recommendedAction = creditResult.action;
      recommendedPlan = creditResult.plan;
      monthlySavings = creditResult.savings;
      reasonText = creditResult.reason;
    }

    // Safety bounds for monthly savings
    if (monthlySavings < 0) {
      monthlySavings = 0;
      recommendedAction = 'already_optimal';
      recommendedPlan = plan;
      reasonText = `Your current plan is well-suited for your usage.`;
    }
    if (monthlySavings > monthlySpend) {
      monthlySavings = monthlySpend;
    }

    // Accumulate total savings
    if (recommendedAction !== 'already_optimal') {
      totalMonthlySavings += monthlySavings;
    } else {
      monthlySavings = 0;
    }

    results.push({
      toolId,
      currentSpend: monthlySpend,
      recommendedAction,
      recommendedPlan,
      monthlySavings,
      reasonText,
    });
  }

  // Ensure total monthly savings non-negative
  if (totalMonthlySavings < 0) {
    totalMonthlySavings = 0;
  }

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
};

// endregion
