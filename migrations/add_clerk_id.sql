-- Add clerk_id column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Create index on clerk_id
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
