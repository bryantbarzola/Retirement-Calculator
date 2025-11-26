-- Add password_hash column to profiles table for email/password authentication
ALTER TABLE profiles
ADD COLUMN password_hash TEXT;

-- Password hash is optional (NULL for Google OAuth users)
COMMENT ON COLUMN profiles.password_hash IS 'Bcrypt hash of user password. NULL for OAuth-only users.';
