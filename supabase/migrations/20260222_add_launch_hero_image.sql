-- Migration to add launch_hero_image column to site_settings

ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS launch_hero_image TEXT;

-- Update the view if one exists or trigger (Optional if no view depends on all columns)
