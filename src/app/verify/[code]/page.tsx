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
    <div className="aurora min-h-[calc(100vh-4rem)] px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
            <Award size={14} /> Official Credential Verification
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
            Knowlix Certificate Verification
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Verify the authenticity of digital certificates issued by Knowlix.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="mt-8">
          {cert ? (
            <div className="glass space-y-6 overflow-hidden rounded-3xl p-8">
              {/* Valid Status Banner */}
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/15 p-4 text-emerald-200 ring-1 ring-emerald-500/30">
                <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-400" />
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Valid Certificate Verified
                  </h2>
                  <p className="text-xs text-emerald-300/90">
                    This credential is authentic and was officially recorded in the Knowlix registry.
                  </p>
                </div>
              </div>

              {/* Credential Details */}
              <div className="space-y-4 rounded-2xl bg-white/5 p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                    Certificate Code
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {cert.code}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <User size={16} /> Recipient
                  </div>
                  <span className="font-bold text-white">
                    {cert.student_name}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <BookOpen size={16} /> Course Title
                  </div>
                  <span className="font-bold text-teal-300">
                    {cert.course_title}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <GraduationCap size={16} /> Instructor
                  </div>
                  <span className="font-semibold text-white/90">
                    {cert.instructor_name}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Calendar size={16} /> Issue Date
                  </div>
                  <span className="font-semibold text-white/90">
                    {new Date(cert.issued_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Explanatory footer */}
              <p className="text-center text-xs text-white/60">
                Issued upon 100% completion of course lessons and verified with cryptographic integrity.
              </p>

              <div className="text-center">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950 transition hover:-translate-y-0.5"
                >
                  Explore Knowlix courses
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass space-y-6 rounded-3xl p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Certificate Not Found
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  No certificate matching code{" "}
                  <span className="font-mono font-bold text-amber-300">
                    &quot;{decodedCode}&quot;
                  </span>{" "}
                  exists in our records.
                </p>
              </div>

              <div className="rounded-2xl bg-white/5 p-5 text-left text-xs text-white/70">
                <p className="font-semibold text-white">Verification tips:</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Check for typos in the certificate code (e.g. KNX-XXXXXXXX).</li>
                  <li>Ensure the entire code including the &quot;KNX-&quot; prefix is entered.</li>
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  Back to home
                </Link>
                <Link
                  href="/courses"
                  className="rounded-full bg-amber-400 px-5 py-2.5 text-xs font-bold text-amber-950 transition hover:-translate-y-0.5"
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
