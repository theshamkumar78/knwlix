
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { updateInstructorProfile } from "../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "mt-1 w-full rounded-2xl bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none ring-1 ring-slate-300 focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-white dark:placeholder-white/50 dark:ring-white/15 dark:focus:ring-white/50";

export default async function InstructorProfileEdit({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;

  const { sb, user, profile } = await requireRole(["instructor", "admin"]);

  const { data: ip } = await sb
    .from("instructor_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <GlassShell active="profile" variant="instructor">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              My profile
            </h1>

            <a
              href="/dashboard/security"
              className="text-xs font-semibold text-amber-600 underline dark:text-amber-300"
            >
              Change password
            </a>
          </div>

          <Link
            href={`/instructors/${user.id}`}
            className="rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-white/15 dark:bg-white/15 dark:text-white dark:hover:bg-white/25"
          >
            View public profile
          </Link>
        </header>

        <form action={updateInstructorProfile} className="glass space-y-5 p-6">
          {saved && (
            <p
              role="status"
              className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200"
            >
              Profile saved.
            </p>
          )}

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Full name
            <input
              name="full_name"
              defaultValue={profile.full_name ?? ""}
              required
              minLength={2}
              className={field}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Headline
            <input
              name="headline"
              defaultValue={ip?.headline ?? ""}
              placeholder="e.g. Full-stack developer and teacher"
              className={field}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            About me
            <textarea
              name="bio"
              rows={4}
              defaultValue={ip?.bio ?? ""}
              className={field}
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Experience
            <textarea
              name="experience"
              rows={3}
              defaultValue={ip?.experience ?? ""}
              placeholder="Years of teaching, companies, achievements"
              className={field}
            />
          </label>

          <p className="text-xs text-slate-500 dark:text-white/60">
            This information is public on your instructor page.
          </p>

          <button
            type="submit"
            className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
          >
            Save changes
          </button>
        </form>
      </div>
    </GlassShell>
  );
}
