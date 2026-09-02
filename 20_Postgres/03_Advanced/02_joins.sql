-- Inner join (common ones)
-- ## Includes only matching rows from both users and posts
SELECT 
  u.name  AS author_name, 
  p.title AS post_title, 
  p.status, 
  p.views
FROM advanced.users u
INNER JOIN advanced.posts p 
        ON u.id = p.user_id
ORDER BY p.views DESC;

-- * Another Inner join in many-to-many relationship
-- ## Includes matching rows across posts, posts_tags, and tags
SELECT 
  p.title AS post_title, 
  t.name  AS tag_name
FROM advanced.posts p
INNER JOIN advanced.posts_tags pt 
        ON p.id = pt.post_id
INNER JOIN advanced.tags t 
        ON pt.tag_id = t.id
ORDER BY p.title, t.name;

-- Left join (returns ALL rows from the left table, and matching rows from the right table)
-- ## Includes all records from posts (left table) and matching records from comments (right table)
SELECT 
  p.title AS post_title, 
  c.body  AS comment_body
FROM advanced.posts p
LEFT JOIN advanced.comments c 
       ON p.id = c.post_id
ORDER BY p.title;

-- Right join (returns ALL rows from the right table, and matching rows from the left table)
-- ## Includes all records from comments (right table) and matching records from posts (left table)
SELECT 
  p.title AS post_title,
  c.body  AS comment_body
FROM advanced.posts p
RIGHT JOIN advanced.comments c
        ON p.id = c.post_id
ORDER BY p.title;

-- Full outer join (all rows from both tables)
-- ## Includes all records when there is a match in either posts or comments table. Unmatched rows from either side will show NULL.
SELECT 
  p.title AS post_title, 
  c.body  AS comment_body
FROM advanced.posts p
FULL OUTER JOIN advanced.comments c 
             ON p.id = c.post_id
ORDER BY p.title;

-- Cross Join (Returns the cartesian product of both tables)
-- Every row from the first table is combined with every row from the second table
-- table a          table b
--   S                Red
--   M                Blue

-- Result:
-- S - Red
-- S - Blue
-- M - Red
-- M - Blue

-- ## Combine every single post with every single comment
SELECT 
  p.title AS post_title,
  c.body  AS comment_body
FROM advanced.posts p
CROSS JOIN advanced.comments c
ORDER BY p.title;

-- Self join (joins a table with itself to compare rows within the same table)
-- ## Suppose we want the posts that have same status
SELECT 
  p1.title  AS post_title,
  p1.status AS post_status,
  p2.title  AS related_post_title,
  p2.status AS related_post_status
FROM advanced.posts p1
JOIN advanced.posts p2
ON p1.status = p2.status
AND p1.id <> p2.id -- exclude same posts(!=)
ORDER BY p1.title;