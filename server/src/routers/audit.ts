// region imports
import { Router } from 'express';
import { createAudit, getAuditBySlug } from '../controllers/index.js';
// endregion

// router initiate
const router = Router();

// region routes
router.post('/', createAudit);
router.get('/:slug', getAuditBySlug);
// endregion

// region export
export default router;
// endregion
