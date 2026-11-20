import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import MyCoursesClient, { EnrolledCourseBlock } from "./MyCoursesClient";

export default async function MyCourses() {
  const { sb, user } = await requireRole(["student", "instructor", "admin"]);

  // Fetch student enrollments
  const { data: enr } = await sb
    .from("enrollments")
    .select("course_id, courses(title)")
    .eq("student_id", user.id);

  // Fetch lesson progress for this student
  const { data: prog } = await sb
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("student_id", user.id);

  const doneIds = (prog ?? []).filter((p) => p.completed).map((p) => p.lesson_id);

  // Fetch all lessons for enrolled courses
  const blocks: EnrolledCourseBlock[] = await Promise.all(
    (enr ?? []).map(async (e: any) => {
      const { data: lessons } = await sb
        .from("lessons")
        .select("id, title, content, video_url, module_title, order_index")
        .eq("course_id", e.course_id)
        .order("order_index");

      return {
        courseId: e.course_id,
        courseTitle: e.courses?.title || "Untitled Course",
        lessons: lessons ?? [],
        doneIds: (lessons ?? [])
          .filter((l: any) => doneIds.includes(l.id))
          .map((l: any) => l.id),
      };
    })
  );

  return (
    <GlassShell active="courses" variant="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your progress, watch lessons, and earn verifiable certificates.
          </p>
        </div>

        <MyCoursesClient blocks={blocks} />
      </div>
    </GlassShell>
  );
}
