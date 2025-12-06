const BookModel = require('../models/Book.model');

// Fetch all books
const getAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find({}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    if (books.length > 0) {
      res.status(200).json({
        message: 'All books fetched successfully 📚',
        data: books,
        success: true,
      });
    } else {
      res.status(200).json({
        message: 'No books found',
        data: [],
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

// Fetch a single book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BookModel.findById(id, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });

    if (book) {
      res.status(200).json({
        message: `Book with id ${id} fetched successfully 📘`,
        data: book,
        success: true,
      });
    } else {
      res.status(404).json({
        message: `Book with id ${id} not found ❌`,
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;

    const newBook = await BookModel.create({ title, author, year });

    res.status(201).json({
      message: 'Book created successfully 🎉',
      data: newBook,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

// Update a book by ID
const updateBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBookData = req.body;
    const updatedBook = await BookModel.findByIdAndUpdate(id, updatedBookData, { new: true });

    if (updatedBook) {
      res.status(200).json({
        message: `Book with id ${id} updated successfully ✏️`,
        data: updatedBook,
        success: true,
      });
    } else {
      res.status(404).json({
        message: `Book with id ${id} not found ❌`,
        data: null,
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

// Delete a book by ID
const deleteBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await BookModel.findByIdAndDelete(id);

    if (deletedBook) {
      res.status(200).json({
        message: `Book with id ${id} deleted successfully 🗑️`,
        success: true,
      });
    } else {
      res.status(404).json({
        message: `Book with id ${id} not found ❌`,
        success: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message || 'Something went wrong',
      success: false,
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
};
