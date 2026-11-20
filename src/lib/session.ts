import { cache } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

// Ek page request mein ye sirf EK baar chalta hai, chahe 10 jagah se bulao
export const getCurrentUser = cache(async () => {
  if (!supabaseConfigured()) return { sb: null, user: null, profile: null as any };
  const sb = await createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { sb, user: null, profile: null as any };
  const { data: profile } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { sb, user, profile: profile as any };
});