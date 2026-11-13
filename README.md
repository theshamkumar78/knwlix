# Knowlix

Online learning platform: Next.js (App Router), TypeScript, Tailwind, Supabase (Auth, Postgres, Storage, RLS), GSAP, Framer Motion, Lucide.

## Status (read first)
This is a **first working scaffold**, not the finished product. It was written without network access, so
`npm install`, `npm run build`, the dev server and every Supabase feature were **NOT run or tested**.
Expect to fix small type/build errors on first run.

Built: schema + RLS + storage policies (SQL), auth forms, route protection, home, course list/search/filter,
course detail + enroll (duplicate-safe), student dashboard + lesson completion, instructor course create,
admin approvals + role promotion, animated hero (GSAP) and navbar (Motion).
Not built yet: course edit/delete UI, lesson editor, file upload UI, instructors page content, profile page,
skeleton loaders, scroll animations/counters, categories/testimonials sections, `/instructor/students`.

## Run locally
Requires Node 20+.
1. `npm install`
2. `cp .env.example .env.local` and fill in your Supabase URL and anon key (never the service-role key)
3. `npm run dev` then open http://localhost:3000

## Supabase setup
1. Create a project. Run the two files in `supabase/migrations/` in order.
2. Auth > URL config: add `http://localhost:3000` and your Vercel URL as redirect URLs.
3. Make an admin: see `supabase/README.md`. New signups are always `student`; an admin promotes instructors.

## RLS summary
- profiles: readable by all; users update only their own row; a trigger blocks role changes unless admin.
- courses: public sees `published`; instructors see/edit own; cannot self-publish (insert/update limited to draft/pending, editing a published course returns it to pending); delete own drafts only; admin full access.
- lessons: full content only to enrolled students (published courses), the owner, or admin. Public sees titles via `lesson_outline`.
- enrollments: insert for self on published courses only; unique(student, course); read own, owner, admin.
- lesson_progress: own rows only; must be enrolled; instructors can read their course's progress.
- storage: `thumbnails`, `avatars` public-read; `materials` private; writes only inside `<user-id>/` folder.

## Team workflow
Branch per feature (`feat/course-editor`, `feat/lesson-editor`, `feat/uploads`), open PRs into `main`, one reviewer each.

## Deploy (Vercel)
Import the repo, add the two env vars, deploy. Not deployed yet.
