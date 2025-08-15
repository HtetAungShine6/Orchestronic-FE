import { authOptions } from "@/lib/auth-options"
import { ApiError } from "@/types/error"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cloud/${slug}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.backendAccessToken}`,
        },
        body: JSON.stringify(body),
      }
    )

    console.log(res)

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        {
          statusCode: err.statusCode ?? res.status,
          message: err.message ?? "Failed to fetch request slug",
          error: err.error ?? "Unknown error",
        },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          statusCode: error.statusCode,
          message: error.message,
          error: error.error,
        },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/cloud/${slug}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.backendAccessToken}`,
        },
        body: JSON.stringify(body),
      }
    )

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json(
        {
          statusCode: err.statusCode ?? res.status,
          message: err.message ?? "Failed to fetch request slug",
          error: err.error ?? "Unknown error",
        },
        { status: err.statusCode ?? res.status }
      )
    }

    const result = await res.json()
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          statusCode: error.statusCode,
          message: error.message,
          error: error.error,
        },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
