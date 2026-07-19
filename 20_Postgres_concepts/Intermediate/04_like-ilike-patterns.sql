-- LIKE  -> Case-sensitive pattern matching
-- ILIKE -> Case-insensitive pattern matching
-- %      -> Matches zero or more characters
-- _      -> Matches exactly one character

-- Starts with "Wireless"
SELECT
    name,
    price
FROM intermediate.products
WHERE name LIKE 'Wireless%';

-- Ends with "desk" (matches Desk, desk, DESK, etc.)
SELECT
    name,
    category,
    price
FROM intermediate.products
WHERE name ILIKE '%desk';

-- Category must be "electronic" followed by exactly one character.
-- Examples that match:
--   electronics
-- Examples that do NOT match:
--   electronic
--   electronicss
SELECT
    name,
    category,
    price
FROM intermediate.products
WHERE category ILIKE 'electronic_';