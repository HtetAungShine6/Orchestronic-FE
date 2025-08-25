"use client"

import { requestFormSchema } from "@/components/requests/client-request-form"
import { fetcher } from "@/lib/fetcher"
import { Status } from "@/types/api"
import z from "zod"

export async function getRequests() {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
}

export async function getRequestsStatus(status: Status) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/request/status?status=${status as string}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function createRequest(data: z.infer<typeof requestFormSchema>) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export async function getRequestBySlug(slug: string) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/request/displayCode?displayCode=${slug}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
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

export async function changeRequestStatus(
  requestId: string,
  status: Status
): Promise<RequestStatusResponse> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/request/${requestId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  )
}

export async function updateRequestFeedback(
  requestId: string,
  feedback: string
) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/request/${requestId}/feedback`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedback }),
    }
  )
}
