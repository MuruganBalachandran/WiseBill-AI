// region imports
import { Router } from 'express';
import { createAudit } from '../controllers/index.js';
// endregion

const router = Router();

router.post('/', createAudit);

export default router;
