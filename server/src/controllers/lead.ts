// region imports
import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead.js';
// endregion

// region create lead controller
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, companyName, role, teamSize, savingsPotential, honeypot } = req.body;

    // Abuse protection layer 2: Honeypot field
    if (honeypot && honeypot.length > 0) {
      // Silently accept it to deceive the bot, but do not process.
      return res.status(200).json({ success: true, message: 'Lead captured successfully' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Store in backend
    const newLead = new Lead({ email, companyName, role, teamSize, savingsPotential });
    await newLead.save();

    // Transactional Email Stub (e.g. Resend)
    console.log(`[Resend Email Stub] Sent confirmation email to ${email}`);
    if (savingsPotential && savingsPotential > 500) {
      console.log(`[Resend Email Stub] Notified internal Techvruk team of high-value lead: ${companyName || email}`);
    }

    res.status(201).json({ success: true, message: 'Lead captured successfully', data: newLead });
  } catch (error) {
    next(error);
  }
};
// endregion
