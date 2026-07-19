-- Constraints:
-- NOT NULL  -> Value is required
-- UNIQUE    -> No duplicate values allowed
-- DEFAULT   -> Uses a default value if none is provided
-- CHECK     -> Value must satisfy a condition

CREATE SCHEMA IF NOT EXISTS basics;

DROP TABLE IF EXISTS basics.accounts;

CREATE TABLE basics.accounts (
    id SERIAL PRIMARY KEY,

    full_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    age INTEGER CHECK (age >= 18),

    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO basics.accounts (
    full_name,
    email,
    age
)
VALUES
    ('Soumadip Majila', 'soumadip@example.com', 23),
    ('Sangam Roy', 'sangam@example.com', 25),
    ('Rahul Das', 'rahul@example.com', 19);

SELECT * FROM basics.accounts;

-- ==========================================================
-- NOT NULL Constraint
-- ==========================================================

-- INSERT INTO basics.accounts (email, age)
-- VALUES
--     ('null@example.com', 23);

-- ERROR:
-- null value in column "full_name" of relation "accounts"
-- violates not-null constraint

-- ==========================================================
-- UNIQUE Constraint
-- ==========================================================

-- INSERT INTO basics.accounts (full_name, email, age)
-- VALUES
--     ('Rahul Roy', 'rahul@example.com', 23);

-- ERROR:
-- duplicate key value violates unique constraint "accounts_email_key"
-- DETAIL: Key (email)=(rahul@example.com) already exists.

-- ==========================================================
-- CHECK Constraint
-- ==========================================================

-- INSERT INTO basics.accounts (full_name, email, age)
-- VALUES
--     ('Babu Gupta', 'babu@example.com', 10);

-- ERROR:
-- new row for relation "accounts"
-- violates check constraint "accounts_age_check"