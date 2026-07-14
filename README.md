# WiseBill AI

An AI spend audit tool: paste in what your team pays for Cursor, Copilot, Claude, ChatGPT,
and friends, and get an instant, defensible breakdown of where you're overpaying, what to
switch to, and how much you'd save monthly and annually.

Built for founders and small teams who've never once compared their AI tool bill against
what they actually use it for.

## Screenshots

_[Add 3+ screenshots or a 30-second Loom link here once the UI exists — Day 3/4]_

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

Environment variables needed (see `.env.example` in each folder once added):
- `MONGODB_URI`
- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY`

## Deploy

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas (free tier)

Live demo: _[add deployed URL — Day 4]_

## Decisions

_(5 trade-offs, to be filled in as they're made through the week — see DEVLOG.md for the
real-time version of this)_

1. Audits are computed once and stored, not recomputed on each view, so a shared link
   stays stable even if pricing data changes later — see ARCHITECTURE.md.
2. TypeScript over plain JS for both client and server, since the audit engine's math
   is exactly the kind of logic that benefits from compile-time checking.
3. _[fill in — e.g. why Vite over Next.js]_
4. _[fill in — e.g. why rate limiting over hCaptcha for abuse protection]_
5. _[fill in — e.g. why Resend over SES]_
