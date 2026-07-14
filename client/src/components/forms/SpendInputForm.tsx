'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createAudit } from '../../services/audit';
import { ISpendInput, IAuditCreateRequest } from '../../types/audit';

type UseCaseType = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

interface ToolPlanConfig {
  id: string;
  name: string;
  costPerSeat: number;
  minSeats?: number;
  isCustom?: boolean;
  isApi?: boolean;
  mappedToolId?: 'cursor' | 'copilot' | 'claude' | 'chatgpt' | 'anthropic_api' | 'openai_api' | 'gemini' | 'v0';
  mappedPlan?: string;
}

interface ToolConfig {
  id: 'cursor' | 'copilot' | 'claude' | 'chatgpt' | 'anthropic_api' | 'openai_api' | 'gemini' | 'v0';
  name: string;
  description: string;
  color: string;
  plans: ToolPlanConfig[];
  defaultPlan: string;
}

const TOOLS: ToolConfig[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor fork of VS Code',
    color: 'from-sky-500/20 to-blue-600/20 border-sky-500/30 text-sky-400',
    defaultPlan: 'pro',
    plans: [
      { id: 'free', name: 'Hobby', costPerSeat: 0 },
      { id: 'pro', name: 'Pro', costPerSeat: 20 },
      { id: 'business', name: 'Business (Teams Standard)', costPerSeat: 40 },
      { id: 'enterprise', name: 'Enterprise', costPerSeat: 100, isCustom: true },
    ],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer autocomplete extension',
    color: 'from-violet-500/20 to-purple-600/20 border-violet-500/30 text-violet-400',
    defaultPlan: 'individual',
    plans: [
      { id: 'individual', name: 'Individual', costPerSeat: 10 },
      { id: 'business', name: 'Business', costPerSeat: 19 },
      { id: 'enterprise', name: 'Enterprise', costPerSeat: 60 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    description: 'State of the art chat with Artifacts',
    color: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-400',
    defaultPlan: 'pro',
    plans: [
      { id: 'free', name: 'Free', costPerSeat: 0 },
      { id: 'pro', name: 'Pro', costPerSeat: 20 },
      { id: 'max', name: 'Max', costPerSeat: 100 },
      { id: 'team', name: 'Team (5-seat min)', costPerSeat: 25, minSeats: 5 },
      { id: 'premium', name: 'Team Premium (5-seat min)', costPerSeat: 125, minSeats: 5 },
      { id: 'enterprise', name: 'Enterprise', costPerSeat: 20, isCustom: true },
      { id: 'api_direct', name: 'API Direct', costPerSeat: 0, isApi: true, mappedToolId: 'anthropic_api', mappedPlan: 'pay_as_you_go' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    description: 'Industry standard general purpose conversational LLM',
    color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-400',
    defaultPlan: 'plus',
    plans: [
      { id: 'free', name: 'Free', costPerSeat: 0 },
      { id: 'plus', name: 'Plus', costPerSeat: 20 },
      { id: 'team', name: 'Team (2-seat min)', costPerSeat: 25, minSeats: 2 },
      { id: 'business', name: 'Business (2-seat min)', costPerSeat: 25, minSeats: 2 },
      { id: 'enterprise', name: 'Enterprise', costPerSeat: 60, isCustom: true },
      { id: 'api_direct', name: 'API Direct', costPerSeat: 0, isApi: true, mappedToolId: 'openai_api', mappedPlan: 'pay_as_you_go' },
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    description: 'Pay-as-you-go developer API tokens',
    color: 'from-rose-500/20 to-red-600/20 border-rose-500/30 text-rose-400',
    defaultPlan: 'pay_as_you_go',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go API', costPerSeat: 0, isApi: true },
    ],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    description: 'Pay-as-you-go developer API tokens',
    color: 'from-cyan-500/20 to-teal-600/20 border-cyan-500/30 text-cyan-400',
    defaultPlan: 'pay_as_you_go',
    plans: [
      { id: 'pay_as_you_go', name: 'Pay as you go API', costPerSeat: 0, isApi: true },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    description: 'Workspace-integrated AI and developer API',
    color: 'from-indigo-500/20 to-purple-600/20 border-indigo-500/30 text-indigo-400',
    defaultPlan: 'pro',
    plans: [
      { id: 'pro', name: 'Pro', costPerSeat: 19.99 },
      { id: 'ultra', name: 'Ultra', costPerSeat: 99.99 },
      { id: 'api', name: 'API Direct (Pay as you go)', costPerSeat: 0, isApi: true },
    ],
  },
  {
    id: 'v0',
    name: 'v0 (Vercel)',
    description: 'Generative UI development platform',
    color: 'from-zinc-500/20 to-gray-600/20 border-zinc-500/30 text-zinc-400',
    defaultPlan: 'free',
    plans: [
      { id: 'free', name: 'Free', costPerSeat: 0 },
      { id: 'premium', name: 'Premium', costPerSeat: 20 },
      { id: 'team', name: 'Team', costPerSeat: 30 },
      { id: 'business', name: 'Business', costPerSeat: 100 },
      { id: 'enterprise', name: 'Enterprise', costPerSeat: 0, isCustom: true },
    ],
  },
];

interface ToolState {
  active: boolean;
  plan: string;
  seats: number;
  monthlySpend: number;
  useCase: UseCaseType;
  isManualSpend: boolean;
}

const DEFAULT_TOOL_STATE: Record<string, ToolState> = {
  cursor: { active: false, plan: 'pro', seats: 1, monthlySpend: 20, useCase: 'coding', isManualSpend: false },
  copilot: { active: false, plan: 'individual', seats: 1, monthlySpend: 10, useCase: 'coding', isManualSpend: false },
  claude: { active: false, plan: 'pro', seats: 1, monthlySpend: 20, useCase: 'mixed', isManualSpend: false },
  chatgpt: { active: false, plan: 'plus', seats: 1, monthlySpend: 20, useCase: 'mixed', isManualSpend: false },
  anthropic_api: { active: false, plan: 'pay_as_you_go', seats: 1, monthlySpend: 50, useCase: 'mixed', isManualSpend: true },
  openai_api: { active: false, plan: 'pay_as_you_go', seats: 1, monthlySpend: 50, useCase: 'mixed', isManualSpend: true },
  gemini: { active: false, plan: 'pro', seats: 1, monthlySpend: 19.99, useCase: 'mixed', isManualSpend: false },
  v0: { active: false, plan: 'free', seats: 1, monthlySpend: 0, useCase: 'coding', isManualSpend: false },
};

export default function SpendInputForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<UseCaseType>('mixed');
  const [toolsState, setToolsState] = useState<Record<string, ToolState>>(DEFAULT_TOOL_STATE);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize and load state from LocalStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wisebill_audit_form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase);
        if (parsed.toolsState) {
          // Merge defaults with saved to handle any structural updates
          setToolsState({
            ...DEFAULT_TOOL_STATE,
            ...parsed.toolsState,
          });
        }
      } catch (e) {
        console.error('Error loading persisted form state:', e);
      }
    }
  }, []);

  // Persist state to LocalStorage on change
  useEffect(() => {
    if (!mounted) return;
    const stateToSave = {
      teamSize,
      primaryUseCase,
      toolsState,
    };
    localStorage.setItem('wisebill_audit_form', JSON.stringify(stateToSave));
  }, [teamSize, primaryUseCase, toolsState, mounted]);

  // Recalculate spend for a tool when plan or seats change
  const calculateSpend = (toolId: string, planId: string, seats: number): number => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return 0;
    const plan = tool.plans.find(p => p.id === planId);
    if (!plan) return 0;

    if (plan.isCustom || plan.isApi) {
      // API / Custom plans keep current monthly spend as default or manual override
      return toolsState[toolId]?.monthlySpend ?? 0;
    }

    const minSeats = plan.minSeats || 1;
    const billableSeats = Math.max(seats, minSeats);
    return Math.round((billableSeats * plan.costPerSeat) * 100) / 100;
  };

  const handleToolToggle = (toolId: string) => {
    setToolsState(prev => {
      const tool = prev[toolId];
      const active = !tool.active;
      
      // If turning active, ensure it defaults to team size seats and default plan
      const defaultPlanId = TOOLS.find(t => t.id === toolId)?.defaultPlan || 'free';
      const defaultSeats = teamSize > 0 ? teamSize : 1;
      const initialSpend = calculateSpend(toolId, defaultPlanId, defaultSeats);

      return {
        ...prev,
        [toolId]: {
          ...tool,
          active,
          seats: defaultSeats,
          plan: defaultPlanId,
          monthlySpend: initialSpend,
          isManualSpend: toolId.endsWith('_api') || defaultPlanId === 'api_direct' || defaultPlanId === 'api',
        },
      };
    });
  };

  const handlePlanChange = (toolId: string, planId: string) => {
    setToolsState(prev => {
      const tool = prev[toolId];
      const planConfig = TOOLS.find(t => t.id === toolId)?.plans.find(p => p.id === planId);
      
      const isManual = !!(planConfig?.isCustom || planConfig?.isApi || toolId.endsWith('_api'));
      const newSpend = isManual ? tool.monthlySpend : calculateSpend(toolId, planId, tool.seats);
      
      return {
        ...prev,
        [toolId]: {
          ...tool,
          plan: planId,
          monthlySpend: newSpend,
          isManualSpend: isManual,
        },
      };
    });
  };

  const handleSeatsChange = (toolId: string, seats: number) => {
    const validSeats = Math.max(1, seats);
    setToolsState(prev => {
      const tool = prev[toolId];
      const newSpend = tool.isManualSpend 
        ? tool.monthlySpend 
        : calculateSpend(toolId, tool.plan, validSeats);

      return {
        ...prev,
        [toolId]: {
          ...tool,
          seats: validSeats,
          monthlySpend: newSpend,
        },
      };
    });
  };

  const handleSpendChange = (toolId: string, spend: number) => {
    const validSpend = Math.max(0, spend);
    setToolsState(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        monthlySpend: validSpend,
        isManualSpend: true,
      },
    }));
  };

  const handleUseCaseChange = (toolId: string, useCase: UseCaseType) => {
    setToolsState(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        useCase,
      },
    }));
  };

  // Sync seats count on active tools when Team Size changes (only if it wasn't customized yet)
  const handleTeamSizeChange = (size: number) => {
    const validSize = Math.max(1, size);
    setTeamSize(validSize);
    setToolsState(prev => {
      const nextState = { ...prev };
      Object.keys(nextState).forEach(toolId => {
        const tool = nextState[toolId];
        // If the tool is active and currently has the old team size as its seat count, auto-update it
        if (tool.active && tool.seats === teamSize) {
          tool.seats = validSize;
          if (!tool.isManualSpend) {
            tool.monthlySpend = calculateSpend(toolId, tool.plan, validSize);
          }
        }
      });
      return nextState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate
      if (teamSize < 1) {
        throw new Error('Team size must be at least 1.');
      }

      const activeToolsList = Object.entries(toolsState)
        .filter(([_, t]) => t.active)
        .map(([toolId, state]) => {
          if (state.seats < 1) {
            throw new Error(`Active tool ${toolId} must have at least 1 seat.`);
          }

          // Map dynamic UI values to final backend structures if necessary
          const toolConfig = TOOLS.find(t => t.id === toolId);
          const planConfig = toolConfig?.plans.find(p => p.id === state.plan);
          
          const finalToolId = planConfig?.mappedToolId || (toolId as any);
          const finalPlan = planConfig?.mappedPlan || state.plan;

          return {
            toolId: finalToolId,
            plan: finalPlan,
            monthlySpend: state.monthlySpend,
            seats: state.seats,
            useCase: state.useCase,
          };
        });

      if (activeToolsList.length === 0) {
        throw new Error('Please select at least one active tool in your stack.');
      }

      const payload: IAuditCreateRequest = {
        teamSize,
        primaryUseCase,
        spendInputs: activeToolsList,
      };

      const result = await createAudit(payload);
      
      // Clear localStorage on successful audit to avoid sticking stale data
      localStorage.removeItem('wisebill_audit_form');
      
      router.push(`/audit/${result.publicSlug}`);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  const activeCount = Object.values(toolsState).filter(t => t.active).length;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-12">
      {/* Step 1: Workspace Context */}
      <div className="p-8 rounded-3xl border border-zinc-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70 shadow-xl shadow-zinc-200/20 dark:shadow-none">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-sm font-bold">1</span>
          Workspace context
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Total Team Size
            </label>
            <div className="relative">
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                min="1"
                required
                value={teamSize}
                onChange={e => handleTeamSizeChange(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white/50 text-zinc-950 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 transition duration-150"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 text-sm font-medium">seats</span>
            </div>
          </div>

          <div>
            <label htmlFor="primaryUseCase" className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Primary Use Case
            </label>
            <select
              id="primaryUseCase"
              name="primaryUseCase"
              value={primaryUseCase}
              onChange={e => setPrimaryUseCase(e.target.value as UseCaseType)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white/50 text-zinc-950 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-50 transition duration-150"
            >
              <option value="coding">Coding (Software Dev, Scripting)</option>
              <option value="writing">Writing (Copywriting, PR, Emails)</option>
              <option value="data">Data Analysis (SQL, Excel, Python)</option>
              <option value="research">Research & Strategy (Synthesis, Search)</option>
              <option value="mixed">Mixed/General Usecase</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Tool Stack Selection */}
      <div className="space-y-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-3 text-zinc-900 dark:text-zinc-50">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-sm font-bold">2</span>
              AI Tool Stack Selection
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Select all active tools currently used across your company/team.
            </p>
          </div>
          <span className="text-sm text-zinc-400 dark:text-zinc-600 font-medium">
            {activeCount} selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map(tool => {
            const state = toolsState[tool.id];
            const isActive = state?.active;

            return (
              <div
                key={tool.id}
                className={`relative rounded-3xl border p-6 transition-all duration-300 ${
                  isActive
                    ? 'border-indigo-500/40 bg-indigo-500/[0.02] shadow-lg shadow-indigo-500/[0.02] dark:border-indigo-500/30'
                    : 'border-zinc-200 bg-white/40 dark:border-zinc-800/80 dark:bg-zinc-950/20 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 max-w-[280px]">
                      {tool.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToolToggle(tool.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Tool
                      </>
                    )}
                  </button>
                </div>

                {/* Expanded Fields */}
                <div
                  className={`mt-6 space-y-4 overflow-hidden transition-all duration-300 ${
                    isActive ? 'max-h-[350px] opacity-100 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-5' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`plan-${tool.id}`} className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Subscription Plan
                      </label>
                      <select
                        id={`plan-${tool.id}`}
                        value={state?.plan}
                        onChange={e => handlePlanChange(tool.id, e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition duration-150"
                      >
                        {tool.plans.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor={`seats-${tool.id}`} className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Number of Seats
                      </label>
                      <input
                        id={`seats-${tool.id}`}
                        type="number"
                        min="1"
                        value={state?.seats}
                        onChange={e => handleSeatsChange(tool.id, parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition duration-150"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`spend-${tool.id}`} className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Monthly Spend ($)
                      </label>
                      <div className="relative">
                        <input
                          id={`spend-${tool.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={state?.monthlySpend}
                          onChange={e => handleSpendChange(tool.id, parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition duration-150 font-mono"
                        />
                        {state?.isManualSpend && (
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`useCase-${tool.id}`} className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Tool Primary Usecase
                      </label>
                      <select
                        id={`useCase-${tool.id}`}
                        value={state?.useCase}
                        onChange={e => handleUseCaseChange(tool.id, e.target.value as UseCaseType)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition duration-150"
                      >
                        <option value="coding">Coding</option>
                        <option value="writing">Writing</option>
                        <option value="data">Data Analysis</option>
                        <option value="research">Research</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-sm font-semibold flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition duration-200 shadow-lg shadow-indigo-600/10 focus:outline-none flex justify-center items-center gap-3 ${
          loading ? 'opacity-80 cursor-not-allowed' : 'active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            Analyzing stack spend...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Run SaaS Spend Audit
          </>
        )}
      </button>
    </form>
  );
}
