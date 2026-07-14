export interface ISpendInput {
  toolId: 'cursor' | 'copilot' | 'claude' | 'chatgpt' | 'anthropic_api' | 'openai_api' | 'gemini' | 'v0';
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

export interface IAuditResult {
  toolId: string;
  currentSpend: number;
  recommendedAction: 'keep' | 'downgrade_plan' | 'switch_tool' | 'use_credits' | 'already_optimal';
  recommendedPlan: string | null;
  monthlySavings: number;
  reasonText: string;
}

export interface IAudit {
  _id?: string;
  publicSlug: string;
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  spendInputs: ISpendInput[];
  results: IAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  pricingSnapshotDate: string;
  createdAt?: string;
}

export interface IAuditCreateRequest {
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  spendInputs: ISpendInput[];
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
