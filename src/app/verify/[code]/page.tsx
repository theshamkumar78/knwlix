import Link from "next/link";
import { ShieldCheck, ShieldAlert, Award, Calendar, User, BookOpen, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).trim().toUpperCase();

  const sb = await createClient();
  const { data: results, error } = await sb.rpc("verify_certificate", {
    lookup_code: decodedCode,
  });

  const cert = results && results.length > 0 ? results[0] : null;

  return (
    <div className="ed-canvas min-h-[calc(100vh-4rem)] px-4 py-12 text-slate-900 dark:text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/60 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:border-blue-800 dark:text-blue-300">
            <Award size={14} /> Official Credential Verification
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl text-slate-900 dark:text-white">
            Knowlix Certificate Verification
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Verify the authenticity of digital certificates issued by Knowlix.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="mt-8">
          {cert ? (
            <div className="space-y-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
              {/* Valid Status Banner */}
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">
                    Valid Certificate Verified
                  </h2>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300/90">
                    This credential is authentic and was officially recorded in the Knowlix registry.
                  </p>
                </div>
              </div>

              {/* Credential Details */}
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/60 p-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Certificate Code
                  </span>
                  <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {cert.code}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <User size={16} /> Recipient
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {cert.student_name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <BookOpen size={16} /> Course Title
                  </div>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {cert.course_title}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <GraduationCap size={16} /> Instructor
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cert.instructor_name}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Calendar size={16} /> Issue Date
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(cert.issued_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Explanatory footer */}
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Issued upon 100% completion of course lessons and verified with cryptographic integrity.
              </p>

              <div className="text-center">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                >
                  Explore Knowlix courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/90">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900/60">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Certificate Not Found
                </h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  No certificate matching code{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    &quot;{decodedCode}&quot;
                  </span>{" "}
                  exists in our records.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-900/60 p-5 text-left text-xs text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Verification tips:</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Check for typos in the certificate code (e.g. KNX-XXXXXXXX).</li>
                  <li>Ensure the entire code including the &quot;KNX-&quot; prefix is entered.</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                >
                  Back to home
                </Link>
                <Link
                  href="/courses"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition"
                >
                  Browse courses
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
