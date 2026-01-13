import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isOnboarded = request.cookies.get("is_onboarded")?.value === "true";

  const isAuthenticated = !!(authToken || refreshToken);

  // 1. If authenticated and trying to access auth pages, redirect to home
  if (isAuthenticated && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If authenticated but not onboarded, redirect to /onboard
  // Avoid redirect loop if already on /onboard
  if (isAuthenticated && !isOnboarded && pathname !== "/onboard") {
    // Only redirect if it's a page request (not api/assets/etc)
    // Next.js middleware already respects the matcher, but we should be careful
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
