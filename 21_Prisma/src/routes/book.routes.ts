import { Router } from 'express';
import { addBook, getAllBooks, getBookById } from '../controllers/book.controller';

const router = Router();

//* Add a new book
router.post('/', addBook);

//* Get all books
router.get('/', getAllBooks);

//* Get a single book by ID
router.get('/:id', getBookById);

export default router;
