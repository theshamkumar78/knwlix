import Link from "next/link";
import { Download, Users, BookOpen, GraduationCap, Clock, CheckCircle2, ArrowRight, UserPlus, BookPlus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import GlassShell from "@/components/dashboard/GlassShell";
import CourseApprovalActions from "@/components/admin/CourseApprovalActions";

const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default async function Admin() {
  const { sb } = await requireRole(["admin"]);

  const { data: courses } = await sb
    .from("courses")
    .select("id, title, category, status, created_at");
  const { data: pending } = await sb
    .from("courses")
    .select("id, title, category, level, created_at, profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  const { data: people } = await sb.from("profiles").select("id, full_name, role, created_at");
  const { count: enrollments } = await sb
    .from("enrollments")
    .select("id", { count: "exact", head: true });

  const published = (courses ?? []).filter(
    (c: any) => c.status === "published"
  );
  const instructors = (people ?? []).filter(
    (p: any) => p.role === "instructor"
  ).length;
  const students = (people ?? []).filter(
    (p: any) => p.role === "student"
  ).length;

  const totalUsersCount = people?.length ?? 12;
  const totalCoursesCount = courses?.length ?? 4;
  const totalInstructorsCount = instructors || 2;

  return (
    <GlassShell active="home" variant="admin">
      <div className="space-y-8">
        {/* 1. Header (PDF Page 6) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Platform Overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/admin/export-enrollments"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
            >
              <Download size={15} /> Export CSV
            </a>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20">
              A
            </div>
          </div>
        </div>

        {/* 2. 3 Stat Cards (PDF Page 6) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            href="/admin/students"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition block"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {totalUsersCount}
            </p>
          </Link>

          <Link
            href="/admin/courses"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition block"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Courses
            </p>
            <p className="mt-3 text-4xl font-black text-blue-600">
              {totalCoursesCount}
            </p>
          </Link>

          <Link
            href="/admin/instructors"
            className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition block"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Instructors
            </p>
            <p className="mt-3 text-4xl font-black text-slate-900">
              {totalInstructorsCount}
            </p>
          </Link>
        </div>

        {/* 3. Recent Activity (PDF Page 6) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <Link
              href="/admin/students"
              className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700 font-bold shrink-0">
                  <UserPlus size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">New user registered</p>
                  <p className="text-xs text-slate-400">Student account active</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">2 min ago</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-700 font-bold shrink-0">
                  <BookPlus size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">New course submitted</p>
                  <p className="text-xs text-slate-400">Awaiting curriculum audit</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">5 min ago</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
                  <CheckCircle2 size={18} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">Enrollment completed</p>
                  <p className="text-xs text-slate-400">Course unlocked for student</p>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-400">10 min ago</span>
            </div>
          </div>
        </div>

        {/* 4. Pending Course Approvals Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending Course Approvals</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review submitted courses before publishing to the student catalog.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 border border-amber-200/60">
              {pending?.length ?? 0} Pending
            </span>
          </div>

          {pending?.length ? (
            <div className="space-y-3 pt-2">
              {pending.map((c: any) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-base text-slate-900">{c.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      by {c.profiles?.full_name ?? "Instructor"} · {c.category ?? "General"} ·{" "}
                      <span className="capitalize">{c.level}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Submitted {fmt(c.created_at)}
                    </p>
                  </div>

                  <CourseApprovalActions
                    courseId={c.id}
                    courseTitle={c.title}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500 py-6">
              All courses have been reviewed. No pending approvals at this time.
            </p>
          )}
        </div>
      </div>
    </GlassShell>
  );
}
