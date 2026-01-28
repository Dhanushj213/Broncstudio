-- Add metadata column to order_items to store personalization details
alter table public.order_items 
add column if not exists metadata jsonb;

comment on column public.order_items.metadata is 'Stores personalization details like image_url, print_type, placement, etc.';
