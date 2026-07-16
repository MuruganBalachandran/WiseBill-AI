// region imports
import { Router } from 'express';
import auditRoutes from './audit.js';
import leadRoutes from './lead.js';
// endregion

// region config
const router = Router();
// endregion

// region routes
router.use('/audits', auditRoutes);
router.use('/leads', leadRoutes);
// endregion

// region exports
export default router;
// endregion
