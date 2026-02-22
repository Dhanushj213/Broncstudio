-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT DEFAULT 'Our platform is currently under construction. Please check back soon.',
    background_image TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read site_settings
CREATE POLICY "Public can view site_settings" ON public.site_settings
    FOR SELECT USING (true);

-- Allow admins to update site_settings
CREATE POLICY "Admins can update site_settings" ON public.site_settings
    FOR UPDATE USING (
        auth.jwt() ->> 'email' IN (
            'jdhanush213@gmail.com',
            'admin@broncstudio.com',
            'demo@broncstudio.com'
        )
    );

-- Add role column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'profiles' AND COLUMN_NAME = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Update existing users with admin emails to have the admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email IN (
    'jdhanush213@gmail.com',
    'admin@broncstudio.com',
    'demo@broncstudio.com'
);

-- Insert default row if not exists
INSERT INTO public.site_settings (maintenance_mode)
SELECT false
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
