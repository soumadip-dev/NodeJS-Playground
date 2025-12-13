const express = require('express');
const { createAuthor, createBook, getBooksWithAuthors } = require('../controller/Book.controller');

const router = express.Router();

// Route to create a new author
router.post('/author', createAuthor);

// Route to create a new book
router.post('/book', createBook);

// Route to get book with autor details
router.get('/book', getBooksWithAuthors);

module.exports = router;
