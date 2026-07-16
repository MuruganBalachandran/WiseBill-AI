import { PRICING_DATA, ToolName, Plan } from "./pricingData";

export type AuditInput = {
  tool: ToolName;
  planName: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: "coding" | "writing" | "data" | "research" | "mixed";
};

export type AuditResult = {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savingsMonthly: number;
  reason: string;
};

export function runAudit(inputs: AuditInput[]): {
  results: AuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
} {
  const results: AuditResult[] = [];
  let totalMonthlySavings = 0;

  inputs.forEach((input) => {
    let savings = 0;
    let action = "Keep current plan";
    let reason = "You are on the optimal plan for your usage.";

    const toolPlans = PRICING_DATA[input.tool];
    const currentPlan = toolPlans?.find((p) => p.name === input.planName);

    if (currentPlan) {
      // 1. Right plan for usage? (e.g., Seat minimums not met)
      if (currentPlan.minSeats && input.seats < currentPlan.minSeats) {
        const cheaperPlan = toolPlans.find((p) => p.name === "Pro" || p.name === "Individual" || p.name === "Plus");
        if (cheaperPlan) {
          const actualSpendRequired = currentPlan.pricePerSeat * currentPlan.minSeats;
          if (input.monthlySpend >= actualSpendRequired) {
             const optimizedSpend = cheaperPlan.pricePerSeat * input.seats;
             savings = input.monthlySpend - optimizedSpend;
             action = `Downgrade to ${cheaperPlan.name}`;
             reason = `You are paying for phantom seats. ${input.tool} ${currentPlan.name} requires a minimum of ${currentPlan.minSeats} seats, but you only have ${input.seats}. Downgrading optimizes per-head cost.`;
          }
        }
      }

      // 2. Cheaper plan from the same vendor that fits
      else if (
        (input.planName === "Enterprise" || input.planName === "Business") && 
        input.seats < 10 && savings === 0
      ) {
        const cheaperPlan = toolPlans.find((p) => p.name === "Pro" || p.name === "Individual" || p.name === "Plus");
        if (cheaperPlan) {
          const newSpend = cheaperPlan.pricePerSeat * input.seats;
          if (newSpend < input.monthlySpend) {
            savings = input.monthlySpend - newSpend;
            action = `Downgrade to ${cheaperPlan.name}`;
            reason = `At just ${input.seats} seats, Enterprise/Business tier compliance features are likely unused. Moving to ${cheaperPlan.name} saves $${(input.monthlySpend - newSpend).toLocaleString()} annually per user without losing core capabilities.`;
          }
        }
      }

      // 3. Cheaper alternative tool with similar capability for their use case
      else if (
        (input.tool === "ChatGPT" || input.tool === "Claude") && 
        input.useCase === "coding" && 
        input.planName !== "API direct" && 
        savings === 0
      ) {
        action = "Switch to Cursor or Windsurf";
        reason = "For dedicated engineering workflows, an AI-native IDE provides significantly better ROI through deep codebase context compared to a standard web chat interface.";
        // Conservative savings estimate: moving from $30 Team to $20 Pro IDE
        const alternativePrice = 20;
        if (input.monthlySpend > (input.seats * alternativePrice)) {
          savings = input.monthlySpend - (input.seats * alternativePrice);
        } else {
          // No direct monthly savings, but massive productivity gain
          reason += " While monthly cost is similar, the developer productivity gains offset the spend entirely.";
        }
      }

      // 4. Retail vs API Credits
      else if (input.monthlySpend >= 100 && input.planName !== "API direct" && input.planName !== "API" && savings === 0) {
        action = "Migrate to API + BYOK Frontend";
        reason = `High retail seat spend detected ($${input.monthlySpend}/mo). Routing requests through the API via a unified frontend (like LibreChat) scales infinitely better and typically reduces per-seat costs by 60-80%.`;
        savings = Math.floor(input.monthlySpend * 0.6); // 60% savings estimate
      }
    }

    results.push({
      tool: input.tool,
      currentSpend: input.monthlySpend,
      recommendedAction: action,
      savingsMonthly: savings,
      reason,
    });

    totalMonthlySavings += savings;
  });

  return {
    results,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}
