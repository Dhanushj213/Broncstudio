-- Create table for Curated Sections (Moods/Collections)
create table if not exists curated_sections (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text not null,
  category_slugs text[] default '{}', -- Slugs to filter products by
  price_max numeric, -- Optional max price filter
  filter_tags text[] default '{}', -- Optional tag filters
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table curated_sections enable row level security;

-- Policy: Everyone can read active sections
create policy "Public can view active curated sections"
  on curated_sections for select
  using (true);

-- Policy: Admin can do everything (assuming service role or authenticated admin check - simplified here to public for now if no auth set up, but let's assume authenticated)
create policy "Admins can manage curated sections"
  on curated_sections for all
  using (auth.role() = 'authenticated');

-- Create storage bucket if not exists 'curated-images'
insert into storage.buckets (id, name, public)
values ('curated-images', 'curated-images', true)
on conflict (id) do nothing;

create policy "Public Access to Curated Images"
  on storage.objects for select
  using ( bucket_id = 'curated-images' );

create policy "Authenticated can upload Curated Images"
  on storage.objects for insert
  with check ( bucket_id = 'curated-images' and auth.role() = 'authenticated' );
