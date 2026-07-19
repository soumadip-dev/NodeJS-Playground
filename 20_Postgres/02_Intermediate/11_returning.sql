-- RETURNING returns the affected row(s) immediately after
-- an INSERT, UPDATE, or DELETE operation.

-- Insert a new product and return selected columns
INSERT INTO intermediate.products (
    name,
    category,
    price,
    stock,
    is_active,
    sku,
    description
)
VALUES (
    'Ergonomic Office Chair',
    'furniture',
    8999.00,
    15,
    TRUE,
    'FUR-CHAIR-001',
    'Adjustable ergonomic office chair with lumbar support'
)
RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at;

-- Increase the stock of all furniture products
-- and return the updated rows
UPDATE intermediate.products
SET stock = stock + 11
WHERE category = 'furniture'
RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at;

-- Delete the product and return the deleted row
DELETE FROM intermediate.products
WHERE sku = 'FUR-CHAIR-001'
RETURNING
    id,
    name,
    category,
    price,
    stock,
    created_at;