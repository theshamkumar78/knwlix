-- Migration 0004: Better learning experience (What you will learn, reviews and ratings)

-- 1. Add what_you_will_learn column to courses
alter table public.courses
add column if not exists what_you_will_learn text[] default array[]::text[];

-- 2. Create course_reviews table
create table if not exists public.course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  review_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create index if not exists idx_reviews_course on public.course_reviews(course_id);
create index if not exists idx_reviews_student on public.course_reviews(student_id);

-- 3. Enable RLS on course_reviews
alter table public.course_reviews enable row level security;

-- Read reviews for published courses
drop policy if exists reviews_read_all on public.course_reviews;
create policy reviews_read_all on public.course_reviews
  for select using (
    exists (select 1 from public.courses c where c.id = course_id and c.status = 'published')
  );

-- Enrolled students can write review
drop policy if exists reviews_insert_enrolled on public.course_reviews;
create policy reviews_insert_enrolled on public.course_reviews
  for insert to authenticated
  with check (
    student_id = auth.uid()
    and public.is_enrolled(course_id)
  );

-- Students can update own review
drop policy if exists reviews_update_own on public.course_reviews;
create policy reviews_update_own on public.course_reviews
  for update using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Students or admins can delete reviews
drop policy if exists reviews_delete_own on public.course_reviews;
create policy reviews_delete_own on public.course_reviews
  for delete using (student_id = auth.uid() or public.is_admin());

-- 4. Helper function to fetch course ratings summary
create or replace function public.get_course_rating(p_course_id uuid)
returns table(avg_rating numeric, total_reviews bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    coalesce(round(avg(rating)::numeric, 1), 0.0) as avg_rating,
    count(*)::bigint as total_reviews
  from public.course_reviews
  where course_id = p_course_id;
$$;

grant execute on function public.get_course_rating(uuid) to anon, authenticated;
