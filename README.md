# WiseBill AI

An AI spend audit tool: paste in what your team pays for Cursor, Copilot, Claude, ChatGPT, and friends, and get an instant, defensible breakdown of where you're overpaying, what to switch to, and how much you'd save monthly and annually.

Built for founders and small teams who've never once compared their AI tool bill against what they actually use it for.

## Screenshots

*(Screenshots will be added here post-deployment)*

## Quick start

```bash
# clone and install
git clone <repo-url>
cd wisebill-ai

# server
cd server && npm install && npm run dev

# client (separate terminal)
cd client && npm install && npm run dev
```

Environment variables needed:
**Server (`server/.env`)**
- `PORT` (default 5000)
- `MONGODB_URI`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_D1_DATABASE_ID`

**Client (`client/.env.local`)**
- `NEXT_PUBLIC_API_URL` (default `http://localhost:5000/api`)
- `NEXT_PUBLIC_APP_URL` (default `http://localhost:3000`)

## Deploy

- Frontend: Vercel
- Backend: Render
- Primary Database: MongoDB Atlas (Free Tier)
- Mirror Database: Cloudflare D1

Live demo: *(Deployed URL to be added after Vercel/Render setup)*

## Decisions

1. **Architecture: Next.js App Router for Frontend, Express for Backend**
   Next.js was chosen for its SEO capabilities (dynamic Open Graph images via `next/og` and Server Components for metadata injection) which are critical for the viral share loop. Express was chosen for the backend to keep the API layer fully decoupled, making it easier to integrate complex rate-limiting, honeypots, and dual-database writes (MongoDB + D1) without fighting serverless edge runtime limitations.

2. **Database Strategy: Dual Write (MongoDB + Cloudflare D1)**
   MongoDB handles the complex, nested JSON structure of the audit engine inputs natively without heavy relational mapping. Cloudflare D1 was added as a robust edge-ready mirror to ensure data durability and fast regional reads if we scale the shareable URLs to run entirely on the edge.

3. **Abuse Protection: Honeypot + IP Rate Limiting over CAPTCHA**
   hCaptcha adds massive friction to conversion rates on lead capture forms. We opted for a hidden honeypot field (to trap dumb bots) combined with strict IP-based rate limiting (`express-rate-limit`) to protect the Anthropic API credits and database without hurting the user experience for legitimate visitors.

4. **Audit Immutability: Computed Once on Creation**
   Audits are computed once and stored in the database, rather than recomputed on each page load. This ensures that when a user shares their audit link 6 months from now, the savings math remains completely stable and accurate to the exact day they ran it, even if underlying SaaS pricing tiers change.

5. **PDF Export: Native Browser Print over Heavy Libraries**
   Rather than bloat the frontend bundle with `jspdf` or `html2pdf.js`, we leveraged native `window.print()` combined with a robust `@media print` CSS block. This provides a clean, perfectly formatted document for finance teams with zero JavaScript overhead.
