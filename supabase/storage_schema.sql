-- Create the 'personalization-uploads' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('personalization-uploads', 'personalization-uploads', true)
on conflict (id) do nothing;



-- Policy: Allow public uploads (for customers to upload designs)
drop policy if exists "Public Uploads" on storage.objects;
create policy "Public Uploads"
on storage.objects for insert
with check ( bucket_id = 'personalization-uploads' );

-- Policy: Allow public viewing
drop policy if exists "Public Viewing" on storage.objects;
create policy "Public Viewing"
on storage.objects for select
using ( bucket_id = 'personalization-uploads' );
