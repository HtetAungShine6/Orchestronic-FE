"use client"
import { fetcher } from "@/lib/fetcher"
import {
  DatabasePolicyDto,
  StoragePolicyDto,
  VMPolicyDto,
  VmSizeDto,
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
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/policy/virtual_machine`, {
    method: "PATCH",
    credentials: "include",
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
}

export async function updatePolicyDB({
  maxStorage,
  cloudProvider,
}: updatePolicyDB) {
  return fetcher(`/api/policy/database`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage, cloudProvider }),
  })
}

export async function updatePolicyST({
  maxStorage,
  cloudProvider,
}: updatePolicyST) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/policy/storage`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage, cloudProvider }),
  })
}

export async function createPolicy() {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/policy/virtual_machine`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
}

export async function getPolicyVM(cloudProvider: string): Promise<VMPolicyDto> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/policy/virtual_machine?cloudProvider=${cloudProvider}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function getPolicyDB(
  cloudProvider: string
): Promise<DatabasePolicyDto> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/policy/database?cloudProvider=${cloudProvider}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function getPolicyST(
  cloudProvider: string
): Promise<StoragePolicyDto> {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/policy/storage?cloudProvider=${cloudProvider}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function getVmSizes(params: URLSearchParams) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/request/vm-sizes?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function fetchVmSizes(
  value: string,
  page: number,
  limit: number,
  usePolicyFilter: boolean
): Promise<VmSizeDto[]> {
  let maxCores = ""
  let maxMemory = ""

  if (usePolicyFilter) {
    const policyVM = await getPolicyVM("AZURE")
    maxCores = policyVM.numberOfCores.toString()
    maxMemory = policyVM.memoryInMB.toString()
  }

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: value,
  })

  if (maxCores) params.append("maxCores", maxCores)
  if (maxMemory) params.append("maxMemory", maxMemory)

  const response = await getVmSizes(params)

  return response.data
}
