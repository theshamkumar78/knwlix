
"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Compass,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  GraduationCap,
  Users,
  Award,
  Mail,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "@/app/auth-actions";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface MenuItem {
  key: string;
  href: string;
  label: string;
  icon: any;
}

const menus: Record<string, MenuItem[]> = {
  student: [
    { key: "home", href: "/dashboard", label: "Dashboard", icon: Home },
    { key: "courses", href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
    { key: "certificates", href: "/dashboard/courses", label: "Certificates", icon: Award },
    { key: "profile", href: "/dashboard/profile", label: "Profile", icon: User },
    { key: "browse", href: "/courses", label: "Browse Courses", icon: Compass },
  ],

  instructor: [
    { key: "home", href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
    { key: "courses", href: "/instructor/courses", label: "My Courses", icon: BookOpen },
    { key: "create", href: "/instructor/courses/create", label: "Add Course", icon: PlusCircle },
    { key: "students", href: "/instructor/students", label: "Students", icon: Users },
    { key: "profile", href: "/instructor/profile", label: "Profile", icon: User },
    { key: "browse", href: "/courses", label: "Browse Courses", icon: Compass },
  ],

  admin: [
    { key: "home", href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { key: "users", href: "/admin/students", label: "Users", icon: Users },
    { key: "courses", href: "/admin/courses", label: "Courses", icon: BookOpen },
    { key: "instructors", href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
    { key: "messages", href: "/admin/messages", label: "Messages", icon: Mail },
    { key: "browse", href: "/courses", label: "Browse Catalog", icon: Compass },
  ],
};

export default function GlassShell({
  active,
  variant = "student",
  children,
}: {
  active: string;
  variant?: "student" | "instructor" | "admin";
  children: React.ReactNode;
}) {
  const items = menus[variant] || menus.student;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen theme-page flex flex-col md:flex-row transition-colors duration-200">

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-[#072346] px-4 md:hidden">
        <Link href="/" prefetch={true} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-sm">
            <GraduationCap size={18} />
          </span>

          <span className="text-xl font-black text-white">
            Knowl<span className="text-blue-400">ix</span>
          </span>

          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-300">
            {variant}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle className="h-8 w-8 text-xs" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Dashboard Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 hover:bg-white/10"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-slate-800 bg-[#072346] px-4 py-4 md:hidden"
          >
            <nav className="space-y-1">
              {items.map(({ key, href, label, icon: Icon }) => {
                const isActive = active === key;

                return (
                  <Link
                    key={key}
                    href={href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-slate-400"}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-white/10 pt-3">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-800 bg-[#072346] p-5 text-white shadow-xl dark:bg-[#051429] md:sticky md:top-0 md:flex md:h-screen">

        <div>
          <Link
            href="/"
            prefetch={true}
            className="mb-6 flex items-center gap-3 rounded-xl px-3 py-4 transition hover:opacity-90"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <GraduationCap size={24} />
            </span>

            <span className="text-2xl font-black tracking-tight text-white">
              Knowl<span className="text-blue-400">ix</span>
            </span>
          </Link>

          <nav className="space-y-1.5" aria-label="Dashboard Menu">
            {items.map(({ key, href, label, icon: Icon }) => {
              const isActive = active === key;

              return (
                <Link
                  key={key}
                  href={href}
                  prefetch={true}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-white" : "text-slate-400"}
                  />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme Toggle + Logout */}
        <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between px-3.5 py-1 text-xs text-slate-400">
            <span>Theme Mode</span>

            <ThemeToggle className="h-8 w-8 border-slate-700 bg-slate-800 text-slate-300" />
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-rose-500/20 hover:text-rose-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
