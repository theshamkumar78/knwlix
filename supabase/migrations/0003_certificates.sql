-- Migration 0003: Certificates table and verification functions

-- 1. Create certificates table
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  code text not null unique,
  issued_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create index if not exists idx_certificates_student on public.certificates(student_id);
create index if not exists idx_certificates_course on public.certificates(course_id);
create index if not exists idx_certificates_code on public.certificates(code);

-- 2. Enable Row Level Security (RLS)
alter table public.certificates enable row level security;

-- 3. RLS Policies
drop policy if exists cert_read_own on public.certificates;
create policy cert_read_own on public.certificates
  for select using (student_id = auth.uid());

drop policy if exists cert_read_admin on public.certificates;
create policy cert_read_admin on public.certificates
  for select using (public.is_admin());

-- 4. Secure issuance function (100% completion check enforced in database)
create or replace function public.issue_certificate(p_course_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_existing record;
  v_total_lessons int;
  v_completed_lessons int;
  v_code text;
  v_new_cert record;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- If certificate already issued, return existing record
  select id, code, issued_at into v_existing
  from public.certificates
  where student_id = v_user_id and course_id = p_course_id;

  if found then
    return jsonb_build_object(
      'success', true,
      'already_issued', true,
      'id', v_existing.id,
      'code', v_existing.code,
      'issued_at', v_existing.issued_at
    );
  end if;

  -- Count total lessons in course
  select count(*) into v_total_lessons
  from public.lessons
  where course_id = p_course_id;

  if v_total_lessons = 0 then
    raise exception 'Course has no lessons';
  end if;

  -- Count completed lessons by student
  select count(*) into v_completed_lessons
  from public.lesson_progress
  where student_id = v_user_id
    and course_id = p_course_id
    and completed = true;

  -- Verify 100% completion
  if v_completed_lessons < v_total_lessons then
    raise exception 'Course is not completed (100%% completion required)';
  end if;

  -- Generate unique KNX-XXXXXXXX code (8 chars alphanumeric)
  loop
    v_code := 'KNX-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
    exit when not exists (select 1 from public.certificates where code = v_code);
  end loop;

  insert into public.certificates (student_id, course_id, code, issued_at)
  values (v_user_id, p_course_id, v_code, now())
  returning id, code, issued_at into v_new_cert;

  return jsonb_build_object(
    'success', true,
    'already_issued', false,
    'id', v_new_cert.id,
    'code', v_new_cert.code,
    'issued_at', v_new_cert.issued_at
  );
end;
$$;

grant execute on function public.issue_certificate(uuid) to authenticated;

-- 5. Public verification function (safe, only returns non-private details)
create or replace function public.verify_certificate(lookup_code text)
returns table (
  code text,
  issued_at timestamptz,
  student_name text,
  course_title text,
  instructor_name text
)
language sql
security definer
set search_path = public
as $$
  select
    c.code,
    c.issued_at,
    coalesce(p_student.full_name, 'Knowlix Student') as student_name,
    crs.title as course_title,
    coalesce(p_inst.full_name, 'Knowlix Instructor') as instructor_name
  from public.certificates c
  join public.courses crs on crs.id = c.course_id
  join public.profiles p_student on p_student.id = c.student_id
  left join public.profiles p_inst on p_inst.id = crs.instructor_id
  where upper(c.code) = upper(trim(lookup_code))
  limit 1;
$$;

grant execute on function public.verify_certificate(text) to anon, authenticated;
