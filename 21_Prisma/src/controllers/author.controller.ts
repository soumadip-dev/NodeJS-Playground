import type { Request, Response } from 'express';
import type { MessageResponse } from '../interfaces/message-response';
import type { ErrorResponse } from '../interfaces/error-response';
import { addAuthor } from '../services/author.services';

//* Controller to add a new author
const addNewAuthor = async (req: Request, res: Response<MessageResponse | ErrorResponse>) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error('Author name needed ❌');
    }

    const author = await addAuthor(name);
    res.status(201).json({
      message: 'Author created successfully ✅',
      success: true,
      data: author,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'Failed to create author ❌',
      success: false,
      errors: error.errors || undefined,
    });
  }
};

export { addNewAuthor };
