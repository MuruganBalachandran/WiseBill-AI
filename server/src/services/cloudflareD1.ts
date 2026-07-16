// region imports
import dotenv from 'dotenv';
import { D1LeadRow } from '../types/index.js';
// endregion

// region config
dotenv.config();
// endregion

// region d1 service

/**
 * Inserts a lead into Cloudflare D1 via the REST API.
 * Requires CF_ACCOUNT_ID, CF_D1_DATABASE_ID, and CF_API_TOKEN env vars.
 * Failures are logged but do NOT throw — MongoDB remains the source of truth.
 */
export const insertLeadToD1 = async (lead: D1LeadRow): Promise<void> => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    console.warn('[D1] Cloudflare D1 env vars not configured. Skipping D1 insert.');
    return;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const sql = `
    INSERT INTO leads (id, audit_id, email, company_name, role, team_size, consented_at, email_sent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `.trim();

  const params = [
    lead.id,
    lead.auditId,
    lead.email,
    lead.companyName ?? null,
    lead.role ?? null,
    lead.teamSize ?? null,
    lead.consentedAt,
    lead.emailSent ? 1 : 0,
  ];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[D1] Failed to insert lead: HTTP ${response.status} — ${err}`);
      return;
    }

    const data = await response.json() as any;
    if (!data?.success) {
      console.error('[D1] Insert returned success:false', JSON.stringify(data?.errors));
      return;
    }

    console.log(`[D1] Lead ${lead.id} inserted successfully.`);
  } catch (err) {
    console.error('[D1] Network error inserting lead:', err);
  }
};
// endregion
