import { notFound } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { updateCourse, deleteCourse, addLesson, deleteLesson } from "../../actions";

export default async function ManageCourse({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb, user } = await requireRole(["instructor", "admin"]);
  const { data: course } = await sb.from("courses").select("*").eq("id", id).eq("instructor_id", user.id).maybeSingle();
  if (!course) notFound();
  const { data: lessons } = await sb.from("lessons").select("id, title, order_index").eq("course_id", id).order("order_index");
  const i = "w-full rounded-lg border px-3 py-2";

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12">
      <Link href="/instructor/courses" className="text-sm text-brand">← Back</Link>

      <section>
        <h1 className="text-3xl font-bold">Edit course</h1>
        <p className="text-sm text-slate-500">Status: {course.status}</p>
        {course.thumbnail_url && <img src={course.thumbnail_url} alt="" className="mt-3 h-32 rounded-lg object-cover" />}
        <form action={updateCourse.bind(null, course.id)} className="mt-4 space-y-4">
          <label className="block text-sm">Title<input name="title" defaultValue={course.title} required minLength={3} className={i} /></label>
          <label className="block text-sm">Description<textarea name="description" defaultValue={course.description ?? ""} rows={4} className={i} /></label>
          <label className="block text-sm">Category<input name="category" defaultValue={course.category ?? ""} className={i} /></label>
          <label className="block text-sm">Level
            <select name="level" defaultValue={course.level} className={i}>
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>
          </label>
          <label className="block text-sm">Duration<input name="duration" defaultValue={course.duration ?? ""} className={i} /></label>
          <label className="block text-sm">Nayi thumbnail (optional)<input type="file" name="thumbnail" accept="image/*" className={i} /></label>
          <div className="flex gap-3">
            <button className="rounded-lg border px-4 py-2">Save draft</button>
            <button name="submit" value="1" className="rounded-lg bg-brand px-4 py-2 text-white">Submit for review</button>
          </div>
        </form>
        {course.status === "draft" && (
          <form action={deleteCourse.bind(null, course.id)} className="mt-3">
            <button className="text-sm text-red-600">Delete this course</button>
          </form>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold">Lessons</h2>
        <ul className="mt-3 space-y-2">
          {lessons?.length ? lessons.map((l) => (
            <li key={l.id} className="flex items-center justify-between rounded-lg border p-3">
              <span>{l.order_index}. {l.title}</span>
              <form action={deleteLesson.bind(null, l.id, course.id)}>
                <button className="text-sm text-red-600">Delete</button>
              </form>
            </li>
          )) : <li className="text-slate-500">Abhi koi lesson nahi.</li>}
        </ul>

        <form action={addLesson.bind(null, course.id)} className="mt-6 space-y-3 rounded-lg border p-4">
          <h3 className="font-semibold">Naya lesson add karo</h3>
          <input name="title" placeholder="Lesson title" required className={i} />
          <input name="video_url" placeholder="Video link (YouTube etc., optional)" className={i} />
          <textarea name="content" rows={3} placeholder="Lesson ka text (optional)" className={i} />
          <button className="rounded-lg bg-brand px-4 py-2 text-white">Add lesson</button>
        </form>
      </section>
    </div>
  );
}