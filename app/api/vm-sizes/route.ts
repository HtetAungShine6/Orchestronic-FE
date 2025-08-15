import { authOptions } from "@/lib/auth-options"
import { ApiError } from "@/types/error"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.backendAccessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No backend access token" },
        { status: 401 }
      )
    }

    // get query parameters from the request
    const url = new URL(request.url)
    const page = url.searchParams.get("page") || "1"
    const limit = url.searchParams.get("limit") || "10"
    const search = url.searchParams.get("search") || ""
    const numberOfCores = url.searchParams.get("maxCores") || ""
    const memoryInMB = url.searchParams.get("maxMemory") || ""

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/request/vm-sizes?page=${page}&limit=${limit}&search=${search}&maxCores=${numberOfCores}&maxMemory=${memoryInMB}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.backendAccessToken}`,
        },
      }
    )

    if (!res.ok) {
      const err = await res.json()
      throw new ApiError(
        err.statusCode ?? res.status,
        err.message ?? "Failed to fetch VM sizes",
        err.error ?? "Unknown error"
      )
    }

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("💥 Error in VM sizes API:", error)

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          error: error.message,
          statusCode: error.statusCode,
          details: error.error,
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
