import { Router, type Request, type Response } from 'express';
import { APIError, asyncHandler } from '../middleware/errorHandler';

interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Apple iPhone 15' },
  { id: 2, name: 'Samsung 55" Smart TV' },
  { id: 3, name: 'Nike Air Max Shoes' },
  { id: 4, name: 'Dell Inspiron Laptop' },
];

interface CreateItemRequestBody {
  name: string;
}

const router = Router();

//* Controller to fetch all items
const getAllItems = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json(items);
};

//* Create a new item
const createItem = async (
  req: Request<{}, {}, CreateItemRequestBody>,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    throw new APIError('Item name is required', 400);
  }

  const newItem: Item = {
    id: items.length + 1,
    name,
  };

  items.push(newItem);

  res.status(201).json({
    message: 'Item created successfully',
    data: newItem,
  });
};

router.get('/items', asyncHandler(getAllItems));
router.post('/items', asyncHandler(createItem));

export default router;
