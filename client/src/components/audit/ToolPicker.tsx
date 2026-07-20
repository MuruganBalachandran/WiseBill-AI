'use client';

import { TOOL_CATALOG } from '@/constants/toolCatalog';

type ToolPickerProps = {
  availableTools: string[];
  selectedTools: string[];
  onAddTool: (tool: string) => void;
};

// Compact picker keeps the empty state useful without asking for all subscription details at once.
export function ToolPicker({ availableTools, selectedTools, onAddTool }: ToolPickerProps) {
  return (
    <section aria-labelledby="tool-picker-title" className="space-y-3">
      <div>
        <h3 id="tool-picker-title" className="text-base font-semibold text-foreground">Add the tools you pay for</h3>
        <p className="text-sm text-muted-foreground">Choose a tool, then enter only the details you know.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {availableTools.map(tool => {
          const metadata = TOOL_CATALOG[tool] ?? { label: tool, emoji: '✨', description: 'AI tool' };
          const isSelected = selectedTools.includes(tool);

          return (
            <button
              key={tool}
              type="button"
              onClick={() => onAddTool(tool)}
              className="group rounded-xl border border-border bg-background p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-purple-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-600"
            >
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple-600/10 text-lg">{metadata.emoji}</span>
              <span className="block text-sm font-semibold text-foreground">{metadata.label}</span>
              <span className="block text-xs text-muted-foreground">{isSelected ? 'Add another plan' : metadata.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
