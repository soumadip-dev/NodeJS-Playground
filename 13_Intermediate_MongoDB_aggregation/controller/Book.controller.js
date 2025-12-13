const Author = require('../models/Author.model');
const Book = require('../models/Book.model');

// Controller to create a new author
const createAuthor = async (req, res) => {
  try {
    const author = new Author(req.body);

    await author.save();

    res.status(201).json({
      success: true,
      message: 'Author created successfully ✍️',
      data: author,
    });
  } catch (error) {
    console.log('Error creating author ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating author ⚠️',
    });
  }
};

// Controller to create a new book
const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);

    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully ✍️',
      data: book,
    });
  } catch (error) {
    console.log('Error creating book ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating book ⚠️',
    });
  }
};

// Controller to fetch books along with author details
const getBooksWithAuthors = async (req, res) => {
  try {
    const books = await Book.find().populate('author');

    res.status(200).json({
      success: true,
      message: 'Books fetched successfully 📚',
      data: books,
    });
  } catch (error) {
    console.log('Error fetching books ❌', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching books ⚠️',
    });
  }
};

module.exports = {
  createAuthor,
  createBook,
  getBooksWithAuthors,
};
