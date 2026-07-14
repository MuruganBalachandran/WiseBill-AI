// region imports
import { Router } from 'express';
import auditRoutes from './audit.js';
// endregion

const router = Router();

router.use('/audits', auditRoutes);

export default router;
