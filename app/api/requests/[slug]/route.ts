import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/request/displayCode?displayCode=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.backendAccessToken}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { error: err.message ?? "Failed to fetch request slug" },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching request slug:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
