import Link from "next/link";
import { GraduationCap, Mail, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

const explore = [
  ["All Courses", "/courses"],
  ["Popular Categories", "/#categories"],
  ["Instructors", "/instructors"],
  ["About Us", "/about"],
  ["FAQ & Support", "/faq"],
];

const portals = [
  ["Student Dashboard", "/dashboard"],
  ["Instructor Studio", "/instructor"],
  ["Admin Panel", "/admin"],
  ["Sign In", "/login"],
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#072346] dark:bg-[#040e1e] text-slate-300 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" prefetch={true} className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <GraduationCap size={20} />
              </span>

              <span className="text-2xl font-black tracking-tight text-white">
                Knowl<span className="text-blue-400">ix</span>
              </span>
            </Link>

            <p className="max-w-xs text-xs leading-relaxed text-slate-400">
              Learn new skills, explore modern technology, and build a better future with courses from real instructors.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="space-y-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Explore
            </p>

            <ul className="space-y-2 text-xs">
              {explore.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} prefetch={true} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Portals */}
          <nav aria-label="Portals" className="space-y-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Portals
            </p>

            <ul className="space-y-2 text-xs">
              {portals.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} prefetch={true} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="space-y-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Contact
            </p>

            <ul className="space-y-2.5 text-xs text-slate-400">
              {SITE.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0 text-blue-400" />
                  <a
                    href={`mailto:${SITE.email}`}
                    className="break-all transition hover:text-white"
                  >
                    {SITE.email}
                  </a>
                </li>
              )}

              {SITE.location && (
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-blue-400" />
                  <span>{SITE.location}</span>
                </li>
              )}

              <li>
                <Link
                  href="/contact"
                  prefetch={true}
                  className="font-semibold text-blue-300 transition hover:text-white"
                >
                  Send us a message →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Knowlix. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/faq" prefetch={true} className="transition hover:text-slate-300">
              FAQ
            </Link>

            <Link href="/contact" prefetch={true} className="transition hover:text-slate-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
