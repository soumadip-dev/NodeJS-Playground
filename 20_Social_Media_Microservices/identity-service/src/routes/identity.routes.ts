import { Router } from 'express';
import { registerUser } from '../controllers/identity.controller';

const router = Router();

router.get('/register', registerUser);

export default router;
