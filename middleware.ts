import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // <--- Спеціальна функція для middleware

const protectedRoutes = ["/profile", "/orders", "/orders/create"];
const publicRoutes = ["/login", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // getToken автоматично зчитує та розшифровує куку session-token
  // Важливо: переконайтесь, що NEXTAUTH_SECRET є в .env
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // 1. Якщо юзер лізе на захищену сторінку без токена -> на логін
  if (isProtectedRoute && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // 2. Якщо юзер вже залогінений і лізе на логін -> на профіль
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/orders/:path*", "/login", "/sign-up"],
};
