-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked to Auth)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- 2. CATEGORIES (Hierarchical: Worlds -> Intents -> Items)
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  name text not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id), -- For subcategories/intents
  type text check (type in ('world', 'intent', 'collection', 'category')), -- Taxonomy type
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Categories
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
-- Only admins should update/insert (skipping admin logic for simplicity now, maybe add later)

-- 3. PRODUCTS
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  slug text not null unique,
  name text not null,
  description text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2), -- For sales
  category_id uuid references public.categories(id),
  images text[], -- Array of image URLs
  stock_status text default 'in_stock', -- in_stock, out_of_stock, pre_order
  metadata jsonb, -- Flexible field for extra details like 'material', 'care_instructions'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Products
alter table public.products enable row level security;
create policy "Products are viewable by everyone." on public.products for select using (true);

-- 4. WISHLIST
create table public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  product_id uuid references public.products(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- RLS for Wishlist
alter table public.wishlist enable row level security;
create policy "Users can view their own wishlist." on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can add to their own wishlist." on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete from their own wishlist." on public.wishlist for delete using (auth.uid() = user_id);

-- 5. Helper Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

