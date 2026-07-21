# WiseBill AI — SaaS Spend Auditor

WiseBill AI is an automated financial optimization platform designed for engineering managers, VPs of Engineering, and CTOs at seed to Series B tech startups. It analyzes active AI tool subscriptions (Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, v0, API direct spend) to deliver instant, defensible audits revealing seat bloat, plan downgrades, tool redundancy, and projected annual savings.

**Live Deployed URL:** [https://wisebill-ai.vercel.app](https://wisebill-ai.vercel.app)

---

## 🎥 Product Demo Video

[![WiseBill AI Product Walkthrough](https://github.com/user-attachments/assets/ea44dc10-9bd5-4978-94c4-f65e039b64e0)](https://github.com/user-attachments/assets/ea44dc10-9bd5-4978-94c4-f65e039b64e0)

> 📹 **Watch Full Walkthrough Video:** [https://github.com/user-attachments/assets/ea44dc10-9bd5-4978-94c4-f65e039b64e0](https://github.com/user-attachments/assets/ea44dc10-9bd5-4978-94c4-f65e039b64e0)

---

## 🚀 Decisions & Technical Trade-Offs (5 Key Choices)

1. **Deterministic Rule Engine over LLM Math Calculation**: We hardcoded financial audit logic in pure TypeScript (`auditEngine.ts`) instead of querying LLMs for calculation. Financial calculations require 100% deterministic accuracy without hallucinating pricing tiers; LLMs are reserved strictly for humanized text summaries.
2. **Post-Value Lead Capture (Zero Friction)**: Audits run instantly without requiring user sign-in or upfront email entry. Lead capture is positioned exclusively on the results page after value is demonstrated, maximizing viral conversion and reducing drop-offs.
3. **Dual-Layer Abuse Protection (Honeypot + IP Rate Limiter)**: Selected hidden UI honeypot fields combined with server-side IP rate limiting over intrusive CAPTCHA challenges to preserve friction-free UX while preventing automated bot spam.
4. **Data Minimization on Public URLs**: When generating public `/audit/:slug` shareable links, all PII (email, company name, team identifiers) is stripped at the database query level, leaving only anonymized stack metrics safe for social sharing and OpenGraph previews.
5. **Redux Persist with Client-Side Hydration**: Used `redux-persist` with a custom SSR no-op storage fallback to persist state across page reloads on client devices without requiring backend database sync prior to audit submission.

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
APP_CONFIG={"db":{"uri":"mongodb://localhost:27017/billwiseai"},"port":5000,"geminiApiKey":"YOUR_GEMINI_KEY","resend":{"apiKey":"re_YOUR_KEY","fromEmail":"onboarding@resend.dev"},"clientUrl":"http://localhost:3000"}
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
# Run server unit tests (7 passing tests)
cd server
npm test

# Run TypeScript type checks
cd server && npx tsc --noEmit
cd client && npx tsc --noEmit
```

---

## 📖 Key Documentation Files

- **`ARCHITECTURE.md`**: Mermaid sequence diagram, data flow, stack choices, and 10k audit/day scaling architecture.
- **`DEVLOG.md`**: 7-day engineering log tracking daily hours, accomplishments, learnings, and blockers.
- **`REFLECTION.md`**: Detailed answers to 5 core engineering & product reflection questions.
- **`TESTS.md`**: Suite manifest covering all automated tests and execution instructions.
- **`PRICING_DATA.md`**: Traceable pricing sources with official vendor URLs for every supported tool.
- **`PROMPTS.md`**: Complete LLM prompts, fallback strategies, and prompt engineering iterations.
- **`GTM.md`**: Target user profile, zero-cost distribution channels, and 30-day user acquisition strategy.
- **`ECONOMICS.md`**: Unit economics, CAC estimates, Techvruk lead valuation, and $1M ARR growth model.
- **`USER_INTERVIEWS.md`**: Verified notes & direct quotes from 3 real prospective user interviews.
- **`LANDING_COPY.md`**: Full landing page copy, hero headlines, social proof blocks, and FAQ.
- **`METRICS.md`**: North Star metric, input drivers, instrumentation roadmap, and pivot thresholds.
- **`LAUNCH_PITCH.md`**: Twitter thread, Product Hunt launch post, and embeddable widget snippet.
