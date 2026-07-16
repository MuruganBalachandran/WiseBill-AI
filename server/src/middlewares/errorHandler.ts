// region imports
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/index.js';
import { sendError } from '../utils/index.js';
// endregion

// region global middleware
export const globalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = (error as any)?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error?.message ?? 'An unexpected error occurred';

  return sendError(res, statusCode, message);
};
// endregion
