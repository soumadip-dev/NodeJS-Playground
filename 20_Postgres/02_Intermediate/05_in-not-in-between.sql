-- IN      -> Value must match one of the values in the list.
-- NOT IN  -> Value must not match any value in the list.
-- BETWEEN -> Value must be within a specified range (inclusive).

-- Products whose category is either 'stationery' or 'furniture'
SELECT
    name,
    category
FROM intermediate.products
WHERE category IN ('stationery', 'furniture');

-- Products whose category is neither 'stationery' nor 'furniture'
SELECT
    name,
    category
FROM intermediate.products
WHERE category NOT IN ('stationery', 'furniture');

-- Products with prices between 100 and 2000 (inclusive)
SELECT
    name,
    price
FROM intermediate.products
WHERE price BETWEEN 100 AND 2000;