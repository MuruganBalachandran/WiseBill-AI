// region imports
import rateLimit from 'express-rate-limit';
// endregion

//region rate limiter
export const leadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 5,              // max 5 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment before trying again.',
  },
});
// endregion