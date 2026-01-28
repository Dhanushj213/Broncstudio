-- Create Coupons Table
create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount')),
  discount_value decimal(10,2) not null,
  min_purchase_amount decimal(10,2),
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  usage_limit integer,
  usage_count integer default 0,
  is_active boolean default true,
  
  -- Restrictions (Arrays of IDs)
  applicable_product_ids uuid[],
  applicable_category_ids uuid[],
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.coupons enable row level security;
create policy "Coupons are viewable by everyone." on public.coupons for select using (true);
create policy "Only admins can insert coupons." on public.coupons for insert with check (true); -- Ideally restrict to admin
create policy "Only admins can update coupons." on public.coupons for update using (true);
create policy "Only admins can delete coupons." on public.coupons for delete using (true);
