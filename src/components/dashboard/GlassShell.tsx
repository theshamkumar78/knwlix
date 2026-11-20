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
  Award,
  Settings,
  TrendingUp,
  FolderTree,
  DollarSign,
  FileText,
} from "lucide-react";
import { signOut } from "@/app/auth-actions";

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
    { key: "progress", href: "/dashboard#progress", label: "Progress", icon: TrendingUp },
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

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 flex flex-col md:flex-row">
      {/* Deep Navy Royal Sidebar matching PDF Pages 4, 5, 6 */}
      <aside className="w-full md:w-64 shrink-0 bg-[#072346] text-white flex flex-col justify-between p-5 border-r border-slate-800 shadow-xl md:sticky md:top-0 md:h-screen">
        <div>
          {/* Knowlix White Cap Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-4 rounded-xl hover:opacity-90 transition mb-6"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <GraduationCap size={24} />
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              Knowl<span className="text-blue-400">ix</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Dashboard Menu">
            {items.map(({ key, href, label, icon: Icon }) => {
              const isActive = active === key;
              return (
                <Link
                  key={key}
                  href={href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Row */}
        <div className="pt-6 border-t border-white/10 mt-6">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-rose-500/20 hover:text-rose-300 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
