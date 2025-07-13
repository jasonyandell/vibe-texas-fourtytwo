-- Development seed data for Texas 42
-- This file is only loaded in development environment

-- Insert test players
INSERT INTO players (id, name, email, games_played, games_won) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Alice Johnson', 'alice@example.com', 15, 8),
    ('550e8400-e29b-41d4-a716-446655440002', 'Bob Smith', 'bob@example.com', 12, 5),
    ('550e8400-e29b-41d4-a716-446655440003', 'Carol Davis', 'carol@example.com', 20, 12),
    ('550e8400-e29b-41d4-a716-446655440004', 'David Wilson', 'david@example.com', 8, 3)
ON CONFLICT (id) DO NOTHING;
