DROP TABLE IF EXISTS basic.students;

CREATE TABLE basic.students (
  -- Auto-incrementing integer:
  -- 1, 2, 3, ...
  -- PRIMARY KEY uniquely identifies each row.
  id SERIAL PRIMARY KEY,

  -- TEXT stores string data.
  -- NOT NULL means this column is required.
  -- PostgreSQL will reject the row if the name is not provided.
  name TEXT NOT NULL,

  -- UNIQUE ensures that no two students can have the same email.
  email TEXT NOT NULL UNIQUE,

  -- CHECK ensures the age is at least 18.
  -- If the condition is not met, PostgreSQL rejects the row.
  age INTEGER CHECK (age >= 18),

  -- TIMESTAMP stores the date and time.
  -- DEFAULT NOW() automatically sets the current timestamp
  -- if no value is provided during insertion.
  created_at TIMESTAMP DEFAULT NOW()
);