
import { requireRole } from "@/lib/auth";
import { createCourse } from "../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-500/20";

const label =
  "block text-sm font-medium text-slate-800 dark:text-slate-200";

export default async function Create() {
  await requireRole(["instructor", "admin"]);

  return (
    <GlassShell active="create" variant="instructor">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Create course
        </h1>

        <form
          action={createCourse}
          className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800/90"
        >
          <label className={label}>
            Title
            <input
              name="title"
              required
              minLength={3}
              placeholder="e.g. Python Programming"
              className={`mt-1 ${field}`}
            />
          </label>

          <label className={label}>
            Description
            <textarea
              name="description"
              rows={4}
              placeholder="What will students learn?"
              className={`mt-1 ${field}`}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className={label}>
              Category
              <input
                name="category"
                placeholder="e.g. Web Development"
                className={`mt-1 ${field}`}
              />
            </label>

            <label className={label}>
              Level
              <select
                name="level"
                defaultValue="beginner"
                className={field}
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="advanced">advanced</option>
              </select>
            </label>
          </div>

          <label className={label}>
            Duration
            <input
              name="duration"
              placeholder="e.g. 6 hours"
              className={`mt-1 ${field}`}
            />
          </label>

          <label className={label}>
            Thumbnail (jpg/png/webp, max 2MB)
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              className={`${field} mt-1 file:mr-4 file:rounded-full file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-200 dark:hover:file:bg-slate-600`}
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-full border border-slate-300 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              Save draft
            </button>

            <button
              type="submit"
              name="submit"
              value="1"
              className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Submit for review
            </button>
          </div>
        </form>
      </div>
    </GlassShell>
  );
}
