import { ApiError } from "@/types/error"
import {
  DatabasePolicyDto,
  StoragePolicyDto,
  VMPolicyDto,
} from "@/types/request"

export interface updatePolicyVM {
  name: string
  numberOfCores: number
  memoryInMB: number
  cloudProvider: string
}

export interface updatePolicyDB {
  maxStorage: number
  cloudProvider: string
}

export interface updatePolicyST {
  maxStorage: number
  cloudProvider: string
}

export async function updatePolicyVM({
  name,
  numberOfCores,
  memoryInMB,
  cloudProvider,
}: updatePolicyVM) {
  const res = await fetch(`/api/policy/virtual_machine`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      numberOfCores,
      memoryInMB,
      cloudProvider,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
export async function updatePolicyDB({
  maxStorage,
  cloudProvider,
}: updatePolicyDB) {
  const res = await fetch(`/api/policy/database`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage, cloudProvider }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
export async function updatePolicyST({
  maxStorage,
  cloudProvider,
}: updatePolicyST) {
  const res = await fetch(`/api/policy/storage`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage, cloudProvider }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function createPolicy() {
  const res = await fetch(`/api/policy/virtual_machine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function getPolicyVM(cloudProvider: string): Promise<VMPolicyDto> {
  const res = await fetch(
    `/api/policy/virtual_machine?cloudProvider=${cloudProvider}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function getPolicyDB(
  cloudProvider: string
): Promise<DatabasePolicyDto> {
  const res = await fetch(
    `/api/policy/database?cloudProvider=${cloudProvider}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}

export async function getPolicyST(
  cloudProvider: string
): Promise<StoragePolicyDto> {
  const res = await fetch(
    `/api/policy/storage?cloudProvider=${cloudProvider}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new ApiError(
      err.statusCode ?? res.status,
      err.message ?? "Failed to update request feedback",
      err.error ?? "Unknown error"
    )
  }

  return res.json()
}
