-- NULL -> Unknown or missing value
-- Empty string ('') -> Known string value, but it contains no characters
-- Zero (0) -> Actual numeric value of 0

CREATE SCHEMA IF NOT EXISTS basics;

DROP TABLE IF EXISTS basics.value_example;

CREATE TABLE basics.value_example (
    id SERIAL PRIMARY KEY,
    nickname TEXT,
    bio TEXT,
    score INTEGER
);

INSERT INTO basics.value_example (
    nickname,
    bio,
    score
)
VALUES
    (NULL, 'Nickname is unknown', 100),
    ('', 'Nickname is intentionally empty', 200),
    ('Soumadip', '', 0),
    ('Sangam', NULL, NULL);

-- Rows where nickname is NULL
SELECT *
FROM basics.value_example
WHERE nickname IS NULL;

-- Rows where nickname is an empty string
SELECT *
FROM basics.value_example
WHERE nickname = '';

-- Rows where score is 0
SELECT *
FROM basics.value_example
WHERE score = 0;

-- Rows where nickname is not NULL
SELECT *
FROM basics.value_example
WHERE nickname IS NOT NULL;