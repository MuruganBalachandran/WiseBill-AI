// region imports
import { Router } from 'express';
import { createLead } from '../controllers/index.js';
import { leadRateLimiter } from '../middlewares/index.js';
// endregion

// router initiate
const router = Router();

// region routes
router.post('/', leadRateLimiter, createLead);
// endregion

// region export
export default router;
// endregion
