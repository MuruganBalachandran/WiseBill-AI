// Pricing configuration returned by the audit API.
export type PricingPlan = {
  costPerSeat: number;
  annualCostPerSeat?: number;
  minSeats?: number;
  isCustom?: boolean;
};

// Pricing configuration is intentionally flexible because API plans have no fixed seat price.
export type PricingConfig = Record<string, { plans: Record<string, PricingPlan> }>;
