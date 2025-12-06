const express = require('express');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
} = require('../controller/book.controller');

const router = express.Router();

// Get all books
router.get('/books', getAllBooks);

// Get a single book by ID
router.get('/books/:id', getBookById);

// Add a new book
router.post('/books', createBook);

// Update a book by ID
router.put('/books/:id', updateBookById);

// Delete a book by ID
router.delete('/books/:id', deleteBookById);

module.exports = router;
