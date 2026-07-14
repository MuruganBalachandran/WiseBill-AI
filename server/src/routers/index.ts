import { Router } from 'express';
import auditRoutes from './audit.js';
import leadRoutes from './lead.js';
// endregion

const router = Router();

router.use('/audits', auditRoutes);
router.use('/leads', leadRoutes);

export default router;
