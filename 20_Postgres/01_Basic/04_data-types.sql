CREATE SCHEMA IF NOT EXISTS basics;

DROP TABLE IF EXISTS basics.products_basics;

CREATE TABLE basics.products_basics (
    id SERIAL PRIMARY KEY,

    -- String with a maximum length of 100 characters
    name VARCHAR(100) NOT NULL,

    -- Variable-length text
    description TEXT,

    -- Whole number
    stock INTEGER DEFAULT 0,

    -- Stores larger whole numbers than INTEGER
    total_views BIGINT DEFAULT 0,

    -- Exact decimal values
    -- 10 = total digits, 2 = digits after the decimal point
    -- Maximum value: 99999999.99
    price NUMERIC(10, 2),

    -- Boolean value
    is_active BOOLEAN DEFAULT TRUE
);

INSERT INTO basics.products_basics (
    name,
    description,
    stock,
    total_views,
    price,
    is_active
)
VALUES
(
    'Laptop',
    'Gaming laptop with 16GB RAM',
    10,
    1500,
    79999.99,
    TRUE
),
(
    'Mouse',
    'Wireless optical mouse',
    50,
    320,
    799.50,
    TRUE
),
(
    'Keyboard',
    'Mechanical keyboard',
    20,
    850,
    2499.00,
    FALSE
);

SELECT * FROM basics.products_basics;

SELECT
    id,
    name,
    price,
    is_active
FROM basics.products_basics
WHERE is_active = TRUE;