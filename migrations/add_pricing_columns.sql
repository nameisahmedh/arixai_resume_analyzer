-- Add new columns to users table for pricing model
-- Run this SQL in your Neon console or PostgreSQL client

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS analysis_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP;

-- Update existing users to have 0 analysis count
UPDATE users SET analysis_count = 0 WHERE analysis_count IS NULL;
UPDATE users SET is_premium = FALSE WHERE is_premium IS NULL;
