// region imports
import { ISpendInput, IAuditResult } from '../models/Audit.js';
import { PRICING_DATA } from '../constants/pricing.js';
// endregion

// region pure function audit engine
export interface IAuditResponse {
  results: IAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export const runAudit = (
  spendInputs: ISpendInput[],
  teamSize: number,
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed'
): IAuditResponse => {
  const results: IAuditResult[] = [];
  let totalMonthlySavings = 0;

  // Track if we have coding tools in the stack to detect overlaps
  const hasCursor = spendInputs.some(i => i.toolId === 'cursor' && i.plan !== 'free');
  const hasCopilot = spendInputs.some(i => i.toolId === 'copilot' && i.plan !== 'free');

  for (const input of spendInputs) {
    const { toolId, plan, monthlySpend, seats, useCase } = input;
    const toolPricing = PRICING_DATA[toolId];

    // Default recommendation is that the setup is already optimal
    let recommendedAction: 'keep' | 'downgrade_plan' | 'switch_tool' | 'use_credits' | 'already_optimal' = 'already_optimal';
    let recommendedPlan: string | null = plan;
    let monthlySavings = 0;
    let reasonText = `Your current plan is well-suited for your usage.`;

    // Rule 1: Overkill Seat Detection / Plan Downgrade
    if (toolId === 'cursor' && plan === 'business' && seats === 1) {
      // Cursor business/teams plan is $40/seat/mo, Pro is $20/mo
      const pricingPro = toolPricing?.plans?.pro?.costPerSeat ?? 20;
      const pricingBusiness = toolPricing?.plans?.business?.costPerSeat ?? 40;
      const expectedSpend = seats * pricingBusiness;
      
      recommendedAction = 'downgrade_plan';
      recommendedPlan = 'pro';
      monthlySavings = monthlySpend - (seats * pricingPro);
      reasonText = `Downgrade to Cursor Pro since Teams Standard features (billing admin, org controls) are overkill for a single user.`;
    } 
    else if (toolId === 'claude' && plan === 'team') {
      // Claude Team has a 5-seat minimum ($125/mo). If seats < 5, they still pay $125/mo.
      if (seats < 5) {
        const pricingPro = toolPricing?.plans?.pro?.costPerSeat ?? 20;
        const totalTeamCost = 125; // 5 seats * $25
        const totalProCost = seats * pricingPro;
        
        recommendedAction = 'downgrade_plan';
        recommendedPlan = 'pro';
        monthlySavings = monthlySpend - totalProCost;
        reasonText = `Downgrade to Claude Pro. The Team plan has a 5-seat minimum charge ($125/mo), making it overkill for ${seats} user${seats > 1 ? 's' : ''}.`;
      }
    } 
    else if (toolId === 'chatgpt' && plan === 'business') {
      // ChatGPT Business/Team has a 2-seat minimum ($50/mo monthly). If seats < 2, they pay $50/mo.
      if (seats < 2) {
        const pricingPlus = toolPricing?.plans?.plus?.costPerSeat ?? 20;
        const totalBusinessCost = 50; // 2 seats * $25
        const totalPlusCost = seats * pricingPlus;

        recommendedAction = 'downgrade_plan';
        recommendedPlan = 'plus';
        monthlySavings = monthlySpend - totalPlusCost;
        reasonText = `Downgrade to ChatGPT Plus. The Business plan has a 2-seat minimum charge ($50/mo), making it overkill for a single user.`;
      }
    }

    // Rule 2: Overlapping Coding Tools (Cursor + Copilot)
    else if (toolId === 'copilot' && hasCursor && hasCopilot && plan !== 'free') {
      recommendedAction = 'switch_tool';
      recommendedPlan = 'free';
      monthlySavings = monthlySpend;
      reasonText = `Drop GitHub Copilot. Cursor includes native autocomplete and chat features, making a separate Copilot subscription redundant.`;
    }

    // Rule 3: API-direct vs Subscription Breakeven
    else if ((toolId === 'anthropic_api' || toolId === 'openai_api') && monthlySpend > 0) {
      // If they are spending a lot on API direct, recommend switching to a flat-rate subscription
      // Breakeven analysis: subscription equivalent for team size
      const subscriptionCostPerSeat = 25; // e.g. Claude Team or ChatGPT Team
      const minSubscriptionSeats = toolId === 'anthropic_api' ? 5 : 2;
      const seatsToPay = Math.max(minSubscriptionSeats, seats);
      const totalSubscriptionCost = seatsToPay * subscriptionCostPerSeat;

      if (monthlySpend > totalSubscriptionCost) {
        recommendedAction = 'switch_tool';
        recommendedPlan = toolId === 'anthropic_api' ? 'team' : 'business';
        monthlySavings = monthlySpend - totalSubscriptionCost;
        const targetToolName = toolId === 'anthropic_api' ? 'Claude Team' : 'ChatGPT Team';
        reasonText = `Switch to ${targetToolName}. Your pay-as-you-go API spend ($${monthlySpend}) exceeds the cost of flat-rate chat subscriptions ($${totalSubscriptionCost}) for ${seats} seat${seats > 1 ? 's' : ''}.`;
      }
    }

    // Rule 4: Subscription to API-direct (Very low usage/spend on individual subscriptions)
    else if ((toolId === 'claude' && plan === 'pro' && seats === 1 && monthlySpend === 20) ||
             (toolId === 'chatgpt' && plan === 'plus' && seats === 1 && monthlySpend === 20)) {
      // If primary usecase is not heavily reliant on general chat (e.g. coding-only stack where they already have Cursor)
      // or if they have redundant subscriptions.
      const hasOtherGeneralChat = spendInputs.some(i => i.toolId !== toolId && (i.toolId === 'claude' || i.toolId === 'chatgpt') && i.plan !== 'free');
      if (hasOtherGeneralChat) {
        recommendedAction = 'switch_tool';
        recommendedPlan = 'free';
        monthlySavings = monthlySpend;
        const otherToolName = toolId === 'claude' ? 'ChatGPT' : 'Claude';
        reasonText = `Cancel your ${toolId === 'claude' ? 'Claude Pro' : 'ChatGPT Plus'} subscription as you have an active subscription to ${otherToolName}, resolving general chat overlap.`;
      }
    }

    // Safety checks: savings cannot exceed current spend or be negative
    if (monthlySavings < 0) {
      monthlySavings = 0;
      recommendedAction = 'already_optimal';
      recommendedPlan = plan;
      reasonText = `Your current plan is well-suited for your usage.`;
    }
    if (monthlySavings > monthlySpend) {
      monthlySavings = monthlySpend;
    }

    // Accumulate total monthly savings
    if ((recommendedAction as string) !== 'keep' && recommendedAction !== 'already_optimal') {
      totalMonthlySavings += monthlySavings;
    } else {
      // If we recommended keep/already_optimal, reset savings to 0 to be honest
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

  // Double check if overall savings are trivial
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
