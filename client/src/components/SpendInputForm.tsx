"use client";

import { useState, useEffect } from "react";
import { PRICING_DATA, ToolName } from "@/lib/pricingData";
import { AuditInput } from "@/lib/auditEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SpendInputForm({ onAudit }: { onAudit: (inputs: AuditInput[]) => void }) {
  const [globalSettings, setGlobalSettings] = useState({ teamSize: 10 });
  const [inputs, setInputs] = useState<AuditInput[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("ai-audit-inputs");
    const savedGlobal = localStorage.getItem("ai-audit-globals");
    if (saved) {
      try {
        setInputs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved inputs", e);
      }
    } else {
      // Default empty input
      setInputs([{ tool: "Cursor", planName: "Pro", monthlySpend: 20, seats: 1, teamSize: 10, useCase: "coding" }]);
    }
    
    if (savedGlobal) {
      try {
        setGlobalSettings(JSON.parse(savedGlobal));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (inputs.length > 0) {
      localStorage.setItem("ai-audit-inputs", JSON.stringify(inputs));
    }
    localStorage.setItem("ai-audit-globals", JSON.stringify(globalSettings));
  }, [inputs, globalSettings]);

  const handleUpdate = (index: number, field: keyof AuditInput, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  const handleAdd = () => {
    setInputs([...inputs, { tool: "ChatGPT", planName: "Plus", monthlySpend: 20, seats: 1, teamSize: globalSettings.teamSize, useCase: "mixed" }]);
  };

  const handleRemove = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    // Inject global settings into all tool rows before submitting
    const finalInputs = inputs.map(input => ({
      ...input,
      teamSize: globalSettings.teamSize,
    }));
    onAudit(finalInputs);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Your AI Tech Stack</h2>
      </div>

      {/* Global Settings */}
      <Card className="border-border shadow-sm bg-zinc-50/50 dark:bg-zinc-900/50 mb-8">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-lg text-brand-purple-600">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label>Total Company Team Size</Label>
            <Input 
              type="number" 
              value={globalSettings.teamSize}
              onChange={(e) => setGlobalSettings({...globalSettings, teamSize: Number(e.target.value)})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8 mb-4">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Active Subscriptions</h3>
        <button 
          onClick={handleAdd}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-4 py-2 rounded-md font-medium transition text-sm shadow-sm"
        >
          + Add Tool
        </button>
      </div>

      {inputs.map((input, i) => (
        <Card key={i} className="border-border shadow-sm">
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Tool #{i + 1}</CardTitle>
            {inputs.length > 1 && (
              <button onClick={() => handleRemove(i)} className="text-destructive hover:underline text-sm font-medium">Remove</button>
            )}
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="space-y-2">
              <Label>Tool</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={input.tool}
                onChange={(e) => handleUpdate(i, "tool", e.target.value as ToolName)}
              >
                {Object.keys(PRICING_DATA).map(tool => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Plan</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={input.planName}
                onChange={(e) => handleUpdate(i, "planName", e.target.value)}
              >
                {PRICING_DATA[input.tool]?.map(plan => (
                  <option key={plan.name} value={plan.name}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Monthly Spend ($)</Label>
              <Input 
                type="number" 
                value={input.monthlySpend}
                onChange={(e) => handleUpdate(i, "monthlySpend", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Seats</Label>
              <Input 
                type="number" 
                value={input.seats}
                onChange={(e) => handleUpdate(i, "seats", Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Use Case</Label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={input.useCase}
                onChange={(e) => handleUpdate(i, "useCase", e.target.value)}
              >
                <option value="coding">Coding / Engineering</option>
                <option value="writing">Writing / Content</option>
                <option value="data">Data Analysis</option>
                <option value="research">Research</option>
                <option value="mixed">Mixed / General</option>
              </select>
            </div>

          </CardContent>
        </Card>
      ))}

      <div className="pt-6 flex justify-center">
        <button 
          onClick={handleSubmit}
          className="bg-brand-purple-600 hover:bg-brand-purple-700 text-white px-8 py-3 rounded-md font-semibold text-lg shadow-md transition w-full md:w-auto"
        >
          Run Audit
        </button>
      </div>

    </div>
  );
}
