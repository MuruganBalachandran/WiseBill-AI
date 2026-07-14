// region imports
import { Router } from 'express';
import { createLead } from '../controllers/index.js';
// endregion

const router = Router();

router.post('/', createLead);

export default router;
