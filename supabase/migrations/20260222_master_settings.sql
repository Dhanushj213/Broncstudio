-- MASTER SETTINGS MIGRATION (2026-02-22)
-- This script ensures all tables and columns for Store and Site settings are correctly set up.

-- 1. FIX STORE_SETTINGS TABLE
DO $$ 
BEGIN 
    -- Add shipping and tax columns if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'shipping_charge') THEN
        ALTER TABLE public.store_settings ADD COLUMN shipping_charge DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'free_shipping_threshold') THEN
        ALTER TABLE public.store_settings ADD COLUMN free_shipping_threshold DECIMAL(10,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'tax_rate') THEN
        ALTER TABLE public.store_settings ADD COLUMN tax_rate DECIMAL(5,2) DEFAULT 0;
    END IF;

    -- Add announcement columns if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_text') THEN
        ALTER TABLE public.store_settings ADD COLUMN announcement_text TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_link') THEN
        ALTER TABLE public.store_settings ADD COLUMN announcement_link TEXT DEFAULT '';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'store_settings' AND column_name = 'announcement_active') THEN
        ALTER TABLE public.store_settings ADD COLUMN announcement_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 2. CREATE/UPDATE SITE_SETTINGS TABLE (Maintenance & Launch Mode)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'maintenance_message') THEN
        ALTER TABLE public.site_settings ADD COLUMN maintenance_message TEXT DEFAULT 'Our platform is currently under maintenance. We''ll be back soon.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'launch_mode') THEN
        ALTER TABLE public.site_settings ADD COLUMN launch_mode BOOLEAN DEFAULT false;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'launch_datetime') THEN
        ALTER TABLE public.site_settings ADD COLUMN launch_datetime TIMESTAMP WITH TIME ZONE DEFAULT now() + interval '7 days';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'auto_disable_launch') THEN
        ALTER TABLE public.site_settings ADD COLUMN auto_disable_launch BOOLEAN DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'launch_message') THEN
        ALTER TABLE public.site_settings ADD COLUMN launch_message TEXT DEFAULT 'Something Powerful Is Launching.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'background_image') THEN
        ALTER TABLE public.site_settings ADD COLUMN background_image TEXT;
    END IF;
END $$;

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read site_settings
DROP POLICY IF EXISTS "Public can view site_settings" ON public.site_settings;
CREATE POLICY "Public can view site_settings" ON public.site_settings
    FOR SELECT USING (true);

-- Allow admins to update site_settings
DROP POLICY IF EXISTS "Admins can update site_settings" ON public.site_settings;
CREATE POLICY "Admins can update site_settings" ON public.site_settings
    FOR UPDATE USING (public.is_admin_or_super_admin());

-- 3. ENSURE USER ROLES
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Update existing admins
UPDATE public.profiles
SET role = 'admin'
WHERE email IN (
    'jdhanush213@gmail.com',
    'admin@broncstudio.com',
    'demo@broncstudio.com'
);

-- 4. SEED INITIAL DATA
INSERT INTO public.site_settings (maintenance_mode)
SELECT false
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
