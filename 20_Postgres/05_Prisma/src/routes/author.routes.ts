import { Router } from 'express';
import { addNewAuthor, deleteAuthorById } from '../controllers/author.controller';

const router = Router();

router.post('/', addNewAuthor);
router.delete('/:id', deleteAuthorById);

export default router;
