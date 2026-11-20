import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Award, CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import PrintButton from "@/components/PrintButton";

export default async function Certificate({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const { sb, user, profile } = await requireRole([
    "student",
    "instructor",
    "admin",
  ]);

  // 1. Fetch course details
  const { data: course } = await sb
    .from("courses")
    .select("id, title, profiles(full_name)")
    .eq("id", courseId)
    .maybeSingle();

  if (!course) notFound();

  // 2. Issue or retrieve persistent certificate via SECURITY DEFINER function
  const { data: certRes, error: certErr } = await sb.rpc("issue_certificate", {
    p_course_id: courseId,
  });

  if (certErr || !certRes?.success) {
    // If not completed 100%, redirect student back to course
    redirect(`/dashboard/courses#c-${courseId}`);
  }

  const certCode = String(certRes.code);
  const issuedDate = new Date(certRes.issued_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const studentName = profile.full_name || user.email || "Knowlix Student";
  const instructorName =
    (course.profiles as any)?.full_name || "Knowlix Instructor";

  return (
    <div className="min-h-screen bg-slate-900/95 px-4 py-8 text-slate-800">
      <style>{`
        @media print {
          header, footer, nav, .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
          .cert-outer {
            box-shadow: none !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>

      {/* Top action bar (hidden during print) */}
      <div className="no-print mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <Link
          href={`/dashboard/courses#c-${courseId}`}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <ArrowLeft size={16} /> Back to course
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/verify/${certCode}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            <ExternalLink size={14} /> Public verification page
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Certificate Frame (A4 Landscape aspect ratio) */}
      <div className="cert-outer mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl md:p-10">
        <div className="relative rounded-2xl border-4 border-amber-600/40 p-4">
          <div className="rounded-xl border border-amber-500/20 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 px-8 py-10 text-center md:px-14 md:py-12">
            
            {/* Header: Logo & Badge */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 text-amber-600">
                <Award className="h-10 w-10 text-amber-500" />
                <span className="text-2xl font-black tracking-widest text-slate-900">
                  KNOWLIX
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Learn · Explore · Achieve
              </p>
            </div>

            {/* Title */}
            <div className="mt-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Certificate of Completion
              </h1>
              <p className="mt-2 text-xs font-medium tracking-wider text-amber-700/80 uppercase">
                Official Credential of Achievement
              </p>
            </div>

            {/* Recipient */}
            <div className="mt-8">
              <p className="text-sm italic text-slate-500">
                This certifies that
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {studentName}
              </h2>
              <div className="mx-auto mt-2 h-0.5 w-64 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>

            {/* Course Information */}
            <div className="mt-6">
              <p className="text-sm text-slate-500">
                has successfully completed all lessons and requirements for
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-blue-900 sm:text-3xl">
                {course.title}
              </h3>
            </div>

            {/* Signatures & Verification Details */}
            <div className="mt-12 grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
              {/* Issue Date */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-bold text-slate-900">{issuedDate}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Issue Date
                </p>
              </div>

              {/* Instructor */}
              <div className="flex flex-col items-center justify-center">
                <p className="font-serif text-lg font-bold italic text-slate-800">
                  {instructorName}
                </p>
                <div className="mt-1 h-px w-36 bg-slate-300" />
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Authorized Instructor
                </p>
              </div>

              {/* Certificate Code & Verification */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 size={14} />
                  <span className="font-mono text-xs font-bold tracking-wider text-slate-800">
                    {certCode}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Credential ID
                </p>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="mt-8 pt-4 text-center">
              <p className="text-[11px] text-slate-400">
                Verify this credential online at{" "}
                <span className="font-mono font-medium text-slate-600">
                  /verify/{certCode}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="no-print mt-4 text-center text-xs text-white/50">
        Tip: Press “Download / Print certificate” and choose “Save as PDF” in landscape mode.
      </p>
    </div>
  );
}
