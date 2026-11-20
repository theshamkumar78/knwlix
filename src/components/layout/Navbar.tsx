import { getCurrentUser } from "@/lib/session";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let role: "student" | "instructor" | "admin" | null = null;
  let name: string | null = null;
  try {
    const { user, profile } = await getCurrentUser();
    if (user) {
      role = profile?.role ?? "student";
      name = profile?.full_name ?? user.email ?? null;
    }
  } catch {}
  return <NavbarClient role={role} name={name} />;
}