// region interfaces
export interface SendEmailOptions {
  to: string;
  auditSlug: string;
  companyName?: string | null;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
}

export interface D1LeadRow {
  id: string;
  auditId: string;
  email: string;
  companyName?: string | null;
  role?: string | null;
  teamSize?: number | null;
  consentedAt: string;
  emailSent: boolean;
}

export interface IAuditResponse {
  results: import('./models.js').IAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export interface IGenerationInput {
  teamSize: number;
  primaryUseCase: string;
  spendInputs: import('./models.js').ISpendInput[];
  results: import('./models.js').IAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}
// endregion
