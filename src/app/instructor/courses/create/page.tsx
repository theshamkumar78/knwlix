import { requireRole } from "@/lib/auth";
import { createCourse } from "../../actions";
import GlassShell from "@/components/dashboard/GlassShell";

const field =
  "w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-white/50";

export default async function Create() {
  await requireRole(["instructor", "admin"]);
  return (
    <GlassShell active="create" variant="instructor">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-3xl font-extrabold">Create course</h1>
        <form action={createCourse} className="glass space-y-5 p-6">
          <label className="block text-sm">Title
            <input name="title" required minLength={3} className={`mt-1 ${field}`} />
          </label>
          <label className="block text-sm">Description
            <textarea name="description" rows={4} className={`mt-1 ${field}`} />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">Category
              <input name="category" placeholder="e.g. Web Development" className={`mt-1 ${field}`} />
            </label>
            <label className="block text-sm">Level
              <select name="level" className={`mt-1 ${field} [&>option]:text-slate-900`}>
                <option>beginner</option>
                <option>intermediate</option>
                <option>advanced</option>
              </select>
            </label>
          </div>
          <label className="block text-sm">Duration
            <input name="duration" placeholder="e.g. 6 hours" className={`mt-1 ${field}`} />
          </label>
          <label className="block text-sm">Thumbnail (jpg/png/webp, max 2MB)
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              className={`mt-1 ${field} file:mr-4 file:rounded-full file:border-0 file:bg-white/15 file:px-4 file:py-2 file:text-white`}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-white/15 px-6 py-3 text-sm font-semibold transition hover:bg-white/25">Save draft</button>
            <button name="submit" value="1" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5">
              Submit for review
            </button>
          </div>
        </form>
      </div>
    </GlassShell>
  );
}