import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken, AUTH_COOKIE_NAME } from "@/lib/jwt";

// Protected routes configuration
const protectedCustomerRoutes = ["/dashboard", "/checkout", "/orders"];
const protectedAdminRoutes = ["/admin"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const user = token ? await verifyAccessToken(token) : null;

  // 1. Admin route protection
  const isAdminRoute = protectedAdminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Customer protected routes
  const isCustomerRoute = protectedCustomerRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isCustomerRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent logged in users from viewing Auth pages
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && user) {
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Set response headers for extra security
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
