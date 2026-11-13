import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let role: "student" | "instructor" | "admin" | null = null;
  let name: string | null = null;

  if (supabaseConfigured()) {
    try {
      const sb = await createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (user) {
        const { data: p } = await sb.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
        role = p?.role ?? "student";
        name = p?.full_name ?? user.email ?? null;
      }
    } catch {}
  }

  return <NavbarClient role={role} name={name} />;
}