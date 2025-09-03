-- Remove the unused and unprotected "user data" table
-- This table has no RLS policies and is not used in the application
-- Dropping it eliminates the security vulnerability
DROP TABLE IF EXISTS "user data";