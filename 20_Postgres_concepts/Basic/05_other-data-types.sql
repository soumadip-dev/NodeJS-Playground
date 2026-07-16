CREATE SCHEMA IF NOT EXISTS basics;

-- Enables the gen_random_uuid() function
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS basics.app_events;

CREATE TABLE basics.app_events (
    -- UUID (Universally Unique Identifier)
    -- A globally unique 128-bit identifier.
    -- Useful when IDs should be difficult to guess and unique across systems.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    event_name TEXT NOT NULL,

    -- JSONB (Binary JSON)
    -- Stores JSON data in a binary format.
    -- Faster for searching and indexing than the JSON type.
    -- '{}' represents an empty JSON object.
    metadata JSONB DEFAULT '{}'::JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample records
INSERT INTO basics.app_events (event_name, metadata)
VALUES
(
    'User Registered',
    '{
        "user_id": 101,
        "email": "john@example.com",
        "source": "website"
    }'
),
(
    'User Login',
    '{
        "user_id": 101,
        "ip_address": "192.168.1.10",
        "device": "Chrome on Windows"
    }'
),
(
    'Order Placed',
    '{
        "order_id": 5001,
        "amount": 2499.99,
        "currency": "INR",
        "items": 3
    }'
),
(
    'Password Changed',
    '{}'
),
(
    'Profile Updated',
    '{
        "user_id": 205,
        "updated_fields": ["name", "phone"]
    }'
);


SELECT * FROM basics.app_events;

SELECT event_name, metadata ->> 'user_id' as user_id
FROM basics.app_events 
WHERE metadata ? 'user_id';