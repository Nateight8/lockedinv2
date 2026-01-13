import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth tokens in cookies
  const authToken = request.cookies.get("auth_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const isOnboarded = request.cookies.get("is_onboarded")?.value === "true";

  const isAuthenticated = !!(authToken || refreshToken);

  if (!isAuthenticated) {
    // If NOT authenticated, allow access to auth pages, but maybe protect other pages?
    // For now, let's just ensure they don't get stuck in a redirect
    return NextResponse.next();
  }

  // --- From here on, the user IS authenticated ---

  // 1. Handle Onboarding Redirect
  if (!isOnboarded && pathname !== "/onboard") {
    console.log("[Middleware] Redirecting unonboarded user to /onboard");
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  // 2. Handle Auth Pages Redirect (if already onboarded)
  if (
    isOnboarded &&
    (pathname.startsWith("/auth") || pathname === "/onboard")
  ) {
    console.log(
      "[Middleware] Redirecting onboarded user away from auth/onboard to /"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Handle /auth specifically for unonboarded (though handled by #1, being explicit helps)
  if (isAuthenticated && !isOnboarded && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
