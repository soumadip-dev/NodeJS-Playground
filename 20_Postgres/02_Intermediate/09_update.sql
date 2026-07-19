-- Update a single product
UPDATE intermediate.products
SET
    price = 1199.99,
    stock = 23
WHERE sku = 'ELEC-KEY-001';

-- Update all products in the 'stationery' category
-- Increase the price by 10% and set the stock to 23
UPDATE intermediate.products
SET
    price = ROUND(price * 1.10, 2),
    stock = 23
WHERE category = 'stationery';

-- View the updated data
SELECT *
FROM intermediate.products;