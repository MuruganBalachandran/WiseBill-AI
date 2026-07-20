# Developer Log

## Day 1 — 2026-07-10
**Hours worked:** 4
**What I did:** Bootstrapped the Next.js frontend and Express backend. Set up the strict file structure required by Techvruk. Built the `SpendInputForm` component with localStorage persistence.
**What I learned:** Next.js 16 Server Components make it much easier to isolate state. I successfully split the client-heavy form from the static layouts.
**Blockers / what I'm stuck on:** Figuring out how to sync the complex nested state of `SpendInputForm` arrays to localStorage without hydration mismatch errors.
**Plan for tomorrow:** Build the core financial math inside `auditEngine.ts`.

## Day 2 — 2026-07-11
**Hours worked:** 5
**What I did:** Implemented the `auditEngine.ts`. Compiled `PRICING_DATA.md` from 8 different AI vendors. Wrote the mathematical rules for phantom seats, API routing, and IDE superiority.
**What I learned:** AI tool pricing is incredibly opaque. Many "Team" plans enforce hidden 5-seat minimums, which makes the logic complex but highly valuable.
**Blockers / what I'm stuck on:** None today.
**Plan for tomorrow:** Build the `AuditResults` UI and make it look premium.

## Day 3 — 2026-07-12
**Hours worked:** 3
**What I did:** Built the `AuditResults.tsx` glassmorphism UI. Implemented the dual-state Lead Capture form (High Savings vs. Optimal).
**What I learned:** Tailwind's `backdrop-blur` mixed with gradient borders looks fantastic for financial tools.
**Blockers / what I'm stuck on:** Design paralysis. Trying to make it look exactly like the Techvruk style guide.
**Plan for tomorrow:** Hook up the Anthropic API for the executive summary.

## Day 4 — 2026-07-13
**Hours worked:** 4
**What I did:** Built the `/api/audits` Express endpoint. Integrated Anthropic's Claude 3.5 Sonnet to generate the 100-word executive summary. Handled timeouts.
**What I learned:** Prompt engineering for financial summaries requires strict length constraints in the system prompt, otherwise the LLM hallucinates fake savings.
**Blockers / what I'm stuck on:** API latency is high (3-4 seconds). Added a loading skeleton.
**Plan for tomorrow:** Build the backend Lead storage and abuse protection.

## Day 5 — 2026-07-14
**Hours worked:** 4
**What I did:** Created the `Lead` MongoDB schema. Implemented dual-layer abuse protection (Rate Limiter + UI Honeypot). Added the Resend transactional email stub.
**What I learned:** Honeypots are much better for B2B conversion rates than hCaptcha because they require no cookies and zero user friction.
**Blockers / what I'm stuck on:** Connecting Express to Next.js locally caused some CORS issues initially.
**Plan for tomorrow:** Viral loop (Shareable URL) and Open Graph tags.

## Day 6 — 2026-07-15
**Hours worked:** 3
**What I did:** Created `app/audit/[slug]/page.tsx` for the shareable URL. Stripped PII on the backend. Added dynamic Open Graph `<meta>` tags.
**What I learned:** `generateMetadata` in Next.js is incredibly powerful for programmatic SEO and viral Twitter cards.
**Blockers / what I'm stuck on:** Conflicting `[id]` and `[slug]` dynamic routes crashed the Next.js build. Had to manually clear the `.next` cache.
**Plan for tomorrow:** Bonus features and final polish.

## Day 7 — 2026-07-16
**Hours worked:** 5
**What I did:** Cleaned up the repo. Added native PDF Export using `window.print()` and `@media print` CSS. Added the Benchmark progress bar UI. Created the Embeddable Widget route. Wrote all entrepreneurial markdown files.
**What I learned:** Native `window.print()` combined with targeted `.no-print` CSS classes is incredibly lightweight and completely eliminates the need for heavy libraries like `react-to-pdf` or Puppeteer.
**Blockers / what I'm stuck on:** None. The project is complete.
**Plan for tomorrow:** Submit and rest!
