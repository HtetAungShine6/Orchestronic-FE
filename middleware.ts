import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Role } from "./types/role"

export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.nextauth?.token
  const token = req.nextauth?.token
  const role = token?.role

  // Redirect logged-in users visiting "/" to "/dashboard"
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If accessing /dashboard and not logged in, redirect to /login
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  for (const [route, allowedRoles] of Object.entries(roleAccessRules)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(role as Role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
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

const roleAccessRules: Record<string, Role[]> = {
  "/settings": [Role.Admin], // only admin allowed
  "/team": [Role.Admin, Role.IT], // dev not allowed
  "/repositories": [Role.Admin, Role.Developer, Role.IT],
  "/dashboard": [Role.Admin, Role.Developer, Role.IT],
  "/policies": [Role.Admin, Role.Developer, Role.IT],
  "/resources": [Role.Admin, Role.Developer, Role.IT],
  "/requests": [Role.Admin, Role.Developer, Role.IT],
  "/monitoring": [Role.Admin, Role.Developer],
  "/get-help": [Role.Admin, Role.Developer, Role.IT],
}
