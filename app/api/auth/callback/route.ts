import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const frontendUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin

  const response = NextResponse.redirect(new URL("/dashboard", frontendUrl))

  // Set access_token cookie on the frontend domain
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour - match your backend token expiry
  })

  // Set refresh_token cookie if provided
  if (refreshToken) {
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  }

  return response
}
