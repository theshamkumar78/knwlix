-- Migration 0006: Security Audit & Hardening
-- 1. Ensure RLS is enabled on all application tables
alter table if exists public.profiles enable row level security;
alter table if exists public.courses enable row level security;
alter table if exists public.lessons enable row level security;
alter table if exists public.enrollments enable row level security;
alter table if exists public.lesson_progress enable row level security;
alter table if exists public.certificates enable row level security;
alter table if exists public.course_reviews enable row level security;

-- 2. Consolidate and secure search paths for security definer helper functions
create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public
as $$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create or replace function public.owns_course(cid uuid)
returns boolean language sql stable security definer
set search_path = public
as $$ select exists (select 1 from courses where id = cid and instructor_id = auth.uid()) $$;

create or replace function public.is_enrolled(cid uuid)
returns boolean language sql stable security definer
set search_path = public
as $$ select exists (select 1 from enrollments where course_id = cid and student_id = auth.uid()) $$;

-- 3. Course reviews policies (idempotent setup)
drop policy if exists reviews_read_all on public.course_reviews;
create policy reviews_read_all on public.course_reviews for select using (true);

drop policy if exists reviews_insert_enrolled on public.course_reviews;
create policy reviews_insert_enrolled on public.course_reviews
  for insert to authenticated
  with check (student_id = auth.uid() and public.is_enrolled(course_id));

drop policy if exists reviews_update_own on public.course_reviews;
create policy reviews_update_own on public.course_reviews
  for update using (student_id = auth.uid())
  with check (student_id = auth.uid());

drop policy if exists reviews_delete_own on public.course_reviews;
create policy reviews_delete_own on public.course_reviews
  for delete using (student_id = auth.uid() or public.is_admin());
