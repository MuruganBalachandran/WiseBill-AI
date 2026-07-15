import React from 'react';
import SpendInputForm from '../components/forms/SpendInputForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-150">
      {/* Navbar / Header Logo */}
      <header className="border-b border-zinc-200 bg-white/70 backdrop-blur-md dark:border-zinc-900 dark:bg-zinc-950/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              W
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              WiseBill <span className="text-indigo-600 dark:text-indigo-400 font-medium">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2.5 py-1 font-semibold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              SaaS Auditor v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Headline and Form */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Optimize your team&apos;s <br />
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                  AI subscription spend
                </span>
              </h1>
              <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl">
                Audit your company&apos;s usage of Cursor, Copilot, ChatGPT, Claude, and developer APIs to eliminate overlaps, recover wasted seats, and discover cheaper plan structures.
              </p>
            </div>

            {/* Spend Input Form */}
            <SpendInputForm />
          </div>

          {/* Right Column: Explainer / Sidebar cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl border border-zinc-200/80 bg-white/70 dark:border-zinc-800/80 dark:bg-zinc-950/70">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                What WiseBill Audits
              </h3>
              
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Overkill seat limits</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Identify plans like Claude Team (5-seat min) or ChatGPT Business (2-seat min) paid for by smaller teams that don&apos;t meet the requirements.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Redundant IDE autocompletes</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Flag overlapping Cursor and GitHub Copilot subscriptions. Cursor natively replaces Copilot autocomplete.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">API vs. flat-rate break-evens</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Evaluate if heavy pay-as-you-go API usage is cheaper to migrate into subscription flat rates.
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <div className="w-6 h-6 flex-shrink-0 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Low-utilization API migration</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Detect if low-volume, general-purpose chat subscriptions are cheaper to run directly through developer APIs.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200/80 bg-zinc-900 text-white dark:border-zinc-800 dark:bg-zinc-900/50 shadow-md">
              <h4 className="text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                Secure & private
              </h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Your data is stored securely. Sharing your public slug generates a shareable, read-only link that strips any identifying email contacts.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
