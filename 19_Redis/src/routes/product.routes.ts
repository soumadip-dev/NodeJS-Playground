import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { productRateLimitMiddleware } from '../middleware/rateLimit.middleware';

const router = Router();

router.use(productRateLimitMiddleware);

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);

export default router;
