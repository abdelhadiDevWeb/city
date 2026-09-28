import { NextResponse, type NextRequest } from "next/server";

// Optimistic server-side check: without the session hint cookie set by the backend at login,
// the dashboard HTML is never sent. The token itself is verified by the backend on every API
// call, and by the dashboard layout before it renders anything.
const AUTH_HINT_COOKIES = ["city.auth", "__Host-city.auth"];

export function proxy(request: NextRequest) {
  const hasSession = AUTH_HINT_COOKIES.some((name) => request.cookies.has(name));
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
