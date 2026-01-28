-- Enable Admins to Update Orders (Accept/Reject)
-- Using hardcoded emails to match src/utils/admin.ts

drop policy if exists "Admins can update orders" on public.orders;

create policy "Admins can update orders"
on public.orders
for update
using (
  auth.jwt() ->> 'email' in (
    'jdhanush213@gmail.com', 
    'admin@broncstudio.com', 
    'demo@broncstudio.com'
  )
);

-- Also allow admins to view all orders (explicitly, beyond the temporary open policy if any)
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
on public.orders
for select
using (
  auth.jwt() ->> 'email' in (
    'jdhanush213@gmail.com', 
    'admin@broncstudio.com', 
    'demo@broncstudio.com'
  )
);
