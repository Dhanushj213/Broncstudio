-- Create site_events table
CREATE TABLE IF NOT EXISTS public.site_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_key TEXT UNIQUE NOT NULL,
    event_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    animation_type TEXT,
    opacity_level INTEGER DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Events" ON public.site_events FOR SELECT USING (true);
CREATE POLICY "Admin All Events" ON public.site_events FOR ALL USING (true);

-- Enable Realtime
ALTER TABLE public.site_events REPLICA IDENTITY FULL;
CREATE PUBLICATION site_events_publication FOR TABLE public.site_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_events;

-- Seed Data
INSERT INTO public.site_events (event_key, event_name) VALUES
('winter_season', 'Winter Season'),
('new_year', 'New Year'),
('national_youth_day', 'National Youth Day'),
('republic_day', 'Republic Day'),
('makar_sankranti', 'Makar Sankranti'),
('pongal', 'Pongal'),
('valentines_day', 'Valentine’s Day'),
('maha_shivaratri', 'Maha Shivaratri'),
('womens_day', 'Women’s Day'),
('holi', 'Holi'),
('spring_season', 'Spring Season'),
('ram_navami', 'Ram Navami'),
('ugadi', 'Ugadi'),
('summer_season', 'Summer Season'),
('mothers_day', 'Mother’s Day'),
('fathers_day', 'Father’s Day'),
('monsoon_season', 'Monsoon Season'),
('kargil_vijay_diwas', 'Kargil Vijay Diwas'),
('friendship_day', 'Friendship Day'),
('raksha_bandhan', 'Raksha Bandhan'),
('independence_day', 'Independence Day'),
('janmashtami', 'Janmashtami'),
('ganesh_chaturthi', 'Ganesh Chaturthi'),
('onam', 'Onam'),
('teachers_day', 'Teachers’ Day'),
('autumn_season', 'Autumn Season'),
('navratri', 'Navratri'),
('durga_puja', 'Durga Puja'),
('dussehra', 'Dussehra'),
('diwali', 'Diwali'),
('childrens_day', 'Children’s Day'),
('mens_day', 'Men’s Day'),
('pre_winter', 'Pre-Winter'),
('christmas', 'Christmas')
ON CONFLICT (event_key) DO NOTHING;
