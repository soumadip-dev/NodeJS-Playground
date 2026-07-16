-- SELECT * returns all columns from the table.

SELECT *
FROM intermediate.products;

-- Select only the columns you need.

SELECT
    name,
    category
FROM intermediate.products;

-- Column aliases (AS) provide temporary names in the query result.
-- They improve readability without changing the actual column names.

SELECT
    name AS product_name,
    price AS product_price,
    stock AS available_quantity
FROM intermediate.products;

-- ==========================================================
-- Filtering rows with WHERE
-- ==========================================================

-- Example API:
-- GET /products?category=electronics

SELECT
    name,
    category
FROM intermediate.products
WHERE category = 'electronics';

-- Products with a price greater than 1000

SELECT
    name,
    price
FROM intermediate.products
WHERE price > 1000;

-- Products that are not active

SELECT
    name,
    is_active
FROM intermediate.products
WHERE is_active = FALSE;
-- You can also write:
-- WHERE NOT is_active;

-- ==========================================================
-- Logical Operators
-- ==========================================================
-- AND -> Every condition must be TRUE.
-- OR  -> At least one condition must be TRUE.
-- NOT -> Reverses (negates) a condition.

-- Electronics products with a price greater than 3000

SELECT
    name,
    category,
    price
FROM intermediate.products
WHERE category = 'electronics'
  AND price > 3000;

-- Products whose category is either electronics or furniture

SELECT
    name,
    category
FROM intermediate.products
WHERE category = 'electronics'
   OR category = 'furniture';

-- Better:
-- WHERE category IN ('electronics', 'furniture');

-- Products whose category is NOT electronics

SELECT
    name,
    category
FROM intermediate.products
WHERE NOT (category = 'electronics');

-- Electronics or furniture products that are in stock

SELECT
    name,
    category,
    price,
    stock,
    description
FROM intermediate.products
WHERE (category = 'electronics'
       OR category = 'furniture')
  AND stock > 0;

-- Better:
-- WHERE category IN ('electronics', 'furniture')
--   AND stock > 0;