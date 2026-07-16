"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button"; // Note: might need to fallback to standard button if not installed

export function LeadCapture({ 
  auditId,
  savingsPotential, 
  isHighSavings 
}: { 
  auditId: string;
  savingsPotential: number; 
  isHighSavings: boolean; 
}) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Abuse protection
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId,
          email,
          companyName,
          role,
          teamSize: teamSize ? Number(teamSize) : undefined,
          savingsPotential,
          website: honeypot, // Backend uses "website" as the honeypot key
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to submit.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto text-green-600 dark:text-green-400 text-xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Request Received</h3>
        <p className="text-green-700 dark:text-green-400 max-w-md mx-auto">
          We've sent a confirmation to {email}. A Techvruk expert will be in touch shortly to help you capture these savings.
        </p>
      </div>
    );
  }

  return (
    <div className={isHighSavings 
      ? "bg-brand-purple-600 text-white rounded-xl p-8 shadow-xl" 
      : "bg-card border border-border rounded-xl p-8 shadow-sm"
    }>
      <div className="text-center space-y-4 mb-6">
        <h3 className={`text-2xl font-bold ${isHighSavings ? "" : "text-foreground"}`}>
          {isHighSavings ? "Stop leaking budget." : "Stay Optimized"}
        </h3>
        <p className={`text-lg max-w-2xl mx-auto ${isHighSavings ? "text-brand-purple-100" : "text-muted-foreground"}`}>
          {isHighSavings 
            ? `Your team is overspending by $${savingsPotential}/mo on AI tools. Get expert help to restructure your stack and capture these savings immediately.` 
            : "AI pricing changes fast. Get notified when new tools or pricing tiers could save your team money."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        {/* HONEYPOT - Hidden from real users */}
        <div className="absolute opacity-0 -z-50 h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>Leave this empty</label>
          <input type="text" name="honeypot" tabIndex={-1} value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>

        <div className="space-y-2 text-left">
          <Label className={isHighSavings ? "text-brand-purple-100" : ""}>Work Email <span className="text-red-400">*</span></Label>
          <Input 
            required 
            type="email" 
            placeholder="you@company.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={isHighSavings ? "bg-white/10 border-white/20 text-white placeholder:text-white/50" : ""}
          />
        </div>
        
        {isHighSavings && (
          <>
            <div className="space-y-2 text-left">
              <Label className="text-brand-purple-100">Company Name (Optional)</Label>
              <Input 
                type="text" 
                placeholder="Acme Corp" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label className="text-brand-purple-100">Role (Optional)</Label>
                <Input 
                  type="text" 
                  placeholder="CTO" 
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label className="text-brand-purple-100">Team Size (Optional)</Label>
                <Input 
                  type="number" 
                  placeholder="25" 
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          </>
        )}

        {status === "error" && (
          <p className="text-sm text-red-200 bg-red-900/50 p-2 rounded">{message}</p>
        )}

        <button 
          disabled={status === "submitting"}
          className={`w-full py-3 rounded-md font-semibold transition shadow-sm ${
            isHighSavings 
              ? "bg-white text-brand-purple-600 hover:bg-brand-purple-50" 
              : "bg-brand-blue-600 hover:bg-brand-blue-700 text-white"
          } ${status === "submitting" ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {status === "submitting" ? "Submitting..." : isHighSavings ? "Book Techvruk Expert" : "Notify Me"}
        </button>
      </form>
    </div>
  );
}
