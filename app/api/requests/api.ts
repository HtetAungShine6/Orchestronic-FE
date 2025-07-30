import { requestFormSchema } from "@/components/requests/client-request-form"
import { authOptions } from "@/lib/auth-options"
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
      err.message ?? "Failed to fetch requests"
    )
  }

  return res.json()
}

export default async function createRequest(
  data: z.infer<typeof requestFormSchema>
) {
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
      err.message ?? "Fail to create request"
    )
  }

  return res.json()
}
