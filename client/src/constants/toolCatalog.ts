import { AuditInput } from '@/types/audit';
import { PricingConfig } from '@/types/pricing';

// Central display metadata lets the UI change without leaking presentation details into audit logic.
export const TOOL_CATALOG: Record<string, { label: string; emoji: string; description: string }> = {
  cursor: { label: 'Cursor', emoji: '⌨️', description: 'AI-native coding' },
  copilot: { label: 'GitHub Copilot', emoji: '🐙', description: 'Code assistance' },
  claude: { label: 'Claude', emoji: '✦', description: 'Writing and reasoning' },
  chatgpt: { label: 'ChatGPT', emoji: '◉', description: 'General AI workspace' },
  anthropic_api: { label: 'Anthropic API', emoji: '⚗️', description: 'Usage-based API' },
  openai_api: { label: 'OpenAI API', emoji: '🔌', description: 'Usage-based API' },
  gemini: { label: 'Gemini', emoji: '✧', description: 'Google AI' },
  v0: { label: 'v0', emoji: '▲', description: 'UI generation' },
};

// Legacy display values are normalized once so previously persisted local form state remains usable.
const LEGACY_TOOL_IDS: Record<string, string> = {
  Cursor: 'cursor', 'GitHub Copilot': 'copilot', Claude: 'claude', ChatGPT: 'chatgpt',
  'Anthropic API': 'anthropic_api', 'OpenAI API': 'openai_api', Gemini: 'gemini', Windsurf: 'v0',
};

export const normalizeToolId = (tool: string): string => LEGACY_TOOL_IDS[tool] ?? tool;
export const normalizePlanId = (plan: string): string => plan.trim().toLowerCase().replace(/\s+/g, '_');

// A new row starts with the first valid plan and its published list price when one exists.
export const createSubscription = (tool: string, teamSize: number, pricing: PricingConfig): AuditInput => {
  const plans = pricing[tool]?.plans ?? {};
  const [planName = 'pay_as_you_go', plan] = Object.entries(plans)[0] ?? [];

  return {
    tool,
    planName,
    monthlySpend: plan?.costPerSeat ?? 0,
    seats: 1,
    teamSize,
    useCase: 'mixed',
  };
};

// Human-readable plan names retain API-safe identifiers in state.
export const formatPlanName = (plan: string): string => plan.replace(/_/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
