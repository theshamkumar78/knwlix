import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return res;

  const sb = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list: { name: string; value: string; options?: Parameters<typeof res.cookies.set>[2] }[]) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data: { session } } = await sb.auth.getSession();

  const p = req.nextUrl.pathname;
  if (!session && /^\/(dashboard|instructor|admin)/.test(p)) {
    const u = req.nextUrl.clone();
    u.pathname = "/login";
    u.searchParams.set("next", p);
    return NextResponse.redirect(u);
  }
  return res;
}

// Only run middleware on protected dashboard, instructor, and admin routes.
// Public routes (/courses, /about, /contact, /faq, /, etc.) load instantly without auth overhead.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/instructor/:path*",
    "/admin/:path*",
  ],
};
