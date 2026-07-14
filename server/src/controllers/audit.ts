// region imports
import { Request, Response } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendSuccess, sendError } from '../utils/index.js';
// endregion

// region create audit
export const createAudit = async (req: Request, res: Response) => {
  try {
    // create audit
    return sendSuccess(res, HttpStatus?.OK, null, 'Audit created successfully');
  } catch (error) {
    // handle error
    return sendError(res, HttpStatus?.INTERNAL_SERVER_ERROR, (error as Error)?.message ?? 'An error occurred');
  }
};
// endregion
