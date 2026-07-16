# Architecture & System Design

## System Diagram (Data Flow)

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (Next.js)
    participant E as Server (Express)
    participant LLM as Anthropic API
    participant DB as MongoDB
    participant D1 as Cloudflare D1
    participant M as Resend

    U->>C: Inputs Stack & Team Size
    C->>E: POST /api/audits (spendInputs)
    E->>E: runAudit() (Engine Math)
    E->>LLM: Generate Executive Summary
    LLM-->>E: Summary Text
    E->>DB: Save Audit Snapshot
    E-->>C: Returns Results + publicSlug
    C-->>U: Renders AuditResults & PDF CTA
    
    U->>C: Fills LeadCapture Form
    C->>E: POST /api/leads (email, honeypot)
    E->>E: Check Honeypot (Layer 2 Spam)
    E->>DB: Save Lead linked to Audit
    E-x D1: Background Mirror Sync
    E-x M: Send Transactional Confirmation
    E-->>C: Success 201
    C-->>U: Renders Success CTA
```

## Stack Justification
**Frontend: Next.js 16 (React) + Tailwind + shadcn/ui**
- Chosen for its App Router, making the dynamic `app/audit/[slug]` route highly performant while natively supporting Server-Side rendering for dynamic Open Graph metadata (critical for the viral loop requirement). 
- Tailwind + glassmorphism UI enables the "Techvruk ditto" aesthetic to look highly premium, which is necessary for a tool targeting finance/leadership.

**Backend: Express.js (Node) + MongoDB + Cloudflare D1**
- Express handles the complex audit math and LLM integrations off the client, keeping API keys totally secure. 
- MongoDB is the primary datastore for flexible schema rapid iteration.
- Cloudflare D1 is integrated via a fire-and-forget sync to demonstrate scalable edge-database architecture.

## Scaling to 10k Audits/Day
If this tool scaled to 10,000 audits per day, the current architecture would face two bottlenecks:
1. **LLM Latency & Cost:** Generating 10k summaries via Anthropic API directly in the request lifecycle would lead to high latency and rate limits. **Solution:** We would implement a caching layer (Redis) to hash identical `spendInputs` and return cached LLM summaries. 
2. **Database Write Locks:** **Solution:** The synchronous MongoDB writes for `Audit` and `Lead` models would be offloaded to an async message queue (e.g., SQS or RabbitMQ). The API would return a `202 Accepted` and optimistic UI updates, while workers process the heavy database writes and transactional emails in the background.
