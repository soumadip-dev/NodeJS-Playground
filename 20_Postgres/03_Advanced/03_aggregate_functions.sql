-- Aggregate functions calculate one result from many rows:
-- COUNT() -> Number of rows
-- SUM()   -> Sum of all values
-- AVG()   -> Average of all values
-- MIN()   -> Minimum value
-- MAX()   -> Maximum value

-- Common use cases: admin dashboards, reports, analytics, admin panels, etc.

SELECT
  COUNT(*)                                     AS total_posts,
  COUNT(*) FILTER (WHERE status = 'published') AS published_posts,
  SUM(views)                                   AS total_views,
  MIN(views)                                   AS min_views,
  MAX(views)                                   AS max_views,
  ROUND(AVG(views), 2)                         AS avg_views
FROM advanced.posts;