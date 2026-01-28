
-- Allow Admins to Delete from personalization-uploads bucket
-- Matches the Admin IPs from admin_order_update_policy

drop policy if exists "Admins can delete personalization images" on storage.objects;

create policy "Admins can delete personalization images"
on storage.objects
for delete
using (
  bucket_id = 'personalization-uploads'
  AND
  auth.jwt() ->> 'email' in (
    'jdhanush213@gmail.com', 
    'admin@broncstudio.com', 
    'demo@broncstudio.com'
  )
);

-- Also ensure they can Select (for finding the file, though usually public)
create policy "Admins can select personalization images"
on storage.objects
for select
using (
  bucket_id = 'personalization-uploads'
);
