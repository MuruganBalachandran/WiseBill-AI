// region imports
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToolPicker } from '@/components/audit/ToolPicker';
import { SubscriptionCard } from '@/components/audit/SubscriptionCard';
import { createSubscription, normalizePlanId, normalizeToolId } from '@/constants/toolCatalog';
import { RootState } from '@/store';
import { updateGlobalSettings, updateInputs } from '@/store/slices/auditSlice';
import { getPricingConfig } from '@/services/audit';
import { AuditInput } from '@/types/audit';
import { PricingConfig } from '@/types/pricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// endregion

// region types and constants
type SpendInputFormProps = {
  onAudit: (inputs: AuditInput[], honeypot: string) => void;
};

const DEFAULT_GLOBAL_SETTINGS = { teamSize: 10 };
// endregion

// region component
export function SpendInputForm({ onAudit }: SpendInputFormProps) {
  // region state
  const dispatch = useDispatch();
  const inputs = useSelector((state: RootState) => state.audit.inputs);
  const globalSettings = useSelector((state: RootState) => state.audit.globalSettings ?? DEFAULT_GLOBAL_SETTINGS);
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [website, setWebsite] = useState('');
  const [loadError, setLoadError] = useState<string | null>(null);
  // Lazy initializer reads the ?ref= query param once on mount — no effect needed,
  // which avoids the react-hooks/set-state-in-effect lint warning.
  const [refCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('ref');
  });
  // endregion

  // region pricing config fetch
  useEffect(() => {
    getPricingConfig()
      .then(data => setPricing(data as PricingConfig))
      .catch(() => setLoadError('We could not load the tool catalogue. Refresh and try again.'));
  }, []);
  // endregion

  // region inputs normalization
  useEffect(() => {
    if (!pricing || inputs.length === 0) return;
    const normalizedInputs = inputs.map(input => ({ ...input, tool: normalizeToolId(input.tool), planName: normalizePlanId(input.planName) }));
    const changed = normalizedInputs.some((input, index) => input.tool !== inputs[index].tool || input.planName !== inputs[index].planName);
    if (changed) dispatch(updateInputs(normalizedInputs));
  }, [dispatch, inputs, pricing]);
  // endregion

  // region calculations
  const currentMonthlySpend = useMemo(
    () => inputs.reduce((total, input) => total + (Number(input.monthlySpend) || 0), 0),
    [inputs],
  );
  // endregion

  // region handlers
  const handleAddTool = (tool: string) => {
    if (!pricing) return;
    dispatch(updateInputs([...inputs, createSubscription(tool, globalSettings.teamSize, pricing)]));
  };

  const handleInputChange = (index: number, field: keyof AuditInput, value: string | number) => {
    const nextInputs = inputs.map((input, inputIndex) => inputIndex === index ? { ...input, [field]: value } : input);
    dispatch(updateInputs(nextInputs));
  };

  const handleRemoveTool = (index: number) => dispatch(updateInputs(inputs.filter((_, inputIndex) => inputIndex !== index)));

  const handleSubmit = () => {
    const finalInputs = inputs.map(input => ({ ...input, teamSize: globalSettings.teamSize }));
    onAudit(finalInputs, website);
  };
  // endregion

  if (loadError) return <p role="alert" className="py-10 text-center text-sm text-destructive font-sans">{loadError}</p>;
  if (!pricing) return <p className="py-10 text-center text-sm text-muted-foreground font-sans">Loading your tool catalogue…</p>;

  const availableTools = Object.keys(pricing);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 font-sans">
      {/* referral code perk banner */}
      {refCode && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-center text-xs font-medium text-indigo-700 dark:text-indigo-300 font-sans shadow-sm">
          🎁 You were referred by <strong>{refCode}</strong>! Run your audit to unlock a free 1-on-1 enterprise stack consultation.
        </div>
      )}

      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple-600">AI spend audit</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Build your AI stack in under a minute</h2>
        <p className="text-muted-foreground">Start with your team, then add only the subscriptions you pay for.</p>
      </div>

      <Card className="border-border bg-zinc-50/60 shadow-sm dark:bg-zinc-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. Your team</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block max-w-xs space-y-2">
            <span className="text-sm font-medium">Total team size</span>
            <Input type="number" min="1" value={globalSettings.teamSize} onChange={event => dispatch(updateGlobalSettings({ teamSize: Math.max(1, Number(event.target.value)) }))} />
            <span className="block text-xs text-muted-foreground">This helps us spot plan minimums and unused seats.</span>
          </label>
        </CardContent>
      </Card>

      <section className="space-y-5">
        <p className="text-sm font-semibold text-foreground">2. Your subscriptions</p>
        <ToolPicker availableTools={availableTools} selectedTools={inputs.map(input => input.tool)} onAddTool={handleAddTool} />

        {inputs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-brand-purple-600/10 px-4 py-3">
              <span className="text-sm font-medium text-foreground">Current monthly stack total</span>
              <span className="text-lg font-bold text-brand-purple-600">${currentMonthlySpend.toFixed(2)}</span>
            </div>
            {inputs.map((input, index) => <SubscriptionCard key={`${input.tool}-${index}`} input={input} index={index} pricing={pricing} onChange={handleInputChange} onRemove={handleRemoveTool} />)}
          </div>
        )}
      </section>

      <div className="space-y-3 pt-1 text-center">
        {/* honeypot field for bot protection */}
        <input type="text" name="website" value={website} onChange={event => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0" />
        <button type="button" onClick={handleSubmit} disabled={inputs.length === 0} className="w-full rounded-xl bg-brand-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-brand-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto font-sans">
          Run my free audit
        </button>
        <p className="text-xs text-muted-foreground">No login required. Your work is saved on this device.</p>
      </div>
    </div>
  );
}
// endregion
