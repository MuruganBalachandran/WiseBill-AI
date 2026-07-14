// region imports
import rateLimit from 'express-rate-limit';
// endregion

/**
 * Rate limiter for the lead capture endpoint.
 * Abuse protection layer 1: 5 submissions per IP per 60 seconds.
 * Returns structured JSON 429 response matching the rest of the API.
 *
 * Chosen over hCaptcha to avoid GDPR cookies and third-party JS load.
 * Paired with a honeypot field (checked in the controller) for dual-layer protection.
 */
export const leadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 seconds
  max: 5,              // max 5 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment before trying again.',
  },
  keyGenerator: (req) => {
    // Respect X-Forwarded-For from proxies (Cloudflare, etc)
    return (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ?? req.ip ?? 'unknown';
  },
});

