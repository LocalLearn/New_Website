/*
  # Add initial interests

  1. Changes
    - Insert initial interests into the interests table:
      - Python
      - React
      - C++

  Note: Using ON CONFLICT DO NOTHING to ensure idempotency
*/

INSERT INTO interests (name)
VALUES 
  ('Python'),
  ('React'),
  ('C++')
ON CONFLICT (name) DO NOTHING;