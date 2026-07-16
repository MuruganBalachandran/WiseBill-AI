// region imports
import { Request, Response, NextFunction } from 'express';
// endregion

// region logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Simple colored logging based on status
    const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} ${statusColor}${statusCode}${resetColor} - ${duration}ms`);
  });

  next();
};
// endregion
