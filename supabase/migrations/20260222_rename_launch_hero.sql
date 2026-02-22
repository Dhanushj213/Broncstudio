-- Migration to rename launch_hero_image to launch_hero_video

ALTER TABLE public.site_settings
RENAME COLUMN launch_hero_image TO launch_hero_video;
