// region imports
import { Request, Response, NextFunction } from 'express';
// endregion

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // rate limiting logic
  next();
};
