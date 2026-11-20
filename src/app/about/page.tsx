import Link from "next/link";
import { Users, GraduationCap, ShieldCheck, ArrowRight, Laptop, Award, BookOpen } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Expert Instructors",
      description: "Learn from vetted academic educators and top industry professionals.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      icon: GraduationCap,
      title: "Flexible Learning",
      description: "Learn at your own pace anytime, anywhere with lifetime access to all modules.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      icon: ShieldCheck,
      title: "Lifetime Access",
      description: "Keep complete lifetime access to curriculum updates, code assets, and notes.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
      {/* 1. Hero Card matching PDF Page 8 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-[#eef5ff] via-[#f4f8ff] to-[#e8f1fd] p-8 sm:p-12 lg:p-16 shadow-sm">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7">
              <span className="rounded-full bg-blue-100 px-3.5 py-1 text-xs font-bold text-blue-700">
                About Knowlix
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                About Knowlix <br />
                <span className="text-blue-600">Empowering learners worldwide</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Knowlix is a modern online learning platform dedicated to providing high-quality education, expert-led courses, and flexible learning opportunities for everyone.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <span>Contact Us</span>
                </Link>
              </div>
            </div>

            {/* Right Laptop Illustration Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl border border-white/80 bg-white/70 p-5 shadow-xl shadow-blue-500/10 backdrop-blur-md">
                <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-900 p-6 flex flex-col items-center justify-center text-center shadow-inner">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                    <GraduationCap size={36} />
                  </div>
                  <p className="mt-3 text-base font-black tracking-tight text-white">
                    Knowl<span className="text-blue-400">ix</span>
                  </p>
                  <p className="text-[11px] text-blue-200">
                    University Grade Learning Architecture
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3 Value Cards matching PDF Page 8 */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-md transition text-center sm:text-left"
              >
                <div className={`grid h-14 w-14 place-items-center rounded-2xl border ${v.color}`}>
                  <Icon size={26} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {v.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
