
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  PlayCircle,
  Play,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Star,
  MessageSquare,
  User,
  Heart,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import CourseReviewForm from "@/components/courses/CourseReviewForm";

export default async function CourseDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!supabaseConfigured()) notFound();

  const sb = await createClient();

  // 1. Fetch course details (supports both slug and UUID id)
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    );

  let courseQuery = sb.from("courses").select("*, profiles(full_name)");

  if (isUuid) {
    courseQuery = courseQuery.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    courseQuery = courseQuery.eq("slug", slug);
  }

  const { data: course } = await courseQuery.maybeSingle();

  if (!course) notFound();

  // 2. Fetch lessons outline
  const { data: outline } = await sb
    .from("lesson_outline")
    .select("*")
    .eq("course_id", course.id)
    .order("order_index");

  // 3. Auth user & enrollment status
  const { data: { user } } = {
    data: { user: (await getCurrentUser()).user },
  };

  const { data: enrolled } = user
    ? await sb
        .from("enrollments")
        .select("id")
        .eq("course_id", course.id)
        .eq("student_id", user.id)
        .maybeSingle()
    : { data: null };

  const { data: ip } = await sb
    .from("instructor_profiles")
    .select("headline")
    .eq("id", course.instructor_id)
    .maybeSingle();

  // 4. Fetch course reviews & rating
  const { data: reviews } = await sb
    .from("course_reviews")
    .select("id, rating, review_text, created_at, student_id, profiles(full_name)")
    .eq("course_id", course.id)
    .order("created_at", { ascending: false });

  const totalReviews = reviews?.length ?? 0;
  const avgRating = totalReviews
    ? Number(
        (
          reviews!.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews
        ).toFixed(1)
      )
    : 4.8;

  const existingReview = user
    ? reviews?.find((r) => r.student_id === user.id)
    : null;

  const teacher = course.profiles?.full_name ?? "Expert Instructor";
  const count = outline?.length ?? 12;

  // Group curriculum outline by module
  const modulesMap = new Map<string, typeof outline>();

  (outline ?? []).forEach((l) => {
    const mod = l.module_title?.trim() || "Course Lessons";
    const existing = modulesMap.get(mod) || [];
    existing.push(l);
    modulesMap.set(mod, existing);
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-[#0b1329] dark:text-slate-100 pb-20 transition-colors">
      {/* 1. Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <Link href="/courses" className="hover:text-blue-600 transition">
            Courses
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[260px] sm:max-w-md">
            {course.title}
          </span>
        </nav>
      </div>

      {/* 2. Top Hero Card */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Left: Video / Thumbnail */}
            <div className="lg:col-span-6">
              <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md">
                <Image
                  src={course.thumbnail_url ?? "/images/category-banners.jpeg"}
                  alt={course.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-blue-600 shadow-xl transition-transform duration-300 group-hover:scale-110">
                    <Play size={28} className="ml-1 fill-blue-600" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  Preview Course
                </div>
              </div>
            </div>

            {/* Right: Course Title & Quick Actions */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="w-fit rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
                {course.category ?? "Computer Science"}
              </span>

              <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {course.title}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {course.description ||
                  "Master this subject with comprehensive video lessons, practical assignments, and direct guidance from certified educators."}
              </p>

              {/* Meta stats row */}
              <div className="mt-5 flex items-center gap-6 text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600" />
                  <span>{count} Lessons</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star size={17} className="fill-amber-400 text-amber-400" />
                  <span>{avgRating}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    ({totalReviews || 12} reviews)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {enrolled ? (
                  <Link
                    href={`/dashboard/courses#c-${course.id}`}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <span>Continue Learning</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.slug}/enroll`}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight size={16} />
                  </Link>
                )}

                <button
                  type="button"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-blue-600 bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-xs transition hover:bg-blue-50"
                >
                  <Heart size={16} />
                  <span>Add to Wishlist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content & Sidebar Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200">
              <a
                href="#overview"
                className="border-b-2 border-blue-600 px-5 py-3 text-sm font-bold text-blue-600"
              >
                Overview
              </a>
              <a
                href="#curriculum"
                className="border-b-2 border-transparent px-5 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                Curriculum
              </a>
              <a
                href="#reviews"
                className="border-b-2 border-transparent px-5 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                Reviews
              </a>
              <a
                href="#instructor"
                className="border-b-2 border-transparent px-5 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600"
              >
                Instructor
              </a>
            </div>

            {/* About This Course */}
            <section
              id="overview"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                About This Course
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {course.description ||
                  "This course is designed for beginners and advanced learners who want to master real-world skills. You will learn through hands-on projects, high-definition video walkthroughs, and practical examples."}
              </p>

              {/* What You Will Learn */}
              {course.what_you_will_learn &&
                course.what_you_will_learn.length > 0 && (
                  <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-700">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                      What You Will Learn
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {course.what_you_will_learn.map(
                        (item: string, i: number) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                            <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">
                              {item}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </section>

            {/* Course Curriculum */}
            <section
              id="curriculum"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Course Curriculum
                </h2>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {outline?.length ?? 0} Lessons Published
                </span>
              </div>

              {outline && outline.length > 0 ? (
                <div className="space-y-4">
                  {Array.from(modulesMap.entries()).map(
                    ([moduleName, moduleLessons]) => (
                      <div
                        key={moduleName}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
                      >
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                          {moduleName} ({moduleLessons?.length ?? 0} lessons)
                        </h3>
                        <ol className="space-y-2">
                          {(moduleLessons ?? []).map((l, i) => (
                            <li
                              key={l.id}
                              className="flex items-center justify-between rounded-lg bg-white p-3 border border-slate-100 shadow-xs text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                  {i + 1}
                                </span>
                                <span className="font-semibold text-slate-800">
                                  {l.title}
                                </span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {l.duration_minutes
                                  ? `${l.duration_minutes} min`
                                  : "Video Lesson"}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  Curriculum lessons will be displayed once published by
                  instructor.
                </div>
              )}
            </section>

            {/* Student Reviews */}
            <section
              id="reviews"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Student Reviews
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Feedback from students enrolled in this course.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Star size={18} className="fill-amber-400 text-amber-400" />
                  <span className="text-lg font-black text-slate-900">
                    {avgRating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({totalReviews})
                  </span>
                </div>
              </div>

              {/* Review form if enrolled */}
              {enrolled && (
                <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <CourseReviewForm
                    courseId={course.id}
                    existingReview={existingReview}
                  />
                </div>
              )}

              {/* Reviews list */}
              {reviews && reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((r: any) => (
                    <div
                      key={r.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            <User size={14} />
                          </span>
                          <span className="text-sm font-bold text-slate-800">
                            {r.profiles?.full_name || "Verified Student"}
                          </span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                r.rating >= s
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      {r.review_text && (
                        <p className="mt-2 text-sm text-slate-600 pl-10">
                          {r.review_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No reviews yet. Be the first enrolled student to leave a
                  review!
                </p>
              )}
            </section>

            {/* Instructor Info */}
            <section
              id="instructor"
              className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Your Instructor
              </h2>
              <Link
                href={`/instructors/${course.instructor_id}`}
                prefetch={true}
                className="flex items-center gap-4 rounded-xl p-3 transition hover:bg-slate-50 border border-slate-100 dark:border-slate-700 dark:hover:bg-slate-700/50"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
                  {teacher.charAt(0).toUpperCase()}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {teacher}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {ip?.headline ?? "Verified Academic Instructor"}
                  </p>
                  <span className="mt-1 inline-block text-xs font-bold text-blue-600 dark:text-blue-400">
                    View profile and all courses →
                  </span>
                </div>
              </Link>
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
                Course Features
              </h3>
              <ul className="space-y-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>Lifetime Access</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>Verifiable Certificate</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>High Quality Video Lessons</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>Practice Exercises & Notes</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <span>Self-Paced Learning</span>
                </li>
              </ul>

              <div className="mt-8 border-t border-slate-100 pt-6">
                {enrolled ? (
                  <Link
                    href={`/dashboard/courses#c-${course.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                  >
                    <span>Go to Classroom</span>
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.slug}/enroll`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                  >
                    <span>Enroll Now (Free)</span>
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
