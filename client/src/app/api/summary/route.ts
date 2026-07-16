import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { totalCurrentSpend, totalMonthlySavings, totalAnnualSavings, results } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isOptimized = totalMonthlySavings === 0;

    const fallbackSummary = isOptimized 
      ? `Based on your audit, your team is currently spending $${totalCurrentSpend.toLocaleString()}/mo on AI tools. Congratulations on running a lean tech stack! You are currently on the optimal plans for your usage, avoiding any phantom seat costs or enterprise bloat. Review the detailed tool breakdown below to ensure you stay optimized as your team scales.`
      : `Based on your audit, your team is currently spending $${totalCurrentSpend.toLocaleString()}/mo on AI tools. By restructuring your stack according to our recommendations, you could capture $${totalAnnualSavings.toLocaleString()} in annual savings. Review the detailed tool breakdown below to see exactly which licenses are underutilized and where switching tools provides better ROI.`;

    if (!apiKey) {
      console.warn("No ANTHROPIC_API_KEY found. Falling back to templated summary.");
      return NextResponse.json({ summary: fallbackSummary });
    }

    const toolRecommendationsList = results.map((r: any) => 
      `- ${r.tool} (Current: $${r.currentSpend}): ${r.recommendedAction}. ${r.reason}`
    ).join("\n");

    const systemPrompt = "You are a fractional CFO and AI tooling expert. Your goal is to review a company's current AI tooling spend and provide a concise, professional 100-word executive summary of their optimization opportunities. Tone: Direct, professional, and slightly urgent if savings are high. Do not use filler words.";
    
    const userPrompt = `Please generate a 100-word executive summary based on the following AI Spend Audit data:

Total Current Monthly Spend: $${totalCurrentSpend}
Total Potential Monthly Savings: $${totalMonthlySavings}
Total Potential Annual Savings: $${totalAnnualSavings}

Tool Breakdown & Recommendations:
${toolRecommendationsList}

Focus on the biggest areas of waste (e.g., phantom seats, overkill enterprise plans) and highlight the total annual savings clearly. If they are already optimized, congratulate them on running a lean tech stack. Do not explain the math, just summarize the business impact.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", await response.text());
      return NextResponse.json({ summary: fallbackSummary }); // Graceful fallback
    }

    const data = await response.json();
    const summary = data.content[0].text;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary generation error:", error);
    // Graceful fallback on any error
    return NextResponse.json({ 
      summary: "Based on your audit, we have identified key areas for optimization. Please review the detailed tool breakdown below to see exactly which licenses are underutilized and where switching tools provides better ROI." 
    });
  }
}
