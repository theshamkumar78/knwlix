import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const { sb } = await requireRole(["admin"]);

  // 1. Fetch all enrollments with student and course details
  const { data: enrollments, error } = await sb
    .from("enrollments")
    .select("id, enrolled_at, student_id, course_id, profiles(full_name), courses(title)")
    .order("enrolled_at", { ascending: false });

  if (error) {
    return new NextResponse(`Database error: ${error.message}`, { status: 500 });
  }

  // 2. Fetch lessons and progress to compute completion stats
  const { data: lessons } = await sb
    .from("lessons")
    .select("id, course_id");

  const { data: progress } = await sb
    .from("lesson_progress")
    .select("student_id, course_id, completed")
    .eq("completed", true);

  // 3. Build CSV content
  const headers = [
    "Enrollment ID",
    "Student Name",
    "Student ID",
    "Course Title",
    "Course ID",
    "Enrolled At",
    "Completed Lessons",
    "Total Lessons",
    "Progress %",
    "Completed",
  ];

  const rows = (enrollments ?? []).map((e: any) => {
    const studentName = (e.profiles as any)?.full_name || "Student";
    const courseTitle = (e.courses as any)?.title || "Course";
    const total = (lessons ?? []).filter((l: any) => l.course_id === e.course_id).length;
    const done = (progress ?? []).filter(
      (p: any) => p.student_id === e.student_id && p.course_id === e.course_id
    ).length;
    const pct = total ? Math.round((done * 100) / total) : 0;
    const isCompleted = total > 0 && done >= total ? "Yes" : "No";

    return [
      `"${e.id}"`,
      `"${studentName.replace(/"/g, '""')}"`,
      `"${e.student_id}"`,
      `"${courseTitle.replace(/"/g, '""')}"`,
      `"${e.course_id}"`,
      `"${new Date(e.enrolled_at).toISOString()}"`,
      done,
      total,
      `${pct}%`,
      isCompleted,
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\r\n");

  const filename = `knowlix-enrollments-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
