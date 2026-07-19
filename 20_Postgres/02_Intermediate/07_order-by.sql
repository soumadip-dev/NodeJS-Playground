-- ORDER BY
-- ASC  -> Sort in ascending order (default)
-- DESC -> Sort in descending order

-- Sort products by price (lowest to highest)
SELECT
    name,
    price
FROM intermediate.products
ORDER BY price ASC;

-- Sort products by price (highest to lowest)
SELECT
    name,
    price
FROM intermediate.products
ORDER BY price DESC;

-- Sort by category (Z to A), then by price (lowest to highest)
SELECT
    name,
    price,
    category
FROM intermediate.products
ORDER BY category DESC, price ASC;