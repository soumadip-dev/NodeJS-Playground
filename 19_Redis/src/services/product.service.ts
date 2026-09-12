import { pool } from '../db/pool';
import { redisClient } from '../redis/client';
import { Product, ProductRow, CreateProductInput, UpdateProductInput } from '../types/product';

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    stock: row.stock,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const PRODUCT_ALL_CACHE_KEY = 'products:all';
const PRODUCT_CACHE_TTL_SECONDS = 60;

function getProductCacheKey(productId: number): string {
  return `products:id:${productId}`;
}

export async function fetchAllProductsFromDB(filters: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  let query = 'SELECT * FROM products WHERE 1=1';
  const values: string[] = [];

  if (filters.category) {
    values.push(filters.category);
    query += ` AND LOWER(category) = LOWER($${values.length})`;
  }

  if (filters.search) {
    values.push(`%${filters.search}%`);
    query += ` AND (LOWER(name) LIKE LOWER($${values.length}) OR LOWER(description) LIKE LOWER($${values.length}))`;
  }

  query += ' ORDER BY id ASC';

  const result = await pool.query<ProductRow>(query, values);
  return result.rows.map(mapProductRow);
}

export async function getAllProducts(filters: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  const hasFilters = Boolean(filters.category || filters.search);

  // Filtered product lists use different query combinations,
  // so they should not use the common "products:all" cache key.
  if (hasFilters) {
    console.log('Fetching filtered products directly from the database');
    return fetchAllProductsFromDB(filters);
  }

  const cachedProducts = await redisClient.GET(PRODUCT_ALL_CACHE_KEY);

  if (cachedProducts) {
    console.log('Cache hit: products:all');
    return JSON.parse(cachedProducts) as Product[];
  }

  console.log('Cache miss: products:all');

  const products = await fetchAllProductsFromDB(filters);

  // Store the products in Redis with a 60-second expiration.
  await redisClient.SETEX(
    PRODUCT_ALL_CACHE_KEY,
    PRODUCT_CACHE_TTL_SECONDS,
    JSON.stringify(products)
  );

  console.log('Cache set: products:all');

  return products;
}

export async function fetchSingleProductFromDB(id: number): Promise<Product | null> {
  const result = await pool.query<ProductRow>('SELECT * FROM products WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapProductRow(result.rows[0]);
}

export async function getProductById(id: number): Promise<Product | null> {
  const cacheKey = getProductCacheKey(id);

  const cachedProduct = await redisClient.GET(cacheKey);

  if (cachedProduct) {
    console.log(`Cache hit: ${cacheKey}`);
    return JSON.parse(cachedProduct) as Product;
  }

  console.log(`Cache miss: ${cacheKey}`);

  const product = await fetchSingleProductFromDB(id);

  // Store the product in Redis with a 60-second expiration.
  await redisClient.SETEX(cacheKey, PRODUCT_CACHE_TTL_SECONDS, JSON.stringify(product));

  console.log(`Cache set: ${cacheKey}`);

  return product;
}

async function deleteProductsAllCache(): Promise<void> {
  await redisClient.del(PRODUCT_ALL_CACHE_KEY);
  console.log('Cache deleted: products:all');
}

async function deleteProductCache(id: number): Promise<void> {
  const cacheKey = getProductCacheKey(id);
  await redisClient.del(cacheKey);
  console.log(`Cache deleted: ${cacheKey}`);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const result = await pool.query<ProductRow>(
    `INSERT INTO products (name, description, price, category, stock)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [input.name, input.description, input.price, input.category, input.stock]
  );

  const newlyCreatedProduct = mapProductRow(result.rows[0]);

  // Invalidate the cached product list after creating a product.
  await deleteProductsAllCache();

  return newlyCreatedProduct;
}

export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<Product | null> {
  const existingProduct = await getProductById(id);

  if (!existingProduct) {
    return null;
  }

  const name = input.name ?? existingProduct.name;
  const description = input.description ?? existingProduct.description;
  const price = input.price ?? existingProduct.price;
  const category = input.category ?? existingProduct.category;
  const stock = input.stock ?? existingProduct.stock;

  const result = await pool.query<ProductRow>(
    `UPDATE products
     SET name = $1,
         description = $2,
         price = $3,
         category = $4,
         stock = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [name, description, price, category, stock, id]
  );

  const updatedProduct = mapProductRow(result.rows[0]);

  await deleteProductsAllCache();
  await deleteProductCache(id);

  return updatedProduct;
}
