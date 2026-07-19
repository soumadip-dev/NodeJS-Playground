import { prisma } from '../../prisma';

//* Create a new book and associate it with an author
async function addBook(title: string, publishedDate: Date, authorId: number) {
  try {
    const createdBook = await prisma.book.create({
      data: {
        title,
        publishedDate,
        author: {
          connect: { id: authorId },
        },
      },
      include: {
        author: true,
      },
    });

    return createdBook;
  } catch (error) {
    console.error('Error creating book ❌', error);
    throw error;
  }
}

//* Fetch all books along with their authors
async function getAllBooks() {
  try {
    const books = await prisma.book.findMany({
      include: {
        author: true,
      },
    });

    return books;
  } catch (error) {
    console.error('Error fetching books ❌', error);
    throw error;
  }
}

//* Fetch a single book by its ID
async function getBookById(id: number) {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      throw new Error(`Book with ID ${id} not found ❌`);
    }

    return book;
  } catch (error) {
    console.error('Error fetching book ❌', error);
    throw error;
  }
}

//* Update the book title
async function updateBookById(id: number, newTitle: string) {
  try {
    // Simple way:
    /*
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!book) {
      throw new Error(`Book with ID ${id} not found ❌`);
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: { title: newTitle },
      include: { author: true },
    });
    */

    // Transaction-based approach:
    const updatedBook = await prisma.$transaction(async prisma => {
      const book = await prisma.book.findUnique({ where: { id } });

      if (!book) {
        throw new Error(`Book with ID ${id} not found ❌`);
      }

      return prisma.book.update({
        where: { id },
        data: { title: newTitle },
        include: { author: true },
      });
    });

    return updatedBook;
  } catch (error) {
    console.error('Error updating book ❌', error);
    throw error;
  }
}

//* Delete a book by its ID
async function deleteBook(id: number) {
  try {
    const deletedBook = await prisma.book.delete({
      where: { id },
      include: { author: true },
    });

    return deletedBook;
  } catch (error) {
    console.error('Error deleting book ❌', error);
    throw error;
  }
}

export { addBook, getAllBooks, getBookById, updateBookById, deleteBook };
