"use client";

import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  const isAuditPage = pathname.startsWith('/audit/');

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800/40 bg-white/70 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-150">
      <div className={`mx-auto px-6 h-16 flex items-center justify-between ${isAuditPage ? 'max-w-6xl' : 'max-w-7xl'}`}>
        {/* LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80" 
          onClick={() => router.push('/')}
        >
          <span className="w-7 h-7 rounded bg-brand-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">WB</span>
          <span className="text-xl font-bold tracking-tighter text-brand-purple-600">
            WiseBill AI
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {isAuditPage ? (
            <>
              <button
                onClick={() => window.print()}
                className="no-print text-xs px-3.5 py-2 font-bold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition duration-150 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Save PDF
              </button>
              <button
                onClick={() => router.push('/')}
                className="no-print text-xs px-3.5 py-2 font-bold rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition duration-150"
              >
                ← Audit Another Stack
              </button>
            </>
          ) : (
            <div className="text-sm font-semibold tracking-widest text-muted-foreground uppercase hidden sm:block">
              SaaS AI
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
