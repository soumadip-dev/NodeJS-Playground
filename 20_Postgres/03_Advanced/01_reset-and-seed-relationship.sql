CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS advanced;

-- Drop dependent tables first to avoid foreign key constraints issues
DROP TABLE IF EXISTS advanced.posts_tags;
DROP TABLE IF EXISTS advanced.comments;
DROP TABLE IF EXISTS advanced.posts;
DROP TABLE IF EXISTS advanced.tags;
DROP TABLE IF EXISTS advanced.users;

-- 1. Create Tables
CREATE TABLE advanced.users (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

CREATE TABLE advanced.posts (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES advanced.users(id),
  title   TEXT NOT NULL,
  status  TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views   INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0)
);

CREATE TABLE advanced.comments (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES advanced.posts(id),
  body    TEXT NOT NULL
);

CREATE TABLE advanced.tags (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE advanced.posts_tags (
  post_id UUID NOT NULL REFERENCES advanced.posts(id),
  tag_id  UUID NOT NULL REFERENCES advanced.tags(id),
  PRIMARY KEY (post_id, tag_id) -- composite primary key(if we set more that 1 field as PRIMARY KEY, we make them when the seperate can be repetaed but their combination cannot be repeted)
);

-- 2. Insert Data

-- Insert data in users table
INSERT INTO advanced.users (name) VALUES
  ('Ananya'),
  ('Rahul');

-- Insert data in posts table
INSERT INTO advanced.posts (user_id, title, status, views)
SELECT id, 'Indexes for Beginners', 'draft', 40
FROM advanced.users
WHERE name = 'Ananya';

INSERT INTO advanced.posts (user_id, title, status, views)
SELECT id, 'Backend APIs with PostgreSQL', 'published', 180
FROM advanced.users
WHERE name = 'Rahul';

-- insert data in comments table
INSERT INTO advanced.comments (post_id, body)
SELECT id, 'Very clear explanation.'
FROM advanced.posts
WHERE title = 'PostgreSQL Joins Explained';

INSERT INTO advanced.comments (post_id, body)
SELECT id, 'Please add more examples.'
FROM advanced.posts
WHERE title = 'Backend APIs with PostgreSQL';

-- insert data in tags
INSERT INTO advanced.tags (name) VALUES
  ('sql'),
  ('backend');

-- insert data in to skjd f kdsflfhlsdf
INSERT INTO advanced.posts_tags (post_id, tag_id)
SELECT p.id, t.id
FROM advanced.posts p, advanced.tags t
WHERE p.title = 'PostgreSQL Joins Explained'
  AND t.name = 'sql';

INSERT INTO advanced.posts_tags (post_id, tag_id)
SELECT p.id, t.id
FROM advanced.posts p, advanced.tags t
WHERE p.title = 'Indexes for Beginners'
  AND t.name = 'sql';

INSERT INTO advanced.posts_tags (post_id, tag_id)
SELECT p.id, t.id
FROM advanced.posts p, advanced.tags t
WHERE p.title = 'Backend APIs with PostgreSQL'
  AND t.name = 'backend';

-- 3. Execution Confirmation Message
SELECT 'Part 3 reduced database reset and sample data inserted successfully.' AS message;