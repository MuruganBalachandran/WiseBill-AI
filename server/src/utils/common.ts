// region imports
import { Response } from 'express';
// endregion

// region utility functions
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const sendSuccess = (res: Response, statusCode: number, data: any = null, message?: string) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, message: string, errors: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
export const generateSlug = (length: number = 10): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
// endregion
