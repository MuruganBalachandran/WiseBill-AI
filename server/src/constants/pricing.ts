// region exports
export interface IToolPricing {
  plans: {
    [planName: string]: {
      costPerSeat: number; // Monthly price in USD
      annualCostPerSeat?: number; // Annual equivalent price monthly
      minSeats?: number;
      isCustom?: boolean;
    };
  };
  apiRates?: {
    [modelName: string]: {
      inputPerMillion: number;
      outputPerMillion: number;
    };
  };
}

export const PRICING_DATA: { [toolId: string]: IToolPricing } = {
  cursor: {
    plans: {
      hobby: { costPerSeat: 0 },
      pro: { costPerSeat: 20 },
      business: { costPerSeat: 40 }, // maps to "Teams Standard"
      enterprise: { costPerSeat: 0, isCustom: true },
    },
  },
  copilot: {
    plans: {
      individual: { costPerSeat: 10 },
      business: { costPerSeat: 19 },
      enterprise: { costPerSeat: 39 },
    },
  },
  claude: {
    plans: {
      free: { costPerSeat: 0 },
      pro: { costPerSeat: 20, annualCostPerSeat: 17 },
      max: { costPerSeat: 100 },
      team: { costPerSeat: 30, annualCostPerSeat: 25, minSeats: 5 }, // Claude Team Standard ($30/mo monthly, $25/mo annual)
      enterprise: { costPerSeat: 0, isCustom: true },
    },
  },
  chatgpt: {
    plans: {
      plus: { costPerSeat: 20 },
      team: { costPerSeat: 25, annualCostPerSeat: 20, minSeats: 2 },
      enterprise: { costPerSeat: 0, isCustom: true },
      api_direct: { costPerSeat: 0 },
    },
  },
  anthropic_api: {
    plans: { pay_as_you_go: { costPerSeat: 0 } },
  },
  openai_api: {
    plans: { pay_as_you_go: { costPerSeat: 0 } },
  },
  gemini: {
    plans: {
      pro: { costPerSeat: 19.99 },
      ultra: { costPerSeat: 99.99 },
      api: { costPerSeat: 0 },
    },
  },
  v0: {
    plans: {
      free: { costPerSeat: 0 },
      premium: { costPerSeat: 20 },
      team: { costPerSeat: 30 },
      business: { costPerSeat: 100 },
      enterprise: { costPerSeat: 0, isCustom: true },
    },
  },
};
// endregion
