"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { apiClient } from '../lib/axios';
import { AuditInput } from '../lib/auditEngine';
import { addAuditSlug } from '../store/slices/auditSlice';

export const useAudit = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const runAudit = async (inputs: AuditInput[]) => {
    setIsAuditing(true);
    setError(null);

    // Map frontend tool names to backend enums
    const toolMap: Record<string, string> = {
      "Cursor": "cursor",
      "GitHub Copilot": "copilot",
      "Claude": "claude",
      "ChatGPT": "chatgpt",
      "Anthropic API": "anthropic_api",
      "OpenAI API": "openai_api",
      "Gemini": "gemini",
      "Windsurf": "v0", 
    };

    const spendInputs = inputs.map(i => ({
      toolId: toolMap[i.tool] || "cursor",
      plan: i.planName,
      monthlySpend: i.monthlySpend,
      seats: i.seats,
      useCase: i.useCase
    }));

    try {
      const response = await apiClient.post('/api/audits', {
        teamSize: inputs[0]?.teamSize || 1,
        primaryUseCase: inputs[0]?.useCase || "mixed",
        spendInputs
      });

      const data = response.data;
      if (data.success) {
        // Save to global redux persisted state
        dispatch(addAuditSlug(data.data.publicSlug));
        
        // Redirect seamlessly
        router.push(`/audit/${data.data.publicSlug}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to run audit');
    } finally {
      setIsAuditing(false);
    }
  };

  return { runAudit, isAuditing, error };
};
