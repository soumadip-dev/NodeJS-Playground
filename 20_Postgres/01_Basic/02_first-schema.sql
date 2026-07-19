-- Database -> Schema -> Table -> Rows

CREATE SCHEMA IF NOT EXISTS basics;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Query all schemas
SELECT schema_name
FROM information_schema.schemata
ORDER BY schema_name;