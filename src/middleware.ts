import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return res;

  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  // cookie se session padhta hai (network tabhi jata hai jab token purana ho kar refresh chahiye)
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

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };