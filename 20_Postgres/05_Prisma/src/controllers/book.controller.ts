import { Request, Response } from 'express';
import {
  addBook as addBookService,
  getAllBooks as getAllBooksService,
  getBookById as getBookByIdService,
  updateBookById as updateBookService,
  deleteBook as deleteBookService,
} from '../services/book.services';
import type { MessageResponse } from '../interfaces/message-response';
import type { ErrorResponse } from '../interfaces/error-response';

//* Controller to add a new book
const addBook = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const { title, publishedDate, authorId } = req.body;

    if (!title || !publishedDate || !authorId) {
      throw new Error('All fields are required ❌');
    }

    const book = await addBookService(title, new Date(publishedDate), authorId);

    res.status(201).json({
      message: 'Book created successfully ✅',
      success: true,
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to create book ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

//* Controller to get all books
const getAllBooks = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const books = await getAllBooksService();
    res.status(200).json({
      message: 'Books fetched successfully ✅',
      success: true,
      data: books,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to fetch books ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

//* Controller to get a single book by ID
const getBookById = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new Error('Invalid book ID ❌');
    }

    const book = await getBookByIdService(id);

    if (book) {
      res.status(200).json({
        message: 'Book fetched successfully ✅',
        success: true,
        data: book,
      });
    } else {
      res.status(404).json({
        message: `Book with ID ${id} not found ❌`,
        success: false,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'Failed to fetch book ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

//* Controller to update a book by ID
const updateBook = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const id = Number(req.params.id);
    const { title } = req.body;

    if (isNaN(id)) {
      throw new Error('Invalid book ID ❌');
    }

    if (!title) {
      throw new Error('Title is required ❌');
    }

    const updatedBook = await updateBookService(id, title);

    res.status(200).json({
      message: 'Book updated successfully ✅',
      success: true,
      data: updatedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to update book ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

//* Controller to delete a book by ID
const deleteBook = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new Error('Invalid book ID ❌');
    }

    const deletedBook = await deleteBookService(id);

    res.status(200).json({
      message: `Book with ID ${id} deleted successfully ✅`,
      success: true,
      data: deletedBook,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to delete book ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

export { addBook, getAllBooks, getBookById, updateBook, deleteBook };
