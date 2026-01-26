-- TEMPORARY: Allow anyone to insert/update/delete Categories and Products
-- Run this to allow the seed script to work. 
-- You can disable these later or restrict them to specific user IDs.

-- Categories
create policy "Enable insert for everyone" on public.categories for insert with check (true);
create policy "Enable update for everyone" on public.categories for update using (true);
create policy "Enable delete for everyone" on public.categories for delete using (true);

-- Products
create policy "Enable insert for everyone" on public.products for insert with check (true);
create policy "Enable update for everyone" on public.products for update using (true);
create policy "Enable delete for everyone" on public.products for delete using (true);

-- Product Variants / Images (if you added those tables, otherwise ignore)
-- create policy "Enable insert for everyone" on public.product_variants for insert with check (true);
-- create policy "Enable insert for everyone" on public.product_images for insert with check (true);
