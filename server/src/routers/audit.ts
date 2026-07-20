// region imports
import { Router } from 'express';
import { createAudit, getAuditBySlug } from '../controllers/index.js';
import { auditRateLimiter } from '../middlewares/index.js';
import { PRICING_DATA } from '../constants/pricing.js';
// endregion

// router initiate
const router = Router();

// region routes
router.post('/', auditRateLimiter, createAudit);
router.get('/pricing', (req, res) => {
  res.json({ success: true, data: PRICING_DATA });
});
router.get('/:slug', getAuditBySlug);
// endregion

// region export
export default router;
// endregion
