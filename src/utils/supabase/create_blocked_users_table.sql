-- Create a table to store blocked users
-- This table references auth.users to ensure referential integrity
-- and allows us to store the reason and timestamp of blocking.

create table if not exists public.blocked_users (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  reason text,
  blocked_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.blocked_users enable row level security;

-- Policy: Admins can view all blocked users
-- Ideally, we'd have an "admin" role check, but for now we might rely on service role
-- or specific user checks. 
-- Since this is an internal admin table, we might just allow read for authenticated users 
-- if we want to show "Account Blocked" message, or restricted.
-- Let's stick to Service Role usage for Admin Actions for now.

-- If we need to check in RLS (e.g. for orders), we might need a policy like:
-- create policy "Anyone can read blocked_users" on public.blocked_users for select using (true);
-- So that we can check `if exists(select 1 from blocked_users where user_id = auth.uid())`
