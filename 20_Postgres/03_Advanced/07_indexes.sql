-- PostgreSQL Indexing Overview & Query Optimization (Schema: advanced)

-- Basic SELECT query: Retrieves post details without filtering
SELECT 
    id,
    title,
    status,
    views,
    user_id
FROM advanced.posts;

-- 1. Single-Column Index

-- Endpoint pattern: /posts?status=published
SELECT 
    id,
    title,
    status
FROM advanced.posts
WHERE status = 'published';

-- Naming convention: idx_<table_name>_<column_name>
-- Speeds up filtering by status alone
CREATE INDEX IF NOT EXISTS idx_posts_status
    ON advanced.posts (status);

-- 2. Composite (Multi-Column) Index

-- Filtering by status and sorting by views descending
SELECT 
    title,
    status,
    views 
FROM advanced.posts
WHERE status = 'published'
ORDER BY views DESC;

-- Composite index: Optimizes queries filtering by status and ordering by views
CREATE INDEX IF NOT EXISTS idx_posts_status_views
    ON advanced.posts (status, views DESC);

-- 3. Foreign Key / Relationship Index

-- Endpoint pattern: /users/:id/posts
-- Subquery finds user_id by name, then fetches that user's posts
SELECT
    title,
    status,
    views
FROM advanced.posts
WHERE user_id = (
    SELECT id
    FROM advanced.users 
    WHERE name = 'rahul'
);

-- Foreign key index: Speeds up lookups on posts for a specific user_id
CREATE INDEX IF NOT EXISTS idx_posts_user_id
    ON advanced.posts (user_id);