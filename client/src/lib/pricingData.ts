export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "Windsurf";

export type Plan = {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
};

export const PRICING_DATA: Record<ToolName, Plan[]> = {
  Cursor: [
    { name: "Hobby", pricePerSeat: 0 },
    { name: "Pro", pricePerSeat: 20 },
    { name: "Business", pricePerSeat: 40 },
    { name: "Enterprise", pricePerSeat: 100 },
  ],
  "GitHub Copilot": [
    { name: "Individual", pricePerSeat: 10 },
    { name: "Business", pricePerSeat: 19 },
    { name: "Enterprise", pricePerSeat: 39 },
  ],
  Claude: [
    { name: "Free", pricePerSeat: 0 },
    { name: "Pro", pricePerSeat: 20 },
    { name: "Team", pricePerSeat: 30, minSeats: 5 },
    { name: "Max", pricePerSeat: 40 },
    { name: "Enterprise", pricePerSeat: 100 },
    { name: "API direct", pricePerSeat: 0 },
  ],
  ChatGPT: [
    { name: "Free", pricePerSeat: 0 },
    { name: "Plus", pricePerSeat: 20 },
    { name: "Team", pricePerSeat: 30, minSeats: 2 },
    { name: "Enterprise", pricePerSeat: 60 },
    { name: "API direct", pricePerSeat: 0 },
  ],
  "Anthropic API": [{ name: "API direct", pricePerSeat: 0 }],
  "OpenAI API": [{ name: "API direct", pricePerSeat: 0 }],
  Gemini: [
    { name: "Pro", pricePerSeat: 20 },
    { name: "Ultra", pricePerSeat: 20 },
    { name: "API", pricePerSeat: 0 },
  ],
  Windsurf: [
    { name: "Free", pricePerSeat: 0 },
    { name: "Pro", pricePerSeat: 20 },
    { name: "Team", pricePerSeat: 30 },
  ],
};
