// region imports
import { Request, Response } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendSuccess, sendError } from '../utils/common.js';
import { validateEmail } from '../utils/validation.js';
import { findAuditById, updateAuditRecord, createLeadRecord, updateLeadEmailSentStatus } from '../queries/index.js';
import { sendConfirmationEmail } from '../services/index.js';
// endregion

// region create lead controller
export const createLead = async (req: Request, res: Response) => {
  try {
    const { auditId, email, companyName, role, teamSize, website } = req.body;

    // Abuse protection layer 2: Honeypot field 
    // The `website` field is hidden in the UI (absolute-positioned, off-screen).
    // Legitimate users never fill it. Bots do. Silently accept but don't persist.
    if (website) {
      // Return a fake success so bots don't know they were filtered
      return sendSuccess(res, HttpStatus.CREATED, {}, 'Lead captured successfully');
    }

    if (!auditId) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Audit ID is required.');
    }

    if (!email || !validateEmail(email)) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'A valid email address is required.');
    }

    // Verify audit exists
    const associatedAudit = await findAuditById(auditId);
    if (!associatedAudit) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Associated audit not found.');
    }

    // Save to MongoDB (source of truth)
    const savedLead = await createLeadRecord({
      auditId,
      email,
      companyName: companyName ?? null,
      role: role ?? null,
      teamSize: teamSize ?? null,
      emailSent: false,
    });

    // Link leadId back to audit
    associatedAudit.leadId = savedLead._id as any;
    await updateAuditRecord(associatedAudit);



    // Send transactional confirmation email via Resend (non-blocking)
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
        updateLeadEmailSentStatus((savedLead._id as any).toString(), true).catch(console.error);
      }
    }).catch(err => console.error('[Resend] Background email failed:', err));

    return sendSuccess(res, HttpStatus.CREATED, savedLead, 'Lead captured successfully');
  } catch (error) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, (error as Error).message ?? 'An error occurred');
  }
};
// endregion
