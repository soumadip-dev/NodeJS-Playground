-- Multiple writes that must succeed or fail together need a transaction.
-- Everything between BEGIN and COMMIT is one atomic unit: both writes land or neither does.

BEGIN;

-- Update user_id to the user ID of 'Rahul'
UPDATE advanced.posts
SET user_id = (SELECT id FROM advanced.users WHERE name = 'Rahul')
WHERE title = 'Indexes for Beginners';

-- Insert a comment linked to the 'Backend APIs with PostgreSQL' post
INSERT INTO advanced.comments (post_id, body)
SELECT id, 'Looking forward to more content like this.'
FROM advanced.posts
WHERE title = 'Backend APIs with PostgreSQL';

COMMIT;