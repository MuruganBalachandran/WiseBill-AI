// region imports
import { Request, Response } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendSuccess, sendError, generateSlug } from '../utils/common.js';
import { validateTeamSize, validatePrimaryUseCase, validateSpendInputs } from '../utils/validation.js';
import { findAuditBySlug, createAuditRecord } from '../queries/index.js';
import { runAudit, generateAiSummary } from '../services/index.js';
// endregion

// region create audit
export const createAudit = async (req: Request, res: Response) => {
  try {
    const { teamSize, primaryUseCase, spendInputs, website } = req.body;

    // Honeypot check for bots
    if (website) {
      // Return 200 to trick the bot, but do nothing
      return sendSuccess(res, HttpStatus.OK, null, 'Audit created successfully');
    }
    // Validation
    const teamSizeVal = validateTeamSize(teamSize);
    if (!teamSizeVal.valid) {
      return sendError(res, HttpStatus.BAD_REQUEST, teamSizeVal.error!);
    }

    const useCaseVal = validatePrimaryUseCase(primaryUseCase);
    if (!useCaseVal.valid) {
      return sendError(res, HttpStatus.BAD_REQUEST, useCaseVal.error!);
    }

    const spendInputsVal = validateSpendInputs(spendInputs);
    if (!spendInputsVal.valid) {
      return sendError(res, HttpStatus.BAD_REQUEST, spendInputsVal.error!);
    }

    // Run pure audit engine logic
    const auditEngineResult = runAudit(spendInputs, teamSize, primaryUseCase);

    // Generate unique slug
    let publicSlug = generateSlug(10);
    // Double check uniqueness (highly unlikely collision but safe)
    let isExistingSlug = await findAuditBySlug(publicSlug);
    while (isExistingSlug) {
      publicSlug = generateSlug(10);
      isExistingSlug = await findAuditBySlug(publicSlug);
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
    const savedAudit = await createAuditRecord({
      publicSlug,
      teamSize,
      primaryUseCase,
      spendInputs,
      results: auditEngineResult.results,
      totalMonthlySavings: auditEngineResult.totalMonthlySavings,
      totalAnnualSavings: auditEngineResult.totalAnnualSavings,
      aiSummary: aiResult.summary,
      aiSummaryFallbackUsed: aiResult.fallbackUsed,
      pricingSnapshotDate: new Date(),
      leadId: null,
    });

    // send success
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

    const audit = await findAuditBySlug(slug as string);
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
