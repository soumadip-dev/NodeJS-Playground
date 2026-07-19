-- Insert a new product

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
    'HP Pavilion',
    'electronics',
    59900.00,
    23,
    TRUE,
    'HP-PAV-001',
    'Latest HP Laptop'
);

-- Verify that the product was inserted

SELECT
    name,
    sku
FROM intermediate.products;

-- Delete the product using its SKU

DELETE FROM intermediate.products
WHERE sku = 'HP-PAV-001';

-- Verify that the product was deleted

SELECT
    name,
    sku
FROM intermediate.products;