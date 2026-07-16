import { useState, useEffect } from "react";
import { AuditResult } from "../lib/auditEngine";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRef } from "react";
import { LeadCapture } from "./LeadCapture";
import { usePDF } from "react-to-pdf";

export function AuditResults({ 
  auditId,
  publicSlug,
  aiSummary,
  results, 
  totalMonthlySavings, 
  totalAnnualSavings,
  teamSize = 1 
}: { 
  auditId: string;
  publicSlug: string;
  aiSummary: string;
  results: any[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  teamSize?: number;
}) {
  const isHighSavings = totalMonthlySavings > 500;
  
  // PDF Export
  const { toPDF, targetRef } = usePDF({filename: 'AI-Spend-Audit-Report.pdf'});

  // Benchmark Logic
  const totalCurrentSpend = results.reduce((acc, r) => acc + r.currentSpend, 0);
  const spendPerDev = Math.round(totalCurrentSpend / teamSize);
  const industryAverage = 45; // Hardcoded benchmark: $45/mo/dev average for Series A
  const isAboveAverage = spendPerDev > industryAverage;

  const handleShare = () => {
    const url = `${window.location.origin}/audit/${publicSlug}`;
    navigator.clipboard.writeText(url);
    alert("Audit URL copied to clipboard!");
  };
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Action Bar */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => toPDF()}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition text-sm shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Export PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 bg-brand-blue-50 hover:bg-brand-blue-100 text-brand-blue-700 dark:bg-brand-blue-900/30 dark:text-brand-blue-300 dark:hover:bg-brand-blue-900/50 px-4 py-2 rounded-md font-medium transition text-sm shadow-sm border border-brand-blue-200 dark:border-brand-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          Share Audit
        </button>
      </div>
      
      {/* PDF Target Wrapper */}
      <div ref={targetRef} className="space-y-8 bg-background p-4 sm:p-0">
        {/* Hero Section */}
        <div className="bg-white dark:bg-card border border-border shadow-lg rounded-xl p-8 text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Your AI Spend Audit</h2>
        
        {totalMonthlySavings > 0 ? (
          <div className="space-y-2">
            <p className="text-xl text-muted-foreground">You could be saving</p>
            <div className="text-5xl font-extrabold text-brand-purple-600 dark:text-brand-purple-400">
              ${totalMonthlySavings.toLocaleString()}<span className="text-2xl text-muted-foreground font-medium"> / mo</span>
            </div>
            <p className="text-lg text-muted-foreground pt-2">
              That's <span className="font-semibold text-foreground">${totalAnnualSavings.toLocaleString()}</span> a year back in your budget.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-brand-blue-600">You're spending well!</p>
            <p className="text-muted-foreground">Your team is currently on the optimal plans for your usage.</p>
          </div>
        )}
        </div>

        {/* Benchmark Mode */}
        <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-1 text-left flex-1">
            <h3 className="text-lg font-bold">Industry Benchmark</h3>
            <p className="text-sm text-muted-foreground">Companies of your size average <span className="font-semibold text-foreground">$45/mo</span> per developer on AI tools.</p>
          </div>
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden relative">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full ${isAboveAverage ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min((spendPerDev / (industryAverage * 2)) * 100, 100)}%` }}
              ></div>
              <div className="absolute top-0 h-full w-0.5 bg-foreground" style={{ left: '50%' }}></div>
            </div>
            <div className="text-right whitespace-nowrap text-sm font-medium">
              <span className={isAboveAverage ? "text-red-500" : "text-green-500"}>${spendPerDev}/mo</span>
              <span className="text-muted-foreground ml-1">avg</span>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
      {aiSummary && (
        <div className="bg-brand-blue-50/50 dark:bg-brand-blue-900/10 border border-brand-blue-100 dark:border-brand-blue-800 rounded-xl p-6 text-left shadow-sm">
          <h3 className="text-lg font-semibold text-brand-blue-800 dark:text-brand-blue-300 mb-2 flex items-center gap-2">
            ✨ Executive Summary
          </h3>
          <p className="text-foreground leading-relaxed text-sm md:text-base">
            {aiSummary}
          </p>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold px-1">Tool Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, i) => (
            <Card key={i} className="border-border shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between">
                  <span className="capitalize">{result.toolId.replace('_', ' ')}</span>
                  <span className="text-muted-foreground text-sm font-normal">Spend: ${result.currentSpend}/mo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-brand-blue-100/50 dark:bg-brand-blue-600/10 rounded-md border border-brand-blue-100 dark:border-brand-blue-600/20">
                    <p className="font-semibold text-brand-blue-600 dark:text-brand-blue-400 text-sm mb-1">Recommendation</p>
                    <p className="text-foreground capitalize">{result.recommendedAction.replace('_', ' ')}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.reasonText}</p>
                  
                  {result.savingsMonthly > 0 && (
                    <div className="pt-2 border-t border-border mt-2">
                      <p className="text-sm font-medium text-brand-purple-600 dark:text-brand-purple-400">
                        Potential Savings: ${result.savingsMonthly}/mo
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div> {/* End PDF Target Wrapper */}

      {/* Lead Capture CTA */}
      <LeadCapture 
        auditId={auditId}
        savingsPotential={totalMonthlySavings} 
        isHighSavings={isHighSavings} 
      />

    </div>
  );
}
