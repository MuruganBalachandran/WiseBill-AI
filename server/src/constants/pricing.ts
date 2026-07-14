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
      free: { costPerSeat: 0 },
      pro: { costPerSeat: 20 },
      business: { costPerSeat: 40 }, // maps to "Teams Standard"
      enterprise: { costPerSeat: 0, isCustom: true },
    },
  },
  copilot: {
    plans: {
      individual: { costPerSeat: 10 },
      business: { costPerSeat: 19 },
      enterprise: { costPerSeat: 60 }, // $39/user/mo + $21/user/mo GitHub Enterprise Cloud
    },
  },
  claude: {
    plans: {
      free: { costPerSeat: 0 },
      pro: { costPerSeat: 20, annualCostPerSeat: 17 },
      max: { costPerSeat: 100 },
      team: { costPerSeat: 25, annualCostPerSeat: 20, minSeats: 5 }, // Claude Team Standard
      premium: { costPerSeat: 125, annualCostPerSeat: 100, minSeats: 5 }, // Claude Team Premium
      enterprise: { costPerSeat: 20, isCustom: true }, // + usage billed separately
    },
  },
  chatgpt: {
    plans: {
      free: { costPerSeat: 0 },
      plus: { costPerSeat: 20 },
      business: { costPerSeat: 25, annualCostPerSeat: 20, minSeats: 2 }, // ChatGPT Team/Business
      enterprise: { costPerSeat: 60, isCustom: true }, // Estimated around $45-$75
    },
  },
  anthropic_api: {
    plans: {},
    apiRates: {
      sonnet: { inputPerMillion: 3, outputPerMillion: 15 }, // standard price after promo
      opus: { inputPerMillion: 5, outputPerMillion: 25 },
      haiku: { inputPerMillion: 1, outputPerMillion: 5 },
    },
  },
  openai_api: {
    plans: {},
    apiRates: {
      gpt5_flagship: { inputPerMillion: 5, outputPerMillion: 30 },
      gpt5_standard: { inputPerMillion: 2.5, outputPerMillion: 15 },
      gpt5_mini: { inputPerMillion: 0.75, outputPerMillion: 4.5 },
      gpt5_nano: { inputPerMillion: 0.2, outputPerMillion: 1.25 },
    },
  },
  gemini: {
    plans: {
      pro: { costPerSeat: 19.99 },
      ultra: { costPerSeat: 99.99 },
    },
    apiRates: {
      gemini3_pro: { inputPerMillion: 2, outputPerMillion: 12 },
      gemini3_flash: { inputPerMillion: 0.5, outputPerMillion: 3 },
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
