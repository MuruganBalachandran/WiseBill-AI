// region imports
import mongoose, { Schema, Document, Model } from 'mongoose';
// endregion

// region interfaces
export interface ILead {
  auditId: mongoose.Types.ObjectId;
  email: string;
  companyName: string | null;
  role: string | null;
  teamSize: number | null;
  consentedAt: Date;
  emailSent: boolean;
}

export interface ILeadDocument extends ILead, Document {}
// endregion

// region schemas
const LeadSchema = new Schema<ILeadDocument>({
  auditId: { type: Schema.Types.ObjectId, ref: 'Audit', required: true, index: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  companyName: { type: String, default: null },
  role: { type: String, default: null },
  teamSize: { type: Number, default: null },
  consentedAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
});
// endregion

// region model
export const Lead: Model<ILeadDocument> = mongoose.models.Lead || mongoose.model<ILeadDocument>('Lead', LeadSchema);
// endregion
