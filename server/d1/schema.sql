-- Cloudflare D1 schema for WiseBill AI leads
-- Run this once in the D1 dashboard under your database → Console

CREATE TABLE IF NOT EXISTS leads (
  id           TEXT PRIMARY KEY,
  audit_id     TEXT NOT NULL,
  email        TEXT NOT NULL,
  company_name TEXT,
  role         TEXT,
  team_size    INTEGER,
  consented_at TEXT NOT NULL,
  email_sent   INTEGER DEFAULT 0,
  created_at   TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
