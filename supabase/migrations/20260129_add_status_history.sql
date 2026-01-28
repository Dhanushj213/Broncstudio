-- Add status_history column to orders table
alter table public.orders 
add column if not exists status_history jsonb default '[]'::jsonb;

-- Comment for clarity
comment on column public.orders.status_history is 'Array of objects: { status: string, timestamp: string, note?: string }';
