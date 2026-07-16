"use client";

import { useState } from "react";
import { SpendInputForm } from "@/components/SpendInputForm";
import { AuditInput } from "@/lib/auditEngine";

export default function WidgetPage() {
  const [isAuditing, setIsAuditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [slug, setSlug] = useState("");

  const handleRunAudit = async (inputs: AuditInput[]) => {
    setIsAuditing(true);
    
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
      const res = await fetch("http://localhost:5000/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamSize: inputs[0]?.teamSize || 1,
          primaryUseCase: inputs[0]?.useCase || "mixed",
          spendInputs
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSlug(json.data.publicSlug);
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-transparent p-4 flex items-center justify-center font-sans">
        <div className="bg-white border border-border shadow-lg rounded-xl p-8 text-center space-y-4 max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto text-green-600 text-xl">
            ✓
          </div>
          <h3 className="text-xl font-bold">Audit Complete!</h3>
          <p className="text-muted-foreground text-sm">
            We've analyzed your stack. Click below to view your personalized savings report.
          </p>
          <a 
            href={`http://localhost:3000/audit/${slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-4 py-3 rounded-md font-semibold transition"
          >
            View Full Report
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-2 sm:p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-border p-4 shadow-sm relative">
        {isAuditing && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur flex items-center justify-center z-10 rounded-xl">
            <div className="animate-pulse font-bold text-brand-purple-600">Analyzing Stack...</div>
          </div>
        )}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-tight mb-1 text-brand-purple-600">AI Spend Auditor</h2>
          <p className="text-xs text-muted-foreground">Powered by WiseBill AI</p>
        </div>
        <SpendInputForm onAudit={handleRunAudit} />
      </div>
    </div>
  );
}
