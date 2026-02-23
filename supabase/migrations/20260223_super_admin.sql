-- SUPER ADMIN MIGRATION (2026-02-23)
-- This script handles creating the "super_admin" role, building helper functions
-- for secure RLS policies, and ensuring jdhanush213@gmail.com is set as super_admin.

-- 1. ENSURE ROLE COLUMN EXISTS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- 2. CREATE HELPER FUNCTIONS
-- Create a secure function to check if the current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE 'sql'
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid() AND role = 'super_admin'
    );
$$;

-- Create a secure function to check if the current user is an admin OR super admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super_admin()
RETURNS BOOLEAN
LANGUAGE 'sql'
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    ) OR (
        -- Fallback check for the hardcoded JWT emails if they haven't logged in yet
        -- to have their profile updated.
        auth.jwt() ->> 'email' IN (
            'jdhanush213@gmail.com',
            'admin@broncstudio.com',
            'demo@broncstudio.com'
        )
    );
$$;

-- 3. ESTABLISH SUPER ADMIN ACCOUNT
-- Automatically elevate the owner to super_admin
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'jdhanush213@gmail.com';

-- 4. CONFIGURE RLS ON PROFILES FOR SUPER ADMIN
-- Enable RLS (Should already be enabled, but making sure)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow Super Admin to view all profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.is_super_admin());

-- Allow Super Admin to update all profiles (specifically for role changes)
DROP POLICY IF EXISTS "Super admins can update all profiles" ON public.profiles;
CREATE POLICY "Super admins can update all profiles" ON public.profiles
    FOR UPDATE USING (public.is_super_admin());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
