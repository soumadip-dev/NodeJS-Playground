-- Insert a single row
INSERT INTO intermediate.products (
    name,
    category,
    price,
    stock,
    is_active,
    sku,
    description
)
VALUES
(
    'Mac mini',
    'electronics',
    59900.00,
    23,
    TRUE,
    'MAC-MINI',
    'Latest Apple Mac mini'
);

-- Insert multiple rows
INSERT INTO intermediate.products (
    name,
    category,
    price,
    stock,
    is_active,
    sku,
    description
)
VALUES
(
    'iPhone 16',
    'electronics',
    79999.00,
    15,
    TRUE,
    'IPH16',
    'Apple iPhone 16'
),
(
    'Dell XPS 15',
    'electronics',
    149999.00,
    8,
    TRUE,
    'DELL-XPS15',
    'Dell XPS 15 Laptop'
);

-- View all products
SELECT *
FROM intermediate.products;