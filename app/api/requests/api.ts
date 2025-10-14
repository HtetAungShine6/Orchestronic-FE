"use client"

import { awsRequestFormSchema } from "@/components/requests/form-schema/aws"
import { azureRequestFormSchema } from "@/components/requests/form-schema/azure"
import { fetcher } from "@/lib/fetcher"
import { Status } from "@/types/api"
import { AzureRetailPriceResponse } from "@/types/request"
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

export async function createRequestAzure(
  data: z.infer<typeof azureRequestFormSchema>
) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/request/azure`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export async function createRequestAws(
  data: z.infer<typeof awsRequestFormSchema>
) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/request/aws`, {
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

export async function deleteRequest(requestId: string) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/infrastructure/${requestId}/infra-destroy`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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

export async function getPriceOfVM(
  vmSize: string,
  region: string
): Promise<AzureRetailPriceResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/resource/vm-price?vmSize=${vmSize}&region=${region}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch price: ${response.statusText}`)
  }

  return response.json()
}
