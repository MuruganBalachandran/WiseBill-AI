// region imports
import { Request, Response } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendSuccess, sendError, generateSlug } from '../utils/index.js';
import { Audit, Lead } from '../models/index.js';
import { runAudit, generateAiSummary, insertLeadToD1, sendConfirmationEmail } from '../services/index.js';
// endregion

// region create audit
export const createAudit = async (req: Request, res: Response) => {
  try {
    const { teamSize, primaryUseCase, spendInputs } = req.body;

    // Validation
    if (!teamSize || typeof teamSize !== 'number' || teamSize < 1) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Invalid team size. Must be a number >= 1.');
    }

    if (!primaryUseCase || !['coding', 'writing', 'data', 'research', 'mixed'].includes(primaryUseCase)) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Invalid primary use case.');
    }

    if (!spendInputs || !Array.isArray(spendInputs) || spendInputs.length === 0) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Invalid spend inputs. Must be a non-empty array.');
    }

    // Run pure audit engine logic
    const auditEngineResult = runAudit(spendInputs, teamSize, primaryUseCase);

    // Generate unique slug
    let publicSlug = generateSlug(10);
    // Double check uniqueness (highly unlikely collision but safe)
    let isExistingSlug = await Audit.findOne({ publicSlug });
    while (isExistingSlug) {
      publicSlug = generateSlug(10);
      isExistingSlug = await Audit.findOne({ publicSlug });
    }

    // Run AI summary generation
    const aiResult = await generateAiSummary({
      teamSize,
      primaryUseCase,
      spendInputs,
      results: auditEngineResult.results,
      totalMonthlySavings: auditEngineResult.totalMonthlySavings,
      totalAnnualSavings: auditEngineResult.totalAnnualSavings,
    });

    // Save audit snapshot to database
    const newAudit = new Audit({
      publicSlug,
      teamSize,
      primaryUseCase,
      spendInputs,
      results: auditEngineResult.results,
      totalMonthlySavings: auditEngineResult.totalMonthlySavings,
      totalAnnualSavings: auditEngineResult.totalAnnualSavings,
      aiSummary: aiResult.summary,
      aiSummaryFallbackUsed: aiResult.fallbackUsed,
      pricingSnapshotDate: new Date('2026-07-14'),
      leadId: null,
    });

    const savedAudit = await newAudit.save();

    return sendSuccess(res, HttpStatus.CREATED, savedAudit, 'Audit created successfully');
  } catch (error) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, (error as Error).message ?? 'An error occurred');
  }
};
// endregion

// region get audit by slug
export const getAuditBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Audit slug is required.');
    }

    const audit = await Audit.findOne({ publicSlug: slug });
    if (!audit) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Audit not found.');
    }

    // Strip identifying leadId for public URL protection
    const publicAudit = audit.toObject() as any;
    delete publicAudit.leadId;

    return sendSuccess(res, HttpStatus.OK, publicAudit, 'Audit retrieved successfully');
  } catch (error) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, (error as Error).message ?? 'An error occurred');
  }
};
// endregion

// region create lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const { auditId, email, companyName, role, teamSize, website } = req.body;

    // ── Abuse protection layer 2: Honeypot field ─────────────────────────────
    // The `website` field is hidden in the UI (absolute-positioned, off-screen).
    // Legitimate users never fill it. Bots do. Silently accept but don't persist.
    if (website) {
      // Return a fake success so bots don't know they were filtered
      return sendSuccess(res, HttpStatus.CREATED, {}, 'Lead captured successfully');
    }

    if (!auditId) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Audit ID is required.');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'A valid email address is required.');
    }

    // Verify audit exists
    const associatedAudit = await Audit.findById(auditId);
    if (!associatedAudit) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Associated audit not found.');
    }

    // ── Save to MongoDB (source of truth) ────────────────────────────────────
    const newLead = new Lead({
      auditId,
      email,
      companyName: companyName ?? null,
      role: role ?? null,
      teamSize: teamSize ?? null,
      emailSent: false,
    });

    const savedLead = await newLead.save();

    // Link leadId back to audit
    associatedAudit.leadId = savedLead._id as any;
    await associatedAudit.save();

    // ── Mirror to Cloudflare D1 (non-blocking) ────────────────────────────────
    // Fires and forgets — failure does not affect the response
    insertLeadToD1({
      id: (savedLead._id as any).toString(),
      auditId,
      email,
      companyName: companyName ?? null,
      role: role ?? null,
      teamSize: teamSize ?? null,
      consentedAt: (savedLead.consentedAt ?? new Date()).toISOString(),
      emailSent: false,
    }).catch(err => console.error('[D1] Background insert failed:', err));

    // ── Send transactional confirmation email via Resend (non-blocking) ───────
    const isHighSavings = associatedAudit.totalMonthlySavings >= 500;
    sendConfirmationEmail({
      to: email,
      auditSlug: associatedAudit.publicSlug,
      companyName: companyName ?? null,
      totalMonthlySavings: associatedAudit.totalMonthlySavings,
      totalAnnualSavings: associatedAudit.totalAnnualSavings,
      isHighSavings,
    }).then(sent => {
      if (sent) {
        // Update emailSent flag asynchronously
        Lead.findByIdAndUpdate(savedLead._id, { emailSent: true }).catch(console.error);
      }
    }).catch(err => console.error('[Resend] Background email failed:', err));

    return sendSuccess(res, HttpStatus.CREATED, savedLead, 'Lead captured successfully');
  } catch (error) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, (error as Error).message ?? 'An error occurred');
  }
};
// endregion
