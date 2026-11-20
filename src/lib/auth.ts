import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/session";
import type { Role } from "@/types";

export async function requireRole(roles: Role[]) {
  if (!supabaseConfigured()) redirect("/login");
  const { sb, user, profile } = await getCurrentUser();
  if (!sb || !user) redirect("/login");
  if (!profile || !roles.includes(profile.role)) redirect("/dashboard");
  return { sb, user, profile };
}