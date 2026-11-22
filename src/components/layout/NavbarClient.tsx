"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap,
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { signOut } from "@/app/auth-actions";
import ThemeToggle from "@/components/ui/ThemeToggle";

type Role = "student" | "instructor" | "admin" | null;

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Categories", href: "/#categories" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export default function NavbarClient({
  role,
  name,
}: {
  role: Role;
  name: string | null;
}) {
  const [open, setOpen] = useState(false);

  const getDashboardHref = () => {
    if (role === "admin") return "/admin";
    if (role === "instructor") return "/instructor";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        {/* Logo */}
        <Link
          href="/"
          prefetch={true}
          aria-label="Knowlix home"
          className="flex items-center gap-2.5 rounded-xl transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25">
            <GraduationCap size={24} />
          </span>
          <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Knowl<span className="text-blue-600 dark:text-blue-400">ix</span>
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                prefetch={true}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Action / Auth Buttons & Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          <Link
            href="/courses"
            prefetch={true}
            aria-label="Search courses"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
          >
            <Search size={18} />
          </Link>

          {role ? (
            <div className="flex items-center gap-3">
              <Link
                href={getDashboardHref()}
                prefetch={true}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 shadow-xs transition hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-700"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {(name ?? "U").charAt(0).toUpperCase()}
                </span>
                <span>{name ?? "Account"}</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                  {role}
                </span>
              </Link>

              <form action={signOut}>
                <button
                  type="submit"
                  title="Sign out"
                  className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                prefetch={true}
                className="inline-flex min-h-[42px] items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/signup"
                  prefetch={true}
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mobile Right Controls: Theme Toggle + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-md shadow-xl md:hidden dark:border-slate-800 dark:bg-slate-900/95"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {role ? (
                <li className="mt-2 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Link
                    href={getDashboardHref()}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  >
                    <LayoutDashboard size={16} />
                    <span>Go to {role.toUpperCase()} Dashboard</span>
                  </Link>
                  <form action={signOut}>
                    <button className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-4 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30">
                      <LogOut size={16} />
                      <span>Sign out ({name})</span>
                    </button>
                  </form>
                </li>
              ) : (
                <li className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Link
                    href="/login"
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20"
                  >
                    Sign Up
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
