-- FIX ISSUE 2/9: Enable RLS on store_settings table
-- Migration: 20260225_fix_store_settings_rls.sql

-- 1. Enable RLS
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- 2. Allow public to read store_settings
DROP POLICY IF EXISTS "Public can view store_settings" ON public.store_settings;
CREATE POLICY "Public can view store_settings" ON public.store_settings
    FOR SELECT USING (true);

-- 3. Allow admins to update store_settings
DROP POLICY IF EXISTS "Admins can update store_settings" ON public.store_settings;
CREATE POLICY "Admins can update store_settings" ON public.store_settings
    FOR UPDATE USING (public.is_admin_or_super_admin());

-- 4. Allow admins to insert store_settings (if needed)
DROP POLICY IF EXISTS "Admins can insert store_settings" ON public.store_settings;
CREATE POLICY "Admins can insert store_settings" ON public.store_settings
    FOR INSERT WITH CHECK (public.is_admin_or_super_admin());

-- 5. Allow admins to delete store_settings
DROP POLICY IF EXISTS "Admins can delete store_settings" ON public.store_settings;
CREATE POLICY "Admins can delete store_settings" ON public.store_settings
    FOR DELETE USING (public.is_admin_or_super_admin());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
