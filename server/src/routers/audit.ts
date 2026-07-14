// region imports
import { Router } from 'express';
import { createAudit, getAuditBySlug } from '../controllers/index.js';
// endregion

const router = Router();

router.post('/', createAudit);
router.get('/:slug', getAuditBySlug);

export default router;
