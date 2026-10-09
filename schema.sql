-- Run once in Supabase → SQL Editor.
-- Before: Authentication → disable "Allow new users to sign up"; add the owner user manually.

create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 120),
  description text check (char_length(description) <= 1000),
  image_url   text,
  video_url   text check (video_url ~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be)/'
                       or video_url ~ '^https://[^/]+/storage/v1/object/public/portfolio-images/videos/'),
  -- Existing project? Run:
  -- alter table public.projects drop constraint projects_video_url_check;
  -- alter table public.projects add constraint projects_video_url_check check (
  --   video_url ~ '^https://(www\.|m\.)?(youtube\.com|youtu\.be)/'
  --   or video_url ~ '^https://[^/]+/storage/v1/object/public/portfolio-images/videos/');
  category    text not null check (category in ('kitchen','furniture','doors','repair')),
  created_at  timestamptz not null default now(),
  constraint projects_has_media check (image_url is not null or video_url is not null)
);

create index projects_created_at_idx on public.projects (created_at desc);

alter table public.projects enable row level security;

create policy "projects_public_read"
  on public.projects for select
  to anon, authenticated
  using (true);

create policy "projects_admin_write"
  on public.projects for all
  to authenticated
  using      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Customer reviews (managed in Admin → Reviews)
create table public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 80),
  place      text not null check (char_length(place) between 1 and 80),
  rating     int  not null check (rating between 1 and 5),
  work       text check (char_length(work) <= 120),
  text       text not null check (char_length(text) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews_public_read"
  on public.reviews for select
  to anon, authenticated
  using (true);

create policy "reviews_admin_write"
  on public.reviews for all
  to authenticated
  using      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 52428800, -- 50 MB (videos)
        array['image/webp','image/jpeg','image/png','video/mp4','video/webm','video/quicktime']);
-- Existing project? Run instead:
-- update storage.buckets set file_size_limit = 52428800,
--   allowed_mime_types = array['image/webp','image/jpeg','image/png','video/mp4','video/webm','video/quicktime']
--   where id = 'portfolio-images';

create policy "portfolio_images_admin_write"
  on storage.objects for all
  to authenticated
  using      (bucket_id = 'portfolio-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'portfolio-images' and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Mark the owner as admin (then sign out/in so the JWT carries the claim).
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'owner@example.com';  -- TODO(owner): real admin email
