-- Migration 0005: Instructor and Admin Upgrades

-- 1. Add rejection_reason column to courses
alter table public.courses
add column if not exists rejection_reason text;

-- 2. Add is_active column to profiles for user deactivation
alter table public.profiles
add column if not exists is_active boolean not null default true;

-- 3. Policy: Admin can deactivate / activate profiles
drop policy if exists profiles_admin_deactivate on public.profiles;
create policy profiles_admin_deactivate on public.profiles
  for update using (public.is_admin())
  with check (public.is_admin());

-- 4. Helper function to duplicate a course and all its lessons
create or replace function public.duplicate_course(p_course_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_orig record;
  v_new_id uuid;
  v_new_slug text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Verify ownership or admin
  select * into v_orig
  from public.courses
  where id = p_course_id and (instructor_id = v_user_id or public.is_admin());

  if not found then
    raise exception 'Course not found or permission denied';
  end if;

  -- Generate unique slug for duplicated course
  v_new_slug := v_orig.slug || '-copy-' || lower(substr(md5(random()::text || clock_timestamp()::text), 1, 6));

  -- Insert duplicated course with draft status
  insert into public.courses (
    instructor_id,
    title,
    slug,
    description,
    thumbnail_url,
    category,
    level,
    duration,
    status,
    what_you_will_learn
  ) values (
    v_user_id,
    v_orig.title || ' (Copy)',
    v_new_slug,
    v_orig.description,
    v_orig.thumbnail_url,
    v_orig.category,
    v_orig.level,
    v_orig.duration,
    'draft',
    v_orig.what_you_will_learn
  ) returning id into v_new_id;

  -- Duplicate all lessons belonging to this course
  insert into public.lessons (
    course_id,
    title,
    description,
    video_url,
    content,
    order_index,
    module_title
  )
  select
    v_new_id,
    title,
    description,
    video_url,
    content,
    order_index,
    module_title
  from public.lessons
  where course_id = p_course_id;

  return v_new_id;
end;
$$;

grant execute on function public.duplicate_course(uuid) to authenticated;
