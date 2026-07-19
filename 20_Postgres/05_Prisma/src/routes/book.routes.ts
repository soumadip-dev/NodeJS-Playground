import { Router } from 'express';
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/book.controller';

const router = Router();

//* Add a new book
router.post('/', addBook);

//* Get all books
router.get('/', getAllBooks);

//* Get a single book by ID
router.get('/:id', getBookById);

//* Update a book by ID
router.put('/:id', updateBook);

//* Delete a book by ID
router.delete('/:id', deleteBook);

export default router;
