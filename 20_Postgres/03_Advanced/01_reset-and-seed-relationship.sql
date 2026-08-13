CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS advanced;

DROP TABLE IF EXISTS advanced.post_tags;
DROP TABLE IF EXISTS advanced.comments;
DROP TABLE IF EXISTS advanced.posts;
DROP TABLE IF EXISTS advanced.tags;
DROP TABLE IF EXISTS advanced.users;


CREATE TABLE advanced.users(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
)

CREATE TABLE advanced.posts(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
)