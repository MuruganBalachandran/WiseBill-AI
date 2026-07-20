'use client';

import { TOOL_CATALOG, formatPlanName } from '@/constants/toolCatalog';
import { AuditInput } from '@/types/audit';
import { PricingConfig } from '@/types/pricing';
import { Input } from '@/components/ui/input';

type SubscriptionCardProps = {
  input: AuditInput;
  index: number;
  pricing: PricingConfig;
  onChange: (index: number, field: keyof AuditInput, value: string | number) => void;
  onRemove: (index: number) => void;
};

const USE_CASES = [
  ['coding', 'Coding'], ['writing', 'Writing'], ['data', 'Data'], ['research', 'Research'], ['mixed', 'Mixed'],
] as const;

// A single compact card contains every required subscription detail in a predictable order.
export function SubscriptionCard({ input, index, pricing, onChange, onRemove }: SubscriptionCardProps) {
  const metadata = TOOL_CATALOG[input.tool] ?? { label: input.tool, emoji: '✨' };
  const plans = pricing[input.tool]?.plans ?? {};

  const handlePlanChange = (planName: string) => {
    onChange(index, 'planName', planName);
    const listPrice = plans[planName]?.costPerSeat;
    if (typeof listPrice === 'number' && listPrice > 0) onChange(index, 'monthlySpend', listPrice * input.seats);
  };

  return (
    <article className="rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-600/10 text-xl">{metadata.emoji}</span>
          <div>
            <h3 className="font-semibold text-foreground">{metadata.label}</h3>
            <p className="text-xs text-muted-foreground">Subscription {index + 1}</p>
          </div>
        </div>
        <button type="button" onClick={() => onRemove(index)} className="text-sm font-medium text-muted-foreground transition hover:text-destructive">Remove</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Plan</span>
          <select value={input.planName} onChange={event => handlePlanChange(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {Object.keys(plans).map(planName => <option key={planName} value={planName}>{formatPlanName(planName)}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Monthly spend (USD)</span>
          <Input type="number" min="0" value={input.monthlySpend} onChange={event => onChange(index, 'monthlySpend', Number(event.target.value))} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Seats</span>
          <Input type="number" min="1" value={input.seats} onChange={event => onChange(index, 'seats', Number(event.target.value))} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Primary use</span>
          <select value={input.useCase} onChange={event => onChange(index, 'useCase', event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            {USE_CASES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
    </article>
  );
}
