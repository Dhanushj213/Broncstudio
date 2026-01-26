-- Create a table for store settings (singleton mostly)
create table if not exists public.store_settings (
    id uuid default gen_random_uuid() primary key,
    store_name text default 'Broncstudio',
    support_email text default 'support@broncstudio.com',
    currency text default 'INR',
    tax_rate numeric default 18.0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default row if not exists
insert into public.store_settings (store_name)
select 'Broncstudio'
where not exists (select 1 from public.store_settings);
