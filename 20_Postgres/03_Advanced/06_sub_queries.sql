-- Subquery: One query nested inside another query
-- 1. The inner query runs first to calculate the average views
-- 2. The outer query uses that value to filter posts

-- Find posts that are performing better than the average view count
SELECT 
    title,
    status,
    views
FROM advanced.posts
WHERE views > (
    SELECT AVG(views) 
    FROM advanced.posts
);