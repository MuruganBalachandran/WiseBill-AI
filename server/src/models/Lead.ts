// region imports
import mongoose, { Schema } from 'mongoose';
import { ILead } from '../types/index.js';
// endregion

// region lead schema
const LeadSchema: Schema = new Schema(
  {
    auditId: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, default: null },
    role: { type: String, default: null },
    teamSize: { type: Number, default: null },
    savingsPotential: { type: Number, default: 0 },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
// endregion

// region export
export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
// endregion
