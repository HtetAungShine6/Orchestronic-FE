import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.nextauth?.token

  // Redirect logged-in users visiting "/" to "/dashboard"
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If accessing /dashboard and not logged in, redirect to /login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Otherwise, allow access
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/get-help/:path*",
    "/monitoring/:path*",
    "/policies/:path*",
    "/repositories/:path*",
    "/requests/:path*",
    "/resources/:path*",
    "/settings/:path*",
    "/team/:path*",
  ],
}
