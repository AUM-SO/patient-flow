import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/staff/login") {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/staff/:path*"],
};
