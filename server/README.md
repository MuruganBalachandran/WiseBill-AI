# WiseBill AI — Server Backend (Express.js)

The backend service for WiseBill AI is built with **Express.js**, **Node.js**, **MongoDB (Mongoose)**, and **TypeScript** (`tsx`).

---

## 🏗️ Folder Structure

```text
server/
├── src/
│   ├── constants/
│   │   ├── httpStatus.ts    # HTTP status code enum
│   │   └── pricing.ts       # Single source of truth for tool pricing tiers & rules
│   ├── controllers/
│   │   ├── audit.ts         # Audit creation & slug lookup controllers
│   │   └── lead.ts          # Lead capture & transactional email triggers
│   ├── middlewares/
│   │   └── rateLimiter.ts   # IP rate limiting for API protection
│   ├── models/
│   │   ├── Audit.ts         # Mongoose schema for Audit snapshot
│   │   └── Lead.ts          # Mongoose schema for Lead records
│   ├── queries/             # MongoDB database access layer (Mongoose helpers)
│   ├── routers/             # Express route definitions (`/api/audits`, `/api/leads`)
│   ├── services/
│   │   ├── aiSummary.ts     # Anthropic/Gemini/OpenAI LLM executive summary service
│   │   ├── auditEngine.ts   # Modular financial evaluators (planFit, overlap, breakeven)
│   │   └── resend.ts        # Resend API transactional email service
│   ├── types/               # TypeScript interfaces for audits, leads, and pricing
│   └── app.ts               # Express application initialization & MongoDB connection
└── tests/
    └── auditEngine.test.ts  # Node test runner suite for audit engine rules
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Abuse Protection |
|---|---|---|---|
| `POST` | `/api/audits` | Runs audit engine math, generates LLM summary, stores snapshot | Rate Limiter (3/min) + Honeypot |
| `GET` | `/api/audits/:slug` | Retrieves public audit (strips `leadId` PII) | None (Public) |
| `GET` | `/api/audits/pricing` | Returns active tool pricing catalogue for frontend | None (Public) |
| `POST` | `/api/leads` | Saves lead details to MongoDB & sends Resend confirmation email | Rate Limiter (5/min) + Honeypot |

---

## ⚡ Development & Testing Commands

```bash
# Install dependencies
npm install

# Start Express development server (http://localhost:5000)
npm run dev

# Run unit test suite (7 passing tests)
npm test

# Run TypeScript type check
npx tsc --noEmit
```

---

## 🛡️ Code Standards

- **Single-Line Comments:** All TypeScript files strictly use single-line comments (`// ...`) and `// region` / `// endregion` blocks.
- **Pure Mathematical Engine:** Audit rules in `auditEngine.ts` are 100% deterministic and isolated from AI text generation.
