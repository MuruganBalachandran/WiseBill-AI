# Architecture

## Stack

- **Frontend:** React + TypeScript, Vite
- **Backend:** Node + Express + TypeScript
- **Database:** MongoDB Atlas (Mongoose), free tier
- **Email:** Resend (free tier) for transactional confirmation
- **Hosting:** Vercel (frontend), Render (backend), Atlas (database)

### Why this stack

React + Vite over Next.js: this is a from-scratch UI with no admin-template concerns
(explicitly excluded by the assignment), and Vite's fast HMR matters more than SSR for a
5-day build. The trade-off: no free server-rendered Open Graph previews, so OG tags are
generated server-side from the Express API on the public audit route instead.

TypeScript over plain JS: the audit engine is arithmetic-heavy and finance-adjacent —
exactly the kind of logic where a typo in a plan-tier key should fail at compile time,
not surface as a wrong dollar figure in front of a user.

MongoDB over Postgres: the `Audit` document (spend inputs + computed results) is
naturally document-shaped and never needs a join in the MVP. If `Lead` analytics ever
need real relational querying at scale, that's the point to reconsider — see "10k
audits/day" below.

## Data model

```
SpendInput (embedded in Audit)
  toolId: enum [cursor, copilot, claude, chatgpt, anthropic_api, openai_api, gemini, v0]
  plan: string
  monthlySpend: number
  seats: number
  useCase: enum [coding, writing, data, research, mixed]

Audit (top-level document — computed once, stored, never recomputed)
  _id: ObjectId
  publicSlug: string          // nanoid, used in the shareable URL
  createdAt: Date
  teamSize: number
  primaryUseCase: enum [...]
  spendInputs: SpendInput[]
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary: string
  aiSummaryFallbackUsed: boolean
  pricingSnapshotDate: Date
  leadId: ObjectId | null

AuditResult (embedded, one per tool)
  toolId: string
  currentSpend: number
  recommendedAction: enum [keep, downgrade_plan, switch_tool, use_credits, already_optimal]
  recommendedPlan: string | null
  monthlySavings: number
  reasonText: string

Lead
  _id: ObjectId
  auditId: ObjectId
  email: string
  companyName: string | null
  role: string | null
  teamSize: number | null
  consentedAt: Date
  emailSent: boolean
```

**Key decision:** the audit is computed once at creation time and stored verbatim,
never recomputed when the public link is viewed later. This keeps a shared URL stable
even if `PRICING_DATA.md` changes next month. Trade-off: audits can silently go stale;
mitigated by stamping `pricingSnapshotDate` and showing "pricing verified as of [date]"
on the results page.

**Public/private split:** `GET /api/audits/:slug/public` is a server-side serializer
that strips `leadId` and never touches the `Lead` collection. Company name and email
are only visible on the private, pre-share view shown right after submission.

## System diagram

```mermaid
flowchart LR
    A[Visitor: cold landing] --> B[Spend Input Form<br/>Next.js (App Router), state persisted to localStorage]
    B -->|POST /api/audits| C[Express API]
    C --> D[Audit Engine<br/>pure function, no I/O]
    D --> E[(MongoDB: Audit doc<br/>stored, not recomputed)]
    C -->|async, non-blocking| F[Anthropic API<br/>~100-word summary]
    F -->|success| E
    F -->|failure/timeout| G[Templated fallback summary]
    G --> E
    E --> H[Results Page<br/>publicSlug URL]
    H -->|email gate| I[POST /api/leads]
    I --> J[(MongoDB: Lead doc)]
    I --> K[Resend: confirmation email]
    H -->|shared link| L[Public Audit View<br/>PII stripped server-side]
```

## Data flow

Form input is validated client-side against the `PricingConfig` object → posted to
Express → the audit engine (a pure function taking `SpendInput[]` and `PricingConfig`,
returning `AuditResult[]`) runs synchronously and the result is stored immediately →
the AI summary call happens *after* the audit is already saved, so a slow or failing
LLM call never blocks the user from seeing their results → the results page reads back
the stored `Audit` document, never recomputing.

## What changes at 10k audits/day

The audit engine is already a pure, stateless function, so it can move behind a queue
(e.g. BullMQ + Redis) without a rewrite — write requests get acknowledged immediately
and processed asynchronously. The Anthropic summary call becomes the real bottleneck
at that volume (rate limits, latency), so it would need its own worker pool with
backoff, and probably a cheaper first-pass model (Haiku) escalating to Sonnet only when
needed. MongoDB Atlas free tier obviously doesn't survive this — a read replica and an
index on `publicSlug` become necessary, and if `Lead` ever needs real analytical
querying (cohort analysis, funnel reporting) rather than simple lookups, that's the
point to reconsider a relational store for that collection specifically, rather than
migrating the whole system.
