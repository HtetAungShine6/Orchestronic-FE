import { fetcher } from "@/lib/fetcher"
import {
  AwsVmSizeDto,
  DatabaseAwsPolicyDto,
  StorageAwsPolicyDto,
} from "@/types/request"

export async function createPolicyAws() {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/aws/policy/virtual_machine`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  )
}

export async function getPolicyVMAws() {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/aws/policy/virtual_machine`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function getPolicyDBAws(): Promise<DatabaseAwsPolicyDto> {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/aws/policy/database`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function getPolicySTAws(): Promise<StorageAwsPolicyDto> {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/aws/policy/storage`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function updatePolicyVMAws({
  name,
  numberOfCores,
  memoryInMB,
}: updatePolicyVMAws) {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/aws/policy/virtual_machine`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        numberOfCores,
        memoryInMB,
      }),
    }
  )
}

export async function fetchAwsVmSizes(
  value: string,
  page: number,
  limit: number,
  usePolicyFilter: boolean
): Promise<AwsVmSizeDto[]> {
  let maxCores = ""
  let maxMemory = ""

  if (usePolicyFilter) {
    const policyVM = await getPolicyVMAws()
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

  const response = await fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/cloud-providers/aws?${params.toString()}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  return response.data
}

export async function updatePolicyDBAws({ maxStorage }: updatePolicyDBAws) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/aws/policy/database`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage }),
  })
}

export async function updatePolicySTAws({ maxStorage }: updatePolicySTAws) {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/aws/policy/storage`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxStorage }),
  })
}

interface updatePolicyDBAws {
  maxStorage: number
}

interface updatePolicySTAws {
  maxStorage: number
}

interface updatePolicyVMAws {
  name: string
  numberOfCores: number
  memoryInMB: number
}
