
import Link from "next/link";
import {
  Home,
  BookOpen,
  Compass,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  GraduationCap,
  Users,
} from "lucide-react";
import { signOut } from "@/app/auth-actions";

const menus = {
  student: [
    { key: "home", href: "/dashboard", label: "Dashboard", icon: Home },
    { key: "courses", href: "/dashboard/courses", label: "My courses", icon: BookOpen },
    { key: "browse", href: "/courses", label: "Browse courses", icon: Compass },
    { key: "profile", href: "/dashboard/profile", label: "Profile", icon: User },
  ],

  instructor: [
    { key: "home", href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
    { key: "courses", href: "/instructor/courses", label: "My courses", icon: BookOpen },
    { key: "create", href: "/instructor/courses/create", label: "Create course", icon: PlusCircle },
    { key: "browse", href: "/courses", label: "Browse courses", icon: Compass },
    { key: "profile", href: "/instructor/profile", label: "Profile", icon: User },
  ],

  admin: [
    { key: "home", href: "/admin", label: "Admin panel", icon: ShieldCheck },
    { key: "instructors", href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
    { key: "students", href: "/admin/students", label: "Students", icon: Users },
    { key: "courses", href: "/admin/courses", label: "All courses", icon: BookOpen },
    { key: "browse", href: "/courses", label: "Browse courses", icon: Compass },
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
  const items = menus[variant];

  return (
    <div className="aurora min-h-[calc(100vh-4rem)] px-4 py-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 md:flex-row md:items-start">
        <nav
          aria-label="Dashboard"
          className="glass flex shrink-0 items-center justify-center gap-2 rounded-full p-2.5 md:sticky md:top-24 md:flex-col md:p-3"
        >
          {items.map(({ key, href, label, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              aria-label={label}
              title={label}
              className={`grid h-11 w-11 place-items-center rounded-full transition ${
                active === key
                  ? "bg-gradient-to-br from-teal-400 to-violet text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />
            </Link>
          ))}

          <form action={signOut}>
            <button
              aria-label="Logout"
              title="Logout"
              className="grid h-11 w-11 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={20} />
            </button>
          </form>
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
