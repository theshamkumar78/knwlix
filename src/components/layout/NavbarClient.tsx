"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { signOut } from "@/app/auth-actions";

type Role = "student" | "instructor" | "admin" | null;

const menus: Record<string, string[][]> = {
  guest: [["Home", "/"], ["Courses", "/courses"], ["Instructors", "/instructors"], ["About", "/about"]],
  student: [["Home", "/"], ["Courses", "/courses"], ["My Courses", "/dashboard/courses"], ["Progress", "/dashboard/progress"]],
  instructor: [["Home", "/"], ["Dashboard", "/instructor"], ["My Courses", "/instructor/courses"], ["Create Course", "/instructor/courses/create"]],
  admin: [["Home", "/"], ["Admin Panel", "/admin"], ["Courses", "/courses"]],
};

export default function NavbarClient({ role, name }: { role: Role; name: string | null }) {
  const [open, setOpen] = useState(false);
  const links = menus[role ?? "guest"];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4" aria-label="Main">
        <Link href="/" aria-label="Knowlix home">
          <Image src="/logo/knowlix-wordmark.png" alt="Knowlix" width={120} height={21} priority />
        </Link>

        <ul className="hidden gap-8 md:flex">
          {links.map(([l, h]) => (
            <li key={h}><Link href={h} className="text-sm text-slate-300 hover:text-white">{l}</Link></li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {role ? (
            <>
              <span className="text-sm text-slate-300">{name}</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize">{role}</span>
              <form action={signOut}>
                <button className="rounded-full px-4 py-2 text-sm hover:bg-white/10">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2 text-sm hover:bg-white/10">Login</Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href="/signup" className="block rounded-full bg-brand px-4 py-2 text-sm font-medium">Sign Up</Link>
              </motion.div>
            </>
          )}
        </div>

        <button className="md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden">
            <ul className="flex flex-col gap-1 px-4 pb-4">
              {links.map(([l, h]) => (
                <li key={h}><Link href={h} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 hover:bg-white/10">{l}</Link></li>
              ))}
              {role ? (
                <li>
                  <form action={signOut}>
                    <button className="block w-full rounded-lg px-3 py-3 text-left hover:bg-white/10">Logout</button>
                  </form>
                </li>
              ) : (
                <>
                  <li><Link href="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 hover:bg-white/10">Login</Link></li>
                  <li><Link href="/signup" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 hover:bg-white/10">Sign Up</Link></li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}