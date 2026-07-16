// region imports
import mongoose, { Document } from 'mongoose';
// endregion

// region interfaces
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
  publicSlug: string;
  teamSize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  spendInputs: ISpendInput[];
  results: IAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  aiSummaryFallbackUsed: boolean;
  pricingSnapshotDate: Date;
  leadId: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

export interface IAuditDocument extends IAudit, Document {}

export interface ILead extends Document {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  savingsPotential?: number;
  emailSent?: boolean;
  createdAt: Date;
}
// endregion
