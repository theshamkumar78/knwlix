-- Knowlix schema
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student','instructor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text,
  thumbnail_url text,
  category text,
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced')),
  duration text,
  status text not null default 'draft' check (status in ('draft','pending','published','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.courses (instructor_id);
create index on public.courses (status, category);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_url text,
  content text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.lessons (course_id, order_index);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);
create index on public.enrollments (course_id);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);
create index on public.lesson_progress (course_id);

-- updated_at trigger
create function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger t_profiles before update on public.profiles for each row execute function public.touch_updated_at();
create trigger t_courses before update on public.courses for each row execute function public.touch_updated_at();
create trigger t_lessons before update on public.lessons for each row execute function public.touch_updated_at();
create trigger t_progress before update on public.lesson_progress for each row execute function public.touch_updated_at();

-- New auth user -> profile. Role is ALWAYS student; promotion is done by an admin.
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Public outline of published courses (titles only; no video/content)
create view public.lesson_outline as
  select l.id, l.course_id, l.title, l.order_index
  from public.lessons l join public.courses c on c.id = l.course_id
  where c.status = 'published';
grant select on public.lesson_outline to anon, authenticated;
