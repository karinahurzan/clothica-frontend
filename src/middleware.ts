import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❗ НЕ ЧІПАЄМО API ТА NEXT
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute =
    pathname.startsWith("/profile") || pathname.startsWith("/orders");

  const isPublicRoute =
    pathname.startsWith("/login") || pathname.startsWith("/sign-up");

  if (isProtectedRoute && !token?.accessToken) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublicRoute && token?.accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
