-- GROUP BY creates groups of rows
-- WHERE filters individual rows before grouping 
-- HAVING filters aggregated groups after grouping

-- Find user names who have atleast 2 posts
SELECT 
    u.name AS author_name, 
    COUNT(p.id) AS total_posts
FROM advanced.users AS u
LEFT JOIN advanced.posts AS p
    ON u.id = p.user_id
GROUP BY 
    u.id, 
    u.name
HAVING 
    COUNT(p.id) >= 2;