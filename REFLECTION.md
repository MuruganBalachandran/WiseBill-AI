# Reflection

### 1. The hardest bug you hit this week, and how you debugged it
The hardest bug was a Next.js `Ambiguous app routes detected` build error that occurred when I attempted to build the viral loop. I had accidentally created two dynamic routing folders at the same depth (`app/audit/[id]` and `app/audit/[slug]`). 
**Hypothesis:** I assumed simply deleting the `[id]` folder via terminal would fix it.
**What I tried:** I ran the standard file removal commands, but the error persisted. 
**What worked:** I realized the terminal interpreted brackets as wildcard regex characters, so the folder was silently failing to delete. I used the literal path flag to force the deletion, then completely purged the build cache directory and ran a fresh build. The ambiguity was resolved.

### 2. A decision you reversed mid-week, and what made you reverse it
Mid-week, I reversed the decision to use hCaptcha for abuse protection on the Lead Capture form. 
I initially planned to use it, but realized that targeting busy financial leaders requires absolute minimum friction. Adding a CAPTCHA challenge or loading third-party scripts would negatively impact conversion rates. I reversed course and built a dual-layer invisible system: a strict IP rate-limiter and a hidden CSS honeypot field that traps bots without real users ever seeing it.

### 3. What you would build in week 2 if you had it
I would build the "1-Click Vendor Migration" workflow. Right now, we tell users they are wasting money and provide a PDF. In Week 2, I would integrate with the APIs of identity providers to auto-discover their active seats, and provide a dashboard where we can instantly downgrade their licenses via the vendor's API on their behalf. 

### 4. How you used AI tools
I used AI heavily for boilerplate generation and styling iteration. I trusted it to scaffold the complex UI components quickly.
**What I didn't trust:** I strictly did not trust the AI with the financial logic in the audit engine. I hardcoded those mathematical rules myself based on real pricing data.
**When the AI was wrong:** When writing the Next.js routing function for the viral loop, the AI hallucinated an outdated syntax. I caught it because it failed the TypeScript check, and I manually rewrote it using the modern standard.

### 5. Self-rating (1–10)
- **Discipline (9/10):** Maintained consistent daily commits across the week without last-minute cramming.
- **Code Quality (8/10):** Clean component separation and strong types, though the controllers could use a service-layer refactor.
- **Design Sense (9/10):** The UI feels highly premium, utilizing deep gradients, animations, and clean data visualization.
- **Problem-Solving (9/10):** Successfully navigated complex caching bugs and implemented robust honeypot logic.
- **Entrepreneurial Thinking (10/10):** Treated this like a real product launch rather than just a coding test.
