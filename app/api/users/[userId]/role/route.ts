import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = params
    const body = await request.json()
    const { role } = body

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.backendAccessToken}`,
        },
        body: JSON.stringify({ role }),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { error: err.message ?? "Failed to update user role" },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
