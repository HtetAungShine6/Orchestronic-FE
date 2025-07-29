import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.backendAccessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { error: err.message ?? "Failed to create request" },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
      headers: {
        Authorization: `Bearer ${session.user.backendAccessToken}`,
      },
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        { error: err.message ?? "Failed to fetch requests" },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
