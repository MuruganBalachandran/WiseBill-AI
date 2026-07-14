'use client';

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuditBySlug, createLead } from '../../../services/audit';
import { IAudit, IAuditResult } from '../../../types/audit';

const TOOL_NAMES: Record<string, string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  claude: 'Claude (Anthropic)',
  chatgpt: 'ChatGPT (OpenAI)',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini (Google)',
  v0: 'v0 (Vercel)',
};

const ACTION_BADGES: Record<string, { label: string; style: string }> = {
  keep: { label: 'Optimal Plan', style: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  already_optimal: { label: 'Optimal Plan', style: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  downgrade_plan: { label: 'Downgrade Plan', style: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/20' },
  switch_tool: { label: 'Action Recommended', style: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-500/20' },
  use_credits: { label: 'Use API Credits', style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20' },
};

export default function AuditPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [audit, setAudit] = useState<IAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lead Form State
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    getAuditBySlug(slug)
      .then(data => {
        setAudit(data);
        setError(null);
      })
      .catch(err => {
        console.error('Error fetching audit details:', err);
        setError(err.message || 'Audit not found or server is unreachable.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audit || !email) return;

    setSubmittingLead(true);
    setLeadError(null);
    try {
      await createLead({
        auditId: audit._id || '',
        email,
        companyName: companyName || undefined,
        role: role || undefined,
        teamSize: audit.teamSize,
      });
      setLeadSuccess(true);
      setEmail('');
      setCompanyName('');
      setRole('');
    } catch (err) {
      console.error(err);
      setLeadError((err as Error).message || 'Failed to submit request.');
    } finally {
      setSubmittingLead(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600/30 border-t-indigo-600 animate-spin"></div>
        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-4 animate-pulse">
          Loading SaaS spend audit results...
        </p>
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Audit Not Found</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
          {error || 'The audit results slug you requested does not exist or has expired.'}
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition duration-200"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const { totalMonthlySavings, totalAnnualSavings, results, spendInputs } = audit;
  const isHighSavings = totalMonthlySavings >= 500;
  const isOptimalStack = totalMonthlySavings < 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-150 pb-24">
      {/* Header navbar */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/70 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              W
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              WiseBill <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI</span>
            </span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-xs px-3.5 py-2 font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-200 transition duration-150"
          >
            ← Audit Another Stack
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <main className="max-w-6xl mx-auto px-6 mt-12 space-y-8">
        
        {/* HERO: Monthly & Annual savings banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-600/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 bg-indigo-500/20 px-3 py-1 rounded-full">
                Monthly Optimization Savings
              </span>
              <div className="text-5xl font-black tracking-tight mt-4 font-mono">
                ${totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-sm text-indigo-100/80 mt-6 leading-relaxed">
              Consolidating licensing plans, clearing redundant subscriptions, and aligning API contracts saves your team this amount monthly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-zinc-900 dark:bg-zinc-900/50 border border-zinc-800 text-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                Annual Projected Savings
              </span>
              <div className="text-5xl font-black tracking-tight mt-4 font-mono text-emerald-400">
                ${totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-sm text-zinc-400 mt-6 leading-relaxed">
              By implementing the migration paths outlined below, your team will reduce its annualized SaaS expenditure by this projection.
            </p>
          </div>
        </div>

        {/* THRESHOLD CUSTOM CTA */}
        {isHighSavings ? (
          /* HIGH SAVINGS CTA: Prominently surface Techvruk */
          <div className="p-8 rounded-3xl border border-indigo-500/30 bg-indigo-500/[0.03] dark:bg-indigo-950/10 shadow-lg flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full">
                ⚡ Techvruk Enterprise Savings
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                Capture More Savings with Techvruk
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Your monthly savings are substantial! Techvruk can help you consolidate your entire SaaS stack, negotiate direct enterprise deals with Cursor, Anthropic, or OpenAI, and lock in an extra **20% to 30%** custom volume discount on your behalf.
              </p>
            </div>

            <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              {leadSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">Request Submitted!</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Our Enterprise team will contact you shortly to review your stack.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Contact Techvruk Team</h4>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="work@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Your Role"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition duration-150 shadow shadow-indigo-600/20"
                  >
                    {submittingLead ? 'Submitting request...' : 'Connect with Techvruk'}
                  </button>
                  {leadError && <p className="text-[10px] text-red-500 font-semibold text-center mt-1">{leadError}</p>}
                </form>
              )}
            </div>
          </div>
        ) : isOptimalStack ? (
          /* OPTIMAL STACK / LOW SAVINGS: Be Honest. "You're spending well" + Alert Lead Capture */
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-full">
                🛡️ Honest Audit
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                You’re Spending Well!
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Excellent management! Our optimization engine analyzed your stack and confirmed your subscription levels align cleanly with your team size and use cases. We don't manufacture fake savings. You're already running an optimized stack.
              </p>
            </div>

            <div className="w-full lg:w-96 flex-shrink-0 bg-zinc-100/50 dark:bg-zinc-900/30 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50">
              {leadSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">Subscribed Successfully!</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">We'll alert you if rates change or new features apply to your stack.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Stay Optimized</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Receive alerts if tool prices drift or new optimization strategies apply to your stack.</p>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="work@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-white focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 text-xs font-bold rounded-xl transition duration-150"
                  >
                    {submittingLead ? 'Subscribing...' : 'Notify Me of Optimizations'}
                  </button>
                  {leadError && <p className="text-[10px] text-red-500 font-semibold text-center mt-1">{leadError}</p>}
                </form>
              )}
            </div>
          </div>
        ) : (
          /* MEDIUM SAVINGS CTA: $100 - $499/mo standard consultation download lead capture */
          <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/40 flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full">
                📈 High-Potential Savings
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                Implement Savings Safely
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                We've mapped out **${totalMonthlySavings}/month** in real savings. Enter your email below to download the full detailed PDF migration checklist and request assistance migrating plans without interrupting your team's workflow.
              </p>
            </div>

            <div className="w-full lg:w-96 flex-shrink-0 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              {leadSuccess ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold">✓</div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">PDF requested!</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Check your inbox for the custom migration checklist shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Download Custom Audit PDF</h4>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="work@company.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingLead}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition duration-150"
                  >
                    {submittingLead ? 'Generating PDF...' : 'Download PDF & Request Assistance'}
                  </button>
                  {leadError && <p className="text-[10px] text-red-500 font-semibold text-center mt-1">{leadError}</p>}
                </form>
              )}
            </div>
          </div>
        )}

        {/* PER-TOOL BREAKDOWN DETAILS */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-sm font-bold">📋</span>
            Tool-by-Tool Optimization Breakdown
          </h2>

          <div className="space-y-4">
            {spendInputs.map(input => {
              // Find matching audit result for this tool
              // Note that in backend, some toolIds might have mapped (e.g. chatgpt api_direct maps to openai_api). 
              // We match based on the input index, or if the backend matches the list in order (which it does, results are pushed in order of spendInputs loop).
              const inputIndex = spendInputs.indexOf(input);
              const result: IAuditResult | undefined = results[inputIndex];

              if (!result) return null;

              const isSaving = result.monthlySavings > 0;
              const badge = ACTION_BADGES[result.recommendedAction] || ACTION_BADGES.keep;

              return (
                <div
                  key={inputIndex}
                  className="p-6 rounded-3xl border border-zinc-200/80 bg-white/70 dark:border-zinc-850 dark:bg-zinc-950/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-300 dark:hover:border-zinc-800 transition duration-150"
                >
                  <div className="space-y-2.5 max-w-xl">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">
                        {TOOL_NAMES[input.toolId] || input.toolId}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {result.reasonText}
                    </p>
                  </div>

                  {/* Transition Flow and Savings */}
                  <div className="flex items-center justify-between md:justify-end gap-8 border-t border-zinc-100 dark:border-zinc-900 pt-4 md:pt-0 md:border-t-0">
                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 dark:text-zinc-600">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Current</p>
                        <p className="text-zinc-900 dark:text-zinc-300 font-mono mt-0.5">${input.monthlySpend}/mo</p>
                        <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500">({input.seats} seats, {input.plan})</p>
                      </div>

                      <svg className="w-4 h-4 text-zinc-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>

                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Recommended</p>
                        <p className="text-zinc-900 dark:text-zinc-300 font-mono mt-0.5">
                          ${(input.monthlySpend - result.monthlySavings).toFixed(2)}/mo
                        </p>
                        <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500">
                          ({result.recommendedAction === 'switch_tool' || result.recommendedAction === 'already_optimal' || result.recommendedAction === 'keep' ? input.seats : input.seats} seats, {result.recommendedPlan})
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400 dark:text-zinc-500">Monthly Savings</p>
                      <p className={`text-xl font-black font-mono mt-0.5 ${isSaving ? 'text-emerald-500' : 'text-zinc-400'}`}>
                        {isSaving ? `+$${result.monthlySavings.toFixed(2)}` : '$0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
