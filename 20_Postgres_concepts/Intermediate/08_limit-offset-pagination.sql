-- LIMIT  -> Maximum number of rows to return.
-- OFFSET -> Number of rows to skip before returning results.

-- Return the 5 cheapest products
SELECT
    name,
    price
FROM intermediate.products
ORDER BY price ASC
LIMIT 5;

-- ==========================================================
-- Pagination Example
-- ==========================================================
-- Suppose each page displays 5 products.
--
-- Page 1:
--   LIMIT 5 OFFSET 0
--   Skip 0 rows and return the first 5 rows.
--
-- Page 2:
--   LIMIT 5 OFFSET 5
--   Skip the first 5 rows and return the next 5 rows.
--
-- Page 3:
--   LIMIT 5 OFFSET 10
--   Skip the first 10 rows and return the next 5 rows.
--
-- Formula:
-- OFFSET = (Page Number - 1) * LIMIT
-- ==========================================================

-- Page 1
SELECT
    name,
    description,
    price
FROM intermediate.products
ORDER BY price ASC
LIMIT 5 OFFSET 0;

-- Page 2
SELECT
    name,
    description,
    price
FROM intermediate.products
ORDER BY price ASC
LIMIT 5 OFFSET 5;