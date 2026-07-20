// region imports
"use client";

import { useState } from "react";
import { SpendInputForm } from "@/components/SpendInputForm";
import { AuditInput, ISpendInput } from "@/types/audit";
import { createAudit } from "@/services/audit";
// endregion

// region tool mapping
const TOOL_MAP: Record<string, string> = {
  "cursor": "cursor",
  "copilot": "copilot",
  "claude": "claude",
  "chatgpt": "chatgpt",
  "anthropic_api": "anthropic_api",
  "openai_api": "openai_api",
  "gemini": "gemini",
  "v0": "v0",
  "Cursor": "cursor",
  "GitHub Copilot": "copilot",
  "Claude": "claude",
  "ChatGPT": "chatgpt",
  "Anthropic API": "anthropic_api",
  "OpenAI API": "openai_api",
  "Gemini": "gemini",
  "v0 (Vercel)": "v0",
};
// endregion

// region widget page component
export default function WidgetPage() {
  // region state
  const [isAuditing, setIsAuditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState("");
  // endregion

  // region handlers
  const handleRunAudit = async (inputs: AuditInput[]) => {
    setIsAuditing(true);

    const spendInputs = inputs.map(i => ({
      // Cast through the union type — TOOL_MAP guarantees valid values at runtime
      toolId: (TOOL_MAP[i.tool] || "cursor") as ISpendInput["toolId"],
      plan: i.planName,
      monthlySpend: i.monthlySpend,
      seats: i.seats,
      useCase: i.useCase
    }));

    try {
      const auditData = await createAudit({
        teamSize: inputs[0]?.teamSize || 1,
        primaryUseCase: inputs[0]?.useCase || "mixed",
        spendInputs
      });

      setSlug(auditData.publicSlug);
      setSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };
  // endregion

  // region success view
  if (success) {
    return (
      <div className="min-h-screen bg-transparent p-4 flex items-center justify-center font-sans">
        <div className="bg-white border border-border shadow-lg rounded-xl p-8 text-center space-y-4 max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-600 text-xl font-bold">
            ✓
          </div>
          <h3 className="text-xl font-bold">Audit Complete!</h3>
          <p className="text-muted-foreground text-sm font-sans">
            We&apos;ve analyzed your stack. Click below to view your personalized savings report.
          </p>
          <a 
            href={`${process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')}/audit/${slug}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-4 py-3 rounded-md font-semibold transition font-sans"
          >
            View Full Report
          </a>
        </div>
      </div>
    );
  }
  // endregion

  // region widget form view
  return (
    <div className="min-h-screen bg-transparent p-2 sm:p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-4 shadow-sm relative font-sans">
        {isAuditing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur flex items-center justify-center z-10 rounded-xl">
            <div className="animate-pulse font-bold text-brand-purple-600">Analyzing Stack...</div>
          </div>
        )}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-1 text-brand-purple-600">AI Spend Auditor</h2>
          <p className="text-xs text-muted-foreground font-sans">Powered by WiseBill AI</p>
        </div>
        <SpendInputForm onAudit={handleRunAudit} />
      </div>
    </div>
  );
  // endregion
}
// endregion
