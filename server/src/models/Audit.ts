// region imports
import mongoose, { Schema, Document, Model } from 'mongoose';
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
// endregion

// region schemas
const SpendInputSchema = new Schema<ISpendInput>({
  toolId: {
    type: String,
    enum: ['cursor', 'copilot', 'claude', 'chatgpt', 'anthropic_api', 'openai_api', 'gemini', 'v0'],
    required: true,
  },
  plan: { type: String, required: true },
  monthlySpend: { type: Number, required: true, min: 0 },
  seats: { type: Number, required: true, min: 1 },
  useCase: {
    type: String,
    enum: ['coding', 'writing', 'data', 'research', 'mixed'],
    required: true,
  },
}, { _id: false });

const AuditResultSchema = new Schema<IAuditResult>({
  toolId: { type: String, required: true },
  currentSpend: { type: Number, required: true, min: 0 },
  recommendedAction: {
    type: String,
    enum: ['keep', 'downgrade_plan', 'switch_tool', 'use_credits', 'already_optimal'],
    required: true,
  },
  recommendedPlan: { type: String, default: null },
  monthlySavings: { type: Number, required: true },
  reasonText: { type: String, required: true },
}, { _id: false });

const AuditSchema = new Schema<IAuditDocument>({
  publicSlug: { type: String, required: true, unique: true, index: true },
  teamSize: { type: Number, required: true, min: 1 },
  primaryUseCase: {
    type: String,
    enum: ['coding', 'writing', 'data', 'research', 'mixed'],
    required: true,
  },
  spendInputs: { type: [SpendInputSchema], default: [] },
  results: { type: [AuditResultSchema], default: [] },
  totalMonthlySavings: { type: Number, required: true, default: 0 },
  totalAnnualSavings: { type: Number, required: true, default: 0 },
  aiSummary: { type: String, default: '' },
  aiSummaryFallbackUsed: { type: Boolean, default: false },
  pricingSnapshotDate: { type: Date, required: true, default: () => new Date('2026-07-14') },
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', default: null },
  createdAt: { type: Date, default: Date.now },
});
// endregion

// region model
export const Audit: Model<IAuditDocument> = mongoose.models.Audit || mongoose.model<IAuditDocument>('Audit', AuditSchema);
// endregion
