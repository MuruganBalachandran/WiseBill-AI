# Metrics & Instrumentation

## North Star Metric
**Total Annualized Savings Identified ($)**
*Why:* This is the purest measure of value creation. If WiseBill AI audits 10,000 companies but identifies $0 in savings, the tool is mathematically useless. By optimizing for "Savings Identified", we ensure our Audit Engine logic remains aggressive, accurate, and highly valuable to the CFO persona.

## 3 Input Metrics
To drive the North Star, we must track and optimize these inputs:
1. **Audit Completion Rate (%)**: Percentage of users who start the form vs. those who click "Run Audit". High drop-off indicates friction in the UI or missing tools.
2. **Viral Share Rate (%)**: Percentage of completed audits where the user clicks "Share Audit" or "Export PDF". This drives our $0 CAC loop.
3. **High-Value Lead Capture Rate (%)**: Percentage of users with >$500/mo in savings who actually submit their email to book a Techvruk consultation.

## What I'd Instrument First
I would integrate **PostHog**:
- `form_started`: Fired when the first tool is selected.
- `audit_completed`: Fired when the backend returns a 201, carrying properties: `team_size`, `total_savings`.
- `pdf_downloaded`: Fired on click.
- `lead_captured`: Fired on successful form submission.
- **Session Replays:** Enabled specifically for users who drop off *during* the Spend Input Form to see if they are getting stuck searching for a niche tool we don't support yet.

## Pivot Decision Trigger
If the **High-Value Lead Capture Rate drops below 2%** for three consecutive weeks, it triggers a pivot.
*Why:* A <2% capture rate on >$500/mo savings means users don't trust our math, or the friction to talk to sales is too high. The pivot would be to remove the "Book a Consultation" sales motion entirely and replace it with a self-serve "Click here to instantly downgrade your seats via API" product.
