// region imports
"use client";

import { SpendInputForm } from "../components/SpendInputForm";
import { AuditInput } from "../types/audit";
import { useAudit } from "../hooks/useAudit";
// endregion

// region page component
export default function Home() {
  // region hooks & handlers
  const { runAudit, isAuditing, error } = useAudit();

  const handleRunAudit = async (inputs: AuditInput[], honeypot: string = "") => {
    await runAudit(inputs, honeypot);
  };
  // endregion

  return (
    <main className="min-h-screen bg-background">
      
      {/* Centered Typography Hero Section */}
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
            </div>
          </div>

          {/* Right Logo Content - Stylized Hero Logo matching Header */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 z-10 hidden md:flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple-600/20 to-brand-blue-600/20 blur-3xl -z-10 rounded-full w-3/4 h-3/4"></div>
            <div className="relative flex flex-col items-center justify-center p-12 rounded-3xl bg-white/60 dark:bg-black/40 border border-zinc-200/80 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl space-y-4 hover:scale-105 transition-transform duration-500">
              <div className="w-20 h-20 rounded-2xl bg-brand-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-brand-purple-600/30">
                WB
              </div>
              <span className="text-4xl font-extrabold tracking-tighter text-brand-purple-600">
                WiseBill AI
              </span>
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase bg-brand-purple-600/10 px-3 py-1 rounded-full">
                SaaS AI Spend Auditor
              </span>
            </div>
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
            <p className="text-muted-foreground">Add the tools your team uses below. We&apos;ll analyze your spending against current benchmarks.</p>
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8 shadow-xl">
            <div className="relative">
              {isAuditing && (
                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur flex flex-col items-center justify-center z-10 rounded-xl">
                  <div className="w-12 h-12 rounded-full border-4 border-brand-purple-600/30 border-t-brand-purple-600 animate-spin mb-4"></div>
                  <div className="animate-pulse font-bold text-brand-purple-600">Running Audit Engine...</div>
                </div>
              )}
              {error && (
                <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-xs font-bold p-2 text-center rounded-t-xl z-20">
                  {error}
                </div>
              )}
              <SpendInputForm onAudit={handleRunAudit} />
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
