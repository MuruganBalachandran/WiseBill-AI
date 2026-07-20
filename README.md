# WiseBill AI — SaaS Spend Auditor

WiseBill AI is a financial optimization application for engineering and product teams. Input your team's active subscriptions (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, v0, API direct spend) to get an instant, defensible breakdown of overpaying areas, cheaper plan alternatives, and total monthly/annual savings.

---

## 🚀 Key Features

- **Feature 1: Spend Input Form:** Dynamic tool picker with seat count, monthly spend, and plan selections powered by Redux Toolkit & `redux-persist`.
- **Feature 2: Deterministic Audit Engine:** Pure TypeScript financial logic calculating plan fit, seat minimum overages (Claude Team 5-seat floor, ChatGPT Team 2-seat floor), tool redundancy (Cursor + Copilot), API vs. Team plan breakeven, and startup credit advisories.
- **Feature 3: Audit Results Page:** High-impact visual report featuring monthly/annual savings hero banners, Peer Benchmark indicators ($/dev/mo vs. $110 industry avg), Techvruk high-savings CTA (> $500/mo), and honest low-savings guidance (< $100/mo).
- **Feature 4: AI-Generated Executive Summary:** Uses the **Anthropic API** (`claude-3-5-sonnet-20241022`) with Gemini/OpenAI fallbacks and a 5-second `AbortController` timeout for deterministic fallback summaries. Prompt specs in `PROMPTS.md`.
- **Feature 5: Lead Capture & Transactional Email:** Real MongoDB storage linked to audit records, dual-layer abuse protection (hidden UI Honeypot + IP Rate Limiter), and Resend API transactional emails.
- **Feature 6: Shareable Result URLs & Viral Loop:** Public `/audit/[slug]` URLs with PII (email, company) strictly stripped, dynamic Open Graph & Twitter cards (`/api/og`), 1-click URL copy, and social share buttons.
- **Bonus Features:**
  - 🖨️ **Native PDF Export:** Browser-native `window.print()` with custom `@media print` rules.
  - 🧩 **Embeddable Widget:** `<script src="https://wisebill.ai/widget.js" data-container="wisebill-widget"></script>` for external blogs/websites.
  - 📊 **Benchmark Mode:** Per-developer spend vs. industry average.
  - 🎁 **Referral Rewards:** Referral parameter support (`?ref=YOUR_CODE`) unlocking free 1-on-1 optimization sessions with Techvruk.
  - 📢 **Launch Pitch:** Complete Twitter thread and Product Hunt blog post in `LAUNCH_PITCH.md`.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS, Redux Toolkit, `redux-persist`.
- **Backend:** Express.js, TypeScript (`tsx`), Node.js.
- **Database:** MongoDB (Mongoose schemas for `Audit` & `Lead`).
- **Services:** Anthropic API (Claude), Google Gemini API, OpenAI API, Resend API.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/MuruganBalachandran/WiseBill-AI.git
cd WiseBill-AI
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup (Separate Terminal)
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
ANTHROPIC_API_KEY=sk-ant-... (preferred LLM provider)
GEMINI_API_KEY=... (optional fallback)
OPENAI_API_KEY=... (optional fallback)
RESEND_API_KEY=re_...
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONSULTATION_URL=https://calendly.com/...
```

---

## 🧪 Testing & Quality Assurance

```bash
# Run server unit tests
cd server
npm test

# Run TypeScript checks
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
```

---

## 📖 Key Documentation Files

- **`PROMPTS.md`**: AI executive summary system/user prompts & fallback templates.
- **`PRICING_DATA.md`**: Verified pricing numbers and official URL sources for all AI tools.
- **`LAUNCH_PITCH.md`**: Product Hunt launch blog post, Twitter thread, and widget embed snippet.
- **`ARCHITECTURE.md`**: Mermaid sequence diagram, system design, and 10k audit scaling strategy.
- **`DEVLOG.md`**: Engineering log tracking progress and technical learnings.
