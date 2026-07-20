// region imports
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateInputs, updateGlobalSettings } from "@/store/slices/auditSlice";
import { AuditInput } from "@/types/audit";
import { getPricingConfig } from "@/services/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// endregion

// region component

const DEFAULT_GLOBAL_SETTINGS = { teamSize: 50 };
const DEFAULT_INPUTS: AuditInput[] = [
  { tool: "ChatGPT", planName: "Plus", monthlySpend: 20, seats: 1, teamSize: 50, useCase: "mixed" }
];

export function SpendInputForm({ onAudit }: { onAudit: (inputs: AuditInput[], honeypot: string) => void }) {
  // region state
  const dispatch = useDispatch();
  const inputs = useSelector((state: RootState) => (state.audit?.inputs && state.audit.inputs.length > 0) ? state.audit.inputs : DEFAULT_INPUTS);
  const globalSettings = useSelector((state: RootState) => state.audit?.globalSettings || DEFAULT_GLOBAL_SETTINGS);
  const [website, setWebsite] = useState("");
  const [pricingData, setPricingData] = useState<any>(null);
  // endregion

  useEffect(() => {
    getPricingConfig()
      .then(data => setPricingData(data))
      .catch(err => console.error("Failed to load pricing data:", err));
  }, []);

  // Redux-persist handles rehydration automatically.
  // We can just rely on the initial state from Redux.

  const handleUpdate = (index: number, field: keyof AuditInput, value: string | number) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    dispatch(updateInputs(newInputs));
  };

  const handleAdd = () => {
    dispatch(updateInputs([...inputs, { tool: "ChatGPT", planName: "Plus", monthlySpend: 20, seats: 1, teamSize: globalSettings.teamSize, useCase: "mixed" }]));
  };

  const handleRemove = (index: number) => {
    const newInputs = inputs.filter((_: AuditInput, i: number) => i !== index);
    dispatch(updateInputs(newInputs));
  };

  const handleSubmit = () => {
    // Inject global settings into all tool rows before submitting
    const finalInputs = inputs.map((input: AuditInput) => ({
      ...input,
      teamSize: globalSettings.teamSize,
    }));
    onAudit(finalInputs, website);
  };

  if (!pricingData) {
    return <div className="text-center py-12 text-muted-foreground animate-pulse">Loading tools database...</div>;
  }

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
              onChange={(e) => dispatch(updateGlobalSettings({...globalSettings, teamSize: Number(e.target.value)}))}
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

      {inputs.map((input: AuditInput, i: number) => (
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
                onChange={(e) => handleUpdate(i, "tool", e.target.value)}
              >
                {Object.keys(pricingData).map(tool => (
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
                {pricingData[input.tool]?.plans ? Object.keys(pricingData[input.tool].plans).map(planName => (
                  <option key={planName} value={planName}>{planName}</option>
                )) : null}
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
        {/* Honeypot field (hidden from real users, traps bots) */}
        <input 
          type="text" 
          name="website" 
          className="opacity-0 absolute -z-10 w-0 h-0" 
          tabIndex={-1} 
          autoComplete="off"
          value={website} 
          onChange={(e) => setWebsite(e.target.value)} 
        />
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
// endregion
