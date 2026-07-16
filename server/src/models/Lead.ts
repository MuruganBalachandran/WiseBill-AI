// region imports
import mongoose, { Schema } from 'mongoose';
import { ILead } from '../types/index.js';
// endregion

// region lead schema
const LeadSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    companyName: { type: String },
    role: { type: String },
    teamSize: { type: Number },
    savingsPotential: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
// endregion

// region export
export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
// endregion
