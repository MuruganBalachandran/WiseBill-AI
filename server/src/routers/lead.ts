// region imports
import { Router } from 'express';
import { createLead } from '../controllers/index.js';
import { leadRateLimiter } from '../middlewares/index.js';
// endregion

const router = Router();

// Abuse protection: 5 req/IP/60s rate limit + honeypot checked inside controller
router.post('/', leadRateLimiter, createLead);

export default router;
