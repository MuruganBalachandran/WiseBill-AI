// region imports
import { Request, Response } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendSuccess, sendError, generateSlug } from '../utils/index.js';
import { Audit, Lead } from '../models/index.js';
import { runAudit, generateAiSummary } from '../services/index.js';
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
    const { auditId, email, companyName, role, teamSize } = req.body;

    if (!auditId) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Audit ID is required.');
    }

    if (!email) {
      return sendError(res, HttpStatus.BAD_REQUEST, 'Email address is required.');
    }

    // Verify audit exists
    const associatedAudit = await Audit.findById(auditId);
    if (!associatedAudit) {
      return sendError(res, HttpStatus.NOT_FOUND, 'Associated audit not found.');
    }

    // Create lead
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

    // TODO: Send transactional email (Resend) - Day 3/4 feature

    return sendSuccess(res, HttpStatus.CREATED, savedLead, 'Lead captured successfully');
  } catch (error) {
    return sendError(res, HttpStatus.INTERNAL_SERVER_ERROR, (error as Error).message ?? 'An error occurred');
  }
};
// endregion
