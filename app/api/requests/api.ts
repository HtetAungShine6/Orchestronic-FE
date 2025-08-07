import { requestFormSchema } from "@/components/requests/client-request-form"
import { authOptions } from "@/lib/auth-options"
import { Status } from "@/types/api"
import { ApiError } from "@/types/error"
import { getServerSession } from "next-auth"
import z from "zod"

export async function getRequests() {
  const session = await getServerSession(authOptions)

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
    headers: {
      Authorization: `Bearer ${session?.user?.backendAccessToken}`,
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to fetch requests",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function createRequest(data: z.infer<typeof requestFormSchema>) {
  const res = await fetch(`/api/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Fail to create request",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function getRequestBySlug(slug: string) {
  const res = await fetch(`/api/requests/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const err = await res.json()
    console.error("Error fetching request by slug:", err)
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to fetch request by slug",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export interface RequestStatusResponse {
  id: string
  displayCode: string
  status: Status
  description: string
  ownerId: string
  repositoryId: string
  resourcesId: string
  createdAt: string
  updatedAt: string
}

export async function approveRequest(
  requestId: string
): Promise<RequestStatusResponse> {
  const res = await fetch(`/api/requests/${requestId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "Approved" }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to approve request",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
