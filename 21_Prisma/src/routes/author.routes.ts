import { Router } from 'express';
import { addNewAuthor } from '../controllers/author.controller';

const router = Router();

router.post('/', addNewAuthor);

export default router;
