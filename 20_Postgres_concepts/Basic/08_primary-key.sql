-- SERIAL Example

CREATE SCHEMA IF NOT EXISTS basics;

DROP TABLE IF EXISTS basics.sales;

CREATE TABLE basics.sales (
    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,

    price NUMERIC(10,2) NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.sales (title, price)
VALUES
    ('Laptop', 79999.99),
    ('Mouse', 799.50),
    ('Keyboard', 2499.00),
    ('Monitor', 15999.00),
    ('USB Cable', DEFAULT),
    ('Headphones', 3499.99);

SELECT * FROM basics.sales;

SELECT * FROM basics.sales
WHERE id = 5;

-- ==========================================================
-- PRIMARY KEY (SERIAL) Constraint
-- ==========================================================

-- INSERT INTO basics.sales (id, title, price)
-- VALUES
--     (1, 'Pen', 5.00);

-- ERROR:
-- duplicate key value violates unique constraint "sales_pkey"
-- DETAIL: Key (id)=(1) already exists.