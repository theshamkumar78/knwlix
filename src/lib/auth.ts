import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import type { Role } from "@/types";
export async function requireRole(roles: Role[]) {
  if (!supabaseConfigured()) redirect("/login");
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !roles.includes(profile.role)) redirect("/dashboard");
  return { sb, user, profile };
}
