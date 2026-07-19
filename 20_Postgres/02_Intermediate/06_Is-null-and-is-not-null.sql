-- NULL -> Represents a missing or unknown value.
-- Do NOT compare NULL using '= NULL' or '!= NULL'.
-- Use 'IS NULL' or 'IS NOT NULL' instead.

-- Products with no description
SELECT
    name,
    description
FROM intermediate.products
WHERE description IS NULL;

-- Products with a description
SELECT
    name,
    description
FROM intermediate.products
WHERE description IS NOT NULL;