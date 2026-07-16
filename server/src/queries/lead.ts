// region imports
import { Lead } from '../models/index.js';
import { ILead } from '../types/index.js';
// endregion

// region lead queries
export const createLeadRecord = async (data: Partial<ILead>): Promise<ILead> => {
  const newLead = new Lead(data);
  return await newLead.save();
};

export const updateLeadEmailSentStatus = async (leadId: string, status: boolean): Promise<ILead | null> => {
  return await Lead.findByIdAndUpdate(leadId, { emailSent: status }, { new: true });
};
// endregion
