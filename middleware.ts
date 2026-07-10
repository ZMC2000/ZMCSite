import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

type AdminMiddlewareRequest = NextRequest & {
  auth: {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  } | null;
};

export default auth((request: AdminMiddlewareRequest) => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth?.user;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (isAdminRoute && !isLoginRoute && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isLoggedIn) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
