// region imports
import { Audit } from '../models/index.js';
import { IAuditDocument } from '../types/index.js';
// endregion

// region audit queries
export const findAuditBySlug = async (slug: string): Promise<IAuditDocument | null> => {
  return await Audit.findOne({ publicSlug: slug });
};

export const findAuditById = async (id: string): Promise<IAuditDocument | null> => {
  return await Audit.findById(id);
};

export const createAuditRecord = async (data: Partial<IAuditDocument>): Promise<IAuditDocument> => {
  const newAudit = new Audit(data);
  return await newAudit.save();
};

export const updateAuditRecord = async (audit: IAuditDocument): Promise<IAuditDocument> => {
  return await audit.save();
};
// endregion
