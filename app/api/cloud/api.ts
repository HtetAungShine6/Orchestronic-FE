import { awsFormSchema } from "@/app/(dashboard)/settings/components/aws-drawer"
import { ApiError } from "@/types/error"
import z from "zod"

export async function updateCloudConfig(
  values: z.infer<typeof awsFormSchema>,
  id: string
) {
  const res = await fetch(`/api/cloud/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update config",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function createCloudConfig(values: z.infer<typeof awsFormSchema>) {
  const res = await fetch(`/api/cloud/secret`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...values }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to create config",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export interface CloudProviderSecret {
  id: string
  clientId: string
  clientSecret: string
  subscriptionId: string
  tenantId?: string
  userId: string
  cloudProvider: "AZURE" | "AWS"
}

export async function getCloudConfig(
  cloudProvider: "AZURE" | "AWS"
): Promise<CloudProviderSecret> {
  const res = await fetch(`/api/cloud?cloudProvider=${cloudProvider}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update config",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
