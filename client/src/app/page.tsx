"use client";

import { useState } from "react";
import { SpendInputForm } from "../components/SpendInputForm";
import { AuditResults } from "../components/AuditResults";
import { AuditInput } from "../lib/auditEngine";

export default function Home() {
  const [auditData, setAuditData] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleRunAudit = async (inputs: AuditInput[]) => {
    setIsAuditing(true);
    
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
        setAuditData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
      setTimeout(() => {
        document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      
      {/* Distinct Header / Navbar */}
      <header className="w-full border-b border-border/40 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter text-brand-purple-600 flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-brand-purple-600 flex items-center justify-center text-white text-xs">WB</span>
            WiseBill AI
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#audit-section" className="hover:text-foreground transition">Features</a>
            <a href="#audit-section" className="hover:text-foreground transition">Benchmarks</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="#audit-section" className="text-sm font-medium hover:text-brand-purple-600 transition">Log in</a>
            <button 
              onClick={() => document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition"
            >
              Start Audit
            </button>
          </div>
        </div>
      </header>

      {/* Full Window 2-Column Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center relative bg-app-grid">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full pb-20">
          
          {/* Left Text Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700 z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
              Stop Overpaying for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple-600 to-brand-blue-600">AI Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              Most teams leak thousands a year on idle AI seats and suboptimal plans. Input your stack and get an instant, defensible audit on where you can optimize your spend.
            </p>
            <div className="pt-2 flex gap-4">
              <button 
                onClick={() => document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-8 py-4 rounded-md font-bold text-lg shadow-lg transition"
              >
                Start Free Audit
              </button>
              <button className="px-8 py-4 rounded-md font-bold text-lg border border-border bg-white text-foreground hover:bg-gray-50 shadow-sm transition">
                View Sample
              </button>
            </div>
          </div>

          {/* Right Image Content */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 z-10 hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple-600/20 to-brand-blue-600/20 blur-3xl -z-10 rounded-full"></div>
            <img 
              src="/hero.png" 
              alt="AI Spend Dashboard" 
              className="w-full h-auto rounded-2xl shadow-2xl border border-border"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground text-sm font-medium">
          Scroll to discover
        </div>
      </section>

      {/* Main Audit Section */}
      <section id="audit-section" className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-black/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Build Your AI Stack</h2>
            <p className="text-muted-foreground">Add the tools your team uses below. We'll analyze your spending against current benchmarks.</p>
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl">
            {!auditData ? (
              <div className="relative">
                {isAuditing && (
                  <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur flex items-center justify-center z-10 rounded-xl">
                    <div className="animate-pulse font-bold text-brand-purple-600">Running Audit Engine...</div>
                  </div>
                )}
                <SpendInputForm onAudit={handleRunAudit} />
              </div>
            ) : (
              <div className="space-y-8">
                <button 
                  onClick={() => setAuditData(null)}
                  className="text-brand-purple-600 hover:underline font-medium text-sm flex items-center gap-1"
                >
                  ← Back to Edit Stack
                </button>
                <AuditResults 
                  auditId={auditData._id}
                  publicSlug={auditData.publicSlug}
                  aiSummary={auditData.aiSummary}
                  results={auditData.results} 
                  totalMonthlySavings={auditData.totalMonthlySavings}
                  totalAnnualSavings={auditData.totalAnnualSavings}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-app-grid">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="text-2xl font-bold tracking-tighter text-brand-purple-600">WiseBill AI</div>
            <p className="text-muted-foreground max-w-sm">
              Helping teams restructure their AI stack to capture maximum value at optimal costs. Built for the Techvruk challenge.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-brand-purple-600 transition">Features</a></li>
              <li><a href="#" className="hover:text-brand-purple-600 transition">Pricing</a></li>
              <li><a href="#" className="hover:text-brand-purple-600 transition">Benchmarks</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-brand-purple-600 transition">About Techvruk</a></li>
              <li><a href="#" className="hover:text-brand-purple-600 transition">Consultation</a></li>
              <li><a href="#" className="hover:text-brand-purple-600 transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} WiseBill AI by Murugan. All rights reserved.
        </div>
      </footer>

    </main>
  );
}
