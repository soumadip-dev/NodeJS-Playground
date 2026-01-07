import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

// Health check route
router.get('/', healthCheck);

export default router;
