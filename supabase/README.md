# Supabase
Run `migrations/0001_schema.sql` then `0002_rls.sql` in the Supabase SQL editor (or `supabase db push`).
To create the first admin: sign up normally, then in the SQL editor run
`update public.profiles set role = 'admin' where id = '<your-user-id>';` (the role-protection trigger allows this only from the SQL editor/service role).
