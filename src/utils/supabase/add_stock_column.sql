-- Add stock_quantity to products if it doesn't exist
alter table public.products 
add column if not exists stock_quantity integer default 50 not null;

-- Be safer with RLS if needed, but for now defaults are fine.
