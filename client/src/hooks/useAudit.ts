// region imports
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { apiClient } from '../lib/axios';
import { AuditInput } from '../types/audit';
import { addAuditSlug } from '../store/slices/auditSlice';
// endregion

// region types

// Minimal shape of an Axios-style error used for error message extraction
interface AxiosLikeError {
  response?: { data?: { message?: string } };
  message?: string;
}
// endregion

// region hook
export const useAudit = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Map frontend display names / IDs to the backend tool enum values
  const toolMap: Record<string, string> = {
    cursor: 'cursor',
    copilot: 'copilot',
    claude: 'claude',
    chatgpt: 'chatgpt',
    anthropic_api: 'anthropic_api',
    openai_api: 'openai_api',
    gemini: 'gemini',
    v0: 'v0',
    Cursor: 'cursor',
    'GitHub Copilot': 'copilot',
    Claude: 'claude',
    ChatGPT: 'chatgpt',
    'Anthropic API': 'anthropic_api',
    'OpenAI API': 'openai_api',
    Gemini: 'gemini',
    Windsurf: 'v0',
  };

  const runAudit = async (inputs: AuditInput[], honeypot: string = '') => {
    setIsAuditing(true);
    setError(null);

    const spendInputs = inputs.map(i => ({
      toolId: toolMap[i.tool] ?? 'cursor',
      plan: i.planName,
      monthlySpend: i.monthlySpend,
      seats: i.seats,
      useCase: i.useCase,
    }));

    try {
      const response = await apiClient.post('/api/audits', {
        teamSize: inputs[0]?.teamSize ?? 1,
        primaryUseCase: inputs[0]?.useCase ?? 'mixed',
        spendInputs,
        website: honeypot,
      });

      const data = response.data;
      if (data.success) {
        // Persist slug in Redux for history tracking
        dispatch(addAuditSlug(data.data.publicSlug));
        // Navigate to the audit results page
        router.push(`/audit/${data.data.publicSlug}`);
      }
    } catch (err: unknown) {
      // Narrow the unknown error to extract a readable message
      const e = err as AxiosLikeError;
      setError(e.response?.data?.message ?? e.message ?? 'Failed to run audit');
    } finally {
      setIsAuditing(false);
    }
  };

  return { runAudit, isAuditing, error };
};
// endregion
