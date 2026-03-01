-- MIGRATION: 20260301_payment_settings.sql
-- Create secure payment settings table accessible only to super_admins and service_role

CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Razorpay
    razorpay_active BOOLEAN DEFAULT false,
    razorpay_key_id TEXT,
    razorpay_key_secret TEXT,

    -- PhonePe
    phonepe_active BOOLEAN DEFAULT false,
    phonepe_merchant_id TEXT,
    phonepe_salt_key TEXT,
    phonepe_salt_index TEXT DEFAULT '1',
    phonepe_env TEXT DEFAULT 'UAT', -- 'UAT' or 'PROD'

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Note: We only expect ONE row in this table.
-- Let's insert a default row if it doesn't exist.
INSERT INTO public.payment_settings (razorpay_active, phonepe_active)
SELECT false, false
WHERE NOT EXISTS (SELECT 1 FROM public.payment_settings);

-- Enable RLS
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- 1. NO PUBLIC ACCESS. The public should never be able to read or write this table directly.
-- (Public config will be served by a secure server-side API route instead)

-- 2. Allow SUPER ADMINS to read
DROP POLICY IF EXISTS "Super Admins can view payment_settings" ON public.payment_settings;
CREATE POLICY "Super Admins can view payment_settings" ON public.payment_settings
    FOR SELECT USING (public.is_super_admin());

-- 3. Allow SUPER ADMINS to update
DROP POLICY IF EXISTS "Super Admins can update payment_settings" ON public.payment_settings;
CREATE POLICY "Super Admins can update payment_settings" ON public.payment_settings
    FOR UPDATE USING (public.is_super_admin());

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';
