import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#072346] text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* 1. Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                <GraduationCap size={20} />
              </span>
              <span className="text-2xl font-black tracking-tight text-white">
                Knowl<span className="text-blue-400">ix</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Learn Without Limits. Grow Without Boundaries. University-grade learning platform for students and educators worldwide.
            </p>
          </div>

          {/* 2. Explore Links */}
          <div className="text-sm space-y-3">
            <p className="font-bold text-white uppercase text-xs tracking-wider">Explore</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-white transition">
                  Popular Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  FAQ & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Academic Portals */}
          <div className="text-sm space-y-3">
            <p className="font-bold text-white uppercase text-xs tracking-wider">Portals</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/instructor" className="hover:text-white transition">
                  Instructor Studio
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div className="text-sm space-y-3">
            <p className="font-bold text-white uppercase text-xs tracking-wider">Contact</p>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-blue-400 shrink-0" />
                <a href="mailto:info@knowlix.com" className="hover:text-white transition">
                  info@knowlix.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-blue-400 shrink-0" />
                <span>+92 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-400 shrink-0" />
                <span>123 Learning St, Education City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Knowlix Academy. Built for University Competition.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
