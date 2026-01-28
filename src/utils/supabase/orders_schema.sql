-- Create ORDERS table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  total_amount decimal(10, 2) not null,
  status text check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')) default 'pending',
  shipping_address jsonb not null,
  payment_status text check (payment_status in ('pending', 'paid', 'failed', 'refunded')) default 'pending',
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on Orders
alter table public.orders enable row level security;

-- Policy: Users can view their own orders
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own orders
drop policy if exists "Users can insert their own orders" on public.orders;
create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Policy: Admins can view all orders (Simplified for now - strictly relying on Service Role for Admin Dash usually, but adding for completeness if we add Admin User Role later)
-- For now, we rely on Supabase Service Role for Admin actions or specific Admin Flag

-- Create ORDER_ITEMS table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  name text not null, -- Snapshot of name in case product changes
  quantity int not null,
  price decimal(10, 2) not null, -- Snapshot of price
  size text,
  color text,
  image_url text,
  metadata jsonb -- Stores personalization details
);

-- Enable RLS on Order Items
alter table public.order_items enable row level security;

-- Policy: Users can view their own order items
drop policy if exists "Users can view their own order items" on public.order_items;
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own order items
drop policy if exists "Users can insert their own order items" on public.order_items;
create policy "Users can insert their own order items"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );
