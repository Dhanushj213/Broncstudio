-- Update the user's email_confirmed_at to now, effectively confirming them.
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'dhanushj213@gmail.com';
