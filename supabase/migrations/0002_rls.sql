-- Helper functions (security definer avoids recursive RLS lookups)
create function public.is_admin() returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create function public.owns_course(cid uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from courses where id = cid and instructor_id = auth.uid()) $$;

create function public.is_enrolled(cid uuid) returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from enrollments where course_id = cid and student_id = auth.uid()) $$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- PROFILES: any signed-in user can read profiles (needed to show instructor names); only owner updates own row.
create policy profiles_read on public.profiles for select using (true);
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_update on public.profiles for update using (public.is_admin());
-- Block role escalation: only an admin may change role.
create function public.protect_role() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change roles';
  end if;
  return new;
end $$;
create trigger t_protect_role before update on public.profiles for each row execute function public.protect_role();

-- COURSES
create policy courses_read_published on public.courses for select using (status = 'published');
create policy courses_read_own on public.courses for select using (instructor_id = auth.uid());
create policy courses_admin_all on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy courses_insert_own on public.courses for insert to authenticated
  with check (instructor_id = auth.uid() and status in ('draft','pending')
    and exists (select 1 from profiles where id = auth.uid() and role in ('instructor','admin')));
create policy courses_update_own on public.courses for update using (instructor_id = auth.uid())
  with check (instructor_id = auth.uid() and status in ('draft','pending'));
create policy courses_delete_own_draft on public.courses for delete using (instructor_id = auth.uid() and status = 'draft');
-- Instructors can submit for review but cannot self-publish; editing a published course sends it back to review.
create function public.course_status_guard() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.is_admin() then return new; end if;
  if old.status = 'published' then new.status := 'pending'; end if;
  return new;
end $$;
create trigger t_course_guard before update on public.courses for each row execute function public.course_status_guard();

-- LESSONS (full content): enrolled students of published courses, owner, admin.
create policy lessons_read on public.lessons for select using (
  public.owns_course(course_id) or public.is_admin()
  or (public.is_enrolled(course_id) and exists (select 1 from courses c where c.id = course_id and c.status = 'published')));
create policy lessons_write_owner on public.lessons for all using (public.owns_course(course_id)) with check (public.owns_course(course_id));
create policy lessons_admin on public.lessons for all using (public.is_admin()) with check (public.is_admin());

-- ENROLLMENTS
create policy enroll_insert_self on public.enrollments for insert to authenticated
  with check (student_id = auth.uid() and exists (select 1 from courses c where c.id = course_id and c.status = 'published'));
create policy enroll_read on public.enrollments for select using (student_id = auth.uid() or public.owns_course(course_id) or public.is_admin());
create policy enroll_delete_self on public.enrollments for delete using (student_id = auth.uid());

-- LESSON PROGRESS
create policy progress_read on public.lesson_progress for select using (student_id = auth.uid() or public.owns_course(course_id) or public.is_admin());
create policy progress_insert on public.lesson_progress for insert to authenticated
  with check (student_id = auth.uid() and public.is_enrolled(course_id)
    and exists (select 1 from lessons l where l.id = lesson_id and l.course_id = lesson_progress.course_id));
create policy progress_update on public.lesson_progress for update using (student_id = auth.uid()) with check (student_id = auth.uid());

-- STORAGE
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('thumbnails','thumbnails',true,2097152,array['image/jpeg','image/png','image/webp']),
  ('avatars','avatars',true,1048576,array['image/jpeg','image/png','image/webp']),
  ('materials','materials',false,20971520,array['application/pdf','image/png','image/jpeg'])
on conflict (id) do nothing;
-- Files live under <user-id>/...; users write only into their own folder.
create policy storage_own_write on storage.objects for insert to authenticated
  with check (bucket_id in ('thumbnails','avatars','materials') and (storage.foldername(name))[1] = auth.uid()::text);
create policy storage_own_update on storage.objects for update to authenticated
  using (bucket_id in ('thumbnails','avatars','materials') and (storage.foldername(name))[1] = auth.uid()::text);
create policy storage_own_delete on storage.objects for delete to authenticated
  using (bucket_id in ('thumbnails','avatars','materials') and (storage.foldername(name))[1] = auth.uid()::text);
create policy storage_public_read on storage.objects for select using (bucket_id in ('thumbnails','avatars'));
create policy storage_materials_read on storage.objects for select to authenticated
  using (bucket_id = 'materials' and (storage.foldername(name))[1] = auth.uid()::text);
