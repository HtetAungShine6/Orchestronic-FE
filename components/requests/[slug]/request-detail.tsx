"use client"
import { getRequestBySlug } from "@/app/api/requests/api"
import { ApiError } from "@/types/error"
import { useQuery } from "@tanstack/react-query"
import ResourceGroupCard from "./resource-group-card"
import OrganizationCard from "./organization-card"
import { Role } from "@/types/role"
import DescriptionCard from "./description-card"

export interface RequestDetail {
  id: string
  displayCode: string
  status: "Pending" | "Approved" | "Rejected"
  description: string
  ownerId: string
  repositoryId: string
  resourcesId: string
  createdAt: Date
  updatedAt: Date
  resources: {
    id: string
    name: string
    cloudProvider: string
    region: string
    resourceConfigId: string
    resourceConfig: {
      id: string
      vms: any[]
      dbs: any[]
      sts: any[]
    }
  }
  repository: {
    id: string
    name: string
    description: string | null
    resourcesId: string
    status: "Pending" | "Approved" | "Rejected"
  }
  owner: {
    id: string
    name: string
    email: string
    role: Role
  }
}

export default function RequestDetail({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery<RequestDetail>({
    queryKey: ["request", slug],
    queryFn: () => getRequestBySlug(slug),
  })

  if (isLoading) return <div>Loading...</div>
  if (error instanceof ApiError) return <div>{error.message}</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side - Resource details */}
      <div className="lg:col-span-2 space-y-6">
        <ResourceGroupCard data={data} />
      </div>

      {/* Right side - Organization info */}
      <div className="space-y-6">
        <OrganizationCard data={data} />
        <DescriptionCard data={data} />
      </div>
    </div>
  )
}
