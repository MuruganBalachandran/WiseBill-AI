# Devlog

One entry per day, honest hours included, even on light days.

## Day 1 — 2026-07-14
**Hours worked:** [3 hours]
**What I did:** Named the product (WiseBill AI), finalized the MVP tool list (Cursor,
Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, v0), finalized the data
model (Audit/SpendInput/AuditResult/Lead, with the audit computed-once-and-stored
decision), drafted the architecture and Mermaid diagram, wrote the audit engine's five
decision rules in prose, pulled and verified real pricing for all 8 tools into
PRICING_DATA.md against official vendor pages, drafted and sent interview outreach to
6 people, and scaffolded the repo with an empty-but-real CI job.
**What I learned:** Vendor tier names drift more than expected — Cursor dropped the
"Business" label for "Teams" at some point, and GitHub Copilot moved to credit-based
billing in mid-2026. Had to explicitly document both mappings in PRICING_DATA.md rather
than silently assume the assignment's tier names still match the current UI.
**Blockers / what I'm stuck on:** Still deciding on the exact numeric threshold for the
cross-tool substitution rule (rule 3) — need it to be defensible ("a finance person
would agree") rather than a hardcoded "cheaper tool wins," so this needs another pass
before Day 2's implementation.
**Plan for tomorrow:** Implement the audit engine as a pure TypeScript function against
today's prose spec, wire the Express API skeleton, write the first 5 tests against the
engine, get CI green for real (not just present).
