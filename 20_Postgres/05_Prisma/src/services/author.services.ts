import { prisma } from '../../prisma';

//* Create a new author
async function addAuthor(name: string) {
  try {
    const createdAuthor = await prisma.author.create({
      data: {
        name,
      },
    });

    return createdAuthor;
  } catch (error) {
    console.error('Error creating author ❌', error);
    throw error;
  }
}

//* Delete an author by ID along with related books
async function deleteAuthor(id: number) {
  try {
    const deletedAuthor = await prisma.author.delete({
      where: { id },
      include: { books: true },
    });

    return deletedAuthor;
  } catch (error) {
    console.error('Error deleting author ❌', error);
    throw error;
  }
}

export { addAuthor, deleteAuthor };
