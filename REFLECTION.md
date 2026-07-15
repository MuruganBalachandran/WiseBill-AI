# Reflection

## What went well
- **Dual-Database Architecture:** Using MongoDB for nested JSON objects and Cloudflare D1 as a mirror was a great decision. It provides the flexibility of NoSQL for rapid iteration while maintaining a durable, edge-ready SQLite backup.
- **The Viral Loop:** Dynamically generating Open Graph images via `next/og` on the Edge based on real savings data is a massive acquisition lever.
- **Pure Function Audit Engine:** Decoupling the audit engine into a pure function `(inputs) => outputs` made it incredibly easy to test (see `TESTS.md`) and guarantees defensible math.

## What I would do differently
- **State Management:** Currently, form state is held in React state and persisted to `localStorage`. If the app scales, moving this to a URL-encoded state (like `?tools=...`) would make the input phase shareable and instantly reproducible without relying on local storage.
- **Pricing Data Updates:** `PRICING_DATA.md` and the hardcoded `tools.ts` configuration are great for an MVP, but a production app would need a CMS or an automated scraper to ensure pricing logic never drifts from reality.
- **Auth:** While the brief explicitly requested *no* login, adding optional OAuth (Google/GitHub) for returning users to track their savings over time would be a powerful retention mechanism.
