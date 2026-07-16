// region imports
import mongoose, { Document, Schema } from 'mongoose';
// endregion

// region lead interface
export interface ILead extends Document {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  savingsPotential?: number;
  createdAt: Date;
}
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
